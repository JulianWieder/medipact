import { NewMediationConfig } from '../types'

export const schlichtungConfig: NewMediationConfig = {
  type: 'schlichtung',
  title: 'ODR – Online-Schlichtung',
  description:
    'Beide Seiten werden angehört, dann erarbeitet die neutrale Stelle einen konkreten Lösungsvorschlag (Schlichterspruch).',
  mainHeading: 'Online-Schlichtung: schnell zu einem Lösungsvorschlag',
  mainDescription:
    'Anders als in der Mediation entwickeln die Parteien die Lösung hier nicht selbst: Nach strukturierter Anhörung beider Seiten erarbeitet die neutrale Stelle – KI-gestützt, von einer erfahrenen Mediator:in geprüft – einen konkreten, begründeten Lösungsvorschlag. Diesen können beide Seiten annehmen oder ablehnen. Ideal, wenn eine schnelle, sachliche Entscheidung wichtiger ist als der gemeinsame Prozess.',
  topics: [
    'Beteiligte & Vertragsbeziehung',
    'Streitgegenstand & Forderung',
    'Belege & Unterlagen',
    'Bisherige Einigungsversuche',
    'Rechtlicher Rahmen',
    'Annahmebereitschaft',
    'Fristen & Verjährung',
  ],
  relevantData: [
    {
      title: 'Streitgegenstand',
      fields: [
        'Worum geht es konkret (Forderung, Leistung, Mangel)?',
        'Welcher Betrag oder welche Leistung steht im Raum?',
        'Auf welcher vertraglichen Grundlage beruht der Anspruch?',
        'Welche Belege gibt es (Vertrag, Rechnungen, Schriftverkehr, Fotos)?',
      ],
    },
    {
      title: 'Verlauf & Positionen',
      fields: [
        'Wie hat sich der Streit entwickelt?',
        'Was fordert die Gegenseite / wie begründet sie ihre Position?',
        'Gab es bereits Angebote oder Teil-Einigungen?',
        'Laufen Fristen (Gewährleistung, Verjährung, Kündigung)?',
      ],
    },
    {
      title: 'Erwartung an den Schlichterspruch',
      fields: [
        'Was wäre für dich ein akzeptables Ergebnis?',
        'Wo liegt deine Schmerzgrenze?',
        'Bist du bereit, einen begründeten Vorschlag anzunehmen, auch wenn er ein Kompromiss ist?',
      ],
    },
  ],
  steps: [
    {
      num: '01',
      title: 'Beide Seiten anhören',
      text: 'Jede Partei schildert ihre Sicht strukturiert und lädt Belege hoch – zeitversetzt und online.',
    },
    {
      num: '02',
      title: 'Schlichterspruch erarbeiten',
      text: 'Die neutrale Stelle erstellt KI-gestützt einen begründeten Lösungsvorschlag; eine Mediator:in prüft ihn.',
    },
    {
      num: '03',
      title: 'Annehmen oder ablehnen',
      text: 'Beide Seiten entscheiden frei. Bei Annahme wird die Einigung als verbindliche Vereinbarung festgehalten.',
    },
  ],
  formFields: [
    {
      id: 'beschreibung',
      label: 'Kurze Beschreibung des Streits',
      type: 'textarea',
      placeholder:
        'Beispiel: Handwerkerrechnung über 2.400 € – aus meiner Sicht wurden Leistungen berechnet, die nicht erbracht wurden. Der Betrieb besteht auf voller Zahlung...',
    },
    {
      id: 'forderung',
      label: 'Worum geht es konkret (Forderung/Betrag)?',
      type: 'text',
      placeholder: 'z. B. Minderung um 800 €, Nachbesserung, Rücktritt vom Vertrag',
    },
    {
      id: 'dringlichkeit',
      label: 'Was ist aktuell am dringendsten?',
      type: 'text',
      placeholder: 'z. B. offene Rechnung klären, Mahnverfahren abwenden, Frist läuft',
      mapTo: 'priority',
    },
    {
      id: 'belege',
      label: 'Welche Unterlagen und Belege hast du?',
      type: 'textarea',
      placeholder: 'z. B. Vertrag, Rechnung, E-Mail-Verlauf, Fotos, Gutachten...',
    },
  ],
  disclaimer: {
    title: 'Vorschlag statt Urteil',
    text: 'Die Online-Schlichtung ersetzt keine Rechtsberatung und kein Gerichtsverfahren. Der Schlichterspruch ist ein begründeter Vorschlag – verbindlich wird er erst, wenn beide Seiten ihn annehmen. Der Gang zu Gericht bleibt jederzeit möglich.',
  },
}
