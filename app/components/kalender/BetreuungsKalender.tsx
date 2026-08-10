"use client";
// ── Kalender ────────────────────────────────────────────────────────────────
// EINE Komponente für drei Orte: die eigene Seite (/dashboard/kalender), das
// Konflikt-Logbuch und – über dieselben Props – jeden weiteren Einbauort.
// Vorher lagen hier zwei Kalender nebeneinander, die nichts voneinander
// wussten: dieser für Betreuungszeiten und der Workspace-Kalender für
// Mediations-Termine. Wer beides nutzte, musste sich seinen Alltag aus zwei
// Ansichten zusammenreimen.
//
// Was der Kalender kann:
//   • geplante Betreuungszeiten (Serienregeln als Wochenmuster + Einzeltermine)
//     und die TATSÄCHLICHEN Zeiten je Termin – die Abweichung Plan ↔ Ist ist
//     die Doku-Leistung fürs Logbuch
//   • Absprachen zwischen den Eltern: Tausch, Zusatztag, Absage, Verschiebung
//     mit Zustimmung und Verlauf
//   • Kinder als Stammdaten: welches Kind ist wann bei wem (Filter je Kind)
//   • optional die Mediations-Termine als zweite Ebene (`zeigeTermine`)
//
// Steuerung über `variante`:
//   "eingebettet" – aufklappbarer Kasten (Logbuch, Fall)
//   "seite"       – dauerhaft offen, mit Kinder-Verwaltung und Anfrage-Inbox
//
// `nurLesen` ist der Kind-Zugang: sehen ja, ändern nein (Backend erzwingt es
// zusätzlich, siehe routers/betreuung.py `_require_writer`).
//
// API: /api/mediations/[id]/logbuch/betreuung/* (routers/betreuung.py),
//      /api/mediations/[id]/logbuch/kinder      (routers/kalender.py).

import { useCallback, useEffect, useMemo, useState } from "react";
import Icon from "@/app/components/ui/Icon";

export type Child = {
  id: number;
  name: string;
  birthdate: string | null;
  color: string | null;
  access_email: string | null;
  /** Konto verbunden – die Einladung wurde angenommen. */
  hat_zugang: boolean;
  /** Einladung raus, aber noch nicht angenommen. */
  eingeladen: boolean;
};

/** Termin aus einer Mediation (Sitzung, Video) – die zweite Ebene im Raster.
    Form wie /api/appointments/all (siehe app/workspace/types.ts). */
type Termin = {
  id: number;
  mediation_id: number;
  mediation_title: string;
  proposed_datetime: string;
  status?: string | null;
};

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
  child_ids: number[];
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
  title: string | null;
  // betreuung | ferien | feiertag – nur für die Darstellung.
  category: string;
  visibility: string;
  // false = erbetener Zusatztag, dem noch niemand zugestimmt hat. Er steht im
  // Kalender, zählt aber nicht als Plan (Backend: _is_binding).
  verbindlich: boolean;
  request_kind: string | null;
  request_status: string | null;
  request_by: number | null;
  request_start: string | null;
  request_end: string | null;
  request_message: string | null;
  request_answered_at: string | null;
  /** Leer = gilt für alle Kinder (so bleiben Altdaten ohne Zuordnung gültig). */
  child_ids: number[];
};

type VerlaufEvent = {
  id: number;
  participant_id: number | null;
  action: string;
  kind: string | null;
  proposed_start: string | null;
  proposed_end: string | null;
  message: string | null;
  created_at: string | null;
};

const KIND_LABELS: Record<string, string> = {
  tausch: "Tausch",
  zusatztag: "Zusätzlicher Tag",
  absage: "Absage",
  verschiebung: "Verschiebung",
};

const CATEGORY_OPTIONS = [
  { key: "betreuung", label: "Betreuung" },
  { key: "ferien", label: "Ferien" },
  { key: "feiertag", label: "Feiertag" },
];

// Feste Farbklassen je Kind – Tailwind braucht die Klassennamen im Klartext,
// zusammengebaute Strings ("bg-" + farbe) fliegen beim Build raus.
const CHILD_TONE: Record<string, string> = {
  sky: "border-sky-300 bg-sky-50 text-sky-800",
  violet: "border-violet-300 bg-violet-50 text-violet-800",
  emerald: "border-emerald-300 bg-emerald-50 text-emerald-800",
  amber: "border-amber-300 bg-amber-50 text-amber-800",
  rose: "border-rose-300 bg-rose-50 text-rose-800",
  teal: "border-teal-300 bg-teal-50 text-teal-800",
};
const CHILD_DOT: Record<string, string> = {
  sky: "bg-sky-400",
  violet: "bg-violet-400",
  emerald: "bg-emerald-400",
  amber: "bg-amber-400",
  rose: "bg-rose-400",
  teal: "bg-teal-400",
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

export type KalenderProps = {
  mediationId: string;
  /** "eingebettet" = aufklappbarer Kasten, "seite" = dauerhaft offene Ansicht. */
  variante?: "eingebettet" | "seite";
  /** Kind-Zugang: alles sichtbar, nichts änderbar. */
  nurLesen?: boolean;
  /** Mediations-Termine als zweite Ebene mitzeichnen. */
  zeigeTermine?: boolean;
  /** Überschrift im eingebetteten Kasten. */
  titel?: string;
  /** Auf dieses Datum springen (Deep-Link `?datum=…`). */
  startDatum?: string | null;
};

export default function BetreuungsKalender({
  mediationId,
  variante = "eingebettet",
  nurLesen = false,
  zeigeTermine = false,
  titel = "Betreuungskalender",
  startDatum = null,
}: KalenderProps) {
  const alsSeite = variante === "seite";
  // Auf der eigenen Seite gibt es nichts aufzuklappen – dort IST der Kalender
  // der Inhalt.
  const [open, setOpen] = useState(alsSeite);
  const [monthDate, setMonthDate] = useState(() => {
    const start = startDatum ? new Date(`${startDatum}T00:00:00`) : new Date();
    const gueltig = Number.isNaN(start.getTime()) ? new Date() : start;
    return new Date(gueltig.getFullYear(), gueltig.getMonth(), 1);
  });
  const [items, setItems] = useState<CareItem[]>([]);
  const [rules, setRules] = useState<CareRule[]>([]);
  const [me, setMe] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [showRuleForm, setShowRuleForm] = useState(false);
  const [showTerminForm, setShowTerminForm] = useState(false);
  const [showZusatzForm, setShowZusatzForm] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showKinder, setShowKinder] = useState(false);
  const [kinder, setKinder] = useState<Child[]>([]);
  // Filter auf ein Kind. Der eigentliche Zweck der Kinder-Stammdaten: bei zwei
  // Kindern mit verschiedenen Zeiten ist die ungefilterte Ansicht unlesbar.
  const [kindFilter, setKindFilter] = useState<number | null>(null);
  const [termine, setTermine] = useState<Termin[]>([]);
  const [anfragen, setAnfragen] = useState<CareItem[]>([]);

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
      setError("Der Kalender konnte nicht geladen werden.");
    } finally {
      setLoading(false);
    }

    // Beiwerk: Kinder, offene Anfragen und Mediations-Termine dürfen einzeln
    // scheitern, ohne den Kalender mitzureißen.
    try {
      const res = await fetch(`/api/mediations/${mediationId}/logbuch/kinder`, {
        cache: "no-store",
      });
      if (res.ok) setKinder((await res.json()) ?? []);
    } catch {
      /* Kinder sind optional – ohne sie gilt jede Zeile für alle. */
    }
    try {
      const res = await fetch(
        `/api/mediations/${mediationId}/logbuch/betreuung/anfragen`,
        { cache: "no-store" },
      );
      if (res.ok) setAnfragen((await res.json())?.items ?? []);
    } catch {
      /* Die Inbox ist eine Abkürzung, kein Ersatz für das Raster. */
    }
    if (zeigeTermine) {
      try {
        const res = await fetch("/api/appointments/all", { cache: "no-store" });
        if (res.ok) setTermine((await res.json()) ?? []);
      } catch {
        /* Mediations-Termine sind die zweite Ebene, nicht die erste. */
      }
    }
  }, [mediationId, gridDays, zeigeTermine]);

  useEffect(() => {
    if (open) void load();
  }, [open, load]);

  // Ein Termin gehört an JEDEN Tag, über den er läuft – ein Ferienblock oder
  // ein Wochenende von Freitag bis Sonntag stand bisher nur am ersten Tag im
  // Raster, was den Kalender an allen Folgetagen leer aussehen ließ.
  // Filter auf ein Kind. Zeilen OHNE Zuordnung gelten für alle Kinder und
  // bleiben deshalb immer stehen – sonst verschwände der gesamte Altbestand,
  // sobald jemand das erste Kind anlegt.
  const sichtbareItems = useMemo(
    () =>
      kindFilter == null
        ? items
        : items.filter(
            (it) => it.child_ids.length === 0 || it.child_ids.includes(kindFilter),
          ),
    [items, kindFilter],
  );

  const byDate = useMemo(() => {
    const map: Record<string, { it: CareItem; fortsetzung: boolean }[]> = {};
    for (const it of sichtbareItems) {
      const endDay = it.planned_end ? it.planned_end.slice(0, 10) : it.date;
      const days = [it.date];
      if (endDay > it.date) {
        const d = new Date(`${it.date}T00:00:00`);
        // Deckel: kein Block wird länger als ein Quartal gezeichnet.
        for (let i = 0; i < 92; i++) {
          d.setDate(d.getDate() + 1);
          const cur = iso(d);
          if (cur > endDay) break;
          days.push(cur);
        }
      }
      days.forEach((day, i) => {
        (map[day] ??= []).push({ it, fortsetzung: i > 0 });
      });
    }
    return map;
  }, [sichtbareItems]);

  // Mediations-Termine je Tag – die zweite Ebene. Sie sind Anzeige, nicht
  // Betreuung: hier wird nichts abgesprochen, nur eingeblendet, damit die
  // Sitzung nicht mit einem Übergabetag kollidiert.
  const termineByDate = useMemo(() => {
    const map: Record<string, Termin[]> = {};
    if (!zeigeTermine) return map;
    for (const t of termine) {
      if (!t.proposed_datetime) continue;
      (map[t.proposed_datetime.slice(0, 10)] ??= []).push(t);
    }
    return map;
  }, [termine, zeigeTermine]);

  const selected = useMemo(
    () => items.find((i) => i.key === selectedKey) ?? null,
    [items, selectedKey],
  );

  const kindById = useMemo(() => {
    const map: Record<number, Child> = {};
    for (const k of kinder) map[k.id] = k;
    return map;
  }, [kinder]);

  /** Offene Anfragen, die auf MICH warten – nur die gehören nach oben. */
  const wartetAufMich = useMemo(
    () => anfragen.filter((a) => a.request_by != null && a.request_by !== me),
    [anfragen, me],
  );

  const todayIso = iso(new Date());
  const monthLabel = monthDate.toLocaleDateString("de-DE", { month: "long", year: "numeric" });

  const itemTone = (it: CareItem): string => {
    // Reihenfolge ist Absicht: was noch verhandelt wird, sticht vor dem, was
    // schon dokumentiert ist – sonst übersieht man eine offene Bitte.
    if (!it.verbindlich) return "border-dashed border-amber-400 bg-white text-amber-700";
    if (it.request_status === "offen") return "border-amber-300 bg-amber-50 text-amber-800";
    if (it.status === "ausgefallen") return "border-red-200 bg-red-50 text-red-700";
    if (it.category === "ferien" || it.category === "feiertag")
      return "border-neutral-300 bg-neutral-100 text-neutral-700";
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
    <section
      className={
        alsSeite
          ? "overflow-hidden"
          : "mt-8 overflow-hidden rounded-2xl border border-neutral-200 bg-white"
      }
    >
      {!alsSeite && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between px-6 py-4 text-left"
        >
          <span>
            <span className="block text-sm font-bold text-neutral-900">
              <Icon name="calendar" color="currentColor" /> {titel}
            </span>
            <span className="mt-0.5 block text-xs text-neutral-500">
              Geplante und tatsächliche Betreuungszeiten festhalten – Abweichungen
              werden automatisch sichtbar.
            </span>
          </span>
          <span className="text-neutral-400">{open ? "▴" : "▾"}</span>
        </button>
      )}

      {open && (
        <div
          className={
            alsSeite ? "" : "border-t border-neutral-200 px-4 pb-6 pt-4 sm:px-6"
          }
        >
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
              {!nurLesen && (
                <button
                  type="button"
                  className="btn btn-ghost text-xs"
                  onClick={() => setShowKinder((v) => !v)}
                >
                  Kinder ({kinder.length})
                </button>
              )}
              {!nurLesen && (
              <button
                type="button"
                className="btn btn-ghost text-xs"
                onClick={() => {
                  setShowTerminForm((v) => !v);
                  setShowRuleForm(false);
                  setShowZusatzForm(false);
                }}
              >
                + Einzeltermin
              </button>
              )}
              {!nurLesen && (
              <button
                type="button"
                className="btn btn-ghost text-xs"
                onClick={() => {
                  setShowZusatzForm((v) => !v);
                  setShowRuleForm(false);
                  setShowTerminForm(false);
                }}
              >
                <Icon name="repeat" color="currentColor" /> Zusätzlichen Tag erbitten
              </button>
              )}
              {!nurLesen && (
              <button
                type="button"
                className="btn btn-primary text-xs"
                onClick={() => {
                  setShowRuleForm((v) => !v);
                  setShowTerminForm(false);
                  setShowZusatzForm(false);
                }}
              >
                + Wiederkehrende Betreuung
              </button>
              )}
            </div>
          </div>

          {nurLesen && (
            <p className="mt-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-xs text-neutral-500">
              Du siehst deinen Betreuungsplan. Ändern können ihn nur deine
              Eltern – was abgesprochen wird, machen sie untereinander aus.
            </p>
          )}

          {/* Offene Bitten der Gegenseite. Ohne diese Zeile findet man eine
              Anfrage nur, wenn man zufällig in den richtigen Monat blättert –
              und eine übersehene Absprache ist keine. */}
          {!nurLesen && wartetAufMich.length > 0 && (
            <div className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3">
              <p className="text-xs font-bold text-amber-900">
                <Icon name="repeat" size={13} color="currentColor" />{" "}
                {wartetAufMich.length === 1
                  ? "Eine Bitte wartet auf deine Antwort"
                  : `${wartetAufMich.length} Bitten warten auf deine Antwort`}
              </p>
              <ul className="mt-1.5 space-y-1">
                {wartetAufMich.slice(0, 4).map((a) => (
                  <li key={a.key}>
                    <button
                      type="button"
                      className="text-left text-xs text-amber-800 underline decoration-amber-300 underline-offset-2 hover:text-amber-900"
                      onClick={() => {
                        const tag = new Date(`${a.date}T00:00:00`);
                        setMonthDate(new Date(tag.getFullYear(), tag.getMonth(), 1));
                        setSelectedKey(a.key);
                      }}
                    >
                      {KIND_LABELS[a.request_kind ?? ""] ?? "Änderung"} ·{" "}
                      {fmtDay(a.date)} ·{" "}
                      {a.request_start
                        ? fmtSpan(a.request_start, a.request_end)
                        : "soll entfallen"}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Filter je Kind – der eigentliche Zweck der Stammdaten. */}
          {kinder.length > 1 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-neutral-500">Kind:</span>
              <button
                type="button"
                onClick={() => setKindFilter(null)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                  kindFilter == null
                    ? "border-accent-500 bg-accent-500 text-white"
                    : "border-neutral-300 bg-white text-neutral-600"
                }`}
              >
                Alle
              </button>
              {kinder.map((k) => (
                <button
                  key={k.id}
                  type="button"
                  onClick={() => setKindFilter(kindFilter === k.id ? null : k.id)}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                    kindFilter === k.id
                      ? "border-accent-500 bg-accent-500 text-white"
                      : "border-neutral-300 bg-white text-neutral-600"
                  }`}
                >
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${
                      CHILD_DOT[k.color ?? ""] ?? "bg-neutral-300"
                    }`}
                  />
                  {k.name}
                </button>
              ))}
            </div>
          )}

          {showKinder && !nurLesen && (
            <KinderVerwaltung
              mediationId={mediationId}
              kinder={kinder}
              onChanged={load}
            />
          )}

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
              kinder={kinder}
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
              kinder={kinder}
              mediationId={mediationId}
              onSaved={() => {
                setShowTerminForm(false);
                void load();
              }}
              onCancel={() => setShowTerminForm(false)}
            />
          )}
          {showZusatzForm && (
            <ZusatztagForm
              kinder={kinder}
              mediationId={mediationId}
              onSaved={() => {
                setShowZusatzForm(false);
                void load();
              }}
              onCancel={() => setShowZusatzForm(false)}
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
                  {dayItems.map(({ it, fortsetzung }) => (
                    <button
                      key={`${it.key}${fortsetzung ? "-f" : ""}`}
                      type="button"
                      onClick={() => setSelectedKey(it.key === selectedKey ? null : it.key)}
                      className={`mb-1 block w-full truncate rounded border px-1 py-0.5 text-left text-[10px] leading-4 ${itemTone(it)} ${
                        it.key === selectedKey ? "ring-2 ring-accent-400" : ""
                      }`}
                      title={[
                        it.title ?? it.label ?? it.caregiver ?? "Betreuung",
                        it.request_status === "offen"
                          ? `Offene Anfrage: ${KIND_LABELS[it.request_kind ?? ""] ?? "Änderung"}`
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    >
                      {!fortsetzung && it.request_status === "offen" ? (
                        <>
                          <Icon name="repeat" size={10} color="currentColor" />{" "}
                        </>
                      ) : null}
                      {/* Ein Punkt je betroffenem Kind – ohne Zuordnung kein
                          Punkt, denn dann gilt der Termin ohnehin für alle. */}
                      {it.child_ids.slice(0, 3).map((cid) => (
                        <span
                          key={cid}
                          className={`mr-0.5 inline-block h-1.5 w-1.5 rounded-full align-middle ${
                            CHILD_DOT[kindById[cid]?.color ?? ""] ?? "bg-neutral-300"
                          }`}
                        />
                      ))}
                      {fortsetzung ? "↳ " : `${fmtTime(it.planned_start)} `}
                      {it.caregiver || it.title || it.label || ""}
                    </button>
                  ))}
                  {/* Zweite Ebene: Mediations-Termine. Bewusst anders gezeichnet
                      und nicht anklickbar – hier wird nichts verhandelt. */}
                  {(termineByDate[day] ?? []).map((t) => (
                    <span
                      key={`termin-${t.id}`}
                      className="mb-1 block w-full truncate rounded border border-dashed border-neutral-400 bg-neutral-50 px-1 py-0.5 text-left text-[10px] leading-4 text-neutral-600"
                      title={[
                        t.mediation_title,
                        t.status === "confirmed" ? "bestätigt" : "noch nicht final",
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    >
                      {fmtTime(t.proposed_datetime)}{" "}
                      {t.mediation_title || "Mediations-Termin"}
                    </span>
                  ))}
                </div>
              );
            })}
          </div>

          <p className="mt-2 text-[11px] text-neutral-400">
            <span className="mr-3"><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm border border-accent-200 bg-accent-50 align-middle" /> geplant</span>
            <span className="mr-3"><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm border border-emerald-300 bg-emerald-100 align-middle" /> stattgefunden (wie geplant)</span>
            <span className="mr-3"><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm border border-amber-300 bg-amber-100 align-middle" /> mit Abweichung</span>
            <span className="mr-3"><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm border border-red-300 bg-red-100 align-middle" /> ausgefallen</span>
            <span className="mr-3"><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm border border-dashed border-amber-400 bg-white align-middle" /> erbeten, noch offen</span>
            <span className="mr-3"><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm border border-neutral-300 bg-neutral-100 align-middle" /> Ferien / Feiertag</span>
            {zeigeTermine && (
              <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm border border-dashed border-neutral-400 bg-neutral-50 align-middle" /> Mediations-Termin</span>
            )}
          </p>

          {loading && <p className="mt-3 text-sm text-neutral-400">Wird geladen …</p>}

          {selected && (
            <IstErfassung
              key={selected.key}
              mediationId={mediationId}
              me={me}
              kinder={kinder}
              nurLesen={nurLesen}
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
  kinder,
  nurLesen = false,
  item,
  onSaved,
  onClose,
}: {
  mediationId: string;
  me: number | null;
  kinder: Child[];
  nurLesen?: boolean;
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
  const [childIds, setChildIds] = useState<number[]>(item.child_ids ?? []);
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
      child_ids: childIds,
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

      {nurLesen ? (
        <div className="mt-3 text-xs text-neutral-600">
          <p>
            Tatsächlich: {fmtSpan(item.actual_start, item.actual_end)}
            {item.status === "ausgefallen" ? " · ausgefallen" : ""}
          </p>
          {item.child_ids.length > 0 && (
            <p className="mt-1">
              Für:{" "}
              {item.child_ids
                .map((cid) => kinder.find((k) => k.id === cid)?.name)
                .filter(Boolean)
                .join(", ")}
            </p>
          )}
          {item.note && <p className="mt-1 italic text-neutral-500">„{item.note}“</p>}
        </div>
      ) : (
      <>
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

      {kinder.length > 0 && (
        <div className="mt-3">
          <label className={labelCls}>Für welche Kinder gilt dieser Termin?</label>
          <KindAuswahl kinder={kinder} ausgewaehlt={childIds} onChange={setChildIds} />
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
      </>
      )}

      {/* Absprachen sind Sache der Eltern. Ein Kind, das zustimmen oder
          ablehnen kann, wird zur Partei im Streit seiner Eltern – genau das
          soll dieser Zugang nicht. */}
      {!nurLesen && (
        <AbspracheBlock mediationId={mediationId} me={me} item={item} onChanged={onSaved} />
      )}
    </div>
  );
}

// ── Absprachen (nur geteilte Termine) ───────────────────────────────────────
// Vier Arten, ein Ablauf: eine Seite bittet um eine Änderung, die andere
// stimmt zu, lehnt ab oder schlägt etwas anderes vor. Für Serien-Vorkommen
// ohne eigene Erfassung wird zuerst still ein Override angelegt
// (POST …/termine), weil eine Anfrage eine Termin-ID braucht.
function AbspracheBlock({
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
  // Welches Formular offen ist: eine Anfrage-Art oder "gegenvorschlag".
  const [formKind, setFormKind] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(toDateInput(item.planned_start) || item.date);
  const [startTime, setStartTime] = useState(toTimeInput(item.planned_start));
  const [endDate, setEndDate] = useState(toDateInput(item.planned_end) || item.date);
  const [endTime, setEndTime] = useState(toTimeInput(item.planned_end));
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [verlauf, setVerlauf] = useState<VerlaufEvent[] | null>(null);

  const base = `/api/mediations/${mediationId}/logbuch/betreuung`;
  const offen = item.request_status === "offen";
  const meine = item.request_by != null && item.request_by === me;
  const kindLabel = KIND_LABELS[item.request_kind ?? ""] ?? "Änderung";

  if (item.visibility !== "shared") {
    return (
      <p className="mt-3 border-t border-accent-200/60 pt-3 text-xs text-neutral-400">
        <Icon name="repeat" size={12} color="currentColor" /> Absprachen gehen nur bei
        geteilten Terminen – stellen Sie die Sichtbarkeit der Regel bzw. des
        Termins auf „Geteilt“, damit die eingeladene Person (z. B. der andere
        Elternteil) den Kalender sieht.
      </p>
    );
  }

  const ensureEntryId = async (): Promise<number | null> => {
    if (item.entry_id) return item.entry_id;
    const res = await fetch(`${base}/termine`, {
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

  const fehler = async (res: Response, fallback: string) => {
    const data = await res.json().catch(() => null);
    setError(data?.detail ?? data?.error ?? fallback);
  };

  const anfragen = async (kind: string) => {
    setBusy(true);
    setError("");
    try {
      const entryId = await ensureEntryId();
      if (!entryId) {
        setError("Anfrage fehlgeschlagen – der Termin ließ sich nicht anlegen.");
        return;
      }
      const zeiten = kind === "absage";
      const res = await fetch(`${base}/termine/${entryId}/anfrage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          proposed_start: zeiten ? null : combine(startDate, startTime),
          proposed_end: zeiten ? null : combine(endDate, endTime),
          message: message || null,
        }),
      });
      if (!res.ok) return void (await fehler(res, "Anfrage fehlgeschlagen."));
      setFormKind(null);
      setMessage("");
      onChanged();
    } catch {
      setError("Server nicht erreichbar.");
    } finally {
      setBusy(false);
    }
  };

  const antworten = async (aktion: "akzeptieren" | "ablehnen" | "gegenvorschlag") => {
    if (!item.entry_id) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`${base}/termine/${item.entry_id}/anfrage/antwort`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aktion,
          proposed_start: aktion === "gegenvorschlag" ? combine(startDate, startTime) : null,
          proposed_end: aktion === "gegenvorschlag" ? combine(endDate, endTime) : null,
          message: message || null,
        }),
      });
      if (!res.ok) return void (await fehler(res, "Antwort fehlgeschlagen."));
      setFormKind(null);
      setMessage("");
      onChanged();
    } catch {
      setError("Server nicht erreichbar.");
    } finally {
      setBusy(false);
    }
  };

  const zurueckziehen = async () => {
    if (!item.entry_id) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`${base}/termine/${item.entry_id}/anfrage`, { method: "DELETE" });
      if (!res.ok) return void (await fehler(res, "Zurückziehen fehlgeschlagen."));
      onChanged();
    } catch {
      setError("Server nicht erreichbar.");
    } finally {
      setBusy(false);
    }
  };

  const ladeVerlauf = async () => {
    if (!item.entry_id) return;
    if (verlauf) return setVerlauf(null); // zweiter Klick klappt zu
    try {
      const res = await fetch(`${base}/termine/${item.entry_id}/verlauf`, { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setVerlauf(data.events ?? []);
    } catch {
      /* Verlauf ist Beiwerk – ein Fehler darf die Ansicht nicht stören. */
    }
  };

  const zeitFelder = formKind !== "absage";

  return (
    <div className="mt-3 border-t border-accent-200/60 pt-3">
      {offen ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
          <p className="text-xs font-bold text-amber-800">
            <Icon name="repeat" color="currentColor" /> {kindLabel}{" "}
            {meine ? "– von Ihnen erbeten" : "– die andere Seite bittet darum"}
          </p>
          {item.request_start ? (
            <p className="mt-1 text-xs text-amber-800">
              Vorschlag: {fmtDay(item.request_start.slice(0, 10))}{" "}
              {fmtSpan(item.request_start, item.request_end)}
            </p>
          ) : (
            <p className="mt-1 text-xs text-amber-800">
              Der Termin soll ersatzlos entfallen.
            </p>
          )}
          {item.request_message && (
            <p className="mt-1 text-xs italic text-amber-700">„{item.request_message}“</p>
          )}

          {!meine && formKind !== "gegenvorschlag" && (
            <div className="mt-2 flex flex-wrap gap-2">
              <button type="button" className="btn btn-primary text-xs" onClick={() => antworten("akzeptieren")} disabled={busy}>
                Zustimmen
              </button>
              <button type="button" className="btn btn-ghost text-xs" onClick={() => antworten("ablehnen")} disabled={busy}>
                Ablehnen
              </button>
              <button type="button" className="btn btn-ghost text-xs" onClick={() => setFormKind("gegenvorschlag")} disabled={busy}>
                Anderes vorschlagen
              </button>
            </div>
          )}
          {meine && (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-amber-600">Wartet auf Antwort.</span>
              <button type="button" className="btn btn-ghost text-xs" onClick={zurueckziehen} disabled={busy}>
                Zurückziehen
              </button>
            </div>
          )}
        </div>
      ) : (
        !formKind && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-neutral-500">Absprechen:</span>
            <button type="button" className="btn btn-ghost text-xs" onClick={() => setFormKind("tausch")}>
              Tausch
            </button>
            <button type="button" className="btn btn-ghost text-xs" onClick={() => setFormKind("verschiebung")}>
              Verschieben
            </button>
            <button type="button" className="btn btn-ghost text-xs" onClick={() => setFormKind("absage")}>
              Absagen
            </button>
            {item.request_status === "akzeptiert" && (
              <span className="text-[11px] font-semibold text-emerald-700">
                Letzte Anfrage ({kindLabel}) wurde angenommen.
              </span>
            )}
            {item.request_status === "abgelehnt" && (
              <span className="text-[11px] font-semibold text-red-600">
                Letzte Anfrage ({kindLabel}) wurde abgelehnt.
              </span>
            )}
            {item.request_status === "zurueckgezogen" && (
              <span className="text-[11px] font-semibold text-neutral-500">
                Letzte Anfrage wurde zurückgezogen.
              </span>
            )}
          </div>
        )
      )}

      {formKind && (
        <div className={offen ? "mt-3" : ""}>
          <p className="text-xs font-bold text-neutral-700">
            <Icon name="repeat" color="currentColor" />{" "}
            {formKind === "gegenvorschlag"
              ? "Etwas anderes vorschlagen"
              : formKind === "absage"
                ? "Termin absagen"
                : `${KIND_LABELS[formKind]} vorschlagen`}
          </p>
          {zeitFelder && (
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
          )}
          <div className="mt-2">
            <label className={labelCls}>Nachricht (optional)</label>
            <input
              className={`${inputCls} w-full`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                formKind === "absage"
                  ? "z. B. Ich bin an dem Wochenende krank."
                  : "z. B. Am Freitag habe ich einen Termin – ginge Samstag?"
              }
            />
          </div>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              className="btn btn-primary text-xs"
              onClick={() =>
                formKind === "gegenvorschlag" ? antworten("gegenvorschlag") : anfragen(formKind)
              }
              disabled={busy}
            >
              {busy ? "Sendet …" : "Absenden"}
            </button>
            <button type="button" className="btn btn-ghost text-xs" onClick={() => setFormKind(null)}>
              Abbrechen
            </button>
          </div>
        </div>
      )}

      {item.entry_id != null && item.request_kind && (
        <button type="button" className="mt-2 text-[11px] font-semibold text-neutral-500 underline" onClick={ladeVerlauf}>
          {verlauf ? "Verlauf ausblenden" : "Verlauf anzeigen"}
        </button>
      )}
      {verlauf && <VerlaufListe events={verlauf} me={me} />}

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}

// ── Verlauf einer Absprache ─────────────────────────────────────────────────
// Wichtig bei Betreuungszeiten: nach zwei Gegenvorschlägen weiß sonst niemand
// mehr, worum ursprünglich gebeten wurde.
const ACTION_LABELS: Record<string, string> = {
  angefragt: "hat gebeten um",
  gegenvorschlag: "schlägt stattdessen vor",
  akzeptiert: "hat zugestimmt",
  abgelehnt: "hat abgelehnt",
  zurueckgezogen: "hat zurückgezogen",
};

function VerlaufListe({ events, me }: { events: VerlaufEvent[]; me: number | null }) {
  if (events.length === 0) {
    return <p className="mt-2 text-[11px] text-neutral-400">Noch kein Verlauf.</p>;
  }
  return (
    <ol className="mt-2 space-y-1.5 border-l-2 border-neutral-200 pl-3">
      {events.map((e) => (
        <li key={e.id} className="text-[11px] leading-4 text-neutral-600">
          <span className="font-semibold text-neutral-800">
            {e.participant_id != null && e.participant_id === me ? "Sie" : "Die andere Seite"}
          </span>{" "}
          {ACTION_LABELS[e.action] ?? e.action}
          {e.kind ? ` (${KIND_LABELS[e.kind] ?? e.kind})` : ""}
          {e.proposed_start ? `: ${fmtDay(e.proposed_start.slice(0, 10))} ${fmtSpan(e.proposed_start, e.proposed_end)}` : ""}
          {e.created_at ? (
            <span className="text-neutral-400"> · {fmtDay(e.created_at.slice(0, 10))}</span>
          ) : null}
          {e.message ? <span className="block italic text-neutral-500">„{e.message}“</span> : null}
        </li>
      ))}
    </ol>
  );
}

// ── Serienregel anlegen ─────────────────────────────────────────────────────
function RuleForm({
  mediationId,
  kinder,
  onSaved,
  onCancel,
}: {
  mediationId: string;
  kinder: Child[];
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [childIds, setChildIds] = useState<number[]>([]);
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
          child_ids: childIds,
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
      {kinder.length > 0 && (
        <div className="mt-3">
          <label className={labelCls}>Für welche Kinder gilt diese Regel?</label>
          <KindAuswahl kinder={kinder} ausgewaehlt={childIds} onChange={setChildIds} />
        </div>
      )}
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
  kinder,
  onSaved,
  onCancel,
}: {
  mediationId: string;
  kinder: Child[];
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [childIds, setChildIds] = useState<number[]>([]);
  const [date, setDate] = useState(iso(new Date()));
  const [startTime, setStartTime] = useState("09:00");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("18:00");
  const [caregiver, setCaregiver] = useState("");
  const [note, setNote] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("betreuung");
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
          title: title || null,
          category,
          status: "geplant",
          visibility,
          child_ids: childIds,
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
        Über mehrere Tage laufende Blöcke stehen im Raster an jedem Tag.
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
          <label className={labelCls}>Art</label>
          <select className={`${inputCls} w-full`} value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Bezeichnung (optional)</label>
          <input className={`${inputCls} w-full`} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="z. B. Sommerferien, erste Hälfte" />
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
      {kinder.length > 0 && (
        <div className="mt-3">
          <label className={labelCls}>Für welche Kinder?</label>
          <KindAuswahl kinder={kinder} ausgewaehlt={childIds} onChange={setChildIds} />
        </div>
      )}
      <div className="mt-3">
        <label className={labelCls}>Notiz (optional)</label>
        <input className={`${inputCls} w-full`} value={note} onChange={(e) => setNote(e.target.value)} placeholder="z. B. Abholung an der Schule" />
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

// ── Zusätzlichen Tag erbitten ───────────────────────────────────────────────
// Anders als der Einzeltermin ist das eine BITTE: der Termin entsteht sofort,
// steht aber gestrichelt im Kalender und zählt erst als Plan, wenn die andere
// Seite zugestimmt hat. Deshalb immer geteilt – eine Bitte, die nur man selbst
// sieht, wäre sinnlos.
function ZusatztagForm({
  mediationId,
  kinder,
  onSaved,
  onCancel,
}: {
  mediationId: string;
  kinder: Child[];
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [childIds, setChildIds] = useState<number[]>([]);
  const [date, setDate] = useState(iso(new Date()));
  const [startTime, setStartTime] = useState("09:00");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("18:00");
  const [caregiver, setCaregiver] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("betreuung");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(
        `/api/mediations/${mediationId}/logbuch/betreuung/anfragen/zusatztag`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date,
            proposed_start: combine(date, startTime),
            proposed_end: combine(endDate || date, endTime),
            caregiver: caregiver || null,
            title: title || null,
            category,
            message: message || null,
            child_ids: childIds,
          }),
        },
      );
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.detail ?? data?.error ?? "Anfrage konnte nicht gestellt werden.");
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
    <div className="mt-4 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/40 p-4 sm:p-5">
      <p className="text-sm font-bold text-neutral-900">Zusätzlichen Tag erbitten</p>
      <p className="mt-0.5 text-xs text-neutral-500">
        Die andere Seite bekommt eine Anfrage und kann zustimmen, ablehnen oder
        etwas anderes vorschlagen. Bis dahin steht der Tag nur als Vorschlag im
        Kalender.
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Von</label>
          <div className="flex gap-2">
            <input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} />
            <input type="time" className={inputCls} value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Bis</label>
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
          <label className={labelCls}>Art</label>
          <select className={`${inputCls} w-full`} value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Bezeichnung (optional)</label>
          <input className={`${inputCls} w-full`} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="z. B. Geburtstag Oma" />
        </div>
        <div>
          <label className={labelCls}>Nachricht (optional)</label>
          <input className={`${inputCls} w-full`} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Warum wäre dieser Tag wichtig?" />
        </div>
      </div>
      {kinder.length > 0 && (
        <div className="mt-3">
          <label className={labelCls}>Für welche Kinder?</label>
          <KindAuswahl kinder={kinder} ausgewaehlt={childIds} onChange={setChildIds} />
        </div>
      )}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <div className="mt-3 flex gap-2">
        <button type="button" className="btn btn-primary text-sm" onClick={save} disabled={saving}>
          {saving ? "Sendet …" : "Anfrage senden"}
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
          {rule.child_ids?.length ? ` · ${rule.child_ids.length} Kind(er)` : ""}
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

// ── Kinder auswählen ────────────────────────────────────────────────────────
// Nichts auswählen heißt „gilt für alle" – das ist der Normalfall bei einem
// Kind und hält alle Zeilen aus der Zeit vor den Stammdaten gültig.
function KindAuswahl({
  kinder,
  ausgewaehlt,
  onChange,
}: {
  kinder: Child[];
  ausgewaehlt: number[];
  onChange: (ids: number[]) => void;
}) {
  const toggle = (id: number) =>
    onChange(
      ausgewaehlt.includes(id)
        ? ausgewaehlt.filter((i) => i !== id)
        : [...ausgewaehlt, id],
    );

  return (
    <div className="flex flex-wrap gap-2">
      {kinder.map((k) => {
        const an = ausgewaehlt.includes(k.id);
        return (
          <button
            key={k.id}
            type="button"
            onClick={() => toggle(k.id)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
              an
                ? CHILD_TONE[k.color ?? ""] ?? "border-accent-400 bg-accent-50 text-accent-700"
                : "border-neutral-300 bg-white text-neutral-500"
            }`}
          >
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                CHILD_DOT[k.color ?? ""] ?? "bg-neutral-300"
              }`}
            />
            {k.name}
          </button>
        );
      })}
      <span className="self-center text-[11px] text-neutral-400">
        {ausgewaehlt.length === 0 ? "keine Auswahl = gilt für alle" : ""}
      </span>
    </div>
  );
}

// ── Kinder verwalten ────────────────────────────────────────────────────────
// Bewusst schlicht: Name und Geburtsdatum. Alles Weitere (Schule, Arzt,
// Allergien) gehört nicht in einen Kalender, den beide Elternteile sehen –
// das wäre ein Datensatz über ein Kind, kein Betreuungsplan.
function KinderVerwaltung({
  mediationId,
  kinder,
  onChanged,
}: {
  mediationId: string;
  kinder: Child[];
  onChanged: () => void;
}) {
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [zugangFuer, setZugangFuer] = useState<number | null>(null);
  const [zugangMail, setZugangMail] = useState("");

  const base = `/api/mediations/${mediationId}/logbuch/kinder`;

  // Zwei Schritte, bewusst in dieser Reihenfolge: erst die Einladung (sie kann
  // scheitern – falsche Adresse, Rollen-Sperre im Backend), dann der Vermerk
  // am Kind. Andersherum stünde eine Adresse am Kind, zu der nie eine
  // Einladung ging.
  const einladen = async (childId: number) => {
    const mail = zugangMail.trim();
    if (!mail) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/mediations/${mediationId}/invites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invited_email: mail, role: "kind" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.detail ?? data?.error ?? "Einladung fehlgeschlagen.");
        return;
      }
      await fetch(`${base}/${childId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_email: mail }),
      });
      setZugangFuer(null);
      setZugangMail("");
      onChanged();
    } catch {
      setError("Server nicht erreichbar.");
    } finally {
      setBusy(false);
    }
  };

  const anlegen = async () => {
    if (!name.trim()) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch(base, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), birthdate: birthdate || null }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.detail ?? data?.error ?? "Kind konnte nicht angelegt werden.");
        return;
      }
      setName("");
      setBirthdate("");
      onChanged();
    } catch {
      setError("Server nicht erreichbar.");
    } finally {
      setBusy(false);
    }
  };

  const loeschen = async (id: number) => {
    setBusy(true);
    try {
      await fetch(`${base}/${id}`, { method: "DELETE" });
      setConfirmId(null);
      onChanged();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 sm:p-5">
      <p className="text-sm font-bold text-neutral-900">Kinder</p>
      <p className="mt-0.5 text-xs text-neutral-500">
        Wer im Kalender vorkommt. Erst mit Kindern lässt sich sagen, wer wann bei
        wem ist – und nach einzelnen Kindern filtern.
      </p>

      {kinder.length > 0 && (
        <div className="mt-3 space-y-2">
          {kinder.map((k) => (
            <div
              key={k.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5"
            >
              <span className="flex items-center gap-2 text-sm text-neutral-800">
                <span
                  className={`inline-block h-2.5 w-2.5 rounded-full ${
                    CHILD_DOT[k.color ?? ""] ?? "bg-neutral-300"
                  }`}
                />
                <span className="font-semibold">{k.name}</span>
                {k.birthdate && (
                  <span className="text-neutral-500">
                    · geb. {fmtDay(k.birthdate)}
                  </span>
                )}
                {k.hat_zugang && (
                  <span className="rounded-full bg-accent-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent-700">
                    eigener Zugang
                  </span>
                )}
                {!k.hat_zugang && k.eingeladen && (
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-neutral-500">
                    eingeladen
                  </span>
                )}
              </span>
              <span className="flex items-center gap-2">
              {!k.hat_zugang && (
                <button
                  type="button"
                  className="btn btn-ghost text-xs"
                  onClick={() => setZugangFuer(zugangFuer === k.id ? null : k.id)}
                >
                  {k.eingeladen ? "Einladung erneut senden" : "Zugang einladen"}
                </button>
              )}
              {confirmId === k.id ? (
                <span className="flex items-center gap-2 text-xs">
                  Wirklich entfernen?
                  <button
                    type="button"
                    className="btn btn-ghost text-xs text-red-600"
                    onClick={() => loeschen(k.id)}
                    disabled={busy}
                  >
                    Ja
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost text-xs"
                    onClick={() => setConfirmId(null)}
                  >
                    Nein
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  className="btn btn-ghost text-xs text-neutral-500"
                  onClick={() => setConfirmId(k.id)}
                >
                  Entfernen
                </button>
              )}
              </span>

              {zugangFuer === k.id && (
                <div className="w-full border-t border-neutral-100 pt-2.5">
                  <label className={labelCls}>
                    E-Mail-Adresse von {k.name}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <input
                      className={`${inputCls} min-w-[220px] flex-1`}
                      value={zugangMail}
                      onChange={(e) => setZugangMail(e.target.value)}
                      placeholder="name@beispiel.de"
                    />
                    <button
                      type="button"
                      className="btn btn-primary text-sm"
                      onClick={() => einladen(k.id)}
                      disabled={busy || !zugangMail.trim()}
                    >
                      Einladen
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost text-sm"
                      onClick={() => setZugangFuer(null)}
                    >
                      Abbrechen
                    </button>
                  </div>
                  <p className="mt-1.5 text-[11px] text-neutral-400">
                    {k.name} sieht damit ausschließlich die geteilten
                    Betreuungszeiten – keine Logbuch-Einträge, keine Absprachen
                    und kein Recht, etwas zu ändern.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-end">
        <div>
          <label className={labelCls}>Name</label>
          <input
            className={`${inputCls} w-full`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Vorname"
          />
        </div>
        <div>
          <label className={labelCls}>Geburtsdatum (optional)</label>
          <input
            type="date"
            className={inputCls}
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="btn btn-primary text-sm"
          onClick={anlegen}
          disabled={busy || !name.trim()}
        >
          Hinzufügen
        </button>
      </div>

      <p className="mt-3 text-[11px] text-neutral-400">
        Ein Kind kann einen eigenen Zugang bekommen: Einladung im Logbuch mit der
        Rolle „Kind". Es sieht dann ausschließlich den geteilten Betreuungsplan –
        keine Einträge, keine Absprachen, kein Antwortrecht.
      </p>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
