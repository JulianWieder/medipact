import type { Metadata } from "next";
import { ladePreisOverlay } from "@/lib/pricing-matrix";
import KostenrechnerClient from "../KostenrechnerClient";
import { artParsen } from "../art";
import EinbettungsRahmen from "./EinbettungsRahmen";

// ── /kostenrechner/embed ────────────────────────────────────────────────────
//
// Der Rechner zum Einbetten auf fremden Seiten (Mediator:innen, Berater).
// Ohne Header, Footer, Cookie-Banner und Analytics — das blendet
// ConditionalHeader.tsx über den Pfad aus. Als einzige Seite einbettbar:
// next.config.ts setzt hier frame-ancestors * statt X-Frame-Options.
//
// noindex, aber BEWUSST ohne Canonical auf /kostenrechner: noindex plus
// Canonical auf eine andere URL ist widersprüchlich, Google darf das noindex
// dann auf das Canonical-Ziel übertragen (siehe lib/seo.ts, `locale`). Die
// Linkkraft kommt ohnehin nicht über das iframe, sondern über den normalen
// Link, den der Einbettungscode unter das iframe setzt.

export const metadata: Metadata = {
  title: "Kostenrechner Mediation oder Gericht | medipact",
  robots: { index: false, follow: true },
};

export default async function KostenrechnerEmbed({
  searchParams,
}: {
  searchParams: Promise<{ art?: string | string[] }>;
}) {
  const preise = await ladePreisOverlay();
  const start = artParsen((await searchParams).art);

  return (
    <EinbettungsRahmen>
      <main className="bg-white p-4 sm:p-6">
        <KostenrechnerClient preise={preise} start={start} />
        <p className="mt-6 text-right text-xs text-neutral-500">
          Berechnet mit{" "}
          <a
            href="https://medipact.de/kostenrechner"
            target="_blank"
            rel="noopener"
            className="font-semibold text-accent-700 underline"
          >
            medipact
          </a>
        </p>
      </main>
    </EinbettungsRahmen>
  );
}
