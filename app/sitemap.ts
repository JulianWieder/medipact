import { MetadataRoute } from "next";
import { ratgeberArticles } from "@/app/content/ratgeberArtikel";

const BASE_URL = "https://medipact.de";

export default function sitemap(): MetadataRoute.Sitemap {
  // Wichtig: KEIN `new Date()` hier. Diese Route wird von Next.js dynamisch
  // gerendert, d.h. bei jedem Aufruf (auch durch den Googlebot) würde ein
  // frischer Zeitstempel entstehen — für Google sieht es dann so aus, als
  // wäre jede einzelne Seite bei jedem Crawl "gerade eben geändert" worden.
  // Das macht das lastModified-Signal wertlos (Google kann es nicht mehr
  // nutzen, um echte Änderungen zu priorisieren) und verschwendet
  // Crawl-Budget. Stattdessen: ein fester Stand, der nur beim nächsten
  // inhaltlichen Update dieser Datei manuell hochgesetzt werden sollte.
  // Stand 2026-08-10: /fuer-berater aufgenommen — Landingpage fuer
  // Multiplikatoren (Steuerberater, Notare, Nachfolgeberater). Bewusst
  // KEINE Konflikt-Suchphrasen, damit /konflikte/odr "Mediation bei
  // Geschaeftspartnern" allein traegt.
  // Stand 2026-08-06: neues /einigung-Cluster (4 URLs) aufgenommen, siehe
  // docs/einigung-cluster-konzept.md. Davor 2026-08-01: 9 Case-URLs auf
  // Problem-Slugs umbenannt (neue URLs!), interne Links auf /cases, /methode,
  // /konflikte/erbschaft angepasst.
  const lastModified = new Date("2026-08-10");

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/preise`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    // Vertriebs-Asset, kein SEO-Duplikat: eigene Zielgruppe (beratende
    // Berufe), eigene Suchsprache. Prioritaet bewusst moderat — die Seite
    // soll ueber Direktlinks aus Mails und Gespraechen erreicht werden.
    {
      url: `${BASE_URL}/fuer-berater`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/methode`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // /einigung-Cluster. Bewusst mit hoher Prioritaet: Die Parent-Seite
    // traegt das Preis-/Standardisierungs-Argument, /ohne-mediator bedient
    // eine Suchintention ("Mediation ohne Mediator", "Streit klaeren ohne
    // Anwalt"), die bisher auf keiner Seite beantwortet war.
    {
      url: `${BASE_URL}/einigung`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/einigung/ohne-mediator`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/einigung/abgleich`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/einigung/gleichbehandlung`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/kostenrechner`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/konflikt-logbuch`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/konflikte`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/kontakt`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/karriere`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/konflikte/nachbarschaft`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/konflikte/verbraucher`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/konflikte/trennung`,
      // Kein Sonderdatum mehr nötig: Das gemeinsame lastModified (01.08.)
      // liegt nach der Scheidungsmediation-Umstellung vom 29.07., und die
      // Seite wurde beim Case-Rename am 01.08. erneut angefasst.
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/konflikte/erbschaft`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/konflikte/odr`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/cases`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/ratgeber`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    // /cases/nachbarschaft ist nur noch ein Redirect auf /cases —
    // Redirects gehören nicht in die Sitemap.
    {
      url: `${BASE_URL}/cases/nachbarschaft-laerm`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/cases/nachbarschaft-parken`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/cases/nachbarschaft-zaun`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/cases/trennung-mit-kindern`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/cases/streit-ums-testament`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/cases/trennung-vermoegen-aufteilen`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/cases/erbstreit-haus-geschwister`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/cases/trennung-patchwork-familie`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/cases/trennung-gemeinsame-firma`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/cases/unternehmen-geerbt`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/cases/internationale-trennung`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/cases/trennung-nach-langer-ehe`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/cases/gesellschafter-streit`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/cases/team-konflikt`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/cases/b2b-projektstreit`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Ratgeber-Artikel automatisch aus dem Content generieren —
  // neue Artikel in app/content/ratgeber/ landen ohne Zutun in der Sitemap.
  // Artikel tragen ihr echtes Datum aus dem `updated`-Feld. Vorher bekamen
  // alle den festen Stand oben — die am 27.07. veröffentlichten Artikel
  // meldeten damit ein lastmod von 2026-07-21, also ÄLTER als ihre eigene
  // Veröffentlichung. Genau das Signal, mit dem Google entscheidet, was neu
  // gecrawlt wird, zeigte für die neuesten Seiten in die falsche Richtung.
  const ratgeberRoutes: MetadataRoute.Sitemap = ratgeberArticles.map((a) => ({
    url: `${BASE_URL}/ratgeber/${a.slug}`,
    lastModified: new Date(a.updated),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...ratgeberRoutes];
}
