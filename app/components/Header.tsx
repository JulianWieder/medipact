"use client";

import React, { useState, useRef, useEffect } from "react";

interface HeaderProps {
  logoText?: string;
  ctaText?: string;
  ctaLink?: string;
  isDark?: boolean;
}

const examples = [
  { label: "Trennung & Unterhalt", href: "/cases/trennung" },
  { label: "Erbschafts-Konflikt", href: "/cases/erbschaft" },
  { label: "Nachbarschafts-Streit", href: "/cases/nachbarschaft" },
  { label: "Geschäftspartner-Konflikt", href: "/cases/geschaeftspartner" },
  { label: "Familienkonflikt", href: "/cases/familie" },
  { label: "Arbeitskonflikt", href: "/cases/arbeitskonflikt" },
];

const caseExamples = [
  {
    category: "Trennung & Kinder",
    cases: [
      { label: "Maria & Thomas – 2 Kinder", href: "/cases/maria-thomas" },
      {
        label: "Alexa & David – Mit neuem Partner",
        href: "/cases/alexa-david",
      },
    ],
  },
  {
    category: "Vermögen & Haus",
    cases: [
      { label: "Peter & Sarah – Hohes Vermögen", href: "/cases/peter-sarah" },
      { label: "Rolf & Helga – Nach 38 Jahren", href: "/cases/rolf-helga" },
    ],
  },
  {
    category: "Unternehmen & Business",
    cases: [
      { label: "Carla & Marco – Mit Unternehmen", href: "/cases/carla-marco" },
    ],
  },
  {
    category: "International",
    cases: [
      {
        label: "Jens & Katarina – Internationale Trennung",
        href: "/cases/jens-katarina",
      },
    ],
  },
  {
    category: "Erbschafts-Konflikte",
    cases: [
      { label: "Anna & Klaus – Haus-Streit", href: "/cases/anna-klaus" },
      {
        label: "Marie & Sophie – Testament-Konflikt",
        href: "/cases/marie-sophie",
      },
      {
        label: "Familie Weber – Unternehmen erben",
        href: "/cases/familie-weber",
      },
    ],
  },
];

export default function Header({
  logoText = "medipact",
  ctaText = "Jetzt starten",
  ctaLink = "#",
  isDark = false,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExamplesOpen, setIsExamplesOpen] = useState(false);
  const [isCaseExamplesOpen, setIsCaseExamplesOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const examplesRef = useRef<HTMLDivElement>(null);
  const caseExamplesRef = useRef<HTMLDivElement>(null);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const closeAllMenus = () => {
    setIsMenuOpen(false);
    setIsExamplesOpen(false);
    setIsCaseExamplesOpen(false);
    setExpandedCategories([]);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        examplesRef.current &&
        !examplesRef.current.contains(event.target as Node)
      ) {
        setIsExamplesOpen(false);
      }
      if (
        caseExamplesRef.current &&
        !caseExamplesRef.current.contains(event.target as Node)
      ) {
        setIsCaseExamplesOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 ${isDark ? "bg-slate-900" : "bg-white"} border-b ${isDark ? "border-slate-700" : "border-slate-200"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <a
            href="/"
            className={`text-xl font-semibold ${isDark ? "text-white" : "text-slate-900"}`}
          >
            {logoText}
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-0.5 items-center">
            <a
              href="#"
              className={`px-3 py-2 text-sm font-medium rounded transition ${
                isDark
                  ? "text-slate-400 hover:text-white hover:bg-slate-800"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              Über uns
            </a>

            {/* Konflikte Dropdown */}
            <div ref={examplesRef} className="relative">
              <button
                onClick={() => {
                  setIsExamplesOpen(!isExamplesOpen);
                  setIsCaseExamplesOpen(false);
                }}
                className={`px-3 py-2 text-sm font-medium rounded transition ${
                  isDark
                    ? "text-slate-400 hover:text-white hover:bg-slate-800"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                Konflikte
              </button>

              {isExamplesOpen && (
                <div
                  className={`absolute left-0 mt-1 w-56 rounded-lg shadow-lg border ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"} py-1 z-50`}
                >
                  {examples.map((example) => (
                    <a
                      key={example.label}
                      href={example.href}
                      onClick={closeAllMenus}
                      className={`block px-3 py-2 text-sm rounded-md transition ${
                        isDark
                          ? "text-slate-400 hover:text-white hover:bg-slate-700"
                          : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      {example.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Beispiele Dropdown */}
            <div ref={caseExamplesRef} className="relative">
              <button
                onClick={() => {
                  setIsCaseExamplesOpen(!isCaseExamplesOpen);
                  setIsExamplesOpen(false);
                }}
                className={`px-3 py-2 text-sm font-medium rounded transition ${
                  isDark
                    ? "text-slate-400 hover:text-white hover:bg-slate-800"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                Beispiele
              </button>

              {isCaseExamplesOpen && (
                <div
                  className={`absolute left-0 mt-1 w-80 rounded-lg shadow-lg border ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"} py-1 z-50 max-h-96 overflow-y-auto`}
                >
                  {caseExamples.map((group) => (
                    <div key={group.category}>
                      <button
                        onClick={() => toggleCategory(group.category)}
                        className={`w-full px-3 py-2 text-xs font-semibold text-left flex justify-between items-center rounded-md transition ${
                          isDark
                            ? "text-emerald-400 hover:bg-slate-700"
                            : "text-emerald-700 hover:bg-slate-100"
                        }`}
                      >
                        <span>{group.category}</span>
                      </button>

                      {expandedCategories.includes(group.category) && (
                        <div
                          className={`${isDark ? "bg-slate-700/50" : "bg-slate-50"}`}
                        >
                          {group.cases.map((caseItem) => (
                            <a
                              key={caseItem.label}
                              href={caseItem.href}
                              onClick={closeAllMenus}
                              className={`block px-6 py-1.5 text-xs rounded-md transition ${
                                isDark
                                  ? "text-slate-400 hover:text-white hover:bg-slate-700"
                                  : "text-slate-700 hover:text-slate-900 hover:bg-white"
                              }`}
                            >
                              {caseItem.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <a
              href="#"
              className={`px-3 py-2 text-sm font-medium rounded transition ${
                isDark
                  ? "text-slate-400 hover:text-white hover:bg-slate-800"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              Preise
            </a>
            <a
              href="#"
              className={`px-3 py-2 text-sm font-medium rounded transition ${
                isDark
                  ? "text-slate-400 hover:text-white hover:bg-slate-800"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              FAQ
            </a>
            <a
              href="#"
              className={`px-3 py-2 text-sm font-medium rounded transition ${
                isDark
                  ? "text-slate-400 hover:text-white hover:bg-slate-800"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              Blog
            </a>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => (window.location.href = ctaLink)}
            className="hidden md:block px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded hover:bg-emerald-700 transition"
          >
            {ctaText}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            <svg
              className={`w-5 h-5 ${isDark ? "text-white" : "text-slate-900"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            className={`md:hidden border-t ${isDark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-slate-50"} py-3`}
          >
            <a
              href="#"
              onClick={closeAllMenus}
              className={`block px-3 py-2 text-sm font-medium rounded transition ${
                isDark
                  ? "text-slate-400 hover:text-white hover:bg-slate-700"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              Über uns
            </a>

            <details className="group">
              <summary
                className={`flex cursor-pointer items-center gap-1.5 px-3 py-2 text-sm font-medium rounded transition ${
                  isDark
                    ? "text-slate-400 hover:text-white hover:bg-slate-700"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                Konflikte
              </summary>
              <div
                className={`mt-1 pl-3 space-y-1 border-l ${isDark ? "border-slate-700" : "border-slate-300"}`}
              >
                {examples.map((example) => (
                  <a
                    key={example.label}
                    href={example.href}
                    onClick={closeAllMenus}
                    className={`block px-3 py-1.5 text-xs rounded transition ${
                      isDark
                        ? "text-slate-400 hover:text-white hover:bg-slate-700"
                        : "text-slate-700 hover:bg-white"
                    }`}
                  >
                    {example.label}
                  </a>
                ))}
              </div>
            </details>

            <details className="group">
              <summary
                className={`flex cursor-pointer items-center gap-1.5 px-3 py-2 text-sm font-medium rounded transition ${
                  isDark
                    ? "text-slate-400 hover:text-white hover:bg-slate-700"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                Beispiele
              </summary>
              <div
                className={`mt-1 pl-3 space-y-0.5 border-l ${isDark ? "border-slate-700" : "border-slate-300"}`}
              >
                {caseExamples.map((group) => (
                  <details key={group.category} className="group/sub">
                    <summary
                      className={`flex cursor-pointer items-center gap-1.5 text-xs font-semibold rounded px-3 py-1.5 transition ${
                        isDark
                          ? "text-emerald-400 hover:bg-slate-700"
                          : "text-emerald-700 hover:bg-slate-100"
                      }`}
                    >
                      {group.category}
                    </summary>
                    <div
                      className={`mt-0.5 pl-3 space-y-0.5 border-l ${isDark ? "border-slate-700" : "border-slate-300"}`}
                    >
                      {group.cases.map((caseItem) => (
                        <a
                          key={caseItem.label}
                          href={caseItem.href}
                          onClick={closeAllMenus}
                          className={`block px-3 py-1 text-xs rounded transition ${
                            isDark
                              ? "text-slate-400 hover:text-white hover:bg-slate-700"
                              : "text-slate-700 hover:bg-white"
                          }`}
                        >
                          {caseItem.label}
                        </a>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </details>

            <a
              href="#"
              onClick={closeAllMenus}
              className={`block px-3 py-2 text-sm font-medium rounded transition ${
                isDark
                  ? "text-slate-400 hover:text-white hover:bg-slate-700"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              Preise
            </a>
            <a
              href="#"
              onClick={closeAllMenus}
              className={`block px-3 py-2 text-sm font-medium rounded transition ${
                isDark
                  ? "text-slate-400 hover:text-white hover:bg-slate-700"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              FAQ
            </a>
            <a
              href="#"
              onClick={closeAllMenus}
              className={`block px-3 py-2 text-sm font-medium rounded transition ${
                isDark
                  ? "text-slate-400 hover:text-white hover:bg-slate-700"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              Blog
            </a>
            <button
              onClick={() => (window.location.href = ctaLink)}
              className="w-full mt-2 px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded hover:bg-emerald-700 transition"
            >
              {ctaText}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
