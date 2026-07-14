"use client";

// ── Schlanker Business-Start für Beteiligte in Abo-Fällen ───────────────────
//
// Anders als der B2C-StartFlow (Lagebesprechung + Paketwahl): Der Fall ist
// über das Firmen-Abo bereits bezahlt. Beteiligte sehen zuerst die vom
// Unternehmen akzeptierte GRUNDKONFIGURATION (read-only, aus
// organisation/abo_grundkonfiguration + organizations.base_config), dann den
// WFM-Schritt geschaeft/abo_start (visible_if abo=ja): Rahmen akzeptieren,
// eigene Sicht, Glasl-Kurzeinschätzung. Danach direkt weiter zur Einleitung.
//
// Antworten werden als block_responses gespeichert (Auswertung). Wurde der
// Rahmen (as_rahmen) bereits akzeptiert, leitet die Seite sofort weiter.

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { encodeId } from "@/lib/ids";

interface FlowBlock {
  id: string;
  type: string;
  config: Record<string, unknown>;
}

const INPUT_TYPES = new Set(["frage", "texteingabe", "auswahl", "skala", "zustimmung", "datum", "liste"]);
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

// Fallback, falls die Seed-Migration (abo_start) noch nicht gelaufen ist.
const FALLBACK_BLOCKS: FlowBlock[] = [
  {
    id: "as_intro",
    type: "textausgabe",
    config: {
      title: "Willkommen. Kurz zum Rahmen — dann geht es los.",
      text:
        "Ihr Unternehmen stellt diese Mediation im Rahmen seines Abos bereit — " +
        "für Sie entstehen keine Kosten. Zwei Minuten für den Rahmen und Ihre Sicht.",
    },
  },
  {
    id: "as_rahmen",
    type: "zustimmung",
    config: {
      text:
        "FREIWILLIG: Ihre Teilnahme ist Ihre Entscheidung. VERTRAULICH: Ihre " +
        "Eingaben sieht die mediierende Person — nicht Ihr Arbeitgeber. " +
        "ALLPARTEILICH: Die Mediation steht auf keiner Seite. Auf dieser " +
        "Grundlage mache ich mit.",
    },
  },
  {
    id: "as_sicht",
    type: "frage",
    config: { prompt: "Ihre Sicht: Worum geht es in diesem Konflikt aus Ihrer Perspektive?" },
  },
];

type Screen =
  | { kind: "grundkonfig" }
  | { kind: "story"; blocks: FlowBlock[]; isIntro: boolean }
  | { kind: "input"; block: FlowBlock };

interface BaseConfig {
  blocks: FlowBlock[];
  values: Record<string, unknown>;
  accepted: boolean;
  accepted_by?: string | null;
}

export default function AboStartClient({
  mediationId,
  organizationId,
}: {
  mediationId: string;
  organizationId: number;
}) {
  const router = useRouter();
  const [blocks, setBlocks] = useState<FlowBlock[] | null>(null);
  const [baseConfig, setBaseConfig] = useState<BaseConfig | null>(null);
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [idx, setIdx] = useState(0);

  const caseUrl = `/dashboard/${encodeId(Number(mediationId))}`;
  const einleitungUrl = `${caseUrl}/einleitung`;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // 1. abo_start-Blöcke laden (Phase einladung ist paywall-frei)
      let loaded: FlowBlock[] = FALLBACK_BLOCKS;
      try {
        const res = await fetch(
          `/api/mediations/${mediationId}/phase-steps?phase=einladung`,
          { cache: "no-store" },
        );
        if (res.ok) {
          const data = await res.json();
          const step = (data.steps ?? []).find(
            (s: { key?: string; blocks?: unknown[] }) =>
              s.key === "abo_start" && Array.isArray(s.blocks) && s.blocks.length,
          );
          if (step) loaded = step.blocks as FlowBlock[];
        }
      } catch { /* Fallback bleibt */ }

      // 2. Bereits gegebene Antworten (Resume / Fertig-Erkennung)
      let existing: Record<string, unknown> = {};
      try {
        const res = await fetch(
          `/api/mediations/${mediationId}/block-responses?phase=einladung&step_key=abo_start`,
          { cache: "no-store" },
        );
        if (res.ok) {
          const rows: { block_id: string; value: unknown }[] = await res.json();
          if (Array.isArray(rows)) for (const r of rows) existing[r.block_id] = r.value;
        }
      } catch { /* optional */ }
      const rahmen = existing["as_rahmen"];
      const alreadyAccepted =
        typeof rahmen === "object" && rahmen !== null
          ? (rahmen as { agreed?: boolean }).agreed === true
          : rahmen === true;
      if (alreadyAccepted) {
        router.replace(einleitungUrl);
        return;
      }

      // 3. Grundkonfiguration des Unternehmens (read-only Ansicht)
      try {
        const res = await fetch(`/api/organizations/${organizationId}/base-config`, { cache: "no-store" });
        if (res.ok && !cancelled) setBaseConfig(await res.json());
      } catch { /* Ansicht ist optional */ }

      if (!cancelled) {
        setValues(existing);
        setBlocks(loaded);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediationId, organizationId]);

  const screens = useMemo<Screen[]>(() => {
    if (!blocks) return [];
    const out: Screen[] = [];
    if (baseConfig?.accepted) out.push({ kind: "grundkonfig" });
    let story: FlowBlock[] = [];
    const flush = () => {
      if (story.length) {
        out.push({ kind: "story", blocks: story, isIntro: out.length === 0 });
        story = [];
      }
    };
    for (const b of blocks) {
      if (STORY_TYPES.has(b.type)) story.push(b);
      else if (INPUT_TYPES.has(b.type)) { flush(); out.push({ kind: "input", block: b }); }
    }
    flush();
    return out;
  }, [blocks, baseConfig]);

  const screen = screens[idx];
  const progress = screens.length ? Math.round(((idx + 1) / screens.length) * 100) : 0;

  const persist = useCallback(
    (block: FlowBlock, value: unknown) => {
      fetch(`/api/mediations/${mediationId}/block-responses`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phase: "einladung",
          step_key: "abo_start",
          block_id: block.id,
          block_type: block.type,
          value,
          submitted: true,
        }),
      }).catch(() => { /* Wert bleibt im State */ });
    },
    [mediationId],
  );

  const next = useCallback(() => {
    if (screen?.kind === "input") persist(screen.block, values[screen.block.id]);
    if (idx >= screens.length - 1) {
      router.replace(einleitungUrl);
      return;
    }
    setIdx((i) => i + 1);
  }, [screen, values, persist, idx, screens.length, router, einleitungUrl]);

  const back = useCallback(() => setIdx((i) => Math.max(i - 1, 0)), []);

  function canAdvance(block: FlowBlock): boolean {
    if (block.type !== "zustimmung") return true;
    const v = values[block.id];
    return typeof v === "object" && v !== null
      ? (v as { agreed?: boolean }).agreed === true
      : v === true;
  }

  return (
    <main className="fixed inset-0 z-40 flex flex-col overflow-hidden bg-gradient-to-b from-white via-accent-50/40 to-white">
      <style>{`
        @keyframes asIn { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
        .as-in { animation: asIn .45s cubic-bezier(.22,.8,.36,1) both; }
      `}</style>
      <div className="h-1 w-full bg-neutral-100">
        <div className="h-full bg-accent-500 transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>
      <div className="flex items-center justify-between px-5 py-4 sm:px-8">
        <button onClick={back} disabled={idx === 0} className="btn btn-ghost text-sm disabled:invisible">← Zurück</button>
        <p className="eyebrow">Firmen-Abo · vertraulich</p>
        <Link href={caseUrl} className="btn btn-ghost text-sm">Später fortsetzen</Link>
      </div>
      <div className="flex flex-1 items-center justify-center overflow-y-auto px-5 pb-10 sm:px-8">
        {!blocks ? (
          <p className="text-neutral-400">Ihr Start wird vorbereitet …</p>
        ) : screen ? (
          <div key={idx} className="as-in w-full max-w-2xl">{renderScreen(screen)}</div>
        ) : (
          <div className="text-center">
            <p className="mb-4 text-neutral-500">Alles bereit.</p>
            <Link href={einleitungUrl} className="btn btn-primary">Zur Einleitung</Link>
          </div>
        )}
      </div>
    </main>
  );

  function renderScreen(s: Screen) {
    if (s.kind === "grundkonfig") return <GrundkonfigScreen />;

    if (s.kind === "story") {
      const lead = s.blocks[0];
      const leadTitle = cfgStr(lead.config, "title");
      return (
        <div>
          {leadTitle && <h1 className="heading-1 mb-6 text-neutral-900">{leadTitle}</h1>}
          <div className="space-y-4">
            {s.blocks.map((b) => {
              const text = cfgStr(b.config, "text");
              if (!text.trim()) return null;
              if (b.type === "hinweis") {
                return (
                  <div key={b.id} className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-800">{text}</div>
                );
              }
              return (
                <p key={b.id} className="whitespace-pre-wrap text-lg leading-8 text-neutral-600">{text}</p>
              );
            })}
          </div>
          <button onClick={next} className="btn btn-primary mt-10">
            {s.isIntro ? "Los geht's" : "Weiter"}
          </button>
        </div>
      );
    }

    return renderInput(s.block);
  }

  function GrundkonfigScreen() {
    const cfg = baseConfig!;
    // Kompakte, read-only Zusammenfassung: Fragen mit den Antworten der Firma.
    const rows = cfg.blocks
      .filter((b) => INPUT_TYPES.has(b.type) && b.type !== "zustimmung")
      .map((b) => {
        const v = cfg.values[b.id];
        let out = "";
        if (typeof v === "string") out = v;
        else if (typeof v === "number") out = String(v);
        else if (Array.isArray(v)) out = v.join(", ");
        return { id: b.id, label: cfgStr(b.config, "prompt") || cfgStr(b.config, "label"), value: out };
      })
      .filter((r) => r.value);
    return (
      <div>
        <p className="eyebrow mb-4">Der Rahmen Ihres Unternehmens</p>
        <h1 className="heading-1 mb-6 text-neutral-900">So ist Mediation bei Ihnen geregelt.</h1>
        <p className="mb-6 text-lg leading-8 text-neutral-600">
          Ihr Unternehmen hat diesen Rahmen festgelegt und akzeptiert
          {cfg.accepted_by ? ` (${cfg.accepted_by})` : ""}. Das Wichtigste:
          Ihre Eingaben sieht die mediierende Person — nicht Ihr Arbeitgeber.
        </p>
        {rows.length > 0 && (
          <div className="space-y-3">
            {rows.map((r) => (
              <div key={r.id} className="rounded-2xl border border-neutral-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">{r.label}</p>
                <p className="mt-1 text-sm leading-6 text-neutral-800">{r.value}</p>
              </div>
            ))}
          </div>
        )}
        <button onClick={next} className="btn btn-primary mt-10">Verstanden — weiter</button>
      </div>
    );
  }

  function renderInput(block: FlowBlock) {
    const c = block.config ?? {};
    const raw = values[block.id];
    const str = typeof raw === "string" ? raw : "";
    const prompt = cfgStr(c, "prompt") || cfgStr(c, "label");
    const setVal = (v: unknown) => setValues((s) => ({ ...s, [block.id]: v }));

    if (block.type === "zustimmung") {
      const agreed = typeof raw === "object" && raw !== null
        ? (raw as { agreed?: boolean }).agreed === true
        : raw === true;
      return (
        <div>
          <p className="eyebrow mb-4">Ihr Rahmen</p>
          <h2 className="heading-2 mb-6 text-neutral-900">Worauf Sie sich verlassen können</h2>
          <p className="mb-6 whitespace-pre-wrap text-base leading-8 text-neutral-600">{cfgStr(c, "text")}</p>
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-neutral-300 bg-white p-5 transition hover:border-accent-400">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setVal({ agreed: e.target.checked, at: new Date().toISOString() })}
              className="mt-1 h-5 w-5"
            />
            <span className="text-sm font-semibold text-neutral-800">Einverstanden — ich mache auf dieser Grundlage mit.</span>
          </label>
          <button onClick={next} disabled={!canAdvance(block)} className="btn btn-primary mt-8 disabled:cursor-not-allowed disabled:opacity-40">Weiter</button>
        </div>
      );
    }

    if (block.type === "auswahl") {
      const opts = cfgArr(c, "options");
      const multi = c.multi === true;
      const selected: string[] = Array.isArray(raw) ? (raw as string[]) : typeof raw === "string" && raw ? [raw] : [];
      const toggle = (opt: string) => {
        if (multi) setVal(selected.includes(opt) ? selected.filter((o) => o !== opt) : [...selected, opt]);
        else setVal(opt);
      };
      return (
        <div>
          <h2 className="heading-2 mb-6 text-neutral-900">{prompt}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {opts.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => toggle(o)}
                className={`rounded-2xl border bg-white p-4 text-left text-sm font-semibold transition ${
                  selected.includes(o)
                    ? "border-accent-500 ring-2 ring-accent-200 text-neutral-900"
                    : "border-neutral-300 text-neutral-700 hover:border-neutral-400"
                }`}
              >
                {o}
              </button>
            ))}
          </div>
          <button onClick={next} className="btn btn-primary mt-8">Weiter</button>
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
          <p className="mb-2 text-center font-serif text-6xl text-accent-600">{typeof raw === "number" ? raw : "–"}</p>
          <input type="range" min={min} max={max} value={val} onChange={(e) => setVal(Number(e.target.value))} className="w-full accent-accent-600" />
          <div className="mt-1 flex justify-between text-xs text-neutral-400">
            <span>{cfgStr(c, "minLabel") || min}</span>
            <span>{cfgStr(c, "maxLabel") || max}</span>
          </div>
          <button onClick={next} className="btn btn-primary mt-8">Weiter</button>
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
            onChange={(e) => setVal(e.target.value)}
            className="rounded-2xl border border-neutral-300 bg-white p-4 text-xl text-neutral-800 outline-none focus:border-accent-500"
          />
          <div><button onClick={next} className="btn btn-primary mt-8">Weiter</button></div>
        </div>
      );
    }

    // frage / texteingabe / liste (vereinfacht als Freitext)
    return (
      <div>
        <h2 className="heading-2 mb-6 text-neutral-900">{prompt}</h2>
        <textarea
          value={str}
          onChange={(e) => setVal(e.target.value)}
          placeholder={cfgStr(c, "placeholder") || "Schreiben Sie frei – es gibt kein falsch …"}
          autoFocus
          rows={6}
          className="w-full rounded-2xl border border-neutral-300 bg-white p-5 text-base leading-7 text-neutral-800 outline-none transition focus:border-accent-500"
        />
        <div className="mt-8 flex items-center gap-4">
          <button onClick={next} className="btn btn-primary">
            {str.trim() ? "Weiter" : "Überspringen"}
          </button>
          <span className="text-xs text-neutral-400">Frage {screens.filter((s, i) => s.kind === "input" && i <= idx).length} von {screens.filter((s) => s.kind === "input").length}</span>
        </div>
      </div>
    );
  }
}
