import UnlocalizedLink from "next/link";
import { Link as LocalizedLink } from "@/i18n/navigation";
import { isMigratedLocalePath } from "@/i18n/routing";
import clsx from "clsx";
import { ReactNode, ButtonHTMLAttributes } from "react";

type BaseProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
};

type LinkButtonProps = BaseProps & {
  href: string;
  external?: boolean;
};

type NativeButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonProps = LinkButtonProps | NativeButtonProps;

// active:scale lebt hier zentral (statt pro Variante mit leicht
// unterschiedlichen Werten dupliziert zu werden — vorher 0.96 bei primary,
// 0.98 bei secondary, ohne erkennbaren Grund), damit sich alle
// Button-Varianten beim Klicken gleich anfühlen.
const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/60 focus-visible:ring-offset-2 active:scale-[0.96] disabled:opacity-50 disabled:pointer-events-none";

const variants = {
  primary:
    "bg-accent-500 text-white hover:bg-accent-600 hover:shadow-[0_10px_25px_-5px_rgba(20,184,166,0.4)] active:shadow-inner",
  secondary:
    "border border-neutral-200 bg-white text-neutral-900 hover:border-accent-400 hover:bg-accent-50/50 hover:text-accent-700 shadow-sm",
  ghost: "text-neutral-600 hover:text-accent-600 hover:bg-accent-50/30",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

export function Button(props: ButtonProps) {
  const { children, variant = "primary", size = "md", className } = props;
  const classes = clsx(baseStyles, variants[variant], sizes[size], className);

  if ("href" in props && props.href) {
    const isExternal =
      props.external ||
      props.href.startsWith("mailto:") ||
      props.href.startsWith("tel:") ||
      props.href.startsWith("http");

    if (isExternal) {
      return (
        <a href={props.href} className={classes}>
          {children}
        </a>
      );
    }

    // Only paths actually migrated into app/[locale]/ (see
    // isMigratedLocalePath, i18n/routing.ts) may use the locale-aware Link.
    // Using it for an unmigrated path (most marketing pages right now, plus
    // /auth, /dashboard, /workspace) is what caused the "/de/en/methode"
    // prefix-loop bug — next-intl adds a locale prefix to a page that has
    // nothing in app/[locale]/ to strip it back off again.
    if (isMigratedLocalePath(props.href.split("#")[0])) {
      return (
        <LocalizedLink href={props.href} className={classes}>
          {children}
        </LocalizedLink>
      );
    }

    return (
      <UnlocalizedLink href={props.href} className={classes}>
        {children}
      </UnlocalizedLink>
    );
  }

  return (
    <button {...props} className={classes}>
      {children}
    </button>
  );
}
