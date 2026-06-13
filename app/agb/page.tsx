import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AGB – medipact",
  description: "Allgemeine Geschäftsbedingungen der medipact Plattform.",
  robots: "noindex",
};

function Section({
  num,
  title,
  children,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-4 flex items-baseline gap-3">
        <span className="text-xs font-bold uppercase tracking-widest text-teal-600">
          § {num}
        </span>
        <span className="text-lg font-bold text-slate-900">{title}</span>
      </h2>
      <div className="space-y-3 text-base leading-7 text-slate-600">{children}</div>
    </section>
  );
}

export default function AgbPage() {
  return (
    <main className="app-shell pt-[73px]">
      <div className="mx-auto max-w-3xl px-6 py-20 lg:px-8">
        <h1 className="heading-1 mb-2">Allgemeine Geschäftsbedingungen</h1>
        <p className="mb-2 text-sm text-slate-500">Stand: Juni 2025</p>
        <p className="mb-12 text-sm text-slate-500">
          medipact · Julian Wieder · Dachauer Str. 233 · 80637 München
        </p>

        <div className="space-y-10">

          <Section num="1" title="Geltungsbereich">
            <p>
              Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle
              Verträge zwischen medipact (im Folgenden „Anbieter") und
              Nutzerinnen und Nutzern (im Folgenden „Nutzer") über die Nutzung
              der Plattform medipact.de sowie aller damit verbundenen
              Dienstleistungen.
            </p>
            <p>
              Abweichende Bedingungen des Nutzers werden nicht anerkannt, sofern
              der Anbieter ihrer Geltung nicht ausdrücklich schriftlich zugestimmt
              hat.
            </p>
          </Section>

          <Section num="2" title="Leistungsbeschreibung">
            <p>
              medipact bietet eine KI-gestützte Online-Mediationsplattform an,
              die Nutzer bei der strukturierten außergerichtlichen Beilegung
              privater Konflikte unterstützt – insbesondere bei Trennungen,
              Scheidungen, Nachbarschaftsstreitigkeiten und Erbkonflikten.
            </p>
            <p>
              Der Anbieter erbringt keine Rechtsberatung im Sinne des
              Rechtsdienstleistungsgesetzes (RDG). Die Plattform ersetzt weder
              einen Rechtsanwalt noch eine gerichtliche Entscheidung. Für
              rechtlich verbindliche Ergebnisse empfehlen wir ausdrücklich die
              Hinzuziehung eines zugelassenen Rechtsanwalts oder Notars.
            </p>
            <p>
              Optional können auf Anfrage menschliche Mediatoren in den Prozess
              eingebunden werden. Diese Leistungen werden gesondert vereinbart
              und berechnet.
            </p>
          </Section>

          <Section num="3" title="Registrierung und Nutzerkonto">
            <p>
              Für die Nutzung der Plattform ist eine Registrierung erforderlich.
              Nutzer müssen mindestens 18 Jahre alt sein. Bei der Registrierung
              sind vollständige und wahrheitsgemäße Angaben zu machen.
            </p>
            <p>
              Der Nutzer ist für die Sicherheit seiner Zugangsdaten
              verantwortlich. Eine Weitergabe an Dritte ist nicht gestattet. Bei
              unbefugter Nutzung des Kontos ist der Anbieter unverzüglich zu
              informieren.
            </p>
            <p>
              Der Anbieter behält sich vor, Nutzerkonten bei Verstoß gegen diese
              AGB oder geltendes Recht vorübergehend zu sperren oder dauerhaft zu
              löschen.
            </p>
          </Section>

          <Section num="4" title="Vertragsschluss und Preise">
            <p>
              Der Vertrag kommt mit Abschluss der Registrierung und Buchung einer
              Leistung zustande. Die jeweils aktuellen Preise sind auf der
              Preisseite (medipact.de/preise) ausgewiesen und verstehen sich
              inklusive der gesetzlichen Mehrwertsteuer.
            </p>
            <p>
              Änderungen des Leistungsumfangs oder der Preise werden dem Nutzer
              rechtzeitig mitgeteilt. Für laufende Fälle gelten die zum
              Buchungszeitpunkt gültigen Konditionen.
            </p>
          </Section>

          <Section num="5" title="Widerrufsrecht">
            <p>
              Verbraucher haben das Recht, binnen 14 Tagen ohne Angabe von
              Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beginnt
              mit dem Tag des Vertragsabschlusses.
            </p>
            <p>
              Das Widerrufsrecht erlischt vorzeitig, wenn der Anbieter die
              Dienstleistung vollständig erbracht hat und mit der Ausführung erst
              begonnen wurde, nachdem der Verbraucher dazu seine ausdrückliche
              Zustimmung gegeben hat.
            </p>
            <p>
              Widerrufe richten Sie bitte schriftlich an:{" "}
              <a
                href="mailto:hallo@medipact.de"
                className="text-teal-700 hover:underline"
              >
                hallo@medipact.de
              </a>
              .
            </p>
          </Section>

          <Section num="6" title="Pflichten der Nutzer">
            <p>
              Nutzer verpflichten sich, die Plattform ausschließlich für legale
              Zwecke zu nutzen und keine falschen oder irreführenden Angaben zu
              machen. Insbesondere ist es untersagt:
            </p>
            <ul className="ml-5 list-disc space-y-1">
              <li>
                andere Nutzer zu belästigen, zu bedrohen oder zu diskriminieren;
              </li>
              <li>
                die Plattform für missbräuchliche oder betrügerische Zwecke zu
                nutzen;
              </li>
              <li>
                automatisierte Zugriffe (Bots, Crawler) ohne ausdrückliche
                Genehmigung einzusetzen;
              </li>
              <li>
                Inhalte zu übermitteln, die gegen geltendes Recht verstoßen.
              </li>
            </ul>
          </Section>

          <Section num="7" title="Vertraulichkeit">
            <p>
              Alle im Rahmen des Mediationsprozesses ausgetauschten Informationen
              werden vertraulich behandelt. Der Anbieter gibt keine
              personenbezogenen Inhalte an Dritte weiter, es sei denn, es besteht
              eine gesetzliche Verpflichtung hierzu oder der Nutzer hat
              ausdrücklich zugestimmt.
            </p>
            <p>
              Einzelheiten zur Datenverarbeitung finden Sie in unserer{" "}
              <a href="/datenschutz" className="text-teal-700 hover:underline">
                Datenschutzerklärung
              </a>
              .
            </p>
          </Section>

          <Section num="8" title="Haftungsbeschränkung">
            <p>
              Der Anbieter haftet unbeschränkt für Schäden aus der Verletzung des
              Lebens, des Körpers oder der Gesundheit sowie für Schäden, die auf
              einer vorsätzlichen oder grob fahrlässigen Pflichtverletzung
              beruhen.
            </p>
            <p>
              Im Übrigen ist die Haftung auf vorhersehbare, vertragstypische
              Schäden beschränkt. Eine Haftung für entgangenen Gewinn,
              mittelbare Schäden oder Folgeschäden ist ausgeschlossen.
            </p>
            <p>
              Der Anbieter übernimmt keine Garantie dafür, dass eine Mediation zu
              einer Einigung führt. Der Erfolg hängt maßgeblich von der
              Mitwirkungsbereitschaft aller Beteiligten ab.
            </p>
          </Section>

          <Section num="9" title="Geistiges Eigentum">
            <p>
              Alle Inhalte der Plattform – einschließlich Texte, Grafiken,
              Algorithmen und Software – sind urheberrechtlich geschützt und
              Eigentum des Anbieters oder lizenzierter Dritter. Eine
              Vervielfältigung oder Weiterverwendung ohne ausdrückliche Genehmigung
              ist nicht gestattet.
            </p>
            <p>
              Durch das Hochladen von Inhalten räumt der Nutzer dem Anbieter ein
              nicht-exklusives, weltweites Recht ein, diese Inhalte zum Zweck der
              Erbringung der vereinbarten Leistungen zu nutzen.
            </p>
          </Section>

          <Section num="10" title="Laufzeit und Kündigung">
            <p>
              Die Nutzungsvereinbarung gilt für die Dauer des jeweiligen
              Mediationsfalls. Nutzer können ihr Konto jederzeit durch schriftliche
              Mitteilung an{" "}
              <a
                href="mailto:hallo@medipact.de"
                className="text-teal-700 hover:underline"
              >
                hallo@medipact.de
              </a>{" "}
              kündigen.
            </p>
            <p>
              Der Anbieter kann das Nutzungsverhältnis aus wichtigem Grund
              fristlos kündigen, insbesondere bei schwerwiegenden Verstößen gegen
              diese AGB.
            </p>
          </Section>

          <Section num="11" title="Änderungen der AGB">
            <p>
              Der Anbieter behält sich vor, diese AGB mit angemessener
              Vorankündigung (mindestens 4 Wochen) zu ändern. Änderungen werden
              per E-Mail mitgeteilt. Widerspricht der Nutzer nicht innerhalb von
              4 Wochen nach Zugang der Mitteilung, gelten die neuen AGB als
              akzeptiert.
            </p>
          </Section>

          <Section num="12" title="Anwendbares Recht und Gerichtsstand">
            <p>
              Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss
              des UN-Kaufrechts.
            </p>
            <p>
              Gerichtsstand für alle Streitigkeiten aus diesem Vertragsverhältnis
              ist München, sofern der Nutzer Kaufmann, juristische Person des
              öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen ist.
            </p>
          </Section>

          <Section num="13" title="Salvatorische Klausel">
            <p>
              Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden,
              bleibt die Wirksamkeit der übrigen Bestimmungen unberührt. Anstelle
              der unwirksamen Bestimmung gilt die gesetzliche Regelung.
            </p>
          </Section>

        </div>

        <div className="mt-16 rounded-2xl border border-slate-100 bg-slate-50 p-6 text-sm text-slate-500">
          <p>
            Bei Fragen zu diesen AGB wenden Sie sich an{" "}
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
