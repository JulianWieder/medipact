/**
 * "Wer steckt hinter medipact" — E-E-A-T / Urheberschaft section for /about.
 *
 * Google tip this implements: pages should show who is behind the content
 * (real name, background, credentials), not just a faceless company voice.
 * Currently only the real, verifiable facts (name, role — matches
 * Impressum) are shown. `credentials` starts empty on purpose: we do not
 * want to publish invented mediation certificates/training on a page whose
 * whole pitch is trustworthy conflict resolution.
 *
 * TODO(Julian): fill in `credentials` below with real items, e.g.:
 *   "Ausbildung zum Mediator (IHK / BAFM / o.ä.), Jahr"
 *   "X Jahre Erfahrung in [Bereich]"
 *   "Mitglied im Bundesverband Mediation e.V." (falls zutreffend)
 * Once `credentials` has at least one entry, the list renders automatically
 * — no other code changes needed. Also consider adding a photo and a
 * LinkedIn link (linkedinUrl below) once available.
 */

const credentials: string[] = [
  // "Ausbildung zum Mediator, [Institut], [Jahr]",
  // "Zertifiziert nach dem Mediationsgesetz",
];

const linkedinUrl: string | null = null;

export function FounderSection() {
  return (
    <section className="section section-base border-t border-neutral-100">
      <div className="container max-w-3xl">
        <div className="eyebrow mb-4">Urheberschaft</div>
        <h2 className="heading-2 text-neutral-900">Wer steckt hinter medipact</h2>

        <div className="card mt-8 flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-accent-100 text-xl font-bold text-accent-700">
            JW
          </div>

          <div>
            <h3 className="heading-3">Julian Wieder</h3>
            <p className="mt-1 text-sm font-medium text-accent-700">Gründer, medipact</p>

            {credentials.length > 0 ? (
              <ul className="mt-4 space-y-2 text-neutral-700">
                {credentials.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 leading-7 text-neutral-600">
                Julian Wieder hat medipact gegründet, um privaten Konflikten eine
                strukturierte, bezahlbare Alternative zu Anwalt und Gericht zu geben.
              </p>
            )}

            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block font-medium text-accent-700 hover:underline"
              >
                LinkedIn-Profil ansehen →
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
