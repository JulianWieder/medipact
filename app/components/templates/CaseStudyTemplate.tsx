"use client";

import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";
import { Breadcrumbs, type BreadcrumbItem } from "@/app/components/ui/Breadcrumbs";
import { JsonLd } from "@/app/components/JsonLd";
import Link from "next/link";
import { ReactNode } from "react";

const BASE_URL = "https://medipact.de";

type Step = {
  label: string;
  title: string;
  description: string;
};

type Quote = {
  text: string;
  author: string;
};

type StoryChapter = {
  /** Kleine Kapitel-Zeile über dem Titel, z.B. "Kapitel 1 · Der Anruf". */
  kicker?: string;
  title: string;
  /** Erzählende Absätze — Szenen, Dialoge, innere Perspektive. */
  paragraphs: string[];
  /** Optionales Pull-Quote, das groß zwischen den Absätzen steht. */
  quote?: Quote;
};

type ComparisonBlock = {
  title: string;
  items: string[];
};

type FaqItem = {
  /** Frage exakt so formulieren, wie Nutzer sie googeln
   * (z.B. "Wer trägt die Kosten bei einer Mediation?"). */
  question: string;
  /** Erster Satz = direkte Antwort in max. ~30 Wörtern — Google zieht diesen
   * Satz für "Nutzer fragen auch"-Boxen und AI Overviews heran. */
  answer: string;
};

type CaseStudyTemplateProps = {
  /** Slug unter /cases/ — wird für die Article-JSON-LD-URL gebraucht. */
  slug?: string;
  eyebrow?: string;
  title: string;
  titleHighlight?: string;
  intro: string;
  situationTitle: string;
  situationIntro?: string;
  perspectives: {
    title: string;
    content: ReactNode;
  }[];
  /** Überschrift der Erzähl-Sektion, Default "Die Geschichte". */
  storyTitle?: string;
  storyIntro?: string;
  /** Erzählkapitel — machen aus dem Fallbeispiel eine echte Geschichte. */
  chapters?: StoryChapter[];
  factsTitle?: string;
  facts: string[];
  riskTitle?: string;
  risks: string[];
  processTitle?: string;
  processIntro?: string;
  steps: Step[];
  resultTitle?: string;
  resultIntro?: string;
  positive: ComparisonBlock;
  negative: ComparisonBlock;
  quotesTitle?: string;
  quotes: Quote[];
  /** Breadcrumb trail back to /cases and the relevant /konflikte/* category
   * — keeps this page from being a dead end reachable only via deep links. */
  breadcrumbs?: BreadcrumbItem[];
  /** Links to 2-3 other case studies, shown just above the CTA. */
  relatedCases?: BreadcrumbItem[];
  /** Atomic FAQs: kurze Suchintentions-Fragen mit Direktantwort im ersten
   * Satz. Rendert eine sichtbare FAQ-Sektion + FAQPage-JSON-LD. */
  faq?: FaqItem[];
  ctaTitle: string;
  ctaText: string;
  ctaHref: string;
  ctaLabel: string;
};

function SectionHeader({
  eyebrow,
  title,
  description,
  center = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mb-14 text-center" : "mb-14 max-w-3xl"}>
      {eyebrow && (
        <div
          className={`mb-4 inline-flex items-center rounded-full border border-neutral-200 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500 backdrop-blur ${
            center ? "mx-auto" : ""
          }`}
        >
          {eyebrow}
        </div>
      )}

      <h2 className="heading-2">{title}</h2>

      {description && (
        <p className="mt-5 text-lg leading-8 text-neutral-600">{description}</p>
      )}
    </div>
  );
}

export function CaseStudyTemplate({
  slug,
  eyebrow = "Fallbeispiel",
  title,
  titleHighlight,
  intro,
  situationTitle,
  situationIntro,
  perspectives,
  storyTitle = "Die Geschichte",
  storyIntro,
  chapters,
  factsTitle = "Eckdaten",
  facts = [],
  riskTitle = "Ohne Mediation",
  risks = [],
  processTitle = "Der Mediations-Prozess",
  processIntro,
  steps = [],
  resultTitle = "Das Ergebnis",
  resultIntro,
  positive,
  negative,
  quotesTitle = "Was die Beteiligten sagen",
  quotes = [],
  breadcrumbs,
  relatedCases,
  faq,
  ctaTitle,
  ctaText,
  ctaHref,
  ctaLabel,
}: CaseStudyTemplateProps) {
  const [perspectiveA, perspectiveB] = perspectives ?? [];

  if (!perspectiveA || !perspectiveB) {
    return (
      <main className="app-shell p-10">
        <h1 className="text-2xl font-bold text-red-700">
          Case Study Daten unvollständig
        </h1>
        <p className="mt-4 text-neutral-700">
          Diese Case Study braucht genau zwei Einträge im Feld{" "}
          <code>perspectives</code>.
        </p>
      </main>
    );
  }

  // Article statt TechArticle: TechArticle ist für technische Doku
  // (Programmierung/How-tos) gedacht — für Mediations-Fallstudien ist
  // Article der semantisch korrekte Typ.
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: titleHighlight ? `${title}: ${titleHighlight}` : title,
    description: intro,
    inLanguage: "de",
    ...(slug && {
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${BASE_URL}/cases/${slug}`,
      },
    }),
    author: {
      "@type": "Organization",
      name: "medipact",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "medipact",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo.png`,
        width: 512,
        height: 512,
      },
    },
    about: {
      "@type": "Thing",
      name: "Mediation",
    },
  };

  const faqSchema =
    faq && faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;

  return (
    <>
      <JsonLd data={articleSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}
      <main className="app-shell pt-[73px]">
        <section className="relative overflow-hidden section section-base">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-[-8rem] top-[-6rem] h-72 w-72 rounded-full bg-accent-100 blur-3xl opacity-60" />
            <div className="absolute right-[-6rem] top-20 h-80 w-80 rounded-full bg-cyan-100 blur-3xl opacity-50" />
          </div>

          <div className="container relative">
            <div className="max-w-3xl">
              {breadcrumbs && <Breadcrumbs items={breadcrumbs} variant="light" />}
              <div className="eyebrow">{eyebrow}</div>

              <h1 className="heading-1 mt-8">
                {title}
                {titleHighlight && (
                  <span className="mt-2 block bg-gradient-to-r from-neutral-800 via-accent-600 to-accent-400 bg-clip-text text-transparent pb-2 leading-[1.15]">
                    {titleHighlight}
                  </span>
                )}
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-700">
                {intro}
              </p>
            </div>
          </div>
        </section>

        <section className="section section-muted">
          <div className="container">
            <SectionHeader
              eyebrow="Die Ausgangssituation"
              title={situationTitle}
              description={situationIntro}
            />

            <div className="grid gap-6 lg:grid-cols-2">
              {[perspectiveA, perspectiveB].map((perspective) => (
                <Card key={perspective.title}>
                  <span
                    aria-hidden
                    className="block font-display text-5xl leading-none text-accent-300"
                  >
                    “
                  </span>
                  <div className="mt-2 italic leading-8 text-neutral-700">
                    {perspective.content}
                  </div>
                  <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-neutral-500">
                    {perspective.title}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {chapters && chapters.length > 0 && (
          <section className="section section-base">
            <div className="container max-w-3xl">
              <SectionHeader
                eyebrow="So hat es sich zugetragen"
                title={storyTitle}
                description={storyIntro}
              />

              <div className="space-y-16">
                {chapters.map((chapter, index) => (
                  <article key={chapter.title}>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-600">
                      {chapter.kicker ?? `Kapitel ${index + 1}`}
                    </p>
                    <h3 className="heading-3 mt-3">{chapter.title}</h3>

                    <div className="mt-5 space-y-5">
                      {chapter.paragraphs.map((paragraph, pIndex) => (
                        <p
                          key={pIndex}
                          className="text-[1.0625rem] leading-8 text-neutral-700"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    {chapter.quote && (
                      <blockquote className="mt-8 border-l-4 border-accent-400 pl-6">
                        <p className="font-display text-xl leading-relaxed text-neutral-800 sm:text-2xl">
                          “{chapter.quote.text}”
                        </p>
                        <cite className="mt-3 block text-sm font-semibold not-italic text-neutral-500">
                          — {chapter.quote.author}
                        </cite>
                      </blockquote>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="section section-base">
          <div className="container">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <h3 className="heading-3">{factsTitle}</h3>
                <ul className="mt-5 space-y-3 text-neutral-700">
                  {facts.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </Card>

              <Card variant="danger">
                <h3 className="heading-3 text-red-900">{riskTitle}</h3>
                <ul className="mt-5 space-y-3 text-red-700">
                  {risks.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </section>

        <section className="section section-base">
          <div className="container max-w-5xl">
            <SectionHeader
              eyebrow="Der Ablauf"
              title={processTitle}
              description={processIntro}
              center
            />

            <ol className="relative mx-auto max-w-3xl space-y-12 border-l-2 border-accent-200 pl-8 sm:pl-10">
              {steps.map((step) => (
                <li key={step.label} className="relative">
                  <span
                    aria-hidden
                    className="absolute -left-[2.65rem] top-1 h-4 w-4 rounded-full border-4 border-white bg-accent-500 shadow ring-1 ring-accent-200 sm:-left-[3.15rem]"
                  />
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-600">
                    {step.label}
                  </p>
                  <h3 className="heading-3 mt-2">{step.title}</h3>
                  <p className="mt-3 leading-7 text-neutral-700">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {positive && negative && (
          <section className="section section-accent">
            <div className="container">
              <SectionHeader
                eyebrow="Das Ergebnis"
                title={resultTitle}
                description={resultIntro}
                center
              />

              <div className="grid gap-8 md:grid-cols-2">
                <Card variant="warning">
                  <h3 className="mb-4 text-2xl font-black text-orange-700">
                    {positive.title}
                  </h3>
                  <ul className="space-y-4 text-neutral-700">
                    {positive.items.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="font-bold text-orange-600">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card variant="danger">
                  <h3 className="mb-4 text-2xl font-black text-red-700">
                    {negative.title}
                  </h3>
                  <ul className="space-y-4 text-neutral-700">
                    {negative.items.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="font-bold text-red-600">✗</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </div>
          </section>
        )}

        <section className="section section-base">
          <div className="container max-w-5xl">
            <SectionHeader title={quotesTitle} center />

            <div className="space-y-6">
              {quotes.map((quote) => (
                <Card key={quote.author}>
                  <p className="text-lg italic leading-8 text-neutral-700">
                    “{quote.text}”
                  </p>
                  <p className="mt-5 font-bold text-neutral-900">
                    — {quote.author}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {faq && faq.length > 0 && (
          <section className="section section-muted">
            <div className="container max-w-4xl">
              <SectionHeader
                eyebrow="Häufige Fragen"
                title="Kurz beantwortet"
                center
              />

              <div className="space-y-5">
                {faq.map((item) => (
                  <Card key={item.question}>
                    <h3 className="heading-3">{item.question}</h3>
                    <p className="mt-3 leading-7 text-neutral-700">
                      {item.answer}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {relatedCases && relatedCases.length > 0 && (
          <section className="section section-base border-t border-neutral-100">
            <div className="container max-w-5xl">
              <SectionHeader title="Weitere Fallbeispiele" center />
              <div className="flex flex-wrap justify-center gap-4">
                {relatedCases.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href ?? "#"}
                    className="rounded-full border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-700 transition hover:border-accent-300 hover:text-accent-700"
                  >
                    {item.label} →
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section id="cta" className="section section-strong">
          <div className="container max-w-4xl text-center">
            <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              {ctaTitle}
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-neutral-300">
              {ctaText}
            </p>

            {/* Ein Fallbeispiel zu Ende gelesen zu haben, ist der Moment mit
                der höchsten Kaufabsicht auf der ganzen Seite — vorher führte
                von hier trotzdem kein direkter Weg in die Anmeldung. */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button href="/auth/register" size="lg">
                Mediation starten
              </Button>

              <Link
                href={ctaHref}
                className="rounded-full border border-white/25 px-8 py-4 text-base font-semibold text-white transition hover:border-accent-300 hover:text-accent-300"
              >
                {ctaLabel}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
