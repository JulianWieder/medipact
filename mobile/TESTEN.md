# Die Logbuch-App testen – Schritt für Schritt

Diese Anleitung setzt nichts voraus außer: du kommst per SSH auf den Server
(`dev@erster`) und hast ein Handy (Android oder iPhone).

Die App läuft **nicht** auf dem Server. Der Server macht nur zwei Dinge: er
liefert die API (`https://medipact.de/backend`) und – während des Testens – den
sogenannten *Bundler*, der den App-Code an dein Handy schickt. Die App selbst
läuft in der kostenlosen Test-App **Expo Go** auf deinem Handy.

---

## Schritt 0 – Expo Go aufs Handy

Im Play Store (Android) bzw. App Store (iPhone) nach **„Expo Go"** suchen und
installieren. Kein Konto nötig, keine Anmeldung. Danach die App wieder
schließen – du brauchst sie erst in Schritt 5.

---

## Schritt 1 – Auf den Server einloggen

Im Terminal auf deinem PC:

```bash
ssh dev@erster
```

Alle folgenden Befehle laufen auf dem Server, nicht auf deinem PC.

---

## Schritt 2 – Zwei Voraussetzungen prüfen

Beide waren zuletzt noch offen. Wenn eine davon fehlt, läuft die App zwar an,
zeigt aber nur Fehler – deshalb zuerst prüfen.

### 2a) Ist die API von außen erreichbar?

```bash
curl -s -o /dev/null -w '%{http_code}\n' https://medipact.de/backend/docs
```

- **`200`** → alles gut, weiter zu 2b.
- **`404`** oder anderes → die nginx-Weiche `/backend/` fehlt noch. Einmalig:

  ```bash
  sudo cp ~/medipact/nginx/medipact.conf /etc/nginx/sites-available/medipact.conf
  sudo nginx -t && sudo systemctl reload nginx
  ```

  Dann den `curl`-Befehl oben wiederholen – jetzt sollte `200` kommen.

### 2b) Ist die Datenbank auf dem neuesten Stand?

```bash
cd ~/medipact/backend && ~/.local/bin/alembic current
```

Ausgegeben wird eine Kennung wie `y7z8a9b0c1d2 (head)`. Erscheint dort etwas
**älteres** als `y7z8a9b0c1d2`, fehlt die Spalte für die Sichtbarkeit – also
genau das, was neu ist. Dann nachziehen:

```bash
~/.local/bin/alembic upgrade head
docker restart medipact-api
```

---

## Schritt 3 – Neuen Code auf den Server holen

```bash
cd ~/medipact
git pull
```

(Wenn du die Änderungen noch nicht committet und gepusht hast, muss das
zuerst passieren – sonst zieht `git pull` nichts Neues.)

---

## Schritt 4 – App-Pakete installieren und prüfen

Nur beim allerersten Mal nötig, dauert ein paar Minuten:

```bash
cd ~/medipact/mobile
npm install
npx expo install --fix
```

`expo install --fix` rückt alle Paketversionen auf den Stand, den das Expo-SDK
erwartet. Danach der Typecheck – der ersetzt, was ich vorab nicht prüfen
konnte:

```bash
npx tsc --noEmit
```

**Keine Ausgabe = alles in Ordnung.** Kommen Fehlermeldungen mit Dateinamen und
Zeilennummern, schick sie mir, bevor du weitermachst.

---

## Schritt 5 – Bundler starten und Handy verbinden

```bash
npx expo start --tunnel
```

Beim ersten Mal fragt Expo, ob es `@expo/ngrok` installieren darf → mit **`y`**
bestätigen. `--tunnel` sorgt dafür, dass dein Handy den Server erreicht, auch
wenn ihr nicht im selben WLAN seid.

Nach ein paar Sekunden erscheint im Terminal ein **QR-Code** (aus Textzeichen
gebaut) und darunter eine Adresse wie `exp://xy-anon.abc.exp.direct:80`.

- **Android:** Expo Go öffnen → „Scan QR code" → QR-Code im Terminal scannen.
- **iPhone:** die normale Kamera-App auf den QR-Code halten → auf die
  Benachrichtigung tippen.
- Falls das Scannen nicht klappt: in Expo Go unten „Enter URL manually"
  wählen und die `exp://…`-Adresse abtippen.

Beim ersten Start lädt die App ein paar Sekunden („Building JavaScript
bundle"). Dann siehst du den medipact-Login.

**Wichtig:** Das Terminal muss offen bleiben, solange du testest. Mit `Strg+C`
beendest du den Bundler.

---

## Schritt 6 – Anmelden

Mit einem ganz normalen medipact-Konto (E-Mail + Passwort) anmelden. Eine
Registrierung gibt es in der App bewusst nicht – die läuft über die Website.

Am aussagekräftigsten testest du mit einem Konto, das schon ein Logbuch **und**
einen laufenden Fall hat.

---

## Schritt 7 – Das hier durchklicken

Diese vier Punkte sind neu. In dieser Reihenfolge durchgehen:

1. **Sensibler Eintrag.** Neues Logbuch anlegen (z. B. „Nachbarschaft") →
   „+ Neuer Eintrag" → Text schreiben → Haken bei **„🔒 Sensibel – nur für
   mich"** → speichern.
   *Erwartet:* Der Eintrag trägt ein Abzeichen „🔒 Sensibel", und über der
   Liste erscheinen Filter-Knöpfe (Alle / Dokumentation / Sensibel). Auf
   „Sensibel" tippen → nur dieser Eintrag bleibt stehen.

2. **Bearbeiten ändert die Sichtbarkeit nicht.** Bei einem beliebigen Eintrag
   auf „Bearbeiten" → Text minimal ändern → speichern.
   *Erwartet:* Das Abzeichen ist danach unverändert. **Das war der eigentliche
   Fehler:** vorher hat jedes Speichern aus der App einen geteilten Eintrag
   still auf „nur für mich" zurückgesetzt.

3. **Geteilter Eintrag im laufenden Fall.** Zurück zur Übersicht. Ganz unten
   steht der Abschnitt **„Logbuch & Journal zum Fall"** mit deinen laufenden
   Mediationen – tippe eine an. Bei einem Eintrag auf **„🤝 In Mediation
   teilen"**.
   *Erwartet:* Abzeichen „🤝 Geteilt", und die Aktion heißt jetzt „Nicht mehr
   teilen". Gegenprobe im Web: Als Mediator im selben Fall ins Logbuch schauen
   – nur dieser eine Eintrag ist dort sichtbar, die sensiblen nie.

4. **Geschäftliches Logbuch.** Neues Logbuch vom Typ **„Geschäft & Arbeit"**
   anlegen.
   *Erwartet:* Es heißt „Falldokumentation", die Eintragsarten heißen Vorgang /
   Interne Notiz / Besprechung / Nachricht, und es gibt **keinen**
   Sensibel-Haken und keinen persönlichen KI-Tipp.

Nebenbei mitprüfen: Löschen fragt jetzt nach („Eintrag löschen?"), und bei
fremden (dir geteilten) Einträgen gibt es Bearbeiten/Löschen gar nicht mehr.

---

## Wenn etwas klemmt

| Was du siehst | Was dahintersteckt |
| --- | --- |
| „Server nicht erreichbar." in der App | Schritt 2a: die nginx-Weiche `/backend/` fehlt oder nginx wurde nicht neu geladen. |
| Login schlägt fehl, obwohl das Passwort stimmt | Auf der Website testen. Klappt es dort, aber nicht in der App, liegt es an der API-Adresse – sag mir Bescheid. |
| Beim Speichern eines Eintrags kommt ein Fehler mit „visibility" | Schritt 2b: `alembic upgrade head` fehlt. |
| Expo Go meldet „Project is incompatible with this version of Expo Go" | Expo Go im Store aktualisieren. |
| QR-Code lässt sich nicht scannen | In Expo Go „Enter URL manually" und die `exp://…`-Adresse eintippen. |
| Änderungen am Code erscheinen nicht | Im Terminal `r` drücken (neu laden) oder in Expo Go das Handy schütteln → „Reload". |

Der Bundler ist reine Testerei: nichts davon verändert die Website oder die
laufende Mediation. Nur die Einträge, die du in der App anlegst, landen
wirklich in der Datenbank – also am besten mit einem Testkonto arbeiten.
