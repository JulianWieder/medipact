import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutzerklärung – medipact",
  description: "Datenschutzerklärung der medipact Plattform für strukturierte Online-Mediation.",
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

export default function DatenschutzPage() {
  return (
    <main className="app-shell pt-[73px]">
      <div className="mx-auto max-w-3xl px-6 py-20 lg:px-8">
        <h1 className="heading-1 mb-2">Datenschutzerklärung</h1>
        <p className="mb-12 text-sm text-neutral-500">Stand: Juni 2026</p>

        <div className="space-y-10">

          <Section title="1. Verantwortlicher">
            <p>Verantwortlich für die Datenverarbeitung auf dieser Website ist:</p>
            <p className="font-medium text-neutral-900">
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
                className="text-accent-700 hover:underline"
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
                className="text-accent-700 hover:underline"
              >
                hallo@medipact.de
              </a>
              .
            </p>
          </Section>

          <Section title="10. Cookies und Reichweitenmessung">
            <p>
              Technisch notwendige Cookies setzen wir ein, um die
              Funktionalität der Plattform sicherzustellen — etwa um Ihre
              Anmeldung über einen Besuch hinweg zu halten. Diese
              Verarbeitung ist nach § 25 Abs. 2 Nr. 2 TDDDG
              einwilligungsfrei; Rechtsgrundlage ist Art. 6 Abs. 1 lit. f
              DSGVO (berechtigtes Interesse am Betrieb der Plattform).
            </p>
            <p>
              Darüber hinaus setzen wir <strong>Google Analytics 4</strong>
              {" "}ein, einen Dienst der Google Ireland Limited, Gordon House,
              Barrow Street, Dublin 4, Irland. Der Dienst wird ausschließlich
              geladen, wenn Sie im Cookie-Hinweis zugestimmt haben. Ohne Ihre
              Zustimmung werden weder Cookies gesetzt noch Daten an Google
              übertragen.
            </p>
            <p>
              Verarbeitet werden dabei insbesondere: die aufgerufenen Seiten
              und die Verweildauer, die Herkunft des Zugriffs (etwa
              Suchmaschine oder verweisende Seite), Gerätetyp und Browser,
              der ungefähre Standort auf Basis der gekürzten IP-Adresse sowie
              eine zufällig vergebene Kennung, die Ihr Gerät über die Dauer
              des Besuchs wiedererkennt. Zusätzlich messen wir einzelne
              Ereignisse, die uns zeigen, ob unser Angebot verständlich ist —
              etwa die Nutzung des Kostenrechners, das Anklicken einer
              Kontaktmöglichkeit oder den Fortschritt im Onboarding. Eine
              Zusammenführung dieser Daten mit Ihrem Nutzerkonto oder mit den
              Inhalten Ihres Konflikts findet nicht statt.
            </p>
            <p>
              Rechtsgrundlage ist Ihre Einwilligung nach Art. 6 Abs. 1 lit. a
              DSGVO in Verbindung mit § 25 Abs. 1 TDDDG. Sie können sie
              jederzeit mit Wirkung für die Zukunft widerrufen, ohne dass die
              Rechtmäßigkeit der bis dahin erfolgten Verarbeitung berührt
              wird — über den Link „Cookie-Einstellungen“ im Seitenfuß. Auf
              die Nutzung der Plattform hat Ihre Entscheidung keinen Einfluss.
            </p>
            <p>
              Eine Übermittlung an die Google LLC in den USA lässt sich nicht
              ausschließen. Google LLC ist unter dem EU-US Data Privacy
              Framework zertifiziert, für das ein Angemessenheitsbeschluss der
              Europäischen Kommission vorliegt; ergänzend hat Google die
              Standardvertragsklauseln der EU-Kommission vereinbart. Die
              erhobenen Ereignisdaten werden nach 14 Monaten automatisch
              gelöscht. Weitere Informationen finden Sie in der
              Datenschutzerklärung von Google unter{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-700 hover:underline"
              >
                policies.google.com/privacy
              </a>
              .
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

        <div className="mt-16 rounded-2xl border border-neutral-100 bg-neutral-50 p-6 text-sm text-neutral-500">
          <p>
            Bei Fragen zum Datenschutz wenden Sie sich an{" "}
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
