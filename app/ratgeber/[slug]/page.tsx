import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RatgeberArtikelTemplate } from "@/app/components/templates/RatgeberArtikelTemplate";
import { ratgeberArticles, ratgeberBySlug } from "@/app/content/ratgeberArtikel";

export function generateStaticParams() {
  return ratgeberArticles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = ratgeberBySlug[slug];
  if (!article) return {};
  return {
    title: article.metaTitle,
    description: article.description,
    alternates: { canonical: `https://medipact.de/ratgeber/${article.slug}` },
  };
}

export default async function RatgeberArtikelPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = ratgeberBySlug[slug];
  if (!article) notFound();
  return <RatgeberArtikelTemplate article={article} />;
}
