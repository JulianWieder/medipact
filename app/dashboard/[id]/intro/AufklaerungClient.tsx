"use client";

// ── Aufklärungs-Intro für die eingeladene Partei ────────────────────────────
//
// Problem: Die eingeladene Partei wurde nach der Einladungs-Annahme direkt
// mit Rechnungsdaten + Zahlung konfrontiert. Diese Seite schaltet davor eine
// Aufklärung: Was ist passiert? Was ist Mediation? Wie läuft es auf medipact
// ab? — inklusive Erklär-Video (Platzhalter: Synthesia; via WorkflowManager
// tauschbar) und weiterführenden Links (Ratgeber, Konfliktarten, Cases).
//
// Inhalt kommt aus dem WFM-Schritt einladung/gegenseite_aufklaerung
// (Migration t2u3v4w5x6y7, required_roles=other_party) und ist im
// Seiten-Designer pflegbar. Fallback-Blöcke, falls die Migration noch nicht
// gelaufen ist.
//
// Abschluss = zustimmung-Block (ga_verstanden) als block_response → die
// Fall-Seite (MediationClient) leitet other_party ohne diese Bestätigung
// hierher um und lässt sie danach zur Checkliste (Rechnung/Zahlung) durch.

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { encodeId } from "@/lib/ids";

interface FlowBlock {
  id: string;
  type: string;
  config: Record<string, unknown>;
}

const STORY_TYPES = new Set(["textausgabe", "hinweis"]);

function cfgStr(c: Record<string, unknown>, k: string): string {
  const v = c?.[k];
  return typeof v === "string" ? v : "";
}

function cfgLinks(c: Record<string, unknown>): { label: string; url: string }[] {
  const v = c?.links;
  if (!Array.isArray(v)) return [];
  return v.filter(
    (l): l is { label: string; url: string } =>
      typeof l === "object" && l !== null &&
      typeof (l as { label?: unknown }).label === "string" &&
      typeof (l as { url?: unknown }).url === "string",
  );
}

// Fallback, falls die Seed-Migration (gegenseite_aufklaerung) noch nicht
// gelaufen ist.
const FALLBACK_BLOCKS: FlowBlock[] = [
  {
    id: "ga_intro",
    type: "textausgabe",
    config: {
      title: "Du wurdest zu einer Mediation eingeladen.",
      text:
        "Die andere Seite hat auf medipact eine Mediation begonnen und dich " +
        "eingeladen, daran teilzunehmen. Das ist kein Schritt gegen dich — " +
        "es ist der Versuch, den Konflikt fair und ohne Gericht zu klären.",
    },
  },
  {
    id: "ga_video",
    type: "video",
    config: {
      url: "https://share.synthesia.io/embeds/videos/ecc6e794-b1df-4c8e-85ca-f137b90c3f2f",
      title: "Was Mediation ist — kurz erklärt",
    },
  },
  {
    id: "ga_grundsaetze",
    type: "textausgabe",
    config: {
      title: "Was Mediation ist — und was nicht.",
      text:
        "FREIWILLIG: Niemand zwingt dich. VERTRAULICH: Deine Eingaben sieht " +
        "der Mediator — nicht die andere Seite. ALLPARTEILICH: Der Mediator " +
        "steht auf keiner Seite. ERGEBNISOFFEN: Eine Lösung zählt nur, wenn " +
        "beide Seiten sie tragen.",
    },
  },
  {
    id: "ga_ablauf",
    type: "textausgabe",
    config: {
      title: "So geht es hier weiter.",
      text:
        "1. Du schaust dir alles in Ruhe an.\n2. Beide Seiten schalten das " +
        "Verfahren frei — die Kosten werden vorher transparent angezeigt.\n" +
        "3. Danach beginnt die eigentliche Mediation mit deinem Mediator.",
    },
  },
  {
    id: "ga_verstanden",
    type: "zustimmung",
    config: {
      text:
        "Ich habe verstanden, worum es geht: Ich wurde zu einer freiwilligen, " +
        "vertraulichen Mediation eingeladen. Ich schaue mir jetzt die " +
        "nächsten Schritte an — eine Verpflichtung entsteht dadurch noch nicht.",
    },
  },
];

type Screen =
  | { kind: "story"; blocks: FlowBlock[]; isIntro: boolean }
  | { kind: "video"; block: FlowBlock }
  | { kind: "zustimmung"; block: FlowBlock };

function videoEmbed(url: string) {
  // Datei-URLs nativ abspielen, alles andere (Synthesia/YouTube/Vimeo) als
  // iframe-Embed.
  if (/\.(mp4|webm|mov|ogg)(\?|$)/i.test(url)) {
    return (
      <video controls className="aspect-video w-full rounded-2xl bg-neutral-900" src={url} />
    );
  }
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-neutral-900 shadow-lg">
      <iframe
        src={url}
        title="Erklär-Video"
        allow="encrypted-media; fullscreen"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  );
}

export default function AufklaerungClient({ mediationId }: { mediationId: string }) {
  const router = useRouter();
  const [blocks, setBlocks] = useState<FlowBlock[] | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [idx, setIdx] = useState(0);

  const caseUrl = `/dashboard/${encodeId(Number(mediationId))}`;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // 1. Blöcke laden (Phase einladung ist paywall-frei)
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
              s.key === "gegenseite_aufklaerung" &&
              Array.isArray(s.blocks) &&
              s.blocks.length,
          );
          if (step) loaded = step.blocks as FlowBlock[];
        }
      } catch { /* Fallback bleibt */ }

      // 2. Schon bestätigt? Dann direkt zur Fall-Seite (Checkliste).
      try {
        const res = await fetch(
          `/api/mediations/${mediationId}/block-responses?phase=einladung&step_key=gegenseite_aufklaerung`,
          { cache: "no-store" },
        );
        if (res.ok) {
          const rows: { block_id: string; value: unknown }[] = await res.json();
          const v = Array.isArray(rows)
            ? rows.find((r) => r.block_id === "ga_verstanden")?.value
            : undefined;
          const done =
            typeof v === "object" && v !== null
              ? (v as { agreed?: boolean }).agreed === true
              : v === true;
          if (done) {
            router.replace(caseUrl);
            return;
          }
        }
      } catch { /* optional */ }

      if (!cancelled) setBlocks(loaded);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediationId]);

  const screens = useMemo<Screen[]>(() => {
    if (!blocks) return [];
    const out: Screen[] = [];
    let story: FlowBlock[] = [];
    const flush = () => {
      if (story.length) {
        out.push({ kind: "story", blocks: story, isIntro: out.length === 0 });
        story = [];
      }
    };
    for (const b of blocks) {
      if (STORY_TYPES.has(b.type)) story.push(b);
      else if (b.type === "video") { flush(); out.push({ kind: "video", block: b }); }
      else if (b.type === "zustimmung") { flush(); out.push({ kind: "zustimmung", block: b }); }
    }
    flush();
    return out;
  }, [blocks]);

  const screen = screens[idx];
  const progress = screens.length ? Math.round(((idx + 1) / screens.length) * 100) : 0;

  const finish = useCallback(() => {
    // Bestätigung persistieren, dann zur Checkliste (Rechnungsdaten/Zahlung).
    fetch(`/api/mediations/${mediationId}/block-responses`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phase: "einladung",
        step_key: "gegenseite_aufklaerung",
        block_id: "ga_verstanden",
        block_type: "zustimmung",
        value: { agreed: true, at: new Date().toISOString() },
        submitted: true,
      }),
    })
      .catch(() => { /* trotzdem weiter */ })
      .finally(() => router.replace(caseUrl));
  }, [mediationId, router, caseUrl]);

  const next = useCallback(() => {
    if (idx >= screens.length - 1) {
      finish();
      return;
    }
    setIdx((i) => i + 1);
  }, [idx, screens.length, finish]);

  const back = useCallback(() => setIdx((i) => Math.max(i - 1, 0)), []);

  return (
    <main className="fixed inset-0 z-40 flex flex-col overflow-hidden bg-gradient-to-b from-white via-accent-50/40 to-white">
      <style>{`
        @keyframes gaIn { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
        .ga-in { animation: gaIn .45s cubic-bezier(.22,.8,.36,1) both; }
      `}</style>
      <div className="h-1 w-full bg-neutral-100">
        <div className="h-full bg-accent-500 transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>
      <div className="flex items-center justify-between px-5 py-4 sm:px-8">
        <button onClick={back} disabled={idx === 0} className="btn btn-ghost text-sm disabled:invisible">← Zurück</button>
        <p className="eyebrow">Deine Einladung · vertraulich</p>
        <span className="w-20" />
      </div>
      <div className="flex flex-1 items-start justify-center overflow-y-auto px-5 pb-10 pt-4 sm:px-8">
        {!blocks ? (
          <p className="mt-24 text-neutral-400">Einen Moment …</p>
        ) : screen ? (
          <div key={idx} className="ga-in w-full max-w-2xl">{renderScreen(screen)}</div>
        ) : null}
      </div>
    </main>
  );

  function renderScreen(s: Screen) {
    if (s.kind === "video") {
      const url = cfgStr(s.block.config, "url");
      const title = cfgStr(s.block.config, "title");
      return (
        <div>
          {title && <h1 className="heading-2 mb-6 text-neutral-900">{title}</h1>}
          {url ? (
            videoEmbed(url)
          ) : (
            // Platzhalter, solange noch kein Video hinterlegt ist.
            <div className="flex aspect-video w-full items-center justify-center rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50">
              <p className="px-8 text-center text-sm text-neutral-400">
                Hier erscheint bald ein kurzes Erklär-Video.
              </p>
            </div>
          )}
          <button onClick={next} className="btn btn-primary mt-10">Weiter</button>
        </div>
      );
    }

    if (s.kind === "zustimmung") {
      const c = s.block.config ?? {};
      return (
        <div>
          <h2 className="heading-2 mb-6 text-neutral-900">Alles klar so weit?</h2>
          <p className="mb-6 whitespace-pre-wrap text-base leading-8 text-neutral-600">{cfgStr(c, "text")}</p>
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-neutral-300 bg-white p-5 transition hover:border-accent-400">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 h-5 w-5"
            />
            <span className="text-sm font-semibold text-neutral-800">
              Verstanden — weiter zu den nächsten Schritten.
            </span>
          </label>
          <button
            onClick={next}
            disabled={!agreed}
            className="btn btn-primary mt-8 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Weiter
          </button>
        </div>
      );
    }

    // story: textausgabe / hinweis (inkl. optionaler Link-Karten)
    const lead = s.blocks[0];
    const leadTitle = cfgStr(lead.config, "title");
    return (
      <div>
        {leadTitle && <h1 className="heading-1 mb-6 text-neutral-900">{leadTitle}</h1>}
        <div className="space-y-4">
          {s.blocks.map((b) => {
            const text = cfgStr(b.config, "text");
            const links = cfgLinks(b.config);
            return (
              <div key={b.id}>
                {text.trim() &&
                  (b.type === "hinweis" ? (
                    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-800">{text}</div>
                  ) : (
                    <p className="whitespace-pre-wrap text-lg leading-8 text-neutral-600">{text}</p>
                  ))}
                {links.length > 0 && (
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {links.map((l) => (
                      <a
                        key={l.url}
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-2xl border border-neutral-200 bg-white p-4 text-sm font-semibold text-neutral-800 shadow-sm transition hover:border-accent-400 hover:text-accent-700"
                      >
                        {l.label} <span className="text-accent-500">→</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <button onClick={next} className="btn btn-primary mt-10">
          {s.isIntro ? "Mehr erfahren" : "Weiter"}
        </button>
      </div>
    );
  }
}
