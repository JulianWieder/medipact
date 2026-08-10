# Analyse: Warum keine Marketing-Seite vorgerendert wird

Stand 10.08.2026. **Befund + Patch-Vorschlag, noch keine Änderung am Code.**

## 1. Die Ursache

`app/layout.tsx`, Zeilen 155/156:

```ts
const locale = await getLocale();
const messages = await getMessages();
```

`getLocale()` aus `next-intl/server` liest im Root-Layout die Request-Header
(next-intl setzt `x-next-intl-locale` in der Middleware). Ein Layout, das
`headers()` anfasst, macht **jede darunterliegende Route dynamisch** — und das
Root-Layout liegt unter *allen* Routen. Damit rendert Next kein einziges
`/methode`, `/konflikte/*`, `/ratgeber/*`, `/preise`, `/about` statisch vor,
obwohl der Inhalt dieser Seiten vollständig aus Konstanten kommt.

Das ist der offene Punkt aus dem Mobil-LCP-Thema (05.08.2026). Nicht das Foto,
nicht die Fonts — der TTFB.

## 2. Warum der naheliegende Fix nicht geht

Der Reflex wäre, `NextIntlClientProvider` aus dem Root-Layout zu entfernen. Geht
nicht: `Header.tsx` und `Footer.tsx` rufen `useTranslations()` und liegen über
`ConditionalHeader` im Root-Layout, also auf jeder Seite. Ohne Provider brechen
sie überall.

Der zweite Reflex wäre, im Root-Layout hart `locale = "de"` zu setzen und die
deutschen Messages statisch zu importieren. Das kostet fast nichts — **aber**:
`messages/de.json` und `en.json` unterscheiden sich in 46 von 152 Schlüsseln,
und die Unterschiede liegen fast vollständig in `nav.*` und `footer.*` — also
exakt in dem, was Header und Footer rendern. Ergebnis wäre deutsche Navigation
auf `/en` und `/en/konflikte/trennung`. Zwei Seiten, beide bewusst nicht
indexiert — trotzdem eine sichtbare Regression, kein sauberer Fix.

## 3. Der saubere Weg: zwei Root-Layouts über Route Groups

Next erlaubt mehrere Root-Layouts, wenn es **kein** `app/layout.tsx` gibt,
sondern jede Route-Group ihr eigenes hat. Route Groups ändern keine URLs.

```
app/
  (de)/layout.tsx      <html lang="de">, Provider mit statisch importierten
                       de-Messages → vollständig statisch
    about/ agb/ einigung/ konflikte/ kostenrechner/ methode/ preise/
    ratgeber/ kontakt/ karriere/ impressum/ datenschutz/ cookies/
    konflikt-logbuch/ cases/
  [locale]/layout.tsx  <html lang={locale}>, setRequestLocale + generateStaticParams
    page.tsx  konflikte/trennung/
  (app)/layout.tsx     dashboard/ workspace/ auth/ onboarding/ invite/
                       — ohnehin dynamisch, hier ändert sich nichts
```

Nach der Verschiebung ist der `(de)`-Zweig statisch, weil kein `getLocale()`
mehr in seiner Kette liegt. Der `[locale]`-Zweig wird über `setRequestLocale` +
`generateStaticParams` statisch — genau das, wofür
`app/[locale]/layout.tsx` bereits vorbereitet ist (der Aufruf steht schon drin,
er läuft nur zu spät, weil das Root-Layout vorher rendert).

### Aufwand und Risiko

- Mechanisch: 14 Ordner verschieben, drei Layouts schreiben, das alte
  `app/layout.tsx` auflösen (Metadata, Fonts, JsonLd, Analytics, CookieConsent
  müssen in **jedes** der drei Root-Layouts, sonst fehlen sie).
- Risiko: mittel. Die Fallstricke sind bekannt — `MIGRATED_LOCALE_ROUTES` und
  die `Link`-Herkunft (`@/i18n/navigation` vs. `next/link`) müssen unverändert
  bleiben, sonst kommt die `/de/en/methode`-Schleife zurück.
- **Nicht in der Sandbox verifizierbar:** `next build` läuft dort nicht. Das
  muss auf dem Server gebaut werden, und zwar vor dem Deploy.

## 4. Empfehlung

Der Fix ist richtig, aber er ist keine Nebenbei-Änderung: Er fasst das
Root-Layout aller Routen an, inklusive Dashboard und Auth. Sinnvoll als eigener
Branch mit einem Build auf dem Server als Abnahmekriterium — nicht zwischen zwei
Content-Änderungen.

Zwischenschritt, falls das zu groß ist: erst messen. `curl -sI` auf `/methode`
und die `x-nextjs-cache`- bzw. `x-vercel-cache`-freien Response-Header bzw. das
Build-Manifest zeigen, wie viel TTFB tatsächlich auf das dynamische Rendern
entfällt. Wenn der Server ohnehin schnell antwortet, ist der Hebel kleiner als
er aussieht — dann lohnt der Umbau erst zusammen mit der EN-Übersetzung, die
dieselbe Struktur ohnehin braucht.
