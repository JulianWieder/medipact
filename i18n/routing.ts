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
  // Sprechende URLs je Sprache. Schlüssel = interner Pfad (Ordner unter
  // app/[locale]/), Wert = was im Browser steht. Die Middleware schreibt
  // /en/divorce-mediation intern auf den Ordner um und leitet das alte
  // /en/scheidungsmediation per 301 dorthin; Link, getPathname, Canonical,
  // hreflang und Sitemap (localizedPath unten) ziehen dieselbe Tabelle.
  // Jeder Pfad aus MIGRATED_LOCALE_ROUTES muss hier stehen.
  pathnames: {
    "/": "/",
    "/scheidungsmediation": {
      de: "/scheidungsmediation",
      en: "/divorce-mediation",
    },
  },
});

export type AppLocale = (typeof routing.locales)[number];
export type AppPathname = keyof typeof routing.pathnames;

/** Sichtbarer Pfad (ohne Sprachpräfix) eines internen Pfads in `locale`. */
export function localizedPath(path: string, locale: string): string {
  const config = (routing.pathnames as Record<string, string | Record<string, string>>)[path];
  if (!config) return path;
  return typeof config === "string" ? config : (config[locale] ?? path);
}

/** Umkehrung von localizedPath: sichtbarer Pfad -> interner Pfad. */
function internalPath(path: string, locale: string): string {
  for (const internal of Object.keys(routing.pathnames)) {
    if (localizedPath(internal, locale) === path) return internal;
  }
  return path;
}

/**
 * Single source of truth for which marketing paths actually live under
 * app/[locale]/ today. Used by proxy.ts (to decide whether to run
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
  const istEn = /^\/en(?=\/|$)/.test(pathname);
  const withoutLocalePrefix = pathname.replace(/^\/en(?=\/|$)/, "") || "/";
  // Auf /en zählt auch die übersetzte URL (/en/divorce-mediation).
  const intern = istEn ? internalPath(withoutLocalePrefix, "en") : withoutLocalePrefix;
  return MIGRATED_LOCALE_ROUTES.includes(intern);
}

/**
 * Welche der MIGRATED_LOCALE_ROUTES in ALLEN Sprachen fuer Google
 * freigegeben sind. Fuer diese Pfade liefert lib/seo.ts jede Sprachfassung
 * mit Self-Canonical, `index` und hreflang-Alternates (de, en, x-default) aus,
 * und app/sitemap.ts listet die /en-URL mit.
 *
 * Bewusst getrennt von MIGRATED_LOCALE_ROUTES: "liegt unter app/[locale]/"
 * heisst noch nicht "ist uebersetzt". Eine indexierte /en-Fassung mit
 * deutschem Platzhaltertext waere deutsches Duplicate Content mit
 * hreflang="en". Einen Pfad hier erst eintragen, wenn Inhalt UND Metadaten
 * (Title/Description in generateMetadata) wirklich uebersetzt sind.
 *
 * 25.10.2026: Startseite freigegeben (messages/en.json "home" uebersetzt).
 * 31.10.2026: /scheidungsmediation freigegeben (trennungPage.en.ts und das
 * Template-Chrome in MarketingPageTemplate uebersetzt).
 */
export const INDEXED_LOCALE_ROUTES = ["/", "/scheidungsmediation"];

export function isIndexedLocalePath(path: string): boolean {
  return INDEXED_LOCALE_ROUTES.includes(path || "/");
}
