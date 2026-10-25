import { defineRouting } from "next-intl/routing";

/**
 * Central i18n config. Add new languages here only — nothing else needs to
 * change. `localePrefix: "as-needed"` means the default locale (de) keeps
 * today's unprefixed URLs (e.g. /impressum), so no existing link,
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
export const MIGRATED_LOCALE_ROUTES = ["/", "/scheidungsmediation"];

export function isMigratedLocalePath(pathname: string): boolean {
  const withoutLocalePrefix = pathname.replace(/^\/en(?=\/|$)/, "") || "/";
  return MIGRATED_LOCALE_ROUTES.includes(withoutLocalePrefix);
}

/**
 * Welche der MIGRATED_LOCALE_ROUTES in ALLEN Sprachen fuer Google
 * freigegeben sind. Fuer diese Pfade liefert lib/seo.ts jede Sprachfassung
 * mit Self-Canonical, `index` und hreflang-Alternates (de, en, x-default) aus,
 * und app/sitemap.ts listet die /en-URL mit.
 *
 * Bewusst getrennt von MIGRATED_LOCALE_ROUTES: "liegt unter app/[locale]/"
 * heisst noch nicht "ist uebersetzt". /scheidungsmediation ist migriert,
 * aber trennungPage.en.ts ist noch der deutsche Platzhaltertext — eine
 * indexierte /en-Fassung davon waere deutsches Duplicate Content mit
 * hreflang="en". Einen Pfad hier erst eintragen, wenn Inhalt UND Metadaten
 * (Title/Description in generateMetadata) wirklich uebersetzt sind.
 *
 * 25.10.2026: Startseite freigegeben (messages/en.json "home" uebersetzt).
 */
export const INDEXED_LOCALE_ROUTES = ["/"];

export function isIndexedLocalePath(path: string): boolean {
  return INDEXED_LOCALE_ROUTES.includes(path || "/");
}
