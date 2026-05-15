from datetime import datetime, timedelta, timezone
import hashlib
import logging
import secrets
import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.mediation import Mediation
from app.models.mediation_invite import MediationInvite
from app.models.mediation_participant import MediationParticipant
from app.models.user import User
from app.rate_limit import invite_limiter
from app.security import get_current_db_user, require_mediation_access

logger = logging.getLogger(__name__)

router = APIRouter(tags=["invites"])


class InviteCreate(BaseModel):
    invited_email: EmailStr
    role: str = "other_party"


def create_invite_token() -> str:
    return secrets.token_urlsafe(32)


def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def send_invite_email(to_email: str, invite_url: str, mediation_title: str, role: str) -> None:
    """Send invitation email via SMTP. Logs errors without raising so invite creation always succeeds."""
    if not settings.SMTP_HOST or not settings.SMTP_USER:
        logger.warning("SMTP not configured (SMTP_HOST/SMTP_USER missing) -- skipping email to %s", to_email)
        return

    role_labels = {
        "other_party": "Gegenpartei",
        "mediator": "Mediator",
        "observer": "Beobachter",
    }
    role_label = role_labels.get(role, role)

    html_body = f"""<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Einladung zur Mediation</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
          <tr>
            <td style="background:#059669;padding:32px 40px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#ffffff;border-radius:10px;width:42px;height:42px;text-align:center;vertical-align:middle;">
                    <span style="font-size:22px;font-weight:900;color:#059669;line-height:42px;">M</span>
                  </td>
                  <td style="padding-left:12px;">
                    <span style="font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">medipact</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#059669;text-transform:uppercase;letter-spacing:1px;">Einladung</p>
              <h1 style="margin:0 0 24px;font-size:26px;font-weight:800;color:#0f172a;line-height:1.3;">
                Du wurdest zu einer Mediation eingeladen
              </h1>
              <p style="margin:0 0 16px;font-size:15px;color:#475569;line-height:1.7;">
                Du wurdest als <strong style="color:#0f172a;">{role_label}</strong> zu folgendem Mediationsverfahren eingeladen:
              </p>
              <div style="background:#f1f5f9;border-radius:12px;padding:20px 24px;margin:0 0 28px;">
                <p style="margin:0;font-size:16px;font-weight:700;color:#0f172a;">{mediation_title}</p>
              </div>
              <p style="margin:0 0 28px;font-size:15px;color:#475569;line-height:1.7;">
                Klicke auf den Button, um die Einladung anzunehmen und dem Verfahren beizutreten.
                Der Link ist 7 Tage gueltig.
              </p>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-radius:12px;background:#059669;">
                    <a href="{invite_url}"
                       style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:12px;">
                      Einladung annehmen
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:32px 0 0;font-size:13px;color:#94a3b8;line-height:1.7;">
                Falls der Button nicht funktioniert, kopiere diesen Link in deinen Browser:<br />
                <a href="{invite_url}" style="color:#059669;word-break:break-all;">{invite_url}</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#f8fafc;padding:24px 40px;border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;">
                Diese E-Mail wurde automatisch von medipact versandt. Bitte antworte nicht auf diese E-Mail.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"Einladung zur Mediation: {mediation_title}"
    msg["From"] = settings.EMAIL_FROM
    msg["To"] = to_email
    msg.attach(MIMEText(html_body, "html", "utf-8"))

    try:
        if settings.SMTP_USE_SSL:
            context = ssl.create_default_context()
            with smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT, context=context) as server:
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                server.sendmail(settings.SMTP_USER, to_email, msg.as_string())
        else:
            with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
                if settings.SMTP_USE_TLS:
                    server.starttls(context=ssl.create_default_context())
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                server.sendmail(settings.SMTP_USER, to_email, msg.as_string())
        logger.info("Invitation email sent to %s", to_email)
    except Exception as exc:
        logger.error("Failed to send invitation email to %s: %s", to_email, exc)


@router.post("/mediations/{mediation_id}/invites")
def create_invite(
    request: Request,
    mediation_id: int,
    payload: InviteCreate,
    db: Session = Depends(get_db),
    mediation=Depends(require_mediation_access),
):
    invite_limiter.check(request)
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

    invite_url = f"{settings.APP_BASE_URL}/dashboard/invitations?token={token}"

    mediation_title = mediation.title or "Neue Mediation"
    send_invite_email(payload.invited_email, invite_url, mediation_title, payload.role)

    return {
        "invite_url": invite_url,
        "token": token,
    }


@router.get("/invites/me")
def get_my_invites(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    now_naive = datetime.now(timezone.utc).replace(tzinfo=None)

    rows = (
        db.query(MediationInvite, Mediation)
        .join(Mediation, MediationInvite.mediation_id == Mediation.id)
        .filter(
            MediationInvite.invited_email == user.email,
            MediationInvite.status == "pending",
        )
        .all()
    )

    result = []
    expired_ids = []
    for invite, mediation in rows:
        expires_naive = invite.expires_at.replace(tzinfo=None) if invite.expires_at.tzinfo else invite.expires_at
        if expires_naive < now_naive:
            expired_ids.append(invite.id)
            continue
        result.append({
            "invite_id": invite.id,
            "mediation_id": mediation.id,
            "mediation_title": mediation.title,
            "mediation_type": mediation.mediation_type,
            "role": invite.role,
            "expires_at": invite.expires_at.isoformat(),
        })

    if expired_ids:
        db.query(MediationInvite).filter(MediationInvite.id.in_(expired_ids)).update(
            {"status": "expired"}, synchronize_session=False
        )
        db.commit()

    return result


@router.post("/invites/{invite_id}/accept-direct")
def accept_invite_direct(
    invite_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    invite = db.query(MediationInvite).filter(MediationInvite.id == invite_id).first()

    if not invite:
        raise HTTPException(status_code=404, detail="Einladung nicht gefunden")

    if invite.status != "pending":
        raise HTTPException(status_code=400, detail="Einladung nicht mehr gueltig")

    expires_naive = invite.expires_at.replace(tzinfo=None) if invite.expires_at.tzinfo else invite.expires_at
    if expires_naive < datetime.now(timezone.utc).replace(tzinfo=None):
        invite.status = "expired"
        db.commit()
        raise HTTPException(status_code=400, detail="Einladung abgelaufen")

    if not invite.invited_email or invite.invited_email.lower() != user.email.lower():
        raise HTTPException(status_code=403, detail="Diese Einladung gehoert zu einer anderen E-Mail-Adresse")

    existing = (
        db.query(MediationParticipant)
        .filter(
            MediationParticipant.mediation_id == invite.mediation_id,
            MediationParticipant.user_id == user.id,
        )
        .first()
    )

    if not existing:
        db.add(MediationParticipant(
            mediation_id=invite.mediation_id,
            user_id=user.id,
            role=invite.role,
        ))

    invite.status = "accepted"
    invite.accepted_at = datetime.now(timezone.utc)
    db.commit()

    return {"mediation_id": invite.mediation_id, "status": "accepted"}


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
        raise HTTPException(status_code=404, detail="Einladung ungueltig")

    if invite.status != "pending":
        raise HTTPException(status_code=400, detail="Einladung nicht mehr gueltig")

    expires_at = invite.expires_at.replace(tzinfo=None) if invite.expires_at.tzinfo else invite.expires_at
    if expires_at < datetime.now(timezone.utc).replace(tzinfo=None):
        invite.status = "expired"
        db.commit()
        raise HTTPException(status_code=400, detail="Einladung abgelaufen")

    if not invite.invited_email or invite.invited_email.lower() != user.email.lower():
        raise HTTPException(
            status_code=403,
            detail="Diese Einladung gehoert zu einer anderen E-Mail-Adresse",
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
