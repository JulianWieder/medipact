"use client";

import { useState } from "react";
import UnlocalizedLink from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import logo from "@/fotos/Medipact Logo für Mediation Online.png";

export default function Header() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");

  // hrefs point at marketing routes inside the [locale] segment, so this
  // list uses the locale-aware Link (@/i18n/navigation) below, not
  // next/link. /auth/* links stay on plain next/link (UnlocalizedLink)
  // because /auth is outside the locale routing — see migration-notes.md.
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
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-neutral-700 transition hover:text-neutral-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <UnlocalizedLink
          href="/auth/login"
          className="hidden rounded-full bg-accent-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-700 md:inline-flex"
        >
          {t("login")}
        </UnlocalizedLink>

        {/* MOBILE TOGGLE */}
        <button
          type="button"
          className="inline-flex rounded-md p-2 text-neutral-800 md:hidden"
          aria-label={open ? t("menuClose") : t("menuOpen")}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? "✕" : "☰"}
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
                <Link
                  href={item.href}
                  className="block rounded-md px-2 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <ul className="ml-3 flex flex-col gap-1 border-l border-neutral-200 pl-3">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className="block rounded-md px-2 py-1.5 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                          onClick={() => setOpen(false)}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

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
