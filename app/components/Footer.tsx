"use client";

import Link from "next/link";

interface FooterProps {
  brandName?: string;
  tagline?: string;
  isDark?: boolean;
  email?: string;
  phone?: string;
}

export default function Footer({
  brandName = "medipact",
  tagline = "Konflikte lösen, nicht eskalieren.",
  isDark = false,
  email = "hallo@medipact.de",
  phone = " +49 1520 9942351",
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`${isDark ? "bg-slate-950" : "bg-slate-950"} text-white`}
    >
      {/* Brand statement */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-16">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-teal-400">
            Es ist Ihre Lösung. Nicht der Streit.
          </p>
          <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
            Bereit, den Streit hinter sich zu lassen?
          </h2>
          <Link
            href="/auth/register"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-teal-600 px-7 py-3.5 text-sm font-bold text-white transition hover:scale-[1.02] hover:bg-teal-500"
          >
            Streitfall kostenlos starten
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Top Section */}
        <div className="grid gap-10 border-b border-white/10 pb-10 md:grid-cols-4 md:gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold tracking-tight">{brandName}</h3>
            <p className="mt-3 text-slate-400">{tagline}</p>
            <div className="mt-4 space-y-2 text-sm text-slate-400">
              <p>{email}</p>
              <p>{phone}</p>
            </div>
          </div>

          {/* Produkt */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-300">
              Produkt
            </h4>
            <ul className="mt-4 space-y-2 text-slate-400">
              <li>
                <Link href="/preise" className="transition hover:text-white">
                  Preise
                </Link>
              </li>
              <li>
                <Link href="/konflikte" className="transition hover:text-white">
                  Wie es funktioniert
                </Link>
              </li>
              <li>
                <Link href="/cases" className="transition hover:text-white">
                  Fallbeispiele
                </Link>
              </li>
            </ul>
          </div>

          {/* Unternehmen */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-300">
              Unternehmen
            </h4>
            <ul className="mt-4 space-y-2 text-slate-400">
              <li>
                <Link href="/about" className="transition hover:text-white">
                  Über uns
                </Link>
              </li>
              <li>
                <Link href="/karriere" className="transition hover:text-white">
                  Karriere
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="transition hover:text-white">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* Rechtlich */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-300">
              Rechtlich
            </h4>
            <ul className="mt-4 space-y-2 text-slate-400">
              <li>
                <Link href="/datenschutz" className="transition hover:text-white">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link href="/agb" className="transition hover:text-white">
                  AGB
                </Link>
              </li>
              <li>
                <Link href="/impressum" className="transition hover:text-white">
                  Impressum
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-4 pt-8 md:flex-row">
          <p className="text-sm text-slate-500">
            &copy; {currentYear} {brandName}. Alle Rechte vorbehalten.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-500 transition hover:text-white">
              <span className="sr-only">Twitter</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="text-slate-500 transition hover:text-white">
              <span className="sr-only">LinkedIn</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.338 16.338H13.67V12.16c0-.995-.017-2.292-1.393-2.292-1.394 0-1.609 1.088-1.609 2.212v4.258H8.004V9.339h2.52v1.104h.036c.351-.665 1.209-1.393 2.487-1.393 2.659 0 3.15 1.75 3.15 4.02v4.668zM4.446 8.119c-.895 0-1.622-.721-1.622-1.607a1.624 1.624 0 113.243 0c0 .886-.727 1.607-1.622 1.607zm13.52 0H15.03V16.338h2.936V8.119zM2.558 0h13.862c1.265 0 2.293 1.028 2.293 2.29v13.42c0 1.262-1.028 2.29-2.293 2.29H2.558c-1.264 0-2.29-1.028-2.29-2.29V2.29C.268 1.028 1.294 0 2.558 0z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
