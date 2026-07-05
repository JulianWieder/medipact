# Google Meet einrichten (automatische Videokonferenz-Links)

medipact erzeugt Meet-Links über **ein einziges zentrales Google-Konto**. Die
Zugangsdaten liegen ausschließlich serverseitig (Backend-Env), Plattform-Nutzer
sehen das Konto nie. Kosten: **0 €** mit einem normalen Gmail-Konto.

Du kannst zunächst dein eigenes Google-Konto verwenden und später auf ein
dediziertes Konto (z. B. `termine@medipact.de`) umstellen — dafür nur die drei
Env-Werte austauschen, kein Code-Änderung nötig.

## 1. Google-Cloud-Projekt + OAuth-Client anlegen

1. Öffne die [Google Cloud Console](https://console.cloud.google.com/) und
   melde dich mit dem **zentralen Konto** an.
2. Erstelle ein Projekt (z. B. „medipact-meet").
3. Aktiviere die **Google Calendar API**:
   „APIs & Dienste" → „Bibliothek" → „Google Calendar API" → **Aktivieren**.
4. „APIs & Dienste" → **OAuth-Zustimmungsbildschirm**:
   - Nutzertyp **Extern**, App-Name „medipact", Support-E-Mail eintragen.
   - Scope hinzufügen: `.../auth/calendar.events`.
   - Unter **Testnutzer** das zentrale Konto als Testnutzer eintragen
     (solange die App im „Testing"-Modus ist, reicht das — kein Google-Review
     nötig, der Refresh-Token bleibt für Testnutzer allerdings ggf. nur 7 Tage
     gültig; für Dauerbetrieb die App auf **In Produktion** setzen).
5. „APIs & Dienste" → **Anmeldedaten** → „Anmeldedaten erstellen" →
   **OAuth-Client-ID** → Anwendungstyp **Desktop-App**.
   Notiere **Client-ID** und **Client-Secret**.

## 2. Refresh-Token erzeugen

Einmalig lokal (mit Browser) ausführen:

```bash
cd backend
python scripts/google_meet_get_refresh_token.py \
    --client-id DEINE_CLIENT_ID \
    --client-secret DEIN_CLIENT_SECRET
```

Im Browser mit dem **zentralen Konto** anmelden und Zugriff bestätigen. Das
Skript gibt am Ende die drei Env-Werte aus.

> Kommt kein `refresh_token` zurück, hat das Konto den Zugriff schon einmal
> freigegeben. Unter <https://myaccount.google.com/permissions> widerrufen und
> das Skript erneut ausführen.

## 3. Backend konfigurieren

In die `.env` des Backends eintragen:

```env
GOOGLE_OAUTH_CLIENT_ID=...
GOOGLE_OAUTH_CLIENT_SECRET=...
GOOGLE_OAUTH_REFRESH_TOKEN=...
GOOGLE_CALENDAR_ID=primary
GOOGLE_MEET_TIMEZONE=Europe/Berlin
```

Backend neu starten. Fertig — im Workflow-Designer und in der Fallansicht
erscheint beim Inhaltstyp **„videokonferenz"** der Button
**„🎦 Google-Meet-Link erzeugen"**. Ein Klick legt im Kalender des zentralen
Kontos einen Termin mit Meet-Raum an und trägt den Link ins Feld ein.

## Sicherheit / Isolation

- Client-Secret und Refresh-Token liegen nur in der Backend-`.env`, nie im
  Browser.
- Jede Mediation bekommt einen eigenen, nicht erratbaren Meet-Link. medipact
  liefert ihn nur an berechtigte Teilnehmer des jeweiligen Falls aus
  (bestehende Zugriffskontrolle) — Nutzer von Fall X sehen den Link von Fall Y
  nicht.
- Wer sich direkt in das zentrale Google-Konto einloggt (Admin), sieht alle
  Termine an einem Ort. Das ist für Plattform-Nutzer unsichtbar.
- Kostenloses Gmail: „Wer den Link hat, kann beitreten" (ggf. anklopfen). Für
  feinere Beitritts-Kontrollen später auf Google Workspace umstellen — die drei
  Env-Werte bleiben die einzigen Stellschrauben.

## Meet-Aufnahme (Einladungs-Video-/Audio-Botschaft über Meet)

Beim Einladen kann der/die Einladende eine persönliche Botschaft aufnehmen.
Standardmäßig passiert das im Browser und die Datei landet auf dem medipact-Server.
Alternativ kann die Botschaft **über einen Google-Meet-Raum aufgenommen** werden –
dann bleibt die (oft große) Aufnahme in **Google Drive** des zentralen Kontos und
wird von Google automatisch **transkribiert**. medipact speichert nur den
Playback-Link + Transkript.

> **Wichtig – zusätzliche Voraussetzungen gegenüber den reinen Meet-Links:**
> Die Aufnahme über die API funktioniert **nicht mit einem kostenlosen
> Gmail-Konto**. Nötig sind:
>
> - Ein **Google-Workspace-Tarif** mit Aufnahme-Berechtigung: **Business
>   Standard**, **Enterprise** oder **Education Plus**.
> - In der Admin-Konsole müssen **Aufnahme** und **Transkription** für die
>   Organisationseinheit des zentralen Kontos **aktiviert** sein
>   (Apps → Google Workspace → Google Meet → Meet-Videoeinstellungen).
> - Im Cloud-Projekt zusätzlich die **Google Meet REST API** aktivieren
>   (neben der Calendar API).
> - Ein Refresh-Token mit den **zusätzlichen Meet-Scopes**
>   (`meetings.space.created`, `meetings.space.readonly`).

**Einrichtung:**

1. Google Meet REST API aktivieren:
   „APIs & Dienste" → „Bibliothek" → „Google Meet API" → **Aktivieren**.
   Im OAuth-Zustimmungsbildschirm die beiden Scopes
   `.../auth/meetings.space.created` und `.../auth/meetings.space.readonly`
   ergänzen.
2. Refresh-Token **mit Aufnahme-Scopes** neu erzeugen:

   ```bash
   cd backend
   python scripts/google_meet_get_refresh_token.py \
       --client-id DEINE_CLIENT_ID \
       --client-secret DEIN_CLIENT_SECRET \
       --with-recording
   ```

   (Falls das Konto den Zugriff schon einmal freigegeben hat und kein
   `refresh_token` zurückkommt: unter
   <https://myaccount.google.com/permissions> widerrufen und erneut ausführen.)
3. In die Backend-`.env` zusätzlich setzen und Backend neu starten:

   ```env
   GOOGLE_MEET_RECORDING_ENABLED=true
   ```

Ist das Flag `true` und der Refresh-Token gültig, zeigt das Einladungsformular
statt der Browser-Aufnahme den **Video/Audio-Umschalter mit „Aufnahme in Google
Meet starten"**. Ablauf: Meet-Raum öffnet sich → Botschaft aufnehmen → Meeting
beenden → „Aufnahme abrufen". Die Aufnahme ist **asynchron** (ein bis zwei
Minuten Verarbeitung nach Meeting-Ende), bevor Link + Transkript verfügbar sind.

Solange `GOOGLE_MEET_RECORDING_ENABLED` fehlt/`false` ist, bleibt die bisherige
Browser-Aufnahme aktiv – nichts ändert sich.

## Kein Google-Setup? Kein Problem

Solange die Env-Werte leer sind, ist die Funktion deaktiviert: der Button meldet
verständlich, dass Google noch nicht verbunden ist. Ein Meet-Link kann jederzeit
auch **manuell** ins Feld eingefügt werden (`https://meet.google.com/...`).
