"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = { mediationId: string };

const PHASE_INFO_SECTIONS = [
  {
    title: "Ziele der Phase",
    content: [
      "Vertrauen herstellen",
      "Neutralität sichern",
      "Erwartungen klären",
      "Gesprächsregeln definieren",
      "Freiwilligkeit bestätigen",
      "Konfliktparteien arbeitsfähig machen",
    ],
    type: "list" as const,
  },
  {
    title: "1. Begrüßung und Einführung",
    content:
      "Der Mediator erklärt Rolle, Ablauf und Prinzipien der Mediation: Freiwilligkeit, Vertraulichkeit, Eigenverantwortung, Neutralität und Allparteilichkeit. Der Mediator entscheidet nicht – er steuert den Prozess.",
    type: "text" as const,
  },
  {
    title: "2. Auftrag klären",
    content:
      "Warum sitzen die Parteien hier? Was soll erreicht werden? Welche Themen gehören in die Mediation? Wer entscheidet am Ende? Wichtig: Viele Konflikte wirken sachlich, sind aber eigentlich Beziehungskonflikte.",
    type: "text" as const,
    example: '„Geht es um eine konkrete Lösung oder auch um die zukünftige Zusammenarbeit?"',
  },
  {
    title: "3. Rahmenbedingungen festlegen",
    content: [
      "Zeitrahmen und Termine",
      "Ausreden lassen",
      "Keine Beleidigungen",
      "Ich-Botschaften verwenden",
      "Keine Drohungen",
      "Respektvoller Umgang mit Emotionen",
    ],
    type: "list" as const,
  },
  {
    title: "4. Rollen und Machtverhältnisse prüfen",
    content: [
      "Gibt es ein Machtgefälle?",
      "Spricht eine Partei dominanter?",
      "Gibt es emotionale Einschüchterung?",
      "Wer blockiert? Wer vermeidet?",
    ],
    type: "list" as const,
    note: "Sonst wird die Mediation nur eine Bühne für alte Dynamiken.",
  },
  {
    title: "5. Arbeitsbündnis schaffen",
    content:
      "Die Parteien müssen den Prozess, den Mediator und die Bereitschaft zur Mitarbeit akzeptieren. Ohne dieses Arbeitsbündnis bleibt alles oberflächlich.",
    type: "text" as const,
  },
  {
    title: "Psychologisch wichtigste Aufgabe",
    content:
      "Die emotionale Eskalation senken. In Konflikten sind Menschen oft defensiv, misstrauisch und positionsorientiert. Die Einleitungsphase soll Sicherheit erzeugen, Kontrollverlust reduzieren und Gesprächsfähigkeit herstellen.",
    type: "text" as const,
    highlight: true,
  },
];

export default function LeitfadenClient({ mediationId }: Props) {
  const router = useRouter();
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");

  async function startMediation() {
    setStarting(true);
    setError("");
    try {
      const res = await fetch(`/api/mediations/${mediationId}/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "active", phase: "einleitung" }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const raw = body?.detail ?? body?.error;
        const detail = Array.isArray(raw)
          ? raw.map((e: { msg?: string }) => e.msg ?? JSON.stringify(e)).join(", ")
          : (raw ?? "Unbekannter Fehler");
        setError(`Fehler beim Starten (${res.status}): ${detail}`);
        return;
      }
      router.push(`/dashboard/${mediationId}/einleitung`);
    } catch {
      setError("Server nicht erreichbar.");
    } finally {
      setStarting(false);
    }
  }

  return (
    <main className="app-shell pt-[73px]">
      <section className="container py-12">
        <div className="app-surface p-8">
          <p className="eyebrow mb-3">Phase 1 von 6 · Mediator-Leitfaden</p>
          <h1 className="heading-2 text-slate-900">Auftrags- und Einleitungsphase</h1>
          <p className="mt-3 max-w-2xl text-slate-600 text-sm">
            Lies den Leitfaden bevor du die Mediation startest. Die Parteien sehen diese Seite nicht.
          </p>

          <div className="mt-8 space-y-4">
            {PHASE_INFO_SECTIONS.map((section, i) => (
              <div
                key={i}
                className={`rounded-xl border p-4 ${
                  section.highlight
                    ? "border-emerald-300 bg-emerald-50"
                    : "border-slate-200 bg-white"
                }`}
              >
                <h3 className="mb-2 text-sm font-bold text-slate-800">{section.title}</h3>
                {section.type === "list" ? (
                  <ul className="space-y-1">
                    {(section.content as string[]).map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-600">{section.content as string}</p>
                )}
                {"example" in section && section.example && (
                  <p className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs italic text-slate-500">
                    {section.example}
                  </p>
                )}
                {"note" in section && section.note && (
                  <p className="mt-3 text-xs font-medium text-amber-700">⚠ {section.note}</p>
                )}
              </div>
            ))}
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-700">{error}</p>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn btn-ghost"
            >
              ← Zurück
            </button>
            <button
              type="button"
              onClick={startMediation}
              disabled={starting}
              className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              {starting ? "Wird gestartet …" : "Mediation starten →"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
