/**
 * Ortsseiten im Verzeichnis: /mediator-finden/ort/[ort] („Mediator
 * München"). Bewusst ohne Unterseiten je Schwerpunkt – siehe
 * app/mediator-finden/ort/OrtsseiteInhalt.tsx.
 *
 * Die Seiten entstehen aus den Profilen, nicht aus einer Städteliste: Eine
 * Ortsseite gibt es für jeden Ort, den ein Profil mit „vor Ort" angibt. Auf
 * ihr stehen alle, die vor Ort arbeiten und deren Ort höchstens
 * ORT_UMKREIS_KM entfernt ist.
 *
 * In den Index (und die Sitemap) kommt eine Seite erst ab INDEX_AB
 * Profilen. Eine Seite „Mediator Würzburg" mit einem einzigen Eintrag ist
 * dünn und verspricht eine Auswahl, die es nicht gibt – sie bleibt
 * erreichbar (Link aus dem Profil), aber noindex. Nur Video-Profile zählen
 * nicht mit: Wer „Mediator Würzburg" sucht, will jemanden in Würzburg.
 *
 * Serverseitig (lib/geo.ts).
 */

import type { Mediator } from "./mediatoren";
import { findeOrt, hauptort, ortSchluessel, punkteFuer } from "./geo";
import { UMKREIS_STANDARD, naechsteKm, type Punkt, type VerzeichnisMediator } from "./umkreis";

// Derselbe Wert, mit dem das Verzeichnis auf der Ortsseite startet – sonst
// zeigte die Liste andere Profile als die, nach denen die Seite zählt.
export const ORT_UMKREIS_KM = UMKREIS_STANDARD;
export const INDEX_AB = 2;

export type Ortsseite = {
  slug: string;
  ort: Punkt;
  /** Vor-Ort-Profile im Umkreis, nächste zuerst. */
  treffer: { m: VerzeichnisMediator; km: number }[];
  indexiert: boolean;
};

export function mitPunkten(mediatoren: Mediator[]): VerzeichnisMediator[] {
  return mediatoren.map((m) => ({ ...m, punkte: punkteFuer(m.orte) }));
}

function seiteFuer(ms: VerzeichnisMediator[], ort: Punkt): Ortsseite {
  const treffer = ms
    .filter((m) => m.vor_ort)
    .map((m) => ({ m, km: naechsteKm(m, ort) }))
    .filter((t): t is { m: VerzeichnisMediator; km: number } => t.km !== null && t.km <= ORT_UMKREIS_KM)
    .sort((a, b) => a.km - b.km);
  return { slug: ortSchluessel(ort.name), ort, treffer, indexiert: treffer.length >= INDEX_AB };
}

/** Alle Ortsseiten, die größten zuerst. */
export function ortsseiten(ms: VerzeichnisMediator[]): Ortsseite[] {
  const orte = new Map<string, Punkt>();
  for (const m of ms) {
    if (!m.vor_ort) continue;
    for (const p of m.punkte.map(hauptort)) orte.set(ortSchluessel(p.name), p);
  }
  return [...orte.values()]
    .map((o) => seiteFuer(ms, o))
    .sort((a, b) => b.treffer.length - a.treffer.length || a.ort.name.localeCompare(b.ort.name, "de"));
}

export function ortsseite(ms: VerzeichnisMediator[], slug: string): Ortsseite | null {
  return ortsseiten(ms).find((s) => s.slug === slug) ?? null;
}

/** Ortsseite zu einer Ortsangabe im Profil, falls es sie gibt. */
export function ortsseiteZu(ms: VerzeichnisMediator[], ortsangabe: string): Ortsseite | null {
  const p = findeOrt(ortsangabe);
  return p ? ortsseite(ms, ortSchluessel(hauptort(p).name)) : null;
}
