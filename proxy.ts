import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing, isMigratedLocalePath } from "@/i18n/routing";
import { istNutzerbereich, nutzerbereichUrl } from "@/lib/nutzerbereich";

const intlMiddleware = createMiddleware(routing);

/**
 * Proxy (bis Next 15 "middleware.ts"; seit Next 16 umbenannt, laeuft jetzt
 * in der Node-Laufzeit - deshalb wird NUTZERBEREICH_URL zur Laufzeit gelesen
 * und nicht beim Build eingebacken).
 *
 * 0. Der Nutzerbereich gehoert kerno (app.medipact.de) und wird dorthin
 *    umgeleitet - vor allem anderen. Nur mit NUTZERBEREICH_URL= (leer)
 *    antworten die alten Routen wieder selbst. Siehe lib/nutzerbereich.ts.
 *
 * Danach zwei Aufgaben in dieser einen Datei, weil Next.js nur einen Proxy
 * erlaubt:
 *
 * 1. Auth guarding for /dashboard, /workspace, /onboarding, /auth/* —
 *    deliberately untouched by i18n. These routes stay German-only (see
 *    migration-notes.md), so locale negotiation never runs for them.
 *    NUR diese Pfade laufen durch auth() (authProxy unten).
 * 2. Locale negotiation/rewriting (next-intl) for the marketing routes
 *    that have actually been migrated into app/[locale]/. Everything else
 *    passes straight through, unaffected.
 *
 * WICHTIG (09.11.2026): Marketing-Pfade duerfen NICHT durch auth() laufen.
 * next-auth ersetzt den Host der Anfrage durch AUTH_URL. next-intl baut
 * sein Rewrite-Ziel aus dieser Anfrage, heraus kam eine absolute URL
 * (x-middleware-rewrite: https://medipact.de/de). Next vergleicht sie mit
 * der eigenen Adresse (http://localhost:PORT), haelt sie fuer ein fremdes
 * Ziel und holt die Seite ueber das Internet noch einmal vom eigenen
 * Server: jede Anfrage doppelt, und /en/divorce-mediation lief dabei in
 * die 308-Regel unten und leitete auf sich selbst um. Mit der
 * Original-Anfrage bleibt das Rewrite relativ.
 */
/**
 * Muss dieser Aufruf erst durchs Onboarding?
 *
 * Ausgenommen sind bewusst:
 *   /onboarding  – die Seite selbst; sonst leitet sie sich im Kreis um.
 *   /auth/*      – Login, Registrierung, Logout, Passwort-Reset. Wer sich
 *                  gerade ausloggen will, darf nicht ins Onboarding gezwungen
 *                  werden.
 * Alles unter /dashboard und /workspace ist gesperrt — auch für Mediatoren und
 * Admins. Ein Onboarding, das man per Rolle überspringen kann, ist im Zweifel
 * gar keins; wer das lockern will, tut es hier UND in
 * services/onboarding.ensure_onboarded.
 */
function onboardingRequired(
  pathname: string,
  session: { user?: { onboardingCompleted?: boolean } } | null,
): boolean {
  if (pathname.startsWith("/onboarding") || pathname.startsWith("/auth")) return false;
  if (!pathname.startsWith("/dashboard") && !pathname.startsWith("/workspace")) return false;
  // Fehlt das Flag (alte Session-Cookies vor diesem Umbau), wird NICHT gesperrt:
  // sonst sperrt ein Deploy schlagartig alle laufenden Sessions aus. Das
  // Backend fängt diese Fälle beim ersten Fall-Request ab (428).
  return session?.user?.onboardingCompleted === false;
}

const APP_ROUTEN = ["/dashboard", "/workspace", "/onboarding", "/auth"];

function istAppRoute(pathname: string): boolean {
  return APP_ROUTEN.some((pfad) => pathname.startsWith(pfad));
}

/** Auth-Schutz. Wird nur fuer APP_ROUTEN aufgerufen (siehe proxy unten). */
const authProxy = auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;

  if (pathname.startsWith("/dashboard") && !isAuthenticated) {
    const loginUrl = new URL("/auth/login", req.url);
    // Query-String mitnehmen: Einladungslinks (?token=...) dürfen beim
    // Login-Redirect nicht verloren gehen.
    loginUrl.searchParams.set("callbackUrl", pathname + req.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/workspace") && !isAuthenticated) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname + req.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/onboarding") && !isAuthenticated) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname + req.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && (pathname === "/auth/login" || pathname === "/auth/register")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // ── Harte Onboarding-Sperre ────────────────────────────────────────────
  // Das einmalige Nutzer-Onboarding muss durchlaufen sein, bevor jemand
  // Fälle bearbeitet. Das Flag liegt im JWT (auth.ts), damit hier kein
  // Backend-Call pro Seitenaufruf nötig ist.
  //
  // Das ist nur die BEQUEME Hälfte der Sperre: die verbindliche sitzt im
  // Backend (services/onboarding.ensure_onboarded), denn wer die API direkt
  // anspricht, kommt an diesem Proxy vorbei.
  if (isAuthenticated && onboardingRequired(pathname, req.auth)) {
    const url = new URL("/onboarding", req.url);
    // Ziel mitnehmen — inklusive Query. Einladungslinks tragen ihren ?token=
    // hier durch; ohne das landen Eingeladene nach dem Onboarding im leeren
    // Dashboard statt beim Fall, zu dem sie eingeladen wurden.
    url.searchParams.set("callbackUrl", pathname + req.nextUrl.search);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export default function proxy(req: NextRequest, event: NextFetchEvent) {
  const { pathname } = req.nextUrl;

  // ── Umzug des Nutzerbereichs ────────────────────────────────────────────
  // 302 statt 301, solange die Beobachtungsphase laeuft: ein 301 cachen
  // Browser dauerhaft, und der Rueckweg (Variable entfernen) kaeme bei
  // Besuchern nicht mehr an. Pfad UND Query wandern mit - Einladungs-,
  // Bestaetigungs- und Reset-Links aus alten Mails tragen ihr ?token= darin.
  const nutzerbereich = nutzerbereichUrl();
  if (nutzerbereich && istNutzerbereich(pathname)) {
    const ziel = new URL(pathname + req.nextUrl.search, nutzerbereich);
    return NextResponse.redirect(ziel, 302);
  }

  if (istAppRoute(pathname)) {
    return (authProxy as unknown as (
      req: NextRequest,
      event: NextFetchEvent,
    ) => Response | Promise<Response>)(req, event);
  }

  // /de und /de/... sind Duplikate der Fassung ohne Praefix (localePrefix
  // "as-needed": Deutsch hat keinen Praefix). Bisher antworteten sie mit 200
  // und Canonical auf die Fassung ohne Praefix ("Alternative Seite mit
  // richtigem Canonical" in der Search Console). Dauerhaft umleiten.
  // Keine Schleife: das interne Rewrite von next-intl (/ -> /de) laeuft
  // nicht noch einmal durch den Proxy - solange es relativ bleibt (s. o.).
  if (/^\/de(?=\/|$)/.test(pathname)) {
    const ohnePraefix = pathname.replace(/^\/de(?=\/|$)/, "") || "/";
    return NextResponse.redirect(
      new URL(ohnePraefix + req.nextUrl.search, req.url),
      308,
    );
  }

  // Alte /en-URL der Scheidungsseite, dauerhaft umgezogen (31.10.2026).
  // Bewusst HIER und nicht in next.config.ts redirects() (Kommentar dort).
  if (pathname === "/en/scheidungsmediation") {
    return NextResponse.redirect(
      new URL("/en/divorce-mediation" + req.nextUrl.search, req.url),
      308,
    );
  }

  if (isMigratedLocalePath(pathname)) {
    return intlMiddleware(req);
  }

  return NextResponse.next();
}

export const config = {
  // Run on every page request except API routes, Next internals, and
  // static files (anything with a file extension). This single matcher
  // covers both branches above; which branch runs is decided inside.
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
