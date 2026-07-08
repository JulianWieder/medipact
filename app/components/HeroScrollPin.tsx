"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import type { StaticImageData } from "next/image";
import { motion, useTransform } from "framer-motion";
import {
  ScrollPinFrame,
  useScrollPin,
} from "@/app/components/ui/ScrollPinSection";
import { HeroBackdrop } from "@/app/components/ui/HeroBackdrop";

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
      {/* Hintergrund (Foto + Gradients + Wirbel) kommt zentral aus HeroBackdrop —
          derselbe Baustein wie in ImagePinHero auf allen Unterseiten. */}
      <HeroBackdrop
        image={heroPhoto}
        imageAlt="Paar in einer Mediationssitzung"
        scale={imageScale}
      />

      {/* Content */}
      <div className="relative flex h-full items-center z-20">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text-Spalte (links) */}
          <div className="max-w-2xl lg:col-span-8">
            <motion.div style={{ opacity: textOpacity, y: textY }}>
              {/* Puristischer Micro-Badge */}
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-accent-300">
                <span>//</span> {t("badge")}
              </div>

              {/* Klare Typografie */}
              <h1 className="mt-4 text-4xl font-black leading-[1.1] tracking-tight text-white sm:text-6xl">
                {t("titleLine1")}{" "}
                <span className="bg-gradient-to-r from-accent-200 via-accent-300 to-accent-400 bg-clip-text text-transparent">
                  {t("titleLine2")}
                </span>
              </h1>

              <p className="mt-6 text-base leading-8 text-neutral-400 sm:text-lg max-w-xl">
                {t("intro")}
              </p>
            </motion.div>

            <motion.div style={{ opacity: ctaOpacity }}>
              {/* Minimalistische Buttons */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <a
                  href="/auth/register"
                  className="inline-flex items-center justify-center rounded-lg bg-accent-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-400 sm:px-8 sm:py-3.5"
                >
                  {t("ctaPrimary")}
                </a>
                <a
                  href="/methode"
                  className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 sm:px-8 sm:py-3.5"
                >
                  {t("ctaSecondary")}
                </a>
              </div>

              {/* Super flache Footer-Labels */}
              <div className="mt-12 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium uppercase tracking-wider text-neutral-600 border-t border-white/5 pt-6">
                {badges.map(({ label }) => (
                  <span key={label}>{label}</span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Platzhalter-Spalte (rechts) - lässt dem Wirbel Raum */}
          <div className="hidden lg:col-span-4 lg:block">
            {/* Hier könnte ein sehr dezentes UI-Element oder Code-Snippet schweben, muss aber nicht. */}
          </div>
        </div>
      </div>
    </ScrollPinFrame>
  );
}
