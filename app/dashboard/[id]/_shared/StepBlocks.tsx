"use client";

// ── Interaktiver Block-Renderer (Teilnehmer-Seite) ──────────────────────────
//
// Rendert einen Schritt, der im WorkflowManager als geordnete Block-Liste
// gestaltet wurde (PhaseStepDefault.blocks). Anzeige-Blöcke werden dargestellt,
// Eingabe-Blöcke (Texteingabe, Frage, Video-Aufnahme) speichern ihren Inhalt
// pro Block über /mediations/{id}/block-responses – getrennt je Autor, sodass
// die Beiträge später ausgewertet werden können.
//
// Neue Blocktypen: hier einen Fall in renderBlock() ergänzen. Unbekannte Typen
// werden tolerant übersprungen.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { StepBlockDto } from "@/app/workspace/types";
import { fetchBlockResponses, saveBlockResponse } from "@/app/workspace/api";

function cfgStr(config: Record<string, unknown>, key: string): string {
  const v = config?.[key];
  return typeof v === "string" ? v : "";
}

/** YouTube/Vimeo-URL -> Embed-URL, sonst null. */
function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtube.com" || host === "m.youtube.com") {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
    }
    if (host === "youtu.be") {
      const id = u.pathname.slice(1);
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (host === "vimeo.com") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      if (id && /^\d+$/.test(id)) return `https://player.vimeo.com/video/${id}`;
    }
  } catch {
    return null;
  }
  return null;
}

function isDirectVideoFile(url: string): boolean {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
}

export default function StepBlocks({
  mediationId,
  phase,
  stepKey,
  blocks,
}: {
  mediationId: string;
  phase: string;
  stepKey: string;
  blocks: StepBlockDto[];
}) {
  // Eigene, bereits gespeicherte Antworten je Block (block_id -> Textwert).
  const [values, setValues] = useState<Record<string, string>>({});
  const [savedFlash, setSavedFlash] = useState<Record<string, boolean>>({});
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  // Bereits gespeicherte eigene Antworten laden.
  useEffect(() => {
    let cancelled = false;
    fetchBlockResponses(Number(mediationId), { phase, stepKey })
      .then((rows) => {
        if (cancelled) return;
        const map: Record<string, string> = {};
        for (const r of rows) {
          if (typeof r.value === "string") map[r.block_id] = r.value;
          else if (r.value && typeof r.value === "object" && "text" in (r.value as object)) {
            const t = (r.value as { text?: unknown }).text;
            if (typeof t === "string") map[r.block_id] = t;
          }
        }
        setValues(map);
      })
      .catch(() => {
        /* Fällt bewusst still aus – der Schritt bleibt bedienbar. */
      });
    return () => {
      cancelled = true;
    };
  }, [mediationId, phase, stepKey]);

  const persist = useCallback(
    (block: StepBlockDto, value: string) => {
      const key = block.id;
      if (timers.current[key]) clearTimeout(timers.current[key]);
      timers.current[key] = setTimeout(() => {
        saveBlockResponse(Number(mediationId), {
          phase,
          step_key: stepKey,
          block_id: block.id,
          block_type: block.type,
          value,
          submitted: false,
        })
          .then(() => {
            setSavedFlash((s) => ({ ...s, [key]: true }));
            setTimeout(() => setSavedFlash((s) => ({ ...s, [key]: false })), 1500);
          })
          .catch(() => {
            /* still */
          });
      }, 600);
    },
    [mediationId, phase, stepKey],
  );

  const onInput = useCallback(
    (block: StepBlockDto, value: string) => {
      setValues((v) => ({ ...v, [block.id]: value }));
      persist(block, value);
    },
    [persist],
  );

  const visibleBlocks = useMemo(
    () => (Array.isArray(blocks) ? blocks : []),
    [blocks],
  );

  if (visibleBlocks.length === 0) return null;

  return (
    <div className="mb-6 ml-11 max-w-2xl space-y-4">
      {visibleBlocks.map((block) => renderBlock(block))}
    </div>
  );

  function SavedHint({ id }: { id: string }) {
    return savedFlash[id] ? (
      <span className="ml-2 text-[11px] font-semibold text-emerald-600">✓ gespeichert</span>
    ) : null;
  }

  function renderBlock(block: StepBlockDto) {
    const c = block.config ?? {};
    const value = values[block.id] ?? "";
    switch (block.type) {
      case "textausgabe": {
        const text = cfgStr(c, "text");
        if (!text.trim()) return null;
        return (
          <p key={block.id} className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-700">
            {text}
          </p>
        );
      }
      case "video": {
        const url = cfgStr(c, "url");
        if (!url.trim()) return null;
        const embed = toEmbedUrl(url);
        return (
          <div key={block.id} className="overflow-hidden rounded-2xl border border-rose-200 bg-white">
            <div className="border-b border-rose-100 bg-rose-50/60 px-4 py-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-rose-600">Video</p>
            </div>
            {embed ? (
              <div className="aspect-video w-full bg-black">
                <iframe
                  src={embed}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Video"
                />
              </div>
            ) : isDirectVideoFile(url) ? (
              <video src={url} controls className="aspect-video w-full bg-black" />
            ) : (
              <div className="p-4">
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-rose-700 underline break-all"
                >
                  ▶ Video öffnen
                </a>
              </div>
            )}
          </div>
        );
      }
      case "texteingabe": {
        const label = cfgStr(c, "label");
        const placeholder = cfgStr(c, "placeholder") || "Deine Eingabe …";
        return (
          <div key={block.id}>
            {label && (
              <p className="mb-1 text-sm font-medium text-neutral-700">
                {label}
                <SavedHint id={block.id} />
              </p>
            )}
            <textarea
              value={value}
              onChange={(e) => onInput(block, e.target.value)}
              placeholder={placeholder}
              rows={3}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent-400"
            />
            {!label && <div className="text-right"><SavedHint id={block.id} /></div>}
          </div>
        );
      }
      case "frage": {
        const prompt = cfgStr(c, "prompt");
        return (
          <div key={block.id} className="rounded-2xl border border-violet-200 bg-violet-50/60 p-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-violet-600">
              Frage
              <SavedHint id={block.id} />
            </p>
            {prompt && (
              <p className="mb-2 whitespace-pre-wrap text-sm leading-relaxed text-neutral-800">{prompt}</p>
            )}
            <textarea
              value={value}
              onChange={(e) => onInput(block, e.target.value)}
              placeholder="Deine Antwort …"
              rows={2}
              className="w-full rounded-xl border border-violet-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-violet-400"
            />
          </div>
        );
      }
      case "video_aufnahme": {
        const prompt = cfgStr(c, "prompt");
        return (
          <div key={block.id} className="rounded-2xl border border-orange-200 bg-orange-50/60 p-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-orange-600">
              ⏺ Video aufnehmen
              <SavedHint id={block.id} />
            </p>
            {prompt && <p className="mb-2 text-sm text-neutral-700">{prompt}</p>}
            <p className="mb-2 text-[11px] text-orange-700">
              Aufnahme-Funktion folgt – bis dahin kannst du deine Botschaft hier schriftlich festhalten.
            </p>
            <textarea
              value={value}
              onChange={(e) => onInput(block, e.target.value)}
              placeholder="Deine Botschaft / Transkript …"
              rows={2}
              className="w-full rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
            />
          </div>
        );
      }
      case "videokonferenz": {
        const url = cfgStr(c, "url");
        return (
          <div key={block.id} className="rounded-2xl border border-sky-200 bg-sky-50/60 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-sky-600">Videokonferenz</p>
            {url.trim() ? (
              <a href={url} target="_blank" rel="noreferrer" className="btn btn-primary text-sm">
                🎥 Videoraum beitreten
              </a>
            ) : (
              <p className="text-sm text-neutral-500">Der Mediator hinterlegt hier den Link zum Videoraum.</p>
            )}
          </div>
        );
      }
      case "ki_prompt":
      case "individuell":
        // Für Teilnehmer nicht sichtbar (laufen im Hintergrund / pro Fall).
        return null;
      case "termin":
        return (
          <div key={block.id} className="rounded-2xl border border-teal-200 bg-teal-50/60 p-4 text-sm text-teal-700">
            📅 Terminvereinbarung – siehe Kalender / Termin-Bereich dieses Falls.
          </div>
        );
      case "feedback":
        return (
          <div key={block.id} className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 text-sm text-amber-700">
            ★ Feedback-Fragebogen erscheint zum passenden Zeitpunkt.
          </div>
        );
      case "vertrag":
        return (
          <div key={block.id} className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-4 text-sm text-indigo-700">
            § Vertrag / Dokument – siehe Vertrags-Bereich dieses Falls.
          </div>
        );
      case "ergebnis":
        // Ergebnis-Anzeige läuft freigabegesteuert über die Beschreibung/den
        // bestehenden Ergebnis-Flow – hier bewusst kein Duplikat.
        return null;
      default:
        return null;
    }
  }
}
