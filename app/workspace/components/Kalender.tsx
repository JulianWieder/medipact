"use client";

import { useEffect, useState } from "react";
import type { AppointmentEvent } from "../types";
import { TYPE_COLOR, TYPE_LABEL } from "../types";
import { fetchAllAppointments } from "../api";
import { WCard, SectionHeader, EmptyState } from "../ui";

const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const MONTHS = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
];

function statusLabel(status?: string) {
  if (status === "reserved") return "Reserviert · wartet auf Mediator";
  if (status === "proposed") return "Vorschlag · noch nicht final";
  return null;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function startOfMonth(year: number, month: number) {
  return new Date(year, month, 1);
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

// Monday-first offset
function monthOffset(year: number, month: number) {
  const day = startOfMonth(year, month).getDay(); // 0=Sun
  return day === 0 ? 6 : day - 1;
}

interface KalenderProps {
  isAdmin?: boolean;
  /** Springt beim Setzen direkt in die Tagesansicht dieses Datums (z.B. Klick auf einen Termin im Dashboard). */
  jumpToDate?: Date | null;
}

const DAY_HOURS = Array.from({ length: 15 }, (_, i) => i + 7); // 07–21 Uhr

export function Kalender({ isAdmin = false, jumpToDate = null }: KalenderProps) {
  const [events, setEvents] = useState<AppointmentEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"monat" | "tag" | "liste">("monat");

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState<Date | null>(null);
  const [tagDate, setTagDate] = useState<Date>(today);

  useEffect(() => {
    fetchAllAppointments()
      .then(setEvents)
      .finally(() => setLoading(false));
  }, [isAdmin]);

  // Von außen (z.B. Dashboard) auf ein Datum springen → Tagesansicht öffnen
  useEffect(() => {
    if (jumpToDate) {
      setTagDate(jumpToDate);
      setYear(jumpToDate.getFullYear());
      setMonth(jumpToDate.getMonth());
      setSelected(jumpToDate);
      setView("tag");
    }
  }, [jumpToDate]);

  const offset = monthOffset(year, month);
  const days = daysInMonth(year, month);
  const cells = offset + days;
  const rows = Math.ceil(cells / 7);

  function eventsForDay(d: Date) {
    return events.filter((e) => isSameDay(new Date(e.proposed_datetime), d));
  }

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
    setSelected(null);
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
    setSelected(null);
  }

  function prevDay() {
    setTagDate((d) => {
      const next = new Date(d);
      next.setDate(next.getDate() - 1);
      return next;
    });
  }
  function nextDay() {
    setTagDate((d) => {
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      return next;
    });
  }

  const selectedEvents = selected ? eventsForDay(selected) : [];
  const tagEvents = eventsForDay(tagDate).sort(
    (a, b) => new Date(a.proposed_datetime).getTime() - new Date(b.proposed_datetime).getTime(),
  );

  // Upcoming list (alle Termine ab heute, sortiert)
  const upcoming = events
    .filter((e) => new Date(e.proposed_datetime) >= new Date(today.toDateString()))
    .sort((a, b) => new Date(a.proposed_datetime).getTime() - new Date(b.proposed_datetime).getTime());

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow mb-2">Workspace</p>
        <h2 className="text-2xl font-bold text-slate-900">Kalender</h2>
        <p className="mt-1 text-sm text-slate-500">Alle Terminslots aus Ihren Mediationsfällen.</p>
      </div>

      {/* Ansicht-Umschalter */}
      <div className="flex items-center gap-0.5 bg-slate-100 rounded-lg p-0.5 w-fit">
        {(["monat", "tag", "liste"] as const).map((v) => (
          <button
            key={v}
            onClick={() => {
              if (v === "tag" && selected) setTagDate(selected);
              setView(v);
            }}
            className={[
              "px-3 py-1 text-sm rounded-md transition font-medium capitalize",
              view === v ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700",
            ].join(" ")}
          >
            {v === "monat" ? "Monatsansicht" : v === "tag" ? "Tagesansicht" : "Listenansicht"}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm italic text-slate-400">Wird geladen…</p>
      ) : view === "liste" ? (
        /* ── Liste ────────────────────────────────────────────── */
        <WCard className="p-5">
          <SectionHeader label="Termine" title="Alle anstehenden Termine" />
          {upcoming.length === 0 ? (
            <EmptyState icon="📅" text="Keine anstehenden Termine." />
          ) : (
            <div className="space-y-2">
              {upcoming.map((e) => {
                const dt = new Date(e.proposed_datetime);
                const color = TYPE_COLOR[e.mediation_type] ?? "bg-slate-50 text-slate-600 border-slate-200";
                const pending = statusLabel(e.status);
                return (
                  <div
                    key={e.id}
                    className={[
                      "flex items-start gap-3 rounded-2xl border bg-white p-4",
                      pending ? "border-dashed border-amber-300" : "border-slate-200",
                    ].join(" ")}
                  >
                    {/* Datum-Block */}
                    <div className="flex flex-col items-center justify-center w-12 shrink-0 rounded-xl bg-teal-50 py-2">
                      <span className="text-xs font-bold text-teal-600 uppercase">
                        {dt.toLocaleDateString("de-DE", { month: "short" })}
                      </span>
                      <span className="text-xl font-bold text-teal-700 leading-none">{dt.getDate()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-slate-800 truncate">{e.mediation_title}</div>
                      <div className="mt-0.5 text-xs text-slate-500">
                        {dt.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })} Uhr
                        &nbsp;·&nbsp;
                        {dt.toLocaleDateString("de-DE", { weekday: "long" })}
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${color}`}>
                          {TYPE_LABEL[e.mediation_type] ?? e.mediation_type}
                        </span>
                        {pending && (
                          <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border border-amber-200 bg-amber-50 text-amber-700">
                            {pending}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </WCard>
      ) : view === "tag" ? (
        /* ── Tag ──────────────────────────────────────────────── */
        <WCard className="p-5">
          {/* Tag-Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevDay}
              className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition"
            >
              ‹
            </button>
            <div className="flex flex-col items-center">
              <span className="text-base font-semibold text-slate-800">
                {tagDate.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" })}
              </span>
              {!isSameDay(tagDate, today) && (
                <button
                  onClick={() => setTagDate(new Date())}
                  className="text-[11px] font-medium text-teal-600 hover:underline"
                >
                  Heute
                </button>
              )}
            </div>
            <button
              onClick={nextDay}
              className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition"
            >
              ›
            </button>
          </div>

          {/* Stunden-Raster */}
          {tagEvents.length === 0 ? (
            <EmptyState icon="📅" text="Keine Termine an diesem Tag." />
          ) : (
            <div className="divide-y divide-slate-100 rounded-xl border border-slate-100 overflow-hidden">
              {DAY_HOURS.map((hour) => {
                const hourEvents = tagEvents.filter((e) => new Date(e.proposed_datetime).getHours() === hour);
                return (
                  <div key={hour} className="flex min-h-[44px]">
                    <div className="w-14 shrink-0 py-2 px-2 text-right text-[11px] font-medium text-slate-400">
                      {String(hour).padStart(2, "0")}:00
                    </div>
                    <div className="flex-1 border-l border-slate-100 py-1.5 px-2 space-y-1">
                      {hourEvents.map((e) => {
                        const dt = new Date(e.proposed_datetime);
                        const color = TYPE_COLOR[e.mediation_type] ?? "bg-slate-50 text-slate-600 border-slate-200";
                        const pending = statusLabel(e.status);
                        return (
                          <div
                            key={e.id}
                            className={[
                              "rounded-lg border px-3 py-1.5 text-xs",
                              color,
                              pending ? "border-dashed border-amber-300" : "",
                            ].join(" ")}
                          >
                            <span className="font-bold">
                              {dt.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                            {" · "}
                            <span className="font-medium">{e.mediation_title}</span>
                            {pending && (
                              <span className="ml-1.5 text-[10px] font-semibold text-amber-700">· {pending}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </WCard>
      ) : (
        /* ── Monat ────────────────────────────────────────────── */
        <div className="space-y-4">
          <WCard className="p-5">
            {/* Monat-Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={prevMonth}
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition"
              >
                ‹
              </button>
              <span className="text-base font-semibold text-slate-800">
                {MONTHS[month]} {year}
              </span>
              <button
                onClick={nextMonth}
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition"
              >
                ›
              </button>
            </div>

            {/* Wochentage */}
            <div className="grid grid-cols-7 mb-1">
              {WEEKDAYS.map((w) => (
                <div key={w} className="text-center text-[10px] font-bold uppercase text-slate-400 py-1">
                  {w}
                </div>
              ))}
            </div>

            {/* Tage */}
            <div className="grid grid-cols-7 gap-px bg-slate-100 rounded-xl overflow-hidden">
              {Array.from({ length: rows * 7 }).map((_, i) => {
                const dayNum = i - offset + 1;
                const isValid = dayNum >= 1 && dayNum <= days;
                const date = isValid ? new Date(year, month, dayNum) : null;
                const isToday = date ? isSameDay(date, today) : false;
                const isSelected = date && selected ? isSameDay(date, selected) : false;
                const dayEvents = date ? eventsForDay(date) : [];

                return (
                  <button
                    key={i}
                    disabled={!isValid}
                    onClick={() => date && setSelected(isSelected ? null : date)}
                    className={[
                      "relative flex flex-col items-center pt-1.5 pb-2 bg-white transition min-h-[52px]",
                      !isValid ? "opacity-0 pointer-events-none" : "hover:bg-slate-50",
                      isSelected ? "ring-2 ring-inset ring-teal-500" : "",
                    ].join(" ")}
                  >
                    <span className={[
                      "flex h-6 w-6 items-center justify-center rounded-full text-sm",
                      isToday ? "bg-teal-500 text-white font-bold" : "text-slate-700",
                    ].join(" ")}>
                      {isValid ? dayNum : ""}
                    </span>
                    {dayEvents.length > 0 && (
                      <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
                        {dayEvents.slice(0, 3).map((e, idx) => (
                          <span
                            key={idx}
                            className={[
                              "w-1.5 h-1.5 rounded-full",
                              statusLabel(e.status) ? "bg-amber-400" : "bg-teal-500",
                            ].join(" ")}
                          />
                        ))}
                        {dayEvents.length > 3 && (
                          <span className="text-[8px] text-teal-600 font-bold">+{dayEvents.length - 3}</span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </WCard>

          {/* Tages-Detail */}
          {selected && (
            <WCard className="p-5">
              <div className="flex items-start justify-between gap-3">
                <SectionHeader
                  label={selected.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                  title="Termine an diesem Tag"
                />
                <button
                  type="button"
                  onClick={() => {
                    setTagDate(selected);
                    setView("tag");
                  }}
                  className="shrink-0 text-xs font-semibold text-teal-600 hover:text-teal-700 hover:underline whitespace-nowrap mt-1"
                >
                  → Tagesansicht öffnen
                </button>
              </div>
              {selectedEvents.length === 0 ? (
                <EmptyState icon="📅" text="Keine Termine an diesem Tag." />
              ) : (
                <div className="space-y-2">
                  {selectedEvents.map((e) => {
                    const dt = new Date(e.proposed_datetime);
                    const color = TYPE_COLOR[e.mediation_type] ?? "bg-slate-50 text-slate-600 border-slate-200";
                    const pending = statusLabel(e.status);
                    return (
                      <div
                        key={e.id}
                        className={[
                          "flex items-start gap-3 rounded-2xl border bg-white p-4",
                          pending ? "border-dashed border-amber-300" : "border-slate-200",
                        ].join(" ")}
                      >
                        <div className="flex flex-col items-center justify-center w-12 shrink-0 rounded-xl bg-teal-50 py-2">
                          <span className="text-sm font-bold text-teal-700">
                            {dt.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          <span className="text-[10px] text-teal-500">Uhr</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm text-slate-800 truncate">{e.mediation_title}</div>
                          <div className="mt-1 flex flex-wrap gap-1.5">
                            <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${color}`}>
                              {TYPE_LABEL[e.mediation_type] ?? e.mediation_type}
                            </span>
                            {pending && (
                              <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border border-amber-200 bg-amber-50 text-amber-700">
                                {pending}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </WCard>
          )}
        </div>
      )}
    </div>
  );
}
