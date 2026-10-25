/**
 * Der Nutzerbereich laeuft auf kerno (app.medipact.de) - die Website bleibt.
 *
 * Seit 25.10.2026 fest umgestellt: Die Links der Website zeigen direkt auf
 * NUTZERBEREICH (REGISTRIEREN_URL, ANMELDEN_URL), und proxy.ts leitet alte
 * Adressen (/auth, /dashboard, Einladungen ...) mit Pfad und Query dorthin
 * um - Links aus alten Mails (?token=...) funktionieren weiter.
 *
 * Schalter in der .env der Website:
 *
 *   NUTZERBEREICH_URL=<andere Adresse>   Ziel der Umleitung aendern.
 *   NUTZERBEREICH_URL=                   (leer) Umleitung aus, die alten
 *       Nutzer-Routen der Website antworten wieder selbst. Die Links zeigen
 *       trotzdem auf app.medipact.de.
 *
 *   KERNO_API_URL=http://127.0.0.1:8001
 *       Newsletter-Anmeldung, -Bestaetigung und -Abmeldung laufen gegen
 *       kerno. Der Mandant ist der Host aus NUTZERBEREICH_URL: kerno
 *       erkennt Marken am Host (X-Mandant-Host), medipact.de selbst steht
 *       dort nicht. Ohne die Variable: medipact-api wie bisher.
 */

export const NUTZERBEREICH = "https://app.medipact.de";
export const REGISTRIEREN_URL = `${NUTZERBEREICH}/auth/register`;
export const ANMELDEN_URL = `${NUTZERBEREICH}/auth/login`;

/** Pfade, die zum Nutzerbereich gehoeren. Alles andere ist Website. */
export const NUTZERBEREICH_PFADE = [
  "/auth",
  "/dashboard",
  "/workspace",
  "/onboarding",
  "/invite",
  "/konto-loeschen",
] as const;

export function istNutzerbereich(pathname: string): boolean {
  return NUTZERBEREICH_PFADE.some(
    (pfad) => pathname === pfad || pathname.startsWith(`${pfad}/`),
  );
}

/** Ziel der Umleitung, oder null, wenn sie per leerer Variable aus ist. */
export function nutzerbereichUrl(): URL | null {
  const roh = (process.env.NUTZERBEREICH_URL ?? NUTZERBEREICH).trim();
  if (!roh) return null;
  try {
    return new URL(roh);
  } catch {
    // Ein Tippfehler darf nicht alle Nutzer-Routen in eine Fehlerseite
    // schicken - dann lieber der alte Zustand, und laut im Log.
    console.error(`NUTZERBEREICH_URL ist keine gueltige Adresse: ${roh}`);
    return null;
  }
}

type Anfrage = { headers: { get(name: string): string | null } };

/**
 * Wohin der Newsletter seine Aufrufe schickt, mit den passenden Headern.
 *
 * Mit KERNO_API_URL: kerno, Mandant per X-Mandant-Host, Client-IP als
 * X-Real-IP (kerno haelt sie als Nachweis der Einwilligung fest).
 * Ohne: medipact-api wie bisher.
 */
export function newsletterBackend(request: Anfrage): {
  basis: string;
  headers: Record<string, string>;
} {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "";
  const kerno = process.env.KERNO_API_URL?.trim();
  if (kerno) {
    const mandant = nutzerbereichUrl();
    if (!mandant) {
      // Laut statt still: ohne Mandant landete die Adresse in keinem
      // (oder dem falschen) Verteiler.
      throw new Error("KERNO_API_URL ist gesetzt, NUTZERBEREICH_URL fehlt.");
    }
    return {
      basis: kerno.replace(/\/$/, ""),
      headers: {
        "X-Mandant-Host": mandant.host,
        ...(ip ? { "X-Real-IP": ip, "X-Forwarded-For": ip } : {}),
      },
    };
  }
  return {
    basis: process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000",
    headers: ip ? { "X-Forwarded-For": ip } : {},
  };
}
