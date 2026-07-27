"""
API-Endpoints für den fallbezogenen Inhalt "individueller" Schritte
(MediationStepContent). Ein Schritt wird zentral im Workflow Manager als
"individuell" markiert; sein tatsächlicher Inhalt (eigenes Video, Meeting-Link,
Text, Frage, Feedback-Anlass) wird hier pro Fall vom Mediator gepflegt.

Nur Rollen, die den Fall verwalten (Mediator/Owner/Admin), dürfen schreiben;
lesen darf jeder Teilnehmer des Falls.
"""
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.mediation_step_content import MediationStepContent
from app.models.user import User
from app.security import get_current_db_user
from app.services import access

router = APIRouter(tags=["step_content"])

# Rollen, die Inhalte pflegen dürfen (konsistent mit custom_steps.py)
_ALLOWED_ROLES = {"mediator", "owner", "initiator", "admin"}


# Zugriffsregeln: siehe services/access.py (Teilnehmer ODER betreuender
# Mediator/Admin, Paywall nur für echte Teilnehmer).


def _serialize(c: MediationStepContent) -> dict:
    return {
        "phase": c.phase,
        "step_key": c.step_key,
        "body_text": c.body_text,
        "video_url": c.video_url,
        "meeting_url": c.meeting_url,
        "question": c.question,
        "feedback_occasion": c.feedback_occasion,
        "released": c.released,
    }


class StepContentUpsert(BaseModel):
    phase: str
    step_key: str
    body_text: Optional[str] = None
    video_url: Optional[str] = None
    meeting_url: Optional[str] = None
    question: Optional[str] = None
    feedback_occasion: Optional[str] = None
    released: bool = False


@router.get("/mediations/{mediation_id}/step-content")
def list_step_content(
    mediation_id: int,
    phase: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    """
    Alle fallbezogenen Inhalte zurückgeben – optional auf eine Phase gefiltert.
    Für alle Teilnehmer des Falls lesbar – und für betreuende Mediatoren/Admins
    ohne eigenen Teilnehmer-Eintrag.
    """
    access.require_read_access(mediation_id, user, db)

    query = db.query(MediationStepContent).filter(
        MediationStepContent.mediation_id == mediation_id
    )
    if phase:
        query = query.filter(MediationStepContent.phase == phase)
    entries = query.order_by(MediationStepContent.phase, MediationStepContent.id).all()
    return [_serialize(e) for e in entries]


@router.put("/mediations/{mediation_id}/step-content")
def upsert_step_content(
    mediation_id: int,
    payload: StepContentUpsert,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    """Fallbezogenen Inhalt eines Schritts anlegen oder aktualisieren."""
    # participant ist None bei betreuendem Mediator/Admin ohne Teilnehmer-Eintrag.
    participant = access.require_read_access(mediation_id, user, db)
    if participant is not None and participant.role not in _ALLOWED_ROLES:
        raise HTTPException(status_code=403, detail="Nur der Mediator kann Inhalte pflegen")

    entry = (
        db.query(MediationStepContent)
        .filter(
            MediationStepContent.mediation_id == mediation_id,
            MediationStepContent.phase == payload.phase,
            MediationStepContent.step_key == payload.step_key,
        )
        .first()
    )

    if entry is None:
        entry = MediationStepContent(
            mediation_id=mediation_id,
            phase=payload.phase,
            step_key=payload.step_key,
        )
        db.add(entry)

    entry.body_text = payload.body_text
    entry.video_url = payload.video_url
    entry.meeting_url = payload.meeting_url
    entry.question = payload.question
    entry.feedback_occasion = payload.feedback_occasion
    entry.released = payload.released

    db.commit()
    db.refresh(entry)
    return _serialize(entry)
