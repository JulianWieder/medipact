import type { Metadata } from "next";
import { MarketingPageTemplate } from "@/app/components/templates/MarketingPageTemplate";
import { getTrennungPageContent } from "@/app/content/trennungPage.loader";
import type { AppLocale } from "@/i18n/routing";
import trennungPhoto from "@/fotos/trennung.jpg";

export const metadata: Metadata = {
  title: "Trennung & Scheidung ohne Eskalation – KI-Mediation | medipact",
  description:
    "Unterhalt, Betreuung, Finanzen – Trennung bringt viele offene Fragen. Medipact hilft, faire Lösungen zu finden, ohne dass jede Nachricht zum Streit wird.",
  alternates: { canonical: "https://medipact.de/konflikte/trennung" },
};

export default async function TrennungPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;

  return (
    <MarketingPageTemplate
      {...getTrennungPageContent(locale)}
      heroImage={{
        src: trennungPhoto,
        alt: "Paar im Gespräch über eine Trennung",
      }}
    />
  );
}
