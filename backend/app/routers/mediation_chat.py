"""Fall-Chat: freier Gruppenchat pro Mediation.

Jeder Fall hat einen gemeinsamen Chat für alle Teilnehmer + Mediator, damit
sich die Parteien auch über Themen AUSSERHALB der vorgegebenen Workflow-
Schritte austauschen können. Zugriff wie bei /notes/all: Teilnehmer des Falls
oder globale Mediator/Admin-Rolle; für zahlungspflichtige Parteien gilt die
Paywall (billing.ensure_unlocked, vgl. project paywall-enforcement).
"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.mediation import Mediation
from app.models.mediation_chat_message import MediationChatMessage
from app.models.mediation_participant import MediationParticipant
from app.models.user import User
from app.security import get_current_db_user
from app.services import billing

router = APIRouter(prefix="/mediations", tags=["chat"])

MAX_BODY_LEN = 4000


class ChatMessageCreate(BaseModel):
    body: str


def _require_chat_access(
    mediation_id: int, user: User, db: Session
) -> Mediation:
    """Teilnehmer des Falls oder globaler Mediator/Admin; Paywall für Parteien."""
    mediation = db.query(Mediation).filter(Mediation.id == mediation_id).first()
    if not mediation:
        raise HTTPException(status_code=404, detail="Mediation not found")

    participant = (
        db.query(MediationParticipant)
        .filter(
            MediationParticipant.mediation_id == mediation_id,
            MediationParticipant.user_id == user.id,
        )
        .first()
    )
    if not participant and user.role not in ("mediator", "admin"):
        raise HTTPException(status_code=403, detail="Not allowed")

    # Paywall: Parteien erst nach Bezahlung (Mediator/Admin ausgenommen,
    # siehe billing.ensure_unlocked).
    if participant is not None:
        billing.ensure_unlocked(mediation, participant, user)

    return mediation


def _serialize(msg: MediationChatMessage, author: User | None, current_user: User) -> dict:
    return {
        "id": msg.id,
        "body": msg.body,
        "created_at": msg.created_at.isoformat() if msg.created_at else None,
        "author_name": author.name if author else "Unbekannt",
        "author_role": author.role if author else None,
        "is_own": msg.user_id == current_user.id,
    }


@router.get("/{mediation_id}/chat")
def list_chat_messages(
    mediation_id: int,
    after: int = 0,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """Nachrichten des Fall-Chats, optional nur neue (?after=<letzte id>) fürs Polling."""
    _require_chat_access(mediation_id, current_user, db)

    q = (
        db.query(MediationChatMessage, User)
        .outerjoin(User, MediationChatMessage.user_id == User.id)
        .filter(MediationChatMessage.mediation_id == mediation_id)
    )
    if after > 0:
        q = q.filter(MediationChatMessage.id > after)
    rows = q.order_by(MediationChatMessage.id).all()

    return {"messages": [_serialize(m, u, current_user) for m, u in rows]}


@router.post("/{mediation_id}/chat")
def create_chat_message(
    mediation_id: int,
    payload: ChatMessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    _require_chat_access(mediation_id, current_user, db)

    body = payload.body.strip()
    if not body:
        raise HTTPException(status_code=422, detail="Nachricht ist leer")
    if len(body) > MAX_BODY_LEN:
        raise HTTPException(status_code=422, detail="Nachricht ist zu lang")

    msg = MediationChatMessage(
        mediation_id=mediation_id, user_id=current_user.id, body=body
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)

    return _serialize(msg, current_user, current_user)
