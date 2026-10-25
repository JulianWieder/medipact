"use client";

import { useLocale } from "next-intl";
import { usePathname as useRawPathname } from "next/navigation";
import { getPathname, usePathname } from "@/i18n/navigation";
import { routing, isMigratedLocalePath } from "@/i18n/routing";

/**
 * Small de/en toggle for the marketing site. Lives in Header.tsx.
 *
 * Renders null on anything outside the [locale] segment — i.e. anywhere
 * isMigratedLocalePath() is false (currently everything except "/" and
 * "/scheidungsmediation"). This used to be checked with next-intl's own
 * usePathname(), but that hook only correctly strips/recomputes locale
 * prefixes for routes genuinely inside next-intl's routing. On an
 * unmigrated page (e.g. /methode) it can return the raw, unstripped
 * pathname instead — so a previous "/en/methode" got treated as the
 * "internal" path and router.replace(..., {locale:"de"}) just prepended
 * "de" on top, producing "/de/en/methode". Checking the RAW browser
 * pathname (next/navigation's usePathname) against the same allow-list
 * proxy.ts uses avoids that entirely: the switcher simply doesn't
 * render on pages it can't safely operate on.
 *
 * Switching does a full page load on purpose, not router.replace():
 * NextIntlClientProvider lives in the ROOT layout (app/layout.tsx, above
 * the [locale] segment), and Next.js keeps shared layouts mounted on
 * client-side navigation. A soft navigation therefore only swapped the page
 * body — Header, Footer and every client component kept the old locale and
 * messages until a manual reload. Locale changes are rare; a hard load is
 * the cheap, reliable fix. The cookie is written first so next-intl's
 * middleware doesn't redirect "/" straight back to "/en" from a stale
 * NEXT_LOCALE.
 */
function setLocaleCookie(locale: string) {
  document.cookie = `NEXT_LOCALE=${locale}; path=/; SameSite=Lax`;
}

export function LanguageSwitcher() {
  const locale = useLocale();
  const rawPathname = useRawPathname();
  const pathname = usePathname();

  function switchTo(nextLocale: string) {
    if (nextLocale === locale) return;
    setLocaleCookie(nextLocale);
    window.location.assign(
      getPathname({ href: pathname, locale: nextLocale }) +
        window.location.search +
        window.location.hash,
    );
  }

  if (!isMigratedLocalePath(rawPathname)) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 text-sm font-medium">
      {routing.locales.map((nextLocale, index) => (
        <span key={nextLocale} className="flex items-center">
          {index > 0 && <span className="mx-1 text-neutral-300">/</span>}
          <button
            type="button"
            onClick={() => switchTo(nextLocale)}
            aria-current={nextLocale === locale ? "true" : undefined}
            className={
              nextLocale === locale
                ? "text-neutral-900"
                : "text-neutral-400 hover:text-neutral-700"
            }
          >
            {nextLocale.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
