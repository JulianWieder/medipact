"use client";

import React, { useEffect, useState, useCallback } from "react";
import type { MediationCase, Participant, MediationNote, PhaseNoteGroup } from "../types";
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
  fetchNotes,
  fetchAllNotes,
  advanceMediationPhase,
  inviteParty,
} from "../api";

interface FallDetailProps {
  fall: MediationCase;
  onPhaseAdvanced?: () => void;
}

export function FallDetail({ fall, onPhaseAdvanced }: FallDetailProps) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [notes, setNotes] = useState<MediationNote[]>([]);
  const [allPhaseNotes, setAllPhaseNotes] = useState<PhaseNoteGroup[]>([]);
  const [showAllNotes, setShowAllNotes] = useState(false);
  const [loadingAllNotes, setLoadingAllNotes] = useState(false);
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
  const [activeNotePhase, setActiveNotePhase] = useState<string | null>(null);

  const phaseIdx = getPhaseIndex(fall.phase);

  // Lade Teilnehmer
  useEffect(() => {
    setLoadingParticipants(true);
    fetchParticipants(fall.id)
      .then(setParticipants)
      .finally(() => setLoadingParticipants(false));
  }, [fall.id]);

  // Lade Notizen für eine Phase
  const loadNotes = useCallback(
    async (phase: string) => {
      setLoadingNotes(true);
      setActiveNotePhase(phase);
      setShowAllNotes(false);
      const data = await fetchNotes(fall.id, phase, "");
      const enriched = data.map((n) => {
        const p = participants.find((p) => p.id === n.participant_id);
        return { ...n, participantName: p?.name, participantRole: p?.role };
      });
      setNotes(enriched);
      setLoadingNotes(false);
    },
    [fall.id, participants],
  );

  useEffect(() => {
    if (fall.phase && participants.length > 0) {
      loadNotes(fall.phase);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fall.phase, participants]);

  async function handleLoadAllNotes() {
    if (showAllNotes) {
      setShowAllNotes(false);
      return;
    }
    setLoadingAllNotes(true);
    setShowAllNotes(true);
    const data = await fetchAllNotes(fall.id);
    setAllPhaseNotes(data);
    setLoadingAllNotes(false);
  }

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

  const acceptedCount = participants.filter((p) => p.invitationStatus === "accepted").length;
  const progress =
    fall.progress ?? (phaseIdx >= 0 ? Math.round(((phaseIdx + 1) / 6) * 100) : 0);

  return (
    <div className="space-y-5">
      {/* Hero-Header */}
      <WCard
        className="overflow-hidden"
        style={{ background: "#1e293b", color: "white", border: "none" }}
      >
        <div className="p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400 mb-2">
                Mediationsfall
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

      {/* KPIs */}
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

      {/* Phasen-Stepper */}
      <WCard className="p-5">
        <SectionHeader label="Verlauf" title="Mediationsphasen" />
        <div className="flex items-center gap-0">
          {PHASES.map((phase, idx) => {
            const isDone = phaseIdx > idx;
            const isCurrent = phaseIdx === idx;
            return (
              <React.Fragment key={phase.id}>
                <div className="flex flex-col items-center gap-1.5 flex-1">
                  <button
                    onClick={() => loadNotes(phase.id)}
                    title={`Notizen für: ${phase.label}`}
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
                  </button>
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

      <div className="grid gap-5 xl:grid-cols-2">
        {/* Teilnehmer */}
        <WCard className="p-5">
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
                  <RoleBadge role={p.role} />
                </div>
              ))}
            </div>
          )}
        </WCard>

        {/* Notizen */}
        <WCard className="p-5">
          <SectionHeader
            label="Notizen"
            title={
              showAllNotes
                ? "Alle Phasen"
                : activeNotePhase
                  ? `Phase: ${PHASES.find((p) => p.id === activeNotePhase)?.label ?? activeNotePhase}`
                  : "Phasennotizen"
            }
            action={
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLoadAllNotes}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold transition border",
                    showAllNotes
                      ? "bg-teal-500 text-white border-teal-500"
                      : "border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100",
                  )}
                >
                  {showAllNotes ? "× Übersicht" : "Alle Phasen"}
                </button>
                {!showAllNotes && fall.phase && (
                  <button
                    onClick={() => loadNotes(fall.phase!)}
                    className="text-xs text-teal-600 hover:text-teal-800 font-medium transition"
                  >
                    ↻
                  </button>
                )}
              </div>
            }
          />

          {showAllNotes ? (
            loadingAllNotes ? (
              <p className="text-sm italic text-slate-400">Wird geladen…</p>
            ) : allPhaseNotes.length === 0 ? (
              <EmptyState icon="📝" text="Noch keine Notizen in diesem Fall." />
            ) : (
              <div className="space-y-4">
                {allPhaseNotes.map((group) => (
                  <div key={group.phase}>
                    <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal-600 mb-2">
                      {PHASES.find((p) => p.id === group.phase)?.label ?? group.phase}
                    </div>
                    <div className="space-y-2">
                      {group.notes.map((note, i) => (
                        <div
                          key={i}
                          className={cn(
                            "rounded-xl border p-3 text-sm",
                            note.submitted
                              ? "border-teal-100 bg-teal-50/60"
                              : "border-slate-100 bg-slate-50/60",
                          )}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-semibold text-slate-800 text-xs">
                              {note.participant_name}
                            </span>
                            {note.submitted && (
                              <span className="text-[10px] font-semibold text-teal-600 uppercase tracking-wide">
                                Eingereicht
                              </span>
                            )}
                          </div>
                          {note.step && (
                            <div className="text-[10px] text-slate-400 mb-1">
                              Schritt: {note.step}
                            </div>
                          )}
                          <p className="leading-relaxed text-slate-700 whitespace-pre-wrap text-xs">
                            {note.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <>
              {/* Phase-Tabs */}
              <div className="mb-3 flex gap-1 overflow-x-auto pb-1">
                {PHASES.map((phase, idx) => {
                  const available = idx <= phaseIdx || phaseIdx < 0;
                  return (
                    <button
                      key={phase.id}
                      onClick={() => available && loadNotes(phase.id)}
                      disabled={!available}
                      className={cn(
                        "shrink-0 rounded-full px-3 py-1 text-xs font-medium transition",
                        activeNotePhase === phase.id
                          ? "bg-teal-500 text-white"
                          : available
                            ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            : "bg-slate-50 text-slate-300 cursor-not-allowed",
                      )}
                    >
                      {phase.label}
                    </button>
                  );
                })}
              </div>

              {loadingNotes ? (
                <p className="text-sm italic text-slate-400">Wird geladen…</p>
              ) : notes.length === 0 ? (
                <EmptyState
                  icon="📝"
                  text="Noch keine eingereichten Notizen für diese Phase."
                />
              ) : (
                <div className="space-y-3">
                  {notes.map((note, i) => (
                    <div
                      key={i}
                      className={cn(
                        "rounded-xl border p-4 text-sm",
                        note.submitted
                          ? "border-teal-100 bg-teal-50/60"
                          : "border-slate-100 bg-slate-50/60",
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {note.participantName && (
                            <span className="font-semibold text-slate-800">{note.participantName}</span>
                          )}
                          {note.participantRole && (
                            <RoleBadge role={note.participantRole} />
                          )}
                        </div>
                        {note.submitted && (
                          <span className="text-[10px] font-semibold text-teal-600 uppercase tracking-wide">
                            Eingereicht
                          </span>
                        )}
                      </div>
                      <p className="leading-relaxed text-slate-700 whitespace-pre-wrap">
                        {note.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </WCard>
      </div>
    </div>
  );
}
