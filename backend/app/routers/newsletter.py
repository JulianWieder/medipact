"""Newsletter: Anmeldung mit Double-Opt-in, Abmeldung, Versand.

Der Ablauf ist bewusst streng, weil Werbemails in Deutschland ohne
nachweisbare Einwilligung abmahnfähig sind (§ 7 UWG):

    Formular  ->  Eintrag (confirmed = False)  ->  Bestätigungsmail
              ->  Klick   ->  confirmed = True ->  erst jetzt Empfänger

Versendet wird ausschließlich an `confirmed = True AND active = True`.
Jede Mail trägt einen Abmeldelink, der ohne Login funktioniert.

Öffentlich: /subscribe, /confirm, /unsubscribe.
Intern: /subscribers (Mediator/Admin lesen) und /campaigns (nur Admin).
"""
from __future__ import annotations

import html as html_mod
import re
import secrets
import time
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app import email as email_service
from app.database import SessionLocal, get_db
from app.models.newsletter_campaign import NewsletterCampaign, NewsletterDelivery
from app.models.newsletter_subscriber import NewsletterSubscriber
from app.models.user import User
from app.rate_limit import RateLimiter
from app.security import get_current_db_user

router = APIRouter(prefix="/newsletter", tags=["newsletter"])

# Anmeldung: max 5 pro Minute pro IP (missbrauchsresistent, aber großzügig).
_subscribe_limiter = RateLimiter(max_requests=5, window_seconds=60)
# Bestätigen/Abmelden werden von Mailprogrammen teils mehrfach aufgerufen –
# hier großzügiger, sonst scheitert eine echte Abmeldung an einem Vorschau-Klick.
_token_limiter = RateLimiter(max_requests=30, window_seconds=60)

_READ_ROLES = {"mediator", "admin"}
_SEND_ROLES = {"admin"}
# Pragmatische E-Mail-Validierung (kein RFC-Vollcheck – der bringt hier nichts).
_EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

# Pause zwischen zwei Mails beim Massenversand. Der Mailserver ist derselbe,
# der auch Kontomails verschickt – ein ungedrosselter Blast würde die Zustellung
# der wichtigen Mails gefährden.
_SEND_DELAY_SECONDS = 0.5


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _normalize_email(raw: str) -> str:
    return raw.strip().lower()


def _client_ip(request: Request) -> Optional[str]:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()[:64]
    return request.client.host if request.client else None


def _unsubscribe_url(token: str) -> str:
    from app.config import settings

    return f"{settings.APP_BASE_URL}/newsletter/abmelden?token={token}"


# ═══════════════════════════════════════════════════════════════════════════
# Öffentlich
# ═══════════════════════════════════════════════════════════════════════════


class NewsletterSubscribe(BaseModel):
    email: str
    source: Optional[str] = None


class TokenPayload(BaseModel):
    token: str


@router.post("/subscribe", status_code=201)
def subscribe(
    payload: NewsletterSubscribe,
    request: Request,
    background: BackgroundTasks,
    db: Session = Depends(get_db),
) -> dict:
    _subscribe_limiter.check(request)

    email = _normalize_email(payload.email or "")
    if not _EMAIL_RE.match(email):
        raise HTTPException(status_code=400, detail="Bitte eine gültige E-Mail-Adresse angeben.")

    source = (payload.source or "").strip()[:50] or None
    ip = _client_ip(request)

    existing = (
        db.query(NewsletterSubscriber)
        .filter(NewsletterSubscriber.email == email)
        .first()
    )

    if existing and existing.confirmed and existing.active:
        # Schon bestätigter Empfänger: nichts tun, aber nach außen dieselbe
        # Antwort geben wie sonst – die Anmeldemaske darf nicht verraten,
        # welche Adressen im Verteiler stehen.
        return {"success": True, "pending": True}

    token = secrets.token_urlsafe(32)

    if existing:
        # Auch eine frühere Anmeldung wird neu bestätigt: Wer sich abgemeldet
        # hatte, muss erneut einwilligen, und für Alt-Einträge aus der Zeit
        # ohne Double-Opt-in gibt es sonst nie einen Nachweis.
        existing.active = True
        existing.unsubscribed_at = None
        existing.confirmed = False
        existing.confirm_token = token
        existing.consent_ip = ip
        existing.consent_at = _now()
        if source:
            existing.source = source
    else:
        db.add(
            NewsletterSubscriber(
                email=email,
                source=source,
                active=True,
                confirmed=False,
                confirm_token=token,
                consent_ip=ip,
                consent_at=_now(),
            )
        )

    db.commit()

    # Der SMTP-Versand darf die Antwort nicht aufhalten (und ein kaputter
    # Mailserver darf keine 500 auf der Landing Page erzeugen).
    background.add_task(_send_confirm_mail, email, token)

    return {"success": True, "pending": True}


def _send_confirm_mail(email: str, token: str) -> None:
    try:
        email_service.send_newsletter_confirm_email(email, token)
    except Exception as exc:  # noqa: BLE001 – Versand darf nie durchschlagen
        print(f"[newsletter] Bestätigungsmail an {email} fehlgeschlagen: {exc}")


@router.post("/confirm")
def confirm(payload: TokenPayload, request: Request, db: Session = Depends(get_db)) -> dict:
    _token_limiter.check(request)

    token = (payload.token or "").strip()
    if not token:
        raise HTTPException(status_code=400, detail="Kein Bestätigungscode übergeben.")

    subscriber = (
        db.query(NewsletterSubscriber)
        .filter(NewsletterSubscriber.confirm_token == token)
        .first()
    )

    if not subscriber:
        # Zweiter Klick auf denselben Link: Das Token ist nach der Bestätigung
        # gelöscht. Ein Fehler wäre hier irreführend – der Nutzer hat alles
        # richtig gemacht.
        raise HTTPException(
            status_code=404,
            detail="Dieser Bestätigungslink ist nicht mehr gültig. Möglicherweise ist die Anmeldung bereits bestätigt.",
        )

    subscriber.confirmed = True
    subscriber.confirmed_at = _now()
    subscriber.confirm_token = None
    subscriber.active = True
    subscriber.unsubscribed_at = None
    if not subscriber.unsubscribe_token:
        subscriber.unsubscribe_token = secrets.token_urlsafe(32)
    db.commit()

    return {"success": True, "email": subscriber.email}


@router.post("/unsubscribe")
def unsubscribe(payload: TokenPayload, request: Request, db: Session = Depends(get_db)) -> dict:
    _token_limiter.check(request)

    token = (payload.token or "").strip()
    if not token:
        raise HTTPException(status_code=400, detail="Kein Abmeldecode übergeben.")

    subscriber = (
        db.query(NewsletterSubscriber)
        .filter(NewsletterSubscriber.unsubscribe_token == token)
        .first()
    )
    if not subscriber:
        raise HTTPException(status_code=404, detail="Dieser Abmeldelink ist ungültig.")

    if subscriber.active:
        subscriber.active = False
        subscriber.unsubscribed_at = _now()
        db.commit()

    # Idempotent: mehrfaches Abmelden ist kein Fehler.
    return {"success": True, "email": subscriber.email}


# ═══════════════════════════════════════════════════════════════════════════
# Verwaltung
# ═══════════════════════════════════════════════════════════════════════════


def _require_read(user: User) -> None:
    if user.role not in _READ_ROLES:
        raise HTTPException(
            status_code=403,
            detail="Nur Mediatoren/Admins dürfen die Newsletter-Anmeldungen einsehen.",
        )


def _require_send(user: User) -> None:
    if user.role not in _SEND_ROLES:
        raise HTTPException(
            status_code=403, detail="Nur Administratoren dürfen Newsletter versenden."
        )


def _subscriber_dict(s: NewsletterSubscriber) -> dict:
    return {
        "id": s.id,
        "email": s.email,
        "active": s.active,
        "confirmed": s.confirmed,
        "source": s.source,
        "created_at": s.created_at.isoformat() if s.created_at else None,
        "confirmed_at": s.confirmed_at.isoformat() if s.confirmed_at else None,
        "unsubscribed_at": s.unsubscribed_at.isoformat() if s.unsubscribed_at else None,
        "consent_ip": s.consent_ip,
    }


@router.get("/subscribers")
def list_subscribers(
    status: str = "all",
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
) -> dict:
    """Alle Anmeldungen mit Zählern.

    `status`: all | confirmed | pending | unsubscribed. Die Zähler beziehen
    sich immer auf den gesamten Verteiler, damit die Kopfzeile beim Filtern
    nicht springt.
    """
    _require_read(user)

    all_rows = (
        db.query(NewsletterSubscriber)
        .order_by(NewsletterSubscriber.created_at.desc())
        .all()
    )

    counts = {
        "total": len(all_rows),
        "confirmed": sum(1 for s in all_rows if s.confirmed and s.active),
        "pending": sum(1 for s in all_rows if not s.confirmed and s.active),
        "unsubscribed": sum(1 for s in all_rows if not s.active),
    }

    if status == "confirmed":
        rows = [s for s in all_rows if s.confirmed and s.active]
    elif status == "pending":
        rows = [s for s in all_rows if not s.confirmed and s.active]
    elif status == "unsubscribed":
        rows = [s for s in all_rows if not s.active]
    else:
        rows = all_rows

    return {"counts": counts, "subscribers": [_subscriber_dict(s) for s in rows]}


@router.post("/subscribers/{subscriber_id}/unsubscribe")
def unsubscribe_by_admin(
    subscriber_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
) -> dict:
    _require_send(user)

    subscriber = db.get(NewsletterSubscriber, subscriber_id)
    if not subscriber:
        raise HTTPException(status_code=404, detail="Anmeldung nicht gefunden.")

    subscriber.active = False
    subscriber.unsubscribed_at = _now()
    db.commit()
    return _subscriber_dict(subscriber)


# ── Kampagnen ────────────────────────────────────────────────────────────────


class CampaignPayload(BaseModel):
    subject: str
    heading: Optional[str] = None
    body: Optional[str] = None
    cta_label: Optional[str] = None
    cta_url: Optional[str] = None


class TestSendPayload(BaseModel):
    email: str


def _campaign_dict(c: NewsletterCampaign) -> dict:
    return {
        "id": c.id,
        "subject": c.subject,
        "heading": c.heading,
        "body": c.body,
        "cta_label": c.cta_label,
        "cta_url": c.cta_url,
        "status": c.status,
        "created_by": c.created_by,
        "created_at": c.created_at.isoformat() if c.created_at else None,
        "sent_at": c.sent_at.isoformat() if c.sent_at else None,
        "sent_count": c.sent_count,
        "failed_count": c.failed_count,
    }


def _paragraphs(body: str) -> list[str]:
    """Fließtext in HTML-sichere Absätze zerlegen.

    Absätze werden durch Leerzeilen getrennt, einfache Zeilenumbrüche bleiben
    als <br> erhalten. Der Text wird escaped: der Editor ist ein Textfeld,
    kein HTML-Editor – so kann ein vergessenes < das Layout nicht zerlegen.
    """
    blocks = [b.strip() for b in re.split(r"\n\s*\n", body or "") if b.strip()]
    return [html_mod.escape(b).replace("\n", "<br />") for b in blocks]


def _campaign_message(campaign: NewsletterCampaign, to_email: str, unsub_token: str):
    cta = (
        (campaign.cta_label.strip(), campaign.cta_url.strip())
        if campaign.cta_label and campaign.cta_url
        else None
    )
    return email_service.build_newsletter_email(
        to_email=to_email,
        subject=campaign.subject,
        heading=campaign.heading or campaign.subject,
        paragraphs=_paragraphs(campaign.body),
        cta=cta,
        unsubscribe_url=_unsubscribe_url(unsub_token),
    )


@router.get("/campaigns")
def list_campaigns(
    db: Session = Depends(get_db), user: User = Depends(get_current_db_user)
) -> list[dict]:
    _require_read(user)
    campaigns = (
        db.query(NewsletterCampaign).order_by(NewsletterCampaign.created_at.desc()).all()
    )
    return [_campaign_dict(c) for c in campaigns]


@router.post("/campaigns", status_code=201)
def create_campaign(
    payload: CampaignPayload,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
) -> dict:
    _require_send(user)

    subject = (payload.subject or "").strip()
    if not subject:
        raise HTTPException(status_code=400, detail="Der Betreff fehlt.")

    campaign = NewsletterCampaign(
        subject=subject,
        heading=(payload.heading or subject).strip(),
        body=(payload.body or "").strip(),
        cta_label=(payload.cta_label or "").strip() or None,
        cta_url=(payload.cta_url or "").strip() or None,
        status="draft",
        created_by=user.email,
    )
    db.add(campaign)
    db.commit()
    db.refresh(campaign)
    return _campaign_dict(campaign)


@router.get("/campaigns/{campaign_id}")
def get_campaign(
    campaign_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
) -> dict:
    _require_read(user)
    campaign = db.get(NewsletterCampaign, campaign_id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Newsletter nicht gefunden.")

    deliveries = (
        db.query(NewsletterDelivery)
        .filter(NewsletterDelivery.campaign_id == campaign_id)
        .order_by(NewsletterDelivery.sent_at.desc())
        .all()
    )
    data = _campaign_dict(campaign)
    data["failures"] = [
        {"email": d.email, "error": d.error, "sent_at": d.sent_at.isoformat() if d.sent_at else None}
        for d in deliveries
        if d.status == "failed"
    ]
    return data


@router.patch("/campaigns/{campaign_id}")
def update_campaign(
    campaign_id: int,
    payload: CampaignPayload,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
) -> dict:
    _require_send(user)
    campaign = db.get(NewsletterCampaign, campaign_id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Newsletter nicht gefunden.")
    if campaign.status != "draft":
        raise HTTPException(
            status_code=400,
            detail="Ein bereits versendeter Newsletter lässt sich nicht mehr ändern.",
        )

    subject = (payload.subject or "").strip()
    if not subject:
        raise HTTPException(status_code=400, detail="Der Betreff fehlt.")

    campaign.subject = subject
    campaign.heading = (payload.heading or subject).strip()
    campaign.body = (payload.body or "").strip()
    campaign.cta_label = (payload.cta_label or "").strip() or None
    campaign.cta_url = (payload.cta_url or "").strip() or None
    db.commit()
    return _campaign_dict(campaign)


@router.delete("/campaigns/{campaign_id}")
def delete_campaign(
    campaign_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
) -> dict:
    _require_send(user)
    campaign = db.get(NewsletterCampaign, campaign_id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Newsletter nicht gefunden.")
    if campaign.status != "draft":
        raise HTTPException(
            status_code=400, detail="Versendete Newsletter bleiben als Beleg erhalten."
        )
    db.delete(campaign)
    db.commit()
    return {"success": True}


@router.post("/campaigns/{campaign_id}/test")
def send_test(
    campaign_id: int,
    payload: TestSendPayload,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
) -> dict:
    """Testversand an eine einzelne Adresse – ohne Eintrag im Verteiler."""
    _require_send(user)

    campaign = db.get(NewsletterCampaign, campaign_id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Newsletter nicht gefunden.")

    to_email = _normalize_email(payload.email or "")
    if not _EMAIL_RE.match(to_email):
        raise HTTPException(status_code=400, detail="Bitte eine gültige E-Mail-Adresse angeben.")

    # Der Abmeldelink im Test zeigt auf ein Dummy-Token: er ist im Layout
    # sichtbar, führt aber zu keiner echten Abmeldung.
    msg = _campaign_message(campaign, to_email, "test-versand")
    try:
        with email_service.smtp_session() as server:
            email_service.send_on_session(server, msg, to_email)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=502, detail=f"Versand fehlgeschlagen: {exc}")

    return {"success": True}


@router.post("/campaigns/{campaign_id}/send")
def send_campaign(
    campaign_id: int,
    background: BackgroundTasks,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
) -> dict:
    """Startet den Versand an alle bestätigten Empfänger.

    Läuft im Hintergrund: bei einigen hundert Adressen und einer halben
    Sekunde Pause dauert das länger als jedes vertretbare Request-Timeout.
    """
    _require_send(user)

    campaign = db.get(NewsletterCampaign, campaign_id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Newsletter nicht gefunden.")
    if campaign.status == "sending":
        raise HTTPException(status_code=400, detail="Dieser Newsletter wird gerade versendet.")
    if campaign.status == "sent":
        raise HTTPException(status_code=400, detail="Dieser Newsletter wurde bereits versendet.")
    if not campaign.body.strip():
        raise HTTPException(status_code=400, detail="Der Newsletter hat keinen Text.")

    recipients = (
        db.query(NewsletterSubscriber)
        .filter(
            NewsletterSubscriber.confirmed.is_(True),
            NewsletterSubscriber.active.is_(True),
        )
        .count()
    )
    if recipients == 0:
        raise HTTPException(
            status_code=400, detail="Es gibt keine bestätigten Empfänger."
        )

    campaign.status = "sending"
    db.commit()

    background.add_task(_run_send, campaign_id)
    return {"success": True, "recipients": recipients}


def _run_send(campaign_id: int) -> None:
    """Der eigentliche Versand – eigene Session, weil der Request längst vorbei ist."""
    db = SessionLocal()
    try:
        campaign = db.get(NewsletterCampaign, campaign_id)
        if not campaign:
            return

        # Bereits erreichte Adressen überspringen: ein zweiter Anlauf nach einem
        # Abbruch darf niemandem die Mail doppelt schicken.
        already = {
            row.email
            for row in db.query(NewsletterDelivery)
            .filter(
                NewsletterDelivery.campaign_id == campaign_id,
                NewsletterDelivery.status == "sent",
            )
            .all()
        }

        recipients = (
            db.query(NewsletterSubscriber)
            .filter(
                NewsletterSubscriber.confirmed.is_(True),
                NewsletterSubscriber.active.is_(True),
            )
            .all()
        )

        sent = 0
        failed = 0
        try:
            with email_service.smtp_session() as server:
                for subscriber in recipients:
                    if subscriber.email in already:
                        continue

                    if not subscriber.unsubscribe_token:
                        subscriber.unsubscribe_token = secrets.token_urlsafe(32)
                        db.commit()

                    try:
                        msg = _campaign_message(
                            campaign, subscriber.email, subscriber.unsubscribe_token
                        )
                        email_service.send_on_session(server, msg, subscriber.email)
                        status, error = "sent", None
                        sent += 1
                    except Exception as exc:  # noqa: BLE001 – eine Adresse darf nicht alles stoppen
                        status, error = "failed", str(exc)[:500]
                        failed += 1

                    db.add(
                        NewsletterDelivery(
                            campaign_id=campaign_id,
                            email=subscriber.email,
                            status=status,
                            error=error,
                            sent_at=_now(),
                        )
                    )
                    db.commit()
                    time.sleep(_SEND_DELAY_SECONDS)
        except Exception as exc:  # noqa: BLE001 – z. B. Verbindungsabbruch zum Mailserver
            print(f"[newsletter] Versand {campaign_id} abgebrochen: {exc}")

        campaign.sent_count = (campaign.sent_count or 0) + sent
        campaign.failed_count = (campaign.failed_count or 0) + failed
        campaign.status = "sent"
        campaign.sent_at = _now()
        db.commit()
    finally:
        db.close()
