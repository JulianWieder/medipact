import Link from "next/link";
import { useTranslations } from "next-intl";
import Icon from "@/app/components/ui/Icon";
import { LogbuchApp } from "@/app/components/ui/LogbuchApp";
import { LOGBUCH_WEB_URL } from "@/lib/logbuchApp";

/**
 * Startseiten-Sektion: Kostenloses Konflikt-Logbuch.
 *
 * Sanfter Einstieg für Besucher, die noch nicht bereit für eine Mediation
 * sind – erst dokumentieren (0 €), später mediieren. Verlinkt auf die
 * SEO-Landingpage /konflikt-logbuch. Texte in messages/*.json unter
 * home.logbuch.
 */
type PreviewEntry = { icon: string; label: string; text: string };

export default function LogbuchSection() {
  const t = useTranslations("home.logbuch");
  const previewEntries = t.raw("previewEntries") as PreviewEntry[];

  return (
    <section className="section section-base">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-10 rounded-[2rem] border border-neutral-200 bg-neutral-50 p-8 sm:p-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <span className="inline-flex items-center rounded-full bg-accent-600 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
              {t("badge")}
            </span>
            <h2 className="heading-2 mt-5">
              {t("titleLine1")}
              <span className="block text-accent-600">{t("titleLine2")}</span>
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-neutral-700">
              {t.rich("text", { strong: (chunks) => <strong>{chunks}</strong> })}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={LOGBUCH_WEB_URL}
                className="inline-flex items-center justify-center rounded-xl bg-accent-600 px-7 py-3 text-sm font-bold text-white transition hover:bg-accent-700"
              >
                {t("ctaStart")} →
              </a>
              <Link
                href="/konflikt-logbuch"
                className="text-sm font-semibold text-accent-600 transition hover:text-accent-700"
              >
                {t("ctaMore")} →
              </Link>
            </div>
          </div>

          {/* Mini-Vorschau: so sieht die Chronologie aus */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              {t("previewLabel")}
            </p>
            <ul className="mt-3 space-y-3">
              {previewEntries.map((e) => (
                <li key={e.text} className="flex items-start gap-3 rounded-xl border border-neutral-100 bg-neutral-50/60 p-3">
                  <span><Icon name={e.icon} size={18} /></span>
                  <span>
                    <span className="block text-xs font-bold text-neutral-800">{e.label}</span>
                    <span className="block text-xs leading-5 text-neutral-500">{e.text}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-center text-[11px] text-neutral-400">
              {t("previewFooter")}
            </p>
          </div>

          {/* Jetzt eigenständig: Web + App, per QR-Code direkt aufs Handy */}
          <div className="lg:col-span-2">
            <p className="mb-4 text-sm font-semibold text-neutral-800">
              {t("availability")}
            </p>
            <LogbuchApp />
          </div>
        </div>
      </div>
    </section>
  );
}
