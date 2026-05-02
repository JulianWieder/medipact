"use client";

import Link from "next/link";

const topics = [
  "Ehedaten",
  "Trennungsdatum",
  "Kinder & Betreuung",
  "Kindesunterhalt",
  "Ehegattenunterhalt",
  "Wohnsituation",
  "Vermögen & Schulden",
  "Versorgungsausgleich",
  "Hausrat",
  "Kommunikation",
  "Dokumente",
  "Nächste Schritte",
];

const relevantData = [
  {
    title: "Ehe & Trennung",
    fields: [
      "Datum der Eheschließung",
      "Ort / Land der Eheschließung",
      "Besteht ein Ehevertrag?",
      "Datum der räumlichen Trennung",
      "Leben beide bereits getrennt?",
      "Ist das Trennungsjahr begonnen / dokumentiert?",
      "Scheidung einvernehmlich oder streitig?",
    ],
  },
  {
    title: "Kinder",
    fields: [
      "Namen und Geburtsdaten der Kinder",
      "Aktuelle Betreuungssituation",
      "Gewünschtes Betreuungsmodell",
      "Umgangszeiten / Ferienregelung",
      "Sorgerechtliche Fragen",
      "Kindergarten / Schule / besondere Bedürfnisse",
      "Kommunikation über Kinder",
    ],
  },
  {
    title: "Unterhalt",
    fields: [
      "Einkommen beider Ehepartner",
      "Kindesunterhalt",
      "Trennungsunterhalt",
      "Nachehelicher Unterhalt",
      "Krankenversicherung",
      "Betreuungskosten",
      "Sonderbedarf / Mehrbedarf der Kinder",
    ],
  },
  {
    title: "Wohnung & Hausrat",
    fields: [
      "Wer bleibt in der Ehewohnung?",
      "Miete / Kredit / Nebenkosten",
      "Eigentum oder Mietwohnung?",
      "Hausrat: Möbel, Auto, Technik, Haustiere",
      "Zutritt zur Wohnung",
      "Übergangsregelung bis zur Scheidung",
    ],
  },
  {
    title: "Vermögen & Schulden",
    fields: [
      "Konten, Depots, Bargeld",
      "Immobilien",
      "Kredite und gemeinsame Verbindlichkeiten",
      "Unternehmen / Beteiligungen",
      "Anfangsvermögen",
      "Vermögen zum Trennungszeitpunkt",
      "Zugewinnausgleich",
    ],
  },
  {
    title: "Rente & Dokumente",
    fields: [
      "Rentenanwartschaften",
      "Betriebliche Altersvorsorge",
      "Private Rentenversicherungen",
      "Versorgungsausgleich",
      "Steuerbescheide",
      "Gehaltsabrechnungen",
      "Kontoauszüge",
      "Versicherungen",
    ],
  },
];

const steps = [
  {
    num: "01",
    title: "Daten vollständig erfassen",
    text: "Ehedaten, Trennungsdatum, Kinder, Einkommen, Wohnung, Vermögen und Dokumente sammeln.",
  },
  {
    num: "02",
    title: "Dringlichkeit bewerten",
    text: "Kinder, Wohnung, laufende Kosten und Kommunikation zuerst stabilisieren.",
  },
  {
    num: "03",
    title: "Lösungen vorbereiten",
    text: "Aus Fakten und Interessen entstehen faire Vereinbarungen für Trennung und Scheidung.",
  },
];

export default function TrennungClient() {
  return (
    <main className="app-shell pt-[73px]">
      <section className="border-b border-slate-200 bg-white">
        <div className="container py-12 lg:py-16">
          <Link href="/dashboard/mediation/new" className="btn btn-ghost mb-8">
            ← Zurück zur Auswahl
          </Link>

          <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
            <div>
              <p className="eyebrow mb-4">Neue Mediation</p>

              <h1 className="heading-1 text-slate-900">
                Trennung in Ruhe sortieren{" "}
              </h1>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                Eine Trennung bringt viele Fragen auf einmal mit sich. Diese
                Mediation hilft, Gedanken zu ordnen, wichtige Themen sichtbar zu
                machen und den nächsten Schritt klarer zu sehen.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {topics.map((topic) => (
                  <span
                    key={topic}
                    className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            <aside className="app-surface border border-slate-200 p-6">
              <p className="eyebrow mb-3">Hinweis</p>
              <h2 className="heading-3 mb-3">Erst klären, dann entscheiden</h2>
              <p className="text-sm leading-6 text-slate-600">
                Diese Mediation ersetzt keine Rechtsberatung. Sie hilft,
                relevante Fakten zu sammeln, Streitpunkte sichtbar zu machen und
                Gespräche mit Anwalt, Jugendamt oder Beratungsstelle besser
                vorzubereiten.
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container max-w-4xl">
          <div className="app-surface border border-slate-200 p-8 lg:p-10">
            <p className="eyebrow mb-4">Start</p>

            <h2 className="heading-2 text-slate-900 mb-4">
              Worum geht es konkret?
            </h2>

            <p className="mb-8 text-slate-600 leading-7">
              Beschreiben Sie die Situation sachlich. Noch keine Bewertung, kein
              Urteil, keine Lösung erzwingen. Erst Fakten, dann Interessen, dann
              Optionen.
            </p>

            <div className="grid gap-6">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-800">
                  Kurze Beschreibung der Trennung
                </span>
                <textarea
                  className="min-h-40 w-full rounded-2xl border border-slate-300 bg-white p-4 text-slate-800 outline-none transition focus:border-emerald-500"
                  placeholder="Beispiel: Wir sind verheiratet, leben seit März getrennt, haben ein Kind und müssen Betreuung, Unterhalt, Wohnung und Vermögen klären..."
                />
              </label>

              <div className="grid gap-6 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-800">
                    Datum der Eheschließung
                  </span>
                  <input
                    type="date"
                    className="w-full rounded-2xl border border-slate-300 bg-white p-4 text-slate-800 outline-none transition focus:border-emerald-500"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-800">
                    Datum der Trennung
                  </span>
                  <input
                    type="date"
                    className="w-full rounded-2xl border border-slate-300 bg-white p-4 text-slate-800 outline-none transition focus:border-emerald-500"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-800">
                  Was ist aktuell am dringendsten?
                </span>
                <input
                  className="w-full rounded-2xl border border-slate-300 bg-white p-4 text-slate-800 outline-none transition focus:border-emerald-500"
                  placeholder="z. B. Kinderbetreuung, Unterhalt, Wohnung, Konten, Kommunikation, Anwaltstermin"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-800">
                  Gibt es akute Risiken oder Eskalationen?
                </span>
                <textarea
                  className="min-h-28 w-full rounded-2xl border border-slate-300 bg-white p-4 text-slate-800 outline-none transition focus:border-emerald-500"
                  placeholder="z. B. Kontaktabbruch, finanzielle Blockade, verweigerter Umgang, Drohungen, Auszug, gesperrte Konten..."
                />
              </label>

              <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
                <Link
                  href="/dashboard/mediation/new"
                  className="btn btn-secondary"
                >
                  Abbrechen
                </Link>

                <button type="button" className="btn btn-primary">
                  Situation sortieren
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-12 lg:py-16">
        <div className="mb-8">
          <p className="eyebrow mb-4">Relevante Daten</p>
          <h2 className="heading-2 text-slate-900">
            Was für Trennung und Scheidung geklärt werden sollte
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {relevantData.map((group) => (
            <article
              key={group.title}
              className="app-surface border border-slate-200 p-6"
            >
              <h3 className="heading-3 mb-4">{group.title}</h3>

              <ul className="space-y-3">
                {group.fields.map((field) => (
                  <li
                    key={field}
                    className="flex gap-3 text-sm leading-6 text-slate-600"
                  >
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                    <span>{field}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-muted">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <article
                key={step.num}
                className="app-surface border border-slate-200 p-6"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-lg font-black text-emerald-700">
                  {step.num}
                </div>

                <h2 className="heading-3 mb-3">{step.title}</h2>

                <p className="text-sm leading-6 text-slate-600">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
