import { getTranslations } from "next-intl/server";
import { caseStudies } from "@/app/content/caseStudies";

// Outcome-Wand (Palantir-Stil): Beweis durch viele Stimmen mit Ergebnis,
// gespeist aus den bestehenden Fallbeispielen (app/content/caseStudies.tsx).
// Wichtig: Als anonymisierte, exemplarische Fälle gekennzeichnet – keine
// echten Kundenzitate, bis welche vorliegen (dann hier ersetzen).

const WALL: { slug: string; label: string }[] = [
  { slug: "trennung-mit-kindern", label: "Trennung mit Kindern" },
  { slug: "nachbarschaft-laerm", label: "Nachbarschaft · Lärm" },
  { slug: "gesellschafter-streit", label: "Gesellschafterstreit" },
  { slug: "erbstreit-haus-geschwister", label: "Erbschaft" },
  { slug: "trennung-vermoegen-aufteilen", label: "Trennung · Vermögen" },
  { slug: "team-konflikt", label: "Teamkonflikt" },
  { slug: "nachbarschaft-zaun", label: "Nachbarschaft · Grundstück" },
  { slug: "unternehmen-geerbt", label: "Erbschaft · Familie" },
  { slug: "b2b-projektstreit", label: "B2B-Projektstreit" },
];

export default async function OutcomeWand() {
  const t = await getTranslations("home.outcomes");

  const cards = WALL.flatMap(({ slug, label }) => {
    const cs = caseStudies[slug];
    const quote = cs?.quotes?.[0];
    return cs && quote ? [{ slug, label, quote }] : [];
  });

  return (
    <section className="section section-strong border-y border-white/5">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="eyebrow mb-4 justify-center text-accent-300">
            {t("eyebrow")}
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg leading-8 text-neutral-300">{t("intro")}</p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ slug, label, quote }) => (
            <a
              key={slug + quote.author}
              href={`/cases/${slug}`}
              className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-accent-500/40 hover:bg-white/[0.07]"
            >
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent-300">
                  {label}
                </div>
                <blockquote className="mt-4 text-sm leading-6 text-neutral-200 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:6] overflow-hidden">
                  „{quote.text}“
                </blockquote>
              </div>
              <footer className="mt-5 flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-400">
                  {quote.author}
                </span>
                <span className="text-accent-400 opacity-0 transition group-hover:opacity-100">
                  Zum Fall →
                </span>
              </footer>
            </a>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <a
            href="/cases"
            className="text-sm font-semibold text-accent-300 transition hover:text-accent-200"
          >
            {t("link")} →
          </a>
          <p className="max-w-xl text-xs leading-5 text-neutral-500">
            {t("disclaimer")}
          </p>
        </div>
      </div>
    </section>
  );
}
