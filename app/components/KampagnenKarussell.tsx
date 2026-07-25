"use client";

// Kampagnen-Karussell (Palantir-Stil): benannte "Missionen" statt Feature-Grid.
// Karten + Copy liegen in messages/*.json unter home.kampagnen.
// Neue Angebote werden als weitere Karte im JSON ergänzt – kein Code-Umbau nötig.

import { useRef } from "react";
import { useTranslations } from "next-intl";

type KampagnenCard = {
  tag: string;
  title: string;
  text: string;
  href: string;
  cta: string;
};

export default function KampagnenKarussell() {
  const t = useTranslations("home.kampagnen");
  const cards = t.raw("cards") as KampagnenCard[];
  const startCta = t("startCta");
  const learnCta = t("learnCta");
  const scroller = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section aria-label={t("title")} className="section overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="eyebrow mb-4">{t("eyebrow")}</div>
            <h2 className="heading-2">{t("title")}</h2>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="Zurück"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition hover:border-accent-300 hover:text-accent-700"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="Weiter"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition hover:border-accent-300 hover:text-accent-700"
            >
              →
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scroller}
        className="mx-auto mt-10 flex max-w-7xl snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 lg:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {cards.map((card, i) => (
          <div
            key={card.tag}
            data-card
            className="group relative flex w-[85%] max-w-sm flex-none snap-start flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-accent-200 hover:shadow-lg sm:w-[45%] lg:w-[30%]"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center rounded-full bg-accent-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-accent-700">
                  {card.tag}
                </span>
                <span className="text-xs font-semibold tracking-widest text-neutral-300">
                  /{String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-5 text-xl font-black leading-snug tracking-tight text-neutral-900">
                {card.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-neutral-600">
                {card.text}
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <a
                href={`/auth/register?anlass=${card.href.split("/").pop()}`}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-accent-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-500 active:scale-[0.98]"
              >
                {startCta} →
              </a>
              <a
                href={card.href}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-700 transition hover:gap-2.5"
              >
                {learnCta} →
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
