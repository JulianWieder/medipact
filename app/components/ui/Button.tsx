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
  "inline-flex items-center justify-center rounded-2xl font-semibold transition focus:outline-none";

const variants = {
  primary: "bg-emerald-700 text-white hover:bg-emerald-800 active:scale-[0.98]",
  secondary:
    "border border-slate-200 bg-white text-slate-900 hover:border-emerald-300 hover:bg-emerald-50",
  ghost: "text-slate-600 hover:text-slate-900",
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
