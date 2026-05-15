import { NewMediationConfig } from '../types'

export const nachbarschaftConfig: NewMediationConfig = {
  type: 'nachbarschaft',
  title: 'Nachbarschafts-Streit',
  description: 'Lärm, Grenzen und Nutzungsfragen konstruktiv und dauerhaft lösen.',
  mainHeading: 'Nachbarschaftskonflikt konstruktiv lösen',
  mainDescription:
    'Nachbarschaftsstreitigkeiten eskalieren schnell und belasten das tägliche Leben. Diese Mediation hilft, den Konflikt strukturiert zu erfassen, alle Beteiligten zu hören und dauerhaft tragfähige Lösungen zu finden.',
  topics: [
    'Konfliktbeschreibung',
    'Lärmbelästigung',
    'Grenzfragen',
    'Bäume & Hecken',
    'Parkplatz & Zufahrt',
    'Gemeinschaftsflächen',
    'Tierhaltung',
    'Beleuchtung & Sichtschutz',
    'Kommunikation',
    'Eskalationsgeschichte',
    'Rechtslage',
    'Lösungsoptionen',
  ],
  relevantData: [
    {
      title: 'Situation & Beteiligte',
      fields: [
        'Adresse und Art des Wohnobjekts (Miete / Eigentum)',
        'Seit wann besteht das Nachbarschaftsverhältnis?',
        'Wer ist direkt beteiligt?',
        'Gibt es Vermieter / Hausverwaltung als weitere Partei?',
        'Gibt es eine Hausordnung oder WEG-Beschlüsse?',
      ],
    },
    {
      title: 'Konfliktursache',
      fields: [
        'Was ist der konkrete Auslöser?',
        'Seit wann besteht der Konflikt?',
        'Wie oft kommt es zu Vorfällen?',
        'Gab es bereits Gespräche oder Beschwerden?',
        'Wurden Behörden (Ordnungsamt, Polizei) eingeschaltet?',
        'Gibt es schriftliche Nachweise (Fotos, Protokolle)?',
      ],
    },
    {
      title: 'Rechtliche Rahmenbedingungen',
      fields: [
        'Gilt Landes-Nachbarschaftsrecht?',
        'Grenzabstände und Wuchs nach NachbG',
        'Lärmschutzregeln (TA Lärm / Hausordnung)',
        'Wegerechte und Dienstbarkeiten',
        'Etwaige laufende Klagen oder Abmahnungen',
      ],
    },
    {
      title: 'Bisherige Kommunikation',
      fields: [
        'Wie verliefen bisherige Gespräche?',
        'Wurden schriftliche Abmahnungen verschickt?',
        'Gibt es Zeugen oder Mitbetroffene?',
        'Wie ist die aktuelle Gesprächsbereitschaft?',
      ],
    },
    {
      title: 'Ziele & Lösungsideen',
      fields: [
        'Was soll sich konkret ändern?',
        'Welche Lösung wäre akzeptabel?',
        'Welche Kompromisse sind denkbar?',
        'Was ist nicht verhandelbar?',
      ],
    },
    {
      title: 'Dokumente',
      fields: [
        'Fotos oder Videos der Situation',
        'Lärm- oder Vorfallsprotokoll',
        'Schriftverkehr mit Nachbarn',
        'Hausordnung / WEG-Beschlüsse',
        'Behördliche Bescheide oder Abmahnungen',
      ],
    },
  ],
  steps: [
    {
      num: '01',
      title: 'Situation vollständig erfassen',
      text: 'Konfliktursache, Beteiligte, Vorfälle und bisherige Kommunikation dokumentieren.',
    },
    {
      num: '02',
      title: 'Standpunkte und Interessen klären',
      text: 'Was stört wen – und warum? Hinter Positionen liegende Bedürfnisse sichtbar machen.',
    },
    {
      num: '03',
      title: 'Dauerhafte Lösung vereinbaren',
      text: 'Konkrete Vereinbarungen treffen, die alle Seiten langfristig akzeptieren können.',
    },
  ],
  formFields: [
    {
      id: 'beschreibung',
      label: 'Beschreiben Sie den Konflikt mit Ihrem Nachbarn',
      type: 'textarea',
      placeholder:
        'Beispiel: Mein Nachbar macht regelmäßig bis nach 22 Uhr Lärm. Ich habe mehrfach höflich gefragt, aber er reagiert aggressiv. Zusätzlich ragt seine Hecke 50 cm über unsere Grenze...',
    },
    {
      id: 'konfliktTyp',
      label: 'Art des Konflikts',
      type: 'text',
      placeholder: 'z. B. Lärm, Grenzen, Parken, Bäume/Hecken, Gemeinschaftsflächen',
    },
    {
      id: 'konfliktDauer',
      label: 'Wie lange besteht der Konflikt?',
      type: 'text',
      placeholder: 'z. B. seit 3 Monaten, seit über einem Jahr',
    },
    {
      id: 'dringlichkeit',
      label: 'Was ist aktuell am dringendsten?',
      type: 'text',
      placeholder: 'z. B. Lärmschutz sofort, Grenzklärung vor Baubeginn, Gespräch wiederherstellen',
      mapTo: 'priority',
    },
  ],
  disclaimer: {
    title: 'Klärung vor Konfrontation',
    text: 'Diese Mediation ersetzt keine rechtliche Beratung. Sie hilft, Nachbarschaftskonflikte strukturiert zu erfassen und die Grundlage für ein konstruktives Gespräch oder eine außergerichtliche Einigung zu schaffen.',
  },
}
