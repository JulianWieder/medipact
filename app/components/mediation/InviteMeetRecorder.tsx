"use client";

import { useState } from "react";
import Icon from "@/app/components/ui/Icon";

type Props = {
  mediationId: string | number;
  /** Wird mit dem meet_recording_token aufgerufen, sobald die Aufnahme fertig ist. */
  onChange: (token: string) => void;
  /** Wird mit dem automatisch erzeugten Transkript aufgerufen. */
  onTranscript?: (transcript: string) => void;
  /** Ob die Botschaft Pflicht ist (steuert nur die Beschriftung). */
  required?: boolean;
};

type Status =
  | "idle"
  | "starting"
  | "awaiting" // Meet-Raum geöffnet, Nutzer nimmt auf
  | "polling" // fragt Google nach der fertigen Aufnahme
  | "ready"
  | "error";

type Kind = "video" | "audio";

export default function InviteMeetRecorder({
  mediationId,
  onChange,
  onTranscript,
  required = false,
}: Props) {
  const [kind, setKind] = useState<Kind>("video");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [joinUrl, setJoinUrl] = useState("");
  const [recordingUri, setRecordingUri] = useState("");
  const [pollHint, setPollHint] = useState("");

  async function startRecording() {
    setError("");
    setStatus("starting");
    try {
      const res = await fetch(`/api/mediations/${mediationId}/invites/meet-recording/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.token || !data?.join_url) {
        setError(data?.detail ?? data?.error ?? "Meet-Aufnahme konnte nicht gestartet werden.");
        setStatus("error");
        return;
      }
      setToken(data.token);
      setJoinUrl(data.join_url);
      setStatus("awaiting");
      // Meet-Raum in neuem Tab öffnen; die Aufnahme startet dort automatisch.
      window.open(data.join_url, "_blank", "noopener,noreferrer");
    } catch {
      setError("Server nicht erreichbar.");
      setStatus("error");
    }
  }

  async function fetchRecording() {
    if (!token) return;
    setError("");
    setStatus("polling");
    setPollHint("Google verarbeitet die Aufnahme – das kann ein bis zwei Minuten dauern…");

    // Bis zu ~3 Minuten alle 6s pollen.
    const maxAttempts = 30;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const res = await fetch(
          `/api/mediations/${mediationId}/invites/meet-recording/${token}/status`,
          { cache: "no-store" },
        );
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          setError(data?.detail ?? data?.error ?? "Status konnte nicht abgerufen werden.");
          setStatus("error");
          return;
        }

        if (data.status === "ready") {
          setRecordingUri(data.recording_uri ?? "");
          onChange(token);
          if (onTranscript && typeof data.transcript === "string") {
            onTranscript(data.transcript);
          }
          setStatus("ready");
          return;
        }

        if (data.status === "recording") {
          setPollHint("Du bist offenbar noch im Meet-Raum. Beende das Meeting, dann läuft die Verarbeitung an…");
        } else if (data.status === "pending") {
          setPollHint("Warte auf den Start der Aufnahme. Bist du dem Meet-Raum schon beigetreten?");
        } else {
          setPollHint("Google verarbeitet die Aufnahme – das kann ein bis zwei Minuten dauern…");
        }
      } catch {
        // Netzwerk-Aussetzer tolerieren und weiter pollen.
      }
      await new Promise((r) => setTimeout(r, 6000));
    }

    setError("Die Aufnahme ist noch nicht bereit. Bitte in einem Moment erneut „Aufnahme abrufen“ klicken.");
    setStatus("awaiting");
  }

  function reset() {
    setToken("");
    setJoinUrl("");
    setRecordingUri("");
    setError("");
    setPollHint("");
    setStatus("idle");
    onChange("");
    onTranscript?.("");
  }

  const label = kind === "audio" ? "Audio-Botschaft" : "Video-Botschaft";

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5">
      <p className="text-sm font-bold text-neutral-800">
        Persönliche {label} über Google Meet{" "}
        {required ? (
          <span className="font-normal text-red-500">(Pflicht)</span>
        ) : (
          <span className="font-normal text-neutral-400">(optional)</span>
        )}
      </p>
      <p className="mt-1 text-sm text-neutral-500">
        Die Aufnahme läuft über einen Google-Meet-Raum und wird sicher bei Google gespeichert –
        nicht auf deinem Gerät. Der gesprochene Inhalt wird automatisch transkribiert und ins
        Textfeld unten übertragen.
      </p>

      {/* Video/Audio-Umschalter */}
      {(status === "idle" || status === "error") && (
        <div className="mt-4 inline-flex rounded-xl border border-neutral-200 bg-neutral-50 p-1">
          <button
            type="button"
            onClick={() => setKind("video")}
            className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition ${
              kind === "video" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"
            }`}
          >
            <Icon name="video" color="currentColor" /> Video
          </button>
          <button
            type="button"
            onClick={() => setKind("audio")}
            className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition ${
              kind === "audio" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"
            }`}
          >
            <Icon name="mic" color="currentColor" /> Nur Audio
          </button>
        </div>
      )}

      {kind === "audio" && (status === "idle" || status === "error") && (
        <p className="mt-2 text-xs text-neutral-400">
          Tipp: Schalte im Meet-Raum deine Kamera aus, damit nur deine Stimme aufgenommen wird.
        </p>
      )}

      {error && (
        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3">
          <p className="text-sm font-semibold text-red-700">{error}</p>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {(status === "idle" || status === "error") && (
          <button type="button" onClick={startRecording} className="btn btn-secondary">
            <Icon name={kind === "audio" ? "mic" : "video"} color="currentColor" /> Aufnahme in Google Meet starten
          </button>
        )}

        {status === "starting" && (
          <span className="text-sm text-neutral-500">Meet-Raum wird erstellt…</span>
        )}

        {status === "awaiting" && (
          <div className="w-full">
            <div className="rounded-xl border border-accent-200 bg-accent-50 p-4">
              <p className="text-sm font-semibold text-neutral-800">Meet-Raum ist geöffnet</p>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-neutral-600">
                <li>Sprich im geöffneten Google-Meet-Tab deine {label}.</li>
                <li>
                  <strong>Beende das Meeting</strong> (Hörer-Symbol), wenn du fertig bist.
                </li>
                <li>Klicke hier auf „Aufnahme abrufen“.</li>
              </ol>
              {joinUrl && (
                <a
                  href={joinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-sm font-semibold text-accent-700 underline"
                >
                  Meet-Raum erneut öffnen
                </a>
              )}
            </div>
            <div className="mt-3 flex items-center gap-3">
              <button type="button" onClick={fetchRecording} className="btn btn-primary">
                Aufnahme abrufen
              </button>
              <button type="button" onClick={reset} className="btn btn-ghost">
                Abbrechen
              </button>
            </div>
          </div>
        )}

        {status === "polling" && (
          <span className="text-sm text-neutral-500">{pollHint || "Aufnahme wird abgerufen…"}</span>
        )}

        {status === "ready" && (
          <div className="w-full">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-accent-100 px-3 py-1 text-xs font-semibold text-accent-700">
                {label} bereit ✓
              </span>
              {recordingUri && (
                <a
                  href={recordingUri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-accent-700 underline"
                >
                  Aufnahme ansehen
                </a>
              )}
              <button type="button" onClick={reset} className="btn btn-ghost">
                Neu aufnehmen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
