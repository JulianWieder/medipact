import type { Metadata } from "next";
import Link from "next/link";
import SituationCheck from "@/app/components/SituationCheck";

export const metadata: Metadata = {
  title: "Situation einordnen lassen – Kontakt | medipact",
  description:
    "Lassen Sie Ihre Situation in 5 kurzen Fragen einordnen: Ist Mediation geeignet, unklar – oder eher nicht der richtige Weg? Inklusive Hilfsangeboten für akute Fälle.",
  alternates: { canonical: "https://medipact.de/kontakt" },
};

export default function KontaktPage() {
  return (
    <main className="app-shell pt-[73px]">
      <section className="section section-base">
        <div className="container max-w-3xl text-center">
          <p className="eyebrow mb-4 justify-center">Kontakt</p>

          <h1 className="heading-1 text-slate-900">
            Lassen Sie Ihre Situation{" "}
            <span className="text-emerald-700">einordnen.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Bevor es um eine Lösung geht, hilft eine ehrliche Einschätzung:
            Passt Mediation zu Ihrer Situation – oder braucht es zuerst etwas
            anderes? Der folgende Check dauert keine zwei Minuten.
          </p>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container max-w-2xl">
          <SituationCheck />
        </div>
      </section>

      <section className="section section-base">
        <div className="container max-w-2xl text-center">
          <p className="eyebrow mb-4 justify-center">Direkt schreiben</p>
          <h2 className="heading-2 text-slate-900">
            Lieber gleich persönlich schildern?
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Schreiben Sie uns kurz, worum es geht. Wir melden uns mit einer
            ehrlichen Einschätzung – auch wenn die Antwort lautet, dass
            Mediation (noch) nicht der richtige Weg ist.
          </p>

          <div className="mt-8 flex flex-col items-center gap-2 text-slate-700">
            <a
              href="mailto:hallo@medipact.de"
              className="text-lg font-medium text-teal-700 hover:text-teal-800"
            >
              hallo@medipact.de
            </a>
            <a
              href="tel:+4915209942351"
              className="text-slate-500 hover:text-slate-700"
            >
              +49 1520 9942351
            </a>
          </div>

          <p className="mt-10 text-sm text-slate-500">
            Unsicher, welche Konfliktart passt?{" "}
            <Link href="/konflikte" className="text-teal-700 hover:underline">
              Konfliktarten ansehen
            </Link>{" "}
            oder{" "}
            <Link href="/cases" className="text-teal-700 hover:underline">
              Fallbeispiele durchsehen
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
