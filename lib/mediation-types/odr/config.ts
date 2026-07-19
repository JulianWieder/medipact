import { NewMediationConfig } from '../types'

export const odrConfig: NewMediationConfig = {
  type: 'odr',
  title: 'ODR – Geschäft & Organisation',
  description:
    'Online Dispute Resolution: Konflikte in Teams, zwischen Abteilungen oder in Veränderungsprozessen strukturiert online klären.',
  mainHeading: 'Organisationskonflikte online klären (ODR)',
  mainDescription:
    'Konflikte in Organisationen sind selten reine Leistungsverweigerung. Dieses ODR-Verfahren hilft, die Dynamik zu verstehen, die Konfliktart und Eskalationsstufe zu bestimmen und einen tragfähigen Weg zu finden – vollständig digital.',
  topics: [
    'Beteiligte & Rollen',
    'Konfliktgegenstand',
    'Konfliktart',
    'Eskalationsstufe',
    'Hierarchie & Zuständigkeiten',
    'Bisheriger Verlauf',
    'Auswirkungen auf das Team',
    'Rahmen & Vertraulichkeit',
    'Nächste Schritte',
  ],
  relevantData: [
    {
      title: 'Beteiligte & Kontext',
      fields: [
        'Wer ist am Konflikt beteiligt (Personen, Abteilungen)?',
        'Rollen und Zuständigkeiten der Beteiligten',
        'Bin ich als Führungskraft selbst Partei?',
        'Gibt es eine formale Hierarchie zwischen den Beteiligten?',
        'Läuft parallel ein Veränderungsprozess (Umstrukturierung, Fusion)?',
      ],
    },
    {
      title: 'Konflikt & Verlauf',
      fields: [
        'Worum geht es konkret (Sache, Beziehung, Rolle, Struktur)?',
        'Seit wann besteht der Konflikt?',
        'Wie hat er sich entwickelt / eskaliert?',
        'Gab es bereits Klärungsversuche?',
        'Welche Muster wiederholen sich?',
      ],
    },
    {
      title: 'Auswirkungen & Rahmen',
      fields: [
        'Auswirkungen auf Team, Zusammenarbeit und Ergebnisse',
        'Gibt es Compliance- oder rechtliche Aspekte?',
        'Wie dringend ist eine Klärung?',
        'Vertraulichkeit und Rahmenbedingungen',
        'Ziel der Mediation aus deiner Sicht',
      ],
    },
  ],
  steps: [
    {
      num: '01',
      title: 'Diagnose stellen',
      text: 'Konfliktart, Eskalationsstufe (Glasl) und systemische Dynamik verstehen.',
    },
    {
      num: '02',
      title: 'Interessen klären',
      text: 'Hinter den Positionen die Bedürfnisse und Interessen der Beteiligten sichtbar machen.',
    },
    {
      num: '03',
      title: 'Vereinbarung treffen',
      text: 'Tragfähige Lösungen entwickeln und verbindlich festhalten (wer macht was bis wann).',
    },
  ],
  formFields: [
    {
      id: 'beschreibung',
      label: 'Kurze Beschreibung des Konflikts',
      type: 'textarea',
      placeholder:
        'Beispiel: Zwei Abteilungen streiten seit der Umstrukturierung um Zuständigkeiten und Ressourcen. Die Stimmung ist gekippt, es bilden sich Lager...',
    },
    {
      id: 'beteiligte',
      label: 'Wer ist beteiligt (Rollen)?',
      type: 'text',
      placeholder: 'z. B. Teamleitung A, Teamleitung B, zwei Mitarbeitende',
    },
    {
      id: 'dringlichkeit',
      label: 'Was ist aktuell am dringendsten?',
      type: 'text',
      placeholder: 'z. B. Zusammenarbeit wiederherstellen, Projekt retten, Eskalation stoppen',
      mapTo: 'priority',
    },
    {
      id: 'risiken',
      label: 'Gibt es akute Risiken oder Eskalationen?',
      type: 'textarea',
      placeholder:
        'z. B. Kündigungsandrohung, Lagerbildung, Boykott, Compliance-Verstoß, offene Aggression...',
    },
  ],
  disclaimer: {
    title: 'Klären statt eskalieren',
    text: 'Diese Mediation ersetzt keine arbeitsrechtliche Beratung. Sie hilft, den Konflikt zu verstehen, die passende Vorgehensweise zu wählen und tragfähige Vereinbarungen vorzubereiten. Bei fortgeschrittener Eskalation oder Compliance-Verstößen sind ggf. weitere Schritte nötig.',
  },
}
