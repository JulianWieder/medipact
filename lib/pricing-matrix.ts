// lib/pricing-matrix.ts
//
// Holt die aktuellen medipact-Preise serverseitig aus dem Backend
// (GET /pricing/matrix, öffentlich und ohne Auth — siehe
// backend/app/routers/pricing.py).
//
// Warum serverseitig und nicht im Client: Der Kostenrechner ist eine
// Marketing-Seite. Ein Client-Fetch würde bedeuten, dass die Preisspalte
// beim ersten Rendern leer ist oder springt. So kommt die Seite fertig aus
// dem Cache und funktioniert auch ohne JavaScript-Fetch.
//
// Warum mit Fallback: Wenn das Backend nicht antwortet, ist ein Rechner mit
// leicht veralteten Preisen immer noch besser als eine kaputte Seite. Der
// Fallback steht in lib/kostenrecht.ts (KONFLIKTARTEN).

import type { Konfliktart, PreisOverlay } from "@/lib/kostenrecht";

const API_BASE_URL = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000";

/**
 * Zuordnung Frontend-Konfliktart -> Konflikttyp in pricing.py.
 *
 * "odr" (Gesellschafter, Nachfolge, Team) und "b2b" (Vertragsstreit) sind
 * seit dem 10.08.2026 getrennte Zeilen, weil sie nicht mehr dasselbe kosten
 * (1.900 € vs. 1.200 €, siehe pricing.py). "schlichtung" und "ecommerce"
 * haben bewusst keinen Eintrag: Das sind Massenverfahren über das Firmen-Abo,
 * für die ein Gerichtsvergleich im Kostenrechner nichts erklärt.
 *
 * "kindschaft" (Sorge- und Umgangsstreit) hat bewusst KEINEN eigenen
 * Konflikttyp im Backend: Fachlich ist das eine Trennungsmediation, und sie
 * wird auch so abgerechnet. Der Rechner trennt die beiden nur, weil sich
 * die Kostenseite grundlegend unterscheidet — Sorge und Umgang lassen sich
 * ohne Gericht regeln, eine Scheidung nicht (§ 114 FamFG).
 */
const TYP_MAPPING: Record<Konfliktart, string> = {
  nachbarschaft: "nachbarschaft",
  verbraucher: "verbraucher",
  erbschaft: "erbschaft",
  odr: "odr",
  b2b: "b2b",
  trennung: "trennung",
  kindschaft: "trennung",
};

type MatrixAntwort = {
  types?: Record<
    string,
    { billing_model?: string; prices?: Record<string, number | null> }
  >;
};

/**
 * Liefert die Live-Preise oder `undefined`, wenn das Backend nicht erreichbar
 * ist bzw. unbrauchbar antwortet. `undefined` heißt für den Aufrufer:
 * statische Werte verwenden.
 */
export async function ladePreisOverlay(): Promise<PreisOverlay | undefined> {
  let json: MatrixAntwort;
  try {
    const res = await fetch(`${API_BASE_URL}/pricing/matrix`, {
      // Preise ändern sich selten; eine Stunde Cache spart Requests, ohne
      // dass eine Preisänderung lange unsichtbar bliebe.
      next: { revalidate: 3600 },
    });
    if (!res.ok) return undefined;
    json = (await res.json()) as MatrixAntwort;
  } catch {
    // Bewusst still: Ein nicht erreichbares Backend darf die Marketing-Seite
    // nicht mitreißen. Der Fallback greift.
    return undefined;
  }

  const typen = json?.types;
  if (!typen) return undefined;

  const overlay: PreisOverlay = {};
  for (const [key, backendTyp] of Object.entries(TYP_MAPPING) as [
    Konfliktart,
    string,
  ][]) {
    const eintrag = typen[backendTyp];
    const preis = eintrag?.prices?.online;
    if (typeof preis !== "number") continue;
    overlay[key] = {
      preis,
      // "once" = nur die Fall-Eigentümer:in zahlt. Alles andere
      // (per_party, split) behandelt der Rechner als "pro Partei".
      proPartei: eintrag?.billing_model !== "once",
    };
  }

  return Object.keys(overlay).length ? overlay : undefined;
}
