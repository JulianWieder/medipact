"""Einmaliges Helfer-Skript: erzeugt den langlebigen Google-OAuth-Refresh-Token
für das zentrale medipact-Konto, über das später alle Google-Meet-Links
angelegt werden.

Voraussetzung (siehe docs/google-meet-setup.md):
  - In der Google Cloud Console ist ein OAuth-Client (Typ "Desktop-App")
    angelegt, du hast Client-ID und Client-Secret.
  - Die Calendar-API ist für das Projekt aktiviert.

Ausführen (lokal, mit Browser):
    python scripts/google_meet_get_refresh_token.py \
        --client-id DEINE_CLIENT_ID \
        --client-secret DEIN_CLIENT_SECRET

Für die Meet-AUFNAHME der Einladungs-Botschaft zusätzlich --with-recording
anhängen (setzt Workspace-Tarif + aktivierte Meet REST API voraus).

Das Skript öffnet den Google-Login. Melde dich mit dem ZENTRALEN Konto an
(z.B. termine@medipact.de bzw. zunächst dein eigenes Konto), bestätige den
Zugriff, und kopiere den ausgegebenen GOOGLE_OAUTH_REFRESH_TOKEN in die
.env des Backends.

Es hat bewusst KEINE eigene Dependency: nutzt nur die Standardbibliothek
(webbrowser + lokaler HTTP-Server für den OAuth-Redirect) und httpx (im Backend
ohnehin vorhanden).
"""
from __future__ import annotations

import argparse
import http.server
import secrets
import threading
import urllib.parse
import webbrowser

import httpx

AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
TOKEN_URL = "https://oauth2.googleapis.com/token"
# Basis: reicht für die automatischen Meet-LINKS (Calendar-Termin mit Meet-Raum).
BASE_SCOPES = ["https://www.googleapis.com/auth/calendar.events"]
# Zusätzlich für die Meet-AUFNAHME der Einladungs-Botschaft (Raum anlegen +
# Aufnahme/Transkript abrufen). Nur mit --with-recording anfordern, da diese
# Scopes einen Workspace-Tarif + aktivierte Meet REST API voraussetzen.
RECORDING_SCOPES = [
    "https://www.googleapis.com/auth/meetings.space.created",
    "https://www.googleapis.com/auth/meetings.space.readonly",
]
REDIRECT_HOST = "localhost"
REDIRECT_PORT = 8765
REDIRECT_URI = f"http://{REDIRECT_HOST}:{REDIRECT_PORT}/callback"


class _Handler(http.server.BaseHTTPRequestHandler):
    code: str | None = None
    state_expected: str = ""

    def do_GET(self):  # noqa: N802
        parsed = urllib.parse.urlparse(self.path)
        params = urllib.parse.parse_qs(parsed.query)
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.end_headers()
        if params.get("state", [""])[0] != _Handler.state_expected:
            self.wfile.write("<h1>Fehler: state stimmt nicht.</h1>".encode("utf-8"))
            return
        code = params.get("code", [None])[0]
        _Handler.code = code
        msg = (
            "<h1>Fertig.</h1><p>Du kannst dieses Fenster schliessen und zum "
            "Terminal zurueckkehren.</p>"
        )
        self.wfile.write(msg.encode("utf-8"))

    def log_message(self, *args):  # Stummschalten.
        return


def main() -> None:
    parser = argparse.ArgumentParser(description="Google OAuth Refresh-Token erzeugen")
    parser.add_argument("--client-id", required=True)
    parser.add_argument("--client-secret", required=True)
    parser.add_argument(
        "--with-recording",
        action="store_true",
        help=(
            "Zusätzlich die Meet-Aufnahme-Scopes anfordern (nur mit Workspace-Tarif "
            "+ aktivierter Meet REST API). Für GOOGLE_MEET_RECORDING_ENABLED=true."
        ),
    )
    args = parser.parse_args()

    scopes = BASE_SCOPES + (RECORDING_SCOPES if args.with_recording else [])

    state = secrets.token_urlsafe(16)
    _Handler.state_expected = state

    auth_params = {
        "client_id": args.client_id,
        "redirect_uri": REDIRECT_URI,
        "response_type": "code",
        "scope": " ".join(scopes),
        "access_type": "offline",       # -> Refresh-Token
        "prompt": "consent",            # erzwingt Refresh-Token auch bei Re-Auth
        "state": state,
    }
    auth_link = f"{AUTH_URL}?{urllib.parse.urlencode(auth_params)}"

    server = http.server.HTTPServer((REDIRECT_HOST, REDIRECT_PORT), _Handler)
    thread = threading.Thread(target=server.handle_request)  # genau eine Anfrage
    thread.start()

    print("\nÖffne den Browser für die Google-Anmeldung …")
    print("Falls sich nichts öffnet, diesen Link manuell aufrufen:\n")
    print(auth_link, "\n")
    webbrowser.open(auth_link)

    thread.join(timeout=300)
    server.server_close()

    if not _Handler.code:
        print("Kein Authorization-Code erhalten. Abbruch.")
        return

    resp = httpx.post(
        TOKEN_URL,
        data={
            "code": _Handler.code,
            "client_id": args.client_id,
            "client_secret": args.client_secret,
            "redirect_uri": REDIRECT_URI,
            "grant_type": "authorization_code",
        },
        timeout=30,
    )
    if resp.status_code != 200:
        print("Token-Austausch fehlgeschlagen:", resp.status_code, resp.text)
        return

    data = resp.json()
    refresh_token = data.get("refresh_token")
    if not refresh_token:
        print(
            "Kein refresh_token in der Antwort. Meist, weil das Konto den Zugriff "
            "schon einmal freigegeben hat. Widerrufe den Zugriff unter "
            "https://myaccount.google.com/permissions und starte das Skript erneut."
        )
        return

    print("\n=== ERFOLG ===")
    print("Trage folgende Werte in die .env des Backends ein:\n")
    print(f"GOOGLE_OAUTH_CLIENT_ID={args.client_id}")
    print(f"GOOGLE_OAUTH_CLIENT_SECRET={args.client_secret}")
    print(f"GOOGLE_OAUTH_REFRESH_TOKEN={refresh_token}")
    print("\n(GOOGLE_CALENDAR_ID=primary ist Standard und meist korrekt.)")


if __name__ == "__main__":
    main()
