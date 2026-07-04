import Link from "next/link";
import { Breadcrumbs } from "@/app/components/ui/Breadcrumbs";
import { JsonLd } from "@/app/components/JsonLd";
import type { RatgeberArticle } from "@/app/content/ratgeberArtikel";

const BASE_URL = "https://medipact.de";

/**
 * Rendert einen Ratgeber-Artikel inkl. Article- + FAQPage-JSON-LD und
 * Breadcrumbs. Server-Component (kein State) — Inhalt kommt aus
 * app/content/ratgeberArtikel.ts.
 */
export function RatgeberArtikelTemplate({ article }: { article: RatgeberArticle }) {
  const url = `${BASE_URL}/ratgeber/${article.slug}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    inLanguage: "de",
    datePublished: article.updated,
    dateModified: article.updated,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Organization", name: "medipact", url: BASE_URL },
    publisher: { "@type": "Organization", name: "medipact", url: BASE_URL },
    about: { "@type": "Thing", name: "Mediation" },
  };

  const faqSchema =
    article.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: article.faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }
      : null;

  const updatedLabel = new Date(article.updated).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <JsonLd data={articleSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}

      <main className="app-shell pt-[73px]">
        {/* Hero */}
        <section className="relative overflow-hidden section section-base">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-[-8rem] top-[-6rem] h-72 w-72 rounded-full bg-accent-100 blur-3xl opacity-60" />
            <div className="absolute right-[-6rem] top-20 h-80 w-80 rounded-full bg-cyan-100 blur-3xl opacity-50" />
          </div>

          <div className="container relative">
            <div className="max-w-3xl">
              <Breadcrumbs
                items={[
                  { label: "Ratgeber", href: "/ratgeber" },
                  { label: article.title },
                ]}
                variant="light"
              />
              <div className="eyebrow">{article.eyebrow}</div>

              <h1 className="heading-1 mt-8">{article.title}</h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-700">
                {article.intro}
              </p>

              <p className="mt-6 text-sm text-neutral-400">
                Aktualisiert am {updatedLabel} · ca. {article.readingMinutes} Min. Lesezeit
              </p>
            </div>
          </div>
        </section>

        {/* Artikelinhalt */}
        <section className="section section-base">
          <article className="container max-w-3xl">
            {article.blocks.map((block, i) => {
              if (block.type === "heading") {
                return (
                  <h2 key={i} className="heading-2 mt-12 first:mt-0 scroll-mt-24">
                    {block.text}
                  </h2>
                );
              }
              if (block.type === "paragraph") {
                return (
                  <p key={i} className="mt-5 leading-8 text-neutral-700">
                    {block.text}
                  </p>
                );
              }
              if (block.type === "list") {
                return (
                  <ul key={i} className="mt-5 space-y-2.5 text-neutral-700">
                    {block.items.map((item, j) => (
                      <li key={j} className="flex gap-3 leading-7">
                        <span className="mt-0.5 font-bold text-accent-600">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                );
              }
              if (block.type === "callout") {
                return (
                  <div
                    key={i}
                    className="mt-6 rounded-2xl border border-accent-200 bg-accent-50/60 px-6 py-5 text-neutral-700 leading-7"
                  >
                    {block.text}
                  </div>
                );
              }
              // cta
              return (
                <div key={i} className="mt-8">
                  <Link href={block.href} className="btn btn-primary">
                    {block.text}
                  </Link>
                </div>
              );
            })}
          </article>
        </section>

        {/* FAQ */}
        {article.faq.length > 0 && (
          <section className="section section-muted">
            <div className="container max-w-3xl">
              <div className="mb-10 text-center">
                <div className="eyebrow mb-4 justify-center">Häufige Fragen</div>
                <h2 className="heading-2">Kurz beantwortet</h2>
              </div>
              <div className="space-y-4">
                {article.faq.map((item) => (
                  <div key={item.question} className="app-surface p-6 sm:p-8">
                    <h3 className="font-semibold text-neutral-900">{item.question}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Weiterlesen */}
        {article.related.length > 0 && (
          <section className="section section-base border-t border-neutral-100">
            <div className="container max-w-3xl">
              <div className="mb-8 text-center">
                <h2 className="heading-2">Weiterlesen</h2>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                {article.related.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-full border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-700 transition hover:border-accent-300 hover:text-accent-700"
                  >
                    {item.label} →
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="section section-strong text-center">
          <div className="container max-w-3xl">
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl leading-tight">
              Eigenen Konflikt lösen – strukturiert und fair
            </h2>
            <p className="mt-5 text-lg leading-8 text-neutral-300">
              medipact führt beide Seiten durch die bewährten Phasen der Mediation – online,
              vertraulich und im eigenen Tempo.
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
