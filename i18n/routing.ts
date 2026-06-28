import { defineRouting } from "next-intl/routing";

/**
 * Central i18n config. Add new languages here only — nothing else needs to
 * change. `localePrefix: "as-needed"` means the default locale (de) keeps
 * today's unprefixed URLs (e.g. /konflikte/trennung), so no existing link,
 * bookmark, or SEO ranking breaks. Other locales get a prefix (/en/...).
 *
 * Translation status (architecture only, see migration-notes.md):
 * - de: source of truth, fully populated.
 * - en: structurally wired up, mirrors German text 1:1 — not translated yet.
 */
export const routing = defineRouting({
  locales: ["de", "en"],
  defaultLocale: "de",
  localePrefix: "as-needed",
});

export type AppLocale = (typeof routing.locales)[number];

/**
 * Single source of truth for which marketing paths actually live under
 * app/[locale]/ today. Used by middleware.ts (to decide whether to run
 * next-intl's locale-rewriting) AND by any component choosing between the
 * locale-aware Link/router (@/i18n/navigation) and plain next/link.
 *
 * Using the locale-aware Link for a path that ISN'T in this list is exactly
 * the bug that caused "/de/en/methode"-style loops: next-intl's Link/router
 * compute their target assuming the page is inside the locale routing
 * context, but the actual page (e.g. /methode) is the old, unmigrated,
 * unprefixed route — so prefixes get added with nothing to ever strip them
 * back off. Add a path here ONLY the same moment it's moved into
 * app/[locale]/ (see migration-notes.md).
 */
export const MIGRATED_LOCALE_ROUTES = ["/", "/konflikte/trennung"];

export function isMigratedLocalePath(pathname: string): boolean {
  const withoutLocalePrefix = pathname.replace(/^\/en(?=\/|$)/, "") || "/";
  return MIGRATED_LOCALE_ROUTES.includes(withoutLocalePrefix);
}
