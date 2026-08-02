"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { type StaticImageData } from "next/image";
import { motion, useTransform } from "framer-motion";
import {
  ScrollPinFrame,
  useScrollPin,
} from "@/app/components/ui/ScrollPinSection";
import { HeroBackdrop } from "@/app/components/ui/HeroBackdrop";
import { HeroTagline } from "@/app/components/ui/HeroTagline";
import { TiltLastWord } from "@/app/components/ui/TiltWord";

export function HeroScrollPin({ heroPhoto }: { heroPhoto: StaticImageData }) {
  const ref = useRef<HTMLDivElement>(null);
  const scrollYProgress = useScrollPin(ref);
  const t = useTranslations("home.hero");
  const badges = [
    { label: t("badgeVertraulich") },
    { label: t("badgeBezahlbar") },
    { label: t("badgeLoesungsorientiert") },
  ];

  const textOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.4], [0, -20]);
  const ctaOpacity = useTransform(scrollYProgress, [0.1, 0.5], [1, 0]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  return (
    <ScrollPinFrame
      ref={ref}
      id="top"
      heightVh={150}
      className="scroll-mt-20 bg-neutral-950"
    >
      {/* Hintergrund (Foto + Gradients + Wirbel) kommt zentral aus HeroBackdrop */}
      <HeroBackdrop
        image={heroPhoto}
        imageAlt="Paar in einer Mediationssitzung"
        scale={imageScale}
      />

      {/* Laufschrift wie auf allen Unterseiten (ImagePinHero rendert sie dort
          zentral). Hier haendisch, weil dieser Hero eigene Scroll-Transforms
          hat: sie fadet mit dem uebrigen Text weg statt stehen zu bleiben. */}
      <motion.div
        style={{ opacity: textOpacity }}
        className="pointer-events-none absolute inset-x-0 top-24 z-20"
      >
        <HeroTagline />
      </motion.div>

      {/* Content */}
      <div className="relative flex h-full items-center z-20">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text-Spalte (links) */}
          <div className="max-w-2xl lg:col-span-8">
            <motion.div style={{ opacity: textOpacity, y: textY }}>
              {/* Puristischer Micro-Badge - Akzentfarbe leicht verstärkt für Lesbarkeit */}
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-accent-400">
                <span className="text-neutral-500">//</span> {t("badge")}
              </div>

              {/* Klare Typografie */}
              <h1 className="mt-4 text-4xl font-black leading-[1.1] tracking-tight text-white sm:text-6xl">
                {t("titleLine1")}{" "}
                <span className="bg-gradient-to-r from-accent-200 via-accent-300 to-accent-400 bg-clip-text text-transparent">
                  <TiltLastWord className="bg-gradient-to-r from-accent-200 via-accent-300 to-accent-400 bg-clip-text text-transparent">
                    {t("titleLine2")}
                  </TiltLastWord>
                </span>
              </h1>

              {/* Keyword-Subline: trägt "Online-Mediation" für SEO direkt unter der H1 */}
              <p className="mt-4 text-lg font-semibold leading-snug text-neutral-100 sm:text-2xl max-w-xl">
                {t("subline")}
              </p>

              {/* Kontrast erhöht: text-neutral-400 -> text-neutral-200 */}
              <p className="mt-5 text-base leading-8 text-neutral-200 sm:text-lg max-w-xl">
                {t("intro")}
              </p>
            </motion.div>

            <motion.div style={{ opacity: ctaOpacity }}>
              {/* Buttons mit geschärften Kontrasten */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <a
                  href="/auth/register"
                  className="inline-flex items-center justify-center rounded-lg bg-accent-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-400 active:scale-[0.98] sm:px-8 sm:py-3.5"
                >
                  {t("ctaPrimary")}
                </a>
                {/* Sekundärer Button: Sichtbarkeit durch stärkere Border und Opacity erhöht */}
                <a
                  href="/methode"
                  className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20 hover:border-white/30 active:scale-[0.98] sm:px-8 sm:py-3.5"
                >
                  {t("ctaSecondary")}
                </a>
              </div>

              {/* Footer-Labels: Trennlinie und Text deutlich sichtbarer gemacht */}
              <div className="mt-12 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium uppercase tracking-wider text-neutral-400 border-t border-white/10 pt-6">
                {badges.map(({ label }) => (
                  <span
                    key={label}
                    className="hover:text-neutral-200 transition-colors"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll-Cue unten (Palantir-Stil: „Scroll to Explore") */}
      <motion.div
        style={{ opacity: ctaOpacity }}
        className="pointer-events-none absolute inset-x-0 bottom-6 z-20 flex items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400"
      >
        <span>{t("scrollCue")}</span>
        <svg
          className="h-3.5 w-3.5 animate-bounce"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7-7-7M12 3v18" />
        </svg>
      </motion.div>
    </ScrollPinFrame>
  );
}
