// lib/seo.ts
//
// Einheitlicher Metadata-Builder für alle Marketing-Seiten.
//
// Hintergrund: Next.js vererbt `openGraph` und `twitter` als ganze Objekte
// aus dem Root-Layout. Eine Unterseite, die nur `title` und `description`
// setzt, überschreibt damit NICHT den og:title — sie erbt weiterhin den
// generischen Layout-Wert ("Mediation online: Konflikte lösen ohne Gericht").
// Genau das war live auf jeder Unterseite der Fall: 30 Seiten mit korrektem
// <title>, aber identischem og:title/og:description beim Teilen.
//
// `title.template` hilft hier nicht — Templates gelten pro Feld, und
// openGraph.title fällt nicht auf title zurück. Deshalb spiegelt dieser
// Helper die Werte explizit. Kein Raten, kein Framework-Sonderverhalten.
//
// Verwendung:
//
//   export const metadata: Metadata = pageMetadata({
//     title: "Erbschaftsstreit lösen: fair einigen ohne Gericht | medipact",
//     description: "…",
//     path: "/konflikte/erbschaft",
//   });

import type { Metadata } from "next";

export const SITE_URL = "https://medipact.de";

type PageMetadataInput = {
  /** Vollständiger <title>, inkl. "| medipact". Wird 1:1 als og:title gespiegelt. */
  title: string;
  /** Meta-Description. Wird 1:1 als og:description gespiegelt. */
  description: string;
  /** Pfad ab Root, mit führendem Slash, z. B. "/konflikte/trennung". */
  path: string;
  /** "article" für Ratgeber-Artikel und Fallbeispiele, sonst "website". */
  type?: "website" | "article";
  /**
   * Eigenes OG-Bild (absolute URL). Ohne Angabe bleibt das Standardbild aus
   * dem Root-Layout erhalten — bewusst kein Default hier, damit wir das
   * geerbte 1200x630-Banner nicht versehentlich mit einem anderen Format
   * überschreiben.
   */
  image?: string;
};

export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  image,
}: PageMetadataInput): Metadata {
  const url = `${SITE_URL}${path}`;

  // og:url pro Seite ist hier unproblematisch: Der Wert wird aus `path`
  // abgeleitet und stimmt damit immer mit dem Canonical überein. Der alte
  // Grund, og:url wegzulassen (geerbte Startseiten-URL auf Unterseiten),
  // entfällt durch diesen Helper.
  const shared = {
    url,
    title,
    description,
    ...(image && {
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    }),
  };

  // Bewusst zwei getrennte Literale statt `{ type, ...shared }`: Next
  // typisiert `openGraph` als diskriminierte Union über `type`. Eine
  // Variable vom Typ `"website" | "article"` narrowt die Union nicht, das
  // Objekt wäre dann keinem Zweig zuweisbar.
  const openGraph =
    type === "article"
      ? ({ type: "article", ...shared } as const)
      : ({ type: "website", ...shared } as const);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image && { images: [image] }),
    },
  };
}
