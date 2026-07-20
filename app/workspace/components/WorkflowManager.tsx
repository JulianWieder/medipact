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
  type BlockTypeDef,
} from "../blockTypes";
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
            <span aria-hidden>{def.icon}</span>
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
  locked: boolean;
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
        {loading ? "Erzeuge Meet-Raum…" : "🎦 Google-Meet-Link erzeugen"}
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
            🔒 Sichtbar nur für den Mediator – die Gegenseite sieht diese Eingabe nicht.
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

// ── Live-Vorschau der Teilnehmer-Seite (nicht interaktiv) ────────────────────
function PreviewBlock({ block }: { block: StepBlockDto }) {
  const c = block.config ?? {};
  const def = BLOCK_TYPE_BY_ID[block.type];
  const text = (k: string) => cfgStr(c, k);
  switch (block.type) {
    case "textausgabe":
      return (
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-700">
          {text("text") || <span className="text-neutral-300">Textausgabe …</span>}
        </p>
      );
    case "video":
      return (
        <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-neutral-900 text-sm text-white/80">
          ▶ {text("url") ? "Video" : "Video-URL fehlt"}
        </div>
      );
    case "texteingabe":
      return (
        <div>
          {text("label") && <p className="mb-1 text-sm font-medium text-neutral-700">{text("label")}</p>}
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-400">
            {text("placeholder") || "Texteingabe …"}
          </div>
        </div>
      );
    case "frage":
      return (
        <div className="rounded-2xl border border-violet-200 bg-violet-50/60 p-3">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-violet-600">Frage</p>
          <p className="text-sm text-neutral-800">{text("prompt") || <span className="text-neutral-300">Frage …</span>}</p>
        </div>
      );
    case "datum":
      return (
        <div>
          {text("label") && <p className="mb-1 text-sm font-medium text-neutral-700">{text("label")}</p>}
          <div className="w-44 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-400">tt.mm.jjjj</div>
          {text("help") && <p className="mt-1 text-[11px] text-neutral-400">{text("help")}</p>}
        </div>
      );
    case "video_aufnahme":
      return (
        <div className="rounded-2xl border border-orange-200 bg-orange-50/60 p-3">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-orange-600">⏺ Video aufnehmen</p>
          <p className="text-sm text-neutral-700">{text("prompt") || "Videobotschaft aufnehmen"}</p>
        </div>
      );
    case "videokonferenz":
      return (
        <div className="rounded-2xl border border-sky-200 bg-sky-50/60 p-3">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-sky-600">Videokonferenz</p>
          <span className="inline-block rounded-lg bg-sky-600 px-3 py-1.5 text-sm font-semibold text-white">🎥 Videoraum beitreten</span>
        </div>
      );
    case "termin":
      return (
        <div className="rounded-2xl border border-teal-200 bg-teal-50/60 p-3 text-sm text-teal-700">📅 Terminvereinbarung</div>
      );
    case "feedback":
      return (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-3 text-sm text-amber-700">★ Feedback-Fragebogen</div>
      );
    case "vertrag":
      return (
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-3 text-sm text-indigo-700">§ Vertrag / Dokument</div>
      );
    case "ergebnis":
      return (
        <div className="rounded-2xl border border-cyan-200 bg-cyan-50/60 p-3 text-sm text-cyan-700">◆ Ergebnis-Anzeige (nach Freigabe)</div>
      );
    case "auswahl": {
      const opts = cfgArr(c, "options");
      return (
        <div>
          {text("prompt") && <p className="mb-1 text-sm font-medium text-neutral-700">{text("prompt")}</p>}
          <div className="space-y-1">
            {(opts.length ? opts : ["Option 1", "Option 2"]).map((o, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-neutral-600">
                <span className={c.multi ? "h-3.5 w-3.5 rounded border border-neutral-300" : "h-3.5 w-3.5 rounded-full border border-neutral-300"} />
                {o}
              </div>
            ))}
          </div>
        </div>
      );
    }
    case "skala": {
      const min = cfgNum(c, "min", 1);
      const max = cfgNum(c, "max", 10);
      return (
        <div>
          {text("prompt") && <p className="mb-1 text-sm font-medium text-neutral-700">{text("prompt")}</p>}
          <div className="flex items-center justify-between text-[11px] text-neutral-400">
            <span>{text("minLabel") || min}</span>
            <span>{text("maxLabel") || max}</span>
          </div>
          <input type="range" min={min} max={max} disabled className="w-full" />
        </div>
      );
    }
    case "ranking": {
      const opts = cfgArr(c, "options");
      return (
        <div>
          {text("prompt") && <p className="mb-1 text-sm font-medium text-neutral-700">{text("prompt")}</p>}
          <div className="space-y-1">
            {(opts.length ? opts : ["Punkt A", "Punkt B"]).map((o, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-2 py-1 text-sm text-neutral-600">
                <span className="text-neutral-300">≡</span>
                {o}
              </div>
            ))}
          </div>
        </div>
      );
    }
    case "liste":
      return (
        <div>
          {text("prompt") && <p className="mb-1 text-sm font-medium text-neutral-700">{text("prompt")}</p>}
          <div className="rounded-lg border border-dashed border-neutral-300 px-3 py-2 text-sm text-neutral-400">
            + {text("placeholder") || "Eintrag hinzufügen"}
          </div>
        </div>
      );
    case "betrag":
      return (
        <div>
          {text("label") && <p className="mb-1 text-sm font-medium text-neutral-700">{text("label")}</p>}
          <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-400">
            <span>{text("currency") || "€"}</span>0,00
          </div>
        </div>
      );
    case "vertrauliche_notiz":
      return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">🔒 Nur für den Mediator</p>
          <p className="text-sm text-neutral-700">{text("prompt") || "Vertrauliche Notiz …"}</p>
        </div>
      );
    case "datei_upload":
      return (
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-3">
          <p className="mb-1 text-sm text-neutral-700">{text("prompt") || "Datei hochladen"}</p>
          <span className="inline-block rounded-lg border border-indigo-300 bg-white px-3 py-1.5 text-sm text-indigo-600">📎 Datei auswählen</span>
        </div>
      );
    case "bild":
      return text("url") ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={text("url")} alt={text("caption")} className="max-h-48 rounded-xl border border-neutral-200" />
      ) : (
        <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-neutral-300 text-sm text-neutral-400">🖼 Bild-URL fehlt</div>
      );
    case "zustimmung":
      return (
        <label className="flex items-start gap-2 text-sm text-neutral-700">
          <span className="mt-0.5 h-4 w-4 rounded border border-neutral-300" />
          {text("text") || "Ich stimme zu."}
        </label>
      );
    case "unterschrift":
      return (
        <div className="rounded-2xl border border-neutral-200 p-3">
          <p className="mb-2 text-sm text-neutral-600">{text("statement") || "Ich bestätige die Angaben."}</p>
          <div className="rounded-lg border border-dashed border-neutral-300 px-3 py-2 text-sm text-neutral-400">✍ Name eingeben …</div>
        </div>
      );
    case "hinweis": {
      const variant = cfgStr(c, "variant") || "info";
      const styles: Record<string, string> = {
        info: "border-blue-200 bg-blue-50 text-blue-800",
        warnung: "border-amber-200 bg-amber-50 text-amber-800",
        erfolg: "border-emerald-200 bg-emerald-50 text-emerald-800",
      };
      return (
        <div className={`rounded-2xl border p-3 text-sm ${styles[variant] ?? styles.info}`}>
          {text("text") || "Hinweistext …"}
        </div>
      );
    }
    case "akkordeon":
      return (
        <details className="rounded-2xl border border-neutral-200 bg-white p-3">
          <summary className="cursor-pointer text-sm font-medium text-neutral-700">{text("title") || "Mehr erfahren"}</summary>
          <p className="mt-2 text-sm text-neutral-600">{text("text")}</p>
        </details>
      );
    case "gate":
      return (
        <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-3 text-sm text-blue-700">
          ⏸ {text("text") || "Wartet, bis beide Parteien bestätigt haben."}
        </div>
      );
    case "bezahlung":
      return (
        <div className="rounded-2xl border border-amber-300 bg-amber-50/70 p-3">
          <p className="text-sm font-semibold text-amber-800">💳 {text("title") || "Bonus-Leistung"}</p>
          {text("description") && <p className="mt-0.5 text-xs text-amber-700">{text("description")}</p>}
          <span className="mt-2 inline-block rounded-lg bg-amber-600 px-3 py-1.5 text-sm font-semibold text-white">
            Kostenpflichtig freischalten · {cfgNum(c, "price", 0).toFixed(2)} {text("currency") || "EUR"}
          </span>
        </div>
      );
    case "ki_prompt":
    case "ki_zusammenfassung":
    case "ki_reframing":
    case "ki_interessen":
    case "ki_optionen":
    case "ki_gemeinsamkeiten":
      return (
        <div className="rounded-2xl border border-dashed border-fuchsia-300 bg-fuchsia-50/50 p-3 text-[11px] text-fuchsia-700">
          ✨ {def?.label ?? "KI-Block"} — läuft im Hintergrund, für Teilnehmer nicht sichtbar.
        </div>
      );
    case "individuell":
      return (
        <div className="rounded-2xl border border-dashed border-pink-300 bg-pink-50/50 p-3 text-[11px] text-pink-700">
          ✦ Individueller Block — Inhalt pro Fall.
        </div>
      );
    default:
      return def ? (
        <div className="rounded-xl border border-neutral-200 p-3 text-sm text-neutral-500">{def.label}</div>
      ) : null;
  }
}

function StepPreview({ title, blocks }: { title: string; blocks: StepBlockDto[] }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-neutral-400">Vorschau (Teilnehmer)</p>
      <h5 className="mb-3 text-base font-semibold text-neutral-800">{title}</h5>
      {blocks.length === 0 ? (
        <p className="text-sm text-neutral-400">Noch keine Blöcke — links eine Methode hinzufügen.</p>
      ) : (
        <div className="space-y-3">
          {blocks.map((b) => (
            <PreviewBlock key={b.id} block={b} />
          ))}
        </div>
      )}
    </div>
  );
}

// Editor für die Sichtbarkeitsbedingung eines Schritts (Eskalation/Segmentierung).
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
      <span className="font-semibold text-neutral-500">👁 Sichtbar wenn Flag</span>
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
function StepDesignerPanel({
  step,
  onAddBlock,
  onRemoveBlock,
  onMoveBlock,
  onChangeBlockConfig,
  onChangeVisibleIf,
  onAiFill,
  onClose,
}: {
  step: PhaseStepDefaultDto;
  onAddBlock: (type: string) => void;
  onRemoveBlock: (blockId: string) => void;
  onMoveBlock: (blockId: string, dir: -1 | 1) => void;
  onChangeBlockConfig: (blockId: string, patch: Record<string, unknown>) => void;
  onChangeVisibleIf: (cond: VisibleIf | null) => void;
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
            {aiLoading ? "KI erzeugt …" : "✨ Per KI vorbefüllen"}
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

      <VisibleIfEditor cond={step.visible_if} onChange={onChangeVisibleIf} />

      {/* Palette: Methoden nach Gruppe */}
      <div className="mb-5 rounded-xl border border-neutral-200 bg-white p-3">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-neutral-400">
          Methode hinzufügen
        </p>
        <div className="space-y-2">
          {BLOCK_GROUPS.map((group) => {
            const items = BLOCK_TYPES.filter((b) => b.group === group);
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
                    <span aria-hidden>{def.icon}</span>
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
                      <span aria-hidden>{def?.icon ?? "▪"}</span>
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
                </div>
              );
            })
          )}
        </div>

        {/* Live-Vorschau */}
        <div className="lg:sticky lg:top-4 lg:self-start">
          <StepPreview title={step.title} blocks={blocks} />
        </div>
      </div>

      <details className="mt-5 rounded-xl border border-neutral-200 bg-white">
        <summary className="cursor-pointer px-4 py-2.5 text-sm font-semibold text-neutral-700">
          🤖 System-KI-Prompts bearbeiten (global)
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
        <span className="text-sm font-semibold text-fuchsia-800">✨ KI-Design-Assistent</span>
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

  useEffect(() => {
    setActiveVariant(null);
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

  const editableSteps = activeVariant ? variantSteps : baseSteps;
  const lockedSteps = activeVariant ? baseSteps : [];
  const setEditableSteps = activeVariant ? setVariantSteps : setBaseSteps;
  const chain = useMemo(() => [...lockedSteps, ...editableSteps], [lockedSteps, editableSteps]);

  const activePhaseLabel = DESIGNER_PHASES.find((p) => p.id === activePhase)?.label ?? activePhase;
  const typeLabel = MEDIATION_TYPES.find((t) => t.id === mediationType)?.label ?? mediationType;

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
    async (id: number, title: string) => {
      const { blocks } = await generateStepBlocks({
        mediation_type: mediationType,
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
    [chain, lockedSteps.length, editingId, editingLabel, designStepId, moveStep, openDesigner],
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

  const designStep = designStepId !== null ? editableSteps.find((s) => s.id === designStepId) ?? null : null;

  return (
    <div className="p-6 max-w-6xl">
      <SectionHeader label="Workspace" title="Workflow Manager" />
      <p className="mb-5 max-w-2xl text-sm text-neutral-500">
        Designe pro Mediationsart den Basis-Workflow und beliebige Varianten. Jeden Schritt
        gestaltest du als geordnete Liste von <span className="font-semibold">Blöcken</span>
        {" "}(Textausgabe, Texteingabe, Video, Frage, Videokonferenz, KI-Prompt …) mit
        Live-Vorschau — klick dazu bei einem Schritt auf <span className="font-semibold">„Gestalten"</span>.
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
      </div>

      {/* Scope: Basis / Varianten */}
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
          {DESIGNER_PHASES.map((phase, idx) => {
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
              {activeVariantLabel ? ` · Variante „${activeVariantLabel}"` : " · Basis"}
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

          {/* Seiten-Designer des gewählten Schritts */}
          {designStep && (
            <StepDesignerPanel
              step={designStep}
              onAddBlock={(type) => addBlock(designStep.id, type)}
              onRemoveBlock={(bid) => removeBlock(designStep.id, bid)}
              onMoveBlock={(bid, dir) => moveBlock(designStep.id, bid, dir)}
              onChangeBlockConfig={(bid, patch) => changeBlockConfig(designStep.id, bid, patch)}
              onChangeVisibleIf={(cond) => changeVisibleIf(designStep.id, cond)}
              onAiFill={() => aiFillBlocks(designStep.id, designStep.title)}
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
