import type { aboutGrundsaetze } from "@/app/content/aboutPage";

/**
 * V-A-N-K-Grundhaltung auf /about, direkt unter der Vision. Der große
 * Buchstabe trägt das Akronym, damit es auch beim Überfliegen hängen bleibt.
 * Texte in app/content/aboutPage.ts.
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
        <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {grundsaetze.items.map((item) => (
            <div
              key={item.letter}
              className="rounded-3xl border border-neutral-200 bg-white p-7 shadow-sm"
            >
              <div
                aria-hidden="true"
                className="text-5xl font-black leading-none tracking-tight text-accent-700"
              >
                {item.letter}
              </div>
              <dt className="heading-3 mt-4">{item.title}</dt>
              <dd className="mt-3 text-base leading-7 text-neutral-700">{item.text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
