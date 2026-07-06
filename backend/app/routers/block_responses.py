"""
Antworten/Inhalte je Block eines Schritts (mediation_block_responses).

Hier landet der tatsächliche, pro Fall entstehende Inhalt der dynamischen
Blöcke: Texteingaben der Parteien, Antworten auf Fragen, Aufnahmen/Transkripte,
Mediator-Notizen und KI-Ausgaben. Getrennt nach Autor (jede Partei, Mediator,
KI), damit die Beiträge am Ende nebeneinander auswertbar sind – dort werden die
Reibungspunkte und Einigungschancen sichtbar.
"""
from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.mediation_block_response import MediationBlockResponse
from app.models.mediation_participant import MediationParticipant
from app.models.user import User
from app.security import get_current_db_user

router = APIRouter(prefix="/mediations", tags=["block_responses"])

# Rollen, die im Namen des Falls (Mediator-Sicht) schreiben/alle Antworten lesen.
_MEDIATOR_ROLES = {"mediator", "owner", "admin"}


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


def _serialize(r: MediationBlockResponse) -> dict:
    return {
        "id": r.id,
        "phase": r.phase,
        "step_key": r.step_key,
        "block_id": r.block_id,
        "block_type": r.block_type,
        "author_key": r.author_key,
        "author_source": r.author_source,
        "author_participant_id": r.author_participant_id,
        "value": r.value,
        "submitted": r.submitted,
        "updated_at": r.updated_at.isoformat() if r.updated_at else None,
    }


class BlockResponseUpsert(BaseModel):
    phase: str
    step_key: str
    block_id: str
    block_type: Optional[str] = None
    value: Any = None
    submitted: bool = False
    # Nur für Mediator/Owner/Admin relevant: als KI-Beitrag ablegen (author_key="ai").
    as_ai: bool = False


@router.get("/{mediation_id}/block-responses")
def list_block_responses(
    mediation_id: int,
    phase: Optional[str] = None,
    step_key: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """
    Antworten eines Falls. Mediator/Owner/Admin sehen ALLE Beiträge (Grundlage
    der Auswertung); eine Konfliktpartei sieht ihre eigenen sowie KI- und
    freigegebene/geteilte Beiträge nicht automatisch – der Einfachheit halber
    liefert dieser Endpunkt für Parteien nur die EIGENEN Antworten zurück.
    """
    own = _require_participant(mediation_id, current_user, db)
    query = db.query(MediationBlockResponse).filter(
        MediationBlockResponse.mediation_id == mediation_id
    )
    if phase:
        query = query.filter(MediationBlockResponse.phase == phase)
    if step_key:
        query = query.filter(MediationBlockResponse.step_key == step_key)
    if own.role not in _MEDIATOR_ROLES:
        query = query.filter(MediationBlockResponse.author_key == str(own.id))
    rows = query.order_by(MediationBlockResponse.step_key, MediationBlockResponse.block_id).all()
    return [_serialize(r) for r in rows]


@router.put("/{mediation_id}/block-responses")
def upsert_block_response(
    mediation_id: int,
    payload: BlockResponseUpsert,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """Legt den Beitrag des aktuellen Autors zu einem Block an oder aktualisiert ihn."""
    own = _require_participant(mediation_id, current_user, db)
    is_mediator = own.role in _MEDIATOR_ROLES

    if payload.as_ai:
        if not is_mediator:
            raise HTTPException(status_code=403, detail="Nur Mediator/Owner dürfen KI-Beiträge ablegen")
        author_key = "ai"
        author_source = "ai"
        author_participant_id = None
    else:
        author_key = str(own.id)
        author_source = "mediator" if is_mediator else "user"
        author_participant_id = own.id

    existing = (
        db.query(MediationBlockResponse)
        .filter(
            MediationBlockResponse.mediation_id == mediation_id,
            MediationBlockResponse.step_key == payload.step_key,
            MediationBlockResponse.block_id == payload.block_id,
            MediationBlockResponse.author_key == author_key,
        )
        .first()
    )
    if existing:
        existing.value = payload.value
        existing.submitted = payload.submitted
        existing.phase = payload.phase
        if payload.block_type:
            existing.block_type = payload.block_type
        db.commit()
        db.refresh(existing)
        return _serialize(existing)

    row = MediationBlockResponse(
        mediation_id=mediation_id,
        phase=payload.phase,
        step_key=payload.step_key,
        block_id=payload.block_id,
        block_type=payload.block_type,
        author_key=author_key,
        author_source=author_source,
        author_participant_id=author_participant_id,
        value=payload.value,
        submitted=payload.submitted,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return _serialize(row)
