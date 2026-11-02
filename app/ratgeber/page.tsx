import { REGISTRIEREN_URL } from "@/lib/nutzerbereich";
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/app/components/ui/Breadcrumbs";
import { ArrowLink } from "@/app/components/ui/ArrowLink";
import { JsonLd } from "@/app/components/JsonLd";
import { ImagePinHero } from "@/app/components/ui/ImagePinHero";
import {
  ratgeberArticles,
  ratgeberBySlug,
  ratgeberCategories,
  type RatgeberArticle,
} from "@/app/content/ratgeberArtikel";
import { caseStudies } from "@/app/content/caseStudies";
import ratgeberHero from "@/fotos/medi_ratgeber.jpg";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Ratgeber Mediation: Trennung, Erbe, Nachbarn & Kosten | medipact",
  description:
    "Antworten für Ihre Lage: Trennung und Scheidung, Streit ums Erbe, Ärger mit Nachbarn, Konflikte im Unternehmen. Mit Fallbeispielen und dem direkten Weg zur Einigung.",
  path: "/ratgeber",
  type: "article",
});

const BASE_URL = "https://medipact.de";

// Übersichts-Schema: CollectionPage mit den enthaltenen Artikeln.
const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Ratgeber Mediation",
  description:
    "Verständliche Artikel rund um Trennung, Erbe, Nachbarschaft und Unternehmen sowie Ablauf und Kosten der Mediation.",
  url: `${BASE_URL}/ratgeber`,
  inLanguage: "de",
  hasPart: ratgeberArticles.map((a) => ({
    "@type": "Article",
    headline: a.title,
    url: `${BASE_URL}/ratgeber/${a.slug}`,
  })),
};

/**
 * Pro Kategorie: Anker (das Header-Menü verlinkt darauf), Einordnung,
 * passende Konfliktseite und zwei Fallbeispiele. Die Übersicht soll von der
 * Frage zum eigenen Fall führen — wer liest, wie es bei anderen ausging,
 * startet eher selbst. Reihenfolge hier = Reihenfolge auf der Seite:
 * Lebenslagen zuerst, allgemeines Verfahrenswissen am Ende. Kategorien, die
 * hier fehlen, werden hinten angehängt und bekommen nur die Artikelliste.
 */
const kategorieMeta: Record<
  string,
  {
    id: string;
    intro: string;
    konflikt?: { label: string; href: string };
    faelle: string[];
  }
> = {
  "Trennung & Scheidung": {
    id: "trennung-scheidung",
    intro:
      "Wer bleibt im Haus, wie oft sehen die Kinder den anderen Elternteil, was steht mir zu? Hier stehen die Fragen so, wie man sie nachts um zwei sucht, und die Antworten so, dass man danach schlafen kann.",
    konflikt: { label: "Trennungsmediation", href: "/scheidungsmediation" },
    faelle: ["trennung-mit-kindern", "trennung-nach-langer-ehe"],
  },
  "Familie & Erbe": {
    id: "familie-erbe",
    intro:
      "Ein Erbe teilt selten nur Geld. Es teilt Erinnerungen, alte Rollen und die Frage, wer den Eltern näher war. Hier geht es um Testament, Pflichtteil, Erbengemeinschaft und das Elternhaus.",
    konflikt: {
      label: "Mediation bei Erbstreit",
      href: "/konflikte/erbschaft",
    },
    faelle: ["erbstreit-haus-geschwister", "streit-ums-testament"],
  },
  Nachbarschaft: {
    id: "nachbarschaft",
    intro:
      "Lärm, Hecke, Zaun, Parkplatz: kleine Anlässe mit großer Wirkung, denn man wohnt weiter nebeneinander. Hier steht, was rechtlich gilt und wie man sich wieder grüßt.",
    konflikt: {
      label: "Nachbarschaftsmediation",
      href: "/konflikte/nachbarschaft",
    },
    faelle: ["nachbarschaft-zaun", "nachbarschaft-laerm"],
  },
  Wirtschaftsmediation: {
    id: "wirtschaft",
    intro:
      "Gesellschafter im Patt, Teams im Grabenkrieg, Projekte vor dem Scherbenhaufen. Hier geht es um Konflikte, bei denen jeder Monat Stillstand Geld und gute Leute kostet.",
    konflikt: { label: "Mediation für Unternehmen", href: "/konflikte/odr" },
    faelle: ["gesellschafter-streit", "b2b-projektstreit"],
  },
  Mediation: {
    id: "mediation",
    intro:
      "Was Mediation ist, wie sie abläuft, was sie kostet und wann ein Gericht doch die bessere Wahl ist. Dazu: wie man einen Konflikt festhält, bevor man irgendetwas entscheidet.",
    konflikt: { label: "So funktioniert medipact", href: "/methode" },
    faelle: [],
  },
};

const kategorieReihenfolge = Object.keys(kategorieMeta);

const kategorien = [...ratgeberCategories].sort((a, b) => {
  const ia = kategorieReihenfolge.indexOf(a.category);
  const ib = kategorieReihenfolge.indexOf(b.category);
  return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
});

function kategorieId(category: string) {
  return (
    kategorieMeta[category]?.id ??
    category
      .toLowerCase()
      .replace(/ä/g, "ae")
      .replace(/ö/g, "oe")
      .replace(/ü/g, "ue")
      .replace(/ß/g, "ss")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  );
}

/** Einstiege nach Lebenslage — jeweils der Artikel, mit dem man anfängt. */
const einstiege: { frage: string; slug: string }[] = [
  {
    frage: "Ich will mich trennen. Wo fange ich an?",
    slug: "ich-will-mich-trennen",
  },
  { frage: "Wir streiten ums Erbe.", slug: "geschwister-streiten-ums-erbe" },
  { frage: "Der Nachbar raubt mir den Schlaf.", slug: "nachbar-laerm-was-tun" },
  { frage: "Es brennt gerade. Was tun?", slug: "akuter-konflikt-was-tun" },
  { frage: "Gericht oder Mediation?", slug: "gericht-oder-mediation" },
  { frage: "Was kostet das überhaupt?", slug: "mediation-kosten" },
].filter((e) => ratgeberBySlug[e.slug]);

function ArtikelKarte({
  a,
  gross = false,
}: {
  a: RatgeberArticle;
  gross?: boolean;
}) {
  return (
    <Link
      href={`/ratgeber/${a.slug}`}
      className={`group flex h-full flex-col rounded-2xl border border-neutral-200 bg-white transition hover:-translate-y-0.5 hover:border-accent-300 hover:shadow-md ${
        gross ? "p-8" : "p-6"
      }`}
    >
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
        {a.readingMinutes} Min. Lesezeit
      </span>
      <h3
        className={`mt-3 font-bold leading-snug text-neutral-900 group-hover:text-accent-700 ${
          gross ? "text-2xl" : "text-lg"
        }`}
      >
        {a.title}
      </h3>
      <p
        className={`mt-3 flex-1 leading-relaxed text-neutral-600 ${
          gross ? "text-base" : "line-clamp-3 text-sm"
        }`}
      >
        {a.description}
      </p>
      <span className="mt-5 text-sm font-semibold text-accent-700">
        Artikel lesen →
      </span>
    </Link>
  );
}

export default function RatgeberUebersichtPage() {
  return (
    <>
      <JsonLd data={collectionSchema} />

      <main className="app-shell pt-0">
        <ImagePinHero
          image={ratgeberHero}
          imageAlt="Ratgeber Mediation – Menschen im klärenden Gespräch"
        >
          <div className="container max-w-4xl">
            <Breadcrumbs items={[{ label: "Ratgeber" }]} variant="dark" />
            <p className="eyebrow mb-4 text-accent-300">Ratgeber</p>
            <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
              Ihr Konflikt hat eine Frage. Hier steht die Antwort.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-200">
              {ratgeberArticles.length} Artikel zu Trennung, Erbe, Nachbarschaft
              und Unternehmen. Klar, praxisnah, ohne Fachchinesisch, und mit
              Fallbeispielen, die zeigen, wie es bei anderen ausgegangen ist.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
              <Link href={REGISTRIEREN_URL} className="btn btn-primary">
                Eigenen Fall starten
              </Link>
              <ArrowLink href="/cases" tone="light">
                Fallbeispiele ansehen
              </ArrowLink>
            </div>
          </div>
        </ImagePinHero>

        {/* Sprungleiste: bei 40+ Artikeln direkt zur eigenen Lebenslage. */}
        <nav
          aria-label="Ratgeber-Kategorien"
          className="border-b border-neutral-200 bg-white"
        >
          <div className="container flex gap-2 overflow-x-auto py-4">
            {kategorien.map(({ category, articles }) => (
              <a
                key={category}
                href={`#${kategorieId(category)}`}
                className="shrink-0 rounded-full border border-neutral-200 px-4 py-1.5 text-sm font-medium text-neutral-700 transition hover:border-accent-300 hover:text-accent-700"
              >
                {category}
                <span className="ml-1.5 text-neutral-400">
                  {articles.length}
                </span>
              </a>
            ))}
          </div>
        </nav>

        {einstiege.length > 0 && (
          <section className="section section-muted">
            <div className="container max-w-5xl">
              <p className="eyebrow mb-4">Wo stehen Sie gerade?</p>
              <h2 className="heading-2">Fangen Sie bei Ihrer Frage an</h2>
              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {einstiege.map((e) => (
                  <Link
                    key={e.slug}
                    href={`/ratgeber/${e.slug}`}
                    className="group flex items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-white px-6 py-5 transition hover:border-accent-300"
                  >
                    <span className="font-semibold text-neutral-900 group-hover:text-accent-700">
                      {e.frage}
                    </span>
                    <span
                      aria-hidden
                      className="text-accent-600 transition group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {kategorien.map(({ category, articles }, index) => {
          const meta = kategorieMeta[category];
          const [erster, ...rest] = articles;
          const faelle = (meta?.faelle ?? [])
            .map((slug) => caseStudies[slug])
            .filter(Boolean);

          return (
            <section
              key={category}
              id={kategorieId(category)}
              className={`section scroll-mt-24 ${index % 2 ? "section-muted" : "section-base"}`}
            >
              <div className="container max-w-5xl">
                <div className="mb-10 max-w-3xl">
                  <p className="eyebrow mb-4">
                    {category} · {articles.length} Artikel
                  </p>
                  <h2 className="heading-2">{category}</h2>
                  {meta?.intro && (
                    <p className="mt-5 text-lg leading-8 text-neutral-600">
                      {meta.intro}
                    </p>
                  )}
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <ArtikelKarte a={erster} gross />
                  </div>

                  {/* Seitenspalte: vom Wissen zur Praxis und zum eigenen Fall. */}
                  <aside className="flex flex-col gap-4 rounded-2xl border border-accent-200 bg-accent-50/50 p-6">
                    {faelle.length > 0 && (
                      <>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-700">
                          So ist es ausgegangen
                        </p>
                        {faelle.map((fall) => (
                          <Link
                            key={fall.slug}
                            href={`/cases/${fall.slug}`}
                            className="group block"
                          >
                            <span className="block font-semibold text-neutral-900 group-hover:text-accent-700">
                              {fall.title}
                            </span>
                            <span className="block text-sm text-neutral-600">
                              {fall.titleHighlight}
                            </span>
                          </Link>
                        ))}
                      </>
                    )}
                    <div className="mt-auto space-y-4 border-t border-accent-200 pt-4">
                      {meta?.konflikt && (
                        <ArrowLink
                          href={meta.konflikt.href}
                          className="text-sm"
                        >
                          {meta.konflikt.label}
                        </ArrowLink>
                      )}
                      <Link
                        href={REGISTRIEREN_URL}
                        className="btn btn-primary flex w-full justify-center"
                      >
                        Fall starten
                      </Link>
                    </div>
                  </aside>
                </div>

                {rest.length > 0 && (
                  <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {rest.map((a) => (
                      <ArtikelKarte key={a.slug} a={a} />
                    ))}
                  </div>
                )}
              </div>
            </section>
          );
        })}

        <section className="section section-strong text-center">
          <div className="container max-w-3xl">
            <h2 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
              Genug gelesen?
            </h2>
            <p className="mt-5 text-lg leading-8 text-neutral-300">
              Ihr Konflikt wird nicht kleiner, wenn Sie noch einen Artikel
              lesen. Starten Sie Ihren Fall strukturiert und fair, online mit
              medipact. Oder sehen Sie erst nach, wie es bei anderen ausgegangen
              ist.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
              <Link href={REGISTRIEREN_URL} className="btn btn-primary">
                Mediation starten
              </Link>
              <ArrowLink href="/cases" tone="light">
                Zu den Fallbeispielen
              </ArrowLink>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
