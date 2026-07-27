"""Abrechnung pro Partei + Rabattcode-Validierung.

Kapselt die Preis-/Freischalt-Logik, damit der Router schlank bleibt:
  • Jede zahlungspflichtige Partei zahlt ihren eigenen Anteil (siehe app/pricing.py).
  • Der Fall wird erst freigeschaltet (mediation.is_paid = True), wenn ALLE
    zahlungspflichtigen Parteien bezahlt haben.

ZWEI STUFEN: reservieren -> einziehen
─────────────────────────────────────
Weil der Fall erst mit der letzten Zusage startet, würde eine sofortige
Abbuchung bedeuten, dass das Geld der ersten Partei bei uns liegt, obwohl die
Mediation vielleicht nie zustande kommt. Deshalb:

  participant.authorized = True  ->  Betrag ist bei PayPal RESERVIERT
  participant.paid       = True  ->  Betrag wurde tatsächlich EINGEZOGEN

``settle_and_unlock()`` zieht alle Reservierungen ein, sobald die letzte Partei
zugesagt hat, und schaltet den Fall frei. Scheitert der Einzug (Reservierung
abgelaufen), wird die betroffene Partei zurückgesetzt und muss erneut zahlen -
der Fall bleibt so lange zu.
"""
from __future__ import annotations

import logging
from datetime import datetime, timezone

from fastapi import HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app import pricing
from app.models.discount_code import DiscountCode
from app.models.mediation import Mediation
from app.models.mediation_addon import MediationAddon
from app.models.mediation_participant import MediationParticipant
from app.models.organization import Organization
from app.models.user import User
from app.paypal import (
    AuthorizationExpiredError,
    PayPalError,
    capture_authorization,
    void_authorization,
)

logger = logging.getLogger(__name__)


def is_org_case(mediation: Mediation) -> bool:
    """Ob der Fall zu einem Firmenkunden gehört (Business-Track). Firmenfälle
    werden über das aktive Firmen-Abo freigeschaltet, nicht über Parteizahlungen."""
    return getattr(mediation, "organization_id", None) is not None


def org_subscription_active(db: Session, mediation: Mediation) -> bool:
    """True, wenn der Fall zu einem Firmenkunden mit aktivem Abo gehört."""
    if not is_org_case(mediation):
        return False
    org = (
        db.query(Organization)
        .filter(Organization.id == mediation.organization_id)
        .first()
    )
    return bool(org and org.is_active)


# Rollen, die auch bei noch NICHT bezahltem Fall auf die Inhalte zugreifen
# dürfen: der (fallbezogene) Mediator zur Vorbereitung und globale Admins für
# Support. Zahlungspflichtige Parteien (owner/other_party) sowie Beobachter
# werden bis zur Bezahlung (mediation.is_paid) konsequent geblockt.
_UNLOCK_EXEMPT_ROLES = {"mediator", "admin"}


def ensure_unlocked(
    mediation: Mediation,
    participant: MediationParticipant,
    user: User | None = None,
    db: Session | None = None,
) -> None:
    """Erzwingt die Paywall: wirft 402, wenn der Fall noch nicht bezahlt ist.

    Diese Prüfung MUSS an jedem Endpunkt sitzen, der bezahlte Mediations-Inhalte
    liefert oder verändert (Schritte, Blöcke, Notizen, KI-Läufe, Vertrag,
    Termine, Feedback, …). Ohne sie lässt sich die Paywall trivial umgehen,
    indem die Content-APIs direkt – unter Umgehung des Frontends – aufgerufen
    werden. Ausgenommen sind nur Mediator (fallbezogen) und globale Admins.
    """
    if mediation.is_paid:
        return
    if db is not None and org_subscription_active(db, mediation):
        return
    role = (participant.role or "").lower()
    if role in _UNLOCK_EXEMPT_ROLES:
        return
    if user is not None and (user.role or "").lower() == "admin":
        return
    raise HTTPException(
        status_code=402,
        detail="Zahlung erforderlich, bevor auf die Inhalte der Mediation zugegriffen werden kann.",
    )


# Nur diese Rollen sind zahlungspflichtige Parteien. Mediator/Beobachter zahlen
# nicht und zählen weder bei der Anteilsaufteilung (split) noch bei der
# Freischaltbedingung (alle bezahlt) mit.
PAYING_ROLES = {"owner", "other_party"}


def is_paying_party(participant: MediationParticipant) -> bool:
    return (participant.role or "").lower() in PAYING_ROLES


def _participant_count(db: Session, mediation_id: int) -> int:
    """Anzahl zahlungspflichtiger Parteien (ohne Mediator/Beobachter)."""
    parts = (
        db.query(MediationParticipant)
        .filter(MediationParticipant.mediation_id == mediation_id)
        .all()
    )
    return max(sum(1 for p in parts if is_paying_party(p)), 1)


def is_owner(participant: MediationParticipant) -> bool:
    return (participant.role or "").lower() == "owner"


def participant_owes(mediation: Mediation, participant: MediationParticipant) -> bool:
    """Ob diese konkrete Partei zahlungspflichtig ist: nur echte Parteien
    (owner/other_party) und je nach Abrechnungsmodell (einmalig = nur Owner).
    Firmenfälle haben KEINE zahlungspflichtigen Parteien – sie laufen über das
    Firmen-Abo."""
    if is_org_case(mediation):
        return False
    if not is_paying_party(participant):
        return False
    return pricing.participant_owes(mediation.mediation_type, is_owner=is_owner(participant))


def participant_base_due(db: Session, mediation: Mediation, participant: MediationParticipant) -> float:
    """Fälliger Grundbetrag dieser Partei (vor Rabatt), aus der Preis-Matrix."""
    return pricing.participant_due(
        mediation.mediation_type,
        mediation.package,
        participant_count=_participant_count(db, mediation.id),
        is_owner=is_owner(participant),
    )


def participant_addons(db: Session, mediation: Mediation, participant: MediationParticipant) -> list[MediationAddon]:
    """Von dieser Partei gewählte Add-ons (Einstiegs-Tarif, siehe pricing.ADDONS)."""
    return (
        db.query(MediationAddon)
        .filter(
            MediationAddon.mediation_id == mediation.id,
            MediationAddon.participant_id == participant.id,
        )
        .all()
    )


def participant_addons_total(db: Session, mediation: Mediation, participant: MediationParticipant) -> float:
    """Summe der von dieser Partei gewählten Add-ons (EUR, Preis-Schnappschuss)."""
    return round(sum(float(a.price_eur or 0.0) for a in participant_addons(db, mediation, participant)), 2)


def set_participant_addons(
    db: Session,
    mediation: Mediation,
    participant: MediationParticipant,
    keys: list[str],
) -> list[MediationAddon]:
    """Ersetzt die Add-on-Auswahl dieser Partei durch ``keys`` (validiert gegen
    den Katalog). Nur vor der Zahlung erlaubt – danach ist die Auswahl Teil des
    bezahlten Betrags und damit fix."""
    if participant.paid:
        raise HTTPException(status_code=400, detail="Dein Anteil ist bereits bezahlt – Add-ons können nicht mehr geändert werden.")
    # Auch die Reservierung lautet schon auf einen festen Betrag.
    if participant.authorized:
        raise HTTPException(status_code=400, detail="Dein Betrag ist bereits reserviert – Add-ons können nicht mehr geändert werden.")

    normalized: list[str] = []
    for key in keys:
        k = (key or "").strip().lower()
        if not k or k in normalized:
            continue
        price = pricing.addon_price(mediation.mediation_type, k)
        if price is None:
            raise HTTPException(status_code=400, detail=f"Add-on '{k}' ist für diesen Konflikttyp nicht buchbar.")
        normalized.append(k)

    db.query(MediationAddon).filter(
        MediationAddon.mediation_id == mediation.id,
        MediationAddon.participant_id == participant.id,
    ).delete()
    for k in normalized:
        db.add(
            MediationAddon(
                mediation_id=mediation.id,
                participant_id=participant.id,
                addon_key=k,
                price_eur=pricing.addon_price(mediation.mediation_type, k) or 0.0,
            )
        )
    db.commit()
    return participant_addons(db, mediation, participant)


def participant_final_due(db: Session, mediation: Mediation, participant: MediationParticipant) -> float:
    """Zu zahlender Betrag dieser Partei: Basis nach Rabatt (>= 0) plus die von
    ihr gewählten Add-ons (Rabattcodes gelten nur auf den Basispreis)."""
    base = participant_base_due(db, mediation, participant)
    discount = participant.discount_amount or 0.0
    addons = participant_addons_total(db, mediation, participant)
    return round(max(base - discount, 0.0) + addons, 2)


def owing_participants(db: Session, mediation: Mediation) -> list[MediationParticipant]:
    """Alle Parteien, die bei diesem Abrechnungsmodell zahlungspflichtig sind."""
    parts = (
        db.query(MediationParticipant)
        .filter(MediationParticipant.mediation_id == mediation.id)
        .all()
    )
    return [p for p in parts if participant_owes(mediation, p)]


def all_owing_paid(db: Session, mediation: Mediation) -> bool:
    """Ob alle zahlungspflichtigen Parteien tatsächlich EINGEZOGEN wurden."""
    owing = owing_participants(db, mediation)
    if not owing:
        return False
    return all(bool(p.paid) for p in owing)


def all_owing_authorized(db: Session, mediation: Mediation) -> bool:
    """Ob alle zahlungspflichtigen Parteien zugesagt haben (reserviert ODER bezahlt).

    Das ist die Bedingung, ab der eingezogen werden darf - nicht die Bedingung
    für die Freischaltung selbst (die folgt nach erfolgreichem Einzug).
    """
    owing = owing_participants(db, mediation)
    if not owing:
        return False
    return all(bool(p.paid) or bool(p.authorized) for p in owing)


def check_and_unlock(db: Session, mediation: Mediation) -> bool:
    """Setzt is_paid=True, sobald alle zahlungspflichtigen Parteien bezahlt haben.

    Achtung: prüft nur den Ist-Zustand und zieht selbst NICHTS ein. Für den
    Ablauf "letzte Zusage -> alle Reservierungen einziehen -> freischalten"
    ist ``settle_and_unlock()`` zuständig.
    """
    if all_owing_paid(db, mediation) and not mediation.is_paid:
        mediation.is_paid = True
        db.commit()
    return bool(mediation.is_paid)


def _redeem_discount_code(db: Session, participant: MediationParticipant) -> None:
    """Zählt den Rabattcode der Partei als eingelöst (used_count += 1)."""
    if not participant.discount_code:
        return
    code = (
        db.query(DiscountCode)
        .filter(func.lower(DiscountCode.code) == participant.discount_code.lower())
        .first()
    )
    if code:
        code.used_count = (code.used_count or 0) + 1


def mark_participant_paid(
    db: Session,
    participant: MediationParticipant,
    *,
    amount: float,
    order_id: str | None = None,
) -> None:
    """Markiert den Anteil als tatsächlich eingezogen (Geld ist geflossen).

    Wird für 0-€-Freischaltungen direkt genutzt; bei PayPal-Zahlungen erst
    nach erfolgreichem Einzug der Reservierung (settle_and_unlock).
    """
    participant.paid = True
    participant.paid_at = datetime.now(timezone.utc)
    participant.authorized = True
    participant.amount_due = round(amount, 2)
    if order_id:
        participant.paypal_order_id = order_id
    # Rabattcode jetzt tatsächlich einlösen (used_count erhöhen).
    _redeem_discount_code(db, participant)
    db.commit()


def mark_participant_authorized(
    db: Session,
    participant: MediationParticipant,
    *,
    amount: float,
    order_id: str,
    authorization_id: str,
    expires_at: datetime | None = None,
) -> None:
    """Merkt sich die Reservierung dieser Partei - es ist noch KEIN Geld geflossen.

    Der Rabattcode wird hier bewusst noch NICHT eingelöst: das passiert erst
    beim tatsächlichen Einzug, damit ein Code nicht verbraucht ist, wenn der
    Fall am Ende nie zustande kommt.
    """
    participant.authorized = True
    participant.authorized_at = datetime.now(timezone.utc)
    participant.paypal_order_id = order_id
    participant.paypal_authorization_id = authorization_id
    participant.authorization_expires_at = expires_at
    participant.amount_due = round(amount, 2)
    db.commit()


def clear_participant_authorization(db: Session, participant: MediationParticipant) -> None:
    """Setzt eine (abgelaufene/fehlgeschlagene) Reservierung zurück.

    Die Partei erscheint danach wieder als "offen" und kann erneut bezahlen.
    """
    participant.authorized = False
    participant.authorized_at = None
    participant.paypal_authorization_id = None
    participant.authorization_expires_at = None
    db.commit()


async def settle_and_unlock(db: Session, mediation: Mediation) -> dict:
    """Zieht alle Reservierungen ein, sobald ALLE Parteien zugesagt haben.

    Vorher passiert bewusst nichts: solange eine Partei fehlt, bleibt das Geld
    der anderen nur reserviert und kann jederzeit wieder freigegeben werden.

    Rückgabe: ``{"is_paid": bool, "expired": [participant_id, ...]}``.
    ``expired`` listet Parteien, deren Reservierung abgelaufen war - sie wurden
    zurückgesetzt und müssen erneut bezahlen; der Fall bleibt dann zu.
    """
    if mediation.is_paid:
        return {"is_paid": True, "expired": []}
    if not all_owing_authorized(db, mediation):
        return {"is_paid": False, "expired": []}

    expired: list[int] = []
    for p in owing_participants(db, mediation):
        if p.paid:
            continue  # bereits eingezogen (z.B. 0-€-Freischaltung)
        if not p.paypal_authorization_id:
            # Als zugesagt markiert, aber ohne Reservierung - inkonsistent.
            # Zurücksetzen statt stillschweigend freischalten.
            logger.error(
                "Teilnehmer %s ist authorized ohne authorization_id (Mediation %s)",
                p.id, mediation.id,
            )
            clear_participant_authorization(db, p)
            expired.append(p.id)
            continue
        try:
            await capture_authorization(p.paypal_authorization_id, p.amount_due)
        except AuthorizationExpiredError:
            logger.warning(
                "Reservierung von Teilnehmer %s (Mediation %s) abgelaufen",
                p.id, mediation.id,
            )
            clear_participant_authorization(db, p)
            expired.append(p.id)
            continue
        mark_participant_paid(db, p, amount=float(p.amount_due or 0.0))

    if expired:
        # Mindestens eine Partei muss neu zahlen -> Fall bleibt zu. Die bereits
        # eingezogenen Beträge bleiben stehen; sie werden fällig, sobald die
        # Nachzahlung da ist.
        return {"is_paid": False, "expired": expired}

    return {"is_paid": check_and_unlock(db, mediation), "expired": []}


async def release_authorizations(db: Session, mediation: Mediation) -> int:
    """Gibt alle offenen Reservierungen eines Falls wieder frei (Storno).

    Für den Abbruch eines Falls, bevor alle gezahlt haben: bereits reservierte
    Beträge sollen beim Zahler nicht unnötig blockiert bleiben. Gibt die Anzahl
    freigegebener Reservierungen zurück.
    """
    released = 0
    for p in owing_participants(db, mediation):
        if p.paid or not p.paypal_authorization_id:
            continue
        try:
            await void_authorization(p.paypal_authorization_id)
        except PayPalError:
            logger.exception(
                "Storno der Reservierung von Teilnehmer %s fehlgeschlagen", p.id
            )
            continue
        clear_participant_authorization(db, p)
        released += 1
    return released


# ── Rabattcodes ────────────────────────────────────────────────────────────


def discount_amount_for(code: DiscountCode, base_due: float) -> float:
    """Rabattbetrag in EUR, den dieser Code auf ``base_due`` gewährt."""
    if base_due <= 0:
        return 0.0
    if code.kind == "full":
        return round(base_due, 2)
    if code.kind == "percent":
        pct = min(max(code.value or 0.0, 0.0), 100.0)
        return round(base_due * (pct / 100.0), 2)
    if code.kind == "fixed":
        return round(min(code.value or 0.0, base_due), 2)
    return 0.0


def validate_discount(
    db: Session, code_str: str, mediation: Mediation, base_due: float
) -> tuple[float, DiscountCode]:
    """Prüft einen Rabattcode und gibt (Rabattbetrag, Code) zurück.

    Erhöht used_count NICHT – das geschieht erst bei erfolgreicher Zahlung
    (mark_participant_paid). Wirft HTTPException bei ungültigem Code.
    """
    code_str = (code_str or "").strip()
    if not code_str:
        raise HTTPException(status_code=400, detail="Bitte einen Rabattcode eingeben.")

    code = (
        db.query(DiscountCode)
        .filter(func.lower(DiscountCode.code) == code_str.lower())
        .first()
    )
    if not code or not code.active:
        raise HTTPException(status_code=404, detail="Rabattcode ungültig.")

    now = datetime.now(timezone.utc).replace(tzinfo=None)
    if code.valid_until:
        vu = code.valid_until.replace(tzinfo=None) if code.valid_until.tzinfo else code.valid_until
        if vu < now:
            raise HTTPException(status_code=400, detail="Rabattcode ist abgelaufen.")

    if code.max_uses is not None and (code.used_count or 0) >= code.max_uses:
        raise HTTPException(status_code=400, detail="Rabattcode ist aufgebraucht.")

    if code.restrict_type and code.restrict_type.lower() != (mediation.mediation_type or "").lower():
        raise HTTPException(status_code=400, detail="Rabattcode gilt nicht für diesen Konflikttyp.")

    if code.restrict_package and code.restrict_package.lower() != pricing.normalize_package(mediation.package):
        raise HTTPException(status_code=400, detail="Rabattcode gilt nicht für dieses Paket.")

    discount = discount_amount_for(code, base_due)
    return discount, code
