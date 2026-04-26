import { ReactNode } from "react";
import clsx from "clsx";

type CardProps = {
  children: ReactNode;
  variant?: "default" | "muted" | "accent" | "warning" | "danger";
  className?: string;
};

const variants = {
  default: "bg-white border border-slate-200 shadow-sm",
  muted: "bg-slate-50 border border-slate-100",
  accent: "bg-emerald-50 border border-emerald-100",
  warning: "bg-orange-50 border border-orange-200",
  danger: "bg-red-50 border border-red-200",
};

export function Card({ children, variant = "default", className }: CardProps) {
  return (
    <div className={clsx("rounded-2xl p-6", variants[variant], className)}>
      {children}
    </div>
  );
}
