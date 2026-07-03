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
  const [search, setSearch] = useState("");

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

  // Suche primär nach Fall-ID (#123), zusätzlich nach Titel für Komfort.
  const q = search.trim().toLowerCase();
  const sichtbar = q
    ? gefiltert.filter(
        (m) => String(m.id).includes(q) || m.title.toLowerCase().includes(q),
      )
    : gefiltert;

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

  const searchBox = (
    <div className="relative mb-1 px-1">
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-neutral-400">
        ⌕
      </span>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        inputMode="numeric"
        placeholder="Nach Fall-ID oder Titel suchen …"
        className="w-full rounded-xl border border-neutral-200 py-2 pl-8 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-accent-400"
      />
      {search && (
        <button
          onClick={() => setSearch("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-600"
          title="Suche zurücksetzen"
        >
          ✕
        </button>
      )}
    </div>
  );

  const emptyBody =
    gefiltert.length === 0 ? (
      <div className="p-2">
        <EmptyState icon="⚖" text={`Keine Fälle mit Status "${statusFilter?.label}".`} />
      </div>
    ) : (
      <div className="p-2">
        <EmptyState icon="⌕" text={`Kein Fall passt zu "${search.trim()}".`} />
      </div>
    );

  return (
    <div className="p-2 space-y-1">
      {searchBox}
      {filterBanner}
      {sichtbar.length === 0
        ? emptyBody
        : sichtbar.map((fall) => {
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
              <span className="font-mono">#{fall.id}</span> · Phase:{" "}
              <span className="font-medium text-neutral-600">{phaseLabel}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
