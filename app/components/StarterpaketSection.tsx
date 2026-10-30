import { ArrowLink } from "@/app/components/ui/ArrowLink";
import { Button } from "@/app/components/ui/Button";
import type { StarterpaketInhalt } from "@/app/content/starterpaket";
import { STARTERPAKET_URL } from "@/lib/mediatorVermittlung";

/**
 * Das digitale Starterpaket als eigener Weg neben dem Online-Verfahren
 * (Modell: lib/mediatorVermittlung.ts). Startseite und /preise.
 *
 * Auf der Startseite seit 29.10.2026 direkt unter dem Hero: Das Paket ist
 * der Einstieg für alle, die erst verstehen wollen, wie Mediation arbeitet,
 * und mehrere Mediator:innen kennenlernen möchten. Die drei `zweck`-Karten
 * sagen genau das, bevor Phasen und Preis kommen – inklusive der Grenze:
 * Das Paket klärt, ob eine Lösung erreichbar ist, eine Einigung entsteht
 * darin noch nicht.
 */
export function StarterpaketSection({ inhalt }: { inhalt: StarterpaketInhalt }) {
  return (
    <section
      id="starterpaket"
      className="section section-muted scroll-mt-20 border-y border-neutral-200"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="eyebrow mb-4">{inhalt.eyebrow}</div>
          <h2 className="text-3xl font-black leading-[1.15] tracking-tight text-neutral-900 sm:text-4xl">
            {inhalt.title}
            <span className="block text-accent-700">{inhalt.titleHighlight}</span>
          </h2>
          <p className="mt-5 text-lg leading-8 text-neutral-700">{inhalt.text}</p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {inhalt.zweck.map((z, i) => (
            <div
              key={z.title}
              className="rounded-3xl border border-accent-200 bg-white p-7 shadow-sm"
            >
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-700">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-2 text-xl font-bold tracking-tight text-neutral-900">{z.title}</h3>
              <p className="mt-3 text-base leading-7 text-neutral-700">{z.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
          <ol className="grid gap-4 sm:grid-cols-2">
            {inhalt.phasen.map((phase, i) => {
              const uebergabe = i === inhalt.phasen.length - 1;
              return (
                <li
                  key={phase.title}
                  className={
                    "rounded-3xl border p-6 " +
                    (uebergabe
                      ? "border-accent-300 bg-accent-50/60"
                      : "border-neutral-200 bg-white")
                  }
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-600 text-sm font-bold text-white">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-base font-semibold text-neutral-900">{phase.title}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-neutral-600">{phase.text}</p>
                </li>
              );
            })}
          </ol>

          <div className="rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-700">
              {inhalt.name}
            </div>
            <div className="mt-4 text-5xl font-black tracking-tight text-neutral-900">
              {inhalt.preis}
            </div>
            <p className="mt-2 text-sm text-neutral-500">{inhalt.preisHinweis}</p>
            <ul className="mt-6 space-y-3 border-t border-neutral-100 pt-6 text-sm text-neutral-700">
              {inhalt.punkte.map((punkt) => (
                <li key={punkt} className="flex gap-2">
                  <span className="font-bold text-accent-600">✓</span>
                  <span>{punkt}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 rounded-2xl bg-neutral-50 p-5 text-sm leading-6 text-neutral-600">
              {inhalt.danach}
            </p>
            <Button href={STARTERPAKET_URL} className="mt-6 w-full">
              {inhalt.cta}
            </Button>
            <div className="mt-4 text-center">
              <ArrowLink href="/mediator-finden#verzeichnis" className="text-sm">
                {inhalt.ctaProfile}
              </ArrowLink>
            </div>
          </div>
        </div>

        {/* Leitfaden der Kennenlerngespräche: zeigt, was in den 20 Minuten
            konkret passiert – die Gespräche sind der Kern des Pakets. */}
        <div className="mt-12 rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-sm lg:grid lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-neutral-900">
              {inhalt.gespraech.title}
            </h3>
            <p className="mt-3 text-base leading-7 text-neutral-700">{inhalt.gespraech.intro}</p>
          </div>
          <ul className="mt-6 grid gap-x-8 gap-y-3 text-sm leading-6 text-neutral-700 sm:grid-cols-2 lg:mt-0">
            {inhalt.gespraech.punkte.map((punkt) => (
              <li key={punkt} className="flex gap-2">
                <span className="font-bold text-accent-600">✓</span>
                <span>{punkt}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
