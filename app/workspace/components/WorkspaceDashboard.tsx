"use client";

import { useEffect, useState } from "react";
import type { AppointmentEvent, MediationCase, DashboardUebersicht, DashboardFall } from "../types";
import { PHASES, getPhaseIndex, TYPE_LABEL, TYPE_COLOR, MEDIATION_TYPES } from "../types";
import { StatusBadge, WCard, RowCard, ListRow, LoadingRows, SectionHeader, ProgressBar, EmptyState, cn } from "../ui";
import { fetchMediations, fetchAllMediations, fetchAllAppointments, fetchDashboardUebersicht } from "../api";
import { PremiumHero } from "@/app/components/ui/premium";

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

const SEVERITY_STYLE: Record<string, { dot: string; text: string; chip: string }> = {
  hoch: { dot: "bg-red-500", text: "text-red-700", chip: "border-red-200 bg-red-50 text-red-700" },
  mittel: { dot: "bg-amber-400", text: "text-amber-800", chip: "border-amber-200 bg-amber-50 text-amber-800" },
  niedrig: { dot: "bg-neutral-300", text: "text-neutral-500", chip: "border-neutral-200 bg-neutral-50 text-neutral-500" },
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

  useEffect(() => {
    fetchDashboardUebersicht()
      .then(setDash)
      .finally(() => setDashLoading(false));
  }, [isAdmin]);

  const naechsteTermine = termine
    .filter((t) => new Date(t.proposed_datetime).getTime() >= Date.now() - 1000 * 60 * 60)
    .sort((a, b) => new Date(a.proposed_datetime).getTime() - new Date(b.proposed_datetime).getTime())
    .slice(0, 5);

  const aktiveFaelle = faelle.filter((m) => m.status === "active");
  const active = aktiveFaelle.length;
  const pending = faelle.filter((m) => m.status === "pending" || m.status === "draft").length;
  const completed = faelle.filter((m) => m.status === "completed").length;

  // ── Eingriffs-Signale: Fälle mit hoch/mittel-Signalen, nach Dringlichkeit ──
  const dashFaelle = dash?.faelle ?? [];
  const attentionFaelle = dashFaelle
    .filter((f) => f.signals.some((s) => s.severity === "hoch" || s.severity === "mittel"))
    .sort((a, b) => b.attention_score - a.attention_score);
  const attentionCount = attentionFaelle.length;

  // ── Verfahrens-Überblick: laufende + ausstehende Fälle, dringendste zuerst ──
  const dashById = new Map(dashFaelle.map((f) => [f.id, f]));
  const laufende = dashFaelle
    .filter((f) => f.status === "active" || f.status === "pending" || f.status === "draft")
    .sort((a, b) => b.attention_score - a.attention_score || getPhaseIndex(b.phase) - getPhaseIndex(a.phase));

  const neuigkeiten = dash?.neuigkeiten ?? [];

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
        {/* ── Linke Spalte: Eingreifen + Verfahrens-Überblick ── */}
        <div className="space-y-6 min-w-0">
          {/* Eingreifen empfohlen */}
          <WCard className="p-5">
            <SectionHeader label="Handlungsbedarf" title="Hier solltest du eingreifen" />
            {dashLoading ? (
              <LoadingRows rows={2} framed />
            ) : attentionFaelle.length === 0 ? (
              <EmptyState icon="✓" text="Aktuell keine dringenden Signale – alle Verfahren laufen ruhig." />
            ) : (
              <div className="space-y-3">
                {attentionFaelle.map((f) => {
                  const phaseIdx = getPhaseIndex(f.phase);
                  const wichtig = f.signals
                    .filter((s) => s.severity === "hoch" || s.severity === "mittel")
                    .sort((a, b) => (a.severity === "hoch" ? 0 : 1) - (b.severity === "hoch" ? 0 : 1));
                  const hochCount = wichtig.filter((s) => s.severity === "hoch").length;
                  return (
                    <RowCard key={f.id} onClick={() => onSelectFall(toCase(f))}>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "h-2 w-2 shrink-0 rounded-full",
                                hochCount > 0 ? "bg-red-500" : "bg-amber-400"
                              )}
                            />
                            <span className="truncate text-sm font-semibold text-neutral-900">{f.title}</span>
                          </div>
                          <div className="mt-0.5 text-xs text-neutral-400">
                            {TYPE_LABEL[f.mediation_type] ?? f.mediation_type}
                            {phaseIdx >= 0 ? ` · Phase ${PHASES[phaseIdx].short}: ${PHASES[phaseIdx].label}` : ""}
                          </div>
                        </div>
                        <StatusBadge status={f.status} />
                      </div>
                      <ul className="space-y-1.5">
                        {wichtig.map((s, i) => {
                          const st = SEVERITY_STYLE[s.severity] ?? SEVERITY_STYLE.niedrig;
                          return (
                            <li key={i} className="flex items-start gap-2 text-xs">
                              <span className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", st.dot)} />
                              <span className={cn("leading-relaxed", st.text)}>{s.text}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </RowCard>
                  );
                })}
              </div>
            )}
          </WCard>

          {/* Verfahren im Überblick */}
          <WCard className="p-5">
            <SectionHeader label="Verfahren" title="Alle laufenden Verfahren im Überblick" />
            {dashLoading || loading ? (
              <LoadingRows rows={3} framed />
            ) : laufende.length === 0 ? (
              <EmptyState icon="⚖" text="Keine laufenden Fälle." />
            ) : (
              <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
                {laufende.map((f, i) => {
                  const phaseIdx = getPhaseIndex(f.phase);
                  const progress = phaseIdx >= 0 ? Math.round(((phaseIdx + 1) / 6) * 100) : 0;
                  const currentPhase = phaseIdx >= 0 ? PHASES[phaseIdx].label : "Noch nicht gestartet";
                  const hoch = f.signals.filter((s) => s.severity === "hoch").length;
                  const mittel = f.signals.filter((s) => s.severity === "mittel").length;
                  return (
                    <ListRow key={f.id} first={i === 0} onClick={() => onSelectFall(toCase(f))}>
                      <div className="grid grid-cols-[minmax(0,1fr)_20px] items-center gap-4 sm:grid-cols-[minmax(0,1fr)_120px_110px_150px_20px] sm:gap-5">
                        <span className="min-w-0">
                          <span className="flex items-center gap-2 min-w-0">
                            <span className="block truncate text-sm font-medium text-neutral-900">{f.title}</span>
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
                          <span className="mt-0.5 block truncate text-xs font-light text-neutral-500">
                            {TYPE_LABEL[f.mediation_type] ?? f.mediation_type} · {currentPhase}
                            {f.parteien > 0 ? ` · ${f.parteien} Parteien` : ""}
                          </span>
                        </span>

                        <span className="hidden text-right text-[11px] text-neutral-400 sm:block">
                          {f.letzte_aktivitaet
                            ? (f.inaktiv_tage === 0 ? "heute aktiv" : `Aktivität ${relTime(f.letzte_aktivitaet)}`)
                            : "keine Aktivität"}
                        </span>

                        <span className="hidden sm:block">
                          <StatusBadge status={f.status} />
                        </span>

                        <span className="hidden items-center justify-end gap-3 sm:flex">
                          <span className="w-16">
                            <ProgressBar value={progress} />
                          </span>
                          <span className="w-10 text-right text-sm font-medium tabular-nums text-neutral-900">
                            {progress}%
                          </span>
                        </span>

                        <span className="text-neutral-300 transition-transform duration-200 group-hover:translate-x-0.5">
                          ›
                        </span>
                      </div>
                    </ListRow>
                  );
                })}
              </div>
            )}
          </WCard>
        </div>

        {/* ── Rechte Spalte: Neuigkeiten + Termine + Statistik ── */}
        <div className="space-y-6 min-w-0">
          {/* Neuigkeiten */}
          <WCard className="p-5">
            <SectionHeader label="Aktivität" title="Neuigkeiten aus allen Fällen" />
            {dashLoading ? (
              <LoadingRows rows={3} framed />
            ) : neuigkeiten.length === 0 ? (
              <EmptyState icon="🕊" text="Noch keine Aktivität in deinen Fällen." />
            ) : (
              <div className="space-y-1">
                {neuigkeiten.slice(0, 12).map((n, i) => {
                  const fall = dashById.get(n.mediation_id);
                  return (
                    <button
                      key={`${n.when}-${i}`}
                      onClick={() => fall && onSelectFall(toCase(fall))}
                      className="group flex w-full items-start gap-3 rounded-xl px-2 py-2.5 text-left transition hover:bg-neutral-50"
                    >
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-sm">
                        {NEWS_ICON[n.kind] ?? "•"}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs leading-snug text-neutral-800">
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
