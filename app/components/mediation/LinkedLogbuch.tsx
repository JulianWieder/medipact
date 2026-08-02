"use client";

// ── Reiter „Logbuch" im Fall ───────────────────────────────────────────────
//
// Ein Konflikt-Logbuch ist KEIN Fall und wird nirgends als solcher gelistet.
// Was daraus zum Fall gehört, verknüpfen die Beteiligten im Logbuch – hier
// erscheint es: chronologisch, mit Bereich, Art und Sichtbarkeit.
//
// Sichtbarkeit erzwingt das Backend (routers/logbuch.py list_linked_entries):
//   sensibel  – nie sichtbar, wird gar nicht erst verknüpft
//   verknüpft – Autor:in + Mediator:in (nicht die Gegenseite)
//   geteilt   – alle Beteiligten des Falls
//
// Anhänge kommen über die fall-seitige Route /logbuch/linked-file, weil der
// Mediator nicht Teilnehmer des Logbuchs ist.

import { useCallback, useEffect, useMemo, useState } from "react";
import Icon from "@/app/components/ui/Icon";
import {
  areaMetaFor,
  entryTypeMeta,
  formatLogDate,
  BUSINESS_TYPES,
} from "./logbuchMeta";

interface LinkedField {
  label?: string;
  value?: string;
  file?: { name: string; url: string };
}

export interface LinkedLogEntry {
  id: number;
  entry_type: string;
  area?: string | null;
  occurred_at: string | null;
  created_at: string | null;
  title: string | null;
  visibility: string;
  is_own: boolean;
  author_name?: string | null;
  /** "linked" = aus einem Logbuch verknüpft, "case" = direkt am Fall erfasst. */
  source: "linked" | "case" | string;
  fields: LinkedField[];
}

interface Props {
  mediationId: number | string;
  /** Für den Ton der Labels (Business/ODR = sachliche Falldokumentation). */
  mediationType?: string;
  /** "workspace" (Mediatoren-Ansicht) oder "dashboard" (Beteiligte). */
  variant?: "workspace" | "dashboard";
}

const FILTERS = [
  { key: "alle", label: "Alle" },
  { key: "shared", label: "Geteilt" },
  { key: "personal", label: "Nur für den Mediator" },
] as const;

export default function LinkedLogbuch({
  mediationId,
  mediationType = "",
  variant = "workspace",
}: Props) {
  const [entries, setEntries] = useState<LinkedLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<string>("alle");
  const businessTone = BUSINESS_TYPES.has((mediationType || "").toLowerCase());

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/mediations/${mediationId}/logbuch/linked`, {
        cache: "no-store",
      });
      if (!res.ok) {
        setError("Logbuch-Einträge konnten nicht geladen werden.");
        setEntries([]);
        return;
      }
      setEntries(await res.json());
    } catch {
      setError("Server nicht erreichbar.");
    } finally {
      setLoading(false);
    }
  }, [mediationId]);

  useEffect(() => {
    load();
  }, [load]);

  const visible = useMemo(
    () =>
      filter === "alle"
        ? entries
        : entries.filter((e) => (e.visibility || "personal") === filter),
    [entries, filter],
  );

  const hasPersonal = entries.some((e) => (e.visibility || "personal") === "personal");

  if (loading) {
    return (
      <div className="space-y-3">
        {[0, 1].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-neutral-100" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error}
      </p>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-300 p-8 text-center">
        <p className="text-sm font-semibold text-neutral-700">
          Noch keine Logbuch-Einträge zu diesem Fall
        </p>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500">
          {variant === "workspace"
            ? "Beteiligte können Einträge aus ihrem Konflikt-Logbuch mit diesem Fall verknüpfen. Sensible Einträge bleiben in jedem Fall privat."
            : "Verknüpfen Sie Einträge aus Ihrem Konflikt-Logbuch mit diesem Fall – einzeln oder das ganze Logbuch. Sensible Einträge bleiben dabei immer privat."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs leading-5 text-neutral-500">
          {entries.length} {entries.length === 1 ? "Eintrag" : "Einträge"} aus dem
          Logbuch der Beteiligten. Sensible Einträge sind nie enthalten.
        </p>
        <div className="flex items-center gap-2">
          {hasPersonal &&
            FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  filter === f.key
                    ? "bg-accent-600 text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          <button
            type="button"
            onClick={load}
            className="text-xs font-medium text-accent-600 transition hover:text-accent-800"
          >
            ↻ Aktualisieren
          </button>
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-500">
          Keine Einträge in dieser Ansicht.
        </p>
      ) : (
        <ol className="space-y-4">
          {visible.map((entry) => {
            const meta = entryTypeMeta(entry.entry_type, businessTone);
            const area = areaMetaFor(entry.area);
            const shared = (entry.visibility || "personal") === "shared";
            return (
              <li
                key={entry.id}
                className="rounded-2xl border border-neutral-200 bg-white p-5 transition hover:border-accent-200"
              >
                <div className="flex flex-wrap items-center gap-2.5">
                  <Icon name={meta.icon} size={18} />
                  <span className="text-sm font-bold text-neutral-900">{meta.label}</span>
                  <span className="text-sm text-neutral-400">·</span>
                  <span className="text-sm text-neutral-500">
                    {formatLogDate(entry.occurred_at ?? entry.created_at)}
                  </span>
                  <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-semibold text-neutral-500">
                    {area.label}
                  </span>
                  <span
                    title={
                      shared
                        ? "Von der Autor:in ausdrücklich für alle Beteiligten geteilt."
                        : "Mit dem Fall verknüpft: sichtbar für die Autor:in und den Mediator – nicht für die Gegenseite."
                    }
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      shared
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {shared ? "Geteilt" : "Nur für den Mediator"}
                  </span>
                  {entry.author_name && (
                    <span className="text-xs text-neutral-400">
                      von {entry.is_own ? "Ihnen" : entry.author_name}
                    </span>
                  )}
                  {entry.source === "case" && (
                    <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-semibold text-neutral-500">
                      im Fall erfasst
                    </span>
                  )}
                </div>

                {entry.title && (
                  <p className="mt-2 text-sm font-semibold text-neutral-900">{entry.title}</p>
                )}

                <dl className="mt-3 space-y-2.5">
                  {entry.fields.map((f, i) => (
                    <div key={i}>
                      {f.label && (
                        <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                          {f.label}
                        </dt>
                      )}
                      <dd className="mt-0.5 whitespace-pre-wrap text-sm leading-6 text-neutral-700">
                        {f.file ? (
                          <a
                            href={f.file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-accent-600 underline underline-offset-2 hover:text-accent-800"
                          >
                            {f.file.name}
                          </a>
                        ) : (
                          f.value
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
