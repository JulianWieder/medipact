/**
 * Verzeichnis der Mediator:innen – die Daten kommen aus kerno.
 *
 * Mediator:innen pflegen ihr Profil im Workspace von app.medipact.de
 * (Einstellungen), die Verwaltung prüft die Qualifikation und gibt frei.
 * Hier erscheint nur, was beide freigegeben haben: kerno liefert unter
 * /oeffentlich/verzeichnis ausschließlich diese Einträge, ohne E-Mail und
 * ohne interne IDs. Mandant über X-Mandant-Host wie beim Newsletter.
 *
 * Ohne KERNO_API_URL oder wenn kerno nicht antwortet, ist die Liste leer –
 * die Seiten bleiben erreichbar und zeigen den Weg über die Anfrage.
 */

import { REGISTRIEREN_URL, nutzerbereichUrl } from "@/lib/nutzerbereich";

export interface Mediator {
  slug: string;
  anzeigename: string;
  titel: string | null;
  kurzvita: string | null;
  ausbildung: string | null;
  hat_foto: boolean;
  bereiche: string[];
  orte: string[];
  sprachen: string[];
  vor_ort: boolean;
  online: boolean;
  stundensatz_cent: number | null;
  vorgespraech_kostenlos: boolean;
}

// Schlüssel wortgleich in kerno: app/workspace/verzeichnis.ts (BEREICHE).
// Beide Listen gemeinsam ändern.
export const BEREICHE: { id: string; label: string }[] = [
  { id: "trennung", label: "Trennung & Scheidung" },
  { id: "erbschaft", label: "Erbschaft" },
  { id: "nachbarschaft", label: "Nachbarschaft" },
  { id: "geschaeft", label: "Team & Organisation" },
  { id: "familie", label: "Familie & Generationen" },
  { id: "wirtschaft", label: "Wirtschaft & Verträge" },
  { id: "miete", label: "Miete & Wohnen" },
  { id: "schule", label: "Schule & Ausbildung" },
];

export function bereichLabel(id: string): string {
  return BEREICHE.find((b) => b.id === id)?.label ?? id;
}

export function stundensatzLabel(cent: number | null): string | null {
  if (cent == null) return null;
  return `${(cent / 100).toLocaleString("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })} pro Stunde`;
}

/** Bild über den eigenen Proxy (app/api/mediatoren/foto) – kerno ist von außen nicht erreichbar. */
export function fotoUrl(m: Mediator): string | null {
  return m.hat_foto ? `/api/mediatoren/foto/${encodeURIComponent(m.slug)}` : null;
}

/**
 * Vorgespräch mit genau dieser Person anfragen. Registrierung bzw. Login,
 * dann die Anfrage in kerno – `wunsch` trägt die Wahl dorthin.
 */
export function vorgespraechUrl(slug: string): string {
  const ziel = `/dashboard/anfragen?wunsch=${encodeURIComponent(slug)}`;
  return `${REGISTRIEREN_URL}?callbackUrl=${encodeURIComponent(ziel)}`;
}

export function kernoZugang(): { basis: string; headers: Record<string, string> } | null {
  const basis = process.env.KERNO_API_URL?.trim();
  const mandant = nutzerbereichUrl();
  if (!basis || !mandant) return null;
  return { basis: basis.replace(/\/$/, ""), headers: { "X-Mandant-Host": mandant.host } };
}

// Fünf Minuten: eine Freigabe im Workspace ist nach kurzer Zeit sichtbar,
// ohne dass jeder Seitenaufruf kerno fragt.
const FRISCH = 300;

async function holen<T>(pfad: string): Promise<T | null> {
  const zugang = kernoZugang();
  if (!zugang) return null;
  try {
    const res = await fetch(`${zugang.basis}${pfad}`, {
      headers: zugang.headers,
      next: { revalidate: FRISCH },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function ladeMediatoren(): Promise<Mediator[]> {
  return (await holen<Mediator[]>("/oeffentlich/verzeichnis")) ?? [];
}

export async function ladeMediator(slug: string): Promise<Mediator | null> {
  return holen<Mediator>(`/oeffentlich/verzeichnis/${encodeURIComponent(slug)}`);
}
