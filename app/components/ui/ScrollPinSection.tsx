"use client";

import { forwardRef, type ReactNode, type RefObject } from "react";
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
      className={`relative isolate overflow-hidden ${className}`}
      style={{ height: `${heightVh}vh` }}
    >
      <div className="sticky top-0 h-screen h-[100dvh] w-full overflow-hidden">
        {children}
      </div>
    </section>
  );
});
