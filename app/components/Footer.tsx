"use client";

import React from "react";

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
      className={`${isDark ? "bg-gray-900 text-white" : "bg-gray-900 text-white"} py-12`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-gray-800">
          {/* Brand */}
          <div>
            <h3 className="font-bold text-lg mb-4">{brandName}</h3>
            <p className="text-gray-400">{tagline}</p>
            <div className="mt-4 space-y-2 text-sm text-gray-400">
              <p>📧 {email}</p>
              <p>📞 {phone}</p>
            </div>
          </div>

          {/* Produkt */}
          <div>
            <h4 className="font-bold mb-4">Produkt</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition">
                  KI-Pure
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Hybrid
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Preise
                </a>
              </li>
              <li>
                <a href="/konflikte" className="hover:text-white transition">
                  Wie es funktioniert
                </a>
              </li>
            </ul>
          </div>

          {/* Unternehmen */}
          <div>
            <h4 className="font-bold mb-4">Unternehmen</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/about" className="hover:text-white transition">
                  Über uns
                </a>
              </li>

              <li>
                <a href="/about" className="hover:text-white transition">
                  Karriere
                </a>
              </li>
            </ul>
          </div>

          {/* Rechtlich */}
          <div>
            <h4 className="font-bold mb-4">Rechtlich</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition">
                  Datenschutz
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  AGB
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Impressum
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Cookies
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} {brandName}. Alle Rechte vorbehalten.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition">
              <span className="sr-only">Twitter</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              <span className="sr-only">LinkedIn</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
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
