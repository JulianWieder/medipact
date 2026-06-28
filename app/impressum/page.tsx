import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum – medipact",
  description: "Impressum der medipact Plattform für KI-gestützte Mediation.",
  robots: "noindex",
};

export default function ImpressumPage() {
  return (
    <main className="app-shell pt-[73px]">
      <div className="mx-auto max-w-3xl px-6 py-20 lg:px-8">
        <h1 className="heading-1 mb-2">Impressum</h1>
        <p className="mb-12 text-sm text-neutral-500">Angaben gemäß § 5 DDG</p>

        <div className="space-y-10 text-neutral-700">

          <section>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-neutral-400">
              Anbieter
            </h2>
            <div className="space-y-1 text-base leading-7">
              <p className="font-semibold text-neutral-900">medipact</p>
              <p>Julian Wieder</p>
              <p>Ernst-Ludwig-Allee 14</p>
              <p>63303 Dreieich</p>
              <p>Deutschland</p>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-neutral-400">
              Kontakt
            </h2>
            <div className="space-y-1 text-base leading-7">
              <p>
                E-Mail:{" "}
                <a
                  href="mailto:hallo@medipact.de"
                  className="text-accent-700 hover:underline"
                >
                  hallo@medipact.de
                </a>
              </p>
              <p>Telefon: +49 1520 9942351</p>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-neutral-400">
              Umsatzsteuer-ID
            </h2>
            <p className="text-base leading-7">
              Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:{" "}
              <span className="font-medium text-neutral-900">DE[wird nachgetragen]</span>
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-neutral-400">
              Verantwortlich für den Inhalt (§ 18 Abs. 2 MStV)
            </h2>
            <div className="space-y-1 text-base leading-7">
              <p>Julian Wieder</p>
              <p>Ernst-Ludwig-Allee 14</p>
              <p>63303 Dreieich</p>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-neutral-400">
              Hinweis zur Streitbeilegung
            </h2>
            <p className="text-base leading-7">
              Die Europäische Kommission stellt eine Plattform zur
              Online-Streitbeilegung (OS) bereit:{" "}
              <a
                href="https://ec.europa.eu/consumers/odr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-700 hover:underline"
              >
                https://ec.europa.eu/consumers/odr/
              </a>
              . Wir sind nicht bereit oder verpflichtet, an
              Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
              teilzunehmen.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-neutral-400">
              Haftung für Inhalte
            </h2>
            <p className="text-base leading-7 text-neutral-600">
              Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene
              Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
              verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter
              jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
              Informationen zu überwachen oder nach Umständen zu forschen, die
              auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur
              Entfernung oder Sperrung der Nutzung von Informationen nach den
              allgemeinen Gesetzen bleiben hiervon unberührt. Eine
              diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der
              Kenntnis einer konkreten Rechtsverletzung möglich. Bei
              Bekanntwerden von entsprechenden Rechtsverletzungen werden wir
              diese Inhalte umgehend entfernen.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-neutral-400">
              Haftung für Links
            </h2>
            <p className="text-base leading-7 text-neutral-600">
              Unser Angebot enthält Links zu externen Webseiten Dritter, auf
              deren Inhalte wir keinen Einfluss haben. Deshalb können wir für
              diese fremden Inhalte auch keine Gewähr übernehmen. Für die
              Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
              oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten
              wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße
              überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der
              Verlinkung nicht erkennbar. Bei Bekanntwerden von
              Rechtsverletzungen werden wir derartige Links umgehend entfernen.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-neutral-400">
              Urheberrecht
            </h2>
            <p className="text-base leading-7 text-neutral-600">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
              diesen Seiten unterliegen dem deutschen Urheberrecht. Die
              Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
              Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
              schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
              Downloads und Kopien dieser Seite sind nur für den privaten, nicht
              kommerziellen Gebrauch gestattet.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
