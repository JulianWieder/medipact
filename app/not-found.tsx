import type { Metadata } from "next";
import { Button } from "@/app/components/ui/Button";
import { ArrowLink } from "@/app/components/ui/ArrowLink";

// Eigene 404-Seite. Vorher zeigte Next die englische Standardseite ohne
// jeden Weg zurueck ins Angebot. Den Statuscode 404 und das noindex setzt
// Next selbst; hier steht nur der Titel.
//
// Bewusst deutsch und ohne next-intl: die Seite greift fuer JEDE unbekannte
// URL, auch ausserhalb von app/[locale]/.
export const metadata: Metadata = {
  title: "Seite nicht gefunden | medipact",
};

const ZIELE = [
  { href: "/konflikte", label: "Konfliktarten im Überblick" },
  { href: "/scheidungsmediation", label: "Trennung und Scheidung" },
  { href: "/methode", label: "So läuft das Verfahren ab" },
  { href: "/preise", label: "Preise" },
  { href: "/ratgeber", label: "Ratgeber" },
  { href: "/kontakt", label: "Kontakt" },
];

export default function NotFound() {
  return (
    <main className="app-shell pt-[73px]">
      <section className="mx-auto max-w-3xl px-6 py-24 text-center lg:px-8">
        <p className="eyebrow mb-4 justify-center">Fehler 404</p>
        <h1 className="heading-2">Diese Seite gibt es nicht (mehr).</h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-neutral-600">
          Der Link ist veraltet oder enthält einen Tippfehler. Hier geht es
          weiter:
        </p>

        <div className="mt-10 flex justify-center">
          <Button href="/" size="lg">
            Zur Startseite
          </Button>
        </div>

        <ul className="mt-12 grid gap-4 text-left sm:grid-cols-2">
          {ZIELE.map((ziel) => (
            <li key={ziel.href}>
              <ArrowLink href={ziel.href} className="text-base">
                {ziel.label}
              </ArrowLink>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
