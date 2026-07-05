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

# ── Google Meet REST API (Aufnahme + Transkript) ────────────────────────────
# Wird NUR für die Einladungs-Video-/Audio-Botschaft genutzt (nicht für die
# reinen Meet-Links oben). Erfordert Workspace-Tarif + aktivierte Meet REST API.
_MEET_API_BASE = "https://meet.googleapis.com/v2"


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


# ──────────────────────────────────────────────────────────────────────────
# Meet-AUFNAHME: Einladungs-Botschaft über einen Meet-Raum aufnehmen lassen
# und danach Aufnahme (Drive-Playback-Link) + Transkript abrufen.
#
# Ablauf:
#   1. create_recording_space(): legt einen Meet-Raum an, der beim Beitreten
#      automatisch Aufnahme + Transkription startet (artifactConfig). Der
#      Einladende betritt den Raum, spricht seine Botschaft, verlässt ihn wieder.
#   2. fetch_recording_artifacts(): pollt die Konferenz-Aufzeichnungen des Raums.
#      Sobald Google die MP4-Datei erzeugt hat, liefert es den Drive-Playback-Link
#      (driveDestination.exportUri) und das zusammengesetzte Transkript zurück.
#
# Die Aufnahme bleibt in Google Drive des zentralen Kontos – sie wird bewusst
# NICHT auf den medipact-Server heruntergeladen (löst das „Datei zu groß"-Problem).
# ──────────────────────────────────────────────────────────────────────────


def recording_is_configured() -> bool:
    """True, wenn Meet-Aufnahme aktiviert UND alle Google-Zugangsdaten gesetzt sind."""
    return bool(settings.GOOGLE_MEET_RECORDING_ENABLED) and is_configured()


def _require_recording_configured() -> None:
    if not settings.GOOGLE_MEET_RECORDING_ENABLED:
        raise HTTPException(
            status_code=503,
            detail=(
                "Die Meet-Aufnahme ist nicht aktiviert. Sie erfordert einen "
                "Google-Workspace-Tarif mit Aufnahme-Berechtigung und "
                "GOOGLE_MEET_RECORDING_ENABLED=true (siehe docs/google-meet-setup.md)."
            ),
        )
    _require_configured()


def _meet_request(
    method: str,
    path: str,
    *,
    json_body: dict | None = None,
    params: dict | None = None,
) -> dict:
    """Ruft die Meet REST API mit einem frischen Access-Token auf.

    ``path`` beginnt mit "/" und wird an ``_MEET_API_BASE`` gehängt, ODER ist ein
    bereits vollständiger Ressourcenname wie "spaces/xxx" / "conferenceRecords/yyy".
    ``params`` werden von httpx korrekt URL-kodiert (wichtig z.B. für filter-Werte).
    """
    access_token = _fetch_access_token()
    url = path if path.startswith("http") else f"{_MEET_API_BASE}/{path.lstrip('/')}"
    try:
        resp = httpx.request(
            method,
            url,
            headers={"Authorization": f"Bearer {access_token}"},
            json=json_body,
            params=params,
            timeout=_HTTP_TIMEOUT,
        )
    except httpx.HTTPError as exc:
        raise HTTPException(
            status_code=503, detail="Google Meet ist nicht erreichbar."
        ) from exc

    if resp.status_code == 403:
        raise HTTPException(
            status_code=502,
            detail=(
                "Google hat die Meet-Aufnahme abgelehnt (403). Prüfe: Workspace-Tarif "
                "mit aktivierter Aufnahme, Meet REST API aktiviert, und dass der "
                "Refresh-Token die Meet-Scopes umfasst."
            ),
        )
    if resp.status_code not in (200, 201):
        raise HTTPException(
            status_code=502,
            detail=f"Google-Meet-API-Fehler ({resp.status_code}).",
        )
    try:
        return resp.json()
    except ValueError:
        return {}


def create_recording_space(*, transcribe: bool = True) -> dict:
    """Legt einen Meet-Raum an, der beim Beitreten automatisch aufnimmt.

    Rückgabe: ``{"space_name", "meeting_uri", "meeting_code"}``.
    ``space_name`` ist der Ressourcenname ("spaces/xxx"), über den später die
    Aufnahme abgerufen wird. ``meeting_uri`` ist der Beitritts-Link.
    """
    _require_recording_configured()

    artifact_config: dict = {
        "recordingConfig": {"autoRecordingGeneration": "ON"},
    }
    if transcribe:
        artifact_config["transcriptionConfig"] = {"autoTranscriptionGeneration": "ON"}

    space = _meet_request(
        "POST",
        "spaces",
        json_body={"config": {"artifactConfig": artifact_config}},
    )
    space_name = space.get("name")
    meeting_uri = space.get("meetingUri")
    if not space_name or not meeting_uri:
        raise HTTPException(
            status_code=502,
            detail="Google hat keinen Meet-Raum zurückgegeben. Bitte erneut versuchen.",
        )
    return {
        "space_name": space_name,
        "meeting_uri": meeting_uri,
        "meeting_code": space.get("meetingCode"),
    }


def _latest_conference_record(space_name: str) -> dict | None:
    """Jüngste (auch laufende) Konferenz zu diesem Raum, oder None."""
    # filter erwartet z.B.: space.name = "spaces/xxx"  (Wert in Anführungszeichen)
    data = _meet_request(
        "GET",
        "conferenceRecords",
        params={"filter": f'space.name="{space_name}"'},
    )
    records = data.get("conferenceRecords") or []
    if not records:
        return None
    # Die API liefert neueste zuerst; zur Sicherheit nach startTime sortieren.
    records.sort(key=lambda r: r.get("startTime") or "", reverse=True)
    return records[0]


def _assemble_transcript(conference_name: str) -> str:
    """Baut aus den Transkript-Einträgen der Konferenz einen zusammenhängenden Text."""
    tdata = _meet_request("GET", f"{conference_name}/transcripts")
    transcripts = tdata.get("transcripts") or []
    if not transcripts:
        return ""

    parts: list[str] = []
    for transcript in transcripts:
        tname = transcript.get("name")
        if not tname:
            continue
        page_token = ""
        while True:
            edata = _meet_request(
                "GET",
                f"{tname}/entries",
                params={"pageToken": page_token} if page_token else None,
            )
            for entry in edata.get("transcriptEntries") or []:
                text = (entry.get("text") or "").strip()
                if text:
                    parts.append(text)
            page_token = edata.get("nextPageToken") or ""
            if not page_token:
                break
    return " ".join(parts).strip()


def fetch_recording_artifacts(space_name: str) -> dict:
    """Ruft Aufnahme (Drive-Playback-Link) + Transkript für einen Raum ab.

    Rückgabe: ``{"status", "recording_uri", "recording_file_id", "transcript"}``.
    ``status`` ist eines von:
      • "pending"    – noch keine Konferenz gestartet (Nutzer nicht beigetreten),
      • "recording"  – Konferenz läuft noch (Nutzer im Raum / gerade verlassen),
      • "processing" – Konferenz beendet, aber Aufnahme wird noch erzeugt,
      • "ready"      – Aufnahme-Link (und ggf. Transkript) verfügbar.
    """
    _require_recording_configured()

    record = _latest_conference_record(space_name)
    if not record:
        return {"status": "pending", "recording_uri": None, "recording_file_id": None, "transcript": ""}

    conference_name = record.get("name")
    # endTime gesetzt => Konferenz beendet; sonst läuft sie noch.
    ended = bool(record.get("endTime"))

    rdata = _meet_request("GET", f"{conference_name}/recordings")
    recordings = rdata.get("recordings") or []

    recording_uri = None
    recording_file_id = None
    for rec in recordings:
        drive = rec.get("driveDestination") or {}
        if drive.get("exportUri"):
            recording_uri = drive.get("exportUri")
            recording_file_id = drive.get("file")
            break

    if recording_uri:
        transcript = ""
        try:
            transcript = _assemble_transcript(conference_name)
        except HTTPException:
            # Transkript ist optional – Aufnahme trotzdem als fertig melden.
            transcript = ""
        return {
            "status": "ready",
            "recording_uri": recording_uri,
            "recording_file_id": recording_file_id,
            "transcript": transcript,
        }

    # Noch keine fertige Datei: läuft die Konferenz noch, oder wird sie verarbeitet?
    return {
        "status": "processing" if ended else "recording",
        "recording_uri": None,
        "recording_file_id": None,
        "transcript": "",
    }
