from datetime import datetime, timedelta, timezone
import hashlib
import secrets

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.mediation_invite import MediationInvite
from app.models.mediation_participant import MediationParticipant
from app.models.user import User
from app.security import get_current_db_user, require_mediation_access


router = APIRouter(tags=["invites"])


class InviteCreate(BaseModel):
    invited_email: EmailStr | None = None
    role: str = "other_party"


def create_invite_token() -> str:
    return secrets.token_urlsafe(32)


def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


@router.post("/mediations/{mediation_id}/invites")
def create_invite(
    mediation_id: int,
    payload: InviteCreate,
    db: Session = Depends(get_db),
    mediation=Depends(require_mediation_access),
):
    token = create_invite_token()

    invite = MediationInvite(
        mediation_id=mediation.id,
        token_hash=hash_token(token),
        role=payload.role,
        status="pending",
        invited_email=payload.invited_email,
        expires_at=datetime.now(timezone.utc) + timedelta(days=7),
    )

    db.add(invite)
    db.commit()
    db.refresh(invite)

    return {
        "invite_url": f"{settings.APP_BASE_URL}/dashboard/invitations?token={token}",
        "token": token,
    }

@router.post("/invites/{token}/accept")
def accept_invite(
    token: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    invite = (
        db.query(MediationInvite)
        .filter(MediationInvite.token_hash == hash_token(token))
        .first()
    )

    if not invite:
        raise HTTPException(status_code=404, detail="Einladung ungültig")

    if invite.status != "pending":
        raise HTTPException(status_code=400, detail="Einladung nicht mehr gültig")

    # SQLite stores naive datetimes; compare both as UTC naive
    expires_at = invite.expires_at.replace(tzinfo=None) if invite.expires_at.tzinfo else invite.expires_at
    if expires_at < datetime.now(timezone.utc).replace(tzinfo=None):
        invite.status = "expired"
        db.commit()
        raise HTTPException(status_code=400, detail="Einladung abgelaufen")

    if invite.invited_email and invite.invited_email.lower() != user.email.lower():
        raise HTTPException(
            status_code=403,
            detail="Diese Einladung gehört zu einer anderen E-Mail-Adresse",
        )

    existing_participant = (
        db.query(MediationParticipant)
        .filter(
            MediationParticipant.mediation_id == invite.mediation_id,
            MediationParticipant.user_id == user.id,
        )
        .first()
    )

    if not existing_participant:
        participant = MediationParticipant(
            mediation_id=invite.mediation_id,
            user_id=user.id,
            role=invite.role,
        )
        db.add(participant)

    invite.status = "accepted"
    invite.accepted_at = datetime.now(timezone.utc)

    db.commit()

    return {
        "mediation_id": invite.mediation_id,
        "status": "accepted",
    }