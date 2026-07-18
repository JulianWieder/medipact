import { NewMediationConfig } from '../types'

export const wgConfig: NewMediationConfig = {
  type: 'wg',
  title: 'WG- & Mitbewohner-Konflikt',
  description: 'Putzen, Kosten, Lärm und Gäste – fair klären, ohne dass die WG zerbricht.',
  mainHeading: 'WG-Konflikt fair lösen',
  mainDescription:
    'Konflikte unter Mitbewohnern schaukeln sich schnell hoch – vom unerledigten Abwasch bis zum Streit um Nebenkosten. Diese Mediation hilft, die Themen strukturiert auf den Tisch zu bringen und Regeln zu finden, mit denen alle leben können.',
  topics: [
    'Konfliktbeschreibung',
    'Putzplan & Ordnung',
    'Kosten & Nebenkosten',
    'Lärm & Ruhezeiten',
    'Gäste & Übernachtungen',
    'Gemeinsame Anschaffungen',
    'Küche & Gemeinschaftsräume',
    'Untermiete & Nachmieter',
    'Kommunikation',
    'Auszug & Kaution',
    'Lösungsoptionen',
  ],
  relevantData: [
    {
      title: 'Situation & Beteiligte',
      fields: [
        'Wie viele Personen leben in der WG?',
        'Seit wann besteht die WG, seit wann wohnt ihr zusammen?',
        'Wer steht im Mietvertrag (Haupt-/Untermiete)?',
        'Gibt es einen WG-Vertrag oder feste Absprachen?',
      ],
    },
    {
      title: 'Konfliktursache',
      fields: [
        'Was ist der konkrete Auslöser?',
        'Seit wann besteht der Konflikt?',
        'Wie oft kommt es zu Reibereien?',
        'Gab es bereits WG-Gespräche dazu?',
        'Sind mehrere Mitbewohner betroffen oder zwei Personen?',
      ],
    },
    {
      title: 'Geld & Organisation',
      fields: [
        'Wie werden Miete und Nebenkosten aufgeteilt?',
        'Gibt es eine gemeinsame Kasse oder App?',
        'Sind Zahlungen offen oder strittig?',
        'Wem gehören gemeinsame Anschaffungen?',
      ],
    },
    {
      title: 'Bisherige Kommunikation',
      fields: [
        'Wie verliefen bisherige Gespräche?',
        'Gibt es Chat-Verläufe oder schriftliche Absprachen?',
        'Wie ist die aktuelle Stimmung in der WG?',
      ],
    },
    {
      title: 'Ziele & Lösungsideen',
      fields: [
        'Was soll sich konkret ändern?',
        'Welche Regeln wären für alle akzeptabel?',
        'Ist ein Zusammenwohnen weiter gewollt – oder ein fairer Auszug?',
        'Was ist nicht verhandelbar?',
      ],
    },
  ],
  steps: [
    {
      num: '01',
      title: 'Situation vollständig erfassen',
      text: 'Streitthemen, Beteiligte, Absprachen und offene Punkte dokumentieren.',
    },
    {
      num: '02',
      title: 'Standpunkte und Interessen klären',
      text: 'Was stört wen – und warum? Bedürfnisse hinter den Vorwürfen sichtbar machen.',
    },
    {
      num: '03',
      title: 'Faire WG-Regeln vereinbaren',
      text: 'Konkrete, alltagstaugliche Vereinbarungen treffen, die alle mittragen.',
    },
  ],
  formFields: [
    {
      id: 'beschreibung',
      label: 'Beschreiben Sie den Konflikt in Ihrer WG',
      type: 'textarea',
      placeholder:
        'Beispiel: Ein Mitbewohner hält sich seit Monaten nicht an den Putzplan und zahlt die Nebenkostenabrechnung nicht. Gespräche enden im Streit...',
    },
    {
      id: 'konfliktTyp',
      label: 'Art des Konflikts',
      type: 'text',
      placeholder: 'z. B. Putzen, Kosten, Lärm, Gäste, Auszug',
    },
    {
      id: 'konfliktDauer',
      label: 'Wie lange besteht der Konflikt?',
      type: 'text',
      placeholder: 'z. B. seit 2 Monaten, seit dem Einzug',
    },
    {
      id: 'dringlichkeit',
      label: 'Was ist aktuell am dringendsten?',
      type: 'text',
      placeholder: 'z. B. offene Zahlungen klären, Putzplan neu regeln, Auszug fair gestalten',
      mapTo: 'priority',
    },
  ],
  disclaimer: {
    title: 'Klären statt ausziehen',
    text: 'Diese Mediation ersetzt keine rechtliche Beratung. Sie hilft, WG-Konflikte strukturiert zu erfassen und gemeinsame Regeln zu finden, bevor der Streit das Zusammenwohnen unmöglich macht.',
  },
}
