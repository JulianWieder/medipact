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
      <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-slate-400">
        {title}
      </h2>
      <div className="space-y-3 text-base leading-7 text-slate-600">{children}</div>
    </section>
  );
}

export default function CookiesPage() {
  return (
    <main className="app-shell pt-[73px]">
      <div className="mx-auto max-w-3xl px-6 py-20 lg:px-8">
        <h1 className="heading-1 mb-2">Cookie-Richtlinie</h1>
        <p className="mb-12 text-sm text-slate-500">Stand: Juni 2026</p>

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
              die Plattform sonst nicht funktioniert.
            </p>
          </Section>

          <Section title="3. Analyse-Cookies">
            <p>
              Mit Ihrer Einwilligung verwenden wir Google Analytics, um zu
              verstehen, wie Besucher medipact.de nutzen, und um die Plattform
              zu verbessern. Diese Cookies werden erst gesetzt, wenn Sie im
              Cookie-Banner auf „Akzeptieren“ klicken.
            </p>
          </Section>

          <Section title="4. Ihre Wahl">
            <p>
              Beim ersten Besuch von medipact.de werden Sie über ein Banner
              gefragt, ob Sie Analyse-Cookies zulassen möchten. Sie können
              Ihre Auswahl jederzeit ändern, indem Sie die
              Website-Daten/Cookies Ihres Browsers für medipact.de löschen –
              das Banner erscheint dann erneut.
            </p>
          </Section>

          <Section title="5. Weitere Informationen">
            <p>
              Details zur Verarbeitung personenbezogener Daten finden Sie in
              unserer{" "}
              <a
                href="/datenschutz"
                className="text-teal-700 hover:underline"
              >
                Datenschutzerklärung
              </a>
              .
            </p>
          </Section>
        </div>

        <div className="mt-16 rounded-2xl border border-slate-100 bg-slate-50 p-6 text-sm text-slate-500">
          <p>
            Bei Fragen zu Cookies wenden Sie sich an{" "}
            <a
              href="mailto:hallo@medipact.de"
              className="text-teal-700 hover:underline"
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
