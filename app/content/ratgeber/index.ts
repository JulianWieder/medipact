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
import { article as mediationAlsKonfliktloesung } from "./mediation-als-konfliktloesung";
import { article as konfliktDokumentieren } from "./konflikt-dokumentieren";
import { article as konfliktJournal } from "./konflikt-journal";
import { article as akuterKonfliktWasTun } from "./akuter-konflikt-was-tun";
import { article as schwelenderKonflikt } from "./schwelender-konflikt";
import { article as fuenfPhasenDerMediation } from "./5-phasen-der-mediation";
import { article as wasIstMediation } from "./was-ist-mediation";
import { article as wasIstEinMediator } from "./was-ist-ein-mediator";
import { article as mediationKosten } from "./mediation-kosten";
import { article as gerichtOderMediation } from "./gericht-oder-mediation";
import { article as scheidungOhneRosenkrieg } from "./scheidung-ohne-rosenkrieg";
import { article as scheidungMediatorKosten } from "./scheidung-mediator-kosten";
import { article as sorgerechtUmgangMediation } from "./sorgerecht-umgang-mediation";
import { article as ichWillMichTrennen } from "./ich-will-mich-trennen";
import { article as trennungVonEinemNarzissten } from "./trennung-von-einem-narzissten";
import { article as onlineDisputeResolution } from "./online-dispute-resolution";
import { article as wirtschaftsmediation } from "./wirtschaftsmediation";
import { article as mediationImUnternehmen } from "./mediation-im-unternehmen";
import { article as mediationAmArbeitsplatz } from "./mediation-am-arbeitsplatz";
import { article as kuendigungOhneGericht } from "./kuendigung-ohne-gericht";
import { article as vermoegensauseinandersetzung } from "./vermoegensauseinandersetzung";
import { article as familienUndErbmediation } from "./familien-und-erbmediation";
import { article as erbstreitLoesenOhneGericht } from "./erbstreit-loesen-ohne-gericht";
import { article as pflichtteilMediation } from "./pflichtteil-mediation";
import { article as nachbarschaftsstreitMediation } from "./nachbarschaftsstreit-mediation";
import { article as wegStreitMediation } from "./weg-streit-mediation";

export type { RatgeberArticle, RatgeberBlock, RatgeberFaq } from "./types";

/** Alle Artikel; Reihenfolge bestimmt die Sortierung innerhalb der Kategorien. */
export const ratgeberArticles: RatgeberArticle[] = [
  mediationAlsKonfliktloesung,
  konfliktDokumentieren,
  konfliktJournal,
  akuterKonfliktWasTun,
  schwelenderKonflikt,
  fuenfPhasenDerMediation,
  wasIstMediation,
  wasIstEinMediator,
  mediationKosten,
  gerichtOderMediation,
  scheidungOhneRosenkrieg,
  scheidungMediatorKosten,
  sorgerechtUmgangMediation,
  ichWillMichTrennen,
  trennungVonEinemNarzissten,
  vermoegensauseinandersetzung,
  familienUndErbmediation,
  erbstreitLoesenOhneGericht,
  pflichtteilMediation,
  nachbarschaftsstreitMediation,
  wegStreitMediation,
  onlineDisputeResolution,
  wirtschaftsmediation,
  mediationImUnternehmen,
  mediationAmArbeitsplatz,
  kuendigungOhneGericht,
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
