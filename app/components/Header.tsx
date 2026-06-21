"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/fotos/logo.jpg";

const navItems = [
  { label: "Start", href: "/" },
  { label: "Über uns", href: "/about" },
  {
    label: "Konflikte",
    href: "/konflikte",
    children: [
      { label: "Scheidung & Trennung", href: "/konflikte/trennung" },
      { label: "Nachbarschaft", href: "/konflikte/nachbarschaft" },
      { label: "Erbe & Familie", href: "/konflikte/erbschaft" },
    ],
  },
  {
    label: "Beispiele",
    href: "/cases",
    children: [
      { label: "Fallbeispiele", href: "/beispiele" },
      { label: "Mini-Matrix", href: "/beispiele#matrix" },
    ],
  },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Promo bar */}
      <div className="w-full bg-slate-900 text-white">
        <Link
          href="/auth/register"
          className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-6 py-2 text-center text-xs font-semibold tracking-wide text-slate-100 transition hover:text-teal-300 sm:text-sm"
        >
          <span className="hidden sm:inline">Neu:</span> Ihren Streitfall in 5 Minuten starten – ohne Anwalt, ohne Risiko
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="w-full border-b border-slate-200/80 bg-white/90 backdrop-blur">
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
          <span className="text-lg font-semibold tracking-tight text-slate-900">
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
        <Link
          href="/auth/login"
          className="hidden rounded-full bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 md:inline-flex"
        >
          Mediation starten
        </Link>

        {/* MOBILE TOGGLE */}
        <button
          type="button"
          className="inline-flex rounded-md p-2 text-neutral-800 md:hidden"
          aria-label={open ? "Menü schließen" : "Menü öffnen"}
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
          className="border-t border-slate-200/80 bg-white px-6 py-4 md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-md px-2 py-2 text-sm font-medium text-neutral-800 hover:bg-slate-50"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <ul className="ml-3 flex flex-col gap-1 border-l border-slate-200 pl-3">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className="block rounded-md px-2 py-1.5 text-sm text-neutral-600 hover:bg-slate-50 hover:text-neutral-900"
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

          <Link
            href="/auth/login"
            className="mt-4 inline-flex w-full justify-center rounded-full bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
            onClick={() => setOpen(false)}
          >
            Mediation starten
          </Link>
        </nav>
      )}
      </div>
    </header>
  );
}
