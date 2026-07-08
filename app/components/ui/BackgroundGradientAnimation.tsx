// ── Stripe-Style Background Gradient Animation ──────────────────────────────
//
// Nachbau des bekannten Aceternity-/Stripe-Effekts OHNE neue Dependency:
// mehrere stark geblurrte Farb-Blobs in Accent-Tönen wandern langsam per
// CSS-Keyframes (nur transform → GPU, kein Layout-Thrash). Bewusst als
// Server-Komponente ohne JS/Hooks: rendert mit dem ersten Paint (kein
// Hydration-Delay → kein LCP-Risiko, vgl. Kommentar in HeroScrollPin).
//
// Keyframes + Klassen (.gradient-blob-*) liegen in app/globals.css.
// Einsatz: absolut positionierter Layer, z.B. über dem Hero-Foto mit
// mix-blend-screen, oder solo als Sektions-Hintergrund.

import type { CSSProperties } from "react";

const BLOBS: { className: string; style: CSSProperties }[] = [
  {
    // groß, mittig-links – trägt den Grundschimmer hinter der Headline
    className: "gradient-blob gradient-blob-1",
    style: {
      width: "55vw",
      height: "55vw",
      top: "-10%",
      left: "-10%",
      background:
        "radial-gradient(circle at center, var(--color-accent-400) 0%, transparent 60%)",
    },
  },
  {
    className: "gradient-blob gradient-blob-2",
    style: {
      width: "45vw",
      height: "45vw",
      top: "20%",
      left: "25%",
      background:
        "radial-gradient(circle at center, var(--color-accent-600) 0%, transparent 60%)",
    },
  },
  {
    className: "gradient-blob gradient-blob-3",
    style: {
      width: "40vw",
      height: "40vw",
      bottom: "-15%",
      right: "5%",
      background:
        "radial-gradient(circle at center, var(--color-accent-200) 0%, transparent 60%)",
    },
  },
  {
    // kühler Kontrastton, sehr subtil (Stripe mischt immer eine Zweitfarbe)
    className: "gradient-blob gradient-blob-4",
    style: {
      width: "38vw",
      height: "38vw",
      top: "-5%",
      right: "-8%",
      background: "radial-gradient(circle at center, #818cf8 0%, transparent 60%)",
    },
  },
];

export function BackgroundGradientAnimation({
  className = "",
}: {
  /** Positionierung/Blend des Layers, z.B. "absolute inset-0 mix-blend-screen opacity-60". */
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none overflow-hidden ${className}`}
    >
      {BLOBS.map((b, i) => (
        <div key={i} className={b.className} style={b.style} />
      ))}
    </div>
  );
}
