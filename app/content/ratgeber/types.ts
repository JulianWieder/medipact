// ── Ratgeber: Typdefinitionen ───────────────────────────────────────────────
//
// Gemeinsame Typen für alle Ratgeber-Artikel (eine Datei pro Artikel in
// diesem Ordner). Gerendert von RatgeberArtikelTemplate.tsx.

export type RatgeberBlock =
  | { type: "heading"; text: string; id?: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "callout"; text: string }
  /**
   * Vergleichstabelle (z. B. Mediation vs. Gerichtsverfahren).
   *
   * `caption` ist Pflicht: Sie wird für Screenreader ausgegeben und gibt
   * Suchmaschinen den Kontext der Tabelle. Die erste Spalte jeder Zeile wird
   * als Zeilenkopf (<th scope="row">) gerendert – dort gehört das Merkmal
   * hin, nicht der Wert. Alle Zeilen brauchen so viele Zellen wie `headers`.
   */
  | { type: "table"; caption: string; headers: string[]; rows: string[][] }
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
  /** ISO-Datum letzte inhaltliche Aktualisierung. Sichtbar als
   *  "Aktualisiert am ..." und als `dateModified` im Article-JSON-LD. */
  updated: string;
  /**
   * ISO-Datum der Erstveröffentlichung — optional.
   *
   * Nur setzen, wenn das Datum wirklich bekannt ist: Es wird als
   * `datePublished` ins Article-JSON-LD geschrieben UND sichtbar im Artikel
   * ausgegeben. Fehlt es, entfällt beides. Vorher wurde `updated` doppelt
   * verwendet — jeder Artikel behauptete also, am Tag der letzten Änderung
   * erschienen zu sein, obwohl sichtbar nur "Aktualisiert am" stand.
   */
  published?: string;
  readingMinutes: number;
  /** Lead-Absatz oben im Artikel. */
  intro: string;
  blocks: RatgeberBlock[];
  faq: RatgeberFaq[];
  /** Interne Verlinkung ans Ende (andere Artikel/Seiten). */
  related: { label: string; href: string }[];
};
