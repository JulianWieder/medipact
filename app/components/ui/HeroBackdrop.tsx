"use client";

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
  scale?: MotionValue<number>;
}) {
  return (
    <>
      {/* 1. Foto – Klar und hell */}
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
          className="opacity-100"
        />
      </motion.div>

      {/* 2. Lesbarkeits-Gradient links – JETZT KRÄFTIGER FÜR DIE SCHRIFT */}
      {/* Startet bei 60% Schwarz links und blendet schnell aus, damit das Bild in der Mitte hell bleibt */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-neutral-950/60 via-neutral-950/20 to-transparent pointer-events-none" />

      {/* 3. Vertikaler Fade nach unten */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent pointer-events-none" />

      {/* 4. Stripe-Wirbel – MEHR KONTRAST & SCHNELLERE BEWEGUNG */}
      {/* - `mix-blend-screen` sorgt dafür, dass die Farben auf hellem Grund nicht ausbrennen */}
      {/* - `animate-[spin_8s_linear_infinite]` (oder pulse) beschleunigt die CSS-Standard-Drehung */}
      <div className="absolute right-[-20%] top-[-10%] z-10 h-[120%] w-[85%] opacity-95 pointer-events-none mix-blend-screen blur-xl animate-[spin_10s_linear_infinite]">
        <GradientSwirl className="h-full w-full" />
      </div>
    </>
  );
}
