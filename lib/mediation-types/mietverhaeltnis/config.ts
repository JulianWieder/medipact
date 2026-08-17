import { NewMediationConfig } from '../types'

export const mietverhaeltnisConfig: NewMediationConfig = {
  type: 'mietverhaeltnis',
  title: 'Streit im Mietverhältnis',
  description: 'Nebenkosten, Mängel, Kaution oder Eigenbedarf klären, ohne dass das Mietverhältnis daran zerbricht.',
  mainHeading: 'Streit zwischen Mieter und Vermieter klären',
  mainDescription:
    'Mietstreitigkeiten sind selten reine Rechtsfragen. Meist geht es um eine Abrechnung, die niemand erklärt hat, um Mängel, die zu lange liegen blieben, oder um eine Kündigung, die aus heiterem Himmel kam. Diese Mediation ordnet die Sachlage, macht die Rechnung nachvollziehbar und führt zu einer schriftlichen Vereinbarung.',
  topics: [
    'Konfliktbeschreibung',
    'Nebenkostenabrechnung',
    'Mängel & Mietminderung',
    'Instandhaltung & Reparaturen',
    'Kaution & Abrechnung',
    'Mieterhöhung & Modernisierung',
    'Kündigung & Eigenbedarf',
    'Schönheitsreparaturen',
    'Auszug & Übergabe',
    'Hausordnung & Nutzung',
    'Kommunikation',
    'Lösungsoptionen',
  ],
  relevantData: [
    {
      title: 'Mietverhältnis & Beteiligte',
      fields: [
        'Wohn- oder Gewerberaum?',
        'Seit wann besteht das Mietverhältnis?',
        'Wer ist Vertragspartei (mehrere Mieter, Erbengemeinschaft, Gesellschaft)?',
        'Gibt es eine Hausverwaltung als weitere Beteiligte?',
        'Aktuelle Nettokaltmiete und Vorauszahlungen',
      ],
    },
    {
      title: 'Streitgegenstand',
      fields: [
        'Worum geht es konkret – Abrechnung, Mangel, Kaution, Kündigung?',
        'Welcher Betrag steht im Raum?',
        'Seit wann besteht der Streit?',
        'Welche Fristen laufen bereits (Abrechnungs-, Widerspruchs-, Räumungsfrist)?',
        'Wurden Zahlungen zurückbehalten oder gemindert?',
        'Ist ein Mahn- oder Klageverfahren anhängig?',
      ],
    },
    {
      title: 'Vertragliche & rechtliche Grundlagen',
      fields: [
        'Mietvertrag samt Anlagen und Hausordnung',
        'Vereinbarte Betriebskostenumlage und Verteilerschlüssel',
        'Klauseln zu Schönheitsreparaturen und Kleinreparaturen',
        'Übergabeprotokolle bei Einzug und Auszug',
        'Ortsüblicher Mietspiegel bzw. Mietpreisbremse',
      ],
    },
    {
      title: 'Bisherige Kommunikation',
      fields: [
        'Wurden Mängel schriftlich angezeigt – wann und wie?',
        'Wie wurde darauf reagiert?',
        'Gibt es Fristsetzungen oder Abmahnungen?',
        'Sind Mieterverein oder Anwalt bereits eingeschaltet?',
        'Wie ist die aktuelle Gesprächsbereitschaft?',
      ],
    },
    {
      title: 'Ziele & Lösungsideen',
      fields: [
        'Soll das Mietverhältnis fortgesetzt werden?',
        'Welche Regelung wäre für beide Seiten tragfähig?',
        'Sind Ratenzahlung, Fristverlängerung oder Teilbeträge denkbar?',
        'Welche Arbeiten sollen bis wann erledigt sein?',
        'Was ist nicht verhandelbar?',
      ],
    },
    {
      title: 'Dokumente',
      fields: [
        'Mietvertrag mit allen Anlagen',
        'Strittige Nebenkostenabrechnung samt Belegen',
        'Mängelanzeigen und Fotos',
        'Übergabeprotokolle',
        'Kündigungsschreiben und Widerspruch',
        'Kontoauszüge zu Kaution und Mietzahlungen',
      ],
    },
  ],
  steps: [
    {
      num: '01',
      title: 'Sachlage und Zahlen ordnen',
      text: 'Vertrag, Abrechnung, Mängel und Fristen werden zusammengetragen, damit beide Seiten dieselbe Grundlage haben.',
    },
    {
      num: '02',
      title: 'Positionen und Interessen trennen',
      text: 'Was ist strittig, was nur unerklärt? Häufig löst sich ein Teil des Streits allein durch Nachvollziehbarkeit.',
    },
    {
      num: '03',
      title: 'Schriftliche Einigung treffen',
      text: 'Konkrete Vereinbarung zu Beträgen, Arbeiten, Fristen und – wenn nötig – zum geordneten Auszug.',
    },
  ],
  formFields: [
    {
      id: 'beschreibung',
      label: 'Beschreiben Sie den Streit im Mietverhältnis',
      type: 'textarea',
      placeholder:
        'Beispiel: Die Nebenkostenabrechnung für 2025 weist eine Nachzahlung von 1.400 € aus, obwohl die Vorauszahlungen unverändert blieben. Auf meine Bitte um Belegeinsicht kam keine Reaktion. Gleichzeitig ist die Heizung seit Dezember nur eingeschränkt funktionsfähig ...',
    },
    {
      id: 'rolle',
      label: 'Wer sind die Beteiligten?',
      type: 'text',
      placeholder: 'z. B. Mieter und privater Vermieter, Mieter und Hausverwaltung, Gewerbemieter und Eigentümerin',
    },
    {
      id: 'streitgegenstand',
      label: 'Worum geht es und um welchen Betrag?',
      type: 'text',
      placeholder: 'z. B. Nebenkostennachzahlung 1.400 €, Kaution 2.100 €, Minderung wegen Heizungsmangel',
    },
    {
      id: 'dringlichkeit',
      label: 'Was ist aktuell am dringendsten?',
      type: 'text',
      placeholder: 'z. B. Zahlungsfrist läuft, Räumungsklage angekündigt, Heizung vor dem Winter',
      mapTo: 'priority',
    },
  ],
  disclaimer: {
    title: 'Einigung vor Amtsgericht',
    text: 'Diese Mediation ersetzt keine rechtliche Beratung und hemmt keine Fristen – etwa die Widerspruchsfrist gegen eine Betriebskostenabrechnung (§ 556 Abs. 3 BGB) oder Räumungsfristen. Sie hilft, den Streit strukturiert zu erfassen und eine tragfähige Einigung zu erreichen, bevor das Mietverhältnis daran zerbricht.',
  },
}
