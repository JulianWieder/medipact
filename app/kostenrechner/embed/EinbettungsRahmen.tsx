"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Nachrichtentyp, auf den das Snippet im Einbettungscode hört (/fuer-berater). */
export const HOEHEN_NACHRICHT = "medipact-kostenrechner-hoehe";

/**
 * Hülle des Widgets unter /kostenrechner/embed. Zwei Dinge, die nur im
 * fremden iframe nötig sind:
 *
 * 1. Höhe melden. Der Rechner ändert seine Höhe mit jeder Eingabe; das
 *    Snippet beim Einbinder setzt die iframe-Höhe aus dieser Nachricht.
 *    Ohne Snippet greift die feste min-height aus dem Code — dann scrollt
 *    das iframe eben selbst.
 * 2. Links nach draußen öffnen. Jede andere medipact-Seite sendet
 *    X-Frame-Options: SAMEORIGIN und bliebe im iframe leer. Statt
 *    KostenrechnerClient umzubauen, bekommt hier jeder angeklickte Link
 *    target="_blank" — vor dem Klick-Handler von next/link (Capture-Phase),
 *    der Links mit fremdem target dem Browser überlässt.
 */
export default function EinbettungsRahmen({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.parent === window) return;
    const melden = () =>
      window.parent.postMessage(
        { type: HOEHEN_NACHRICHT, hoehe: Math.ceil(el.getBoundingClientRect().height) },
        "*",
      );
    const beobachter = new ResizeObserver(melden);
    beobachter.observe(el);
    melden();
    return () => beobachter.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      onClickCapture={(e) => {
        const a = (e.target as HTMLElement).closest("a");
        if (a) {
          a.target = "_blank";
          a.rel = "noopener";
        }
      }}
    >
      {children}
    </div>
  );
}
