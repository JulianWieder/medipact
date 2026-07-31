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
import { article as sorgerechtUndUmgangsrecht } from "./sorgerecht-und-umgangsrecht";
import { article as ichWillMichTrennen } from "./ich-will-mich-trennen";
import { article as trennungVonEinemNarzissten } from "./trennung-von-einem-narzissten";
import { article as onlineDisputeResolution } from "./online-dispute-resolution";
import { article as wirtschaftsmediation } from "./wirtschaftsmediation";
import { article as mediationImUnternehmen } from "./mediation-im-unternehmen";
import { article as mediationAmArbeitsplatz } from "./mediation-am-arbeitsplatz";
import { article as kuendigungOhneGericht } from "./kuendigung-ohne-gericht";
import { article as vermoegensauseinandersetzung } from "./vermoegensauseinandersetzung";
import { article as streitUmsErbeInDerFamilie } from "./streit-ums-erbe-in-der-familie";
import { article as erbstreitLoesenOhneGericht } from "./erbstreit-loesen-ohne-gericht";
import { article as pflichtteilEinfordern } from "./pflichtteil-einfordern";
import { article as nachbarschaftsstreitWasTun } from "./nachbarschaftsstreit-was-tun";
import { article as wegStreitMediation } from "./weg-streit-mediation";
// Suchsprache-Artikel (31.07.2026): Titel = die Frage, die Betroffene
// eingeben. "Mediation" kommt darin bewusst nicht vor – wer so sucht, kennt
// das Wort nicht. Hintergrund in docs/ratgeber-suchsprache.md.
import { article as wasStehtMirBeiDerScheidungZu } from "./was-steht-mir-bei-der-scheidung-zu";
import { article as hausBeiScheidung } from "./haus-bei-scheidung";
import { article as werMussAusDerWohnung } from "./wer-muss-aus-der-wohnung";
import { article as trennungsjahrNachweisen } from "./trennungsjahr-nachweisen";
import { article as geschwisterStreitenUmsErbe } from "./geschwister-streiten-ums-erbe";
import { article as erbengemeinschaftBlockade } from "./erbengemeinschaft-blockade";
import { article as nachbarLaermWasTun } from "./nachbar-laerm-was-tun";
import { article as heckeNachbarHoehe } from "./hecke-nachbar-hoehe";

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
  // Die Suchsprache-Artikel stehen bewusst VORNE in ihrer Kategorie: Sie
  // sind der Einstieg für Betroffene, die den Begriff "Mediation" noch gar
  // nicht kennen. Die Verfahrens-Artikel folgen dahinter.
  wasStehtMirBeiDerScheidungZu,
  hausBeiScheidung,
  werMussAusDerWohnung,
  trennungsjahrNachweisen,
  scheidungOhneRosenkrieg,
  scheidungMediatorKosten,
  sorgerechtUndUmgangsrecht,
  ichWillMichTrennen,
  trennungVonEinemNarzissten,
  vermoegensauseinandersetzung,
  geschwisterStreitenUmsErbe,
  erbengemeinschaftBlockade,
  streitUmsErbeInDerFamilie,
  erbstreitLoesenOhneGericht,
  pflichtteilEinfordern,
  nachbarLaermWasTun,
  heckeNachbarHoehe,
  nachbarschaftsstreitWasTun,
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
