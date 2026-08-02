"use client";

import { useRef } from "react";
import type { StaticImageData } from "next/image";
import { useTransform } from "framer-motion";
import type { ReactNode } from "react";
import { ScrollPinFrame, useScrollPin } from "@/app/components/ui/ScrollPinSection";
import { HeroBackdrop } from "@/app/components/ui/HeroBackdrop";
import { HeroTagline } from "@/app/components/ui/HeroTagline";

/**
 * Standard pattern: full-bleed hero that pins while scrolling and slowly
 * zooms. Hintergrund-Look kommt zentral aus HeroBackdrop (gleicher Baustein
 * wie HeroScrollPin auf der Startseite) — Look-Änderungen dort machen.
 * Genutzt von den Marketing-Seiten (/konflikte, /preise, /karriere,
 * /kontakt, /cases, /ratgeber, /methode und MarketingPageTemplate).
 *
 * Pass the foreground content (eyebrow, h1, intro, CTAs, ...) as children;
 * it's rendered on top, vertically centered in the pinned viewport. For
 * per-element fade/parallax on top of the pin, call useScrollPin directly
 * instead — see HeroScrollPin.tsx.
 *
 * Die laufende Tagline (HeroTagline) wird hier zentral gerendert, damit sie
 * auf allen Unterseiten identisch sitzt — die Seiten selbst müssen nichts
 * tun. Sie liegt bewusst über dem zentrierten Content (top-24, also unter
 * dem fixierten Header) und ist pointer-events-none, damit sie keine Klicks
 * abfängt. Ausschalten mit `tagline={false}`, eigener Text mit
 * `tagline="…"` — Letzteres nur in gut begründeten Ausnahmen: der Satz
 * wirkt gerade dadurch, dass er überall derselbe ist.
 */
export function ImagePinHero({
  id,
  image,
  imageAlt,
  heightVh = 130,
  overlayStrength = "default",
  contentClassName = "",
  tagline,
  children,
}: {
  id?: string;
  image: StaticImageData;
  imageAlt: string;
  /** Total scroll-through height in vh. Bigger = slower/longer pin effect. */
  heightVh?: number;
  /**
   * Historisch (heller Foto-Hero mit Gradient-Overlay). Der Look kommt
   * inzwischen zentral aus HeroBackdrop — Prop bleibt für bestehende
   * Call-Sites akzeptiert, hat aber keine Wirkung mehr.
   */
  overlayStrength?: "default" | "strong";
  contentClassName?: string;
  /** `false` blendet die Laufschrift aus, ein String überschreibt den Satz. */
  tagline?: string | false;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const scrollYProgress = useScrollPin(ref);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  void overlayStrength;

  return (
    <ScrollPinFrame ref={ref} id={id} heightVh={heightVh} className="bg-neutral-950">
      <HeroBackdrop image={image} imageAlt={imageAlt} scale={imageScale} />

      {tagline !== false && (
        <div className="pointer-events-none absolute inset-x-0 top-24 z-20">
          <HeroTagline {...(typeof tagline === "string" ? { text: tagline } : {})} />
        </div>
      )}

      <div className={`relative z-20 flex h-full items-center ${contentClassName}`}>
        {children}
      </div>
    </ScrollPinFrame>
  );
}
