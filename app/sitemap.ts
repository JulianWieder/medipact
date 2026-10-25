import { MetadataRoute } from "next";
import { ratgeberArticles } from "@/app/content/ratgeberArtikel";
import { KARRIERE_ONLINE } from "@/app/karriere/status";
import { routing, isIndexedLocalePath } from "@/i18n/routing";
import { SITE_URL } from "@/lib/seo";

// ── Was hier hineingehoert ──────────────────────────────────────────────────
//
// Jede indexierbare Seite mit ihrer kanonischen URL — exakt der `path`, den
// die Seite an pageMetadata() (lib/seo.ts) gibt. Bewusst NICHT hinein:
//   - noindex-Seiten: /impressum, /agb, /datenschutz, /cookies,
//     /konto-loeschen, /kostenrechner/embed, /onboarding, /dashboard/*
//   - Redirects: /konflikte/geschaeft (-> /odr), /konflikte/wg (-> /konflikte),
//     /cases/nachbarschaft (-> /cases), /konflikte/trennung
//     (-> /scheidungsmediation) und die Alt-Slugs in next.config.ts.
//     Eine Sitemap listet Ziele, keine Weiterleitungen.
//   - /auth, /workspace, /invite, /newsletter (robots.ts sperrt sie ohnehin).
//
// Sprachfassungen entstehen automatisch: Jeder Pfad in INDEXED_LOCALE_ROUTES
// (i18n/routing.ts) bekommt pro Sprache einen Eintrag, alle mit denselben
// hreflang-Alternates wie im <head>. Eine /en-Seite freigeben heisst also:
// dort eintragen, hier nichts aendern.

// ── lastModified ────────────────────────────────────────────────────────────
//
// KEIN `new Date()`. Die Route wird dynamisch gerendert; ein frischer
// Zeitstempel bei jedem Abruf meldet Google, jede Seite habe sich gerade
// geaendert — das Signal wird wertlos und kostet Crawl-Budget.
//
// Stattdessen feste Staende, und beim naechsten inhaltlichen Update nur die
// Seiten hochsetzen, die sich WIRKLICH geaendert haben. Wer ein Datum global
// hochsetzt, meldet Google auch die unveraenderten Seiten als neu.
//
// Ein lastmod darf auch nie VOR der Entstehung einer URL liegen (so war es
// bis 17.08. bei /konflikte/arbeitsplatz und /mietverhaeltnis): neue Seiten
// bekommen ihr eigenes Datum.
const STAND = {
  // Grundstand. Zuletzt: /konflikte/arbeitsplatz + /mietverhaeltnis neu,
  // Landing-Texte auf Respekt-Wording. Davor: /fuer-berater (10.08.),
  // /einigung-Cluster (06.08.), Case-Slugs umbenannt (01.08.).
  basis: new Date("2026-08-17"),
  // Intent-Umbau (Verfahren statt Ratgeber): Titles, Descriptions,
  // Service-/Offer-Knoten.
  intent: new Date("2026-09-07"),
  // /methode umgebaut; /preise und /einigung/ohne-mediator mit demselben
  // Sprachumbau ("persoenlich" raus, Sitzungen statt Stundenkontingente,
  // kein falsches "auch vor Ort").
  verfahren: new Date("2026-09-13"),
  // /mediator-finden + /fuer-mediatoren neu, /preise mit eigener Section dazu.
  vermittlung: new Date("2026-10-25"),
};

// Freigabedatum je Sprachfassung (Pfad -> Datum), gilt NUR fuer die
// nicht-deutschen Eintraege: die deutsche Fassung hat sich durch die
// Freigabe nicht geaendert. Wer in INDEXED_LOCALE_ROUTES einen Pfad
// ergaenzt, traegt hier dessen Freigabetag ein — sonst faellt der Eintrag
// auf das deutsche Datum zurueck, das VOR der Existenz der /en-URL liegt.
const SPRACHFREIGABE: Record<string, Date> = {
  "": new Date("2026-10-25"),
};

type Route = {
  path: string;
  lastModified: Date;
  changeFrequency: "weekly" | "monthly";
  priority: number;
};

const m = (path: string, priority: number, lastModified = STAND.basis): Route => ({
  path,
  lastModified,
  changeFrequency: "monthly",
  priority,
});

const ROUTES: Route[] = [
  { path: "", lastModified: STAND.basis, changeFrequency: "weekly", priority: 1.0 },

  // Verfahren & Angebot
  m("/preise", 0.9, STAND.vermittlung),
  m("/methode", 0.8, STAND.verfahren),
  m("/kostenrechner", 0.9),
  m("/konflikt-logbuch", 0.9, STAND.intent),
  m("/about", 0.8),
  m("/kontakt", 0.8),
  // Vertriebs-Asset fuer beratende Berufe, eigene Suchsprache — Prioritaet
  // moderat, die Seite lebt von Direktlinks aus Mails und Gespraechen.
  m("/fuer-berater", 0.7),
  // Zusatzbaustein „Mediator:in vermitteln" (lib/mediatorVermittlung.ts).
  m("/mediator-finden", 0.7, STAND.vermittlung),
  m("/fuer-mediatoren", 0.5, STAND.vermittlung),
  // Nur solange die Stellenanzeige online ist (app/karriere/status.ts).
  ...(KARRIERE_ONLINE ? [m("/karriere", 0.5)] : []),

  // /einigung-Cluster (docs/einigung-cluster-konzept.md). Hoch priorisiert:
  // /ohne-mediator bedient eine Suchintention, die sonst keine Seite traegt.
  m("/einigung", 0.9),
  m("/einigung/ohne-mediator", 0.8, STAND.verfahren),
  m("/einigung/abgleich", 0.8),
  m("/einigung/gleichbehandlung", 0.7),

  // Konfliktarten
  m("/konflikte", 0.8, STAND.intent),
  // Bis 15.08.2026 /konflikte/trennung (301 in next.config.ts).
  m("/scheidungsmediation", 0.7, STAND.intent),
  m("/konflikte/nachbarschaft", 0.7),
  m("/konflikte/erbschaft", 0.7),
  m("/konflikte/odr", 0.7),
  m("/konflikte/verbraucher", 0.7),
  m("/konflikte/mietverhaeltnis", 0.7),
  m("/konflikte/arbeitsplatz", 0.7),

  // Uebersichten
  m("/cases", 0.7),
  m("/ratgeber", 0.7),

  // Fallbeispiele
  ...[
    "nachbarschaft-laerm",
    "nachbarschaft-parken",
    "nachbarschaft-zaun",
    "trennung-mit-kindern",
    "streit-ums-testament",
    "trennung-vermoegen-aufteilen",
    "erbstreit-haus-geschwister",
    "trennung-patchwork-familie",
    "trennung-gemeinsame-firma",
    "unternehmen-geerbt",
    "internationale-trennung",
    "trennung-nach-langer-ehe",
    "gesellschafter-streit",
    "team-konflikt",
    "b2b-projektstreit",
  ].map((slug) => m(`/cases/${slug}`, 0.6)),

  // Ratgeber-Artikel kommen direkt aus dem Content — neue Artikel landen
  // ohne Zutun hier. Jeder traegt sein echtes `updated`-Datum (das auch
  // sichtbar als "zuletzt aktualisiert" auf der Seite steht). Nur neue
  // Snippets (Title/Description) sind KEIN Grund, es hochzusetzen — dann in
  // der Search Console die Indexierung anfordern.
  ...ratgeberArticles.map((a) =>
    m(`/ratgeber/${a.slug}`, 0.7, new Date(a.updated)),
  ),
];

const urlFor = (locale: string, path: string) =>
  `${SITE_URL}${locale === routing.defaultLocale ? "" : `/${locale}`}${path}`;

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.flatMap(({ path, lastModified, changeFrequency, priority }) => {
    if (!isIndexedLocalePath(path)) {
      return [{ url: urlFor(routing.defaultLocale, path), lastModified, changeFrequency, priority }];
    }

    // Freigegebene Sprachfassungen: ein Eintrag pro Sprache, alle mit
    // identischen Alternates (hreflang zaehlt nur gegenseitig).
    const languages = {
      ...Object.fromEntries(routing.locales.map((l) => [l, urlFor(l, path)])),
      "x-default": urlFor(routing.defaultLocale, path),
    };

    return routing.locales.map((locale) =>
      locale === routing.defaultLocale
        ? { url: urlFor(locale, path), lastModified, changeFrequency, priority, alternates: { languages } }
        : {
            url: urlFor(locale, path),
            lastModified: SPRACHFREIGABE[path] ?? lastModified,
            changeFrequency,
            // Eine Stufe unter der deutschen Fassung: Deutsch bleibt der
            // Hauptmarkt, /en ist das Zusatzangebot.
            priority: Math.round((priority - 0.2) * 10) / 10,
            alternates: { languages },
          },
    );
  });
}
