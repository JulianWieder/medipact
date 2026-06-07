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
      "bg-slate-800/70 border-teal-600/40 shadow-2xl shadow-teal-950/50",
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
                  <span className="block bg-gradient-to-r from-slate-800 via-teal-600 to-teal-400 bg-clip-text text-transparent pb-2 leading-[1.15]">
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
                  className="inline-flex items-center justify-center rounded-2xl bg-teal-700 px-8 py-4 text-sm font-bold text-white transition hover:scale-[1.02] hover:bg-teal-800"
                >
                  Streitfall kostenlos starten
                </Link>
                <a
                  href="#process"
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-8 py-4 text-sm font-semibold text-slate-900 transition hover:border-teal-300 hover:bg-teal-50"
                >
                  So funktioniert es
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-600">
                {[
                  { label: "Vertraulich", color: "bg-teal-700" },
                  { label: "Bezahlbar", color: "bg-teal-500" },
                  { label: "Lösungsorientiert", color: "bg-teal-300" },
                ].map(({ label, color }) => (
                  <div
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
                  >
                    <span className={`h-2 w-2 rounded-full ${color}`} />
                    {label}
                  </div>
                ))}
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
              <div className="eyebrow mb-4">Das Problem</div>
              <h2 className="heading-2">
                Private Konflikte brauchen keinen jahrelangen Kampf.
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-700">
                Gerade bei Trennung, Erbe oder Nachbarschaft geht es nicht nur
                um Recht. Es geht um Stress, Geld, Familie und Alltag. Genau
                hier setzt Medipact an.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {problemPoints.map((point, i) => (
                <div
                  key={point}
                  className="app-surface p-8"
                >
                  <div className="mb-4 text-3xl font-black text-slate-100">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <p className="text-base leading-7 text-slate-700">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-base">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-16 text-center">
              <div className="eyebrow mb-4 justify-center">Anwendungsfälle</div>
              <h2 className="heading-2">
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
                  className="app-surface p-8"
                >
                  <h3 className="heading-3">{useCase.title}</h3>
                  <p className="mt-4 text-base leading-7 text-slate-600">
                    {useCase.text}
                  </p>
                  <ul className="mt-6 space-y-3 border-t border-slate-100 pt-6 text-sm text-slate-700">
                    {useCase.points.map((point) => (
                      <li key={point} className="flex items-center gap-3">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-700/10 text-teal-700 text-xs font-bold">✓</span>
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
              <div className="eyebrow mb-4 justify-center text-teal-400">Vergleich</div>
              <h2 className="heading-2 text-white">
                Der bessere erste Schritt vor der Eskalation
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
                Medipact ist kein Kampfmodus. Es ist ein strukturierter Weg, um
                wieder handlungsfähig zu werden.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {comparisonPlans.map((plan) => (
                <div
                  key={plan.title}
                  className={`rounded-[2rem] border p-8 ${plan.className}`}
                >
                  {plan.featured && (
                    <div className="mb-4 inline-block rounded-full bg-teal-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-teal-300">
                      Empfohlen
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-white">{plan.title}</h3>
                  <div
                    className={`mt-1 text-sm font-medium ${
                      plan.featured ? "text-teal-300" : "text-slate-500"
                    }`}
                  >
                    {plan.status}
                  </div>

                  <div className="my-6 h-px bg-white/10" />

                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm text-slate-300"
                      >
                        <span className={`mt-0.5 h-4 w-4 shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold ${plan.featured ? "bg-teal-500 text-white" : "bg-slate-700 text-slate-400"}`}>✓</span>
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
              <div className="eyebrow mb-4 justify-center">So funktioniert es</div>
              <h2 className="heading-2">
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
                  className="group flex items-center gap-8 rounded-[2rem] border border-slate-100 bg-slate-50 p-8 transition hover:border-teal-200 hover:shadow-md"
                >
                  <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl font-black text-teal-700 shadow-sm transition-colors group-hover:bg-teal-700 group-hover:text-white sm:flex">
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
              <div className="eyebrow mb-4 justify-center">Funktionsweise</div>
              <h2 className="heading-2">
                Was Medipact konkret leistet
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {modules.map((module, i) => (
                <article
                  key={module.title}
                  className="app-surface p-10"
                >
                  <div className="mb-4 text-xs font-semibold uppercase tracking-widest text-teal-600">
                    Schritt {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="heading-3">{module.title}</h3>
                  <p className="mt-4 text-base leading-7 text-slate-600">
                    {module.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-accent border-y border-teal-100">
          <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <div className="eyebrow mb-4">Vertrauen & Sicherheit</div>
              <h2 className="heading-2">
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
                  className="app-surface p-6"
                >
                  <div className="flex items-start gap-4">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-700/10 text-teal-700 text-sm font-bold">✓</span>
                    <div>
                      <h3 className="font-bold text-slate-900">{point.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">{point.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="section section-base">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <div className="mb-16 text-center">
              <div className="eyebrow mb-4 justify-center">FAQ</div>
              <h2 className="heading-2">Häufige Fragen</h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq) => (
                <div
                  key={faq.q}
                  className="app-surface p-8"
                >
                  <h3 className="font-semibold text-slate-900">{faq.q}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{faq.a}</p>
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
                className="inline-flex items-center justify-center rounded-2xl bg-teal-700 px-10 py-5 text-base font-bold text-white transition hover:scale-[1.02] hover:bg-teal-800"
              >
                Streitfall kostenlos starten
              </Link>
              <a
                href="#top"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-600 px-10 py-5 text-base font-semibold text-white transition hover:border-teal-300 hover:bg-white/5"
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
