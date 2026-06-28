# Mehrsprachigkeit – Architektur-Setup (next-intl)

Stand: Architektur steht, **noch nichts übersetzt**. Englisch ist überall nur
ein 1:1-Spiegel des deutschen Texts (TODO-Marker in den jeweiligen Dateien).

⚠️ **Nur `/` und `/konflikte/trennung` sind aktuell unter `/en/...` erreichbar.**
Alle anderen Marketing-Seiten (`/preise`, `/about`, `/cases/*`, `/konflikte/
nachbarschaft`, `/konflikte/erbschaft`, `/kontakt`, `/karriere`, Rechtstexte
…) liegen noch unter ihrem alten Pfad außerhalb von `app/[locale]/` und
existieren dort **nicht** als `/en/<route>`. Solange das so ist, führen
Header-/Footer-/Cookie-Banner-Links auf Englisch zu 404s, sobald sie auf eine
noch nicht migrierte Seite zeigen — das ist erwartet, nicht ein Bug dieser
Änderung. Das Rezept unten zeigt, wie jede weitere Seite migriert wird.

⚠️ **Wichtig für die Middleware:** `middleware.ts` enthält eine Allow-Liste
`MIGRATED_LOCALE_ROUTES`, die next-intl nur für tatsächlich migrierte Pfade
aktiviert (aktuell `"/"` und `"/konflikte/trennung"`). Das ist nötig, weil
next-intl sonst *jeden* Pfad intern auf `/de/<pfad>` umschreibt, auch wenn es
dafür gar keine `app/[locale]/<pfad>/page.tsx` gibt — das hätte sonst auch
die deutschen, noch nicht migrierten Seiten kaputt gemacht (404 statt der
alten, funktionierenden Seite). Beim Migrieren einer neuen Seite **muss**
ihr Pfad in diese Liste aufgenommen werden, siehe Schritt 5 im Rezept.

## Was wurde gebaut

- `i18n/routing.ts`, `i18n/navigation.ts`, `i18n/request.ts` – next-intl-Kern.
  `localePrefix: "as-needed"` heißt: Deutsch (Standard) bleibt unpräfigiert
  (`/konflikte/trennung`), Englisch bekommt `/en/...`. Bestehende URLs/SEO
  bleiben also unangetastet.
- `middleware.ts` – kombiniert die next-Auth-Logik (Dashboard/Workspace/Auth
  bleiben **außerhalb** des i18n-Systems, rein Deutsch) mit next-intls
  Locale-Erkennung für alle anderen Routen.
- `app/layout.tsx` – liest die Locale serverseitig (`getLocale()`), setzt
  `<html lang>` dynamisch und umschließt die App mit
  `NextIntlClientProvider`. Bleibt der einzige Root-Layout (ein `<html>`-Tag
  für die ganze App, marketing wie dashboard).
- `app/[locale]/layout.tsx` – validiert das `:locale`-Segment, kein eigenes
  `<html>`/`<body>`.
- `messages/de.json`, `messages/en.json` – Übersetzungs-Strings für Header,
  Footer, Cookie-Banner (die "Chrome"-Elemente, die auf jeder Marketing-Seite
  auftauchen).
- Referenzbeispiele für das Seiteninhalts-Pattern:
  - `app/[locale]/page.tsx` (Startseite)
  - `app/[locale]/konflikte/trennung/page.tsx` +
    `app/content/trennungPage.{de,en}.ts` + `trennungPage.loader.ts`

## Vor dem ersten Start

```bash
npm install
npm run dev
```

`next-intl` wurde in `package.json` eingetragen, aber noch nicht installiert
(meine Shell-Sandbox war diese Session nicht verfügbar). `npm install` zieht
es beim nächsten Lauf automatisch.

Danach testen: `http://localhost:3000/` (Deutsch, unverändert) und
`http://localhost:3000/en` (Englisch, identischer Text, andere URL).

## Wie man eine weitere Marketing-Seite migriert (Rezept)

Am Beispiel `/konflikte/nachbarschaft`, analog für alle anderen unter
`app/<route>/page.tsx`:

1. Content-Datei aufteilen: aus `app/content/nachbarschaftPage.ts` werden
   `nachbarschaftPage.de.ts` (Inhalt 1:1 übernehmen) und
   `nachbarschaftPage.en.ts` (vorerst ebenfalls deutscher Text, mit
   TODO-Kommentar).
2. Loader anlegen: `nachbarschaftPage.loader.ts` mit
   `getNachbarschaftPageContent(locale)` (Kopiervorlage:
   `trennungPage.loader.ts`).
3. Alte `nachbarschaftPage.ts` zu einem Re-Export der `.de.ts`-Version
   machen (Kopiervorlage: aktuelle `trennungPage.ts`) – damit Stellen, die
   noch nicht migriert sind (z. B. `ThemenTabs.tsx`), weiterlaufen.
4. Seite nach `app/[locale]/konflikte/nachbarschaft/page.tsx` verschieben,
   `params: Promise<{ locale: AppLocale }>` annehmen und
   `getNachbarschaftPageContent(locale)` statt des statischen Imports
   verwenden (Kopiervorlage: `app/[locale]/konflikte/trennung/page.tsx`).
5. In `middleware.ts` den Pfad zu `MIGRATED_LOCALE_ROUTES` hinzufügen
   (z. B. `"/konflikte/nachbarschaft"`). **Ohne diesen Schritt bricht die
   Seite** – next-intl würde sie sonst gar nicht anfassen und sie bliebe
   bei der alten, alleinstehenden Version (kein Fehler, aber auch kein
   `/en`-Zugriff). Umgekehrt: eine Route in der Liste, für die es noch
   keine `app/[locale]/...`-Datei gibt, führt zu einem 404 — die Liste muss
   exakt den migrierten Seiten entsprechen.
6. Alte Datei `app/konflikte/nachbarschaft/page.tsx` löschen (siehe unten).

Für Seiten ohne strukturiertes Content-Objekt (z. B. `/preise`, `/kontakt`,
`/about`, alle `/cases/*`) gilt dasselbe Prinzip, nur dass der Text meist
direkt im JSX steht statt in einem Content-Objekt — dort einfach Schritt 1–3
weglassen und die Strings direkt in eine neue `messages/*.json`-Sektion
auslagern (Pattern wie bei Header/Footer).

## Aufräumen – diese alten Dateien können gelöscht werden

Ich konnte sie in dieser Session nicht löschen (keine Shell verfügbar),
deshalb existieren sie aktuell noch parallel zu ihren `[locale]`-Pendants
und sind **funktionslos** sobald die Middleware aktiv ist (next-intl
rewritet `/` intern auf die Default-Locale, die alte `app/page.tsx` wird
dadurch nie mehr aufgerufen):

```bash
git rm app/page.tsx
git rm app/konflikte/trennung/page.tsx
```

Beim Migrieren weiterer Seiten entsprechend die jeweilige alte
`app/<route>/page.tsx` löschen, sobald `app/[locale]/<route>/page.tsx`
funktioniert.

## Bekannte Lücken (bewusst nicht in diesem Schritt gelöst)

- **`Button.tsx`** (`app/components/ui/Button.tsx`) verwendet noch
  `next/link` statt der locale-bewussten `Link` aus `i18n/navigation.ts`.
  Es wird sowohl auf Marketing-Seiten als auch potenziell anderswo
  verwendet, daher hier nicht pauschal umgestellt. Effekt: interne Links,
  die über `<Button href="...">` gerendert werden (z. B. "Zur Übersicht"
  in `trennungPageContent`), bekommen auf Englisch noch **kein** `/en`-
  Präfix. Lösung später: Button entweder marketing-spezifisch klonen oder
  per Pfad-Heuristik (`href.startsWith("/")` und nicht `/auth`,
  `/dashboard`, `/workspace`) die i18n-Link-Komponente nutzen.
- Inhaltstexte der Startseite (Stats, Überschriften, finaler CTA-Block in
  `app/[locale]/page.tsx`) sind weiterhin hartcodiertes Deutsch — nur
  Routing/Provider wurden migriert, wie im Dateikommentar dort vermerkt.
- `app/[marketing]/layout.tsx` ist ein alter, ungenutzter dynamischer
  Routenordner (keine `page.tsx` darunter) — vermutlich Altlast, kann
  vermutlich ebenfalls gelöscht werden, aber nicht Teil dieser Änderung.

## Sprachumschalter

Noch nicht gebaut (war nicht Teil dieser Architektur-Runde). Sobald
gewünscht: kleine Client-Komponente mit `usePathname`/`useRouter` aus
`@/i18n/navigation`, die per `router.replace(pathname, { locale: next })`
umschaltet — passt in Header.tsx neben die CTA.
