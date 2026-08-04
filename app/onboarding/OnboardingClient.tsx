"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Icon from "@/app/components/ui/Icon";
import {
  OnboardingBlock,
  onboardingBlockLabel,
  type OnboardingBlock as Block,
} from "./OnboardingBlocks";
import { isBlockValueEmpty } from "@/app/workspace/blockTypes";

// ── Nutzer-Onboarding: der einmalige Durchlauf vor der Fallbearbeitung ───────
//
// Schritte und Blöcke kommen aus dem Workflow Manager (Pseudo-Typ "@user",
// Phase "onboarding") — hier ist NICHTS hartkodiert. Wer die Reihenfolge oder
// die Texte ändern will, tut das dort, nicht hier.
//
// Wiedereinstieg: Das Backend liefert `resume_step_key` — den ersten Schritt
// mit offenen Pflichtfeldern. Wer sich neu anmeldet, landet genau dort und
// nicht wieder bei Schritt 1. Bewusst ABGELEITET statt gespeichert: ein
// gespeicherter Stand kann auf einen inzwischen gelöschten Schritt zeigen,
// diese Rechnung nie.

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
  resume_step_key: string | null;
};

// Blocktypen, die eine Eingabe der Person erzeugen. Muss zu
// USER_INPUT_BLOCK_TYPES in services/onboarding.py passen — laufen die beiden
// auseinander, lässt die UI abschließen und der Server lehnt ab.
const INPUT_TYPES = new Set([
  "texteingabe",
  "frage",
  "auswahl",
  "skala",
  "ranking",
  "liste",
  "datum",
  "betrag",
  "zustimmung",
  "unterschrift",
  "datei_upload",
  "video_aufnahme",
  "vertrauliche_notiz",
  "stammdaten",
  "rechnungsdaten",
]);

function missingInStep(step: Step, values: Record<string, unknown>): Block[] {
  return (step.blocks ?? []).filter(
    (b) =>
      INPUT_TYPES.has(b.type) &&
      (b.config ?? {}).required === true &&
      isBlockValueEmpty(values[b.id]),
  );
}

export default function OnboardingClient({ userName }: { userName: string }) {
  const searchParams = useSearchParams();
  // Wohin nach dem Abschluss. Kommt aus der Middleware-Umleitung und trägt bei
  // Einladungslinks den ?token= mit — der darf hier nicht verloren gehen
  // (siehe project_invite_accept_fix: genau diese Kette war schon einmal
  // kaputt und Eingeladene landeten im leeren Dashboard).
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [steps, setSteps] = useState<Step[]>([]);
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [finishing, setFinishing] = useState(false);
  // Erst nach einem Klick auf „Weiter" die fehlenden Felder rot markieren –
  // ein leeres Formular soll nicht schon beim Öffnen anklagen.
  const [showErrors, setShowErrors] = useState(false);

  // Ausstehende Speicherungen: block_id -> Timer. Jede Änderung wird debounced
  // geschrieben, damit Tippen nicht jeden Anschlag zum Server schickt.
  const saveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const stepOfBlock = useRef<Record<string, { step_key: string; type: string }>>({});

  // ── Laden ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/onboarding/steps", { cache: "no-store" });
        if (!res.ok) {
          if (!cancelled) setError("Onboarding konnte nicht geladen werden.");
          return;
        }
        const data: StepsResponse = await res.json();
        if (cancelled) return;

        setSteps(data.steps ?? []);
        setValues(data.values ?? {});

        // Block-id -> Schritt merken, damit das Speichern den step_key kennt.
        const map: Record<string, { step_key: string; type: string }> = {};
        for (const s of data.steps ?? []) {
          for (const b of s.blocks ?? []) map[b.id] = { step_key: s.step_key, type: b.type };
        }
        stepOfBlock.current = map;

        // Wiedereinstieg: beim ersten unvollständigen Schritt aufsetzen.
        const resumeIdx = data.resume_step_key
          ? (data.steps ?? []).findIndex((s) => s.step_key === data.resume_step_key)
          : -1;
        setIndex(resumeIdx >= 0 ? resumeIdx : 0);
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

  // Beim Verlassen der Seite offene Timer aufräumen. Ohne das feuert ein
  // Timer nach dem Unmount und schreibt einen veralteten Wert.
  useEffect(() => {
    const timers = saveTimers.current;
    return () => {
      Object.values(timers).forEach(clearTimeout);
    };
  }, []);

  const saveBlock = useCallback(async (blockId: string, value: unknown) => {
    const meta = stepOfBlock.current[blockId];
    if (!meta) return;
    try {
      await fetch("/api/onboarding/responses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step_key: meta.step_key,
          block_id: blockId,
          block_type: meta.type,
          value,
        }),
      });
    } catch {
      // Still: der Wert steht im State und wird beim nächsten „Weiter"
      // ohnehin erneut geschrieben (flushStep). Ein Fehler-Toast pro Anschlag
      // wäre hier nur Lärm.
    }
  }, []);

  function setValue(blockId: string, value: unknown) {
    setValues((prev) => ({ ...prev, [blockId]: value }));
    clearTimeout(saveTimers.current[blockId]);
    saveTimers.current[blockId] = setTimeout(() => saveBlock(blockId, value), 600);
  }

  /** Alle offenen Timer des aktuellen Schritts sofort ausführen.
   *  Ohne das ginge die letzte Eingabe verloren, wenn direkt nach dem Tippen
   *  auf „Weiter" geklickt wird. */
  async function flushStep(step: Step) {
    const writes: Promise<void>[] = [];
    for (const b of step.blocks ?? []) {
      if (saveTimers.current[b.id]) {
        clearTimeout(saveTimers.current[b.id]);
        delete saveTimers.current[b.id];
        writes.push(saveBlock(b.id, values[b.id]));
      }
    }
    await Promise.all(writes);
  }

  const current = steps[index];
  const missing = useMemo(
    () => (current ? missingInStep(current, values) : []),
    [current, values],
  );
  const missingIds = useMemo(() => new Set(missing.map((b) => b.id)), [missing]);
  const isLast = index === steps.length - 1;

  async function next() {
    if (!current) return;
    if (missing.length > 0) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    await flushStep(current);
    if (!isLast) {
      setIndex((i) => i + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    await finish();
  }

  async function finish() {
    setFinishing(true);
    setError("");
    try {
      const res = await fetch("/api/onboarding/complete", { method: "POST" });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        // Das Backend nennt den Schritt mit der Lücke — dorthin springen,
        // statt nur „Fehler" anzuzeigen. Passiert z.B., wenn im Workflow
        // Manager währenddessen ein Pflichtblock dazukam.
        const detail = data?.detail;
        const resume = typeof detail === "object" ? detail?.resume_step_key : null;
        const idx = resume ? steps.findIndex((s) => s.step_key === resume) : -1;
        if (idx >= 0) {
          setIndex(idx);
          setShowErrors(true);
          setError("Hier fehlt noch eine Angabe.");
        } else {
          setError(
            typeof detail === "string" ? detail : "Onboarding konnte nicht abgeschlossen werden.",
          );
        }
        return;
      }
      // Volle Navigation statt router.push: die Middleware liest das
      // Session-Cookie. Der jwt-Callback in auth.ts holt den Onboarding-Stand
      // bei jedem Request neu, solange er noch nicht abgeschlossen ist — beim
      // nächsten echten Request steht das Flag also auf true und die Umleitung
      // greift nicht mehr. Ein router.push würde die Middleware umgehen und
      // ins Dashboard rendern, bevor das Cookie aktualisiert ist.
      window.location.href = callbackUrl;
    } catch {
      setError("Server nicht erreichbar.");
    } finally {
      setFinishing(false);
    }
  }

  // ── Darstellung ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <main className="app-shell">
        <section className="container flex min-h-[60vh] items-center justify-center py-20">
          <p className="text-sm text-neutral-500">Wird geladen …</p>
        </section>
      </main>
    );
  }

  if (steps.length === 0) {
    // Kein Schritt konfiguriert. Hier bewusst NICHTS hartkodiert anzeigen —
    // sonst sieht ein leeres Onboarding aus wie ein fest verdrahtetes.
    return (
      <main className="app-shell">
        <section className="container max-w-xl py-20">
          <h1 className="heading-2 text-neutral-900">Nichts zu tun</h1>
          <p className="mt-3 text-neutral-600">
            Für das Onboarding sind derzeit keine Schritte hinterlegt. Sie werden im
            Workflow Manager unter „Nutzer-Onboarding" gepflegt.
          </p>
          <button onClick={finish} disabled={finishing} className="btn btn-primary mt-6">
            Weiter zum Dashboard →
          </button>
          {error && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <section className="container max-w-2xl py-12">
        <p className="eyebrow mb-3">Einmalige Einrichtung</p>
        <h1 className="heading-2 text-neutral-900">
          {userName ? `Willkommen, ${userName.split(" ")[0]}` : "Willkommen"}
        </h1>
        <p className="mt-3 max-w-xl text-neutral-600">
          Bevor es losgeht, ein paar Angaben. Das machst du genau einmal – in deinen
          Verfahren wirst du danach nicht mehr danach gefragt.
        </p>

        {/* Fortschritt */}
        <div className="mt-8 flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s.step_key} className="flex flex-1 items-center gap-2">
              <div
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i < index ? "bg-accent-400" : i === index ? "bg-accent-500" : "bg-neutral-200"
                }`}
              />
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs font-semibold text-neutral-400">
          Schritt {index + 1} von {steps.length}
        </p>

        {/* Aktueller Schritt */}
        <div className="mt-6 rounded-3xl border border-neutral-200 bg-white p-7">
          <h2 className="text-xl font-bold text-neutral-900">{current.title}</h2>
          {current.description && (
            <p className="mt-2 text-[15px] leading-relaxed text-neutral-600">
              {current.description}
            </p>
          )}

          <div className="mt-6 space-y-6">
            {(current.blocks ?? []).map((block) => (
              <OnboardingBlock
                key={block.id}
                block={block}
                value={values[block.id]}
                onChange={(v) => setValue(block.id, v)}
                invalid={showErrors && missingIds.has(block.id)}
              />
            ))}
          </div>

          {showErrors && missing.length > 0 && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-700">
                Bitte noch ausfüllen:
              </p>
              <ul className="mt-1 list-inside list-disc text-sm text-red-700">
                {missing.map((b) => (
                  <li key={b.id}>{onboardingBlockLabel(b)}</li>
                ))}
              </ul>
            </div>
          )}

          {error && <p className="mt-4 text-sm font-semibold text-red-600">{error}</p>}

          <div className="mt-7 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                setShowErrors(false);
                setIndex((i) => Math.max(0, i - 1));
              }}
              disabled={index === 0}
              className="btn btn-ghost text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← Zurück
            </button>
            <button
              type="button"
              onClick={next}
              disabled={finishing}
              className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              {finishing ? "Wird gespeichert …" : isLast ? "Fertig – los geht's" : "Weiter →"}
            </button>
          </div>
        </div>

        <p className="mt-4 flex items-center gap-2 text-xs text-neutral-400">
          <Icon name="lock" size={13} color="currentColor" />
          Deine Eingaben werden sofort gespeichert – du kannst jederzeit abbrechen und
          später weitermachen.
        </p>
      </section>
    </main>
  );
}
