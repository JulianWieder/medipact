import { NewMediationConfig } from '../types'

export const verbraucherConfig: NewMediationConfig = {
  type: 'verbraucher',
  title: 'Verbraucher- & Handwerker-Streit',
  description: 'Strittige Rechnung, Mängel oder nicht erbrachte Leistung – außergerichtlich klären.',
  mainHeading: 'Streit mit Anbieter oder Handwerker lösen',
  mainDescription:
    'Wenn die Rechnung höher ausfällt als vereinbart oder die Leistung Mängel hat, lohnt der Gang vor Gericht bei kleinen Streitwerten selten. Diese Mediation hilft, den Streit strukturiert zu erfassen und eine faire Einigung zu erreichen – schnell und außergerichtlich.',
  topics: [
    'Konfliktbeschreibung',
    'Strittige Rechnung',
    'Mängel & Nachbesserung',
    'Nicht erbrachte Leistung',
    'Verzug & Fristen',
    'Kostenvoranschlag vs. Endpreis',
    'Gewährleistung',
    'Kommunikation',
    'Bisherige Einigungsversuche',
    'Lösungsoptionen',
  ],
  relevantData: [
    {
      title: 'Vertrag & Beteiligte',
      fields: [
        'Wer sind die Vertragsparteien?',
        'Was wurde beauftragt (Angebot, Kostenvoranschlag, Vertrag)?',
        'Wann wurde beauftragt und geliefert/ausgeführt?',
        'Welcher Betrag ist strittig?',
      ],
    },
    {
      title: 'Konfliktursache',
      fields: [
        'Was genau wird beanstandet (Mangel, Preis, Verzug)?',
        'Wann wurde der Mangel entdeckt und gemeldet?',
        'Gab es eine Frist zur Nachbesserung?',
        'Wie hat die Gegenseite reagiert?',
      ],
    },
    {
      title: 'Unterlagen',
      fields: [
        'Angebot / Kostenvoranschlag',
        'Rechnung(en)',
        'Fotos der Mängel',
        'Schriftverkehr (E-Mails, Briefe)',
        'Zahlungsnachweise',
      ],
    },
    {
      title: 'Bisherige Kommunikation',
      fields: [
        'Wie verliefen bisherige Gespräche?',
        'Wurde bereits gemahnt oder ein Anwalt eingeschaltet?',
        'Ist die Gegenseite gesprächsbereit?',
      ],
    },
    {
      title: 'Ziele & Lösungsideen',
      fields: [
        'Was wäre eine akzeptable Lösung (Minderung, Nachbesserung, Erstattung)?',
        'Welche Kompromisse sind denkbar?',
        'Was ist nicht verhandelbar?',
      ],
    },
  ],
  steps: [
    {
      num: '01',
      title: 'Sachverhalt vollständig erfassen',
      text: 'Auftrag, Leistung, Mängel und Zahlungen mit Belegen dokumentieren.',
    },
    {
      num: '02',
      title: 'Positionen und Interessen klären',
      text: 'Worum geht es beiden Seiten wirklich – Geld, Nachbesserung, Reputation?',
    },
    {
      num: '03',
      title: 'Faire Einigung vereinbaren',
      text: 'Eine konkrete Lösung festhalten: Betrag, Fristen, Nachbesserung – schriftlich und verbindlich.',
    },
  ],
  formFields: [
    {
      id: 'beschreibung',
      label: 'Beschreiben Sie den Streit',
      type: 'textarea',
      placeholder:
        'Beispiel: Der Handwerker hat 2.400 € statt der veranschlagten 1.500 € berechnet und die Fliesen sind schief verlegt. Auf meine Reklamation reagiert er nicht...',
    },
    {
      id: 'konfliktTyp',
      label: 'Art des Streits',
      type: 'text',
      placeholder: 'z. B. strittige Rechnung, Mangel, Leistung nicht erbracht, Verzug',
    },
    {
      id: 'streitwert',
      label: 'Um welchen Betrag geht es ungefähr?',
      type: 'text',
      placeholder: 'z. B. 900 €',
    },
    {
      id: 'dringlichkeit',
      label: 'Was ist aktuell am dringendsten?',
      type: 'text',
      placeholder: 'z. B. Zahlungsfrist läuft, Mangel muss vor Winter behoben werden',
      mapTo: 'priority',
    },
  ],
  disclaimer: {
    title: 'Einigung vor Eskalation',
    text: 'Diese Mediation ersetzt keine rechtliche Beratung. Sie hilft, Verbraucher- und Handwerkerstreitigkeiten strukturiert zu erfassen und eine außergerichtliche Einigung zu erreichen – oft schneller und günstiger als ein Gerichtsverfahren.',
  },
}
