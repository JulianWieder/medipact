"use client";

import {
  forwardRef,
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { useScroll, type MotionValue } from "framer-motion";

/**
 * Standard pattern: scroll-pinned section.
 *
 * `useScrollPin(ref)` wires up the scroll listener and returns a
 * `scrollYProgress` MotionValue (0 → 1) — call it (and any
 * `useTransform(scrollYProgress, ...)` derived from it) directly in your
 * own component body, NOT inside a callback/render-prop. Calling hooks
 * inside a callback violates React's rules-of-hooks even though it may
 * appear to work, because React can no longer guarantee a stable hook call
 * order for that component.
 *
 * `ScrollPinFrame` renders the actual markup: a tall `heightVh` container
 * with a `sticky` inner viewport. Attach the same ref you passed to
 * `useScrollPin` to it.
 *
 * Used by HeroScrollPin.tsx and ImagePinHero.tsx. Reuse this pair for any
 * future "image/section pins, content fades on scroll" effect (ai.gov-style)
 * instead of re-implementing the useScroll/sticky wiring from scratch.
 *
 * Auf dem Handy (< sm) pinnt der Frame NICHT: der Hero-Text ist dort oft
 * hoeher als der Viewport, und ein gepinnter Frame mit overflow-hidden
 * schneidet ihn oben/unten ab, ohne dass man hinscrollen kann. Unter `sm`
 * ist die Section deshalb normaler Fluss (min. 100dvh hoch). Scroll-
 * gebundene Fades mit `usePinActive()` an den Pin koppeln, sonst faden
 * auf dem Handy Inhalte weg, waehrend man sie noch liest.
 *
 * Kinder liegen in einer Flex-Spalte: Content mit `flex-1` fuellt die
 * Hoehe, Elemente davor (z.B. HeroTagline) stehen im Fluss darueber statt
 * absolut — so kann sich nichts ueberlagern, egal wie hoch der Content ist.
 *
 * Example:
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null);
 * const scrollYProgress = useScrollPin(ref);
 * const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
 * return (
 *   <ScrollPinFrame ref={ref} heightVh={130}>
 *     <motion.div style={{ scale }}>...</motion.div>
 *   </ScrollPinFrame>
 * );
 * ```
 */
export function useScrollPin<T extends HTMLElement = HTMLDivElement>(
  ref: RefObject<T | null>
): MotionValue<number> {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  return scrollYProgress;
}

/** true, sobald ScrollPinFrame wirklich pinnt (ab `sm`). SSR/erster Render: false. */
export function usePinActive(): boolean {
  const [active, setActive] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const update = () => setActive(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return active;
}

export const ScrollPinFrame = forwardRef<
  HTMLDivElement,
  {
    heightVh?: number;
    id?: string;
    className?: string;
    children: ReactNode;
  }
>(function ScrollPinFrame({ heightVh = 150, id, className = "", children }, ref) {
  return (
    <section
      ref={ref}
      id={id}
      // KEIN overflow-hidden hier: das macht die Section zum "Scroll-Container"
      // und bricht position:sticky des inneren Frames → der Hero pinnt nicht
      // und die Rest-Höhe (heightVh − 100vh) liegt als leerer Streifen unter
      // dem Frame (sichtbar, sobald die Section eine bg-Farbe hat). Das
      // innere sticky-div clippt selbst (overflow-hidden), z.B. den Zoom.
      className={`relative isolate sm:h-[var(--pin-h)] ${className}`}
      style={{ "--pin-h": `${heightVh}vh` } as CSSProperties}
    >
      <div className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden sm:sticky sm:top-0 sm:h-screen sm:h-[100dvh] sm:min-h-0">
        {children}
      </div>
    </section>
  );
});
