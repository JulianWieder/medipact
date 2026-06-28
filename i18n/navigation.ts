import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware drop-in replacements for next/link and next/navigation.
 * Use these ONLY for routes that live inside the [locale] segment
 * (marketing pages: /, /about, /konflikte/*, /cases, /preise, /kontakt,
 * /karriere, /methode, legal pages, ...).
 *
 * Do NOT use these for /dashboard, /workspace, or /auth/* — those routes
 * are intentionally outside the locale routing (German-only app, see
 * migration-notes.md) and must keep using plain next/link / next/navigation,
 * otherwise an English visitor would get a wrongly-prefixed, broken link.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
