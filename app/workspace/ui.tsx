// Shared UI-Bausteine für den Workspace – nutzen das medipact Design-System
// und die app-weit geteilten Premium-Komponenten aus app/components/ui/premium.tsx,
// damit Workspace und das öffentliche Dashboard optisch konsistent bleiben.

import React from "react";
import { STATUS_CONFIG, TYPE_LABEL, TYPE_COLOR, ROLE_LABEL, INVOICE_STATUS_CONFIG } from "./types";
import { OutlinePill, ThinProgressBar, StatusDot, Skeleton } from "@/app/components/ui/premium";

// ── Utilities ─────────────────────────────────────────────────────────────

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

// ── Status Badge ──────────────────────────────────────────────────────────
// Standardisiert (Stripe-Stil): kleiner farbiger Punkt + Text statt
// umrandeter Pille — gleiche Optik wie im Teilnehmer-Dashboard.

type DotTone = "teal" | "amber" | "sky" | "neutral" | "red";

/** Fall-Status → StatusDot-Tone. Gleiche Zuordnung wie im
 *  Teilnehmer-Dashboard (DashboardClient), damit beide Bereiche
 *  identische Statusfarben zeigen. */
const STATUS_TONE: Record<string, DotTone> = {
  draft: "sky",
  pending: "amber",
  active: "teal",
  completed: "neutral",
};

const INVOICE_STATUS_TONE: Record<string, DotTone> = {
  paid: "teal",
  open: "amber",
  refunded: "sky",
  failed: "red",
};

export function StatusBadge({ status }: { status: string | null | undefined }) {
  const cfg = STATUS_CONFIG[status ?? "draft"] ?? STATUS_CONFIG.draft;
  return <StatusDot label={cfg.label} tone={STATUS_TONE[status ?? "draft"] ?? "neutral"} />;
}

// ── Type Badge ────────────────────────────────────────────────────────────

export function TypeBadge({ type }: { type: string | null | undefined }) {
  const color = TYPE_COLOR[type ?? "nachbarschaft"] ?? TYPE_COLOR.nachbarschaft;
  const label = TYPE_LABEL[type ?? ""] ?? (type ?? "–");
  return <OutlinePill label={label} className={color} />;
}

// ── Invoice Status Badge ──────────────────────────────────────────────────

export function InvoiceStatusBadge({ status }: { status: string | null | undefined }) {
  const cfg = INVOICE_STATUS_CONFIG[status ?? "open"] ?? INVOICE_STATUS_CONFIG.open;
  return <StatusDot label={cfg.label} tone={INVOICE_STATUS_TONE[status ?? "open"] ?? "neutral"} />;
}

// ── Role Badge ────────────────────────────────────────────────────────────

export function RoleBadge({ role }: { role: string }) {
  const label = ROLE_LABEL[role] ?? role;
  const isMediand = role === "other_party" || role === "initiator" || role === "owner";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
        role === "mediator"
          ? "bg-accent-100 text-accent-700"
          : isMediand
            ? "bg-neutral-100 text-neutral-600"
            : "bg-sky-100 text-sky-700",
      )}
    >
      {label}
    </span>
  );
}

// ── Section Header ────────────────────────────────────────────────────────

export function SectionHeader({
  label,
  title,
  action,
}: {
  label?: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        {label && <p className="eyebrow mb-1">{label}</p>}
        <h3 className="text-sm font-semibold text-neutral-900">{title}</h3>
      </div>
      {action}
    </div>
  );
}

// ── KPI Card ──────────────────────────────────────────────────────────────

export function KPI({
  label,
  value,
  sub,
  onClick,
  active,
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
  /** Macht die KPI-Kachel klickbar (z.B. um die Fallliste nach diesem Status zu filtern). */
  onClick?: () => void;
  /** Hebt die Kachel hervor, wenn ihr Filter aktuell aktiv ist. */
  active?: boolean;
}) {
  const content = (
    <>
      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">{label}</div>
      <div
        className={cn(
          "mt-2.5 font-display text-2xl font-medium tracking-tight tabular-nums",
          active ? "text-accent-600" : "text-neutral-900",
        )}
      >
        {value}
      </div>
      {sub && <div className="mt-1 text-xs font-light text-neutral-500">{sub}</div>}
    </>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="relative w-full rounded-2xl border border-neutral-200 bg-white/60 p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-200 hover:shadow-md hover:shadow-accent-900/5"
      >
        {content}
        <span
          className={cn(
            "absolute inset-x-4 bottom-0 h-px bg-accent-500 transition-opacity duration-300",
            active ? "opacity-100" : "opacity-0",
          )}
        />
      </button>
    );
  }

  return <div className="rounded-2xl border border-neutral-200 bg-white/60 p-4">{content}</div>;
}

// ── Workspace Card ────────────────────────────────────────────────────────

export function WCard({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={cn("rounded-2xl border border-neutral-200 bg-white shadow-sm", className)}
      style={style}
    >
      {children}
    </div>
  );
}

// ── Row Card ──────────────────────────────────────────────────────────────
// Standardisierte klickbare Listen-Karte (Dashboard-Listen, Detail-Reihen):
// weiße Karte mit dem einheitlichen Hover des Design-Systems (Akzent-Rahmen,
// leichtes Anheben, weicher Schatten) — statt den Button-Stil pro Call-Site
// zu wiederholen. Für nicht-klickbare Karten weiterhin WCard verwenden.

export function RowCard({
  onClick,
  disabled,
  className = "",
  children,
}: {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full rounded-2xl border border-neutral-200 bg-white p-4 text-left transition-all duration-300",
        "hover:-translate-y-0.5 hover:border-accent-200 hover:shadow-md hover:shadow-accent-900/5",
        "disabled:cursor-default disabled:hover:translate-y-0 disabled:hover:border-neutral-200 disabled:hover:shadow-none",
        className,
      )}
    >
      {children}
    </button>
  );
}

// ── List Row ──────────────────────────────────────────────────────────────
// Stripe-Stil: dichte, hover-bare Zeile für Listen im Hairline-Container
// (`<div className="overflow-hidden rounded-2xl border border-neutral-200
// bg-white">`). Gegenstück zur Zeilen-Liste im Teilnehmer-Dashboard.

export function ListRow({
  onClick,
  disabled,
  first,
  emphasis,
  className = "",
  children,
}: {
  onClick?: () => void;
  disabled?: boolean;
  /** Erste Zeile im Container (keine obere Haarlinie). */
  first?: boolean;
  /** Amber-Hinterlegung für Zeilen, die Aufmerksamkeit brauchen. */
  emphasis?: "amber";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group block w-full px-5 py-4 text-left transition-colors duration-150 hover:bg-neutral-50",
        !first && "border-t border-neutral-100",
        emphasis === "amber" && "bg-amber-50/40 hover:bg-amber-50/70",
        "disabled:cursor-default disabled:hover:bg-transparent",
        className,
      )}
    >
      {children}
    </button>
  );
}

// ── Loading Rows ──────────────────────────────────────────────────────────
// Standardisierter Skeleton-Ladezustand für Listen (statt "Wird geladen…").

export function LoadingRows({ rows = 3, framed = false }: { rows?: number; framed?: boolean }) {
  const body = (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className={cn("flex items-center gap-4 px-5 py-4", i > 0 && "border-t border-neutral-100")}
        >
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="ml-auto h-3 w-16" />
          <Skeleton className="hidden h-3 w-24 sm:block" />
        </div>
      ))}
    </>
  );
  if (framed) {
    return <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">{body}</div>;
  }
  return <div>{body}</div>;
}

// ── Progress Bar ──────────────────────────────────────────────────────────
// Dünner, geteilter Fortschrittsbalken (siehe app/components/ui/premium.tsx),
// als Wrapper beibehalten, damit bestehende Imports (FaelleListe, FallDetail,
// ParteienListe, …) unverändert bleiben.

export function ProgressBar({ value }: { value: number }) {
  return <ThinProgressBar value={value} tone="accent" />;
}

// ── Empty State ───────────────────────────────────────────────────────────

export function EmptyState({
  icon,
  text,
  action,
}: {
  icon?: string;
  text: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/50 px-6 py-12 text-center">
      {icon && <div className="mb-3 text-3xl text-neutral-300">{icon}</div>}
      <p className="text-sm text-neutral-400">{text}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ── Invite Status Dot ─────────────────────────────────────────────────────

export function InviteStatusDot({ status }: { status: "accepted" | "pending" }) {
  return (
    <span
      title={status === "accepted" ? "Angenommen" : "Ausstehend"}
      className={cn(
        "inline-block h-2 w-2 rounded-full",
        status === "accepted" ? "bg-accent-500" : "bg-amber-400",
      )}
    />
  );
}
