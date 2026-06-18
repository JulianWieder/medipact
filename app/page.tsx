import Link from "next/link";
import { FadeIn } from "@/app/components/ui/motion";
import { JsonLd } from "@/app/components/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "medipact – Mediation online: Konflikte fair, vertraulich und ohne Gericht lösen",
  description:
    "Mediation online – Konflikte fair, vertraulich und ohne Gericht lösen. Medipact hilft bei Trennung, Nachbarschaftsstreit und Erbschaft nach dem Harvard-Prinzip.",
  alternates: {
    canonical: "https://medipact.de",
  },
};

const stats = [
  { value: "6 Schritte", label: "strukturierter Prozess" },
  { value: "< 4 Wochen", label: "typische Dauer" },
  { value: "ab €499", label: "statt tausenden an Anwaltskosten" },
  { value: "100 %", label: "vertraulich & DSGVO-konform" },
];

const problemPoints = [
  "Gespräche eskalieren, obwohl eigentlich eine Lösung gebraucht wird.",
  "Anwälte und Gerichte sind teuer, langsam und emotional belastend.",
  "Familien, Nachbarn oder Ex-Partner müssen oft trotzdem weiter miteinander umgehen.",
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

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a,
    },
  })),
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "KI-Mediation",
  provider: {
    "@type": "Organization",
    name: "medipact",
    url: "https://medipact.de",
  },
  serviceType: "Mediation",
  description:
    "KI-gestützte Mediation für private Konflikte bei Trennung, Scheidung, Nachbarschaftsstreit und Erbschaft. Nach dem Harvard-Prinzip.",
  areaServed: {
    "@type": "Country",
    name: "Germany",
  },
  availableLanguage: "German",
  url: "https://medipact.de",
  offers: {
    "@type": "Offer",
    priceCurrency: "EUR",
    price: "499",
    description: "KI-Mediation ab €499",
  },
};

export default function MedipactLanding() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <JsonLd data={serviceSchema} />
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
                  Mediation online –
                  <span className="block bg-gradient-to-r from-slate-800 via-teal-600 to-teal-400 bg-clip-text text-transparent pb-2 leading-[1.15]">
                    Konflikte fair, vertraulich und ohne Gericht lösen.
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
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm"
                  >
                    <span className={`h-2 w-2 rounded-full ${color}`} />
                    {label}
                  </div>
                ))}
              </div>

              <div className="mt-10 grid grid-cols-2 gap-4 border-t border-slate-100 pt-10 sm:grid-cols-4">
                {stats.map((s) => (
                  <div key={s.label}>
                    <div className="text-xl font-black text-teal-700">{s.value}</div>
                    <div className="mt-0.5 text-xs leading-snug text-slate-500">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="overflow-hidden rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-teal-900/5 ring-1 ring-slate-900/5"
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

        <section className="border-y border-slate-100 bg-slate-50 py-5">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm text-slate-500">
              <span className="font-semibold text-slate-700">Bekannt aus</span>
              <span className="font-semibold tracking-tight text-slate-400">Harvard-Methode</span>
              <span className="text-slate-300">·</span>
              <span className="font-semibold tracking-tight text-slate-400">DSGVO-konform</span>
              <span className="text-slate-300">·</span>
              <span className="font-semibold tracking-tight text-slate-400">Made in Germany</span>
              <span className="text-slate-300">·</span>
              <span className="font-semibold tracking-tight text-slate-400">SSL-verschlüsselt</span>
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
          <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
            <p className="text-base text-slate-600">
              Trennung, Nachbarschaft oder Erbe – sehen Sie sich an,{" "}
              <Link href="/cases" className="font-semibold text-teal-700 hover:underline">
                wie konkrete Fälle mit Medipact gelöst wurden →
              </Link>
            </p>
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

        <section className="section section-accent border-y border-teal-100 text-center">
          <div className="mx-auto max-w-2xl px-6 lg:px-8">
            <p className="text-base text-slate-700">
              Vertraulich, DSGVO-konform und mit menschlicher Mediation als
              Rückfalloption –{" "}
              <Link href="/about" className="font-semibold text-teal-700 hover:underline">
                mehr über medipact erfahren →
              </Link>
            </p>
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
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-teal-300 mb-8">
              Jetzt starten
            </div>
            <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl leading-[1.1]">
              Der Streit muss nicht größer werden.
            </h2>
            <p className="mt-6 text-lg text-slate-300 leading-8">
              Starten Sie ruhig, vertraulich und unverbindlich. Der erste
              Schritt ist nicht die Einigung – sondern wieder Klarheit.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-600 px-10 py-4 text-base font-bold text-white shadow-lg shadow-teal-900/40 transition hover:scale-[1.02] hover:bg-teal-500"
              >
                Streitfall kostenlos starten
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>

            <p className="mt-6 text-xs text-slate-500">
              Keine Kreditkarte erforderlich · Kostenloser Einstieg · Jederzeit kündbar
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
