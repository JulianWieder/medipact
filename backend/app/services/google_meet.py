"""Google-Meet-Anbindung: erzeugt automatisch einen Meet-Link, indem über die
Google Calendar API ein Termin mit ``conferenceData.createRequest`` angelegt
wird.

Bewusst nur mit ``httpx`` (bereits Dependency) direkt gegen Googles REST-API
implementiert – kein schweres ``google-api-python-client`` nötig. Es wird ein
einziges zentrales Google-Konto verwendet (OAuth-Client + Refresh-Token in den
Settings); Plattform-Nutzer authentifizieren sich nie gegen Google, die
Zugangsdaten bleiben ausschließlich serverseitig.

Setup: siehe docs/google-meet-setup.md.
"""
from __future__ import annotations

import datetime as _dt
import secrets

import httpx
from fastapi import HTTPException

from app.config import settings

_TOKEN_URL = "https://oauth2.googleapis.com/token"
_EVENTS_URL = "https://www.googleapis.com/calendar/v3/calendars/{calendar_id}/events"
_HTTP_TIMEOUT = 20.0


def is_configured() -> bool:
    """True, wenn alle Google-Zugangsdaten gesetzt sind."""
    return bool(
        settings.GOOGLE_OAUTH_CLIENT_ID
        and settings.GOOGLE_OAUTH_CLIENT_SECRET
        and settings.GOOGLE_OAUTH_REFRESH_TOKEN
    )


def _require_configured() -> None:
    if not is_configured():
        raise HTTPException(
            status_code=503,
            detail=(
                "Google Meet ist noch nicht verbunden. Bitte GOOGLE_OAUTH_CLIENT_ID, "
                "GOOGLE_OAUTH_CLIENT_SECRET und GOOGLE_OAUTH_REFRESH_TOKEN setzen "
                "(siehe docs/google-meet-setup.md)."
            ),
        )


def _fetch_access_token() -> str:
    """Tauscht den langlebigen Refresh-Token gegen ein kurzlebiges Access-Token."""
    try:
        resp = httpx.post(
            _TOKEN_URL,
            data={
                "client_id": settings.GOOGLE_OAUTH_CLIENT_ID,
                "client_secret": settings.GOOGLE_OAUTH_CLIENT_SECRET,
                "refresh_token": settings.GOOGLE_OAUTH_REFRESH_TOKEN,
                "grant_type": "refresh_token",
            },
            timeout=_HTTP_TIMEOUT,
        )
    except httpx.HTTPError as exc:
        raise HTTPException(
            status_code=503, detail="Google ist nicht erreichbar."
        ) from exc

    if resp.status_code != 200:
        # Typisch: invalid_grant (Refresh-Token widerrufen/abgelaufen).
        raise HTTPException(
            status_code=502,
            detail=(
                "Google-Anmeldung fehlgeschlagen. Ggf. ist der Refresh-Token "
                "abgelaufen oder wurde widerrufen – bitte neu erzeugen."
            ),
        )

    token = resp.json().get("access_token")
    if not token:
        raise HTTPException(status_code=502, detail="Google lieferte kein Access-Token.")
    return token


def _extract_meet_url(event: dict) -> str | None:
    """Zieht die Meet-URL aus der Calendar-Event-Antwort."""
    conf = event.get("conferenceData") or {}
    for entry in conf.get("entryPoints", []) or []:
        if entry.get("entryPointType") == "video" and entry.get("uri"):
            return entry["uri"]
    # Fallback: hangoutLink ist bei erfolgreicher Meet-Erstellung ebenfalls gesetzt.
    return event.get("hangoutLink")


def create_meet_link(
    *,
    summary: str,
    start: _dt.datetime | None = None,
    duration_minutes: int = 60,
    description: str = "",
    attendee_emails: list[str] | None = None,
) -> dict:
    """Legt einen Kalendertermin mit Google-Meet-Raum an und gibt den Link zurück.

    Rückgabe: ``{"meeting_url", "event_id", "html_link", "start", "end"}``.
    Wirft HTTPException bei fehlender Konfiguration oder API-Fehlern.
    """
    _require_configured()

    start = start or _dt.datetime.now(_dt.timezone.utc)
    end = start + _dt.timedelta(minutes=max(1, duration_minutes))
    tz = settings.GOOGLE_MEET_TIMEZONE

    body: dict = {
        "summary": summary or "medipact Mediation",
        "description": description or "Automatisch von medipact erstellter Videoraum.",
        "start": {"dateTime": start.isoformat(), "timeZone": tz},
        "end": {"dateTime": end.isoformat(), "timeZone": tz},
        "conferenceData": {
            "createRequest": {
                "requestId": secrets.token_hex(16),
                "conferenceSolutionKey": {"type": "hangoutsMeet"},
            }
        },
    }
    if attendee_emails:
        body["attendees"] = [{"email": e} for e in attendee_emails if e]

    access_token = _fetch_access_token()
    url = _EVENTS_URL.format(calendar_id=settings.GOOGLE_CALENDAR_ID)

    try:
        resp = httpx.post(
            url,
            params={"conferenceDataVersion": 1, "sendUpdates": "none"},
            headers={"Authorization": f"Bearer {access_token}"},
            json=body,
            timeout=_HTTP_TIMEOUT,
        )
    except httpx.HTTPError as exc:
        raise HTTPException(
            status_code=503, detail="Google Calendar ist nicht erreichbar."
        ) from exc

    if resp.status_code not in (200, 201):
        raise HTTPException(
            status_code=502,
            detail=f"Meet-Termin konnte nicht angelegt werden (Google: {resp.status_code}).",
        )

    event = resp.json()
    meeting_url = _extract_meet_url(event)
    if not meeting_url:
        raise HTTPException(
            status_code=502,
            detail="Google hat keinen Meet-Link zurückgegeben. Bitte erneut versuchen.",
        )

    return {
        "meeting_url": meeting_url,
        "event_id": event.get("id"),
        "html_link": event.get("htmlLink"),
        "start": start.isoformat(),
        "end": end.isoformat(),
    }
