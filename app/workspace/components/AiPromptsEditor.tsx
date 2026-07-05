"use client";

// Editor für die KI-Prompts. Lädt alle Prompts vom Backend (Default aus dem Code,
// ggf. pro Key in der DB überschrieben), zeigt sie mit Platzhalter-Hinweisen und
// lässt sie bearbeiten, speichern und auf den Standard zurücksetzen. Änderungen
// sind live wirksam (kein Redeploy nötig). Wird im WorkflowManager eingebunden.

import { useEffect, useState } from "react";
import { fetchAiPrompts, saveAiPrompt, resetAiPrompt, type AiPromptDto } from "../api";

export default function AiPromptsEditor() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [prompts, setPrompts] = useState<AiPromptDto[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [busyKey, setBusyKey] = useState("");
  const [status, setStatus] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open && !loaded) void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function load() {
    setLoading(true);
    const p = await fetchAiPrompts();
    setPrompts(p);
    setDrafts(Object.fromEntries(p.map((x) => [x.key, x.template])));
    setLoaded(true);
    setLoading(false);
  }

  async function handleSave(key: string) {
    setBusyKey(key);
    setStatus((s) => ({ ...s, [key]: "" }));
    try {
      const updated = await saveAiPrompt(key, drafts[key] ?? "");
      setPrompts((prev) => prev.map((p) => (p.key === key ? updated : p)));
      setStatus((s) => ({ ...s, [key]: "✓ Gespeichert" }));
    } catch (e) {
      setStatus((s) => ({ ...s, [key]: e instanceof Error ? e.message : "Fehler" }));
    } finally {
      setBusyKey("");
    }
  }

  async function handleReset(key: string) {
    setBusyKey(key);
    try {
      const updated = await resetAiPrompt(key);
      setPrompts((prev) => prev.map((p) => (p.key === key ? updated : p)));
      setDrafts((d) => ({ ...d, [key]: updated.template }));
      setStatus((s) => ({ ...s, [key]: "Auf Standard zurückgesetzt" }));
    } catch {
      setStatus((s) => ({ ...s, [key]: "Zurücksetzen fehlgeschlagen" }));
    } finally {
      setBusyKey("");
    }
  }

  return (
    <div className="mt-8 rounded-2xl border border-neutral-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <span>
          <span className="text-sm font-bold text-neutral-900">🧠 KI-Prompts bearbeiten</span>
          <span className="ml-2 text-xs text-neutral-400">
            Steuert, wie die KI Einladungstexte, Zusammenfassungen, Verträge und die Analyse formuliert
          </span>
        </span>
        <svg
          className={`h-4 w-4 shrink-0 text-neutral-500 transition-transform ${open ? "rotate-90" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {open && (
        <div className="border-t border-neutral-100 p-5">
          {loading && <p className="text-sm text-neutral-500">Prompts werden geladen …</p>}

          {!loading && prompts.length === 0 && (
            <p className="text-sm text-neutral-500">
              Keine Prompts geladen (nur für Mediatoren/Admins verfügbar).
            </p>
          )}

          <div className="space-y-6">
            {prompts.map((p) => {
              const draft = drafts[p.key] ?? "";
              const changed = draft !== p.template;
              return (
                <div key={p.key} className="rounded-xl border border-neutral-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-neutral-800">{p.label}</p>
                    {p.is_custom ? (
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                        angepasst
                      </span>
                    ) : (
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-500">
                        Standard
                      </span>
                    )}
                  </div>

                  {p.placeholders.length > 0 && (
                    <div className="mt-2 flex flex-wrap items-center gap-1">
                      <span className="text-[10px] text-neutral-400">Platzhalter:</span>
                      {p.placeholders.map((ph) => (
                        <code
                          key={ph}
                          className="rounded bg-violet-50 px-1.5 py-0.5 text-[10px] font-mono text-violet-700"
                        >
                          {"{" + ph + "}"}
                        </code>
                      ))}
                    </div>
                  )}

                  <textarea
                    value={draft}
                    onChange={(e) => setDrafts((d) => ({ ...d, [p.key]: e.target.value }))}
                    rows={8}
                    spellCheck={false}
                    className="mt-3 w-full rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2 font-mono text-xs leading-relaxed text-neutral-800 outline-none focus:border-accent-400 focus:bg-white focus:ring-2 focus:ring-accent-100"
                  />

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSave(p.key)}
                      disabled={busyKey === p.key || !changed}
                      className="btn btn-primary px-3 py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {busyKey === p.key ? "…" : "Speichern"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReset(p.key)}
                      disabled={busyKey === p.key || !p.is_custom}
                      className="btn btn-ghost px-3 py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Auf Standard zurücksetzen
                    </button>
                    {status[p.key] && (
                      <span className="text-xs text-neutral-500">{status[p.key]}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-4 text-[11px] text-neutral-400">
            Platzhalter in geschweiften Klammern (z. B. {"{mediation_title}"}) werden zur Laufzeit
            gefüllt — lass sie stehen. Für eine literale geschweifte Klammer im Text schreibe sie
            doppelt: {"{{"} und {"}}"}. Ein fehlerhafter Prompt fällt automatisch auf den Standard zurück.
          </p>
        </div>
      )}
    </div>
  );
}
