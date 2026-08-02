import type { ReactNode } from "react";

/**
 * Standard pattern: ruhige Laufschrift im Hero ("Mantra-Band").
 *
 * Ein einziger Satz, endlos wiederholt, langsam nach links laufend — die
 * entschaerfte Variante des Ribbit-Effekts: Wiederholung statt verdrehter
 * Buchstaben. Traegt Haltung, ohne Unruhe ins Layout zu bringen.
 *
 * Der Satz ist bewusst auf ALLEN Unterseiten derselbe: er wirkt nur als
 * Wiedererkennungszeichen, wenn er sich nicht pro Seite aendert. Zum
 * Aendern genau eine Stelle anfassen: HERO_TAGLINE hier drunter.
 *
 * Barrierefreiheit: das Band ist aria-hidden. Der Satz ist Deko-
 * Wiederholung — ein Screenreader wuerde ihn sonst achtmal vorlesen.
 * Die Aussage der Seite steht in H1 und Intro.
 *
 * Bewegung: bei prefers-reduced-motion und auf Mobil steht das Band still
 * (siehe .hero-tagline-track in globals.css).
 *
 * Wird zentral von ImagePinHero gerendert — auf den Unterseiten also
 * nichts zu tun. Einzeln einsetzbar ueber <HeroTagline /> in einem
 * relativ positionierten Container.
 */
export const HERO_TAGLINE =
  "Sie entscheiden. Nicht das Gericht. Nicht die Eskalation.";

/** Anzahl Kopien je Haelfte des Tracks. Der Track enthaelt 2x davon,
 *  damit die Animation bei translateX(-50%) nahtlos umspringt. */
const COPIES_PER_HALF = 4;

export function HeroTagline({
  text = HERO_TAGLINE,
  className = "",
}: {
  text?: string;
  className?: string;
}) {
  const items: ReactNode[] = [];
  for (let i = 0; i < COPIES_PER_HALF * 2; i++) {
    items.push(
      <span key={i} className="hero-tagline-item">
        {text}
      </span>
    );
  }

  return (
    <div aria-hidden="true" className={`hero-tagline ${className}`}>
      <div className="hero-tagline-track">{items}</div>
    </div>
  );
}
