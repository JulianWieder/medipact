"""Integrationen mit Drittanbieter-Diensten.

Aktuell: Google Meet – erzeugt on-demand einen Videokonferenz-Link, den der
Mediator in einen Workflow-Schritt (meeting_url) oder pro Fall übernehmen kann.
Nur Mediatoren/Admins dürfen Links erzeugen; die Google-Zugangsdaten liegen
ausschließlich serverseitig (siehe app/services/google_meet.py).
"""
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.models.user import User
from app.security import get_current_db_user
from app.services import google_meet

router = APIRouter(prefix="/integrations", tags=["integrations"])

# Konsistent mit _ADMIN_ROLES in phase_step_defaults.py / auth.py.
_ADMIN_ROLES = {"mediator", "admin"}


def _require_admin(user: User) -> None:
    if user.role not in _ADMIN_ROLES:
        raise HTTPException(
            status_code=403,
            detail="Nur Mediatoren/Admins können Meet-Links erzeugen.",
        )


class MeetLinkRequest(BaseModel):
    # Titel des Kalendertermins (z.B. Fall-Titel). Optional – hat einen Default.
    summary: Optional[str] = None
    # Dauer in Minuten (nur für den Kalendereintrag; der Meet-Raum bleibt nutzbar).
    duration_minutes: int = 60


class MeetLinkResponse(BaseModel):
    meeting_url: str
    event_id: Optional[str] = None
    html_link: Optional[str] = None
    start: Optional[str] = None
    end: Optional[str] = None


@router.get("/google-meet/status")
def google_meet_status(user: User = Depends(get_current_db_user)):
    """Meldet, ob Google Meet serverseitig verbunden ist (für UI-Hinweise)."""
    _require_admin(user)
    return {"configured": google_meet.is_configured()}


@router.post("/google-meet/link", response_model=MeetLinkResponse)
def create_google_meet_link(
    payload: MeetLinkRequest,
    user: User = Depends(get_current_db_user),
):
    """Erzeugt einen neuen Google-Meet-Raum und gibt den Link zurück."""
    _require_admin(user)
    result = google_meet.create_meet_link(
        summary=payload.summary or "medipact Mediation",
        duration_minutes=payload.duration_minutes,
    )
    return result
