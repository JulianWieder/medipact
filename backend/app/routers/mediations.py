from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.mediation import Mediation
from app.models.mediation_participant import MediationParticipant
from app.models.user import User
from app.security import get_current_user

router = APIRouter(prefix="/mediations", tags=["mediations"])
mediations = []


class MediationCreate(BaseModel):
    mediation_type: str
    description: Optional[str] = None
    priority: Optional[str] = None
    role: Optional[str] = None
    status: str = "draft"

@router.post("")
def create_mediation(
    mediation: MediationCreate,
    db: Session = Depends(get_db),
    current_user_email: str = Depends(get_current_user),
):
    user = db.query(User).filter(User.email == current_user_email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db_mediation = Mediation(
        title="Neue Mediation",
        mediation_type=mediation.mediation_type,
        description=mediation.description,
        priority=mediation.priority,
        role=mediation.role,
        status=mediation.status,
    )

    db.add(db_mediation)
    db.commit()
    db.refresh(db_mediation)

    participant = MediationParticipant(
        mediation_id=db_mediation.id,
        user_id=user.id,
        role=mediation.role or "owner",
    )

    db.add(participant)
    db.commit()

    return db_mediation

@router.get("/me")
def get_my_mediations(
    db: Session = Depends(get_db),
    current_user_email: str = Depends(get_current_user),
):
    user = db.query(User).filter(User.email == current_user_email).first()

    if not user:
        return []

    rows = (
        db.query(Mediation, MediationParticipant)
        .join(
            MediationParticipant,
            Mediation.id == MediationParticipant.mediation_id,
        )
        .filter(MediationParticipant.user_id == user.id)
        .all()
    )

    return [
        {
            "mediation_id": mediation.id,
            "title": mediation.title,
            "role": participant.role,
        }
        for mediation, participant in rows
    ]


@router.get("/{mediation_id}/participants")
def get_mediation_participants(
    mediation_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    participants = (
        db.query(MediationParticipant, User)
        .join(User, MediationParticipant.user_id == User.id)
        .filter(MediationParticipant.mediation_id == mediation_id)
        .all()
    )

    return [
        {
            "user_id": user.id,
            "name": user.name,
            "email": user.email,
            "role": participant.role,
        }
        for participant, user in participants
    ]