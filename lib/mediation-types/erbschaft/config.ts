import { NewMediationConfig } from '../types'

export const erbschaftConfig: NewMediationConfig = {
  type: 'erbschaft',
  title: 'Erbschafts-Konflikt',
  description: 'Nachlassverteilung, Testament und Erbstreitigkeiten einvernehmlich lösen.',
  mainHeading: 'Erbschaft fair und klar regeln',
  mainDescription:
    'Streit um ein Erbe belastet Familien oft jahrelang. Diese Mediation hilft, den Nachlass zu strukturieren, Positionen sichtbar zu machen und eine faire Einigung vorzubereiten – ohne jahrelange Gerichtsverfahren.',
  topics: [
    'Testament & Erbschein',
    'Erbteile & Pflichtteile',
    'Nachlasswert',
    'Immobilien',
    'Bankkonten & Depots',
    'Schulden & Lasten',
    'Lebensversicherungen',
    'Steuer & Freibeträge',
    'Fristen & Ausschlagung',
    'Grabkosten & Bestattung',
    'Kommunikation',
    'Nächste Schritte',
  ],
  relevantData: [
    {
      title: 'Verstorbener & Testament',
      fields: [
        'Name und Todesdatum',
        'Letzter Wohnort',
        'Testament vorhanden?',
        'Notarielles oder handschriftliches Testament?',
        'Erbschein beantragt?',
        'Zuständiges Nachlassgericht',
        'Testamentsvollstrecker bestimmt?',
      ],
    },
    {
      title: 'Erbengemeinschaft',
      fields: [
        'Namen aller gesetzlichen Erben',
        'Verwandtschaftsgrad zum Verstorbenen',
        'Kennen sich alle Erben?',
        'Gibt es Pflichtteilsberechtigte?',
        'Wurden Erbteile schon kommuniziert?',
        'Gibt es Vorauszahlungen / Schenkungen zu berücksichtigen?',
      ],
    },
    {
      title: 'Nachlassvermögen',
      fields: [
        'Immobilien (Lage, Wert, Belastung)',
        'Bankkonten und Depots',
        'Fahrzeuge und Wertsachen',
        'Unternehmensbeteiligungen',
        'Lebensversicherungen',
        'Geschätzter Gesamtwert',
      ],
    },
    {
      title: 'Schulden & Lasten',
      fields: [
        'Offene Kredite und Hypotheken',
        'Laufende Verbindlichkeiten',
        'Erbschaftssteuer (Schätzung)',
        'Bestattungskosten',
        'Nachlassverbindlichkeiten',
      ],
    },
    {
      title: 'Streitpunkte',
      fields: [
        'Was ist konkret umstritten?',
        'Wer beansprucht welche Gegenstände?',
        'Gibt es Anfechtungen des Testaments?',
        'Liegt ein Verdacht auf Erbunwürdigkeit vor?',
        'Gibt es frühere Abmachungen?',
        'Ist Kommunikation unter Erben möglich?',
      ],
    },
    {
      title: 'Dokumente',
      fields: [
        'Testament / Erbvertrag',
        'Sterbeurkunde',
        'Grundbuchauszüge',
        'Kontoauszüge und Depotnachweise',
        'Schenkungsverträge',
        'Steuerunterlagen des Verstorbenen',
      ],
    },
  ],
  steps: [
    {
      num: '01',
      title: 'Nachlasssituation erfassen',
      text: 'Erbenkreis, Vermögen, Schulden, Testament und Dokumente vollständig zusammenstellen.',
    },
    {
      num: '02',
      title: 'Positionen und Interessen klären',
      text: 'Was beansprucht wer – und warum? Fakten von Emotionen trennen, gemeinsame Interessen identifizieren.',
    },
    {
      num: '03',
      title: 'Einigung vorbereiten',
      text: 'Aus Fakten und Interessen werden faire Verteilungsoptionen – möglichst ohne Gericht.',
    },
  ],
  formFields: [
    {
      id: 'beschreibung',
      label: 'Beschreiben Sie den Erbschaftskonflikt',
      type: 'textarea',
      placeholder:
        'Beispiel: Mein Vater ist verstorben. Es gibt ein Testament, das meine Schwester benachteiligt. Das Vermögen beträgt ca. 300.000 € und wir kommen nicht zu einer Einigung...',
    },
    {
      id: 'nachlasswert',
      label: 'Geschätzter Wert des Nachlasses',
      type: 'text',
      placeholder: 'z. B. ca. 250.000 €',
    },
    {
      id: 'testamentStatus',
      label: 'Status des Testaments',
      type: 'text',
      placeholder: 'z. B. Testament vorhanden, wird angefochten',
    },
    {
      id: 'dringlichkeit',
      label: 'Was ist aktuell am dringendsten?',
      type: 'text',
      placeholder:
        'z. B. Immobilie soll verkauft werden, Fristen laufen, Kommunikation abgebrochen',
      mapTo: 'priority',
    },
  ],
  disclaimer: {
    title: 'Orientierung, keine Rechtsberatung',
    text: 'Diese Mediation ersetzt keine anwaltliche oder notarielle Beratung. Sie hilft, den Erbschaftskonflikt strukturiert zu erfassen und eine konstruktive Grundlage für eine einvernehmliche Einigung zu schaffen.',
  },
}
