"use client";

import { useRef } from "react";
import Link from "next/link";
import Image, { type StaticImageData } from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { FadeIn } from "@/app/components/ui/motion";

export function HeroScrollPin({ heroPhoto }: { heroPhoto: StaticImageData }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Eyebrow + headline fade and drift up as the user scrolls through the hero.
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -36]);
  // CTAs + trust badges stay legible a bit longer, like the rest of the page
  // catching up to the pinned image.
  const ctaOpacity = useTransform(scrollYProgress, [0.15, 0.6], [1, 0]);
  // The image itself slowly zooms while pinned, echoing ai.gov's hero.
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative isolate overflow-hidden scroll-mt-20"
      style={{ height: "150vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
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
          <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:py-20 lg:px-8">
            <div className="max-w-2xl">
              <motion.div style={{ opacity: textOpacity, y: textY }}>
                <div className="inline-flex items-center gap-2 rounded border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-white/80 backdrop-blur-sm">
                  Für Trennung, Nachbarschaft und Erbe
                </div>

                <p className="mt-6 text-xs font-bold uppercase tracking-[0.3em] text-accent-300">
                  Es ist Ihre Lösung. Nicht der Streit.
                </p>

                <FadeIn>
                  <h1 className="mt-4 text-4xl font-black leading-[1.1] tracking-tight text-white sm:text-5xl">
                    Mediation online –
                    <span className="block bg-gradient-to-r from-accent-200 via-accent-300 to-accent-400 bg-clip-text text-transparent pb-2">
                      Konflikte fair, vertraulich und ohne Gericht lösen.
                    </span>
                  </h1>
                </FadeIn>

                <FadeIn delay={0.1}>
                  <p className="mt-6 max-w-xl text-lg leading-8 text-neutral-200">
                    Wenn Worte nicht mehr weiterhelfen, hilft Struktur.
                    Medipact begleitet Sie bei Scheidung, Nachbarschaftsstreit
                    oder Erbe – Schritt für Schritt zurück zu einem klaren
                    Kopf und einer Lösung, mit der beide Seiten leben können.
                  </p>
                </FadeIn>
              </motion.div>

              <motion.div style={{ opacity: ctaOpacity }}>
                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                  <Link
                    href="/auth/register"
                    className="inline-flex items-center justify-center rounded-2xl bg-accent-500 px-8 py-4 text-sm font-bold text-white transition hover:scale-[1.02] hover:bg-accent-400"
                  >
                    Kostenlosen Account erstellen
                  </Link>
                  <a
                    href="#process"
                    className="inline-flex items-center justify-center rounded-2xl border border-white/30 bg-white/10 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/50 hover:bg-white/20"
                  >
                    So funktioniert es
                  </a>
                </div>

                <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/90">
                  {[
                    { label: "Vertraulich", color: "bg-accent-300" },
                    { label: "Bezahlbar", color: "bg-accent-300" },
                    { label: "Lösungsorientiert", color: "bg-accent-300" },
                  ].map(({ label, color }) => (
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
      </div>
    </section>
  );
}
