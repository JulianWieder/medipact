import Link from "next/link";
import { useTranslations } from "next-intl";

// ── Erste-Hilfe-Box ─────────────────────────────────────────────────────────
//
// Sofort-Orientierung über dem Falz für die Suchintention "Mediation starten":
// eine einfache 3-Schritte-Timeline nimmt dem Wort "Verfahren" die Schwere,
// darunter beantwortet ein "Atomic FAQ" die drei brennendsten Fragen in je
// einem Satz. Die Fragen sind als W-Fragen-Überschriften (h3) formuliert, weil
// Google genau solche Kurzantworten in "Nutzer fragen auch" und KI-Antworten
// zieht.
// Texte liegen in messages/*.json unter home.ersteHilfe.
type Step = { title: string; text: string };
type FaqItem = { q: string; a: string };

export function ErsteHilfeBox() {
  const t = useTranslations("home.ersteHilfe");
  const steps = t.raw("steps") as Step[];
  const atomicFaq = t.raw("faq") as FaqItem[];

  return (
    <section className="section section-base scroll-mt-20" id="so-gehts">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="eyebrow mb-4 justify-center">{t("eyebrow")}</div>
          <h2 className="heading-2">{t("title")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-neutral-600">
            {t("text")}
          </p>
        </div>

        {/* 3-Schritte-Timeline */}
        <ol className="grid gap-6 sm:grid-cols-3">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="relative rounded-3xl border border-neutral-100 bg-white p-7 shadow-sm"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-600 text-lg font-black text-white shadow-md">
                {i + 1}
              </div>
              <h3 className="mt-5 text-lg font-bold text-neutral-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                {step.text}
              </p>
              {i < steps.length - 1 && (
                <span
                  aria-hidden
                  className="absolute right-[-14px] top-1/2 hidden -translate-y-1/2 text-2xl text-accent-300 sm:block"
                >
                  →
                </span>
              )}
            </li>
          ))}
        </ol>

        {/* Atomic FAQ – Direktantworten in je einem Satz */}
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {atomicFaq.map((item) => (
            <div
              key={item.q}
              className="rounded-2xl border border-accent-100 bg-accent-50/50 p-6"
            >
              <h3 className="text-sm font-bold text-neutral-900">{item.q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                {item.a}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/auth/register" className="btn btn-primary">
            {t("cta")}
          </Link>
        </div>
      </div>
    </section>
  );
}
