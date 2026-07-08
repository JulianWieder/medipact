"use client";

// ── Zentraler Hero-Hintergrund ("Dark Hero") ─────────────────────────────────
//
// DER eine Baustein für alle Bild-Heros: gedimmtes Foto + Lesbarkeits-
// Gradient links + Fade nach unten + Gradient-Wirbel rechts. Wird von
// HeroScrollPin (Startseite) und ImagePinHero (alle Marketing-Seiten)
// verwendet — Look-Änderungen bitte NUR hier machen, nicht in den Heros.
//
// Erwartet einen relativen, dunklen Container (bg-neutral-950) drumherum;
// der eigentliche Hero-Content gehört als Geschwister-Element mit z-20 darüber.

import Image, { type StaticImageData } from "next/image";
import { motion, type MotionValue } from "framer-motion";
import { GradientSwirl } from "@/app/components/ui/GradientSwirl";

export function HeroBackdrop({
  image,
  imageAlt,
  scale,
}: {
  image: StaticImageData;
  imageAlt: string;
  /** Optionaler Scroll-Zoom (MotionValue), z.B. aus useScrollPin. */
  scale?: MotionValue<number>;
}) {
  return (
    <>
      {/* 1. Foto – gedimmt und entsättigt, aber erkennbar */}
      <motion.div
        className="absolute inset-0"
        style={scale ? { scale } : undefined}
      >
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover" }}
          className="opacity-40 brightness-[0.75] contrast-[0.9] saturate-[0.35]"
        />
      </motion.div>

      {/* 2. Lesbarkeits-Gradient links (Text liegt links) */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-neutral-950/85 via-neutral-950/50 to-neutral-950/20 pointer-events-none" />

      {/* 3. Vertikaler Fade nach unten für sauberen Übergang */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-neutral-950 via-transparent to-transparent pointer-events-none" />

      {/* 4. Weicher Gradient-Wirbel rechts (Farbakzent) */}
      <div className="absolute right-[-25%] top-[-10%] z-10 h-[120%] w-[85%] opacity-70 pointer-events-none mix-blend-plus-lighter blur-2xl">
        <GradientSwirl className="h-full w-full" />
      </div>
    </>
  );
}
