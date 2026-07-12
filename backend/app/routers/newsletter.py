"""Newsletter-Anmeldungen.

Öffentlicher Endpunkt für die Anmeldung über Landing Page / Footer
(POST /newsletter/subscribe) sowie ein Admin-Endpunkt zum Auflisten der
Anmeldungen (GET /newsletter/subscribers). Einfaches Speichern ohne
Double-Opt-in – die Anmeldung ist sofort aktiv.
"""
from __future__ import annotations

import re
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.newsletter_subscriber import NewsletterSubscriber
from app.models.user import User
from app.rate_limit import RateLimiter
from app.security import get_current_db_user

router = APIRouter(prefix="/newsletter", tags=["newsletter"])

# Anmeldung: max 5 pro Minute pro IP (missbrauchsresistent, aber großzügig).
_subscribe_limiter = RateLimiter(max_requests=5, window_seconds=60)

_ADMIN_ROLES = {"mediator", "admin"}
# Pragmatische E-Mail-Validierung (kein RFC-Vollcheck – der bringt hier nichts).
_EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


class NewsletterSubscribe(BaseModel):
    email: str
    source: Optional[str] = None


def _normalize_email(raw: str) -> str:
    return raw.strip().lower()


@router.post("/subscribe", status_code=201)
def subscribe(
    payload: NewsletterSubscribe,
    request: Request,
    db: Session = Depends(get_db),
) -> dict:
    _subscribe_limiter.check(request)

    email = _normalize_email(payload.email or "")
    if not _EMAIL_RE.match(email):
        raise HTTPException(status_code=400, detail="Bitte eine gültige E-Mail-Adresse angeben.")

    source = (payload.source or "").strip()[:50] or None

    existing = (
        db.query(NewsletterSubscriber)
        .filter(NewsletterSubscriber.email == email)
        .first()
    )
    if existing:
        # Idempotent: erneute Anmeldung reaktiviert einen abgemeldeten Eintrag,
        # meldet ansonsten schlicht Erfolg (kein Fehler, keine Info-Leak).
        if not existing.active:
            existing.active = True
            existing.unsubscribed_at = None
            if source:
                existing.source = source
            db.commit()
        return {"success": True, "already_subscribed": True}

    subscriber = NewsletterSubscriber(email=email, source=source, active=True)
    db.add(subscriber)
    db.commit()
    return {"success": True, "already_subscribed": False}


def _require_admin(user: User) -> None:
    if user.role not in _ADMIN_ROLES:
        raise HTTPException(
            status_code=403,
            detail="Nur Mediatoren/Admins dürfen die Newsletter-Anmeldungen einsehen.",
        )


@router.get("/subscribers")
def list_subscribers(
    active_only: bool = True,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
) -> list[dict]:
    _require_admin(user)

    query = db.query(NewsletterSubscriber)
    if active_only:
        query = query.filter(NewsletterSubscriber.active.is_(True))
    subscribers = query.order_by(NewsletterSubscriber.created_at.desc()).all()

    return [
        {
            "id": s.id,
            "email": s.email,
            "active": s.active,
            "source": s.source,
            "created_at": s.created_at.isoformat() if s.created_at else None,
        }
        for s in subscribers
    ]
