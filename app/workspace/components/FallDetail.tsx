"use client";

import React, { useEffect, useState, useCallback } from "react";
import type { MediationCase, Participant, PhaseNoteGroup, FeedbackEntry, MediationVariantDto } from "../types";
import { PHASES, getPhaseIndex, TYPE_LABEL } from "../types";
import {
  StatusBadge,
  TypeBadge,
  RoleBadge,
  SectionHeader,
  KPI,
  WCard,
  InviteStatusDot,
  EmptyState,
  cn,
} from "../ui";
import { StatusDot, SegmentedControl, Skeleton, SlideOver } from "@/app/components/ui/premium";
import MediationChat from "@/app/components/mediation/MediationChat";
import {
  fetchParticipants,
  fetchAllNotes,
  advanceMediationPhase,
  inviteParty,
  fetchStepStatus,
  fetchWorkflowRules,
  saveWorkflowRule,
  deleteWorkflowRule,
  fetchVariants,
  setMediationVariant,
  fetchMediators,
  setMediationMediator,
  fetchStepContent,
  saveStepContent,
  summarizeResults,
  generateMeetLink,
  type WorkflowRulesResponse,
  type MediatorOption,
} from "../api";

interface FallDetailProps {
  fall: MediationCase;
  onPhaseAdvanced?: () => void;
}

// Button: erzeugt serverseitig einen Google-Meet-Raum und gibt den Link an den
// Aufrufer zurück (der ihn ins meeting_url-Feld übernimmt + persistiert).
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
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="inline-flex items-center gap-1 rounded-md border border-accent-300 bg-accent-50 px-2.5 py-1.5 text-xs font-semibold text-accent-700 transition hover:bg-accent-100 disabled:opacity-50"
      >
        {loading ? "Erzeuge Meet-Raum…" : "🎦 Google-Meet-Link erzeugen"}
      </button>
      {error && <p className="mt-1 text-xs font-semibold text-red-600">{error}</p>}
    </div>
  );
}

// ── Contract types ─────────────────────────────────────────────────────────
interface Contract {
  id: number;
  text: string;
  created_at: string;
}

interface ContractSignature {
  participant_id: string;
  name: string;
  signed_name: string;
  signed_at: string;
}

interface StepStatusEntry {
  participant_id: string;
  name: string;
  role: string;
  submitted: boolean;
}

interface StepStatusResult {
  participants: StepStatusEntry[];
  allSubmitted: boolean;
}

/** Block-Antwort-Wert (JSON: String/Liste/Objekt) lesbar formatieren. */
function formatBlockValue(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map((v) => String(v)).join(", ");
  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .map(([k, v]) => `${k}: ${typeof v === "object" && v !== null ? JSON.stringify(v, null, 1) : String(v)}`)
      .join("\n");
  }
  return String(value);
}

/** Badge-Farben je Autor-Quelle für die Eingaben-Übersicht. */
const AUTHOR_BADGE: Record<string, string> = {
  ai: "bg-violet-100 text-violet-700",
  mediator: "bg-sky-100 text-sky-700",
  user: "bg-accent-100 text-accent-700",
};

const WORKFLOW_ROLE_LABEL: Record<string, string> = {
  initiator: "Antragsteller",
  other_party: "Andere Seite",
  owner: "Antragsteller",
  mediator: "Mediator",
  admin: "Admin",
};

export function FallDetail({ fall, onPhaseAdvanced }: FallDetailProps) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [allPhaseNotes, setAllPhaseNotes] = useState<PhaseNoteGroup[]>([]);
  const [loadingParticipants, setLoadingParticipants] = useState(true);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  const [advanceError, setAdvanceError] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("other_party");
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [inviteUrl, setInviteUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "notes" | "contract" | "steps" | "termin" | "feedback" | "analyse" | "chat">("overview");

  // ── Mediations-Variante (Fall <-> Variante, jederzeit umstellbar) ──
  const [variants, setVariants] = useState<MediationVariantDto[]>([]);
  const [variantKey, setVariantKey] = useState<string | null>(fall.variant_key ?? null);
  const [variantSaving, setVariantSaving] = useState(false);
  const [variantError, setVariantError] = useState("");

  useEffect(() => {
    setVariantKey(fall.variant_key ?? null);
    fetchVariants(fall.mediation_type)
      .then((list) => setVariants(list.filter((v) => v.enabled)))
      .catch(() => setVariants([]));
  }, [fall.id, fall.mediation_type, fall.variant_key]);

  // ── Mediator-Zuordnung (immer genau einer; aus Nutzern mit Rolle "mediator") ──
  const [mediators, setMediators] = useState<MediatorOption[]>([]);
  const [mediatorUserId, setMediatorUserId] = useState<number | null>(null);
  const [mediatorSaving, setMediatorSaving] = useState(false);
  const [mediatorError, setMediatorError] = useState("");

  useEffect(() => {
    fetchMediators()
      .then(setMediators)
      .catch(() => setMediators([]));
  }, []);

  // Aktuellen Mediator aus der Teilnehmerliste (Rolle "mediator") ableiten und
  // per E-Mail auf die Mediatoren-Liste (user_id) mappen.
  useEffect(() => {
    const current = participants.find((p) => p.role === "mediator");
    if (!current?.email || mediators.length === 0) return;
    const match = mediators.find(
      (m) => m.email.toLowerCase() === current.email!.toLowerCase(),
    );
    if (match) setMediatorUserId(match.user_id);
  }, [participants, mediators]);

  async function handleMediatorChange(userId: number) {
    setMediatorSaving(true);
    setMediatorError("");
    try {
      await setMediationMediator(fall.id, userId);
      setMediatorUserId(userId);
      // Teilnehmerliste neu laden, damit der neue Mediator überall erscheint.
      fetchParticipants(fall.id).then(setParticipants).catch(() => {});
    } catch {
      setMediatorError("Mediator konnte nicht geändert werden");
    } finally {
      setMediatorSaving(false);
    }
  }

  async function handleVariantChange(nextKey: string) {
    const value = nextKey === "" ? null : nextKey;
    setVariantSaving(true);
    setVariantError("");
    try {
      await setMediationVariant(fall.id, value);
      // variantKey erst NACH erfolgreichem Speichern setzen: die Variante
      // bestimmt die effektive Schrittliste (siehe get_phase_steps). Der
      // Schritte-Tab lädt bei Änderung von variantKey neu (Dependency unten),
      // und sieht dann garantiert den bereits committeten Server-Stand –
      // sonst würde ein optimistisches Update die Schritte der ALTEN Variante
      // (bzw. leer) laden, bevor der PUT durch ist.
      setVariantKey(value);
    } catch {
      setVariantError("Variante konnte nicht gespeichert werden");
    } finally {
      setVariantSaving(false);
    }
  }

  // ── Individuelle Schritt-Inhalte (pro Fall) ──
  // Werden direkt im Schritte-Tab bei den betroffenen Schritten gepflegt.
  type StepContentDraft = {
    body_text: string;
    video_url: string;
    meeting_url: string;
    question: string;
    feedback_occasion: "after_videocall" | "before_contract" | "";
    released: boolean;
  };
  const [contentDrafts, setContentDrafts] = useState<Record<string, StepContentDraft>>({});
  const [savingContentKey, setSavingContentKey] = useState<string | null>(null);
  const [savedContentKey, setSavedContentKey] = useState<string | null>(null);
  const [summarizingKey, setSummarizingKey] = useState<string | null>(null);

  const emptyDraft: StepContentDraft = {
    body_text: "",
    video_url: "",
    meeting_url: "",
    question: "",
    feedback_occasion: "",
    released: false,
  };

  function updateDraft(mapKey: string, patch: Partial<StepContentDraft>) {
    setContentDrafts((prev) => ({
      ...prev,
      [mapKey]: { ...(prev[mapKey] ?? emptyDraft), ...patch },
    }));
    setSavedContentKey(null);
  }

  // Speichert den fallbezogenen Inhalt eines Schritts (inkl. Freigabe-Flag).
  async function handleSaveContent(phase: string, stepKey: string) {
    const mapKey = `${phase}:${stepKey}`;
    const draft = contentDrafts[mapKey] ?? emptyDraft;
    setSavingContentKey(mapKey);
    try {
      await saveStepContent(fall.id, {
        phase,
        step_key: stepKey,
        body_text: draft.body_text.trim() || null,
        video_url: draft.video_url.trim() || null,
        meeting_url: draft.meeting_url.trim() || null,
        question: draft.question.trim() || null,
        feedback_occasion: draft.feedback_occasion || null,
        released: draft.released,
      });
      setSavedContentKey(mapKey);
    } catch {
      setAdvanceError("Inhalt konnte nicht gespeichert werden.");
    } finally {
      setSavingContentKey(null);
    }
  }

  // KI-Zusammenfassung der Quell-Eingaben erzeugen und in den Entwurf übernehmen.
  async function handleSummarize(mapKey: string, sourcePhase: string | null) {
    setSummarizingKey(mapKey);
    try {
      const summary = await summarizeResults(fall.id, sourcePhase);
      if (summary) updateDraft(mapKey, { body_text: summary });
    } catch {
      setAdvanceError("KI-Zusammenfassung fehlgeschlagen.");
    } finally {
      setSummarizingKey(null);
    }
  }

  // Analyse
  type SwotData = {
    staerken: string[];
    schwaechen: string[];
    chancen: string[];
    risiken: string[];
  };
  type PhaseAnalyse = {
    summary?: string | null;
    prompt?: string | null;
    saved_at?: string | null;
    message?: string | null;
  };
  type SwotZielResult = {
    ziel?: string;
    zusammenfassung?: string;
    swot?: Partial<SwotData>;
    finalisierung?: string[];
    prompt?: string | null;
    saved_at?: string | null;
  };
  const [phaseAnalysen, setPhaseAnalysen] = useState<Record<string, PhaseAnalyse>>({});
  const [swotResult, setSwotResult] = useState<SwotZielResult | null>(null);
  // Phase-id oder "swot" – welcher Analyse-Lauf gerade läuft
  const [analyseLoadingKey, setAnalyseLoadingKey] = useState<string | null>(null);
  const [analyseError, setAnalyseError] = useState("");
  // Für welche Analyse der gesendete KI-Prompt aufgeklappt ist
  const [openPromptKey, setOpenPromptKey] = useState<string | null>(null);
  const [analysenLoaded, setAnalysenLoaded] = useState(false);

  // Gespeicherte Analysen beim ersten Öffnen des Tabs laden
  useEffect(() => {
    if (activeTab !== "analyse" || analysenLoaded) return;
    setAnalysenLoaded(true);
    (async () => {
      try {
        const res = await fetch(`/api/mediations/${fall.id}/analysen`);
        if (!res.ok) return;
        const data = await res.json();
        if (data?.phasen) setPhaseAnalysen(data.phasen);
        if (data?.swot) setSwotResult(data.swot);
      } catch {
        /* gespeicherte Analysen sind optional */
      }
    })();
  }, [activeTab, analysenLoaded, fall.id]);

  function formatSavedAt(iso?: string | null): string {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  }

  async function handleAnalysePhase(phase: string) {
    setAnalyseLoadingKey(phase);
    setAnalyseError("");
    try {
      const res = await fetch(`/api/mediations/${fall.id}/analyse-phase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phase }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setAnalyseError(body?.detail ?? "Analyse fehlgeschlagen");
        return;
      }
      const data = await res.json();
      setPhaseAnalysen((prev) => ({ ...prev, [phase]: data }));
    } catch {
      setAnalyseError("Server nicht erreichbar.");
    } finally {
      setAnalyseLoadingKey(null);
    }
  }

  async function handleAnalyseSwot() {
    setAnalyseLoadingKey("swot");
    setAnalyseError("");
    try {
      const res = await fetch(`/api/mediations/${fall.id}/analyse-swot`, { method: "POST" });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setAnalyseError(body?.detail ?? "Analyse fehlgeschlagen");
        return;
      }
      setSwotResult(await res.json());
    } catch {
      setAnalyseError("Server nicht erreichbar.");
    } finally {
      setAnalyseLoadingKey(null);
    }
  }

  // Feedback
  const [feedbackEntries, setFeedbackEntries] = useState<FeedbackEntry[]>([]);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  const loadFeedback = useCallback(async () => {
    setLoadingFeedback(true);
    try {
      const res = await fetch(`/api/mediations/${fall.id}/feedback`);
      if (res.ok) setFeedbackEntries(await res.json());
    } catch { /* ignore */ } finally {
      setLoadingFeedback(false);
    }
  }, [fall.id]);

  useEffect(() => {
    if (activeTab === "feedback") loadFeedback();
  }, [activeTab, loadFeedback]);

  // Appointments
  type AppointmentSlot = {
    id: number;
    proposed_datetime: string;
    votes: { participant_id: number; name: string; accepted: boolean }[];
    all_accepted: boolean;
    mediator_confirmed?: boolean;
    status?: "proposed" | "reserved" | "confirmed";
  };
  const [appointmentSlots, setAppointmentSlots] = useState<AppointmentSlot[]>([]);
  const [confirmedSlot, setConfirmedSlot] = useState<AppointmentSlot | null>(null);
  const [reservedSlot, setReservedSlot] = useState<AppointmentSlot | null>(null);
  const [appointmentLoading, setAppointmentLoading] = useState(false);
  const [appointmentVoting, setAppointmentVoting] = useState<number | null>(null);
  const [appointmentConfirming, setAppointmentConfirming] = useState<number | null>(null);

  // Contract
  const [contract, setContract] = useState<Contract | null>(null);
  const [signatures, setSignatures] = useState<ContractSignature[]>([]);
  const [allSigned, setAllSigned] = useState(false);
  const [contractGenerating, setContractGenerating] = useState(false);
  const [contractReleasing, setContractReleasing] = useState(false);
  const [isReleased, setIsReleased] = useState(false);
  const [contractError, setContractError] = useState("");

  // Schritte ALLER Phasen: die Schrittlisten kommen fertig zusammengeführt vom
  // Backend (phase-steps = WorkflowManager-Konfiguration inkl. Variante,
  // Custom-Schritten und visible_if). Der Tab zeigt eine Phase zur Zeit.
  //
  // Tracking-Eigenheit: die Einleitung trackt jeden Schritt als Pseudo-Phase
  // (notes/status mit phase=step.key, step=""), alle anderen Phasen mit
  // (phase=<phase>, step=<step.key>). `trackingParams` kapselt das.
  type PhaseStepDef = {
    key: string;
    title: string;
    description: string;
    content_types: string[];
    video_url: string | null;
    meeting_url: string | null;
    question: string | null;
    contract_template: string | null;
    feedback_occasion: "after_videocall" | "before_contract" | null;
    individual: boolean;
    result_source_phase: string | null;
  };
  const [phaseSteps, setPhaseSteps] = useState<Record<string, PhaseStepDef[]>>({});
  // Alle Zustands-Maps sind mit `${phase}:${step.key}` verschlüsselt.
  const [stepStatuses, setStepStatuses] = useState<Record<string, StepStatusResult>>({});
  const [loadingSteps, setLoadingSteps] = useState(false);
  // Aktive Phase im Schritte-Tab: startet bei der aktuellen Fall-Phase.
  const [stepsPhase, setStepsPhase] = useState<string>(() =>
    PHASES.some((p) => p.id === fall.phase) ? (fall.phase as string) : "einleitung",
  );
  // SlideOver: `${phase}:${key}` des geöffneten Schritts.
  const [openStepKey, setOpenStepKey] = useState<string | null>(null);

  /** notes/step-status/workflow-rules-Parameter für einen Schritt. */
  const trackingParams = (phase: string, stepKey: string) =>
    phase === "einleitung" ? { phase: stepKey, step: "" } : { phase, step: stepKey };
  const mapKeyOf = (phase: string, stepKey: string) => `${phase}:${stepKey}`;

  // Ergebnis-Anzeige-Schritte über ALLE Phasen (Freigabe erfolgt hier pro Fall).
  type ResultStep = { phase: string; key: string; title: string; source_phase: string | null };
  const resultSteps: ResultStep[] = React.useMemo(
    () =>
      PHASES.flatMap((p) =>
        (phaseSteps[p.id] ?? [])
          .filter((s) => s.content_types.includes("ergebnis"))
          .map((s) => ({ phase: p.id, key: s.key, title: s.title, source_phase: s.result_source_phase })),
      ),
    [phaseSteps],
  );

  // Workflow-Konfiguration (wer muss welchen Schritt abschließen)
  const [workflowData, setWorkflowData] = useState<WorkflowRulesResponse | null>(null);
  const [ruleSelections, setRuleSelections] = useState<Record<string, Set<string>>>({});
  const [ruleSkips, setRuleSkips] = useState<Record<string, boolean>>({});
  const [savingRuleKey, setSavingRuleKey] = useState<string | null>(null);

  const phaseIdx = getPhaseIndex(fall.phase);
  const accepted = participants.filter((p) => p.invitationStatus === "accepted");

  // ── Daten laden ────────────────────────────────────────────────────────────
  useEffect(() => {
    setLoadingParticipants(true);
    fetchParticipants(fall.id)
      .then(setParticipants)
      .finally(() => setLoadingParticipants(false));
  }, [fall.id]);

  const loadAllNotes = useCallback(async () => {
    setLoadingNotes(true);
    const data = await fetchAllNotes(fall.id);
    setAllPhaseNotes(data);
    setLoadingNotes(false);
  }, [fall.id]);

  useEffect(() => {
    if (activeTab === "notes") loadAllNotes();
  }, [activeTab, loadAllNotes]);

  const loadContract = useCallback(async () => {
    try {
      const res = await fetch(`/api/mediations/${fall.id}/contract`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.contract) {
        setContract(data.contract);
        setSignatures(data.signatures ?? []);
        setAllSigned(data.all_signed ?? false);
        setIsReleased(data.is_released ?? false);
      } else {
        setContract(null);
        setIsReleased(false);
      }
    } catch { /* ignore */ }
  }, [fall.id]);

  useEffect(() => {
    if (activeTab === "contract") loadContract();
    if (activeTab === "termin") loadAppointments();
  }, [activeTab, loadContract]); // eslint-disable-line react-hooks/exhaustive-deps

  // Schrittlisten ALLER Phasen aus dem zusammengeführten phase-steps-Endpoint
  // (= WorkflowManager-Konfiguration für diesen Fall, inkl. Variante).
  const loadAllPhaseSteps = useCallback(async (): Promise<Record<string, PhaseStepDef[]>> => {
    const entries = await Promise.all(
      PHASES.map(async (p): Promise<[string, PhaseStepDef[]]> => {
        const res = await fetch(`/api/mediations/${fall.id}/phase-steps?phase=${p.id}`, {
          cache: "no-store",
        });
        if (!res.ok) return [p.id, []];
        const data = await res.json().catch(() => null);
        const raw = (data?.steps ?? []) as Array<Record<string, unknown>>;
        const defs: PhaseStepDef[] = raw.map((s) => ({
          key: String(s.key),
          title: String(s.title ?? s.key),
          description: (s.description as string) ?? "",
          content_types: (s.content_types as string[] | null) ?? [],
          video_url: (s.video_url as string | null) ?? null,
          meeting_url: (s.meeting_url as string | null) ?? null,
          question: (s.question as string | null) ?? null,
          contract_template: (s.contract_template as string | null) ?? null,
          feedback_occasion:
            (s.feedback_occasion as "after_videocall" | "before_contract" | null) ?? null,
          individual: Boolean(s.individual),
          result_source_phase: (s.result_source_phase as string | null) ?? null,
        }));
        return [p.id, defs];
      }),
    );
    const map = Object.fromEntries(entries) as Record<string, PhaseStepDef[]>;
    setPhaseSteps(map);
    return map;
  }, [fall.id]);

  const loadStepStatuses = useCallback(
    async (all: Record<string, PhaseStepDef[]>) => {
      const results: Record<string, StepStatusResult> = {};
      await Promise.all(
        Object.entries(all).flatMap(([phase, steps]) =>
          steps.map(async (s) => {
            const p = trackingParams(phase, s.key);
            const data = await fetchStepStatus(fall.id, p.phase, p.step);
            results[mapKeyOf(phase, s.key)] = {
              participants: data.participants,
              allSubmitted: data.all_submitted,
            };
          }),
        ),
      );
      setStepStatuses(results);
    },
    [fall.id], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const loadWorkflowRules = useCallback(
    async (all: Record<string, PhaseStepDef[]>) => {
      const data = await fetchWorkflowRules(fall.id);
      if (!data) return;
      setWorkflowData(data);
      const nextSelections: Record<string, Set<string>> = {};
      const nextSkips: Record<string, boolean> = {};
      for (const [phase, steps] of Object.entries(all)) {
        for (const step of steps) {
          const p = trackingParams(phase, step.key);
          const rule = data.rules.find((r) => r.phase === p.phase && r.step === p.step);
          const mapKey = mapKeyOf(phase, step.key);
          nextSelections[mapKey] = rule?.required_roles
            ? new Set(rule.required_roles)
            : new Set(data.default_required_roles.filter((r) => data.available_roles.includes(r)));
          nextSkips[mapKey] = rule?.skip ?? false;
        }
      }
      setRuleSelections(nextSelections);
      setRuleSkips(nextSkips);
    },
    [fall.id], // eslint-disable-line react-hooks/exhaustive-deps
  );

  // Fallbezogene Inhalte + Ergebnis-Freigaben (inkl. Freigabe-Flag) für
  // individuelle Schritte und Ergebnis-Schritte ALLER Phasen vorbelegen.
  const loadStepDrafts = useCallback(
    async (all: Record<string, PhaseStepDef[]>) => {
      const existing = await fetchStepContent(fall.id);
      setContentDrafts((prev) => {
        const next = { ...prev };
        for (const [phase, steps] of Object.entries(all)) {
          for (const s of steps) {
            if (!s.individual && !s.content_types.includes("ergebnis")) continue;
            const mapKey = mapKeyOf(phase, s.key);
            const sc = existing.find((e) => e.phase === phase && e.step_key === s.key);
            next[mapKey] = sc
              ? {
                  body_text: sc.body_text ?? "",
                  video_url: sc.video_url ?? "",
                  meeting_url: sc.meeting_url ?? "",
                  question: sc.question ?? "",
                  feedback_occasion: sc.feedback_occasion ?? "",
                  released: sc.released ?? false,
                }
              : { ...emptyDraft };
          }
        }
        return next;
      });
    },
    [fall.id], // eslint-disable-line react-hooks/exhaustive-deps
  );

  // Kompletter Ladelauf des Schritte-Tabs. Die Teilnehmer-Eingaben (Notizen +
  // Block-Antworten inkl. KI) kommen gesammelt aus notes/all (loadAllNotes).
  const reloadStepsTab = useCallback(async () => {
    setLoadingSteps(true);
    try {
      const all = await loadAllPhaseSteps();
      await Promise.all([
        loadStepStatuses(all),
        loadWorkflowRules(all),
        loadStepDrafts(all),
        loadAllNotes(),
        loadFeedback(),
      ]);
    } finally {
      setLoadingSteps(false);
    }
  }, [loadAllPhaseSteps, loadStepStatuses, loadWorkflowRules, loadStepDrafts, loadAllNotes, loadFeedback]);

  useEffect(() => {
    if (activeTab !== "steps") return;
    reloadStepsTab();
    // variantKey in den Dependencies: wechselt der Mediator die zugeordnete
    // Variante (Workflow), muss der Schritte-Tab die effektive Schrittliste
    // neu laden – sonst bleiben die Schritte nach dem Zuordnen leer/stale.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, fall.id, variantKey]);

  function toggleRuleRole(mapKey: string, role: string) {
    setRuleSelections((prev) => {
      const next = new Set(prev[mapKey] ?? []);
      if (next.has(role)) next.delete(role);
      else next.add(role);
      return { ...prev, [mapKey]: next };
    });
  }

  function toggleRuleSkip(mapKey: string) {
    setRuleSkips((prev) => ({ ...prev, [mapKey]: !prev[mapKey] }));
  }

  async function handleSaveRule(phase: string, stepKey: string) {
    const mapKey = mapKeyOf(phase, stepKey);
    setSavingRuleKey(mapKey);
    try {
      const p = trackingParams(phase, stepKey);
      const ok = await saveWorkflowRule(fall.id, {
        phase: p.phase,
        step: p.step,
        required_roles: Array.from(ruleSelections[mapKey] ?? []),
        skip: ruleSkips[mapKey] ?? false,
      });
      if (ok) {
        await Promise.all([loadWorkflowRules(phaseSteps), loadStepStatuses(phaseSteps)]);
      }
    } finally {
      setSavingRuleKey(null);
    }
  }

  async function handleResetRule(phase: string, stepKey: string) {
    const mapKey = mapKeyOf(phase, stepKey);
    setSavingRuleKey(mapKey);
    try {
      const p = trackingParams(phase, stepKey);
      const ok = await deleteWorkflowRule(fall.id, p.phase, p.step);
      if (ok) {
        await Promise.all([loadWorkflowRules(phaseSteps), loadStepStatuses(phaseSteps)]);
      }
    } finally {
      setSavingRuleKey(null);
    }
  }

  // Eingaben (klassische Notizen + Block-Antworten inkl. Mediator/KI) eines
  // Schritts aus den bereits geladenen notes/all-Gruppen heraussuchen.
  function answersForStep(phase: string, step: PhaseStepDef) {
    const noteGroupPhase = phase === "einleitung" ? step.key : phase;
    const notes = allPhaseNotes
      .filter((g) => g.phase === noteGroupPhase)
      .flatMap((g) => g.notes)
      .filter((n) => (phase === "einleitung" ? true : n.step === step.key))
      .filter((n) => n.content && n.content.trim());
    const blocks = allPhaseNotes
      .filter((g) => g.phase === phase || g.phase === step.key)
      .flatMap((g) => g.block_responses ?? [])
      .filter((b) => b.step_key === step.key);
    return { notes, blocks };
  }

  // ── Handlers ───────────────────────────────────────────────────────────────
  async function handleAdvance() {
    setAdvancing(true);
    setAdvanceError("");
    try {
      await advanceMediationPhase(fall.id);
      onPhaseAdvanced?.();
    } catch (e: unknown) {
      setAdvanceError(e instanceof Error ? e.message : "Fehler");
    } finally {
      setAdvancing(false);
    }
  }

  async function handleRevokeInvite(participantId: string) {
    // participantId hat Format "invite-{id}"
    const match = participantId.match(/^invite-(\d+)$/);
    if (!match) return;
    const inviteId = match[1];
    try {
      const res = await fetch(`/api/mediations/${fall.id}/invites/${inviteId}`, { method: "DELETE" });
      if (res.ok) fetchParticipants(fall.id).then(setParticipants);
    } catch { /* ignore */ }
  }

  async function handleInvite() {
    if (!inviteEmail.trim()) return;
    setInviting(true);
    setInviteError("");
    setInviteUrl("");
    try {
      const result = await inviteParty(fall.id, inviteEmail.trim(), inviteRole);
      setInviteUrl(result.invite_url);
      setInviteEmail("");
      fetchParticipants(fall.id).then(setParticipants);
    } catch (e: unknown) {
      setInviteError(e instanceof Error ? e.message : "Fehler");
    } finally {
      setInviting(false);
    }
  }

  async function handleGenerateContract() {
    setContractGenerating(true);
    setContractError("");
    try {
      const res = await fetch(`/api/mediations/${fall.id}/contract/generate`, {
        method: "POST",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setContractError(body?.detail ?? body?.error ?? "Generierung fehlgeschlagen");
        return;
      }
      await loadContract();
    } catch {
      setContractError("Server nicht erreichbar.");
    } finally {
      setContractGenerating(false);
    }
  }

  async function handleReleaseContract() {
    setContractReleasing(true);
    setContractError("");
    try {
      const res = await fetch(`/api/mediations/${fall.id}/contract/release`, {
        method: "POST",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setContractError(body?.detail ?? "Freigabe fehlgeschlagen");
        return;
      }
      setIsReleased(true);
    } catch {
      setContractError("Server nicht erreichbar.");
    } finally {
      setContractReleasing(false);
    }
  }

  async function loadAppointments() {
    try {
      const res = await fetch(`/api/mediations/${fall.id}/appointment/slots`);
      if (!res.ok) return;
      const data = await res.json();
      setAppointmentSlots(data.slots ?? []);
      setConfirmedSlot(data.confirmed ?? null);
      setReservedSlot(data.reserved ?? null);
    } catch { /* ignore */ }
  }

  async function handleConfirmSlot(slotId: number) {
    setAppointmentConfirming(slotId);
    try {
      await fetch(`/api/mediations/${fall.id}/appointment/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slot_id: slotId }),
      });
      await loadAppointments();
    } catch { /* ignore */ } finally {
      setAppointmentConfirming(null);
    }
  }

  async function handleProposeAppointments() {
    setAppointmentLoading(true);
    try {
      const res = await fetch(`/api/mediations/${fall.id}/appointment/propose`, { method: "POST" });
      if (res.ok) await loadAppointments();
    } catch { /* ignore */ } finally {
      setAppointmentLoading(false);
    }
  }

  async function handleVoteSlot(slotId: number, accepted: boolean) {
    setAppointmentVoting(slotId);
    try {
      await fetch(`/api/mediations/${fall.id}/appointment/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slot_id: slotId, accepted }),
      });
      await loadAppointments();
    } catch { /* ignore */ } finally {
      setAppointmentVoting(null);
    }
  }

  function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString("de-DE", {
      weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
    }) + " Uhr";
  }

  const progress =
    fall.progress ?? (phaseIdx >= 0 ? Math.round(((phaseIdx + 1) / 6) * 100) : 0);
  const acceptedCount = accepted.length;

  // ── Tabs ───────────────────────────────────────────────────────────────────
  const tabs = [
    { id: "overview" as const, label: "Übersicht" },
    { id: "notes" as const, label: "Alle Eingaben" },
    { id: "steps" as const, label: "Schritte & Ergebnisse" },
    { id: "termin" as const, label: "Termin" },
    { id: "contract" as const, label: "Vertrag" },
    { id: "feedback" as const, label: "Feedback" },
    { id: "analyse" as const, label: "✦ Analyse" },
    { id: "chat" as const, label: "Chat" },
  ];

  return (
    <div className="space-y-5">
      {/* ── Hero-Header ──────────────────────────────────────────────────── */}
      <WCard
        className="overflow-hidden"
        style={{ background: "var(--color-neutral-800)", color: "white", border: "none" }}
      >
        <div className="p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-400 mb-2">
                Mediationsfall #{fall.id}
              </p>
              <h2 className="text-xl font-semibold leading-snug">{fall.title}</h2>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-neutral-300">
                <TypeBadge type={fall.mediation_type} />
                {/* Varianten-Zuordnung: bestimmt, welche Zusatz-Schritte aus dem
                    Workflow Designer für diesen Fall gelten (Basis + Variante). */}
                {/* Immer sichtbar: mind. "Basis-Workflow" – so ist die
                    Workflow-Zuordnung direkt im Fall auffindbar. */}
                {(
                  <select
                    value={variantKey ?? ""}
                    onChange={(e) => handleVariantChange(e.target.value)}
                    disabled={variantSaving}
                    title="Mediations-Variante dieses Falls"
                    className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white focus:outline-none focus:ring-1 focus:ring-accent-400 disabled:opacity-50 [&>option]:text-neutral-900"
                  >
                    <option value="">Basis-Workflow</option>
                    {variants.map((v) => (
                      <option key={v.key} value={v.key}>
                        Variante: {v.label}
                      </option>
                    ))}
                  </select>
                )}
                {variantError && (
                  <span className="text-xs text-red-400">{variantError}</span>
                )}
                {/* Mediator-Zuordnung: immer genau ein Mediator, aus Nutzern mit Rolle "mediator". */}
                <select
                  value={mediatorUserId ?? ""}
                  onChange={(e) => e.target.value && handleMediatorChange(Number(e.target.value))}
                  disabled={mediatorSaving || mediators.length === 0}
                  title="Mediator dieses Falls"
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white focus:outline-none focus:ring-1 focus:ring-accent-400 disabled:opacity-50 [&>option]:text-neutral-900"
                >
                  <option value="">
                    {mediators.length === 0 ? "Kein Mediator verfügbar" : "Mediator wählen…"}
                  </option>
                  {mediators.map((m) => (
                    <option key={m.user_id} value={m.user_id}>
                      Mediator: {m.name}
                    </option>
                  ))}
                </select>
                {mediatorError && (
                  <span className="text-xs text-red-400">{mediatorError}</span>
                )}
                {fall.description && (
                  <span className="text-sm text-neutral-300">· {fall.description}</span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-start gap-2 lg:items-end shrink-0">
              <StatusBadge status={fall.status} />
              {fall.status !== "completed" && fall.status !== "draft" && (
                <button
                  onClick={handleAdvance}
                  disabled={advancing}
                  className="rounded-full bg-accent-500 px-4 py-2 text-xs font-semibold text-white hover:bg-accent-600 disabled:opacity-50 transition whitespace-nowrap"
                >
                  {advancing ? "Wird vorgerückt…" : "→ Nächste Phase"}
                </button>
              )}
              {advanceError && (
                <p className="text-xs text-red-400">{advanceError}</p>
              )}
            </div>
          </div>
        </div>
      </WCard>

      {/* ── KPIs ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <KPI label="Parteien" value={acceptedCount} sub={`${participants.length} eingeladen`} />
        <KPI
          label="Phase"
          value={phaseIdx >= 0 ? phaseIdx + 1 : "–"}
          sub={phaseIdx >= 0 ? PHASES[phaseIdx].label : "Kein Start"}
        />
        <KPI label="Fortschritt" value={`${progress}%`} sub="Mediationsverlauf" />
        <KPI
          label="Konfliktart"
          value={TYPE_LABEL[fall.mediation_type] ?? fall.mediation_type}
          sub={fall.status}
        />
      </div>

      {/* ── Phasen-Stepper ───────────────────────────────────────────────── */}
      <WCard className="p-5">
        <SectionHeader label="Verlauf" title="Mediationsphasen" />
        <div className="flex items-center gap-0">
          {PHASES.map((phase, idx) => {
            const isDone = phaseIdx > idx;
            const isCurrent = phaseIdx === idx;
            return (
              <React.Fragment key={phase.id}>
                <div className="flex flex-col items-center gap-1.5 flex-1">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold border-2 transition",
                      isDone
                        ? "border-accent-500 bg-accent-500 text-white"
                        : isCurrent
                          ? "border-accent-500 bg-white text-accent-600 ring-4 ring-accent-100"
                          : "border-neutral-200 bg-white text-neutral-400",
                    )}
                  >
                    {isDone ? "✓" : phase.short}
                  </div>
                  <span
                    className={cn(
                      "text-[10px] text-center leading-tight hidden sm:block",
                      isDone
                        ? "font-semibold text-accent-600"
                        : isCurrent
                          ? "font-bold text-neutral-800"
                          : "text-neutral-400",
                    )}
                  >
                    {phase.label}
                  </span>
                </div>
                {idx < PHASES.length - 1 && (
                  <div
                    className={cn(
                      "h-0.5 flex-1 transition-colors mb-5",
                      idx < phaseIdx ? "bg-accent-500" : "bg-neutral-200",
                    )}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </WCard>

      {/* ── Tabs ──────────────────────────────────────────────────────────── */}
      <WCard className="overflow-hidden">
        {/* Tab-Header */}
        <div className="flex border-b border-neutral-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 py-3 text-xs font-semibold transition border-b-2",
                activeTab === tab.id
                  ? "border-accent-500 text-accent-700 bg-accent-50/40"
                  : "border-transparent text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {/* ── Tab: Übersicht ── */}
          {activeTab === "overview" && (
            <div className="space-y-5">
              {/* Teilnehmer */}
              <div>
                <SectionHeader
                  label="Beteiligte"
                  title="Parteien & Mediator"
                  action={
                    <button
                      onClick={() => {
                        setShowInvite(!showInvite);
                        setInviteError("");
                        setInviteUrl("");
                      }}
                      className="rounded-full border border-accent-200 bg-accent-50 px-3 py-1.5 text-xs font-semibold text-accent-700 hover:bg-accent-100 transition"
                    >
                      + Einladen
                    </button>
                  }
                />

                {showInvite && (
                  <div className="mb-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4 space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-neutral-600 block mb-1">
                        E-Mail-Adresse
                      </label>
                      <input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="partei@beispiel.de"
                        className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100 transition"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-neutral-600 block mb-1">Rolle</label>
                      <select
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value)}
                        className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent-400 transition"
                      >
                        <option value="other_party">Gegenpartei</option>
                        <option value="mediator">Mediator</option>
                        <option value="observer">Beobachter</option>
                      </select>
                    </div>
                    {inviteError && <p className="text-xs text-red-600">{inviteError}</p>}
                    {inviteUrl && (
                      <div className="rounded-xl border border-accent-200 bg-accent-50 p-3">
                        <p className="text-xs font-semibold text-accent-700 mb-1">Einladungslink:</p>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 text-xs text-accent-800 break-all">{inviteUrl}</code>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(inviteUrl);
                              setCopied(true);
                              setTimeout(() => setCopied(false), 2000);
                            }}
                            className="shrink-0 rounded-lg bg-accent-500 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-accent-600 transition"
                          >
                            {copied ? "Kopiert!" : "Kopieren"}
                          </button>
                        </div>
                      </div>
                    )}
                    <button
                      onClick={handleInvite}
                      disabled={inviting || !inviteEmail.trim()}
                      className="w-full rounded-full bg-accent-500 py-2.5 text-sm font-semibold text-white hover:bg-accent-600 disabled:opacity-50 transition"
                    >
                      {inviting ? "Einladung wird gesendet…" : "Einladung senden"}
                    </button>
                  </div>
                )}

                {loadingParticipants ? (
                  <p className="text-sm italic text-neutral-400">Wird geladen…</p>
                ) : participants.length === 0 ? (
                  <EmptyState icon="👥" text="Noch keine Parteien eingeladen." />
                ) : (
                  <div className="space-y-2">
                    {participants.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50/60 px-3 py-2.5"
                      >
                        <div className="flex items-center gap-2.5">
                          <InviteStatusDot status={p.invitationStatus} />
                          <div>
                            <div className="text-sm font-medium text-neutral-800">{p.name}</div>
                            <div className="text-xs text-neutral-400">{p.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <RoleBadge role={p.role} />
                          {p.invitationStatus === "pending" && (
                            <button
                              onClick={() => handleRevokeInvite(p.id)}
                              title="Einladung zurückziehen"
                              className="flex h-5 w-5 items-center justify-center rounded-full text-neutral-400 hover:bg-red-100 hover:text-red-600 transition"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Tab: Alle Notizen ── */}
          {activeTab === "notes" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Alle Eingaben aller Phasen</p>
                <button onClick={loadAllNotes} className="text-xs text-accent-600 hover:text-accent-800 font-medium">↻ Aktualisieren</button>
              </div>
              {loadingNotes ? (
                <p className="text-sm italic text-neutral-400">Wird geladen…</p>
              ) : allPhaseNotes.length === 0 ? (
                <EmptyState icon="📝" text="Noch keine Eingaben in diesem Fall." />
              ) : (
                <div className="space-y-6">
                  {allPhaseNotes.map((group) => {
                    const phaseLabel =
                      group.phase_label ??
                      PHASES.find((p) => p.id === group.phase)?.label ??
                      group.phase;
                    const phaseNum = PHASES.findIndex((p) => p.id === group.phase) + 1;
                    return (
                      <div key={group.phase}>
                        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent-600 mb-2 flex items-center gap-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-100 text-accent-700 text-[9px] font-bold">{phaseNum > 0 ? phaseNum : "·"}</span>
                          {phaseLabel}
                        </div>
                        <div className="space-y-2 pl-7">
                          {group.notes.map((note, i) => {
                            let items: string[] = [];
                            try {
                              const parsed = JSON.parse(note.content);
                              if (Array.isArray(parsed)) items = parsed.filter(Boolean);
                            } catch { /* raw */ }
                            return (
                              <div key={i} className={items.length > 0 || note.submitted ? "rounded-xl border border-accent-100 bg-accent-50/60 p-3 text-sm" : "rounded-xl border border-neutral-100 bg-neutral-50/60 p-3 text-sm"}>
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-neutral-800 text-xs">{note.participant_name}</span>
                                    {note.step && <span className="text-[10px] text-neutral-400 bg-neutral-100 rounded px-1 py-0.5">{note.step}</span>}
                                  </div>
                                  {note.submitted && <span className="text-[10px] font-semibold text-accent-600">✓ Eingereicht</span>}
                                </div>
                                {items.length > 0 ? (
                                  <ul className="space-y-0.5 mt-1">{items.map((item, j) => (
                                    <li key={j} className="flex items-start gap-1.5 text-xs text-neutral-700">
                                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-400" />{item}
                                    </li>
                                  ))}</ul>
                                ) : (
                                  <p className="text-xs text-neutral-700 whitespace-pre-wrap mt-1">{note.content}</p>
                                )}
                              </div>
                            );
                          })}
                          {/* Block-Antworten (dynamische Schritte) inkl. Mediator- und KI-Beiträge */}
                          {(group.block_responses ?? []).map((br, i) => (
                            <div
                              key={`br-${i}`}
                              className={
                                br.author_source === "ai"
                                  ? "rounded-xl border border-violet-100 bg-violet-50/60 p-3 text-sm"
                                  : "rounded-xl border border-accent-100 bg-accent-50/60 p-3 text-sm"
                              }
                            >
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  <span className={`text-[10px] font-bold rounded px-1.5 py-0.5 ${AUTHOR_BADGE[br.author_source] ?? AUTHOR_BADGE.user}`}>
                                    {br.author_source === "ai" ? "🤖 KI" : br.author_name}
                                  </span>
                                  <span className="text-[10px] text-neutral-400 bg-neutral-100 rounded px-1 py-0.5">
                                    {br.step_title}
                                    {br.block_type ? ` · ${br.block_type}` : ""}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {br.updated_at && (
                                    <span className="text-[10px] text-neutral-400">
                                      {new Date(br.updated_at).toLocaleDateString("de-DE")}
                                    </span>
                                  )}
                                  {br.submitted && <span className="text-[10px] font-semibold text-accent-600">✓ Eingereicht</span>}
                                </div>
                              </div>
                              <p className="text-xs text-neutral-700 whitespace-pre-wrap mt-1">{formatBlockValue(br.value)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── Tab: Schrittstatus ── */}
          {activeTab === "steps" && (
            <div>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Schritte & Ergebnisse · alle Phasen</p>
                <button onClick={reloadStepsTab} className="text-xs text-accent-600 hover:text-accent-800 font-medium">↻ Aktualisieren</button>
              </div>

              {/* Phasen-Auswahl: Schrittlisten kommen dynamisch aus dem
                  WorkflowManager (phase-steps, inkl. Variante + Custom-Schritte). */}
              <SegmentedControl
                className="mb-5"
                segments={PHASES.map((p) => ({
                  key: p.id,
                  label: p.label,
                  count: (phaseSteps[p.id] ?? []).length,
                }))}
                activeKey={stepsPhase}
                onChange={(key) => setStepsPhase(key ?? "einleitung")}
              />

              {/* ── Ergebnis-Freigaben: Überblick über alle Phasen ── */}
              {resultSteps.length > 0 && (
                <div className="mb-5 rounded-xl border border-neutral-200 bg-neutral-50/60 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500">◆ Ergebnis-Freigaben</p>
                  <p className="mt-1 mb-2 text-xs text-neutral-500">
                    Diese Schritte zeigen den Teilnehmern Ergebnisse – aber erst nach deiner
                    Freigabe. Schritt öffnen, Text kuratieren, freigeben.
                  </p>
                  <div className="divide-y divide-neutral-200/70">
                    {resultSteps.map((rs) => {
                      const rsKey = mapKeyOf(rs.phase, rs.key);
                      const draft = contentDrafts[rsKey] ?? emptyDraft;
                      const phaseLabel = PHASES.find((p) => p.id === rs.phase)?.label ?? rs.phase;
                      return (
                        <button
                          key={rsKey}
                          type="button"
                          onClick={() => {
                            setStepsPhase(rs.phase);
                            setOpenStepKey(rsKey);
                          }}
                          className="flex w-full items-center justify-between gap-3 px-2 py-2 text-left transition hover:bg-white"
                        >
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-medium text-neutral-800">{rs.title}</span>
                            <span className="text-[10px] text-neutral-400">Phase: {phaseLabel}</span>
                          </span>
                          <span className="flex shrink-0 items-center gap-2">
                            <StatusDot
                              tone={draft.released ? "teal" : "amber"}
                              label={draft.released ? "Freigegeben" : "Entwurf – nicht sichtbar"}
                            />
                            <span className="text-neutral-300">›</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── Schritt-Zeilen der gewählten Phase ── */}
              {loadingSteps ? (
                <div className="space-y-2">
                  {[0, 1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                  ))}
                </div>
              ) : (phaseSteps[stepsPhase] ?? []).length === 0 ? (
                <EmptyState icon="🧭" text="Keine Schritte für diese Phase definiert – im Workflow Manager pflegbar." />
              ) : (
                <div className="divide-y divide-neutral-100 overflow-hidden rounded-xl border border-neutral-200">
                  {(phaseSteps[stepsPhase] ?? []).map((step) => {
                    const mapKey = mapKeyOf(stepsPhase, step.key);
                    const result = stepStatuses[mapKey];
                    const entries = result?.participants ?? [];
                    const allDone = result?.allSubmitted ?? false;
                    const skipped = ruleSkips[mapKey] ?? false;
                    const trk = trackingParams(stepsPhase, step.key);
                    const overridden =
                      workflowData?.rules.some((r) => r.phase === trk.phase && r.step === trk.step) ?? false;
                    const isResult = step.content_types.includes("ergebnis");
                    const draft = contentDrafts[mapKey] ?? emptyDraft;
                    const { notes, blocks } = answersForStep(stepsPhase, step);
                    const answerCount = notes.length + blocks.length;
                    return (
                      <button
                        key={step.key}
                        type="button"
                        onClick={() => setOpenStepKey(mapKey)}
                        className="flex w-full items-center gap-4 bg-white px-4 py-3.5 text-left transition hover:bg-neutral-50"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="truncate text-sm font-semibold text-neutral-800">{step.title}</span>
                            {step.individual && (
                              <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-semibold text-teal-700">✦ Individuell</span>
                            )}
                            {isResult && (
                              <StatusDot
                                tone={draft.released ? "teal" : "amber"}
                                label={draft.released ? "Freigegeben" : "Freigabe offen"}
                              />
                            )}
                            {overridden && !skipped && (
                              <span className="rounded-full bg-accent-100 px-2 py-0.5 text-[10px] font-semibold text-accent-700">Angepasst</span>
                            )}
                          </div>
                          <p className="mt-0.5 text-[11px] text-neutral-400">
                            {answerCount > 0
                              ? `${answerCount} Eingabe${answerCount === 1 ? "" : "n"}`
                              : "Noch keine Eingaben"}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-3">
                          {skipped ? (
                            <StatusDot tone="neutral" label="Übersprungen" />
                          ) : allDone ? (
                            <StatusDot tone="teal" label="Fertig" />
                          ) : entries.length === 0 ? (
                            <StatusDot tone="neutral" label="Offen" />
                          ) : (
                            <StatusDot
                              tone="amber"
                              label={`${entries.filter((e) => e.submitted).length}/${entries.length} eingereicht`}
                            />
                          )}
                          <span className="text-neutral-300">›</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* ── SlideOver: Eingaben, Inhalt, Freigabe & Regeln eines Schritts ── */}
              {(() => {
                if (!openStepKey) return null;
                const sepIdx = openStepKey.indexOf(":");
                const oPhase = openStepKey.slice(0, sepIdx);
                const oKey = openStepKey.slice(sepIdx + 1);
                const step = (phaseSteps[oPhase] ?? []).find((s) => s.key === oKey);
                if (!step) return null;
                const mapKey = openStepKey;
                const has = (id: string) => step.content_types.includes(id);
                const result = stepStatuses[mapKey];
                const entries = result?.participants ?? [];
                const allDone = result?.allSubmitted ?? false;
                const skipped = ruleSkips[mapKey] ?? false;
                const requiredRoles = ruleSelections[mapKey] ?? new Set<string>();
                const trk = trackingParams(oPhase, oKey);
                const overridden =
                  workflowData?.rules.some((r) => r.phase === trk.phase && r.step === trk.step) ?? false;
                const draft = contentDrafts[mapKey] ?? emptyDraft;
                const isSaving = savingContentKey === mapKey;
                const isSaved = savedContentKey === mapKey;
                const isSummarizing = summarizingKey === mapKey;
                const phaseLabel = PHASES.find((p) => p.id === oPhase)?.label ?? oPhase;
                const srcLabel = step.result_source_phase
                  ? PHASES.find((p) => p.id === step.result_source_phase)?.label ?? step.result_source_phase
                  : null;
                const { notes, blocks } = answersForStep(oPhase, step);
                const feedbackForStep = has("feedback")
                  ? feedbackEntries.filter(
                      (e) => e.occasion === (step.feedback_occasion ?? "after_videocall"),
                    )
                  : [];
                const OCCASION_LABEL: Record<string, string> = {
                  after_videocall: "Nach dem Gespräch",
                  before_contract: "Vor dem Vertrag",
                };
                return (
                  <SlideOver
                    open
                    onClose={() => setOpenStepKey(null)}
                    title={
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">
                          {phaseLabel}
                        </p>
                        <h3 className="mt-0.5 text-base font-semibold text-neutral-900">{step.title}</h3>
                        <div className="mt-1.5">
                          {skipped ? (
                            <StatusDot tone="neutral" label="Übersprungen" />
                          ) : allDone ? (
                            <StatusDot tone="teal" label="Alle fertig" />
                          ) : (
                            <StatusDot
                              tone="amber"
                              label={`${entries.filter((e) => e.submitted).length}/${entries.length} eingereicht`}
                            />
                          )}
                        </div>
                      </div>
                    }
                  >
                    <div className="space-y-6">
                      {/* ── Teilnehmer-Status ── */}
                      {entries.length > 0 && (
                        <section>
                          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">Teilnehmer</p>
                          <div className="flex flex-wrap gap-2">
                            {entries.map((e) => {
                              const isRequired = requiredRoles.has(e.role);
                              return (
                                <span
                                  key={e.participant_id}
                                  className={cn(
                                    "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs border",
                                    e.submitted
                                      ? "bg-accent-50 border-accent-200 text-accent-700"
                                      : "bg-neutral-50 border-neutral-200 text-neutral-500",
                                    !isRequired && "opacity-50",
                                  )}
                                  title={isRequired ? "Erforderlich" : "Nicht erforderlich für diesen Schritt"}
                                >
                                  {e.submitted ? "✓" : "○"} {e.name}
                                  {!isRequired && " (optional)"}
                                </span>
                              );
                            })}
                          </div>
                        </section>
                      )}

                      {/* ── Inhalt des Schrittes ── */}
                      {step.individual ? (
                        <section className="rounded-xl border border-teal-200 bg-teal-50/50 p-3 space-y-2">
                          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal-700">
                            Individueller Inhalt (nur dieser Fall)
                          </p>
                          <textarea
                            value={draft.body_text}
                            onChange={(e) => updateDraft(mapKey, { body_text: e.target.value })}
                            rows={3}
                            placeholder="Text für diesen Fall …"
                            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100 transition"
                          />
                          {(has("video") || !has("videokonferenz")) && (
                            <input
                              value={draft.video_url}
                              onChange={(e) => updateDraft(mapKey, { video_url: e.target.value })}
                              placeholder="Video-URL (eigenes Video) …"
                              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100 transition"
                            />
                          )}
                          {has("videokonferenz") && (
                            <>
                              <input
                                value={draft.meeting_url}
                                onChange={(e) => updateDraft(mapKey, { meeting_url: e.target.value })}
                                placeholder="Meeting-/Call-Link (z.B. Google Meet) …"
                                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100 transition"
                              />
                              <MeetLinkButton
                                summary={fall.title}
                                onLink={(url) => updateDraft(mapKey, { meeting_url: url })}
                              />
                            </>
                          )}
                          {has("frage") && (
                            <textarea
                              value={draft.question}
                              onChange={(e) => updateDraft(mapKey, { question: e.target.value })}
                              rows={2}
                              placeholder="Individuelle Frage für diesen Fall …"
                              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100 transition"
                            />
                          )}
                          {has("feedback") && (
                            <select
                              value={draft.feedback_occasion}
                              onChange={(e) =>
                                updateDraft(mapKey, {
                                  feedback_occasion: e.target.value as
                                    | "after_videocall"
                                    | "before_contract"
                                    | "",
                                })
                              }
                              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-accent-400 transition"
                            >
                              <option value="">— kein Fragebogen —</option>
                              <option value="after_videocall">Nach dem Gespräch</option>
                              <option value="before_contract">Vor dem Vertrag</option>
                            </select>
                          )}
                          <div className="flex items-center gap-3 pt-1">
                            <button
                              onClick={() => handleSaveContent(oPhase, oKey)}
                              disabled={isSaving}
                              className="rounded-full bg-accent-500 px-4 py-2 text-xs font-semibold text-white hover:bg-accent-600 disabled:opacity-50 transition"
                            >
                              {isSaving ? "Speichert…" : "Inhalt speichern"}
                            </button>
                            {isSaved && (
                              <span className="text-xs font-medium text-accent-600">✓ Gespeichert</span>
                            )}
                          </div>
                        </section>
                      ) : (
                        (step.description ||
                          step.video_url ||
                          step.meeting_url ||
                          step.question ||
                          step.contract_template ||
                          has("feedback")) && (
                          <section className="rounded-xl border border-neutral-100 bg-neutral-50/70 p-3 space-y-1.5 text-xs text-neutral-600">
                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">Inhalt</p>
                            {step.description && (
                              <p className="whitespace-pre-wrap">{step.description}</p>
                            )}
                            {step.question && (
                              <p>
                                <span className="font-semibold">Frage:</span> {step.question}
                              </p>
                            )}
                            {step.video_url && (
                              <p>
                                <span className="font-semibold">Video:</span>{" "}
                                <a href={step.video_url} target="_blank" rel="noreferrer" className="text-accent-600 underline break-all">
                                  {step.video_url}
                                </a>
                              </p>
                            )}
                            {step.meeting_url && (
                              <p>
                                <span className="font-semibold">Meeting:</span>{" "}
                                <a href={step.meeting_url} target="_blank" rel="noreferrer" className="text-accent-600 underline break-all">
                                  {step.meeting_url}
                                </a>
                              </p>
                            )}
                            {step.contract_template && (
                              <p className="whitespace-pre-wrap">
                                <span className="font-semibold">Vorlage:</span> {step.contract_template}
                              </p>
                            )}
                            {has("feedback") && (
                              <p>
                                <span className="font-semibold">Feedback-Anlass:</span>{" "}
                                {OCCASION_LABEL[step.feedback_occasion ?? "after_videocall"]}
                              </p>
                            )}
                          </section>
                        )
                      )}

                      {/* ── Ergebnis-Freigabe (nur Ergebnis-Schritte) ── */}
                      {has("ergebnis") && (
                        <section className="rounded-xl border border-cyan-200 bg-cyan-50/40 p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-700">◆ Ergebnis-Freigabe</p>
                            <StatusDot
                              tone={draft.released ? "teal" : "amber"}
                              label={draft.released ? "Freigegeben" : "Entwurf – nicht sichtbar"}
                            />
                          </div>
                          {srcLabel && (
                            <p className="text-[10px] text-neutral-400">Quelle: {srcLabel}</p>
                          )}
                          <button
                            onClick={() => handleSummarize(mapKey, step.result_source_phase)}
                            disabled={isSummarizing}
                            className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 hover:bg-violet-100 disabled:opacity-50 transition"
                          >
                            {isSummarizing ? "KI fasst zusammen…" : "✦ KI-Zusammenfassung erzeugen"}
                          </button>
                          <textarea
                            value={draft.body_text}
                            onChange={(e) => updateDraft(mapKey, { body_text: e.target.value })}
                            rows={5}
                            placeholder="Freigegebener Ergebnistext für alle Teilnehmer …"
                            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100 transition"
                          />
                          <label className="flex items-center gap-2 text-xs font-medium text-neutral-700">
                            <input
                              type="checkbox"
                              checked={draft.released}
                              onChange={(e) => updateDraft(mapKey, { released: e.target.checked })}
                              className="h-3.5 w-3.5 rounded border-neutral-300"
                            />
                            Für alle Teilnehmer freigeben
                          </label>
                          <div className="flex items-center gap-3 pt-1">
                            <button
                              onClick={() => handleSaveContent(oPhase, oKey)}
                              disabled={isSaving}
                              className="rounded-full bg-accent-500 px-4 py-2 text-xs font-semibold text-white hover:bg-accent-600 disabled:opacity-50 transition"
                            >
                              {isSaving ? "Speichert…" : "Speichern & Freigabe übernehmen"}
                            </button>
                            {isSaved && <span className="text-xs font-medium text-accent-600">✓ Gespeichert</span>}
                          </div>
                        </section>
                      )}

                      {/* ── Eingaben der Teilnehmer (Notizen + Block-Antworten inkl. KI) ── */}
                      <section>
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">Eingaben</p>
                        {notes.length === 0 && blocks.length === 0 && feedbackForStep.length === 0 ? (
                          <p className="text-xs italic text-neutral-400">Noch keine Eingaben der Teilnehmer zu diesem Schritt.</p>
                        ) : (
                          <div className="space-y-2">
                            {notes.map((n, i) => {
                              let items: string[] = [];
                              try {
                                const parsed = JSON.parse(n.content);
                                if (Array.isArray(parsed)) items = parsed.filter(Boolean);
                              } catch {
                                /* raw text */
                              }
                              return (
                                <div key={`note-${i}`} className="rounded-lg border border-neutral-100 bg-white p-2.5">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-semibold text-neutral-800">{n.participant_name}</span>
                                    {n.submitted && (
                                      <span className="text-[10px] font-semibold text-accent-600">✓ Eingereicht</span>
                                    )}
                                  </div>
                                  {items.length > 0 ? (
                                    <ul className="space-y-0.5">
                                      {items.map((it, j) => (
                                        <li key={j} className="flex items-start gap-1.5 text-xs text-neutral-700">
                                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-400" />
                                          {it}
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <p className="text-xs text-neutral-700 whitespace-pre-wrap">{n.content}</p>
                                  )}
                                </div>
                              );
                            })}
                            {blocks.map((br, i) => (
                              <div
                                key={`br-${i}`}
                                className={
                                  br.author_source === "ai"
                                    ? "rounded-lg border border-violet-100 bg-violet-50/60 p-2.5"
                                    : "rounded-lg border border-neutral-100 bg-white p-2.5"
                                }
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-bold rounded px-1.5 py-0.5 ${AUTHOR_BADGE[br.author_source] ?? AUTHOR_BADGE.user}`}>
                                      {br.author_source === "ai" ? "🤖 KI" : br.author_name}
                                    </span>
                                    {br.block_type && (
                                      <span className="text-[10px] text-neutral-400 bg-neutral-100 rounded px-1 py-0.5">{br.block_type}</span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {br.updated_at && (
                                      <span className="text-[10px] text-neutral-400">
                                        {new Date(br.updated_at).toLocaleDateString("de-DE")}
                                      </span>
                                    )}
                                    {br.submitted && <span className="text-[10px] font-semibold text-accent-600">✓ Eingereicht</span>}
                                  </div>
                                </div>
                                <p className="text-xs text-neutral-700 whitespace-pre-wrap">{formatBlockValue(br.value)}</p>
                              </div>
                            ))}
                            {feedbackForStep.map((fb) => (
                              <div key={`fb-${fb.id}`} className="rounded-lg border border-violet-100 bg-violet-50/50 p-2.5">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-semibold text-neutral-800">{fb.participant_name}</span>
                                  <span className="text-[10px] text-violet-500">Feedback</span>
                                </div>
                                <div className="space-y-0.5">
                                  {Object.entries(fb.answers).map(([k, v]) =>
                                    v || v === 0 ? (
                                      <div key={k} className="flex items-start gap-1.5 text-xs text-neutral-600">
                                        <span className="text-neutral-400">·</span>
                                        <span className="text-neutral-500">{k}:</span>
                                        <span className="text-neutral-800">{String(v)}</span>
                                      </div>
                                    ) : null,
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </section>

                      {/* ── Anforderungen (wer muss abschließen / überspringen) ── */}
                      <section className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">
                          Anforderungen
                        </p>
                        <p className="mb-2 text-xs font-semibold text-neutral-600">
                          Wer muss diesen Schritt abschließen, damit er als erledigt gilt?
                        </p>
                        <label className="mb-2 flex items-center gap-2 text-xs font-medium text-neutral-700">
                          <input
                            type="checkbox"
                            checked={skipped}
                            onChange={() => toggleRuleSkip(mapKey)}
                            className="h-3.5 w-3.5 rounded border-neutral-300"
                          />
                          Schritt für diesen Fall überspringen
                        </label>
                        {!skipped && (
                          <div className="mb-3 flex flex-wrap gap-2">
                            {(workflowData?.available_roles ?? []).map((role) => (
                              <label
                                key={role}
                                className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs text-neutral-700"
                              >
                                <input
                                  type="checkbox"
                                  checked={requiredRoles.has(role)}
                                  onChange={() => toggleRuleRole(mapKey, role)}
                                  className="h-3.5 w-3.5 rounded border-neutral-300"
                                />
                                {WORKFLOW_ROLE_LABEL[role] ?? role}
                              </label>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleSaveRule(oPhase, oKey)}
                            disabled={savingRuleKey === mapKey}
                            className="rounded-lg bg-accent-600 px-3 py-1.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {savingRuleKey === mapKey ? "Speichert …" : "Speichern"}
                          </button>
                          {overridden && (
                            <button
                              type="button"
                              onClick={() => handleResetRule(oPhase, oKey)}
                              disabled={savingRuleKey === mapKey}
                              className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-600 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              Zurücksetzen
                            </button>
                          )}
                        </div>
                      </section>
                    </div>
                  </SlideOver>
                );
              })()}

            </div>
          )}

          {/* ── Tab: Termin ── */}
          {activeTab === "termin" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Terminvereinbarung</p>
                <div className="flex items-center gap-2">
                  <button onClick={loadAppointments} className="text-xs text-accent-600 hover:text-accent-800 font-medium">↻</button>
                  <button
                    onClick={handleProposeAppointments}
                    disabled={appointmentLoading}
                    className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 transition disabled:opacity-50"
                  >
                    {appointmentLoading ? "Wird berechnet…" : appointmentSlots.length > 0 ? "Neue Termine vorschlagen" : "Termine vorschlagen"}
                  </button>
                </div>
              </div>

              {confirmedSlot ? (
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-accent-200 bg-accent-50 px-6 py-8 text-center">
                  <svg className="h-8 w-8 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-accent-700">Final bestätigt</p>
                    <p className="mt-1 text-base font-semibold text-neutral-900">{fmtDate(confirmedSlot.proposed_datetime)}</p>
                    <p className="mt-1 text-xs text-neutral-500">Alle Beteiligten haben zugestimmt und der Termin ist verbindlich.</p>
                  </div>
                </div>
              ) : appointmentSlots.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-neutral-200 px-6 py-10 text-center">
                  <p className="text-sm text-neutral-400">Noch keine Terminvorschläge. Klicke auf &quot;Termine vorschlagen&quot; um Vorschläge zu generieren.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reservedSlot && (
                    <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-amber-300 bg-amber-50 px-6 py-6 text-center">
                      <p className="text-xs font-bold uppercase tracking-wide text-amber-700">Reserviert · noch nicht verbindlich</p>
                      <p className="text-base font-semibold text-neutral-900">{fmtDate(reservedSlot.proposed_datetime)}</p>
                      <p className="text-xs text-neutral-500">Alle Beteiligten haben zugestimmt. Bestätige final, um den Termin verbindlich zu machen.</p>
                      <button
                        disabled={appointmentConfirming === reservedSlot.id}
                        onClick={() => handleConfirmSlot(reservedSlot.id)}
                        className="mt-1 rounded-full bg-amber-500 px-4 py-2 text-xs font-bold text-white hover:bg-amber-600 disabled:opacity-50 transition"
                      >
                        {appointmentConfirming === reservedSlot.id ? "Wird bestätigt…" : "Termin final bestätigen"}
                      </button>
                    </div>
                  )}
                  {appointmentSlots.map((slot) => {
                    const accepted = slot.votes.filter(v => v.accepted);
                    const declined = slot.votes.filter(v => !v.accepted);
                    const isReserved = slot.status === "reserved";
                    return (
                      <div key={slot.id} className={`rounded-xl border p-4 ${isReserved ? "border-amber-300 bg-amber-50" : slot.all_accepted ? "border-accent-300 bg-accent-50" : "border-neutral-200 bg-white"}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-neutral-900">{fmtDate(slot.proposed_datetime)}</p>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {accepted.map(v => (
                                <span key={v.participant_id} className="text-xs rounded-full bg-accent-100 px-2 py-0.5 text-accent-700">✓ {v.name}</span>
                              ))}
                              {declined.map(v => (
                                <span key={v.participant_id} className="text-xs rounded-full bg-red-50 px-2 py-0.5 text-red-600">✗ {v.name}</span>
                              ))}
                              {slot.votes.length === 0 && <span className="text-xs text-neutral-400">Noch keine Stimmen</span>}
                            </div>
                          </div>
                          {isReserved ? (
                            <button
                              disabled={appointmentConfirming === slot.id}
                              onClick={() => handleConfirmSlot(slot.id)}
                              className="shrink-0 rounded-full bg-amber-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-600 disabled:opacity-50 transition"
                            >
                              {appointmentConfirming === slot.id ? "…" : "Final bestätigen"}
                            </button>
                          ) : (
                          <div className="flex gap-1.5 shrink-0">
                            <button
                              disabled={appointmentVoting === slot.id}
                              onClick={() => handleVoteSlot(slot.id, true)}
                              className="rounded-full bg-accent-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-accent-600 disabled:opacity-50 transition"
                            >
                              {appointmentVoting === slot.id ? "…" : "Zustimmen"}
                            </button>
                            <button
                              disabled={appointmentVoting === slot.id}
                              onClick={() => handleVoteSlot(slot.id, false)}
                              className="rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 disabled:opacity-50 transition"
                            >
                              Ablehnen
                            </button>
                          </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── Tab: Feedback ── */}
          {activeTab === "feedback" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Kundenerlebnis-Feedback</p>
                <button onClick={loadFeedback} className="text-xs text-accent-600 hover:text-accent-800 font-medium">↻ Aktualisieren</button>
              </div>

              {loadingFeedback ? (
                <p className="text-sm italic text-neutral-400">Wird geladen…</p>
              ) : feedbackEntries.length === 0 ? (
                <EmptyState icon="💬" text="Noch kein Feedback eingegangen." />
              ) : (
                (() => {
                  const OCCASION_LABELS: Record<string, string> = {
                    after_videocall: "Nach dem Erstgespräch",
                    before_contract: "Vor dem Vertragsabschluss",
                  };
                  const QUESTION_LABELS: Record<string, string> = {
                    einigung_wahrscheinlichkeit: "Wahrscheinlichkeit außergerichtliche Einigung",
                    vertrauen_in_prozess: "Vertrauen in den Prozess",
                    konfliktintensitaet: "Eskalationsgrad des Konflikts",
                    eigene_offenheit: "Offenheit für eigene Anteile",
                    mediation_verstanden: "Mediationsprinzip verstanden?",
                    online_verstanden: "Online-Format verstanden?",
                    gefuehl: "Gefühl nach dem Gespräch",
                    groesste_sorge: "Größte Sorge",
                    hindernisse: "Was hindert noch?",
                    abschlusssicherheit: "Sicherheit bei Unterschrift",
                    fairness_eindruck: "Eindruck der Fairness",
                    bereit_phase2: "Bereit für Phase 2?",
                    gehoert_gefuehl: "Gefühl gehört zu werden",
                    weiterer_termin: "Weiterer Termin gewünscht?",
                    restzweifel: "Unausgesprochene Zweifel",
                  };
                  const EMOJI_MAP: Record<number, string> = { 1: "😔 Belastet", 2: "😕 Unsicher", 3: "😐 Neutral", 4: "🙂 Gut", 5: "😊 Sehr gut" };
                  const SCALE10_KEYS = new Set([
                    "einigung_wahrscheinlichkeit",
                    "vertrauen_in_prozess",
                    "konfliktintensitaet",
                    "abschlusssicherheit",
                  ]);

                  // Gruppieren nach Anlass
                  const grouped: Record<string, FeedbackEntry[]> = {};
                  for (const entry of feedbackEntries) {
                    if (!grouped[entry.occasion]) grouped[entry.occasion] = [];
                    grouped[entry.occasion].push(entry);
                  }

                  // Warnung wenn jemand weiteren Termin wünscht
                  const wantsNewAppointment = feedbackEntries.some(
                    (e) => e.answers.weiterer_termin === "Ja, bitte"
                  );

                  return (
                    <div className="space-y-6">
                      {wantsNewAppointment && (
                        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                          <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-xs font-semibold text-amber-800">
                            Mindestens eine Partei wünscht einen weiteren Termin vor dem Vertragsabschluss. Prüfe die Antworten und entscheide, ob ein Termin sinnvoll ist.
                          </p>
                        </div>
                      )}

                      {Object.entries(grouped).map(([occasion, entries]) => (
                        <div key={occasion}>
                          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-600 mb-3 flex items-center gap-2">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-[9px] font-bold">💬</span>
                            {OCCASION_LABELS[occasion] ?? occasion}
                          </p>
                          <div className="space-y-3 pl-7">
                            {entries.map((entry) => (
                              <div key={entry.id} className="rounded-xl border border-neutral-100 bg-neutral-50/60 p-4">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-xs font-semibold text-neutral-800">{entry.participant_name}</span>
                                  <span className="text-[10px] text-neutral-400">
                                    {new Date(entry.created_at).toLocaleDateString("de-DE")}{" "}
                                    {new Date(entry.created_at).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}
                                  </span>
                                </div>
                                <div className="space-y-2">
                                  {Object.entries(entry.answers).map(([key, value]) => {
                                    if (!value && value !== 0) return null;
                                    const label = QUESTION_LABELS[key] ?? key;
                                    let displayValue: string;
                                    if (key === "gefuehl" || key === "gehoert_gefuehl") {
                                      displayValue = EMOJI_MAP[Number(value)] ?? String(value);
                                    } else if (SCALE10_KEYS.has(key)) {
                                      displayValue = `${value}/10`;
                                    } else {
                                      displayValue = String(value);
                                    }
                                    const isAlert = key === "weiterer_termin" && value === "Ja, bitte";
                                    return (
                                      <div key={key} className={`flex items-start gap-2 text-xs ${isAlert ? "text-amber-700 font-semibold" : "text-neutral-600"}`}>
                                        <span className="shrink-0 text-neutral-400">·</span>
                                        <span className="text-neutral-500 shrink-0">{label}:</span>
                                        <span className={isAlert ? "text-amber-700" : "text-neutral-800"}>{displayValue}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()
              )}
            </div>
          )}

          {/* ── Tab: Vertrag ── */}
          {activeTab === "contract" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Mediationsvertrag</p>
                <div className="flex items-center gap-2">
                  <button onClick={loadContract} className="text-xs text-accent-600 hover:text-accent-800 font-medium">↻</button>
                  <button
                    onClick={handleGenerateContract}
                    disabled={contractGenerating}
                    className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 transition disabled:opacity-50"
                  >
                    {contractGenerating ? "KI generiert..." : contract ? "Neu generieren" : "Entwurf erstellen"}
                  </button>
                </div>
              </div>

              {contractError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3">
                  <p className="text-xs font-semibold text-red-700">{contractError}</p>
                </div>
              )}

              {!contract && !contractGenerating && (
                <EmptyState icon="📄" text="Noch kein Vertrag erstellt. Klicke auf 'Entwurf erstellen' um den Vertrag per KI zu generieren." />
              )}

              {contract && (
                <div className="space-y-4">
                  {/* Status-Banner */}
                  {isReleased ? (
                    <div className="flex items-center gap-3 rounded-xl border border-accent-200 bg-accent-50 px-4 py-3">
                      <svg className="h-4 w-4 text-accent-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      <p className="text-xs font-semibold text-accent-800">Vertrag ist für die Parteien freigegeben und kann unterzeichnet werden.</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <p className="text-xs font-semibold text-amber-800">Entwurf — noch nicht für Parteien sichtbar. Bitte prüfen und freigeben.</p>
                      </div>
                      <button
                        onClick={handleReleaseContract}
                        disabled={contractReleasing}
                        className="shrink-0 rounded-full bg-accent-500 px-4 py-2 text-xs font-bold text-white hover:bg-accent-600 transition disabled:opacity-50 whitespace-nowrap"
                      >
                        {contractReleasing ? "Wird freigegeben…" : "✓ Freigeben"}
                      </button>
                    </div>
                  )}

                  <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-neutral-600">Vertragstext</span>
                      <span className="text-[10px] text-neutral-400">Erstellt: {new Date(contract.created_at).toLocaleDateString("de-DE")}</span>
                    </div>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-700">{contract.text}</div>
                  </div>

                  {isReleased && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Unterschriften</p>
                        {allSigned && <span className="rounded-full bg-accent-100 px-3 py-1 text-xs font-bold text-accent-700">✓ Alle unterzeichnet</span>}
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {accepted.map((p) => {
                          const sig = signatures.find((s) => s.participant_id === p.id);
                          return (
                            <div key={p.id} className={sig ? "rounded-xl border border-accent-200 bg-accent-50 p-3" : "rounded-xl border border-neutral-200 bg-neutral-50 p-3"}>
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="text-sm font-semibold text-neutral-900">{p.name}</p>
                                  <p className="text-[10px] text-neutral-400">{p.email}</p>
                                </div>
                                <RoleBadge role={p.role} />
                              </div>
                              {sig ? (
                                <div className="mt-2 flex items-center gap-1.5">
                                  <svg className="h-3.5 w-3.5 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                  <span className="text-xs text-accent-700">"{sig.signed_name}"</span>
                                  <span className="text-[10px] text-neutral-400 ml-auto">{new Date(sig.signed_at).toLocaleDateString("de-DE")}</span>
                                </div>
                              ) : (
                                <p className="mt-2 text-xs text-neutral-400">Ausstehend</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {/* ── Tab: Analyse ── */}
          {activeTab === "analyse" && (
            <div className="space-y-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">KI-gestützte Fall-Analyse</p>

              {analyseError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3">
                  <p className="text-xs font-semibold text-red-700">{analyseError}</p>
                </div>
              )}

              {/* ── Zusammenfassung je Phase ── */}
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Zusammenfassung je Phase</p>
                  <p className="mt-1 text-xs text-neutral-400">
                    Die KI fasst die Eingaben der Streitparteien und des Mediators der jeweiligen Phase zusammen.
                    Jede Analyse wird automatisch gespeichert – inklusive der Daten, die an die KI gesendet wurden.
                  </p>
                </div>

                {PHASES.map((phase) => {
                  const a = phaseAnalysen[phase.id];
                  const loading = analyseLoadingKey === phase.id;
                  const promptOpen = openPromptKey === phase.id;
                  return (
                    <div key={phase.id} className="rounded-xl border border-neutral-200 bg-white p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[10px] font-bold text-violet-700">
                            {phase.short}
                          </span>
                          <p className="text-sm font-semibold text-neutral-800">{phase.label}</p>
                          {a?.saved_at && (
                            <span className="text-[10px] text-neutral-400">Gespeichert: {formatSavedAt(a.saved_at)}</span>
                          )}
                        </div>
                        <button
                          onClick={() => handleAnalysePhase(phase.id)}
                          disabled={analyseLoadingKey !== null}
                          className="shrink-0 rounded-full bg-violet-500 px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-violet-600 disabled:opacity-50 transition"
                        >
                          {loading ? "Wird analysiert…" : a?.summary ? "↻ Neu zusammenfassen" : "✦ Zusammenfassen"}
                        </button>
                      </div>

                      {loading && (
                        <p className="mt-3 text-xs text-neutral-400">Die KI fasst die Eingaben dieser Phase zusammen…</p>
                      )}

                      {!loading && a?.message && !a.summary && (
                        <p className="mt-3 text-xs text-neutral-400">{a.message}</p>
                      )}

                      {!loading && a?.summary && (
                        <p className="mt-3 whitespace-pre-line rounded-lg bg-violet-50/60 p-3 text-xs leading-relaxed text-neutral-700">
                          {a.summary}
                        </p>
                      )}

                      {!loading && a?.prompt && (
                        <div className="mt-3">
                          <button
                            onClick={() => setOpenPromptKey(promptOpen ? null : phase.id)}
                            className="text-[11px] font-semibold text-violet-600 hover:text-violet-800 transition"
                          >
                            {promptOpen ? "▾ An die KI gesendete Daten verbergen" : "▸ An die KI gesendete Daten anzeigen"}
                          </button>
                          {promptOpen && (
                            <pre className="mt-2 max-h-72 overflow-auto whitespace-pre-wrap rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-[11px] leading-relaxed text-neutral-600">
                              {a.prompt}
                            </pre>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* ── SWOT zur Fall-Finalisierung & Ziel ── */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">SWOT zur Fall-Finalisierung &amp; Ziel</p>
                    <p className="mt-1 text-xs text-neutral-400">
                      Die KI bewertet auf Basis aller Eingaben, wie realistisch eine Einigung ist, welches Ziel
                      erkennbar ist und was zur Finalisierung des Falls noch fehlt.
                    </p>
                  </div>
                  <button
                    onClick={handleAnalyseSwot}
                    disabled={analyseLoadingKey !== null}
                    className="shrink-0 rounded-full bg-violet-500 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-600 disabled:opacity-50 transition"
                  >
                    {analyseLoadingKey === "swot" ? "Wird analysiert…" : swotResult ? "↻ Neu analysieren" : "✦ SWOT erstellen"}
                  </button>
                </div>

                {analyseLoadingKey === "swot" && (
                  <div className="flex flex-col items-center gap-3 py-10 text-center">
                    <svg className="h-8 w-8 animate-spin text-violet-400" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <p className="text-sm text-neutral-400">Die KI analysiert den gesamten Fall…</p>
                  </div>
                )}

                {analyseLoadingKey !== "swot" && !swotResult && (
                  <div className="rounded-2xl border border-dashed border-violet-200 bg-violet-50/40 px-6 py-10 text-center">
                    <p className="text-2xl mb-3">✦</p>
                    <p className="text-sm font-semibold text-neutral-700 mb-1">SWOT-Analyse zur Fall-Finalisierung</p>
                    <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                      Noch keine SWOT-Analyse gespeichert. Die Analyse nutzt alle Eingaben der Parteien und des
                      Mediators über alle Phasen hinweg.
                    </p>
                  </div>
                )}

                {analyseLoadingKey !== "swot" && swotResult && (
                  <div className="space-y-4">
                    {swotResult.saved_at && (
                      <p className="text-[10px] text-neutral-400">Gespeichert: {formatSavedAt(swotResult.saved_at)}</p>
                    )}

                    {swotResult.ziel && (
                      <div className="rounded-xl border border-accent-200 bg-accent-50 p-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-accent-700 mb-2">Ziel der Mediation</p>
                        <p className="text-sm text-neutral-700 leading-relaxed">{swotResult.ziel}</p>
                      </div>
                    )}

                    {swotResult.zusammenfassung && (
                      <div className="rounded-xl border border-violet-200 bg-violet-50 p-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-violet-600 mb-2">Stand der Finalisierung</p>
                        <p className="text-sm text-neutral-700 leading-relaxed">{swotResult.zusammenfassung}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      {([
                        { key: "staerken", label: "Stärken", color: "border-accent-200 bg-accent-50", dot: "bg-accent-500", text: "text-accent-700" },
                        { key: "schwaechen", label: "Schwächen", color: "border-red-200 bg-red-50", dot: "bg-red-400", text: "text-red-700" },
                        { key: "chancen", label: "Chancen", color: "border-accent-200 bg-accent-50", dot: "bg-accent-500", text: "text-accent-700" },
                        { key: "risiken", label: "Risiken", color: "border-amber-200 bg-amber-50", dot: "bg-amber-400", text: "text-amber-700" },
                      ] as const).map(({ key, label, color, dot, text }) => (
                        <div key={key} className={`rounded-xl border p-4 ${color}`}>
                          <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${text}`}>{label}</p>
                          <ul className="space-y-1.5">
                            {(swotResult.swot?.[key] ?? []).map((item, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-neutral-700">
                                <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    {(swotResult.finalisierung?.length ?? 0) > 0 && (
                      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">Schritte zur Fall-Finalisierung</p>
                        <ul className="space-y-2">
                          {(swotResult.finalisierung ?? []).map((e, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-neutral-700">
                              <span className="mt-0.5 shrink-0 text-violet-400">→</span>
                              {e}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {swotResult.prompt && (
                      <div>
                        <button
                          onClick={() => setOpenPromptKey(openPromptKey === "swot" ? null : "swot")}
                          className="text-[11px] font-semibold text-violet-600 hover:text-violet-800 transition"
                        >
                          {openPromptKey === "swot" ? "▾ An die KI gesendete Daten verbergen" : "▸ An die KI gesendete Daten anzeigen"}
                        </button>
                        {openPromptKey === "swot" && (
                          <pre className="mt-2 max-h-72 overflow-auto whitespace-pre-wrap rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-[11px] leading-relaxed text-neutral-600">
                            {swotResult.prompt}
                          </pre>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Tab: Chat (Gruppenchat aller Parteien + Mediator) ── */}
          {activeTab === "chat" && (
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Fall-Chat</p>
              <p className="text-xs text-neutral-500">
                Freier Austausch aller Beteiligten — auch zu Themen außerhalb der vorgegebenen Schritte. Du liest und schreibst als Mediator mit.
              </p>
              <MediationChat mediationId={fall.id} variant="panel" />
            </div>
          )}

        </div>
      </WCard>
    </div>
  );
}
