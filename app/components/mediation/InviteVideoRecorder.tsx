"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  mediationId: string | number;
  videoToken: string;
  onChange: (videoToken: string) => void;
  /** Wird nach erfolgreichem Upload mit dem automatisch transkribierten Text aufgerufen. */
  onTranscript?: (transcript: string) => void;
  /** Ob die Video-Botschaft Pflicht ist (steuert nur die Beschriftung). */
  required?: boolean;
};

type Status =
  | "idle"
  | "requesting"
  | "recording"
  | "uploading"
  | "transcribing"
  | "done"
  | "error";

const MAX_SECONDS = 90;

export default function InviteVideoRecorder({
  mediationId,
  videoToken,
  onChange,
  onTranscript,
  required = false,
}: Props) {
  const [status, setStatus] = useState<Status>(videoToken ? "done" : "idle");
  const [error, setError] = useState("");
  const [transcribeError, setTranscribeError] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      stopStream();
      if (timerRef.current) clearInterval(timerRef.current);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function stopStream() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  async function startRecording() {
    setError("");
    setStatus("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        await videoRef.current.play().catch(() => {});
      }

      const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
        ? "video/webm;codecs=vp9,opus"
        : "video/webm";
      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        stopStream();
        const blob = new Blob(chunksRef.current, { type: mimeType });
        void uploadVideo(blob);
      };

      recorderRef.current = recorder;
      recorder.start();
      setStatus("recording");
      setSeconds(0);
      timerRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s + 1 >= MAX_SECONDS) {
            stopRecording();
          }
          return s + 1;
        });
      }, 1000);
    } catch {
      setStatus("error");
      setError("Kamera/Mikrofon konnte nicht aktiviert werden. Bitte Zugriff erlauben.");
    }
  }

  function stopRecording() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    recorderRef.current?.stop();
  }

  async function uploadVideo(blob: Blob) {
    setStatus("uploading");
    setError("");
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const localUrl = URL.createObjectURL(blob);
    setPreviewUrl(localUrl);

    try {
      const form = new FormData();
      form.append("file", blob, "invite-video.webm");

      const res = await fetch(`/api/mediations/${mediationId}/invites/video`, {
        method: "POST",
        body: form,
      });

      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.video_token) {
        setError(data?.detail ?? data?.error ?? "Video konnte nicht hochgeladen werden.");
        setStatus("error");
        return;
      }

      onChange(data.video_token);
      await transcribeVideo(data.video_token);
    } catch {
      setError("Server nicht erreichbar.");
      setStatus("error");
    }
  }

  async function transcribeVideo(token: string) {
    if (!onTranscript) {
      setStatus("done");
      return;
    }

    setTranscribeError("");
    setStatus("transcribing");
    try {
      const res = await fetch(`/api/mediations/${mediationId}/invites/video/transcribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ video_token: token }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || typeof data?.transcript !== "string") {
        setTranscribeError(
          data?.detail ?? data?.error ?? "Video konnte nicht automatisch transkribiert werden. Bitte Text manuell eingeben.",
        );
      } else {
        onTranscript(data.transcript);
      }
    } catch {
      setTranscribeError("Transkription nicht erreichbar. Bitte Text manuell eingeben.");
    } finally {
      setStatus("done");
    }
  }

  function reset() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
    onChange("");
    onTranscript?.("");
    setStatus("idle");
    setError("");
    setTranscribeError("");
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-sm font-bold text-slate-800">
        Persönliche Video-Botschaft{" "}
        {required ? (
          <span className="font-normal text-red-500">(Pflicht)</span>
        ) : (
          <span className="font-normal text-slate-400">(optional)</span>
        )}
      </p>
      <p className="mt-1 text-sm text-slate-500">
        Nimm eine kurze Video-Nachricht auf. Die andere Seite kann sie ansehen, sobald sie die
        Einladung im System annimmt. Der Inhalt wird automatisch in das Textfeld unten übertragen
        und kann dort bearbeitet werden.
      </p>

      <div className="mt-4">
        {status === "recording" && (
          <div className="overflow-hidden rounded-xl bg-slate-900">
            <video ref={videoRef} className="aspect-video w-full" playsInline muted />
          </div>
        )}

        {(status === "uploading" || status === "transcribing" || status === "done" || status === "error") && previewUrl && (
          <div className="overflow-hidden rounded-xl bg-slate-900">
            <video src={previewUrl} className="aspect-video w-full" controls />
          </div>
        )}

        {error && (
          <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3">
            <p className="text-sm font-semibold text-red-700">{error}</p>
          </div>
        )}

        {transcribeError && (
          <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
            <p className="text-sm font-semibold text-amber-700">{transcribeError}</p>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {(status === "idle" || status === "error") && (
            <button type="button" onClick={startRecording} className="btn btn-secondary">
              🎥 Aufnahme starten
            </button>
          )}

          {status === "requesting" && (
            <span className="text-sm text-slate-500">Kamera wird aktiviert…</span>
          )}

          {status === "recording" && (
            <>
              <button type="button" onClick={stopRecording} className="btn btn-primary">
                Aufnahme beenden
              </button>
              <span className="text-sm font-mono text-slate-500">
                {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")} / {MAX_SECONDS}s
              </span>
            </>
          )}

          {status === "uploading" && (
            <span className="text-sm text-slate-500">Video wird hochgeladen…</span>
          )}

          {status === "transcribing" && (
            <span className="text-sm text-slate-500">Video wird transkribiert…</span>
          )}

          {status === "done" && (
            <>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                Video bereit ✓
              </span>
              <button type="button" onClick={reset} className="btn btn-ghost">
                Erneut aufnehmen
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
