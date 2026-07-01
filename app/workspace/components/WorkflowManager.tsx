"use client";

// ── Workflow Manager ─────────────────────────────────────────────────────────
//
// Erlaubt es, die Schritte innerhalb jeder Mediationsphase zu definieren,
// umzubenennen, neu zu ordnen und zu löschen. Aktuell ein reines
// Frontend-Mockup: die Vorlage wird lokal im Browser gespeichert (localStorage)
// und ist noch nicht mit dem Backend verbunden — siehe DEFAULT_PHASE_STEPS in
// ../types.ts für Details und Grenzen.

import { useEffect, useState } from "react";
import { PHASES, DEFAULT_PHASE_STEPS, type PhaseStep } from "../types";
import { SectionHeader, WCard, EmptyState, cn } from "../ui";

const STORAGE_KEY = "medipact_workflow_steps_v1";

function loadSteps(): Record<string, PhaseStep[]> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PHASE_STEPS;
    const parsed = JSON.parse(raw) as Record<string, PhaseStep[]>;
    // Mit den Defaults mergen, damit neue Phasen aus DEFAULT_PHASE_STEPS
    // (z.B. nach einem Code-Update) nicht durch alte gespeicherte Daten fehlen.
    return { ...DEFAULT_PHASE_STEPS, ...parsed };
  } catch {
    return DEFAULT_PHASE_STEPS;
  }
}

function slugify(label: string, existing: Set<string>): string {
  const base =
    label
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "_") || "schritt";
  let key = base;
  let i = 2;
  while (existing.has(key)) {
    key = `${base}_${i}`;
    i += 1;
  }
  return key;
}

export function WorkflowManager() {
  const [stepsByPhase, setStepsByPhase] = useState<Record<string, PhaseStep[]>>(DEFAULT_PHASE_STEPS);
  const [hydrated, setHydrated] = useState(false);
  const [activePhase, setActivePhase] = useState(PHASES[0].id);
  const [newLabel, setNewLabel] = useState("");
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState("");

  useEffect(() => {
    setStepsByPhase(loadSteps());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stepsByPhase));
  }, [stepsByPhase, hydrated]);

  const activeSteps = stepsByPhase[activePhase] ?? [];
  const activePhaseLabel = PHASES.find((p) => p.id === activePhase)?.label ?? activePhase;

  function addStep() {
    const label = newLabel.trim();
    if (!label) return;
    const existing = new Set(activeSteps.map((s) => s.key));
    const key = slugify(label, existing);
    setStepsByPhase((prev) => ({
      ...prev,
      [activePhase]: [...(prev[activePhase] ?? []), { key, label }],
    }));
    setNewLabel("");
  }

  function removeStep(key: string) {
    setStepsByPhase((prev) => ({
      ...prev,
      [activePhase]: (prev[activePhase] ?? []).filter((s) => s.key !== key),
    }));
  }

  function startEdit(step: PhaseStep) {
    setEditingKey(step.key);
    setEditingLabel(step.label);
  }

  function saveEdit() {
    if (!editingKey) return;
    const label = editingLabel.trim();
    const key = editingKey;
    setEditingKey(null);
    if (!label) return;
    setStepsByPhase((prev) => ({
      ...prev,
      [activePhase]: (prev[activePhase] ?? []).map((s) => (s.key === key ? { ...s, label } : s)),
    }));
  }

  function moveStep(key: string, dir: -1 | 1) {
    setStepsByPhase((prev) => {
      const list = [...(prev[activePhase] ?? [])];
      const idx = list.findIndex((s) => s.key === key);
      const target = idx + dir;
      if (idx < 0 || target < 0 || target >= list.length) return prev;
      [list[idx], list[target]] = [list[target], list[idx]];
      return { ...prev, [activePhase]: list };
    });
  }

  function resetPhase() {
    setStepsByPhase((prev) => ({
      ...prev,
      [activePhase]: DEFAULT_PHASE_STEPS[activePhase] ?? [],
    }));
  }

  return (
    <div className="p-6 max-w-5xl">
      <SectionHeader
        label="Workspace"
        title="Workflow Manager"
        action={
          <button
            onClick={resetPhase}
            className="text-xs font-medium text-neutral-400 hover:text-neutral-600 transition"
          >
            Phase zurücksetzen
          </button>
        }
      />
      <p className="mb-6 max-w-2xl text-sm text-neutral-500">
        Definiere die einzelnen Schritte innerhalb jeder Mediationsphase. Diese Vorlage bestimmt,
        was Mediator und Parteien in jeder Phase durchlaufen.
      </p>

      <div className="flex gap-6">
        {/* Phasen-Liste */}
        <div className="flex w-56 shrink-0 flex-col gap-1">
          {PHASES.map((phase, idx) => {
            const count = stepsByPhase[phase.id]?.length ?? 0;
            const active = phase.id === activePhase;
            return (
              <button
                key={phase.id}
                onClick={() => {
                  setActivePhase(phase.id);
                  setEditingKey(null);
                }}
                className={cn(
                  "flex items-center justify-between rounded-xl px-3 py-2.5 text-left transition",
                  active ? "bg-accent-50 text-accent-700" : "text-neutral-500 hover:bg-neutral-50",
                )}
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  <span
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
                      active ? "bg-accent-500 text-white" : "bg-neutral-200 text-neutral-500",
                    )}
                  >
                    {idx + 1}
                  </span>
                  {phase.label}
                </span>
                <span className="text-[11px] text-neutral-400">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Schritte der aktiven Phase */}
        <WCard className="flex-1 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-neutral-800">Schritte · {activePhaseLabel}</h4>
            <span className="text-xs text-neutral-400">{activeSteps.length} Schritt(e)</span>
          </div>

          {activeSteps.length === 0 ? (
            <EmptyState icon="🧭" text="Noch keine Schritte für diese Phase definiert." />
          ) : (
            <ul className="mb-4 flex flex-col gap-2">
              {activeSteps.map((step, idx) => (
                <li
                  key={step.key}
                  className="flex items-center gap-3 rounded-xl border border-neutral-200 px-3 py-2.5"
                >
                  <span className="w-5 shrink-0 font-mono text-xs text-neutral-300">{idx + 1}</span>

                  {editingKey === step.key ? (
                    <input
                      autoFocus
                      value={editingLabel}
                      onChange={(e) => setEditingLabel(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                      onBlur={saveEdit}
                      className="flex-1 rounded-lg border border-accent-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-accent-400"
                    />
                  ) : (
                    <button
                      onClick={() => startEdit(step)}
                      className="flex-1 text-left text-sm text-neutral-700 hover:text-accent-700"
                      title="Klicken zum Umbenennen"
                    >
                      {step.label}
                      <span className="ml-2 font-mono text-[10px] text-neutral-300">{step.key}</span>
                    </button>
                  )}

                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      onClick={() => moveStep(step.key, -1)}
                      disabled={idx === 0}
                      className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 disabled:opacity-20"
                      title="Nach oben"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveStep(step.key, 1)}
                      disabled={idx === activeSteps.length - 1}
                      className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 disabled:opacity-20"
                      title="Nach unten"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => removeStep(step.key)}
                      className="rounded p-1 text-neutral-400 hover:bg-red-50 hover:text-red-500"
                      title="Löschen"
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Neuen Schritt hinzufügen */}
          <div className="flex items-center gap-2 border-t border-neutral-100 pt-4">
            <input
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addStep()}
              placeholder="Neuer Schritt …"
              className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent-400"
            />
            <button
              onClick={addStep}
              disabled={!newLabel.trim()}
              className="rounded-lg bg-accent-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-600 disabled:opacity-40"
            >
              Hinzufügen
            </button>
          </div>
        </WCard>
      </div>

      <p className="mt-6 max-w-2xl text-xs text-neutral-400">
        Hinweis: Diese Vorlage wird aktuell lokal im Browser gespeichert (Frontend-Mockup) und ist
        noch nicht mit dem Backend verbunden. Die Standardwerte der Einleitungsphase spiegeln die
        dort aktuell live getrackten Schritte wider.
      </p>
    </div>
  );
}
