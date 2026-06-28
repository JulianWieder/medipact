// app/content/trennungPage.ts
//
// Kept for backward compatibility: components that aren't migrated to the
// locale-aware loader yet (currently ThemenTabs.tsx, used on the homepage
// outside the /konflikte/trennung route) still import the German content
// directly from here. New marketing pages should use
// trennungPage.loader.ts (getTrennungPageContent) instead — see
// migration-notes.md.

export { trennungPageContent } from "./trennungPage.de";
