// ── Premium UI-Bausteine ────────────────────────────────────────────────────
// Geteilte, wiederverwendbare Komponenten im "Mercedes-Benz / Apple"-Stil:
// dunkle Glas-/Chrome-Heroes, dünne Trennlinien statt schwerer Borders,
// zurückhaltende Akzentfarbe, ruhige Serif-Display-Typografie.
//
// Wird sowohl vom Kunden-Dashboard (app/dashboard) als auch vom internen
// Workspace (app/workspace) verwendet, damit beide Bereiche optisch
// konsistent bleiben und Styling nicht doppelt gepflegt werden muss.

"use client";

import React from "react";
import Link from "next/link";

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

// ── Stat-Eintrag (für Hero-Statistikzeile) ──────────────────────────────────

export interface StatItem {
  label: string;
  value: React.ReactNode;
  sub?: string;
  /** Hebt den Wert in Akzentfarbe hervor (z.B. "wartet auf dich"). */
  highlight?: boolean;
  /** Macht die Kachel klickbar, z.B. um eine Liste zu filtern. */
  onClick?: () => void;
  /** Markiert die Kachel als aktiv (z.B. aktiver Filter). */
  active?: boolean;
}

function StatTile({ label, value, sub, highlight, onClick, active }: StatItem) {
  const content = (
    <>
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
        {label}
      </p>
      <p
        className={cn(
          "mt-3 font-display text-4xl font-medium tracking-tight lg:text-5xl",
          highlight || active ? "text-accent-300" : "text-white",
        )}
      >
        {value}
      </p>
      {sub && <p className="mt-2 text-sm font-light text-neutral-400">{sub}</p>}
    </>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="relative text-left transition-opacity duration-300 hover:opacity-80">
        {content}
        <span
          className={cn(
            "absolute -bottom-3 left-0 h-px w-8 bg-accent-300 transition-opacity duration-300",
            active ? "opacity-100" : "opacity-0",
          )}
        />
      </button>
    );
  }

  return <div className="relative">{content}</div>;
}

// ── PremiumHero ──────────────────────────────────────────────────────────────
// variant="bleed": volle Bildschirmbreite (öffentliches Dashboard, außerhalb von .container)
// variant="card":  abgerundete dunkle Karte (eingebettet in ein gepolstertes Panel, z.B. Workspace)

export function PremiumHero({
  eyebrow,
  title,
  subtitle,
  action,
  stats,
  variant = "card",
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  stats?: StatItem[];
  variant?: "card" | "bleed";
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-neutral-900 text-white",
        variant === "bleed" ? "" : "rounded-3xl",
      )}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(60% 50% at 15% 0%, rgba(255,255,255,0.08) 0%, transparent 70%), radial-gradient(50% 40% at 100% 100%, rgba(94,234,212,0.10) 0%, transparent 70%), linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
        }}
      />
      <div
        className={cn(
          "relative",
          variant === "bleed" ? "container py-16 lg:py-24" : "p-6 sm:p-8 lg:p-10",
        )}
      >
        <div
          className={cn(
            "flex flex-col justify-between gap-8",
            variant === "bleed" ? "md:flex-row md:items-end gap-10" : "sm:flex-row sm:items-end",
          )}
        >
          <div>
            <p className="eyebrow mb-4 text-accent-300 [&::before]:bg-accent-300/60">{eyebrow}</p>
            <h1
              className={cn(
                "font-display font-medium tracking-tight text-white",
                variant === "bleed" ? "text-4xl sm:text-5xl lg:text-6xl" : "text-2xl sm:text-3xl",
              )}
              style={{ letterSpacing: "-0.02em" }}
            >
              {title}
            </h1>
            {subtitle && (
              <p className="mt-4 max-w-xl text-base font-light text-neutral-300">{subtitle}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>

        {stats && stats.length > 0 && (
          <div
            className={cn(
              "grid grid-cols-2 gap-x-8 gap-y-10 border-t border-white/10 pt-10",
              variant === "bleed" ? "lg:grid-cols-4 mt-14" : "lg:grid-cols-4 mt-8",
            )}
          >
            {stats.map((item) => (
              <StatTile key={item.label} {...item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ── PillButton ────────────────────────────────────────────────────────────
// Primärer abgerundeter Button im Premium-Stil. `tone="light"` für dunkle
// Hintergründe (weißer Button), `tone="dark"` für helle Hintergründe.

export function PillButton({
  href,
  onClick,
  disabled,
  tone = "dark",
  children,
  className,
}: {
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  tone?: "dark" | "light";
  children: React.ReactNode;
  className?: string;
}) {
  const classes = cn(
    "group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50",
    tone === "light"
      ? "bg-white text-neutral-900 hover:bg-accent-300 hover:shadow-[0_0_30px_-5px_rgba(94,234,212,0.5)]"
      : "bg-neutral-900 text-white hover:bg-accent-600",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}

// ── ArrowLink ─────────────────────────────────────────────────────────────
// Dezenter Text-Link mit Pfeil, der beim Hover wandert. Ersetzt gefüllte
// Buttons für sekundäre Aktionen innerhalb von Karten (Apple-Stil).

export function ArrowLink({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-neutral-900 transition-colors duration-300 group-hover:text-accent-600",
        className,
      )}
    >
      {children}
      <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
    </span>
  );
}

// ── ThinProgressBar ───────────────────────────────────────────────────────
// 1px-Fortschrittsbalken in Monochrom (Standard) oder Akzentfarbe.

export function ThinProgressBar({
  value,
  tone = "dark",
}: {
  value: number;
  tone?: "dark" | "accent";
}) {
  return (
    <div className="h-1 overflow-hidden rounded-full bg-neutral-200">
      <div
        className={cn(
          "h-full rounded-full transition-all duration-500",
          tone === "accent" ? "bg-accent-500" : "bg-neutral-900",
        )}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

// ── OutlinePill ───────────────────────────────────────────────────────────
// Generische Status-/Typ-Pille mit Outline-Stil statt voller Fläche.

export function OutlinePill({
  label,
  className,
  dot,
}: {
  label: React.ReactNode;
  className?: string;
  dot?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide",
        className,
      )}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", dot)} />}
      {label}
    </span>
  );
}

// ── PremiumCard ───────────────────────────────────────────────────────────
// Hairline-Karte mit dezentem Hover-Lift, für klickbare Listeneinträge
// (Fallkarten, Einladungen, etc.) in Dashboard & Workspace.

export function PremiumCard({
  href,
  children,
  className,
  emphasis = "neutral",
}: {
  href?: string;
  children: React.ReactNode;
  className?: string;
  emphasis?: "neutral" | "amber";
}) {
  const classes = cn(
    "group block rounded-2xl border bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-20px_rgba(15,23,42,0.18)] lg:p-8",
    emphasis === "amber" ? "border-amber-200 hover:border-amber-300" : "border-neutral-200 hover:border-neutral-300",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return <div className={classes}>{children}</div>;
}
