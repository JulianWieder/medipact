import Link from "next/link";
import { aboutPageContent } from "@/app/content/aboutPage";
import MiniMatrix from "@/app/components/MiniMatrix";

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
        </div>
      </section>

      {/* MINI MATRIX (full width) */}
      <MiniMatrix />

      {/* FINAL CTA */}
      <section className="section section-strong">
        <div className="container text-center max-w-2xl">
          <h2 className="heading-2">{finalCta.title}</h2>
          <p className="mt-4 text-slate-300">{finalCta.text}</p>

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
