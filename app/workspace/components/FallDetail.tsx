"use client";

import React, { useEffect, useState, useCallback } from "react";
import type { MediationCase, Participant, PhaseNoteGroup, FeedbackEntry } from "../types";
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
import {
  fetchParticipants,
  fetchAllNotes,
  advanceMediationPhase,
  inviteParty,
  fetchStepStatus,
} from "../api";

interface FallDetailProps {
  fall: MediationCase;
  onPhaseAdvanced?: () => void;
}

// ── Einleitung Schritte ────────────────────────────────────────────────────
const EINLEITUNG_STEPS = [
  { key: "intro", label: "Einführung" },
  { key: "videocall", label: "Erstgespräch" },
  { key: "einleitung", label: "Regeln" },
  { key: "einleitung_rollen", label: "Rollen" },
  { key: "einleitung_vertrauen", label: "Vertrauen" },
  { key: "einleitung_ziel", label: "Ziel" },
];

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
  const [activeTab, setActiveTab] = useState<"overview" | "notes" | "contract" | "steps" | "termin" | "feedback" | "analyse">("overview");

  // Analyse
  type SwotData = {
    staerken: string[];
    schwaechen: string[];
    chancen: string[];
    risiken: string[];
  };
  type TeilnehmerTipp = {
    name: string;
    rolle: string;
    tipps: string[];
  };
  type AnalyseResult = {
    swot: SwotData;
    zusammenfassung: string;
    empfehlungen: string[];
    teilnehmer_tipps: TeilnehmerTipp[];
  };
  const [analyseResult, setAnalyseResult] = useState<AnalyseResult | null>(null);
  const [analyseLoading, setAnalyseLoading] = useState(false);
  const [analyseError, setAnalyseError] = useState("");

  async function handleGenerateAnalyse() {
    setAnalyseLoading(true);
    setAnalyseError("");
    try {
      const res = await fetch(`/api/mediations/${fall.id}/analyse`, { method: "POST" });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setAnalyseError(body?.detail ?? "Analyse fehlgeschlagen");
        return;
      }
      setAnalyseResult(await res.json());
    } catch {
      setAnalyseError("Server nicht erreichbar.");
    } finally {
      setAnalyseLoading(false);
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
  type AppointmentSlot = { id: number; proposed_datetime: string; votes: { participant_id: number; name: string; accepted: boolean }[]; all_accepted: boolean };
  const [appointmentSlots, setAppointmentSlots] = useState<AppointmentSlot[]>([]);
  const [confirmedSlot, setConfirmedSlot] = useState<AppointmentSlot | null>(null);
  const [appointmentLoading, setAppointmentLoading] = useState(false);
  const [appointmentVoting, setAppointmentVoting] = useState<number | null>(null);

  // Contract
  const [contract, setContract] = useState<Contract | null>(null);
  const [signatures, setSignatures] = useState<ContractSignature[]>([]);
  const [allSigned, setAllSigned] = useState(false);
  const [contractGenerating, setContractGenerating] = useState(false);
  const [contractReleasing, setContractReleasing] = useState(false);
  const [isReleased, setIsReleased] = useState(false);
  const [contractError, setContractError] = useState("");

  // Step status für Einleitung
  const [stepStatuses, setStepStatuses] = useState<Record<string, StepStatusEntry[]>>({});
  const [loadingSteps, setLoadingSteps] = useState(false);

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

  const loadStepStatuses = useCallback(async () => {
    setLoadingSteps(true);
    const results: Record<string, StepStatusEntry[]> = {};
    await Promise.all(
      EINLEITUNG_STEPS.map(async (s) => {
        const data = await fetchStepStatus(fall.id, s.key, "");
        results[s.key] = data.participants;
      })
    );
    setStepStatuses(results);
    setLoadingSteps(false);
  }, [fall.id]);

  useEffect(() => {
    if (activeTab === "steps") loadStepStatuses();
  }, [activeTab, loadStepStatuses]);

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
    } catch { /* ignore */ }
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
    { id: "notes" as const, label: "Alle Notizen" },
    { id: "steps" as const, label: "Schrittstatus" },
    { id: "termin" as const, label: "Termin" },
    { id: "contract" as const, label: "Vertrag" },
    { id: "feedback" as const, label: "Feedback" },
    { id: "analyse" as const, label: "✦ Analyse" },
  ];

  return (
    <div className="space-y-5">
      {/* ── Hero-Header ──────────────────────────────────────────────────── */}
      <WCard
        className="overflow-hidden"
        style={{ background: "#1e293b", color: "white", border: "none" }}
      >
        <div className="p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400 mb-2">
                Mediationsfall #{fall.id}
              </p>
              <h2 className="text-xl font-semibold leading-snug">{fall.title}</h2>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-300">
                <TypeBadge type={fall.mediation_type} />
                {fall.description && (
                  <span className="text-sm text-slate-300">· {fall.description}</span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-start gap-2 lg:items-end shrink-0">
              <StatusBadge status={fall.status} />
              {fall.status !== "completed" && fall.status !== "draft" && (
                <button
                  onClick={handleAdvance}
                  disabled={advancing}
                  className="rounded-full bg-teal-500 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-600 disabled:opacity-50 transition whitespace-nowrap"
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
                        ? "border-teal-500 bg-teal-500 text-white"
                        : isCurrent
                          ? "border-teal-500 bg-white text-teal-600 ring-4 ring-teal-100"
                          : "border-slate-200 bg-white text-slate-400",
                    )}
                  >
                    {isDone ? "✓" : phase.short}
                  </div>
                  <span
                    className={cn(
                      "text-[10px] text-center leading-tight hidden sm:block",
                      isDone
                        ? "font-semibold text-teal-600"
                        : isCurrent
                          ? "font-bold text-slate-800"
                          : "text-slate-400",
                    )}
                  >
                    {phase.label}
                  </span>
                </div>
                {idx < PHASES.length - 1 && (
                  <div
                    className={cn(
                      "h-0.5 flex-1 transition-colors mb-5",
                      idx < phaseIdx ? "bg-teal-500" : "bg-slate-200",
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
        <div className="flex border-b border-slate-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 py-3 text-xs font-semibold transition border-b-2",
                activeTab === tab.id
                  ? "border-teal-500 text-teal-700 bg-teal-50/40"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50",
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
                      className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700 hover:bg-teal-100 transition"
                    >
                      + Einladen
                    </button>
                  }
                />

                {showInvite && (
                  <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">
                        E-Mail-Adresse
                      </label>
                      <input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="partei@beispiel.de"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Rolle</label>
                      <select
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-teal-400 transition"
                      >
                        <option value="other_party">Gegenpartei</option>
                        <option value="mediator">Mediator</option>
                        <option value="observer">Beobachter</option>
                      </select>
                    </div>
                    {inviteError && <p className="text-xs text-red-600">{inviteError}</p>}
                    {inviteUrl && (
                      <div className="rounded-xl border border-teal-200 bg-teal-50 p-3">
                        <p className="text-xs font-semibold text-teal-700 mb-1">Einladungslink:</p>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 text-xs text-teal-800 break-all">{inviteUrl}</code>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(inviteUrl);
                              setCopied(true);
                              setTimeout(() => setCopied(false), 2000);
                            }}
                            className="shrink-0 rounded-lg bg-teal-500 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-teal-600 transition"
                          >
                            {copied ? "Kopiert!" : "Kopieren"}
                          </button>
                        </div>
                      </div>
                    )}
                    <button
                      onClick={handleInvite}
                      disabled={inviting || !inviteEmail.trim()}
                      className="w-full rounded-full bg-teal-500 py-2.5 text-sm font-semibold text-white hover:bg-teal-600 disabled:opacity-50 transition"
                    >
                      {inviting ? "Einladung wird gesendet…" : "Einladung senden"}
                    </button>
                  </div>
                )}

                {loadingParticipants ? (
                  <p className="text-sm italic text-slate-400">Wird geladen…</p>
                ) : participants.length === 0 ? (
                  <EmptyState icon="👥" text="Noch keine Parteien eingeladen." />
                ) : (
                  <div className="space-y-2">
                    {participants.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2.5"
                      >
                        <div className="flex items-center gap-2.5">
                          <InviteStatusDot status={p.invitationStatus} />
                          <div>
                            <div className="text-sm font-medium text-slate-800">{p.name}</div>
                            <div className="text-xs text-slate-400">{p.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <RoleBadge role={p.role} />
                          {p.invitationStatus === "pending" && (
                            <button
                              onClick={() => handleRevokeInvite(p.id)}
                              title="Einladung zurückziehen"
                              className="flex h-5 w-5 items-center justify-center rounded-full text-slate-400 hover:bg-red-100 hover:text-red-600 transition"
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
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Alle Eingaben aller Phasen</p>
                <button onClick={loadAllNotes} className="text-xs text-teal-600 hover:text-teal-800 font-medium">↻ Aktualisieren</button>
              </div>
              {loadingNotes ? (
                <p className="text-sm italic text-slate-400">Wird geladen…</p>
              ) : allPhaseNotes.length === 0 ? (
                <EmptyState icon="📝" text="Noch keine Notizen in diesem Fall." />
              ) : (
                <div className="space-y-6">
                  {allPhaseNotes.map((group) => {
                    const phaseLabel = PHASES.find((p) => p.id === group.phase)?.label ?? group.phase;
                    const phaseNum = PHASES.findIndex((p) => p.id === group.phase) + 1;
                    return (
                      <div key={group.phase}>
                        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal-600 mb-2 flex items-center gap-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 text-teal-700 text-[9px] font-bold">{phaseNum}</span>
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
                              <div key={i} className={items.length > 0 || note.submitted ? "rounded-xl border border-teal-100 bg-teal-50/60 p-3 text-sm" : "rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-sm"}>
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-slate-800 text-xs">{note.participant_name}</span>
                                    {note.step && <span className="text-[10px] text-slate-400 bg-slate-100 rounded px-1 py-0.5">{note.step}</span>}
                                  </div>
                                  {note.submitted && <span className="text-[10px] font-semibold text-teal-600">✓ Eingereicht</span>}
                                </div>
                                {items.length > 0 ? (
                                  <ul className="space-y-0.5 mt-1">{items.map((item, j) => (
                                    <li key={j} className="flex items-start gap-1.5 text-xs text-slate-700">
                                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-teal-400" />{item}
                                    </li>
                                  ))}</ul>
                                ) : (
                                  <p className="text-xs text-slate-700 whitespace-pre-wrap mt-1">{note.content}</p>
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
            </div>
          )}

          {/* ── Tab: Schrittstatus ── */}
          {activeTab === "steps" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Einleitungsphase - Schritte</p>
                <button onClick={loadStepStatuses} className="text-xs text-teal-600 hover:text-teal-800 font-medium">↻ Aktualisieren</button>
              </div>
              {loadingSteps ? (
                <p className="text-sm italic text-slate-400">Wird geladen…</p>
              ) : (
                <div className="space-y-3">
                  {EINLEITUNG_STEPS.map((step) => {
                    const entries = stepStatuses[step.key] ?? [];
                    const allDone = entries.length > 0 && entries.every((e) => e.submitted);
                    return (
                      <div key={step.key} className={allDone ? "rounded-xl border border-teal-200 bg-teal-50/60 p-4" : "rounded-xl border border-slate-200 bg-white p-4"}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-slate-800">{step.label}</span>
                          {allDone ? (
                            <span className="text-[10px] font-bold text-teal-600">✓ Alle fertig</span>
                          ) : entries.length === 0 ? (
                            <span className="text-[10px] text-slate-400">Noch keine Daten</span>
                          ) : (
                            <span className="text-[10px] font-semibold text-amber-600">{entries.filter((e) => e.submitted).length}/{entries.length} eingereicht</span>
                          )}
                        </div>
                        {entries.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {entries.map((e) => (
                              <span key={e.participant_id} className={e.submitted ? "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs border bg-teal-50 border-teal-200 text-teal-700" : "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs border bg-slate-50 border-slate-200 text-slate-500"}>
                                {e.submitted ? "✓" : "○"} {e.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── Tab: Termin ── */}
          {activeTab === "termin" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Terminvereinbarung</p>
                <div className="flex items-center gap-2">
                  <button onClick={loadAppointments} className="text-xs text-teal-600 hover:text-teal-800 font-medium">↻</button>
                  <button
                    onClick={handleProposeAppointments}
                    disabled={appointmentLoading}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition disabled:opacity-50"
                  >
                    {appointmentLoading ? "Wird berechnet…" : appointmentSlots.length > 0 ? "Neue Termine vorschlagen" : "Termine vorschlagen"}
                  </button>
                </div>
              </div>

              {confirmedSlot ? (
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-8 text-center">
                  <svg className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="mt-1 text-base font-semibold text-slate-900">{fmtDate(confirmedSlot.proposed_datetime)}</p>
                    <p className="mt-1 text-xs text-slate-500">Alle Beteiligten haben zugestimmt.</p>
                  </div>
                </div>
              ) : appointmentSlots.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 px-6 py-10 text-center">
                  <p className="text-sm text-slate-400">Noch keine Terminvorschläge. Klicke auf &quot;Termine vorschlagen&quot; um Vorschläge zu generieren.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {appointmentSlots.map((slot) => {
                    const accepted = slot.votes.filter(v => v.accepted);
                    const declined = slot.votes.filter(v => !v.accepted);
                    return (
                      <div key={slot.id} className={`rounded-xl border p-4 ${slot.all_accepted ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white"}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{fmtDate(slot.proposed_datetime)}</p>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {accepted.map(v => (
                                <span key={v.participant_id} className="text-xs rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700">✓ {v.name}</span>
                              ))}
                              {declined.map(v => (
                                <span key={v.participant_id} className="text-xs rounded-full bg-red-50 px-2 py-0.5 text-red-600">✗ {v.name}</span>
                              ))}
                              {slot.votes.length === 0 && <span className="text-xs text-slate-400">Noch keine Stimmen</span>}
                            </div>
                          </div>
                          <div className="flex gap-1.5 shrink-0">
                            <button
                              disabled={appointmentVoting === slot.id}
                              onClick={() => handleVoteSlot(slot.id, true)}
                              className="rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-600 disabled:opacity-50 transition"
                            >
                              {appointmentVoting === slot.id ? "…" : "Zustimmen"}
                            </button>
                            <button
                              disabled={appointmentVoting === slot.id}
                              onClick={() => handleVoteSlot(slot.id, false)}
                              className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition"
                            >
                              Ablehnen
                            </button>
                          </div>
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
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Kundenerlebnis-Feedback</p>
                <button onClick={loadFeedback} className="text-xs text-teal-600 hover:text-teal-800 font-medium">↻ Aktualisieren</button>
              </div>

              {loadingFeedback ? (
                <p className="text-sm italic text-slate-400">Wird geladen…</p>
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
                              <div key={entry.id} className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-xs font-semibold text-slate-800">{entry.participant_name}</span>
                                  <span className="text-[10px] text-slate-400">
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
                                      <div key={key} className={`flex items-start gap-2 text-xs ${isAlert ? "text-amber-700 font-semibold" : "text-slate-600"}`}>
                                        <span className="shrink-0 text-slate-400">·</span>
                                        <span className="text-slate-500 shrink-0">{label}:</span>
                                        <span className={isAlert ? "text-amber-700" : "text-slate-800"}>{displayValue}</span>
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
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Mediationsvertrag</p>
                <div className="flex items-center gap-2">
                  <button onClick={loadContract} className="text-xs text-teal-600 hover:text-teal-800 font-medium">↻</button>
                  <button
                    onClick={handleGenerateContract}
                    disabled={contractGenerating}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition disabled:opacity-50"
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
                    <div className="flex items-center gap-3 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3">
                      <svg className="h-4 w-4 text-teal-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      <p className="text-xs font-semibold text-teal-800">Vertrag ist für die Parteien freigegeben und kann unterzeichnet werden.</p>
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
                        className="shrink-0 rounded-full bg-teal-500 px-4 py-2 text-xs font-bold text-white hover:bg-teal-600 transition disabled:opacity-50 whitespace-nowrap"
                      >
                        {contractReleasing ? "Wird freigegeben…" : "✓ Freigeben"}
                      </button>
                    </div>
                  )}

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-slate-600">Vertragstext</span>
                      <span className="text-[10px] text-slate-400">Erstellt: {new Date(contract.created_at).toLocaleDateString("de-DE")}</span>
                    </div>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{contract.text}</div>
                  </div>

                  {isReleased && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Unterschriften</p>
                        {allSigned && <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-bold text-teal-700">✓ Alle unterzeichnet</span>}
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {accepted.map((p) => {
                          const sig = signatures.find((s) => s.participant_id === p.id);
                          return (
                            <div key={p.id} className={sig ? "rounded-xl border border-teal-200 bg-teal-50 p-3" : "rounded-xl border border-slate-200 bg-slate-50 p-3"}>
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="text-sm font-semibold text-slate-900">{p.name}</p>
                                  <p className="text-[10px] text-slate-400">{p.email}</p>
                                </div>
                                <RoleBadge role={p.role} />
                              </div>
                              {sig ? (
                                <div className="mt-2 flex items-center gap-1.5">
                                  <svg className="h-3.5 w-3.5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                  <span className="text-xs text-teal-700">"{sig.signed_name}"</span>
                                  <span className="text-[10px] text-slate-400 ml-auto">{new Date(sig.signed_at).toLocaleDateString("de-DE")}</span>
                                </div>
                              ) : (
                                <p className="mt-2 text-xs text-slate-400">Ausstehend</p>
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
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">KI-gestützte Mediationsanalyse</p>
                <button
                  onClick={handleGenerateAnalyse}
                  disabled={analyseLoading}
                  className="rounded-full bg-violet-500 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-600 disabled:opacity-50 transition"
                >
                  {analyseLoading ? "Wird analysiert…" : analyseResult ? "↻ Neu analysieren" : "✦ Analyse starten"}
                </button>
              </div>

              {analyseError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3">
                  <p className="text-xs font-semibold text-red-700">{analyseError}</p>
                </div>
              )}

              {analyseLoading && (
                <div className="flex flex-col items-center gap-3 py-12 text-center">
                  <svg className="h-8 w-8 animate-spin text-violet-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <p className="text-sm text-slate-400">Claude analysiert den Fall…</p>
                </div>
              )}

              {!analyseLoading && !analyseResult && (
                <div className="rounded-2xl border border-dashed border-violet-200 bg-violet-50/40 px-6 py-12 text-center">
                  <p className="text-2xl mb-3">✦</p>
                  <p className="text-sm font-semibold text-slate-700 mb-1">SWOT-Analyse & Gesprächstipps</p>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">Claude analysiert alle Notizen und den Fallstatus und gibt dir eine SWOT-Analyse sowie individuelle Gesprächstipps für jeden Teilnehmer.</p>
                </div>
              )}

              {!analyseLoading && analyseResult && (
                <div className="space-y-5">
                  {/* Zusammenfassung */}
                  <div className="rounded-xl border border-violet-200 bg-violet-50 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-violet-600 mb-2">Gesamtlage</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{analyseResult.zusammenfassung}</p>
                  </div>

                  {/* SWOT */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">SWOT-Analyse</p>
                    <div className="grid grid-cols-2 gap-3">
                      {([
                        { key: "staerken", label: "Stärken", color: "border-teal-200 bg-teal-50", dot: "bg-teal-500", text: "text-teal-700" },
                        { key: "schwaechen", label: "Schwächen", color: "border-red-200 bg-red-50", dot: "bg-red-400", text: "text-red-700" },
                        { key: "chancen", label: "Chancen", color: "border-emerald-200 bg-emerald-50", dot: "bg-emerald-500", text: "text-emerald-700" },
                        { key: "risiken", label: "Risiken", color: "border-amber-200 bg-amber-50", dot: "bg-amber-400", text: "text-amber-700" },
                      ] as const).map(({ key, label, color, dot, text }) => (
                        <div key={key} className={`rounded-xl border p-4 ${color}`}>
                          <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${text}`}>{label}</p>
                          <ul className="space-y-1.5">
                            {(analyseResult.swot[key] ?? []).map((item, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                                <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Empfehlungen */}
                  {analyseResult.empfehlungen?.length > 0 && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Empfehlungen für den Mediator</p>
                      <ul className="space-y-2">
                        {analyseResult.empfehlungen.map((e, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                            <span className="mt-0.5 shrink-0 text-violet-400">→</span>
                            {e}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Gesprächstipps pro Teilnehmer */}
                  {analyseResult.teilnehmer_tipps?.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Gesprächstipps pro Teilnehmer</p>
                      <div className="space-y-3">
                        {analyseResult.teilnehmer_tipps.map((t, i) => (
                          <div key={i} className="rounded-xl border border-slate-200 bg-white p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
                                {t.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-slate-800">{t.name}</p>
                                <p className="text-[10px] text-slate-400">{t.rolle}</p>
                              </div>
                            </div>
                            <ul className="space-y-1.5">
                              {t.tipps.map((tip, j) => (
                                <li key={j} className="flex items-start gap-2 text-xs text-slate-600">
                                  <span className="mt-0.5 shrink-0 text-violet-400">·</span>
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      </WCard>
    </div>
  );
}
