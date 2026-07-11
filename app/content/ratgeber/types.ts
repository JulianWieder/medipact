// ── Ratgeber: Typdefinitionen ───────────────────────────────────────────────
//
// Gemeinsame Typen für alle Ratgeber-Artikel (eine Datei pro Artikel in
// diesem Ordner). Gerendert von RatgeberArtikelTemplate.tsx.

export type RatgeberBlock =
  | { type: "heading"; text: string; id?: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "callout"; text: string }
  | { type: "cta"; text: string; href: string };

export type RatgeberFaq = {
  /** Frage so formulieren, wie Nutzer sie googeln. */
  question: string;
  /** Erster Satz = direkte Antwort (~30 Wörter) für "Nutzer fragen auch". */
  answer: string;
};

export type RatgeberArticle = {
  slug: string;
  /** Kategorie-Label (aktuell nur "Mediation"). */
  category: string;
  /** Sichtbare H1. */
  title: string;
  /** <title> im <head> (mit "| medipact"). */
  metaTitle: string;
  /** Meta-Description + Intro-Absatz. */
  description: string;
  eyebrow: string;
  /** ISO-Datum letzte inhaltliche Aktualisierung. */
  updated: string;
  readingMinutes: number;
  /** Lead-Absatz oben im Artikel. */
  intro: string;
  blocks: RatgeberBlock[];
  faq: RatgeberFaq[];
  /** Interne Verlinkung ans Ende (andere Artikel/Seiten). */
  related: { label: string; href: string }[];
};
