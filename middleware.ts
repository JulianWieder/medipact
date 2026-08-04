import { auth } from "@/auth";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing, isMigratedLocalePath } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

/**
 * Two concerns live in this one middleware because Next.js only allows a
 * single middleware file:
 *
 * 1. Auth guarding for /dashboard, /workspace, /auth/* — unchanged from
 *    before, and deliberately untouched by i18n. These routes stay
 *    German-only (see migration-notes.md), so locale negotiation never
 *    runs for them.
 * 2. Locale negotiation/rewriting (next-intl) for the marketing routes
 *    that have actually been migrated into app/[locale]/. Everything else
 *    passes straight through, unaffected.
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

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;
  const isAppRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/workspace") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/auth");

  if (isAppRoute) {
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
    // anspricht, kommt an dieser Middleware vorbei.
    if (isAuthenticated && onboardingRequired(pathname, req.auth)) {
      const url = new URL("/onboarding", req.url);
      // Ziel mitnehmen — inklusive Query. Einladungslinks tragen ihren ?token=
      // hier durch; ohne das landen Eingeladene nach dem Onboarding im leeren
      // Dashboard statt beim Fall, zu dem sie eingeladen wurden.
      url.searchParams.set("callbackUrl", pathname + req.nextUrl.search);
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  if (isMigratedLocalePath(pathname)) {
    return intlMiddleware(req);
  }

  return NextResponse.next();
});

export const config = {
  // Run on every page request except API routes, Next internals, and
  // static files (anything with a file extension). This single matcher
  // covers both branches above; which branch runs is decided inside.
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
