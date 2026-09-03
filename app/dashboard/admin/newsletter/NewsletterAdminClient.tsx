"use client";

// ── Newsletter-Verwaltung ────────────────────────────────────────────────────
//
// Zwei Bereiche: der Verteiler (wer steht drin, in welchem Zustand) und die
// Ausgaben (schreiben, testen, versenden).
//
// Wichtig beim Lesen: "bestätigt" ist die einzige Gruppe, die je eine Mail
// bekommt. Wer nur angemeldet, aber nicht bestätigt ist, zählt nicht als
// Empfänger – ohne den Klick fehlt der Nachweis der Einwilligung.

import { useCallback, useEffect, useState } from "react";

type Subscriber = {
  id: number;
  email: string;
  active: boolean;
  confirmed: boolean;
  source: string | null;
  created_at: string | null;
  confirmed_at: string | null;
  unsubscribed_at: string | null;
  consent_ip: string | null;
};

type Counts = {
  total: number;
  confirmed: number;
  pending: number;
  unsubscribed: number;
};

type Campaign = {
  id: number;
  subject: string;
  heading: string;
  body: string;
  cta_label: string | null;
  cta_url: string | null;
  status: string;
  created_by: string | null;
  created_at: string | null;
  sent_at: string | null;
  sent_count: number;
  failed_count: number;
};

const EMPTY_DRAFT = {
  subject: "",
  heading: "",
  body: "",
  cta_label: "",
  cta_url: "",
};

const STATUS_FILTERS: { id: string; label: string }[] = [
  { id: "all", label: "Alle" },
  { id: "confirmed", label: "Bestätigt" },
  { id: "pending", label: "Unbestätigt" },
  { id: "unsubscribed", label: "Abgemeldet" },
];

const CAMPAIGN_BADGE: Record<string, string> = {
  draft: "border-neutral-200 bg-neutral-50 text-neutral-600",
  sending: "border-amber-200 bg-amber-50 text-amber-700",
  sent: "border-accent-200 bg-accent-50 text-accent-700",
};

const CAMPAIGN_LABEL: Record<string, string> = {
  draft: "Entwurf",
  sending: "Versand läuft",
  sent: "Versendet",
};

function formatDate(value: string | null): string {
  if (!value) return "–";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "–";
  return d.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function NewsletterAdminClient({ canSend }: { canSend: boolean }) {
  const [tab, setTab] = useState<"verteiler" | "ausgaben">("verteiler");

  // ── Verteiler ──────────────────────────────────────────────────────────────
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [counts, setCounts] = useState<Counts>({
    total: 0,
    confirmed: 0,
    pending: 0,
    unsubscribed: 0,
  });
  const [filter, setFilter] = useState("all");
  const [loadingList, setLoadingList] = useState(true);

  // ── Ausgaben ───────────────────────────────────────────────────────────────
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [draft, setDraft] = useState({ ...EMPTY_DRAFT });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [testEmail, setTestEmail] = useState("");
  const [confirmSendId, setConfirmSendId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadSubscribers = useCallback(async (status: string) => {
    setLoadingList(true);
    try {
      const res = await fetch(`/api/admin/newsletter?status=${status}`, {
        cache: "no-store",
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.detail ?? data?.error ?? "Verteiler konnte nicht geladen werden.");
        return;
      }
      setSubscribers(data?.subscribers ?? []);
      setCounts(data?.counts ?? counts);
    } catch {
      setError("Server nicht erreichbar.");
    } finally {
      setLoadingList(false);
    }
    // counts bewusst nicht in den Abhängigkeiten: der Fallback ist nur ein
    // Platzhalter, sonst liefe der Effekt bei jedem Laden erneut.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCampaigns = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/newsletter/campaigns", { cache: "no-store" });
      const data = await res.json().catch(() => null);
      if (res.ok && Array.isArray(data)) setCampaigns(data);
    } catch {
      /* still – der Verteiler ist wichtiger als die Liste der Ausgaben */
    }
  }, []);

  useEffect(() => {
    loadSubscribers(filter);
  }, [filter, loadSubscribers]);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  function exportCsv() {
    const header = [
      "email",
      "status",
      "quelle",
      "angemeldet_am",
      "bestaetigt_am",
      "abgemeldet_am",
      "ip",
    ];
    const rows = subscribers.map((s) => [
      s.email,
      !s.active ? "abgemeldet" : s.confirmed ? "bestaetigt" : "unbestaetigt",
      s.source ?? "",
      s.created_at ?? "",
      s.confirmed_at ?? "",
      s.unsubscribed_at ?? "",
      s.consent_ip ?? "",
    ]);
    // Semikolon als Trenner: Excel in deutscher Einstellung erwartet das,
    // sonst landet die ganze Zeile in einer Spalte.
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(";"))
      .join("\n");
    // BOM voran, sonst zerlegt Excel die Umlaute.
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-verteiler-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function unsubscribeByHand(sub: Subscriber) {
    setError("");
    try {
      const res = await fetch(`/api/admin/newsletter/subscribers/${sub.id}/unsubscribe`, {
        method: "POST",
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.detail ?? data?.error ?? "Abmeldung fehlgeschlagen.");
        return;
      }
      await loadSubscribers(filter);
      setNotice(`${sub.email} wurde abgemeldet.`);
    } catch {
      setError("Server nicht erreichbar.");
    }
  }

  async function saveDraft() {
    if (!draft.subject.trim()) {
      setError("Der Betreff fehlt.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const url = editingId
        ? `/api/admin/newsletter/campaigns/${editingId}`
        : "/api/admin/newsletter/campaigns";
      const res = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.detail ?? data?.error ?? "Entwurf konnte nicht gespeichert werden.");
        return;
      }
      setNotice("Entwurf gespeichert.");
      setEditingId(data?.id ?? editingId);
      await loadCampaigns();
    } catch {
      setError("Server nicht erreichbar.");
    } finally {
      setSaving(false);
    }
  }

  function editCampaign(c: Campaign) {
    setEditingId(c.id);
    setDraft({
      subject: c.subject,
      heading: c.heading ?? "",
      body: c.body ?? "",
      cta_label: c.cta_label ?? "",
      cta_url: c.cta_url ?? "",
    });
    setNotice("");
    setError("");
  }

  function newDraft() {
    setEditingId(null);
    setDraft({ ...EMPTY_DRAFT });
    setNotice("");
    setError("");
  }

  async function sendTest() {
    if (!editingId) {
      setError("Bitte zuerst den Entwurf speichern.");
      return;
    }
    if (!testEmail.trim()) {
      setError("Bitte eine Adresse für den Test angeben.");
      return;
    }
    setError("");
    try {
      const res = await fetch(`/api/admin/newsletter/campaigns/${editingId}/test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: testEmail.trim() }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.detail ?? data?.error ?? "Testversand fehlgeschlagen.");
        return;
      }
      setNotice(`Testmail an ${testEmail.trim()} verschickt.`);
    } catch {
      setError("Server nicht erreichbar.");
    }
  }

  async function sendCampaign(c: Campaign) {
    setError("");
    try {
      const res = await fetch(`/api/admin/newsletter/campaigns/${c.id}/send`, {
        method: "POST",
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.detail ?? data?.error ?? "Versand konnte nicht gestartet werden.");
        return;
      }
      setConfirmSendId(null);
      setNotice(
        `Versand gestartet: ${data?.recipients ?? 0} Empfänger. Das läuft im Hintergrund weiter – die Liste zeigt den Stand nach dem Aktualisieren.`,
      );
      await loadCampaigns();
    } catch {
      setError("Server nicht erreichbar.");
    }
  }

  async function deleteCampaign(c: Campaign) {
    setError("");
    try {
      const res = await fetch(`/api/admin/newsletter/campaigns/${c.id}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.detail ?? data?.error ?? "Entwurf konnte nicht gelöscht werden.");
        return;
      }
      if (editingId === c.id) newDraft();
      await loadCampaigns();
    } catch {
      setError("Server nicht erreichbar.");
    }
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
        Administration
      </div>
      <h1 className="mb-2 text-2xl font-black text-neutral-900">Newsletter</h1>
      <p className="mb-6 max-w-2xl text-sm text-neutral-500">
        Versendet wird ausschließlich an bestätigte Adressen. Wer die Anmeldung nicht
        über den Link in der Bestätigungsmail bestätigt hat, bleibt außen vor – ohne
        diesen Nachweis ist Werbung per Mail in Deutschland nicht zulässig.
      </p>

      {/* Zähler */}
      <div className="mb-6 flex flex-wrap gap-3">
        {[
          { label: "Empfänger (bestätigt)", value: counts.confirmed },
          { label: "Unbestätigt", value: counts.pending },
          { label: "Abgemeldet", value: counts.unsubscribed },
          { label: "Gesamt", value: counts.total },
        ].map((k) => (
          <div key={k.label} className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5">
            <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              {k.label}
            </div>
            <div className="text-lg font-semibold text-neutral-900">{k.value}</div>
          </div>
        ))}
      </div>

      {/* Reiter */}
      <div className="mb-5 flex gap-2 border-b border-neutral-200">
        {[
          { id: "verteiler" as const, label: "Verteiler" },
          { id: "ausgaben" as const, label: "Ausgaben" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={
              tab === t.id
                ? "-mb-px border-b-2 border-accent-600 px-4 py-2 text-sm font-semibold text-accent-700"
                : "-mb-px border-b-2 border-transparent px-4 py-2 text-sm font-medium text-neutral-500 hover:text-neutral-700"
            }
          >
            {t.label}
          </button>
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
      {notice && (
        <div className="mb-4 rounded-xl border border-accent-200 bg-accent-50 px-4 py-2.5 text-sm text-accent-800">
          {notice}
          <button onClick={() => setNotice("")} className="ml-3 text-xs underline">
            ausblenden
          </button>
        </div>
      )}

      {/* ── Verteiler ───────────────────────────────────────────────────────── */}
      {tab === "verteiler" && (
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          <div className="flex flex-wrap items-center gap-2 border-b border-neutral-100 px-5 py-3">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={
                  filter === f.id
                    ? "rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white"
                    : "rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-50"
                }
              >
                {f.label}
              </button>
            ))}
            <div className="flex-1" />
            <button
              onClick={exportCsv}
              disabled={subscribers.length === 0}
              className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 disabled:opacity-40"
            >
              CSV exportieren
            </button>
            <button
              onClick={() => loadSubscribers(filter)}
              className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-50"
            >
              Aktualisieren
            </button>
          </div>

          {loadingList ? (
            <div className="p-6 text-sm text-neutral-400">Lädt …</div>
          ) : subscribers.length === 0 ? (
            <div className="p-6 text-sm text-neutral-400">
              Keine Einträge in dieser Ansicht.
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {subscribers.map((s) => (
                <div
                  key={s.id}
                  className="flex flex-wrap items-center gap-3 px-5 py-3 hover:bg-neutral-50/60"
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-neutral-800">
                      {s.email}
                    </div>
                    <div className="text-xs text-neutral-400">
                      angemeldet {formatDate(s.created_at)}
                      {s.source ? ` · ${s.source}` : ""}
                      {s.confirmed ? ` · bestätigt ${formatDate(s.confirmed_at)}` : ""}
                    </div>
                  </div>

                  <span
                    className={
                      !s.active
                        ? "shrink-0 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 text-[10px] font-semibold text-neutral-500"
                        : s.confirmed
                          ? "shrink-0 rounded-full border border-accent-200 bg-accent-50 px-2.5 py-0.5 text-[10px] font-semibold text-accent-700"
                          : "shrink-0 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700"
                    }
                  >
                    {!s.active ? "abgemeldet" : s.confirmed ? "bestätigt" : "unbestätigt"}
                  </span>

                  {canSend && s.active && (
                    <button
                      onClick={() => unsubscribeByHand(s)}
                      className="shrink-0 rounded-lg border border-neutral-200 px-2.5 py-1.5 text-xs font-semibold text-neutral-500 hover:bg-red-50 hover:text-red-600"
                      title="Von Hand abmelden"
                    >
                      Abmelden
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Ausgaben ────────────────────────────────────────────────────────── */}
      {tab === "ausgaben" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-neutral-800">
                {editingId ? `Entwurf #${editingId} bearbeiten` : "Neue Ausgabe"}
              </h2>
              {editingId && (
                <button
                  onClick={newDraft}
                  className="text-xs font-semibold text-neutral-500 underline"
                >
                  Neuer Entwurf
                </button>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  Betreff
                </label>
                <input
                  value={draft.subject}
                  onChange={(e) => setDraft((d) => ({ ...d, subject: e.target.value }))}
                  placeholder="Worum geht es in dieser Ausgabe?"
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent-400"
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  Überschrift in der Mail (leer = Betreff)
                </label>
                <input
                  value={draft.heading}
                  onChange={(e) => setDraft((d) => ({ ...d, heading: e.target.value }))}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent-400"
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  Text (Absätze durch eine Leerzeile trennen)
                </label>
                <textarea
                  value={draft.body}
                  onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))}
                  rows={10}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm leading-6 focus:outline-none focus:ring-1 focus:ring-accent-400"
                />
                <p className="mt-1 text-xs text-neutral-400">
                  Reiner Text – HTML wird bewusst nicht übernommen. Für einen Link
                  nutzen Sie den Knopf unten.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="min-w-[10rem] flex-1">
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    Knopf-Beschriftung (optional)
                  </label>
                  <input
                    value={draft.cta_label}
                    onChange={(e) => setDraft((d) => ({ ...d, cta_label: e.target.value }))}
                    placeholder="Artikel lesen"
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent-400"
                  />
                </div>
                <div className="min-w-[14rem] flex-[2]">
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    Knopf-Ziel (optional)
                  </label>
                  <input
                    value={draft.cta_url}
                    onChange={(e) => setDraft((d) => ({ ...d, cta_url: e.target.value }))}
                    placeholder="https://medipact.de/ratgeber/..."
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent-400"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-end gap-3 border-t border-neutral-100 pt-4">
              <button
                onClick={saveDraft}
                disabled={saving || !canSend}
                className="rounded-lg bg-accent-600 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-700 disabled:opacity-50"
              >
                {saving ? "Speichert …" : "Entwurf speichern"}
              </button>
              <div className="flex items-end gap-2">
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    Testadresse
                  </label>
                  <input
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="ich@medipact.de"
                    className="rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent-400"
                  />
                </div>
                <button
                  onClick={sendTest}
                  disabled={!canSend || !editingId}
                  className="rounded-lg border border-neutral-200 px-3 py-2 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 disabled:opacity-40"
                  title={editingId ? "" : "Erst speichern, dann testen"}
                >
                  Testmail senden
                </button>
              </div>
            </div>
            {!canSend && (
              <p className="mt-3 text-xs text-neutral-400">
                Nur Administratoren dürfen Ausgaben anlegen und versenden.
              </p>
            )}
          </div>

          {/* Liste der Ausgaben */}
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3">
              <h2 className="text-sm font-semibold text-neutral-800">Alle Ausgaben</h2>
              <button
                onClick={loadCampaigns}
                className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-50"
              >
                Aktualisieren
              </button>
            </div>
            {campaigns.length === 0 ? (
              <div className="p-6 text-sm text-neutral-400">Noch keine Ausgabe angelegt.</div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {campaigns.map((c) => (
                  <div key={c.id} className="px-5 py-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium text-neutral-800">
                          {c.subject}
                        </div>
                        <div className="text-xs text-neutral-400">
                          angelegt {formatDate(c.created_at)}
                          {c.status === "sent"
                            ? ` · versendet ${formatDate(c.sent_at)} · ${c.sent_count} zugestellt${
                                c.failed_count ? `, ${c.failed_count} fehlgeschlagen` : ""
                              }`
                            : ""}
                        </div>
                      </div>
                      <span
                        className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${
                          CAMPAIGN_BADGE[c.status] ?? CAMPAIGN_BADGE.draft
                        }`}
                      >
                        {CAMPAIGN_LABEL[c.status] ?? c.status}
                      </span>

                      {c.status === "draft" && (
                        <>
                          <button
                            onClick={() => editCampaign(c)}
                            className="shrink-0 rounded-lg border border-neutral-200 px-2.5 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-50"
                          >
                            Bearbeiten
                          </button>
                          {canSend &&
                            (confirmSendId === c.id ? (
                              <div className="flex shrink-0 items-center gap-1">
                                <button
                                  onClick={() => sendCampaign(c)}
                                  className="rounded-lg bg-accent-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-accent-700"
                                >
                                  An {counts.confirmed} Empfänger senden
                                </button>
                                <button
                                  onClick={() => setConfirmSendId(null)}
                                  className="rounded-lg px-2 py-1.5 text-xs text-neutral-500 hover:bg-neutral-100"
                                >
                                  Abbrechen
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setConfirmSendId(c.id)}
                                className="shrink-0 rounded-lg bg-neutral-900 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800"
                              >
                                Versenden
                              </button>
                            ))}
                          {canSend && (
                            <button
                              onClick={() => deleteCampaign(c)}
                              className="shrink-0 rounded-lg border border-neutral-200 px-2.5 py-1.5 text-xs font-semibold text-neutral-400 hover:bg-red-50 hover:text-red-600"
                            >
                              Löschen
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
