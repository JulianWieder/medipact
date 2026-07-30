from datetime import datetime, timedelta, timezone
import hashlib
import json
import logging
import mimetypes
import os
import secrets
import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile
from fastapi.responses import FileResponse
from pydantic import BaseModel, EmailStr
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.mediation import Mediation
from app.models.mediation_invite import MediationInvite
from app.models.invite_meet_recording import InviteMeetRecording
from app.models.mediation_participant import MediationParticipant
from app.models.user import User
from app.models.phase_step_default import SHARED_MEDIATION_TYPE, PhaseStepDefault
from app.prompts import get_prompt
from app.rate_limit import invite_limiter
from app.security import get_current_db_user, require_mediation_access
from app.services import google_meet
from app.services.llm import ai_complete

logger = logging.getLogger(__name__)

router = APIRouter(tags=["invites"])

# Erlaubte Video-Formate für Einladungs-Botschaften (Browser-Aufnahme liefert i.d.R. webm)
_ALLOWED_VIDEO_EXTENSIONS = {".webm", ".mp4", ".mov", ".ogg"}


class VideoTranscribeRequest(BaseModel):
    video_token: str


class MessageImproveRequest(BaseModel):
    text: str


class InviteGenerateRequest(BaseModel):
    # Kurze, formlose Beschreibung des Nutzers, aus der Claude einen
    # professionellen Einladungstext, eine Überschrift und einen Fall-Titel macht.
    description: str


class MeetRecordingStartRequest(BaseModel):
    # "video" oder "audio" – steuert nur die Darstellung; Meet nimmt technisch
    # immer A/V auf (bei "audio" schaltet der Nutzer die Kamera aus).
    kind: str = "video"


class InviteCreate(BaseModel):
    invited_email: EmailStr
    role: str = "other_party"
    # Persönliche Nachricht an die Gegenseite, wird vor dem Versand per KI
    # freundlich umformuliert (siehe paraphrase_personal_message).
    personal_message: str | None = None
    # Rückgabewert von POST /mediations/{id}/invites/video — verknüpft eine
    # zuvor hochgeladene Video-Botschaft mit dieser Einladung.
    video_token: str | None = None
    # Rückgabewert von POST /mediations/{id}/invites/meet-recording/start —
    # verknüpft eine über Google Meet aufgenommene Botschaft mit dieser Einladung.
    meet_recording_token: str | None = None
    # Optionale Überschrift/Betreff der Einladung (vom Nutzer editierbar, per
    # Claude vorgeschlagen). Ersetzt in der E-Mail die Standard-Überschrift.
    invitation_heading: str | None = None


def create_invite_token() -> str:
    return secrets.token_urlsafe(32)


def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def _invite_video_dir() -> str:
    directory = settings.INVITE_VIDEO_DIR
    os.makedirs(directory, exist_ok=True)
    return directory


def _safe_video_path(filename: str) -> str:
    """Resolves a stored video_filename to an absolute path, guarding against path traversal."""
    base = os.path.abspath(_invite_video_dir())
    candidate = os.path.abspath(os.path.join(base, os.path.basename(filename)))
    if not candidate.startswith(base + os.sep):
        raise HTTPException(status_code=400, detail="Ungültiger Dateiname")
    return candidate


def paraphrase_personal_message(message: str, mediation_title: str) -> str:
    """Formuliert die persönliche Nachricht per Claude warm und einladend um.

    Fällt auf den Originaltext zurück, wenn keine KI konfiguriert ist oder die
    Anfrage fehlschlägt -- die Einladung soll dadurch nie blockiert werden.
    """
    message = (message or "").strip()
    if not message:
        return message

    prompt = get_prompt("invite_paraphrase", mediation_title=mediation_title, message=message)
    try:
        text = ai_complete(prompt, max_tokens=300)
        return text or message
    except Exception as exc:
        # Nie blockieren: bei fehlendem Key/Fehler den Originaltext behalten.
        logger.error("Paraphrasierung der Einladungsnachricht fehlgeschlagen: %s", exc)
        return message


def transcribe_invite_video(path: str) -> str:
    """Transkribiert die Audiospur einer Einladungs-Video-Botschaft per OpenAI Whisper.

    Wirft eine HTTPException, wenn keine KI konfiguriert ist oder die Transkription
    fehlschlägt -- anders als die Paraphrasierung blockiert das hier bewusst die
    Anfrage, weil der Nutzer aktiv auf das Transkript wartet und sofort Feedback
    braucht, statt eine stillschweigend leere Nachricht zu bekommen.
    """
    if not settings.OPENAI_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="Transkription ist nicht konfiguriert (OPENAI_API_KEY fehlt).",
        )

    try:
        import openai

        client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
        with open(path, "rb") as audio_file:
            result = client.audio.transcriptions.create(
                model=settings.OPENAI_TRANSCRIBE_MODEL,
                file=audio_file,
                language="de",
            )
        text = (getattr(result, "text", "") or "").strip()
        return text
    except HTTPException:
        raise
    except Exception as exc:
        logger.error("Transkription der Einladungs-Video-Botschaft fehlgeschlagen: %s", exc)
        raise HTTPException(
            status_code=502,
            detail="Video konnte nicht transkribiert werden. Bitte Text manuell eingeben.",
        ) from exc


def improve_message_text(text: str) -> str:
    """Verbessert einen (oft aus einer Video-Transkription stammenden) Text per Claude.

    Glättet Füllwörter, Versprecher und Satzbrüche aus gesprochener Sprache, behält
    aber Inhalt, Absicht und Ich-Perspektive der Person bei. Wird explizit per
    Button ("Mit KI verbessern") ausgelöst, im Gegensatz zur stillen Paraphrasierung
    beim Versand (siehe paraphrase_personal_message).
    """
    text = (text or "").strip()
    if not text:
        return text

    prompt = get_prompt("invite_improve", text=text)
    try:
        improved = ai_complete(prompt, max_tokens=400)
        return improved or text
    except HTTPException:
        raise
    except Exception as exc:
        logger.error("KI-Verbesserung des Nachrichtentexts fehlgeschlagen: %s", exc)
        raise HTTPException(
            status_code=502,
            detail="Text konnte nicht verbessert werden. Bitte später erneut versuchen.",
        ) from exc


def generate_invite_content(
    description: str,
    mediation_title: str,
    mediation_type: str,
) -> dict:
    """Macht aus einer kurzen, formlosen Beschreibung des Nutzers einen
    professionellen Einladungstext, eine Überschrift und einen Fall-Titel-Vorschlag.

    Rückgabe: ``{"message", "subject", "title"}``. Der Nutzer kann alle Felder
    danach frei überarbeiten (siehe Einladungsformular). Wirft HTTPException,
    wenn keine KI konfiguriert ist oder die Anfrage fehlschlägt.
    """
    description = (description or "").strip()
    if not description:
        raise HTTPException(status_code=400, detail="Bitte zuerst kurz beschreiben, worum es geht.")

    type_labels = {
        "trennung": "Trennung & Scheidung",
        "erbschaft": "Erbschaftsstreit",
        "nachbarschaft": "Nachbarschaftskonflikt",
        "wg": "WG-Konflikt",
        "verbraucher": "Verbraucherstreit",
    }
    type_label = type_labels.get(mediation_type, mediation_type or "Mediation")

    prompt = get_prompt(
        "invite_generate",
        type_label=type_label,
        mediation_title=mediation_title,
        description=description,
    )

    try:
        raw = ai_complete(prompt, max_tokens=500)
    except HTTPException:
        raise
    except Exception as exc:
        logger.error("KI-Generierung des Einladungstexts fehlgeschlagen: %s", exc)
        raise HTTPException(
            status_code=502,
            detail="Einladungstext konnte nicht erstellt werden. Bitte später erneut versuchen.",
        ) from exc

    data = _parse_generated_json(raw)
    # Fallback: konnte kein JSON gelesen werden, wird der Rohtext als Nachricht
    # genutzt, damit der Nutzer nicht mit leeren Händen dasteht.
    message = (data.get("message") or raw or "").strip()
    subject = (data.get("subject") or "").strip()
    title = (data.get("title") or "").strip()
    return {"message": message, "subject": subject, "title": title}


def _parse_generated_json(raw: str) -> dict:
    """Liest das JSON-Objekt aus Claudes Antwort robust aus (auch mit Code-Fences)."""
    if not raw:
        return {}
    text = raw.strip()
    if text.startswith("```"):
        # ```json ... ``` entfernen
        text = text.strip("`")
        if text.lower().startswith("json"):
            text = text[4:]
    try:
        return json.loads(text)
    except (ValueError, TypeError):
        # Notfalls das erste {...} herausschneiden.
        start = raw.find("{")
        end = raw.rfind("}")
        if start != -1 and end != -1 and end > start:
            try:
                return json.loads(raw[start : end + 1])
            except (ValueError, TypeError):
                return {}
        return {}


def send_invite_email(
    to_email: str,
    invite_url: str,
    mediation_title: str,
    role: str,
    personal_message: str | None = None,
    has_video: bool = False,
    heading: str | None = None,
) -> None:
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

    personal_message_html = ""
    if personal_message and personal_message.strip():
        escaped_message = (
            personal_message.strip()
            .replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace("\n", "<br/>")
        )
        personal_message_html = f"""
              <div style="border-left:4px solid #059669;background:#f0fdf4;border-radius:8px;padding:16px 20px;margin:0 0 28px;">
                <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#059669;text-transform:uppercase;letter-spacing:0.5px;">Persönliche Nachricht</p>
                <p style="margin:0;font-size:15px;color:#0f172a;line-height:1.7;font-style:italic;">„{escaped_message}“</p>
              </div>"""

    heading_text = (heading or "").strip() or "Du wurdest zu einer Mediation eingeladen"
    heading_html = (
        heading_text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    )

    video_notice_html = ""
    if has_video:
        video_notice_html = """
              <p style="margin:0 0 28px;font-size:15px;color:#475569;line-height:1.7;">
                🎥 Diese Person hat zusätzlich eine persönliche <strong style="color:#0f172a;">Video-Botschaft</strong> für dich hinterlassen.
                Registriere dich und nimm die Einladung an, um sie anzusehen.
              </p>"""

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
                {heading_html}
              </h1>
              <p style="margin:0 0 16px;font-size:15px;color:#475569;line-height:1.7;">
                Du wurdest als <strong style="color:#0f172a;">{role_label}</strong> zu folgendem Mediationsverfahren eingeladen:
              </p>
              <div style="background:#f1f5f9;border-radius:12px;padding:20px 24px;margin:0 0 28px;">
                <p style="margin:0;font-size:16px;font-weight:700;color:#0f172a;">{mediation_title}</p>
              </div>
              {personal_message_html}
              <p style="margin:0 0 28px;font-size:15px;color:#475569;line-height:1.7;">
                Klicke auf den Button, um die Einladung anzunehmen und dem Verfahren beizutreten.
                Der Link ist 7 Tage gueltig.
              </p>
              {video_notice_html}
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


@router.delete("/mediations/{mediation_id}/invites/{invite_id}")
def revoke_invite(
    mediation_id: int,
    invite_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
    mediation=Depends(require_mediation_access),
):
    allowed_roles = {"mediator", "owner", "admin"}
    participant = (
        db.query(MediationParticipant)
        .filter(
            MediationParticipant.mediation_id == mediation_id,
            MediationParticipant.user_id == current_user.id,
        )
        .first()
    )
    user_role = participant.role if participant else current_user.role
    if user_role not in allowed_roles:
        raise HTTPException(status_code=403, detail="Keine Berechtigung")

    invite = (
        db.query(MediationInvite)
        .filter(
            MediationInvite.id == invite_id,
            MediationInvite.mediation_id == mediation_id,
        )
        .first()
    )
    if not invite:
        raise HTTPException(status_code=404, detail="Einladung nicht gefunden")
    if invite.status != "pending":
        raise HTTPException(status_code=400, detail="Nur ausstehende Einladungen können entfernt werden")

    db.delete(invite)
    db.commit()
    return {"ok": True}


@router.post("/mediations/{mediation_id}/invites/video")
async def upload_invite_video(
    mediation_id: int,
    file: UploadFile = File(...),
    mediation=Depends(require_mediation_access),
):
    """Lädt eine Video-Botschaft hoch, bevor die eigentliche Einladung erstellt wird.

    Gibt einen video_token (Dateiname) zurück, der beim Erstellen der Einladung
    (POST /mediations/{id}/invites) mitgegeben wird, um Video und Einladung zu verknüpfen.
    """
    ext = os.path.splitext(file.filename or "")[1].lower() or ".webm"
    if ext not in _ALLOWED_VIDEO_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Nicht unterstütztes Videoformat")

    max_bytes = settings.INVITE_VIDEO_MAX_MB * 1024 * 1024
    contents = await file.read()
    if len(contents) > max_bytes:
        raise HTTPException(
            status_code=400,
            detail=f"Video zu groß (max. {settings.INVITE_VIDEO_MAX_MB} MB)",
        )

    video_token = f"{mediation_id}_{secrets.token_hex(16)}{ext}"
    path = _safe_video_path(video_token)
    with open(path, "wb") as out:
        out.write(contents)

    return {"video_token": video_token}


@router.post("/mediations/{mediation_id}/invites/video/transcribe")
async def transcribe_invite_video_endpoint(
    mediation_id: int,
    payload: VideoTranscribeRequest,
    mediation=Depends(require_mediation_access),
):
    """Transkribiert eine zuvor hochgeladene Video-Botschaft (siehe upload_invite_video)
    per Whisper, damit der Text direkt in einem editierbaren Feld erscheinen kann."""
    if not payload.video_token.startswith(f"{mediation_id}_"):
        raise HTTPException(status_code=400, detail="Ungültiger video_token")
    path = _safe_video_path(payload.video_token)
    if not os.path.isfile(path):
        raise HTTPException(status_code=404, detail="Hochgeladenes Video nicht gefunden")

    transcript = transcribe_invite_video(path)
    return {"transcript": transcript}


@router.post("/mediations/{mediation_id}/invites/meet-recording/start")
def start_meet_recording(
    mediation_id: int,
    payload: MeetRecordingStartRequest,
    db: Session = Depends(get_db),
    mediation=Depends(require_mediation_access),
):
    """Legt einen Meet-Raum an, der die Einladungs-Botschaft automatisch aufnimmt.

    Der Einladende betritt den zurückgegebenen ``join_url``, spricht seine Botschaft,
    verlässt den Raum wieder und ruft die Aufnahme danach per Status-Endpunkt ab.
    Gibt einen ``token`` zurück, der beim Erstellen der Einladung mitgegeben wird.
    """
    kind = "audio" if (payload.kind or "").lower() == "audio" else "video"

    space = google_meet.create_recording_space()

    token = secrets.token_urlsafe(24)
    recording = InviteMeetRecording(
        mediation_id=mediation.id,
        token=token,
        space_name=space["space_name"],
        meeting_uri=space["meeting_uri"],
        kind=kind,
        status="pending",
    )
    db.add(recording)
    db.commit()

    return {
        "token": token,
        "join_url": space["meeting_uri"],
        "kind": kind,
    }


@router.get("/mediations/{mediation_id}/invites/meet-recording/{token}/status")
def get_meet_recording_status(
    mediation_id: int,
    token: str,
    db: Session = Depends(get_db),
    mediation=Depends(require_mediation_access),
):
    """Pollt die Meet-Artefakte des Raums und meldet Fortschritt/Transkript.

    Status: pending → recording → processing → ready. Sobald "ready", stehen
    ``recording_uri`` (Drive-Playback-Link) und ``transcript`` bereit.
    """
    recording = (
        db.query(InviteMeetRecording)
        .filter(
            InviteMeetRecording.token == token,
            InviteMeetRecording.mediation_id == mediation.id,
        )
        .first()
    )
    if not recording:
        raise HTTPException(status_code=404, detail="Aufnahme nicht gefunden")

    # Schon fertig? Nicht erneut bei Google nachfragen.
    if recording.status == "ready":
        return {
            "status": "ready",
            "kind": recording.kind,
            "recording_uri": recording.recording_uri,
            "transcript": recording.transcript or "",
        }

    result = google_meet.fetch_recording_artifacts(recording.space_name)
    recording.status = result["status"]
    if result["status"] == "ready":
        recording.recording_uri = result["recording_uri"]
        recording.recording_file_id = result["recording_file_id"]
        recording.transcript = result["transcript"]
    db.commit()

    return {
        "status": recording.status,
        "kind": recording.kind,
        "recording_uri": recording.recording_uri,
        "transcript": recording.transcript or "",
    }


@router.post("/mediations/{mediation_id}/invites/message/improve")
async def improve_invite_message_endpoint(
    mediation_id: int,
    payload: MessageImproveRequest,
    mediation=Depends(require_mediation_access),
):
    """Verbessert per Button-Klick einen (oft transkribierten) Nachrichtentext mit Claude."""
    improved = improve_message_text(payload.text)
    return {"text": improved}


@router.post("/mediations/{mediation_id}/invites/message/generate")
async def generate_invite_message_endpoint(
    mediation_id: int,
    payload: InviteGenerateRequest,
    mediation=Depends(require_mediation_access),
):
    """Erzeugt aus einer kurzen Beschreibung einen professionellen Einladungstext,
    eine Überschrift und einen Fall-Titel-Vorschlag (alle vom Nutzer editierbar)."""
    return generate_invite_content(
        payload.description,
        mediation.title or "Neue Mediation",
        getattr(mediation, "mediation_type", "") or "",
    )


def effective_video_mode(db: Session, mediation_type: str) -> str:
    """Leitet den Video-Modus der Einladung aus der Phase "einladung" ab, die im
    Workflow Manager pro Mediationsart konfiguriert wird (phase_step_defaults).

    Regeln (bewusst rückwärtskompatibel):
      - Ist die Phase "einladung" noch NICHT konfiguriert (keine aktiven Schritte),
        gilt "optional" – so wie bisher.
      - Ist sie konfiguriert: "required", wenn ein aktiver Video-Schritt Pflicht-
        Rollen gesetzt hat; sonst "optional", wenn es einen aktiven Video-Schritt
        gibt; andernfalls "off" (kein Video in der Einladung).
    """
    steps = (
        db.query(PhaseStepDefault)
        .filter(
            # globale Schritte ("Alle Typen") zählen mit – ein dort gepflegter
            # Video-Schritt gilt auch für diese Mediationsart.
            PhaseStepDefault.mediation_type.in_([mediation_type, SHARED_MEDIATION_TYPE]),
            PhaseStepDefault.phase == "einladung",
            PhaseStepDefault.variant_key.is_(None),
            PhaseStepDefault.enabled.is_(True),
        )
        .all()
    )
    if not steps:
        return "optional"
    video_steps = [s for s in steps if s.content_types and "video" in s.content_types.split(",")]
    if not video_steps:
        return "off"
    if any(s.required_roles for s in video_steps):
        return "required"
    return "optional"


@router.get("/mediations/{mediation_id}/invite-settings")
def get_invite_settings_for_mediation(
    mediation_id: int,
    db: Session = Depends(get_db),
    mediation=Depends(require_mediation_access),
):
    """Liefert der Einladungsseite den geltenden Video-Modus (optional|required|off)
    für die Mediationsart dieses Falls. Für Teilnehmer zugänglich (nicht nur Admin)."""
    return {
        "video_mode": effective_video_mode(db, mediation.mediation_type),
        # Ist die serverseitige Meet-Aufnahme verbunden, bietet das Frontend statt
        # der Browser-Aufnahme die Aufnahme über Google Meet an.
        "meet_recording_available": google_meet.recording_is_configured(),
    }


@router.post("/mediations/{mediation_id}/invites")
def create_invite(
    request: Request,
    mediation_id: int,
    payload: InviteCreate,
    db: Session = Depends(get_db),
    mediation=Depends(require_mediation_access),
):
    invite_limiter.check(request)

    # Konflikt-Logbücher (mode="logbuch") sind bewusst privat: KEINE
    # Gegenseiten-Kommunikation. Erst in eine Mediation umwandeln
    # (POST /mediations/{id}/logbuch/convert), dann einladen.
    if getattr(mediation, "mode", "mediation") == "logbuch":
        raise HTTPException(
            status_code=409,
            detail=(
                "Ein Konflikt-Logbuch hat keine Gegenseite. Wandeln Sie das "
                "Logbuch zuerst in eine Mediation um, um jemanden einzuladen."
            ),
        )

    token = create_invite_token()

    if effective_video_mode(db, mediation.mediation_type) == "required" and not payload.video_token:
        raise HTTPException(
            status_code=400,
            detail="Eine persönliche Video-Botschaft ist für diese Einladung erforderlich.",
        )

    video_filename = None
    if payload.video_token:
        # Nur Dateien akzeptieren, die tatsächlich existieren und zu dieser Mediation gehören.
        if not payload.video_token.startswith(f"{mediation_id}_"):
            raise HTTPException(status_code=400, detail="Ungültiger video_token")
        candidate_path = _safe_video_path(payload.video_token)
        if not os.path.isfile(candidate_path):
            raise HTTPException(status_code=404, detail="Hochgeladenes Video nicht gefunden")
        video_filename = payload.video_token

    # Optional: über Google Meet aufgenommene Botschaft (Aufnahme liegt in Drive).
    meet_recording_uri = None
    meet_transcript = None
    message_kind = None
    if payload.meet_recording_token:
        recording = (
            db.query(InviteMeetRecording)
            .filter(
                InviteMeetRecording.token == payload.meet_recording_token,
                InviteMeetRecording.mediation_id == mediation.id,
            )
            .first()
        )
        if not recording:
            raise HTTPException(status_code=404, detail="Meet-Aufnahme nicht gefunden")
        if recording.status != "ready" or not recording.recording_uri:
            raise HTTPException(
                status_code=400,
                detail="Die Meet-Aufnahme ist noch nicht fertig. Bitte zuerst die Aufnahme abrufen.",
            )
        meet_recording_uri = recording.recording_uri
        meet_transcript = recording.transcript
        message_kind = recording.kind

    mediation_title = mediation.title or "Neue Mediation"
    paraphrased_message = None
    if payload.personal_message and payload.personal_message.strip():
        paraphrased_message = paraphrase_personal_message(payload.personal_message, mediation_title)

    invite = MediationInvite(
        mediation_id=mediation.id,
        token_hash=hash_token(token),
        role=payload.role,
        status="pending",
        invited_email=payload.invited_email,
        personal_message=payload.personal_message,
        personal_message_paraphrased=paraphrased_message,
        video_filename=video_filename,
        meet_recording_uri=meet_recording_uri,
        meet_transcript=meet_transcript,
        message_kind=message_kind,
        expires_at=datetime.now(timezone.utc) + timedelta(days=7),
    )

    db.add(invite)
    db.commit()
    db.refresh(invite)

    invite_url = f"{settings.APP_BASE_URL}/dashboard/invitations?token={token}"

    send_invite_email(
        payload.invited_email,
        invite_url,
        mediation_title,
        payload.role,
        personal_message=paraphrased_message,
        has_video=bool(video_filename) or bool(meet_recording_uri),
        heading=payload.invitation_heading,
    )

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
            # Case-insensitiv: Eingeladene registrieren sich gelegentlich mit
            # anderer Gross-/Kleinschreibung als in der Einladung hinterlegt.
            func.lower(MediationInvite.invited_email) == user.email.lower(),
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

    return {
        "mediation_id": invite.mediation_id,
        "status": "accepted",
        **_invite_message_payload(invite),
    }


@router.get("/invites/{token}/lookup")
def lookup_invite(
    token: str,
    request: Request,
    db: Session = Depends(get_db),
):
    """Public: Prüft ein Einladungs-Token und sagt, ob zur eingeladenen
    E-Mail bereits ein Konto existiert.

    Wird von der Login-Seite genutzt, um neu Eingeladene ohne Konto direkt
    zur Registrierung (mit vorausgefüllter E-Mail) zu routen statt sie auf
    dem Login stranden zu lassen. Kein Auth nötig — das Token selbst ist
    das Geheimnis (kam per E-Mail an genau diese Adresse).
    """
    invite_limiter.check(request)

    invite = (
        db.query(MediationInvite)
        .filter(MediationInvite.token_hash == hash_token(token))
        .first()
    )
    if not invite or invite.status != "pending" or not invite.invited_email:
        raise HTTPException(status_code=404, detail="Einladung ungueltig")

    expires_at = (
        invite.expires_at.replace(tzinfo=None)
        if invite.expires_at.tzinfo
        else invite.expires_at
    )
    if expires_at < datetime.now(timezone.utc).replace(tzinfo=None):
        raise HTTPException(status_code=404, detail="Einladung abgelaufen")

    user_exists = (
        db.query(User.id)
        .filter(func.lower(User.email) == invite.invited_email.lower())
        .first()
        is not None
    )

    return {
        "invited_email": invite.invited_email,
        "user_exists": user_exists,
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
        **_invite_message_payload(invite),
    }


def _invite_message_payload(invite: MediationInvite) -> dict:
    """Gemeinsame Felder für die Accept-Antworten: signalisiert, ob eine
    Botschaft vorliegt und ob sie eine lokale Video-Datei oder eine Meet-Aufnahme
    (Google-Drive-Link) ist."""
    has_recording = bool(invite.meet_recording_uri)
    return {
        "has_video": bool(invite.video_filename) or has_recording,
        "has_recording": has_recording,
        "recording_uri": invite.meet_recording_uri,
        "message_kind": invite.message_kind or "video",
    }


def _video_file_response(invite: MediationInvite) -> FileResponse:
    if not invite.video_filename:
        raise HTTPException(status_code=404, detail="Keine Video-Botschaft vorhanden")
    path = _safe_video_path(invite.video_filename)
    if not os.path.isfile(path):
        raise HTTPException(status_code=404, detail="Video-Datei nicht gefunden")
    media_type = mimetypes.guess_type(path)[0] or "application/octet-stream"
    return FileResponse(path, media_type=media_type)


@router.get("/mediations/{mediation_id}/invites/me/video")
def get_my_invite_video(
    mediation_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    """Gibt der eingeladenen Person ihre persönliche Video-Botschaft zurück --
    aber erst, nachdem sie die Einladung angenommen hat ("im System geben")."""
    invite = (
        db.query(MediationInvite)
        .filter(
            MediationInvite.mediation_id == mediation_id,
            func.lower(MediationInvite.invited_email) == user.email.lower(),
            MediationInvite.status == "accepted",
        )
        .order_by(MediationInvite.accepted_at.desc())
        .first()
    )
    if not invite:
        raise HTTPException(status_code=404, detail="Keine angenommene Einladung mit Video gefunden")

    return _video_file_response(invite)


@router.get("/mediations/{mediation_id}/invites/me/recording")
def get_my_invite_recording(
    mediation_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_db_user),
):
    """Gibt der eingeladenen Person den Google-Meet-Aufnahme-Link + Transkript ihrer
    persönlichen Botschaft zurück -- erst nach Annahme der Einladung. Die Aufnahme
    selbst liegt in Google Drive; hier wird nur der Playback-Link geliefert."""
    invite = (
        db.query(MediationInvite)
        .filter(
            MediationInvite.mediation_id == mediation_id,
            func.lower(MediationInvite.invited_email) == user.email.lower(),
            MediationInvite.status == "accepted",
        )
        .order_by(MediationInvite.accepted_at.desc())
        .first()
    )
    if not invite or not invite.meet_recording_uri:
        raise HTTPException(status_code=404, detail="Keine angenommene Einladung mit Aufnahme gefunden")

    return {
        "recording_uri": invite.meet_recording_uri,
        "transcript": invite.meet_transcript or "",
        "kind": invite.message_kind or "video",
    }


@router.get("/mediations/{mediation_id}/invites/{invite_id}/video")
def get_invite_video(
    mediation_id: int,
    invite_id: int,
    db: Session = Depends(get_db),
    mediation=Depends(require_mediation_access),
):
    """Vorschau für den Einladenden selbst (z.B. um die Aufnahme zu prüfen)."""
    invite = (
        db.query(MediationInvite)
        .filter(
            MediationInvite.id == invite_id,
            MediationInvite.mediation_id == mediation_id,
        )
        .first()
    )
    if not invite:
        raise HTTPException(status_code=404, detail="Einladung nicht gefunden")

    return _video_file_response(invite)
