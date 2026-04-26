import Link from "next/link";
import Image from "next/image";

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
  { label: "Kontakt", href: "/kontakt" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Medipact Logo"
            width={36}
            height={36}
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
          href="/#kontakt"
          className="hidden rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 md:inline-flex"
        >
          Termin buchen
        </Link>

        {/* MOBILE */}
        <button
          className="inline-flex rounded-md p-2 text-neutral-800 md:hidden"
          aria-label="Menü öffnen"
        >
          ☰
        </button>
      </div>
    </header>
  );
}
