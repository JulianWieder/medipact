# /einigung-Cluster: Commit, Deploy, Google Search

## Achtung: fremde Änderungen im Arbeitsbaum

`git status` zeigt zusätzlich Dateien, die **nicht** zu diesem Cluster gehören —
offenbar eine unfertige SessionTimer-Arbeit aus einer früheren Sitzung:

```
app/components/layout/SessionTimer.tsx   (neu)
lib/session.ts                           (neu)
tsconfig.timer.json                      (neu)
auth.ts
app/auth/login/page.tsx
app/components/layout/DashboardHeader.tsx
app/components/layout/DashboardHeaderClient.tsx
app/components/ui/Icon.tsx
app/dashboard/[id]/layout.tsx
tsconfig.check.json
```

Deshalb unten **kein `git add -A`**, sondern eine explizite Dateiliste.
Wenn der SessionTimer mit soll, häng ihn bewusst als zweiten Commit an.

---

## 1. Commit (PowerShell, im Projektordner)

```powershell
cd C:\Users\User\Documents\medipact

git add `
  app/einigung `
  app/content/einigungPage.ts `
  app/content/einigungOhneMediatorPage.ts `
  app/content/einigungAbgleichPage.ts `
  app/content/einigungGleichbehandlungPage.ts `
  app/components/AbgleichDiagramm.tsx `
  app/sitemap.ts `
  app/components/Header.tsx `
  "app/[locale]/page.tsx" `
  app/methode/page.tsx `
  app/preise/page.tsx `
  app/about/page.tsx `
  app/kontakt/page.tsx `
  app/konflikt-logbuch/page.tsx `
  app/cases `
  messages/de.json `
  messages/en.json `
  docs/einigung-cluster-konzept.md `
  docs/landing-vorher-nachher.md `
  docs/einigung-cluster-deploy.md

git status          # prüfen: nur die obigen Dateien sind staged
```

Commit-Nachricht:

```powershell
git commit -m "feat(marketing): /einigung-Cluster - Einigungsprozess als eigene Seiten

Vier neue Marketing-Seiten, die das Preis- und Standardisierungsargument
tragen, das bisher nirgends stand:

  /einigung                      Der Prozess als Produkt, Begruendung des
                                 Festpreises (statt Stundensatz)
  /einigung/ohne-mediator        Reichweite UND Grenzen des gefuehrten
                                 Prozesses; Longtail auf 'Mediation ohne
                                 Mediator', 'Streit klaeren ohne Anwalt'
  /einigung/abgleich             Der gewichtete Abgleich mit Kontingent und
                                 Logrolling - der einzige Mechanismus, den
                                 kein Wettbewerber hat, bisher nur im
                                 Produkt sichtbar
  /einigung/gleichbehandlung     Fairness im Ablauf; einzige Seite, auf der
                                 KI explizit benannt wird

Ton bewusst wie beim Palantir-Umbau der Landing: beschrieben wird, WAS das
System tut, nicht wie intelligent es ist. Kein 'wegweisende Intelligenz'
als Adjektiv - der Mechanismus traegt das Argument.

Ausserdem:
- AbgleichDiagramm.tsx: statisches Schaubild (zwei Gewichtungen -> Vorschlag),
  deckt alle drei Ausgaenge ab (A entscheidet, B entscheidet, Gleichstand)
- sitemap.ts: 4 URLs, lastModified auf 2026-08-06
- Header: /methode bekommt das Cluster als Untermenue statt eines weiteren
  Top-Level-Eintrags
- Interne Links von Landing (Prozess-Sektion), /methode und /preise, damit
  das Cluster nicht abseits liegt
- FAQPage-JSON-LD auf allen vier Seiten, Service-Schema auf /einigung

/methode entschlackt: KI-Spalte und der Vertraulich/Freiwillig/Neutral-Kasten
sind ins Cluster umgezogen, die Seite beantwortet nur noch, WER den Fall
verantwortet. Ausserdem stand dort '6 Schritte', eine 0-6-Liste und ein
Ratgeber-Link 'Die 5 Phasen' nebeneinander - der Unterschied wird jetzt
erklaert statt verschwiegen.

Snippets: 11 Titles waren ueber 60 Zeichen, 14 Descriptions ueber 155. Bei
allen 12 Fallbeispielen begann der Title mit 'Fallbeispiel' plus Vornamen,
waehrend die Zahl ('800 EUR statt 20.000 EUR') am Ende der Description stand -
also genau in dem Teil, den Google abschneidet. Jetzt fuehrt das Ergebnis,
alle 35 Seiten liegen im Rahmen."

git push
```

---

## 2. Deploy auf dem Server

```powershell
ssh dev@178.104.99.33
```

Auf dem Server:

```bash
cd ~/medipact && ./deploy.sh
```

`deploy.sh` macht Pull, `npm ci`, `npm run build`, `pm2 restart medipact` sowie
Backend und Migrationen. **Es gibt hier keine Migration** — die Änderung ist rein
im Frontend. Wenn du dir den Backend- und Alembic-Teil sparen willst, reicht:

```bash
cd ~/medipact && git pull && npm ci && npm run build && pm2 restart medipact --update-env
```

Danach kurz prüfen:

```bash
curl -sI https://medipact.de/einigung | head -1
curl -s  https://medipact.de/sitemap.xml | grep einigung
```

Erwartung: `HTTP/2 200` und vier `<loc>`-Einträge.

---

## 3. Neue Seiten bei Google anmelden

`robots.ts` erlaubt `/` und verweist bereits auf `https://medipact.de/sitemap.xml`
— die vier Seiten sind also automatisch erlaubt und in der Sitemap. Das reicht
Google grundsätzlich, dauert aber Tage bis Wochen. Schneller geht es so:

**a) Sitemap neu einlesen lassen**

Search Console → *Sitemaps* → `sitemap.xml` steht dort schon. Trag sie einfach
erneut ein (`sitemap.xml` → Senden). Google liest sie daraufhin sofort neu.
`lastModified` steht jetzt auf 2026-08-06, damit sind die neuen URLs als frisch
markiert und die alten unverändert — genau dafür ist der feste Zeitstempel in
`sitemap.ts` da.

**b) Jede der vier URLs einzeln zur Indexierung anfordern**

Search Console → *URL-Prüfung* → URL oben eingeben → *Indexierung beantragen*.
Das ist der schnellste Weg, üblicherweise Stunden bis wenige Tage:

```
https://medipact.de/einigung
https://medipact.de/einigung/ohne-mediator
https://medipact.de/einigung/abgleich
https://medipact.de/einigung/gleichbehandlung
```

Reihenfolge macht Sinn: erst `/einigung` (Parent), dann die drei Kinder.

**c) Rich Results prüfen**

Alle vier Seiten liefern `FAQPage`-JSON-LD, `/einigung` zusätzlich `Service`.
Gegenprüfen unter <https://search.google.com/test/rich-results> — die
URL-Prüfung in der Search Console zeigt strukturierte Daten erst nach dem
nächsten Crawl an, der Test sofort.

**d) Nach ein bis zwei Wochen nachsehen**

Search Console → *Leistung* → Seiten filtern auf `/einigung`. Interessant ist
vor allem `/einigung/ohne-mediator`: Wenn dort Impressionen auf
„ohne mediator“, „ohne anwalt“, „selbst klären“ auftauchen, war die Annahme
richtig und die Seite verdient Ausbau.

**Nicht nötig:** Ein manueller Ping an Google (`/ping?sitemap=`) — der Endpunkt
ist seit 2023 abgeschaltet. Die erneute Einreichung in der Search Console ist
der Ersatz.

---

## 4. Was noch offen ist

- ~~`/methode` entschlacken~~ — erledigt: KI-Spalte und Fairness-Kasten raus,
  Metadata angepasst, 5-vs-6-Phasen erklärt.
- **Snippets nachmessen.** Die 60/155-Grenze hält nicht von allein. Nach jeder
  neuen Seite den Audit wiederholen — alle 35 Seiten liegen aktuell im Rahmen,
  die 35 Ratgeber-Artikel ebenfalls.
- **Landing-Überarbeitung** aus `docs/landing-vorher-nachher.md` — bisher ist nur
  der zusätzliche Link in der Prozess-Sektion gesetzt, die Copy ist unverändert.
- **Marktpreis-Beleg** (Stundensatz klassischer Mediation). Auf `/einigung` steht
  bewusst keine Zahl, nur das Prinzip Stundensatz vs. Festpreis.
- **Schaubild ersetzen?** `AbgleichDiagramm.tsx` ist eine schematische Grafik.
  Ein echter Produkt-Screenshot wäre stärker, muss aber alle drei Ausgänge
  zeigen — sonst wirkt der Abgleich wie eine Mehrheitsentscheidung.
- **ESLint** lief auf dem Mount in einen Timeout. TypeScript (`tsc --noEmit` über
  eine Mini-Config) und ein Transpile-Check über alle geänderten Dateien sind
  sauber durchgelaufen; der erste `npm run build` auf dem Server ist trotzdem
  die eigentliche Probe.
