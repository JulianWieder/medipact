"use client";

import { useState } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { TabSwitcher, CrossfadePanel } from "@/app/components/ui/TabSwitcher";
import { FeatureCard } from "@/app/components/ui/FeatureCard";
import { trennungPageContent } from "@/app/content/trennungPage";
import { nachbarschaftPageContent } from "@/app/content/nachbarschaftPage";
import { erbschaftPageContent } from "@/app/content/erbschaftPage";
import { odrPageContent } from "@/app/content/odrPage";
import { verbraucherPageContent } from "@/app/content/verbraucherPage";
import { mietverhaeltnisPageContent } from "@/app/content/mietverhaeltnisPage";
import { arbeitsplatzPageContent } from "@/app/content/arbeitsplatzPage";
import trennungPhoto from "../../fotos/medi_trennung.jpg";
import nachbarnPhoto from "../../fotos/medi_nachbarn.jpg";
import erbschaftPhoto from "../../fotos/medi_Erbe.jpg";
import geschaeftPhoto from "../../fotos/medi_buiness.jpg";
import verbraucherPhoto from "../../fotos/kosten.jpg";
import mietPhoto from "../../fotos/medi_modern.jpg";
import arbeitsplatzPhoto from "../../fotos/medi_karriere.jpg";

type ThemaContent = {
  eyebrow: string;
  title: string;
  intro: string;
  features: { title: string; text: string }[];
};

type Thema = {
  key: string;
  href: string;
  image: StaticImageData;
  content: ThemaContent;
};

// Tab-Labels stehen in messages/*.json unter home.themen.tabs. Die
// Tab-Inhalte kommen auf Deutsch aus den Content-Dateien der Detailseiten
// (eine Quelle); eine Sprache ohne eigene Detailseiten-Inhalte (en) legt
// eyebrow/title/intro/features direkt im Tab-Eintrag ab und überschreibt so.
type ThemaMessages = { key: string; label: string } & Partial<ThemaContent>;

const themen: Thema[] = [
  {
    key: "trennung",
    href: "/scheidungsmediation",
    image: trennungPhoto,
    content: trennungPageContent,
  },
  {
    key: "nachbarschaft",
    href: "/konflikte/nachbarschaft",
    image: nachbarnPhoto,
    content: nachbarschaftPageContent,
  },
  {
    key: "erbschaft",
    href: "/konflikte/erbschaft",
    image: erbschaftPhoto,
    content: erbschaftPageContent,
  },
  {
    key: "odr",
    href: "/konflikte/odr",
    image: geschaeftPhoto,
    content: odrPageContent,
  },
  {
    key: "verbraucher",
    href: "/konflikte/verbraucher",
    image: verbraucherPhoto,
    content: verbraucherPageContent,
  },
  {
    key: "mietverhaeltnis",
    href: "/konflikte/mietverhaeltnis",
    image: mietPhoto,
    content: mietverhaeltnisPageContent,
  },
  {
    key: "arbeitsplatz",
    href: "/konflikte/arbeitsplatz",
    image: arbeitsplatzPhoto,
    content: arbeitsplatzPageContent,
  },
];

/**
 * Homepage "Themen" section, built on the standard TabSwitcher +
 * CrossfadePanel pattern (see app/components/ui/TabSwitcher.tsx).
 * Page-specific part is just the tab list/content + the two-panel
 * (image + text) layout.
 */
export function ThemenTabs() {
  const t = useTranslations("home.themen");
  const tabMessages = t.raw("tabs") as ThemaMessages[];
  const [active, setActive] = useState(0);
  const tabs = themen.map((thema) => {
    const m = tabMessages.find((tab) => tab.key === thema.key);
    return {
      ...thema,
      label: m?.label ?? thema.key,
      content: {
        eyebrow: m?.eyebrow ?? thema.content.eyebrow,
        title: m?.title ?? thema.content.title,
        intro: m?.intro ?? thema.content.intro,
        features: m?.features ?? thema.content.features,
      },
    };
  });
  const thema = tabs[active];

  return (
    <section className="section section-muted border-y border-neutral-200">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <div className="eyebrow mb-4">{t("eyebrow")}</div>
          <h2 className="heading-2">{t("title")}</h2>
        </div>

        <TabSwitcher
          ariaLabel={t("ariaLabel")}
          tabs={tabs.map((tab) => ({ key: tab.key, label: tab.label }))}
          activeIndex={active}
          onChange={setActive}
        />

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
            <CrossfadePanel activeKey={thema.key}>
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
                {/* max. 3 Karten im Tab – die volle Liste steht auf der Detailseite */}
                {thema.content.features.slice(0, 3).map((f) => (
                  <FeatureCard key={f.title} title={f.title} text={f.text} />
                ))}
              </div>

              <Link
                href={thema.href}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent-700 hover:underline"
              >
                {t("moreLink", { label: thema.label })} →
              </Link>
            </CrossfadePanel>
          </div>
        </div>
      </div>
    </section>
  );
}
