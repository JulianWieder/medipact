/**
 * Umkreis-Rechnung fürs Verzeichnis – ohne Geodaten, also auch im Browser
 * nutzbar. Das Auflösen von PLZ/Ort zu Koordinaten macht lib/geo.ts auf dem
 * Server.
 */

import type { Mediator } from "./mediatoren";

export type Punkt = { name: string; lat: number; lon: number };

/** Profil mit aufgelösten Ortsangaben (lib/ortsseiten.ts: mitPunkten). */
export type VerzeichnisMediator = Mediator & { punkte: Punkt[] };

/** Auswahl in der Umkreissuche, in km. */
export const UMKREISE = [10, 25, 50, 100] as const;
export const UMKREIS_STANDARD = 25;

/** Luftlinie in km (Haversine). */
export function entfernungKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLon = (b.lon - a.lon) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

/** Kürzeste Entfernung von einem Ort zu einem der Orte des Profils; null ohne Ortsangabe. */
export function naechsteKm(m: VerzeichnisMediator, punkt: Punkt): number | null {
  if (m.punkte.length === 0) return null;
  return Math.min(...m.punkte.map((p) => entfernungKm(p, punkt)));
}

export function kmLabel(km: number): string {
  return km < 2 ? "unter 2 km" : `ca. ${Math.round(km)} km`;
}
