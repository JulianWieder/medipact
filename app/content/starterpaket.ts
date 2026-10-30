// app/content/starterpaket.ts
//
// Texte der Starterpaket-Sektion (app/components/StarterpaketSection.tsx)
// auf Startseite und /preise. Zahlen nur aus lib/mediatorVermittlung.ts.
//
// Deutsch steht hier, weil es aus den Konstanten gebaut wird – eine Kopie
// in messages/de.json würde beim nächsten Preiswechsel vergessen. Englisch
// liegt in messages/en.json unter home.starter (gleiche Form).

import {
  KENNENLERN_ANZAHL,
  KENNENLERN_MINUTEN,
  STARTPAKET_ANTEIL,
  STARTPAKET_DANACH,
  STARTPAKET_NAME,
  STARTPAKET_PHASEN,
  STARTPAKET_PREIS,
  STARTPAKET_PUNKTE,
} from "@/lib/mediatorVermittlung";

export type StarterpaketInhalt = {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  text: string;
  /** Wozu das Paket dient – drei Karten über den Phasen. */
  zweck: { title: string; text: string }[];
  phasen: { title: string; text: string }[];
  /** Leitfaden der Kennenlerngespräche (Checkliste Telefonat, 30.10.2026). */
  gespraech: { title: string; intro: string; punkte: string[] };
  name: string;
  preis: string;
  preisHinweis: string;
  punkte: string[];
  danach: string;
  cta: string;
  ctaProfile: string;
};

export const starterpaketInhaltDe: StarterpaketInhalt = {
  eyebrow: `${STARTPAKET_NAME} · ${STARTPAKET_PREIS} pro Fall`,
  title: "Erst verstehen, wie Mediation arbeitet.",
  titleHighlight: "Dann die Mediatorin wählen, die zu Ihnen passt.",
  text: "Sie wissen noch nicht, welcher Weg zu Ihrem Konflikt passt – oder mit wem Sie ihn gehen wollen? Das Starterpaket ist genau dafür da: Sie erleben die ersten Schritte einer Mediation digital mit der anderen Seite und lernen danach mehrere Mediator:innen persönlich kennen, bevor Sie sich festlegen.",
  zweck: [
    {
      title: "Die Methoden verstehen",
      text: "Einleitung, Themen, Interessen: Sie gehen die ersten Phasen selbst durch und sehen, wie Mediation funktioniert. In den Gesprächen fragen Sie nach, wie die Mediatorin arbeitet – eher strukturierend oder lösungsorientiert, gemeinsam oder in Einzelgesprächen, vor Ort oder per Video.",
    },
    {
      title: "Verschiedene Mediator:innen kennenlernen",
      text: `Bis zu ${KENNENLERN_ANZAHL} Kennenlerngespräche à ${KENNENLERN_MINUTEN} Minuten – mit Profilen, die Sie vorgemerkt haben, oder Mediator:innen, die sich auf Ihren Fall melden. Sie vergleichen und entscheiden erst dann, mit wem Sie weitermachen.`,
    },
    {
      title: "Einschätzen, ob eine Lösung möglich ist",
      text: "Der gemeinsam geklärte Sachverhalt und die ersten Übungen zu Themen und Interessen zeigen, ob zwischen Ihnen eine Lösung erreichbar ist. Eine Einigung entsteht im Starterpaket noch nicht – die erarbeiten Sie danach, auf dem Weg, den Sie wählen.",
    },
  ],
  phasen: STARTPAKET_PHASEN,
  gespraech: {
    title: "Was in einem Kennenlerngespräch passiert",
    intro: `In ${KENNENLERN_MINUTEN} Minuten klären Sie mit der Mediatorin, was Sie für Ihre Entscheidung brauchen. Die Gespräche folgen einem gemeinsamen Leitfaden – so können Sie die Mediator:innen gut miteinander vergleichen.`,
    punkte: [
      "Kurze Vorstellung: wer Sie sind, wozu das Gespräch dient und wie viel Zeit Sie haben",
      "Wie die Mediation abläuft und welche Rolle die Mediatorin darin hat",
      "Die Grundsätze des Verfahrens: Verschwiegenheit, Allparteilichkeit, Neutralität",
      "Was der aktuelle Anlass ist – und was Sie bisher versucht haben, um den Konflikt zu lösen",
      "Wer an der Mediation teilnimmt und ob weitere Personen einbezogen werden sollten",
      "Der Rahmen: online oder vor Ort, Termine und Dauer der Sitzungen",
      "Was die weitere Mediation kostet",
      "Wie es weitergeht, wenn Sie sich für diese Mediatorin entscheiden",
    ],
  },
  name: STARTPAKET_NAME,
  preis: STARTPAKET_PREIS,
  preisHinweis: `Pro Fall, geteilt: ${STARTPAKET_ANTEIL} je Seite – fällig, wenn die andere Seite zusagt`,
  punkte: STARTPAKET_PUNKTE,
  danach: STARTPAKET_DANACH,
  cta: "Starterpaket buchen",
  ctaProfile: "Mediator:innen ansehen und vormerken",
};
