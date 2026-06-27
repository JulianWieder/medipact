"use client";

import { useEffect, useState } from "react";
import type { AppointmentEvent, MediationCase, FeedbackEntry } from "../types";
import { PHASES, getPhaseIndex, TYPE_LABEL, TYPE_COLOR } from "../types";
import { TypeBadge, StatusBadge, KPI, WCard, SectionHeader, ProgressBar, EmptyState } from "../ui";
import { fetchMediations, fetchAllMediations, fetchAllAppointments, fetchAllFeedback } from "../api";

const FEEDBACK_OCCASION_LABELS: Record<string, string> = {
  after_videocall: "Nach dem Erstgespräch",
  before_contract: "Vor dem Vertragsabschluss",
};

const FEEDBACK_EMOJI_MAP: Record<number, string> = {
  1: "😔",
  2: "😕",
  3: "😐",
  4: "🙂",
  5: "😊",
};

/** Schlüssel, die als 0–10 Skala interpretiert werden, für die Sales-/Vertrauenssignale. */
const TRUST_SIGNAL_KEYS = ["vertrauen_in_prozess", "abschlusssicherheit", "einigung_wahrscheinlichkeit"];

interface WorkspaceDashboardProps {
  isAdmin?: boolean;
  onSelectFall: (m: MediationCase) => void;
  /** Wird aufgerufen, wenn ein Termin angeklickt wird – navigiert zur Tagesansicht im Kalender. */
  onSelectTermin?: (date: Date) => void;
}

export function WorkspaceDashboard({ isAdmin = false, onSelectFall, onSelectTermin }: WorkspaceDashboardProps) {
  const [faelle, setFaelle] = useState<MediationCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [termine, setTermine] = useState<AppointmentEvent[]>([]);
  const [termineLoading, setTermineLoading] = useState(true);
  const [feedback, setFeedback] = useState<FeedbackEntry[]>([]);
  const [feedbackLoading, setFeedbackLoading] = useState(true);

  useEffect(() => {
    (isAdmin ? fetchAllMediations() : fetchMediations())
      .then(setFaelle)
      .finally(() => setLoading(false));
  }, [isAdmin]);

  useEffect(() => {
    fetchAllAppointments()
      .then(setTermine)
      .finally(() => setTermineLoading(false));
  }, [isAdmin]);

  useEffect(() => {
    fetchAllFeedback()
      .then(setFeedback)
      .finally(() => setFeedbackLoading(false));
  }, [isAdmin]);

  const naechsteTermine = termine
    .filter((t) => new Date(t.proposed_datetime).getTime() >= Date.now() - 1000 * 60 * 60)
    .sort((a, b) => new Date(a.proposed_datetime).getTime() - new Date(b.proposed_datetime).getTime())
    .slice(0, 5);

  const active = faelle.filter((m) => m.status === "active").length;
  const pending = faelle.filter((m) => m.status === "pending" || m.status === "draft").length;
  const completed = faelle.filter((m) => m.status === "completed").length;

  const upcoming = faelle
    .filter((m) => m.status === "active" || m.status === "pending")
    .sort((a, b) => getPhaseIndex(b.phase) - getPhaseIndex(a.phase))
    .slice(0, 5);

  // ── Feedback-Aggregation: pro Teilnehmer & Fall einen Zeitverlauf bilden ──
  type FeedbackGroup = {
    key: string;
    mediationId?: number;
    mediationTitle: string;
    participantName: string;
    participantRole: string;
    entries: FeedbackEntry[];
  };
  const feedbackGroupsMap = new Map<string, FeedbackGroup>();
  for (const entry of feedback) {
    const key = `${entry.mediation_id ?? "?"}-${entry.participant_id ?? entry.participant_name}`;
    if (!feedbackGroupsMap.has(key)) {
      feedbackGroupsMap.set(key, {
        key,
        mediationId: entry.mediation_id,
        mediationTitle: entry.mediation_title ?? "Unbekannter Fall",
        participantName: entry.participant_name,
        participantRole: entry.participant_role,
        entries: [],
      });
    }
    feedbackGroupsMap.get(key)!.entries.push(entry);
  }
  const feedbackGroups = Array.from(feedbackGroupsMap.values())
    .map((g) => ({
      ...g,
      // Innerhalb einer Gruppe chronologisch aufsteigend, damit der
      // Zeitverlauf (z.B. Erstgespräch → vor Vertragsabschluss) lesbar ist.
      entries: [...g.entries].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      ),
    }))
    .sort((a, b) => {
      const aLatest = new Date(a.entries[a.entries.length - 1].created_at).getTime();
      const bLatest = new Date(b.entries[b.entries.length - 1].created_at).getTime();
      return bLatest - aLatest;
    })
    .slice(0, 6);

  const feedbackWantsAppointment = feedback.filter((e) => e.answers.weiterer_termin === "Ja, bitte").length;

  return (
    <div className="space-y-6">
      {/* Begrüßung */}
      <div>
        <p className="eyebrow mb-2">Workspace</p>
        <h2 className="text-2xl font-bold text-neutral-900">Übersicht</h2>
        <p className="mt-1 text-sm text-neutral-500">
          {isAdmin ? "Alle Mediationsfälle auf einen Blick." : "Ihre Mediationsfälle auf einen Blick."}
        </p>
      </div>

      {/* KPI-Zeile */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <KPI label="Aktive Fälle" value={active} sub="laufende Mediationen" />
        <KPI label="Ausstehend" value={pending} sub="noch nicht gestartet" />
        <KPI label="Abgeschlossen" value={completed} sub="beendete Verfahren" />
        <KPI label="Gesamt" value={faelle.length} sub="alle Fälle" />
      </div>

      {/* Aktuelle Fälle */}
      <WCard className="p-5">
        <SectionHeader
          label="Aktuelle Arbeit"
          title="Laufende & ausstehende Fälle"
        />
        {loading ? (
          <p className="text-sm italic text-neutral-400">Wird geladen…</p>
        ) : upcoming.length === 0 ? (
          <EmptyState icon="⚖" text="Keine laufenden Fälle." />
        ) : (
          <div className="space-y-3">
            {upcoming.map((fall) => {
              const phaseIdx = getPhaseIndex(fall.phase);
              const progress =
                fall.progress ?? (phaseIdx >= 0 ? Math.round(((phaseIdx + 1) / 6) * 100) : 0);
              const currentPhase = phaseIdx >= 0 ? PHASES[phaseIdx].label : "Noch nicht gestartet";

              return (
                <button
                  key={fall.id}
                  onClick={() => onSelectFall(fall)}
                  className="w-full text-left rounded-2xl border border-neutral-200 bg-white p-4 hover:border-accent-200 hover:shadow-sm transition"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="font-semibold text-sm text-neutral-800">{fall.title}</div>
                      <div className="mt-0.5 flex items-center gap-2 flex-wrap">
                        <TypeBadge type={fall.mediation_type} />
                      </div>
                    </div>
                    <StatusBadge status={fall.status} />
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <ProgressBar value={progress} />
                    <span className="text-xs text-neutral-400 shrink-0">{progress}%</span>
                  </div>
                  <div className="mt-1 text-xs text-neutral-400">
                    Phase:{" "}
                    <span className="font-medium text-neutral-600">{currentPhase}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </WCard>

      {/* Nächste Termine */}
      <WCard className="p-5">
        <SectionHeader label="Kalender" title="Nächste Termine" />
        {termineLoading ? (
          <p className="text-sm italic text-neutral-400">Wird geladen…</p>
        ) : naechsteTermine.length === 0 ? (
          <EmptyState icon="📅" text="Keine anstehenden Termine." />
        ) : (
          <div className="space-y-2">
            {naechsteTermine.map((termin) => {
              const dt = new Date(termin.proposed_datetime);
              const color = TYPE_COLOR[termin.mediation_type] ?? "bg-neutral-50 text-neutral-600 border-neutral-200";
              return (
                <button
                  key={termin.id}
                  onClick={() => onSelectTermin?.(dt)}
                  className="w-full text-left flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-4 hover:border-accent-200 hover:shadow-sm transition"
                >
                  <div className="flex flex-col items-center justify-center w-14 shrink-0 rounded-xl bg-accent-50 py-2">
                    <span className="text-[11px] font-semibold text-accent-600">
                      {dt.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })}
                    </span>
                    <span className="text-xs font-bold text-accent-700">
                      {dt.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-neutral-800 truncate">{termin.mediation_title}</div>
                    <span className={`mt-1 inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${color}`}>
                      {TYPE_LABEL[termin.mediation_type] ?? termin.mediation_type}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </WCard>

      {/* Feedback aus allen Fällen */}
      <WCard className="p-5">
        <SectionHeader label="Kundenerlebnis" title="Feedback aus allen Fällen" />

        {feedbackWantsAppointment > 0 && (
          <div className="mb-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs font-semibold text-amber-800">
              {feedbackWantsAppointment} {feedbackWantsAppointment === 1 ? "Rückmeldung wünscht" : "Rückmeldungen wünschen"} einen weiteren Termin vor dem Vertragsabschluss.
            </p>
          </div>
        )}

        {feedbackLoading ? (
          <p className="text-sm italic text-neutral-400">Wird geladen…</p>
        ) : feedbackGroups.length === 0 ? (
          <EmptyState icon="💬" text="Noch kein Feedback eingegangen." />
        ) : (
          <div className="space-y-3">
            {feedbackGroups.map((group) => {
              const fall = faelle.find((f) => f.id === group.mediationId);
              return (
                <button
                  key={group.key}
                  onClick={() => fall && onSelectFall(fall)}
                  className="w-full text-left rounded-2xl border border-neutral-200 bg-white p-4 hover:border-accent-200 hover:shadow-sm transition disabled:cursor-default"
                  disabled={!fall}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="font-semibold text-sm text-neutral-800">{group.participantName}</div>
                      <div className="text-xs text-neutral-400">{group.mediationTitle}</div>
                    </div>
                  </div>

                  {/* Zeitverlauf: ein Punkt pro Einreichung, chronologisch */}
                  <div className="space-y-2">
                    {group.entries.map((entry) => {
                      const trustKey = TRUST_SIGNAL_KEYS.find((k) => entry.answers[k] !== undefined);
                      const emojiKey = entry.answers.gefuehl !== undefined ? "gefuehl" : entry.answers.gehoert_gefuehl !== undefined ? "gehoert_gefuehl" : null;
                      const isAlert = entry.answers.weiterer_termin === "Ja, bitte";
                      return (
                        <div key={entry.id} className="flex items-center gap-2 text-xs">
                          <span className="shrink-0 text-neutral-400 w-[88px]">
                            {new Date(entry.created_at).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })}
                          </span>
                          <span className="shrink-0 rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
                            {FEEDBACK_OCCASION_LABELS[entry.occasion] ?? entry.occasion}
                          </span>
                          {trustKey && (
                            <span className="text-neutral-600">
                              Vertrauen/Erfolg: <span className="font-semibold text-neutral-800">{entry.answers[trustKey]}/10</span>
                            </span>
                          )}
                          {emojiKey && (
                            <span>{FEEDBACK_EMOJI_MAP[Number(entry.answers[emojiKey])] ?? ""}</span>
                          )}
                          {isAlert && (
                            <span className="font-semibold text-amber-700">⚠ weiterer Termin gewünscht</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </WCard>

      {/* Typ-Verteilung */}
      {faelle.length > 0 && (
        <WCard className="p-5">
          <SectionHeader label="Statistik" title="Fälle nach Konfliktart" />
          <div className="space-y-3">
            {["trennung", "erbschaft", "nachbarschaft"].map((type) => {
              const count = faelle.filter((m) => m.mediation_type === type).length;
              const pct = faelle.length > 0 ? Math.round((count / faelle.length) * 100) : 0;
              return (
                <div key={type}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-neutral-600">{TYPE_LABEL[type]}</span>
                    <span className="text-xs text-neutral-400">{count} Fälle</span>
                  </div>
                  <ProgressBar value={pct} />
                </div>
              );
            })}
          </div>
        </WCard>
      )}
    </div>
  );
}
