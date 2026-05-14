"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PHASES, getPhaseIndex } from "../_shared/phaseData";

type Props = {
  mediationId: string;
  currentUserName: string;
};

type Participant = {
  id: string;
  name: string;
  role: string;
  invitationStatus: "accepted" | "pending";
};

type SaveState = "idle" | "saving" | "saved" | "error";

const roleLabel: Record<string, string> = {
  initiator: "Antragsteller",
  other_party: "Andere Seite",
  mediator: "Mediator",
  owner: "Antragsteller",
};

const OTHER_STEPS = [
  "Rollen klären",
  "Vertrauen schaffen",
  "Ziel der Mediation definieren",
];

export default function EinleitungClient({ mediationId, currentUserName }: Props) {
  const router = useRouter();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [rules, setRules] = useState<Record<string, string>>({});
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [advancing, setAdvancing] = useState(false);
  const [error, setError] = useState("");

  const currentIndex = getPhaseIndex("einleitung");
  const currentParticipant = participants.find((p) => p.name === currentUserName);

  // Teilnehmer + bestehende Notizen laden
  useEffect(() => {
    async function load() {
      try {
        const [participantsRes, notesRes] = await Promise.all([
          fetch(`/api/mediations/${mediationId}/participants`),
          fetch(`/api/mediations/${mediationId}/notes?phase=einleitung`),
        ]);

        if (participantsRes.ok) {
          const data: Participant[] = await participantsRes.json();
          setParticipants(data);

          // Felder mit bestehenden Notizen befüllen, Rest leer
          const initial: Record<string, string> = {};
          data.forEach((p) => { initial[p.id] = ""; });

          if (notesRes.ok) {
            const notes: { participant_id: string; content: string }[] =
              await notesRes.json();
            notes.forEach((n) => {
              if (n.participant_id in initial) {
                initial[n.participant_id] = n.content;
              }
            });
          }

          setRules(initial);
        }
      } catch {
        // ignore
      }
    }
    load();
  }, [mediationId]);

  async function saveRules() {
    if (!currentParticipant) return;
    setSaveState("saving");
    setError("");

    try {
      const res = await fetch(`/api/mediations/${mediationId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phase: "einleitung",
          participant_id: currentParticipant.id,
          content: rules[currentParticipant.id] ?? "",
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const raw = body?.detail ?? body?.error;
        const detail = Array.isArray(raw)
          ? raw.map((e: { msg?: string }) => e.msg ?? JSON.stringify(e)).join(", ")
          : (raw ?? "Unbekannter Fehler");
        setError(`Speichern fehlgeschlagen (${res.status}): ${detail}`);
        setSaveState("error");
        return;
      }

      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2500);
    } catch {
      setError("Server nicht erreichbar.");
      setSaveState("error");
    }
  }

  async function advance() {
    setAdvancing(true);
    setError("");
    try {
      const res = await fetch(`/api/mediations/${mediationId}/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phase: "themensammlung" }),
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
      router.push(`/dashboard/${mediationId}/themensammlung`);
    } catch {
      setError("Server nicht erreichbar.");
    } finally {
      setAdvancing(false);
    }
  }

  const isCurrentUser = (p: Participant) => p.name === currentUserName;

  return (
    <main className="app-shell pt-[73px]">
      <section className="container py-12">

        {/* Stepper */}
        <div className="mb-8 overflow-x-auto">
          <ol className="flex min-w-max items-center">
            {PHASES.map((p, index) => {
              const isDone = index < currentIndex;
              const isCurrent = index === currentIndex;
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
                      ) : index + 1}
                    </div>
                    <span className={`max-w-[80px] text-center text-xs font-medium leading-tight ${
                      isCurrent ? "text-emerald-700" : isDone ? "text-emerald-600" : "text-slate-400"
                    }`}>
                      {p.shortLabel}
                    </span>
                  </div>
                  {index < PHASES.length - 1 && (
                    <div className={`mx-2 mb-5 h-0.5 w-12 transition-colors ${
                      index < currentIndex ? "bg-emerald-400" : "bg-slate-200"
                    }`} />
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        <div className="app-surface p-8">
          <p className="eyebrow mb-3">Phase 1 von {PHASES.length}</p>
          <h1 className="heading-2 text-slate-900">Auftrags- und Einleitungsphase</h1>

          {/* Regeln festlegen */}
          <div className="mt-10">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                1
              </div>
              <h2 className="text-lg font-bold text-slate-900">Regeln festlegen</h2>
            </div>
            <p className="mb-6 ml-11 max-w-2xl text-sm text-slate-600">
              Jede Partei formuliert ihre Erwartungen an das Verfahren. Was ist dir wichtig? Welche Regeln sollen gelten?
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              {participants
                .filter((p) => p.invitationStatus === "accepted")
                .map((participant) => {
                  const isMe = isCurrentUser(participant);
                  return (
                    <div
                      key={participant.id}
                      className={`rounded-2xl border p-5 transition-shadow ${
                        isMe
                          ? "border-emerald-300 bg-white shadow-sm"
                          : "border-slate-200 bg-slate-50"
                      }`}
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-slate-900">{participant.name}</p>
                          <p className="text-xs text-slate-500">{roleLabel[participant.role] ?? participant.role}</p>
                        </div>
                        {isMe && (
                          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">Du</span>
                        )}
                      </div>

                      {isMe ? (
                        <>
                          <textarea
                            value={rules[participant.id] ?? ""}
                            onChange={(e) =>
                              setRules((prev) => ({ ...prev, [participant.id]: e.target.value }))
                            }
                            placeholder="z.B. Respektvoller Umgang, keine Unterbrechungen, vertrauliche Behandlung aller Informationen …"
                            rows={4}
                            className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                          />

                          <div className="mt-3 flex items-center gap-3">
                            <button
                              type="button"
                              onClick={saveRules}
                              disabled={saveState === "saving"}
                              className="btn btn-secondary text-sm disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {saveState === "saving"
                                ? "Wird gespeichert…"
                                : saveState === "saved"
                                  ? "Gespeichert ✓"
                                  : "Speichern"}
                            </button>
                            {saveState === "saved" && (
                              <span className="text-xs text-emerald-600 font-medium">Deine Regeln wurden gespeichert.</span>
                            )}
                            {saveState === "error" && (
                              <span className="text-xs text-red-600 font-medium">Fehler beim Speichern.</span>
                            )}
                          </div>
                        </>
                      ) : (
                        <div className={`rounded-xl border px-4 py-3 text-sm ${
                          rules[participant.id]
                            ? "border-slate-200 bg-white text-slate-700"
                            : "border-slate-200 bg-white italic text-slate-400"
                        }`}>
                          {rules[participant.id] || "Wartet auf Eingabe …"}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Weitere Schritte */}
          <div className="mt-10">
            <h2 className="mb-4 text-base font-bold text-slate-700">Weitere Schritte dieser Phase</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {OTHER_STEPS.map((step, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-500">
                    {i + 2}
                  </div>
                  <p className="text-sm font-medium text-slate-600">{step}</p>
                </div>
              ))}
            </div>
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
              onClick={() => router.push(`/dashboard/${mediationId}`)}
              className="btn btn-ghost"
            >
              ← Zurück
            </button>
            <button
              type="button"
              onClick={advance}
              disabled={advancing}
              className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              {advancing ? "Wird gespeichert..." : "Weiter →"}
            </button>
          </div>
        </div>

      </section>
    </main>
  );
}
