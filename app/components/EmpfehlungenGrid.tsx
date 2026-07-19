import { getTranslations } from "next-intl/server";
import Image, { type StaticImageData } from "next/image";
import { ArrowLink } from "@/app/components/ui/ArrowLink";
import trennungPhoto from "../../fotos/medi_trennung.jpg";
import nachbarnPhoto from "../../fotos/medi_nachbarn.jpg";
import erbschaftPhoto from "../../fotos/medi_Erbe.jpg";
import geschaeftPhoto from "../../fotos/medi_buiness.jpg";

type CardKey = "trennung" | "nachbarschaft" | "erbschaft" | "geschaeft";

const cards: { key: CardKey; href: string; image: StaticImageData }[] = [
  { key: "trennung", href: "/konflikte/trennung", image: trennungPhoto },
  { key: "nachbarschaft", href: "/konflikte/nachbarschaft", image: nachbarnPhoto },
  { key: "erbschaft", href: "/konflikte/erbschaft", image: erbschaftPhoto },
  { key: "geschaeft", href: "/konflikte/odr", image: geschaeftPhoto },
];

/**
 * Mercedes-Benz-style "Empfehlungen" card grid: large image, short headline +
 * text, two CTAs ("Mehr erfahren" / "Kostenlos starten"). Replaces the
 * one-line casesTeaser on the homepage.
 *
 * Only /konflikte/trennung is migrated into app/[locale]/ today (see
 * isMigratedLocalePath, i18n/routing.ts) — the locale-aware vs. plain link
 * choice per href lives centrally in ArrowLink (app/components/ui/ArrowLink).
 */
export async function EmpfehlungenGrid() {
  const t = await getTranslations("home.empfehlungen");

  return (
    <section className="section section-base border-y border-neutral-100 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <div className="eyebrow mb-4">{t("eyebrow")}</div>
          <h2 className="heading-2">{t("title")}</h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {cards.map(({ key, href, image }) => (
            <article
              key={key}
              className="group overflow-hidden rounded-[1.75rem] border border-neutral-200 bg-white shadow-sm transition hover:shadow-lg"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={image}
                  alt={t(`cards.${key}.title`)}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                  className="transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-6">
                <h3 className="text-lg font-bold text-neutral-900">
                  {t(`cards.${key}.title`)}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                  {t(`cards.${key}.text`)}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold">
                  <ArrowLink href={href}>{t("ctaPrimary")}</ArrowLink>
                  <a href="/auth/register" className="text-neutral-500 transition hover:text-neutral-800">
                    {t("ctaSecondary")}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
