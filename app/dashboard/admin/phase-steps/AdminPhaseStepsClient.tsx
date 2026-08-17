"use client";

import { useCallback, useEffect, useState } from "react";

type MediationType =
  | "trennung"
  | "nachbarschaft"
  | "erbschaft"
  | "wg"
  | "verbraucher"
  // ODR-Familie (Online Dispute Resolution, ehemals "geschaeft")
  | "odr"
  | "schlichtung"
  | "ecommerce"
  | "b2b";
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
  variant_key: string | null;
  title: string;
  description: string;
  placeholder: string;
  reflection_mode: ReflectionMode;
  required_roles: string[] | null;
  position: number;
  enabled: boolean;
};

type MediationVariant = {
  id: number;
  mediation_type: string;
  key: string;
  label: string;
  description: string;
  position: number;
  enabled: boolean;
};

const MEDIATION_TYPES: { value: MediationType; label: string }[] = [
  { value: "trennung", label: "Trennung" },
  { value: "nachbarschaft", label: "Nachbarschaft" },
  { value: "wg", label: "WG & Mitbewohner" },
  { value: "verbraucher", label: "Verbraucher & Handwerker" },
  { value: "mietverhaeltnis", label: "Mietverhältnis" },
  { value: "arbeitsplatz", label: "Arbeitsplatz" },
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

// "" = Standard-Konfiguration des Basistyps (variant_key IS NULL im Backend)
const STANDARD_VARIANT = "";

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

  // ── Varianten (z.B. "Trennung mit Kindern") ─────────────────────────────
  const [variants, setVariants] = useState<MediationVariant[]>([]);
  const [variantsLoading, setVariantsLoading] = useState(false);
  const [variantError, setVariantError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string>(STANDARD_VARIANT);
  const [showVariantManager, setShowVariantManager] = useState(false);
  const [newVariantLabel, setNewVariantLabel] = useState("");
  const [newVariantDescription, setNewVariantDescription] = useState("");
  const [savingVariantId, setSavingVariantId] = useState<number | null>(null);
  const [editingVariantId, setEditingVariantId] = useState<number | null>(null);
  const [editVariantLabel, setEditVariantLabel] = useState("");
  const [editVariantDescription, setEditVariantDescription] = useState("");

  const loadVariants = useCallback(async () => {
    setVariantsLoading(true);
    setVariantError(null);
    try {
      const res = await fetch(`/api/admin/mediation-variants?mediation_type=${mediationType}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.detail ?? data?.error ?? "Varianten konnten nicht geladen werden");
      }
      setVariants(Array.isArray(data) ? data : []);
    } catch (err) {
      setVariantError(err instanceof Error ? err.message : "Unbekannter Fehler");
      setVariants([]);
    } finally {
      setVariantsLoading(false);
    }
  }, [mediationType]);

  useEffect(() => {
    // Beim Wechsel des Mediationstyps zurück auf die Standard-Konfiguration springen,
    // da Varianten-Keys nur innerhalb ihres Typs gültig sind.
    setSelectedVariant(STANDARD_VARIANT);
    loadVariants();
  }, [mediationType, loadVariants]);

  const loadSteps = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const variantParam = selectedVariant ? `&variant_key=${encodeURIComponent(selectedVariant)}` : "";
      const res = await fetch(
        `/api/admin/phase-step-defaults?mediation_type=${mediationType}&phase=${phase}${variantParam}`,
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
  }, [mediationType, phase, selectedVariant]);

  useEffect(() => {
    loadSteps();
  }, [loadSteps]);

  const activeVariant = variants.find((v) => v.key === selectedVariant) ?? null;

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
          variant_key: selectedVariant || null,
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

  // ── Varianten-Verwaltung ─────────────────────────────────────────────────

  const createVariant = async () => {
    const label = newVariantLabel.trim();
    if (!label) {
      setVariantError("Bezeichnung ist erforderlich");
      return;
    }
    setSavingVariantId(-1);
    setVariantError(null);
    try {
      const res = await fetch(`/api/admin/mediation-variants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediation_type: mediationType,
          label,
          description: newVariantDescription,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail ?? "Variante konnte nicht angelegt werden");
      setVariants((prev) => [...prev, data]);
      setNewVariantLabel("");
      setNewVariantDescription("");
      setSelectedVariant(data.key);
    } catch (err) {
      setVariantError(err instanceof Error ? err.message : "Unbekannter Fehler");
    } finally {
      setSavingVariantId(null);
    }
  };

  const startEditVariant = (variant: MediationVariant) => {
    setEditingVariantId(variant.id);
    setEditVariantLabel(variant.label);
    setEditVariantDescription(variant.description);
  };

  const cancelEditVariant = () => {
    setEditingVariantId(null);
    setEditVariantLabel("");
    setEditVariantDescription("");
  };

  const saveVariantEdit = async (variant: MediationVariant) => {
    setSavingVariantId(variant.id);
    setVariantError(null);
    try {
      const res = await fetch(`/api/admin/mediation-variants/${variant.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: editVariantLabel.trim() || variant.label,
          description: editVariantDescription,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail ?? "Aktualisierung fehlgeschlagen");
      setVariants((prev) => prev.map((v) => (v.id === variant.id ? data : v)));
      cancelEditVariant();
    } catch (err) {
      setVariantError(err instanceof Error ? err.message : "Unbekannter Fehler");
    } finally {
      setSavingVariantId(null);
    }
  };

  const toggleVariantEnabled = async (variant: MediationVariant) => {
    setSavingVariantId(variant.id);
    setVariantError(null);
    try {
      const res = await fetch(`/api/admin/mediation-variants/${variant.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !variant.enabled }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail ?? "Aktualisierung fehlgeschlagen");
      setVariants((prev) => prev.map((v) => (v.id === variant.id ? data : v)));
    } catch (err) {
      setVariantError(err instanceof Error ? err.message : "Unbekannter Fehler");
    } finally {
      setSavingVariantId(null);
    }
  };

  const deleteVariant = async (variant: MediationVariant) => {
    if (
      !confirm(
        `Variante "${variant.label}" wirklich löschen? Alle dafür angelegten Zusatz-Schritte werden mitgelöscht.`,
      )
    )
      return;
    setSavingVariantId(variant.id);
    setVariantError(null);
    try {
      const res = await fetch(`/api/admin/mediation-variants/${variant.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail ?? "Löschen fehlgeschlagen");
      setVariants((prev) => prev.filter((v) => v.id !== variant.id));
      if (selectedVariant === variant.key) {
        setSelectedVariant(STANDARD_VARIANT);
      }
    } catch (err) {
      setVariantError(err instanceof Error ? err.message : "Unbekannter Fehler");
    } finally {
      setSavingVariantId(null);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 px-6 py-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-xl font-semibold text-neutral-800">Workflow Designer</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Standard-Schritte pro Mediationstyp und Phase verwalten. Diese Konfiguration gilt global
          für alle neuen und bestehenden Fälle des jeweiligen Typs. Zusätzlich lassen sich pro Typ
          frei benennbare Varianten anlegen (z.B. &bdquo;Trennung mit Kindern&ldquo;), die eigene
          Zusatz-Schritte bekommen.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <select
            value={mediationType}
            onChange={(e) => setMediationType(e.target.value as MediationType)}
            className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700"
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
            className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700"
          >
            {PHASES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>

          <select
            value={selectedVariant}
            onChange={(e) => setSelectedVariant(e.target.value)}
            disabled={variantsLoading}
            className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700"
          >
            <option value={STANDARD_VARIANT}>Standard (Basis-Konfiguration)</option>
            {variants.map((v) => (
              <option key={v.key} value={v.key}>
                {v.label}
                {!v.enabled ? " (deaktiviert)" : ""}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowVariantManager((v) => !v)}
            className="rounded-lg border border-dashed border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-500 hover:border-accent-400 hover:text-accent-600"
          >
            {showVariantManager ? "Varianten ausblenden" : "Varianten verwalten"}
          </button>
        </div>

        {activeVariant && (
          <div className="mt-3 rounded-lg border border-accent-200 bg-accent-50 px-4 py-2 text-xs text-accent-700">
            Du bearbeitest gerade die Zusatz-Schritte der Variante <strong>{activeVariant.label}</strong>.
            Diese ergänzen die Standard-Konfiguration von &bdquo;{MEDIATION_TYPES.find((t) => t.value === mediationType)?.label}&ldquo;
            für Fälle, die diese Variante nutzen — sie ersetzen sie nicht.
          </div>
        )}

        {showVariantManager && (
          <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-4">
            <h2 className="text-sm font-semibold text-neutral-700">
              Varianten von {MEDIATION_TYPES.find((t) => t.value === mediationType)?.label}
            </h2>

            {variantError && (
              <div className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {variantError}
              </div>
            )}

            {variantsLoading ? (
              <p className="mt-3 text-sm text-neutral-400">Lade Varianten…</p>
            ) : variants.length === 0 ? (
              <p className="mt-3 text-sm text-neutral-400">Noch keine Varianten für diesen Typ angelegt.</p>
            ) : (
              <ul className="mt-3 divide-y divide-neutral-100">
                {variants.map((variant) => (
                  <li key={variant.id} className="py-2.5">
                    {editingVariantId === variant.id ? (
                      <div className="flex flex-col gap-2">
                        <input
                          value={editVariantLabel}
                          onChange={(e) => setEditVariantLabel(e.target.value)}
                          placeholder="Bezeichnung"
                          className="rounded-md border border-neutral-200 px-2 py-1 text-sm"
                        />
                        <textarea
                          value={editVariantDescription}
                          onChange={(e) => setEditVariantDescription(e.target.value)}
                          placeholder="Beschreibung"
                          rows={2}
                          className="rounded-md border border-neutral-200 px-2 py-1 text-sm"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveVariantEdit(variant)}
                            disabled={savingVariantId === variant.id}
                            className="rounded-md bg-accent-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-accent-700 disabled:opacity-50"
                          >
                            Speichern
                          </button>
                          <button
                            onClick={cancelEditVariant}
                            className="rounded-md border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50"
                          >
                            Abbrechen
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-neutral-800">{variant.label}</span>
                            <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-mono text-neutral-400">
                              {variant.key}
                            </span>
                            {!variant.enabled && (
                              <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                                deaktiviert
                              </span>
                            )}
                          </div>
                          {variant.description && (
                            <p className="mt-0.5 truncate text-xs text-neutral-500">{variant.description}</p>
                          )}
                        </div>

                        <label className="flex items-center gap-1.5 text-xs text-neutral-500">
                          <input
                            type="checkbox"
                            checked={variant.enabled}
                            disabled={savingVariantId === variant.id}
                            onChange={() => toggleVariantEnabled(variant)}
                          />
                          aktiv
                        </label>

                        <button
                          onClick={() => startEditVariant(variant)}
                          className="rounded-md border border-neutral-200 px-2.5 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-50"
                        >
                          Bearbeiten
                        </button>
                        <button
                          onClick={() => deleteVariant(variant)}
                          disabled={savingVariantId === variant.id}
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

            <div className="mt-4 flex flex-col gap-2 border-t border-neutral-100 pt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                Neue Variante anlegen
              </h3>
              <input
                value={newVariantLabel}
                onChange={(e) => setNewVariantLabel(e.target.value)}
                placeholder="z.B. Trennung mit Kindern"
                className="rounded-md border border-neutral-200 px-2 py-1.5 text-sm"
              />
              <textarea
                value={newVariantDescription}
                onChange={(e) => setNewVariantDescription(e.target.value)}
                placeholder="Beschreibung (optional)"
                rows={2}
                className="rounded-md border border-neutral-200 px-2 py-1.5 text-sm"
              />
              <div>
                <button
                  onClick={createVariant}
                  disabled={savingVariantId === -1 || !newVariantLabel.trim()}
                  className="rounded-md bg-accent-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-accent-700 disabled:opacity-50"
                >
                  Variante anlegen
                </button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 rounded-xl border border-neutral-200 bg-white">
          {loading ? (
            <div className="px-4 py-6 text-sm text-neutral-400">Lade Schritte…</div>
          ) : steps.length === 0 ? (
            <div className="px-4 py-6 text-sm text-neutral-400">
              {activeVariant
                ? "Keine Zusatz-Schritte für diese Variante konfiguriert."
                : "Keine Schritte für diesen Mediationstyp/Phase konfiguriert."}
            </div>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {steps.map((step, index) => (
                <li
                  key={step.id}
                  draggable={editingId === null}
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(index, e)}
                  onDragEnd={handleDragEnd}
                  className={`px-4 py-3 ${dragIndex === index ? "bg-accent-50" : ""}`}
                >
                  {editingId === step.id ? (
                    <div className="flex flex-col gap-2">
                      <input
                        value={editForm.title}
                        onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                        placeholder="Titel"
                        className="rounded-md border border-neutral-200 px-2 py-1 text-sm"
                      />
                      <textarea
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, description: e.target.value }))
                        }
                        placeholder="Beschreibung"
                        rows={2}
                        className="rounded-md border border-neutral-200 px-2 py-1 text-sm"
                      />
                      <input
                        value={editForm.placeholder}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, placeholder: e.target.value }))
                        }
                        placeholder="Placeholder-Text"
                        className="rounded-md border border-neutral-200 px-2 py-1 text-sm"
                      />
                      <select
                        value={editForm.reflection_mode ?? ""}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            reflection_mode: (e.target.value || null) as ReflectionMode,
                          }))
                        }
                        className="rounded-md border border-neutral-200 px-2 py-1 text-sm"
                      >
                        <option value="">Kein Reflection-Mode</option>
                        <option value="simple">simple</option>
                        <option value="interactive">interactive</option>
                      </select>
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEdit(step.id)}
                          disabled={savingId === step.id}
                          className="rounded-md bg-accent-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-accent-700 disabled:opacity-50"
                        >
                          Speichern
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="rounded-md border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50"
                        >
                          Abbrechen
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="cursor-grab text-neutral-300 select-none" title="Verschieben">
                        ⠿
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-neutral-800">{step.title}</span>
                          <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-mono text-neutral-400">
                            {step.step_key}
                          </span>
                          {!step.enabled && (
                            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                              deaktiviert
                            </span>
                          )}
                        </div>
                        {step.description && (
                          <p className="mt-0.5 truncate text-xs text-neutral-500">
                            {step.description}
                          </p>
                        )}
                      </div>

                      <label className="flex items-center gap-1.5 text-xs text-neutral-500">
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
                        className="rounded-md border border-neutral-200 px-2.5 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-50"
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
            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <h2 className="text-sm font-semibold text-neutral-700">
                {activeVariant ? `Neuen Zusatz-Schritt für "${activeVariant.label}" anlegen` : "Neuen Schritt anlegen"}
              </h2>
              <div className="mt-3 flex flex-col gap-2">
                <input
                  value={newStep.step_key}
                  onChange={(e) => setNewStep((f) => ({ ...f, step_key: e.target.value }))}
                  placeholder="Step-Key (z. B. einleitung_extra)"
                  className="rounded-md border border-neutral-200 px-2 py-1.5 text-sm"
                />
                <input
                  value={newStep.title}
                  onChange={(e) => setNewStep((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Titel"
                  className="rounded-md border border-neutral-200 px-2 py-1.5 text-sm"
                />
                <textarea
                  value={newStep.description}
                  onChange={(e) => setNewStep((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Beschreibung"
                  rows={2}
                  className="rounded-md border border-neutral-200 px-2 py-1.5 text-sm"
                />
                <input
                  value={newStep.placeholder}
                  onChange={(e) => setNewStep((f) => ({ ...f, placeholder: e.target.value }))}
                  placeholder="Placeholder-Text"
                  className="rounded-md border border-neutral-200 px-2 py-1.5 text-sm"
                />
                <select
                  value={newStep.reflection_mode ?? ""}
                  onChange={(e) =>
                    setNewStep((f) => ({
                      ...f,
                      reflection_mode: (e.target.value || null) as ReflectionMode,
                    }))
                  }
                  className="rounded-md border border-neutral-200 px-2 py-1.5 text-sm"
                >
                  <option value="">Kein Reflection-Mode</option>
                  <option value="simple">simple</option>
                  <option value="interactive">interactive</option>
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={createStep}
                    disabled={savingId === -1}
                    className="rounded-md bg-accent-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-accent-700 disabled:opacity-50"
                  >
                    Anlegen
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewStep(EMPTY_NEW_STEP);
                    }}
                    className="rounded-md border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50"
                  >
                    Abbrechen
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="rounded-md border border-dashed border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-500 hover:border-accent-400 hover:text-accent-600"
            >
              + Schritt hinzufügen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
