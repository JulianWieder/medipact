"use client";

import { useLocale } from "next-intl";
import { usePathname as useRawPathname } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, isMigratedLocalePath } from "@/i18n/routing";

/**
 * Small de/en toggle for the marketing site. Lives in Header.tsx.
 *
 * Renders null on anything outside the [locale] segment — i.e. anywhere
 * isMigratedLocalePath() is false (currently everything except "/" and
 * "/konflikte/trennung"). This used to be checked with next-intl's own
 * usePathname(), but that hook only correctly strips/recomputes locale
 * prefixes for routes genuinely inside next-intl's routing. On an
 * unmigrated page (e.g. /methode) it can return the raw, unstripped
 * pathname instead — so a previous "/en/methode" got treated as the
 * "internal" path and router.replace(..., {locale:"de"}) just prepended
 * "de" on top, producing "/de/en/methode". Checking the RAW browser
 * pathname (next/navigation's usePathname) against the same allow-list
 * middleware.ts uses avoids that entirely: the switcher simply doesn't
 * render on pages it can't safely operate on.
 */
export function LanguageSwitcher() {
  const locale = useLocale();
  const rawPathname = useRawPathname();
  const pathname = usePathname();
  const router = useRouter();

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
            onClick={() => router.replace(pathname, { locale: nextLocale })}
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
