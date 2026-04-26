"use client";

import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";
import { ReactNode } from "react";

type Feature = {
  title: string;
  text: string;
};

type Step = {
  title: string;
  text: string;
};

type Faq = {
  question: string;
  answer: string;
};

type MarketingPageTemplateProps = {
  eyebrow?: string;
  title: string;
  titleHighlight?: string;
  intro: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
  heroAside?: ReactNode;
  featuresTitle: string;
  featuresIntro?: string;
  features: Feature[];
  processTitle?: string;
  process: Step[];
  trustTitle?: string;
  trustPoints?: Feature[];
  faqTitle?: string;
  faqs?: Faq[];
  finalCtaTitle: string;
  finalCtaText: string;
  finalCta: {
    label: string;
    href: string;
  };
};

function SectionLead({
  eyebrow,
  title,
  text,
  center = false,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mb-14 text-center" : "mb-14 max-w-3xl"}>
      {eyebrow && <div className="eyebrow mb-4">{eyebrow}</div>}
      <h2 className="heading-2">{title}</h2>
      {text && <p className="mt-5 text-lg leading-8 text-slate-600">{text}</p>}
    </div>
  );
}

export function MarketingPageTemplate({
  eyebrow = "medipact",
  title,
  titleHighlight,
  intro,
  primaryCta,
  secondaryCta,
  heroAside,
  featuresTitle,
  featuresIntro,
  features,
  processTitle = "So funktioniert es",
  process,
  trustTitle = "Warum medipact",
  trustPoints = [],
  faqTitle = "Häufige Fragen",
  faqs = [],
  finalCtaTitle,
  finalCtaText,
  finalCta,
}: MarketingPageTemplateProps) {
  return (
    <>
      <main className="app-shell pt-[73px]">
        <section className="relative overflow-hidden section section-base">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-[-8rem] top-[-6rem] h-72 w-72 rounded-full bg-emerald-100 blur-3xl opacity-60" />
            <div className="absolute right-[-6rem] top-20 h-80 w-80 rounded-full bg-cyan-100 blur-3xl opacity-50" />
          </div>

          <div className="container relative grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
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

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Button href={primaryCta.href} size="lg">
                  {primaryCta.label}
                </Button>

                {secondaryCta && (
                  <Button
                    href={secondaryCta.href}
                    variant="secondary"
                    size="lg"
                  >
                    {secondaryCta.label}
                  </Button>
                )}
              </div>
            </div>

            <div>
              {heroAside ?? (
                <Card className="rounded-[2rem] p-8">
                  <h3 className="heading-3">Produktvorschau</h3>
                  <p className="mt-4 leading-7 text-slate-700">
                    Hier kann ein Video, ein Mockup oder eine Produktvorschau
                    stehen.
                  </p>
                </Card>
              )}
            </div>
          </div>
        </section>

        <section className="section section-muted">
          <div className="container">
            <SectionLead
              eyebrow="Leistungen"
              title={featuresTitle}
              text={featuresIntro}
            />

            <div className="grid gap-6 md:grid-cols-2">
              {features.map((feature) => (
                <Card key={feature.title} className="rounded-[2rem] p-8">
                  <h3 className="heading-3">{feature.title}</h3>
                  <p className="mt-4 leading-7 text-slate-700">
                    {feature.text}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-base">
          <div className="container max-w-5xl">
            <SectionLead eyebrow="Ablauf" title={processTitle} center />

            <div className="space-y-5">
              {process.map((step, index) => (
                <Card key={step.title} className="rounded-[2rem] p-8">
                  <div className="flex gap-5">
                    <div className="min-w-fit rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 px-4 py-3 text-center font-bold text-white shadow-md">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div>
                      <h3 className="heading-3">{step.title}</h3>
                      <p className="mt-3 leading-7 text-slate-700">
                        {step.text}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {trustPoints.length > 0 && (
          <section className="section section-accent">
            <div className="container">
              <SectionLead eyebrow="Vertrauen" title={trustTitle} center />

              <div className="grid gap-6 md:grid-cols-3">
                {trustPoints.map((point) => (
                  <Card key={point.title} className="rounded-[2rem] p-8">
                    <h3 className="heading-3">{point.title}</h3>
                    <p className="mt-4 leading-7 text-slate-700">
                      {point.text}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {faqs.length > 0 && (
          <section className="section section-base">
            <div className="container max-w-4xl">
              <SectionLead title={faqTitle} center />

              <div className="space-y-4">
                {faqs.map((faq) => (
                  <Card key={faq.question} className="rounded-[2rem] p-8">
                    <h3 className="heading-3">{faq.question}</h3>
                    <p className="mt-4 leading-7 text-slate-700">
                      {faq.answer}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        <section id="cta" className="section section-strong">
          <div className="container max-w-4xl text-center">
            <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              {finalCtaTitle}
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              {finalCtaText}
            </p>

            <div className="mt-10 flex justify-center">
              <Button href={finalCta.href} size="lg">
                {finalCta.label}
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
