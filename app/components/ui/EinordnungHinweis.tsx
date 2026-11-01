import { ArrowLink } from "@/app/components/ui/ArrowLink";

/**
 * Einordnung nach Mercury-/Stripe-Muster (docs/story-mercury-stripe.md):
 * was medipact nicht ist, wann Kosten entstehen, und der eigene Weg für die
 * eingeladene Seite (/eingeladen). Läuft auf den Konflikt-Seiten über
 * MarketingPageTemplate (`einordnung`); Wortlaut wie auf /eingeladen, damit
 * beide Stellen dasselbe versprechen.
 *
 * Nicht auf /konflikte/odr: Dort läuft die Abrechnung über das Firmen-Abo,
 * die Kosten-Zeile passt nicht. Die Zeile nennt bewusst keinen Betrag und
 * kein „je Partei": /konflikte/arbeitsplatz kostet pauschal pro Fall.
 */
const nichtListe = [
  {
    title: "Keine Kanzlei",
    text: "medipact vertritt keine Seite und berät nicht rechtlich.",
  },
  {
    title: "Kein Gericht",
    text: "Niemand entscheidet über Sie. Eine Lösung gilt nur, wenn beide Seiten sie mittragen.",
  },
  {
    title: "Der Rechtsweg bleibt offen",
    text: "Sie können jederzeit aussteigen und anwaltlichen Rat einholen.",
  },
];

export function EinordnungHinweis() {
  return (
    <section className="section-base border-t border-neutral-100 py-16">
      <div className="container max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-700">
          Zur Einordnung
        </p>
        <h2 className="mt-2 font-display text-2xl font-medium text-neutral-900">
          Was medipact nicht ist
        </h2>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {nichtListe.map((punkt) => (
            <div
              key={punkt.title}
              className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <h3 className="font-semibold text-neutral-900">{punkt.title}</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-600">{punkt.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div className="flex flex-col justify-between gap-4 rounded-2xl bg-neutral-50 p-6">
            <div>
              <h3 className="font-semibold text-neutral-900">Was es kostet</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-600">
                Das Konto ist kostenlos. Kosten entstehen erst, wenn das Verfahren
                freigeschaltet wird – zum Festpreis, kein Stundenhonorar. Den Betrag
                sehen Sie vorher.
              </p>
            </div>
            <ArrowLink href="/preise" className="text-sm">
              Alle Preise
            </ArrowLink>
          </div>
          <div className="flex flex-col justify-between gap-4 rounded-2xl bg-neutral-50 p-6">
            <div>
              <h3 className="font-semibold text-neutral-900">Sie wurden eingeladen?</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-600">
                Eine Einladung ist kein Schritt gegen Sie. Was sie bedeutet, was auf Sie
                zukommt und was es kostet, steht auf einer eigenen Seite.
              </p>
            </div>
            <ArrowLink href="/eingeladen" className="text-sm">
              Für Eingeladene
            </ArrowLink>
          </div>
        </div>
      </div>
    </section>
  );
}
