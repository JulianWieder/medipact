import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { JsonLd } from "@/app/components/JsonLd";
import { HeroScrollPin } from "@/app/components/HeroScrollPin";
import { ThemenTabs } from "@/app/components/ThemenTabs";
import { EmpfehlungenGrid } from "@/app/components/EmpfehlungenGrid";
import { DidYouKnowSection } from "@/app/components/ui/DidYouKnowSection";
import type { Metadata } from "next";
import heroPhoto from "../../fotos/medi_main.jpg";

// Body copy lives in messages/*.json under "home" (see migration-notes.md
// for the lift-into-translations pattern used here and in HeroScrollPin).

export const metadata: Metadata = {
  title:
    "medipact – Mediation online: Konflikte fair, vertraulich und ohne Gericht lösen",
  description:
    "Mediation online – Konflikte fair, vertraulich und ohne Gericht lösen. Medipact hilft bei Trennung, Nachbarschaftsstreit und Erbschaft nach dem Harvard-Prinzip.",
  alternates: {
    canonical: "https://medipact.de",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "KI-Mediation",
  provider: {
    "@type": "Organization",
    name: "medipact",
    url: "https://medipact.de",
  },
  serviceType: "Mediation",
  description:
    "KI-gestützte Mediation für private Konflikte bei Trennung, Scheidung, Nachbarschaftsstreit und Erbschaft. Nach dem Harvard-Prinzip.",
  areaServed: {
    "@type": "Country",
    name: "Germany",
  },
  availableLanguage: "German",
  url: "https://medipact.de",
  offers: {
    "@type": "Offer",
    priceCurrency: "EUR",
    price: "499",
    description: "KI-Mediation ab €499",
  },
};

export default async function MedipactLanding() {
  const t = await getTranslations("home");
  const stats = t.raw("stats") as { value: string; label: string }[];
  const bekanntAusTags = t.raw("bekanntAusTags") as string[];

  return (
    <>
      <JsonLd data={serviceSchema} />
      <main className="app-shell pt-0 sm:pt-[73px]">
        <HeroScrollPin heroPhoto={heroPhoto} />

        <section className="border-b border-neutral-100 bg-white py-10">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-xl font-black text-accent-700">
                    {s.value}
                  </div>
                  <div className="mt-0.5 text-xs leading-snug text-neutral-500">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-neutral-100 bg-neutral-50 py-5">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-neutral-500 sm:gap-x-10">
              <span className="font-semibold text-neutral-700">
                {t("bekanntAusLabel")}
              </span>
              {bekanntAusTags.map((tag, index) => (
                <span key={tag} className="flex items-center gap-x-6 sm:gap-x-10">
                  {index === 0 && (
                    <span className="font-semibold tracking-tight text-neutral-400">
                      {tag}
                    </span>
                  )}
                  {index > 0 && (
                    <>
                      <span className="text-neutral-300">·</span>
                      <span className="font-semibold tracking-tight text-neutral-400">
                        {tag}
                      </span>
                    </>
                  )}
                </span>
              ))}
            </div>
          </div>
        </section>

        <ThemenTabs />

        <EmpfehlungenGrid />

        <section
          id="process"
          className="section section-muted border-y border-neutral-200 text-center scroll-mt-20"
        >
          <div className="mx-auto max-w-2xl px-6 lg:px-8">
            <div className="eyebrow mb-4 justify-center">
              {t("processEyebrow")}
            </div>
            <h2 className="heading-2">{t("processTitle")}</h2>
            <p className="mt-5 text-lg leading-8 text-neutral-700">
              {t("processText")}
            </p>
            <Link
              href="/methode"
              className="mt-8 inline-flex font-semibold text-accent-700 hover:underline"
            >
              {t("processLink")}
            </Link>
          </div>
        </section>

        <section className="section section-accent border-y border-accent-100 text-center">
          <div className="mx-auto max-w-2xl px-6 lg:px-8">
            <p className="text-base text-neutral-700">
              {t("trustText")}{" "}
              <Link
                href="/about"
                className="font-semibold text-accent-700 hover:underline"
              >
                {t("trustLink")}
              </Link>
            </p>
          </div>
        </section>

        <DidYouKnowSection />

        <section
          id="cta"
          className="section section-strong border-t border-white/5 text-center"
        >
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent-500/30 bg-accent-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent-300 mb-8">
              {t("ctaBadge")}
            </div>
            <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl leading-[1.1]">
              {t("ctaTitle")}
            </h2>
            <p className="mt-6 text-lg text-neutral-300 leading-8">
              {t("ctaText")}
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="/auth/register"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent-600 px-10 py-4 text-base font-bold text-white shadow-lg shadow-accent-900/40 transition hover:scale-[1.02] hover:bg-accent-500"
              >
                {t("ctaButton")}
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </a>
            </div>

            <p className="mt-6 text-xs text-neutral-500">{t("ctaDisclaimer")}</p>
          </div>
        </section>
      </main>
    </>
  );
}
