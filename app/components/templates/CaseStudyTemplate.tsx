"use client";

import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";
import { ReactNode } from "react";

type Step = {
  label: string;
  title: string;
  description: string;
};

type Quote = {
  text: string;
  author: string;
};

type ComparisonBlock = {
  title: string;
  items: string[];
};

type CaseStudyTemplateProps = {
  eyebrow?: string;
  title: string;
  titleHighlight?: string;
  intro: string;
  situationTitle: string;
  situationIntro?: string;
  perspectiveA: {
    title: string;
    content: ReactNode;
  };
  perspectiveB: {
    title: string;
    content: ReactNode;
  };
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
          className={`mb-4 inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 backdrop-blur ${
            center ? "mx-auto" : ""
          }`}
        >
          {eyebrow}
        </div>
      )}

      <h2 className="heading-2">{title}</h2>

      {description && (
        <p className="mt-5 text-lg leading-8 text-slate-600">{description}</p>
      )}
    </div>
  );
}

export function CaseStudyTemplate({
  eyebrow = "Fallbeispiel",
  title,
  titleHighlight,
  intro,
  situationTitle,
  situationIntro,
  perspectives,
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
        <p className="mt-4 text-slate-700">
          Diese Case Study braucht genau zwei Einträge im Feld{" "}
          <code>perspectives</code>.
        </p>
      </main>
    );
  }

  return (
    <>
      <main className="app-shell pt-[73px]">
        <section className="relative overflow-hidden section section-base">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-[-8rem] top-[-6rem] h-72 w-72 rounded-full bg-emerald-100 blur-3xl opacity-60" />
            <div className="absolute right-[-6rem] top-20 h-80 w-80 rounded-full bg-cyan-100 blur-3xl opacity-50" />
          </div>

          <div className="container relative">
            <div className="max-w-3xl">
              <div className="eyebrow">{eyebrow}</div>

              <h1 className="heading-1 mt-8">
                {title}
                {titleHighlight && (
                  <span className="mt-2 block bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                    {titleHighlight}
                  </span>
                )}
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
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
              <Card className="rounded-[2rem] p-8">
                <h3 className="heading-3">{perspectiveA.title}</h3>
                <div className="mt-4 leading-8 text-slate-700">
                  {perspectiveA.content}
                </div>
              </Card>

              <Card className="rounded-[2rem] p-8">
                <h3 className="heading-3">{perspectiveB.title}</h3>
                <div className="mt-4 leading-8 text-slate-700">
                  {perspectiveB.content}
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className="section section-base">
          <div className="container">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="rounded-[2rem] p-8">
                <h3 className="heading-3">{factsTitle}</h3>
                <ul className="mt-5 space-y-3 text-slate-700">
                  {facts.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </Card>

              <Card variant="danger" className="rounded-[2rem] p-8">
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

            <div className="space-y-5">
              {steps.map((step) => (
                <Card key={step.label} className="rounded-[2rem] p-8">
                  <div className="flex gap-5">
                    <div className="min-w-fit rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 px-4 py-3 text-center font-bold text-white shadow-md">
                      {step.label}
                    </div>

                    <div>
                      <h3 className="heading-3">{step.title}</h3>
                      <p className="mt-3 leading-7 text-slate-700">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
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
                <Card variant="warning" className="rounded-[2rem] p-8">
                  <h3 className="mb-4 text-2xl font-black text-orange-700">
                    {positive.title}
                  </h3>
                  <ul className="space-y-4 text-slate-700">
                    {positive.items.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="font-bold text-orange-600">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card variant="danger" className="rounded-[2rem] p-8">
                  <h3 className="mb-4 text-2xl font-black text-red-700">
                    {negative.title}
                  </h3>
                  <ul className="space-y-4 text-slate-700">
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
                <Card key={quote.author} className="rounded-[2rem] p-8">
                  <p className="text-lg italic leading-8 text-slate-700">
                    “{quote.text}”
                  </p>
                  <p className="mt-5 font-bold text-slate-900">
                    — {quote.author}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="cta" className="section section-strong">
          <div className="container max-w-4xl text-center">
            <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              {ctaTitle}
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              {ctaText}
            </p>

            <div className="mt-10 flex justify-center">
              <Button href={ctaHref} size="lg">
                {ctaLabel}
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
