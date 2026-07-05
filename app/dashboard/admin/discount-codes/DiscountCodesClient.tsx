"use client";

import { useEffect, useState } from "react";

type Code = {
  id: number;
  code: string;
  kind: string;
  value: number;
  scope: string;
  active: boolean;
  max_uses: number | null;
  used_count: number;
  valid_until: string | null;
  restrict_type: string | null;
  restrict_package: string | null;
  description: string | null;
};

const KIND_LABELS: Record<string, string> = {
  percent: "Prozent",
  fixed: "Fixbetrag",
  full: "100 % (frei)",
};

export default function DiscountCodesClient() {
  const [codes, setCodes] = useState<Code[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Formular für neuen Code
  const [code, setCode] = useState("");
  const [kind, setKind] = useState("percent");
  const [value, setValue] = useState("");
  const [scope, setScope] = useState("participant");
  const [maxUses, setMaxUses] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/discount-codes", { cache: "no-store" });
      const data = await res.json().catch(() => null);
      if (res.ok && Array.isArray(data)) setCodes(data);
      else setError(data?.detail ?? data?.error ?? "Codes konnten nicht geladen werden.");
    } catch {
      setError("Server nicht erreichbar.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function createCode() {
    if (!code.trim()) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/discount-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.trim(),
          kind,
          value: kind === "full" ? 0 : Number(value) || 0,
          scope,
          max_uses: maxUses.trim() ? Number(maxUses) : null,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.detail ?? data?.error ?? "Code konnte nicht angelegt werden.");
        return;
      }
      setCode("");
      setValue("");
      setMaxUses("");
      await load();
    } catch {
      setError("Server nicht erreichbar.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(c: Code) {
    await fetch(`/api/discount-codes/${c.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !c.active }),
    });
    await load();
  }

  async function remove(c: Code) {
    await fetch(`/api/discount-codes/${c.id}`, { method: "DELETE" });
    await load();
  }

  return (
    <main className="app-shell pt-[73px]">
      <section className="container py-12">
        <p className="eyebrow mb-3">Admin</p>
        <h1 className="heading-2 text-neutral-900">Rabattcodes</h1>
        <p className="mt-2 max-w-2xl text-neutral-600">
          Codes werden von Teilnehmern im Bezahl-Schritt eingelöst. Typ, Wert und Geltung
          bestimmt der Code selbst.
        </p>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-semibold text-red-700">{error}</p>
          </div>
        )}

        {/* Neuer Code */}
        <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6">
          <h2 className="text-base font-bold text-neutral-900">Neuen Code anlegen</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <label className="block">
              <span className="text-xs font-semibold text-neutral-600">Code</span>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="z.B. SOMMER25"
                className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-accent-500"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-neutral-600">Typ</span>
              <select
                value={kind}
                onChange={(e) => setKind(e.target.value)}
                className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-accent-500"
              >
                <option value="percent">Prozent</option>
                <option value="fixed">Fixbetrag (€)</option>
                <option value="full">100 % (frei)</option>
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-neutral-600">Wert</span>
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                disabled={kind === "full"}
                placeholder={kind === "percent" ? "z.B. 25" : "z.B. 50"}
                className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-accent-500 disabled:bg-neutral-100"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-neutral-600">Geltung</span>
              <select
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-accent-500"
              >
                <option value="participant">pro Partei</option>
                <option value="case">pro Fall</option>
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-neutral-600">Max. Nutzungen</span>
              <input
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                placeholder="leer = ∞"
                className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-accent-500"
              />
            </label>
          </div>
          <button
            type="button"
            onClick={createCode}
            disabled={saving || !code.trim()}
            className="btn btn-primary mt-4 disabled:opacity-60"
          >
            {saving ? "Wird angelegt…" : "Code anlegen"}
          </button>
        </div>

        {/* Liste */}
        <div className="mt-8">
          {loading ? (
            <p className="text-sm text-neutral-500">Codes werden geladen…</p>
          ) : codes.length === 0 ? (
            <p className="text-sm text-neutral-500">Noch keine Rabattcodes angelegt.</p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-neutral-200">
              <table className="w-full text-sm">
                <thead className="bg-neutral-50 text-left text-xs uppercase text-neutral-500">
                  <tr>
                    <th className="px-4 py-3">Code</th>
                    <th className="px-4 py-3">Typ</th>
                    <th className="px-4 py-3">Wert</th>
                    <th className="px-4 py-3">Geltung</th>
                    <th className="px-4 py-3">Nutzung</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {codes.map((c) => (
                    <tr key={c.id} className="border-t border-neutral-100">
                      <td className="px-4 py-3 font-mono font-semibold">{c.code}</td>
                      <td className="px-4 py-3">{KIND_LABELS[c.kind] ?? c.kind}</td>
                      <td className="px-4 py-3">
                        {c.kind === "full" ? "—" : c.kind === "percent" ? `${c.value}%` : `${c.value} €`}
                      </td>
                      <td className="px-4 py-3">{c.scope === "case" ? "pro Fall" : "pro Partei"}</td>
                      <td className="px-4 py-3">
                        {c.used_count}
                        {c.max_uses != null ? ` / ${c.max_uses}` : ""}
                      </td>
                      <td className="px-4 py-3">
                        <span className={c.active ? "text-accent-700" : "text-neutral-400"}>
                          {c.active ? "aktiv" : "inaktiv"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => toggleActive(c)}
                          className="mr-3 text-xs font-semibold text-neutral-600 underline"
                        >
                          {c.active ? "Deaktivieren" : "Aktivieren"}
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(c)}
                          className="text-xs font-semibold text-red-600 underline"
                        >
                          Löschen
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
