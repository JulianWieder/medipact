"""Nutzer-Onboarding: Schritte aufloesen, Antworten pruefen, Sperre erzwingen.

Das Onboarding laeuft EINMAL pro Person, bevor sie Faelle bearbeiten kann.
Vorlage: phase_step_defaults mit mediation_type == USER_ONBOARDING_TYPE
("@user") und phase == USER_ONBOARDING_PHASE ("onboarding") — dieselbe Tabelle
und derselbe Designer wie die Fall-Schritte, nur unter einem Pseudo-Typ, der in
keiner Fall-Aufloesung vorkommt.

Antworten: user_onboarding_responses (pro Person genau eine je Block).

Die Sperre wird hier zentral definiert, damit sie NICHT nur im Frontend haengt.
Die Middleware leitet zwar auf /onboarding um, aber wer die API direkt
anspricht, umgeht das — genau der Fehler, der bei der Paywall schon einmal
passiert ist (siehe services/billing.ensure_unlocked).
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.phase_step_default import (
    USER_ONBOARDING_PHASE,
    USER_ONBOARDING_TYPE,
    PhaseStepDefault,
)
from app.models.user import User
from app.models.user_onboarding_response import UserOnboardingResponse

# Bloecke, die eine Eingabe der Person erzeugen. Muss zu isUserInputBlock in
# app/workspace/blockTypes.ts passen — dort steht die maßgebliche Registry.
# Reine Anzeige-Bloecke (textausgabe, akkordeon, hinweis, bild, video) fehlen
# hier bewusst: sie koennen nie "unbeantwortet" sein.
USER_INPUT_BLOCK_TYPES = {
    "texteingabe",
    "frage",
    "auswahl",
    "skala",
    "ranking",
    "liste",
    "datum",
    "betrag",
    "zustimmung",
    "unterschrift",
    "datei_upload",
    "video_aufnahme",
    "vertrauliche_notiz",
    # Onboarding-eigene Bloecke: schreiben zusaetzlich in die users-Spalten.
    "stammdaten",
    "rechnungsdaten",
}

# Diese Bloecke werden nach dem Speichern in die users-Tabelle gespiegelt,
# damit Rechnungsstellung und Fall-Vorbefuellung sie lesen koennen, ohne das
# Onboarding zu kennen. Zuordnung: Blocktyp -> {Wert-Feld: users-Spalte}.
PROFILE_MIRROR = {
    "stammdaten": {"name": "name", "phone": "phone"},
    "rechnungsdaten": {
        "street": "billing_street",
        "postal_code": "billing_postal_code",
        "city": "billing_city",
    },
}


def get_steps(db: Session) -> list[PhaseStepDefault]:
    """Alle aktiven Onboarding-Schritte in Anzeige-Reihenfolge.

    Bewusst OHNE include_shared: ein "*"-Schritt gilt fuer alle Mediationstypen
    und gehoert damit in Faelle, nicht ins Onboarding einer Person.
    """
    return (
        db.query(PhaseStepDefault)
        .filter(
            PhaseStepDefault.mediation_type == USER_ONBOARDING_TYPE,
            PhaseStepDefault.phase == USER_ONBOARDING_PHASE,
            PhaseStepDefault.enabled.is_(True),
        )
        .order_by(PhaseStepDefault.position, PhaseStepDefault.id)
        .all()
    )


def serialize_step(step: PhaseStepDefault) -> dict:
    return {
        "id": step.id,
        "step_key": step.step_key,
        "title": step.title,
        "description": step.description or "",
        "blocks": step.blocks or [],
        "position": step.position,
    }


def get_responses(db: Session, user_id: int) -> list[UserOnboardingResponse]:
    return (
        db.query(UserOnboardingResponse)
        .filter(UserOnboardingResponse.user_id == user_id)
        .all()
    )


def responses_by_block(db: Session, user_id: int) -> dict[str, Any]:
    """Block-id -> Wert. Block-ids sind ueber alle Schritte hinweg eindeutig
    (newBlockId in blockTypes.ts), deshalb reicht die id als Schluessel."""
    return {r.block_id: r.value for r in get_responses(db, user_id)}


def is_value_empty(value: Any) -> bool:
    """Leerer/nicht beantworteter Wert. Deckt alle Wertformen der Blocktypen ab.
    Gegenstueck zu isBlockValueEmpty in app/workspace/blockTypes.ts — beide
    Seiten muessen dasselbe als "leer" ansehen, sonst laesst die UI abschliessen
    und der Server lehnt ab (oder umgekehrt)."""
    if value is None:
        return True
    if isinstance(value, str):
        return value.strip() == ""
    if isinstance(value, bool):
        return value is False
    if isinstance(value, (int, float)):
        return False
    if isinstance(value, list):
        return len([v for v in value if str(v or "").strip() != ""]) == 0
    if isinstance(value, dict):
        def filled(key: str) -> bool:
            return str(value.get(key) or "").strip() != ""

        # zustimmung: {agreed}, unterschrift: {name}, datei_upload: {url}
        if "agreed" in value:
            return value.get("agreed") is not True
        # rechnungsdaten: {street, postal_code, city} — erst mit allen dreien
        # ist eine Rechnung erstellbar. Muss VOR der "name"-Pruefung stehen.
        if "street" in value:
            return not (filled("street") and filled("postal_code") and filled("city"))
        # stammdaten: {name, phone} — nur der Name ist Pflicht. Deckt zugleich
        # unterschrift: {name} ab.
        if "name" in value:
            return not filled("name")
        if "url" in value:
            return not filled("url")
        return len(value) == 0
    return False


def profile_value(user: User, block_type: str) -> dict | None:
    """Baut den Wert eines Profil-Blocks aus den users-Spalten.

    Umkehrung von mirror_to_profile. Gebraucht fuer die VORBEFUELLUNG: wer
    seine Daten schon im Profil hat (Bestandsnutzer, aus einem alten Fall
    uebernommen), soll sie im Onboarding nicht erneut eintippen.
    """
    if block_type == "stammdaten":
        return {"name": user.name or "", "phone": user.phone or ""}
    if block_type == "rechnungsdaten":
        return {
            "street": user.billing_street or "",
            "postal_code": user.billing_postal_code or "",
            "city": user.billing_city or "",
        }
    return None


def effective_values(db: Session, user: User) -> dict[str, Any]:
    """Gespeicherte Antworten, ergaenzt um Vorbefuellung aus dem Profil.

    Fuer stammdaten/rechnungsdaten ist das PROFIL die Wahrheit, nicht die
    Antwortzeile: die users-Spalten werden auch von anderen Stellen gefuellt
    (Registrierung setzt den Namen, eine Migration kann Rechnungsdaten aus
    einem alten Fall uebernehmen). Wer diese Werte schon hat, soll sie nicht
    erneut eintippen — und `missing_required` darf sie nicht als fehlend
    zaehlen, nur weil noch keine Antwortzeile existiert.
    """
    values = responses_by_block(db, user.id)
    for step in get_steps(db):
        for block in step.blocks or []:
            if not isinstance(block, dict):
                continue
            btype = block.get("type")
            if btype not in PROFILE_MIRROR:
                continue
            bid = block.get("id")
            if not is_value_empty(values.get(bid)):
                continue
            fallback = profile_value(user, btype)
            if fallback and not is_value_empty(fallback):
                values[bid] = fallback
    return values


def missing_required(db: Session, user: User) -> list[dict]:
    """Alle Pflicht-Bloecke ohne Antwort, in Schritt-Reihenfolge.

    Ein Block ist Pflicht, wenn er eine Nutzereingabe erzeugt UND
    config.required == True gesetzt ist. Anzeige-Bloecke koennen nie fehlen.
    """
    values = effective_values(db, user)
    missing: list[dict] = []
    for step in get_steps(db):
        for block in step.blocks or []:
            if not isinstance(block, dict):
                continue
            btype = block.get("type")
            if btype not in USER_INPUT_BLOCK_TYPES:
                continue
            config = block.get("config") or {}
            if config.get("required") is not True:
                continue
            if is_value_empty(values.get(block.get("id"))):
                missing.append(
                    {
                        "step_key": step.step_key,
                        "step_title": step.title,
                        "block_id": block.get("id"),
                        "block_type": btype,
                        "label": (
                            config.get("prompt")
                            or config.get("label")
                            or config.get("title")
                            or config.get("text")
                            or step.title
                        ),
                    }
                )
    return missing


def first_incomplete_step(db: Session, user: User) -> str | None:
    """step_key des ersten Schritts mit offenen Pflichtfeldern.

    Das ist der Wiedereinstiegspunkt: wer sich neu anmeldet, landet genau hier
    und nicht wieder bei Schritt 1. Bewusst ABGELEITET statt gespeichert — ein
    gespeicherter Stand kann auf einen geloeschten Schritt zeigen, diese
    Rechnung nie.
    """
    missing = missing_required(db, user)
    return missing[0]["step_key"] if missing else None


def mirror_to_profile(user: User, block_type: str, value: Any) -> None:
    """Spiegelt stammdaten/rechnungsdaten in die users-Spalten.

    Ohne das muessten Rechnungsstellung, Teilnehmer-Vorbefuellung und
    Admin-Ansicht alle die Blockliste des Onboardings kennen — die sich im
    Workflow Manager jederzeit aendern kann.
    """
    mapping = PROFILE_MIRROR.get(block_type)
    if not mapping or not isinstance(value, dict):
        return
    for value_key, column in mapping.items():
        raw = value.get(value_key)
        if raw is None:
            continue
        text = str(raw).strip()
        # Den Namen nie leeren: users.name ist NOT NULL und wird ueberall als
        # Anzeigename verwendet.
        if column == "name" and not text:
            continue
        setattr(user, column, text or None)


def is_complete(user: User) -> bool:
    return user.onboarding_completed_at is not None


def ensure_onboarded(user: User) -> None:
    """Harte Sperre: ohne abgeschlossenes Onboarding keine Fallbearbeitung.

    Wird in den Fall-Endpunkten aufgerufen. 428 (Precondition Required) statt
    403, damit das Frontend den Fall eindeutig von "keine Berechtigung"
    unterscheiden und gezielt auf /onboarding leiten kann.
    """
    if is_complete(user):
        return
    raise HTTPException(
        status_code=428,
        detail="Bitte schließe zuerst dein Onboarding ab.",
    )


def mark_complete(db: Session, user: User) -> None:
    """Setzt den Abschluss — erst nachdem missing_required leer ist.

    Der Aufrufer (routers/user_onboarding.py) prueft das; hier nur der
    Zeitstempel, damit es genau eine Stelle gibt, die das Flag setzt.
    """
    user.onboarding_completed_at = datetime.now(timezone.utc)
    db.add(user)
