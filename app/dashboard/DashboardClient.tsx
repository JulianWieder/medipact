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
  Kicker,
  cardSurface,
  cardLift,
  rowHover,
  cn,
} from "@/app/components/ui/premium";
import { Reveal, stagger } from "@/app/components/ui/motion";
import { CrossfadePanel } from "@/app/components/ui/TabSwitcher";
import { PHASES } from "@/app/workspace/types";
import Icon from "@/app/components/ui/Icon";
import KalenderKarte from "@/app/components/kalender/KalenderKarte";

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

// ── Konflikt-Logbuch (Ein-Buch-Umbau) ───────────────────────────────────────
// Es gibt EIN Logbuch pro Nutzer:in; die Karte zeigt die neuesten Einträge als
// Vorschau. Bereiche hängen am Eintrag (area) – kurze Labels für die Chips.
interface LogPreviewEntry {
  id: number;
  entry_type: string;
  area?: string | null;
  title?: string | null;
  occurred_at: string | null;
  created_at: string | null;
  content?: Record<string, unknown>;
}

const logEntryMeta: Record<string, { icon: string; label: string }> = {
  vorkommnis: { icon: "📌", label: "Vorkommnis" },
  gedanke: { icon: "💭", label: "Gedanke" },
  gespraech: { icon: "🗣️", label: "Gespräch" },
  email: { icon: "✉️", label: "E-Mail" },
  whatsapp: { icon: "💬", label: "WhatsApp" },
  telefonat: { icon: "📞", label: "Telefonat" },
};

const areaShortLabel: Record<string, string> = {
  trennung: "Trennung & Familie",
  erbschaft: "Erbschaft",
  nachbarschaft: "Nachbarschaft",
  wg: "WG",
  verbraucher: "Verbraucher",
  odr: "Geschäft & Arbeit",
  schlichtung: "Geschäft & Arbeit",
  ecommerce: "Geschäft & Arbeit",
  b2b: "Geschäft & Arbeit",
  geschaeft: "Geschäft & Arbeit",
};

function logEntrySnippet(e: LogPreviewEntry): string {
  if (e.title && e.title.trim()) return e.title.trim();
  for (const v of Object.values(e.content ?? {})) {
    if (typeof v === "string" && v.trim()) {
      const t = v.trim().replace(/\s+/g, " ");
      return t.length > 90 ? `${t.slice(0, 90)} …` : t;
    }
  }
  return "";
}

function logEntryDate(e: LogPreviewEntry): string {
  const iso = e.occurred_at ?? e.created_at;
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" });
}

// ── Sektionskopf (Landing-Sprache im Produkt) ───────────────────────────────
// Kicker + Serif-Überschrift, wie auf der Landing (ZweiWelten/OutcomeWand),
// nur eine Stufe kleiner. Rechts optional ein Zähler oder eine Aktion.
function SectionHeading({
  kicker,
  title,
  hint,
  right,
  className,
}: {
  kicker: string;
  title: string;
  hint?: string;
  right?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-5", className)}>
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <Kicker className="mb-2">{kicker}</Kicker>
          <h2 className="font-display text-xl font-medium tracking-tight text-neutral-900">
            {title}
          </h2>
        </div>
        {right && <div className="shrink-0">{right}</div>}
      </div>
      {hint && <p className="mt-2 max-w-prose text-sm font-light text-neutral-500">{hint}</p>}
    </div>
  );
}

// ── Seitenspalten-Karte ─────────────────────────────────────────────────────
// Die schmale Karte der rechten Spalte: Hairline-Fläche mit dem Glanzstrich
// oben, den `.app-surface` auf der Landing benutzt – nur ohne deren
// Hover-Transform, weil hier auch statische Panels (Erste Schritte) stehen.
function SideCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(cardSurface, "relative overflow-hidden", className)}>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-300/70 to-transparent"
      />
      {children}
    </div>
  );
}

export default function DashboardClient() {
  const [data, setData] = useState<Mediation[]>([]);
  // Kostenlose Konflikt-Logbücher (mode="logbuch") – eigene Sektion, zählen
  // nicht in die Verfahrens-Statistiken hinein.
  const [logbooks, setLogbooks] = useState<Mediation[]>([]);
  // Eintrags-Vorschau je Logbuch (Ein-Buch-Karte + Erkennung des Hauptbuchs).
  const [logEntriesByBook, setLogEntriesByBook] = useState<Record<string, LogPreviewEntry[]>>({});
  const [deletingLogId, setDeletingLogId] = useState<number | null>(null);
  const [logError, setLogError] = useState("");
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
          const books = mapped.filter((m: Mediation) => m.mode === "logbuch");
          setLogbooks(books);
          // Vorschau-Einträge aller Bücher laden: bestimmt das Hauptbuch
          // (meiste Einträge – Alt-Duplikate sind meist leer) und füllt die
          // Eintrags-Vorschau der Karte.
          void Promise.all(
            books.map(async (b: Mediation) => {
              try {
                const r = await fetch(`/api/mediations/${b.id}/logbuch/entries`, {
                  cache: "no-store",
                });
                return [String(b.id), r.ok ? await r.json() : []] as const;
              } catch {
                return [String(b.id), []] as const;
              }
            }),
          ).then((pairs) => setLogEntriesByBook(Object.fromEntries(pairs)));
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

  // ── Ein-Buch-Prinzip: Hauptbuch = meiste Einträge (Tie: ältestes) ──
  const primaryBook = useMemo(() => {
    if (logbooks.length === 0) return null;
    return [...logbooks].sort((a, b) => {
      const ea = logEntriesByBook[String(a.id)]?.length ?? 0;
      const eb = logEntriesByBook[String(b.id)]?.length ?? 0;
      if (eb !== ea) return eb - ea;
      return Number(a.id) - Number(b.id);
    })[0];
  }, [logbooks, logEntriesByBook]);

  const otherBooks = useMemo(
    () => logbooks.filter((b) => b.id !== primaryBook?.id),
    [logbooks, primaryBook],
  );

  const previewEntries = useMemo(
    () =>
      primaryBook
        ? (logEntriesByBook[String(primaryBook.id)] ?? []).slice(0, 3)
        : [],
    [primaryBook, logEntriesByBook],
  );

  const primaryCount = primaryBook
    ? (logEntriesByBook[String(primaryBook.id)]?.length ?? 0)
    : 0;

  // Alte/doppelte Logbücher direkt vom Dashboard aus löschen (Aufräum-Pfad
  // für die vor dem Ein-Buch-Umbau angesammelten Duplikate).
  async function deleteLogbook(id: number) {
    const n = logEntriesByBook[String(id)]?.length ?? 0;
    const warn =
      n > 0
        ? `Dieses Logbuch mit ${n} ${n === 1 ? "Eintrag" : "Einträgen"} unwiderruflich löschen?`
        : "Dieses leere Logbuch löschen?";
    if (!window.confirm(warn)) return;
    setDeletingLogId(id);
    setLogError("");
    try {
      const res = await fetch(`/api/mediations/${id}`, { method: "DELETE" });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        setLogError(body?.detail ?? body?.error ?? `Löschen fehlgeschlagen (${res.status})`);
        return;
      }
      setLogbooks((prev) => prev.filter((b) => Number(b.id) !== id));
    } catch {
      setLogError("Server nicht erreichbar.");
    } finally {
      setDeletingLogId(null);
    }
  }

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

  // Filter-Prädikate für die Filterleiste über der Liste (einzige Filterstelle).
  const filterPredicates: Record<string, (m: Mediation) => boolean> = {
    my_turn: (m) => !!m.is_my_turn,
    waiting: (m) => m.status === "active" && !m.is_my_turn,
    pending: (m) => m.status === "pending" || m.status === "draft",
    completed: (m) => m.status === "completed",
  };

  // Aktions-Fokus (Option C): die Fälle, die konkret auf mich warten, +
  // eine schlanke Zahlen-Zeile statt vier großer Kennzahl-Kacheln.
  const waiting = useMemo(() => data.filter((m) => m.is_my_turn), [data]);
  const counts = useMemo(
    () => ({
      active: data.filter((m) => m.status === "active").length,
      pending: data.filter((m) => m.status === "pending" || m.status === "draft").length,
      completed: data.filter((m) => m.status === "completed").length,
    }),
    [data],
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
    // Konkreter Fall, auf den die offenen Schritte verweisen. Ohne diesen Link
    // war die Checkliste bei "Verfahren gestartet" eine Sackgasse: der Start
    // passiert erst nach Rechnungsdaten + Zahlung auf der Fall-Seite, das
    // Dashboard bot dafür aber keinen Weg an.
    const toStart = data.find((m) => m.status === "pending" || m.status === "draft");
    const toAnswer = data.find((m) => m.is_my_turn);
    const caseHref = (m?: Mediation) => (m ? `/dashboard/${encodeId(Number(m.id))}` : undefined);
    const startHref = caseHref(toStart);
    const answerHref = caseHref(toAnswer);

    const steps = [
      { label: "Konto erstellt", done: true, action: undefined as { label: string; href: string } | undefined },
      {
        label: "Mediation angelegt oder Einladung angenommen",
        done: hasCase,
        action: !hasCase ? { label: "Neue Mediation starten", href: "/dashboard/mediation/new" } : undefined,
      },
      {
        label: "Verfahren gestartet",
        done: hasStarted,
        action:
          !hasStarted && startHref
            ? { label: "Fall einrichten und starten", href: startHref }
            : undefined,
        hint:
          !hasStarted && startHref
            ? "Dazu im Fall die Beteiligten verbinden, die Rechnungsdaten hinterlegen und die Mediation starten. Bezahlt wird erst als erster Schritt im Verfahren."
            : undefined,
      },
      {
        label: "Erste Eingabe gemacht",
        done: hasSubmitted,
        action:
          !hasSubmitted && answerHref ? { label: "Eingabe machen", href: answerHref } : undefined,
      },
    ] as {
      label: string;
      done: boolean;
      action?: { label: string; href: string };
      hint?: string;
    }[];
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
            <div className="mt-14 grid grid-cols-3 gap-x-8 border-t border-white/10 pt-8">
              {[0, 1, 2].map((i) => (
                <div key={i}>
                  <Skeleton tone="dark" className="h-3 w-20" />
                  <Skeleton tone="dark" className="mt-3 h-8 w-12" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <section className="container py-14 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-8">
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
            </div>
            <div className="space-y-6 lg:col-span-4">
              <Skeleton className="h-44 w-full rounded-2xl" />
              <Skeleton className="h-32 w-full rounded-2xl" />
            </div>
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
      >
        {/* Aktions-Fokus statt Kennzahl-Kacheln – nur wenn es Fälle gibt. */}
        {data.length > 0 && (
          <div className="flex flex-col gap-8">
            <div>
              <Kicker tone="light">
                Das wartet auf dich{waiting.length > 0 ? ` · ${waiting.length}` : ""}
              </Kicker>
              {waiting.length > 0 ? (
                <div className="mt-4 space-y-2.5">
                  {waiting.map((m) => (
                    <div
                      key={`waiting-${m.id}`}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-accent-300/30 bg-accent-300/10 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">
                          {m.title || m.conflict_type || "Neue Mediation"}
                        </p>
                        <p className="mt-0.5 truncate text-xs font-light text-neutral-300">
                          {phaseLabel(m.phase)}
                        </p>
                      </div>
                      <a
                        href={`/dashboard/${encodeId(Number(m.id))}`}
                        className="shrink-0 whitespace-nowrap rounded-full bg-accent-300 px-4 py-1.5 text-xs font-bold text-neutral-900 transition-colors hover:bg-white"
                      >
                        Eingabe machen →
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 max-w-xl text-sm font-light text-neutral-300">
                  Nichts wartet gerade auf dich – der Ball liegt bei der
                  Gegenseite oder alles ist erledigt.
                </p>
              )}
            </div>

            {/* Zahlen-Zeile in der Landing-Typo: Kicker-Label über einer
                Serif-Zahl, getrennt durch Haarlinien statt Kacheln. */}
            <div className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 pt-7">
              {[
                { label: "Laufend", value: counts.active, accent: true },
                { label: "Ausstehend", value: counts.pending, accent: false },
                { label: "Abgeschlossen", value: counts.completed, accent: false },
              ].map((c, i) => (
                <div key={c.label} className={cn(i === 0 ? "pr-5" : "px-5", i === 2 && "pr-0")}>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">
                    {c.label}
                  </p>
                  <p
                    className={cn(
                      "mt-2 font-display text-3xl font-medium tracking-tight tabular-nums lg:text-4xl",
                      c.accent && c.value > 0 ? "text-accent-300" : "text-white",
                    )}
                  >
                    {c.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </PremiumHero>

      <section className="container py-14 lg:py-16">
        {/* ── Eingehende Mediationsanfragen ───────────────────────────
             Bleibt über beiden Spalten: eine offene Einladung ist die
             dringendste Sache auf der Seite und darf nicht in einer
             Seitenspalte verschwinden. */}
        {invites.length > 0 && (
          <Reveal className="mb-12">
            <SectionHeading
              kicker="Aktion nötig"
              title="Eingehende Mediationsanfragen"
              hint="Du wurdest zu folgenden Mediationsverfahren eingeladen. Nimm die Einladung an, um beizutreten."
              right={
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-[11px] font-semibold text-white">
                  {invites.length}
                </span>
              }
            />

            <div className="space-y-3">
              {invites.map((invite, i) => (
                /* Reveal bleibt ein reiner Wrapper: framer-motion schreibt
                   `transform` inline, das würde ein `hover:-translate-y-*`
                   auf demselben Element aushebeln. Bewegung außen,
                   Hover innen. */
                <Reveal key={invite.invite_id} delay={stagger(i)}>
                <div
                  className={cn(
                    "flex flex-col gap-4 rounded-2xl border border-amber-200/70 bg-amber-50/30 p-6 hover:border-amber-300 sm:flex-row sm:items-center sm:justify-between",
                    cardLift,
                  )}
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
                </Reveal>
              ))}
            </div>

            {acceptError && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-semibold text-red-700">{acceptError}</p>
              </div>
            )}

            <div className="mt-10 hairline" />
          </Reveal>
        )}

        {/* ── Zwei Spalten ────────────────────────────────────────────
             Links die Arbeit (Verfahren), rechts der Kontext (Fortschritt,
             Kalender, Logbuch). Vorher lag alles untereinander: der Kalender
             und das Logbuch standen dadurch immer unter einer beliebig
             langen Fallliste und wurden faktisch nie gesehen. */}
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* ── Hauptspalte: Verfahren ───────────────────────────────── */}
          <div className="min-w-0 lg:col-span-8">
            {data.length > 0 && (
              <Reveal>
                <SectionHeading
                  kicker="Verfahren"
                  title="Meine Mediationen"
                  right={
                    <span className="hidden text-xs font-medium tabular-nums text-neutral-400 sm:block">
                      {visibleData.length} von {data.length}
                    </span>
                  }
                />
                <div className="mb-5">
                  <SegmentedControl
                    segments={segments}
                    activeKey={filter?.key ?? null}
                    onChange={(key) =>
                      setFilter(key ? { key, label: segmentLabels[key] ?? key } : null)
                    }
                  />
                </div>
              </Reveal>
            )}

            {/* Filterwechsel als Crossfade statt hartem Umschalten – dieselbe
                Mechanik wie die ThemenTabs auf der Landing. `activeKey` ist der
                Filter, damit AnimatePresence beim Wechsel neu mountet. */}
            <CrossfadePanel activeKey={filter?.key ?? "__all__"}>
              {data.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-neutral-300 bg-white/50 p-12 text-center sm:p-16">
                  <span className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-50 text-accent-700">
                    <Icon name="dove" size={24} />
                  </span>
                  <p className="font-display text-lg font-medium text-neutral-900">
                    Noch keine Mediation gestartet
                  </p>
                  <p className="mx-auto mt-2 max-w-sm text-sm font-light text-neutral-500">
                    Jeder Konflikt hat einen Ausgang. Der erste Schritt ist,
                    ihn zu benennen.
                  </p>

                  <div className="mt-7 flex flex-col items-center justify-center gap-3">
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
                  <div className="hidden border-b border-neutral-200 bg-neutral-50/60 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-400 sm:grid sm:grid-cols-[minmax(0,1fr)_150px_140px_20px] sm:gap-5">
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
                          "group relative grid w-full grid-cols-[minmax(0,1fr)_20px] items-center gap-4 px-5 py-4 text-left sm:grid-cols-[minmax(0,1fr)_150px_140px_20px] sm:gap-5",
                          i > 0 && "border-t border-neutral-100",
                          /* Entweder-oder: zwei `hover:bg-*`-Klassen auf einem
                             Element entscheidet die Stylesheet-Reihenfolge, nicht
                             die Reihenfolge hier. */
                          mediation.is_my_turn
                            ? "bg-amber-50/40 transition-colors duration-200 hover:bg-amber-50/70"
                            : rowHover,
                        )}
                      >
                        {/* Akzentkante links bei "du bist dran" – dieselbe
                            Markierung wie im Hero, nur ruhiger. */}
                        {mediation.is_my_turn && (
                          <span
                            aria-hidden
                            className="absolute inset-y-0 left-0 w-0.5 bg-amber-400"
                          />
                        )}
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
                          <span className="w-16">
                            <ThinProgressBar value={mediation.progress ?? 0} />
                          </span>
                          <span className="w-9 text-right text-sm font-medium tabular-nums text-neutral-900">
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
            </CrossfadePanel>
          </div>

          {/* ── Seitenspalte: Fortschritt, Kalender, Logbuch ───────────
               Bewusst NICHT `sticky`: die Spalte kann mit Checkliste,
               Kalender und Logbuch höher werden als der Viewport, und ein
               gepinntes Element, dessen Unterkante man nie erreicht, ist
               schlechter als gar kein Pinning. */}
          <aside className="min-w-0 space-y-6 lg:col-span-4">
            {/* Erste Schritte (Onboarding-Checkliste) */}
            {showOnboarding && (
              <Reveal>
                <SideCard className="p-5">
                  <div className="mb-3 flex items-baseline justify-between gap-3">
                    <Kicker>Erste Schritte</Kicker>
                    <span className="text-xs font-semibold tabular-nums text-neutral-400">
                      {onboarding.doneCount}/{onboarding.steps.length}
                    </span>
                  </div>
                  <ThinProgressBar
                    value={(onboarding.doneCount / onboarding.steps.length) * 100}
                    tone="accent"
                  />
                  <ul className="mt-5 space-y-3">
                    {onboarding.steps.map((step) => (
                      <li key={step.label} className="flex items-start gap-2.5">
                        {step.done ? (
                          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent-500 text-white">
                            <Icon name="check" size={10} />
                          </span>
                        ) : (
                          <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full border border-dashed border-neutral-300" />
                        )}
                        <div className="min-w-0 flex-1">
                          <span
                            className={cn(
                              "block text-[13px] leading-snug",
                              step.done
                                ? "font-light text-neutral-400 line-through decoration-neutral-300"
                                : "font-medium text-neutral-800",
                            )}
                          >
                            {step.label}
                          </span>
                          {!step.done && step.hint && (
                            <p className="mt-1 text-[11px] font-light leading-relaxed text-neutral-500">
                              {step.hint}
                            </p>
                          )}
                          {!step.done && step.action && (
                            <a
                              href={step.action.href}
                              className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-accent-600 transition-colors hover:text-accent-700"
                            >
                              {step.action.label}
                              <span aria-hidden>→</span>
                            </a>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </SideCard>
              </Reveal>
            )}

            {/* ── Kalender ──
                 Über dem Logbuch, weil er die dringendere Frage beantwortet:
                 was steht an und wartet etwas auf mich. Die Karte blendet
                 sich selbst aus, wenn es kein Logbuch gibt. */}
            <KalenderKarte className="" />

            {/* ── Dein Konflikt-Logbuch (Ein-Buch-Prinzip) ── */}
            {primaryBook && (
              <Reveal>
                <div className="mb-3 flex items-center gap-2">
                  <Kicker>Dein Konflikt-Logbuch</Kicker>
                  <span className="rounded-full border border-accent-200 bg-accent-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-accent-700">
                    kostenlos
                  </span>
                </div>

                {logError && (
                  <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {logError}
                  </div>
                )}

                <a
                  href={`/dashboard/logbuch/${encodeId(Number(primaryBook.id))}`}
                  className={cn(
                    "group relative block overflow-hidden rounded-2xl border border-neutral-200 bg-white",
                    cardLift,
                  )}
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-300/70 to-transparent"
                  />
                  <span className="flex items-center gap-3 px-4 py-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-700">
                      <Icon name="notebook" size={18} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-neutral-900">
                        {primaryBook.title || "Konflikt-Logbuch"}
                      </span>
                      <span className="mt-0.5 block text-xs font-light text-neutral-500">
                        {primaryCount === 0
                          ? "Noch keine Einträge"
                          : `${primaryCount} ${primaryCount === 1 ? "Eintrag" : "Einträge"}`}
                      </span>
                    </span>
                    <span className="text-neutral-300 transition-transform duration-200 group-hover:translate-x-0.5">
                      ›
                    </span>
                  </span>

                  {/* Vorschau: die 3 neuesten Einträge */}
                  {previewEntries.length > 0 ? (
                    <span className="block border-t border-neutral-100">
                      {previewEntries.map((e) => {
                        const meta = logEntryMeta[e.entry_type] ?? logEntryMeta.vorkommnis;
                        const snippet = logEntrySnippet(e);
                        const area = areaShortLabel[(e.area ?? "").toLowerCase()];
                        return (
                          /* Zweizeilig statt einzeilig: in der schmalen
                             Seitenspalte hätten Art, Bereich, Datum und
                             Textauszug nebeneinander keinen Platz – der
                             Bereichs-Chip war deshalb vorher der Erste, der
                             wegfiel. */
                          <span
                            key={`log-preview-${e.id}`}
                            className="block border-t border-neutral-50 px-4 py-2.5 first:border-t-0"
                          >
                            <span className="flex items-center gap-2">
                              <span className="shrink-0 text-neutral-400">
                                <Icon name={meta.icon} size={13} />
                              </span>
                              <span className="truncate text-[12px] font-semibold text-neutral-900">
                                {meta.label}
                              </span>
                              {area && (
                                <span className="shrink-0 truncate rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-500">
                                  {area}
                                </span>
                              )}
                              <span className="ml-auto shrink-0 text-[11px] font-light tabular-nums text-neutral-400">
                                {logEntryDate(e)}
                              </span>
                            </span>
                            {snippet && (
                              <span className="mt-1 block truncate pl-[21px] text-[12px] font-light text-neutral-500">
                                {snippet}
                              </span>
                            )}
                          </span>
                        );
                      })}
                    </span>
                  ) : (
                    <span className="block border-t border-neutral-100 px-4 py-3 text-xs font-light leading-relaxed text-neutral-400">
                      Halte das erste Vorkommnis fest – Gespräche, Nachrichten,
                      Gedanken, Fotos.
                    </span>
                  )}
                </a>

                {/* Alte Duplikat-Bücher (vor dem Ein-Buch-Umbau angelegt) */}
                {otherBooks.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-neutral-400">
                      Ältere Logbücher – am besten aufräumen
                    </p>
                    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
                      {otherBooks.map((log, i) => {
                        const count = logEntriesByBook[String(log.id)]?.length ?? 0;
                        return (
                          <div
                            key={`logbuch-${log.id}`}
                            className={cn(
                              "flex w-full items-center gap-3 px-4 py-3",
                              i > 0 && "border-t border-neutral-100",
                            )}
                          >
                            <a
                              href={`/dashboard/logbuch/${encodeId(Number(log.id))}`}
                              className="min-w-0 flex-1 hover:text-accent-700"
                            >
                              <span className="block truncate text-[13px] font-medium text-neutral-900">
                                {log.title || "Konflikt-Logbuch"}
                              </span>
                              <span className="mt-0.5 block truncate text-[11px] font-light text-neutral-500">
                                {count === 0
                                  ? "leer"
                                  : `${count} ${count === 1 ? "Eintrag" : "Einträge"}`}
                                {" · "}
                                {typeLabel[log.conflict_type ?? ""] ?? log.conflict_type}
                              </span>
                            </a>
                            <button
                              type="button"
                              onClick={() => deleteLogbook(Number(log.id))}
                              disabled={deletingLogId === Number(log.id)}
                              className="shrink-0 text-[11px] font-semibold text-neutral-400 transition hover:text-red-500 disabled:opacity-50"
                            >
                              {deletingLogId === Number(log.id) ? "Lösche …" : "Löschen"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </Reveal>
            )}

            {/* Wer noch kein Logbuch hat, sieht hier den Einstieg statt einer
                leeren Spalte – der kostenlose Pfad war vorher nur im Hero
                und im Empty-State verlinkt. */}
            {!primaryBook && (
              <Reveal>
                <SideCard className="p-5">
                  <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-accent-50 text-accent-700">
                    <Icon name="notebook" size={18} />
                  </span>
                  <Kicker className="mb-1.5">Kostenlos</Kicker>
                  <p className="font-display text-base font-medium text-neutral-900">
                    Konflikt-Logbuch
                  </p>
                  <p className="mt-1.5 text-[13px] font-light leading-relaxed text-neutral-500">
                    Dein privates Gedächtnisprotokoll: ein Buch für alle
                    Konflikte, jeder Eintrag einem Bereich zugeordnet. In eine
                    Mediation umwandeln kannst du jederzeit.
                  </p>
                  <a
                    href="/dashboard/logbuch/new"
                    className="mt-4 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-accent-600 transition-colors hover:text-accent-700"
                  >
                    Logbuch anlegen
                    <span aria-hidden>→</span>
                  </a>
                </SideCard>
              </Reveal>
            )}
          </aside>
        </div>
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
