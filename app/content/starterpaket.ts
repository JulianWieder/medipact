// app/content/starterpaket.ts
//
// Texte der Starterpaket-Sektion (app/components/StarterpaketSection.tsx)
// auf Startseite und /preise. Zahlen nur aus lib/mediatorVermittlung.ts.
//
// Deutsch steht hier, weil es aus den Konstanten gebaut wird – eine Kopie
// in messages/de.json würde beim nächsten Preiswechsel vergessen. Englisch
// liegt in messages/en.json unter home.starter (gleiche Form).

import {
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
  phasen: { title: string; text: string }[];
  name: string;
  preis: string;
  preisHinweis: string;
  punkte: string[];
  danach: string;
  cta: string;
  ctaProfile: string;
};

export const starterpaketInhaltDe: StarterpaketInhalt = {
  eyebrow: "Digital starten, persönlich weiter",
  title: "Erst gemeinsam sortieren.",
  titleHighlight: "Dann mit der Mediatorin Ihrer Wahl weiter.",
  text: "Sie und die andere Seite klären digital, worum es geht und was Ihnen wirklich wichtig ist – jede Seite in ihrem Tempo, ohne Termin. Danach lernen Sie Mediator:innen kennen und übergeben an die Person, die zu Ihnen passt. Sie fängt nicht bei null an.",
  phasen: STARTPAKET_PHASEN,
  name: STARTPAKET_NAME,
  preis: STARTPAKET_PREIS,
  preisHinweis: `Pro Fall, geteilt: ${STARTPAKET_ANTEIL} je Seite – fällig, wenn die andere Seite zusagt`,
  punkte: STARTPAKET_PUNKTE,
  danach: STARTPAKET_DANACH,
  cta: "Starterpaket buchen",
  ctaProfile: "Mediator:innen ansehen und vormerken",
};
