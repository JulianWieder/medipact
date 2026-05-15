export type PhaseKey =
  | "einleitung"
  | "themensammlung"
  | "interessen"
  | "optionen"
  | "verhandlung"
  | "abschluss";

export interface StepDetail {
  key: string;
  title: string;
  description: string;
  placeholder: string;
}

export interface GuideSection {
  title: string;
  content: string | string[];
  type: "text" | "list";
  note?: string;
  example?: string;
  highlight?: boolean;
}

export interface Phase {
  key: PhaseKey;
  label: string;
  shortLabel: string;
  steps: string[];
  stepDetails: StepDetail[];
  guide: GuideSection[];
  nextPhase: PhaseKey | null;
  prevPhase: PhaseKey | null;
}

export const PHASES: Phase[] = [
  {
    key: "einleitung",
    label: "Auftrags- und Einleitungsphase",
    shortLabel: "Einleitung",
    steps: [
      "Regeln festlegen",
      "Rollen klären",
      "Vertrauen schaffen",
      "Ziel der Mediation definieren",
    ],
    stepDetails: [
      {
        key: "einleitung",
        title: "Regeln festlegen",
        description:
          "Jede Partei formuliert ihre Erwartungen an das Verfahren. Was ist dir wichtig? Welche Regeln sollen gelten?",
        placeholder: "z.B. Keine Unterbrechungen, ausreden lassen …",
      },
      {
        key: "einleitung_rollen",
        title: "Rollen klären",
        description:
          "Welche Rolle übernimmt jede Person in dieser Mediation? Hier werden Zuständigkeiten und Erwartungen transparent gemacht.",
        placeholder: "z.B. Ich sehe meine Rolle als …",
      },
      {
        key: "einleitung_vertrauen",
        title: "Vertrauen schaffen",
        description:
          "Was braucht ihr, um offen sprechen zu können? Notiert, was euch hilft, Vertrauen in den Prozess aufzubauen.",
        placeholder: "z.B. Vertraulichkeit über alles, was hier gesprochen wird …",
      },
      {
        key: "einleitung_ziel",
        title: "Ziel der Mediation definieren",
        description:
          "Was soll am Ende dieser Mediation erreicht sein? Jede Partei formuliert ihr persönliches Ziel für den Prozess.",
        placeholder: "z.B. Eine faire Lösung für beide Seiten finden …",
      },
    ],
    guide: [
      {
        title: "Ziele der Phase",
        content: [
          "Vertrauen herstellen",
          "Neutralität sichern",
          "Erwartungen klären",
          "Gesprächsregeln definieren",
          "Freiwilligkeit bestätigen",
          "Konfliktparteien arbeitsfähig machen",
        ],
        type: "list",
      },
      {
        title: "Begrüßung und Einführung",
        content:
          "Der Mediator erklärt Rolle, Ablauf und Prinzipien: Freiwilligkeit, Vertraulichkeit, Eigenverantwortung, Neutralität. Der Mediator entscheidet nicht – er steuert den Prozess.",
        type: "text",
      },
      {
        title: "Rahmenbedingungen festlegen",
        content: [
          "Zeitrahmen und Termine",
          "Ausreden lassen",
          "Keine Beleidigungen",
          "Ich-Botschaften verwenden",
          "Respektvoller Umgang mit Emotionen",
        ],
        type: "list",
      },
      {
        title: "Psychologisch wichtigste Aufgabe",
        content:
          "Die emotionale Eskalation senken. Die Einleitungsphase soll Sicherheit erzeugen, Kontrollverlust reduzieren und Gesprächsfähigkeit herstellen.",
        type: "text",
        highlight: true,
      },
    ],
    nextPhase: "themensammlung",
    prevPhase: null,
  },

  {
    key: "themensammlung",
    label: "Themensammlung",
    shortLabel: "Themen",
    steps: [
      "Konfliktpunkte sammeln",
      "Beide Seiten schildern ihre Sicht",
      "Struktur in den Konflikt bringen",
    ],
    stepDetails: [
      {
        key: "themensammlung_konflikte",
        title: "Konfliktpunkte sammeln",
        description:
          "Nennen Sie alle Themen und Streitpunkte, die in dieser Mediation geklärt werden sollen. Noch keine Bewertung – nur sammeln.",
        placeholder: "z.B. Aufteilung der Betreuungszeiten, Unterhaltszahlungen …",
      },
      {
        key: "themensammlung_perspektive",
        title: "Ihre Perspektive",
        description:
          "Schildern Sie Ihre persönliche Sicht auf den Konflikt. Ohne Wertung – nur Ihre Wahrnehmung der Situation.",
        placeholder: "z.B. Ich erlebe die Situation so, dass …",
      },
      {
        key: "themensammlung_prioritaeten",
        title: "Prioritäten setzen",
        description:
          "Welche Themen sind für Sie am dringendsten? Benennen Sie die Punkte, die zuerst geklärt werden müssen.",
        placeholder: "z.B. Zuerst muss das Thema Wohnung geklärt werden, weil …",
      },
    ],
    guide: [
      {
        title: "Ziele der Phase",
        content: [
          "Alle Konfliktthemen sichtbar machen",
          "Jede Seite kommt ununterochen zu Wort",
          "Gemeinsame Themenliste erstellen",
          "Reihenfolge der Bearbeitung festlegen",
        ],
        type: "list",
      },
      {
        title: "Technik: Aktives Zuhören",
        content:
          "Mediator fasst zusammen, was jede Partei gesagt hat. Keine Wertung, keine Ratschläge. Ziel: Die andere Seite fühlt sich gehört.",
        type: "text",
        example: '"Ich höre, dass für Sie das Thema X besonders wichtig ist. Habe ich das richtig verstanden?"',
      },
      {
        title: "Häufige Stolpersteine",
        content: [
          "Parteien springen zu Lösungen – zurück zur Beschreibung lenken",
          "Schuldzuweisungen – auf Fakten und Wahrnehmungen lenken",
          "Eine Seite dominiert – aktiv ausgleichen",
        ],
        type: "list",
        note: "Noch keine Lösungen diskutieren – das ist Phase 4.",
      },
    ],
    nextPhase: "interessen",
    prevPhase: "einleitung",
  },

  {
    key: "interessen",
    label: "Interessen- und Bedürfnisphase",
    shortLabel: "Interessen",
    steps: [
      "Hinter Positionen schauen",
      "Motive, Bedürfnisse, Ängste verstehen",
      "Kern des Konflikts herausarbeiten",
    ],
    stepDetails: [
      {
        key: "interessen_beduerfnisse",
        title: "Ihre Bedürfnisse und Interessen",
        description:
          "Was brauchen Sie wirklich? Hinter jeder Position steckt ein tieferes Bedürfnis. Beschreiben Sie, was Ihnen wichtig ist.",
        placeholder: "z.B. Ich brauche Sicherheit, Verlässlichkeit, Respekt …",
      },
      {
        key: "interessen_aengste",
        title: "Befürchtungen und Ängste",
        description:
          "Was befürchten Sie? Was darf auf keinen Fall passieren? Diese Informationen helfen, tragfähige Lösungen zu finden.",
        placeholder: "z.B. Ich befürchte, dass meine Kinder darunter leiden …",
      },
      {
        key: "interessen_kern",
        title: "Kern des Konflikts",
        description:
          "Was ist Ihrer Meinung nach der eigentliche Kern dieses Konflikts? Oft steckt hinter dem sichtbaren Streit ein tieferes Thema.",
        placeholder: "z.B. Im Kern geht es mir darum, dass ich gehört werde …",
      },
    ],
    guide: [
      {
        title: "Ziele der Phase",
        content: [
          "Von Positionen zu Interessen kommen",
          "Unausgesprochene Bedürfnisse sichtbar machen",
          "Emotionale Ebene anerkennen",
          "Gemeinsame Interessen identifizieren",
        ],
        type: "list",
      },
      {
        title: "Position vs. Interesse",
        content:
          'Position: "Ich will das Haus." Interesse: "Ich brauche Stabilität für die Kinder." Das Interesse ermöglicht kreative Lösungen – die Position blockiert sie.',
        type: "text",
        example: '"Was ist Ihnen dabei wichtig? Warum ist das für Sie so bedeutsam?"',
      },
      {
        title: "Psychologische Tiefe",
        content: [
          "Sicherheit und Schutz",
          "Respekt und Anerkennung",
          "Selbstbestimmung und Kontrolle",
          "Gerechtigkeit und Fairness",
          "Zugehörigkeit und Beziehung",
        ],
        type: "list",
        note: "Häufig stecken diese Grundbedürfnisse hinter den sichtbaren Positionen.",
      },
      {
        title: "Wichtigste Erkenntnis",
        content:
          "Wenn beide Seiten ihre wahren Interessen benennen, entstehen oft überraschend viele Gemeinsamkeiten – die Basis für echte Lösungen.",
        type: "text",
        highlight: true,
      },
    ],
    nextPhase: "optionen",
    prevPhase: "themensammlung",
  },

  {
    key: "optionen",
    label: "Optionen entwickeln",
    shortLabel: "Optionen",
    steps: [
      "Lösungen sammeln",
      "Kreative Möglichkeiten prüfen",
      "Win-Win-Ansätze suchen",
    ],
    stepDetails: [
      {
        key: "optionen_ideen",
        title: "Lösungsideen sammeln",
        description:
          "Sammeln Sie alle möglichen Lösungen – ohne Bewertung. Jede Idee ist willkommen, auch ungewöhnliche. Quantität vor Qualität.",
        placeholder: "z.B. Eine mögliche Lösung wäre, dass …",
      },
      {
        key: "optionen_kreativ",
        title: "Kreative Optionen",
        description:
          "Denken Sie außerhalb gewohnter Muster. Was wäre möglich, wenn es keine Einschränkungen gäbe? Was haben andere in ähnlichen Situationen gemacht?",
        placeholder: "z.B. Was wäre, wenn wir …",
      },
      {
        key: "optionen_winwin",
        title: "Win-Win-Ansätze",
        description:
          "Welche der gesammelten Lösungen könnten für alle Seiten akzeptabel sein? Suchen Sie nach Ideen, die mehrere Interessen gleichzeitig erfüllen.",
        placeholder: "z.B. Beide Seiten könnten davon profitieren, wenn …",
      },
    ],
    guide: [
      {
        title: "Ziele der Phase",
        content: [
          "Möglichst viele Optionen generieren",
          "Kreativität fördern, Bewertung vermeiden",
          "Gemeinsame Interessen verbinden",
          "Grundlage für Verhandlungsphase schaffen",
        ],
        type: "list",
      },
      {
        title: "Brainstorming-Regel",
        content:
          "Alle Ideen werden zunächst gesammelt, keine wird sofort abgelehnt. Erst in Phase 5 wird bewertet. Diese Trennung ist entscheidend für kreative Lösungen.",
        type: "text",
        example: '"Gut, diese Idee notieren wir. Was gibt es noch? Wir bewerten noch nicht."',
      },
      {
        title: "Blockaden überwinden",
        content: [
          '"Das geht nicht" – warum nicht? Was müsste sich ändern?',
          '"Das haben wir noch nie so gemacht" – andere Perspektive einladen',
          "Festgefahrene Positionen – zurück zu den Interessen",
        ],
        type: "list",
        note: "Wenn Parteien zu früh bewerten, gehen kreative Lösungen verloren.",
      },
    ],
    nextPhase: "verhandlung",
    prevPhase: "interessen",
  },

  {
    key: "verhandlung",
    label: "Verhandlungs- und Bewertungsphase",
    shortLabel: "Verhandlung",
    steps: [
      "Lösungen bewerten",
      "Machbarkeit prüfen",
      "Konkrete Vereinbarungen aushandeln",
    ],
    stepDetails: [
      {
        key: "verhandlung_bewertung",
        title: "Lösungen bewerten",
        description:
          "Welche der gesammelten Optionen sind für Sie akzeptabel? Was spricht dafür, was dagegen? Begründen Sie Ihre Einschätzung.",
        placeholder: "z.B. Option X ist für mich akzeptabel, weil … Nicht akzeptabel wäre …",
      },
      {
        key: "verhandlung_bedingungen",
        title: "Bedingungen und Grenzen",
        description:
          "Unter welchen Bedingungen können Sie einer Lösung zustimmen? Was sind Ihre Grenzen – also was kommt auf keinen Fall infrage?",
        placeholder: "z.B. Ich könnte zustimmen, wenn … Nicht akzeptabel wäre auf jeden Fall …",
      },
      {
        key: "verhandlung_vereinbarung",
        title: "Konkrete Vereinbarungen",
        description:
          "Welche konkreten Schritte, Regeln oder Vereinbarungen schlagen Sie vor? Je konkreter, desto besser – mit Datum, Betrag, Häufigkeit.",
        placeholder: "z.B. Wir vereinbaren, dass ab dem 01.06. … in Höhe von … monatlich …",
      },
    ],
    guide: [
      {
        title: "Ziele der Phase",
        content: [
          "Optionen anhand der Interessen bewerten",
          "Kompromisse und Alternativen entwickeln",
          "Konkrete, umsetzbare Vereinbarungen treffen",
          "Zustimmung beider Parteien sichern",
        ],
        type: "list",
      },
      {
        title: "Bewertungskriterien",
        content:
          "Lösungen werden anhand der in Phase 3 genannten Interessen bewertet – nicht nach Positionen. Eine gute Lösung muss nicht perfekt sein, sie muss für beide akzeptabel sein.",
        type: "text",
        example: '"Erfüllt diese Option Ihr Bedürfnis nach Sicherheit? Was fehlt noch?"',
      },
      {
        title: "Wenn Einigung schwierig ist",
        content: [
          "Paketlösungen – mehrere Punkte gemeinsam regeln",
          "Zeitlich begrenzte Lösungen als Einstieg",
          "Externe Prüfung (Rechtsanwalt, Gutachter) für strittige Punkte",
          "Rückfall auf gemeinsame Interessen – was wollen beide wirklich?",
        ],
        type: "list",
        note: "Wenn keine Einigung möglich: Mediation kann auch mit Teileinigungen enden.",
      },
    ],
    nextPhase: "abschluss",
    prevPhase: "optionen",
  },

  {
    key: "abschluss",
    label: "Abschlussvereinbarung",
    shortLabel: "Abschluss",
    steps: [
      "Ergebnis schriftlich festhalten",
      "Verantwortlichkeiten und nächste Schritte definieren",
      "Abschluss der Mediation",
    ],
    stepDetails: [
      {
        key: "abschluss_ergebnis",
        title: "Ergebnis der Mediation",
        description:
          "Halten Sie fest, was vereinbart wurde. Jede Vereinbarung so konkret wie möglich: Wer tut was, wann, unter welchen Bedingungen?",
        placeholder: "z.B. Beide Parteien sind übereingekommen, dass …",
      },
      {
        key: "abschluss_schritte",
        title: "Nächste Schritte und Verantwortlichkeiten",
        description:
          "Wer ist für die Umsetzung verantwortlich? Was passiert, wenn eine Vereinbarung nicht eingehalten wird? Konkrete Fristen setzen.",
        placeholder: "z.B. Bis zum … wird von … folgendes erledigt: …",
      },
      {
        key: "abschluss_feedback",
        title: "Abschluss und Reflexion",
        description:
          "Wie war der Mediationsprozess für Sie? Was nehmen Sie mit? Ein bewusster Abschluss stärkt die Nachhaltigkeit der Vereinbarungen.",
        placeholder: "z.B. Für mich war besonders hilfreich, dass … Ich nehme mit, dass …",
      },
    ],
    guide: [
      {
        title: "Ziele der Phase",
        content: [
          "Vereinbarungen schriftlich fixieren",
          "Klare Verantwortlichkeiten und Fristen",
          "Nachhaltigkeit sichern",
          "Verfahren bewusst abschließen",
        ],
        type: "list",
      },
      {
        title: "Checkliste für gute Vereinbarungen",
        content: [
          "Konkret – kein Interpretationsspielraum",
          "Realistisch – beide können die Vereinbarung einhalten",
          "Überprüfbar – klare Kriterien für Erfolg",
          "Ausgewogen – beide Seiten haben etwas gegeben und bekommen",
          "Zukunftsorientiert – was passiert bei Nichteinhaltung?",
        ],
        type: "list",
      },
      {
        title: "Rechtliche Verbindlichkeit",
        content:
          "Eine Mediationsvereinbarung ist zunächst nur ein Vertrag. Für volle Rechtskraft (z.B. vollstreckbarer Titel) ist notarielle Beurkundung oder gerichtliche Protokollierung nötig.",
        type: "text",
        note: "Empfehlen Sie bei größeren Vereinbarungen die Prüfung durch einen Anwalt.",
      },
      {
        title: "Würdigung des Prozesses",
        content:
          "Würdigen Sie die geleistete Arbeit aller Beteiligten. Die Bereitschaft zur Mediation ist ein Zeichen von Stärke, nicht von Schwäche.",
        type: "text",
        highlight: true,
      },
    ],
    nextPhase: null,
    prevPhase: "verhandlung",
  },
];

export function getPhase(key: string): Phase {
  return PHASES.find((p) => p.key === key) ?? PHASES[0];
}

export function getPhaseIndex(key: string): number {
  return PHASES.findIndex((p) => p.key === key);
}
