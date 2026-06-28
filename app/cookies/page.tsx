import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie-Richtlinie – medipact",
  description: "Informationen über die von medipact.de verwendeten Cookies.",
  robots: "noindex",
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-neutral-400">
        {title}
      </h2>
      <div className="space-y-3 text-base leading-7 text-neutral-600">{children}</div>
    </section>
  );
}

export default function CookiesPage() {
  return (
    <main className="app-shell pt-[73px]">
      <div className="mx-auto max-w-3xl px-6 py-20 lg:px-8">
        <h1 className="heading-1 mb-2">Cookie-Richtlinie</h1>
        <p className="mb-12 text-sm text-neutral-500">Stand: Juni 2026</p>

        <div className="space-y-10">
          <Section title="1. Was sind Cookies?">
            <p>
              Cookies sind kleine Textdateien, die beim Besuch einer Website
              auf Ihrem Gerät gespeichert werden. Sie helfen uns, die
              Plattform funktionsfähig zu halten und sie nutzerfreundlich zu
              gestalten.
            </p>
          </Section>

          <Section title="2. Technisch notwendige Cookies">
            <p>
              Diese Cookies sind für den Betrieb von medipact.de erforderlich,
              zum Beispiel für die Anmeldung, die Sitzungsverwaltung und
              Sicherheitsfunktionen. Sie können nicht deaktiviert werden, da
              die Plattform sonst nicht funktioniert. Rechtsgrundlage ist
              § 25 Abs. 2 Nr. 2 TDDDG i. V. m. Art. 6 Abs. 1 lit. f DSGVO
              (berechtigtes Interesse am technischen Betrieb).
            </p>
          </Section>

          <Section title="3. Analyse-Cookies">
            <p>
              Mit Ihrer Einwilligung verwenden wir Google Analytics, um zu
              verstehen, wie Besucher medipact.de nutzen, und um die Plattform
              zu verbessern. Diese Cookies werden erst gesetzt, wenn Sie im
              Cookie-Banner auf „Alle akzeptieren“ klicken. Rechtsgrundlage
              ist § 25 Abs. 1 TDDDG für das Speichern/Auslesen auf Ihrem
              Gerät sowie Art. 6 Abs. 1 lit. a DSGVO für die anschließende
              Verarbeitung der Daten.
            </p>
          </Section>

          <Section title="4. Ihre Wahl – und wann das Banner erneut erscheint">
            <p>
              Beim ersten Besuch von medipact.de werden Sie über ein Banner
              gefragt, ob Sie Analyse-Cookies zulassen möchten. Ihre
              Entscheidung speichern wir lokal in Ihrem Browser.
            </p>
            <p>Das Cookie-Banner erscheint erneut, wenn:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Sie über den Link „Cookie-Einstellungen“ im Footer Ihre
                bisherige Entscheidung zurücksetzen,
              </li>
              <li>
                seit Ihrer letzten Entscheidung mehr als 12 Monate vergangen
                sind – eine sehr alte Einwilligung gilt nicht mehr als
                verlässlich informiert,
              </li>
              <li>
                wir die Cookie-Kategorien oder eingesetzten Dienste ändern
                (z. B. ein neues Analyse-Tool hinzukommt) – eine bestehende
                Einwilligung deckt nur das ab, worüber Sie informiert wurden,
              </li>
              <li>
                oder Sie die Website-Daten Ihres Browsers für medipact.de
                löschen.
              </li>
            </ul>
          </Section>

          <Section title="5. Weitere Informationen">
            <p>
              Details zur Verarbeitung personenbezogener Daten finden Sie in
              unserer{" "}
              <a
                href="/datenschutz"
                className="text-accent-700 hover:underline"
              >
                Datenschutzerklärung
              </a>
              .
            </p>
          </Section>
        </div>

        <div className="mt-16 rounded-2xl border border-neutral-100 bg-neutral-50 p-6 text-sm text-neutral-500">
          <p>
            Bei Fragen zu Cookies wenden Sie sich an{" "}
            <a
              href="mailto:hallo@medipact.de"
              className="text-accent-700 hover:underline"
            >
              hallo@medipact.de
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
