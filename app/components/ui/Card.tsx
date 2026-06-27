import { ReactNode } from "react";
import clsx from "clsx";

type CardProps = {
  children: ReactNode;
  variant?: "default" | "muted" | "accent" | "warning" | "danger";
  className?: string;
};

const variants = {
  // Nutzt die optimierten Klassen aus globals.css[cite: 5, 7]
  default: "app-surface p-8",
  muted: "bg-neutral-50 border border-neutral-100 p-8 rounded-3xl",
  accent:
    "bg-gradient-to-br from-accent-50 to-white border border-accent-200 shadow-[0_0_40px_rgba(94,234,212,0.15)] p-8 rounded-3xl",
  warning: "bg-amber-50 border border-amber-200 p-8 rounded-3xl",
  danger: "bg-red-50 border border-red-200 p-8 rounded-3xl",
};

export function Card({ children, variant = "default", className }: CardProps) {
  return (
    <div
      className={clsx(
        "transition-all duration-300",
        variants[variant],
        className,
      )}
    >
      {children}
    </div>
  );
}
