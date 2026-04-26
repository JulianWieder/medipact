"use client";

import Link from "next/link";
import { FadeIn } from "@/app/components/ui/motion";

const problemPoints = [
  "Gespräche eskalieren, obwohl eigentlich eine Lösung gebraucht wird.",
  "Anwälte und Gerichte sind teuer, langsam und emotional belastend.",
  "Familien, Nachbarn oder Ex-Partner müssen oft trotzdem weiter miteinander umgehen.",
];

const useCases = [
  {
    title: "Trennung & Scheidung",
    text: "Wenn Finanzen, Hausrat, Betreuung oder Kommunikation geklärt werden müssen, ohne dass jede Nachricht zum Streit wird.",
    points: [
      "faire Aufteilung",
      "klare Absprachen",
      "weniger Druck für Kinder und Familie",
    ],
  },
  {
    title: "Nachbarschaftskonflikte",
    text: "Für Lärm, Grenzen, Nutzung gemeinsamer Flächen oder wiederkehrende Missverständnisse im Alltag.",
    points: [
      "ruhiger Austausch",
      "konkrete Regeln",
      "wieder normal nebeneinander leben",
    ],
  },
  {
    title: "Erbstreitigkeiten",
    text: "Wenn emotionale Familiengeschichte und finanzielle Fragen vermischt sind und eine faire Lösung gebraucht wird.",
    points: [
      "Positionen sortieren",
      "Interessen sichtbar machen",
      "Beziehungen möglichst erhalten",
    ],
  },
];

const modules = [
  {
    title: "Ruhiger Einstieg",
    text: "Sie schildern die Situation strukturiert, ohne sofort in eine direkte Konfrontation zu müssen. Das senkt die Hemmschwelle für den ersten Schritt.",
  },
  {
    title: "Beide Seiten werden gehört",
    text: "Medipact hilft, Forderungen, Sorgen und Interessen getrennt zu betrachten. So entsteht ein klareres Bild des Konflikts.",
  },
  {
    title: "Geführter Lösungsprozess",
    text: "Die KI führt Schritt für Schritt durch den Austausch, stellt neutrale Fragen und hilft, aus verhärteten Positionen konkrete Optionen zu machen.",
  },
  {
    title: "Einigung festhalten",
    text: "Wenn eine Lösung gefunden ist, wird sie verständlich dokumentiert. Bei Bedarf kann das Ergebnis anschließend juristisch geprüft werden.",
  },
];

const trustPoints = [
  {
    title: "Vertraulich & DSGVO-konform",
    text: "Private Konflikte brauchen Schutz. Der Prozess ist auf vertrauliche Kommunikation und sensible Daten ausgelegt.",
  },
  {
    title: "Sie behalten die Kontrolle",
    text: "Medipact entscheidet nicht über Sie. Die Plattform strukturiert den Weg zur Lösung; zustimmen müssen immer die Beteiligten selbst.",
  },
  {
    title: "Menschliche Hilfe möglich",
    text: "Wenn ein Fall zu emotional oder festgefahren ist, kann ein menschlicher Mediator eingebunden werden.",
  },
];

const workflowSteps = [
  {
    num: "01",
    title: "Streitfall starten",
    text: "Sie beschreiben kurz, worum es geht: Trennung, Nachbarschaft, Erbe oder ein anderer privater Konflikt.",
  },
  {
    num: "02",
    title: "Zweite Seite einladen",
    text: "Die andere Partei wird sachlich eingebunden. Kein öffentlicher Druck, keine bloßstellende Konfrontation.",
  },
  {
    num: "03",
    title: "Themen sortieren",
    text: "Medipact trennt Emotionen, Forderungen und eigentliche Interessen. Dadurch wird der Konflikt greifbarer.",
  },
  {
    num: "04",
    title: "Geführt austauschen",
    text: "Beide Seiten antworten strukturiert. Die KI hilft, Eskalation zu vermeiden und beim Wesentlichen zu bleiben.",
  },
  {
    num: "05",
    title: "Lösungen entwickeln",
    text: "Aus den Interessen entstehen konkrete Vorschläge, die beide Seiten prüfen, anpassen oder ablehnen können.",
  },
  {
    num: "06",
    title: "Einigung dokumentieren",
    text: "Das Ergebnis wird klar festgehalten. Bei rechtlich wichtigen Fragen sollte es juristisch geprüft werden.",
  },
];

const faqs = [
  {
    q: "Für welche Konflikte ist Medipact geeignet?",
    a: "Vor allem für private Konflikte, bei denen beide Seiten grundsätzlich eine Lösung suchen: Trennung, Scheidung, Nachbarschaftsstreit, Erbe oder familiäre Auseinandersetzungen.",
  },
  {
    q: "Ersetzt Medipact einen Anwalt oder ein Gericht?",
    a: "Nein. Medipact ist eine niedrigschwellige Alternative zur strukturierten Einigung. Bei komplexen rechtlichen Fragen sollte das Ergebnis anwaltlich geprüft werden.",
  },
  {
    q: "Was passiert, wenn die andere Seite nicht mitmacht?",
    a: "Dann kann keine gemeinsame Einigung entstehen. Sie können Ihre Sicht trotzdem sortieren und besser vorbereitet entscheiden, ob ein anderer Weg notwendig ist.",
  },
  {
    q: "Ist das Ergebnis rechtlich bindend?",
    a: "Eine Vereinbarung kann verbindlich werden, wenn beide Seiten sie bewusst akzeptieren und die rechtlichen Anforderungen erfüllt sind. Bei Scheidung, Erbe oder größeren Vermögenswerten ist eine juristische Prüfung sinnvoll.",
  },
  {
    q: "Wie lange dauert der Prozess?",
    a: "Viele Konflikte lassen sich in wenigen Wochen strukturieren und lösen. Die Dauer hängt davon ab, wie komplex der Streit ist und wie aktiv beide Seiten mitarbeiten.",
  },
];

const comparisonPlans = [
  {
    title: "Medipact",
    status: "Ruhig & bezahlbar",
    features: [
      "niedrige Einstiegshürde",
      "strukturierter Austausch",
      "weniger Eskalation",
      "für private Konflikte",
      "menschlicher Mediator optional",
    ],
    className:
      "bg-emerald-900/50 border-emerald-600/60 shadow-2xl shadow-emerald-900/30",
    featured: true,
  },
  {
    title: "Anwaltlicher Streit",
    status: "Konfrontativer",
    features: [
      "häufig positionsgetrieben",
      "Kosten können schnell steigen",
      "Kommunikation oft über Dritte",
      "sinnvoll bei klaren Rechtsfragen",
    ],
    className: "bg-slate-800/50 border-slate-700",
    featured: false,
  },
  {
    title: "Gerichtsverfahren",
    status: "Langsam & fremdbestimmt",
    features: [
      "Richter entscheidet",
      "dauert oft lange",
      "belastet Beziehungen zusätzlich",
      "notwendig, wenn keine Einigung möglich ist",
    ],
    className: "bg-slate-800/50 border-slate-700",
    featured: false,
  },
];

export default function MedipactLanding() {
  return (
    <>
      <main className="app-shell pt-[73px]">
        <section
          id="top"
          className="section section-base relative overflow-hidden scroll-mt-20"
        >
          <div className="mx-auto grid max-w-7xl gap-16 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
            <div className="max-w-3xl">
              <div className="app-surface-muted inline-flex items-center gap-2 rounded border border-slate-200 px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
                Für Trennung, Nachbarschaft und Erbe
              </div>

              <FadeIn>
                <h1 className="heading-1 mt-8">
                  Streit klären ohne Gericht –
                  <span className="block bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                    ruhig, fair und bezahlbar.
                  </span>
                </h1>
              </FadeIn>

              <FadeIn delay={0.1}>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
                  Medipact begleitet private Konflikte strukturiert: bei
                  Scheidung, Nachbarschaftsstreit oder Erbe. Mit KI-gestützter
                  Mediation finden beide Seiten schneller zu einer Lösung – ohne
                  jahrelange Eskalation.
                </p>
              </FadeIn>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/auth/register"
                  className="inline-flex items-center justify-center rounded-2xl bg-emerald-700 px-8 py-4 text-sm font-bold text-white transition hover:scale-[1.02] hover:bg-emerald-800"
                >
                  Streitfall kostenlos starten
                </Link>
                <a
                  href="#process"
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-8 py-4 text-sm font-semibold text-slate-900 transition hover:border-emerald-300 hover:bg-emerald-50"
                >
                  So funktioniert es
                </a>
              </div>

              <div className="mt-8 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  🔒 Vertraulich
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  💰 Bezahlbar
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  🤝 Lösungsorientiert
                </div>
              </div>
            </div>

            <div
              className="app-surface overflow-hidden rounded-[2.5rem] border border-slate-200"
              style={{
                position: "relative",
                overflow: "hidden",
                aspectRatio: "1920/1080",
              }}
            >
              <iframe
                src="https://share.synthesia.io/embeds/videos/ecc6e794-b1df-4c8e-85ca-f137b90c3f2f"
                loading="lazy"
                title="Synthesia video player - Frieden durch Mediation: Der Weg zur Einigung"
                allowFullScreen
                allow="encrypted-media; fullscreen; microphone; screen-wake-lock;"
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  top: 0,
                  left: 0,
                  border: "none",
                  padding: 0,
                  margin: 0,
                  overflow: "hidden",
                }}
              />
            </div>
          </div>
        </section>

        <section className="section section-muted border-y border-slate-200">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-12 max-w-3xl">
              <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
                Private Konflikte brauchen keinen jahrelangen Kampf.
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-700">
                Gerade bei Trennung, Erbe oder Nachbarschaft geht es nicht nur
                um Recht. Es geht um Stress, Geld, Familie und Alltag. Genau
                hier setzt Medipact an.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {problemPoints.map((point) => (
                <div
                  key={point}
                  className="app-surface rounded-[2rem] border border-slate-200 p-8"
                >
                  <p className="text-base leading-7 text-slate-700">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-base">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
                Dafür ist Medipact gedacht
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-700">
                Nicht für jeden Streit. Sondern für Fälle, in denen eine faire
                Einigung besser ist als ein langer Kampf.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {useCases.map((useCase) => (
                <article
                  key={useCase.title}
                  className="app-surface rounded-[2rem] border border-slate-200 p-8 transition hover:shadow-xl"
                >
                  <h3 className="text-xl font-bold text-slate-900">
                    {useCase.title}
                  </h3>
                  <p className="mt-4 text-base leading-7 text-slate-600">
                    {useCase.text}
                  </p>
                  <ul className="mt-6 space-y-3 text-sm text-slate-700">
                    {useCase.points.map((point) => (
                      <li key={point} className="flex gap-3">
                        <span className="text-emerald-700">✓</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-strong">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
                Der bessere erste Schritt vor der Eskalation
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
                Medipact ist kein Kampfmodus. Es ist ein strukturierter Weg, um
                wieder handlungsfähig zu werden.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {comparisonPlans.map((plan) => (
                <div
                  key={plan.title}
                  className={`rounded-[2rem] border p-8 ${plan.className}`}
                >
                  <h3 className="text-xl font-bold">{plan.title}</h3>
                  <div
                    className={`mt-2 text-sm font-bold uppercase tracking-wider ${
                      plan.featured ? "text-emerald-300" : "text-slate-400"
                    }`}
                  >
                    {plan.status}
                  </div>

                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-3 text-slate-300"
                      >
                        <span className="text-lg text-emerald-400">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="process" className="section section-base">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-16 text-center text-slate-900">
              <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
                In 6 Schritten zur möglichen Einigung
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-700">
                Klar genug für Sachfragen. Ruhig genug für emotionale Themen.
              </p>
            </div>

            <div className="grid gap-4">
              {workflowSteps.map((step) => (
                <div
                  key={step.num}
                  className="group flex items-center gap-8 rounded-[2rem] border border-slate-100 bg-slate-50 p-8 transition hover:border-emerald-200 hover:shadow-md"
                >
                  <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl font-black text-emerald-700 shadow-sm transition-colors group-hover:bg-emerald-700 group-hover:text-white sm:flex">
                    {step.num}
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {step.title}
                    </h3>
                    <p className="mt-2 leading-relaxed text-slate-600">
                      {step.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-muted border-y border-slate-200">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
                Was Medipact konkret leistet
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {modules.map((module) => (
                <article
                  key={module.title}
                  className="app-surface rounded-[2rem] border border-slate-200 p-10 transition hover:shadow-xl"
                >
                  <h3 className="text-xl font-bold text-slate-900">
                    {module.title}
                  </h3>
                  <p className="mt-4 text-base leading-7 text-slate-600">
                    {module.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-accent border-y border-emerald-100">
          <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
                Sicher genug für sensible Themen. Einfach genug für den ersten
                Schritt.
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate-700">
                Menschen in Konflikten brauchen keine komplizierte Plattform.
                Sie brauchen Orientierung, Schutz und einen Prozess, der nicht
                sofort weiter eskaliert.
              </p>
            </div>

            <div className="grid gap-4">
              {trustPoints.map((point) => (
                <div
                  key={point.title}
                  className="app-surface border border-slate-200 p-6"
                >
                  <h3 className="font-bold text-slate-900">{point.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{point.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="section section-base">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <h2 className="mb-16 text-center text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
              Häufige Fragen
            </h2>

            <div className="space-y-4">
              {faqs.map((faq) => (
                <div
                  key={faq.q}
                  className="app-surface border border-slate-200 p-8"
                >
                  <h3 className="text-lg font-bold text-slate-900">{faq.q}</h3>
                  <p className="mt-4 leading-relaxed text-slate-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="cta" className="section section-strong text-center">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl">
              Der Streit muss nicht größer werden.
            </h2>
            <p className="mt-8 text-xl text-slate-300">
              Starten Sie ruhig, vertraulich und unverbindlich. Der erste
              Schritt ist nicht die Einigung – sondern wieder Klarheit.
            </p>

            <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center rounded-2xl bg-emerald-700 px-10 py-5 text-base font-bold text-white transition hover:scale-[1.02] hover:bg-emerald-800"
              >
                Streitfall kostenlos starten
              </Link>
              <a
                href="#top"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-600 px-10 py-5 text-base font-semibold text-white transition hover:border-emerald-300 hover:bg-white/5"
              >
                Video ansehen
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
