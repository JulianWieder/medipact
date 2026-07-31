import Link from "next/link";
import {
  euro,
  euroGlatt,
  gerichtsSzenario,
  konfliktart,
  medipactPreis,
  verfahrenswertEhesache,
  verfahrenswertVersorgungsausgleich,
  type Konfliktart,
} from "@/lib/kostenrecht";

/**
 * Teaser auf den Prozesskostenrechner (/kostenrechner), eingeblendet auf den
 * Konfliktarten-Seiten via MarketingPageTemplate.
 *
 * Zweck ist doppelt:
 *
 * 1. Intern verlinken. Der Rechner hing vorher nur an fünf Ratgeber-Artikeln
 *    und /preise – ausgerechnet die kommerziellen Landingpages, die die
 *    meiste Kraft haben, zeigten nicht auf ihn.
 * 2. Den Preis-Einwand da abräumen, wo er entsteht. Wer auf
 *    /konflikte/erbschaft "399 €" liest, hat keinen Vergleichsmaßstab –
 *    daneben die Gerichtszahl, und die 399 € sehen anders aus.
 *
 * Die Beträge sind NICHT gepflegt, sondern werden aus denselben gesetzlichen
 * Tabellen berechnet wie im Rechner selbst (lib/kostenrecht.ts). Sie können
 * damit nicht auseinanderlaufen.
 *
 * Bewusst nur ein Teaser und nicht der Rechner selbst: Der Rechner soll für
 * seine Keywords ranken. Fünfmal dieselbe Rechen-UI auf fünf URLs wäre
 * Duplicate Content und würde ihm genau die Kraft abziehen, die er hier
 * bekommen soll.
 */

const FALLBACK_MONATSNETTO = 4500;
const FALLBACK_ANRECHTE = 2;

export function KostenrechnerHinweis({ art }: { art: Konfliktart }) {
  const info = konfliktart(art);
  const istTrennung = art === "trennung";

  // Bei Trennung ist der Verfahrenswert kein freier Streitwert, sondern folgt
  // aus dem Einkommen (§ 43 FamGKG) plus Versorgungsausgleich (§ 50 FamGKG).
  // Ohne Nutzereingabe rechnen wir hier mit demselben Beispielhaushalt, mit
  // dem der Rechner startet – sonst zeigt die Landingpage eine andere Zahl
  // als die Seite, auf die sie verlinkt.
  const wert = istTrennung
    ? verfahrenswertEhesache(FALLBACK_MONATSNETTO) +
      verfahrenswertVersorgungsausgleich(FALLBACK_MONATSNETTO, FALLBACK_ANRECHTE)
    : info.streitwertDefault;

  const gericht = gerichtsSzenario(wert, info.gerichtssatz, 2);
  const mediation = medipactPreis(info, 2);

  // Bei Trennung bleibt nach der Mediation die einvernehmliche Scheidung mit
  // einem Anwalt – eine Ehe wird nur gerichtlich geschieden (§ 114 FamFG).
  // Das hier zu unterschlagen wäre genau die Übertreibung, die der Rechner
  // an anderer Stelle ausdrücklich vermeidet.
  const einvernehmlich = istTrennung
    ? gerichtsSzenario(wert, info.gerichtssatz, 1)
    : null;
  const gesamt = mediation + (einvernehmlich?.gesamt ?? 0);

  // Bei Trennung ist die Zahl in der medipact-Spalte erklärungsbedürftig:
  // Der größere Teil davon sind Gericht und Pflichtanwalt, an denen wir
  // nichts ändern. Ohne diese Aufschlüsselung liest sich "4.001 €" wie ein
  // schwaches Angebot – tatsächlich sind davon nur 798 € unser Preis.
  // Gespart wird nicht das Gericht, sondern der zweite Anwalt.
  const ersparnis = gericht.gesamt - gesamt;

  return (
    <section className="section-base border-t border-neutral-100 py-14">
      <div className="container max-w-4xl">
        <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm sm:p-10">
          <span className="inline-flex items-center rounded-full bg-neutral-900 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
            Kostenrechner
          </span>

          <h2 className="mt-3 font-display text-2xl font-medium text-neutral-900">
            Was würde dieser Streit vor Gericht kosten?
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
            Gerichts- und Anwaltskosten stehen in festen gesetzlichen Tabellen.
            Beispielrechnung für {info.label.toLowerCase()} bei einem Wert von{" "}
            {euroGlatt(wert)}
            {istTrennung ? " (aus dem Einkommen berechnet)" : ""}:
          </p>

          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-neutral-50 p-5">
              <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Vor Gericht
              </dt>
              <dd className="mt-1 text-2xl font-black text-neutral-900">
                {euroGlatt(gericht.gesamt)}
              </dd>
              <dd className="mt-1 text-xs leading-5 text-neutral-500">
                Kostenrisiko, wenn Sie vollständig unterliegen
              </dd>
            </div>

            <div className="rounded-2xl border-2 border-accent-200 bg-accent-50/50 p-5">
              <dt className="text-xs font-semibold uppercase tracking-wide text-accent-700">
                Mit medipact
              </dt>
              <dd className="mt-1 text-2xl font-black text-neutral-900">
                {euroGlatt(gesamt)}
              </dd>
              <dd className="mt-1 text-xs leading-5 text-neutral-500">
                {istTrennung
                  ? "Mediation plus einvernehmliche Scheidung"
                  : "Feststehend, kein Kostenrisiko"}
              </dd>
            </div>
          </dl>

          {einvernehmlich && (
            <div className="mt-4 rounded-2xl bg-neutral-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Woraus sich die {euroGlatt(gesamt)} zusammensetzen
              </p>

              <dl className="mt-3 space-y-1.5 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-neutral-700">
                    Mediation bei medipact (2 × {euroGlatt(info.preis)})
                  </dt>
                  <dd className="shrink-0 font-semibold text-accent-700">
                    {euro(mediation)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-neutral-700">
                    Gerichtskosten der Scheidung
                  </dt>
                  <dd className="shrink-0 text-neutral-700">
                    {euro(einvernehmlich.gerichtskosten)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-neutral-700">
                    Anwalt für den Scheidungsantrag
                  </dt>
                  <dd className="shrink-0 text-neutral-700">
                    {euro(einvernehmlich.anwalt.brutto)}
                  </dd>
                </div>
              </dl>

              <p className="mt-4 border-t border-neutral-200 pt-3 text-xs leading-6 text-neutral-600">
                <strong className="text-neutral-900">
                  {euro(einvernehmlich.gesamt)} davon sind gesetzlich
                  unvermeidbar.
                </strong>{" "}
                Eine Ehe wird nur durch gerichtlichen Beschluss geschieden, und
                für den Antrag ist mindestens ein Anwalt zwingend
                (§ 114 FamFG) — das gilt bei jedem Anbieter und auch ohne
                Mediation. Gespart wird deshalb nicht das Gericht, sondern der
                zweite Anwalt: {euro(ersparnis)}. Und das ist die gesetzliche
                Untergrenze — bei einer streitigen Scheidung wird meist nach
                Stunden abgerechnet, dann liegt die Differenz deutlich höher.
              </p>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={`/kostenrechner?art=${info.key}`}
              className="shrink-0 rounded-xl bg-accent-600 px-6 py-3 text-center text-sm font-bold text-white transition hover:bg-accent-700"
            >
              Eigene Zahlen einsetzen →
            </Link>

            {/* Zweiter Weg für alle, die die Zahl oben schon überzeugt hat und
                die nicht erst noch rechnen wollen. */}
            <Link
              href="/auth/register"
              className="shrink-0 rounded-xl border border-neutral-300 px-6 py-3 text-center text-sm font-bold text-neutral-800 transition hover:border-accent-400 hover:text-accent-700"
            >
              Mediation starten
            </Link>
          </div>

          <p className="mt-4 text-xs leading-5 text-neutral-500">
            Der Rechner ist kostenlos und ohne Anmeldung nutzbar. Jede Position
            mit Fundstelle im Gesetz, inklusive Vergleich mit einem
            Anwalts-Stundenhonorar.
          </p>
        </div>
      </div>
    </section>
  );
}
