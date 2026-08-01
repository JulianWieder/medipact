"use client";

import Icon from "@/app/components/ui/Icon";

// Geteilte, rein darstellende Bausteine für die Inhaltsarten eines Schritts.
// Werden vom Phasen-Renderer (PhaseNotesClient) oberhalb der Notiz-Eingabe
// angezeigt, sodass ein im WorkflowManager konfigurierter Video-/Videokonferenz-/
// Frage-Schritt in JEDER Phase korrekt rendert (nicht nur in der Einleitung).
//
// Bewusst ohne eigenen Zustand oder Backend-Aufrufe: die Felder kommen bereits
// fertig aus GET /mediations/{id}/phase-steps. Stateful-Inhaltsarten (Vertrag,
// Feedback, Termin) haben eigene Komponenten.

type StepContentMeta = {
  content_types?: string[] | null;
  video_url?: string | null;
  meeting_url?: string | null;
  question?: string | null;
};

/** Wandelt eine Video-URL in eine einbettbare Embed-URL (YouTube/Vimeo) um, sonst null. */
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

export default function StepContentBlocks({ meta }: { meta?: StepContentMeta | null }) {
  if (!meta) return null;
  const types = meta.content_types ?? [];
  const has = (t: string) => types.includes(t);

  const showFrage = has("frage") && !!meta.question?.trim();
  const showVideo = has("video") && !!meta.video_url?.trim();
  const showKonferenz = has("videokonferenz");

  if (!showFrage && !showVideo && !showKonferenz) return null;

  return (
    <div className="mb-6 ml-11 max-w-2xl space-y-4">
      {showFrage && (
        <div className="rounded-2xl border border-violet-200 bg-violet-50/60 p-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-violet-600">Frage</p>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-800">{meta.question}</p>
        </div>
      )}

      {showVideo && meta.video_url && (
        <div className="overflow-hidden rounded-2xl border border-rose-200 bg-white">
          <div className="border-b border-rose-100 bg-rose-50/60 px-4 py-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-rose-600">Video</p>
          </div>
          {(() => {
            const embed = toEmbedUrl(meta.video_url);
            if (embed) {
              return (
                <div className="aspect-video w-full bg-black">
                  <iframe
                    src={embed}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Video"
                  />
                </div>
              );
            }
            if (isDirectVideoFile(meta.video_url)) {
              return <video src={meta.video_url} controls className="aspect-video w-full bg-black" />;
            }
            return (
              <div className="p-4">
                <a
                  href={meta.video_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-rose-700 underline break-all"
                >
                  ▶ Video öffnen
                </a>
              </div>
            );
          })()}
        </div>
      )}

      {showKonferenz && (
        <div className="rounded-2xl border border-sky-200 bg-sky-50/60 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-sky-600">Videokonferenz</p>
          {meta.meeting_url?.trim() ? (
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={meta.meeting_url}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary text-sm"
              >
                <Icon name="video" color="currentColor" /> Videoraum beitreten
              </a>
              <a
                href={meta.meeting_url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-sky-700 underline break-all"
              >
                {meta.meeting_url}
              </a>
            </div>
          ) : (
            <p className="text-sm text-neutral-500">
              Der Mediator hinterlegt hier den Link zum Videoraum (z. B. Google Meet).
            </p>
          )}
        </div>
      )}
    </div>
  );
}
