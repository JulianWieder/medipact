import { NewMediationConfig } from '../types'

export const arbeitsplatzConfig: NewMediationConfig = {
  type: 'arbeitsplatz',
  title: 'Konflikt am Arbeitsplatz',
  description: 'Spannungen im Team, mit der Führungskraft oder nach einem Vorfall klären, bevor sie das Arbeitsverhältnis beenden.',
  mainHeading: 'Konflikt am Arbeitsplatz strukturiert klären',
  mainDescription:
    'Arbeitsplatzkonflikte werden selten offen ausgetragen. Sie zeigen sich als Krankmeldungen, innere Kündigung, eskalierende E-Mails oder plötzlich als Kündigungsschutzklage. Diese Mediation erfasst den Konflikt strukturiert, hört alle Beteiligten getrennt an und führt zu einer Vereinbarung, mit der weitergearbeitet werden kann.',
  topics: [
    'Konfliktbeschreibung',
    'Beteiligte & Rollen',
    'Führung & Weisung',
    'Zusammenarbeit im Team',
    'Arbeitsbelastung & Verteilung',
    'Kommunikation & Umgangston',
    'Vorwürfe & Beschwerden',
    'Arbeitszeit & Erreichbarkeit',
    'Rückkehr nach Abwesenheit',
    'Eskalationsgeschichte',
    'Betriebliche Regelungen',
    'Lösungsoptionen',
  ],
  relevantData: [
    {
      title: 'Rahmen & Beteiligte',
      fields: [
        'Wer ist unmittelbar beteiligt, wer mittelbar betroffen?',
        'Welche Rollen und Weisungsbeziehungen bestehen zwischen den Beteiligten?',
        'Seit wann arbeiten die Beteiligten zusammen?',
        'Gibt es einen Betriebs- oder Personalrat?',
        'Ist die Personalabteilung bereits eingebunden?',
      ],
    },
    {
      title: 'Konfliktverlauf',
      fields: [
        'Was war der konkrete Auslöser?',
        'Seit wann besteht die Spannung?',
        'Welche Vorfälle sind dokumentiert?',
        'Gab es bereits Gespräche, Ermahnungen oder Abmahnungen?',
        'Wurden Beschwerden formal eingereicht (§ 84 BetrVG, AGG-Beschwerdestelle)?',
        'Gibt es Fehlzeiten, Versetzungswünsche oder Kündigungsabsichten?',
      ],
    },
    {
      title: 'Betriebliche Grundlagen',
      fields: [
        'Arbeitsverträge und Stellenbeschreibungen der Beteiligten',
        'Betriebsvereinbarungen zu Konflikten, Verhalten oder Arbeitszeit',
        'Anwendbarer Tarifvertrag',
        'Bestehende Regelungen zu Beschwerden und Meldewegen',
        'Laufende arbeitsrechtliche Verfahren oder Fristen',
      ],
    },
    {
      title: 'Bisherige Kommunikation',
      fields: [
        'Wie verliefen die bisherigen Gespräche?',
        'Wer hat mit wem worüber gesprochen – und wer nicht?',
        'Gibt es schriftlichen Verkehr, der den Konflikt dokumentiert?',
        'Wie ist die aktuelle Gesprächsbereitschaft auf beiden Seiten?',
      ],
    },
    {
      title: 'Ziele & Lösungsideen',
      fields: [
        'Soll die Zusammenarbeit fortgesetzt werden – und in welcher Form?',
        'Was müsste sich konkret ändern, damit das funktioniert?',
        'Welche Veränderungen sind organisatorisch überhaupt möglich?',
        'Was ist für welche Seite nicht verhandelbar?',
        'Ist eine einvernehmliche Trennung eine Option?',
      ],
    },
    {
      title: 'Dokumente',
      fields: [
        'Arbeitsvertrag und Stellenbeschreibung',
        'Schriftverkehr zum Konflikt',
        'Abmahnungen, Ermahnungen, Protokolle',
        'Beschwerden und deren Bearbeitung',
        'Einschlägige Betriebsvereinbarungen',
        'Bereits vorliegende anwaltliche Schreiben',
      ],
    },
  ],
  steps: [
    {
      num: '01',
      title: 'Vertrauliche Fallaufnahme',
      text: 'Jede Seite schildert den Konflikt getrennt und ohne Publikum – Vorfälle, Rollen, Belastungen und Ziele.',
    },
    {
      num: '02',
      title: 'Interessen hinter den Vorwürfen klären',
      text: 'Vom Vorwurf zum Bedürfnis: Was braucht wer, um wieder arbeitsfähig zu werden?',
    },
    {
      num: '03',
      title: 'Tragfähige Vereinbarung treffen',
      text: 'Konkrete Absprachen zu Zusammenarbeit, Kommunikation und Zuständigkeiten – oder ein fairer Trennungsweg.',
    },
  ],
  formFields: [
    {
      id: 'beschreibung',
      label: 'Beschreiben Sie den Konflikt am Arbeitsplatz',
      type: 'textarea',
      placeholder:
        'Beispiel: Seit der Umstrukturierung im Frühjahr gibt es zwischen der Teamleitung und zwei Mitarbeitenden dauerhaft Spannungen. Aufgaben werden doppelt vergeben, Kritik läuft nur noch schriftlich, eine Person ist seit sechs Wochen krankgeschrieben ...',
    },
    {
      id: 'konstellation',
      label: 'Zwischen wem besteht der Konflikt?',
      type: 'text',
      placeholder: 'z. B. Führungskraft und Mitarbeiter:in, zwei Kolleg:innen, Team und Leitung, zwei Abteilungen',
    },
    {
      id: 'konfliktDauer',
      label: 'Wie lange besteht der Konflikt?',
      type: 'text',
      placeholder: 'z. B. seit der Umstrukturierung im März, seit rund einem Jahr',
    },
    {
      id: 'dringlichkeit',
      label: 'Was ist aktuell am dringendsten?',
      type: 'text',
      placeholder: 'z. B. Rückkehr aus der Krankschreibung vorbereiten, Kündigung abwenden, Frist läuft',
      mapTo: 'priority',
    },
  ],
  disclaimer: {
    title: 'Klärung statt Kündigungsschutzklage',
    text: 'Diese Mediation ersetzt keine arbeitsrechtliche Beratung und hemmt keine Fristen – die dreiwöchige Klagefrist des § 4 KSchG läuft unabhängig davon weiter. Sie hilft, den Konflikt strukturiert zu erfassen und eine Einigung zu erarbeiten, bevor das Arbeitsverhältnis daran zerbricht.',
  },
}
