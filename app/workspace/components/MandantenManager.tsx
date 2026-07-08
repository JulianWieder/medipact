"use client";

// ── Mandanten-Manager (Mandantenfähigkeit) ──────────────────────────────────
//
// Nur für echte Administratoren (analog BenutzerManager). Ein Mandant
// (Kanzlei/Praxis) kann mehrere Mediatoren haben; das Abo hängt am Mandanten:
// Monatspreis = Grundpreis + Aufpreis je zusätzlichem Mediator (je Plan).
// Preislogik zentral im Backend (app/pricing.py, "Mandanten-Abos").

import { useCallback, useEffect, useMemo, useState } from "react";
import type { AboPlan, Organization, SystemUser } from "../types";
import {
  addOrganizationMember,
  createOrganization,
  deleteOrganization,
  fetchAboPlans,
  fetchAllUsers,
  fetchOrganization,
  fetchOrganizations,
  removeOrganizationMember,
  updateOrganization,
} from "../api";
import { SectionHeader, WCard, EmptyState, cn } from "../ui";

const eur = (v: number) =>
  v.toLocaleString("de-DE", { style: "currency", currency: "EUR" });

export function MandantenManager() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [plans, setPlans] = useState<AboPlan[]>([]);
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [detail, setDetail] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Anlegen-Formular
  const [newName, setNewName] = useState("");
  const [newPlan, setNewPlan] = useState("starter");
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([fetchOrganizations(), fetchAboPlans(), fetchAllUsers()])
      .then(([o, p, u]) => {
        setOrgs(o);
        setPlans(p);
        setUsers(u);
      })
      .catch(() => setError("Mandanten konnten nicht geladen werden."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openDetail = useCallback(async (orgId: number) => {
    setExpanded(orgId);
    setDetail(null);
    try {
      setDetail(await fetchOrganization(orgId));
    } catch {
      setError("Mandant konnte nicht geladen werden.");
    }
  }, []);

  // Mediatoren ohne Mandant (Kandidaten für Zuordnung)
  const freieMediatoren = useMemo(
    () => users.filter((u) => u.role === "mediator" && !u.organization_id),
    [users],
  );

  async function refresh(orgId?: number) {
    const [o, u] = await Promise.all([fetchOrganizations(), fetchAllUsers()]);
    setOrgs(o);
    setUsers(u);
    if (orgId) setDetail(await fetchOrganization(orgId).catch(() => null));
  }

  async function handleCreate() {
    if (!newName.trim()) return;
    setBusy(true);
    setError("");
    try {
      await createOrganization(newName.trim(), newPlan);
      setNewName("");
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Mandant konnte nicht angelegt werden.");
    } finally {
      setBusy(false);
    }
  }

  async function handlePlanChange(org: Organization, plan: string) {
    if (plan === org.plan) return;
    setBusy(true);
    setError("");
    try {
      await updateOrganization(org.id, { plan });
      await refresh(expanded === org.id ? org.id : undefined);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Plan konnte nicht geändert werden.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(orgId: number) {
    setBusy(true);
    setError("");
    try {
      await deleteOrganization(orgId);
      setConfirmDeleteId(null);
      if (expanded === orgId) setExpanded(null);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Mandant konnte nicht gelöscht werden.");
    } finally {
      setBusy(false);
    }
  }

  async function handleAddMember(orgId: number, userId: number) {
    setBusy(true);
    setError("");
    try {
      await addOrganizationMember(orgId, userId);
      await refresh(orgId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Nutzer konnte nicht zugeordnet werden.");
    } finally {
      setBusy(false);
    }
  }

  async function handleRemoveMember(orgId: number, userId: number) {
    setBusy(true);
    setError("");
    try {
      await removeOrganizationMember(orgId, userId);
      await refresh(orgId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Zuordnung konnte nicht gelöst werden.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="p-6 max-w-5xl">
      <SectionHeader label="Administration" title="Mandanten & Abos" />
      <p className="mb-5 max-w-2xl text-sm text-neutral-500">
        Ein Mandant (Kanzlei/Praxis) kann mehrere Mediatoren haben. Der monatliche
        Abo-Preis richtet sich nach Plan und Mediatoren-Anzahl.
      </p>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Plan-Übersicht */}
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {plans.map((p) => (
          <WCard key={p.key} className="p-4">
            <div className="text-sm font-semibold text-neutral-800">{p.label}</div>
            <div className="mt-1 text-lg font-bold text-neutral-900">
              {eur(p.base_eur)}
              <span className="text-xs font-normal text-neutral-400"> / Monat</span>
            </div>
            <div className="mt-1 text-xs text-neutral-500">
              {p.included_mediators}{" "}
              {p.included_mediators === 1 ? "Mediator" : "Mediatoren"} inklusive, je
              weiterer {eur(p.per_mediator_eur)}/Monat
              {p.max_mediators != null ? ` · max. ${p.max_mediators}` : " · unbegrenzt"}
            </div>
          </WCard>
        ))}
      </div>

      {/* Neuen Mandanten anlegen */}
      <WCard className="mb-6 p-4">
        <div className="mb-2 text-sm font-semibold text-neutral-800">Neuen Mandanten anlegen</div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Name (z.B. Kanzlei Müller)"
            className="w-64 rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-accent-400"
          />
          <select
            value={newPlan}
            onChange={(e) => setNewPlan(e.target.value)}
            className="rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-accent-400"
          >
            {plans.map((p) => (
              <option key={p.key} value={p.key}>
                {p.label}
              </option>
            ))}
          </select>
          <button
            onClick={handleCreate}
            disabled={busy || !newName.trim()}
            className={cn(
              "rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white",
              (busy || !newName.trim()) && "opacity-50",
            )}
          >
            Anlegen
          </button>
        </div>
      </WCard>

      {/* Mandanten-Liste */}
      {loading ? (
        <p className="text-sm text-neutral-400">Lade Mandanten…</p>
      ) : orgs.length === 0 ? (
        <EmptyState icon="🏢" text="Noch keine Mandanten – lege oben den ersten an." />
      ) : (
        <div className="space-y-3">
          {orgs.map((org) => (
            <WCard key={org.id} className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => (expanded === org.id ? setExpanded(null) : openDetail(org.id))}
                  className="text-left"
                >
                  <div className="text-sm font-semibold text-neutral-900">{org.name}</div>
                  <div className="text-xs text-neutral-500">
                    {org.mediator_count}{" "}
                    {org.mediator_count === 1 ? "Mediator" : "Mediatoren"} ·{" "}
                    <span className="font-semibold text-neutral-700">
                      {eur(org.monthly_price_eur)}/Monat
                    </span>
                  </div>
                </button>
                <div className="flex items-center gap-2">
                  <select
                    value={org.plan}
                    disabled={busy}
                    onChange={(e) => handlePlanChange(org, e.target.value)}
                    className="rounded-lg border border-neutral-200 px-2 py-1.5 text-xs outline-none focus:border-accent-400"
                  >
                    {plans.map((p) => (
                      <option key={p.key} value={p.key}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                  {confirmDeleteId === org.id ? (
                    <>
                      <button
                        onClick={() => handleDelete(org.id)}
                        disabled={busy}
                        className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white"
                      >
                        Wirklich löschen
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs"
                      >
                        Abbrechen
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(org.id)}
                      className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs text-neutral-500 hover:border-red-200 hover:text-red-600"
                    >
                      Löschen
                    </button>
                  )}
                </div>
              </div>

              {/* Detail: Mitglieder */}
              {expanded === org.id && (
                <div className="mt-4 border-t border-neutral-100 pt-4">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                    Mitglieder
                  </div>
                  {!detail ? (
                    <p className="text-sm text-neutral-400">Lade…</p>
                  ) : (detail.members ?? []).length === 0 ? (
                    <p className="text-sm text-neutral-400">Noch keine Mitglieder zugeordnet.</p>
                  ) : (
                    <ul className="space-y-1.5">
                      {(detail.members ?? []).map((m) => (
                        <li
                          key={m.id}
                          className="flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2 text-sm"
                        >
                          <span>
                            <span className="font-medium text-neutral-800">{m.name}</span>{" "}
                            <span className="text-neutral-400">({m.email})</span>{" "}
                            <span className="text-xs text-neutral-500">– {m.role}</span>
                          </span>
                          <button
                            onClick={() => handleRemoveMember(org.id, m.id)}
                            disabled={busy}
                            className="text-xs text-neutral-400 hover:text-red-600"
                          >
                            Entfernen
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  {freieMediatoren.length > 0 && (
                    <div className="mt-3 flex items-center gap-2">
                      <select
                        id={`add-member-${org.id}`}
                        defaultValue=""
                        className="rounded-lg border border-neutral-200 px-2 py-1.5 text-xs outline-none focus:border-accent-400"
                      >
                        <option value="" disabled>
                          Mediator zuordnen…
                        </option>
                        {freieMediatoren.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.name} ({u.email})
                          </option>
                        ))}
                      </select>
                      <button
                        disabled={busy}
                        onClick={() => {
                          const sel = document.getElementById(
                            `add-member-${org.id}`,
                          ) as HTMLSelectElement | null;
                          const val = sel?.value;
                          if (val) handleAddMember(org.id, Number(val));
                        }}
                        className="rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                      >
                        Zuordnen
                      </button>
                    </div>
                  )}
                </div>
              )}
            </WCard>
          ))}
        </div>
      )}
    </div>
  );
}
