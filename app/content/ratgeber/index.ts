// ── Ratgeber-Artikel: Index ────────────────────────────────────────────────
//
// Eine Datei pro Artikel in diesem Ordner. NEUEN ARTIKEL ANLEGEN:
//
//   1. Bestehende Artikel-Datei kopieren (z. B. wirtschaftsmediation.ts),
//      umbenennen nach dem gewünschten Slug und Inhalte anpassen.
//      Wichtig: `slug` muss dem Dateinamen entsprechen.
//   2. Unten importieren und in ratgeberArticles eintragen.
//
// Das war's — Übersichtsseite (/ratgeber), Artikelseite, Sitemap und
// Schema.org-Daten entstehen automatisch daraus. Ein neuer `category`-Wert
// erzeugt automatisch einen neuen Abschnitt auf der Übersichtsseite
// (Reihenfolge = erste Nennung in ratgeberArticles).
//
// Original verfasste Artikel (SEO-Content). NICHTS aus fremden Quellen
// kopieren — jeder Text ist eigenständig formuliert und auf medipact
// zugeschnitten. Keine erfundenen Statistiken; rechtliche Angaben vor
// Veröffentlichung gegenlesen.

import type { RatgeberArticle } from "./types";
import { article as fuenfPhasenDerMediation } from "./5-phasen-der-mediation";
import { article as wasIstMediation } from "./was-ist-mediation";
import { article as wasIstEinMediator } from "./was-ist-ein-mediator";
import { article as mediationKosten } from "./mediation-kosten";
import { article as gerichtOderMediation } from "./gericht-oder-mediation";
import { article as wirtschaftsmediation } from "./wirtschaftsmediation";
import { article as mediationAmArbeitsplatz } from "./mediation-am-arbeitsplatz";

export type { RatgeberArticle, RatgeberBlock, RatgeberFaq } from "./types";

/** Alle Artikel; Reihenfolge bestimmt die Sortierung innerhalb der Kategorien. */
export const ratgeberArticles: RatgeberArticle[] = [
  fuenfPhasenDerMediation,
  wasIstMediation,
  wasIstEinMediator,
  mediationKosten,
  gerichtOderMediation,
  wirtschaftsmediation,
  mediationAmArbeitsplatz,
];

export const ratgeberBySlug: Record<string, RatgeberArticle> = Object.fromEntries(
  ratgeberArticles.map((a) => [a.slug, a]),
);

/** Artikel nach Kategorie gruppiert (Reihenfolge = erste Nennung im Array). */
export const ratgeberCategories: { category: string; articles: RatgeberArticle[] }[] = (() => {
  const order: string[] = [];
  const byCategory = new Map<string, RatgeberArticle[]>();
  for (const a of ratgeberArticles) {
    if (!byCategory.has(a.category)) {
      order.push(a.category);
      byCategory.set(a.category, []);
    }
    byCategory.get(a.category)!.push(a);
  }
  return order.map((category) => ({ category, articles: byCategory.get(category)! }));
})();
