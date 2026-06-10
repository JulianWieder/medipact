"use client";

import { useEffect, useState } from "react";
import type { ParticipantWithCase, SystemUser } from "../types";
import { EmptyState, cn } from "../ui";
import { fetchAllMediations, fetchMediations, fetchParticipants, fetchAllUsers } from "../api";

interface UserEntry {
  id: string;
  name: string;
  email: string;
  systemRole: string; // "mediator" | "admin" | "party"
  is_verified: boolean;
  cases: {
    mediationId: number;
    mediationTitle: string;
    mediationType: string;
    participantRole: string; // "owner" | "other_party" etc.
    mediatorName: string | null; // wer leitet den Fall
  }[];
}

interface ParteienListeProps {
  selectedId?: string | null;
  onSelect: (p: ParticipantWithCase) => void;
  isAdmin?: boolean;
}

export function ParteienListe({ selectedId, onSelect, isAdmin = false }: ParteienListeProps) {
  const [entries, setEntries] = useState<UserEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const mediations = await (isAdmin ? fetchAllMediations() : fetchMediations());

        // Alle Teilnehmerdaten laden
        const participantsPerCase = await Promise.all(
          mediations.map(async (m) => ({
            mediation: m,
            participants: await fetchParticipants(m.id),
          }))
        );

        if (isAdmin) {
          const systemUsers = await fetchAllUsers();

          // Baue Map: email -> cases
          const casesByEmail = new Map<string, UserEntry["cases"]>();
          for (const { mediation, participants } of participantsPerCase) {
            // Wer ist Mediator/Owner dieses Falls?
            const mediatorParticipant = participants.find(
              (p) => p.role === "owner" || p.role === "mediator"
            );
            const mediatorName = mediatorParticipant?.name ?? null;

            for (const p of participants) {
              const list = casesByEmail.get(p.email) ?? [];
              list.push({
                mediationId: mediation.id,
                mediationTitle: mediation.title,
                mediationType: mediation.mediation_type,
                participantRole: p.role,
                mediatorName: p.role === "owner" || p.role === "mediator" ? null : mediatorName,
              });
              casesByEmail.set(p.email, list);
            }
          }

          setEntries(
            systemUsers.map((u) => ({
              id: String(u.id),
              name: u.name,
              email: u.email,
              systemRole: u.role,
              is_verified: u.is_verified,
              cases: casesByEmail.get(u.email) ?? [],
            }))
          );
        } else {
          // Nur eigene Kontakte
          const seen = new Map<string, UserEntry>();
          for (const { mediation, participants } of participantsPerCase) {
            const mediatorParticipant = participants.find(
              (p) => p.role === "owner" || p.role === "mediator"
            );
            const mediatorName = mediatorParticipant?.name ?? null;
            for (const p of participants) {
              const entry = seen.get(p.email) ?? {
                id: p.id,
                name: p.name,
                email: p.email,
                systemRole: "party",
                is_verified: true,
                cases: [],
              };
              entry.cases.push({
                mediationId: mediation.id,
                mediationTitle: mediation.title,
                mediationType: mediation.mediation_type,
                participantRole: p.role,
                mediatorName: p.role === "owner" ? null : mediatorName,
              });
              seen.set(p.email, entry);
            }
          }
          setEntries(Array.from(seen.values()));
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [isAdmin]);

  const SYSTEM_ROLE_CONFIG: Record<string, { label: string; badge: string }> = {
    admin: { label: "Admin", badge: "bg-purple-50 text-purple-700 border-purple-200" },
    mediator: { label: "Mediator", badge: "bg-teal-50 text-teal-700 border-teal-200" },
    party: { label: "Partei", badge: "bg-slate-100 text-slate-600 border-slate-200" },
  };

  const PART_ROLE_LABEL: Record<string, string> = {
    owner: "Antragsteller",
    initiator: "Antragsteller",
    other_party: "Gegenpartei",
    mediator: "Mediator",
    observer: "Beobachter",
  };

  if (loading)
    return <p className="px-4 py-6 text-sm italic text-slate-400">Wird geladen…</p>;
  if (entries.length === 0)
    return (
      <div className="p-4">
        <EmptyState icon="👥" text="Noch keine Parteien vorhanden." />
      </div>
    );

  return (
    <div className="p-2 space-y-1">
      {isAdmin && (
        <div className="px-3 py-2 text-xs font-bold uppercase tracking-widest text-slate-400">
          {entries.length} Nutzer im System
        </div>
      )}
      {entries.map((entry) => {
        const roleCfg = SYSTEM_ROLE_CONFIG[entry.systemRole] ?? SYSTEM_ROLE_CONFIG.party;
        const firstCase = entry.cases[0];
        return (
          <button
            key={entry.id}
            onClick={() =>
              onSelect({
                id: entry.id,
                name: entry.name,
                email: entry.email,
                role: entry.systemRole,
                invitationStatus: "accepted",
                mediationId: firstCase?.mediationId ?? 0,
                mediationTitle: firstCase?.mediationTitle ?? "–",
                mediationType: firstCase?.mediationType ?? "–",
              })
            }
            className={cn(
              "w-full rounded-xl px-3 py-3 text-left transition border",
              selectedId === entry.id
                ? "bg-teal-50 border-teal-200"
                : "hover:bg-slate-50 border-transparent",
            )}
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2">
                {/* Verified dot */}
                <span
                  className={cn(
                    "h-2 w-2 rounded-full shrink-0",
                    entry.is_verified ? "bg-teal-500" : "bg-amber-400",
                  )}
                />
                <span className="text-sm font-semibold text-slate-800">{entry.name}</span>
              </div>
              <span
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full border",
                  roleCfg.badge,
                )}
              >
                {roleCfg.label}
              </span>
            </div>
            <div className="text-xs text-slate-400 ml-4">{entry.email}</div>

            {/* Fälle */}
            {entry.cases.length > 0 && (
              <div className="mt-2 ml-4 space-y-1">
                {entry.cases.slice(0, 2).map((c) => (
                  <div key={c.mediationId} className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs text-slate-500 truncate max-w-[140px]">
                      {c.mediationTitle}
                    </span>
                    <span className="text-xs text-slate-300">·</span>
                    <span className="text-xs text-slate-400">
                      {PART_ROLE_LABEL[c.participantRole] ?? c.participantRole}
                    </span>
                    {c.mediatorName && (
                      <>
                        <span className="text-xs text-slate-300">·</span>
                        <span className="text-xs text-teal-600">⚖ {c.mediatorName}</span>
                      </>
                    )}
                  </div>
                ))}
                {entry.cases.length > 2 && (
                  <div className="text-xs text-slate-400">+{entry.cases.length - 2} weitere</div>
                )}
              </div>
            )}

            {entry.cases.length === 0 && (
              <div className="mt-1 ml-4 text-xs text-slate-300 italic">Noch kein Fall</div>
            )}
          </button>
        );
      })}
    </div>
  );
}
