"use client";

/**
 * Fall-Chat: freier Gruppenchat pro Mediation (alle Parteien + Mediator).
 *
 * Bewusst UNABHÄNGIG vom Workflow — hier können sich die Beteiligten auch
 * über Themen austauschen, die außerhalb der vorgegebenen Schritte liegen.
 *
 * Zwei Darstellungen:
 *  - variant="floating": schwebender Button unten rechts + aufklappbares
 *    Panel (Teilnehmer-Ansicht, wird im Fall-Layout gemountet).
 *  - variant="panel":   eingebettete Fläche (Mediator-Ansicht im FallDetail).
 *
 * Der Chat lädt per Polling (5 s) nur neue Nachrichten (?after=<id>).
 * Bei 402/403 (Paywall / kein Zugriff) blendet sich das Widget aus.
 */

import { useCallback, useEffect, useRef, useState } from "react";

type ChatMessage = {
  id: number;
  body: string;
  created_at: string | null;
  author_name: string;
  author_role: string | null;
  is_own: boolean;
};

const POLL_MS = 5000;

function formatTime(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const today = new Date();
  const sameDay = d.toDateString() === today.toDateString();
  const time = d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
  if (sameDay) return time;
  return `${d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })}, ${time}`;
}

function roleLabel(role: string | null): string | null {
  if (role === "mediator") return "Mediator";
  if (role === "admin") return "Admin";
  return null;
}

export default function MediationChat({
  mediationId,
  variant = "floating",
}: {
  mediationId: number | string;
  variant?: "floating" | "panel";
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [available, setAvailable] = useState(true);
  const [open, setOpen] = useState(variant === "panel");
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [unread, setUnread] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const lastIdRef = useRef(0);
  const knownIdsRef = useRef<Set<number>>(new Set());
  const inFlightRef = useRef(false);
  const openRef = useRef(open);
  const listRef = useRef<HTMLDivElement | null>(null);
  const shouldScrollRef = useRef(true);

  useEffect(() => {
    openRef.current = open;
    if (open) setUnread(0);
  }, [open]);

  // Wichtig: Der setMessages-Updater muss PUR bleiben. Vorher standen hier
  // `lastIdRef`-Zuweisung und ein `setUnread` INNERHALB des Updaters. React
  // ruft Updater in StrictMode doppelt und während des Renders auf — ein
  // setState darin ist ein Render-Phase-Update, das sich selbst neu auslöst
  // ("Too many re-renders") und die Komponente samt Nachrichtenliste killt.
  // Deshalb wird die Duplikat-Erkennung hier über eine Ref gemacht.
  const appendMessages = useCallback((incoming: ChatMessage[]) => {
    const fresh = incoming.filter((m) => !knownIdsRef.current.has(m.id));
    if (fresh.length === 0) return;
    fresh.forEach((m) => knownIdsRef.current.add(m.id));
    lastIdRef.current = Math.max(lastIdRef.current, ...fresh.map((m) => m.id));
    if (!openRef.current) {
      setUnread((u) => u + fresh.filter((m) => !m.is_own).length);
    }
    shouldScrollRef.current = true;
    setMessages((prev) => [...prev, ...fresh]);
  }, []);

  const poll = useCallback(async () => {
    // Überlappende Polls verschlucken sonst Nachrichten: zwei Requests mit
    // demselben `after` liefern dieselben IDs doppelt.
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    try {
      const res = await fetch(
        `/api/mediations/${mediationId}/chat?after=${lastIdRef.current}`,
        { cache: "no-store" },
      );
      if (res.status === 402 || res.status === 403 || res.status === 404) {
        setAvailable(false);
        return;
      }
      // Jeder andere Fehler wurde hier früher stumm verschluckt — ein 401
      // (abgelaufene Session), 422 oder 500 sah für die Nutzer exakt aus wie
      // "Noch keine Nachrichten". Deshalb sichtbar machen.
      if (!res.ok) {
        console.error("Fall-Chat: Laden fehlgeschlagen", res.status);
        setError(`Nachrichten konnten nicht geladen werden (Fehler ${res.status}).`);
        return;
      }
      const data = await res.json();
      setAvailable(true);
      setError(null);
      appendMessages(data.messages ?? []);
    } catch (err) {
      console.error("Fall-Chat: Netzwerkfehler beim Laden", err);
      setError("Keine Verbindung zum Chat.");
    } finally {
      inFlightRef.current = false;
    }
  }, [mediationId, appendMessages]);

  useEffect(() => {
    lastIdRef.current = 0;
    knownIdsRef.current = new Set();
    setMessages([]);
    poll();
    const t = setInterval(poll, POLL_MS);
    return () => clearInterval(t);
  }, [poll]);

  // Nach neuen Nachrichten ans Ende scrollen (nur wenn Panel sichtbar).
  useEffect(() => {
    if (!open || !shouldScrollRef.current) return;
    shouldScrollRef.current = false;
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  const send = useCallback(async () => {
    const body = draft.trim();
    if (!body || sending) return;
    setSending(true);
    try {
      const res = await fetch(`/api/mediations/${mediationId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      if (res.ok) {
        const msg = (await res.json()) as ChatMessage;
        setDraft("");
        setError(null);
        appendMessages([msg]);
        return;
      }
      // Fehlgeschlagenes Senden sah bisher aus wie "nichts passiert": der
      // Entwurf blieb stehen, keine Meldung. Der Entwurf bleibt weiterhin
      // erhalten (nichts geht verloren), aber jetzt mit Begründung.
      const detail = await res.json().catch(() => null);
      console.error("Fall-Chat: Senden fehlgeschlagen", res.status, detail);
      setError(
        res.status === 401
          ? "Sitzung abgelaufen — bitte neu einloggen."
          : `Nachricht konnte nicht gesendet werden (Fehler ${res.status}).`,
      );
    } catch (err) {
      console.error("Fall-Chat: Netzwerkfehler beim Senden", err);
      setError("Nachricht konnte nicht gesendet werden.");
    } finally {
      setSending(false);
    }
  }, [draft, sending, mediationId, appendMessages]);

  if (!available) return null;

  const panel = (
    <div
      className={
        variant === "floating"
          ? "flex h-[28rem] w-80 flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl sm:w-96"
          : "flex h-[28rem] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white"
      }
    >
      {/* Kopf */}
      <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-neutral-900">Fall-Chat</p>
          <p className="text-xs text-neutral-500">
            Alle Beteiligten und der Mediator lesen mit
          </p>
        </div>
        {variant === "floating" && (
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Chat schließen"
            className="rounded-full p-1 text-neutral-400 transition hover:bg-neutral-200 hover:text-neutral-600"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>

      {error && (
        <p className="border-b border-rose-100 bg-rose-50 px-4 py-2 text-xs text-rose-700">
          {error}
        </p>
      )}

      {/* Nachrichten */}
      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {messages.length === 0 && !error && (
          <p className="pt-8 text-center text-sm text-neutral-400">
            Noch keine Nachrichten. Schreib die erste — auch gern zu Themen
            außerhalb der Mediations-Schritte.
          </p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={m.is_own ? "flex justify-end" : "flex justify-start"}>
            <div
              className={
                m.is_own
                  ? "max-w-[85%] rounded-2xl rounded-br-sm bg-accent-600 px-3 py-2 text-white"
                  : "max-w-[85%] rounded-2xl rounded-bl-sm bg-neutral-100 px-3 py-2 text-neutral-900"
              }
            >
              {!m.is_own && (
                <p className="mb-0.5 text-xs font-semibold text-accent-700">
                  {m.author_name}
                  {roleLabel(m.author_role) && (
                    <span className="ml-1 font-normal text-neutral-400">
                      · {roleLabel(m.author_role)}
                    </span>
                  )}
                </p>
              )}
              <p className="whitespace-pre-wrap break-words text-sm">{m.body}</p>
              <p
                className={
                  m.is_own
                    ? "mt-0.5 text-right text-[10px] text-accent-100"
                    : "mt-0.5 text-right text-[10px] text-neutral-400"
                }
              >
                {formatTime(m.created_at)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Eingabe */}
      <div className="flex items-end gap-2 border-t border-neutral-100 px-3 py-2">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          rows={1}
          maxLength={4000}
          placeholder="Nachricht schreiben …"
          className="max-h-28 min-h-[2.5rem] flex-1 resize-none rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-100"
        />
        <button
          type="button"
          onClick={send}
          disabled={sending || !draft.trim()}
          aria-label="Senden"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-600 text-white transition hover:bg-accent-700 disabled:opacity-40"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </div>
    </div>
  );

  if (variant === "panel") return panel;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {open && panel}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Fall-Chat öffnen"
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-accent-600 text-white shadow-xl transition hover:bg-accent-700"
        >
          <svg className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
            <path
              fillRule="evenodd"
              d="M18 10c0 3.866-3.582 7-8 7a8.84 8.84 0 01-2.347-.314c-.4.2-1.317.6-2.653.876-.34.07-.633-.24-.507-.564.226-.58.462-1.35.557-2.048C3.79 13.755 2 11.99 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7z"
              clipRule="evenodd"
            />
          </svg>
          {unread > 0 && (
            <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-rose-500 px-1.5 text-xs font-bold text-white">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>
      )}
    </div>
  );
}
