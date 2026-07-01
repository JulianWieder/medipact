import { ReactNode } from "react";
import clsx from "clsx";

type CardProps = {
  children: ReactNode;
  variant?: "default" | "muted" | "accent" | "warning" | "danger";
  className?: string;
};

// Gemeinsame Basis für Radius/Innenabstand der nicht-"default"-Varianten.
// Vorher wurde "rounded-[2rem] p-8" an praktisch jeder Call-Site einzeln
// wiederholt (siehe CaseStudyTemplate.tsx) und wich dabei vom hier
// definierten "rounded-3xl" (1.5rem) ab — jetzt an einer Stelle
// vereinheitlicht, damit Aufrufer es nicht mehr überschreiben müssen.
// "default" bleibt bewusst auf app-surface's eigenem, responsivem Radius
// (1rem → 2rem) statt fix 2rem, das ist ein bewusster Mobile-Unterschied
// aus globals.css und soll nicht überschrieben werden.
const baseSurface = "rounded-[2rem] p-8";

const variants = {
  // Nutzt die optimierten Klassen aus globals.css[cite: 5, 7]
  default: "app-surface p-8",
  muted: `bg-neutral-50 border border-neutral-100 ${baseSurface}`,
  accent: `bg-gradient-to-br from-accent-50 to-white border border-accent-200 shadow-[0_0_40px_rgba(94,234,212,0.15)] ${baseSurface}`,
  warning: `bg-amber-50 border border-amber-200 ${baseSurface}`,
  danger: `bg-red-50 border border-red-200 ${baseSurface}`,
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
