import Link from "next/link";
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

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/60 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

const variants = {
  primary:
    "bg-teal-500 text-white hover:bg-teal-600 hover:shadow-[0_10px_25px_-5px_rgba(20,184,166,0.4)] active:scale-[0.96] active:shadow-inner",
  secondary:
    "border border-slate-200 bg-white text-slate-900 hover:border-teal-400 hover:bg-teal-50/50 hover:text-teal-700 shadow-sm active:scale-[0.98]",
  ghost: "text-slate-600 hover:text-teal-600 hover:bg-teal-50/30",
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
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button {...props} className={classes}>
      {children}
    </button>
  );
}
