import Link from "next/link";

/**
 * Startseiten-Sektion: Kostenloses Konflikt-Logbuch.
 *
 * Sanfter Einstieg für Besucher, die noch nicht bereit für eine Mediation
 * sind – erst dokumentieren (0 €), später mediieren. Verlinkt auf die
 * SEO-Landingpage /konflikt-logbuch. Bewusst deutschsprachig hardcodiert
 * (wie DidYouKnowSection/QuickCheck; /en ist nicht indexiert).
 */
export default function LogbuchSection() {
  return (
    <section className="section section-base">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-10 rounded-[2rem] border border-neutral-200 bg-neutral-50 p-8 sm:p-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <span className="inline-flex items-center rounded-full bg-accent-600 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
              Neu &amp; dauerhaft kostenlos
            </span>
            <h2 className="heading-2 mt-5">
              Noch nicht bereit für eine Mediation?
              <span className="block text-accent-600">
                Dann dokumentieren Sie erst einmal.
              </span>
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-neutral-700">
              Mit dem <strong>Konflikt-Logbuch</strong> halten Sie fest, was in
              Ihrem Streit passiert – wie in einem Streit-Tagebuch: Vorkommnisse,
              Gespräche, E-Mails, WhatsApp-Nachrichten, Telefonate und Ihre
              Gedanken. Vertraulich, chronologisch sortiert und jederzeit mit
              einem Klick in eine Mediation umwandelbar.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="/auth/register"
                className="inline-flex items-center justify-center rounded-xl bg-accent-600 px-7 py-3 text-sm font-bold text-white transition hover:bg-accent-700"
              >
                Kostenlos starten →
              </a>
              <Link
                href="/konflikt-logbuch"
                className="text-sm font-semibold text-accent-600 transition hover:text-accent-700"
              >
                Mehr zum Konflikt-Logbuch →
              </Link>
            </div>
          </div>

          {/* Mini-Vorschau: so sieht die Chronologie aus */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Ihre Chronologie
            </p>
            <ul className="mt-3 space-y-3">
              {[
                { icon: "📞", label: "Telefonat", text: "Erneut über die Hecke gestritten – kein Ergebnis." },
                { icon: "✉️", label: "E-Mail", text: "Nachbar fordert Rückschnitt bis Ende des Monats." },
                { icon: "📌", label: "Vorkommnis", text: "Laute Musik bis 1:30 Uhr, drittes Mal diese Woche." },
              ].map((e) => (
                <li key={e.text} className="flex items-start gap-3 rounded-xl border border-neutral-100 bg-neutral-50/60 p-3">
                  <span>{e.icon}</span>
                  <span>
                    <span className="block text-xs font-bold text-neutral-800">{e.label}</span>
                    <span className="block text-xs leading-5 text-neutral-500">{e.text}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-center text-[11px] text-neutral-400">
              … und wenn Sie so weit sind: „In Mediation umwandeln“.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
