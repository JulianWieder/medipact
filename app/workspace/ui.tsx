// Shared UI-Bausteine für den Workspace – nutzen das medipact Design-System

import React from "react";
import { STATUS_CONFIG, TYPE_LABEL, TYPE_COLOR, ROLE_LABEL, INVOICE_STATUS_CONFIG } from "./types";

// ── Utilities ─────────────────────────────────────────────────────────────

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

// ── Status Badge ──────────────────────────────────────────────────────────

export function StatusBadge({ status }: { status: string | null | undefined }) {
  const cfg = STATUS_CONFIG[status ?? "draft"] ?? STATUS_CONFIG.draft;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        cfg.badge,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
      {cfg.label}
    </span>
  );
}

// ── Type Badge ────────────────────────────────────────────────────────────

export function TypeBadge({ type }: { type: string | null | undefined }) {
  const color = TYPE_COLOR[type ?? "nachbarschaft"] ?? TYPE_COLOR.nachbarschaft;
  const label = TYPE_LABEL[type ?? ""] ?? (type ?? "–");
  return (
    <span
      className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold", color)}
    >
      {label}
    </span>
  );
}

// ── Invoice Status Badge ──────────────────────────────────────────────────

export function InvoiceStatusBadge({ status }: { status: string | null | undefined }) {
  const cfg = INVOICE_STATUS_CONFIG[status ?? "open"] ?? INVOICE_STATUS_CONFIG.open;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        cfg.badge,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
      {cfg.label}
    </span>
  );
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
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white/60 p-4">
      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">{label}</div>
      <div className="mt-2 text-2xl font-bold tracking-tight text-neutral-900">{value}</div>
      {sub && <div className="mt-1 text-xs text-neutral-500">{sub}</div>}
    </div>
  );
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

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200">
      <div
        className="h-full rounded-full bg-accent-500 transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
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
