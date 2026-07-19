import { NewMediationConfig } from '../types'

export const b2bConfig: NewMediationConfig = {
  type: 'b2b',
  title: 'ODR – B2B-Vertragsstreit',
  description:
    'Vertrags- und Zahlungsstreitigkeiten zwischen Unternehmen klären, ohne die Geschäftsbeziehung zu zerstören.',
  mainHeading: 'B2B-Vertragsstreit online beilegen',
  mainDescription:
    'Offene Rechnungen, Streit um Leistungsumfang, verzögerte Projekte oder gekündigte Rahmenverträge: Ein Gerichtsverfahren kostet Jahre und meist die Geschäftsbeziehung. Dieses ODR-Verfahren klärt B2B-Konflikte strukturiert, vertraulich und mit Blick auf die weitere Zusammenarbeit.',
  topics: [
    'Vertragsgrundlage',
    'Streitgegenstand & Forderungen',
    'Leistungs- & Zahlungsstand',
    'Projekthistorie',
    'Geschäftsbeziehung & Abhängigkeiten',
    'Wirtschaftliche Risiken',
    'Vertraulichkeit',
    'Fortführung oder Trennung',
  ],
  relevantData: [
    {
      title: 'Vertrag & Beteiligte',
      fields: [
        'Welche Unternehmen sind beteiligt (und wer verhandelt)?',
        'Vertragsart (Werkvertrag, Rahmenvertrag, Liefervertrag, Kooperation)',
        'Vereinbarter Leistungsumfang und Vergütung',
        'Gibt es Schieds- oder Mediationsklauseln im Vertrag?',
      ],
    },
    {
      title: 'Streit & Verlauf',
      fields: [
        'Worum geht es konkret (Zahlung, Qualität, Verzug, Kündigung)?',
        'Welche Forderungen stehen im Raum (Höhe, Gegenforderungen)?',
        'Wie hat sich der Konflikt entwickelt?',
        'Bisherige Verhandlungen und Angebote',
      ],
    },
    {
      title: 'Wirtschaftlicher Rahmen',
      fields: [
        'Wie wichtig ist die Geschäftsbeziehung künftig?',
        'Welche Risiken drohen (Projektstopp, Reputationsschaden, Liquidität)?',
        'Zeitdruck und Fristen (Verjährung, Vertragsende)',
        'Ziel: Fortführung der Zusammenarbeit oder geordnete Trennung?',
      ],
    },
  ],
  steps: [
    {
      num: '01',
      title: 'Sachstand strukturieren',
      text: 'Vertrag, Forderungen und Streitpunkte beider Seiten werden systematisch erfasst.',
    },
    {
      num: '02',
      title: 'Interessen verhandeln',
      text: 'Hinter den Forderungen liegende wirtschaftliche Interessen klären – KI-gestützt, vertraulich.',
    },
    {
      num: '03',
      title: 'Vereinbarung schließen',
      text: 'Zahlungsplan, Nachbesserung oder geordnete Trennung als belastbare Vereinbarung festhalten.',
    },
  ],
  formFields: [
    {
      id: 'beschreibung',
      label: 'Kurze Beschreibung des Vertragsstreits',
      type: 'textarea',
      placeholder:
        'Beispiel: Unser Dienstleister hat das Projekt mit vier Monaten Verzug geliefert, wir halten die Schlussrechnung teilweise zurück. Er droht mit Klage, wir brauchen ihn aber für den Betrieb...',
    },
    {
      id: 'forderungen',
      label: 'Welche Forderungen stehen im Raum?',
      type: 'text',
      placeholder: 'z. B. offene Rechnung 45.000 €, Gegenforderung Verzugsschaden 20.000 €',
    },
    {
      id: 'dringlichkeit',
      label: 'Was ist aktuell am dringendsten?',
      type: 'text',
      placeholder: 'z. B. Klage abwenden, Projekt fortführen, Liquidität sichern',
      mapTo: 'priority',
    },
    {
      id: 'beziehung',
      label: 'Wie soll es mit der Geschäftsbeziehung weitergehen?',
      type: 'textarea',
      placeholder: 'z. B. Zusammenarbeit fortsetzen, Rahmenvertrag neu verhandeln, geordnet trennen...',
    },
  ],
  disclaimer: {
    title: 'Vertraulich und außergerichtlich',
    text: 'Dieses Verfahren ersetzt keine Rechtsberatung. Es ist vertraulich und unterbricht laufende Fristen nicht automatisch – Verjährungsfragen ggf. parallel anwaltlich absichern. Ergebnisse können als Vergleich rechtsverbindlich gestaltet werden.',
  },
}
