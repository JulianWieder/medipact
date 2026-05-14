export type PhaseKey =
  | "einleitung"
  | "themensammlung"
  | "interessen"
  | "optionen"
  | "verhandlung"
  | "abschluss";

export interface Phase {
  key: PhaseKey;
  label: string;
  shortLabel: string;
  steps: string[];
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
