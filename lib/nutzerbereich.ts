/**
 * Der Nutzerbereich zieht nach kerno (app.medipact.de) - die Website bleibt.
 *
 * Zwei Schalter in der .env der Website, beide erst beim Umschalten setzen
 * (docs/runbook-medipact-cutover.md im mandexis-Repo):
 *
 *   NUTZERBEREICH_URL=https://app.medipact.de
 *       Login, Registrierung, Dashboard, Einladungen ... leiten dorthin um
 *       (proxy.ts), mit Pfad und Query - Links aus alten Mails
 *       (?token=...) funktionieren weiter.
 *
 *   KERNO_API_URL=http://127.0.0.1:8001
 *       Newsletter-Anmeldung, -Bestaetigung und -Abmeldung laufen gegen
 *       kerno. Der Mandant ist der Host aus NUTZERBEREICH_URL: kerno
 *       erkennt Marken am Host (X-Mandant-Host), medipact.de selbst steht
 *       dort nicht.
 *
 * Ohne beide Variablen bleibt alles wie vorher (medipact-api). Damit kann
 * dieser Code vor dem Umschalten live gehen, und der Rueckweg ist: Variablen
 * entfernen, pm2 neu starten.
 */

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

/** Ziel der Umleitung, oder null, solange nicht umgeschaltet ist. */
export function nutzerbereichUrl(): URL | null {
  const roh = process.env.NUTZERBEREICH_URL?.trim();
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
