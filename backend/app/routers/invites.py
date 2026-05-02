from datetime import datetime, timedelta
import hashlib
import secrets

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.mediation_invite import MediationInvite
from app.security import get_current_user

# später ggf. anpassen:
# from app.models.participant import Participant
# from app.auth import get_current_user

router = APIRouter(tags=["invites"])


def create_invite_token() -> str:
    return secrets.token_urlsafe(32)


def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


@router.post("/mediations/{mediation_id}/invites")
def create_invite(
    mediation_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    token = create_invite_token()

    invite = MediationInvite(
        mediation_id=mediation_id,
        token_hash=hash_token(token),
        role="other_party",
        status="pending",
        expires_at=datetime.utcnow() + timedelta(days=7),
    )

    db.add(invite)
    db.commit()
    db.refresh(invite)

    return {
        "invite_url": f"http://localhost:3000/invite/{token}"
    }


@router.post("/invites/{token}/accept")
def accept_invite(token: str, db: Session = Depends(get_db)):
    invite = (
        db.query(MediationInvite)
        .filter(MediationInvite.token_hash == hash_token(token))
        .first()
    )

    if not invite:
        raise HTTPException(status_code=404, detail="Einladung ungültig")

    if invite.status != "pending":
        raise HTTPException(status_code=400, detail="Einladung nicht mehr gültig")

    if invite.expires_at < datetime.utcnow():
        invite.status = "expired"
        db.commit()
        raise HTTPException(status_code=400, detail="Einladung abgelaufen")

    invite.status = "accepted"
    invite.accepted_at = datetime.utcnow()

    db.commit()

    return {
        "mediation_id": invite.mediation_id,
        "status": "accepted",
    }