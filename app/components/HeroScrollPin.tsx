"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import Image, { type StaticImageData } from "next/image";
import { motion, useTransform } from "framer-motion";
import { FadeIn } from "@/app/components/ui/motion";
import { ScrollPinFrame, useScrollPin } from "@/app/components/ui/ScrollPinSection";

/**
 * Homepage hero, built on the standard ScrollPinFrame/useScrollPin pattern
 * (see app/components/ui/ScrollPinSection.tsx). Page-specific part is
 * just the layout + which values fade/zoom on which schedule. Copy lives
 * in messages/*.json under "home.hero" (see migration-notes.md).
 */
export function HeroScrollPin({ heroPhoto }: { heroPhoto: StaticImageData }) {
  const ref = useRef<HTMLDivElement>(null);
  const scrollYProgress = useScrollPin(ref);
  const t = useTranslations("home.hero");
  const badges = [
    { label: t("badgeVertraulich"), color: "bg-accent-300" },
    { label: t("badgeBezahlbar"), color: "bg-accent-300" },
    { label: t("badgeLoesungsorientiert"), color: "bg-accent-300" },
  ];

  // Eyebrow + headline fade and drift up first...
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -36]);
  // ...CTAs + trust badges stay legible a little longer.
  const ctaOpacity = useTransform(scrollYProgress, [0.15, 0.6], [1, 0]);
  // The image itself slowly zooms while pinned.
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <ScrollPinFrame ref={ref} id="top" heightVh={150} className="scroll-mt-20">
      <motion.div className="absolute inset-0" style={{ scale: imageScale }}>
        <Image
          src={heroPhoto}
          alt="Paar in einer Mediationssitzung – Weg zur Einigung"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-950/60 to-neutral-950/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent" />

      <div className="relative flex h-full items-center">
        <div className="mx-auto w-full max-w-7xl px-6 py-10 sm:py-20 lg:px-8">
          <div className="max-w-2xl">
            <motion.div style={{ opacity: textOpacity, y: textY }}>
              <div className="inline-flex items-center gap-2 rounded border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-white/80 backdrop-blur-sm">
                {t("badge")}
              </div>

              <p className="mt-4 text-xs font-bold uppercase tracking-[0.3em] text-accent-300 sm:mt-6">
                {t("tagline")}
              </p>

              <FadeIn>
                <h1 className="mt-3 text-3xl font-black leading-[1.1] tracking-tight text-white sm:mt-4 sm:text-5xl">
                  {t("titleLine1")}
                  <span className="block bg-gradient-to-r from-accent-200 via-accent-300 to-accent-400 bg-clip-text text-transparent pb-2">
                    {t("titleLine2")}
                  </span>
                </h1>
              </FadeIn>

              <FadeIn delay={0.1}>
                <p className="mt-3 max-w-xl text-base leading-7 text-neutral-200 sm:mt-6 sm:text-lg sm:leading-8">
                  {t("intro")}
                </p>
              </FadeIn>
            </motion.div>

            <motion.div style={{ opacity: ctaOpacity }}>
              <div className="mt-6 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:gap-4">
                {/* /auth and /methode are both outside the [locale] segment
                    (only "/" and "/konflikte/trennung" are migrated — see
                    isMigratedLocalePath in i18n/routing.ts), so plain <a>
                    tags are correct here, not the locale-aware Link. */}
                <a
                  href="/auth/register"
                  className="inline-flex items-center justify-center rounded-2xl bg-accent-500 px-6 py-3.5 text-sm font-bold text-white transition hover:scale-[1.02] hover:bg-accent-400 sm:px-8 sm:py-4"
                >
                  {t("ctaPrimary")}
                </a>
                <a
                  href="/methode"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/50 hover:bg-white/20 sm:px-8 sm:py-4"
                >
                  {t("ctaSecondary")}
                </a>
              </div>

              <div className="mt-5 hidden flex-wrap gap-3 text-sm text-white/90 sm:mt-8 sm:flex">
                {badges.map(({ label, color }) => (
                  <div
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm"
                  >
                    <span className={`h-2 w-2 rounded-full ${color}`} />
                    {label}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </ScrollPinFrame>
  );
}
