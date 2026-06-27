"use client";

import { useState } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { trennungPageContent } from "@/app/content/trennungPage";
import { nachbarschaftPageContent } from "@/app/content/nachbarschaftPage";
import { erbschaftPageContent } from "@/app/content/erbschaftPage";
import trennungPhoto from "../../fotos/trennung.jpg";
import nachbarnPhoto from "../../fotos/nachbarn.png";
import erbschaftPhoto from "../../fotos/erbschaft-familie.jpg";

type ThemaContent = {
  eyebrow: string;
  title: string;
  intro: string;
  features: { title: string; text: string }[];
};

type Thema = {
  key: string;
  label: string;
  href: string;
  image: StaticImageData;
  content: ThemaContent;
};

const themen: Thema[] = [
  {
    key: "trennung",
    label: "Trennung",
    href: "/konflikte/trennung",
    image: trennungPhoto,
    content: trennungPageContent,
  },
  {
    key: "nachbarschaft",
    label: "Nachbarschaft",
    href: "/konflikte/nachbarschaft",
    image: nachbarnPhoto,
    content: nachbarschaftPageContent,
  },
  {
    key: "erbschaft",
    label: "Erbschaft",
    href: "/konflikte/erbschaft",
    image: erbschaftPhoto,
    content: erbschaftPageContent,
  },
];

export function ThemenTabs() {
  const [active, setActive] = useState(0);
  const thema = themen[active];

  return (
    <section className="section section-muted border-y border-neutral-200">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <div className="eyebrow mb-4">Ihr Thema</div>
          <h2 className="heading-2">Wofür medipact gemacht ist.</h2>
        </div>

        {/* Tab bar */}
        <div
          role="tablist"
          aria-label="Konfliktthemen"
          className="mb-10 flex flex-wrap gap-2 sm:gap-3"
        >
          {themen.map((t, i) => {
            const isActive = i === active;
            return (
              <button
                key={t.key}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(i)}
                className={`rounded-xl border px-5 py-3 text-sm font-semibold uppercase tracking-wide transition ${
                  isActive
                    ? "border-accent-500 bg-accent-50 text-accent-700"
                    : "border-neutral-200 bg-white text-neutral-400 hover:border-neutral-300 hover:text-neutral-700"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Content panel */}
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16">
          <div
            className="relative mx-auto w-full max-w-xl overflow-hidden rounded-[2rem] border border-neutral-200 shadow-xl shadow-neutral-900/5"
            style={{ aspectRatio: "4/3" }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={thema.key}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.03 }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={thema.image}
                  alt={thema.content.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 576px"
                  style={{ objectFit: "cover" }}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative min-h-[360px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={thema.key}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-accent-700">
                  {thema.content.eyebrow}
                </div>
                <h3 className="mt-3 text-xl font-bold text-neutral-900 sm:text-2xl">
                  {thema.content.title}
                </h3>
                <p className="mt-4 leading-relaxed text-neutral-600">
                  {thema.content.intro}
                </p>

                <div className="mt-6 grid gap-3">
                  {thema.content.features.map((f) => (
                    <div key={f.title} className="app-surface p-4 sm:p-5">
                      <p className="text-sm font-semibold text-neutral-900">
                        {f.title}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-neutral-600">
                        {f.text}
                      </p>
                    </div>
                  ))}
                </div>

                <Link
                  href={thema.href}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent-700 hover:underline"
                >
                  Mehr zu {thema.label} →
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
