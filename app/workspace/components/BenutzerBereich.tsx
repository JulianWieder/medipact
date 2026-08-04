"use client";

// ── Benutzer-Bereich ─────────────────────────────────────────────────────────
//
// Zusammenführung aus zwei früher getrennten Bereichen:
//   • Parteienliste (Nutzer + ihre Fälle; vormals ParteienListe/ParteiDetail)
//   • Benutzermanager (Rolle ändern, löschen, anlegen; vormals AdminBereich)
//
// Eine Liste + eine Detailansicht:
//   • Alle Workspace-Rollen sehen Nutzer + Fälle (Tenant-Scoping im Backend).
//   • Admin-Aktionen erscheinen nur mit canManage (globaler Admin oder
//     Firmen-Admin) – und sind serverseitig zusätzlich abgesichert.
//
// Datenbasis: GET /auth/users/overview – Nutzer inkl. Fällen in EINER Abfrage
// (ersetzt die alte N+1-Ladelogik: Teilnehmer pro Fall einzeln laden).

import { useCallback, useEffect, useMemo, useState } from "react";
import type { SystemUserWithCases, UserCaseRef } from "../types";
import {
  fetchUsersOverview,
  fetchAssignableRoles,
  updateUserRole,
  deleteUser,
  createOrgMember,
} from "../api";
import { SectionHeader, WCard, EmptyState, cn } from "../ui";
import Icon from "@/app/components/ui/Icon";
import { OnboardingEinsicht } from "./OnboardingEinsicht";

// ── Rollen-Konstanten (Fallback, wenn GET /auth/roles nicht erreichbar) ──────

const ROLE_LABEL: Record<string, string> = {
  party: "Partei",
  mediator: "Mediator",
  firm_admin: "Firmen-Admin",
  admin: "Administrator",
};

const ROLE_BADGE: Record<string, string> = {
  admin: "bg-violet-50 text-violet-700 border-violet-200",
  firm_admin: "bg-indigo-50 text-indigo-700 border-indigo-200",
  mediator: "bg-accent-50 text-accent-700 border-accent-200",
  party: "bg-neutral-100 text-neutral-600 border-neutral-200",
};

const PART_ROLE_LABEL: Record<string, string> = {
  owner: "Antragsteller",
  initiator: "Antragsteller",
  other_party: "Gegenpartei",
  mediator: "Mediator",
  observer: "Beobachter",
};

type RoleOption = { id: string; label: string };

/** Rollen fürs Dropdown laden – mit statischem Fallback. */
function useAssignableRoles(enabled: boolean, isFirmAdmin?: boolean) {
  const [assignable, setAssignable] = useState<RoleOption[]>([]);
  const [labels, setLabels] = useState<Record<string, string>>({});
  useEffect(() => {
    if (!enabled) return;
    fetchAssignableRoles()
      .then((r) => {
        setAssignable(r.assignable ?? []);
        setLabels(r.labels ?? {});
      })
      .catch(() => {});
  }, [enabled]);
  const fallback: RoleOption[] = (isFirmAdmin
    ? ["party", "mediator"]
    : ["party", "mediator", "firm_admin", "admin"]
  ).map((id) => ({ id, label: ROLE_LABEL[id] }));
  return {
    roleOptions: assignable.length ? assignable : fallback,
    labelFor: (role: string) => labels[role] ?? ROLE_LABEL[role] ?? role,
  };
}

function RoleBadgePill({ role, label }: { role: string; label: string }) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-full border px-2 py-px text-[10px] font-semibold",
        ROLE_BADGE[role] ?? ROLE_BADGE.party,
      )}
    >
      {label}
    </span>
  );
}

// ── Liste ────────────────────────────────────────────────────────────────────

type SortKey = "name" | "neueste" | "faelle";

interface BenutzerListeProps {
  selectedId?: number | null;
  onSelect: (u: SystemUserWithCases) => void;
  /** Admin-Aktionen anzeigen (globaler Admin oder Firmen-Admin). */
  canManage?: boolean;
  isFirmAdmin?: boolean;
  /** Hochzählen, um die Liste neu zu laden (z.B. nach Rollenwechsel im Detail). */
  refreshKey?: number;
}

export function BenutzerListe({
  selectedId,
  onSelect,
  canManage = false,
  isFirmAdmin = false,
  refreshKey = 0,
}: BenutzerListeProps) {
  const [users, setUsers] = useState<SystemUserWithCases[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("alle");
  const [nurUnbestaetigt, setNurUnbestaetigt] = useState(false);
  const [nurOhneFall, setNurOhneFall] = useState(false);
  const [sort, setSort] = useState<SortKey>("name");

  const { roleOptions } = useAssignableRoles(canManage, isFirmAdmin);

  // Neuen Nutzer anlegen (nur canManage)
  const [showCreate, setShowCreate] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "mediator" });
  const [creating, setCreating] = useState(false);
  const [createMsg, setCreateMsg] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    fetchUsersOverview()
      .then(setUsers)
      .catch(() => setError("Nutzer konnten nicht geladen werden."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { admin: 0, firm_admin: 0, mediator: 0, party: 0 };
    for (const u of users) c[u.role] = (c[u.role] ?? 0) + 1;
    return c;
  }, [users]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = users;
    if (q)
      list = list.filter(
        (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
      );
    if (roleFilter !== "alle") list = list.filter((u) => u.role === roleFilter);
    if (nurUnbestaetigt) list = list.filter((u) => !u.is_verified);
    if (nurOhneFall) list = list.filter((u) => u.cases.length === 0);
    const sorted = [...list];
    if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name, "de"));
    else if (sort === "neueste") sorted.sort((a, b) => b.id - a.id);
    else sorted.sort((a, b) => b.cases.length - a.cases.length);
    return sorted;
  }, [users, search, roleFilter, nurUnbestaetigt, nurOhneFall, sort]);

  async function addUser(e: React.FormEvent) {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.email.trim()) return;
    setCreating(true);
    setCreateMsg("");
    setError("");
    try {
      const created = await createOrgMember({
        name: newUser.name.trim(),
        email: newUser.email.trim(),
        role: newUser.role,
      });
      setUsers((prev) => [
        { ...(created as SystemUserWithCases), cases: [] },
        ...prev.filter((u) => u.id !== created.id),
      ]);
      setNewUser({ name: "", email: "", role: "mediator" });
      setCreateMsg("Benutzer angelegt. Eine E-Mail zum Passwort-Setzen wurde versendet.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Benutzer konnte nicht angelegt werden.");
    } finally {
      setCreating(false);
    }
  }

  const roleChips: { id: string; label: string; count?: number }[] = [
    { id: "alle", label: `Alle (${users.length})` },
    { id: "admin", label: `Admins (${counts.admin ?? 0})` },
    { id: "firm_admin", label: `Firmen-Admins (${counts.firm_admin ?? 0})` },
    { id: "mediator", label: `Mediatoren (${counts.mediator ?? 0})` },
    { id: "party", label: `Parteien (${counts.party ?? 0})` },
  ];

  if (loading)
    return <p className="px-4 py-6 text-sm italic text-neutral-400">Wird geladen…</p>;

  return (
    <div className="flex h-full flex-col">
      {/* Kopf: Suche + Filter + Anlegen */}
      <div className="shrink-0 space-y-2 border-b border-neutral-100 p-3">
        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nach Name oder E-Mail suchen …"
            className="min-w-0 flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent-400"
          />
          <button
            onClick={load}
            className="shrink-0 rounded-lg border border-neutral-200 px-2.5 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-50"
            title="Neu laden"
          >
            ↻
          </button>
          {canManage && (
            <button
              onClick={() => setShowCreate((v) => !v)}
              className={cn(
                "shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition",
                showCreate
                  ? "bg-neutral-100 text-neutral-600"
                  : "bg-accent-500 text-white hover:bg-accent-600",
              )}
            >
              {showCreate ? "Schließen" : "＋ Benutzer"}
            </button>
          )}
        </div>

        {/* Rollen-Filter */}
        <div className="flex flex-wrap gap-1">
          {roleChips.map((c) => (
            <button
              key={c.id}
              onClick={() => setRoleFilter(c.id)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-[11px] font-medium transition",
                roleFilter === c.id
                  ? "border-accent-300 bg-accent-50 text-accent-700"
                  : "border-neutral-200 text-neutral-500 hover:bg-neutral-50",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Zusatz-Filter + Sortierung */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setNurUnbestaetigt((v) => !v)}
            className={cn(
              "rounded-full border px-2.5 py-1 text-[11px] font-medium transition",
              nurUnbestaetigt
                ? "border-amber-300 bg-amber-50 text-amber-700"
                : "border-neutral-200 text-neutral-500 hover:bg-neutral-50",
            )}
          >
            unbestätigt
          </button>
          <button
            onClick={() => setNurOhneFall((v) => !v)}
            className={cn(
              "rounded-full border px-2.5 py-1 text-[11px] font-medium transition",
              nurOhneFall
                ? "border-accent-300 bg-accent-50 text-accent-700"
                : "border-neutral-200 text-neutral-500 hover:bg-neutral-50",
            )}
          >
            ohne Fall
          </button>
          <div className="ml-auto">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-lg border border-neutral-200 px-2 py-1 text-[11px] text-neutral-600 focus:outline-none"
              title="Sortierung"
            >
              <option value="name">Name A–Z</option>
              <option value="neueste">Neueste zuerst</option>
              <option value="faelle">Meiste Fälle</option>
            </select>
          </div>
        </div>

        {/* Anlege-Formular */}
        {canManage && showCreate && (
          <form onSubmit={addUser} className="space-y-2 rounded-xl border border-neutral-200 bg-neutral-50/60 p-3">
            <input
              value={newUser.name}
              onChange={(e) => setNewUser((m) => ({ ...m, name: e.target.value }))}
              placeholder="Name"
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent-400"
            />
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser((m) => ({ ...m, email: e.target.value }))}
              placeholder="E-Mail"
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent-400"
            />
            <div className="flex items-center gap-2">
              <select
                value={newUser.role}
                onChange={(e) => setNewUser((m) => ({ ...m, role: e.target.value }))}
                className="flex-1 rounded-lg border border-neutral-200 px-2 py-2 text-sm focus:outline-none"
              >
                {roleOptions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                disabled={creating}
                className="rounded-lg bg-accent-500 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-600 disabled:opacity-50"
              >
                {creating ? "Legt an …" : "Anlegen"}
              </button>
            </div>
            <p className="text-[10px] text-neutral-400">
              Der neue Benutzer setzt sein Passwort selbst über die zugesandte E-Mail.
              {isFirmAdmin
                ? " Er wird deinem Unternehmen zugeordnet."
                : " Mandanten-Zuordnung ggf. im Admin-Bereich (Mandanten) vornehmen."}
            </p>
            {createMsg && <div className="text-xs text-accent-700">{createMsg}</div>}
          </form>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {error}
            <button onClick={() => setError("")} className="ml-2 underline">
              ausblenden
            </button>
          </div>
        )}
      </div>

      {/* Nutzerliste */}
      <div className="min-h-0 flex-1 overflow-auto p-2">
        {filtered.length === 0 ? (
          <div className="p-4">
            <EmptyState icon="👥" text="Keine Benutzer gefunden." />
          </div>
        ) : (
          <div className="space-y-1">
            {filtered.map((u) => (
              <button
                key={u.id}
                onClick={() => onSelect(u)}
                className={cn(
                  "w-full rounded-xl border px-3 py-2.5 text-left transition",
                  selectedId === u.id
                    ? "border-accent-200 bg-accent-50"
                    : "border-transparent hover:bg-neutral-50",
                )}
              >
                <div className="mb-0.5 flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className={cn(
                        "h-2 w-2 shrink-0 rounded-full",
                        u.is_verified ? "bg-accent-500" : "bg-amber-400",
                      )}
                      title={u.is_verified ? "E-Mail bestätigt" : "E-Mail unbestätigt"}
                    />
                    <span className="truncate text-sm font-semibold text-neutral-800">
                      {u.name}
                    </span>
                  </div>
                  <RoleBadgePill role={u.role} label={ROLE_LABEL[u.role] ?? u.role} />
                </div>
                <div className="ml-4 truncate text-xs text-neutral-400">{u.email}</div>
                <div className="ml-4 mt-1 text-xs text-neutral-400">
                  {u.cases.length === 0 ? (
                    <span className="italic text-neutral-300">Noch kein Fall</span>
                  ) : (
                    <>
                      <span className="text-neutral-500">
                        {u.cases.length === 1 ? "1 Fall" : `${u.cases.length} Fälle`}
                      </span>
                      <span className="text-neutral-300"> · </span>
                      <span className="truncate">{u.cases[0].title}</span>
                      {u.cases.length > 1 && (
                        <span className="text-neutral-300"> +{u.cases.length - 1}</span>
                      )}
                    </>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Detailansicht ────────────────────────────────────────────────────────────

interface BenutzerDetailProps {
  benutzer: SystemUserWithCases;
  canManage?: boolean;
  isFirmAdmin?: boolean;
  currentUserEmail?: string;
  /** Nach Rollenwechsel: aktualisierter Nutzer (Liste lädt via refreshKey neu). */
  onChanged?: (u: SystemUserWithCases) => void;
  /** Nach Löschung: Auswahl aufheben. */
  onDeleted?: () => void;
  /** Klick auf einen Fall: in die Fall-Einzelansicht springen. */
  onOpenFall?: (c: UserCaseRef) => void;
}

export function BenutzerDetail({
  benutzer,
  canManage = false,
  isFirmAdmin = false,
  currentUserEmail,
  onChanged,
  onDeleted,
  onOpenFall,
}: BenutzerDetailProps) {
  const { roleOptions, labelFor } = useAssignableRoles(canManage, isFirmAdmin);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const isSelf = !!currentUserEmail && benutzer.email === currentUserEmail;

  async function changeRole(role: string) {
    if (role === benutzer.role) return;
    setBusy(true);
    setError("");
    try {
      const updated = await updateUserRole(benutzer.id, role);
      onChanged?.({ ...benutzer, role: updated.role });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Rolle konnte nicht geändert werden.");
    } finally {
      setBusy(false);
    }
  }

  async function removeUser() {
    setBusy(true);
    setError("");
    try {
      await deleteUser(benutzer.id);
      onDeleted?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Nutzer konnte nicht gelöscht werden.");
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <WCard
        className="overflow-hidden"
        style={{ background: "var(--color-neutral-800)", color: "white", border: "none" }}
      >
        <div className="p-6">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-400">
            Benutzer
          </p>
          <h2 className="text-xl font-semibold leading-snug">{benutzer.name}</h2>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <RoleBadgePill role={benutzer.role} label={labelFor(benutzer.role)} />
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                benutzer.is_verified ? "bg-accent-400" : "bg-amber-400",
              )}
            />
            <span className="text-sm text-neutral-300">
              {benutzer.is_verified ? "E-Mail bestätigt" : "E-Mail noch unbestätigt"}
            </span>
            {isSelf && (
              <span className="rounded-full bg-white/10 px-2 py-px text-[10px] font-semibold text-neutral-200">
                Du
              </span>
            )}
          </div>
        </div>
      </WCard>

      {/* Kontakt */}
      <WCard className="p-5">
        <SectionHeader label="Kontakt" title="Kontaktinformationen" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">
              E-Mail
            </div>
            <div className="text-sm text-neutral-700">{benutzer.email}</div>
          </div>
          <div>
            <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">
              Nutzer-ID
            </div>
            <div className="text-sm text-neutral-700">#{benutzer.id}</div>
          </div>
        </div>
      </WCard>

      {/* Onboarding-Stand: Stammdaten und Antworten aus dem einmaligen
          Nutzer-Onboarding. Solange es offen ist, kommt die Person gar nicht
          erst ins Dashboard – hier sieht man, woran es hängt. */}
      <OnboardingEinsicht userId={benutzer.id} />

      {/* Fälle */}
      <WCard className="p-5">
        <SectionHeader
          label="Fälle"
          title={
            benutzer.cases.length === 0
              ? "Keine Fälle"
              : benutzer.cases.length === 1
                ? "1 Fall"
                : `${benutzer.cases.length} Fälle`
          }
        />
        {benutzer.cases.length === 0 ? (
          <EmptyState icon="⚖" text="Dieser Benutzer ist noch keinem Fall zugeordnet." />
        ) : (
          <div className="space-y-2">
            {benutzer.cases.map((c) => (
              <button
                key={`${c.mediation_id}-${c.participant_role}`}
                onClick={() => onOpenFall?.(c)}
                className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-left transition hover:border-accent-200 hover:bg-accent-50/40"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-neutral-800">{c.title}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                    {c.status}
                    {c.phase ? ` · ${c.phase}` : ""}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-neutral-500">
                  <span>{PART_ROLE_LABEL[c.participant_role] ?? c.participant_role}</span>
                  <span className="text-neutral-300">·</span>
                  <span className="text-neutral-400">{c.mediation_type}</span>
                  {c.mediator_name && (
                    <>
                      <span className="text-neutral-300">·</span>
                      <span className="text-accent-600"><Icon name="scale" size={12} color="currentColor" /> {c.mediator_name}</span>
                    </>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </WCard>

      {/* Verwaltung (nur Admins/Firmen-Admins) */}
      {canManage && (
        <WCard className="p-5">
          <SectionHeader label="Administration" title="Benutzer verwalten" />
          {error && (
            <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </div>
          )}
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                Rolle
              </label>
              <select
                value={benutzer.role}
                disabled={busy || isSelf}
                onChange={(e) => changeRole(e.target.value)}
                className="rounded-lg border border-neutral-200 px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent-400 disabled:opacity-40"
                title={isSelf ? "Eigene Rolle kann hier nicht geändert werden" : "Rolle ändern"}
              >
                {/* Aktuelle Rolle immer anzeigen, auch wenn nicht vergebbar */}
                {!roleOptions.some((r) => r.id === benutzer.role) && (
                  <option value={benutzer.role}>{labelFor(benutzer.role)}</option>
                )}
                {roleOptions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="ml-auto">
              {confirmDelete ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={removeUser}
                    disabled={busy}
                    className="rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold text-white hover:bg-red-600 disabled:opacity-40"
                  >
                    Wirklich löschen
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="rounded-lg px-2.5 py-2 text-xs text-neutral-500 hover:bg-neutral-100"
                  >
                    Abbrechen
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  disabled={busy || isSelf}
                  className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-30"
                  title={isSelf ? "Eigener Account kann nicht gelöscht werden" : "Nutzer löschen"}
                >
                  Benutzer löschen
                </button>
              )}
            </div>
          </div>
          <p className="mt-3 text-xs text-neutral-400">
            Deine eigene Rolle und deinen eigenen Account kannst du hier nicht ändern
            bzw. löschen – so sperrst du dich nicht versehentlich aus.
          </p>
        </WCard>
      )}
    </div>
  );
}
