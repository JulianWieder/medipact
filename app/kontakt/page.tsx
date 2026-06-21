import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import SituationCheck from "@/app/components/SituationCheck";
import einordnenPhoto from "@/fotos/medi_einordnen.jpg";

export const metadata: Metadata = {
  title: "Situation einordnen lassen – Kontakt | medipact",
  description:
    "Lassen Sie Ihre Situation in 5 kurzen Fragen einordnen: Ist Mediation geeignet, unklar – oder eher nicht der richtige Weg? Inklusive Hilfsangeboten für akute Fälle.",
  alternates: { canonical: "https://medipact.de/kontakt" },
};

export default function KontaktPage() {
  return (
    <main className="app-shell pt-[73px]">
      <section className="relative isolate overflow-hidden">
        <div className="relative min-h-[460px] w-full sm:min-h-[520px]">
          <Image
            src={einordnenPhoto}
            alt="Eine ruhige Einschätzung der eigenen Situation vor der Mediation"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

          <div className="relative flex min-h-[460px] items-center justify-center sm:min-h-[520px]">
            <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
              <p className="eyebrow mb-4 justify-center text-teal-300">Kontakt</p>

              <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
                Lassen Sie Ihre Situation{" "}
                <span className="bg-gradient-to-r from-teal-300 via-teal-200 to-white bg-clip-text text-transparent">
                  einordnen.
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-200">
                Bevor es um eine Lösung geht, hilft eine ehrliche Einschätzung:
                Passt Mediation zu Ihrer Situation – oder braucht es zuerst etwas
                anderes? Der folgende Check dauert keine zwei Minuten.
              </p>
            </div>
          </div>
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
