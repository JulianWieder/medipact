"use client";

import { useCallback, useEffect, useState } from "react";

type MediationType = "trennung" | "nachbarschaft" | "erbschaft";
type Phase =
  | "einleitung"
  | "themensammlung"
  | "interessen"
  | "optionen"
  | "verhandlung"
  | "abschluss";

type ReflectionMode = "simple" | "interactive" | null;

type PhaseStepDefault = {
  id: number;
  mediation_type: string;
  phase: string;
  step_key: string;
  title: string;
  description: string;
  placeholder: string;
  reflection_mode: ReflectionMode;
  required_roles: string[] | null;
  position: number;
  enabled: boolean;
};

const MEDIATION_TYPES: { value: MediationType; label: string }[] = [
  { value: "trennung", label: "Trennung" },
  { value: "nachbarschaft", label: "Nachbarschaft" },
  { value: "erbschaft", label: "Erbschaft" },
];

const PHASES: { value: Phase; label: string }[] = [
  { value: "einleitung", label: "Einleitung" },
  { value: "themensammlung", label: "Themensammlung" },
  { value: "interessen", label: "Interessen" },
  { value: "optionen", label: "Optionen" },
  { value: "verhandlung", label: "Verhandlung" },
  { value: "abschluss", label: "Abschluss" },
];

type NewStepForm = {
  step_key: string;
  title: string;
  description: string;
  placeholder: string;
  reflection_mode: ReflectionMode;
};

const EMPTY_NEW_STEP: NewStepForm = {
  step_key: "",
  title: "",
  description: "",
  placeholder: "",
  reflection_mode: null,
};

export default function AdminPhaseStepsClient() {
  const [mediationType, setMediationType] = useState<MediationType>("trennung");
  const [phase, setPhase] = useState<Phase>("einleitung");
  const [steps, setSteps] = useState<PhaseStepDefault[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<NewStepForm>(EMPTY_NEW_STEP);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStep, setNewStep] = useState<NewStepForm>(EMPTY_NEW_STEP);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const loadSteps = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/phase-step-defaults?mediation_type=${mediationType}&phase=${phase}`,
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.detail ?? data?.error ?? "Schritte konnten nicht geladen werden");
      }
      setSteps(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
      setSteps([]);
    } finally {
      setLoading(false);
    }
  }, [mediationType, phase]);

  useEffect(() => {
    loadSteps();
  }, [loadSteps]);

  const handleToggleEnabled = async (step: PhaseStepDefault) => {
    setSavingId(step.id);
    try {
      const res = await fetch(`/api/admin/phase-step-defaults/${step.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !step.enabled }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail ?? "Aktualisierung fehlgeschlagen");
      setSteps((prev) => prev.map((s) => (s.id === step.id ? data : s)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
    } finally {
      setSavingId(null);
    }
  };

  const startEdit = (step: PhaseStepDefault) => {
    setEditingId(step.id);
    setEditForm({
      step_key: step.step_key,
      title: step.title,
      description: step.description,
      placeholder: step.placeholder,
      reflection_mode: step.reflection_mode,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(EMPTY_NEW_STEP);
  };

  const saveEdit = async (id: number) => {
    setSavingId(id);
    try {
      const res = await fetch(`/api/admin/phase-step-defaults/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editForm.title,
          description: editForm.description,
          placeholder: editForm.placeholder,
          reflection_mode: editForm.reflection_mode,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail ?? "Aktualisierung fehlgeschlagen");
      setSteps((prev) => prev.map((s) => (s.id === id ? data : s)));
      cancelEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
    } finally {
      setSavingId(null);
    }
  };

  const deleteStep = async (step: PhaseStepDefault) => {
    if (!confirm(`Schritt "${step.title}" wirklich löschen?`)) return;
    setSavingId(step.id);
    try {
      const res = await fetch(`/api/admin/phase-step-defaults/${step.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail ?? "Löschen fehlgeschlagen");
      setSteps((prev) => prev.filter((s) => s.id !== step.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
    } finally {
      setSavingId(null);
    }
  };

  const createStep = async () => {
    if (!newStep.step_key.trim() || !newStep.title.trim()) {
      setError("Step-Key und Titel sind erforderlich");
      return;
    }
    setSavingId(-1);
    try {
      const res = await fetch(`/api/admin/phase-step-defaults`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediation_type: mediationType,
          phase,
          step_key: newStep.step_key.trim(),
          title: newStep.title.trim(),
          description: newStep.description,
          placeholder: newStep.placeholder,
          reflection_mode: newStep.reflection_mode,
          enabled: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail ?? "Anlegen fehlgeschlagen");
      setSteps((prev) => [...prev, data]);
      setNewStep(EMPTY_NEW_STEP);
      setShowAddForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
    } finally {
      setSavingId(null);
    }
  };

  const persistOrder = async (ordered: PhaseStepDefault[]) => {
    try {
      const res = await fetch(`/api/admin/phase-step-defaults/reorder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: ordered.map((s, idx) => ({ id: s.id, position: idx })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail ?? "Reihenfolge konnte nicht gespeichert werden");
      setSteps(Array.isArray(data) ? data : ordered);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
    }
  };

  const handleDragStart = (index: number) => setDragIndex(index);

  const handleDragOver = (index: number, e: React.DragEvent) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    setSteps((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(index, 0, moved);
      return next;
    });
    setDragIndex(index);
  };

  const handleDragEnd = () => {
    if (dragIndex !== null) {
      persistOrder(steps);
    }
    setDragIndex(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-xl font-semibold text-slate-800">Phasen-Schritt-Konfiguration</h1>
        <p className="mt-1 text-sm text-slate-500">
          Standard-Schritte pro Mediationstyp und Phase verwalten. Diese Konfiguration gilt global
          für alle neuen und bestehenden Fälle des jeweiligen Typs.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <select
            value={mediationType}
            onChange={(e) => setMediationType(e.target.value as MediationType)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
          >
            {MEDIATION_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>

          <select
            value={phase}
            onChange={(e) => setPhase(e.target.value as Phase)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
          >
            {PHASES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 rounded-xl border border-slate-200 bg-white">
          {loading ? (
            <div className="px-4 py-6 text-sm text-slate-400">Lade Schritte…</div>
          ) : steps.length === 0 ? (
            <div className="px-4 py-6 text-sm text-slate-400">
              Keine Schritte für diesen Mediationstyp/Phase konfiguriert.
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {steps.map((step, index) => (
                <li
                  key={step.id}
                  draggable={editingId === null}
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(index, e)}
                  onDragEnd={handleDragEnd}
                  className={`px-4 py-3 ${dragIndex === index ? "bg-teal-50" : ""}`}
                >
                  {editingId === step.id ? (
                    <div className="flex flex-col gap-2">
                      <input
                        value={editForm.title}
                        onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                        placeholder="Titel"
                        className="rounded-md border border-slate-200 px-2 py-1 text-sm"
                      />
                      <textarea
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, description: e.target.value }))
                        }
                        placeholder="Beschreibung"
                        rows={2}
                        className="rounded-md border border-slate-200 px-2 py-1 text-sm"
                      />
                      <input
                        value={editForm.placeholder}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, placeholder: e.target.value }))
                        }
                        placeholder="Placeholder-Text"
                        className="rounded-md border border-slate-200 px-2 py-1 text-sm"
                      />
                      <select
                        value={editForm.reflection_mode ?? ""}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            reflection_mode: (e.target.value || null) as ReflectionMode,
                          }))
                        }
                        className="rounded-md border border-slate-200 px-2 py-1 text-sm"
                      >
                        <option value="">Kein Reflection-Mode</option>
                        <option value="simple">simple</option>
                        <option value="interactive">interactive</option>
                      </select>
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEdit(step.id)}
                          disabled={savingId === step.id}
                          className="rounded-md bg-teal-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-700 disabled:opacity-50"
                        >
                          Speichern
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                        >
                          Abbrechen
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="cursor-grab text-slate-300 select-none" title="Verschieben">
                        ⠿
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-800">{step.title}</span>
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
                            {step.step_key}
                          </span>
                          {!step.enabled && (
                            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                              deaktiviert
                            </span>
                          )}
                        </div>
                        {step.description && (
                          <p className="mt-0.5 truncate text-xs text-slate-500">
                            {step.description}
                          </p>
                        )}
                      </div>

                      <label className="flex items-center gap-1.5 text-xs text-slate-500">
                        <input
                          type="checkbox"
                          checked={step.enabled}
                          disabled={savingId === step.id}
                          onChange={() => handleToggleEnabled(step)}
                        />
                        aktiv
                      </label>

                      <button
                        onClick={() => startEdit(step)}
                        className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
                      >
                        Bearbeiten
                      </button>
                      <button
                        onClick={() => deleteStep(step)}
                        disabled={savingId === step.id}
                        className="rounded-md border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        Löschen
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-4">
          {showAddForm ? (
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h2 className="text-sm font-semibold text-slate-700">Neuen Schritt anlegen</h2>
              <div className="mt-3 flex flex-col gap-2">
                <input
                  value={newStep.step_key}
                  onChange={(e) => setNewStep((f) => ({ ...f, step_key: e.target.value }))}
                  placeholder="Step-Key (z. B. einleitung_extra)"
                  className="rounded-md border border-slate-200 px-2 py-1.5 text-sm"
                />
                <input
                  value={newStep.title}
                  onChange={(e) => setNewStep((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Titel"
                  className="rounded-md border border-slate-200 px-2 py-1.5 text-sm"
                />
                <textarea
                  value={newStep.description}
                  onChange={(e) => setNewStep((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Beschreibung"
                  rows={2}
                  className="rounded-md border border-slate-200 px-2 py-1.5 text-sm"
                />
                <input
                  value={newStep.placeholder}
                  onChange={(e) => setNewStep((f) => ({ ...f, placeholder: e.target.value }))}
                  placeholder="Placeholder-Text"
                  className="rounded-md border border-slate-200 px-2 py-1.5 text-sm"
                />
                <select
                  value={newStep.reflection_mode ?? ""}
                  onChange={(e) =>
                    setNewStep((f) => ({
                      ...f,
                      reflection_mode: (e.target.value || null) as ReflectionMode,
                    }))
                  }
                  className="rounded-md border border-slate-200 px-2 py-1.5 text-sm"
                >
                  <option value="">Kein Reflection-Mode</option>
                  <option value="simple">simple</option>
                  <option value="interactive">interactive</option>
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={createStep}
                    disabled={savingId === -1}
                    className="rounded-md bg-teal-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-700 disabled:opacity-50"
                  >
                    Anlegen
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewStep(EMPTY_NEW_STEP);
                    }}
                    className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                  >
                    Abbrechen
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="rounded-md border border-dashed border-slate-300 px-4 py-2 text-sm font-medium text-slate-500 hover:border-teal-400 hover:text-teal-600"
            >
              + Schritt hinzufügen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
