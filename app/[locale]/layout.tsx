import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

/**
 * Nested layout for the marketing site. Deliberately does NOT render
 * <html>/<body> — the real root layout (app/layout.tsx) already does that
 * for every route, marketing and app (/dashboard, /workspace, /auth) alike.
 * This layout only exists to validate the :locale segment and enable
 * static rendering for it.
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return <>{children}</>;
}
