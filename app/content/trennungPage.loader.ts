// app/content/trennungPage.loader.ts
//
// Locale-aware content loader — the piece that makes MarketingPageTemplate
// language-agnostic. Add a locale here only by adding a `.ts` file +
// one line in this switch; the template and the page component never
// change. See migration-notes.md for the recipe to apply this to the
// other ~20 marketing pages.

import type { AppLocale } from "@/i18n/routing";
import { trennungPageContent as de } from "./trennungPage.de";
import { trennungPageContent as en } from "./trennungPage.en";

export function getTrennungPageContent(locale: AppLocale) {
  switch (locale) {
    case "en":
      return en;
    case "de":
    default:
      return de;
  }
}
