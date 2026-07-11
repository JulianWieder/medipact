"use client";

// ── Der Start als Show: Vollbild-Onboarding aus WorkflowManager-Blöcken ─────
//
// Ersetzt den alten, hardcodierten NewMediationWizard. Die Inhalte kommen aus
// dem WorkflowManager: Phase "einladung" (Onboarding), Schritt "start_intake"
// (Seed-Migration l5b6c7d8e9f0) – dort im Designer voll editierbar.
//
// Dramaturgie: Cold Open (textausgabe mit config.title) → Arbeitsbündnis
// (zustimmung) → Kapitel-Zwischentitel (textausgabe) → EINE Frage pro Screen
// (frage/datum/auswahl/skala/…) → Finale: KI tauft den Fall (Titel), Paketwahl.
//
// Antworten werden pro Block als block_responses gespeichert (Auswertung!).
// Block-config-Konventionen: map_to="description"|"priority" fließt in
// mediation.description/priority; title bei textausgabe = große Überschrift.
//
// Fallback: Ist der start_intake-Schritt (noch) nicht vorhanden, werden die
// alten config.formFields client-seitig in äquivalente Blöcke übersetzt –
// der Flow bricht nie.

import { encodeId } from "@/lib/ids";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { NewMediationConfig } from "@/lib/mediation-types/types";

interface Props {
  config: NewMediationConfig;
}

interface FlowBlock {
  id: string;
  type: string;
  config: Record<string, unknown>;
}

type Screen =
  | { kind: "story"; blocks: FlowBlock[]; isIntro: boolean }
  | { kind: "input"; block: FlowBlock }
  | { kind: "title" }
  | { kind: "package" };

const INPUT_TYPES = new Set([
  "frage", "texteingabe", "auswahl", "skala", "liste",
  "zustimmung", "datum", "betrag", "ranking",
]);
const STORY_TYPES = new Set(["textausgabe", "hinweis", "akkordeon"]);

function cfgStr(c: Record<string, unknown>, k: string): string {
  const v = c?.[k];
  return typeof v === "string" ? v : "";
}
function cfgNum(c: Record<string, unknown>, k: string, fb: number): number {
  const v = c?.[k];
  return typeof v === "number" && !Number.isNaN(v) ? v : fb;
}
function cfgArr(c: Record<string, unknown>, k: string): string[] {
  const v = c?.[k];
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

/** Alte formFields → Blöcke (Fallback, solange start_intake nicht deployed ist). */
function blocksFromLegacy(config: NewMediationConfig): FlowBlock[] {
  const blocks: FlowBlock[] = [
    {
      id: "legacy_intro",
      type: "textausgabe",
      config: {
        title: "Schön, dass Sie da sind.",
        text:
          "Die nächsten Minuten gehören Ihrer Situation: ein Gespräch, keine " +
          "Formular-Batterie. Alles, was Sie schreiben, bleibt vertraulich.",
      },
    },
  ];
  config.formFields.forEach((f, i) => {
    if (f.type === "date") {
      blocks.push({ id: `legacy_${f.id}`, type: "datum", config: { label: f.label } });
    } else {
      blocks.push({
        id: `legacy_${f.id}`,
        type: "frage",
        config: {
          prompt: f.label,
          placeholder: f.placeholder ?? "",
          map_to: f.mapTo === "priority" ? "priority" : i === 0 ? "description" : undefined,
        },
      });
    }
  });
  return blocks;
}

function buildScreens(blocks: FlowBlock[]): Screen[] {
  const screens: Screen[] = [];
  let story: FlowBlock[] = [];
  const flushStory = () => {
    if (story.length) {
      screens.push({ kind: "story", blocks: story, isIntro: screens.length === 0 });
      story = [];
    }
  };
  for (const b of blocks) {
    if (STORY_TYPES.has(b.type)) {
      story.push(b);
    } else if (INPUT_TYPES.has(b.type)) {
      flushStory();
      screens.push({ kind: "input", block: b });
    }
    // andere Typen (video, ki_*, …) im Start-Flow tolerant überspringen
  }
  flushStory();
  screens.push({ kind: "title" }, { kind: "package" });
  return screens;
}

export default function StartFlowClient({ config }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mediationId = searchParams.get("mediationId");

  const [blocks, setBlocks] = useState<FlowBlock[] | null>(null);
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [idx, setIdx] = useState(0);
  const [title, setTitle] = useState("");
  const [titleGenerating, setTitleGenerating] = useState(false);
  const [packages, setPackages] = useState<{ key: string; label: string; price_eur: number }[]>([]);
  const [selectedPackage, setSelectedPackage] = useState("online");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const titleRequested = useRef(false);

  // ── Inhalte laden: start_intake-Blöcke + bereits gespeicherte Antworten ──
  useEffect(() => {
    if (!mediationId) return;
    let cancelled = false;
    (async () => {
      let loaded: FlowBlock[] | null = null;
      let stepKey = "start_intake";
      try {
        const res = await fetch(
          `/api/mediations/${mediationId}/phase-steps?phase=einladung`,
          { cache: "no-store" },
        );
        if (res.ok) {
          const data = await res.json();
          const step = (data.steps ?? []).find(
            (s: { key?: string; blocks?: unknown[] }) =>
              s.key === "start_intake" && Array.isArray(s.blocks) && s.blocks.length,
          );
          if (step) loaded = step.blocks as FlowBlock[];
        }
      } catch { /* Fallback unten */ }
      if (!loaded) {
        loaded = blocksFromLegacy(config);
        stepKey = "start_intake";
      }
      if (cancelled) return;
      setBlocks(loaded);
      try {
        const res = await fetch(
          `/api/mediations/${mediationId}/block-responses?phase=einladung&step_key=${stepKey}`,
          { cache: "no-store" },
        );
        if (res.ok) {
          const rows: { block_id: string; value: unknown }[] = await res.json();
          if (!cancelled && Array.isArray(rows)) {
            const map: Record<string, unknown> = {};
            for (const r of rows) map[r.block_id] = r.value;
            setValues((v) => ({ ...map, ...v }));
          }
        }
      } catch { /* Antworten sind optional */ }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediationId]);

  // ── Pakete (Preis je Typ × Paket) ──
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/mediations/packages/${config.type}`, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const pkgs = data.packages ?? [];
        setPackages(pkgs);
        if (pkgs.length && !pkgs.some((p: { key: string }) => p.key === selectedPackage)) {
          setSelectedPackage(pkgs[0].key);
        }
      } catch { /* Default bleibt */ }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.type]);

  const screens = useMemo(() => (blocks ? buildScreens(blocks) : []), [blocks]);
  const screen = screens[idx];
  const inputScreens = useMemo(
    () => screens.filter((s) => s.kind === "input").length,
    [screens],
  );
  const answeredInputs = useMemo(() => {
    let n = 0;
    for (let i = 0; i < idx && i < screens.length; i++) {
      if (screens[i].kind === "input") n++;
    }
    return n;
  }, [screens, idx]);
  const progress = screens.length
    ? Math.min(100, Math.round(((idx + 1) / screens.length) * 100))
    : 0;

  // ── Antwort eines Blocks speichern (block_responses) ──
  const persist = useCallback(
    (block: FlowBlock, value: unknown) => {
      if (!mediationId) return;
      fetch(`/api/mediations/${mediationId}/block-responses`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phase: "einladung",
          step_key: "start_intake",
          block_id: block.id,
          block_type: block.type,
          value,
          submitted: true,
        }),
      }).catch(() => { /* nicht blockieren – Wert bleibt im State */ });
    },
    [mediationId],
  );

  const setVal = useCallback((block: FlowBlock, value: unknown) => {
    setValues((v) => ({ ...v, [block.id]: value }));
  }, []);

  // ── Beschreibung/Priorität aus den Antworten ableiten ──
  const derived = useMemo(() => {
    if (!blocks) return { description: "", priority: "" };
    const parts: string[] = [];
    let priority = "";
    for (const b of blocks) {
      const v = values[b.id];
      const mapTo = cfgStr(b.config, "map_to");
      if (mapTo === "priority") {
        if (typeof v === "string") priority = v;
        continue;
      }
      if (v === undefined || v === null || v === "") continue;
      const label = cfgStr(b.config, "prompt") || cfgStr(b.config, "label");
      if (b.type === "zustimmung") continue;
      let out = "";
      if (typeof v === "string") out = v;
      else if (typeof v === "number") out = String(v);
      else if (Array.isArray(v)) out = v.join(", ");
      if (!out.trim()) continue;
      if (mapTo === "description") parts.unshift(out);
      else parts.push(label ? `${label} ${out}` : out);
    }
    return { description: parts.join(" | "), priority };
  }, [blocks, values]);

  // ── KI-Titel, sobald der Titel-Screen erreicht wird ──
  useEffect(() => {
    if (screen?.kind !== "title" || title.trim() || titleRequested.current) return;
    const basis = derived.description.trim();
    if (!basis) return;
    titleRequested.current = true;
    setTitleGenerating(true);
    (async () => {
      try {
        const res = await fetch("/api/mediations/generate-title", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description: basis, mediation_type: config.type }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.title) setTitle(data.title);
        }
      } catch { /* Titel bleibt manuell */ } finally {
        setTitleGenerating(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen?.kind, derived.description]);

  const next = useCallback(() => {
    if (screen?.kind === "input") persist(screen.block, values[screen.block.id]);
    setIdx((i) => Math.min(i + 1, screens.length - 1));
  }, [screen, values, persist, screens.length]);

  const back = useCallback(() => setIdx((i) => Math.max(i - 1, 0)), []);

  // ── Abschluss: Fall aktualisieren, Vorhang auf ──
  const finish = useCallback(async () => {
    if (!mediationId) {
      setError("Keine Mediations-ID gefunden.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/mediations/${mediationId}/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim() || undefined,
          description: derived.description || undefined,
          priority: derived.priority || undefined,
          package: selectedPackage || undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        setError(err?.error ?? `Fehler (${res.status})`);
        return;
      }
      router.push(`/dashboard/${encodeId(Number(mediationId))}`);
    } catch {
      setError("Server nicht erreichbar.");
    } finally {
      setSaving(false);
    }
  }, [mediationId, title, derived, selectedPackage, router]);

  // ── Enter = weiter (außer in Textareas: Cmd/Ctrl+Enter) ──
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Enter") return;
      const el = e.target as HTMLElement | null;
      if (el && el.tagName === "TEXTAREA" && !(e.metaKey || e.ctrlKey)) return;
      if (!screen) return;
      if (screen.kind === "title" || screen.kind === "package") return;
      if (screen.kind === "input" && !canAdvance(screen.block, values[screen.block.id])) return;
      e.preventDefault();
      next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [screen, values, next]);

  if (!mediationId) {
    return (
      <main className="app-shell flex min-h-screen items-center justify-center pt-[73px]">
        <div className="app-surface max-w-md border border-neutral-200 p-8 text-center">
          <p className="text-neutral-700">Keine Mediations-ID gefunden.</p>
          <Link href="/dashboard/mediation/new" className="btn btn-primary mt-4">Zur Auswahl</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="fixed inset-0 z-40 flex flex-col overflow-hidden bg-gradient-to-b from-white via-accent-50/40 to-white">
      <style>{`
        @keyframes sfIn { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
        .sf-in { animation: sfIn .45s cubic-bezier(.22,.8,.36,1) both; }
        .sf-in-slow { animation: sfIn .8s cubic-bezier(.22,.8,.36,1) both; }
      `}</style>

      {/* Fortschritt */}
      <div className="h-1 w-full bg-neutral-100">
        <div
          className="h-full bg-accent-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Kopfzeile */}
      <div className="flex items-center justify-between px-5 py-4 sm:px-8">
        <button
          onClick={back}
          disabled={idx === 0}
          className="btn btn-ghost text-sm disabled:invisible"
        >
          ← Zurück
        </button>
        <p className="eyebrow">{config.title}</p>
        <Link href="/dashboard/mediation/new" className="btn btn-ghost text-sm">
          Speichern &amp; schließen
        </Link>
      </div>

      {/* Bühne */}
      <div className="flex flex-1 items-center justify-center overflow-y-auto px-5 pb-10 sm:px-8">
        {!blocks ? (
          <p className="text-neutral-400">Ihr Start wird vorbereitet …</p>
        ) : screen ? (
          <div key={idx} className="sf-in w-full max-w-2xl">
            {renderScreen(screen)}
          </div>
        ) : null}
      </div>

      {error && (
        <div className="mx-auto mb-6 max-w-2xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
    </main>
  );

  // ── Screens ────────────────────────────────────────────────────────────────

  function canAdvance(block: FlowBlock, v: unknown): boolean {
    if (block.type === "zustimmung") {
      return typeof v === "object" && v !== null
        ? (v as { agreed?: boolean }).agreed === true
        : v === true;
    }
    return true; // alles andere ist bewusst überspringbar (Freiwilligkeit!)
  }

  function NextButton({ block }: { block?: FlowBlock }) {
    const v = block ? values[block.id] : undefined;
    const enabled = !block || canAdvance(block, v);
    const hasValue =
      v !== undefined && v !== null && v !== "" && !(Array.isArray(v) && v.length === 0);
    return (
      <div className="mt-8 flex items-center gap-4">
        <button
          onClick={next}
          disabled={!enabled}
          className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-40"
        >
          {block && !hasValue && block.type !== "zustimmung" ? "Überspringen" : "Weiter"}
        </button>
        <span className="text-xs text-neutral-400">↵ Enter</span>
        {block && (
          <span className="ml-auto text-xs text-neutral-400">
            Frage {answeredInputs + 1} von {inputScreens}
          </span>
        )}
      </div>
    );
  }

  function renderScreen(s: Screen) {
    if (s.kind === "story") {
      const lead = s.blocks[0];
      const leadTitle = cfgStr(lead.config, "title");
      return (
        <div>
          {s.isIntro && (
            <p className="eyebrow sf-in mb-5">
              ≈ 5 Minuten · vertraulich · in Ihrem Tempo
            </p>
          )}
          {leadTitle && (
            <h1 className="heading-1 sf-in mb-6 text-neutral-900">{leadTitle}</h1>
          )}
          <div className="sf-in-slow space-y-4">
            {s.blocks.map((b) => {
              if (b.type === "hinweis") {
                return (
                  <div key={b.id} className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-800">
                    {cfgStr(b.config, "text")}
                  </div>
                );
              }
              if (b.type === "akkordeon") {
                return (
                  <details key={b.id} className="rounded-2xl border border-neutral-200 bg-white p-4">
                    <summary className="cursor-pointer text-sm font-semibold text-neutral-700">
                      {cfgStr(b.config, "title") || "Mehr erfahren"}
                    </summary>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-neutral-600">
                      {cfgStr(b.config, "text")}
                    </p>
                  </details>
                );
              }
              const text = cfgStr(b.config, "text");
              const isLead = b === lead;
              if (!text.trim()) return null;
              return (
                <p key={b.id} className={`whitespace-pre-wrap text-lg leading-8 text-neutral-600 ${!isLead && cfgStr(b.config, "title") ? "font-semibold" : ""}`}>
                  {text}
                </p>
              );
            })}
          </div>
          <div className="sf-in-slow mt-10 flex items-center gap-4">
            <button onClick={next} className="btn btn-primary">
              {s.isIntro ? "Los geht's" : "Weiter"}
            </button>
            <span className="text-xs text-neutral-400">↵ Enter</span>
          </div>
        </div>
      );
    }

    if (s.kind === "input") return renderInput(s.block);

    if (s.kind === "title") {
      return (
        <div>
          <p className="eyebrow mb-4">Fast geschafft</p>
          <h2 className="heading-1 mb-4 text-neutral-900">
            Wir geben Ihrem Fall einen Namen.
          </h2>
          <p className="mb-8 text-lg leading-8 text-neutral-600">
            Aus Ihren Antworten {titleGenerating ? "entsteht gerade" : "ist"} ein
            Arbeitstitel {titleGenerating ? "…" : "entstanden – ändern Sie ihn gern."}
          </p>
          {titleGenerating ? (
            <div className="flex items-center gap-3 rounded-2xl border border-accent-200 bg-white p-5 text-accent-700">
              <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <span className="text-sm font-semibold">Ihr Fall bekommt einen Namen …</span>
            </div>
          ) : (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="z.B. Trennung Familie Müller"
              autoFocus
              className="w-full rounded-2xl border border-neutral-300 bg-white p-5 font-serif text-2xl text-neutral-900 outline-none transition focus:border-accent-500"
            />
          )}
          <div className="mt-8 flex items-center gap-4">
            <button onClick={next} disabled={titleGenerating} className="btn btn-primary disabled:opacity-40">
              Weiter
            </button>
          </div>
        </div>
      );
    }

    // package
    return (
      <div>
        <p className="eyebrow mb-4">Letzter Schritt</p>
        <h2 className="heading-1 mb-4 text-neutral-900">Wie möchten Sie arbeiten?</h2>
        <p className="mb-8 text-lg leading-8 text-neutral-600">
          Das Paket bestimmt Leistungsumfang und Preis — Details in der{" "}
          <Link href="/preise" target="_blank" className="underline">Preisübersicht</Link>.
        </p>
        {packages.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-3">
            {packages.map((pkg) => (
              <button
                key={pkg.key}
                type="button"
                onClick={() => setSelectedPackage(pkg.key)}
                className={`rounded-2xl border bg-white p-5 text-left transition ${
                  selectedPackage === pkg.key
                    ? "border-accent-500 ring-2 ring-accent-200"
                    : "border-neutral-300 hover:border-neutral-400"
                }`}
              >
                <span className="block text-sm font-bold text-neutral-900">{pkg.label}</span>
                <span className="mt-1 block text-2xl font-extrabold text-accent-600">
                  {pkg.price_eur.toFixed(0)} €
                </span>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-500">Paketauswahl wird geladen …</p>
        )}
        <div className="mt-10 flex items-center gap-4">
          <button
            onClick={finish}
            disabled={saving}
            className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Wird gespeichert …" : "Vorhang auf – zum Fall"}
          </button>
        </div>
      </div>
    );
  }

  function renderInput(block: FlowBlock) {
    const c = block.config ?? {};
    const raw = values[block.id];
    const str = typeof raw === "string" ? raw : "";
    const prompt = cfgStr(c, "prompt") || cfgStr(c, "label");

    if (block.type === "zustimmung") {
      const agreed =
        typeof raw === "object" && raw !== null
          ? (raw as { agreed?: boolean }).agreed === true
          : raw === true;
      return (
        <div>
          <p className="eyebrow mb-4">Das Arbeitsbündnis</p>
          <h2 className="heading-2 mb-6 text-neutral-900">Worauf Sie sich verlassen können</h2>
          <p className="mb-6 whitespace-pre-wrap text-base leading-8 text-neutral-600">
            {cfgStr(c, "text")}
          </p>
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-neutral-300 bg-white p-5 transition hover:border-accent-400">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setVal(block, { agreed: e.target.checked, at: new Date().toISOString() })}
              className="mt-1 h-5 w-5"
            />
            <span className="text-sm font-semibold text-neutral-800">
              Einverstanden — auf dieser Grundlage möchte ich arbeiten.
            </span>
          </label>
          <NextButton block={block} />
        </div>
      );
    }

    if (block.type === "auswahl") {
      const opts = cfgArr(c, "options");
      const multi = c.multi === true;
      const selected: string[] = Array.isArray(raw)
        ? (raw as string[])
        : typeof raw === "string" && raw ? [raw] : [];
      const toggle = (opt: string) => {
        if (multi) {
          const nextSel = selected.includes(opt)
            ? selected.filter((o) => o !== opt)
            : [...selected, opt];
          setVal(block, nextSel);
        } else {
          setVal(block, opt);
        }
      };
      return (
        <div>
          <h2 className="heading-2 mb-2 text-neutral-900">{prompt}</h2>
          {multi && <p className="mb-6 text-sm text-neutral-400">Mehrfachauswahl möglich.</p>}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {opts.map((o) => {
              const active = selected.includes(o);
              return (
                <button
                  key={o}
                  type="button"
                  onClick={() => toggle(o)}
                  className={`rounded-2xl border bg-white p-4 text-left text-sm font-semibold transition ${
                    active
                      ? "border-accent-500 ring-2 ring-accent-200 text-neutral-900"
                      : "border-neutral-300 text-neutral-700 hover:border-neutral-400"
                  }`}
                >
                  {o}
                </button>
              );
            })}
          </div>
          <NextButton block={block} />
        </div>
      );
    }

    if (block.type === "skala") {
      const min = cfgNum(c, "min", 1);
      const max = cfgNum(c, "max", 10);
      const val = typeof raw === "number" ? raw : Math.round((min + max) / 2);
      return (
        <div>
          <h2 className="heading-2 mb-8 text-neutral-900">{prompt}</h2>
          <p className="mb-2 text-center font-serif text-6xl text-accent-600">
            {typeof raw === "number" ? raw : "–"}
          </p>
          <input
            type="range"
            min={min}
            max={max}
            value={val}
            onChange={(e) => setVal(block, Number(e.target.value))}
            className="w-full accent-accent-600"
          />
          <div className="mt-1 flex justify-between text-xs text-neutral-400">
            <span>{cfgStr(c, "minLabel") || min}</span>
            <span>{cfgStr(c, "maxLabel") || max}</span>
          </div>
          <NextButton block={block} />
        </div>
      );
    }

    if (block.type === "datum") {
      return (
        <div>
          <h2 className="heading-2 mb-6 text-neutral-900">{prompt}</h2>
          <input
            type="date"
            value={str}
            onChange={(e) => setVal(block, e.target.value)}
            autoFocus
            className="rounded-2xl border border-neutral-300 bg-white p-4 text-xl text-neutral-800 outline-none transition focus:border-accent-500"
          />
          {cfgStr(c, "help") && (
            <p className="mt-3 text-sm text-neutral-400">{cfgStr(c, "help")}</p>
          )}
          <NextButton block={block} />
        </div>
      );
    }

    if (block.type === "liste") {
      const items: string[] = Array.isArray(raw) ? (raw as string[]) : [];
      return (
        <div>
          <h2 className="heading-2 mb-6 text-neutral-900">{prompt}</h2>
          <div className="space-y-2">
            {items.map((it, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="flex-1 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm">{it}</span>
                <button
                  onClick={() => setVal(block, items.filter((_, j) => j !== i))}
                  className="rounded p-1 text-neutral-400 hover:text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <input
            autoFocus
            placeholder={cfgStr(c, "placeholder") || "Punkt eintippen und Enter drücken …"}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.stopPropagation();
                const v = e.currentTarget.value.trim();
                if (v) {
                  setVal(block, [...items, v]);
                  e.currentTarget.value = "";
                }
              }
            }}
            className="mt-3 w-full rounded-xl border border-dashed border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-accent-500"
          />
          <NextButton block={block} />
        </div>
      );
    }

    if (block.type === "betrag") {
      return (
        <div>
          <h2 className="heading-2 mb-6 text-neutral-900">{prompt}</h2>
          <div className="flex items-center gap-3">
            <input
              type="number"
              step="0.01"
              value={typeof raw === "number" ? raw : ""}
              onChange={(e) => setVal(block, e.target.value === "" ? null : Number(e.target.value))}
              autoFocus
              placeholder="0"
              className="w-56 rounded-2xl border border-neutral-300 bg-white p-4 text-xl outline-none focus:border-accent-500"
            />
            <span className="text-xl text-neutral-500">{cfgStr(c, "currency") || "€"}</span>
          </div>
          <NextButton block={block} />
        </div>
      );
    }

    // frage / texteingabe (Standard: großzügiges Freitextfeld)
    return (
      <div>
        <h2 className="heading-2 mb-6 text-neutral-900">{prompt}</h2>
        <textarea
          value={str}
          onChange={(e) => setVal(block, e.target.value)}
          placeholder={cfgStr(c, "placeholder") || "Schreiben Sie frei – es gibt kein falsch …"}
          autoFocus
          rows={6}
          className="w-full rounded-2xl border border-neutral-300 bg-white p-5 text-base leading-7 text-neutral-800 outline-none transition focus:border-accent-500"
        />
        <p className="mt-2 text-xs text-neutral-400">Strg/⌘ + Enter = weiter</p>
        <NextButton block={block} />
      </div>
    );
  }
}
