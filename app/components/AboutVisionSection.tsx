import { FeatureCard } from "@/app/components/ui/FeatureCard";
import type { aboutVision } from "@/app/content/aboutPage";

/**
 * Vision-Block auf /about, direkt unter dem Hero (afterHero-Slot von
 * MarketingPageTemplate). Die Seite soll zuerst sagen, wofür medipact steht;
 * Verfahren und Preise kommen danach. Texte in app/content/aboutPage.ts.
 *
 * Farbfolge auf /about: Vision weiß (section-muted) → V-A-N-K hell
 * (section-base, weiße Karten heben sich ab) → Leistungen des Templates
 * weiß. Zwei gleichfarbige Abschnitte hintereinander verschwimmen.
 */
export function AboutVisionSection({ vision }: { vision: typeof aboutVision }) {
  return (
    <section className="section section-muted">
      <div className="container">
        <div className="max-w-3xl">
          <div className="eyebrow mb-4">{vision.eyebrow}</div>
          <h2 className="heading-2 text-neutral-900">
            {vision.title}
            <span className="block text-accent-700">{vision.titleHighlight}</span>
          </h2>
          <p className="mt-5 text-lg leading-8 text-neutral-700">{vision.text}</p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {vision.points.map((point) => (
            <FeatureCard key={point.title} title={point.title} text={point.text} />
          ))}
        </div>
      </div>
    </section>
  );
}
