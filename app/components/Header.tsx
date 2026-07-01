"use client";

import { useState, type ReactNode } from "react";
import UnlocalizedLink from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { isMigratedLocalePath } from "@/i18n/routing";
import { LanguageSwitcher } from "@/app/components/LanguageSwitcher";
import logo from "@/fotos/Medipact Logo für Mediation Online.png";

/**
 * Most marketing routes (e.g. /methode, /cases, /about) are NOT migrated
 * into app/[locale]/ yet — only "/" and "/konflikte/trennung" are (see
 * isMigratedLocalePath in i18n/routing.ts). Using the locale-aware Link for
 * an unmigrated path is what caused the "/de/en/methode" prefix-loop bug:
 * next-intl computes a locale-prefixed href for a page that has nothing to
 * strip that prefix back off. So pick per-link, not blanket.
 */
function NavLink({
  href,
  className,
  onClick,
  children,
}: {
  href: string;
  className?: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  if (isMigratedLocalePath(href.split("#")[0])) {
    return (
      <Link href={href} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <UnlocalizedLink href={href} className={className} onClick={onClick}>
      {children}
    </UnlocalizedLink>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");

  const navItems = [
    { label: t("start"), href: "/" },
    { label: t("about"), href: "/about" },
    {
      label: t("konflikte"),
      href: "/konflikte",
      children: [
        { label: t("konflikteTrennung"), href: "/konflikte/trennung" },
        { label: t("konflikteNachbarschaft"), href: "/konflikte/nachbarschaft" },
        { label: t("konflikteErbschaft"), href: "/konflikte/erbschaft" },
      ],
    },
    { label: t("methode"), href: "/methode" },
    {
      label: t("beispiele"),
      href: "/cases",
      children: [
        { label: t("beispieleFallbeispiele"), href: "/cases" },
        { label: t("beispieleMatrix"), href: "/cases#matrix" },
      ],
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Promo bar */}
      <div className="w-full bg-neutral-900 text-white">
        <UnlocalizedLink
          href="/auth/register"
          className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-xs font-semibold tracking-wide text-neutral-100 transition hover:text-accent-300 sm:px-6 sm:text-sm"
        >
          <span className="sm:hidden">{t("promoShort")}</span>
          <span className="hidden sm:inline">{t("promo")}</span>
          <span aria-hidden="true">→</span>
        </UnlocalizedLink>
      </div>

      <div className="w-full border-b border-neutral-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <Image
            src={logo}
            alt="Medipact Logo"
            width={36}
            height={36}
            className="rounded-md object-cover"
            priority
          />
          <span className="text-lg font-semibold tracking-tight text-neutral-900">
            Medipact
          </span>
        </Link>

        {/* NAV */}
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) =>
            item.children ? (
              <div key={item.href} className="group relative">
                <NavLink
                  href={item.href}
                  className="flex items-center gap-1 text-sm font-medium text-neutral-700 transition hover:text-neutral-950"
                >
                  {item.label}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-3.5 w-3.5 text-neutral-400 transition-transform duration-200 group-hover:-rotate-180 group-focus-within:-rotate-180"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </NavLink>

                {/* Dropdown */}
                <div
                  className="invisible absolute left-1/2 top-full z-50 w-56 -translate-x-1/2 pt-3 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
                >
                  <ul className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white py-2 shadow-[0_20px_40px_-15px_rgba(30,41,59,0.18)]">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <NavLink
                          href={child.href}
                          className="block px-4 py-2.5 text-sm text-neutral-700 transition hover:bg-accent-50/60 hover:text-accent-700"
                        >
                          {child.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <NavLink
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-neutral-700 transition hover:text-neutral-950"
              >
                {item.label}
              </NavLink>
            ),
          )}
        </nav>

        {/* CTA */}
        <div className="hidden items-center gap-4 md:flex">
          <LanguageSwitcher />
          <UnlocalizedLink
            href="/auth/login"
            className="rounded-full bg-accent-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-700"
          >
            {t("login")}
          </UnlocalizedLink>
        </div>

        {/* MOBILE TOGGLE */}
        <button
          type="button"
          className="inline-flex rounded-md p-2 text-neutral-800 md:hidden"
          aria-label={open ? t("menuClose") : t("menuOpen")}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              className="h-5 w-5"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              className="h-5 w-5"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <nav
          id="mobile-menu"
          className="border-t border-neutral-200/80 bg-white px-6 py-4 md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <NavLink
                  href={item.href}
                  className="block rounded-md px-2 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </NavLink>
                {item.children && (
                  <ul className="ml-3 flex flex-col gap-1 border-l border-neutral-200 pl-3">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <NavLink
                          href={child.href}
                          className="block rounded-md px-2 py-1.5 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                          onClick={() => setOpen(false)}
                        >
                          {child.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-4 flex items-center justify-center">
            <LanguageSwitcher />
          </div>

          <UnlocalizedLink
            href="/auth/login"
            className="mt-4 inline-flex w-full justify-center rounded-full bg-accent-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-700"
            onClick={() => setOpen(false)}
          >
            {t("login")}
          </UnlocalizedLink>
        </nav>
      )}
      </div>
    </header>
  );
}
