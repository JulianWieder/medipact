import { getTranslations } from "next-intl/server";

// Zwei-Welten-Split (Palantir-Stil Government/Commercial):
// Privat vs. Unternehmen als zwei klar getrennte Pfade früh auf der Seite.

type Welt = {
  kicker: string;
  title: string;
  text: string;
  ctaLabel: string;
  ctaHref: string;
};

function WeltCard({ welt, dark }: { welt: Welt; dark?: boolean }) {
  return (
    <a
      href={welt.ctaHref}
      className={
        dark
          ? "group flex flex-col justify-between rounded-3xl border border-neutral-800 bg-neutral-950 p-8 transition hover:border-accent-500/50 sm:p-10"
          : "group flex flex-col justify-between rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm transition hover:border-accent-300 hover:shadow-lg sm:p-10"
      }
    >
      <div>
        <div
          className={
            "text-xs font-bold uppercase tracking-[0.2em] " +
            (dark ? "text-accent-400" : "text-accent-700")
          }
        >
          {welt.kicker}
        </div>
        <h3
          className={
            "mt-4 text-2xl font-black tracking-tight sm:text-3xl " +
            (dark ? "text-white" : "text-neutral-900")
          }
        >
          {welt.title}
        </h3>
        <p
          className={
            "mt-4 text-base leading-7 " +
            (dark ? "text-neutral-300" : "text-neutral-600")
          }
        >
          {welt.text}
        </p>
      </div>
      <span
        className={
          "mt-8 inline-flex items-center gap-1.5 text-sm font-semibold transition group-hover:gap-2.5 " +
          (dark ? "text-accent-300" : "text-accent-700")
        }
      >
        {welt.ctaLabel} →
      </span>
    </a>
  );
}

export default async function ZweiWelten() {
  const t = await getTranslations("home.zweiWelten");
  const privat = t.raw("privat") as Welt;
  const business = t.raw("business") as Welt;

  return (
    <section className="section">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="eyebrow mb-4 justify-center">{t("eyebrow")}</div>
          <h2 className="heading-2">{t("title")}</h2>
          <p className="mt-4 text-lg leading-8 text-neutral-700">{t("intro")}</p>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <WeltCard welt={privat} />
          <WeltCard welt={business} dark />
        </div>
      </div>
    </section>
  );
}
