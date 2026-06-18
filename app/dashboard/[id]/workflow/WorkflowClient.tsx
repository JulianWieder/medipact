"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { hashId } from "@/lib/ids";
import { PHASES } from "../_shared/phaseData";

type Props = { mediationId: string; userRole: string };

type WorkflowRule = {
  phase: string;
  step: string;
  required_roles: string[] | null;
  skip: boolean;
};

type WorkflowRulesResponse = {
  default_required_roles: string[];
  available_roles: string[];
  rules: WorkflowRule[];
};

type CatalogEntry = {
  phase: string;
  step: string;
  phaseLabel: string;
  title: string;
};

const roleLabel: Record<string, string> = {
  initiator: "Antragsteller",
  other_party: "Andere Seite",
  owner: "Antragsteller",
  mediator: "Mediator",
  admin: "Admin",
};

const CONTRACT_RULE_PHASE = "__contract__";

function buildCatalog(): CatalogEntry[] {
  const einleitung = PHASES.find((p) => p.key === "einleitung");
  const entries: CatalogEntry[] = [];

  if (einleitung) {
    for (const step of einleitung.stepDetails) {
      entries.push({
        phase: step.key,
        step: "",
        phaseLabel: einleitung.shortLabel,
        title: step.title,
      });
    }
  }

  entries.push({
    phase: CONTRACT_RULE_PHASE,
    step: "",
    phaseLabel: einleitung?.shortLabel ?? "Einleitung",
    title: "Vertragsunterschrift",
  });

  for (const phase of PHASES) {
    if (phase.key === "einleitung") continue;
    for (const step of phase.stepDetails) {
      entries.push({
        phase: phase.key,
        step: step.key,
        phaseLabel: phase.shortLabel,
        title: step.title,
      });
    }
  }

  return entries;
}

const CATALOG = buildCatalog();

export default function WorkflowClient({ mediationId, userRole }: Props) {
  const router = useRouter();
  const [data, setData] = useState<WorkflowRulesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingKey, setSavingKey] = useState<string | null>(null);
  // key = `${phase}::${step}` -> Set der ausgewählten Rollen
  const [selections, setSelections] = useState<Record<string, Set<string>>>({});
  const [skips, setSkips] = useState<Record<string, boolean>>({});

  const allowed = userRole === "mediator" || userRole === "admin";

  function keyFor(phase: string, step: string) {
    return `${phase}::${step}`;
  }

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/mediations/${mediationId}/workflow-rules`);
        if (!res.ok) {
          setError(`Konnte Workflow-Einstellungen nicht laden (${res.status}).`);
          return;
        }
        const body: WorkflowRulesResponse = await res.json();
        setData(body);

        const nextSelections: Record<string, Set<string>> = {};
        const nextSkips: Record<string, boolean> = {};
        for (const entry of CATALOG) {
          const k = keyFor(entry.phase, entry.step);
          const rule = body.rules.find((r) => r.phase === entry.phase && r.step === entry.step);
          if (rule?.required_roles) {
            nextSelections[k] = new Set(rule.required_roles);
          } else {
            nextSelections[k] = new Set(
              body.default_required_roles.filter((r) => body.available_roles.includes(r)),
            );
          }
          nextSkips[k] = rule?.skip ?? false;
        }
        setSelections(nextSelections);
        setSkips(nextSkips);
      } catch {
        setError("Server nicht erreichbar.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [mediationId]);

  const hasOverride = useMemo(() => {
    if (!data) return {};
    const result: Record<string, boolean> = {};
    for (const entry of CATALOG) {
      const k = keyFor(entry.phase, entry.step);
      result[k] = data.rules.some((r) => r.phase === entry.phase && r.step === entry.step);
    }
    return result;
  }, [data]);

  function toggleRole(key: string, role: string) {
    setSelections((prev) => {
      const next = new Set(prev[key] ?? []);
      if (next.has(role)) next.delete(role);
      else next.add(role);
      return { ...prev, [key]: next };
    });
  }

  function toggleSkip(key: string) {
    setSkips((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function saveRule(entry: CatalogEntry) {
    const k = keyFor(entry.phase, entry.step);
    setSavingKey(k);
    setError("");
    try {
      const res = await fetch(`/api/mediations/${mediationId}/workflow-rules`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phase: entry.phase,
          step: entry.step,
          required_roles: Array.from(selections[k] ?? []),
          skip: skips[k] ?? false,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(`Speichern fehlgeschlagen (${res.status}): ${body?.detail ?? "Unbekannter Fehler"}`);
        return;
      }
      setData((prev) => {
        if (!prev) return prev;
        const updated = prev.rules.filter((r) => !(r.phase === entry.phase && r.step === entry.step));
        updated.push({
          phase: entry.phase,
          step: entry.step,
          required_roles: Array.from(selections[k] ?? []),
          skip: skips[k] ?? false,
        });
        return { ...prev, rules: updated };
      });
    } catch {
      setError("Server nicht erreichbar.");
    } finally {
      setSavingKey(null);
    }
  }

  async function resetRule(entry: CatalogEntry) {
    const k = keyFor(entry.phase, entry.step);
    setSavingKey(k);
    setError("");
    try {
      const res = await fetch(
        `/api/mediations/${mediationId}/workflow-rules?phase=${encodeURIComponent(entry.phase)}&step=${encodeURIComponent(entry.step)}`,
        { method: "DELETE" },
      );
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(`Zurücksetzen fehlgeschlagen (${res.status}): ${body?.detail ?? "Unbekannter Fehler"}`);
        return;
      }
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          rules: prev.rules.filter((r) => !(r.phase === entry.phase && r.step === entry.step)),
        };
      });
      setSelections((prev) => ({
        ...prev,
        [k]: new Set(
          (data?.default_required_roles ?? []).filter((r) => data?.available_roles.includes(r)),
        ),
      }));
      setSkips((prev) => ({ ...prev, [k]: false }));
    } catch {
      setError("Server nicht erreichbar.");
    } finally {
      setSavingKey(null);
    }
  }

  if (!allowed) {
    return (
      <main className="app-shell pt-[73px]">
        <section className="container py-12">
          <div className="app-surface p-8">
            <p className="eyebrow mb-3">Workflow-Einstellungen</p>
            <h1 className="heading-2 text-slate-900">Kein Zugriff</h1>
            <p className="mt-3 text-sm text-slate-600">
              Nur Mediatoren und Admins können den Workflow für einen Fall anpassen.
            </p>
            <button type="button" onClick={() => router.back()} className="btn btn-ghost mt-6">
              ← Zurück
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell pt-[73px]">
      <section className="container py-12">
        <div className="app-surface p-8">
          <p className="eyebrow mb-3">Workflow-Einstellungen</p>
          <h1 className="heading-2 text-slate-900">Wer muss welchen Schritt abschließen?</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-600">
            Standardmäßig müssen nur die Konfliktparteien
            ({(data?.default_required_roles ?? []).map((r) => roleLabel[r] ?? r).join(", ")})
            einen Schritt abschließen, damit er als erledigt gilt. Hier kannst du das pro Fall
            anpassen — z.B. den Mediator zusätzlich einbeziehen oder einen Schritt überspringen.
            Diese Einstellungen gelten nur für diese Mediation.
          </p>

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-700">{error}</p>
            </div>
          )}

          {loading ? (
            <p className="mt-8 text-sm text-slate-500">Lädt …</p>
          ) : (
            <div className="mt-8 space-y-4">
              {CATALOG.map((entry) => {
                const k = keyFor(entry.phase, entry.step);
                const selected = selections[k] ?? new Set<string>();
                const skip = skips[k] ?? false;
                const overridden = hasOverride[k];
                return (
                  <div
                    key={k}
                    className={`rounded-xl border p-4 ${
                      overridden ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          {entry.phaseLabel}
                        </p>
                        <h3 className="text-sm font-bold text-slate-800">{entry.title}</h3>
                      </div>
                      {overridden && (
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                          Angepasst
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <input
                          type="checkbox"
                          checked={skip}
                          onChange={() => toggleSkip(k)}
                          className="h-4 w-4 rounded border-slate-300"
                        />
                        Schritt für diesen Fall überspringen
                      </label>
                    </div>

                    {!skip && (
                      <div className="mt-3 flex flex-wrap gap-3">
                        {(data?.available_roles ?? []).map((role) => (
                          <label
                            key={role}
                            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                          >
                            <input
                              type="checkbox"
                              checked={selected.has(role)}
                              onChange={() => toggleRole(k, role)}
                              className="h-4 w-4 rounded border-slate-300"
                            />
                            {roleLabel[role] ?? role}
                          </label>
                        ))}
                      </div>
                    )}

                    <div className="mt-4 flex gap-3">
                      <button
                        type="button"
                        onClick={() => saveRule(entry)}
                        disabled={savingKey === k}
                        className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {savingKey === k ? "Speichert …" : "Speichern"}
                      </button>
                      {overridden && (
                        <button
                          type="button"
                          onClick={() => resetRule(entry)}
                          disabled={savingKey === k}
                          className="btn btn-ghost disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Auf Standard zurücksetzen
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={() => router.push(`/dashboard/${hashId(mediationId)}`)}
              className="btn btn-ghost"
            >
              ← Zurück zum Fall
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
