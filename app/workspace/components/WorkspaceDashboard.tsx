"use client";

import { useEffect, useState } from "react";
import type { MediationCase } from "../types";
import { PHASES, getPhaseIndex, TYPE_LABEL } from "../types";
import { TypeBadge, StatusBadge, KPI, WCard, SectionHeader, ProgressBar, EmptyState } from "../ui";
import { fetchMediations, fetchAllMediations } from "../api";

interface WorkspaceDashboardProps {
  isAdmin?: boolean;
  onSelectFall: (m: MediationCase) => void;
}

export function WorkspaceDashboard({ isAdmin = false, onSelectFall }: WorkspaceDashboardProps) {
  const [faelle, setFaelle] = useState<MediationCase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (isAdmin ? fetchAllMediations() : fetchMediations())
      .then(setFaelle)
      .finally(() => setLoading(false));
  }, [isAdmin]);

  const active = faelle.filter((m) => m.status === "active").length;
  const pending = faelle.filter((m) => m.status === "pending" || m.status === "draft").length;
  const completed = faelle.filter((m) => m.status === "completed").length;

  const upcoming = faelle
    .filter((m) => m.status === "active" || m.status === "pending")
    .sort((a, b) => getPhaseIndex(b.phase) - getPhaseIndex(a.phase))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Begrüßung */}
      <div>
        <p className="eyebrow mb-2">Workspace</p>
        <h2 className="text-2xl font-bold text-slate-900">Übersicht</h2>
        <p className="mt-1 text-sm text-slate-500">
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
          <p className="text-sm italic text-slate-400">Wird geladen…</p>
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
                  className="w-full text-left rounded-2xl border border-slate-200 bg-white p-4 hover:border-teal-200 hover:shadow-sm transition"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="font-semibold text-sm text-slate-800">{fall.title}</div>
                      <div className="mt-0.5 flex items-center gap-2 flex-wrap">
                        <TypeBadge type={fall.mediation_type} />
                      </div>
                    </div>
                    <StatusBadge status={fall.status} />
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <ProgressBar value={progress} />
                    <span className="text-xs text-slate-400 shrink-0">{progress}%</span>
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    Phase:{" "}
                    <span className="font-medium text-slate-600">{currentPhase}</span>
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
                    <span className="text-xs font-medium text-slate-600">{TYPE_LABEL[type]}</span>
                    <span className="text-xs text-slate-400">{count} Fälle</span>
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
