"use client";

import { useEffect, useState } from "react";
import type { MediationCase } from "../types";
import { PHASES, getPhaseIndex } from "../types";
import { StatusBadge, TypeBadge, ProgressBar, EmptyState, cn } from "../ui";
import { fetchMediations, fetchAllMediations } from "../api";

interface FaelleListeProps {
  isAdmin?: boolean;
  selectedId?: number | null;
  onSelect: (m: MediationCase) => void;
  /** Status-Filter, z.B. vom Dashboard-KPI-Klick gesetzt. `null` = kein Filter. */
  statusFilter?: { statuses: string[]; label: string } | null;
  onClearFilter?: () => void;
}

export function FaelleListe({ isAdmin = false, selectedId, onSelect, statusFilter, onClearFilter }: FaelleListeProps) {
  const [faelle, setFaelle] = useState<MediationCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = isAdmin
      ? fetchAllMediations()
      : fetchMediations().then((data) =>
          data.filter((m) => m.role === "mediator" || m.role === "owner" || !m.role),
        );
    load
      .then(setFaelle)
      .catch(() => setError("Fälle konnten nicht geladen werden."))
      .finally(() => setLoading(false));
  }, [isAdmin]);

  const gefiltert = statusFilter
    ? faelle.filter((m) => statusFilter.statuses.includes(m.status ?? "draft"))
    : faelle;

  if (loading)
    return <p className="px-4 py-6 text-sm italic text-neutral-400">Wird geladen…</p>;
  if (error)
    return <p className="px-4 py-6 text-sm text-red-500">{error}</p>;

  const filterBanner = statusFilter && (
    <div className="flex items-center justify-between gap-2 px-3 py-2 mb-1 rounded-xl bg-accent-50 border border-accent-100">
      <span className="text-xs font-semibold text-accent-700">
        Filter: {statusFilter.label} ({gefiltert.length})
      </span>
      <button
        onClick={onClearFilter}
        className="text-xs font-semibold text-accent-600 hover:text-accent-800"
      >
        ✕ zurücksetzen
      </button>
    </div>
  );

  if (faelle.length === 0)
    return (
      <div className="p-4">
        <EmptyState icon="⚖" text="Noch keine Mediationsfälle vorhanden." />
      </div>
    );

  if (gefiltert.length === 0)
    return (
      <div className="p-2">
        {filterBanner}
        <div className="p-2">
          <EmptyState icon="⚖" text={`Keine Fälle mit Status "${statusFilter?.label}".`} />
        </div>
      </div>
    );

  return (
    <div className="p-2 space-y-1">
      {filterBanner}
      {gefiltert.map((fall) => {
        const phaseIdx = getPhaseIndex(fall.phase);
        const phaseLabel = phaseIdx >= 0 ? PHASES[phaseIdx].label : "Entwurf";
        const progress = fall.progress ?? (phaseIdx >= 0 ? Math.round(((phaseIdx + 1) / 6) * 100) : 0);

        return (
          <button
            key={fall.id}
            onClick={() => onSelect(fall)}
            className={cn(
              "w-full rounded-xl px-3 py-3 text-left transition",
              selectedId === fall.id
                ? "bg-accent-50 border border-accent-200"
                : "hover:bg-neutral-50 border border-transparent",
            )}
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <span
                className={cn(
                  "text-sm font-semibold leading-snug",
                  selectedId === fall.id ? "text-accent-800" : "text-neutral-800",
                )}
              >
                {fall.title}
              </span>
              <StatusBadge status={fall.status} />
            </div>

            <div className="flex items-center gap-2 flex-wrap mb-2">
              <TypeBadge type={fall.mediation_type} />
            </div>

            <div className="flex items-center gap-2 mb-2">
              <ProgressBar value={progress} />
              <span className="text-xs text-neutral-400 shrink-0">{progress}%</span>
            </div>

            <div className="text-xs text-neutral-400">
              Phase: <span className="font-medium text-neutral-600">{phaseLabel}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
