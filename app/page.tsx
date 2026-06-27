import Link from "next/link";
import Image from "next/image";
import { StepImage } from "@/app/components/StepImage";
import { JsonLd } from "@/app/components/JsonLd";
import { HeroScrollPin } from "@/app/components/HeroScrollPin";
import { ThemenTabs } from "@/app/components/ThemenTabs";
import type { Metadata } from "next";
import heroPhoto from "../fotos/hero-mediation.png";
import whiteboardPhoto from "../fotos/whiteboard-erklaerung.jpg";
import step1Photo from "../fotos/schritte/1.jpg";
import step2Photo from "../fotos/schritte/2.jpg";
import step3Photo from "../fotos/schritte/3.jpg";
import step4Photo from "../fotos/schritte/4.jpg";
import step5Photo from "../fotos/schritte/5.jpg";
import step6Photo from "../fotos/schritte/6.jpg";
import kostenPhoto from "../fotos/kosten.jpg";

export const metadata: Metadata = {
  title:
    "medipact – Mediation online: Konflikte fair, vertraulich und ohne Gericht lösen",
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
    image: step1Photo,
  },
  {
    num: "02",
    title: "Zweite Seite einladen",
    text: "Die andere Partei wird sachlich eingebunden. Kein öffentlicher Druck, keine bloßstellende Konfrontation.",
    image: step2Photo,
  },
  {
    num: "03",
    title: "Themen sortieren",
    text: "Medipact trennt Emotionen, Forderungen und eigentliche Interessen. Dadurch wird der Konflikt greifbarer.",
    image: step3Photo,
  },
  {
    num: "04",
    title: "Geführt austauschen",
    text: "Beide Seiten antworten strukturiert. Die KI hilft, Eskalation zu vermeiden und beim Wesentlichen zu bleiben.",
    image: step4Photo,
  },
  {
    num: "05",
    title: "Lösungen entwickeln",
    text: "Aus den Interessen entstehen konkrete Vorschläge, die beide Seiten prüfen, anpassen oder ablehnen können.",
    image: step5Photo,
  },
  {
    num: "06",
    title: "Einigung dokumentieren",
    text: "Das Ergebnis wird klar festgehalten. Bei rechtlich wichtigen Fragen sollte es juristisch geprüft werden.",
    image: step6Photo,
  },
];

const differentiators = [
  {
    num: "01",
    eyebrow: "Struktur statt Eskalation",
    title: "Geführt, nicht allein gelassen.",
    text: "Die meisten Streits scheitern nicht am Willen, sondern am Weg. Medipact gibt beiden Seiten eine klare Struktur – statt endloser, kreisender Gespräche.",
  },
  {
    num: "02",
    eyebrow: "Bewährte Methode",
    title: "Kein Bauchgefühl. Das Harvard-Prinzip.",
    text: "Interessen statt Positionen, Optionen statt Schuldzuweisungen. Eine Methode, die seit Jahrzehnten in der Konfliktlösung funktioniert – jetzt digital zugänglich.",
  },
  {
    num: "03",
    eyebrow: "Fair für alle Seiten",
    title: "Eine Lösung, mit der beide weiterleben können.",
    text: "Bei Trennung, Erbe oder Nachbarschaft sehen sich Menschen oft wieder. Medipact zielt nicht auf Sieg, sondern auf eine Einigung, die trägt.",
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
      <main className="app-shell pt-0 sm:pt-[73px]">
        <HeroScrollPin heroPhoto={heroPhoto} />

        <section className="border-b border-neutral-100 bg-white py-10">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-xl font-black text-accent-700">
                    {s.value}
                  </div>
                  <div className="mt-0.5 text-xs leading-snug text-neutral-500">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-neutral-100 bg-neutral-50 py-5">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-neutral-500 sm:gap-x-10">
              <span className="font-semibold text-neutral-700">Bekannt aus</span>
              <span className="font-semibold tracking-tight text-neutral-400">
                Harvard-Methode
              </span>
              <span className="text-neutral-300">·</span>
              <span className="font-semibold tracking-tight text-neutral-400">
                DSGVO-konform
              </span>
              <span className="text-neutral-300">·</span>
              <span className="font-semibold tracking-tight text-neutral-400">
                Made in Germany
              </span>
              <span className="text-neutral-300">·</span>
              <span className="font-semibold tracking-tight text-neutral-400">
                SSL-verschlüsselt
              </span>
            </div>
          </div>
        </section>

        <section className="section section-muted border-y border-neutral-200">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-12 max-w-3xl">
              <div className="eyebrow mb-4">Das Problem</div>
              <h2 className="heading-2">
                Private Konflikte brauchen keinen jahrelangen Kampf.
              </h2>
              <p className="mt-5 text-lg leading-8 text-neutral-700">
                Gerade bei Trennung, Erbe oder Nachbarschaft geht es nicht nur
                um Recht. Es geht um Stress, Geld, Familie und Alltag. Genau
                hier setzt Medipact an.
              </p>
            </div>

            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
              <div
                className="relative mx-auto w-full max-w-xl overflow-hidden rounded-[2rem] border border-neutral-200 shadow-xl shadow-neutral-900/5"
                style={{ aspectRatio: "4/3" }}
              >
                <Image
                  src={kostenPhoto}
                  alt="Kosten und Belastung durch einen langwierigen Konflikt"
                  fill
                  sizes="(max-width: 1024px) 100vw, 576px"
                  style={{ objectFit: "cover" }}
                />
              </div>

              <div className="grid gap-4">
                {problemPoints.map((point, i) => (
                  <div key={point} className="app-surface p-6 sm:p-8">
                    <div className="mb-4 text-3xl font-black text-neutral-100">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <p className="text-base leading-7 text-neutral-700">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section section-base">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-16 max-w-2xl">
              <div className="eyebrow mb-4">Warum medipact anders ist</div>
              <h2 className="heading-2">Drei Gründe, warum es funktioniert.</h2>
            </div>

            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
              <div
                className="relative mx-auto w-full max-w-xl overflow-hidden rounded-[2rem] border border-neutral-200 shadow-xl shadow-neutral-900/5"
                style={{ aspectRatio: "4/3" }}
              >
                <Image
                  src={whiteboardPhoto}
                  alt="Mediatorin erklärt den strukturierten Mediationsprozess"
                  fill
                  sizes="(max-width: 1024px) 100vw, 576px"
                  style={{ objectFit: "cover" }}
                />
              </div>

              <div className="grid gap-10 sm:grid-cols-1">
                {differentiators.map((d) => (
                  <div key={d.num}>
                    <div className="text-sm font-black tracking-widest text-neutral-300">
                      {d.num}
                    </div>
                    <div className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-accent-700">
                      {d.eyebrow}
                    </div>
                    <h3 className="mt-3 text-xl font-bold text-neutral-900">
                      {d.title}
                    </h3>
                    <p className="mt-3 leading-relaxed text-neutral-600">
                      {d.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <ThemenTabs />

        <section className="section section-base">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
            <p className="text-base text-neutral-600">
              Trennung, Nachbarschaft oder Erbe – sehen Sie sich an,{" "}
              <Link
                href="/cases"
                className="font-semibold text-accent-700 hover:underline"
              >
                wie konkrete Fälle mit Medipact gelöst wurden →
              </Link>
            </p>
          </div>
        </section>

        <section id="process" className="section section-base">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-16 text-center text-neutral-900">
              <div className="eyebrow mb-4 justify-center">
                So funktioniert es
              </div>
              <h2 className="heading-2">
                In 6 Schritten zur möglichen Einigung
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-700">
                Klar genug für Sachfragen. Ruhig genug für emotionale Themen.
              </p>
            </div>

            <div className="grid gap-4">
              {workflowSteps.map((step) => (
                <div
                  key={step.num}
                  className="group flex items-center gap-6 rounded-[2rem] border border-neutral-100 bg-neutral-50 p-6 transition hover:border-accent-200 hover:shadow-md sm:gap-8 sm:p-8"
                >
                  <StepImage src={step.image} alt={step.title} num={step.num} />

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-base font-black text-accent-700 shadow-sm sm:hidden">
                    {step.num}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-neutral-900">
                      {step.title}
                    </h3>
                    <p className="mt-2 leading-relaxed text-neutral-600">
                      {step.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-accent border-y border-accent-100 text-center">
          <div className="mx-auto max-w-2xl px-6 lg:px-8">
            <p className="text-base text-neutral-700">
              Vertraulich, DSGVO-konform und mit menschlicher Mediation als
              Rückfalloption –{" "}
              <Link
                href="/about"
                className="font-semibold text-accent-700 hover:underline"
              >
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
                <div key={faq.q} className="app-surface p-6 sm:p-8">
                  <h3 className="font-semibold text-neutral-900">{faq.q}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="cta" className="section section-strong text-center">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent-500/30 bg-accent-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent-300 mb-8">
              Jetzt starten
            </div>
            <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl leading-[1.1]">
              Der Streit muss nicht größer werden.
            </h2>
            <p className="mt-6 text-lg text-neutral-300 leading-8">
              Starten Sie ruhig, vertraulich und unverbindlich. Der erste
              Schritt ist nicht die Einigung – sondern wieder Klarheit.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent-600 px-10 py-4 text-base font-bold text-white shadow-lg shadow-accent-900/40 transition hover:scale-[1.02] hover:bg-accent-500"
              >
                Kostenlosen Account erstellen
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </Link>
            </div>

            <p className="mt-6 text-xs text-neutral-500">
              Keine Kreditkarte erforderlich · Kostenloser Einstieg · Jederzeit
              kündbar
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
