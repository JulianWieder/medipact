"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import {
  SESSION_DEADLINE_STORAGE_KEY,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/session";

/**
 * Sichtbarer Countdown bis zur automatischen Abmeldung — und die Abmeldung
 * selbst.
 *
 * Warum überhaupt clientseitig? Das Cookie läuft nach
 * SESSION_MAX_AGE_SECONDS Inaktivität ab (auth.ts), aber davon merkt der
 * Nutzer nichts, solange er keine Anfrage stellt: Der Tab bleibt offen, die
 * Seite sieht funktionsfähig aus, und der nächste Klick landet unvermittelt
 * auf dem Login. Dieser Timer macht den Ablauf sichtbar und vollzieht ihn
 * aktiv nach.
 *
 * Zwei Uhren müssen synchron bleiben:
 *   - Server: Das JWT-Cookie wird bei JEDER Anfrage erneuert (updateAge: 0).
 *   - Client: Hier zählt eine Frist herunter, die bei Nutzeraktivität
 *     zurückgesetzt wird.
 * Damit die Server-Uhr nicht heimlich abläuft, während jemand nur scrollt und
 * tippt (ohne Seitenwechsel), stößt der Timer bei Aktivität höchstens alle
 * KEEPALIVE_INTERVAL_MS einen Aufruf von /api/auth/session an — der erneuert
 * das Cookie. Ohne das würde der Countdown 59 Minuten anzeigen, während die
 * Session serverseitig längst tot ist.
 *
 * Die Frist liegt im localStorage, damit mehrere offene Tabs dieselbe Uhr
 * teilen: Wer in Tab A arbeitet, wird in Tab B nicht ausgeloggt.
 */

/** Aktivität setzt die Frist höchstens so oft zurück (spart Renders). */
const ACTIVITY_THROTTLE_MS = 10_000;
/** So oft darf Aktivität das Server-Cookie erneuern. */
const KEEPALIVE_INTERVAL_MS = 5 * 60 * 1000;
/** Ab hier wird der Countdown auffällig (Sekunden). */
const WARN_THRESHOLD_SECONDS = 5 * 60;
const DANGER_THRESHOLD_SECONDS = 60;

const ACTIVITY_EVENTS = [
  "pointerdown",
  "keydown",
  "wheel",
  "touchstart",
  "scroll",
] as const;

function formatRemaining(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function readStoredDeadline(): number | null {
  try {
    const raw = window.localStorage.getItem(SESSION_DEADLINE_STORAGE_KEY);
    if (!raw) return null;
    const value = Number(raw);
    return Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
}

function writeStoredDeadline(deadline: number) {
  try {
    window.localStorage.setItem(SESSION_DEADLINE_STORAGE_KEY, String(deadline));
  } catch {
    // Privater Modus o. Ä. — dann eben nur in diesem Tab.
  }
}

type Props = {
  /** `session.expires` vom Server (ISO-String), als erste Frist. */
  expiresAt?: string | null;
};

export default function SessionTimer({ expiresAt }: Props) {
  const [deadline, setDeadline] = useState<number | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);

  const lastActivityRef = useRef(0);
  const lastKeepaliveRef = useRef(0);
  const signedOutRef = useRef(false);

  const performSignOut = useCallback(() => {
    if (signedOutRef.current) return;
    signedOutRef.current = true;
    try {
      window.localStorage.removeItem(SESSION_DEADLINE_STORAGE_KEY);
    } catch {}
    signOut({ callbackUrl: "/auth/login?reason=timeout" });
  }, []);

  // Startfrist: die des Servers, sofern ein anderer Tab nicht schon eine
  // spätere kennt (dort wurde gerade gearbeitet).
  useEffect(() => {
    const serverDeadline = expiresAt ? new Date(expiresAt).getTime() : NaN;
    const fallback = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
    const initial = Number.isFinite(serverDeadline) ? serverDeadline : fallback;
    const stored = readStoredDeadline();
    const next = stored && stored > initial ? stored : initial;
    setDeadline(next);
    writeStoredDeadline(next);
    lastActivityRef.current = Date.now();
    lastKeepaliveRef.current = Date.now();
  }, [expiresAt]);

  // Nutzeraktivität verlängert die Frist.
  useEffect(() => {
    function bump() {
      const now = Date.now();
      if (now - lastActivityRef.current < ACTIVITY_THROTTLE_MS) return;
      lastActivityRef.current = now;

      const next = now + SESSION_MAX_AGE_SECONDS * 1000;
      setDeadline(next);
      writeStoredDeadline(next);

      // Server-Cookie mitziehen, sonst läuft die echte Session ab, während
      // der Countdown noch munter weiterzählt.
      if (now - lastKeepaliveRef.current >= KEEPALIVE_INTERVAL_MS) {
        lastKeepaliveRef.current = now;
        fetch("/api/auth/session", { cache: "no-store" }).catch(() => {});
      }
    }

    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, bump, { passive: true });
    }
    return () => {
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, bump);
      }
    };
  }, []);

  // Andere Tabs: deren Aktivität gilt auch hier.
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== SESSION_DEADLINE_STORAGE_KEY || !e.newValue) return;
      const value = Number(e.newValue);
      if (Number.isFinite(value)) setDeadline(value);
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Sekundentakt. `setInterval` steht in Hintergrund-Tabs still oder wird
  // gedrosselt — deshalb wird die verbleibende Zeit jedes Mal neu aus der
  // Uhrzeit berechnet und nicht heruntergezählt.
  useEffect(() => {
    if (deadline === null) return;

    function tick() {
      const secondsLeft = Math.ceil(((deadline as number) - Date.now()) / 1000);
      setRemaining(secondsLeft);
      if (secondsLeft <= 0) performSignOut();
    }

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [deadline, performSignOut]);

  // Rückkehr in den Tab: sofort prüfen statt bis zum nächsten Tick zu warten.
  useEffect(() => {
    function onVisible() {
      if (document.visibilityState !== "visible") return;
      const stored = readStoredDeadline();
      if (stored && stored > (deadline ?? 0)) {
        setDeadline(stored);
        return;
      }
      if (deadline !== null && deadline - Date.now() <= 0) performSignOut();
    }
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [deadline, performSignOut]);

  // Bis der erste Effekt gelaufen ist, bleibt die Anzeige leer — sonst
  // rechnete der Server eine andere Sekunde aus als der Browser (Hydration).
  if (remaining === null || deadline === null) return null;

  const isDanger = remaining <= DANGER_THRESHOLD_SECONDS;
  const isWarn = !isDanger && remaining <= WARN_THRESHOLD_SECONDS;

  const absolute = new Date(deadline).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const tone = isDanger
    ? "border-red-200 bg-red-50 text-red-700"
    : isWarn
      ? "border-amber-200 bg-amber-50 text-amber-700"
      : "border-neutral-200 bg-neutral-50 text-neutral-500";

  return (
    <div
      title={`Automatische Abmeldung um ${absolute} Uhr. Die Zeit wird durch Aktivität zurückgesetzt.`}
      aria-live={isDanger ? "polite" : "off"}
      className={`hidden items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium tabular-nums transition-colors sm:flex ${tone}`}
    >
      <svg
        className={`h-3.5 w-3.5 shrink-0 ${isDanger ? "animate-pulse" : ""}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v6l3.75 2.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span className="hidden lg:inline">Abmeldung in</span>
      <span>{formatRemaining(remaining)}</span>
    </div>
  );
}
