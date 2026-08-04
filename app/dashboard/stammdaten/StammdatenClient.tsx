"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Icon from "@/app/components/ui/Icon";
import {
  OnboardingBlock,
  type OnboardingBlock as Block,
} from "@/app/onboarding/OnboardingBlocks";

// ── Stammdaten: die eigenen Angaben aus dem Nutzer-Onboarding ───────────────
//
// Aufrufbar über das Nutzermenü oben rechts. Zeigt dieselben Schritte und
// Blöcke wie /onboarding, nur ohne Strecken-Führung: alles auf einer Seite,
// jederzeit änderbar.
//
// Bewusst derselbe Renderer (OnboardingBlocks) statt eines eigenen Formulars —
// sonst müsste jede Änderung im Workflow Manager an zwei Stellen nachgezogen
// werden, und die zweite würde vergessen.

type Step = {
  id: number;
  step_key: string;
  title: string;
  description: string;
  blocks: Block[];
};

type StepsResponse = {
  steps: Step[];
  values: Record<string, unknown>;
  completed: boolean;
  completed_at: string | null;
};

export default function StammdatenClient({ email }: { email: string }) {
  const [steps, setSteps] = useState<Step[]>([]);
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [completedAt, setCompletedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Kurze Bestätigung nach dem Speichern – ohne die wirkt das Auto-Speichern,
  // als würde nichts passieren.
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const saveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const blockMeta = useRef<Record<string, { step_key: string; type: string }>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/onboarding/steps", { cache: "no-store" });
        if (!res.ok) {
          if (!cancelled) setError("Stammdaten konnten nicht geladen werden.");
          return;
        }
        const data: StepsResponse = await res.json();
        if (cancelled) return;
        setSteps(data.steps ?? []);
        setValues(data.values ?? {});
        setCompletedAt(data.completed_at ?? null);
        const map: Record<string, { step_key: string; type: string }> = {};
        for (const s of data.steps ?? []) {
          for (const b of s.blocks ?? []) map[b.id] = { step_key: s.step_key, type: b.type };
        }
        blockMeta.current = map;
      } catch {
        if (!cancelled) setError("Server nicht erreichbar.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const timers = saveTimers.current;
    return () => {
      Object.values(timers).forEach(clearTimeout);
    };
  }, []);

  function setValue(blockId: string, value: unknown) {
    setValues((prev) => ({ ...prev, [blockId]: value }));
    clearTimeout(saveTimers.current[blockId]);
    saveTimers.current[blockId] = setTimeout(async () => {
      const meta = blockMeta.current[blockId];
      if (!meta) return;
      try {
        const res = await fetch("/api/onboarding/responses", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            step_key: meta.step_key,
            block_id: blockId,
            block_type: meta.type,
            value,
          }),
        });
        if (res.ok) setSavedAt(Date.now());
        else setError("Änderung konnte nicht gespeichert werden.");
      } catch {
        setError("Server nicht erreichbar.");
      }
    }, 700);
  }

  const completedLabel = useMemo(() => {
    if (!completedAt) return null;
    try {
      return new Date(completedAt).toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch {
      return null;
    }
  }, [completedAt]);

  if (loading) {
    return (
      <main className="app-shell pt-[73px]">
        <section className="container py-12">
          <p className="text-sm text-neutral-500">Wird geladen …</p>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell pt-[73px]">
      <section className="container max-w-2xl py-12">
        <p className="eyebrow mb-3">Dein Konto</p>
        <h1 className="heading-2 text-neutral-900">Stammdaten</h1>
        <p className="mt-3 max-w-xl text-neutral-600">
          Diese Angaben gelten für alle deine Verfahren. Änderungen werden sofort
          gespeichert und wirken ab dem nächsten Fall – bereits erstellte Rechnungen
          bleiben unverändert.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
          <span className="rounded-full bg-neutral-100 px-4 py-2 font-semibold text-neutral-600">
            {email}
          </span>
          {completedLabel && (
            <span className="rounded-full bg-accent-50 px-4 py-2 font-semibold text-accent-700">
              Einrichtung abgeschlossen am {completedLabel}
            </span>
          )}
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-semibold text-red-700">{error}</p>
          </div>
        )}

        {steps.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-neutral-200 bg-white p-7">
            <p className="text-sm text-neutral-600">
              Es sind keine Stammdaten-Felder hinterlegt. Sie werden im Workflow Manager
              unter „Nutzer-Onboarding" gepflegt.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            {steps.map((step) => {
              // Reine Anzeige-Blöcke (Erklärtexte, Akkordeons) gehören in die
              // Onboarding-Strecke, nicht in eine Stammdaten-Ansicht – hier
              // will man seine Werte sehen und ändern, nicht nochmal lesen.
              const editable = (step.blocks ?? []).filter(
                (b) => !DISPLAY_ONLY.has(b.type),
              );
              if (editable.length === 0) return null;
              return (
                <div key={step.step_key} className="rounded-3xl border border-neutral-200 bg-white p-7">
                  <h2 className="text-lg font-bold text-neutral-900">{step.title}</h2>
                  <div className="mt-5 space-y-6">
                    {editable.map((block) => (
                      <OnboardingBlock
                        key={block.id}
                        block={block}
                        value={values[block.id]}
                        onChange={(v) => setValue(block.id, v)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-xs text-neutral-400">
            <Icon name="lock" size={13} color="currentColor" />
            {savedAt ? "Gespeichert" : "Änderungen werden automatisch gespeichert"}
          </p>
          <Link href="/dashboard" className="btn btn-ghost text-sm">
            ← Zurück zum Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}

/** Blocktypen ohne Eingabe – in der Stammdaten-Ansicht ausgeblendet. */
const DISPLAY_ONLY = new Set(["textausgabe", "akkordeon", "hinweis", "bild", "video", "gate"]);
