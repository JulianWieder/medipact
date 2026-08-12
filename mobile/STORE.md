# medipact Kalender in den Play Store

Diese Datei ist die Arbeitsliste für die Veröffentlichung. Sie beschreibt nur
das, was **nicht** im Code steht — der Code ist fertig, sobald der Typecheck
läuft (Schritt 1).

Reihenfolge: Android zuerst, iOS später. Der Grund steht in „Danach iOS".

---

## Der Stand

Aus `mobile/` entstehen **zwei** Store-Apps aus derselben Codebasis:

| | Logbuch | Kalender |
| --- | --- | --- |
| Name im Store | medipact Logbuch | medipact Kalender |
| Paket-ID | `de.medipact.logbuch` | `de.medipact.kalender` |
| Startbildschirm | Liste der Logbücher | direkt der Betreuungskalender |
| Build-Profil | `produktion` | `produktion-kalender` |

Umgeschaltet wird beim Bauen über `MEDIPACT_APP` (siehe `app.config.ts`).
**Die Paket-ID ist unveränderlich**, sobald einmal veröffentlicht — vor dem
ersten Upload also sicher sein, dass `de.medipact.kalender` so bleiben soll.

---

## 1. Code prüfen (auf dem Server)

```bash
cd ~/medipact/mobile
npm install
npx expo install --fix
npx tsc --noEmit          # muss ohne Ausgabe durchlaufen
```

Dann beide Varianten im Expo Go gegenprüfen — die Kalender-Variante ist neu
und ungetestet:

```bash
MEDIPACT_APP=kalender npx expo start --tunnel
```

Erwartet: Login → direkt der Betreuungskalender. Wer kein Logbuch hat, sieht
„Noch kein Kalender". Der Zurück-Pfeil oben meldet ab (es gibt nichts
darüber).

---

## 2. Play Console einrichten

- Konto anlegen: **25 $ einmalig**, keine Jahresgebühr.
- **Achtung, das ist der lange Weg:** Neue *persönliche* Entwicklerkonten
  müssen vor der Veröffentlichung einen geschlossenen Test bestehen —
  **12 Tester, die 14 Tage durchgehend angemeldet bleiben**. Die Frist beginnt
  erst, wenn wirklich 12 Leute die App installiert haben; fällt einer raus,
  läuft der Zähler von vorn. Organisationskonten (eingetragene juristische
  Person) sind davon **befreit**. Wenn es medipact als Firma gibt, ist das der
  Umweg, der sich rechnet — sonst plane die 12 Tester fest ein.
- Zahlungsprofil hinterlegen, auch wenn die App kostenlos ist.

## 3. Was Google vor der Freigabe abfragt

- [ ] **Datenschutzerklärung** — URL, öffentlich, ohne Login: `medipact.de/datenschutz`. Muss die App ausdrücklich mit abdecken, nicht nur die Website.
- [ ] **Konto-Löschung** — **offener Punkt, siehe unten.**
- [ ] **Data-Safety-Formular** — erhoben werden: E-Mail (Konto), Name, Termin-/Betreuungsdaten, hochgeladene Dateien. Verschlüsselt in der Übertragung: ja (HTTPS). Löschbar: siehe Konto-Löschung.
- [ ] **Inhaltsbewertung** — Fragebogen, ergibt hier voraussichtlich USK 0/6.
- [ ] **Zielgruppe** — „nicht primär für Kinder", auch wenn Kinder einen Lesezugang haben. Sonst greift die *Families*-Richtlinie mit deutlich strengeren Auflagen.
- [ ] **Store-Eintrag**: Titel (max. 30 Zeichen), Kurzbeschreibung (80), Beschreibung (4000), Feature-Grafik 1024×500, mindestens 2 Screenshots je Formfaktor.

## 4. Bauen und hochladen

```bash
npm install -g eas-cli
eas login
eas build:configure

# Erst ein Test-APK zum Draufschauen:
MEDIPACT_APP=kalender eas build -p android --profile test-kalender

# Dann das Store-Bundle:
MEDIPACT_APP=kalender eas build -p android --profile produktion-kalender
eas submit -p android --profile produktion-kalender
```

Ein Mac ist nicht nötig, EAS baut in der Cloud. Die Signierschlüssel legt EAS
beim ersten Build an und verwahrt sie — **gehen sie verloren, lässt sich die
App nie wieder aktualisieren.** Einmalig sichern:
`eas credentials` → Keystore herunterladen.

---

## Konto-Löschung — erledigt

Die URL für das Data-Safety-Formular lautet:

```
https://medipact.de/konto-loeschen
```

Ohne Login erreichbar, benennt was gelöscht wird, was bleibt und warum. In
der App steckt der Weg dorthin hinter dem Pfeil oben links (Konto-Menü) —
beide Stores verlangen, dass die Löschung **aus der App heraus** erreichbar
ist, nicht nur auf der Website.

Zwei Wege, und welcher greift, entscheidet der Datenbestand, nicht der Client:

| Lage | Was passiert |
| --- | --- |
| keine laufende Mediation | **sofort und endgültig** — Konto, Logbücher, Kalender, Absprachen, Uploads, Kinder-Zugänge, Newsletter |
| Partei einer Mediation | **Antrag** wird vermerkt, Löschung nach Abschluss; Rechnungen bleiben (§ 147 AO, 10 Jahre) |

Umgesetzt in `backend/app/services/konto.py`, Endpunkte unter `/konto`,
Migration `k6l7m8n9o0p1`. Die Löschkaskade wird aus den SQLAlchemy-Metadaten
abgeleitet statt abgetippt — eine gepflegte Tabellenliste wäre beim nächsten
neuen Feature still unvollständig, und „still unvollständig" heißt hier:
Daten, die jemand ausdrücklich löschen wollte, bleiben liegen.

**Vor dem ersten Store-Upload einmal echt durchspielen** (Testkonto, kein
Verfahren): löschen, danach Login versuchen. Und ein zweites mit laufendem
Fall: muss den Antragsweg nehmen, nicht löschen.

---

## iOS

Ein Mac ist **nicht** nötig, EAS baut in der Cloud. Der Code ist derselbe;
`app.config.ts` bringt inzwischen alles mit, was Apple technisch verlangt
(Berechtigungstexte, Privacy Manifest, Exportkontrolle).

### Konto und Einrichtung

- Apple Developer Program: **99 $ pro Jahr**, kein Einmalpreis (Android war
  25 $ einmalig — der Unterschied fällt auf Dauer ins Gewicht).
- Als Privatperson sofort startklar; **dein Klarname steht dann als Anbieter
  im Store**. Bei einer Mediations-App ist das eine Überlegung wert. Als
  Organisation brauchst du eine kostenlose D-U-N-S-Nummer, Prüfung bis zu
  zwei Wochen.
- In App Store Connect die App anlegen (Bundle-ID `de.medipact.kalender`),
  dann in `eas.json` unter `submit.produktion-kalender.ios` die beiden
  Platzhalter `ascAppId` und `appleTeamId` ersetzen.

### Bauen und einreichen

```bash
MEDIPACT_APP=kalender eas build -p ios --profile testflight-kalender
eas submit -p ios --profile produktion-kalender
```

Zertifikate und Provisioning legt EAS beim ersten Build selbst an. Über
TestFlight kannst du die App auf dein eigenes iPhone holen, bevor die Prüfung
läuft — **mach das**, die Kalender-Variante ist auf iOS bisher von niemandem
gesehen worden.

### Was in App Store Connect abgefragt wird

- [ ] **Demo-Zugang** für die Prüfung: Testkonto mit E-Mail und Passwort, an
      dem ein Kalender mit echten Terminen hängt. Ohne den wird abgelehnt —
      der Prüfer sieht hinter dem Login sonst nichts. Häufigster
      Ablehnungsgrund überhaupt.
- [ ] **App-Datenschutz** (Apples Gegenstück zum Data-Safety-Formular):
      E-Mail, Name, Betreuungs-/Termindaten, hochgeladene Dateien. Alles
      „mit dem Nutzer verknüpft", nichts für Tracking oder Werbung.
- [ ] **Datenschutz-URL**: `medipact.de/datenschutz`.
- [ ] **Screenshots** für 6,7″ und 6,5″ iPhone (iPad entfällt, weil
      `supportsTablet: false` steht).
- [ ] **Altersfreigabe** — Fragebogen, ergibt hier voraussichtlich 4+.

### Die drei Richtlinien, an denen es hängen kann

- **5.1.1(v) — Konto und Registrierung.** Der eine Teil trifft uns nicht:
  die App erzeugt keine Konten, registriert wird auf der Website, also
  greift die Pflicht zur Löschung *in der App* streng genommen nicht. Der
  andere Teil schon: Apple lehnt Apps ab, die zum Login zwingen, ohne dass
  es dafür einen Grund gibt. Bei einem Kalender, den sich zwei Haushalte
  teilen, ist der Grund offensichtlich — das gehört so in die
  Prüfungsnotiz geschrieben. **Praktisch löst du beides auf einmal, indem
  in der App ein Punkt „Konto löschen" auf die Web-Seite verlinkt.** Die
  brauchst du für Google ohnehin (siehe oben), und bei Apple nimmt sie den
  häufigsten Streitpunkt vorweg.
- **3.1.1 — In-App-Kauf.** Die App darf nicht zum Kauf von Premium führen,
  auch nicht per Link. Sie tut es nicht und soll es nicht: das kostet
  entweder 30 % Provision oder die Freigabe. Der Verkauf bleibt auf der
  Website.
- **4.2 — Mindestfunktionalität.** Trifft uns nicht. Das ist eine echte
  native App, keine verpackte Website — genau deshalb war die Entscheidung
  gegen einen WebView-Wrapper richtig.
