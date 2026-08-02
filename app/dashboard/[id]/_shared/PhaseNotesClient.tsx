"use client";

import { hashId } from "@/lib/ids";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PHASES, getPhase, getPhaseIndex, type PhaseKey, type StepDetail } from "./phaseData";
import StepContentBlocks from "./StepContentBlocks";
import StepBlocks from "./StepBlocks";
import type { StepBlockDto } from "@/app/workspace/types";
import { blockLabel, missingRequiredBlocks, userInputBlocks } from "@/app/workspace/blockTypes";
import { fetchBlockResponses } from "@/app/workspace/api";
import Icon from "@/app/components/ui/Icon";

type Props = {
  mediationId: string;
  phaseKey: PhaseKey;
  currentUserName: string;
};

type Participant = {
  id: string;
  name: string;
  role: string;
  invitationStatus: "accepted" | "pending";
};

type StepParticipant = {
  participant_id: string;
  name: string;
  role: string;
  submitted: boolean;
};

type StepStatus = {
  participants: StepParticipant[];
  all_submitted: boolean;
};

type StepView = "input" | "waiting" | "reflection";

type CustomStepData = {
  step_key: string;
  title: string;
  description: string;
  position: number;
};

function toStepDetail(cs: CustomStepData): StepDetail {
  return {
    key: cs.step_key,
    title: cs.title,
    description: cs.description,
    placeholder: "Deine Eingabe …",
  };
}

// Schritt-Eintrag, wie er vom zusammengeführten Backend-Endpoint
// GET /mediations/{id}/phase-steps?phase= kommt (Defaults aus
// phase_step_defaults + pro Fall hinzugefügte custom Steps, bereits
// um geskippte Schritte (MediationStepRule) bereinigt).
type PhaseStepFromAPI = {
  key: string;
  title: string;
  description: string;
  placeholder: string;
  reflection_mode: "simple" | "interactive" | null;
  content_types?: string[] | null;
  // Neuer dynamischer Seitenaufbau (siehe StepBlocks). Wenn gesetzt, wird der
  // Schritt block-basiert gerendert; sonst greift der Legacy-Pfad
  // (content_types + Einzelfelder via StepContentBlocks).
  blocks?: StepBlockDto[] | null;
  // Inhaltsart-spezifische Felder (siehe StepContentBlocks). Das Backend liefert
  // sie bereits pro Schritt; früher hat PhaseNotesClient sie ignoriert.
  video_url?: string | null;
  meeting_url?: string | null;
  question?: string | null;
  contract_template?: string | null;
  feedback_occasion?: "after_videocall" | "before_contract" | null;
  // Ergebnis-Schritte: true, sobald der Mediator den Inhalt freigegeben hat.
  result_released?: boolean | null;
  // Fortschritts-Sperre aus dem Workflow Manager: wann gibt dieser Schritt den
  // nächsten frei? "self" = eigene Abgabe genügt (Standard), "all" = alle
  // nötigen Parteien müssen abgegeben haben, "none" = sperrt nie.
  gate_mode?: GateMode | null;
  custom: boolean;
};

type GateMode = "self" | "all" | "none";

// Rollen, für die die Reihenfolge nicht gilt: Mediator und Admin müssen den
// Fall vorbereiten und prüfen können. "owner" ist bewusst NICHT dabei – der
// Antragsteller ist eine Konfliktpartei. Muss zu _STEP_GATE_BYPASS_ROLES in
// backend/app/routers/mediations.py passen, sonst sperrt die UI etwas, das das
// Backend erlaubt (oder umgekehrt).
const GATE_BYPASS_ROLES = ["mediator", "admin"];

function toStepDetailFromAPI(s: PhaseStepFromAPI): StepDetail {
  return {
    key: s.key,
    title: s.title,
    description: s.description,
    placeholder: s.placeholder || (s.custom ? "Deine Eingabe …" : ""),
    reflectionMode: s.reflection_mode ?? undefined,
  };
}

const roleLabel: Record<string, string> = {
  initiator: "Antragsteller",
  other_party: "Andere Seite",
  mediator: "Mediator",
  owner: "Antragsteller",
};

function parseItems(raw: string): string[] {
  if (!raw || raw.trim() === "") return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed))
      return parsed.filter((s: unknown) => typeof s === "string" && (s as string).trim() !== "");
  } catch {
    return raw.split("\n").map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

// ── Lade-Spinner ──────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div className="flex items-center gap-2 text-sm text-neutral-500">
      <svg className="h-4 w-4 animate-spin text-accent-500" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
      Laden …
    </div>
  );
}

// ── Warte-Anzeige ─────────────────────────────────────────────────────────────
function WaitingView({ status }: { status: StepStatus }) {
  const waiting = status.participants.filter((p) => !p.submitted);
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
      <p className="mb-3 text-sm font-semibold text-amber-800">
        Dein Input wurde gespeichert. Warte auf:
      </p>
      <ul className="space-y-2">
        {waiting.map((p) => (
          <li key={p.participant_id} className="flex items-center gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-200">
              <svg className="h-3 w-3 animate-spin text-amber-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            </span>
            <span className="text-sm text-amber-900">
              <strong>{p.name}</strong> – {roleLabel[p.role] ?? p.role}
            </span>
          </li>
        ))}
      </ul>
      {status.participants.filter((p) => p.submitted).length > 0 && (
        <div className="mt-4 border-t border-amber-200 pt-3">
          <p className="mb-1 text-xs font-medium text-amber-700">Bereits abgeschlossen:</p>
          {status.participants.filter((p) => p.submitted).map((p) => (
            <div key={p.participant_id} className="flex items-center gap-2 text-sm text-amber-800">
              <svg className="h-4 w-4 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {p.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Reaktions-Typen ───────────────────────────────────────────────────────────
type ReactionAction = "accept" | "reject" | "trade";

type Reaction = {
  from_participant_id: string;
  target_participant_id: string;
  item_index: number;
  action: ReactionAction;
  trade_item_index: number | null;
};

// ── Interaktive Reaktions-Ansicht ─────────────────────────────────────────────
function InteractiveReflectionView({
  step,
  phaseKey,
  mediationId,
  allInputs,
  participants,
  currentParticipantId,
  onNext,
  isLastStep,
}: {
  step: StepDetail;
  phaseKey: PhaseKey;
  mediationId: string;
  allInputs: Record<string, string[]>;
  participants: Participant[];
  currentParticipantId: string;
  onNext: () => void;
  isLastStep: boolean;
}) {
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  // Trade-Picker: welcher Fremd-Item-Key ist gerade offen
  const [tradePickerFor, setTradePickerFor] = useState<string | null>(null);

  // Reaktionen laden + pollen
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch(
          `/api/mediations/${mediationId}/reactions?phase=${phaseKey}&step=${step.key}`
        );
        if (res.ok && active) setReactions(await res.json());
      } catch { /* ignore */ }
    }
    load();
    const id = setInterval(load, 4000);
    return () => { active = false; clearInterval(id); };
  }, [mediationId, phaseKey, step.key]);

  async function sendReaction(
    targetParticipantId: string,
    itemIndex: number,
    action: ReactionAction,
    tradeItemIndex: number | null = null
  ) {
    const key = `${targetParticipantId}-${itemIndex}`;
    setSaving((p) => ({ ...p, [key]: true }));
    try {
      await fetch(`/api/mediations/${mediationId}/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phase: phaseKey,
          step: step.key,
          target_participant_id: targetParticipantId,
          item_index: itemIndex,
          action,
          trade_item_index: tradeItemIndex,
        }),
      });
      // Optimistisch aktualisieren
      setReactions((prev) => {
        const filtered = prev.filter(
          (r) =>
            !(
              r.from_participant_id === currentParticipantId &&
              r.target_participant_id === targetParticipantId &&
              r.item_index === itemIndex
            )
        );
        return [
          ...filtered,
          {
            from_participant_id: currentParticipantId,
            target_participant_id: targetParticipantId,
            item_index: itemIndex,
            action,
            trade_item_index: tradeItemIndex,
          },
        ];
      });
    } catch { /* ignore */ } finally {
      setSaving((p) => ({ ...p, [key]: false }));
      setTradePickerFor(null);
    }
  }

  function getMyReaction(targetId: string, idx: number) {
    return reactions.find(
      (r) =>
        r.from_participant_id === currentParticipantId &&
        r.target_participant_id === targetId &&
        r.item_index === idx
    );
  }

  function getTheirReactionOnMe(targetId: string, myIdx: number) {
    // Reaktion von targetId auf meine Punkte
    return reactions.find(
      (r) =>
        r.from_participant_id === targetId &&
        r.target_participant_id === currentParticipantId &&
        r.item_index === myIdx
    );
  }

  const accepted = participants.filter((p) => p.invitationStatus === "accepted");
  const me = accepted.find((p) => p.id === currentParticipantId);
  const others = accepted.filter((p) => p.id !== currentParticipantId);
  const myItems = allInputs[currentParticipantId] ?? [];

  const actionBadge: Record<ReactionAction, string> = {
    accept: "bg-accent-100 text-accent-700 border-accent-200",
    reject: "bg-red-100 text-red-700 border-red-200",
    trade: "bg-violet-100 text-violet-700 border-violet-200",
  };
  const actionLabel: Record<ReactionAction, string> = {
    accept: "✓ Akzeptiert",
    reject: "✗ Abgelehnt",
    trade: "⇄ Tauschangebot",
  };
  const incomingLabel: Record<ReactionAction, string> = {
    accept: "✓ Akzeptiert dich",
    reject: "✗ Lehnt ab",
    trade: "⇄ Möchte tauschen",
  };

  return (
    <div className="space-y-8">
      {/* Status-Banner */}
      <div className="flex items-center gap-2 rounded-2xl border border-accent-200 bg-accent-50 px-5 py-3">
        <svg className="h-4 w-4 shrink-0 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <p className="text-sm font-semibold text-accent-800">
          Alle Eingaben abgeschlossen – reagiere jetzt auf die Punkte der anderen Seite.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* ── Meine Punkte (read-only + eingehende Reaktionen) ── */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-neutral-500">
            Deine Eingaben {me ? `· ${me.name}` : ""}
          </p>
          {myItems.length === 0 ? (
            <p className="text-sm italic text-neutral-400">Keine Eingaben.</p>
          ) : (
            <ul className="space-y-2">
              {myItems.map((item, idx) => {
                const incoming = others.map((o) => getTheirReactionOnMe(o.id, idx)).filter(Boolean) as Reaction[];
                return (
                  <li key={idx} className="rounded-xl border border-neutral-200 bg-white px-4 py-3">
                    <div className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-400" />
                      <span className="flex-1 text-sm text-neutral-700">{item}</span>
                    </div>
                    {/* Eingehende Reaktionen der anderen Seite */}
                    {incoming.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5 pl-3.5">
                        {incoming.map((r, i) => {
                          const other = others.find((o) => o.id === r.from_participant_id);
                          const tradeItem = r.trade_item_index != null
                            ? (allInputs[r.from_participant_id] ?? [])[r.trade_item_index]
                            : null;
                          return (
                            <span
                              key={i}
                              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${actionBadge[r.action]}`}
                              title={tradeItem ? `Tauschangebot: „${tradeItem}"` : undefined}
                            >
                              {other?.name ?? "?"}: {incomingLabel[r.action]}
                              {tradeItem && <span className="ml-1 opacity-70">→ „{tradeItem}"</span>}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* ── Punkte der anderen Seite + Reaktions-Buttons ── */}
        <div className="space-y-6">
          {others.map((other) => {
            const otherItems = allInputs[other.id] ?? [];
            return (
              <div key={other.id}>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-neutral-500">
                  {other.name} · {roleLabel[other.role] ?? other.role}
                </p>
                {otherItems.length === 0 ? (
                  <p className="text-sm italic text-neutral-400">Keine Eingaben.</p>
                ) : (
                  <ul className="space-y-3">
                    {otherItems.map((item, idx) => {
                      const myReaction = getMyReaction(other.id, idx);
                      const itemKey = `${other.id}-${idx}`;
                      const isSaving = saving[itemKey] ?? false;
                      const tradeOpen = tradePickerFor === itemKey;

                      return (
                        <li key={idx} className="rounded-xl border border-neutral-200 bg-white p-4">
                          <div className="flex items-start gap-2">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400" />
                            <span className="flex-1 text-sm text-neutral-700">{item}</span>
                          </div>

                          {/* Reaktions-Buttons */}
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            {isSaving ? (
                              <Spinner />
                            ) : myReaction ? (
                              <>
                                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${actionBadge[myReaction.action]}`}>
                                  {actionLabel[myReaction.action]}
                                  {myReaction.action === "trade" && myReaction.trade_item_index != null && (
                                    <span className="ml-1.5 opacity-70">
                                      → „{myItems[myReaction.trade_item_index] ?? "?"}"
                                    </span>
                                  )}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setReactions((prev) =>
                                      prev.filter(
                                        (r) =>
                                          !(
                                            r.from_participant_id === currentParticipantId &&
                                            r.target_participant_id === other.id &&
                                            r.item_index === idx
                                          )
                                      )
                                    );
                                    // Auf reject setzen als "Reaktion entfernen" (Backend-Fallback)
                                    sendReaction(other.id, idx, "reject");
                                  }}
                                  className="text-xs text-neutral-400 underline hover:text-neutral-600"
                                >
                                  Ändern
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => sendReaction(other.id, idx, "accept")}
                                  className="rounded-full border border-accent-200 bg-accent-50 px-3 py-1 text-xs font-semibold text-accent-700 transition hover:bg-accent-100"
                                >
                                  ✓ Akzeptieren
                                </button>
                                <button
                                  type="button"
                                  onClick={() => sendReaction(other.id, idx, "reject")}
                                  className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                                >
                                  ✗ Ablehnen
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setTradePickerFor(tradeOpen ? null : itemKey)
                                  }
                                  className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 transition hover:bg-violet-100"
                                >
                                  ⇄ Tauschen
                                </button>
                              </>
                            )}
                          </div>

                          {/* Trade-Picker */}
                          {tradeOpen && myItems.length > 0 && (
                            <div className="mt-3 rounded-xl border border-violet-100 bg-violet-50 p-3">
                              <p className="mb-2 text-xs font-semibold text-violet-700">
                                Welchen deiner Punkte bietest du im Tausch an?
                              </p>
                              <ul className="space-y-1.5">
                                {myItems.map((myItem, myIdx) => (
                                  <li key={myIdx}>
                                    <button
                                      type="button"
                                      onClick={() => sendReaction(other.id, idx, "trade", myIdx)}
                                      className="w-full rounded-lg border border-violet-200 bg-white px-3 py-2 text-left text-sm text-neutral-700 transition hover:border-violet-400 hover:bg-violet-50"
                                    >
                                      <span className="mr-2 text-violet-400">⇄</span>
                                      {myItem}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Nächster Schritt */}
      <div className="flex justify-end pt-2">
        <button type="button" onClick={onNext} className="btn btn-primary">
          {isLastStep ? "Phase abschließen →" : "Nächster Schritt →"}
        </button>
      </div>
    </div>
  );
}

// ── Einfache Reflexions-Ansicht (bestehend) ───────────────────────────────────
function SimpleReflectionView({
  step,
  phaseKey,
  mediationId,
  allInputs,
  participants,
  onNext,
  isLastStep,
}: {
  step: StepDetail;
  phaseKey: PhaseKey;
  mediationId: string;
  allInputs: Record<string, string[]>;
  participants: Participant[];
  onNext: () => void;
  isLastStep: boolean;
}) {
  const [reflection, setReflection] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiError, setAiError] = useState("");

  async function generateReflection() {
    setLoadingAi(true);
    setAiError("");
    const inputs = participants
      .filter((p) => p.invitationStatus === "accepted")
      .map((p) => ({
        name: p.name,
        role: roleLabel[p.role] ?? p.role,
        content: (allInputs[p.id] ?? []).join("\n"),
      }))
      .filter((inp) => inp.content.trim());

    try {
      const res = await fetch(`/api/mediations/${mediationId}/reflect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phase: phaseKey,
          step: step.key,
          step_title: step.title,
          inputs,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAiError(data?.detail ?? data?.error ?? "Fehler beim Generieren.");
        return;
      }
      setReflection(data.reflection);
    } catch {
      setAiError("Server nicht erreichbar.");
    } finally {
      setLoadingAi(false);
    }
  }

  const accepted = participants.filter((p) => p.invitationStatus === "accepted");

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-accent-200 bg-accent-50 p-6">
        <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-accent-800">
          <svg className="h-4 w-4 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Alle Teilnehmer haben ihren Input abgeschlossen
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {accepted.map((p) => {
            const pitems = allInputs[p.id] ?? [];
            return (
              <div key={p.id} className="rounded-xl border border-accent-100 bg-white p-4">
                <p className="mb-2 font-semibold text-neutral-900">{p.name}</p>
                <p className="mb-3 text-xs text-neutral-500">{roleLabel[p.role] ?? p.role}</p>
                {pitems.length > 0 ? (
                  <ul className="space-y-1.5">
                    {pitems.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm italic text-neutral-400">Keine Eingaben.</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-neutral-700">Paraphrasierung</p>
          <button
            type="button"
            onClick={generateReflection}
            disabled={loadingAi}
            className="btn btn-secondary text-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingAi ? "Generiere …" : reflection ? "Neu paraphrasieren" : "Paraphrasieren"}
          </button>
        </div>
        {aiError && (
          <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{aiError}</p>
        )}
        {reflection ? (
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm leading-relaxed text-neutral-700 whitespace-pre-wrap">
            {reflection}
          </div>
        ) : (
          <p className="text-sm italic text-neutral-400">
            Klicke auf &quot;Paraphrasieren&quot;, um eine neutrale Zusammenfassung aller Eingaben zu erhalten.
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <button type="button" onClick={onNext} className="btn btn-primary">
          {isLastStep ? "Phase abschließen →" : "Nächster Schritt →"}
        </button>
      </div>
    </div>
  );
}

// ── Gegenüberstellung block-basierter Schritte ────────────────────────────────
//
// Block-Schritte speichern ihre Antworten nicht in den Notizen, sondern in
// mediation_block_responses. Die alte Gegenüberstellung liest nur Notizen und
// blieb deshalb bei jedem gestalteten Schritt leer. Hier stehen die Antworten
// der Parteien Block für Block nebeneinander — inklusive der Markierung, wo
// beide dasselbe wollen und wo noch nicht. Genau daraus entsteht die Einigung
// (und in Phase 1 der Mediationsvertrag).

/** Zeigt einen gespeicherten Blockwert lesbar an. */
function formatBlockValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "";
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "Ja" : "Nein";
  if (Array.isArray(value)) return value.map((v) => `• ${String(v)}`).join("\n");
  if (typeof value === "object") {
    const o = value as Record<string, unknown>;
    if ("agreed" in o) return o.agreed === true ? "✓ zugestimmt" : "— nicht zugestimmt";
    if ("name" in o) return String(o.name ?? "");
    if ("url" in o) return String(o.name ?? o.url ?? "");
    return JSON.stringify(o);
  }
  return String(value);
}

/** Vergleichbare Form eines Werts (Reihenfolge in Mehrfachauswahlen egal). */
function comparableValue(value: unknown): string {
  if (Array.isArray(value)) return JSON.stringify([...value].map(String).sort());
  if (value && typeof value === "object") {
    const o = value as Record<string, unknown>;
    if ("agreed" in o) return String(o.agreed === true);
    if ("name" in o) return "signed";
  }
  return JSON.stringify(value ?? null);
}

function BlockReflectionView({
  blocks,
  phaseKey,
  mediationId,
  stepKey,
  participants,
  onNext,
  isLastStep,
}: {
  blocks: StepBlockDto[];
  phaseKey: PhaseKey;
  mediationId: string;
  stepKey: string;
  participants: Participant[];
  onNext: () => void;
  isLastStep: boolean;
}) {
  // answers[blockId][participantId] = Wert
  const [answers, setAnswers] = useState<Record<string, Record<string, unknown>>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchBlockResponses(Number(mediationId), { phase: phaseKey, stepKey, includeOthers: true })
      .then((rows) => {
        if (cancelled) return;
        const map: Record<string, Record<string, unknown>> = {};
        for (const r of rows) {
          if (r.author_key === "ai") continue;
          (map[r.block_id] ??= {})[r.author_key] = r.value;
        }
        setAnswers(map);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [mediationId, phaseKey, stepKey]);

  const inputs = userInputBlocks(blocks).filter((b) => b.type !== "vertrauliche_notiz");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 rounded-2xl border border-accent-200 bg-accent-50 px-5 py-3">
        <svg className="h-4 w-4 shrink-0 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <p className="text-sm font-semibold text-accent-800">
          Alle haben diesen Schritt abgeschlossen – hier stehen eure Antworten nebeneinander.
        </p>
      </div>

      {!loaded ? (
        <Spinner />
      ) : inputs.length === 0 ? (
        <p className="text-sm text-neutral-500">Dieser Schritt hatte keine Eingaben.</p>
      ) : (
        <div className="space-y-4">
          {inputs.map((b) => {
            const perParty = answers[b.id] ?? {};
            const given = participants
              .map((p) => ({ p, value: perParty[p.id] }))
              .filter(({ value }) => formatBlockValue(value).trim() !== "");
            const agree =
              given.length > 1 &&
              new Set(given.map(({ value }) => comparableValue(value))).size === 1;
            return (
              <div key={b.id} className="rounded-2xl border border-neutral-200 bg-white p-4">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-neutral-800">{blockLabel(b)}</p>
                  {given.length > 1 && (
                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                        agree
                          ? "border-accent-200 bg-accent-50 text-accent-700"
                          : "border-amber-200 bg-amber-50 text-amber-700"
                      }`}
                    >
                      {agree ? "✓ Einigkeit" : "≠ noch unterschiedlich"}
                    </span>
                  )}
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {participants.map((p) => {
                    const text = formatBlockValue(perParty[p.id]);
                    return (
                      <div key={p.id} className="rounded-xl border border-neutral-100 bg-neutral-50 p-3">
                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                          {p.name} · {roleLabel[p.role] ?? p.role}
                        </p>
                        {text ? (
                          <p className="whitespace-pre-wrap text-sm text-neutral-700">{text}</p>
                        ) : (
                          <p className="text-sm italic text-neutral-400">Keine Angabe.</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex justify-end">
        <button type="button" onClick={onNext} className="btn btn-primary">
          {isLastStep ? "Phase abschließen →" : "Nächster Schritt →"}
        </button>
      </div>
    </div>
  );
}

// ── Reflexions-Router ─────────────────────────────────────────────────────────
function ReflectionView(props: {
  step: StepDetail;
  phaseKey: PhaseKey;
  mediationId: string;
  allInputs: Record<string, string[]>;
  participants: Participant[];
  currentParticipantId: string;
  blocks: StepBlockDto[];
  onNext: () => void;
  isLastStep: boolean;
}) {
  // Gestaltete Schritte bringen ihre Antworten in den Blöcken mit – die
  // Notizen-Gegenüberstellung wäre dort zwangsläufig leer.
  if (userInputBlocks(props.blocks).length > 0) {
    return (
      <BlockReflectionView
        blocks={props.blocks}
        phaseKey={props.phaseKey}
        mediationId={props.mediationId}
        stepKey={props.step.key}
        participants={props.participants}
        onNext={props.onNext}
        isLastStep={props.isLastStep}
      />
    );
  }
  if (props.step.reflectionMode === "interactive") {
    return <InteractiveReflectionView {...props} />;
  }
  return <SimpleReflectionView {...props} />;
}

// ── Haupt-Komponente ──────────────────────────────────────────────────────────
export default function PhaseNotesClient({ mediationId, phaseKey, currentUserName }: Props) {
  const router = useRouter();
  const phase = getPhase(phaseKey);
  const currentIndex = getPhaseIndex(phaseKey);

  // Schrittliste kommt nicht mehr aus dem statischen phaseData.ts, sondern
  // vom Backend (phase_step_defaults pro Mediationstyp + pro Fall
  // hinzugefügte custom Steps, bereits zusammengeführt und um geskippte
  // Schritte bereinigt). phaseData.ts liefert weiterhin Label/Guide/Stepper.
  const [stepDetails, setStepDetails] = useState<StepDetail[]>([]);
  // Warum ist die Phase leer? Ein 402/403 vom phase-steps-Endpoint sah bisher
  // exakt aus wie "keine Schritte konfiguriert" – die Seite wirkte dadurch wie
  // ein alter, fest verdrahteter Stub. Jetzt sagen wir den Grund.
  const [stepsError, setStepsError] = useState<"paywall" | "forbidden" | "error" | "">("");

  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  // items[stepKey][participantId] = string[]
  const [items, setItems] = useState<Record<string, Record<string, string[]>>>({});
  const [inputText, setInputText] = useState<Record<string, string>>({});

  // status[stepKey] = StepStatus vom Backend
  const [stepStatus, setStepStatus] = useState<Record<string, StepStatus>>({});
  // view[stepKey] = "input" | "waiting" | "reflection"
  const [stepView, setStepView] = useState<Record<string, StepView>>({});

  // Ergebnis-Anzeige-Schritte (content_type "ergebnis"): read-only, zeigen den
  // vom Mediator freigegebenen Text; keine Eingabe, nur „gesehen"-Bestätigung.
  const [resultStepKeys, setResultStepKeys] = useState<Set<string>>(new Set());
  const [resultReleasedByKey, setResultReleasedByKey] = useState<Record<string, boolean>>({});

  // Voller Schritt-Datensatz vom Backend (inkl. content_types + Inhaltsart-
  // Feldern), damit StepContentBlocks Video/Videokonferenz/Frage/… rendern
  // kann. toStepDetailFromAPI verwirft diese Felder, daher separat gehalten.
  const [stepMeta, setStepMeta] = useState<Record<string, PhaseStepFromAPI>>({});

  // Aktuelle Block-Antworten des angezeigten Schritts (Block-id → Wert), von
  // StepBlocks gemeldet. Nötig, um vor dem Abschließen zu prüfen, ob die
  // Pflicht-Blöcke des Schritts beantwortet sind.
  const [blockValues, setBlockValues] = useState<Record<string, unknown>>({});

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [advancing, setAdvancing] = useState(false);
  // Erhöht sich nach erfolgreicher Zahlung und lädt die Phase neu.
  const [reloadKey, setReloadKey] = useState(0);
  // Nachladen nach der Zahlung passiert STILL, ohne den Voll-Spinner: sonst
  // unmountet der ganze Seiteninhalt (inkl. Freischaltungs-Block), und der Block
  // meldet beim Neu-Mount erneut onPaid -> Flackern. Nur der erste Aufbau bzw.
  // ein Phasenwechsel zeigt den Spinner.
  const silentReload = useRef(false);

  // Der Bezahl-Schritt bei gesperrter Phase kommt NICHT aus dem Code, sondern
  // aus dem Workflow Manager: der Schritt der Einladungs-Phase, der einen Block
  // vom Typ "fall_freischaltung" enthält. Titel, Beschreibung und alle weiteren
  // Blöcke daneben (Hinweise, Texte …) pflegt der Mediator dort.
  const [paywallStep, setPaywallStep] = useState<PhaseStepFromAPI | null>(null);
  const [paywallStepMissing, setPaywallStepMissing] = useState(false);

  // ── Custom Steps ──────────────────────────────────────────────────────────────
  const [showAddStep, setShowAddStep] = useState(false);
  const [newStepTitle, setNewStepTitle] = useState("");
  const [newStepDesc, setNewStepDesc] = useState("");
  const [addingStep, setAddingStep] = useState(false);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const allStepDetails = stepDetails;
  const accepted = participants.filter((p) => p.invitationStatus === "accepted");
  const currentParticipant = participants.find((p) => p.name === currentUserName);

  // ── Fortschritts-Sperre ───────────────────────────────────────────────────
  // Vorher war jeder Schritt jederzeit anklickbar; man konnte Schritt 5 öffnen,
  // ohne Schritt 1 abgeschlossen zu haben. Jetzt gibt jeder Schritt den nächsten
  // erst frei, wenn seine im Workflow Manager gesetzte Sperre erfüllt ist. Die
  // gleiche Prüfung läuft im Backend (POST /notes -> 409); die UI-Sperre allein
  // wäre per Direkt-API umgehbar.
  const gatePassed = (stepKey: string) => {
    const gate: GateMode = stepMeta[stepKey]?.gate_mode ?? "self";
    if (gate === "none") return true;
    const v = stepView[stepKey] ?? "input";
    // "waiting" heißt: ich habe abgegeben, die andere Seite noch nicht.
    return gate === "all" ? v === "reflection" : v === "waiting" || v === "reflection";
  };
  // Der erste Schritt, dessen Sperre noch zu ist, ist der letzte erreichbare.
  const unlockedUntil = (() => {
    for (let i = 0; i < allStepDetails.length; i++) {
      if (!gatePassed(allStepDetails[i].key)) return i;
    }
    return allStepDetails.length - 1;
  })();
  const bypassesGate = currentParticipant
    ? GATE_BYPASS_ROLES.includes(currentParticipant.role)
    : false;
  const isStepLocked = (idx: number) => !bypassesGate && idx > unlockedUntil;
  // Angezeigt wird immer ein erreichbarer Schritt – auch wenn activeStepIndex
  // von außen weiter vorn steht (neu eingefügter Schritt, Schritt-Löschung).
  const stepIndex =
    bypassesGate || activeStepIndex <= unlockedUntil
      ? activeStepIndex
      : Math.max(0, unlockedUntil);
  const currentStep = allStepDetails[stepIndex];

  // Bezahl-Schritt aus dem Workflow holen: der Schritt der Einladungs-Phase, der
  // einen Block vom Typ "fall_freischaltung" enthält. Findet sich keiner, hat der
  // Mediator im Workflow Manager keinen Bezahl-Schritt hinterlegt – dann wird
  // hier bewusst NICHTS hartkodiert, sondern der Hinweis dazu angezeigt.
  const loadPaywallStep = useCallback(async () => {
    try {
      const res = await fetch(`/api/mediations/${mediationId}/phase-steps?phase=einladung`);
      if (!res.ok) {
        setPaywallStepMissing(true);
        return;
      }
      const steps: PhaseStepFromAPI[] = (await res.json()).steps ?? [];
      const step = steps.find((s) =>
        (s.blocks ?? []).some((b) => b.type === "fall_freischaltung"),
      );
      setPaywallStep(step ?? null);
      setPaywallStepMissing(!step);
    } catch {
      setPaywallStepMissing(true);
    }
  }, [mediationId]);

  // ── Daten laden ──────────────────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      if (!silentReload.current) setLoading(true);
      try {
        const [partRes, phaseStepsRes] = await Promise.all([
          fetch(`/api/mediations/${mediationId}/participants`),
          fetch(`/api/mediations/${mediationId}/phase-steps?phase=${phaseKey}`),
        ]);
        if (!partRes.ok) return;
        const parts: Participant[] = await partRes.json();
        setParticipants(parts);

        if (phaseStepsRes.ok) {
          setStepsError("");
        } else if (phaseStepsRes.status === 402) {
          setStepsError("paywall");
          // Phase gesperrt → den im Workflow Manager konfigurierten Bezahl-
          // Schritt nachladen. Die Einladungs-Phase ist bewusst NICHT von der
          // Paywall geschützt, deshalb ist sie hier abrufbar.
          void loadPaywallStep();
        } else if (phaseStepsRes.status === 403) {
          setStepsError("forbidden");
        } else {
          setStepsError("error");
        }
        const phaseStepsFromAPI: PhaseStepFromAPI[] = phaseStepsRes.ok
          ? (await phaseStepsRes.json()).steps ?? []
          : [];
        const allDetails = phaseStepsFromAPI.map(toStepDetailFromAPI);
        setStepDetails(allDetails);
        setStepMeta(Object.fromEntries(phaseStepsFromAPI.map((s) => [s.key, s])));

        // Ergebnis-Anzeige-Schritte erfassen (read-only + Freigabe-Status).
        const rSet = new Set<string>();
        const rReleased: Record<string, boolean> = {};
        for (const s of phaseStepsFromAPI) {
          if ((s.content_types ?? []).includes("ergebnis")) {
            rSet.add(s.key);
            rReleased[s.key] = Boolean(s.result_released);
          }
        }
        setResultStepKeys(rSet);
        setResultReleasedByKey(rReleased);

        // Alle Notizen + step-status für alle Schritte laden
        const results = await Promise.all(
          allDetails.map(async (step) => {
            const [notesRes, statusRes] = await Promise.all([
              fetch(`/api/mediations/${mediationId}/notes?phase=${phaseKey}&step=${step.key}`),
              fetch(`/api/mediations/${mediationId}/step-status?phase=${phaseKey}&step=${step.key}`),
            ]);
            const notes = notesRes.ok ? await notesRes.json() : [];
            const status: StepStatus = statusRes.ok
              ? await statusRes.json()
              : { participants: [], all_submitted: false };
            return { key: step.key, notes, status };
          })
        );

        const newItems: Record<string, Record<string, string[]>> = {};
        const newStatus: Record<string, StepStatus> = {};
        const newView: Record<string, StepView> = {};

        for (const { key, notes, status } of results) {
          newItems[key] = Object.fromEntries(parts.map((p) => [p.id, []]));
          for (const n of notes as { participant_id: string; content: string; submitted: boolean }[]) {
            if (n.participant_id in newItems[key]) {
              newItems[key][n.participant_id] = parseItems(n.content);
            }
          }

          const myParticipant = parts.find((p) => p.name === currentUserName);
          const myStatus = status.participants.find(
            (p) => myParticipant && p.participant_id === myParticipant.id
          );
          newStatus[key] = status;

          if (status.all_submitted) {
            newView[key] = "reflection";
          } else if (myStatus?.submitted) {
            newView[key] = "waiting";
          } else {
            newView[key] = "input";
          }
        }

        setItems(newItems);
        setStepStatus(newStatus);
        setStepView(newView);
        setInputText(Object.fromEntries(allDetails.map((s) => [s.key, ""])));
        // Beim Öffnen dort landen, wo die Arbeit weitergeht – seit die Schritte
        // der Reihe nach gesperrt sind, wäre ein Start auf Schritt 1 nur ein
        // Umweg über bereits erledigte Schritte.
        const firstOpen = allDetails.findIndex((s) => newView[s.key] !== "reflection");
        setActiveStepIndex(firstOpen === -1 ? Math.max(0, allDetails.length - 1) : firstOpen);
      } finally {
        silentReload.current = false;
        setLoading(false);
      }
    }
    load();
    // reloadKey: nach erfolgreicher Zahlung im Freischaltungs-Block erneut laden,
    // damit die eben freigeschalteten Schritte ohne Reload erscheinen.
  }, [mediationId, phaseKey, reloadKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Polling wenn "waiting" ────────────────────────────────────────────────────
  const pollStatus = useCallback(async (stepKey: string) => {
    try {
      const res = await fetch(
        `/api/mediations/${mediationId}/step-status?phase=${phaseKey}&step=${stepKey}`
      );
      if (!res.ok) return;
      const status: StepStatus = await res.json();
      setStepStatus((prev) => ({ ...prev, [stepKey]: status }));
      if (status.all_submitted) {
        setStepView((prev) => ({ ...prev, [stepKey]: "reflection" }));
      }
    } catch {
      // ignore
    }
  }, [mediationId, phaseKey]);

  useEffect(() => {
    if (!currentStep) return;
    const view = stepView[currentStep.key];
    if (view === "waiting") {
      pollRef.current = setInterval(() => pollStatus(currentStep.key), 5000);
    } else {
      if (pollRef.current) clearInterval(pollRef.current);
    }
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [currentStep, stepView, pollStatus]);

  // Beim Schrittwechsel die Block-Antworten und eine offene Fehlermeldung
  // zurücksetzen – sonst prüft der nächste Schritt gegen die Werte des vorigen.
  useEffect(() => {
    setBlockValues({});
    setSaveError("");
  }, [currentStep?.key]);

  // ── Item-Verwaltung ────────────────────────────────────────────────────────────
  function addItem(stepKey: string) {
    if (!currentParticipant) return;
    const text = (inputText[stepKey] ?? "").trim();
    if (!text) return;
    setItems((prev) => ({
      ...prev,
      [stepKey]: {
        ...prev[stepKey],
        [currentParticipant.id]: [...(prev[stepKey]?.[currentParticipant.id] ?? []), text],
      },
    }));
    setInputText((prev) => ({ ...prev, [stepKey]: "" }));
  }

  function removeItem(stepKey: string, index: number) {
    if (!currentParticipant) return;
    setItems((prev) => ({
      ...prev,
      [stepKey]: {
        ...prev[stepKey],
        [currentParticipant.id]: (prev[stepKey]?.[currentParticipant.id] ?? []).filter(
          (_, i) => i !== index
        ),
      },
    }));
  }

  // ── Schritt abschließen ────────────────────────────────────────────────────────
  async function submitStep(stepKey: string) {
    if (!currentParticipant) return;
    // Pflicht-Blöcke prüfen, bevor der Schritt als abgegeben gilt. Ohne das
    // ließe sich ein Schritt abschließen, ohne genau die Angaben zu machen, die
    // der Schritt für die Einigung erheben soll (z.B. Zustimmung zur
    // Vertraulichkeit oder die Entscheidung über Zuschauer).
    const missing = missingRequiredBlocks(stepMeta[stepKey]?.blocks ?? [], blockValues);
    if (missing.length > 0) {
      setSaveError(
        `Bitte noch ausfüllen: ${missing.map((b) => blockLabel(b)).join(" · ")}`,
      );
      return;
    }
    setSaving(true);
    setSaveError("");
    try {
      const content = JSON.stringify(items[stepKey]?.[currentParticipant.id] ?? []);
      const res = await fetch(`/api/mediations/${mediationId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phase: phaseKey,
          step: stepKey,
          participant_id: currentParticipant.id,
          content,
          submitted: true,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setSaveError(body?.detail ?? body?.error ?? "Fehler beim Speichern.");
        return;
      }

      // Status direkt abfragen
      const statusRes = await fetch(
        `/api/mediations/${mediationId}/step-status?phase=${phaseKey}&step=${stepKey}`
      );
      if (statusRes.ok) {
        const status: StepStatus = await statusRes.json();
        setStepStatus((prev) => ({ ...prev, [stepKey]: status }));
        setStepView((prev) => ({
          ...prev,
          [stepKey]: status.all_submitted ? "reflection" : "waiting",
        }));
      } else {
        setStepView((prev) => ({ ...prev, [stepKey]: "waiting" }));
      }
    } catch {
      setSaveError("Server nicht erreichbar.");
    } finally {
      setSaving(false);
    }
  }

  // ── Phase voranschreiten ───────────────────────────────────────────────────────
  async function advance() {
    setAdvancing(true);
    try {
      const res = await fetch(`/api/mediations/${mediationId}/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phase: phase.nextPhase ?? phaseKey,
          ...(phase.nextPhase === null ? { status: "completed" } : {}),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setSaveError(body?.detail ?? body?.error ?? "Fehler.");
        return;
      }
      if (phase.nextPhase) {
        // hashId: die Dashboard-Routen laufen über die gehashte ID, nicht über
        // die numerische (sonst landet man auf einer 404/Redirect-Schleife).
        router.push(`/dashboard/${hashId(mediationId)}/${phase.nextPhase}`);
      } else {
        router.push("/dashboard");
      }
    } catch {
      setSaveError("Server nicht erreichbar.");
    } finally {
      setAdvancing(false);
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <main className="app-shell pt-[73px]">
        <section className="container py-12">
          <Spinner />
        </section>
      </main>
    );
  }

  const view = currentStep ? (stepView[currentStep.key] ?? "input") : "input";
  const myItems = currentParticipant ? (items[currentStep?.key ?? ""]?.[currentParticipant.id] ?? []) : [];

  // ── Woher kommt die Eingabe dieses Schritts? ─────────────────────────────
  // Hat der Schritt im Workflow Manager gestaltete Blöcke, sind DIESE die
  // Eingabe. Das frühere generische „Punkt hinzufügen +"-Feld wurde trotzdem
  // zusätzlich gerendert – ein Feld ohne Frage, ohne Bezug zum Schritt, das man
  // nur befüllen musste, um weiterzukommen. Es erscheint jetzt nur noch bei
  // Schritten ganz ohne Blöcke (Altbestand / frei angelegte Schritte).
  const currentBlocks = currentStep ? (stepMeta[currentStep.key]?.blocks ?? []) : [];
  const hasBlocks = currentBlocks.length > 0;
  const blockInputs = userInputBlocks(currentBlocks);
  const showItemList = !hasBlocks;
  const canSubmitStep = hasBlocks || myItems.length > 0;
  const isLastStep = stepIndex === allStepDetails.length - 1;
  const allStepsReflected = allStepDetails.every((s) => stepView[s.key] === "reflection");

  // Ergebnis-Schritt (read-only): freigegebener Text + „gesehen"-Bestätigung.
  const isResultStep = currentStep ? resultStepKeys.has(currentStep.key) : false;
  const resultReleased = currentStep ? (resultReleasedByKey[currentStep.key] ?? false) : false;
  const myResultDone =
    currentStep && currentParticipant
      ? stepStatus[currentStep.key]?.participants.find(
          (p) => p.participant_id === currentParticipant.id,
        )?.submitted ?? false
      : false;

  return (
    <main className="app-shell pt-[73px]">
      <section className="container py-12">

        {/* Phasen-Stepper */}
        <div className="mb-8 overflow-x-auto">
          <ol className="flex min-w-max items-center">
            {PHASES.map((p, index) => {
              const isDone = index < currentIndex;
              const isCurrent = index === currentIndex;
              return (
                <li key={p.key} className="flex items-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors ${isDone ? "bg-accent-500 text-white" : isCurrent ? "bg-accent-600 text-white ring-4 ring-accent-100" : "bg-neutral-200 text-neutral-500"}`}>
                      {isDone ? (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (index + 1)}
                    </div>
                    <span className={`max-w-[80px] text-center text-xs font-medium leading-tight ${isCurrent ? "text-accent-700" : isDone ? "text-accent-600" : "text-neutral-400"}`}>
                      {p.shortLabel}
                    </span>
                  </div>
                  {index < PHASES.length - 1 && (
                    <div className={`mx-2 mb-5 h-0.5 w-12 transition-colors ${index < currentIndex ? "bg-accent-400" : "bg-neutral-200"}`} />
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        <div className="app-surface p-8">
          <p className="eyebrow mb-1">Phase {currentIndex + 1} von {PHASES.length}</p>
          <h1 className="heading-2 text-neutral-900">{phase.label}</h1>

          {/* Gesperrte Phase: bezahlt wird DIREKT hier statt im Onboarding – aber
              der Schritt kommt aus dem Workflow Manager (Schritt der Einladungs-
              Phase mit Block "fall_freischaltung"), nicht aus dem Code. Titel,
              Beschreibung und begleitende Blöcke pflegt der Mediator dort.
              Nach erfolgreicher Zahlung lädt onPaid die Phase neu. */}
          {stepsError === "paywall" && paywallStep && (
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                {paywallStep.title}
              </p>
              {paywallStep.description && (
                <p className="mb-3 mt-1 text-sm text-neutral-600">{paywallStep.description}</p>
              )}
              <StepBlocks
                mediationId={mediationId}
                phase="einladung"
                stepKey={paywallStep.key}
                blocks={paywallStep.blocks ?? []}
                onPaid={() => {
                  silentReload.current = true;
                  setReloadKey((n) => n + 1);
                }}
              />
            </div>
          )}

          {stepsError === "paywall" && paywallStepMissing && (
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <p className="text-sm font-semibold text-amber-900">
                Diese Phase ist noch nicht freigeschaltet
              </p>
              <p className="mt-1 text-sm text-amber-800">
                Für diesen Fall ist im Workflow kein Freischaltungs-Schritt hinterlegt. Dein
                Mediator kann ihn im Workflow Manager ergänzen (Einladungs-Phase, Block
                „Fall freischalten").
              </p>
            </div>
          )}

          {stepsError && stepsError !== "paywall" && (
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <p className="text-sm font-semibold text-amber-900">
                {stepsError === "forbidden"
                  ? "Kein Zugriff auf diese Phase"
                  : "Die Schritte konnten nicht geladen werden"}
              </p>
              <p className="mt-1 text-sm text-amber-800">
                {stepsError === "forbidden"
                  ? "Dein Konto ist diesem Fall nicht zugeordnet. Bitte wende dich an deinen Mediator."
                  : "Bitte lade die Seite neu. Bleibt es dabei, melde dich bei deinem Mediator."}
              </p>
            </div>
          )}

          {/* Schritt-Navigator */}
          <div className="mt-8">
            <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-1">
              {allStepDetails.map((step, idx) => {
                const sv = stepView[step.key] ?? "input";
                const isActive = idx === stepIndex;
                const isDone = sv === "reflection";
                const isCustom = step.key.startsWith("custom_");
                const isLocked = isStepLocked(idx);
                return (
                  <div key={step.key} className="relative flex shrink-0">
                    <button
                      type="button"
                      onClick={() => { if (!isLocked) setActiveStepIndex(idx); }}
                      disabled={isLocked}
                      title={
                        isLocked
                          ? `Erst nach „${allStepDetails[unlockedUntil]?.title ?? "dem vorherigen Schritt"}"`
                          : undefined
                      }
                      className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                        isActive
                          ? "bg-accent-600 text-white shadow-sm"
                          : isDone
                          ? "bg-accent-100 text-accent-700"
                          : isLocked
                          ? "cursor-not-allowed bg-neutral-50 text-neutral-400"
                          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                      } ${isCustom ? "pr-7" : ""}`}
                    >
                      {isDone ? (
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : isLocked ? (
                        <span className="flex h-5 w-5 items-center justify-center">
                          <Icon name="lock" size={13} color="currentColor" />
                        </span>
                      ) : (
                        <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${isActive ? "bg-white/20" : "bg-neutral-200 text-neutral-500"}`}>{idx + 1}</span>
                      )}
                      {step.title}
                    </button>
                    {/* Löschen-Button nur für custom steps (Mediator) */}
                    {isCustom && currentParticipant && ["mediator", "owner", "initiator", "admin"].includes(currentParticipant.role) && (
                      <button
                        type="button"
                        title="Schritt löschen"
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (!confirm(`Schritt „${step.title}" löschen?`)) return;
                          await fetch(`/api/mediations/${mediationId}/custom-steps/${step.key}`, { method: "DELETE" });
                          setStepDetails((prev) => prev.filter((s) => s.key !== step.key));
                          if (isActive && idx > 0) setActiveStepIndex(idx - 1);
                        }}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-4 w-4 items-center justify-center rounded-full bg-white/30 text-current opacity-70 hover:opacity-100"
                      >
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                );
              })}

              {/* "+" Schritt hinzufügen – nur Mediator/Owner */}
              {currentParticipant && ["mediator", "owner", "initiator", "admin"].includes(currentParticipant.role) && (
                <button
                  type="button"
                  onClick={() => setShowAddStep(true)}
                  title="Neuen Schritt einfügen"
                  className="flex shrink-0 items-center gap-1.5 rounded-full border border-dashed border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-500 transition hover:border-accent-400 hover:bg-accent-50 hover:text-accent-700"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Schritt
                </button>
              )}
            </div>{/* end flex step-nav */}

            {/* Warum sind Schritte grau? Ohne diesen Satz wirkt die Sperre wie
                ein Fehler statt wie eine Regel. */}
            {allStepDetails.length > 1 && unlockedUntil < allStepDetails.length - 1 && !bypassesGate && (
              <p className="-mt-3 mb-5 text-xs text-neutral-400">
                <Icon name="lock" size={12} color="currentColor" /> Die weiteren Schritte öffnen sich,
                sobald dieser abgeschlossen ist.
              </p>
            )}

            {/* Modal: neuen Schritt hinzufügen */}
            {showAddStep && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                  <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-base font-bold text-neutral-900">Schritt einfügen</h3>
                    <button type="button" onClick={() => { setShowAddStep(false); setNewStepTitle(""); setNewStepDesc(""); }} className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>

                  {/* Vorlagen */}
                  <div className="mb-5">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-neutral-500">Vorlagen</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { title: "Pause einlegen", desc: "Kurze Unterbrechung für beide Parteien zur Sammlung.", emoji: "⏸" },
                        { title: "Einzelgespräch (Caucus)", desc: "Vertrauliches Gespräch des Mediators mit einer Partei getrennt.", emoji: "🗣" },
                        { title: "Zusammenfassung", desc: "Der Mediator fasst die bisherigen Erkenntnisse und Vereinbarungen zusammen.", emoji: "📋" },
                        { title: "Shuttle-Gespräch", desc: "Mediator pendelt zwischen räumlich getrennten Parteien.", emoji: "↔" },
                        { title: "Emotionen klären", desc: "Raum für Gefühle bevor inhaltlich weitergearbeitet wird.", emoji: "💬" },
                        { title: "Missverständnisse auflösen", desc: "Konkrete Unklarheiten oder Fehlinformationen gemeinsam klären.", emoji: "🔍" },
                        { title: "Gemeinsame Werte", desc: "Welche Werte und Ziele teilen beide Parteien?", emoji: "🤝" },
                        { title: "Worst-Case betrachten", desc: "Was passiert, wenn keine Einigung erzielt wird?", emoji: "⚠" },
                        { title: "Zwischenbilanz", desc: "Wo stehen wir? Was wurde bereits erreicht?", emoji: "📊" },
                        { title: "Nächste Schritte", desc: "Konkrete Aktionspunkte und Verantwortlichkeiten festlegen.", emoji: "✅" },
                      ].map((tpl) => (
                        <button
                          key={tpl.title}
                          type="button"
                          onClick={() => { setNewStepTitle(tpl.title); setNewStepDesc(tpl.desc); }}
                          className={`flex items-start gap-2 rounded-xl border p-3 text-left text-sm transition hover:border-accent-400 hover:bg-accent-50 ${newStepTitle === tpl.title ? "border-accent-500 bg-accent-50" : "border-neutral-200 bg-white"}`}
                        >
                          <span className="leading-none mt-0.5"><Icon name={tpl.emoji} size={16} /></span>
                          <span className="font-medium text-neutral-800">{tpl.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Eigener Schritt */}
                  <div className="border-t border-neutral-100 pt-4 space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Oder eigenen Schritt definieren</p>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-neutral-700">Titel</label>
                      <input
                        type="text"
                        value={newStepTitle}
                        onChange={(e) => setNewStepTitle(e.target.value)}
                        placeholder="z.B. Zusätzliche Fragen klären"
                        className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 outline-none focus:border-accent-500 focus:ring-4 focus:ring-accent-100"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-neutral-700">Beschreibung (optional)</label>
                      <textarea
                        value={newStepDesc}
                        onChange={(e) => setNewStepDesc(e.target.value)}
                        placeholder="Was sollen die Parteien in diesem Schritt tun?"
                        rows={2}
                        className="w-full resize-none rounded-xl border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 outline-none focus:border-accent-500 focus:ring-4 focus:ring-accent-100"
                      />
                    </div>
                  </div>

                  <div className="mt-5 flex gap-3 justify-end">
                    <button
                      type="button"
                      onClick={() => { setShowAddStep(false); setNewStepTitle(""); setNewStepDesc(""); }}
                      className="btn btn-ghost text-sm"
                    >
                      Abbrechen
                    </button>
                    <button
                      type="button"
                      disabled={!newStepTitle.trim() || addingStep}
                      onClick={async () => {
                        if (!newStepTitle.trim()) return;
                        setAddingStep(true);
                        try {
                          const res = await fetch(`/api/mediations/${mediationId}/custom-steps`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              phase: phaseKey,
                              title: newStepTitle.trim(),
                              description: newStepDesc.trim(),
                            }),
                          });
                          if (res.ok) {
                            const created: CustomStepData = await res.json();
                            const newDetail = toStepDetail(created);
                            setStepDetails((prev) => [...prev, newDetail]);
                            setInputText((prev) => ({ ...prev, [newDetail.key]: "" }));
                            setStepView((prev) => ({ ...prev, [newDetail.key]: "input" }));
                            setItems((prev) => ({
                              ...prev,
                              [newDetail.key]: Object.fromEntries(participants.map((p) => [p.id, []])),
                            }));
                            setActiveStepIndex(allStepDetails.length);
                            setShowAddStep(false);
                            setNewStepTitle("");
                            setNewStepDesc("");
                          }
                        } finally {
                          setAddingStep(false);
                        }
                      }}
                      className="btn btn-primary text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {addingStep ? "Wird hinzugefügt …" : "Schritt hinzufügen"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Aktiver Schritt */}
            {currentStep && (
              <div>
                <div className="mb-2 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-100 text-sm font-bold text-accent-700">
                    {stepIndex + 1}
                  </div>
                  <h2 className="text-lg font-bold text-neutral-900">{currentStep.title}</h2>
                </div>
                {!isResultStep && (
                  <p className="mb-6 ml-11 max-w-2xl text-sm text-neutral-600">{currentStep.description}</p>
                )}

                {/* Schritt-Bausteine aus der WorkflowManager-Konfiguration.
                    Neuer block-basierter Aufbau (mit Antwort-Speicherung), sonst
                    Fallback auf die alten content_types-Bausteine. */}
                {!isResultStep &&
                  (stepMeta[currentStep.key]?.blocks?.length ? (
                    <StepBlocks
                      mediationId={mediationId}
                      phase={phaseKey}
                      stepKey={currentStep.key}
                      blocks={stepMeta[currentStep.key]!.blocks!}
                      onValuesChange={setBlockValues}
                      viewerRole={currentParticipant?.role}
                      viewerName={currentUserName}
                    />
                  ) : (
                    <StepContentBlocks meta={stepMeta[currentStep.key]} />
                  ))}

                {/* Ergebnis-Ansicht (read-only, nur freigegebene Inhalte) */}
                {isResultStep && (
                  <div className="space-y-5">
                    {resultReleased && currentStep.description ? (
                      <div className="rounded-2xl border border-cyan-200 bg-cyan-50/50 p-5">
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-700">
                          {currentStep.description}
                        </p>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-neutral-200 p-6 text-center">
                        <p className="text-sm text-neutral-400">
                          Die Ergebnisse werden hier angezeigt, sobald dein Mediator sie freigegeben hat.
                        </p>
                      </div>
                    )}
                    {saveError && (
                      <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{saveError}</p>
                    )}
                    <div className="flex justify-end">
                      {myResultDone ? (
                        !isLastStep ? (
                          <button type="button" onClick={() => setActiveStepIndex(stepIndex + 1)} className="btn btn-primary">
                            Weiter
                          </button>
                        ) : (
                          <span className="text-sm font-medium text-accent-600">✓ Gesehen</span>
                        )
                      ) : (
                        <button
                          type="button"
                          onClick={() => submitStep(currentStep.key)}
                          disabled={saving}
                          className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {saving ? "Wird gespeichert …" : "Verstanden – abschließen ✓"}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Input-Ansicht */}
                {!isResultStep && view === "input" && (
                  <div className="space-y-5">
                    {/* Generische Punkte-Liste – nur für Schritte OHNE eigene
                        Blöcke. Sonst stünde neben den passenden Feldern des
                        Schritts noch ein zweites, beziehungsloses Eingabefeld. */}
                    {showItemList && (
                    <div className="rounded-2xl border border-accent-300 bg-white p-5 shadow-sm">
                      <div className="mb-3 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-neutral-900">{currentUserName}</p>
                          <p className="text-xs text-neutral-500">{currentParticipant ? (roleLabel[currentParticipant.role] ?? currentParticipant.role) : ""}</p>
                        </div>
                        <span className="rounded-full bg-accent-100 px-2.5 py-1 text-xs font-semibold text-accent-700">Du</span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={inputText[currentStep.key] ?? ""}
                          onChange={(e) => setInputText((prev) => ({ ...prev, [currentStep.key]: e.target.value }))}
                          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addItem(currentStep.key); } }}
                          placeholder={currentStep.placeholder}
                          className="flex-1 rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-accent-500 focus:ring-4 focus:ring-accent-100"
                        />
                        <button type="button" onClick={() => addItem(currentStep.key)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-600 text-white transition hover:bg-accent-700">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                      {myItems.length > 0 && (
                        <ul className="mt-3 space-y-1.5">
                          {myItems.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-700">
                              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-400" />
                              <span className="flex-1">{item}</span>
                              <button type="button" onClick={() => removeItem(currentStep.key, idx)} className="ml-1 rounded p-0.5 text-neutral-400 hover:bg-red-50 hover:text-red-500">
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    )}

                    {/* Andere Teilnehmer (noch wartend) */}
                    {accepted.filter((p) => p.name !== currentUserName).map((p) => (
                      <div key={p.id} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                        <div className="flex items-center justify-between">
                                   <div>
                            <p className="font-semibold text-neutral-900">{p.name}</p>
                            <p className="text-xs text-neutral-500">{roleLabel[p.role] ?? p.role}</p>
                          </div>
                        </div>
                        <p className="mt-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm italic text-neutral-400">
                          Wartet auf Eingabe …
                        </p>
                      </div>
                    ))}

                    {saveError && (
                      <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{saveError}</p>
                    )}

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => submitStep(currentStep.key)}
                        disabled={saving || !canSubmitStep}
                        className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {saving
                          ? "Wird gespeichert …"
                          : hasBlocks && blockInputs.length === 0
                          ? "Gelesen – weiter ✓"
                          : "Schritt abschließen ✓"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Warte-Ansicht */}
                {!isResultStep && view === "waiting" && stepStatus[currentStep.key] && (
                  <>
                    <WaitingView status={stepStatus[currentStep.key]} />
                    {/* Sperre „self": die eigene Abgabe genügt – weiterarbeiten,
                        während die andere Seite noch tippt. Bei „all" bleibt der
                        nächste Schritt zu und dieser Button erscheint nicht. */}
                    {!isLastStep && gatePassed(currentStep.key) && (
                      <div className="mt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setActiveStepIndex(stepIndex + 1)}
                          className="btn btn-primary"
                        >
                          Weiter →
                        </button>
                      </div>
                    )}
                  </>
                )}

                {/* Reflexions-Ansicht */}
                {!isResultStep && view === "reflection" && (
                  <ReflectionView
                    step={currentStep}
                    phaseKey={phaseKey}
                    mediationId={mediationId}
                    allInputs={items[currentStep.key] ?? {}}
                    participants={accepted}
                    currentParticipantId={currentParticipant?.id ?? ""}
                    blocks={currentBlocks}
                    isLastStep={isLastStep}
                    onNext={() => {
                      if (!isLastStep) {
                        setActiveStepIndex(stepIndex + 1);
                      }
                    }}
                  />
                )}
              </div>
            )}
          </div>

          {/* Phasen-Navigation */}
          <div className="mt-10 flex items-center justify-between border-t border-neutral-100 pt-6">
            <button
              type="button"
              onClick={() => phase.prevPhase ? router.push(`/dashboard/${hashId(mediationId)}/${phase.prevPhase}`) : router.push(`/dashboard/${hashId(mediationId)}`)}
              className="btn btn-ghost"
            >
              ← Zurück
            </button>

            {allStepsReflected && (
              <button
                type="button"
                onClick={advance}
                disabled={advancing}
                className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-60"
              >
                {advancing ? "Wird gespeichert …" : phase.nextPhase ? "Nächste Phase →" : "Mediation abschließen ✓"}
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
