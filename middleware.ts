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
export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;
  const isAppRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/workspace") ||
    pathname.startsWith("/auth");

  if (isAppRoute) {
    if (pathname.startsWith("/dashboard") && !isAuthenticated) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (pathname.startsWith("/workspace") && !isAuthenticated) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isAuthenticated && (pathname === "/auth/login" || pathname === "/auth/register")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
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
