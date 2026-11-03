import Link from "next/link";
import {
  eignungscheckTeaserDe,
  type EignungscheckTeaserInhalt,
} from "@/app/content/eignungscheck";

/**
 * Werbe-Band für den kostenlosen Kurz-Check (/eignungscheck). Startseite,
 * /konflikte, /preise, /konflikte/nachbarschaft und /verbraucher.
 *
 * Texte: app/content/eignungscheck.ts (Deutsch), auf der Startseite für
 * andere Sprachen aus messages/*.json unter home.eignungscheck. Die
 * Ampel-Punkte sind Deko und nehmen das Ergebnis des Checks vorweg.
 */
export function EignungscheckTeaser({
  inhalt = eignungscheckTeaserDe,
  className = "",
}: {
  inhalt?: EignungscheckTeaserInhalt;
  className?: string;
}) {
  return (
    <section className={`section-base py-12 sm:py-16 ${className}`}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col gap-8 rounded-[2rem] border border-accent-200 bg-gradient-to-br from-accent-50 to-white p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="flex gap-1.5" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-700">
                {inhalt.eyebrow}
              </span>
            </div>
            <h2 className="mt-4 text-2xl font-black tracking-tight text-neutral-900 sm:text-3xl">
              {inhalt.title}
            </h2>
            <p className="mt-3 text-base leading-7 text-neutral-700">{inhalt.text}</p>
          </div>
          <div className="flex shrink-0 flex-col items-start gap-3 lg:items-end">
            <Link href="/eignungscheck" className="btn btn-primary">
              {inhalt.cta}
            </Link>
            <span className="text-xs text-neutral-500">{inhalt.hinweis}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
