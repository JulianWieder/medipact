"use client";

import { hashId } from "@/lib/ids";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PHASES, getPhase, getPhaseIndex, type PhaseKey, type StepDetail } from "./phaseData";

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
    <div className="flex items-center gap-2 text-sm text-slate-500">
      <svg className="h-4 w-4 animate-spin text-emerald-500" fill="none" viewBox="0 0 24 24">
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
              <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
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
    accept: "bg-emerald-100 text-emerald-700 border-emerald-200",
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
      <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3">
        <svg className="h-4 w-4 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <p className="text-sm font-semibold text-emerald-800">
          Alle Eingaben abgeschlossen – reagiere jetzt auf die Punkte der anderen Seite.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* ── Meine Punkte (read-only + eingehende Reaktionen) ── */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Deine Eingaben {me ? `· ${me.name}` : ""}
          </p>
          {myItems.length === 0 ? (
            <p className="text-sm italic text-slate-400">Keine Eingaben.</p>
          ) : (
            <ul className="space-y-2">
              {myItems.map((item, idx) => {
                const incoming = others.map((o) => getTheirReactionOnMe(o.id, idx)).filter(Boolean) as Reaction[];
                return (
                  <li key={idx} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <div className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                      <span className="flex-1 text-sm text-slate-700">{item}</span>
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
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
                  {other.name} · {roleLabel[other.role] ?? other.role}
                </p>
                {otherItems.length === 0 ? (
                  <p className="text-sm italic text-slate-400">Keine Eingaben.</p>
                ) : (
                  <ul className="space-y-3">
                    {otherItems.map((item, idx) => {
                      const myReaction = getMyReaction(other.id, idx);
                      const itemKey = `${other.id}-${idx}`;
                      const isSaving = saving[itemKey] ?? false;
                      const tradeOpen = tradePickerFor === itemKey;

                      return (
                        <li key={idx} className="rounded-xl border border-slate-200 bg-white p-4">
                          <div className="flex items-start gap-2">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                            <span className="flex-1 text-sm text-slate-700">{item}</span>
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
                                  className="text-xs text-slate-400 underline hover:text-slate-600"
                                >
                                  Ändern
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => sendReaction(other.id, idx, "accept")}
                                  className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
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
                                      className="w-full rounded-lg border border-violet-200 bg-white px-3 py-2 text-left text-sm text-slate-700 transition hover:border-violet-400 hover:bg-violet-50"
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
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
        <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-emerald-800">
          <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Alle Teilnehmer haben ihren Input abgeschlossen
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {accepted.map((p) => {
            const pitems = allInputs[p.id] ?? [];
            return (
              <div key={p.id} className="rounded-xl border border-emerald-100 bg-white p-4">
                <p className="mb-2 font-semibold text-slate-900">{p.name}</p>
                <p className="mb-3 text-xs text-slate-500">{roleLabel[p.role] ?? p.role}</p>
                {pitems.length > 0 ? (
                  <ul className="space-y-1.5">
                    {pitems.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm italic text-slate-400">Keine Eingaben.</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-700">Paraphrasierung</p>
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
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
            {reflection}
          </div>
        ) : (
          <p className="text-sm italic text-slate-400">
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

// ── Reflexions-Router ─────────────────────────────────────────────────────────
function ReflectionView(props: {
  step: StepDetail;
  phaseKey: PhaseKey;
  mediationId: string;
  allInputs: Record<string, string[]>;
  participants: Participant[];
  currentParticipantId: string;
  onNext: () => void;
  isLastStep: boolean;
}) {
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
  const stepDetails = phase.stepDetails;

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

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [advancing, setAdvancing] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentStep = stepDetails[activeStepIndex];
  const accepted = participants.filter((p) => p.invitationStatus === "accepted");
  const currentParticipant = participants.find((p) => p.name === currentUserName);

  // ── Daten laden ──────────────────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [partRes] = await Promise.all([
          fetch(`/api/mediations/${mediationId}/participants`),
        ]);
        if (!partRes.ok) return;
        const parts: Participant[] = await partRes.json();
        setParticipants(parts);

        // Alle Notizen + step-status für alle Schritte laden
        const results = await Promise.all(
          stepDetails.map(async (step) => {
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
        setInputText(Object.fromEntries(stepDetails.map((s) => [s.key, ""])));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [mediationId, phaseKey]); // eslint-disable-line react-hooks/exhaustive-deps

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
        router.push(`/dashboard/${mediationId}/${phase.nextPhase}`);
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
  const isLastStep = activeStepIndex === stepDetails.length - 1;
  const allStepsReflected = stepDetails.every((s) => stepView[s.key] === "reflection");

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
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors ${isDone ? "bg-emerald-500 text-white" : isCurrent ? "bg-emerald-600 text-white ring-4 ring-emerald-100" : "bg-slate-200 text-slate-500"}`}>
                      {isDone ? (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (index + 1)}
                    </div>
                    <span className={`max-w-[80px] text-center text-xs font-medium leading-tight ${isCurrent ? "text-emerald-700" : isDone ? "text-emerald-600" : "text-slate-400"}`}>
                      {p.shortLabel}
                    </span>
                  </div>
                  {index < PHASES.length - 1 && (
                    <div className={`mx-2 mb-5 h-0.5 w-12 transition-colors ${index < currentIndex ? "bg-emerald-400" : "bg-slate-200"}`} />
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        <div className="app-surface p-8">
          <p className="eyebrow mb-1">Phase {currentIndex + 1} von {PHASES.length}</p>
          <h1 className="heading-2 text-slate-900">{phase.label}</h1>

          {/* Mediator-Leitfaden */}
          {phase.guide.length > 0 && (
            <div className="mt-4">
              <button type="button" onClick={() => setShowGuide((v) => !v)} className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100">
                <svg className={`h-4 w-4 transition-transform ${showGuide ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
                {showGuide ? "Leitfaden ausblenden" : "Mediator-Leitfaden anzeigen"}
              </button>
              {showGuide && (
                <div className="mt-4 space-y-4 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-6">
                  <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">Leitfaden · {phase.shortLabel}</p>
                  {phase.guide.map((section, i) => (
                    <div key={i} className={`rounded-xl border p-4 ${section.highlight ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white"}`}>
                      <h3 className="mb-2 text-sm font-bold text-slate-800">{section.title}</h3>
                      {section.type === "list" ? (
                        <ul className="space-y-1">
                          {(section.content as string[]).map((item, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-slate-600">{section.content as string}</p>
                      )}
                      {section.example && <p className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs italic text-slate-500">{section.example}</p>}
                      {section.note && <p className="mt-3 text-xs font-medium text-amber-700">{section.note}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Schritt-Navigator */}
          <div className="mt-8">
            <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-1">
              {stepDetails.map((step, idx) => {
                const sv = stepView[step.key] ?? "input";
                const isActive = idx === activeStepIndex;
                const isDone = sv === "reflection";
                return (
                  <button
                    key={step.key}
                    type="button"
                    onClick={() => setActiveStepIndex(idx)}
                    className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-emerald-600 text-white shadow-sm"
                        : isDone
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {isDone ? (
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${isActive ? "bg-white/20" : "bg-slate-200 text-slate-500"}`}>{idx + 1}</span>
                    )}
                    {step.title}
                  </button>
                );
              })}
            </div>

            {/* Aktiver Schritt */}
            {currentStep && (
              <div>
                <div className="mb-2 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                    {activeStepIndex + 1}
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">{currentStep.title}</h2>
                </div>
                <p className="mb-6 ml-11 max-w-2xl text-sm text-slate-600">{currentStep.description}</p>

                {/* Input-Ansicht */}
                {view === "input" && (
                  <div className="space-y-5">
                    {/* Mein Input */}
                    <div className="rounded-2xl border border-emerald-300 bg-white p-5 shadow-sm">
                      <div className="mb-3 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-slate-900">{currentUserName}</p>
                          <p className="text-xs text-slate-500">{currentParticipant ? (roleLabel[currentParticipant.role] ?? currentParticipant.role) : ""}</p>
                        </div>
                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">Du</span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={inputText[currentStep.key] ?? ""}
                          onChange={(e) => setInputText((prev) => ({ ...prev, [currentStep.key]: e.target.value }))}
                          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addItem(currentStep.key); } }}
                          placeholder={currentStep.placeholder}
                          className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                        />
                        <button type="button" onClick={() => addItem(currentStep.key)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white transition hover:bg-emerald-700">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                      {myItems.length > 0 && (
                        <ul className="mt-3 space-y-1.5">
                          {myItems.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                              <span className="flex-1">{item}</span>
                              <button type="button" onClick={() => removeItem(currentStep.key, idx)} className="ml-1 rounded p-0.5 text-slate-400 hover:bg-red-50 hover:text-red-500">
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Andere Teilnehmer (noch wartend) */}
                    {accepted.filter((p) => p.name !== currentUserName).map((p) => (
                      <div key={p.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-slate-900">{p.name}</p>
                            <p className="text-xs text-slate-500">{roleLabel[p.role] ?? p.role}</p>
                          </div>
                        </div>
                        <p className="mt-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm italic text-slate-400">
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
                        disabled={saving || myItems.length === 0}
                        className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {saving ? "Wird gespeichert …" : "Schritt abschließen ✓"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Warte-Ansicht */}
                {view === "waiting" && stepStatus[currentStep.key] && (
                  <WaitingView status={stepStatus[currentStep.key]} />
                )}

                {/* Reflexions-Ansicht */}
                {view === "reflection" && (
                  <ReflectionView
                    step={currentStep}
                    phaseKey={phaseKey}
                    mediationId={mediationId}
                    allInputs={items[currentStep.key] ?? {}}
                    participants={accepted}
                    currentParticipantId={currentParticipant?.id ?? ""}
                    isLastStep={isLastStep}
                    onNext={() => {
                      if (!isLastStep) {
                        setActiveStepIndex((i) => i + 1);
                      }
                    }}
                  />
                )}
              </div>
            )}
          </div>

          {/* Phasen-Navigation */}
          <div className="mt-10 flex items-center justify-between border-t border-slate-100 pt-6">
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
