"use client";

import { useEffect, useState } from "react";
import type { ParticipantWithCase, MediationCase } from "../types";
import { PHASES, getPhaseIndex } from "../types";
import { RoleBadge, InviteStatusDot, StatusBadge, TypeBadge, WCard, SectionHeader, ProgressBar, EmptyState } from "../ui";
import { fetchMediations, fetchParticipants } from "../api";

interface ParteiDetailProps {
  partei: ParticipantWithCase;
}

interface ParteiMediationEntry {
  fall: MediationCase;
  rolle: string;
  status: "accepted" | "pending";
}

export function ParteiDetail({ partei }: ParteiDetailProps) {
  const [mediations, setMediations] = useState<ParteiMediationEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const allMediations = await fetchMediations();
        const entries: ParteiMediationEntry[] = [];

        await Promise.all(
          allMediations.map(async (m) => {
            const ps = await fetchParticipants(m.id);
            const match = ps.find((p) => p.email === partei.email);
            if (match) {
              entries.push({ fall: m, rolle: match.role, status: match.invitationStatus });
            }
          }),
        );

        setMediations(entries);
      } catch {
        // Fehler still ignorieren
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [partei.email]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <WCard
        className="overflow-hidden"
        style={{ background: "#1e293b", color: "white", border: "none" }}
      >
        <div className="p-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400 mb-2">
            Partei
          </p>
          <h2 className="text-xl font-semibold leading-snug">{partei.name}</h2>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <RoleBadge role={partei.role} />
            <InviteStatusDot status={partei.invitationStatus} />
            <span className="text-sm text-slate-300">
              {partei.invitationStatus === "accepted" ? "Einladung angenommen" : "Einladung ausstehend"}
            </span>
          </div>
        </div>
      </WCard>

      {/* Kontaktdaten */}
      <WCard className="p-5">
        <SectionHeader label="Kontakt" title="Kontaktinformationen" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 mb-1">
              E-Mail
            </div>
            <div className="text-sm text-slate-700">{partei.email}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 mb-1">
              Teilnehmer-ID
            </div>
            <div className="text-sm font-mono text-slate-500">{partei.id}</div>
          </div>
        </div>
      </WCard>

      {/* Beteiligte Fälle */}
      <WCard className="p-5">
        <SectionHeader label="Fälle" title="Beteiligte Mediationen" />
        {loading ? (
          <p className="text-sm italic text-slate-400">Wird geladen…</p>
        ) : mediations.length === 0 ? (
          <EmptyState icon="⚖" text="Keine Mediationsfälle gefunden." />
        ) : (
          <div className="space-y-3">
            {mediations.map(({ fall, rolle, status }) => {
              const phaseIdx = getPhaseIndex(fall.phase);
              const progress =
                fall.progress ?? (phaseIdx >= 0 ? Math.round(((phaseIdx + 1) / 6) * 100) : 0);

              return (
                <div
                  key={fall.id}
                  className="rounded-xl border border-slate-200 bg-slate-50/60 p-4"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="font-semibold text-sm text-slate-800">{fall.title}</div>
                    <StatusBadge status={fall.status} />
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <TypeBadge type={fall.mediation_type} />
                    <RoleBadge role={rolle} />
                    <InviteStatusDot status={status} />
                  </div>
                  <div className="flex items-center gap-2">
                    <ProgressBar value={progress} />
                    <span className="text-xs text-slate-400 shrink-0">{progress}%</span>
                  </div>
                  {fall.phase && (
                    <div className="mt-1.5 text-xs text-slate-400">
                      Phase: <span className="font-medium text-slate-600">
                        {PHASES.find((p) => p.id === fall.phase)?.label ?? fall.phase}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </WCard>
    </div>
  );
}
