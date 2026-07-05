"""Abrechnung pro Partei + Rabattcode-Validierung.

Kapselt die Preis-/Freischalt-Logik, damit der Router schlank bleibt:
  • Jede zahlungspflichtige Partei zahlt ihren eigenen Anteil (siehe app/pricing.py).
  • Der Fall wird erst freigeschaltet (mediation.is_paid = True), wenn ALLE
    zahlungspflichtigen Parteien bezahlt haben.
"""
from __future__ import annotations

from datetime import datetime, timezone

from fastapi import HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app import pricing
from app.models.discount_code import DiscountCode
from app.models.mediation import Mediation
from app.models.mediation_participant import MediationParticipant


def _participant_count(db: Session, mediation_id: int) -> int:
    return max(
        db.query(MediationParticipant)
        .filter(MediationParticipant.mediation_id == mediation_id)
        .count(),
        1,
    )


def is_owner(participant: MediationParticipant) -> bool:
    return (participant.role or "").lower() == "owner"


def participant_base_due(db: Session, mediation: Mediation, participant: MediationParticipant) -> float:
    """Fälliger Grundbetrag dieser Partei (vor Rabatt), aus der Preis-Matrix."""
    return pricing.participant_due(
        mediation.mediation_type,
        mediation.package,
        participant_count=_participant_count(db, mediation.id),
        is_owner=is_owner(participant),
    )


def participant_final_due(db: Session, mediation: Mediation, participant: MediationParticipant) -> float:
    """Zu zahlender Betrag dieser Partei NACH Rabatt (>= 0)."""
    base = participant_base_due(db, mediation, participant)
    discount = participant.discount_amount or 0.0
    return round(max(base - discount, 0.0), 2)


def owing_participants(db: Session, mediation: Mediation) -> list[MediationParticipant]:
    """Alle Parteien, die bei diesem Abrechnungsmodell zahlungspflichtig sind."""
    parts = (
        db.query(MediationParticipant)
        .filter(MediationParticipant.mediation_id == mediation.id)
        .all()
    )
    return [
        p
        for p in parts
        if pricing.participant_owes(mediation.mediation_type, is_owner=is_owner(p))
    ]


def all_owing_paid(db: Session, mediation: Mediation) -> bool:
    owing = owing_participants(db, mediation)
    if not owing:
        return False
    return all(bool(p.paid) for p in owing)


def check_and_unlock(db: Session, mediation: Mediation) -> bool:
    """Setzt is_paid=True, sobald alle zahlungspflichtigen Parteien bezahlt haben."""
    if all_owing_paid(db, mediation) and not mediation.is_paid:
        mediation.is_paid = True
        db.commit()
    return bool(mediation.is_paid)


def mark_participant_paid(
    db: Session,
    participant: MediationParticipant,
    *,
    amount: float,
    order_id: str | None = None,
) -> None:
    participant.paid = True
    participant.paid_at = datetime.now(timezone.utc)
    participant.amount_due = round(amount, 2)
    if order_id:
        participant.paypal_order_id = order_id
    # Rabattcode jetzt tatsächlich einlösen (used_count erhöhen).
    if participant.discount_code:
        code = (
            db.query(DiscountCode)
            .filter(func.lower(DiscountCode.code) == participant.discount_code.lower())
            .first()
        )
        if code:
            code.used_count = (code.used_count or 0) + 1
    db.commit()


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
