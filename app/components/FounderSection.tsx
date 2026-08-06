/**
 * "Wer steckt hinter medipact" — E-E-A-T / Urheberschaft section für /about.
 *
 * Google-Regel, die das umsetzt: Eine Seite soll zeigen, wer hinter dem
 * Inhalt steht (echter Name, Rolle, Belege) — nicht nur eine gesichtslose
 * Firmenstimme. Gezeigt werden ausschließlich prüfbare Angaben (Name und
 * Rolle, identisch zum Impressum). `credentials` ist mit Absicht leer: Auf
 * einer Seite, deren ganzer Pitch vertrauenswürdige Konfliktklärung ist,
 * werden keine erfundenen Mediations-Zertifikate behauptet.
 *
 * Der Personen-Knoten für Suchmaschinen (Person/founder) hängt NICHT hier,
 * sondern im AboutPage-JSON-LD in app/about/page.tsx — dort am globalen
 * Organization-Knoten. Diese Komponente ist die sichtbare Entsprechung dazu;
 * wenn hier ein Name geändert wird, muss er dort mitgeändert werden.
 *
 * TODO(Julian): `credentials` unten mit echten Einträgen füllen, z. B.:
 *   "Ausbildung zum Mediator (IHK / BAFM / o. ä.), Jahr"
 *   "X Jahre Erfahrung in [Bereich]"
 *   "Mitglied im Bundesverband Mediation e. V." (falls zutreffend)
 * Sobald `credentials` mindestens einen Eintrag hat, rendert die Liste
 * automatisch — sonst ist keine Codeänderung nötig. Ebenso lohnt ein Foto und
 * ein LinkedIn-Link (linkedinUrl unten), sobald vorhanden.
 */

import Link from "next/link";

const credentials: string[] = [
  // "Ausbildung zum Mediator, [Institut], [Jahr]",
  // "Zertifiziert nach dem Mediationsgesetz",
];

const linkedinUrl: string | null = null;

export function FounderSection() {
  return (
    // `border-t-white/10`: Der Abschnitt folgt direkt auf den dunklen
    // Schluss-CTA des MarketingPageTemplate. Mit der alten hellen Linie
    // (border-neutral-100) sah er nach dem Seitenende aus wie ein
    // versehentlich angehängter Block; jetzt trennt die Kante sichtbar.
    <section className="section section-base border-t border-white/10">
      <div className="container max-w-3xl">
        <div className="eyebrow mb-4">Urheberschaft</div>
        <h2 className="heading-2 text-neutral-900">Wer steckt hinter medipact</h2>

        <div className="card mt-8 flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-accent-100 text-xl font-bold text-accent-700">
            JW
          </div>

          <div>
            <h3 className="heading-3">Julian Wieder</h3>
            <p className="mt-1 text-sm font-medium text-accent-700">
              Gründer, medipact
            </p>

            {credentials.length > 0 ? (
              <ul className="mt-4 space-y-2 text-neutral-700">
                {credentials.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            ) : (
              <div className="mt-4 space-y-4 leading-7 text-neutral-600">
                <p>
                  medipact ist aus einer einfachen Beobachtung entstanden: Die
                  Konflikte, die Menschen am längsten belasten, landen fast nie
                  vor Gericht. Sie sind zu klein für ein Verfahren, zu teuer für
                  eine klassische Mediation zum Stundensatz — und bleiben
                  deshalb ungeklärt.
                </p>
                <p>
                  Julian Wieder hat medipact gegründet, um genau diese Lücke zu
                  schließen: nicht mit einem weiteren Videotermin, sondern mit
                  einem Einigungsprozess, der für jeden Fall gleich läuft und
                  deshalb einen festen Preis haben kann. Verantwortliche Stelle
                  und vollständige Anbieterangaben stehen im Impressum.
                </p>
              </div>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium">
              <Link href="/impressum" className="text-accent-700 hover:underline">
                Impressum ansehen →
              </Link>
              <Link href="/kontakt" className="text-accent-700 hover:underline">
                Kontakt aufnehmen →
              </Link>

              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-700 hover:underline"
                >
                  LinkedIn-Profil ansehen →
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
