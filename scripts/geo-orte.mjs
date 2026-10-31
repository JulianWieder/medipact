// Erzeugt lib/geo/orte-de.json aus dem GeoNames-Postleitzahlen-Export.
//
//   curl -LO https://download.geonames.org/export/zip/DE.zip && unzip DE.zip
//   node scripts/geo-orte.mjs pfad/zu/DE.txt
//
// Daten: GeoNames (https://www.geonames.org), Lizenz CC BY 4.0. Der Hinweis
// darauf steht im Verzeichnis (MediatorenVerzeichnis.tsx) – beim Austausch
// der Quelle dort mitziehen.
//
// Ergebnis:
//   plz:  { "80331": [lat, lon, "München"] }  – Mittelpunkt aller Orte der PLZ
//   orte: { "muenchen": ["München", lat, lon, anzahlPlz] }
// Gleichnamige Orte (es gibt viele „Neustadt") werden nach Gemeinde getrennt;
// unter dem Namen bleibt der mit den meisten Postleitzahlen, also der größte.
// Den Schlüssel bildet ortSchluessel() – wortgleich in lib/geo.ts.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const quelle = process.argv[2];
if (!quelle) {
  console.error("Aufruf: node scripts/geo-orte.mjs pfad/zu/DE.txt");
  process.exit(1);
}

function ortSchluessel(s) {
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

const runden = (x) => Math.round(x * 100) / 100;

const plzSammel = new Map(); // plz -> { lat, lon, n, name }
const gemeinden = new Map(); // schluessel|gemeinde -> { name, lat, lon, plz:Set }

for (const zeile of readFileSync(quelle, "utf8").split("\n")) {
  const f = zeile.split("\t");
  if (f.length < 11) continue;
  const [, plz, name, , , , kreis, , gemeinde, latS, lonS] = f;
  // Großkunden-PLZ (Firmen, Behörden: „Hapag-Lloyd AG", „Amtsgericht")
  // haben keinen Kreis – sie sind kein Ort, nach dem jemand sucht.
  if (!kreis) continue;
  const lat = Number(latS);
  const lon = Number(lonS);
  if (!/^\d{5}$/.test(plz) || !Number.isFinite(lat) || !Number.isFinite(lon)) continue;

  const p = plzSammel.get(plz) ?? { lat: 0, lon: 0, n: 0, name };
  p.lat += lat;
  p.lon += lon;
  p.n += 1;
  plzSammel.set(plz, p);

  const key = `${ortSchluessel(name)}|${gemeinde}`;
  const g = gemeinden.get(key) ?? { name, lat: 0, lon: 0, n: 0, plz: new Set() };
  g.lat += lat;
  g.lon += lon;
  g.n += 1;
  g.plz.add(plz);
  gemeinden.set(key, g);
}

const plz = {};
for (const [k, p] of [...plzSammel].sort(([a], [b]) => a.localeCompare(b))) {
  plz[k] = [runden(p.lat / p.n), runden(p.lon / p.n), p.name];
}

const orte = {};
for (const [key, g] of gemeinden) {
  const schluessel = key.split("|")[0];
  const bisher = orte[schluessel];
  if (bisher && bisher[3] >= g.plz.size) continue;
  orte[schluessel] = [g.name, runden(g.lat / g.n), runden(g.lon / g.n), g.plz.size];
}

mkdirSync(new URL("../lib/geo/", import.meta.url), { recursive: true });
writeFileSync(new URL("../lib/geo/orte-de.json", import.meta.url), JSON.stringify({ plz, orte }));
console.log(`${Object.keys(plz).length} Postleitzahlen, ${Object.keys(orte).length} Orte`);
