"use client";
// ── Betreuungskalender im Konflikt-Logbuch (Trennung) ───────────────────────
// Geplante Betreuungszeiten (Serienregeln als Wochenmuster + Einzeltermine)
// und die TATSÄCHLICHEN Zeiten je Termin dokumentieren. Die Abweichung
// Plan ↔ Ist wird direkt am Termin sichtbar – das ist die Doku-Leistung
// fürs Logbuch (Chronologie für eine spätere Mediation oder Beratung).
// API: /api/mediations/[id]/logbuch/betreuung/* (routers/betreuung.py).

import { useCallback, useEffect, useMemo, useState } from "react";
import Icon from "@/app/components/ui/Icon";

type CareRule = {
  id: number;
  label: string | null;
  caregiver: string | null;
  start_weekday: number;
  start_time: string;
  end_weekday: number;
  end_time: string;
  interval_weeks: number;
  valid_from: string | null;
  valid_until: string | null;
  visibility: string;
};

type CareItem = {
  key: string;
  source: "regel" | "einzeltermin";
  rule_id: number | null;
  entry_id: number | null;
  date: string;
  label: string | null;
  caregiver: string | null;
  planned_start: string | null;
  planned_end: string | null;
  actual_start: string | null;
  actual_end: string | null;
  status: string;
  note: string | null;
  visibility: string;
  swap_status: string | null;
  swap_requested_by: number | null;
  swap_proposed_start: string | null;
  swap_proposed_end: string | null;
  swap_message: string | null;
};

const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const WEEKDAYS_LONG = [
  "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag",
];

function iso(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function fmtDay(isoDate: string): string {
  const d = new Date(`${isoDate}T00:00:00`);
  return d.toLocaleDateString("de-DE", { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric" });
}
function fmtTime(ts: string | null): string {
  if (!ts) return "–";
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
function fmtSpan(startTs: string | null, endTs: string | null): string {
  if (!startTs && !endTs) return "–";
  const sameDay = startTs && endTs && startTs.slice(0, 10) === endTs.slice(0, 10);
  const end = endTs
    ? sameDay
      ? fmtTime(endTs)
      : `${new Date(endTs).toLocaleDateString("de-DE", { weekday: "short" })} ${fmtTime(endTs)}`
    : "…";
  return `${fmtTime(startTs)} – ${end}`;
}
/** Abweichung Plan↔Ist in Minuten (positiv = später), null wenn unvollständig. */
function diffMinutes(planned: string | null, actual: string | null): number | null {
  if (!planned || !actual) return null;
  return Math.round((new Date(actual).getTime() - new Date(planned).getTime()) / 60000);
}
function diffLabel(mins: number | null, kind: "Beginn" | "Ende"): string | null {
  if (mins == null || Math.abs(mins) < 5) return null;
  const h = Math.floor(Math.abs(mins) / 60);
  const m = Math.abs(mins) % 60;
  const dur = h > 0 ? `${h} Std.${m ? ` ${m} Min.` : ""}` : `${m} Min.`;
  return `${kind} ${dur} ${mins > 0 ? "später" : "früher"}`;
}
function toDateInput(ts: string | null): string {
  return ts ? ts.slice(0, 10) : "";
}
function toTimeInput(ts: string | null): string {
  return ts ? fmtTime(ts) : "";
}
function combine(date: string, time: string): string | null {
  if (!date || !time) return null;
  return `${date}T${time}:00`;
}

const VIS_OPTIONS = [
  { key: "personal", label: "Nur für mich" },
  { key: "shared", label: "Geteilt" },
  { key: "private", label: "Sensibel" },
];

const inputCls =
  "rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-accent-400 focus:outline-none";
const labelCls = "block text-xs font-semibold text-neutral-600 mb-1";

export default function BetreuungsKalender({ mediationId }: { mediationId: string }) {
  const [open, setOpen] = useState(false);
  const [monthDate, setMonthDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [items, setItems] = useState<CareItem[]>([]);
  const [rules, setRules] = useState<CareRule[]>([]);
  const [me, setMe] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [showRuleForm, setShowRuleForm] = useState(false);
  const [showTerminForm, setShowTerminForm] = useState(false);
  const [showRules, setShowRules] = useState(false);

  // Sichtbares Raster: Montag der Woche des Monatsersten + 6 Wochen.
  const gridStart = useMemo(() => {
    const d = new Date(monthDate);
    const wd = (d.getDay() + 6) % 7; // Mo=0
    d.setDate(d.getDate() - wd);
    return d;
  }, [monthDate]);
  const gridDays = useMemo(() => {
    const days: string[] = [];
    const d = new Date(gridStart);
    for (let i = 0; i < 42; i++) {
      days.push(iso(d));
      d.setDate(d.getDate() + 1);
    }
    return days;
  }, [gridStart]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const from = gridDays[0];
      const to = gridDays[gridDays.length - 1];
      const res = await fetch(
        `/api/mediations/${mediationId}/logbuch/betreuung/termine?from=${from}&to=${to}`,
        { cache: "no-store" },
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      setItems(data.items ?? []);
      setRules(data.rules ?? []);
      setMe(data.me ?? null);
    } catch {
      setError("Betreuungskalender konnte nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }, [mediationId, gridDays]);

  useEffect(() => {
    if (open) void load();
  }, [open, load]);

  const byDate = useMemo(() => {
    const map: Record<string, CareItem[]> = {};
    for (const it of items) (map[it.date] ??= []).push(it);
    return map;
  }, [items]);

  const selected = useMemo(
    () => items.find((i) => i.key === selectedKey) ?? null,
    [items, selectedKey],
  );

  const todayIso = iso(new Date());
  const monthLabel = monthDate.toLocaleDateString("de-DE", { month: "long", year: "numeric" });

  const itemTone = (it: CareItem): string => {
    if (it.status === "ausgefallen") return "border-red-200 bg-red-50 text-red-700";
    if (it.actual_start || it.actual_end) {
      const dev =
        (diffMinutes(it.planned_start, it.actual_start) ?? 0) !== 0 &&
        Math.abs(diffMinutes(it.planned_start, it.actual_start) ?? 0) >= 15;
      return dev
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : "border-emerald-200 bg-emerald-50 text-emerald-700";
    }
    return "border-accent-200 bg-accent-50 text-accent-700";
  };

  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-6 py-4 text-left"
      >
        <span>
          <span className="block text-sm font-bold text-neutral-900">
            <Icon name="calendar" color="currentColor" /> Betreuungskalender
          </span>
          <span className="mt-0.5 block text-xs text-neutral-500">
            Geplante und tatsächliche Betreuungszeiten festhalten – Abweichungen
            werden automatisch sichtbar.
          </span>
        </span>
        <span className="text-neutral-400">{open ? "▴" : "▾"}</span>
      </button>

      {open && (
        <div className="border-t border-neutral-200 px-4 pb-6 pt-4 sm:px-6">
          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Kopfzeile: Monat + Aktionen */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="btn btn-ghost px-2"
                onClick={() => setMonthDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
              >
                ←
              </button>
              <span className="min-w-[150px] text-center text-sm font-bold text-neutral-900">
                {monthLabel}
              </span>
              <button
                type="button"
                className="btn btn-ghost px-2"
                onClick={() => setMonthDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
              >
                →
              </button>
              <button
                type="button"
                className="btn btn-ghost text-xs"
                onClick={() => {
                  const now = new Date();
                  setMonthDate(new Date(now.getFullYear(), now.getMonth(), 1));
                }}
              >
                Heute
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-ghost text-xs"
                onClick={() => setShowRules((v) => !v)}
              >
                Regeln ({rules.length})
              </button>
              <button
                type="button"
                className="btn btn-ghost text-xs"
                onClick={() => {
                  setShowTerminForm((v) => !v);
                  setShowRuleForm(false);
                }}
              >
                + Einzeltermin
              </button>
              <button
                type="button"
                className="btn btn-primary text-xs"
                onClick={() => {
                  setShowRuleForm((v) => !v);
                  setShowTerminForm(false);
                }}
              >
                + Wiederkehrende Betreuung
              </button>
            </div>
          </div>

          {showRules && rules.length > 0 && (
            <div className="mt-4 space-y-2">
              {rules.map((r) => (
                <RuleRow key={r.id} mediationId={mediationId} rule={r} onChanged={load} />
              ))}
            </div>
          )}
          {showRules && rules.length === 0 && (
            <p className="mt-4 text-sm text-neutral-500">
              Noch keine Serienregeln – legen Sie das Wochenmuster über
              „+ Wiederkehrende Betreuung“ an.
            </p>
          )}

          {showRuleForm && (
            <RuleForm
              mediationId={mediationId}
              onSaved={() => {
                setShowRuleForm(false);
                void load();
              }}
              onCancel={() => setShowRuleForm(false)}
            />
          )}
          {showTerminForm && (
            <TerminForm
              mediationId={mediationId}
              onSaved={() => {
                setShowTerminForm(false);
                void load();
              }}
              onCancel={() => setShowTerminForm(false)}
            />
          )}

          {/* Monatsraster */}
          <div className="mt-4 grid grid-cols-7 gap-px overflow-hidden rounded-xl border border-neutral-200 bg-neutral-200">
            {WEEKDAYS.map((w) => (
              <div key={w} className="bg-neutral-50 px-1 py-1.5 text-center text-[11px] font-bold uppercase tracking-wide text-neutral-500">
                {w}
              </div>
            ))}
            {gridDays.map((day) => {
              const inMonth = day.slice(0, 7) === iso(monthDate).slice(0, 7);
              const dayItems = byDate[day] ?? [];
              return (
                <div
                  key={day}
                  className={`min-h-[64px] bg-white p-1 ${inMonth ? "" : "opacity-40"}`}
                >
                  <div
                    className={`mb-1 text-right text-[11px] ${
                      day === todayIso
                        ? "font-bold text-accent-600"
                        : "text-neutral-400"
                    }`}
                  >
                    {Number(day.slice(8, 10))}
                  </div>
                  {dayItems.map((it) => (
                    <button
                      key={it.key}
                      type="button"
                      onClick={() => setSelectedKey(it.key === selectedKey ? null : it.key)}
                      className={`mb-1 block w-full truncate rounded border px-1 py-0.5 text-left text-[10px] leading-4 ${itemTone(it)} ${
                        it.key === selectedKey ? "ring-2 ring-accent-400" : ""
                      }`}
                      title={it.label ?? it.caregiver ?? "Betreuung"}
                    >
                      {it.swap_status === "angefragt" ? <><Icon name="repeat" size={10} color="currentColor" />{" "}</> : null}
                      {fmtTime(it.planned_start)}
                      {it.caregiver ? ` ${it.caregiver}` : it.label ? ` ${it.label}` : ""}
                    </button>
                  ))}
                </div>
              );
            })}
          </div>

          <p className="mt-2 text-[11px] text-neutral-400">
            <span className="mr-3"><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm border border-accent-200 bg-accent-50 align-middle" /> geplant</span>
            <span className="mr-3"><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm border border-emerald-300 bg-emerald-100 align-middle" /> stattgefunden (wie geplant)</span>
            <span className="mr-3"><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm border border-amber-300 bg-amber-100 align-middle" /> mit Abweichung</span>
            <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm border border-red-300 bg-red-100 align-middle" /> ausgefallen</span>
          </p>

          {loading && <p className="mt-3 text-sm text-neutral-400">Wird geladen …</p>}

          {selected && (
            <IstErfassung
              key={selected.key}
              mediationId={mediationId}
              me={me}
              item={selected}
              onSaved={() => {
                setSelectedKey(null);
                void load();
              }}
              onClose={() => setSelectedKey(null)}
            />
          )}
        </div>
      )}
    </section>
  );
}

// ── Ist-Zeiten zu einem Termin erfassen (Override oder Einzeltermin-Update) ──
function IstErfassung({
  mediationId,
  me,
  item,
  onSaved,
  onClose,
}: {
  mediationId: string;
  me: number | null;
  item: CareItem;
  onSaved: () => void;
  onClose: () => void;
}) {
  const [actualStartDate, setActualStartDate] = useState(
    toDateInput(item.actual_start) || item.date,
  );
  const [actualStartTime, setActualStartTime] = useState(
    toTimeInput(item.actual_start) || toTimeInput(item.planned_start),
  );
  const [actualEndDate, setActualEndDate] = useState(
    toDateInput(item.actual_end) || toDateInput(item.planned_end) || item.date,
  );
  const [actualEndTime, setActualEndTime] = useState(
    toTimeInput(item.actual_end) || toTimeInput(item.planned_end),
  );
  const [status, setStatus] = useState(item.status || "geplant");
  const [note, setNote] = useState(item.note ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const devStart = diffLabel(diffMinutes(item.planned_start, item.actual_start), "Beginn");
  const devEnd = diffLabel(diffMinutes(item.planned_end, item.actual_end), "Ende");

  const save = async () => {
    setSaving(true);
    setError("");
    const ausgefallen = status === "ausgefallen";
    const body = {
      status,
      actual_start: ausgefallen ? null : combine(actualStartDate, actualStartTime),
      actual_end: ausgefallen ? null : combine(actualEndDate, actualEndTime),
      note: note || null,
    };
    try {
      const res = item.entry_id
        ? await fetch(
            `/api/mediations/${mediationId}/logbuch/betreuung/termine/${item.entry_id}`,
            { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) },
          )
        : await fetch(`/api/mediations/${mediationId}/logbuch/betreuung/termine`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...body,
              rule_id: item.rule_id,
              date: item.date,
              visibility: item.visibility,
            }),
          });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.detail ?? data?.error ?? "Speichern fehlgeschlagen.");
        return;
      }
      onSaved();
    } catch {
      setError("Server nicht erreichbar.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!item.entry_id) return onClose();
    setSaving(true);
    try {
      await fetch(
        `/api/mediations/${mediationId}/logbuch/betreuung/termine/${item.entry_id}`,
        { method: "DELETE" },
      );
      onSaved();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-4 rounded-2xl border-2 border-accent-200 bg-accent-50/40 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-neutral-900">
            {fmtDay(item.date)}
            {item.caregiver ? ` · ${item.caregiver}` : ""}
            {item.label ? ` · ${item.label}` : ""}
          </p>
          <p className="mt-0.5 text-xs text-neutral-500">
            Geplant: {fmtSpan(item.planned_start, item.planned_end)}
            {item.source === "regel" ? " (aus Serienregel)" : " (Einzeltermin)"}
          </p>
          {(devStart || devEnd) && (
            <p className="mt-0.5 text-xs font-semibold text-amber-700">
              Abweichung: {[devStart, devEnd].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
        <button type="button" className="btn btn-ghost px-2 text-xs" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {[
          { key: "geplant", label: "Offen" },
          { key: "stattgefunden", label: "Hat stattgefunden" },
          { key: "ausgefallen", label: "Ausgefallen" },
        ].map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setStatus(s.key)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
              status === s.key
                ? "border-accent-500 bg-accent-500 text-white"
                : "border-neutral-300 bg-white text-neutral-600"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {status !== "ausgefallen" && (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Tatsächlicher Beginn</label>
            <div className="flex gap-2">
              <input type="date" className={inputCls} value={actualStartDate} onChange={(e) => setActualStartDate(e.target.value)} />
              <input type="time" className={inputCls} value={actualStartTime} onChange={(e) => setActualStartTime(e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Tatsächliches Ende</label>
            <div className="flex gap-2">
              <input type="date" className={inputCls} value={actualEndDate} onChange={(e) => setActualEndDate(e.target.value)} />
              <input type="time" className={inputCls} value={actualEndTime} onChange={(e) => setActualEndTime(e.target.value)} />
            </div>
          </div>
        </div>
      )}

      <div className="mt-3">
        <label className={labelCls}>Notiz (z. B. Grund der Abweichung)</label>
        <textarea
          className={`${inputCls} w-full`}
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Was ist passiert? Übergabe verspätet, kurzfristig abgesagt …"
        />
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" className="btn btn-primary text-sm" onClick={save} disabled={saving}>
          {saving ? "Speichert …" : "Speichern"}
        </button>
        {item.entry_id && (
          <button type="button" className="btn btn-ghost text-sm text-red-600" onClick={remove} disabled={saving}>
            Erfassung löschen
          </button>
        )}
      </div>

      <TauschBlock mediationId={mediationId} me={me} item={item} onChanged={onSaved} />
    </div>
  );
}

// ── Betreuungszeiten-Tausch (nur geteilte Termine) ──────────────────────────
// Ein Elternteil schlägt neue Zeiten vor, die Gegenseite nimmt an oder lehnt
// ab. Für Serien-Vorkommen ohne Erfassung wird zuerst still ein Override
// angelegt (POST …/termine), dann die Anfrage gestellt.
function TauschBlock({
  mediationId,
  me,
  item,
  onChanged,
}: {
  mediationId: string;
  me: number | null;
  item: CareItem;
  onChanged: () => void;
}) {
  const [formOpen, setFormOpen] = useState(false);
  const [startDate, setStartDate] = useState(toDateInput(item.planned_start) || item.date);
  const [startTime, setStartTime] = useState(toTimeInput(item.planned_start));
  const [endDate, setEndDate] = useState(toDateInput(item.planned_end) || item.date);
  const [endTime, setEndTime] = useState(toTimeInput(item.planned_end));
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (item.visibility !== "shared") {
    return (
      <p className="mt-3 border-t border-accent-200/60 pt-3 text-xs text-neutral-400">
        <Icon name="repeat" size={12} color="currentColor" /> Tausch anfragen geht nur bei geteilten Terminen – stellen Sie die
        Sichtbarkeit der Regel bzw. des Termins auf „Geteilt“, damit die
        eingeladene Person (z. B. der andere Elternteil) den Kalender sieht.
      </p>
    );
  }

  const ensureEntryId = async (): Promise<number | null> => {
    if (item.entry_id) return item.entry_id;
    const res = await fetch(`/api/mediations/${mediationId}/logbuch/betreuung/termine`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rule_id: item.rule_id,
        date: item.date,
        status: item.status || "geplant",
        visibility: "shared",
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.id ?? null;
  };

  const requestSwap = async () => {
    setBusy(true);
    setError("");
    try {
      const entryId = await ensureEntryId();
      if (!entryId) {
        setError("Tausch-Anfrage fehlgeschlagen.");
        return;
      }
      const res = await fetch(
        `/api/mediations/${mediationId}/logbuch/betreuung/termine/${entryId}/tausch`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            proposed_start: combine(startDate, startTime),
            proposed_end: combine(endDate, endTime),
            message: message || null,
          }),
        },
      );
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.detail ?? "Tausch-Anfrage fehlgeschlagen.");
        return;
      }
      onChanged();
    } catch {
      setError("Server nicht erreichbar.");
    } finally {
      setBusy(false);
    }
  };

  const answer = async (akzeptieren: boolean) => {
    if (!item.entry_id) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch(
        `/api/mediations/${mediationId}/logbuch/betreuung/termine/${item.entry_id}/tausch/antwort`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ akzeptieren }),
        },
      );
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.detail ?? "Antwort fehlgeschlagen.");
        return;
      }
      onChanged();
    } catch {
      setError("Server nicht erreichbar.");
    } finally {
      setBusy(false);
    }
  };

  const mineRequest = item.swap_requested_by != null && item.swap_requested_by === me;

  return (
    <div className="mt-3 border-t border-accent-200/60 pt-3">
      {item.swap_status === "angefragt" ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
          <p className="text-xs font-bold text-amber-800">
            <Icon name="repeat" color="currentColor" /> Tausch-Anfrage {mineRequest ? "(von Ihnen)" : "der Gegenseite"}
          </p>
          <p className="mt-1 text-xs text-amber-800">
            Vorschlag: {fmtDay(item.swap_proposed_start?.slice(0, 10) ?? item.date)}{" "}
            {fmtSpan(item.swap_proposed_start, item.swap_proposed_end)}
          </p>
          {item.swap_message && (
            <p className="mt-1 text-xs italic text-amber-700">„{item.swap_message}“</p>
          )}
          {!mineRequest && (
            <div className="mt-2 flex gap-2">
              <button type="button" className="btn btn-primary text-xs" onClick={() => answer(true)} disabled={busy}>
                Annehmen
              </button>
              <button type="button" className="btn btn-ghost text-xs" onClick={() => answer(false)} disabled={busy}>
                Ablehnen
              </button>
            </div>
          )}
          {mineRequest && (
            <p className="mt-1 text-[11px] text-amber-600">
              Wartet auf Antwort der Gegenseite.
            </p>
          )}
        </div>
      ) : !formOpen ? (
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className="btn btn-ghost text-xs" onClick={() => setFormOpen(true)}>
            <Icon name="repeat" color="currentColor" /> Tausch anfragen
          </button>
          {item.swap_status === "akzeptiert" && (
            <span className="text-[11px] font-semibold text-emerald-700">
              Letzter Tausch wurde angenommen.
            </span>
          )}
          {item.swap_status === "abgelehnt" && (
            <span className="text-[11px] font-semibold text-red-600">
              Letzter Tausch wurde abgelehnt.
            </span>
          )}
        </div>
      ) : (
        <div>
          <p className="text-xs font-bold text-neutral-700">
            <Icon name="repeat" color="currentColor" /> Neue Zeiten vorschlagen
          </p>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Neuer Beginn</label>
              <div className="flex gap-2">
                <input type="date" className={inputCls} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <input type="time" className={inputCls} value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Neues Ende</label>
              <div className="flex gap-2">
                <input type="date" className={inputCls} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                <input type="time" className={inputCls} value={endTime} onChange={(e) => setEndTime(e.target.value)} />
              </div>
            </div>
          </div>
          <div className="mt-2">
            <label className={labelCls}>Nachricht (optional)</label>
            <input
              className={`${inputCls} w-full`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="z. B. Am Freitag habe ich einen Termin – können wir tauschen?"
            />
          </div>
          <div className="mt-2 flex gap-2">
            <button type="button" className="btn btn-primary text-xs" onClick={requestSwap} disabled={busy}>
              {busy ? "Sendet …" : "Anfrage senden"}
            </button>
            <button type="button" className="btn btn-ghost text-xs" onClick={() => setFormOpen(false)}>
              Abbrechen
            </button>
          </div>
        </div>
      )}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}

// ── Serienregel anlegen ─────────────────────────────────────────────────────
function RuleForm({
  mediationId,
  onSaved,
  onCancel,
}: {
  mediationId: string;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [label, setLabel] = useState("");
  const [caregiver, setCaregiver] = useState("");
  const [startWeekday, setStartWeekday] = useState(4); // Fr
  const [startTime, setStartTime] = useState("17:00");
  const [endWeekday, setEndWeekday] = useState(6); // So
  const [endTime, setEndTime] = useState("18:00");
  const [interval, setInterval] = useState(2);
  const [validFrom, setValidFrom] = useState("");
  const [visibility, setVisibility] = useState("personal");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/mediations/${mediationId}/logbuch/betreuung/rules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: label || null,
          caregiver: caregiver || null,
          start_weekday: startWeekday,
          start_time: startTime,
          end_weekday: endWeekday,
          end_time: endTime,
          interval_weeks: interval,
          valid_from: validFrom || null,
          anchor_date: validFrom || null,
          visibility,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.detail ?? "Regel konnte nicht angelegt werden.");
        return;
      }
      onSaved();
    } catch {
      setError("Server nicht erreichbar.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 sm:p-5">
      <p className="text-sm font-bold text-neutral-900">Wiederkehrende Betreuung anlegen</p>
      <p className="mt-0.5 text-xs text-neutral-500">
        z. B. „jedes 2. Wochenende Freitag 17:00 bis Sonntag 18:00 bei Papa“
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Bezeichnung (optional)</label>
          <input className={`${inputCls} w-full`} value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Wochenende bei Papa" />
        </div>
        <div>
          <label className={labelCls}>Wer betreut?</label>
          <input className={`${inputCls} w-full`} value={caregiver} onChange={(e) => setCaregiver(e.target.value)} placeholder="Papa / Mama / Name" />
        </div>
        <div>
          <label className={labelCls}>Beginn</label>
          <div className="flex gap-2">
            <select className={inputCls} value={startWeekday} onChange={(e) => setStartWeekday(Number(e.target.value))}>
              {WEEKDAYS_LONG.map((w, i) => (
                <option key={w} value={i}>{w}</option>
              ))}
            </select>
            <input type="time" className={inputCls} value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Ende</label>
          <div className="flex gap-2">
            <select className={inputCls} value={endWeekday} onChange={(e) => setEndWeekday(Number(e.target.value))}>
              {WEEKDAYS_LONG.map((w, i) => (
                <option key={w} value={i}>{w}</option>
              ))}
            </select>
            <input type="time" className={inputCls} value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Rhythmus</label>
          <select className={`${inputCls} w-full`} value={interval} onChange={(e) => setInterval(Number(e.target.value))}>
            <option value={1}>Jede Woche</option>
            <option value={2}>Jede 2. Woche</option>
            <option value={3}>Jede 3. Woche</option>
            <option value={4}>Jede 4. Woche</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>
            Erster Termin ab {interval > 1 ? "(legt fest, welche Wochen gelten)" : "(optional)"}
          </label>
          <input type="date" className={`${inputCls} w-full`} value={validFrom} onChange={(e) => setValidFrom(e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Sichtbarkeit</label>
          <select className={`${inputCls} w-full`} value={visibility} onChange={(e) => setVisibility(e.target.value)}>
            {VIS_OPTIONS.map((v) => (
              <option key={v.key} value={v.key}>{v.label}</option>
            ))}
          </select>
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <div className="mt-3 flex gap-2">
        <button type="button" className="btn btn-primary text-sm" onClick={save} disabled={saving}>
          {saving ? "Speichert …" : "Regel speichern"}
        </button>
        <button type="button" className="btn btn-ghost text-sm" onClick={onCancel}>
          Abbrechen
        </button>
      </div>
    </div>
  );
}

// ── Einzeltermin anlegen ────────────────────────────────────────────────────
function TerminForm({
  mediationId,
  onSaved,
  onCancel,
}: {
  mediationId: string;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [date, setDate] = useState(iso(new Date()));
  const [startTime, setStartTime] = useState("09:00");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("18:00");
  const [caregiver, setCaregiver] = useState("");
  const [note, setNote] = useState("");
  const [visibility, setVisibility] = useState("personal");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/mediations/${mediationId}/logbuch/betreuung/termine`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          planned_start: combine(date, startTime),
          planned_end: combine(endDate || date, endTime),
          caregiver: caregiver || null,
          note: note || null,
          status: "geplant",
          visibility,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.detail ?? "Termin konnte nicht angelegt werden.");
        return;
      }
      onSaved();
    } catch {
      setError("Server nicht erreichbar.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 sm:p-5">
      <p className="text-sm font-bold text-neutral-900">Einzeltermin anlegen</p>
      <p className="mt-0.5 text-xs text-neutral-500">
        Für Ferien, Feiertage oder getauschte Tage außerhalb des Wochenmusters.
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Geplanter Beginn</label>
          <div className="flex gap-2">
            <input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} />
            <input type="time" className={inputCls} value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Geplantes Ende</label>
          <div className="flex gap-2">
            <input type="date" className={inputCls} value={endDate || date} onChange={(e) => setEndDate(e.target.value)} />
            <input type="time" className={inputCls} value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Wer betreut?</label>
          <input className={`${inputCls} w-full`} value={caregiver} onChange={(e) => setCaregiver(e.target.value)} placeholder="Papa / Mama / Name" />
        </div>
        <div>
          <label className={labelCls}>Sichtbarkeit</label>
          <select className={`${inputCls} w-full`} value={visibility} onChange={(e) => setVisibility(e.target.value)}>
            {VIS_OPTIONS.map((v) => (
              <option key={v.key} value={v.key}>{v.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-3">
        <label className={labelCls}>Notiz (optional)</label>
        <input className={`${inputCls} w-full`} value={note} onChange={(e) => setNote(e.target.value)} placeholder="z. B. Osterferien 1. Hälfte" />
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <div className="mt-3 flex gap-2">
        <button type="button" className="btn btn-primary text-sm" onClick={save} disabled={saving}>
          {saving ? "Speichert …" : "Termin speichern"}
        </button>
        <button type="button" className="btn btn-ghost text-sm" onClick={onCancel}>
          Abbrechen
        </button>
      </div>
    </div>
  );
}

// ── Zeile in der Regel-Liste ────────────────────────────────────────────────
function RuleRow({
  mediationId,
  rule,
  onChanged,
}: {
  mediationId: string;
  rule: CareRule;
  onChanged: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const remove = async () => {
    setBusy(true);
    try {
      await fetch(`/api/mediations/${mediationId}/logbuch/betreuung/rules/${rule.id}`, {
        method: "DELETE",
      });
      onChanged();
    } finally {
      setBusy(false);
    }
  };

  const intervalTxt =
    (rule.interval_weeks ?? 1) === 1 ? "jede Woche" : `jede ${rule.interval_weeks}. Woche`;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5">
      <div className="text-sm text-neutral-800">
        <span className="font-semibold">
          {rule.label || rule.caregiver || "Betreuung"}
        </span>{" "}
        <span className="text-neutral-500">
          · {WEEKDAYS[rule.start_weekday]} {rule.start_time} – {WEEKDAYS[rule.end_weekday]} {rule.end_time} · {intervalTxt}
          {rule.caregiver && rule.label ? ` · ${rule.caregiver}` : ""}
        </span>
      </div>
      {confirm ? (
        <span className="flex items-center gap-2 text-xs">
          Wirklich löschen (inkl. Erfassungen)?
          <button type="button" className="btn btn-ghost text-xs text-red-600" onClick={remove} disabled={busy}>
            Ja, löschen
          </button>
          <button type="button" className="btn btn-ghost text-xs" onClick={() => setConfirm(false)}>
            Nein
          </button>
        </span>
      ) : (
        <button type="button" className="btn btn-ghost text-xs text-neutral-500" onClick={() => setConfirm(true)}>
          Löschen
        </button>
      )}
    </div>
  );
}
