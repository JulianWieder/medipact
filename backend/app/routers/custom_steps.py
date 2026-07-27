"""
API-Endpoints für benutzerdefinierte Mediation-Schritte (custom steps).
Nur Mediator/Owner darf Steps anlegen und löschen.
"""
import secrets

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.mediation_custom_step import MediationCustomStep
from app.security import get_current_db_user
from app.services import access
from app.models.user import User

router = APIRouter(tags=["custom_steps"])

# Rollen die Steps verwalten dürfen
_ALLOWED_ROLES = {"mediator", "owner", "initiator", "admin"}


class CustomStepCreate(BaseModel):
    phase: str
    title: str
    description: str = ""


# Zugriffsregeln: siehe services/access.py (Teilnehmer ODER betreuender
# Mediator/Admin, Paywall nur für echte Teilnehmer).


@router.get("/mediations/{mediation_id}/custom-steps")
def list_custom_steps(
    mediation_id: int,
    phase: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    """Alle custom Steps einer Phase zurückgeben (für alle Teilnehmer)."""
    # Auch für betreuende Mediatoren/Admins ohne eigenen Teilnehmer-Eintrag.
    access.require_read_access(mediation_id, user, db)

    steps = (
        db.query(MediationCustomStep)
        .filter(
            MediationCustomStep.mediation_id == mediation_id,
            MediationCustomStep.phase == phase,
        )
        .order_by(MediationCustomStep.position, MediationCustomStep.id)
        .all()
    )

    return [
        {
            "step_key": s.step_key,
            "title": s.title,
            "description": s.description,
            "position": s.position,
        }
        for s in steps
    ]


@router.post("/mediations/{mediation_id}/custom-steps")
def create_custom_step(
    mediation_id: int,
    payload: CustomStepCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    """Einen neuen custom Step anlegen – nur Mediator/Owner."""
    # participant ist None bei betreuendem Mediator/Admin ohne Teilnehmer-Eintrag.
    participant = access.require_read_access(mediation_id, user, db)

    if participant is not None and participant.role not in _ALLOWED_ROLES:
        raise HTTPException(status_code=403, detail="Nur der Mediator kann Steps hinzufügen")

    # Eindeutigen Step-Key generieren
    step_key = f"custom_{secrets.token_urlsafe(8)}"

    # Position = Anzahl bereits existierender custom Steps in der Phase
    count = (
        db.query(MediationCustomStep)
        .filter(
            MediationCustomStep.mediation_id == mediation_id,
            MediationCustomStep.phase == payload.phase,
        )
        .count()
    )

    step = MediationCustomStep(
        mediation_id=mediation_id,
        phase=payload.phase,
        step_key=step_key,
        title=payload.title,
        description=payload.description,
        position=count,
    )
    db.add(step)
    db.commit()
    db.refresh(step)

    return {
        "step_key": step.step_key,
        "title": step.title,
        "description": step.description,
        "position": step.position,
    }


@router.delete("/mediations/{mediation_id}/custom-steps/{step_key}")
def delete_custom_step(
    mediation_id: int,
    step_key: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    """Einen custom Step löschen – nur Mediator/Owner."""
    # participant ist None bei betreuendem Mediator/Admin ohne Teilnehmer-Eintrag.
    participant = access.require_read_access(mediation_id, user, db)

    if participant is not None and participant.role not in _ALLOWED_ROLES:
        raise HTTPException(status_code=403, detail="Nur der Mediator kann Steps entfernen")

    step = (
        db.query(MediationCustomStep)
        .filter(
            MediationCustomStep.mediation_id == mediation_id,
            MediationCustomStep.step_key == step_key,
        )
        .first()
    )

    if not step:
        raise HTTPException(status_code=404, detail="Step nicht gefunden")

    db.delete(step)
    db.commit()

    return {"status": "deleted"}
