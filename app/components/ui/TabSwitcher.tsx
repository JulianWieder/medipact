"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Standard pattern: tab switcher with crossfade content (ai.gov-style
 * "Executive Orders / Fact Sheets / Remarks / Articles" topic switcher).
 *
 * `TabSwitcher` renders the tab bar (active tab gets the accent box
 * outline). `CrossfadePanel` wraps whatever content belongs to the
 * active tab so it crossfades in/out on change — wrap a panel of text
 * AND a panel of media separately if both should crossfade
 * independently (see ThemenTabs.tsx for the two-panel example).
 *
 * Reuse these two together for any future "pick a topic, see it
 * change" section instead of re-implementing AnimatePresence wiring.
 */
export type Tab = { key: string; label: string };

export function TabSwitcher({
  tabs,
  activeIndex,
  onChange,
  ariaLabel,
}: {
  tabs: Tab[];
  activeIndex: number;
  onChange: (index: number) => void;
  ariaLabel: string;
}) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="mb-10 flex flex-wrap gap-2 sm:gap-3"
    >
      {tabs.map((t, i) => {
        const isActive = i === activeIndex;
        return (
          <button
            key={t.key}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(i)}
            className={`rounded-xl border px-5 py-3 text-sm font-semibold uppercase tracking-wide transition ${
              isActive
                ? "border-accent-500 bg-accent-50 text-accent-700"
                : "border-neutral-200 bg-white text-neutral-400 hover:border-neutral-300 hover:text-neutral-700"
            }`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

export function CrossfadePanel({
  activeKey,
  className = "",
  children,
}: {
  activeKey: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeKey}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -14 }}
        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
