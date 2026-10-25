import { ArrowLink } from "@/app/components/ui/ArrowLink";

/**
 * Schmaler Hinweis auf den Zusatzbaustein „Mediator:in vermitteln"
 * (/mediator-finden). Läuft auf den Konflikt-Seiten über
 * MarketingPageTemplate (`mediatorHinweis`) und auf /konflikte.
 *
 * Bewusst klein gehalten: Das Online-Verfahren bleibt der Hauptweg, dieser
 * Kasten ist nur der Ausgang für alle, die ausdrücklich ein persönliches
 * Gegenüber wollen. Kein eigener Button, damit er nicht mit dem CTA der
 * Seite konkurriert.
 */
export function MediatorVermittlungHinweis() {
  return (
    <section className="section-base border-t border-neutral-100 py-12">
      <div className="container max-w-4xl">
        <div className="flex flex-col gap-4 rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-700">
              Persönliche Mediation
            </p>
            <h2 className="mt-2 font-display text-xl font-medium text-neutral-900">
              Lieber mit einer Mediatorin am Tisch?
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-600">
              Wir vermitteln Ihnen auch eine Mediatorin oder einen Mediator für
              eine klassische Mediation, vor Ort oder per Video. Erstgespräch
              online buchen.
            </p>
          </div>
          <ArrowLink href="/mediator-finden" className="shrink-0 text-sm">
            Mediatorin vermitteln lassen
          </ArrowLink>
        </div>
      </div>
    </section>
  );
}
