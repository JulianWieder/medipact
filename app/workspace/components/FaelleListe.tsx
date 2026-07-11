"use client";

import { useEffect, useState } from "react";
import type { MediationCase } from "../types";
import { PHASES, getPhaseIndex } from "../types";
import { StatusBadge, TypeBadge, ProgressBar, EmptyState, cn } from "../ui";
import { SegmentedControl, Skeleton } from "@/app/components/ui/premium";
import { fetchMediations, fetchAllMediations } from "../api";

interface FaelleListeProps {
  isAdmin?: boolean;
  selectedId?: number | null;
  onSelect: (m: MediationCase) => void;
  /** Status-Filter, z.B. vom Dashboard-KPI-Klick gesetzt. `null` = kein Filter. */
  statusFilter?: { statuses: string[]; label: string } | null;
  onClearFilter?: () => void;
  /** Setzt den Status-Filter aus der Liste heraus (SegmentedControl). */
  onSetFilter?: (statuses: string[], label: string) => void;
}

// Segmente für die Filter-Leiste — gleiche Gruppierung wie die
// Dashboard-KPIs (handleFilterStatus in WorkspaceClient).
const FILTER_SEGMENTS: { key: string | null; label: string; statuses: string[] | null }[] = [
  { key: null, label: "Alle", statuses: null },
  { key: "active", label: "Aktiv", statuses: ["active"] },
  { key: "pending", label: "Ausstehend", statuses: ["pending", "draft"] },
  { key: "completed", label: "Abgeschlossen", statuses: ["completed"] },
];

/** Ermittelt das aktive Segment aus dem (extern gesetzten) statusFilter. */
function activeSegmentKey(statusFilter?: { statuses: string[] } | null): string | null {
  if (!statusFilter) return null;
  const want = [...statusFilter.statuses].sort().join(",");
  const seg = FILTER_SEGMENTS.find(
    (s) => s.statuses && [...s.statuses].sort().join(",") === want,
  );
  return seg?.key ?? null;
}

export function FaelleListe({
  isAdmin = false,
  selectedId,
  onSelect,
  statusFilter,
  onClearFilter,
  onSetFilter,
}: FaelleListeProps) {
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
    // Skeleton in Zeilen-Form statt Ladetext (Stripe-Stil).
    return (
      <div className="space-y-3 p-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-xl px-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-14" />
            </div>
            <Skeleton className="mt-3 h-2 w-full" />
            <Skeleton className="mt-2 h-3 w-24" />
          </div>
        ))}
      </div>
    );
  if (error)
    return <p className="px-4 py-6 text-sm text-red-500">{error}</p>;

  if (faelle.length === 0)
    return (
      <div className="p-4">
        <EmptyState icon="⚖" text="Noch keine Mediationsfälle vorhanden." />
      </div>
    );

  // Stripe-artige segmentierte Filter-Leiste; synchron mit dem extern
  // gesetzten statusFilter (Dashboard-KPI-Klick).
  const countFor = (statuses: string[] | null) =>
    statuses ? faelle.filter((m) => statuses.includes(m.status ?? "draft")).length : faelle.length;

  const filterLeiste = (
    <div className="px-1 pb-1">
      <SegmentedControl
        segments={FILTER_SEGMENTS.map((s) => ({
          key: s.key,
          label: s.label,
          count: countFor(s.statuses),
        }))}
        activeKey={activeSegmentKey(statusFilter)}
        onChange={(key) => {
          const seg = FILTER_SEGMENTS.find((s) => s.key === key);
          if (!seg || !seg.statuses) {
            onClearFilter?.();
          } else {
            onSetFilter?.(seg.statuses, seg.label);
          }
        }}
      />
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
      {filterLeiste}
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
              "relative w-full rounded-xl px-3 py-3 text-left transition",
              selectedId === fall.id
                ? "bg-accent-50 border border-accent-200"
                : "hover:bg-neutral-50 border border-transparent",
            )}
          >
            {selectedId === fall.id && (
              <span className="absolute bottom-3 left-0 top-3 w-1 rounded-r-full bg-accent-500" />
            )}
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
              <span className="text-xs text-neutral-400 shrink-0 tabular-nums">{progress}%</span>
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
