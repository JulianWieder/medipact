"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

export function FadeIn({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.9,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

// ── Reveal ────────────────────────────────────────────────────────────────
// Arbeits-Variante von FadeIn für Dashboard/Logbuch/Fall-Detail.
//
// Gleiche Idee und gleiche Kurve wie auf der Landing, aber bewusst
// zurückhaltender: 8px statt 24px Versatz und 0.45s statt 0.9s. Ein
// Arbeitsbereich wird täglich benutzt – der Marketing-Fade würde dort
// nach dem dritten Mal als Verzögerung wahrgenommen, nicht als Politur.
//
// Zusätzlich zu FadeIn: `prefers-reduced-motion` schaltet die Bewegung ab
// (Inhalt erscheint sofort, ohne Versatz), und `viewport.margin` löst
// leicht vor dem Sichtbarwerden aus, damit beim Scrollen nichts
// "nachklappt".
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.45,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

/** Delay-Helfer für gestaffelte Reveals: `stagger(i)` in einer Liste.
 *  Deckelt bei 6 Schritten, damit lange Listen unten nicht spürbar warten. */
export function stagger(index: number, step = 0.05): number {
  return Math.min(index, 6) * step;
}
