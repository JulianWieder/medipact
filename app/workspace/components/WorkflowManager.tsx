"use client";

// ── Workflow Manager ─────────────────────────────────────────────────────────
//
// Backend-verbundener Designer für Mediations-Workflows.
//
//   1. Mediationsart wählen (trennung/erbschaft/nachbarschaft).
//   2. Scope wählen: "Basis-Workflow" (gilt für jeden Fall des Typs) oder eine
//      Variante (z.B. "Trennung mit Kindern") — Varianten sind additiv.
//   3. Schritte pro Phase anlegen/umbenennen/löschen/umsortieren.
//   4. NEU: Jeden Schritt als geordnete Liste von BLÖCKEN gestalten
//      ("Seiten-Designer" unter dem Canvas): Methode aus der Palette wählen,
//      Reihenfolge festlegen, pro Block die Felder pflegen, Live-Vorschau der
//      Teilnehmer-Seite sehen. Die Methoden stehen zentral in blockTypes.ts —
//      neue Methoden = reine Frontend-Ergänzung, keine Migration.
//
// Die tatsächlichen Antworten/Inhalte pro Fall (Nutzer/Mediator/KI) werden je
// Block separat gespeichert (mediation_block_responses) und können am Ende
// ausgewertet werden.

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
  DESIGNER_PHASES,
  MEDIATION_TYPES,
  SHARED_MEDIATION_TYPE,
  USER_ONBOARDING_TYPE,
  USER_ONBOARDING_PHASE,
  USER_ONBOARDING_PHASES,
  GATE_MODE_OPTIONS,
  type GateMode,
  type MediationVariantDto,
  type PhaseStepDefaultDto,
  type StepBlockDto,
  type VisibleIf,
} from "../types";
import {
  BLOCK_TYPES,
  BLOCK_GROUPS,
  BLOCK_TYPE_BY_ID,
  makeBlock,
  deriveBlocksFromLegacy,
  isOnboardingOnlyBlock,
  type BlockTypeDef,
  type BlockGroup,
} from "../blockTypes";
import { SectionHeader, WCard, EmptyState, cn } from "../ui";
import Icon from "@/app/components/ui/Icon";
import AiPromptsEditor from "./AiPromptsEditor";
// Der echte Teilnehmer-Renderer – im Designer als Live-Vorschau (preview).
import StepBlocks from "@/app/dashboard/[id]/_shared/StepBlocks";
import {
  fetchVariants,
  createVariant,
  fetchPhaseStepDefaults,
  createPhaseStepDefault,
  updatePhaseStepDefault,
  deletePhaseStepDefault,
  reorderPhaseStepDefaults,
  generateMeetLink,
  generateStepBlocks,
} from "../api";

// Auswahl des Fragebogen-Anlasses (Block-Typ "feedback").
const FEEDBACK_OCCASIONS: { id: "after_videocall" | "before_contract"; label: string }[] = [
  { id: "after_videocall", label: "Nach dem Gespräch" },
  { id: "before_contract", label: "Vor dem Vertrag" },
];

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

// Blöcke eines Schritts ableiten – bevorzugt `blocks`, sonst aus Legacy-Feldern.
function stepBlocks(step: PhaseStepDefaultDto): StepBlockDto[] {
  if (step.blocks && step.blocks.length) return step.blocks;
  return deriveBlocksFromLegacy(step);
}

// ── Badge-Zeile: die Blocktypen eines Schritts als Chips ─────────────────────
function BlockBadges({ blocks }: { blocks: StepBlockDto[] }) {
  if (blocks.length === 0) return null;
  return (
    <div className="mt-1.5 flex flex-wrap gap-1">
      {blocks.map((b, idx) => {
        const def = BLOCK_TYPE_BY_ID[b.type];
        if (!def) return null;
        return (
          <span
            key={`${b.id}-${idx}`}
            className={`inline-flex items-center gap-0.5 rounded-full border px-1.5 py-px text-[9px] font-semibold ${def.badge}`}
            title={def.label}
          >
            <Icon name={def.icon} color="currentColor" size={12} />
            {def.short}
          </span>
        );
      })}
    </div>
  );
}

// ── Custom Node: ein Schritt als kompaktes Kästchen ─────────────────────────
type StepNodeData = {
  label: string;
  stepKey: string;
  blocks: StepBlockDto[];
  /** Basis-Schritt, während eine Variante bearbeitet wird: nur Anzeige. */
  locked: boolean;
  /** Globaler Schritt („Alle Typen"): Inhalt nur im Tab „Alle Typen" editierbar,
   *  Position darf aber von hier aus verschoben werden (sie gilt global). */
  shared: boolean;
  isEditing: boolean;
  editingLabel: string;
  isDesigning: boolean;
  canMoveLeft: boolean;
  canMoveRight: boolean;
  onStartEdit: () => void;
  onChangeEditingLabel: (value: string) => void;
  onSaveEdit: () => void;
  onDelete: () => void;
  onMove: (dir: -1 | 1) => void;
  onOpenDesigner: () => void;
};

function StepNode({ data }: NodeProps) {
  const step = data as unknown as StepNodeData;

  if (step.locked) {
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
        <BlockBadges blocks={step.blocks} />
      </div>
    );
  }

  // Globaler Schritt in der Ansicht eines konkreten Mediationstyps: sichtbar an
  // seiner echten Position, Inhalt aber nur im Tab „Alle Typen" änderbar.
  if (step.shared) {
    return (
      <div
        className="rounded-xl border-2 border-dashed border-amber-300 bg-amber-50/60 px-3 py-2.5"
        style={{ width: NODE_WIDTH }}
        title={
          "Globaler Schritt — Inhalt im Tab „Alle Typen“ bearbeiten. " +
          "Die Position hier gilt für alle Mediationsarten."
        }
      >
        <Handle type="target" position={Position.Left} className="!h-2 !w-2 !bg-amber-300" />
        <Handle type="source" position={Position.Right} className="!h-2 !w-2 !bg-amber-300" />
        <div className="flex items-center gap-1.5">
          <span className="rounded-full bg-amber-200/70 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-800">
            Alle Typen
          </span>
        </div>
        <p className="mt-1 truncate text-sm font-medium text-amber-900">{step.label}</p>
        <p className="mt-0.5 truncate font-mono text-[10px] text-amber-400">{step.stepKey}</p>
        <BlockBadges blocks={step.blocks} />
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={() => step.onMove(-1)}
              disabled={!step.canMoveLeft}
              className="rounded p-1 text-amber-500 hover:bg-amber-100 hover:text-amber-800 disabled:opacity-20"
              title="Nach links (gilt für alle Mediationsarten)"
            >
              ←
            </button>
            <button
              onClick={() => step.onMove(1)}
              disabled={!step.canMoveRight}
              className="rounded p-1 text-amber-500 hover:bg-amber-100 hover:text-amber-800 disabled:opacity-20"
              title="Nach rechts (gilt für alle Mediationsarten)"
            >
              →
            </button>
          </div>
          {/* Gestalten geht auch von hier aus – der Designer warnt, dass die
              Änderung in allen Mediationsarten wirkt. Umbenennen/Löschen
              bleibt dem Tab „Alle Typen" vorbehalten. */}
          <button
            onClick={step.onOpenDesigner}
            className={cn(
              "rounded px-2 py-1 text-[11px] font-semibold transition",
              step.isDesigning
                ? "bg-amber-500 text-white"
                : "bg-amber-100 text-amber-800 hover:bg-amber-200",
            )}
            title="Seite dieses Schritts gestalten (wirkt in allen Mediationsarten)"
          >
            Gestalten
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl border-2 bg-white px-3 py-2.5 shadow-sm transition",
        step.isDesigning ? "border-accent-400 ring-2 ring-accent-100" : "border-neutral-200 hover:border-accent-300",
      )}
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

      <BlockBadges blocks={step.blocks} />

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
            onClick={step.onOpenDesigner}
            className={cn(
              "rounded px-2 py-1 text-[11px] font-semibold transition",
              step.isDesigning
                ? "bg-accent-500 text-white"
                : "bg-accent-50 text-accent-600 hover:bg-accent-100",
            )}
            title="Seite dieses Schritts gestalten"
          >
            Gestalten
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

// ── Kleiner Google-Meet-Link-Button (für Block "videokonferenz") ─────────────
function MeetLinkButton({ onLink, summary }: { onLink: (url: string) => void; summary?: string }) {
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
        className="inline-flex items-center gap-1 rounded-md border border-accent-200 bg-accent-50 px-2 py-1 text-[11px] font-semibold text-accent-700 transition hover:bg-accent-100 disabled:opacity-50"
      >
        {loading ? "Erzeuge Meet-Raum…" : <><Icon name="video" size={13} color="currentColor" /> Google-Meet-Link erzeugen</>}
      </button>
      {error && <p className="mt-1 text-[11px] font-semibold text-red-600">{error}</p>}
    </div>
  );
}

// ── Feld-Bausteine für den Block-Editor ─────────────────────────────────────
const INPUT_CLASS =
  "w-full rounded-md border border-neutral-200 px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-accent-400";

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-1 mt-2 text-[10px] font-semibold uppercase tracking-wide text-neutral-400">
      {children}
    </p>
  );
}

// Liest ein config-Feld als String (tolerant gegenüber undefined/anderen Typen).
function cfgStr(config: Record<string, unknown>, key: string): string {
  const v = config[key];
  return typeof v === "string" ? v : "";
}

// Liest ein config-Feld als Zahl (tolerant).
function cfgNum(config: Record<string, unknown>, key: string, fallback = 0): number {
  const v = config[key];
  return typeof v === "number" && !Number.isNaN(v) ? v : fallback;
}

// Liest ein config-Feld als String-Array (tolerant).
function cfgArr(config: Record<string, unknown>, key: string): string[] {
  const v = config[key];
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

// Editor für eine Liste von Optionen (für Auswahl / Ranking).
function OptionListEditor({
  options,
  onChange,
}: {
  options: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <div className="mt-1 space-y-1">
      {options.map((opt, i) => (
        <div key={i} className="flex items-center gap-1">
          <input
            value={opt}
            onChange={(e) => {
              const next = [...options];
              next[i] = e.target.value;
              onChange(next);
            }}
            placeholder={`Option ${i + 1}`}
            className={INPUT_CLASS}
          />
          <button
            onClick={() => onChange(options.filter((_, j) => j !== i))}
            className="rounded p-1 text-neutral-400 hover:bg-red-50 hover:text-red-500"
            title="Option entfernen"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        onClick={() => onChange([...options, ""])}
        className="rounded-md border border-dashed border-neutral-300 px-2 py-1 text-[11px] font-semibold text-neutral-500 hover:bg-white"
      >
        + Option
      </button>
    </div>
  );
}

// ── Konfig-Felder je Blocktyp ────────────────────────────────────────────────
function BlockConfigEditor({
  block,
  onChange,
}: {
  block: StepBlockDto;
  onChange: (patch: Record<string, unknown>) => void;
}) {
  const c = block.config ?? {};
  switch (block.type) {
    case "textausgabe":
      return (
        <>
          <FieldLabel>Text für die Teilnehmer</FieldLabel>
          <textarea
            value={cfgStr(c, "text")}
            onChange={(e) => onChange({ text: e.target.value })}
            rows={3}
            placeholder="Was sollen die Teilnehmer hier lesen?"
            className={INPUT_CLASS}
          />
        </>
      );
    case "video":
      return (
        <>
          <FieldLabel>Video-URL</FieldLabel>
          <input
            value={cfgStr(c, "url")}
            onChange={(e) => onChange({ url: e.target.value })}
            placeholder="YouTube/Vimeo/Datei-URL …"
            className={INPUT_CLASS}
          />
        </>
      );
    case "texteingabe":
      return (
        <>
          <FieldLabel>Beschriftung (optional)</FieldLabel>
          <input
            value={cfgStr(c, "label")}
            onChange={(e) => onChange({ label: e.target.value })}
            placeholder="z.B. Deine Sicht der Dinge"
            className={INPUT_CLASS}
          />
          <FieldLabel>Platzhalter im Eingabefeld</FieldLabel>
          <input
            value={cfgStr(c, "placeholder")}
            onChange={(e) => onChange({ placeholder: e.target.value })}
            placeholder="z.B. Beschreibe hier …"
            className={INPUT_CLASS}
          />
        </>
      );
    case "datum":
      return (
        <>
          <FieldLabel>Beschriftung</FieldLabel>
          <input
            value={cfgStr(c, "label")}
            onChange={(e) => onChange({ label: e.target.value })}
            placeholder="z.B. Datum der Trennung"
            className={INPUT_CLASS}
          />
          <FieldLabel>Hilfetext (optional)</FieldLabel>
          <input
            value={cfgStr(c, "help")}
            onChange={(e) => onChange({ help: e.target.value })}
            placeholder="z.B. Falls unklar: einfach überspringen."
            className={INPUT_CLASS}
          />
        </>
      );
    case "frage":
      return (
        <>
          <FieldLabel>Frage</FieldLabel>
          <textarea
            value={cfgStr(c, "prompt")}
            onChange={(e) => onChange({ prompt: e.target.value })}
            rows={2}
            placeholder="Konkrete Frage an die Teilnehmer …"
            className={INPUT_CLASS}
          />
        </>
      );
    case "video_aufnahme":
      return (
        <>
          <FieldLabel>Aufnahme-Auftrag (optional)</FieldLabel>
          <textarea
            value={cfgStr(c, "prompt")}
            onChange={(e) => onChange({ prompt: e.target.value })}
            rows={2}
            placeholder="Worüber soll die Person eine Videobotschaft aufnehmen?"
            className={INPUT_CLASS}
          />
        </>
      );
    case "videokonferenz":
      return (
        <>
          <FieldLabel>Meeting-/Call-Link</FieldLabel>
          <input
            value={cfgStr(c, "url")}
            onChange={(e) => onChange({ url: e.target.value })}
            placeholder="Link zum Videoraum (Google Meet/Jitsi/Zoom) …"
            className={INPUT_CLASS}
          />
          <MeetLinkButton summary="Videokonferenz" onLink={(url) => onChange({ url })} />
        </>
      );
    case "feedback":
      return (
        <>
          <FieldLabel>Fragebogen-Anlass</FieldLabel>
          <select
            value={cfgStr(c, "occasion") || "after_videocall"}
            onChange={(e) => onChange({ occasion: e.target.value })}
            className={INPUT_CLASS}
          >
            {FEEDBACK_OCCASIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </>
      );
    case "vertrag":
      return (
        <>
          <FieldLabel>Vertrags-/Dokumentvorlage</FieldLabel>
          <textarea
            value={cfgStr(c, "template")}
            onChange={(e) => onChange({ template: e.target.value })}
            rows={3}
            placeholder="Vorlagentext für den Vertrag / das Dokument …"
            className={INPUT_CLASS}
          />
        </>
      );
    case "ergebnis":
      return (
        <>
          <FieldLabel>Ergebnis-Quelle (Phase)</FieldLabel>
          <select
            value={cfgStr(c, "source_phase")}
            onChange={(e) => onChange({ source_phase: e.target.value })}
            className={INPUT_CLASS}
          >
            <option value="">— frei (Mediator kuratiert pro Fall) —</option>
            {PHASES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-[10px] leading-relaxed text-cyan-700">
            Zeigt (Teile der) Ergebnisse dieser Phase — erst nach Freigabe des Mediators pro Fall.
          </p>
        </>
      );
    case "auswahl":
      return (
        <>
          <FieldLabel>Frage / Aufgabe</FieldLabel>
          <textarea
            value={cfgStr(c, "prompt")}
            onChange={(e) => onChange({ prompt: e.target.value })}
            rows={2}
            placeholder="z.B. Welche Regelung bevorzugst du?"
            className={INPUT_CLASS}
          />
          <FieldLabel>Antwortoptionen</FieldLabel>
          <OptionListEditor options={cfgArr(c, "options")} onChange={(options) => onChange({ options })} />
          <label className="mt-2 flex items-center gap-2 text-[11px] text-neutral-600">
            <input
              type="checkbox"
              checked={c.multi === true}
              onChange={(e) => onChange({ multi: e.target.checked })}
            />
            Mehrfachauswahl erlauben
          </label>
        </>
      );
    case "skala":
      return (
        <>
          <FieldLabel>Frage</FieldLabel>
          <textarea
            value={cfgStr(c, "prompt")}
            onChange={(e) => onChange({ prompt: e.target.value })}
            rows={2}
            placeholder="z.B. Wie wichtig ist dir dieser Punkt?"
            className={INPUT_CLASS}
          />
          <div className="mt-1 flex gap-2">
            <div className="flex-1">
              <FieldLabel>Min</FieldLabel>
              <input
                type="number"
                value={cfgNum(c, "min", 1)}
                onChange={(e) => onChange({ min: Number(e.target.value) })}
                className={INPUT_CLASS}
              />
            </div>
            <div className="flex-1">
              <FieldLabel>Max</FieldLabel>
              <input
                type="number"
                value={cfgNum(c, "max", 10)}
                onChange={(e) => onChange({ max: Number(e.target.value) })}
                className={INPUT_CLASS}
              />
            </div>
          </div>
          <div className="mt-1 flex gap-2">
            <div className="flex-1">
              <FieldLabel>Label links</FieldLabel>
              <input
                value={cfgStr(c, "minLabel")}
                onChange={(e) => onChange({ minLabel: e.target.value })}
                placeholder="z.B. unwichtig"
                className={INPUT_CLASS}
              />
            </div>
            <div className="flex-1">
              <FieldLabel>Label rechts</FieldLabel>
              <input
                value={cfgStr(c, "maxLabel")}
                onChange={(e) => onChange({ maxLabel: e.target.value })}
                placeholder="z.B. sehr wichtig"
                className={INPUT_CLASS}
              />
            </div>
          </div>
        </>
      );
    case "ranking":
      return (
        <>
          <FieldLabel>Aufgabe</FieldLabel>
          <textarea
            value={cfgStr(c, "prompt")}
            onChange={(e) => onChange({ prompt: e.target.value })}
            rows={2}
            placeholder="z.B. Bringe diese Themen in deine Reihenfolge."
            className={INPUT_CLASS}
          />
          <FieldLabel>Zu sortierende Punkte</FieldLabel>
          <OptionListEditor options={cfgArr(c, "options")} onChange={(options) => onChange({ options })} />
        </>
      );
    case "liste":
      return (
        <>
          <FieldLabel>Aufgabe</FieldLabel>
          <textarea
            value={cfgStr(c, "prompt")}
            onChange={(e) => onChange({ prompt: e.target.value })}
            rows={2}
            placeholder="z.B. Sammle alle Themen, die dir wichtig sind."
            className={INPUT_CLASS}
          />
          <FieldLabel>Platzhalter je Eintrag</FieldLabel>
          <input
            value={cfgStr(c, "placeholder")}
            onChange={(e) => onChange({ placeholder: e.target.value })}
            placeholder="z.B. Ein Thema …"
            className={INPUT_CLASS}
          />
        </>
      );
    case "betrag":
      return (
        <>
          <FieldLabel>Beschriftung</FieldLabel>
          <input
            value={cfgStr(c, "label")}
            onChange={(e) => onChange({ label: e.target.value })}
            placeholder="z.B. Wert der Immobilie"
            className={INPUT_CLASS}
          />
          <FieldLabel>Einheit / Währung</FieldLabel>
          <input
            value={cfgStr(c, "currency") || "€"}
            onChange={(e) => onChange({ currency: e.target.value })}
            className={INPUT_CLASS}
          />
        </>
      );
    case "vertrauliche_notiz":
      return (
        <>
          <FieldLabel>Frage / Aufgabe</FieldLabel>
          <textarea
            value={cfgStr(c, "prompt")}
            onChange={(e) => onChange({ prompt: e.target.value })}
            rows={2}
            placeholder="Was möchtest du nur dem Mediator mitteilen?"
            className={INPUT_CLASS}
          />
          <p className="mt-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5 text-[11px] text-slate-600">
            <Icon name="lock" size={12} color="currentColor" /> Sichtbar nur für den Mediator – die Gegenseite sieht diese Eingabe nicht.
          </p>
        </>
      );
    case "datei_upload":
      return (
        <>
          <FieldLabel>Aufgabe</FieldLabel>
          <textarea
            value={cfgStr(c, "prompt")}
            onChange={(e) => onChange({ prompt: e.target.value })}
            rows={2}
            placeholder="z.B. Lade den Grundbuchauszug hoch."
            className={INPUT_CLASS}
          />
          <FieldLabel>Erlaubte Dateitypen (optional)</FieldLabel>
          <input
            value={cfgStr(c, "accept")}
            onChange={(e) => onChange({ accept: e.target.value })}
            placeholder="z.B. .pdf,.jpg,.png"
            className={INPUT_CLASS}
          />
        </>
      );
    case "bild":
      return (
        <>
          <FieldLabel>Bild-URL</FieldLabel>
          <input
            value={cfgStr(c, "url")}
            onChange={(e) => onChange({ url: e.target.value })}
            placeholder="https://…"
            className={INPUT_CLASS}
          />
          <FieldLabel>Bildunterschrift (optional)</FieldLabel>
          <input
            value={cfgStr(c, "caption")}
            onChange={(e) => onChange({ caption: e.target.value })}
            className={INPUT_CLASS}
          />
        </>
      );
    case "zustimmung":
      return (
        <>
          <FieldLabel>Bestätigungstext</FieldLabel>
          <textarea
            value={cfgStr(c, "text")}
            onChange={(e) => onChange({ text: e.target.value })}
            rows={2}
            placeholder="z.B. Ich akzeptiere die Gesprächsregeln."
            className={INPUT_CLASS}
          />
        </>
      );
    case "unterschrift":
      return (
        <>
          <FieldLabel>Erklärung über der Unterschrift</FieldLabel>
          <textarea
            value={cfgStr(c, "statement")}
            onChange={(e) => onChange({ statement: e.target.value })}
            rows={2}
            placeholder="z.B. Ich bestätige die obigen Angaben."
            className={INPUT_CLASS}
          />
        </>
      );
    case "hinweis":
      return (
        <>
          <FieldLabel>Hinweistext</FieldLabel>
          <textarea
            value={cfgStr(c, "text")}
            onChange={(e) => onChange({ text: e.target.value })}
            rows={2}
            className={INPUT_CLASS}
          />
          <FieldLabel>Art</FieldLabel>
          <select
            value={cfgStr(c, "variant") || "info"}
            onChange={(e) => onChange({ variant: e.target.value })}
            className={INPUT_CLASS}
          >
            <option value="info">Info</option>
            <option value="warnung">Warnung</option>
            <option value="erfolg">Erfolg</option>
          </select>
        </>
      );
    case "akkordeon":
      return (
        <>
          <FieldLabel>Titel (immer sichtbar)</FieldLabel>
          <input
            value={cfgStr(c, "title")}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="z.B. Mehr erfahren"
            className={INPUT_CLASS}
          />
          <FieldLabel>Inhalt (ausklappbar)</FieldLabel>
          <textarea
            value={cfgStr(c, "text")}
            onChange={(e) => onChange({ text: e.target.value })}
            rows={3}
            className={INPUT_CLASS}
          />
        </>
      );
    case "gate":
      return (
        <>
          <FieldLabel>Wartetext</FieldLabel>
          <textarea
            value={cfgStr(c, "text")}
            onChange={(e) => onChange({ text: e.target.value })}
            rows={2}
            placeholder="z.B. Es geht weiter, sobald beide Parteien bestätigt haben."
            className={INPUT_CLASS}
          />
        </>
      );
    // ── Nutzer-Onboarding ────────────────────────────────────────────────
    // Beide Blöcke haben absichtlich nur Überschrift und Erklärtext: WELCHE
    // Felder abgefragt werden, ist fest (sie werden serverseitig in die
    // users-Spalten gespiegelt, siehe services/onboarding.PROFILE_MIRROR).
    // Frei konfigurierbare Feldlisten würden diese Zuordnung brechen.
    case "stammdaten":
    case "rechnungsdaten":
      return (
        <>
          <FieldLabel>Überschrift</FieldLabel>
          <input
            value={cfgStr(c, "title")}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder={
              block.type === "stammdaten" ? "z.B. Deine Angaben" : "z.B. Rechnungsanschrift"
            }
            className={INPUT_CLASS}
          />
          <FieldLabel>Erklärtext</FieldLabel>
          <textarea
            value={cfgStr(c, "description")}
            onChange={(e) => onChange({ description: e.target.value })}
            rows={3}
            placeholder="Warum wird das gebraucht, wer sieht es?"
            className={INPUT_CLASS}
          />
          <p className="mt-2 rounded-xl border border-lime-200 bg-lime-50 p-2 text-xs text-lime-800">
            {block.type === "stammdaten"
              ? "Abgefragt werden Name (Pflicht) und Telefonnummer (optional)."
              : "Abgefragt werden Straße, PLZ und Ort – alle drei sind Pflicht, sonst lässt sich keine Rechnung erstellen."}{" "}
            Die Angaben landen am <strong>Nutzerprofil</strong>, nicht am Fall, und werden
            in neuen Fällen automatisch vorbefüllt. Dieser Block gehört ins
            <strong> Nutzer-Onboarding</strong>.
          </p>
        </>
      );
    case "fall_freischaltung":
      return (
        <>
          <FieldLabel>Überschrift</FieldLabel>
          <input
            value={cfgStr(c, "title")}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="z.B. Mediation freischalten"
            className={INPUT_CLASS}
          />
          <FieldLabel>Erklärtext</FieldLabel>
          <textarea
            value={cfgStr(c, "description")}
            onChange={(e) => onChange({ description: e.target.value })}
            rows={3}
            placeholder="Was die Parteien hier tun und wann abgebucht wird."
            className={INPUT_CLASS}
          />
          <p className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800">
            Betrag, Rabattcodes und Add-ons kommen automatisch aus der Preis-Matrix des
            Falls – hier gibt es dafür bewusst keine Felder. Dieser Block gehört in die
            <strong> Einladungs-Phase</strong>: nur dort ist er erreichbar, bevor bezahlt wurde.
            Das Angebot, den Anteil der Gegenseite mitzubezahlen, steckt bereits darin.
          </p>
        </>
      );
    case "kostenuebernahme":
      return (
        <>
          <FieldLabel>Überschrift</FieldLabel>
          <input
            value={cfgStr(c, "title")}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="z.B. Kosten freiwillig übernehmen"
            className={INPUT_CLASS}
          />
          <FieldLabel>Erklärtext</FieldLabel>
          <textarea
            value={cfgStr(c, "description")}
            onChange={(e) => onChange({ description: e.target.value })}
            rows={3}
            placeholder="Warum es dieses Angebot gibt und was es bedeutet."
            className={INPUT_CLASS}
          />
          <p className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800">
            Betrag und Parteien kommen aus dem Fall. Der Block <strong>verschwindet</strong>,
            wenn es nichts zu übernehmen gibt – etwa weil beide Seiten schon zugesagt haben.
            Im Bezahl-Block ist dasselbe Angebot bereits enthalten; ein eigener Block lohnt
            sich vor allem <strong>vor</strong> dem Bezahl-Schritt, wenn die Übernahme früh
            zur Sprache kommen soll.
          </p>
        </>
      );
    case "bezahlung":
      return (
        <>
          <FieldLabel>Titel der Leistung</FieldLabel>
          <input
            value={cfgStr(c, "title")}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="z.B. Gutachten durch Sachverständige"
            className={INPUT_CLASS}
          />
          <FieldLabel>Beschreibung</FieldLabel>
          <textarea
            value={cfgStr(c, "description")}
            onChange={(e) => onChange({ description: e.target.value })}
            rows={2}
            placeholder="Was ist enthalten?"
            className={INPUT_CLASS}
          />
          <div className="mt-1 flex gap-2">
            <div className="flex-1">
              <FieldLabel>Preis</FieldLabel>
              <input
                type="number"
                min={0}
                step="0.01"
                value={cfgNum(c, "price", 0)}
                onChange={(e) => onChange({ price: Number(e.target.value) })}
                className={INPUT_CLASS}
              />
            </div>
            <div className="w-24">
              <FieldLabel>Währung</FieldLabel>
              <input
                value={cfgStr(c, "currency") || "EUR"}
                onChange={(e) => onChange({ currency: e.target.value })}
                className={INPUT_CLASS}
              />
            </div>
          </div>
          <FieldLabel>Freigeschalteter Inhalt (nach Zahlung)</FieldLabel>
          <textarea
            value={cfgStr(c, "unlock_text")}
            onChange={(e) => onChange({ unlock_text: e.target.value })}
            rows={2}
            placeholder="Text/Anleitung, die erst nach der Zahlung sichtbar wird."
            className={INPUT_CLASS}
          />
          <p className="mt-1 text-[10px] text-amber-700">
            Der Preis wird serverseitig aus dieser Konfiguration gelesen (nicht manipulierbar).
          </p>
        </>
      );
    case "ki_prompt":
    case "ki_zusammenfassung":
    case "ki_reframing":
    case "ki_interessen":
    case "ki_optionen":
    case "ki_gemeinsamkeiten":
      return (
        <>
          <FieldLabel>KI-Auftrag (Prompt)</FieldLabel>
          <textarea
            value={cfgStr(c, "prompt")}
            onChange={(e) => onChange({ prompt: e.target.value })}
            rows={3}
            placeholder="Was soll die KI in diesem Schritt tun? (Die Ausgabe wird pro Fall gespeichert.)"
            className={INPUT_CLASS}
          />
          <label className="mt-2 flex items-center gap-2 text-[11px] text-neutral-600">
            <input
              type="checkbox"
              checked={block.config?.autorun === true}
              onChange={(e) => onChange({ autorun: e.target.checked })}
            />
            Automatisch ausführen, sobald die Eingaben des Schritts vorliegen
          </label>
        </>
      );
    case "individuell":
      return (
        <p className="mt-1 rounded-md border border-pink-200 bg-pink-50 px-2 py-1.5 text-[11px] leading-relaxed text-pink-700">
          Der Inhalt dieses Blocks wird pro Fall in der Fallansicht gepflegt.
        </p>
      );
    default:
      return (
        <p className="mt-1 text-[11px] text-neutral-400">Keine Felder für diesen Blocktyp.</p>
      );
  }
}

// ── Live-Vorschau: die ECHTE Teilnehmer-Seite ───────────────────────────────
//
// Gerendert wird StepBlocks – exakt die Komponente, die die Partei später im
// Dashboard sieht – im Vorschau-Modus (kein Laden, kein Speichern, keine
// Zahlung). Es gibt daher keinen zweiten Renderer mehr, der auseinanderlaufen
// könnte: neue Blocktypen erscheinen hier automatisch so, wie sie im Fall
// aussehen. Drumherum liegt dieselbe Seiten-Hülle wie in PhaseNotesClient
// (app-surface, Phasen-Zeile, Schritt-Nummer, Titel, Beschreibung).
interface StepPreviewProps {
  title: string;
  description: string;
  blocks: StepBlockDto[];
  phaseId: string;
  phaseLabel: string;
  /** 1-basiert, wie in der Teilnehmer-Ansicht ("Phase 2 von 6"). */
  phaseIndex: number;
  phaseTotal: number;
  stepNumber: number;
  stepKey: string;
}

function ParticipantStepPreview({
  title,
  description,
  blocks,
  phaseId,
  phaseLabel,
  phaseIndex,
  phaseTotal,
  stepNumber,
  stepKey,
}: StepPreviewProps) {
  return (
    <div className="rounded-2xl bg-neutral-50 p-4">
      <div className="app-surface p-6">
        <p className="eyebrow mb-1">
          Phase {phaseIndex} von {phaseTotal}
        </p>
        <h1 className="heading-2 text-neutral-900">{phaseLabel}</h1>

        <div className="mt-6">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-100 text-sm font-bold text-accent-700">
              {stepNumber}
            </div>
            <h2 className="text-lg font-bold text-neutral-900">{title}</h2>
          </div>
          {description && (
            <p className="mb-6 ml-11 max-w-2xl text-sm text-neutral-600">{description}</p>
          )}
          {blocks.length === 0 ? (
            <p className="ml-11 text-sm text-neutral-400">
              Noch keine Blöcke — links eine Methode hinzufügen.
            </p>
          ) : (
            <StepBlocks
              // Kein Fall-Kontext: preview unterbindet jeden Server-Aufruf.
              mediationId=""
              phase={phaseId}
              stepKey={stepKey}
              blocks={blocks}
              preview
            />
          )}
        </div>
      </div>
    </div>
  );
}

function StepPreview(props: StepPreviewProps) {
  const [full, setFull] = useState(false);

  useEffect(() => {
    if (!full) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFull(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [full]);

  return (
    <>
      <div className="rounded-2xl border border-neutral-200 bg-white p-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">
            Vorschau — so sieht die Partei den Schritt
          </p>
          <button
            onClick={() => setFull(true)}
            className="rounded-lg border border-neutral-200 px-2 py-1 text-[11px] font-semibold text-neutral-500 transition hover:bg-neutral-50"
            title="Vorschau in voller Breite öffnen"
          >
            ⛶ In groß
          </button>
        </div>
        <ParticipantStepPreview {...props} />
      </div>

      {full && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-neutral-900/50 p-6"
          onClick={() => setFull(false)}
        >
          <div
            className="w-full max-w-4xl rounded-3xl bg-white p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex items-center justify-between px-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                Vorschau in voller Breite
              </p>
              <button
                onClick={() => setFull(false)}
                className="rounded-lg border border-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-500 hover:bg-neutral-50"
              >
                Schließen (Esc)
              </button>
            </div>
            <ParticipantStepPreview {...props} />
          </div>
        </div>
      )}
    </>
  );
}

// Editor für die Sichtbarkeitsbedingung eines Schritts (Eskalation/Segmentierung).
// Fortschritts-Sperre: wann gibt dieser Schritt den nächsten frei? Ohne sie
// war der Schritt-Navigator der Teilnehmer frei anklickbar – man konnte Schritt
// 5 öffnen, ohne Schritt 1 abgeschlossen zu haben.
function GateModeEditor({
  value,
  onChange,
}: {
  value: GateMode | null | undefined;
  onChange: (mode: GateMode) => void;
}) {
  const active: GateMode = value ?? "self";
  const hint = GATE_MODE_OPTIONS.find((o) => o.value === active)?.hint ?? "";
  return (
    <div className="mb-4 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-semibold text-neutral-500">
          <Icon name="lock" size={12} color="currentColor" /> Nächster Schritt öffnet
        </span>
        {GATE_MODE_OPTIONS.map((o) => (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            title={o.hint}
            className={cn(
              "rounded-full border px-2.5 py-1 font-semibold transition",
              active === o.value
                ? "border-accent-500 bg-accent-50 text-accent-700"
                : "border-neutral-200 text-neutral-500 hover:bg-neutral-50",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
      <p className="mt-1.5 leading-snug text-neutral-400">{hint}</p>
    </div>
  );
}

function VisibleIfEditor({
  cond,
  onChange,
}: {
  cond: VisibleIf | null | undefined;
  onChange: (c: VisibleIf | null) => void;
}) {
  const first = cond?.all?.[0];
  const flag = typeof first?.flag === "string" ? first.flag : "";
  const eq = first ? String(first.eq ?? "") : "";
  function upd(f: string, v: string) {
    if (!f.trim()) {
      onChange(null);
      return;
    }
    onChange({ all: [{ flag: f.trim(), eq: v }] });
  }
  const inputCls =
    "w-36 rounded-md border border-neutral-200 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-accent-400";
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs">
      <span className="font-semibold text-neutral-500"><Icon name="eye" size={12} color="currentColor" /> Sichtbar wenn Flag</span>
      <input
        value={flag}
        onChange={(e) => upd(e.target.value, eq)}
        placeholder="z.B. glasl_zone"
        className={inputCls}
      />
      <span className="text-neutral-400">=</span>
      <input
        value={eq}
        onChange={(e) => upd(flag, e.target.value)}
        placeholder="z.B. lose_lose"
        className={inputCls}
      />
      {flag ? (
        <button
          onClick={() => onChange(null)}
          className="text-neutral-400 underline hover:text-neutral-600"
        >
          zurücksetzen (immer sichtbar)
        </button>
      ) : (
        <span className="text-neutral-400">leer = immer sichtbar</span>
      )}
    </div>
  );
}

// ── Der eigentliche Seiten-Designer (Palette + Blockliste + Vorschau) ────────
/** Block-Gruppen, die einen laufenden Fall voraussetzen und deshalb im
 *  Nutzer-Onboarding nicht angeboten werden. "KI" fehlt hier bewusst: eine
 *  KI-Auswertung der Onboarding-Antworten ist denkbar, nur heute ungenutzt. */
const FALL_ONLY_GROUPS = new Set<BlockGroup>([
  "Gespräch & Termin",
  "Bezahlung",
  "Speziell",
]);

function StepDesignerPanel({
  step,
  onAddBlock,
  onRemoveBlock,
  onMoveBlock,
  onChangeBlockConfig,
  onChangeVisibleIf,
  onChangeGateMode,
  onAiFill,
  onClose,
  shared = false,
  userOnboarding = false,
  phaseLabel,
  phaseIndex,
  phaseTotal,
  stepNumber,
}: {
  step: PhaseStepDefaultDto;
  /** true = globaler Schritt, geöffnet aus der Ansicht eines konkreten Typs. */
  shared?: boolean;
  /** true = Schritt des Nutzer-Onboardings (Reiter "@user"). Steuert, welche
   *  Blocktypen die Palette anbietet: Stammdaten/Rechnungsanschrift gibt es
   *  nur hier, alles Fallbezogene (Bezahlung, Termin, Vertrag) nur dort. */
  userOnboarding?: boolean;
  /** Für die Vorschau-Hülle: Phasen-Zeile und Schritt-Nummer wie im Dashboard. */
  phaseLabel: string;
  phaseIndex: number;
  phaseTotal: number;
  stepNumber: number;
  onAddBlock: (type: string) => void;
  onRemoveBlock: (blockId: string) => void;
  onMoveBlock: (blockId: string, dir: -1 | 1) => void;
  onChangeBlockConfig: (blockId: string, patch: Record<string, unknown>) => void;
  onChangeVisibleIf: (cond: VisibleIf | null) => void;
  onChangeGateMode: (mode: GateMode) => void;
  onAiFill: () => Promise<void>;
  onClose: () => void;
}) {
  const blocks = stepBlocks(step);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  async function handleAiFill() {
    setAiError("");
    setAiLoading(true);
    try {
      await onAiFill();
    } catch {
      setAiError("KI-Vorbefüllen fehlgeschlagen.");
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <div className="border-t border-neutral-100 bg-neutral-50/50 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-accent-600">Seiten-Designer</p>
          <h4 className="text-sm font-semibold text-neutral-800">
            Schritt „{step.title}" gestalten
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAiFill}
            disabled={aiLoading}
            className="rounded-lg border border-fuchsia-200 bg-fuchsia-50 px-3 py-1 text-xs font-semibold text-fuchsia-700 transition hover:bg-fuchsia-100 disabled:opacity-50"
            title="Blöcke für diesen Schritt per KI vorschlagen (ersetzt die aktuellen Blöcke)"
          >
            {aiLoading ? "KI erzeugt …" : <><Icon name="sparkles" size={12} color="currentColor" /> Per KI vorbefüllen</>}
          </button>
          <button
            onClick={onClose}
            className="rounded-lg border border-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-500 hover:bg-white"
          >
            Schließen
          </button>
        </div>
      </div>
      {aiError && <p className="mb-3 text-xs font-semibold text-red-600">{aiError}</p>}

      {shared && (
        <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs text-amber-900">
          <span className="font-semibold">Globaler Schritt.</span> Was du hier änderst, gilt sofort in{" "}
          <span className="font-semibold">allen</span> Mediationsarten — nicht nur in dieser.
          Formuliere die Inhalte entsprechend typneutral.
        </div>
      )}

      {/* Beide Regler setzen einen Fall voraus: die Fortschritts-Sperre regelt,
          wann die ANDERE Partei weiterdarf (im Onboarding gibt es keine), und
          die Sichtbarkeitsbedingung prüft mediations.flags (die es ohne Fall
          nicht gibt). Im Onboarding deshalb ausgeblendet statt wirkungslos
          anzubieten. */}
      {!userOnboarding && (
        <>
          <GateModeEditor value={step.gate_mode} onChange={onChangeGateMode} />
          <VisibleIfEditor cond={step.visible_if} onChange={onChangeVisibleIf} />
        </>
      )}

      {/* Palette: Methoden nach Gruppe */}
      <div className="mb-5 rounded-xl border border-neutral-200 bg-white p-3">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-neutral-400">
          Methode hinzufügen
        </p>
        <div className="space-y-2">
          {BLOCK_GROUPS.map((group) => {
            // Im Onboarding gibt es keinen Fall, keine Gegenseite und keine
            // Zahlung – dort wären Bezahl-, Termin- und Vertragsblöcke
            // Blindgänger. Umgekehrt haben Stammdaten in einem Fall-Schritt
            // keinen Adressaten, die Person ist da längst bekannt.
            const items = BLOCK_TYPES.filter((b) => {
              if (b.group !== group) return false;
              return userOnboarding
                ? !FALL_ONLY_GROUPS.has(b.group)
                : !isOnboardingOnlyBlock(b.type);
            });
            if (items.length === 0) return null;
            return (
              <div key={group} className="flex flex-wrap items-center gap-1.5">
                <span className="w-32 shrink-0 text-[10px] font-semibold text-neutral-400">{group}</span>
                {items.map((def: BlockTypeDef) => (
                  <button
                    key={def.type}
                    onClick={() => onAddBlock(def.type)}
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition hover:brightness-95 ${def.badge}`}
                    title={def.hint}
                  >
                    <Icon name={def.icon} color="currentColor" size={13} />
                    {def.label}
                    <span className="text-neutral-400">＋</span>
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Blockliste */}
        <div className="space-y-2">
          {blocks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-neutral-200 p-6 text-center text-sm text-neutral-400">
              Noch keine Blöcke. Wähle oben eine Methode.
            </div>
          ) : (
            blocks.map((b, idx) => {
              const def = BLOCK_TYPE_BY_ID[b.type];
              return (
                <div key={b.id} className="rounded-xl border border-neutral-200 bg-white p-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
                        def?.badge ?? "border-neutral-200 bg-neutral-50 text-neutral-500"
                      }`}
                    >
                      <Icon name={def?.icon ?? "▪"} color="currentColor" size={13} />
                      {def?.label ?? b.type}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onMoveBlock(b.id, -1)}
                        disabled={idx === 0}
                        className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 disabled:opacity-20"
                        title="Nach oben"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => onMoveBlock(b.id, 1)}
                        disabled={idx === blocks.length - 1}
                        className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 disabled:opacity-20"
                        title="Nach unten"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => onRemoveBlock(b.id)}
                        className="rounded p-1 text-neutral-400 hover:bg-red-50 hover:text-red-500"
                        title="Block entfernen"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  {def?.hint && <p className="mt-1 text-[10px] leading-snug text-neutral-400">{def.hint}</p>}
                  <BlockConfigEditor block={b} onChange={(patch) => onChangeBlockConfig(b.id, patch)} />
                  {/* Pflichtfeld gilt für JEDEN Eingabe-Block gleich, deshalb hier
                      zentral statt in jedem Fall des BlockConfigEditor. Ohne diese
                      Angabe konnte ein Schritt abgeschlossen werden, ohne dass die
                      für die Einigung nötigen Angaben überhaupt gemacht wurden. */}
                  {def?.capturesResponse && def.responseAuthor === "user" && (
                    <label className="mt-2 flex items-center gap-2 text-[11px] text-neutral-600">
                      <input
                        type="checkbox"
                        checked={(b.config ?? {}).required === true}
                        onChange={(e) => onChangeBlockConfig(b.id, { required: e.target.checked })}
                      />
                      Pflichtfeld – Schritt lässt sich ohne Antwort nicht abschließen
                    </label>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Live-Vorschau */}
        <div className="lg:sticky lg:top-4 lg:self-start">
          <StepPreview
            title={step.title}
            description={step.description}
            blocks={blocks}
            phaseId={step.phase}
            phaseLabel={phaseLabel}
            phaseIndex={phaseIndex}
            phaseTotal={phaseTotal}
            stepNumber={stepNumber}
            stepKey={step.step_key}
          />
        </div>
      </div>

      <details className="mt-5 rounded-xl border border-neutral-200 bg-white">
        <summary className="cursor-pointer px-4 py-2.5 text-sm font-semibold text-neutral-700">
          <Icon name="bot" size={13} color="currentColor" /> System-KI-Prompts bearbeiten (global)
        </summary>
        <div className="border-t border-neutral-100 p-2">
          <AiPromptsEditor />
        </div>
      </details>
    </div>
  );
}

// ── KI-Design-Assistent (Chat-Eingabe zum Erzeugen ganzer Schritte) ─────────
function DesignChat({
  phaseLabel,
  onSubmit,
}: {
  phaseLabel: string;
  onSubmit: (instruction: string) => Promise<void>;
}) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");

  async function send() {
    const t = text.trim();
    if (!t) return;
    setError("");
    setDone("");
    setLoading(true);
    try {
      await onSubmit(t);
      setText("");
      setDone("Schritt erstellt und unten im Designer geöffnet.");
    } catch {
      setError("Der Schritt konnte nicht erstellt werden.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mb-6 rounded-2xl border border-fuchsia-200 bg-fuchsia-50/40 p-4">
      <div className="mb-1 flex items-center gap-2">
        <span className="text-sm font-semibold text-fuchsia-800"><Icon name="sparkles" size={13} color="currentColor" /> KI-Design-Assistent</span>
        <span className="rounded-full bg-fuchsia-100 px-2 py-0.5 text-[10px] font-semibold text-fuchsia-700">
          Phase: {phaseLabel}
        </span>
      </div>
      <p className="mb-2 text-xs text-fuchsia-700">
        Beschreibe, welchen Schritt du brauchst – die KI baut ihn aus Blöcken und legt ihn in
        der aktiven Phase an. Danach kannst du ihn frei anpassen.
      </p>
      <div className="flex items-end gap-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) send();
          }}
          rows={2}
          placeholder="z.B. Erstelle einen Schritt zur Interessenklärung mit einer Wichtigkeits-Skala und einer KI-Analyse der Interessen."
          className="flex-1 rounded-xl border border-fuchsia-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-fuchsia-400"
        />
        <button
          onClick={send}
          disabled={loading || !text.trim()}
          className="rounded-xl bg-fuchsia-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-fuchsia-700 disabled:opacity-40"
        >
          {loading ? "Baut …" : "Schritt bauen"}
        </button>
      </div>
      {error && <p className="mt-1 text-xs font-semibold text-red-600">{error}</p>}
      {done && <p className="mt-1 text-xs font-semibold text-emerald-600">{done}</p>}
    </div>
  );
}

// ── Hauptkomponente ──────────────────────────────────────────────────────────
export function WorkflowManager() {
  const [mediationType, setMediationType] = useState(MEDIATION_TYPES[0].id);
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
  // Welcher Schritt ist gerade im Seiten-Designer offen.
  const [designStepId, setDesignStepId] = useState<number | null>(null);

  // Tab „Alle Typen": hier werden die wiederverwendbaren Schritte gepflegt, die
  // in jeder Mediationsart laufen. Varianten gibt es dort nicht (sie gehören zu
  // genau einem Typ).
  const isShared = mediationType === SHARED_MEDIATION_TYPE;
  // Tab „Nutzer-Onboarding": der einmalige Durchlauf pro Person. Auch hier
  // keine Varianten — und nur eine einzige Phase, weil das Onboarding kein
  // Verfahren ist, sondern eine lineare Strecke.
  const isUserOnboarding = mediationType === USER_ONBOARDING_TYPE;
  const phaseList = isUserOnboarding ? USER_ONBOARDING_PHASES : DESIGNER_PHASES;

  // Beim Wechsel in den Onboarding-Reiter (und wieder heraus) muss die Phase
  // mitziehen: "themensammlung" gibt es im Onboarding nicht und "onboarding"
  // nicht in einer Mediationsart — sonst zeigt der Designer eine leere Liste,
  // die wie „nichts konfiguriert" aussieht.
  useEffect(() => {
    if (isUserOnboarding) {
      setActivePhase(USER_ONBOARDING_PHASE);
    } else if (activePhase === USER_ONBOARDING_PHASE) {
      setActivePhase(PHASES[0].id);
    }
  }, [isUserOnboarding, activePhase]);

  useEffect(() => {
    setActiveVariant(null);
    if (mediationType === SHARED_MEDIATION_TYPE || mediationType === USER_ONBOARDING_TYPE) {
      setVariants([]);
      return;
    }
    fetchVariants(mediationType)
      .then((list) => setVariants(list.filter((v) => v.enabled)))
      .catch(() => setVariants([]));
  }, [mediationType]);

  useEffect(() => {
    let cancelled = false;
    setLoadingSteps(true);
    setError("");
    setDesignStepId(null);
    const loads: Promise<PhaseStepDefaultDto[]>[] = [
      // In einer Typ-Ansicht kommen die globalen Schritte mit in die Basis-
      // Liste (an ihrer echten Position), im Tab „Alle Typen" nicht.
      // Globale ("*") Schritte gehören weder in den Reiter „Alle Typen"
      // (da stehen sie ohnehin) noch ins Nutzer-Onboarding — dort wäre ein
      // fallbezogener Schritt sinnlos.
      fetchPhaseStepDefaults(mediationType, activePhase, null, !isShared && !isUserOnboarding),
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
  }, [mediationType, activePhase, activeVariant, isShared, isUserOnboarding]);

  // baseSteps enthält in einer Typ-Ansicht auch die globalen Schritte (Feld
  // `shared`) – sie sind Teil der Reihenfolge, aber inhaltlich gesperrt.
  const editableSteps = activeVariant ? variantSteps : baseSteps;
  const lockedSteps = activeVariant ? baseSteps : [];
  const setEditableSteps = activeVariant ? setVariantSteps : setBaseSteps;
  const chain = useMemo(() => [...lockedSteps, ...editableSteps], [lockedSteps, editableSteps]);

  const activePhaseLabel = phaseList.find((p) => p.id === activePhase)?.label ?? activePhase;
  const typeLabel = isShared
    ? "Alle Typen"
    : isUserOnboarding
      ? "Nutzer-Onboarding"
      : MEDIATION_TYPES.find((t) => t.id === mediationType)?.label ?? mediationType;

  // ── Schritt-Aktionen ──────────────────────────────────────────────────────
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
      // Das Backend vergibt die position anhand der Schritte DIESES Scopes –
      // in einer Typ-Ansicht mit eingemischten globalen Schritten muss die
      // Reihenfolge danach einmal normalisiert werden.
      setEditableSteps((prev) => {
        const next = [...prev, created];
        persistOrder(next);
        return next;
      });
      setNewLabel("");
    } catch {
      setError(
        "Schritt konnte nicht angelegt werden — evtl. ist der Step-Key bereits als globaler Schritt vergeben.",
      );
    }
  }

  async function removeStep(id: number) {
    try {
      await deletePhaseStepDefault(id);
      setEditableSteps((prev) => prev.filter((s) => s.id !== id));
      setDesignStepId((cur) => (cur === id ? null : cur));
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

  // Schreibt die Reihenfolge als fortlaufende Positionen zurück – auch für
  // eingemischte globale Schritte. Deren Position gilt bewusst in ALLEN
  // Mediationsarten (ein Datensatz), das Verschieben hier wirkt also überall.
  const persistOrder = useCallback((list: PhaseStepDefaultDto[]) => {
    reorderPhaseStepDefaults(list.map((s, idx) => ({ id: s.id, position: idx }))).catch(() =>
      setError("Reihenfolge konnte nicht gespeichert werden."),
    );
  }, []);

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

  // ── Blöcke eines Schritts mutieren (debounced persistiert) ────────────────
  const blockTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});
  const persistBlocks = useCallback((id: number, blocks: StepBlockDto[]) => {
    const timers = blockTimers.current;
    if (timers[id]) clearTimeout(timers[id]);
    timers[id] = setTimeout(() => {
      updatePhaseStepDefault(id, { blocks }).catch(() =>
        setError("Blöcke konnten nicht gespeichert werden."),
      );
    }, 400);
  }, []);

  const mutateBlocks = useCallback(
    (id: number, fn: (cur: StepBlockDto[]) => StepBlockDto[]) => {
      setEditableSteps((prev) =>
        prev.map((s) => {
          if (s.id !== id) return s;
          const cur = stepBlocks(s);
          const next = fn(cur);
          persistBlocks(id, next);
          return { ...s, blocks: next };
        }),
      );
    },
    [setEditableSteps, persistBlocks],
  );

  const addBlock = useCallback(
    (id: number, type: string) => mutateBlocks(id, (cur) => [...cur, makeBlock(type)]),
    [mutateBlocks],
  );
  const removeBlock = useCallback(
    (id: number, blockId: string) => mutateBlocks(id, (cur) => cur.filter((b) => b.id !== blockId)),
    [mutateBlocks],
  );
  const moveBlock = useCallback(
    (id: number, blockId: string, dir: -1 | 1) =>
      mutateBlocks(id, (cur) => {
        const list = [...cur];
        const idx = list.findIndex((b) => b.id === blockId);
        const target = idx + dir;
        if (idx < 0 || target < 0 || target >= list.length) return cur;
        [list[idx], list[target]] = [list[target], list[idx]];
        return list;
      }),
    [mutateBlocks],
  );
  const changeBlockConfig = useCallback(
    (id: number, blockId: string, patch: Record<string, unknown>) =>
      mutateBlocks(id, (cur) =>
        cur.map((b) => (b.id === blockId ? { ...b, config: { ...b.config, ...patch } } : b)),
      ),
    [mutateBlocks],
  );

  // KI-Vorbefüllung: erzeugt eine Blockliste für den Schritt und ersetzt die
  // aktuellen Blöcke (der Mediator kann danach frei nachjustieren).
  const aiFillBlocks = useCallback(
    async (id: number, title: string, shared = false) => {
      const { blocks } = await generateStepBlocks({
        // Bei einem globalen Schritt formuliert die KI typneutral, auch wenn
        // man ihn gerade aus der Ansicht eines konkreten Typs heraus öffnet.
        mediation_type: shared ? SHARED_MEDIATION_TYPE : mediationType,
        phase: activePhase,
        title,
      });
      if (blocks && blocks.length) mutateBlocks(id, () => blocks);
    },
    [mediationType, activePhase, mutateBlocks],
  );

  // Sichtbarkeitsbedingung eines Schritts setzen (Eskalation/Segmentierung).
  const changeVisibleIf = useCallback(
    (id: number, cond: VisibleIf | null) => {
      setEditableSteps((prev) =>
        prev.map((s) => (s.id === id ? { ...s, visible_if: cond } : s)),
      );
      updatePhaseStepDefault(id, { visible_if: cond }).catch(() =>
        setError("Sichtbarkeit konnte nicht gespeichert werden."),
      );
    },
    [setEditableSteps],
  );

  // Fortschritts-Sperre eines Schritts setzen (gibt den nächsten Schritt frei).
  const changeGateMode = useCallback(
    (id: number, mode: GateMode) => {
      setEditableSteps((prev) =>
        prev.map((s) => (s.id === id ? { ...s, gate_mode: mode } : s)),
      );
      updatePhaseStepDefault(id, { gate_mode: mode }).catch(() =>
        setError("Sperre konnte nicht gespeichert werden."),
      );
    },
    [setEditableSteps],
  );

  // KI-Design-Assistent: erzeugt aus einer freien Instruktion einen komplett
  // neuen Schritt (Titel + Blöcke) in der aktiven Phase und öffnet ihn.
  const createStepFromAi = useCallback(
    async (instruction: string) => {
      const { title, blocks } = await generateStepBlocks({
        mediation_type: mediationType,
        phase: activePhase,
        instruction,
      });
      const label = (title && title.trim()) || instruction.slice(0, 48) || "Neuer Schritt";
      const existing = new Set(chain.map((s) => s.step_key));
      const step_key = slugify(label, existing);
      const created = await createPhaseStepDefault({
        mediation_type: mediationType,
        phase: activePhase,
        step_key,
        title: label,
        variant_key: activeVariant,
        blocks,
      });
      setEditableSteps((prev) => [...prev, created]);
      setDesignStepId(created.id);
    },
    [mediationType, activePhase, activeVariant, chain, setEditableSteps],
  );

  // Beim Öffnen des Designers: hat der Schritt noch keine blocks, aus Legacy
  // ableiten und einmal persistieren, damit ab jetzt blocks maßgeblich sind.
  const openDesigner = useCallback(
    (id: number) => {
      setDesignStepId((cur) => (cur === id ? null : id));
      setEditableSteps((prev) =>
        prev.map((s) => {
          if (s.id !== id) return s;
          if (s.blocks && s.blocks.length) return s;
          const derived = deriveBlocksFromLegacy(s);
          persistBlocks(id, derived);
          return { ...s, blocks: derived };
        }),
      );
    },
    [setEditableSteps, persistBlocks],
  );

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
          const otherCenterX = (offset + originalIdx) * (NODE_WIDTH + NODE_GAP) + NODE_WIDTH / 2;
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

  // ── Nodes/Edges ────────────────────────────────────────────────────────────
  const nodes: Node[] = useMemo(
    () =>
      chain.map((step, idx) => {
        const locked = idx < lockedSteps.length;
        // Gelbe „Fremd"-Darstellung NUR in der Ansicht eines konkreten Typs.
        // Im Tab „Alle Typen" (isShared) ist derselbe Schritt der reguläre,
        // voll editierbare Schritt – das Backend liefert dort ebenfalls
        // shared=true, das allein darf die Karte also nicht sperren.
        const shared = !locked && !isShared && !!step.shared;
        return {
          id: String(step.id),
          type: "step",
          position: { x: idx * (NODE_WIDTH + NODE_GAP), y: NODE_Y },
          draggable: !locked,
          data: {
            label: step.title,
            stepKey: step.step_key,
            blocks: stepBlocks(step),
            locked,
            shared,
            isEditing: editingId === step.id,
            editingLabel,
            isDesigning: designStepId === step.id,
            canMoveLeft: !locked && idx > lockedSteps.length,
            canMoveRight: !locked && idx < chain.length - 1,
            onStartEdit: () => startEdit(step.id, step.title),
            onChangeEditingLabel: (value: string) => setEditingLabel(value),
            onSaveEdit: saveEdit,
            onDelete: () => removeStep(step.id),
            onMove: (dir: -1 | 1) => moveStep(step.id, dir),
            onOpenDesigner: () => openDesigner(step.id),
          } satisfies StepNodeData,
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chain, lockedSteps.length, isShared, editingId, editingLabel, designStepId, moveStep, openDesigner],
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

  // Globale Schritte lassen sich aus jeder Typ-Ansicht gestalten (der Designer
  // weist darauf hin, dass die Änderung überall wirkt).
  const designStep =
    designStepId !== null ? editableSteps.find((s) => s.id === designStepId) ?? null : null;

  return (
    <div className="p-6 max-w-6xl">
      <SectionHeader label="Workspace" title="Workflow Manager" />
      <p className="mb-5 max-w-2xl text-sm text-neutral-500">
        Designe pro Mediationsart den Basis-Workflow und beliebige Varianten. Jeden Schritt
        gestaltest du als geordnete Liste von <span className="font-semibold">Blöcken</span>
        {" "}(Textausgabe, Texteingabe, Video, Frage, Videokonferenz, KI-Prompt …) mit
        Live-Vorschau — klick dazu bei einem Schritt auf <span className="font-semibold">„Gestalten"</span>.
        Schritte, die in <span className="font-semibold">jeder</span> Mediationsart gebraucht werden,
        legst du einmal unter <span className="font-semibold">„Alle Typen"</span> an.
      </p>

      <DesignChat phaseLabel={activePhaseLabel} onSubmit={createStepFromAi} />

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {error}
          <button onClick={() => setError("")} className="ml-3 text-xs underline">
            ausblenden
          </button>
        </div>
      )}

      {/* Mediationsart */}
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
        <span className="mx-1 h-5 w-px bg-neutral-200" />
        <button
          onClick={() => setMediationType(SHARED_MEDIATION_TYPE)}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transition",
            isShared
              ? "bg-amber-500 text-white"
              : "bg-amber-50 text-amber-700 hover:bg-amber-100",
          )}
          title="Schritte, die in jeder Mediationsart laufen — einmal pflegen, überall aktiv"
        >
          ★ Alle Typen
        </button>
        <button
          onClick={() => setMediationType(USER_ONBOARDING_TYPE)}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transition",
            isUserOnboarding
              ? "bg-lime-600 text-white"
              : "bg-lime-50 text-lime-700 hover:bg-lime-100",
          )}
          title="Der einmalige Durchlauf jeder Person, bevor sie Fälle bearbeiten kann"
        >
          ◉ Nutzer-Onboarding
        </button>
      </div>

      {isUserOnboarding && (
        <div className="mb-6 rounded-xl border border-lime-200 bg-lime-50/60 px-4 py-2.5 text-xs text-lime-900">
          Diese Schritte laufen <span className="font-semibold">einmal pro Person</span>, bevor
          sie überhaupt einen Fall bearbeiten kann — nicht in jedem Fall erneut. Solange ein
          Pflichtfeld offen ist, kommt niemand ins Dashboard.
          Die Blöcke <span className="font-semibold">Stammdaten</span> und{" "}
          <span className="font-semibold">Rechnungsanschrift</span> schreiben ins Nutzerprofil und
          befüllen neue Fälle automatisch vor. Formuliere alles fallneutral: hier gibt es noch
          keinen Konflikt und keine Gegenseite.
        </div>
      )}

      {isShared && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-2.5 text-xs text-amber-800">
          Diese Schritte laufen in <span className="font-semibold">jeder</span> Mediationsart mit
          (z.B. ein Persönlichkeitstest). Sie werden nur hier bearbeitet, erscheinen in den
          Typ-Ansichten aber an ihrer echten Position — dort kann die Reihenfolge angepasst werden.
          Formuliere die Inhalte typneutral, sie gelten für Trennung genauso wie für B2B.
        </div>
      )}

      {/* Scope: Basis / Varianten (Varianten gehören zu genau einem Typ) */}
      <div className={cn("mb-6 flex-wrap items-center gap-2", isShared ? "hidden" : "flex")}>
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
          {phaseList.map((phase, idx) => {
            const active = phase.id === activePhase;
            return (
              <button
                key={phase.id}
                onClick={() => {
                  setActivePhase(phase.id);
                  setEditingId(null);
                  setDesignStepId(null);
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
                {active && <span className="text-[11px] text-neutral-400">{chain.length}</span>}
              </button>
            );
          })}
        </div>

        {/* Canvas + Designer */}
        <WCard className="flex-1 overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3">
            <h4 className="text-sm font-semibold text-neutral-800">
              {typeLabel}
              {activeVariantLabel
                ? ` · Variante „${activeVariantLabel}"`
                : isShared
                  ? ""
                  : " · Basis"}
              {" · "}
              {activePhaseLabel}
            </h4>
            <span className="text-xs text-neutral-400">
              {loadingSteps ? "Lädt …" : `${chain.length} Schritt(e)`}
            </span>
          </div>

          <p className="border-b border-neutral-100 bg-neutral-50/60 px-5 py-2 text-[11px] text-neutral-400">
            Titel anklicken zum Umbenennen · <span className="font-semibold">„Gestalten"</span> öffnet den
            Seiten-Designer für diesen Schritt (Blöcke + Live-Vorschau).
            {!isShared && (
              <>
                {" "}
                <span className="text-amber-600">Gelbe Karten</span> sind globale Schritte aus
                „Alle Typen" — auch von hier aus gestaltbar und verschiebbar, die Änderung
                gilt dann in allen Mediationsarten. Umbenennen/Löschen nur im Tab „Alle Typen".
              </>
            )}
          </p>

          {!loadingSteps && chain.length === 0 ? (
            <div className="p-5">
              <EmptyState
                icon="🧭"
                text={
                  activeVariant
                    ? "Diese Variante hat noch keine Zusatz-Schritte für diese Phase."
                    : isShared
                      ? "Noch kein typübergreifender Schritt in dieser Phase."
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

          {/* Seiten-Designer des gewählten Schritts */}
          {designStep && (
            <StepDesignerPanel
              step={designStep}
              onAddBlock={(type) => addBlock(designStep.id, type)}
              onRemoveBlock={(bid) => removeBlock(designStep.id, bid)}
              onMoveBlock={(bid, dir) => moveBlock(designStep.id, bid, dir)}
              onChangeBlockConfig={(bid, patch) => changeBlockConfig(designStep.id, bid, patch)}
              shared={!isShared && !!designStep.shared}
              userOnboarding={isUserOnboarding}
              phaseLabel={activePhaseLabel}
              // Das Onboarding ist keine Verfahrensphase – die Vorschau würde
              // sonst „Phase 0 von 6" behaupten.
              phaseIndex={isUserOnboarding ? 1 : PHASES.findIndex((p) => p.id === activePhase) + 1}
              phaseTotal={isUserOnboarding ? 1 : PHASES.length}
              stepNumber={chain.findIndex((s) => s.id === designStep.id) + 1}
              onChangeVisibleIf={(cond) => changeVisibleIf(designStep.id, cond)}
              onChangeGateMode={(mode) => changeGateMode(designStep.id, mode)}
              onAiFill={() =>
                aiFillBlocks(designStep.id, designStep.title, !!designStep.shared)
              }
              onClose={() => setDesignStepId(null)}
            />
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
                  : isShared
                    ? "Neuer Schritt für alle Mediationsarten …"
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
        Die Blöcke eines Schritts bestimmen, was die Teilnehmer sehen und eingeben. Eingabe-,
        Aufnahme- und KI-Blöcke speichern ihren Inhalt pro Fall separat — Grundlage für die
        spätere Auswertung (wo liegen die Reibungspunkte, wo ist eine Einigung möglich).
      </p>
    </div>
  );
}
