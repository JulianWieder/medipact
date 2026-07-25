"use client";

import { encodeId } from "@/lib/ids";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  PremiumHero,
  PillButton,
  ThinProgressBar,
  OutlinePill,
  StatusDot,
  SegmentedControl,
  Skeleton,
  SlideOver,
  cn,
} from "@/app/components/ui/premium";
import { PHASES } from "@/app/workspace/types";

interface Mediation {
  id: string | number;
  title?: string;
  phase?: string;
  status?: "active" | "pending" | "completed" | "draft";
  progress?: number;
  conflict_type?: string;
  description?: string;
  role?: string;
  is_my_turn?: boolean;
  // "mediation" (Default) oder "logbuch" (kostenloses Konflikt-Logbuch)
  mode?: string;
}

interface PendingInvite {
  invite_id: number;
  mediation_id: number;
  mediation_title: string;
  mediation_type: string;
  role: string;
  expires_at: string;
}

// Stripe-Stil: kleiner farbiger Punkt + Text statt Outline-Badge.
const statusConfig: Record<string, { label: string; tone: "teal" | "amber" | "sky" | "neutral" }> = {
  active: { label: "Laufend", tone: "teal" },
  pending: { label: "Ausstehend", tone: "amber" },
  draft: { label: "Entwurf", tone: "sky" },
  completed: { label: "Abgeschlossen", tone: "neutral" },
};

const fallbackStatus: { label: string; tone: "teal" | "amber" | "sky" | "neutral" } = {
  label: "Unbekannt",
  tone: "neutral",
};

const roleLabel: Record<string, string> = {
  other_party: "Gegenpartei",
  mediator: "Mediator",
  owner: "Antragsteller",
  initiator: "Antragsteller",
};

/** Phasen-Key (z.B. "einladung") → Anzeigename aus dem Workspace ("Onboarding").
 *  Gleiche Quelle wie der Workflow-Designer, damit Dashboard und Workspace
 *  identische Phasennamen zeigen. */
function phaseLabel(phase?: string): string {
  if (!phase) return "Entwurf";
  return PHASES.find((p) => p.id === phase)?.label ?? phase;
}

const typeLabel: Record<string, string> = {
  trennung: "Trennung & Scheidung",
  erbschaft: "Erbschaftsstreit",
  nachbarschaft: "Nachbarschaftskonflikt",
  wg: "WG-Konflikt",
  verbraucher: "Verbraucherstreit",
  odr: "ODR – Geschäft & Organisation",
  schlichtung: "ODR – Online-Schlichtung",
  ecommerce: "ODR – E-Commerce & Plattform",
  b2b: "ODR – B2B-Vertragsstreit",
  geschaeft: "ODR – Geschäft & Organisation",
};

export default function DashboardClient() {
  const [data, setData] = useState<Mediation[]>([]);
  // Kostenlose Konflikt-Logbücher (mode="logbuch") – eigene Sektion, zählen
  // nicht in die Verfahrens-Statistiken hinein.
  const [logbooks, setLogbooks] = useState<Mediation[]>([]);
  const [invites, setInvites] = useState<PendingInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState<number | null>(null);
  const [acceptError, setAcceptError] = useState<string>("");
  const [videoModalMediationId, setVideoModalMediationId] = useState<number | null>(null);
  const [filter, setFilter] = useState<{ key: string; label: string } | null>(null);
  const [selected, setSelected] = useState<Mediation | null>(null);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        const [mediationsRes, invitesRes] = await Promise.all([
          fetch("/api/mediations/me"),
          fetch("/api/invites/me"),
        ]);

        if (!mediationsRes.ok) {
          if (mediationsRes.status === 401) {
            router.push("/auth/login");
            return;
          }
          console.error("Fehler beim Laden", mediationsRes.status);
        } else {
          const raw = await mediationsRes.json();
          const mapped = (raw ?? []).map(
            (item: {
              id?: number;
              mediation_id?: number;
              title?: string;
              phase?: string;
              status?: string;
              progress?: number;
              mediation_type?: string;
              description?: string;
              role?: string;
              is_my_turn?: boolean;
              mode?: string;
            }) => ({
              id: item.mediation_id ?? item.id,
              title: item.title ?? "Neue Mediation",
              phase: item.phase,
              status: item.status ?? "pending",
              progress: item.progress ?? 10,
              conflict_type: item.mediation_type,
              description: item.description,
              role: item.role,
              is_my_turn: item.is_my_turn ?? false,
              mode: item.mode ?? "mediation",
            }),
          );
          setData(mapped.filter((m: Mediation) => m.mode !== "logbuch"));
          setLogbooks(mapped.filter((m: Mediation) => m.mode === "logbuch"));
        }

        if (invitesRes.ok) {
          setInvites(await invitesRes.json());
        }
      } catch (error) {
        console.error("Server nicht erreichbar", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function acceptInvite(invite: PendingInvite) {
    setAcceptingId(invite.invite_id);
    setAcceptError("");
    try {
      const res = await fetch(`/api/invites/${invite.invite_id}/accept`, {
        method: "POST",
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        const raw = body?.detail ?? body?.error ?? "Unbekannter Fehler";
        setAcceptError(typeof raw === "string" ? raw : JSON.stringify(raw));
        return;
      }
      // Remove from invites list and navigate to the mediation
      setInvites((prev) => prev.filter((i) => i.invite_id !== invite.invite_id));

      if (body.has_video) {
        setVideoModalMediationId(body.mediation_id);
        return;
      }

      router.push(`/dashboard/${encodeId(body.mediation_id)}`);
    } catch {
      setAcceptError("Server nicht erreichbar.");
    } finally {
      setAcceptingId(null);
    }
  }

  // Filter-Prädikate für die Stat-Kacheln im Hero – ein Klick filtert die
  // Mediationsliste darunter, ein erneuter Klick auf dieselbe Kachel hebt
  // den Filter wieder auf (Toggle-Verhalten, analog zum Workspace-Dashboard).
  const filterPredicates: Record<string, (m: Mediation) => boolean> = {
    my_turn: (m) => !!m.is_my_turn,
    waiting: (m) => m.status === "active" && !m.is_my_turn,
    pending: (m) => m.status === "pending" || m.status === "draft",
    completed: (m) => m.status === "completed",
  };

  function toggleFilter(key: string, label: string) {
    setFilter((prev) => (prev?.key === key ? null : { key, label }));
  }

  const stats = useMemo(
    () => [
      {
        label: "Deine Eingabe",
        value: data.filter((m) => m.is_my_turn).length,
        sub: "wartet auf dich",
        highlight: data.some((m) => m.is_my_turn),
        active: filter?.key === "my_turn",
        onClick: () => toggleFilter("my_turn", "Deine Eingabe"),
        // Mini-Sparkline: Fortschritt der Fälle, die auf dich warten
        trend: data.filter((m) => m.is_my_turn).map((m) => m.progress ?? 0),
      },
      {
        label: "Warte auf Gegenpartei",
        value: data.filter((m) => m.status === "active" && !m.is_my_turn).length,
        sub: "Ball liegt bei der anderen Seite",
        active: filter?.key === "waiting",
        onClick: () => toggleFilter("waiting", "Warte auf Gegenpartei"),
        trend: data
          .filter((m) => m.status === "active" && !m.is_my_turn)
          .map((m) => m.progress ?? 0),
      },
      {
        label: "Ausstehend",
        value: data.filter((m) => m.status === "pending" || m.status === "draft").length,
        sub: "noch nicht gestartet",
        active: filter?.key === "pending",
        onClick: () => toggleFilter("pending", "Ausstehend"),
      },
      {
        label: "Abgeschlossen",
        value: data.filter((m) => m.status === "completed").length,
        sub: "beendete Verfahren",
        active: filter?.key === "completed",
        onClick: () => toggleFilter("completed", "Abgeschlossen"),
      },
    ],
    [data, filter],
  );

  const visibleData = useMemo(() => {
    if (!filter) return data;
    const predicate = filterPredicates[filter.key];
    return predicate ? data.filter(predicate) : data;
  }, [data, filter]);

  // Stripe-artige "Erste Schritte"-Checkliste: aus vorhandenen Daten
  // abgeleitet, verschwindet sobald alle Schritte erledigt sind.
  const onboarding = useMemo(() => {
    const hasCase = data.length > 0;
    const hasStarted = data.some((m) => m.status === "active" || m.status === "completed");
    const hasSubmitted = data.some(
      (m) => (m.status === "active" && !m.is_my_turn) || m.status === "completed",
    );
    const steps = [
      { label: "Konto erstellt", done: true, action: undefined as { label: string; href: string } | undefined },
      {
        label: "Mediation angelegt oder Einladung angenommen",
        done: hasCase,
        action: !hasCase ? { label: "Neue Mediation starten", href: "/dashboard/mediation/new" } : undefined,
      },
      { label: "Verfahren gestartet", done: hasStarted, action: undefined },
      { label: "Erste Eingabe gemacht", done: hasSubmitted, action: undefined },
    ];
    return { steps, doneCount: steps.filter((s) => s.done).length };
  }, [data]);
  const showOnboarding = onboarding.doneCount < onboarding.steps.length;

  const segments = useMemo(
    () => [
      { key: null as string | null, label: "Alle", count: data.length },
      { key: "my_turn", label: "Deine Eingabe", count: data.filter((m) => m.is_my_turn).length },
      {
        key: "waiting",
        label: "Warte auf Gegenpartei",
        count: data.filter((m) => m.status === "active" && !m.is_my_turn).length,
      },
      {
        key: "pending",
        label: "Ausstehend",
        count: data.filter((m) => m.status === "pending" || m.status === "draft").length,
      },
      { key: "completed", label: "Abgeschlossen", count: data.filter((m) => m.status === "completed").length },
    ],
    [data],
  );

  const segmentLabels: Record<string, string> = {
    my_turn: "Deine Eingabe",
    waiting: "Warte auf Gegenpartei",
    pending: "Ausstehend",
    completed: "Abgeschlossen",
  };

  if (loading) {
    // Skeleton in exakter Layout-Form statt Ladetext (Stripe-Stil).
    return (
      <main className="app-shell pt-[73px]">
        <div className="bg-neutral-900">
          <div className="container py-16 lg:py-24">
            <Skeleton tone="dark" className="h-3 w-24" />
            <Skeleton tone="dark" className="mt-5 h-10 w-72 max-w-full" />
            <Skeleton tone="dark" className="mt-4 h-4 w-96 max-w-full" />
            <div className="mt-14 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-white/10 pt-10 lg:grid-cols-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i}>
                  <Skeleton tone="dark" className="h-3 w-20" />
                  <Skeleton tone="dark" className="mt-4 h-10 w-14" />
                  <Skeleton tone="dark" className="mt-3 h-3 w-24" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <section className="container py-16 lg:py-20">
          <Skeleton className="h-9 w-96 max-w-full rounded-full" />
          <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn("flex items-center gap-6 px-5 py-5", i > 0 && "border-t border-neutral-100")}
              >
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="ml-auto h-3 w-20" />
                <Skeleton className="hidden h-3 w-28 sm:block" />
              </div>
            ))}
          </div>
        </section>
      </main>
    );
  }

  return (
    <>
    <main className="app-shell pt-[73px]">
      <PremiumHero
        variant="bleed"
        eyebrow="Dashboard"
        title="Meine Mediationen"
        subtitle="Übersicht Ihrer laufenden und abgeschlossenen Konflikte."
        stats={stats}
        action={
          /* Mediation im Fokus: ein Primär-CTA, das Logbuch nur als dezenter
             Textlink darunter (Sektion + Empty-State verlinken es zusätzlich). */
          <div className="flex flex-col items-start gap-2.5">
            <PillButton href="/dashboard/mediation/new" tone="light">
              Neue Mediation
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
            </PillButton>
            <a
              href="/dashboard/logbuch/new"
              className="text-xs font-medium text-white/60 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              Oder erst einmal nur dokumentieren – kostenloses Logbuch →
            </a>
          </div>
        }
      />

      <section className="container py-16 lg:py-20">
        {/* ── Eingehende Mediationsanfragen ─────────────────────────── */}
        {invites.length > 0 && (
          <div className="mb-14">
            <div className="mb-1 flex items-center gap-3">
              <h2 className="font-display text-xl font-medium text-neutral-900">
                Eingehende Mediationsanfragen
              </h2>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-[11px] font-semibold text-white">
                {invites.length}
              </span>
            </div>
            <p className="mb-6 text-sm font-light text-neutral-500">
              Du wurdest zu folgenden Mediationsverfahren eingeladen. Nimm die
              Einladung an, um beizutreten.
            </p>

            <div className="space-y-3">
              {invites.map((invite) => (
                <div
                  key={invite.invite_id}
                  className="flex flex-col gap-4 rounded-2xl border border-amber-200/70 bg-amber-50/30 p-6 transition-shadow duration-300 hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)] sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="mb-1.5 flex items-center gap-2">
                      <OutlinePill label="Einladung" className="border-amber-300/70 text-amber-700" />
                      <span className="text-xs text-neutral-500">
                        {typeLabel[invite.mediation_type] ?? invite.mediation_type}
                      </span>
                    </div>
                    <h3 className="font-display text-base font-medium text-neutral-900">
                      {invite.mediation_title}
                    </h3>
                    <p className="mt-1 text-sm font-light text-neutral-500">
                      Deine Rolle:{" "}
                      <span className="font-medium text-neutral-700">
                        {roleLabel[invite.role] ?? invite.role}
                      </span>
                    </p>
                  </div>

                  <PillButton
                    onClick={() => acceptInvite(invite)}
                    disabled={acceptingId === invite.invite_id}
                  >
                    {acceptingId === invite.invite_id
                      ? "Wird angenommen…"
                      : "Einladung annehmen"}
                  </PillButton>
                </div>
              ))}
            </div>

            {acceptError && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-semibold text-red-700">{acceptError}</p>
              </div>
            )}

            <div className="mt-10 hairline" />
          </div>
        )}

        {/* ── Erste Schritte (Onboarding-Checkliste, Stripe-Stil) ────── */}
        {showOnboarding && (
          <div className="mb-14 rounded-2xl border border-neutral-200 bg-white p-6 lg:p-8">
            <div className="mb-1 flex items-center justify-between gap-4">
              <h2 className="font-display text-xl font-medium text-neutral-900">Erste Schritte</h2>
              <span className="text-sm font-medium tabular-nums text-neutral-500">
                {onboarding.doneCount} von {onboarding.steps.length}
              </span>
            </div>
            <p className="mb-5 text-sm font-light text-neutral-500">
              So kommst du in deinem Mediationsverfahren voran.
            </p>
            <ThinProgressBar
              value={(onboarding.doneCount / onboarding.steps.length) * 100}
              tone="accent"
            />
            <ul className="mt-6 space-y-3">
              {onboarding.steps.map((step) => (
                <li key={step.label} className="flex items-center gap-3">
                  {step.done ? (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-500 text-[10px] font-bold text-white">
                      ✓
                    </span>
                  ) : (
                    <span className="h-5 w-5 shrink-0 rounded-full border border-dashed border-neutral-300" />
                  )}
                  <span
                    className={cn(
                      "text-sm",
                      step.done
                        ? "font-light text-neutral-400 line-through decoration-neutral-300"
                        : "font-medium text-neutral-800",
                    )}
                  >
                    {step.label}
                  </span>
                  {!step.done && step.action && (
                    <a
                      href={step.action.href}
                      className="ml-auto text-xs font-semibold text-accent-600 transition-colors hover:text-accent-700"
                    >
                      {step.action.label} →
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Meine Mediationen ─────────────────────────────────────── */}
        {data.length > 0 && (
          <div className="mb-6">
            <SegmentedControl
              segments={segments}
              activeKey={filter?.key ?? null}
              onChange={(key) =>
                setFilter(key ? { key, label: segmentLabels[key] ?? key } : null)
              }
            />
          </div>
        )}

        <div>
          {data.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-300 p-16 text-center">
              <p className="text-lg font-light text-neutral-500">
                Sie haben noch keine Mediationen gestartet.
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <PillButton href="/dashboard/mediation/new">
                  Neue Mediation starten →
                </PillButton>
                <a
                  href="/dashboard/logbuch/new"
                  className="text-sm font-semibold text-accent-600 transition-colors hover:text-accent-700"
                >
                  Oder erst einmal nur dokumentieren – kostenloses Logbuch →
                </a>
              </div>
            </div>
          ) : visibleData.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-300 p-16 text-center">
              <p className="text-lg font-light text-neutral-500">
                Keine Mediationen für diesen Filter.
              </p>
            </div>
          ) : (
            /* Stripe-Stil: dichte, hover-bare Zeilen mit Haarlinien statt Karten.
               Klick öffnet das Slide-over-Panel für eine schnelle Vorschau. */
            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
              <div className="hidden border-b border-neutral-200 bg-neutral-50/60 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-400 sm:grid sm:grid-cols-[minmax(0,1fr)_150px_170px_20px] sm:gap-6">
                <span>Fall</span>
                <span>Status</span>
                <span className="text-right">Fortschritt</span>
                <span />
              </div>
              {visibleData.map((mediation, i) => {
                const status = mediation.status ?? "pending";
                const config = statusConfig[status] ?? fallbackStatus;
                const waitingForOther = status === "active" && !mediation.is_my_turn;

                return (
                  <button
                    key={`mediation-${mediation.id}`}
                    type="button"
                    onClick={() => setSelected(mediation)}
                    className={cn(
                      "group grid w-full grid-cols-[minmax(0,1fr)_20px] items-center gap-4 px-5 py-4 text-left transition-colors duration-150 hover:bg-neutral-50 sm:grid-cols-[minmax(0,1fr)_150px_170px_20px] sm:gap-6",
                      i > 0 && "border-t border-neutral-100",
                      mediation.is_my_turn && "bg-amber-50/40 hover:bg-amber-50/70",
                    )}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-neutral-900">
                        {mediation.title || mediation.conflict_type || "Neue Mediation"}
                      </span>
                      <span className="mt-0.5 block truncate text-xs font-light text-neutral-500">
                        {phaseLabel(mediation.phase)}
                      </span>
                    </span>

                    <span className="hidden flex-col gap-1 sm:flex">
                      <StatusDot label={config.label} tone={config.tone} />
                      {mediation.is_my_turn && (
                        <StatusDot label="Deine Eingabe" tone="amber" pulse />
                      )}
                      {waitingForOther && (
                        <span className="text-[11px] font-light text-neutral-400">
                          Warte auf Gegenpartei
                        </span>
                      )}
                    </span>

                    <span className="hidden items-center justify-end gap-3 sm:flex">
                      <span className="w-20">
                        <ThinProgressBar value={mediation.progress ?? 0} />
                      </span>
                      <span className="w-10 text-right text-sm font-medium tabular-nums text-neutral-900">
                        {mediation.progress ?? 0}%
                      </span>
                    </span>

                    <span className="text-neutral-300 transition-transform duration-200 group-hover:translate-x-0.5">
                      ›
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Konflikt-Logbücher (kostenlos) – bewusst UNTER den Mediationen:
             die Verfahren bleiben im Fokus, das Logbuch ist Ergänzung. ── */}
        {logbooks.length > 0 && (
          <div className="mt-14">
            <div className="hairline mb-10" />
            <div className="mb-1 flex items-center gap-3">
              <h2 className="font-display text-lg font-medium text-neutral-900">
                Deine Konflikt-Logbücher
              </h2>
              <span className="rounded-full border border-accent-200 bg-accent-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent-700">
                kostenlos
              </span>
            </div>
            <p className="mb-5 text-sm font-light text-neutral-500">
              Dokumentierte Streitigkeiten – noch keine Mediation. Umwandeln
              kannst du jederzeit.
            </p>
            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
              {logbooks.map((log, i) => (
                <a
                  key={`logbuch-${log.id}`}
                  href={`/dashboard/logbuch/${encodeId(Number(log.id))}`}
                  className={cn(
                    "group grid w-full grid-cols-[minmax(0,1fr)_20px] items-center gap-4 px-5 py-4 text-left transition-colors duration-150 hover:bg-neutral-50 sm:grid-cols-[minmax(0,1fr)_150px_20px] sm:gap-6",
                    i > 0 && "border-t border-neutral-100",
                  )}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-neutral-900">
                      {log.title || "Konflikt-Logbuch"}
                    </span>
                    <span className="mt-0.5 block truncate text-xs font-light text-neutral-500">
                      {typeLabel[log.conflict_type ?? ""] ?? log.conflict_type}
                    </span>
                  </span>
                  <span className="hidden sm:block">
                    <StatusDot label="Logbuch" tone="sky" />
                  </span>
                  <span className="text-neutral-300 transition-transform duration-200 group-hover:translate-x-0.5">
                    ›
                  </span>
                </a>
              ))}
            </div>
            <a
              href="/dashboard/logbuch/new"
              className="mt-3 inline-block text-xs font-semibold text-accent-600 transition-colors hover:text-accent-700"
            >
              Weiteren Streit dokumentieren →
            </a>
          </div>
        )}
      </section>
    </main>

    {/* ── Slide-over: Fall-Vorschau ohne Seitenwechsel (Stripe-Stil) ── */}
    <SlideOver
      open={selected !== null}
      onClose={() => setSelected(null)}
      title={
        selected && (
          <>
            <p className="eyebrow mb-2">Fall-Vorschau</p>
            <h2 className="truncate font-display text-xl font-medium text-neutral-900">
              {selected.title || selected.conflict_type || "Neue Mediation"}
            </h2>
          </>
        )
      }
    >
      {selected && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <StatusDot
              label={(statusConfig[selected.status ?? "pending"] ?? fallbackStatus).label}
              tone={(statusConfig[selected.status ?? "pending"] ?? fallbackStatus).tone}
            />
            {selected.is_my_turn && <StatusDot label="Deine Eingabe" tone="amber" pulse />}
          </div>

          <dl className="space-y-4 border-t border-neutral-100 pt-6">
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-xs font-medium uppercase tracking-wide text-neutral-400">Phase</dt>
              <dd className="text-sm font-medium text-neutral-800">{phaseLabel(selected.phase)}</dd>
            </div>
            {selected.conflict_type && (
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-xs font-medium uppercase tracking-wide text-neutral-400">Art</dt>
                <dd className="text-sm font-medium text-neutral-800">
                  {typeLabel[selected.conflict_type] ?? selected.conflict_type}
                </dd>
              </div>
            )}
            {selected.role && (
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-xs font-medium uppercase tracking-wide text-neutral-400">Deine Rolle</dt>
                <dd className="text-sm font-medium text-neutral-800">
                  {roleLabel[selected.role] ?? selected.role}
                </dd>
              </div>
            )}
          </dl>

          <div className="border-t border-neutral-100 pt-6">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">Fortschritt</p>
              <span className="text-sm font-semibold tabular-nums text-neutral-900">
                {selected.progress ?? 0}%
              </span>
            </div>
            <ThinProgressBar value={selected.progress ?? 0} />
          </div>

          {selected.description && (
            <div className="border-t border-neutral-100 pt-6">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-400">
                Beschreibung
              </p>
              <p className="text-sm font-light leading-relaxed text-neutral-600">
                {selected.description}
              </p>
            </div>
          )}

          <div className="border-t border-neutral-100 pt-6">
            <PillButton href={`/dashboard/${encodeId(Number(selected.id))}`} className="w-full">
              {selected.is_my_turn ? "Eingabe machen" : "Fall öffnen"} →
            </PillButton>
          </div>
        </div>
      )}
    </SlideOver>

    {videoModalMediationId !== null && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/80 p-4 backdrop-blur-sm">
        <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl">
          <p className="eyebrow mb-3">Einladung angenommen</p>
          <h2 className="font-display text-xl font-medium text-neutral-900">
            Die andere Seite hat dir eine persönliche Video-Botschaft hinterlassen
          </h2>
          <div className="mt-5 overflow-hidden rounded-2xl bg-neutral-900">
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
              src={`/api/mediations/${videoModalMediationId}/invites/me/video`}
              className="aspect-video w-full"
              controls
              autoPlay
            />
          </div>
          <PillButton
            onClick={() => {
              const id = videoModalMediationId;
              setVideoModalMediationId(null);
              router.push(`/dashboard/${encodeId(id as number)}`);
            }}
            className="mt-6"
          >
            Weiter zur Mediation →
          </PillButton>
        </div>
      </div>
    )}
    </>
  );
}
