import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutzerklärung – medipact",
  description: "Datenschutzerklärung der medipact Plattform für KI-gestützte Mediation.",
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

export default function DatenschutzPage() {
  return (
    <main className="app-shell pt-[73px]">
      <div className="mx-auto max-w-3xl px-6 py-20 lg:px-8">
        <h1 className="heading-1 mb-2">Datenschutzerklärung</h1>
        <p className="mb-12 text-sm text-slate-500">Stand: Juni 2026</p>

        <div className="space-y-10">

          <Section title="1. Verantwortlicher">
            <p>Verantwortlich für die Datenverarbeitung auf dieser Website ist:</p>
            <p className="font-medium text-slate-900">
              medipact · Julian Wieder
              <br />
              Ernst-Ludwig-Allee 14
              <br />
              63303 Dreieich
              <br />
              Deutschland
            </p>
            <p>
              E-Mail:{" "}
              <a
                href="mailto:hallo@medipact.de"
                className="text-teal-700 hover:underline"
              >
                hallo@medipact.de
              </a>
            </p>
          </Section>

          <Section title="2. Allgemeine Hinweise">
            <p>
              Der Schutz Ihrer personenbezogenen Daten ist uns ein wichtiges
              Anliegen. Wir verarbeiten Ihre Daten ausschließlich auf Grundlage
              der gesetzlichen Bestimmungen, insbesondere der
              Datenschutz-Grundverordnung (DSGVO) und des
              Bundesdatenschutzgesetzes (BDSG).
            </p>
            <p>
              Diese Datenschutzerklärung erläutert, welche Daten wir bei der
              Nutzung von medipact.de erheben, wie wir sie verwenden und welche
              Rechte Ihnen in diesem Zusammenhang zustehen.
            </p>
          </Section>

          <Section title="3. Erhebung und Verarbeitung personenbezogener Daten">
            <p>
              Wir erheben personenbezogene Daten, wenn Sie unsere Plattform
              nutzen, sich registrieren oder mit uns in Kontakt treten.
              Insbesondere verarbeiten wir:
            </p>
            <ul className="ml-5 list-disc space-y-1">
              <li>Kontaktdaten (Name, E-Mail-Adresse, Telefonnummer)</li>
              <li>
                Inhalte, die im Rahmen eines Mediationsfalls eingegeben oder
                ausgetauscht werden
              </li>
              <li>Nutzungsdaten (z. B. Zugriffszeiten, IP-Adresse, Browsertyp)</li>
              <li>
                Zahlungsdaten, sofern eine kostenpflichtige Leistung gebucht
                wird
              </li>
            </ul>
          </Section>

          <Section title="4. Zweck und Rechtsgrundlage der Verarbeitung">
            <p>
              Die Verarbeitung erfolgt zur Erbringung der vertraglich
              vereinbarten Mediationsleistungen (Art. 6 Abs. 1 lit. b DSGVO),
              zur Erfüllung rechtlicher Verpflichtungen (Art. 6 Abs. 1 lit. c
              DSGVO) sowie, soweit Sie eingewilligt haben, auf Grundlage Ihrer
              Einwilligung (Art. 6 Abs. 1 lit. a DSGVO).
            </p>
          </Section>

          <Section title="5. Vertraulichkeit der Mediationsinhalte">
            <p>
              Inhalte, die im Rahmen eines Mediationsprozesses ausgetauscht
              werden, behandeln wir streng vertraulich. Eine Weitergabe an
              Dritte erfolgt nicht, es sei denn, es besteht eine gesetzliche
              Verpflichtung oder Sie haben ausdrücklich zugestimmt.
            </p>
          </Section>

          <Section title="6. Weitergabe von Daten">
            <p>
              Eine Übermittlung Ihrer Daten an Dritte erfolgt nur, soweit dies
              zur Vertragserfüllung notwendig ist (z. B. an eingebundene
              menschliche Mediatoren oder Zahlungsdienstleister), gesetzlich
              vorgeschrieben ist oder Sie eingewilligt haben.
            </p>
          </Section>

          <Section title="7. Hosting und Auftragsverarbeitung">
            <p>
              Wir setzen sorgfältig ausgewählte Dienstleister zum Hosting und
              Betrieb der Plattform ein. Mit diesen Dienstleistern bestehen,
              soweit erforderlich, Verträge zur Auftragsverarbeitung gemäß
              Art. 28 DSGVO.
            </p>
          </Section>

          <Section title="8. Speicherdauer">
            <p>
              Wir speichern personenbezogene Daten nur so lange, wie dies zur
              Erbringung unserer Leistungen oder zur Erfüllung gesetzlicher
              Aufbewahrungspflichten erforderlich ist. Danach werden die Daten
              gelöscht oder anonymisiert.
            </p>
          </Section>

          <Section title="9. Ihre Rechte">
            <p>Ihnen stehen folgende Rechte hinsichtlich Ihrer Daten zu:</p>
            <ul className="ml-5 list-disc space-y-1">
              <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
              <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
              <li>Recht auf Löschung (Art. 17 DSGVO)</li>
              <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
              <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
              <li>Recht auf Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
              <li>
                Recht auf Beschwerde bei einer Aufsichtsbehörde (Art. 77 DSGVO)
              </li>
            </ul>
            <p>
              Zur Ausübung dieser Rechte wenden Sie sich bitte an{" "}
              <a
                href="mailto:hallo@medipact.de"
                className="text-teal-700 hover:underline"
              >
                hallo@medipact.de
              </a>
              .
            </p>
          </Section>

          <Section title="10. Cookies und Tracking">
            <p>
              Unsere Website verwendet technisch notwendige Cookies, um die
              Funktionalität der Plattform sicherzustellen. Sofern wir
              darüber hinaus Analyse- oder Marketing-Tools einsetzen, erfolgt
              dies nur auf Grundlage Ihrer ausdrücklichen Einwilligung.
            </p>
          </Section>

          <Section title="11. Datensicherheit">
            <p>
              Wir setzen technische und organisatorische Maßnahmen ein, um
              Ihre Daten gegen Verlust, Missbrauch und unbefugten Zugriff zu
              schützen, einschließlich Verschlüsselung bei der Datenübertragung
              (TLS/SSL).
            </p>
          </Section>

          <Section title="12. Änderungen dieser Datenschutzerklärung">
            <p>
              Wir behalten uns vor, diese Datenschutzerklärung anzupassen,
              sofern dies aufgrund geänderter Rechtslage oder
              Weiterentwicklung der Plattform erforderlich wird. Die jeweils
              aktuelle Fassung finden Sie stets unter medipact.de/datenschutz.
            </p>
          </Section>

        </div>

        <div className="mt-16 rounded-2xl border border-slate-100 bg-slate-50 p-6 text-sm text-slate-500">
          <p>
            Bei Fragen zum Datenschutz wenden Sie sich an{" "}
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
