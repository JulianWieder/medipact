import { useTranslations } from "next-intl";
import { LogbuchApp } from "@/app/components/ui/LogbuchApp";
import { LOGBUCH_WEB_URL } from "@/lib/logbuchApp";

/**
 * Hinweis-Box auf das kostenlose Konflikt-Logbuch ("Streit-Tagebuch").
 *
 * Wird auf den Konfliktarten-Seiten (via MarketingPageTemplate) und weiteren
 * Marketing-Seiten eingeblendet: Wer noch nicht bereit für eine Mediation ist,
 * kann den Konflikt erst einmal kostenlos dokumentieren – der Einstieg in den
 * Trichter (0 € dokumentieren → Mediation starten).
 */
export function LogbuchHinweis() {
  const t = useTranslations("logbuchHinweis");

  return (
    <section className="section-base border-t border-neutral-100 py-14">
      <div className="container max-w-4xl">
        <div className="rounded-3xl border-2 border-accent-200 bg-accent-50/50 p-8 sm:p-10">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="inline-flex items-center rounded-full bg-accent-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
              {t("badge")}
            </span>
            <h2 className="mt-3 font-display text-2xl font-medium text-neutral-900">
              {t("heading")}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-600">
              {t.rich("text", { strong: (chunks) => <strong>{chunks}</strong> })}
            </p>
          </div>
          <a
            href={LOGBUCH_WEB_URL}
            className="shrink-0 rounded-xl bg-accent-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-accent-700"
          >
            {t("cta")} →
          </a>
        </div>
        <div className="mt-8">
          <LogbuchApp />
        </div>
        </div>
      </div>
    </section>
  );
}
