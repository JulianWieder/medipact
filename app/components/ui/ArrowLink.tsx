import UnlocalizedLink from "next/link";
import { Link as LocalizedLink } from "@/i18n/navigation";
import { isMigratedLocalePath } from "@/i18n/routing";
import clsx from "clsx";
import { ReactNode } from "react";

type ArrowLinkProps = {
  href: string;
  children: ReactNode;
  /** "accent" (default) für Links auf hellem Grund, "light" für dunkle
   * Sektionen (section-strong), "muted" für sekundäre Links. */
  tone?: "accent" | "light" | "muted";
  className?: string;
};

const tones = {
  accent: "text-accent-700 hover:text-accent-800",
  light: "text-accent-300 hover:text-accent-200",
  muted: "text-neutral-500 hover:text-neutral-800",
};

/**
 * Standardisierter Text-Link mit animiertem Pfeil (→ schiebt sich beim Hover
 * nach rechts). Ersetzt die bisher an mehreren Stellen (EmpfehlungenGrid,
 * Homepage-Sektionen, Templates) einzeln nachgebauten "Label →"-Links, damit
 * Typo, Farbe und Hover-Verhalten überall identisch sind.
 *
 * Locale-aware wie Button.tsx: migrierte Pfade laufen über next-intl's Link,
 * alles andere über next/link (siehe i18n/routing.ts, isMigratedLocalePath).
 */
export function ArrowLink({ href, children, tone = "accent", className }: ArrowLinkProps) {
  const classes = clsx(
    "group/arrow inline-flex items-center gap-1.5 font-semibold transition",
    tones[tone],
    className,
  );
  const inner = (
    <>
      {children}
      <span
        aria-hidden="true"
        className="inline-block transition-transform duration-300 group-hover/arrow:translate-x-1"
      >
        →
      </span>
    </>
  );
  return isMigratedLocalePath(href) ? (
    <LocalizedLink href={href} className={classes}>
      {inner}
    </LocalizedLink>
  ) : (
    <UnlocalizedLink href={href} className={classes}>
      {inner}
    </UnlocalizedLink>
  );
}
