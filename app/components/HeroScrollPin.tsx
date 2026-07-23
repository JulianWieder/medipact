"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import Image, { type StaticImageData } from "next/image";
import { motion, useTransform } from "framer-motion";
import {
  ScrollPinFrame,
  useScrollPin,
} from "@/app/components/ui/ScrollPinSection";
import { HeroBackdrop } from "@/app/components/ui/HeroBackdrop";
import crest from "@/fotos/medi logo.png";

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
  const crestY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const crestOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);

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
                  {t("titleLine2")}
                </span>
              </h1>

              {/* Kontrast erhöht: text-neutral-400 -> text-neutral-200 */}
              <p className="mt-6 text-base leading-8 text-neutral-200 sm:text-lg max-w-xl">
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

          {/* Wappen-Spalte (rechts) - großes medipact-Wappen */}
          <motion.div
            style={{ opacity: crestOpacity, y: crestY }}
            className="hidden lg:col-span-4 lg:flex lg:justify-center"
          >
            <motion.div
              className="relative"
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* weicher Schein hinter dem Wappen */}
              <div
                aria-hidden
                className="absolute inset-0 -z-10 scale-125 rounded-full bg-accent-500/20 blur-3xl"
              />
              <Image
                src={crest}
                alt="medipact – Wappen"
                priority
                sizes="(min-width: 1024px) 22rem, 0px"
                className="h-auto w-[16rem] xl:w-[22rem] drop-shadow-2xl"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </ScrollPinFrame>
  );
}
