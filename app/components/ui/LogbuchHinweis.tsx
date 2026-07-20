import Link from "next/link";

/**
 * Hinweis-Box auf das kostenlose Konflikt-Logbuch ("Streit-Tagebuch").
 *
 * Wird auf den Konfliktarten-Seiten (via MarketingPageTemplate) und weiteren
 * Marketing-Seiten eingeblendet: Wer noch nicht bereit für eine Mediation ist,
 * kann den Konflikt erst einmal kostenlos dokumentieren – der Einstieg in den
 * Trichter (0 € dokumentieren → Mediation starten).
 */
export function LogbuchHinweis() {
  return (
    <section className="section-base border-t border-neutral-100 py-14">
      <div className="container max-w-4xl">
        <div className="flex flex-col items-start gap-6 rounded-3xl border-2 border-accent-200 bg-accent-50/50 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <div>
            <span className="inline-flex items-center rounded-full bg-accent-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
              Kostenlos
            </span>
            <h2 className="mt-3 font-display text-2xl font-medium text-neutral-900">
              Noch nicht bereit für eine Mediation?
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-600">
              Dann dokumentieren Sie erst einmal: Im kostenlosen{" "}
              <strong>Konflikt-Logbuch</strong> halten Sie Vorkommnisse,
              Gespräche, E-Mails, WhatsApp-Nachrichten und Telefonate fest –
              wie ein Streit-Tagebuch. Vertraulich, jederzeit in eine Mediation
              umwandelbar.
            </p>
          </div>
          <Link
            href="/konflikt-logbuch"
            className="shrink-0 rounded-xl bg-accent-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-accent-700"
          >
            Konflikt-Logbuch starten →
          </Link>
        </div>
      </div>
    </section>
  );
}
