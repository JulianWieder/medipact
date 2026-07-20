"use client";

// ── Konflikt-Logbuch: kostenlos dokumentieren, bevor mediiert wird ──────────
//
// Ein Fall mit mode="logbuch": Die Nutzer:in hält fortlaufend fest, was im
// Konflikt passiert – Vorkommnisse, Gedanken, Gespräche, E-Mails, WhatsApp,
// Telefonate. Keine Paywall, keine Gegenseite.
//
// Die FORM kommt aus dem WorkflowManager (Phase "logbuch"):
//   • logbuch_intake  – Grunddaten des Streits (einmalig, block_responses)
//   • logbuch_eintrag – VORLAGE des Eintrag-Formulars (Blöcke = Felder);
//     Werte landen als {block_id: wert} in mediation_log_entries.content.
// Upsell: "In Mediation umwandeln" → POST /logbuch/convert → normaler
// Start-Flow (start_intake, Paketwahl, Einladung, Paywall).

import { encodeId } from "@/lib/ids";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

interface Props {
  mediationId: string;
  initialTitle: string;
  mediationType: string;
}

interface FlowBlock {
  id: string;
  type: string;
  config: Record<string, unknown>;
}

interface LogEntry {
  id: number;
  entry_type: string;
  occurred_at: string | null;
  title: string | null;
  content: Record<string, unknown>;
  created_at: string | null;
}

const ENTRY_TYPES: { key: string; label: string; icon: string }[] = [
  { key: "vorkommnis", label: "Vorkommnis", icon: "📌" },
  { key: "gedanke", label: "Gedanke", icon: "💭" },
  { key: "gespraech", label: "Gespräch", icon: "🗣️" },
  { key: "email", label: "E-Mail", icon: "✉️" },
  { key: "whatsapp", label: "WhatsApp", icon: "💬" },
  { key: "telefonat", label: "Telefonat", icon: "📞" },
];

const INPUT_TYPES = new Set([
  "frage", "texteingabe", "auswahl", "skala", "datum", "betrag",
]);

function cfgStr(c: Record<string, unknown>, k: string): string {
  const v = c?.[k];
  return typeof v === "string" ? v : "";
}
function cfgNum(c: Record<string, unknown>, k: string, fb: number): number {
  const v = c?.[k];
  return typeof v === "number" && !Number.isNaN(v) ? v : fb;
}
function cfgArr(c: Record<string, unknown>, k: string): string[] {
  const v = c?.[k];
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

function formatDate(iso: string | null): string {
  if (!iso) return "ohne Datum";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "ohne Datum";
  return d.toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });
}

// ── Ein Formularfeld je WFM-Block (kompakte Formular-Variante) ──────────────
function BlockField({
  block,
  value,
  onChange,
}: {
  block: FlowBlock;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const c = block.config ?? {};
  const label = cfgStr(c, "prompt") || cfgStr(c, "label");
  const str = typeof value === "string" ? value : "";

  if (block.type === "datum") {
    return (
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-neutral-800">{label}</span>
        <input
          type="date"
          value={str}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-800 outline-none transition focus:border-accent-500"
        />
        {cfgStr(c, "help") && (
          <span className="mt-1 block text-xs text-neutral-400">{cfgStr(c, "help")}</span>
        )}
      </label>
    );
  }

  if (block.type === "auswahl") {
    const opts = cfgArr(c, "options");
    const multi = c.multi === true;
    const selected: string[] = Array.isArray(value)
      ? (value as string[])
      : typeof value === "string" && value ? [value] : [];
    const toggle = (opt: string) => {
      if (multi) {
        onChange(selected.includes(opt) ? selected.filter((o) => o !== opt) : [...selected, opt]);
      } else {
        onChange(selected.includes(opt) ? "" : opt);
      }
    };
    return (
      <div>
        <span className="mb-1.5 block text-sm font-semibold text-neutral-800">{label}</span>
        <div className="flex flex-wrap gap-2">
          {opts.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => toggle(o)}
              className={`rounded-full border px-3.5 py-1.5 text-sm transition ${
                selected.includes(o)
                  ? "border-accent-500 bg-accent-50 font-semibold text-accent-700"
                  : "border-neutral-300 bg-white text-neutral-600 hover:border-neutral-400"
              }`}
            >
              {o}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (block.type === "skala") {
    const min = cfgNum(c, "min", 1);
    const max = cfgNum(c, "max", 10);
    const val = typeof value === "number" ? value : Math.round((min + max) / 2);
    return (
      <div>
        <span className="mb-1.5 block text-sm font-semibold text-neutral-800">
          {label}
          {typeof value === "number" && (
            <span className="ml-2 font-bold text-accent-600">{value}</span>
          )}
        </span>
        <input
          type="range"
          min={min}
          max={max}
          value={val}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full accent-accent-600"
        />
        <div className="mt-0.5 flex justify-between text-xs text-neutral-400">
          <span>{cfgStr(c, "minLabel") || min}</span>
          <span>{cfgStr(c, "maxLabel") || max}</span>
        </div>
      </div>
    );
  }

  if (block.type === "betrag") {
    return (
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-neutral-800">{label}</span>
        <span className="flex items-center gap-2">
          <input
            type="number"
            step="0.01"
            value={typeof value === "number" ? value : ""}
            onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
            className="w-44 rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-accent-500"
          />
          <span className="text-sm text-neutral-500">{cfgStr(c, "currency") || "€"}</span>
        </span>
      </label>
    );
  }

  // frage / texteingabe (Default: Freitext)
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-neutral-800">{label}</span>
      <textarea
        value={str}
        onChange={(e) => onChange(e.target.value)}
        placeholder={cfgStr(c, "placeholder") || "Schreiben Sie frei …"}
        rows={3}
        className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm leading-6 text-neutral-800 outline-none transition focus:border-accent-500"
      />
    </label>
  );
}

export default function LogbuchClient({ mediationId, initialTitle, mediationType }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isNew = searchParams.get("neu") === "1";

  const [intakeBlocks, setIntakeBlocks] = useState<FlowBlock[]>([]);
  const [entryBlocks, setEntryBlocks] = useState<FlowBlock[]>([]);
  const [intakeValues, setIntakeValues] = useState<Record<string, unknown>>({});
  const [intakeOpen, setIntakeOpen] = useState(isNew);
  const [intakeSaving, setIntakeSaving] = useState(false);
  const [intakeSaved, setIntakeSaved] = useState(false);

  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Composer (neuer/bearbeiteter Eintrag)
  const [entryType, setEntryType] = useState("vorkommnis");
  const [entryValues, setEntryValues] = useState<Record<string, unknown>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [entrySaving, setEntrySaving] = useState(false);

  const [converting, setConverting] = useState(false);
  const [confirmConvert, setConfirmConvert] = useState(false);
  const [error, setError] = useState("");

  // ── Laden: WFM-Vorlagen + Intake-Antworten + Einträge ──
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [stepsRes, respRes, entriesRes] = await Promise.all([
          fetch(`/api/mediations/${mediationId}/phase-steps?phase=logbuch`, { cache: "no-store" }),
          fetch(
            `/api/mediations/${mediationId}/block-responses?phase=logbuch&step_key=logbuch_intake`,
            { cache: "no-store" },
          ),
          fetch(`/api/mediations/${mediationId}/logbuch/entries`, { cache: "no-store" }),
        ]);
        if (cancelled) return;

        if (stepsRes.ok) {
          const data = await stepsRes.json();
          const steps: { key?: string; blocks?: FlowBlock[] }[] = data.steps ?? [];
          setIntakeBlocks(steps.find((s) => s.key === "logbuch_intake")?.blocks ?? []);
          setEntryBlocks(steps.find((s) => s.key === "logbuch_eintrag")?.blocks ?? []);
        }
        if (respRes.ok) {
          const rows: { block_id: string; value: unknown }[] = await respRes.json();
          const map: Record<string, unknown> = {};
          for (const r of rows ?? []) map[r.block_id] = r.value;
          setIntakeValues(map);
          if (Object.keys(map).length > 0) setIntakeSaved(true);
        }
        if (entriesRes.ok) {
          setEntries(await entriesRes.json());
        }
      } catch {
        setError("Server nicht erreichbar.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [mediationId]);

  const intakeInputs = useMemo(
    () => intakeBlocks.filter((b) => INPUT_TYPES.has(b.type)),
    [intakeBlocks],
  );
  const intakeIntro = useMemo(
    () => intakeBlocks.find((b) => b.type === "textausgabe"),
    [intakeBlocks],
  );
  const entryInputs = useMemo(
    () => entryBlocks.filter((b) => INPUT_TYPES.has(b.type)),
    [entryBlocks],
  );
  // Erster datum-Block der Vorlage = Ereignis-Datum (occurred_at).
  const dateBlockId = useMemo(
    () => entryInputs.find((b) => b.type === "datum")?.id ?? null,
    [entryInputs],
  );

  // ── Intake speichern (block_responses + Fallbeschreibung) ──
  const saveIntake = useCallback(async () => {
    setIntakeSaving(true);
    setError("");
    try {
      await Promise.all(
        intakeInputs
          .filter((b) => intakeValues[b.id] !== undefined)
          .map((b) =>
            fetch(`/api/mediations/${mediationId}/block-responses`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                phase: "logbuch",
                step_key: "logbuch_intake",
                block_id: b.id,
                block_type: b.type,
                value: intakeValues[b.id],
                submitted: true,
              }),
            }),
          ),
      );
      // map_to=description → Fallbeschreibung nachziehen
      const descBlock = intakeInputs.find((b) => cfgStr(b.config, "map_to") === "description");
      const desc = descBlock ? intakeValues[descBlock.id] : undefined;
      if (typeof desc === "string" && desc.trim()) {
        await fetch(`/api/mediations/${mediationId}/update`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description: desc }),
        });
      }
      setIntakeSaved(true);
      setIntakeOpen(false);
    } catch {
      setError("Grunddaten konnten nicht gespeichert werden.");
    } finally {
      setIntakeSaving(false);
    }
  }, [intakeInputs, intakeValues, mediationId]);

  // ── Eintrag speichern (neu oder bearbeitet) ──
  const saveEntry = useCallback(async () => {
    setEntrySaving(true);
    setError("");
    const occurred = dateBlockId ? entryValues[dateBlockId] : null;
    const payload = {
      entry_type: entryType,
      occurred_at: typeof occurred === "string" && occurred ? occurred : null,
      content: entryValues,
    };
    try {
      const url = editingId
        ? `/api/mediations/${mediationId}/logbuch/entries/${editingId}`
        : `/api/mediations/${mediationId}/logbuch/entries`;
      const res = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        setError(body?.detail ?? body?.error ?? `Fehler (${res.status})`);
        return;
      }
      if (editingId) {
        setEntries((prev) => prev.map((e) => (e.id === editingId ? body : e)));
      } else {
        setEntries((prev) => [body, ...prev]);
      }
      setEntryValues({});
      setEditingId(null);
      setEntryType("vorkommnis");
    } catch {
      setError("Eintrag konnte nicht gespeichert werden.");
    } finally {
      setEntrySaving(false);
    }
  }, [dateBlockId, editingId, entryType, entryValues, mediationId]);

  const deleteEntry = useCallback(
    async (id: number) => {
      if (!window.confirm("Diesen Eintrag wirklich löschen?")) return;
      const res = await fetch(`/api/mediations/${mediationId}/logbuch/entries/${id}`, {
        method: "DELETE",
      });
      if (res.ok) setEntries((prev) => prev.filter((e) => e.id !== id));
    },
    [mediationId],
  );

  const startEdit = useCallback((entry: LogEntry) => {
    setEditingId(entry.id);
    setEntryType(entry.entry_type);
    setEntryValues(entry.content ?? {});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // ── Upsell: in Mediation umwandeln ──
  const convert = useCallback(async () => {
    setConverting(true);
    setError("");
    try {
      const res = await fetch(`/api/mediations/${mediationId}/logbuch/convert`, {
        method: "POST",
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        setError(body?.detail ?? body?.error ?? `Fehler (${res.status})`);
        return;
      }
      router.push(`/dashboard/mediation/new/${body.mediation_type}?mediationId=${mediationId}`);
    } catch {
      setError("Server nicht erreichbar.");
    } finally {
      setConverting(false);
    }
  }, [mediationId, router]);

  const typeMeta = (key: string) =>
    ENTRY_TYPES.find((t) => t.key === key) ?? ENTRY_TYPES[0];

  const blockLabel = (blockId: string): string => {
    const b = entryInputs.find((x) => x.id === blockId);
    if (!b) return "";
    return cfgStr(b.config, "prompt") || cfgStr(b.config, "label");
  };

  return (
    <main className="app-shell pt-[73px]">
      <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
        {/* Kopf */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link href="/dashboard" className="btn btn-ghost mb-4 -ml-3">
              ← Dashboard
            </Link>
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-accent-200 bg-accent-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent-700">
                Konflikt-Logbuch · kostenlos
              </span>
            </div>
            <h1 className="heading-1 mt-3 text-neutral-900">{initialTitle}</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-500">
              Halten Sie fest, was passiert – Vorkommnisse, Gespräche, E-Mails,
              WhatsApp, Telefonate, Gedanken. Vertraulich; die Gegenseite sieht
              nichts davon.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setConfirmConvert(true)}
            className="btn btn-primary"
          >
            In Mediation umwandeln →
          </button>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <p className="mt-12 text-neutral-400">Ihr Logbuch wird geladen …</p>
        ) : (
          <>
            {/* ── Grunddaten (logbuch_intake) ── */}
            <section className="mt-10 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <h2 className="heading-3 text-neutral-900">Ihr Streit im Überblick</h2>
                {intakeSaved && !intakeOpen && (
                  <button
                    type="button"
                    onClick={() => setIntakeOpen(true)}
                    className="text-sm font-semibold text-accent-600 hover:text-accent-700"
                  >
                    Bearbeiten
                  </button>
                )}
              </div>

              {intakeOpen ? (
                <div className="mt-5 space-y-5">
                  {intakeIntro && (
                    <p className="whitespace-pre-wrap text-sm leading-7 text-neutral-600">
                      {cfgStr(intakeIntro.config, "text")}
                    </p>
                  )}
                  {intakeInputs.map((b) => (
                    <BlockField
                      key={b.id}
                      block={b}
                      value={intakeValues[b.id]}
                      onChange={(v) => setIntakeValues((s) => ({ ...s, [b.id]: v }))}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={saveIntake}
                    disabled={intakeSaving}
                    className="btn btn-primary disabled:opacity-50"
                  >
                    {intakeSaving ? "Wird gespeichert …" : "Grunddaten speichern"}
                  </button>
                </div>
              ) : intakeSaved ? (
                <dl className="mt-4 space-y-3">
                  {intakeInputs
                    .filter((b) => {
                      const v = intakeValues[b.id];
                      return v !== undefined && v !== null && v !== "";
                    })
                    .map((b) => (
                      <div key={b.id}>
                        <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                          {cfgStr(b.config, "prompt") || cfgStr(b.config, "label")}
                        </dt>
                        <dd className="mt-0.5 whitespace-pre-wrap text-sm leading-6 text-neutral-700">
                          {Array.isArray(intakeValues[b.id])
                            ? (intakeValues[b.id] as string[]).join(", ")
                            : String(intakeValues[b.id])}
                        </dd>
                      </div>
                    ))}
                </dl>
              ) : (
                <p className="mt-3 text-sm text-neutral-500">
                  Noch keine Grunddaten hinterlegt.{" "}
                  <button
                    type="button"
                    onClick={() => setIntakeOpen(true)}
                    className="font-semibold text-accent-600 hover:text-accent-700"
                  >
                    Jetzt ausfüllen →
                  </button>
                </p>
              )}
            </section>

            {/* ── Neuer Eintrag (Vorlage: logbuch_eintrag) ── */}
            <section className="mt-8 rounded-2xl border-2 border-accent-200 bg-accent-50/40 p-6 sm:p-8">
              <h2 className="heading-3 text-neutral-900">
                {editingId ? "Eintrag bearbeiten" : "Was ist passiert?"}
              </h2>
              <p className="mt-1 text-sm text-neutral-500">
                Dokumentieren Sie zeitnah – so bleibt Ihre Chronologie belastbar.
              </p>

              {/* Eintragsart */}
              <div className="mt-5 flex flex-wrap gap-2">
                {ENTRY_TYPES.map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setEntryType(t.key)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      entryType === t.key
                        ? "border-accent-500 bg-white font-semibold text-accent-700 ring-2 ring-accent-200"
                        : "border-neutral-300 bg-white text-neutral-600 hover:border-neutral-400"
                    }`}
                  >
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>

              <div className="mt-6 space-y-5">
                {entryInputs.map((b) => (
                  <BlockField
                    key={b.id}
                    block={b}
                    value={entryValues[b.id]}
                    onChange={(v) => setEntryValues((s) => ({ ...s, [b.id]: v }))}
                  />
                ))}
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button
                  type="button"
                  onClick={saveEntry}
                  disabled={entrySaving}
                  className="btn btn-primary disabled:opacity-50"
                >
                  {entrySaving
                    ? "Wird gespeichert …"
                    : editingId
                      ? "Änderungen speichern"
                      : "Eintrag speichern"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setEntryValues({});
                      setEntryType("vorkommnis");
                    }}
                    className="btn btn-ghost"
                  >
                    Abbrechen
                  </button>
                )}
              </div>
            </section>

            {/* ── Chronologie ── */}
            <section className="mt-10">
              <h2 className="heading-3 text-neutral-900">
                Chronologie
                {entries.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-neutral-400">
                    {entries.length} {entries.length === 1 ? "Eintrag" : "Einträge"}
                  </span>
                )}
              </h2>

              {entries.length === 0 ? (
                <p className="mt-4 rounded-2xl border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500">
                  Noch keine Einträge. Halten Sie oben das erste Vorkommnis fest.
                </p>
              ) : (
                <ol className="mt-5 space-y-4">
                  {entries.map((entry) => {
                    const meta = typeMeta(entry.entry_type);
                    const fields = Object.entries(entry.content ?? {}).filter(
                      ([, v]) => v !== undefined && v !== null && v !== "",
                    );
                    return (
                      <li
                        key={entry.id}
                        className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <span className="text-lg">{meta.icon}</span>
                            <span className="text-sm font-bold text-neutral-900">{meta.label}</span>
                            <span className="text-sm text-neutral-400">·</span>
                            <span className="text-sm text-neutral-500">
                              {formatDate(entry.occurred_at ?? entry.created_at)}
                            </span>
                          </div>
                          <div className="flex gap-2 text-xs">
                            <button
                              type="button"
                              onClick={() => startEdit(entry)}
                              className="font-semibold text-neutral-400 transition hover:text-accent-600"
                            >
                              Bearbeiten
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteEntry(entry.id)}
                              className="font-semibold text-neutral-400 transition hover:text-red-500"
                            >
                              Löschen
                            </button>
                          </div>
                        </div>
                        <dl className="mt-3 space-y-2.5">
                          {fields.map(([blockId, v]) => {
                            const label = blockLabel(blockId);
                            if (dateBlockId && blockId === dateBlockId) return null;
                            return (
                              <div key={blockId}>
                                {label && (
                                  <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                                    {label}
                                  </dt>
                                )}
                                <dd className="mt-0.5 whitespace-pre-wrap text-sm leading-6 text-neutral-700">
                                  {Array.isArray(v) ? (v as string[]).join(", ") : String(v)}
                                </dd>
                              </div>
                            );
                          })}
                        </dl>
                      </li>
                    );
                  })}
                </ol>
              )}
            </section>

            {/* ── Upsell ── */}
            <section className="mt-12 rounded-2xl bg-neutral-900 p-6 text-white sm:p-8">
              <h2 className="font-display text-xl font-medium">
                Bereit, den Konflikt wirklich zu lösen?
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-300">
                Wandeln Sie Ihr Logbuch in eine Mediation um: Ihre Dokumentation
                bleibt erhalten und gibt dem Verfahren einen sauberen Startpunkt.
                Erst danach fallen die üblichen Kosten an – Ihr Logbuch bleibt
                kostenlos.
              </p>
              <button
                type="button"
                onClick={() => setConfirmConvert(true)}
                className="mt-5 inline-flex items-center justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-neutral-900 transition hover:bg-accent-50"
              >
                In Mediation umwandeln →
              </button>
            </section>
          </>
        )}
      </div>

      {/* Bestätigung */}
      {confirmConvert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
            <h2 className="font-display text-xl font-medium text-neutral-900">
              Logbuch in Mediation umwandeln?
            </h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              Ihr Fall durchläuft danach den normalen Start (Fallaufnahme,
              Paketwahl, Einladung der Gegenseite). Alle Logbuch-Einträge
              bleiben erhalten. Kosten entstehen erst mit der Freischaltung der
              Mediation.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={convert}
                disabled={converting}
                className="btn btn-primary disabled:opacity-50"
              >
                {converting ? "Wird umgewandelt …" : "Ja, umwandeln"}
              </button>
              <button
                type="button"
                onClick={() => setConfirmConvert(false)}
                className="btn btn-ghost"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
