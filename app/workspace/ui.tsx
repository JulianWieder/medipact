// Shared UI-Bausteine für den Workspace – nutzen das medipact Design-System
// und die app-weit geteilten Premium-Komponenten aus app/components/ui/premium.tsx,
// damit Workspace und das öffentliche Dashboard optisch konsistent bleiben.

import React from "react";
import { STATUS_CONFIG, TYPE_LABEL, TYPE_COLOR, ROLE_LABEL, INVOICE_STATUS_CONFIG } from "./types";
import { OutlinePill, ThinProgressBar } from "@/app/components/ui/premium";

// ── Utilities ─────────────────────────────────────────────────────────────

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

// ── Status Badge ──────────────────────────────────────────────────────────

export function StatusBadge({ status }: { status: string | null | undefined }) {
  const cfg = STATUS_CONFIG[status ?? "draft"] ?? STATUS_CONFIG.draft;
  return <OutlinePill label={cfg.label} className={cfg.badge} dot={cfg.dot} />;
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
  return <OutlinePill label={cfg.label} className={cfg.badge} dot={cfg.dot} />;
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
          "mt-2.5 font-display text-2xl font-medium tracking-tight",
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
        className="relative w-full rounded-2xl border border-neutral-200 bg-white/60 p-4 text-left transition-colors duration-300 hover:border-neutral-300"
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
