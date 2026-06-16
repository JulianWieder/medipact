import Link from "next/link";
import { aboutPageContent } from "@/app/content/aboutPage";
import MiniMatrix from "@/app/components/MiniMatrix";

const useCases = [
  {
    title: "Trennung & Scheidung",
    scenario: `„Wir haben uns getrennt – aber die Wohnung, das Konto und die Betreuungszeiten sind noch ungeklärt."`,
    text: "Genau in dieser Phase entstehen die teuersten Fehler: voreilige Entscheidungen, eskalierte Nachrichten, unnötige Anwaltskosten. Medipact schafft einen Rahmen, in dem beide Seiten ruhig klären, was wirklich wichtig ist.",
    points: [
      "Finanzen, Hausrat und Betreuung getrennt besprechen",
      "Keine Eskalation durch direkte Konfrontation",
      "Weniger Druck – besonders für Kinder",
    ],
    iconPath: "M12 21C12 21 3 14.5 3 8.5a4.5 4.5 0 0 1 7.84-3.03L12 6.5l1.16-1.03A4.5 4.5 0 0 1 21 8.5C21 14.5 12 21 12 21z M8 15l4 4 4-4 M12 19v-7",
    accentFrom: "#fff1f2",
    accentTo: "#fff7ed",
    iconColor: "#e11d48",
    iconBg: "#ffe4e6",
  },
  {
    title: "Nachbarschaftskonflikte",
    scenario: `„Seit Monaten halten wir Ruhezeiten ein – und werden trotzdem regelmäßig angezeigt."`,
    text: "Nachbarschaftsstreit eskaliert schnell, weil man sich nicht aus dem Weg gehen kann. Medipact hilft, das Muster zu durchbrechen: klare Themen, sachlicher Austausch, verbindliche Regeln.",
    points: [
      "Lärm, Grenzen, Gemeinschaftsflächen strukturiert klären",
      "Sachlicher Ton statt persönlicher Angriffe",
      "Konkrete Vereinbarungen statt vager Versprechen",
    ],
    iconPath: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
    accentFrom: "#f0f9ff",
    accentTo: "#f0fdfa",
    iconColor: "#0284c7",
    iconBg: "#e0f2fe",
  },
  {
    title: "Erbstreitigkeiten",
    scenario: `„Meine Geschwister und ich streiten seit dem Tod unserer Mutter. Es geht ums Haus – aber eigentlich um viel mehr."`,
    text: "Erbkonflikte sind selten nur finanzielle Fragen. Alte Verletzungen, Erwartungen und Trauer kommen gleichzeitig. Medipact hilft, die Ebenen zu trennen – damit eine faire Lösung möglich wird, ohne die Familie zu spalten.",
    points: [
      "Finanzielle und emotionale Themen klar trennen",
      "Alle Positionen sichtbar machen, ohne Druck",
      "Familienbeziehungen soweit wie möglich erhalten",
    ],
    iconPath: "M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2 M12 12v4 M10 14h4",
    accentFrom: "#fffbeb",
    accentTo: "#fefce8",
    iconColor: "#d97706",
    iconBg: "#fef3c7",
  },
];

export default function AboutPage() {
  const {
    eyebrow,
    title,
    titleHighlight,
    intro,
    primaryCta,
    secondaryCta,
    featuresTitle,
    featuresIntro,
    features,
    processTitle,
    processIntro,
    process,
    finalCta,
    finalCtaTitle,
    finalCtaText,
  } = aboutPageContent;

  return (
    <>
      {/* HERO */}
      <section className="section section-base">
        <div className="container max-w-3xl">
          <p className="eyebrow mb-4">{eyebrow}</p>

          <h1 className="heading-1">
            {title} <span className="text-emerald-700">{titleHighlight}</span>
          </h1>

          <p className="mt-6 text-lg text-slate-600">{intro}</p>

          <div className="mt-8 flex gap-4">
            <Link href={primaryCta.href} className="btn btn-primary">
              {primaryCta.label}
            </Link>
            <Link href={secondaryCta.href} className="btn btn-secondary">
              {secondaryCta.label}
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section section-muted">
        <div className="container">
          <div className="max-w-2xl">
            <h2 className="heading-2">{featuresTitle}</h2>
            <p className="mt-4 text-slate-600">{featuresIntro}</p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {features.map((item) => (
              <Link key={item.title} href={item.href} className="card">
                <h3 className="heading-3">{item.title}</h3>
                <p className="mt-4 text-slate-600">{item.text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="section section-base">
        <div className="container">
          <div className="max-w-2xl">
            <h2 className="heading-2">{processTitle}</h2>
            <p className="mt-4 text-slate-600">{processIntro}</p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-4">
            {process.map((step, index) => (
              <div key={step.title} className="card">
                <p className="text-sm text-emerald-700 font-medium">
                  Schritt {index + 1}
                </p>
                <h3 className="heading-3 mt-2">{step.title}</h3>
                <p className="mt-4 text-slate-600">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CASES INTRO */}
      <section className="section section-muted">
        <div className="container">
          <div className="max-w-3xl">
            <p className="eyebrow mb-4">Beispiele</p>

            <h2 className="heading-2">
              Welche Situation kommt Ihrer am nächsten?
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Die Fallbeispiele zeigen, wie sich Konflikte konkret entwickeln
              können — und an welcher Stelle Mediation wieder Struktur ins
              Gespräch bringt.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {useCases.map((useCase) => (
              <article
                key={useCase.title}
                className="app-surface flex flex-col overflow-hidden"
              >
                {/* Farbige Karten-Kopfzeile */}
                <div
                  className="px-8 pt-8 pb-6"
                  style={{
                    background: `linear-gradient(135deg, ${useCase.accentFrom} 0%, ${useCase.accentTo} 100%)`,
                  }}
                >
                  {/* Icon */}
                  <div
                    className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: useCase.iconBg, color: useCase.iconColor }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      {useCase.iconPath.split(" M").map((d, i) => (
                        <path key={i} d={i === 0 ? d : "M" + d} />
                      ))}
                    </svg>
                  </div>

                  <h3 className="heading-3 text-slate-900">{useCase.title}</h3>

                  {/* Szenario-Zitat */}
                  <p className="mt-3 text-sm italic leading-relaxed text-slate-500">
                    {useCase.scenario}
                  </p>
                </div>

                {/* Karten-Body */}
                <div className="flex flex-1 flex-col px-8 py-6">
                  <p className="text-sm leading-7 text-slate-600">
                    {useCase.text}
                  </p>

                  <ul className="mt-6 space-y-3 border-t border-slate-100 pt-6 text-sm text-slate-700">
                    {useCase.points.map((point) => (
                      <li key={point} className="flex items-start gap-3">
                        <span
                          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                          style={{ backgroundColor: useCase.iconColor }}
                        >
                          ✓
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* MINI MATRIX (full width) */}
      <MiniMatrix />

      {/* FINAL CTA */}
      <section className="section section-strong">
        <div className="container text-center max-w-2xl">
          <h2 className="heading-2">{finalCtaTitle}</h2>
          <p className="mt-4 text-slate-300">{finalCtaText}</p>

          <Link
            href={finalCta.href}
            className="btn btn-primary mt-6 inline-block"
          >
            {finalCta.label}
          </Link>
        </div>
      </section>
    </>
  );
}
