import type { Metadata } from "next";
import Link from "next/link";
import { ImagePinHero } from "@/app/components/ui/ImagePinHero";
import { StepImage } from "@/app/components/StepImage";
import { JsonLd } from "@/app/components/JsonLd";
import { DidYouKnowSection } from "@/app/components/ui/DidYouKnowSection";
import whiteboardPhoto from "../../fotos/whiteboard-erklaerung.jpg";
import step1Photo from "../../fotos/schritte/1.jpg";
import step2Photo from "../../fotos/schritte/2.jpg";
import step3Photo from "../../fotos/schritte/3.jpg";
import step4Photo from "../../fotos/schritte/4.jpg";
import step5Photo from "../../fotos/schritte/5.jpg";
import step6Photo from "../../fotos/schritte/6.jpg";

export const metadata: Metadata = {
  title: "So funktioniert medipact – Mediation in 6 Schritten",
  description:
    "Wie medipact Konflikte löst: Drei Gründe, warum die Methode funktioniert, und der strukturierte 6-Schritte-Prozess von der Streitfall-Eröffnung bis zur Einigung.",
  alternates: { canonical: "https://medipact.de/methode" },
};

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
  url: "https://medipact.de/methode",
  offers: {
    "@type": "Offer",
    priceCurrency: "EUR",
    price: "499",
    description: "KI-Mediation ab €499",
  },
};

export default function MethodePage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <JsonLd data={serviceSchema} />

      <ImagePinHero image={whiteboardPhoto} imageAlt="Mediatorin erklärt den strukturierten Mediationsprozess">
        <div className="container max-w-4xl">
          <p className="eyebrow mb-4 text-accent-300">So funktioniert es</p>

          <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
            Drei Gründe, warum es funktioniert.{" "}
            <span className="text-accent-300">Sechs Schritte zur Einigung.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-200">
            Medipact ersetzt das kreisende Gespräch durch einen klaren,
            geführten Prozess – nach dem Harvard-Prinzip, fair für alle
            Seiten.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/auth/register" className="btn btn-primary">
              Kostenlosen Account erstellen
            </Link>
            <Link
              href="/preise"
              className="rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              Preise ansehen
            </Link>
          </div>
        </div>
      </ImagePinHero>

      <section className="section section-base">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-16 max-w-2xl">
            <div className="eyebrow mb-4">Warum medipact anders ist</div>
            <h2 className="heading-2">Drei Gründe, warum es funktioniert.</h2>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
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
      </section>

      <section id="process" className="section section-muted border-y border-neutral-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-16 text-center text-neutral-900">
            <div className="eyebrow mb-4 justify-center">So funktioniert es</div>
            <h2 className="heading-2">In 6 Schritten zur möglichen Einigung</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-700">
              Klar genug für Sachfragen. Ruhig genug für emotionale Themen.
            </p>
          </div>

          <div className="grid gap-4">
            {workflowSteps.map((step) => (
              <div
                key={step.num}
                className="group flex items-center gap-6 rounded-[2rem] border border-neutral-100 bg-white p-6 transition hover:border-accent-200 hover:shadow-md sm:gap-8 sm:p-8"
              >
                <StepImage src={step.image} alt={step.title} num={step.num} />

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-50 text-base font-black text-accent-700 shadow-sm sm:hidden">
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

      <DidYouKnowSection />

      <section className="section section-strong text-center">
        <div className="container max-w-3xl">
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl leading-tight">
            Bereit für den ersten Schritt?
          </h2>
          <p className="mt-5 text-lg leading-8 text-neutral-300">
            Starten Sie ruhig, vertraulich und unverbindlich.
          </p>
          <Link href="/auth/register" className="btn btn-primary mt-8">
            Kostenlosen Account erstellen
          </Link>
        </div>
      </section>
    </>
  );
}
