"use client";

// ── Admin-Bereich ────────────────────────────────────────────────────────────
//
// Nur für echte Administratoren (role == "admin") erreichbar. Der Zugriff wird
// doppelt abgesichert:
//   1. Sichtbarkeit: der Sidebar-Eintrag erscheint nur wenn isSuperAdmin.
//   2. Rendern: WorkspaceClient rendert diesen Bereich nur für Admins.
//   3. Backend: /auth/users/{id}/role und DELETE /auth/users/{id} prüfen die
//      Admin-Rolle serverseitig (Verlass dich NIE nur auf das UI).
//
// Aktueller Inhalt: Benutzermanager (Rolle ändern, Nutzer löschen). Weitere
// Admin-Werkzeuge können hier als zusätzliche Karten ergänzt werden.

import { useCallback, useEffect, useMemo, useState } from "react";
import type { SystemUser } from "../types";
import { fetchAllUsers, updateUserRole, deleteUser, createOrgMember, fetchAssignableRoles } from "../api";
import { SectionHeader, WCard, EmptyState, cn } from "../ui";

const ROLE_OPTIONS: { id: string; label: string }[] = [
  { id: "party", label: "Partei" },
  { id: "mediator", label: "Mediator" },
  { id: "firm_admin", label: "Firmen-Admin" },
  { id: "admin", label: "Administrator" },
];

const ROLE_BADGE: Record<string, string> = {
  admin: "bg-violet-50 text-violet-700 border-violet-200",
  firm_admin: "bg-indigo-50 text-indigo-700 border-indigo-200",
  mediator: "bg-accent-50 text-accent-700 border-accent-200",
  party: "bg-neutral-100 text-neutral-600 border-neutral-200",
};

const ROLE_LABEL: Record<string, string> = {
  party: "Partei",
  mediator: "Mediator",
  firm_admin: "Firmen-Admin",
  admin: "Administrator",
};

interface AdminBereichProps {
  /** E-Mail des eingeloggten Admins – markiert den eigenen Account. */
  currentUserEmail?: string;
  /** Firmen-Admin: nur eigenes Unternehmen, Rollen party/mediator, Mitglieder anlegen. */
  isFirmAdmin?: boolean;
}

export function BenutzerManager({ currentUserEmail, isFirmAdmin }: AdminBereichProps) {
  // Rollen fürs Dropdown: dynamisch vom Backend (Single Source ALLOWED_ROLES),
  // mit statischem Fallback falls der Endpunkt (noch) nicht erreichbar ist.
  const [roleData, setRoleData] = useState<{ id: string; label: string }[]>([]);
  const [roleLabels, setRoleLabels] = useState<Record<string, string>>({});
  useEffect(() => {
    fetchAssignableRoles()
      .then((r) => {
        setRoleData(r.assignable ?? []);
        setRoleLabels(r.labels ?? {});
      })
      .catch(() => {});
  }, []);
  const fallbackOptions = isFirmAdmin
    ? ROLE_OPTIONS.filter((r) => r.id === "party" || r.id === "mediator")
    : ROLE_OPTIONS;
  const roleOptions = roleData.length ? roleData : fallbackOptions;
  const labelFor = (role: string) => roleLabels[role] ?? ROLE_LABEL[role] ?? role;
  // Neues Mitglied anlegen (nur Firmen-Admin).
  const [newMember, setNewMember] = useState({ name: "", email: "", role: "mediator" });
  const [creating, setCreating] = useState(false);
  const [createMsg, setCreateMsg] = useState("");
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetchAllUsers()
      .then(setUsers)
      .catch(() => setError("Nutzer konnten nicht geladen werden."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    );
  }, [users, search]);

  const counts = useMemo(() => {
    const c = { admin: 0, mediator: 0, party: 0 };
    for (const u of users) {
      if (u.role === "admin") c.admin += 1;
      else if (u.role === "mediator") c.mediator += 1;
      else c.party += 1;
    }
    return c;
  }, [users]);

  async function changeRole(user: SystemUser, role: string) {
    if (role === user.role) return;
    setBusyId(user.id);
    setError("");
    try {
      const updated = await updateUserRole(user.id, role);
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, role: updated.role } : u)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Rolle konnte nicht geändert werden.");
    } finally {
      setBusyId(null);
    }
  }

  async function removeUser(user: SystemUser) {
    setBusyId(user.id);
    setError("");
    try {
      await deleteUser(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      setConfirmDeleteId(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Nutzer konnte nicht gelöscht werden.");
    } finally {
      setBusyId(null);
    }
  }

  async function addMember(e: React.FormEvent) {
    e.preventDefault();
    if (!newMember.name.trim() || !newMember.email.trim()) return;
    setCreating(true);
    setCreateMsg("");
    setError("");
    try {
      const created = await createOrgMember({
        name: newMember.name.trim(),
        email: newMember.email.trim(),
        role: newMember.role,
      });
      setUsers((prev) => {
        const without = prev.filter((u) => u.id !== created.id);
        return [created as SystemUser, ...without];
      });
      setNewMember({ name: "", email: "", role: "mediator" });
      setCreateMsg("Mitglied angelegt. Eine E-Mail zum Passwort-Setzen wurde versendet.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Mitglied konnte nicht angelegt werden.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="p-6 max-w-5xl">
      <SectionHeader label="Administration" title="Benutzermanager" />

      {isFirmAdmin && (
        <div className="mb-5 rounded-xl border border-neutral-200 bg-white p-4">
          <div className="mb-3 text-sm font-semibold text-neutral-800">
            Mitglied anlegen (Mediator oder Mitarbeiter)
          </div>
          <form onSubmit={addMember} className="flex flex-wrap items-end gap-3">
            <div className="min-w-[9rem] flex-1">
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">Name</label>
              <input
                value={newMember.name}
                onChange={(e) => setNewMember((m) => ({ ...m, name: e.target.value }))}
                placeholder="Max Mustermann"
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent-400"
              />
            </div>
            <div className="min-w-[11rem] flex-1">
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">E-Mail</label>
              <input
                type="email"
                value={newMember.email}
                onChange={(e) => setNewMember((m) => ({ ...m, email: e.target.value }))}
                placeholder="person@firma.de"
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">Rolle</label>
              <select
                value={newMember.role}
                onChange={(e) => setNewMember((m) => ({ ...m, role: e.target.value }))}
                className="rounded-lg border border-neutral-200 px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent-400"
              >
                <option value="mediator">Mediator</option>
                <option value="party">Mitarbeiter / Beteiligter</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={creating}
              className="rounded-lg bg-accent-500 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-600 disabled:opacity-50"
            >
              {creating ? "Legt an …" : "Anlegen"}
            </button>
          </form>
          {createMsg && <div className="mt-2 text-xs text-accent-700">{createMsg}</div>}
        </div>
      )}
      <p className="mb-5 max-w-2xl text-sm text-neutral-500">
        Verwalte alle registrierten Nutzer: Rollen ändern (Partei / Mediator / Administrator)
        oder Accounts löschen. Nur Administratoren sehen diesen Bereich.
      </p>

      {/* KPIs */}
      <div className="mb-5 flex flex-wrap gap-3">
        {[
          { label: "Administratoren", value: counts.admin },
          { label: "Mediatoren", value: counts.mediator },
          { label: "Parteien", value: counts.party },
          { label: "Gesamt", value: users.length },
        ].map((k) => (
          <div key={k.label} className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5">
            <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              {k.label}
            </div>
            <div className="text-lg font-semibold text-neutral-900">{k.value}</div>
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {error}
          <button onClick={() => setError("")} className="ml-3 text-xs underline">
            ausblenden
          </button>
        </div>
      )}

      <WCard className="overflow-hidden p-0">
        {/* Suchleiste */}
        <div className="flex items-center gap-3 border-b border-neutral-100 px-5 py-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nach Name oder E-Mail suchen …"
            className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent-400"
          />
          <button
            onClick={load}
            className="rounded-lg border border-neutral-200 px-3 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-50"
            title="Neu laden"
          >
            ↻ Aktualisieren
          </button>
        </div>

        {loading ? (
          <div className="p-6 text-sm text-neutral-400">Lädt …</div>
        ) : filtered.length === 0 ? (
          <div className="p-5">
            <EmptyState icon="👥" text="Keine Nutzer gefunden." />
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {filtered.map((user) => {
              const isSelf = !!currentUserEmail && user.email === currentUserEmail;
              const busy = busyId === user.id;
              return (
                <div
                  key={user.id}
                  className="flex flex-wrap items-center gap-3 px-5 py-3 hover:bg-neutral-50/60"
                >
                  {/* Name + E-Mail */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-neutral-800">
                        {user.name}
                      </span>
                      {isSelf && (
                        <span className="rounded-full bg-neutral-100 px-2 py-px text-[9px] font-semibold text-neutral-500">
                          Du
                        </span>
                      )}
                      {!user.is_verified && (
                        <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-px text-[9px] font-semibold text-amber-600">
                          unbestätigt
                        </span>
                      )}
                    </div>
                    <div className="truncate text-xs text-neutral-400">{user.email}</div>
                  </div>

                  {/* Aktuelle Rolle als Badge */}
                  <span
                    className={cn(
                      "shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold",
                      ROLE_BADGE[user.role] ?? ROLE_BADGE.party,
                    )}
                  >
                    {labelFor(user.role)}
                  </span>

                  {/* Rolle ändern */}
                  <select
                    value={user.role}
                    disabled={busy || isSelf}
                    onChange={(e) => changeRole(user, e.target.value)}
                    className="shrink-0 rounded-lg border border-neutral-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-accent-400 disabled:opacity-40"
                    title={isSelf ? "Eigene Rolle kann hier nicht geändert werden" : "Rolle ändern"}
                  >
                    {roleOptions.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.label}
                      </option>
                    ))}
                  </select>

                  {/* Löschen */}
                  {confirmDeleteId === user.id ? (
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        onClick={() => removeUser(user)}
                        disabled={busy}
                        className="rounded-lg bg-red-500 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-red-600 disabled:opacity-40"
                      >
                        Wirklich löschen
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="rounded-lg px-2 py-1.5 text-xs text-neutral-500 hover:bg-neutral-100"
                      >
                        Abbrechen
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(user.id)}
                      disabled={busy || isSelf}
                      className="shrink-0 rounded-lg p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-30"
                      title={isSelf ? "Eigener Account kann nicht gelöscht werden" : "Nutzer löschen"}
                    >
                      ✕
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </WCard>

      <p className="mt-4 max-w-2xl text-xs text-neutral-400">
        Hinweis: Deine eigene Admin-Rolle kannst du hier nicht entfernen und deinen eigenen
        Account nicht löschen – so sperrst du dich nicht versehentlich aus.
      </p>
    </div>
  );
}
