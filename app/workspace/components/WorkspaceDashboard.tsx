"use client";

// Workspace-Dashboard im Ramp-Stil: Aktions-Inbox (Signale mit direkten
// Aktionen), Echtzeit-Neuigkeiten-Feed (Polling + Tagesgruppen + Live-
// Indikator) und dichte Verfahrens-Tabelle — im medipact-Designsystem.

import { useEffect, useRef, useState } from "react";
import type { AppointmentEvent, MediationCase, DashboardUebersicht, DashboardFall, DashboardSignal } from "../types";
import { PHASES, getPhaseIndex, TYPE_LABEL, TYPE_COLOR, MEDIATION_TYPES } from "../types";
import { StatusBadge, WCard, RowCard, LoadingRows, SectionHeader, ProgressBar, EmptyState, cn } from "../ui";
import { fetchMediations, fetchAllMediations, fetchAllAppointments, fetchDashboardUebersicht } from "../api";
import { PremiumHero } from "@/app/components/ui/premium";
import Icon from "@/app/components/ui/Icon";

/** Fortschritt eines Falls: explizit gesetzter Wert oder aus der Phase abgeleitet. */
function fallProgress(fall: MediationCase): number {
  const phaseIdx = getPhaseIndex(fall.phase);
  return fall.progress ?? (phaseIdx >= 0 ? Math.round(((phaseIdx + 1) / 6) * 100) : 0);
}

/** DashboardFall → MediationCase (für die Navigation in den Fall). */
function toCase(f: DashboardFall): MediationCase {
  return {
    id: f.id,
    mediation_id: f.id,
    title: f.title,
    mediation_type: f.mediation_type,
    status: f.status,
    phase: f.phase,
  };
}

/** Relative Zeitangabe für den Neuigkeiten-Feed. */
function relTime(iso: string): string {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "";
  const diffMin = Math.round((Date.now() - t) / 60000);
  if (diffMin < 1) return "gerade eben";
  if (diffMin < 60) return `vor ${diffMin} Min.`;
  const diffH = Math.round(diffMin / 60);
  if (diffH < 24) return `vor ${diffH} Std.`;
  const diffD = Math.round(diffH / 24);
  if (diffD === 1) return "gestern";
  if (diffD < 14) return `vor ${diffD} Tagen`;
  return new Date(iso).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
}

/** Tagesgruppe für den Feed (Ramp-Stil: Heute / Gestern / Älter). */
function dayGroup(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Älter";
  const today = new Date();
  const startOfDay = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diffDays = Math.round((startOfDay(today) - startOfDay(d)) / 86400000);
  if (diffDays <= 0) return "Heute";
  if (diffDays === 1) return "Gestern";
  if (diffDays < 7) return "Diese Woche";
  return "Älter";
}

const SEVERITY_STYLE: Record<string, { dot: string; text: string }> = {
  hoch: { dot: "bg-red-500", text: "text-red-700" },
  mittel: { dot: "bg-amber-400", text: "text-amber-800" },
  niedrig: { dot: "bg-neutral-300", text: "text-neutral-500" },
};

const NEWS_ICON: Record<string, string> = {
  eingabe: "📝",
  ki: "✦",
  feedback: "💬",
  termin: "📅",
  vertrag: "📄",
  zahlung: "💶",
  einladung: "✉️",
};

// ── Aktions-Inbox: Erledigt/Snooze lokal persistieren ───────────────────────
// Kein Backend nötig: Ausblendungen liegen in localStorage. -1 = dauerhaft
// erledigt, sonst Epoch-ms, bis zu dem das Signal ausgeblendet bleibt.

const DISMISS_KEY = "mp_signal_dismissals";
type DismissMap = Record<string, number>;

function signalKey(mediationId: number, s: DashboardSignal): string {
  return `${mediationId}|${s.code}|${s.text}`;
}

function loadDismissals(): DismissMap {
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    const map: DismissMap = raw ? JSON.parse(raw) : {};
    const now = Date.now();
    let changed = false;
    for (const k of Object.keys(map)) {
      if (map[k] !== -1 && map[k] < now) {
        delete map[k];
        changed = true;
      }
    }
    if (changed) localStorage.setItem(DISMISS_KEY, JSON.stringify(map));
    return map;
  } catch {
    return {};
  }
}

const POLL_MS = 15000;

interface WorkspaceDashboardProps {
  isAdmin?: boolean;
  onSelectFall: (m: MediationCase) => void;
  /** Wird aufgerufen, wenn ein Termin angeklickt wird – navigiert zur Tagesansicht im Kalender. */
  onSelectTermin?: (date: Date) => void;
  /** Wird aufgerufen, wenn auf eine Status-KPI geklickt wird – navigiert zur
   * gefilterten Fallliste. `statuses: null` = kein Filter (z.B. "Gesamt"). */
  onFilterStatus?: (statuses: string[] | null, label: string) => void;
}

export function WorkspaceDashboard({ isAdmin = false, onSelectFall, onSelectTermin, onFilterStatus }: WorkspaceDashboardProps) {
  const [faelle, setFaelle] = useState<MediationCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [termine, setTermine] = useState<AppointmentEvent[]>([]);
  const [termineLoading, setTermineLoading] = useState(true);
  const [dash, setDash] = useState<DashboardUebersicht | null>(null);
  const [dashLoading, setDashLoading] = useState(true);
  const [dismissals, setDismissals] = useState<DismissMap>({});
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  // Zeitpunkt des ersten Ladens: alles, was danach eintrifft, gilt als "Neu".
  const seenAtRef = useRef<number | null>(null);

  useEffect(() => {
    setDismissals(loadDismissals());
  }, []);

  useEffect(() => {
    (isAdmin ? fetchAllMediations() : fetchMediations())
      .then(setFaelle)
      .finally(() => setLoading(false));
  }, [isAdmin]);

  useEffect(() => {
    fetchAllAppointments()
      .then(setTermine)
      .finally(() => setTermineLoading(false));
  }, [isAdmin]);

  // Echtzeit: Übersicht (Signale + Feed) wird regelmäßig neu geladen,
  // solange der Tab sichtbar ist. Fälle werden seltener mit-aktualisiert.
  useEffect(() => {
    let cancelled = false;
    const load = () =>
      fetchDashboardUebersicht()
        .then((d) => {
          if (cancelled || !d) return;
          setDash(d);
          setLastUpdated(Date.now());
          if (seenAtRef.current === null) seenAtRef.current = Date.now();
        })
        .finally(() => {
          if (!cancelled) setDashLoading(false);
        });
    load();
    let tick = 0;
    const id = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState !== "visible") return;
      load();
      tick += 1;
      if (tick % 4 === 0) {
        (isAdmin ? fetchAllMediations() : fetchMediations()).then((f) => {
          if (!cancelled) setFaelle(f);
        });
      }
    }, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [isAdmin]);

  const dismissSignal = (key: string, until: number) => {
    const map = { ...dismissals, [key]: until };
    setDismissals(map);
    try {
      localStorage.setItem(DISMISS_KEY, JSON.stringify(map));
    } catch {
      /* localStorage nicht verfügbar */
    }
  };

  const resetDismissals = () => {
    setDismissals({});
    try {
      localStorage.removeItem(DISMISS_KEY);
    } catch {
      /* localStorage nicht verfügbar */
    }
  };

  const isDismissed = (key: string) => {
    const v = dismissals[key];
    return v === -1 || (typeof v === "number" && v > Date.now());
  };

  const naechsteTermine = termine
    .filter((t) => new Date(t.proposed_datetime).getTime() >= Date.now() - 1000 * 60 * 60)
    .sort((a, b) => new Date(a.proposed_datetime).getTime() - new Date(b.proposed_datetime).getTime())
    .slice(0, 5);

  const aktiveFaelle = faelle.filter((m) => m.status === "active");
  const active = aktiveFaelle.length;
  const pending = faelle.filter((m) => m.status === "pending" || m.status === "draft").length;
  const completed = faelle.filter((m) => m.status === "completed").length;

  // ── Aktions-Inbox: hoch/mittel-Signale, ohne erledigte/ausgeblendete ──────
  const dashFaelle = dash?.faelle ?? [];
  let dismissedCount = 0;
  const inbox = dashFaelle
    .map((f) => {
      const wichtig = f.signals
        .filter((s) => s.severity === "hoch" || s.severity === "mittel")
        .sort((a, b) => (a.severity === "hoch" ? 0 : 1) - (b.severity === "hoch" ? 0 : 1));
      const sichtbar = wichtig.filter((s) => {
        const hidden = isDismissed(signalKey(f.id, s));
        if (hidden) dismissedCount += 1;
        return !hidden;
      });
      return { fall: f, signals: sichtbar };
    })
    .filter((e) => e.signals.length > 0)
    .sort((a, b) => b.fall.attention_score - a.fall.attention_score);
  const attentionCount = inbox.length;

  // ── Verfahrens-Tabelle: laufende + ausstehende Fälle, dringendste zuerst ──
  const dashById = new Map(dashFaelle.map((f) => [f.id, f]));
  const laufende = dashFaelle
    .filter((f) => f.status === "active" || f.status === "pending" || f.status === "draft")
    .sort((a, b) => b.attention_score - a.attention_score || getPhaseIndex(b.phase) - getPhaseIndex(a.phase));

  // ── Feed: nach Tagen gruppieren, "Neu" für Einträge seit dem ersten Laden ──
  const neuigkeiten = dash?.neuigkeiten ?? [];
  const feedGroups: { label: string; items: typeof neuigkeiten }[] = [];
  for (const n of neuigkeiten.slice(0, 20)) {
    const label = dayGroup(n.when);
    const last = feedGroups[feedGroups.length - 1];
    if (last && last.label === label) last.items.push(n);
    else feedGroups.push({ label, items: [n] });
  }
  const isNew = (iso: string) => {
    const seen = seenAtRef.current;
    if (seen === null) return false;
    const t = new Date(iso).getTime();
    return !Number.isNaN(t) && t > seen;
  };

  return (
    <div className="space-y-6">
      {/* Begrüßung + KPI-Zeile */}
      <PremiumHero
        variant="card"
        eyebrow="Workspace"
        title="Übersicht"
        subtitle={isAdmin ? "Alle Mediationsfälle auf einen Blick." : "Ihre Mediationsfälle auf einen Blick."}
        stats={[
          {
            label: "Aktive Fälle",
            value: active,
            sub: "laufende Mediationen",
            onClick: () => onFilterStatus?.(["active"], "Aktive Fälle"),
            // Mini-Sparkline: Fortschritt je aktivem Fall (Stripe-Stil)
            trend: aktiveFaelle.map(fallProgress),
          },
          {
            label: "Eingriff empfohlen",
            value: attentionCount,
            sub: attentionCount === 1 ? "Fall mit Signalen" : "Fälle mit Signalen",
          },
          {
            label: "Ausstehend",
            value: pending,
            sub: "noch nicht gestartet",
            onClick: () => onFilterStatus?.(["pending", "draft"], "Ausstehend"),
          },
          {
            label: "Abgeschlossen",
            value: completed,
            sub: "beendete Verfahren",
            onClick: () => onFilterStatus?.(["completed"], "Abgeschlossen"),
          },
        ]}
      />

      <div className="grid items-start gap-6 xl:grid-cols-[1.4fr_1fr]">
        {/* ── Linke Spalte: Aktions-Inbox + Verfahrens-Tabelle ── */}
        <div className="space-y-6 min-w-0">
          {/* Aktions-Inbox */}
          <WCard className="p-5">
            <SectionHeader
              label="Handlungsbedarf"
              title="Deine Inbox — hier solltest du eingreifen"
              action={
                dismissedCount > 0 ? (
                  <button
                    onClick={resetDismissals}
                    className="text-[11px] font-medium text-neutral-400 underline-offset-2 transition-colors hover:text-accent-600 hover:underline"
                  >
                    {dismissedCount} ausgeblendet · zurücksetzen
                  </button>
                ) : undefined
              }
            />
            {dashLoading ? (
              <LoadingRows rows={2} framed />
            ) : inbox.length === 0 ? (
              <EmptyState icon="✓" text="Inbox leer – alle Verfahren laufen ruhig." />
            ) : (
              <div className="space-y-3">
                {inbox.map(({ fall: f, signals }) => {
                  const phaseIdx = getPhaseIndex(f.phase);
                  const hochCount = signals.filter((s) => s.severity === "hoch").length;
                  return (
                    <div
                      key={f.id}
                      className="rounded-2xl border border-neutral-200 bg-white transition-all duration-300 hover:border-accent-200 hover:shadow-md hover:shadow-accent-900/5"
                    >
                      {/* Kopf: Fall + Status + primäre Aktion */}
                      <button
                        onClick={() => onSelectFall(toCase(f))}
                        className="group flex w-full items-start justify-between gap-3 rounded-t-2xl px-4 pt-3.5 pb-2 text-left"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "h-2 w-2 shrink-0 rounded-full",
                                hochCount > 0 ? "bg-red-500" : "bg-amber-400"
                              )}
                            />
                            <span className="truncate text-sm font-semibold text-neutral-900 group-hover:text-accent-700">
                              {f.title}
                            </span>
                          </div>
                          <div className="mt-0.5 text-xs text-neutral-400">
                            {TYPE_LABEL[f.mediation_type] ?? f.mediation_type}
                            {phaseIdx >= 0 ? ` · Phase ${PHASES[phaseIdx].short}: ${PHASES[phaseIdx].label}` : ""}
                          </div>
                        </div>
                        <span className="flex shrink-0 items-center gap-3">
                          <StatusBadge status={f.status} />
                          <span className="text-neutral-300 transition-transform duration-200 group-hover:translate-x-0.5">›</span>
                        </span>
                      </button>
                      {/* Signal-Zeilen mit Hover-Aktionen (Ramp-Stil) */}
                      <ul className="px-2 pb-2">
                        {signals.map((s, i) => {
                          const st = SEVERITY_STYLE[s.severity] ?? SEVERITY_STYLE.niedrig;
                          const key = signalKey(f.id, s);
                          return (
                            <li
                              key={i}
                              className="group/sig flex items-start gap-2 rounded-xl px-2 py-1.5 transition-colors hover:bg-neutral-50"
                            >
                              <span className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", st.dot)} />
                              <span className={cn("min-w-0 flex-1 text-xs leading-relaxed", st.text)}>{s.text}</span>
                              <span className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity duration-150 group-hover/sig:opacity-100">
                                <button
                                  onClick={() => dismissSignal(key, Date.now() + 24 * 60 * 60 * 1000)}
                                  title="Für 24 Stunden ausblenden"
                                  className="rounded-lg border border-neutral-200 bg-white px-2 py-0.5 text-[10px] font-medium text-neutral-500 transition-colors hover:border-neutral-300 hover:text-neutral-700"
                                >
                                  24 h
                                </button>
                                <button
                                  onClick={() => dismissSignal(key, -1)}
                                  title="Als erledigt markieren"
                                  className="rounded-lg border border-accent-200 bg-accent-50 px-2 py-0.5 text-[10px] font-medium text-accent-700 transition-colors hover:bg-accent-100"
                                >
                                  ✓ Erledigt
                                </button>
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}
          </WCard>

          {/* Verfahren im Überblick – dichte Tabelle */}
          <WCard className="p-5">
            <SectionHeader label="Verfahren" title="Alle laufenden Verfahren im Überblick" />
            {dashLoading || loading ? (
              <LoadingRows rows={3} framed />
            ) : laufende.length === 0 ? (
              <EmptyState icon="⚖" text="Keine laufenden Fälle." />
            ) : (
              <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
                {/* Spaltenköpfe */}
                <div className="hidden grid-cols-[minmax(0,1.4fr)_110px_100px_150px_20px] gap-5 border-b border-neutral-200 bg-neutral-50/60 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400 sm:grid">
                  <span>Fall</span>
                  <span className="text-right">Aktivität</span>
                  <span>Status</span>
                  <span className="text-right">Fortschritt</span>
                  <span />
                </div>
                {laufende.map((f, i) => {
                  const phaseIdx = getPhaseIndex(f.phase);
                  const progress = phaseIdx >= 0 ? Math.round(((phaseIdx + 1) / 6) * 100) : 0;
                  const currentPhase = phaseIdx >= 0 ? PHASES[phaseIdx].label : "Noch nicht gestartet";
                  const hoch = f.signals.filter((s) => s.severity === "hoch").length;
                  const mittel = f.signals.filter((s) => s.severity === "mittel").length;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => onSelectFall(toCase(f))}
                      className={cn(
                        "group block w-full px-4 py-2.5 text-left transition-colors duration-150 hover:bg-neutral-50",
                        i > 0 && "border-t border-neutral-100"
                      )}
                    >
                      <div className="grid grid-cols-[minmax(0,1fr)_20px] items-center gap-4 sm:grid-cols-[minmax(0,1.4fr)_110px_100px_150px_20px] sm:gap-5">
                        <span className="min-w-0">
                          <span className="flex items-center gap-2 min-w-0">
                            <span className="block truncate text-[13px] font-medium text-neutral-900">{f.title}</span>
                            {hoch > 0 && (
                              <span className="shrink-0 rounded-full border border-red-200 bg-red-50 px-1.5 py-px text-[10px] font-bold text-red-700 tabular-nums">
                                {hoch} !
                              </span>
                            )}
                            {mittel > 0 && (
                              <span className="shrink-0 rounded-full border border-amber-200 bg-amber-50 px-1.5 py-px text-[10px] font-bold text-amber-800 tabular-nums">
                                {mittel}
                              </span>
                            )}
                          </span>
                          <span className="mt-0.5 block truncate text-[11px] font-light text-neutral-500">
                            {TYPE_LABEL[f.mediation_type] ?? f.mediation_type} · {currentPhase}
                            {f.parteien > 0 ? ` · ${f.parteien} Parteien` : ""}
                          </span>
                        </span>

                        <span className="hidden text-right text-[11px] text-neutral-400 sm:block">
                          {f.letzte_aktivitaet
                            ? (f.inaktiv_tage === 0 ? "heute aktiv" : relTime(f.letzte_aktivitaet))
                            : "keine Aktivität"}
                        </span>

                        <span className="hidden sm:block">
                          <StatusBadge status={f.status} />
                        </span>

                        <span className="hidden items-center justify-end gap-3 sm:flex">
                          <span className="w-16">
                            <ProgressBar value={progress} />
                          </span>
                          <span className="w-10 text-right text-[13px] font-medium tabular-nums text-neutral-900">
                            {progress}%
                          </span>
                        </span>

                        <span className="text-neutral-300 transition-transform duration-200 group-hover:translate-x-0.5">
                          ›
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </WCard>
        </div>

        {/* ── Rechte Spalte: Live-Feed + Termine + Statistik ── */}
        <div className="space-y-6 min-w-0">
          {/* Neuigkeiten – Echtzeit-Feed */}
          <WCard className="p-5">
            <SectionHeader
              label="Aktivität"
              title="Neuigkeiten aus allen Fällen"
              action={
                <span
                  className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-400"
                  title={lastUpdated ? `Zuletzt aktualisiert: ${new Date(lastUpdated).toLocaleTimeString("de-DE")}` : undefined}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  Live
                </span>
              }
            />
            {dashLoading ? (
              <LoadingRows rows={3} framed />
            ) : neuigkeiten.length === 0 ? (
              <EmptyState icon="🕊" text="Noch keine Aktivität in deinen Fällen." />
            ) : (
              <div className="space-y-3">
                {feedGroups.map((g) => (
                  <div key={g.label}>
                    <div className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                      {g.label}
                    </div>
                    <div className="space-y-0.5">
                      {g.items.map((n, i) => {
                        const fall = dashById.get(n.mediation_id);
                        const neu = isNew(n.when);
                        return (
                          <button
                            key={`${n.when}-${i}`}
                            onClick={() => fall && onSelectFall(toCase(fall))}
                            className={cn(
                              "group flex w-full items-start gap-3 rounded-xl px-2 py-2 text-left transition hover:bg-neutral-50",
                              neu && "bg-accent-50/60 hover:bg-accent-50"
                            )}
                          >
                            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-sm">
                              <Icon name={NEWS_ICON[n.kind] ?? "•"} size={14} />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block text-xs leading-snug text-neutral-800">
                                {neu && (
                                  <span className="mr-1.5 inline-block rounded-full bg-accent-500 px-1.5 py-px align-middle text-[9px] font-bold uppercase tracking-wide text-white">
                                    Neu
                                  </span>
                                )}
                                {n.actor && <span className="font-semibold">{n.actor} </span>}
                                {n.text}
                              </span>
                              {n.detail && (
                                <span className="mt-0.5 block truncate text-[11px] italic text-neutral-400">
                                  „{n.detail}“
                                </span>
                              )}
                              <span className="mt-0.5 block text-[10px] text-neutral-400">
                                {n.mediation_title} · {relTime(n.when)}
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </WCard>

          {/* Nächste Termine */}
          <WCard className="p-5">
            <SectionHeader label="Kalender" title="Nächste Termine" />
            {termineLoading ? (
              <LoadingRows rows={2} framed />
            ) : naechsteTermine.length === 0 ? (
              <EmptyState icon="📅" text="Keine anstehenden Termine." />
            ) : (
              <div className="space-y-2">
                {naechsteTermine.map((termin) => {
                  const dt = new Date(termin.proposed_datetime);
                  const color = TYPE_COLOR[termin.mediation_type] ?? "bg-neutral-50 text-neutral-600 border-neutral-200";
                  return (
                    <RowCard key={termin.id} onClick={() => onSelectTermin?.(dt)} className="flex items-center gap-3">
                      <div className="flex flex-col items-center justify-center w-14 shrink-0 rounded-xl bg-accent-50 py-2">
                        <span className="text-[11px] font-semibold text-accent-600 tabular-nums">
                          {dt.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })}
                        </span>
                        <span className="text-xs font-bold text-accent-700 tabular-nums">
                          {dt.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-neutral-800 truncate">{termin.mediation_title}</div>
                        <span className={`mt-1 inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${color}`}>
                          {TYPE_LABEL[termin.mediation_type] ?? termin.mediation_type}
                        </span>
                      </div>
                    </RowCard>
                  );
                })}
              </div>
            )}
          </WCard>

          {/* Typ-Verteilung */}
          {faelle.length > 0 && (
            <WCard className="p-5">
              <SectionHeader label="Statistik" title="Fälle nach Konfliktart" />
              <div className="space-y-3">
                {MEDIATION_TYPES.map(({ id: type, label }) => {
                  const count = faelle.filter((m) => m.mediation_type === type).length;
                  const pct = faelle.length > 0 ? Math.round((count / faelle.length) * 100) : 0;
                  return (
                    <div key={type}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="flex items-center gap-1.5 text-xs font-medium text-neutral-600">
                          <span className={cn("h-2 w-2 shrink-0 rounded-full border", TYPE_COLOR[type])} />
                          {TYPE_LABEL[type] ?? label}
                        </span>
                        <span className="text-xs text-neutral-400 tabular-nums">{count} Fälle</span>
                      </div>
                      <ProgressBar value={pct} />
                    </div>
                  );
                })}
              </div>
            </WCard>
          )}
        </div>
      </div>
    </div>
  );
}
