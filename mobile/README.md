# medipact Logbuch – Mobile-App (Expo / React Native)

Native App (Android + iOS) für das kostenlose Konflikt-Logbuch: Einträge
schreiben und lesen, KI-Analyse pro Eintrag, Foto-/Datei-Uploads. Die App
spricht die FastAPI **direkt** per JWT (`/auth/login`) – nicht den
Next.js-Proxy.

## Voraussetzung auf dem Server (einmalig)

Die FastAPI ist bisher nur intern erreichbar. In `nginx/medipact.conf` ist
jetzt eine Location `/backend/` ergänzt, die auf `127.0.0.1:8000` durchreicht.
Auf dem Server deployen und nginx neu laden:

```bash
sudo cp nginx/medipact.conf /etc/nginx/sites-available/medipact.conf   # Pfad ggf. anpassen
sudo nginx -t && sudo systemctl reload nginx
```

Test: `curl https://medipact.de/backend/docs` → FastAPI-Swagger-Seite.

## Entwicklung starten (auf deinem PC)

```bash
cd mobile
npm install
npx expo install --fix   # richtet alle Paketversionen exakt aufs Expo-SDK aus
npx expo start
```

Dann die **Expo Go**-App aus dem Play Store / App Store auf dem Handy
installieren und den QR-Code aus dem Terminal scannen (Handy und PC im selben
WLAN; sonst `npx expo start --tunnel`).

Login mit einem bestehenden medipact-Konto (Registrierung weiterhin über die
Website).

## Konfiguration

- Standard-API: `https://medipact.de/backend` (in `app.json` → `extra.apiUrl`).
- Lokales Backend testen: `EXPO_PUBLIC_API_URL=http://<PC-IP>:8000 npx expo start`
  (nicht `localhost` – das Handy muss den PC im WLAN erreichen).

## Was die App kann (V2)

- Login (JWT, Tokens im SecureStore, automatischer Refresh)
- Logbuch-Übersicht + neues Logbuch anlegen (5 Konfliktarten wie im Web)
- **Logbuch & Journal zum Fall**: laufende Mediationen erscheinen als eigener
  Abschnitt – das Logbuch läuft nach der Umwandlung dort weiter
- Einträge erfassen: Formularfelder kommen live aus der WFM-Vorlage
  (`phase=logbuch`, `step_key=logbuch_eintrag`) – Änderungen im Designer
  wirken sofort auch in der App
- KI-Analyse pro Eintrag (auto nach dem Speichern, Quota-Anzeige,
  Premium-Hinweis; Kauf bewusst NUR auf der Website → keine 30 %
  Store-Provision, keine IAP-Pflicht verletzt, solange die App keinen
  direkten Kauf-Link enthält)
- Foto-/Datei-Uploads (Galerie oder Dokumente, max. 25 MB); App-Anhänge
  landen als `anhang_N` im Eintrags-`content`
- Bearbeiten/Löschen eigener Einträge (mit Rückfrage vor dem Löschen);
  fremde (geteilte) Einträge sind schreibgeschützt (`is_own`)
- **Sichtbarkeit je Eintrag** wie im Web: Checkbox „🔒 Sensibel – nur für mich"
  (= `private`), Standard `personal`; im verknüpften Fall lassen sich Einträge
  einzeln „In Mediation teilen" (= `shared`) und wieder zurückziehen
- **Filter-Chips** (Alle / Dokumentation / Sensibel / Geteilt)
- **Business/ODR-Variante**: „Falldokumentation" mit sachlichen Labels
  (Vorgang, Interne Notiz, Besprechung, Nachricht), ohne Sensibel-Schalter und
  ohne persönlichen KI-Tipp

Bewusst nicht enthalten: Intake-Flow und Umwandlung in eine Mediation (beides
auf der Website – dort hängt der Start-Flow mit Paketwahl und Einladung dran),
Premium-Kauf, Offline-Modus, Push-Notifications.

## Später: echte Store-Apps bauen

Expo Go ist nur für die Entwicklung. Für Play Store / App Store:

```bash
npm install -g eas-cli
eas login            # kostenloses Expo-Konto
eas build --platform android   # .aab für den Play Store
eas build --platform ios       # braucht Apple Developer Account (99 $/Jahr)
eas submit
```

Vorher in `app.json` Icon/Splash ergänzen (`expo.icon`, `expo.splash`).
