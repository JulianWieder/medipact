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
