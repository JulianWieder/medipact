"use client";

import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";
import { ReactNode } from "react";
import Image, { type StaticImageData } from "next/image";
import { ImagePinHero } from "@/app/components/ui/ImagePinHero";
import {
  DidYouKnowSection,
  type DidYouKnowFact,
} from "@/app/components/ui/DidYouKnowSection";

type PageImage = {
  src: StaticImageData;
  alt: string;
};

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

type ComparisonPlan = {
  title: string;
  status: string;
  features: string[];
  featured?: boolean;
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
  heroImage?: PageImage;
  featuresTitle: string;
  featuresIntro?: string;
  features: Feature[];
  processTitle?: string;
  process: Step[];
  comparisonTitle?: string;
  comparisonIntro?: string;
  comparisonPlans?: ComparisonPlan[];
  trustTitle?: string;
  trustPoints?: Feature[];
  trustImage?: PageImage;
  faqTitle?: string;
  faqs?: Faq[];
  /** Optional "Wussten Sie schon?" fact carousel, rendered just before the
   * final CTA. Omit to skip the section entirely (e.g. /konflikte/* pages
   * that don't need the extra institutional-trust beat). */
  didYouKnowFacts?: DidYouKnowFact[];
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
      {text && <p className="mt-5 text-lg leading-8 text-neutral-600">{text}</p>}
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
  heroImage,
  featuresTitle,
  featuresIntro,
  features,
  processTitle = "So funktioniert es",
  process,
  comparisonTitle,
  comparisonIntro,
  comparisonPlans = [],
  trustTitle = "Warum medipact",
  trustPoints = [],
  trustImage,
  faqTitle = "Häufige Fragen",
  faqs = [],
  didYouKnowFacts,
  finalCtaTitle,
  finalCtaText,
  finalCta,
}: MarketingPageTemplateProps) {
  return (
    <>
      <main className="app-shell pt-[73px]">
        {heroImage ? (
          <ImagePinHero image={heroImage.src} imageAlt={heroImage.alt}>
            <div className="container">
              <div className="max-w-2xl">
                <div className="eyebrow text-accent-300">{eyebrow}</div>

                <h1 className="mt-8 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
                  {title}
                  {titleHighlight && (
                    <span className="mt-2 block bg-gradient-to-r from-accent-300 via-accent-200 to-white bg-clip-text text-transparent pb-2 leading-[1.15]">
                      {titleHighlight}
                    </span>
                  )}
                </h1>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-200">
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
            </div>
          </ImagePinHero>
        ) : (
          <section className="relative overflow-hidden section section-base">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute left-[-8rem] top-[-6rem] h-72 w-72 rounded-full bg-accent-100 blur-3xl opacity-60" />
              <div className="absolute right-[-6rem] top-20 h-80 w-80 rounded-full bg-cyan-100 blur-3xl opacity-50" />
            </div>

            <div className="container relative grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="max-w-3xl">
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
                    <p className="mt-4 leading-7 text-neutral-700">
                      Hier kann ein Video, ein Mockup oder eine Produktvorschau
                      stehen.
                    </p>
                  </Card>
                )}
              </div>
            </div>
          </section>
        )}

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
                  <p className="mt-4 leading-7 text-neutral-700">
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
                    <div className="min-w-fit rounded-2xl bg-gradient-to-br from-accent-600 to-accent-500 px-4 py-3 text-center font-bold text-white shadow-md">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div>
                      <h3 className="heading-3">{step.title}</h3>
                      <p className="mt-3 leading-7 text-neutral-700">
                        {step.text}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {comparisonPlans.length > 0 && (
          <section className="section section-strong">
            <div className="container">
              <SectionLead
                eyebrow="Vergleich"
                title={comparisonTitle ?? "Der bessere erste Schritt vor der Eskalation"}
                text={comparisonIntro}
                center
              />

              <div className="grid gap-6 md:grid-cols-3">
                {comparisonPlans.map((plan) => (
                  <div
                    key={plan.title}
                    className={`rounded-[2rem] border p-8 ${
                      plan.featured
                        ? "bg-neutral-800/70 border-accent-600/40 shadow-2xl shadow-accent-950/50"
                        : "bg-neutral-800/50 border-neutral-700"
                    }`}
                  >
                    {plan.featured && (
                      <div className="mb-4 inline-block rounded-full bg-accent-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent-300">
                        Empfohlen
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-white">{plan.title}</h3>
                    <div
                      className={`mt-1 text-sm font-medium ${
                        plan.featured ? "text-accent-300" : "text-neutral-500"
                      }`}
                    >
                      {plan.status}
                    </div>

                    <div className="my-6 h-px bg-white/10" />

                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-3 text-sm text-neutral-300"
                        >
                          <span
                            className={`mt-0.5 h-4 w-4 shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              plan.featured ? "bg-accent-500 text-white" : "bg-neutral-700 text-neutral-400"
                            }`}
                          >
                            ✓
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {trustPoints.length > 0 && (
          <section className="section section-accent">
            <div className="container">
              <SectionLead
                eyebrow="Vertrauen"
                title={trustTitle}
                center={!trustImage}
              />

              {trustImage ? (
                <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
                  <div
                    className="relative mx-auto w-full max-w-xl overflow-hidden rounded-[2rem] border border-neutral-200 shadow-xl shadow-neutral-900/5"
                    style={{ aspectRatio: "4/3" }}
                  >
                    <Image
                      src={trustImage.src}
                      alt={trustImage.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 576px"
                      style={{ objectFit: "cover" }}
                    />
                  </div>

                  <div className="grid gap-6">
                    {trustPoints.map((point) => (
                      <Card key={point.title} className="rounded-[2rem] p-8">
                        <h3 className="heading-3">{point.title}</h3>
                        <p className="mt-4 leading-7 text-neutral-700">
                          {point.text}
                        </p>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-3">
                  {trustPoints.map((point) => (
                    <Card key={point.title} className="rounded-[2rem] p-8">
                      <h3 className="heading-3">{point.title}</h3>
                      <p className="mt-4 leading-7 text-neutral-700">
                        {point.text}
                      </p>
                    </Card>
                  ))}
                </div>
              )}
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
                    <p className="mt-4 leading-7 text-neutral-700">
                      {faq.answer}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {didYouKnowFacts && <DidYouKnowSection facts={didYouKnowFacts} />}

        <section
          id="cta"
          className={`section section-strong ${didYouKnowFacts ? "border-t border-white/5" : ""}`}
        >
          <div className="container max-w-4xl text-center">
            <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              {finalCtaTitle}
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-neutral-300">
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
