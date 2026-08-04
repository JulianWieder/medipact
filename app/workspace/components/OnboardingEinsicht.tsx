"use client";

import { useEffect, useState } from "react";
import { WCard, SectionHeader, EmptyState } from "../ui";
import { onboardingValueText, onboardingBlockLabel } from "@/app/onboarding/OnboardingBlocks";
import type { OnboardingBlock } from "@/app/onboarding/OnboardingBlocks";

// ── Onboarding-Stand einer Person ───────────────────────────────────────────
//
// Eine Komponente für beide Einsichts-Orte: den Admin-Benutzermanager (alle
// Nutzer) und die Partei-Detailansicht des Mediators (nur Personen aus seinen
// eigenen Fällen). Wer was sehen darf, entscheidet ausschließlich das Backend
// (GET /onboarding/users/{id}) — hier bewusst KEINE zweite Rechteprüfung, die
// mit der ersten auseinanderlaufen könnte.
//
// Dargestellt wird schreibgeschützt: Stammdaten gehören der Person. Wer sie
// ändern will, tut das selbst unter /dashboard/stammdaten.

type Step = {
  step_key: string;
  title: string;
  blocks: OnboardingBlock[];
};

type OnboardingDetail = {
  user_id: number;
  name: string;
  email: string;
  completed: boolean;
  completed_at: string | null;
  open_count: number;
  profile: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    street?: string | null;
    postal_code?: string | null;
    city?: string | null;
  };
  steps: Step[];
  values: Record<string, unknown>;
};

/** Blocktypen ohne Eingabe – in einer Einsicht uninteressant. */
const DISPLAY_ONLY = new Set(["textausgabe", "akkordeon", "hinweis", "bild", "video", "gate"]);

export function OnboardingEinsicht({ userId }: { userId: number | null | undefined }) {
  const [data, setData] = useState<OnboardingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (userId == null) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError("");
    (async () => {
      try {
        const res = await fetch(`/api/onboarding/users/${userId}`, { cache: "no-store" });
        if (!res.ok) {
          if (!cancelled) {
            // 403 heißt hier nicht "kaputt", sondern "diese Person gehört nicht
            // zu deinen Fällen" – das gehört klar benannt, sonst sieht es aus
            // wie ein Ladefehler.
            setError(
              res.status === 403
                ? "Kein Einblick – diese Person ist in keinem deiner Fälle."
                : "Onboarding-Stand konnte nicht geladen werden.",
            );
          }
          return;
        }
        const json: OnboardingDetail = await res.json();
        if (!cancelled) setData(json);
      } catch {
        if (!cancelled) setError("Server nicht erreichbar.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (userId == null) {
    return (
      <WCard className="p-5">
        <SectionHeader label="Onboarding" title="Einrichtung der Person" />
        <EmptyState icon="◉" text="Noch kein Konto – die Einladung ist offen." />
      </WCard>
    );
  }

  return (
    <WCard className="p-5">
      <SectionHeader label="Onboarding" title="Einrichtung der Person" />

      {loading ? (
        <p className="text-sm italic text-neutral-400">Wird geladen…</p>
      ) : error ? (
        <p className="text-sm text-neutral-500">{error}</p>
      ) : !data ? (
        <EmptyState icon="◉" text="Keine Daten." />
      ) : (
        <div className="space-y-4">
          {/* Status */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                data.completed
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {data.completed ? "Abgeschlossen" : "Offen"}
            </span>
            {!data.completed && data.open_count > 0 && (
              <span className="text-xs text-neutral-500">
                {data.open_count} Pflichtangabe{data.open_count === 1 ? "" : "n"} fehlt noch
              </span>
            )}
            {data.completed_at && (
              <span className="text-xs text-neutral-400">
                {new Date(data.completed_at).toLocaleDateString("de-DE")}
              </span>
            )}
          </div>

          {/* Stammdaten aus dem Profil. Bewusst getrennt von den Block-Antworten:
              diese Felder werden serverseitig gespiegelt und bleiben lesbar,
              auch wenn der zugehörige Block aus der Vorlage entfernt wurde. */}
          <div className="grid grid-cols-1 gap-3 rounded-xl bg-neutral-50/70 p-4 sm:grid-cols-2">
            <Field label="Name" value={data.profile.name} />
            <Field label="E-Mail" value={data.profile.email} />
            <Field label="Telefon" value={data.profile.phone} />
            <Field
              label="Rechnungsanschrift"
              value={
                [data.profile.street, [data.profile.postal_code, data.profile.city]
                  .filter(Boolean)
                  .join(" ")]
                  .filter((s) => (s ?? "").toString().trim())
                  .join(", ") || null
              }
            />
          </div>

          {/* Weitere Antworten */}
          {data.steps.map((step) => {
            const rows = (step.blocks ?? []).filter(
              (b) => !DISPLAY_ONLY.has(b.type) && !PROFILE_BLOCKS.has(b.type),
            );
            if (rows.length === 0) return null;
            return (
              <div key={step.step_key}>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">
                  {step.title}
                </p>
                <div className="space-y-2">
                  {rows.map((block) => (
                    <div
                      key={block.id}
                      className="flex items-start justify-between gap-4 rounded-lg border border-neutral-100 px-3 py-2"
                    >
                      <span className="text-xs text-neutral-500">
                        {onboardingBlockLabel(block)}
                      </span>
                      <span className="shrink-0 text-right text-sm font-medium text-neutral-800">
                        {onboardingValueText(data.values[block.id])}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </WCard>
  );
}

/** Blöcke, deren Werte oben schon als Stammdaten stehen – nicht doppelt zeigen. */
const PROFILE_BLOCKS = new Set(["stammdaten", "rechnungsdaten"]);

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">
        {label}
      </div>
      <div className="text-sm text-neutral-700">{value?.trim() ? value : "—"}</div>
    </div>
  );
}
