"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PHASES, getPhase, getPhaseIndex, type PhaseKey } from "./phaseData";

type Props = {
  mediationId: string;
  phaseKey: PhaseKey;
};

export default function PhaseClient({ mediationId, phaseKey }: Props) {
  const router = useRouter();
  const [advancing, setAdvancing] = useState(false);
  const [error, setError] = useState("");

  const phase = getPhase(phaseKey);
  const currentIndex = getPhaseIndex(phaseKey);

  async function advance() {
    if (!phase.nextPhase) return;
    setAdvancing(true);
    setError("");
    try {
      const res = await fetch(`/api/mediations/${mediationId}/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phase: phase.nextPhase }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const raw = body?.detail ?? body?.error;
        const detail = Array.isArray(raw)
          ? raw.map((e: { msg?: string }) => e.msg ?? JSON.stringify(e)).join(", ")
          : (raw ?? "Unbekannter Fehler");
        setError(`Fehler (${res.status}): ${detail}`);
        return;
      }
      router.push(`/dashboard/${mediationId}/${phase.nextPhase}`);
    } catch {
      setError("Server nicht erreichbar.");
    } finally {
      setAdvancing(false);
    }
  }

  async function finish() {
    setAdvancing(true);
    setError("");
    try {
      const res = await fetch(`/api/mediations/${mediationId}/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const raw = body?.detail ?? body?.error;
        const detail = Array.isArray(raw)
          ? raw.map((e: { msg?: string }) => e.msg ?? JSON.stringify(e)).join(", ")
          : (raw ?? "Unbekannter Fehler");
        setError(`Fehler (${res.status}): ${detail}`);
        return;
      }
      router.push("/dashboard");
    } catch {
      setError("Server nicht erreichbar.");
    } finally {
      setAdvancing(false);
    }
  }

  return (
    <main className="app-shell pt-[73px]">
      <section className="container py-12">

        {/* Stepper */}
        <div className="mb-8 overflow-x-auto">
          <ol className="flex min-w-max items-center gap-0">
            {PHASES.map((p, index) => {
              const isDone = index < currentIndex;
              const isCurrent = index === currentIndex;
              const isUpcoming = index > currentIndex;

              return (
                <li key={p.key} className="flex items-center">
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                        isDone
                          ? "bg-emerald-500 text-white"
                          : isCurrent
                            ? "bg-emerald-600 text-white ring-4 ring-emerald-100"
                            : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {isDone ? (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span
                      className={`max-w-[80px] text-center text-xs font-medium leading-tight ${
                        isCurrent
                          ? "text-emerald-700"
                          : isDone
                            ? "text-emerald-600"
                            : "text-slate-400"
                      }`}
                    >
                      {p.shortLabel}
                    </span>
                  </div>

                  {index < PHASES.length - 1 && (
                    <div
                      className={`mx-2 mb-5 h-0.5 w-12 transition-colors ${
                        index < currentIndex ? "bg-emerald-400" : "bg-slate-200"
                      }`}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        {/* Phase Content */}
        <div className="app-surface p-8">
          <p className="eyebrow mb-3">Phase {currentIndex + 1} von {PHASES.length}</p>
          <h1 className="heading-2 text-slate-900">{phase.label}</h1>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {phase.steps.map((step, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                  {i + 1}
                </div>
                <p className="font-semibold text-slate-900">{step}</p>
              </div>
            ))}
          </div>

          {error && (
            <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-700">{error}</p>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-10 flex items-center justify-between border-t border-slate-100 pt-8">
            <button
              type="button"
              onClick={() =>
                phase.prevPhase
                  ? router.push(`/dashboard/${mediationId}/${phase.prevPhase}`)
                  : router.push(`/dashboard/${mediationId}`)
              }
              className="btn btn-ghost"
            >
              ← Zurück
            </button>

            {phase.nextPhase ? (
              <button
                type="button"
                onClick={advance}
                disabled={advancing}
                className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-60"
              >
                {advancing ? "Wird gespeichert..." : "Weiter →"}
              </button>
            ) : (
              <button
                type="button"
                onClick={finish}
                disabled={advancing}
                className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-60"
              >
                {advancing ? "Wird abgeschlossen..." : "Mediation abschließen ✓"}
              </button>
            )}
          </div>
        </div>

      </section>
    </main>
  );
}
