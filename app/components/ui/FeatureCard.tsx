import clsx from "clsx";
import { ReactNode } from "react";

type FeatureCardProps = {
  title: string;
  text: string;
  /** Optionales Icon/Emoji links neben dem Titel (ReactNode oder String). */
  icon?: ReactNode;
  /** "surface" (default) = app-surface Karte mit Hover-Akzent,
   * "plain" = ohne Rahmen/Schatten (z.B. innerhalb bestehender Karten). */
  variant?: "surface" | "plain";
  className?: string;
};

/**
 * Standardisierte kleine Feature-/Vorteils-Karte (Titel + Kurztext, optional
 * Icon) mit einheitlichem Hover-Verhalten (Akzent-Rahmen, leichte Anhebung).
 * Ersetzt die bisher nackten `app-surface p-4`-Boxen (z.B. ThemenTabs) und
 * ist überall einsetzbar, wo Feature-/Trust-/Vorteils-Listen als Karten
 * gerendert werden.
 */
export function FeatureCard({
  title,
  text,
  icon,
  variant = "surface",
  className,
}: FeatureCardProps) {
  return (
    <div
      className={clsx(
        variant === "surface" &&
          "app-surface p-4 sm:p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-200 hover:shadow-md hover:shadow-accent-900/5",
        variant === "plain" && "p-1",
        className,
      )}
    >
      <p className="flex items-center gap-2.5 text-sm font-semibold text-neutral-900">
        {icon && (
          <span
            aria-hidden="true"
            className="inline-flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-accent-50 text-sm text-accent-700"
          >
            {icon}
          </span>
        )}
        {title}
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">{text}</p>
    </div>
  );
}
