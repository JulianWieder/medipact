"use client";

// ── Workflow Manager ─────────────────────────────────────────────────────────
//
// Backend-verbundener Designer für Mediations-Workflows (ersetzt das frühere
// localStorage-Mockup):
//
//   1. Mediationsart wählen (trennung/erbschaft/nachbarschaft).
//   2. Scope wählen: "Basis-Workflow" (gilt für jeden Fall des Typs) oder eine
//      Variante (z.B. "Trennung mit Kindern") — Varianten sind additiv, ihre
//      Schritte hängen hinter den Basis-Schritten (siehe get_phase_steps im
//      Backend). Im Varianten-Scope werden Basis-Schritte gesperrt (grau)
//      angezeigt, damit die effektive Kette sichtbar bleibt.
//   3. Schritte pro Phase anlegen/umbenennen/löschen/umsortieren — gespeichert
//      in phase_step_defaults (siehe AdminPhaseStepsClient für die Listenform).
//   4. Fälle zuordnen: unten lassen sich alle Fälle der gewählten Mediationsart
//      einer Variante zuordnen (mediations.variant_key). Pro-Fall-Anpassungen
//      (Zusatzschritte, Skips) laufen weiterhin über den jeweiligen Fall.
//
// Weiterhin bewusst OHNE Verzweigungen/Gateways — eine lineare Kette pro Phase.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  Position,
  type Edge,
  type Node,
  type NodeProps,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  PHASES,
  MEDIATION_TYPES,
  CONTENT_TYPES,
  CONTENT_TYPE_BY_ID,
  type MediationCase,
  type MediationVariantDto,
  type PhaseStepDefaultDto,
} from "../types";

// Ob für die gewählten Inhaltsarten eine Video-URL sinnvoll ist.
function needsVideoUrl(types: string[]): boolean {
  return types.includes("video") || types.includes("videokonferenz");
}

// Auswahl des Fragebogen-Anlasses, nur relevant wenn "feedback" gewählt ist.
const FEEDBACK_OCCASIONS: { id: "after_videocall" | "before_contract"; label: string }[] = [
  { id: "after_videocall", label: "Nach dem Gespräch" },
  { id: "before_contract", label: "Vor dem Vertrag" },
];
import { SectionHeader, WCard, EmptyState, StatusBadge, cn } from "../ui";
import {
  fetchAllMediations,
  fetchVariants,
  createVariant,
  fetchPhaseStepDefaults,
  createPhaseStepDefault,
  updatePhaseStepDefault,
  deletePhaseStepDefault,
  reorderPhaseStepDefaults,
  setMediationVariant,
} from "../api";

// ── Layout-Konstanten für die Kette (rein visuell) ───────────────────────────
const NODE_WIDTH = 200;
const NODE_GAP = 90;
const NODE_Y = 60;

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

// ── Custom Node: ein einzelner Schritt als Kästchen im Flow ─────────────────

// Badge-Zeile mit den Inhaltsarten einer Karte (Text/Video/Frage/…).
function ContentTypeBadges({ types }: { types: string[] }) {
  if (types.length === 0) return null;
  return (
    <div className="mt-1.5 flex flex-wrap gap-1">
      {types.map((id) => {
        const def = CONTENT_TYPE_BY_ID[id];
        if (!def) return null;
        return (
          <span
            key={id}
            className={`inline-flex items-center gap-0.5 rounded-full border px-1.5 py-px text-[9px] font-semibold ${def.badge}`}
            title={def.label}
          >
            <span aria-hidden>{def.icon}</span>
            {def.short}
          </span>
        );
      })}
    </div>
  );
}

type StepNodeData = {
  label: string;
  stepKey: string;
  contentTypes: string[];
  videoUrl: string | null;
  feedbackOccasion: "after_videocall" | "before_contract" | null;
  locked: boolean;
  isEditing: boolean;
  editingLabel: string;
  isContentEditing: boolean;
  canMoveLeft: boolean;
  canMoveRight: boolean;
  onStartEdit: () => void;
  onChangeEditingLabel: (value: string) => void;
  onSaveEdit: () => void;
  onDelete: () => void;
  onMove: (dir: -1 | 1) => void;
  onToggleContentEdit: () => void;
  onToggleType: (typeId: string) => void;
  onChangeVideoUrl: (url: string) => void;
  onChangeFeedbackOccasion: (occasion: "after_videocall" | "before_contract") => void;
};

// Inline-Editor: Toggle-Chips für alle Inhaltsarten + optional Video-URL.
function ContentTypeEditor({ step }: { step: StepNodeData }) {
  return (
    <div className="mt-2 rounded-lg border border-neutral-100 bg-neutral-50 p-2">
      <div className="flex flex-wrap gap-1">
        {CONTENT_TYPES.map((t) => {
          const active = step.contentTypes.includes(t.id);
          return (
            <button
              key={t.id}
              onClick={() => step.onToggleType(t.id)}
              className={`inline-flex items-center gap-0.5 rounded-full border px-1.5 py-px text-[9px] font-semibold transition ${
                active ? t.badge : "border-neutral-200 bg-white text-neutral-400 hover:text-neutral-600"
              }`}
              title={t.label}
            >
              <span aria-hidden>{t.icon}</span>
              {t.short}
            </button>
          );
        })}
      </div>
      {needsVideoUrl(step.contentTypes) && (
        <input
          value={step.videoUrl ?? ""}
          onChange={(e) => step.onChangeVideoUrl(e.target.value)}
          placeholder="Video-URL (vom Mediator) …"
          className="mt-1.5 w-full rounded-md border border-neutral-200 px-2 py-1 text-[10px] focus:outline-none focus:ring-1 focus:ring-accent-400"
        />
      )}
      {step.contentTypes.includes("feedback") && (
        <div className="mt-1.5 flex items-center gap-1">
          <span className="text-[9px] font-semibold text-neutral-400">Fragebogen:</span>
          <select
            value={step.feedbackOccasion ?? "after_videocall"}
            onChange={(e) =>
              step.onChangeFeedbackOccasion(e.target.value as "after_videocall" | "before_contract")
            }
            className="flex-1 rounded-md border border-neutral-200 px-1.5 py-1 text-[10px] focus:outline-none focus:ring-1 focus:ring-accent-400"
          >
            {FEEDBACK_OCCASIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

function StepNode({ data }: NodeProps) {
  const step = data as unknown as StepNodeData;

  if (step.locked) {
    // Basis-Schritt im Varianten-Scope: sichtbar, aber nicht editierbar —
    // bearbeitet wird er im Scope "Basis-Workflow".
    return (
      <div
        className="rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50 px-3 py-2.5 opacity-70"
        style={{ width: NODE_WIDTH }}
        title="Basis-Schritt — im Basis-Workflow bearbeiten"
      >
        <Handle type="target" position={Position.Left} className="!h-2 !w-2 !bg-neutral-300" />
        <Handle type="source" position={Position.Right} className="!h-2 !w-2 !bg-neutral-300" />
        <p className="truncate text-sm font-medium text-neutral-500">{step.label}</p>
        <p className="mt-0.5 truncate font-mono text-[10px] text-neutral-300">
          {step.stepKey} · Basis
        </p>
        <ContentTypeBadges types={step.contentTypes} />
      </div>
    );
  }

  return (
    <div
      className="rounded-xl border-2 border-neutral-200 bg-white px-3 py-2.5 shadow-sm transition hover:border-accent-300"
      style={{ width: NODE_WIDTH }}
    >
      <Handle type="target" position={Position.Left} className="!h-2 !w-2 !bg-neutral-300" />
      <Handle type="source" position={Position.Right} className="!h-2 !w-2 !bg-neutral-300" />

      {step.isEditing ? (
        <input
          autoFocus
          value={step.editingLabel}
          onChange={(e) => step.onChangeEditingLabel(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && step.onSaveEdit()}
          onBlur={step.onSaveEdit}
          className="w-full rounded-lg border border-accent-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-accent-400"
        />
      ) : (
        <button
          onClick={step.onStartEdit}
          className="w-full truncate text-left text-sm font-medium text-neutral-700 hover:text-accent-700"
          title="Klicken zum Umbenennen"
        >
          {step.label}
        </button>
      )}
      <p className="mt-0.5 truncate font-mono text-[10px] text-neutral-300">{step.stepKey}</p>

      {!step.isContentEditing && <ContentTypeBadges types={step.contentTypes} />}
      {step.isContentEditing && <ContentTypeEditor step={step} />}

      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            onClick={() => step.onMove(-1)}
            disabled={!step.canMoveLeft}
            className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 disabled:opacity-20"
            title="Nach links"
          >
            ←
          </button>
          <button
            onClick={() => step.onMove(1)}
            disabled={!step.canMoveRight}
            className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 disabled:opacity-20"
            title="Nach rechts"
          >
            →
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={step.onToggleContentEdit}
            className={`rounded p-1 transition ${
              step.isContentEditing
                ? "bg-accent-50 text-accent-600"
                : "text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
            }`}
            title="Inhaltsarten festlegen"
          >
            {step.isContentEditing ? "✓" : "⊞"}
          </button>
          <button
            onClick={step.onDelete}
            className="rounded p-1 text-neutral-400 hover:bg-red-50 hover:text-red-500"
            title="Löschen"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

const nodeTypes: NodeTypes = { step: StepNode };

export function WorkflowManager() {
  const [mediationType, setMediationType] = useState(MEDIATION_TYPES[0].id);
  // null = Basis-Workflow, sonst MediationVariant.key
  const [activeVariant, setActiveVariant] = useState<string | null>(null);
  const [activePhase, setActivePhase] = useState(PHASES[0].id);

  const [variants, setVariants] = useState<MediationVariantDto[]>([]);
  const [baseSteps, setBaseSteps] = useState<PhaseStepDefaultDto[]>([]);
  const [variantSteps, setVariantSteps] = useState<PhaseStepDefaultDto[]>([]);
  const [cases, setCases] = useState<MediationCase[]>([]);

  const [loadingSteps, setLoadingSteps] = useState(true);
  const [error, setError] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [newVariantLabel, setNewVariantLabel] = useState("");
  const [creatingVariant, setCreatingVariant] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingLabel, setEditingLabel] = useState("");
  // Welche Karte hat den Inhaltsart-Editor gerade offen.
  const [contentEditId, setContentEditId] = useState<number | null>(null);
  const [savingCaseId, setSavingCaseId] = useState<number | null>(null);

  // ── Laden: Varianten + Fälle je Mediationsart ────────────────────────────
  useEffect(() => {
    setActiveVariant(null);
    fetchVariants(mediationType)
      .then((list) => setVariants(list.filter((v) => v.enabled)))
      .catch(() => setVariants([]));
  }, [mediationType]);

  const reloadCases = useCallback(() => {
    fetchAllMediations()
      .then(setCases)
      .catch(() => setCases([]));
  }, []);

  useEffect(() => {
    reloadCases();
  }, [reloadCases]);

  // ── Laden: Schritte je (Art, Phase, Scope) ───────────────────────────────
  useEffect(() => {
    let cancelled = false;
    setLoadingSteps(true);
    setError("");
    const loads: Promise<PhaseStepDefaultDto[]>[] = [
      fetchPhaseStepDefaults(mediationType, activePhase),
    ];
    if (activeVariant) {
      loads.push(fetchPhaseStepDefaults(mediationType, activePhase, activeVariant));
    }
    Promise.all(loads)
      .then(([base, variant]) => {
        if (cancelled) return;
        setBaseSteps(base.filter((s) => s.enabled));
        setVariantSteps((variant ?? []).filter((s) => s.enabled));
      })
      .catch(() => {
        if (!cancelled) setError("Schritte konnten nicht geladen werden.");
      })
      .finally(() => {
        if (!cancelled) setLoadingSteps(false);
      });
    return () => {
      cancelled = true;
    };
  }, [mediationType, activePhase, activeVariant]);

  // Im Basis-Scope sind die Basis-Schritte editierbar; im Varianten-Scope
  // werden sie gesperrt vorangestellt und nur die Varianten-Schritte editiert.
  const editableSteps = activeVariant ? variantSteps : baseSteps;
  const lockedSteps = activeVariant ? baseSteps : [];
  const setEditableSteps = activeVariant ? setVariantSteps : setBaseSteps;
  const chain = useMemo(
    () => [...lockedSteps, ...editableSteps],
    [lockedSteps, editableSteps],
  );

  const activePhaseLabel = PHASES.find((p) => p.id === activePhase)?.label ?? activePhase;
  const typeLabel =
    MEDIATION_TYPES.find((t) => t.id === mediationType)?.label ?? mediationType;

  // ── Schritt-Aktionen (persistieren sofort ins Backend) ───────────────────
  async function addStep() {
    const label = newLabel.trim();
    if (!label) return;
    const existing = new Set(chain.map((s) => s.step_key));
    const step_key = slugify(label, existing);
    try {
      const created = await createPhaseStepDefault({
        mediation_type: mediationType,
        phase: activePhase,
        step_key,
        title: label,
        variant_key: activeVariant,
      });
      setEditableSteps((prev) => [...prev, created]);
      setNewLabel("");
    } catch {
      setError("Schritt konnte nicht angelegt werden.");
    }
  }

  async function removeStep(id: number) {
    try {
      await deletePhaseStepDefault(id);
      setEditableSteps((prev) => prev.filter((s) => s.id !== id));
    } catch {
      setError("Schritt konnte nicht gelöscht werden.");
    }
  }

  function startEdit(id: number, title: string) {
    setEditingId(id);
    setEditingLabel(title);
  }

  async function saveEdit() {
    if (editingId === null) return;
    const id = editingId;
    const title = editingLabel.trim();
    setEditingId(null);
    if (!title) return;
    try {
      await updatePhaseStepDefault(id, { title });
      setEditableSteps((prev) => prev.map((s) => (s.id === id ? { ...s, title } : s)));
    } catch {
      setError("Schritt konnte nicht umbenannt werden.");
    }
  }

  const persistOrder = useCallback(
    (list: PhaseStepDefaultDto[]) => {
      reorderPhaseStepDefaults(list.map((s, idx) => ({ id: s.id, position: idx }))).catch(() =>
        setError("Reihenfolge konnte nicht gespeichert werden."),
      );
    },
    [],
  );

  const moveStep = useCallback(
    (id: number, dir: -1 | 1) => {
      setEditableSteps((prev) => {
        const list = [...prev];
        const idx = list.findIndex((s) => s.id === id);
        const target = idx + dir;
        if (idx < 0 || target < 0 || target >= list.length) return prev;
        [list[idx], list[target]] = [list[target], list[idx]];
        persistOrder(list);
        return list;
      });
    },
    [setEditableSteps, persistOrder],
  );

  // ── Inhaltsarten pro Karte (persistieren sofort ins Backend) ─────────────
  const toggleContentType = useCallback(
    (id: number, typeId: string) => {
      setEditableSteps((prev) => {
        const step = prev.find((s) => s.id === id);
        if (!step) return prev;
        const current = step.content_types ?? [];
        const nextSet = new Set(current);
        if (nextSet.has(typeId)) nextSet.delete(typeId);
        else nextSet.add(typeId);
        // Reihenfolge gemäß CONTENT_TYPES bewahren (stabile Badge-Reihenfolge).
        const next = CONTENT_TYPES.map((t) => t.id).filter((tid) => nextSet.has(tid));
        updatePhaseStepDefault(id, { content_types: next }).catch(() =>
          setError("Inhaltsarten konnten nicht gespeichert werden."),
        );
        return prev.map((s) => (s.id === id ? { ...s, content_types: next } : s));
      });
    },
    [setEditableSteps],
  );

  // Video-URL: lokal sofort, Persistenz gebündelt (debounced) beim Tippen.
  const videoUrlTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});
  const changeVideoUrl = useCallback(
    (id: number, url: string) => {
      setEditableSteps((prev) => prev.map((s) => (s.id === id ? { ...s, video_url: url } : s)));
      const timers = videoUrlTimers.current;
      if (timers[id]) clearTimeout(timers[id]);
      timers[id] = setTimeout(() => {
        updatePhaseStepDefault(id, { video_url: url.trim() || null }).catch(() =>
          setError("Video-URL konnte nicht gespeichert werden."),
        );
      }, 600);
    },
    [setEditableSteps],
  );

  const changeFeedbackOccasion = useCallback(
    (id: number, occasion: "after_videocall" | "before_contract") => {
      setEditableSteps((prev) =>
        prev.map((s) => (s.id === id ? { ...s, feedback_occasion: occasion } : s)),
      );
      updatePhaseStepDefault(id, { feedback_occasion: occasion }).catch(() =>
        setError("Feedback-Anlass konnte nicht gespeichert werden."),
      );
    },
    [setEditableSteps],
  );

  // Reihenfolge nach dem Ziehen neu berechnen — nur editierbare Knoten sind
  // draggable; gesperrte Basis-Knoten stehen im Varianten-Scope fest davor.
  const handleNodeDragStop = useCallback(
    (_event: MouseEvent | TouchEvent, draggedNode: Node) => {
      setEditableSteps((prev) => {
        const fromIdx = prev.findIndex((s) => String(s.id) === draggedNode.id);
        if (fromIdx === -1) return prev;

        const offset = lockedSteps.length;
        const dragged = prev[fromIdx];
        const others = prev.filter((s) => String(s.id) !== draggedNode.id);
        const draggedX = draggedNode.position.x;

        let insertAt = others.length;
        for (let i = 0; i < others.length; i += 1) {
          const originalIdx = prev.findIndex((s) => s.id === others[i].id);
          const otherCenterX =
            (offset + originalIdx) * (NODE_WIDTH + NODE_GAP) + NODE_WIDTH / 2;
          if (draggedX < otherCenterX) {
            insertAt = i;
            break;
          }
        }

        const reordered = [...others];
        reordered.splice(insertAt, 0, dragged);
        persistOrder(reordered);
        return reordered;
      });
    },
    [setEditableSteps, lockedSteps.length, persistOrder],
  );

  // ── Varianten anlegen ─────────────────────────────────────────────────────
  async function addVariant() {
    const label = newVariantLabel.trim();
    if (!label) return;
    setCreatingVariant(true);
    try {
      const created = await createVariant(mediationType, label);
      setVariants((prev) => [...prev, created]);
      setActiveVariant(created.key);
      setNewVariantLabel("");
    } catch {
      setError("Variante konnte nicht angelegt werden.");
    } finally {
      setCreatingVariant(false);
    }
  }

  // ── Fall-Zuordnung ────────────────────────────────────────────────────────
  async function assignCase(caseId: number, key: string) {
    const value = key === "" ? null : key;
    setSavingCaseId(caseId);
    try {
      await setMediationVariant(caseId, value);
      setCases((prev) =>
        prev.map((c) => (c.id === caseId ? { ...c, variant_key: value } : c)),
      );
    } catch {
      setError("Fall-Zuordnung konnte nicht gespeichert werden.");
    } finally {
      setSavingCaseId(null);
    }
  }

  const typeCases = useMemo(
    () => cases.filter((c) => c.mediation_type === mediationType),
    [cases, mediationType],
  );

  // ── Nodes/Edges aus der Kette ableiten ────────────────────────────────────
  const nodes: Node[] = useMemo(
    () =>
      chain.map((step, idx) => {
        const locked = idx < lockedSteps.length;
        return {
          id: String(step.id),
          type: "step",
          position: { x: idx * (NODE_WIDTH + NODE_GAP), y: NODE_Y },
          draggable: !locked,
          data: {
            label: step.title,
            stepKey: step.step_key,
            contentTypes: step.content_types ?? [],
            videoUrl: step.video_url,
            feedbackOccasion: step.feedback_occasion,
            locked,
            isEditing: editingId === step.id,
            editingLabel,
            isContentEditing: contentEditId === step.id,
            canMoveLeft: !locked && idx > lockedSteps.length,
            canMoveRight: !locked && idx < chain.length - 1,
            onStartEdit: () => startEdit(step.id, step.title),
            onChangeEditingLabel: (value: string) => setEditingLabel(value),
            onSaveEdit: saveEdit,
            onDelete: () => removeStep(step.id),
            onMove: (dir: -1 | 1) => moveStep(step.id, dir),
            onToggleContentEdit: () =>
              setContentEditId((cur) => (cur === step.id ? null : step.id)),
            onToggleType: (typeId: string) => toggleContentType(step.id, typeId),
            onChangeVideoUrl: (url: string) => changeVideoUrl(step.id, url),
            onChangeFeedbackOccasion: (occasion: "after_videocall" | "before_contract") =>
              changeFeedbackOccasion(step.id, occasion),
          } satisfies StepNodeData,
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chain, lockedSteps.length, editingId, editingLabel, contentEditId, moveStep, toggleContentType, changeVideoUrl, changeFeedbackOccasion],
  );

  const edges: Edge[] = useMemo(
    () =>
      chain.slice(1).map((step, idx) => ({
        id: `${chain[idx].id}->${step.id}`,
        source: String(chain[idx].id),
        target: String(step.id),
        animated: false,
        style: { stroke: "#cbd5e1", strokeWidth: 1.5 },
      })),
    [chain],
  );

  const activeVariantLabel = activeVariant
    ? variants.find((v) => v.key === activeVariant)?.label ?? activeVariant
    : null;

  return (
    <div className="p-6 max-w-6xl">
      <SectionHeader label="Workspace" title="Workflow Manager" />
      <p className="mb-5 max-w-2xl text-sm text-neutral-500">
        Designe pro Mediationsart den Basis-Workflow und beliebige Varianten (z.B.
        &bdquo;Trennung mit Kindern&ldquo;). Varianten ergänzen die Basis-Schritte. Unten ordnest du
        Fälle einer Variante zu — Feinanpassungen für einen einzelnen Fall (Schritte
        überspringen, Zusatzschritte) machst du weiterhin direkt im Fall.
      </p>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {error}
          <button onClick={() => setError("")} className="ml-3 text-xs underline">
            ausblenden
          </button>
        </div>
      )}

      {/* ── Mediationsart ── */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {MEDIATION_TYPES.map((t) => (
          <button
            key={t.id}
            onClick={() => setMediationType(t.id)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition",
              t.id === mediationType
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Scope: Basis-Workflow / Varianten ── */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveVariant(null)}
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-semibold transition",
            activeVariant === null
              ? "border-accent-500 bg-accent-50 text-accent-700"
              : "border-neutral-200 text-neutral-500 hover:border-neutral-300",
          )}
        >
          Basis-Workflow
        </button>
        {variants.map((v) => (
          <button
            key={v.key}
            onClick={() => setActiveVariant(v.key)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-semibold transition",
              activeVariant === v.key
                ? "border-accent-500 bg-accent-50 text-accent-700"
                : "border-neutral-200 text-neutral-500 hover:border-neutral-300",
            )}
            title={v.description || undefined}
          >
            {v.label}
          </button>
        ))}
        <div className="flex items-center gap-1.5">
          <input
            value={newVariantLabel}
            onChange={(e) => setNewVariantLabel(e.target.value)}
  