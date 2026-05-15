import { NewMediationConfig } from '../types'

export const trennungConfig: NewMediationConfig = {
  type: 'trennung',
  title: 'Trennung & Unterhalt',
  description: 'Trennung, Scheidung, Kinder, Unterhalt und Vermögen strukturiert klären.',
  mainHeading: 'Trennung in Ruhe sortieren',
  mainDescription:
    'Eine Trennung bringt viele Fragen auf einmal mit sich. Diese Mediation hilft, Gedanken zu ordnen, wichtige Themen sichtbar zu machen und den nächsten Schritt klarer zu sehen.',
  topics: [
    'Ehedaten',
    'Trennungsdatum',
    'Kinder & Betreuung',
    'Kindesunterhalt',
    'Ehegattenunterhalt',
    'Wohnsituation',
    'Vermögen & Schulden',
    'Versorgungsausgleich',
    'Hausrat',
    'Kommunikation',
    'Dokumente',
    'Nächste Schritte',
  ],
  relevantData: [
    {
      title: 'Ehe & Trennung',
      fields: [
        'Datum der Eheschließung',
        'Ort / Land der Eheschließung',
        'Besteht ein Ehevertrag?',
        'Datum der räumlichen Trennung',
        'Leben beide bereits getrennt?',
        'Ist das Trennungsjahr begonnen / dokumentiert?',
        'Scheidung einvernehmlich oder streitig?',
      ],
    },
    {
      title: 'Kinder',
      fields: [
        'Namen und Geburtsdaten der Kinder',
        'Aktuelle Betreuungssituation',
        'Gewünschtes Betreuungsmodell',
        'Umgangszeiten / Ferienregelung',
        'Sorgerechtliche Fragen',
        'Kindergarten / Schule / besondere Bedürfnisse',
        'Kommunikation über Kinder',
      ],
    },
    {
      title: 'Unterhalt',
      fields: [
        'Einkommen beider Ehepartner',
        'Kindesunterhalt',
        'Trennungsunterhalt',
        'Nachehelicher Unterhalt',
        'Krankenversicherung',
        'Betreuungskosten',
        'Sonderbedarf / Mehrbedarf der Kinder',
      ],
    },
    {
      title: 'Wohnung & Hausrat',
      fields: [
        'Wer bleibt in der Ehewohnung?',
        'Miete / Kredit / Nebenkosten',
        'Eigentum oder Mietwohnung?',
        'Hausrat: Möbel, Auto, Technik, Haustiere',
        'Zutritt zur Wohnung',
        'Übergangsregelung bis zur Scheidung',
      ],
    },
    {
      title: 'Vermögen & Schulden',
      fields: [
        'Konten, Depots, Bargeld',
        'Immobilien',
        'Kredite und gemeinsame Verbindlichkeiten',
        'Unternehmen / Beteiligungen',
        'Anfangsvermögen',
        'Vermögen zum Trennungszeitpunkt',
        'Zugewinnausgleich',
      ],
    },
    {
      title: 'Rente & Dokumente',
      fields: [
        'Rentenanwartschaften',
        'Betriebliche Altersvorsorge',
        'Private Rentenversicherungen',
        'Versorgungsausgleich',
        'Steuerbescheide',
        'Gehaltsabrechnungen',
        'Kontoauszüge',
        'Versicherungen',
      ],
    },
  ],
  steps: [
    {
      num: '01',
      title: 'Daten vollständig erfassen',
      text: 'Ehedaten, Trennungsdatum, Kinder, Einkommen, Wohnung, Vermögen und Dokumente sammeln.',
    },
    {
      num: '02',
      title: 'Dringlichkeit bewerten',
      text: 'Kinder, Wohnung, laufende Kosten und Kommunikation zuerst stabilisieren.',
    },
    {
      num: '03',
      title: 'Lösungen vorbereiten',
      text: 'Aus Fakten und Interessen entstehen faire Vereinbarungen für Trennung und Scheidung.',
    },
  ],
  formFields: [
    {
      id: 'beschreibung',
      label: 'Kurze Beschreibung der Trennung',
      type: 'textarea',
      placeholder:
        'Beispiel: Wir sind verheiratet, leben seit März getrennt, haben ein Kind und müssen Betreuung, Unterhalt, Wohnung und Vermögen klären...',
    },
    {
      id: 'datumEhe',
      label: 'Datum der Eheschließung',
      type: 'date',
    },
    {
      id: 'datumTrennung',
      label: 'Datum der Trennung',
      type: 'date',
    },
    {
      id: 'dringlichkeit',
      label: 'Was ist aktuell am dringendsten?',
      type: 'text',
      placeholder:
        'z. B. Kinderbetreuung, Unterhalt, Wohnung, Konten, Kommunikation, Anwaltstermin',
      mapTo: 'priority',
    },
    {
      id: 'risiken',
      label: 'Gibt es akute Risiken oder Eskalationen?',
      type: 'textarea',
      placeholder:
        'z. B. Kontaktabbruch, finanzielle Blockade, verweigerter Umgang, Drohungen, Auszug, gesperrte Konten...',
    },
  ],
  disclaimer: {
    title: 'Erst klären, dann entscheiden',
    text: 'Diese Mediation ersetzt keine Rechtsberatung. Sie hilft, relevante Fakten zu sammeln, Streitpunkte sichtbar zu machen und Gespräche mit Anwalt, Jugendamt oder Beratungsstelle besser vorzubereiten.',
  },
}
