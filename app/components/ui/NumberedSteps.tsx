import clsx from "clsx";

export type NumberedStep = {
  title: string;
  text: string;
};

type NumberedStepsProps = {
  steps: NumberedStep[];
  /** "light" (default) für helle Sektionen, "dark" für section-strong. */
  tone?: "light" | "dark";
  className?: string;
};

/**
 * Standardisierte nummerierte Schritt-Reihe (01 / 02 / 03 …): Akzent-Nummer,
 * Titel, Kurztext, auf Desktop mit Verbindungslinie zwischen den Schritten.
 * Für "So funktioniert es"-Sektionen (Homepage, /methode, Marketing-Seiten) –
 * statt reiner Textblöcke oder pro Seite nachgebauter Schritt-Layouts.
 */
export function NumberedSteps({ steps, tone = "light", className }: NumberedStepsProps) {
  const dark = tone === "dark";
  return (
    <ol
      className={clsx(
        "grid gap-10 text-left sm:gap-8",
        steps.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2",
        className,
      )}
    >
      {steps.map((step, i) => (
        <li key={step.title} className="relative">
          <div className="flex items-center gap-4">
            <span
              className={clsx(
                "flex h-11 w-11 flex-none items-center justify-center rounded-full border text-sm font-black tracking-tight",
                dark
                  ? "border-accent-500/40 bg-accent-500/10 text-accent-300"
                  : "border-accent-200 bg-accent-50 text-accent-700",
              )}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            {/* Verbindungslinie zum nächsten Schritt (nur Desktop, nicht am letzten) */}
            {i < steps.length - 1 && (
              <span
                aria-hidden="true"
                className={clsx(
                  "hidden h-px flex-1 sm:block",
                  dark ? "bg-white/10" : "bg-neutral-200",
                )}
              />
            )}
          </div>
          <h3
            className={clsx(
              "mt-4 text-base font-bold",
              dark ? "text-white" : "text-neutral-900",
            )}
          >
            {step.title}
          </h3>
          <p
            className={clsx(
              "mt-2 text-sm leading-relaxed",
              dark ? "text-neutral-300" : "text-neutral-600",
            )}
          >
            {step.text}
          </p>
        </li>
      ))}
    </ol>
  );
}
