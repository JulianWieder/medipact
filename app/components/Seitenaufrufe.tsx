"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Meldet jeden Seitenwechsel an /api/seitenaufruf (siehe lib/seitenaufrufe.ts).
 * Ohne Cookie, ohne Storage, ohne Kennung - deshalb unabhaengig vom
 * Cookie-Consent, anders als `Analytics.tsx`.
 *
 * Gesendet wird nur der Pfad, nie die Query: dort stehen Tokens.
 */
export default function Seitenaufrufe() {
  const pfad = usePathname();
  const vorher = useRef<string | null>(null);

  useEffect(() => {
    // Gleicher Pfad = kein neuer Aufruf (Strict Mode feuert Effekte doppelt).
    if (!pfad || pfad === vorher.current) return;

    let von: string | null = vorher.current;
    if (von === null && document.referrer) {
      try {
        const host = new URL(document.referrer).host;
        von = host === window.location.host ? null : host;
      } catch {
        von = null;
      }
    }
    vorher.current = pfad;

    const daten = JSON.stringify({ pfad, von });
    if (!navigator.sendBeacon?.("/api/seitenaufruf", daten)) {
      fetch("/api/seitenaufruf", { method: "POST", body: daten, keepalive: true }).catch(
        () => {},
      );
    }
  }, [pfad]);

  return null;
}
