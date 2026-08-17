"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import UnlocalizedLink from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { isMigratedLocalePath } from "@/i18n/routing";
import { LanguageSwitcher } from "@/app/components/LanguageSwitcher";
import {
  NavMegaPanel,
  type NavPanelGroup,
  type NavPanelFooterLink,
} from "@/app/components/layout/NavMegaPanel";
import logo from "@/fotos/medi logo.png";

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
  // Mobil: Nav-Leiste beim Runterscrollen ausblenden, beim Hochscrollen
  // sofort wieder zeigen ("auto-hide"). Auf md+ bleibt sie via CSS
  // (md:translate-y-0) immer sichtbar.
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const t = useTranslations("nav");

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      // 96px Toleranz, damit die Leiste nicht sofort beim ersten Pixel
      // verschwindet; kleine Scroll-Zitterbewegungen (<4px) ignorieren.
      if (Math.abs(y - lastY.current) > 4) {
        setHidden(y > lastY.current && y > 96);
        lastY.current = y;
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Untermenues als Mega-Panel (siehe NavMegaPanel.tsx): jeder Eintrag mit
  // Icon, Titel und Halbsatz, gruppiert in betitelte Spalten, sekundaere
  // Wege in der Fussleiste. `desc` ist kein Beiwerk — die Seitennamen im
  // /einigung-Cluster sind abstrakt ("Abgleich & Tausch"), erst der Halbsatz
  // macht sie anklickbar.
  type NavItem = {
    label: string;
    href: string;
    groups?: NavPanelGroup[];
    footer?: NavPanelFooterLink[];
    /** Breite des Panels. Zwei Spalten brauchen mehr. */
    wide?: boolean;
  };

  const navItems: NavItem[] = [
    { label: t("start"), href: "/" },
    { label: t("about"), href: "/about" },
    {
      label: t("konflikte"),
      href: "/konflikte",
      wide: true,
      groups: [
        {
          title: t("konflikteGruppe"),
          items: [
            {
              label: t("konflikteTrennung"),
              href: "/konflikte/trennung",
              desc: t("konflikteTrennungDesc"),
              icon: "heartbreak",
            },
            {
              label: t("konflikteNachbarschaft"),
              href: "/konflikte/nachbarschaft",
              desc: t("konflikteNachbarschaftDesc"),
              icon: "home",
            },
            {
              label: t("konflikteMietverhaeltnis"),
              href: "/konflikte/mietverhaeltnis",
              desc: t("konflikteMietverhaeltnisDesc"),
              icon: "file",
            },
            {
              label: t("konflikteVerbraucher"),
              href: "/konflikte/verbraucher",
              desc: t("konflikteVerbraucherDesc"),
              icon: "receipt",
            },
          ],
        },
        {
          items: [
            {
              label: t("konflikteErbschaft"),
              href: "/konflikte/erbschaft",
              desc: t("konflikteErbschaftDesc"),
              icon: "scroll",
            },
            {
              label: t("konflikteArbeitsplatz"),
              href: "/konflikte/arbeitsplatz",
              desc: t("konflikteArbeitsplatzDesc"),
              icon: "handshake",
            },
            {
              label: t("konflikteGeschaeft"),
              href: "/konflikte/odr",
              desc: t("konflikteGeschaeftDesc"),
              icon: "building",
            },
          ],
        },
      ],
      footer: [
        { label: t("konflikteAlle"), href: "/konflikte" },
        { label: t("konflikteCheck"), href: "/kontakt" },
      ],
    },
    {
      // "So funktioniert es" traegt zwei verschiedene Dinge: den konkreten
      // Ablauf (/methode) und den Einigungsprozess (/einigung-Cluster). Als
      // flache Fuenferliste sah das aus wie eine Aufzaehlung; zwei betitelte
      // Spalten machen die Struktur sichtbar.
      label: t("methode"),
      href: "/methode",
      wide: true,
      groups: [
        {
          title: t("methodeGruppeAblauf"),
          items: [
            {
              label: t("methodeAblauf"),
              href: "/methode",
              desc: t("methodeAblaufDesc"),
              icon: "compass",
            },
            {
              label: t("methodeBegleitung"),
              href: "/preise",
              desc: t("methodeBegleitungDesc"),
              icon: "users",
            },
          ],
        },
        {
          title: t("methodeGruppeEinigung"),
          items: [
            {
              label: t("methodeEinigung"),
              href: "/einigung",
              desc: t("methodeEinigungDesc"),
              icon: "euro",
            },
            {
              label: t("methodeAbgleich"),
              href: "/einigung/abgleich",
              desc: t("methodeAbgleichDesc"),
              icon: "scale",
            },
            {
              label: t("methodeOhneMediator"),
              href: "/einigung/ohne-mediator",
              desc: t("methodeOhneMediatorDesc"),
              icon: "user",
            },
          ],
        },
      ],
      footer: [
        { label: t("methodeGleichbehandlung"), href: "/einigung/gleichbehandlung" },
        { label: t("kostenrechner"), href: "/kostenrechner" },
      ],
    },
    {
      label: t("beispiele"),
      href: "/cases",
      groups: [
        {
          title: t("beispieleGruppe"),
          items: [
            {
              label: t("beispieleFallbeispiele"),
              href: "/cases",
              desc: t("beispieleFallbeispieleDesc"),
              icon: "clipboard",
            },
            {
              label: t("beispieleMatrix"),
              href: "/cases#matrix",
              desc: t("beispieleMatrixDesc"),
              icon: "grid",
            },
          ],
        },
      ],
      footer: [{ label: t("ratgeber"), href: "/ratgeber" }],
    },
    { label: t("ratgeber"), href: "/ratgeber" },
    { label: t("kostenrechner"), href: "/kostenrechner" },
  ];

  return (
    <>
      {/* Promo bar: bewusst NICHT sticky — scrollt weg und gibt auf dem
          Handy die ~36px wieder frei, die vorher dauerhaft klebten. */}
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

      <header
        className={`sticky top-0 z-50 w-full transition-transform duration-200 md:translate-y-0 ${
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        }`}
      >
      <div className="w-full border-b border-neutral-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1.5 md:py-4">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <Image
            src={logo}
            alt="Medipact Logo"
            width={36}
            height={36}
            className="h-7 w-7 rounded-md object-cover md:h-9 md:w-9"
            // Kein `preload`/`priority`: das Logo ist 28x28 CSS-Pixel und darf
            // nicht mit dem Hero-Foto (dem LCP-Element) um einen Preload-Slot
            // konkurrieren. `loading="eager"` holt es trotzdem sofort, nur ohne
            // <link> im <head> und ohne Vorrang.
            loading="eager"
            fetchPriority="low"
          />
          <span className="text-base font-semibold tracking-tight text-neutral-900 md:text-lg">
            Medipact
          </span>
        </Link>

        {/* NAV */}
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) =>
            item.groups ? (
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

                {/* Mega-Panel. `pt-3` ueberbrueckt die Luecke zwischen
                    Nav-Eintrag und Panel, sonst schliesst es beim Runterfahren
                    der Maus. `delay-100` auf der Basis-Klasse verzoegert nur
                    das OEFFNEN (CSS wendet die Basis-Transition beim Wechsel
                    in den Hover-Zustand an) — `group-hover:delay-0` laesst es
                    sofort wieder schliessen. */}
                <div
                  className={`invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 opacity-0 transition-all delay-100 duration-150 group-hover:visible group-hover:opacity-100 group-hover:delay-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:delay-0 ${
                    item.wide
                      ? "w-[min(40rem,calc(100vw-2rem))]"
                      : "w-[min(22rem,calc(100vw-2rem))]"
                  }`}
                >
                  <NavMegaPanel
                    groups={item.groups}
                    footer={item.footer}
                    renderLink={(href, className, children) => (
                      <NavLink href={href} className={className}>
                        {children}
                      </NavLink>
                    )}
                  />
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
          className="max-h-[calc(100dvh-60px)] overflow-y-auto border-t border-neutral-200/80 bg-white px-6 py-4 md:hidden"
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
                {/* Mobil bewusst ohne Icons und ohne `desc`: die Halbsaetze
                    verdoppeln die Menuehoehe, und auf dem Handy scrollt man
                    ohnehin, statt zu ueberfliegen. */}
                {item.groups && (
                  <ul className="ml-3 flex flex-col gap-1 border-l border-neutral-200 pl-3">
                    {item.groups.flatMap((g) => g.items).map((child) => (
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
    </>
  );
}
