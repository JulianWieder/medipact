"""Konflikt-Logbuch (kostenlos) – Einträge + Umwandlung in eine Mediation.

Ein Fall mit mode="logbuch" ist ein kostenloses Dokumentations-Logbuch: die
Nutzer:in hält Vorkommnisse, Gedanken, Gespräche, E-Mails, WhatsApp-Nachrichten
und Telefonate fest, BEVOR (oder ohne dass) eine Mediation gestartet wird.

Bewusst KEINE Paywall (billing.ensure_unlocked wird hier nicht aufgerufen) und
keine Gegenseiten-Kommunikation: Einladungen sind für Logbuch-Fälle geblockt
(siehe invites.create_invite). Die Form der Einträge kommt aus dem
WorkflowManager (phase="logbuch", step_key="logbuch_eintrag") – editierbar im
Designer, gespeichert wird {block_id: wert} in mediation_log_entries.content.
"""
from datetime import datetime, timezone
from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.mediation import Mediation
from app.models.mediation_log_entry import MediationLogEntry
from app.models.mediation_participant import MediationParticipant
from app.models.user import User
from app.security import get_current_db_user

router = APIRouter(prefix="/mediations", tags=["logbuch"])

ENTRY_TYPES = {"vorkommnis", "gedanke", "gespraech", "email", "whatsapp", "telefonat"}


def _require_participant(mediation_id: int, user: User, db: Session) -> MediationParticipant:
    p = (
        db.query(MediationParticipant)
        .filter(
            MediationParticipant.mediation_id == mediation_id,
            MediationParticipant.user_id == user.id,
        )
        .first()
    )
    if not p:
        raise HTTPException(status_code=403, detail="Not allowed")
    return p


def _get_mediation(mediation_id: int, db: Session) -> Mediation:
    m = db.query(Mediation).filter(Mediation.id == mediation_id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Mediation not found")
    return m


def _parse_occurred_at(value: Optional[str]) -> Optional[datetime]:
    if not value:
        return None
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        raise HTTPException(status_code=422, detail="Ungültiges Datum für occurred_at.")


def _serialize(e: MediationLogEntry) -> dict:
    return {
        "id": e.id,
        "entry_type": e.entry_type,
        "occurred_at": e.occurred_at.isoformat() if e.occurred_at else None,
        "title": e.title,
        "content": e.content or {},
        "author_participant_id": e.author_participant_id,
        "created_at": e.created_at.isoformat() if e.created_at else None,
        "updated_at": e.updated_at.isoformat() if e.updated_at else None,
    }


class LogEntryCreate(BaseModel):
    entry_type: str = "vorkommnis"
    occurred_at: Optional[str] = None  # ISO-Datum/Zeit des Ereignisses
    title: Optional[str] = None
    content: Optional[dict[str, Any]] = None  # {block_id: wert} gemäß WFM-Vorlage


class LogEntryUpdate(BaseModel):
    entry_type: Optional[str] = None
    occurred_at: Optional[str] = None
    title: Optional[str] = None
    content: Optional[dict[str, Any]] = None


@router.get("/{mediation_id}/logbuch/entries")
def list_entries(
    mediation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """Alle Logbuch-Einträge des Falls, neueste Ereignisse zuerst.

    Kein Paywall-Check: das Logbuch ist ein kostenloses Angebot. Zugriff nur
    für Teilnehmer (praktisch: die Eigentümer:in – Logbuch-Fälle haben keine
    Gegenseite)."""
    _require_participant(mediation_id, current_user, db)
    rows = (
        db.query(MediationLogEntry)
        .filter(MediationLogEntry.mediation_id == mediation_id)
        .all()
    )
    # Sortierung: Ereignisdatum absteigend, Einträge ohne Datum nach created_at.
    rows.sort(
        key=lambda e: (e.occurred_at or e.created_at or datetime.min),
        reverse=True,
    )
    return [_serialize(e) for e in rows]


@router.post("/{mediation_id}/logbuch/entries")
def create_entry(
    mediation_id: int,
    payload: LogEntryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    participant = _require_participant(mediation_id, current_user, db)
    _get_mediation(mediation_id, db)

    entry_type = (payload.entry_type or "vorkommnis").strip().lower()
    if entry_type not in ENTRY_TYPES:
        raise HTTPException(status_code=422, detail="Unbekannte Eintragsart.")

    entry = MediationLogEntry(
        mediation_id=mediation_id,
        author_participant_id=participant.id,
        entry_type=entry_type,
        occurred_at=_parse_occurred_at(payload.occurred_at),
        title=(payload.title or "").strip() or None,
        content=payload.content or {},
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return _serialize(entry)


def _get_own_entry(
    mediation_id: int, entry_id: int, db: Session, user: User
) -> MediationLogEntry:
    _require_participant(mediation_id, user, db)
    entry = (
        db.query(MediationLogEntry)
        .filter(
            MediationLogEntry.id == entry_id,
            MediationLogEntry.mediation_id == mediation_id,
        )
        .first()
    )
    if not entry:
        raise HTTPException(status_code=404, detail="Eintrag nicht gefunden")
    return entry


@router.patch("/{mediation_id}/logbuch/entries/{entry_id}")
def update_entry(
    mediation_id: int,
    entry_id: int,
    payload: LogEntryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    entry = _get_own_entry(mediation_id, entry_id, db, current_user)
    if payload.entry_type is not None:
        et = payload.entry_type.strip().lower()
        if et not in ENTRY_TYPES:
            raise HTTPException(status_code=422, detail="Unbekannte Eintragsart.")
        entry.entry_type = et
    if payload.occurred_at is not None:
        entry.occurred_at = _parse_occurred_at(payload.occurred_at)
    if payload.title is not None:
        entry.title = payload.title.strip() or None
    if payload.content is not None:
        entry.content = payload.content
    db.commit()
    db.refresh(entry)
    return _serialize(entry)


@router.delete("/{mediation_id}/logbuch/entries/{entry_id}")
def delete_entry(
    mediation_id: int,
    entry_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    entry = _get_own_entry(mediation_id, entry_id, db, current_user)
    db.delete(entry)
    db.commit()
    return {"ok": True}


@router.post("/{mediation_id}/logbuch/convert")
def convert_to_mediation(
    mediation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """Wandelt ein Logbuch in eine normale Mediation um (Upsell-Pfad).

    Setzt nur mode="mediation" – der Fall durchläuft danach den normalen
    Start-Flow (start_intake, Paketwahl, Einladung, Paywall). Die Logbuch-
    Einträge bleiben erhalten und dienen als Chronologie der Fallaufnahme."""
    participant = _require_participant(mediation_id, current_user, db)
    if (participant.role or "").lower() not in ("owner", "admin"):
        raise HTTPException(status_code=403, detail="Nur die Eigentümer:in kann umwandeln.")
    mediation = _get_mediation(mediation_id, db)
    if mediation.mode != "logbuch":
        raise HTTPException(status_code=409, detail="Dieser Fall ist bereits eine Mediation.")

    mediation.mode = "mediation"
    mediation.status = "draft"
    db.commit()

    # Jetzt (erst bei Umwandlung) den Standard-Mediator zuordnen – Logbücher
    # sind privat und haben bewusst keinen Mediator.
    from app.routers.mediations import _ensure_default_mediator

    _ensure_default_mediator(db, mediation)

    return {
        "mediation_id": mediation.id,
        "mode": mediation.mode,
        "status": mediation.status,
        "mediation_type": mediation.mediation_type,
    }
