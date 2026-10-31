import UnlocalizedLink from "next/link";
import type { ReactNode } from "react";
import { Link as LocalizedLink } from "@/i18n/navigation";
import { isMigratedLocalePath, type AppPathname } from "@/i18n/routing";

/**
 * Link ohne eigenes Styling, der selbst wählt: next-intl-Link für Pfade
 * unter app/[locale]/ (dann landet /en auf der übersetzten URL, z. B.
 * /en/divorce-mediation), sonst plain next/link. Dieselbe Weiche wie in
 * Button, ArrowLink, Header und Footer — für Stellen, die keinen dieser
 * Bausteine nutzen.
 */
export function LocaleLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  if (isMigratedLocalePath(href.split("#")[0])) {
    return (
      <LocalizedLink href={href as AppPathname} className={className}>
        {children}
      </LocalizedLink>
    );
  }
  return (
    <UnlocalizedLink href={href} className={className}>
      {children}
    </UnlocalizedLink>
  );
}
