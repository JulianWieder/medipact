"use client";

// ── Interaktiver Block-Renderer (Teilnehmer-Seite) ──────────────────────────
//
// Rendert einen Schritt, der im WorkflowManager als geordnete Block-Liste
// gestaltet wurde. Anzeige-Blöcke werden dargestellt, Eingabe-Blöcke speichern
// ihren Inhalt pro Block (getrennt je Autor) über /block-responses. Datei-Blöcke
// laden hoch, KI-/individuelle Blöcke sind für Teilnehmer unsichtbar,
// "bezahlung"-Blöcke schalten Inhalt erst nach Zahlung frei (PayPal).
//
// Neuer Blocktyp: hier einen Fall in renderBlock() ergänzen. Unbekannte Typen
// werden tolerant übersprungen.

import { useCallback, useEffect, useRef, useState } from "react";
import type { StepBlockDto } from "@/app/workspace/types";
import FallFreischaltungBlock from "./FallFreischaltungBlock";
import {
  fetchBlockResponses,
  saveBlockResponse,
  uploadBlockFile,
  fetchBonusPurchases,
  createBonusOrder,
  captureBonusOrder,
} from "@/app/workspace/api";

// Minimaler Typ für das global geladene PayPal-SDK.
interface PayPalButtonsConfig {
  style?: Record<string, unknown>;
  createOrder: () => Promise<string>;
  onApprove: (data: { orderID: string }) => Promise<void>;
  onError?: () => void;
}
interface PayPalSDK {
  Buttons: (cfg: PayPalButtonsConfig) => { render: (el: HTMLElement) => Promise<void> };
}
function getPaypal(): PayPalSDK | undefined {
  return (window as unknown as { paypal?: PayPalSDK }).paypal;
}

function cfgStr(config: Record<string, unknown>, key: string): string {
  const v = config?.[key];
  return typeof v === "string" ? v : "";
}
function cfgNum(config: Record<string, unknown>, key: string, fallback = 0): number {
  const v = config?.[key];
  return typeof v === "number" && !Number.isNaN(v) ? v : fallback;
}
function cfgArr(config: Record<string, unknown>, key: string): string[] {
  const v = config?.[key];
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtube.com" || host === "m.youtube.com") {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
    }
    if (host === "youtu.be") {
      const idp = u.pathname.slice(1);
      if (idp) return `https://www.youtube.com/embed/${idp}`;
    }
    if (host === "vimeo.com") {
      const idp = u.pathname.split("/").filter(Boolean)[0];
      if (idp && /^\d+$/.test(idp)) return `https://player.vimeo.com/video/${idp}`;
    }
  } catch {
    return null;
  }
  return null;
}
function isDirectVideoFile(url: string): boolean {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
}

// ── PayPal-Button für eine Bonus-Leistung ───────────────────────────────────
function BonusPayButton({
  mediationId,
  blockId,
  onPaid,
}: {
  mediationId: string;
  blockId: string;
  onPaid: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Gemounteter DOM-Knoten statt "schon gerendert"-Flag: nach einem Remount
  // zeigt ref.current auf einen neuen, leeren div – mit einem booleschen Flag
  // würde der Effect abbrechen und der Button bliebe dauerhaft unsichtbar.
  const mountedNode = useRef<HTMLElement | null>(null);
  const [retry, setRetry] = useState(0);
  const [error, setError] = useState("");

  // Nach einer fehlgeschlagenen Zahlung ist die genehmigte Order verbraucht –
  // die Buttons müssen neu aufgebaut werden, sonst hängt der Nutzer fest.
  function resetButtons() {
    mountedNode.current = null;
    if (ref.current) ref.current.innerHTML = "";
    setRetry((n) => n + 1);
  }

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    if (!clientId) {
      setError("PayPal ist noch nicht konfiguriert.");
      return;
    }
    function render() {
      const paypal = getPaypal();
      const container = ref.current;
      if (!paypal || !container) return;
      if (mountedNode.current === container) return;
      mountedNode.current = container;
      container.innerHTML = "";
      paypal
        .Buttons({
          style: { layout: "horizontal", color: "gold", label: "pay", height: 38 },
          createOrder: async () => {
            setError("");
            const d = await createBonusOrder(Number(mediationId), blockId);
            return d.order_id;
          },
          onApprove: async (data) => {
            try {
              await captureBonusOrder(Number(mediationId), blockId, data.orderID);
              onPaid();
            } catch {
              setError("Zahlung konnte nicht abgeschlossen werden.");
              resetButtons();
            }
          },
          onError: () => {
            setError("PayPal hat einen Fehler gemeldet.");
            resetButtons();
          },
        })
        .render(container)
        .catch(() => {
          mountedNode.current = null;
          setError("Der PayPal-Button konnte nicht geladen werden. Bitte Seite neu laden.");
        });
    }
    const existing = document.getElementById("paypal-sdk") as HTMLScriptElement | null;
    if (getPaypal()) render();
    else if (existing) existing.addEventListener("load", render);
    else {
      const s = document.createElement("script");
      s.id = "paypal-sdk";
      s.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=EUR`;
      s.addEventListener("load", render);
      s.addEventListener("error", () =>
        setError("Das PayPal-SDK konnte nicht geladen werden (Netzwerk oder Adblocker?)."),
      );
      document.body.appendChild(s);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediationId, blockId, retry]);

  return (
    <div>
      <div ref={ref} />
      {error && <p className="mt-1 text-xs font-semibold text-red-600">{error}</p>}
    </div>
  );
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
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [purchased, setPurchased] = useState<Set<string>>(new Set());
  const [savedFlash, setSavedFlash] = useState<Record<string, boolean>>({});
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const loadPurchases = useCallback(() => {
    fetchBonusPurchases(Number(mediationId))
      .then((rows) => setPurchased(new Set(rows.filter((r) => r.paid).map((r) => r.block_id))))
      .catch(() => {});
  }, [mediationId]);

  useEffect(() => {
    let cancelled = false;
    fetchBlockResponses(Number(mediationId), { phase, stepKey })
      .then((rows) => {
        if (cancelled) return;
        const map: Record<string, unknown> = {};
        for (const r of rows) map[r.block_id] = r.value;
        setValues(map);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [mediationId, phase, stepKey]);

  useEffect(() => {
    loadPurchases();
  }, [loadPurchases]);

  const persist = useCallback(
    (block: StepBlockDto, value: unknown, immediate = false) => {
      const key = block.id;
      const doSave = () => {
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
          .catch(() => {});
      };
      if (timers.current[key]) clearTimeout(timers.current[key]);
      if (immediate) doSave();
      else timers.current[key] = setTimeout(doSave, 600);
    },
    [mediationId, phase, stepKey],
  );

  const setVal = useCallback(
    (block: StepBlockDto, value: unknown, immediate = false) => {
      setValues((v) => ({ ...v, [block.id]: value }));
      persist(block, value, immediate);
    },
    [persist],
  );

  async function handleUpload(block: StepBlockDto, file: File) {
    setUploading((u) => ({ ...u, [block.id]: true }));
    try {
      const res = await uploadBlockFile(Number(mediationId), file);
      setVal(block, res, true);
    } catch {
      /* still */
    } finally {
      setUploading((u) => ({ ...u, [block.id]: false }));
    }
  }

  if (!Array.isArray(blocks) || blocks.length === 0) return null;

  return (
    <div className="mb-6 ml-11 max-w-2xl space-y-4">
      {blocks.map((block) => renderBlock(block))}
    </div>
  );

  function SavedHint({ id }: { id: string }) {
    return savedFlash[id] ? (
      <span className="ml-2 text-[11px] font-semibold text-emerald-600">✓ gespeichert</span>
    ) : null;
  }

  function renderBlock(block: StepBlockDto) {
    const c = block.config ?? {};
    const raw = values[block.id];
    const str = typeof raw === "string" ? raw : "";

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
                <iframe src={embed} className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="Video" />
              </div>
            ) : isDirectVideoFile(url) ? (
              <video src={url} controls className="aspect-video w-full bg-black" />
            ) : (
              <div className="p-4">
                <a href={url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-rose-700 underline break-all">▶ Video öffnen</a>
              </div>
            )}
          </div>
        );
      }
      case "bild": {
        const url = cfgStr(c, "url");
        if (!url.trim()) return null;
        return (
          <figure key={block.id}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={cfgStr(c, "caption")} className="max-h-96 rounded-2xl border border-neutral-200" />
            {cfgStr(c, "caption") && <figcaption className="mt-1 text-xs text-neutral-500">{cfgStr(c, "caption")}</figcaption>}
          </figure>
        );
      }
      case "texteingabe": {
        const label = cfgStr(c, "label");
        return (
          <div key={block.id}>
            {label && <p className="mb-1 text-sm font-medium text-neutral-700">{label}<SavedHint id={block.id} /></p>}
            <textarea value={str} onChange={(e) => setVal(block, e.target.value)} placeholder={cfgStr(c, "placeholder") || "Deine Eingabe …"} rows={3} className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent-400" />
            {!label && <div className="text-right"><SavedHint id={block.id} /></div>}
          </div>
        );
      }
      case "frage":
        return (
          <div key={block.id} className="rounded-2xl border border-violet-200 bg-violet-50/60 p-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-violet-600">Frage<SavedHint id={block.id} /></p>
            {cfgStr(c, "prompt") && <p className="mb-2 whitespace-pre-wrap text-sm text-neutral-800">{cfgStr(c, "prompt")}</p>}
            <textarea value={str} onChange={(e) => setVal(block, e.target.value)} placeholder="Deine Antwort …" rows={2} className="w-full rounded-xl border border-violet-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-violet-400" />
          </div>
        );
      case "video_aufnahme":
        return (
          <div key={block.id} className="rounded-2xl border border-orange-200 bg-orange-50/60 p-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-orange-600">⏺ Video aufnehmen<SavedHint id={block.id} /></p>
            {cfgStr(c, "prompt") && <p className="mb-2 text-sm text-neutral-700">{cfgStr(c, "prompt")}</p>}
            <p className="mb-2 text-[11px] text-orange-700">Aufnahme-Funktion folgt – bis dahin kannst du deine Botschaft schriftlich festhalten.</p>
            <textarea value={str} onChange={(e) => setVal(block, e.target.value)} placeholder="Deine Botschaft / Transkript …" rows={2} className="w-full rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400" />
          </div>
        );
      case "vertrauliche_notiz":
        return (
          <div key={block.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">🔒 Nur für den Mediator sichtbar<SavedHint id={block.id} /></p>
            {cfgStr(c, "prompt") && <p className="mb-2 text-sm text-neutral-700">{cfgStr(c, "prompt")}</p>}
            <textarea value={str} onChange={(e) => setVal(block, e.target.value)} placeholder="Vertrauliche Notiz …" rows={2} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400" />
          </div>
        );
      case "auswahl": {
        const opts = cfgArr(c, "options");
        const multi = c.multi === true;
        const selected: string[] = Array.isArray(raw) ? (raw as string[]) : typeof raw === "string" && raw ? [raw] : [];
        const toggle = (opt: string) => {
          if (multi) {
            const next = selected.includes(opt) ? selected.filter((o) => o !== opt) : [...selected, opt];
            setVal(block, next, true);
          } else {
            setVal(block, opt, true);
          }
        };
        return (
          <div key={block.id}>
            {cfgStr(c, "prompt") && <p className="mb-1 text-sm font-medium text-neutral-700">{cfgStr(c, "prompt")}<SavedHint id={block.id} /></p>}
            <div className="space-y-1">
              {opts.map((o, i) => (
                <label key={i} className="flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 hover:border-accent-300">
                  <input type={multi ? "checkbox" : "radio"} name={block.id} checked={selected.includes(o)} onChange={() => toggle(o)} />
                  {o}
                </label>
              ))}
            </div>
          </div>
        );
      }
      case "skala": {
        const min = cfgNum(c, "min", 1);
        const max = cfgNum(c, "max", 10);
        const val = typeof raw === "number" ? raw : Math.round((min + max) / 2);
        return (
          <div key={block.id}>
            {cfgStr(c, "prompt") && <p className="mb-1 text-sm font-medium text-neutral-700">{cfgStr(c, "prompt")}<SavedHint id={block.id} /></p>}
            <div className="flex items-center justify-between text-[11px] text-neutral-400">
              <span>{cfgStr(c, "minLabel") || min}</span>
              <span className="font-semibold text-accent-600">{typeof raw === "number" ? raw : "—"}</span>
              <span>{cfgStr(c, "maxLabel") || max}</span>
            </div>
            <input type="range" min={min} max={max} value={val} onChange={(e) => setVal(block, Number(e.target.value), true)} className="w-full" />
          </div>
        );
      }
      case "ranking": {
        const base = cfgArr(c, "options");
        const current: string[] = Array.isArray(raw) && (raw as string[]).length ? (raw as string[]) : base;
        const move = (i: number, dir: -1 | 1) => {
          const list = [...current];
          const t = i + dir;
          if (t < 0 || t >= list.length) return;
          [list[i], list[t]] = [list[t], list[i]];
          setVal(block, list, true);
        };
        return (
          <div key={block.id}>
            {cfgStr(c, "prompt") && <p className="mb-1 text-sm font-medium text-neutral-700">{cfgStr(c, "prompt")}<SavedHint id={block.id} /></p>}
            <div className="space-y-1">
              {current.map((o, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700">
                  <span><span className="mr-2 font-semibold text-neutral-400">{i + 1}.</span>{o}</span>
                  <span className="flex gap-1">
                    <button onClick={() => move(i, -1)} disabled={i === 0} className="rounded px-1 text-neutral-400 hover:bg-neutral-100 disabled:opacity-20">↑</button>
                    <button onClick={() => move(i, 1)} disabled={i === current.length - 1} className="rounded px-1 text-neutral-400 hover:bg-neutral-100 disabled:opacity-20">↓</button>
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      }
      case "liste": {
        const items: string[] = Array.isArray(raw) ? (raw as string[]) : [];
        const [addKey] = [`add-${block.id}`];
        return (
          <div key={block.id}>
            {cfgStr(c, "prompt") && <p className="mb-1 text-sm font-medium text-neutral-700">{cfgStr(c, "prompt")}<SavedHint id={block.id} /></p>}
            <div className="space-y-1">
              {items.map((it, i) => (
                <div key={i} className="flex items-center gap-1">
                  <input value={it} onChange={(e) => { const next = [...items]; next[i] = e.target.value; setVal(block, next); }} className="w-full rounded-lg border border-neutral-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent-400" />
                  <button onClick={() => setVal(block, items.filter((_, j) => j !== i), true)} className="rounded p-1 text-neutral-400 hover:bg-red-50 hover:text-red-500">✕</button>
                </div>
              ))}
            </div>
            <input
              key={addKey}
              placeholder={cfgStr(c, "placeholder") || "Eintrag hinzufügen und Enter drücken …"}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const v = e.currentTarget.value.trim();
                  if (v) { setVal(block, [...items, v], true); e.currentTarget.value = ""; }
                }
              }}
              className="mt-1 w-full rounded-lg border border-dashed border-neutral-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent-400"
            />
          </div>
        );
      }
      case "datum": {
        const label = cfgStr(c, "label");
        return (
          <div key={block.id}>
            {label && <p className="mb-1 text-sm font-medium text-neutral-700">{label}<SavedHint id={block.id} /></p>}
            <input type="date" value={str} onChange={(e) => setVal(block, e.target.value, true)} className="w-48 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent-400" />
            {cfgStr(c, "help") && <p className="mt-1 text-xs text-neutral-400">{cfgStr(c, "help")}</p>}
          </div>
        );
      }
      case "betrag":
        return (
          <div key={block.id}>
            {cfgStr(c, "label") && <p className="mb-1 text-sm font-medium text-neutral-700">{cfgStr(c, "label")}<SavedHint id={block.id} /></p>}
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-500">{cfgStr(c, "currency") || "€"}</span>
              <input type="number" step="0.01" value={typeof raw === "number" ? raw : ""} onChange={(e) => setVal(block, e.target.value === "" ? null : Number(e.target.value))} placeholder="0,00" className="w-40 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent-400" />
            </div>
          </div>
        );
      case "zustimmung": {
        const agreed = typeof raw === "object" && raw !== null ? (raw as { agreed?: boolean }).agreed === true : raw === true;
        return (
          <label key={block.id} className="flex items-start gap-2 rounded-2xl border border-neutral-200 bg-white p-3 text-sm text-neutral-700">
            <input type="checkbox" checked={agreed} onChange={(e) => setVal(block, { agreed: e.target.checked, at: new Date().toISOString() }, true)} className="mt-0.5" />
            <span>{cfgStr(c, "text") || "Ich stimme zu."}<SavedHint id={block.id} /></span>
          </label>
        );
      }
      case "unterschrift": {
        const name = typeof raw === "object" && raw !== null ? String((raw as { name?: unknown }).name ?? "") : "";
        return (
          <div key={block.id} className="rounded-2xl border border-neutral-200 p-4">
            <p className="mb-2 text-sm text-neutral-600">{cfgStr(c, "statement") || "Ich bestätige die Angaben."}<SavedHint id={block.id} /></p>
            <input value={name} onChange={(e) => setVal(block, { name: e.target.value, at: new Date().toISOString() })} placeholder="✍ Vollständigen Namen eingeben" className="w-full rounded-lg border-b-2 border-neutral-300 px-2 py-1.5 font-serif text-lg italic text-neutral-800 focus:border-accent-400 focus:outline-none" />
          </div>
        );
      }
      case "datei_upload": {
        const file = typeof raw === "object" && raw !== null ? (raw as { url?: string; name?: string }) : null;
        return (
          <div key={block.id} className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-4">
            {cfgStr(c, "prompt") && <p className="mb-2 text-sm text-neutral-700">{cfgStr(c, "prompt")}</p>}
            {file?.url ? (
              <div className="mb-2 flex items-center gap-2 text-sm">
                <a href={file.url} target="_blank" rel="noreferrer" className="font-semibold text-indigo-700 underline break-all">📎 {file.name || "Datei"}</a>
                <span className="text-emerald-600">✓</span>
              </div>
            ) : null}
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-indigo-300 bg-white px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50">
              {uploading[block.id] ? "Lädt hoch …" : file?.url ? "Andere Datei wählen" : "📎 Datei auswählen"}
              <input type="file" accept={cfgStr(c, "accept") || undefined} className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(block, f); }} />
            </label>
          </div>
        );
      }
      case "videokonferenz": {
        const url = cfgStr(c, "url");
        return (
          <div key={block.id} className="rounded-2xl border border-sky-200 bg-sky-50/60 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-sky-600">Videokonferenz</p>
            {url.trim() ? (
              <a href={url} target="_blank" rel="noreferrer" className="btn btn-primary text-sm">🎥 Videoraum beitreten</a>
            ) : (
              <p className="text-sm text-neutral-500">Der Mediator hinterlegt hier den Link zum Videoraum.</p>
            )}
          </div>
        );
      }
      case "hinweis": {
        const variant = cfgStr(c, "variant") || "info";
        const styles: Record<string, string> = {
          info: "border-blue-200 bg-blue-50 text-blue-800",
          warnung: "border-amber-200 bg-amber-50 text-amber-800",
          erfolg: "border-emerald-200 bg-emerald-50 text-emerald-800",
        };
        if (!cfgStr(c, "text").trim()) return null;
        return <div key={block.id} className={`rounded-2xl border p-3 text-sm ${styles[variant] ?? styles.info}`}>{cfgStr(c, "text")}</div>;
      }
      case "akkordeon":
        return (
          <details key={block.id} className="rounded-2xl border border-neutral-200 bg-white p-3">
            <summary className="cursor-pointer text-sm font-medium text-neutral-700">{cfgStr(c, "title") || "Mehr erfahren"}</summary>
            <p className="mt-2 whitespace-pre-wrap text-sm text-neutral-600">{cfgStr(c, "text")}</p>
          </details>
        );
      case "gate":
        return (
          <div key={block.id} className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4 text-sm text-blue-700">
            ⏸ {cfgStr(c, "text") || "Es geht weiter, sobald beide Parteien bestätigt haben."}
          </div>
        );
      case "fall_freischaltung":
        // Der eigentliche Bezahl-Schritt des Falls (Rechnungsdaten + eigener
        // Anteil + PayPal). Eigene Komponente, weil er deutlich mehr Zustand
        // hält als die übrigen Blöcke.
        return (
          <FallFreischaltungBlock
            key={block.id}
            mediationId={mediationId}
            title={cfgStr(c, "title")}
            description={cfgStr(c, "description")}
          />
        );
      case "bezahlung": {
        const price = cfgNum(c, "price", 0);
        const currency = cfgStr(c, "currency") || "EUR";
        const isPaid = purchased.has(block.id);
        return (
          <div key={block.id} className="rounded-2xl border border-amber-300 bg-amber-50/70 p-4">
            <p className="text-sm font-semibold text-amber-900">💳 {cfgStr(c, "title") || "Bonus-Leistung"}</p>
            {cfgStr(c, "description") && <p className="mt-0.5 text-sm text-amber-800">{cfgStr(c, "description")}</p>}
            {isPaid ? (
              <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">✓ Freigeschaltet</p>
                <p className="whitespace-pre-wrap text-sm text-neutral-700">{cfgStr(c, "unlock_text") || "Diese Leistung ist freigeschaltet."}</p>
              </div>
            ) : (
              <div className="mt-3">
                <p className="mb-2 text-sm font-semibold text-amber-900">{price.toFixed(2)} {currency}</p>
                <BonusPayButton mediationId={mediationId} blockId={block.id} onPaid={loadPurchases} />
              </div>
            )}
          </div>
        );
      }
      case "termin":
        return <div key={block.id} className="rounded-2xl border border-teal-200 bg-teal-50/60 p-4 text-sm text-teal-700">📅 Terminvereinbarung – siehe Kalender/Termin-Bereich dieses Falls.</div>;
      case "feedback":
        return <div key={block.id} className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 text-sm text-amber-700">★ Feedback-Fragebogen erscheint zum passenden Zeitpunkt.</div>;
      case "vertrag":
        return <div key={block.id} className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-4 text-sm text-indigo-700">§ Vertrag / Dokument – siehe Vertrags-Bereich dieses Falls.</div>;
      case "ki_prompt":
      case "ki_zusammenfassung":
      case "ki_reframing":
      case "ki_interessen":
      case "ki_optionen":
      case "ki_gemeinsamkeiten":
      case "individuell":
      case "ergebnis":
        // Für Teilnehmer nicht direkt sichtbar (KI/individuell/Ergebnis laufen
        // über eigene Wege bzw. im Hintergrund).
        return null;
      default:
        return null;
    }
  }
}
