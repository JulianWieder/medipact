/**
 * Orte und Postleitzahlen → Koordinaten, für Umkreissuche und Ortsseiten
 * im Verzeichnis (/mediator-finden).
 *
 * NUR SERVERSEITIG importieren: orte-de.json ist gut 1 MB. Der Browser
 * fragt über /api/orte (eine Zeile pro Anfrage) und bekommt die Punkte der
 * Mediator:innen fertig mitgeliefert (punkteFuer).
 *
 * Daten: GeoNames, CC BY 4.0 – erzeugt mit scripts/geo-orte.mjs.
 */

import daten from "./geo/orte-de.json";
import { entfernungKm, type Punkt } from "./umkreis";

export type { Punkt };

const PLZ = daten.plz as unknown as Record<string, [number, number, string]>;
const ORTE = daten.orte as unknown as Record<string, [string, number, number, number]>;

/** Wortgleich in scripts/geo-orte.mjs – dient auch als URL-Slug der Ortsseiten. */
export function ortSchluessel(s: string): string {
  return s
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function ausOrt(schluessel: string): Punkt | null {
  const o = ORTE[schluessel];
  return o ? { name: o[0], lat: o[1], lon: o[2] } : null;
}

// „Frankfurt" → der größte Ort, dessen Name so beginnt (Frankfurt am Main,
// nicht Frankfurt (Oder)). Erst ab drei Zeichen, sonst trifft „ba" Bayreuth.
function ausPraefix(schluessel: string): Punkt | null {
  if (schluessel.length < 3) return null;
  let best: [string, number, number, number] | null = null;
  for (const [k, o] of Object.entries(ORTE)) {
    if ((k === schluessel || k.startsWith(`${schluessel}-`)) && (!best || o[3] > best[3])) best = o;
  }
  return best ? { name: best[0], lat: best[1], lon: best[2] } : null;
}

/**
 * Eingabe aus der Suche oder Ortsangabe aus einem Profil auflösen:
 * „80331", „80331 München", „München", „Frankfurt", „Berlin-Kreuzberg",
 * „Köln / Bonn". Null, wenn nichts passt – dann sucht das Verzeichnis
 * wie bisher nach Text.
 */
export function findeOrt(eingabe: string): Punkt | null {
  const text = eingabe.trim();
  const plz = text.match(/\b(\d{5})\b/);
  if (plz && PLZ[plz[1]]) {
    const [lat, lon, name] = PLZ[plz[1]];
    // Ortsname ohne PLZ: er wird auch zum Slug der Ortsseite (lib/ortsseiten.ts).
    return { name, lat, lon };
  }
  const ohneZiffern = text.replace(/\d+/g, " ");
  const k = ortSchluessel(ohneZiffern);
  if (!k) return null;
  const direkt = ausOrt(k);
  if (direkt) return direkt;
  // Mehrere Angaben in einem Feld: die erste zählt.
  const erste = ortSchluessel(ohneZiffern.split(/[/,;(]|\s+(?:und|u\.)\s+|\s+-\s+/)[0] ?? "");
  if (erste && erste !== k) {
    const t = ausOrt(erste);
    if (t) return t;
  }
  // Stadtteil-Schreibweise „Berlin-Kreuzberg": von hinten kürzen.
  const teile = (erste || k).split("-");
  for (let i = teile.length - 1; i > 0; i--) {
    const t = ausOrt(teile.slice(0, i).join("-"));
    if (t) return t;
  }
  return ausPraefix(erste || k);
}

/**
 * Stadtteil → Stadt, für die Ortsseiten: GeoNames führt etwa „Berlin
 * Kreuzberg" oder „Hamburg Altona" als eigene Orte. Eine Seite „Mediation
 * in Berlin Kreuzberg" neben „Mediation in Berlin" zersplittert nur. Der
 * Stadtname muss ein größerer Ort in der Nähe sein – so bleibt „Neustadt
 * an der Weinstraße" eigenständig.
 */
export function hauptort(p: Punkt): Punkt {
  const erster = ortSchluessel(p.name).split("-")[0];
  const eigen = ORTE[ortSchluessel(p.name)];
  const stadt = ORTE[erster];
  if (!stadt || !eigen || stadt === eigen || stadt[3] <= eigen[3]) return p;
  const kandidat = { name: stadt[0], lat: stadt[1], lon: stadt[2] };
  return entfernungKm(p, kandidat) <= 20 ? kandidat : p;
}

/** Koordinaten zu den Ortsangaben eines Profils; nicht auflösbare fallen weg. */
export function punkteFuer(orte: string[]): Punkt[] {
  return orte.map(findeOrt).filter((p): p is Punkt => p !== null);
}
