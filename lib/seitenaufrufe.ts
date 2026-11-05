/**
 * Eigenes Seitenaufruf-Log, ohne Cookies und ohne personenbezogene Daten.
 *
 * Warum neben GA4: GA laedt nur nach Einwilligung und sieht damit nur einen
 * Teil der Besucher. Dieses Log zaehlt alle - und darf das ohne Banner, weil
 * es nichts auf dem Geraet speichert oder ausliest und nichts speichert, was
 * auf eine Person zurueckfuehrt: keine IP, kein User-Agent, keine Kennung,
 * keine Query-Strings (dort stehen u.a. Einladungs-Tokens).
 *
 * Eine Zeile pro Aufruf, eine Datei pro Tag (JSON Lines):
 *
 *   {"t":"2026-11-04T09:12:03.120Z","pfad":"/preise","von":"/","mobil":true}
 *
 * `von` ist der vorherige Pfad auf der Website ("/..."), beim Einstieg der
 * Host der verweisenden Seite ("www.google.com") oder null fuer "direkt".
 *
 * Ablage ausserhalb des Repos, damit `git pull`/Deploy die Dateien nicht
 * anfasst. Mit SEITENAUFRUFE_DIR ueberschreibbar.
 */
import { promises as fs } from "fs";
import os from "os";
import path from "path";

export type Seitenaufruf = {
  t: string;
  pfad: string;
  von: string | null;
  mobil: boolean;
};

/** Danach wird eine Tagesdatei geloescht - gut ein Jahr reicht fuer Vergleiche. */
const AUFBEWAHRUNG_TAGE = 400;

function verzeichnis(): string {
  return (
    process.env.SEITENAUFRUFE_DIR?.trim() ||
    path.join(os.homedir(), "medipact-daten", "seitenaufrufe")
  );
}

function tagesdatei(tag: string): string {
  return path.join(verzeichnis(), `${tag}.jsonl`);
}

let letzterTag = "";

export async function seitenaufrufSpeichern(aufruf: Seitenaufruf): Promise<void> {
  const tag = aufruf.t.slice(0, 10);
  if (tag !== letzterTag) {
    // Einmal pro Tag (und nach jedem Neustart): Verzeichnis anlegen, Altes weg.
    await fs.mkdir(verzeichnis(), { recursive: true });
    await alteDateienLoeschen();
    letzterTag = tag;
  }
  await fs.appendFile(tagesdatei(tag), JSON.stringify(aufruf) + "\n", "utf8");
}

async function alteDateienLoeschen(): Promise<void> {
  const grenze = new Date(Date.now() - AUFBEWAHRUNG_TAGE * 86_400_000)
    .toISOString()
    .slice(0, 10);
  const dateien = await fs.readdir(verzeichnis()).catch(() => [] as string[]);
  await Promise.all(
    dateien
      .filter((d) => /^\d{4}-\d{2}-\d{2}\.jsonl$/.test(d) && d.slice(0, 10) < grenze)
      .map((d) => fs.rm(path.join(verzeichnis(), d), { force: true })),
  );
}

/** Alle Aufrufe der letzten `tage` Tage (heute eingeschlossen). */
export async function seitenaufrufeLesen(tage: number): Promise<Seitenaufruf[]> {
  const ergebnis: Seitenaufruf[] = [];
  for (let i = tage - 1; i >= 0; i--) {
    const tag = new Date(Date.now() - i * 86_400_000).toISOString().slice(0, 10);
    const inhalt = await fs.readFile(tagesdatei(tag), "utf8").catch(() => "");
    for (const zeile of inhalt.split("\n")) {
      if (!zeile) continue;
      try {
        ergebnis.push(JSON.parse(zeile) as Seitenaufruf);
      } catch {
        // Eine halb geschriebene Zeile (Absturz mitten im append) ueberspringen.
      }
    }
  }
  return ergebnis;
}
