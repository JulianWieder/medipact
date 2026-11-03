import type { aboutGrundsaetze } from "@/app/content/aboutPage";
import { ArrowLink } from "@/app/components/ui/ArrowLink";

/**
 * V-A-N-K-Grundhaltung auf /about, direkt unter der Vision. Der große
 * Buchstabe trägt das Akronym, damit es auch beim Überfliegen hängen bleibt.
 * Texte in app/content/aboutPage.ts.
 *
 * Seit 03.11.2026 Kurzfassung (nur Buchstabe + Begriff): Die Erklärungen
 * (`items[].text`) stehen ausführlich auf /methode#mediation.
 */
export function AboutGrundsaetzeSection({
  grundsaetze,
}: {
  grundsaetze: typeof aboutGrundsaetze;
}) {
  return (
    <section className="section section-base border-y border-neutral-200">
      <div className="container">
        <div className="max-w-3xl">
          <div className="eyebrow mb-4">{grundsaetze.eyebrow}</div>
          <h2 className="heading-2 text-neutral-900">
            {grundsaetze.title}
            <span className="block text-accent-700">{grundsaetze.titleHighlight}</span>
          </h2>
          <p className="mt-5 text-lg leading-8 text-neutral-700">{grundsaetze.text}</p>
        </div>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {grundsaetze.items.map((item) => (
            <li
              key={item.letter}
              className="flex items-center gap-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <span
                aria-hidden="true"
                className="text-4xl font-black leading-none tracking-tight text-accent-700"
              >
                {item.letter}
              </span>
              <span className="heading-3">{item.title}</span>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <ArrowLink href="/methode#mediation">
            Was die vier Grundsätze in der Mediation bedeuten
          </ArrowLink>
        </div>
      </div>
    </section>
  );
}
