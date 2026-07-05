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

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
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
  type MediationVariantDto,
  type PhaseStepDefaultDto,
} from "../types";

// Auswahl des Fragebogen-Anlasses, nur relevant wenn "feedback" gewählt ist.
const FEEDBACK_OCCASIONS: { id: "after_videocall" | "before_contract"; label: string }[] = [
  { id: "after_videocall", label: "Nach dem Gespräch" },
  { id: "before_contract", label: "Vor dem Vertrag" },
];
import { SectionHeader, WCard, EmptyState, cn } from "../ui";
import AiPromptsEditor from "./AiPromptsEditor";
import {
  fetchVariants,
  createVariant,
  fetchPhaseStepDefaults,
  createPhaseStepDefault,
  updatePhaseStepDefault,
  deletePhaseStepDefault,
  reorderPhaseStepDefaults,
  generateMeetLink,
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
  description: string;
  placeholder: string;
  question: string;
  contractTemplate: string;
  resultSourcePhase: string | null;
  videoUrl: string | null;
  meetingUrl: string | null;
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
  onChangeMeetingUrl: (url: string) => void;
  onChangeDescription: (value: string) => void;
  onChangePlaceholder: (value: string) => void;
  onChangeQuestion: (value: string) => void;
  onChangeContractTemplate: (value: string) => void;
  onChangeResultSourcePhase: (phase: string) => void;
  onChangeFeedbackOccasion: (occasion: "after_videocall" | "before_contract") => void;
};

// Kleines Label über einem Inhaltsfeld.
function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-1 mt-2 text-[9px] font-semibold uppercase tracking-wide text-neutral-400">
      {children}
    </p>
  );
}

const FIELD_INPUT_CLASS =
  "w-full rounded-md border border-neutral-200 px-2 py-1 text-[10px] focus:outline-none focus:ring-1 focus:ring-accent-400";

// Inline-Editor: Toggle-Chips für alle Inhaltsarten + die je nach Auswahl
// passenden Inhaltsfelder (Anleitungstext, Platzhalter, Frage, Vertragsvorlage,
// Video-/Meeting-URL, Feedback-Anlass). Bei "individuell" wird der Inhalt nicht
// hier, sondern pro Fall gepflegt – dann erscheint nur ein Hinweis.
// Kleiner Button, der serverseitig einen Google-Meet-Raum erzeugt und den Link
// über onLink zurückgibt (Feld füllen + persistieren übernimmt der Aufrufer).
function MeetLinkButton({
  onLink,
  summary,
}: {
  onLink: (url: string) => void;
  summary?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    setError("");
    setLoading(true);
    try {
      const url = await generateMeetLink(summary);
      onLink(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Meet-Link konnte nicht erzeugt werden");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="inline-flex items-center gap-1 rounded-md border border-accent-200 bg-accent-50 px-2 py-1 text-[10px] font-semibold text-accent-700 transition hover:bg-accent-100 disabled:opacity-50"
      >
        {loading ? "Erzeuge Meet-Raum…" : "🎦 Google-Meet-Link erzeugen"}
      </button>
      {error && <p className="mt-1 text-[10px] font-semibold text-red-600">{error}</p>}
    </div>
  );
}

function ContentTypeEditor({ step }: { step: StepNodeData }) {
  const isIndividual = step.contentTypes.includes("individuell");
  const has = (id: string) => step.contentTypes.includes(id);
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

      {isIndividual ? (
        <div className="mt-2 rounded-md border border-teal-200 bg-teal-50 px-2 py-1.5 text-[10px] leading-relaxed text-teal-700">
          <span className="font-semibold">✦ Individueller Schritt.</span> Der Inhalt
          (eigenes Video, Meeting-Link, Text, Frage, Feedback) wird pro Fall in der
          Fallansicht unter „Individuelle Inhalte" gepflegt. Hier legst du nur Titel
          und Struktur fest.
        </div>
      ) : (
        <>
          <FieldLabel>Anleitungstext (für Teilnehmer)</FieldLabel>
          <textarea
            value={step.description}
            onChange={(e) => step.onChangeDescription(e.target.value)}
            placeholder="Was soll der Teilnehmer in diesem Schritt tun / lesen?"
            rows={2}
            className={FIELD_INPUT_CLASS}
          />

          {has("text") && (
            <>
              <FieldLabel>Platzhalter im Eingabefeld</FieldLabel>
              <input
                value={step.placeholder}
                onChange={(e) => step.onChangePlaceholder(e.target.value)}
                placeholder="z.B. „Beschreibe hier deine Sicht …"
                className={FIELD_INPUT_CLASS}
              />
            </>
          )}

          {has("frage") && (
            <>
              <FieldLabel>Frage / Quiz-Inhalt</FieldLabel>
              <textarea
                value={step.question}
                onChange={(e) => step.onChangeQuestion(e.target.value)}
                placeholder="Konkrete Frage(n) für diesen Schritt …"
                rows={2}
                className={FIELD_INPUT_CLASS}
              />
            </>
          )}

          {has("vertrag") && (
            <>
              <FieldLabel>Vertrags-/Dokumentvorlage</FieldLabel>
              <textarea
                value={step.contractTemplate}
                onChange={(e) => step.onChangeContractTemplate(e.target.value)}
                placeholder="Vorlagentext für den Vertrag / das Dokument …"
                rows={3}
                className={FIELD_INPUT_CLASS}
              />
            </>
          )}

          {has("ergebnis") && (
            <div className="mt-2 rounded-md border border-cyan-200 bg-cyan-50 p-2">
              <FieldLabel>Ergebnis-Quelle (Phase)</FieldLabel>
              <select
                value={step.resultSourcePhase ?? ""}
                onChange={(e) => step.onChangeResultSourcePhase(e.target.value)}
                className={FIELD_INPUT_CLASS}
              >
                <option value="">— frei (Mediator kuratiert pro Fall) —</option>
                {PHASES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-[9px] leading-relaxed text-cyan-700">
                Zeigt allen Teilnehmern (Teile der) Ergebnisse aus dieser Phase –{" "}
                <span className="font-semibold">erst nach Freigabe des Mediators pro Fall</span>.
              </p>
            </div>
          )}

          {has("video") && (
            <>
              <FieldLabel>Video-URL</FieldLabel>
              <input
                value={step.videoUrl ?? ""}
                onChange={(e) => step.onChangeVideoUrl(e.target.value)}
                placeholder="Video-URL (vom Mediator) …"
                className={FIELD_INPUT_CLASS}
              />
            </>
          )}

          {has("videokonferenz") && (
            <>
              <FieldLabel>Meeting-/Call-Link</FieldLabel>
              <input
                value={step.meetingUrl ?? ""}
                onChange={(e) => step.onChangeMeetingUrl(e.target.value)}
                placeholder="Link zum Videoraum (z.B. Google Meet/Jitsi/Zoom) …"
                className={FIELD_INPUT_CLASS}
              />
              <MeetLinkButton
                summary={step.label}
                onLink={(url) => step.onChangeMeetingUrl(url)}
              />
            </>
          )}

          {has("feedback") && (
            <div className="mt-2 flex items-center gap-1">
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
        </>
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

  const [loadingSteps, setLoadingSteps] = useState(true);
  const [error, setError] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [newVariantLabel, setNewVariantLabel] = useState("");
  const [creatingVariant, setCreatingVariant] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingLabel, setEditingLabel] = useState("");
  // Welche Karte hat den Inhaltsart-Editor gerade offen.
  const [contentEditId, setContentEditId] = useState<number | null>(null);

  // ── Laden: Varianten je Mediationsart ────────────────────────────────────
  // (Die Fall↔Variante-Zuordnung wird bewusst NUR im Fall selbst gemacht,
  //  siehe FallDetail – daher hier keine Fallliste mehr.)
  useEffect(() => {
    setActiveVariant(null);
    fetchVariants(mediationType)
      .then((list) => setVariants(list.filter((v) => v.enabled)))
      .catch(() => setVariants([]));
  }, [mediationType]);

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

  // Textfelder (Anleitung, Platzhalter, Frage, Vertragsvorlage, Video-/Meeting-URL):
  // lokal sofort, Persistenz gebündelt (debounced) beim Tippen. Ein Timer pro
  // (Schritt-ID, Feld), damit parallele Felder sich nicht gegenseitig verwerfen.
  const textFieldTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const changeTextField = useCallback(
    (
      id: number,
      field: "description" | "placeholder" | "question" | "contract_template" | "video_url" | "meeting_url",
      value: string,
    ) => {
      setEditableSteps((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
      const timers = textFieldTimers.current;
      const key = `${id}:${field}`;
      if (timers[key]) clearTimeout(timers[key]);
      timers[key] = setTimeout(() => {
        // Leerstring bei URL-Feldern zu null normalisieren; Textfelder als "" halten.
        const isUrl = field === "video_url" || field === "meeting_url";
        const payloadValue = isUrl ? value.trim() || null : value;
        updatePhaseStepDefault(id, { [field]: payloadValue }).catch(() =>
          setError("Inhalt konnte nicht gespeichert werden."),
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

  const changeResultSourcePhase = useCallback(
    (id: number, phase: string) => {
      const value = phase || null;
      setEditableSteps((prev) =>
        prev.map((s) => (s.id === id ? { ...s, result_source_phase: value } : s)),
      );
      updatePhaseStepDefault(id, { result_source_phase: value }).catch(() =>
        setError("Ergebnis-Quelle konnte nicht gespeichert werden."),
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
            description: step.description ?? "",
            placeholder: step.placeholder ?? "",
            question: step.question ?? "",
            contractTemplate: step.contract_template ?? "",
            resultSourcePhase: step.result_source_phase,
            videoUrl: step.video_url,
            meetingUrl: step.meeting_url,
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
            onChangeVideoUrl: (url: string) => changeTextField(step.id, "video_url", url),
            onChangeMeetingUrl: (url: string) => changeTextField(step.id, "meeting_url", url),
            onChangeDescription: (value: string) => changeTextField(step.id, "description", value),
            onChangePlaceholder: (value: string) => changeTextField(step.id, "placeholder", value),
            onChangeQuestion: (value: string) => changeTextField(step.id, "question", value),
            onChangeContractTemplate: (value: string) =>
              changeTextField(step.id, "contract_template", value),
            onChangeResultSourcePhase: (phase: string) =>
              changeResultSourcePhase(step.id, phase),
            onChangeFeedbackOccasion: (occasion: "after_videocall" | "before_contract") =>
              changeFeedbackOccasion(step.id, occasion),
          } satisfies StepNodeData,
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chain, lockedSteps.length, editingId, editingLabel, contentEditId, moveStep, toggleContentType, changeTextField, changeResultSourcePhase, changeFeedbackOccasion],
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

      <AiPromptsEditor />

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
            onKeyDown={(e) => e.key === "Enter" && addVariant()}
            placeholder="Neue Variante …"
            className="w-40 rounded-full border border-dashed border-neutral-300 px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-accent-400"
          />
          <button
            onClick={addVariant}
            disabled={!newVariantLabel.trim() || creatingVariant}
            className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-bold text-neutral-600 hover:bg-neutral-200 disabled:opacity-40"
            title="Variante anlegen"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Phasen-Liste */}
        <div className="flex w-56 shrink-0 flex-col gap-1">
          {PHASES.map((phase, idx) => {
            const active = phase.id === activePhase;
            return (
              <button
                key={phase.id}
                onClick={() => {
                  setActivePhase(phase.id);
                  setEditingId(null);
                  setContentEditId(null);
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
                {active && (
                  <span className="text-[11px] text-neutral-400">{chain.length}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Canvas der aktiven Phase */}
        <WCard className="flex-1 overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3">
            <h4 className="text-sm font-semibold text-neutral-800">
              {typeLabel}
              {activeVariantLabel ? ` · Variante „${activeVariantLabel}"` : " · Basis"}
              {" · "}
              {activePhaseLabel}
            </h4>
            <span className="text-xs text-neutral-400">
              {loadingSteps ? "Lädt …" : `${chain.length} Schritt(e)`}
            </span>
          </div>

          <p className="border-b border-neutral-100 bg-neutral-50/60 px-5 py-2 text-[11px] text-neutral-400">
            Titel anklicken zum Umbenennen · <span className="font-semibold">⊞</span> legt die
            Inhaltsarten der Karte fest (Text, Video, Frage, Videokonferenz + Transkript, …).
          </p>

          {!loadingSteps && chain.length === 0 ? (
            <div className="p-5">
              <EmptyState
                icon="🧭"
                text={
                  activeVariant
                    ? "Diese Variante hat noch keine Zusatz-Schritte für diese Phase."
                    : "Noch keine Schritte für diese Phase definiert."
                }
              />
            </div>
          ) : (
            <div style={{ height: 320 }}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodeDragStop={handleNodeDragStop}
                nodesConnectable={false}
                edgesFocusable={false}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                proOptions={{ hideAttribution: true }}
              >
                <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#e2e8f0" />
                <Controls showInteractive={false} />
              </ReactFlow>
            </div>
          )}

          {/* Neuen Schritt hinzufügen */}
          <div className="flex items-center gap-2 border-t border-neutral-100 p-4">
            <input
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addStep()}
              placeholder={
                activeVariant
                  ? `Neuer Zusatz-Schritt für „${activeVariantLabel}" …`
                  : "Neuer Basis-Schritt …"
              }
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
        Die Variante bestimmt, welche Zusatz-Schritte ein Fall durchläuft (Basis + Variante).
        Die Zuordnung eines Falls zu einer Variante machst du direkt im jeweiligen Fall
        (Fallansicht → Variante). Fall-spezifische Anpassungen (Schritte überspringen,
        individuelle Inhalte) ebenfalls im Fall.
      </p>
    </div>
  );
}
