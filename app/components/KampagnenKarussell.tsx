"use client";

// Kampagnen-Sektion: die vier Konflikt-Typen als benannte "Missionen",
// immer alle gleichzeitig sichtbar (Raster statt Karussell, 4 Spalten ab lg).
// Karten + Copy liegen in messages/*.json unter home.kampagnen. Bewusst bei
// vier Karten bleiben: eine fünfte bricht das Raster. ODR hat keine eigene
// Karte, „Wirtschaft" führt über /konflikte/geschaeft (Redirect) schon
// dorthin; der href bleibt geschaeft, weil daraus der `anlass` entsteht.

import { REGISTRIEREN_URL } from "@/lib/nutzerbereich";
import { LocaleLink } from "@/app/components/ui/LocaleLink";
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

  return (
    <section aria-label={t("title")} className="section">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="eyebrow mb-4">{t("eyebrow")}</div>
        <h2 className="heading-2">{t("title")}</h2>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, i) => (
            <div
              key={card.tag}
              className="group relative flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-accent-200 hover:shadow-lg"
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
                  href={`${REGISTRIEREN_URL}?anlass=${card.href.split("/").pop()}`}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-accent-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-500 active:scale-[0.98]"
                >
                  {startCta} →
                </a>
                <LocaleLink
                  href={card.href}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-700 transition hover:gap-2.5"
                >
                  {learnCta} →
                </LocaleLink>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
