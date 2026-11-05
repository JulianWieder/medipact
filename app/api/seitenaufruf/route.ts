import { NextRequest, NextResponse } from "next/server";
import { seitenaufrufSpeichern } from "@/lib/seitenaufrufe";
import { istNutzerbereich } from "@/lib/nutzerbereich";

// Crawler und Vorschau-Bots fuehren zwar selten JS aus, die, die es tun,
// sollen die Zahlen aber nicht aufblaehen.
const BOT = /bot|crawl|spider|slurp|headless|lighthouse|preview|facebookexternalhit/i;

// Ein harmloser Deckel gegen Log-Spam: 60 Aufrufe pro Minute und IP. Die IP
// lebt nur in diesem Speicher, ins Log kommt sie nie.
const FENSTER_MS = 60_000;
const MAX_PRO_FENSTER = 60;
const zaehler = new Map<string, { start: number; anzahl: number }>();

function zuViele(ip: string): boolean {
  const jetzt = Date.now();
  if (zaehler.size > 5_000) {
    for (const [schluessel, eintrag] of zaehler) {
      if (jetzt - eintrag.start > FENSTER_MS) zaehler.delete(schluessel);
    }
  }
  const eintrag = zaehler.get(ip);
  if (!eintrag || jetzt - eintrag.start > FENSTER_MS) {
    zaehler.set(ip, { start: jetzt, anzahl: 1 });
    return false;
  }
  eintrag.anzahl += 1;
  return eintrag.anzahl > MAX_PRO_FENSTER;
}

/** Nur der Pfad, ohne Query/Fragment, in vernuenftiger Laenge - sonst null. */
function sauberesPfad(wert: unknown): string | null {
  if (typeof wert !== "string" || !wert.startsWith("/")) return null;
  const pfad = wert.split(/[?#]/)[0].slice(0, 200);
  return /^\/[\w\-./%~]*$/.test(pfad) ? pfad : null;
}

/** Interner Pfad oder Host der verweisenden Seite; alles andere wird null. */
function sauberesVon(wert: unknown): string | null {
  if (typeof wert !== "string" || !wert) return null;
  if (wert.startsWith("/")) return sauberesPfad(wert);
  return /^[a-z0-9.-]{1,100}$/i.test(wert) ? wert.toLowerCase() : null;
}

// POST /api/seitenaufruf - kommt per navigator.sendBeacon aus
// app/components/Seitenaufrufe.tsx. Antwortet immer 204: der Browser
// wertet die Antwort ohnehin nicht aus.
export async function POST(request: NextRequest) {
  const leer = new NextResponse(null, { status: 204 });

  const ua = request.headers.get("user-agent") ?? "";
  if (!ua || BOT.test(ua)) return leer;

  const ip =
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    "unbekannt";
  if (zuViele(ip)) return leer;

  let daten: { pfad?: unknown; von?: unknown };
  try {
    daten = JSON.parse(await request.text());
  } catch {
    return leer;
  }

  const pfad = sauberesPfad(daten.pfad);
  if (!pfad || istNutzerbereich(pfad) || pfad.startsWith("/intern")) return leer;

  try {
    await seitenaufrufSpeichern({
      t: new Date().toISOString(),
      pfad,
      von: sauberesVon(daten.von),
      mobil: /Mobi|Android|iPhone|iPad/i.test(ua),
    });
  } catch (fehler) {
    // Ein volles oder schreibgeschuetztes Verzeichnis darf die Seite nicht
    // stoeren - aber im pm2-Log sichtbar sein.
    console.error("Seitenaufruf nicht gespeichert:", fehler);
  }
  return leer;
}
