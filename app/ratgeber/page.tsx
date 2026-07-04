import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/app/components/ui/Breadcrumbs";
import { JsonLd } from "@/app/components/JsonLd";
import { ratgeberArticles } from "@/app/content/ratgeberArtikel";

export const metadata: Metadata = {
  title: "Ratgeber Mediation: Ablauf, Kosten & Wissen | medipact",
  description:
    "Der medipact-Ratgeber erklärt Mediation verständlich: Ablauf und die 5 Phasen, die Rolle des Mediators, Kosten und wann sich ein Verfahren lohnt.",
  alternates: { canonical: "https://medipact.de/ratgeber" },
};

const BASE_URL = "https://medipact.de";

// Übersichts-Schema: CollectionPage mit den enthaltenen Artikeln.
const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Ratgeber Mediation",
  description:
    "Verständliche Artikel rund um Mediation: Ablauf, die 5 Phasen, die Rolle des Mediators und die Kosten.",
  url: `${BASE_URL}/ratgeber`,
  inLanguage: "de",
  hasPart: ratgeberArticles.map((a) => ({
    "@type": "Article",
    headline: a.title,
    url: `${BASE_URL}/ratgeber/${a.slug}`,
  })),
};

export default function RatgeberUebersichtPage() {
  return (
    <>
      <JsonLd data={collectionSchema} />

      <main className="app-shell pt-[73px]">
        <section className="relative overflow-hidden section section-base">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-[-8rem] top-[-6rem] h-72 w-72 rounded-full bg-accent-100 blur-3xl opacity-60" />
            <div className="absolute right-[-6rem] top-20 h-80 w-80 rounded-full bg-cyan-100 blur-3xl opacity-50" />
          </div>

          <div className="container relative">
            <div className="max-w-3xl">
              <Breadcrumbs items={[{ label: "Ratgeber" }]} variant="light" />
              <div className="eyebrow">Ratgeber</div>
              <h1 className="heading-1 mt-8">
                Mediation verständlich erklärt
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-700">
                Was ist Mediation, wie läuft sie ab und was kostet sie? In unserem Ratgeber
                beantworten wir die wichtigsten Fragen rund um die außergerichtliche
                Konfliktlösung – klar, praxisnah und ohne Fachchinesisch.
              </p>
            </div>
          </div>
        </section>

        <section className="section section-base">
          <div className="container max-w-5xl">
            <div className="eyebrow mb-6">Kategorie · Mediation</div>
            <div className="grid gap-6 md:grid-cols-2">
              {ratgeberArticles.map((a) => (
                <Link
                  key={a.slug}
                  href={`/ratgeber/${a.slug}`}
                  className="group flex flex-col rounded-3xl border border-neutral-100 bg-white p-7 transition hover:border-accent-200 hover:shadow-md"
                >
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent-700">
                    {a.category}
                  </span>
                  <h2 className="mt-3 text-xl font-bold leading-snug text-neutral-900 group-hover:text-accent-700">
                    {a.title}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-600">
                    {a.description}
                  </p>
                  <span className="mt-5 text-sm font-semibold text-accent-700">
                    Artikel lesen →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-strong text-center">
          <div className="container max-w-3xl">
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl leading-tight">
              Vom Wissen zur Lösung
            </h2>
            <p className="mt-5 text-lg leading-8 text-neutral-300">
              Sie haben einen konkreten Konflikt? Starten Sie Ihren Fall strukturiert und fair –
              online mit medipact.
            </p>
            <Link href="/auth/register" className="btn btn-primary mt-8">
              Kostenlosen Account erstellen
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
