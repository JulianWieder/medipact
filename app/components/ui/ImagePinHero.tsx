"use client";

import { useRef } from "react";
import Image, { type StaticImageData } from "next/image";
import { motion, useTransform } from "framer-motion";
import type { ReactNode } from "react";
import { ScrollPinFrame, useScrollPin } from "@/app/components/ui/ScrollPinSection";

/**
 * Standard pattern: full-bleed image hero that pins while scrolling and
 * slowly zooms (ai.gov-style). Thin wrapper around ScrollPinFrame/useScrollPin
 * for the "background photo + gradient overlay + headline" hero used across
 * medipact's marketing pages (homepage, /konflikte, /preise, /karriere,
 * /kontakt, /cases, and the konflikte sub-pages via MarketingPageTemplate).
 *
 * Pass the foreground content (eyebrow, h1, intro, CTAs, ...) as children;
 * it's rendered on top of the image/gradient, vertically centered in the
 * pinned viewport. For per-element fade/parallax on top of the pin (like
 * the homepage hero's staggered text fade), call useScrollPin directly
 * instead — see HeroScrollPin.tsx.
 */
export function ImagePinHero({
  id,
  image,
  imageAlt,
  heightVh = 130,
  overlayStrength = "default",
  contentClassName = "",
  children,
}: {
  id?: string;
  image: StaticImageData;
  imageAlt: string;
  /** Total scroll-through height in vh. Bigger = slower/longer pin effect. */
  heightVh?: number;
  /** "strong" = darker/wider gradient, for centered/short copy (e.g. /kontakt). */
  overlayStrength?: "default" | "strong";
  contentClassName?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const scrollYProgress = useScrollPin(ref);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <ScrollPinFrame ref={ref} id={id} heightVh={heightVh}>
      <motion.div className="absolute inset-0" style={{ scale: imageScale }}>
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
      </motion.div>
      <div
        className={
          overlayStrength === "strong"
            ? "absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-950/70 to-neutral-950/40"
            : "absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-950/60 to-neutral-950/20"
        }
      />
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent" />

      <div className={`relative flex h-full items-center ${contentClassName}`}>
        {children}
      </div>
    </ScrollPinFrame>
  );
}
