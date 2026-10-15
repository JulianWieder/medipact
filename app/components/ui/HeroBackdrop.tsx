"use client";

import { useEffect, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { motion, type MotionValue } from "framer-motion";
import dynamic from "next/dynamic";

// Nachgeladen statt statisch importiert. Der Wirbel ist ein WebGL-Shader von
// rund 180 Zeilen, und `useDeferredDecoration` (unten) rendert ihn NIE auf dem
// Handy und sonst erst nach `load`. Statisch importiert lag er trotzdem in dem
// Chunk, den jede Marketing-Seite fuer ihren Hero laedt — auf dem Handy also
// Bytes im kritischen Pfad fuer etwas, das dort nie zu sehen ist.
// `ssr: false` ist hier korrekt und nicht bloss erlaubt: `showSwirl` startet
// immer auf false, der Wirbel war noch nie Teil des servergerenderten Markups.
const GradientSwirl = dynamic(
  () =>
    import("@/app/components/ui/GradientSwirl").then((m) => m.GradientSwirl),
  { ssr: false },
);

/**
 * Warten, bis die Seite fertig geladen ist — und nur ab Tablet-Breite.
 *
 * Hintergrund (PageSpeed Mobil, 05.08.2026): das Hero-Foto ist auf jeder
 * Marketing-Seite das LCP-Element, und genau darueber lag der Wirbel als
 * vollflaechige Ebene mit `mix-blend-screen` + `blur-xl` + Dauerrotation. Der
 * Browser muss so den gesamten Hero-Bereich als eigene Compositing-Gruppe
 * rastern, bevor er ein Bild praesentieren kann — bei 4-fach gedrosselter
 * CPU (so testet Lighthouse Mobil) schiebt das den LCP-Frame nach hinten.
 * Dazu kommt die WebGL-Context-Erzeugung beim Mount.
 *
 * Auf dem Handy ist der Wirbel bei 412 px Breite ohnehin kaum als Form zu
 * erkennen — er wird dort gar nicht mehr geladen. Ab `sm` kommt er, aber erst
 * nach `load`, also nachweislich nach dem LCP.
 *
 * Bewusst ohne Resize-Listener: wer das Handy quer dreht, bekommt den Wirbel
 * nicht nachtraeglich. Er ist Dekoration, das rechtfertigt keinen zusaetzlichen
 * Listener auf jeder Seite.
 */
function useDeferredDecoration() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(min-width: 640px)").matches) return;

    let done = false;
    const start = () => {
      if (done) return;
      done = true;
      setReady(true);
    };

    if (document.readyState === "complete") {
      start();
      return;
    }

    window.addEventListener("load", start, { once: true });
    // Sicherheitsnetz: haengt eine Ressource, soll der Wirbel trotzdem kommen.
    const timer = window.setTimeout(start, 3000);
    return () => {
      window.removeEventListener("load", start);
      window.clearTimeout(timer);
    };
  }, []);

  return ready;
}

export function HeroBackdrop({
  image,
  imageAlt,
  scale,
}: {
  image: StaticImageData;
  imageAlt: string;
  scale?: MotionValue<number>;
}) {
  const showSwirl = useDeferredDecoration();

  return (
    <>
      {/* 1. Foto – Klar und hell */}
      <motion.div
        className="absolute inset-0"
        style={scale ? { scale } : undefined}
      >
        {/*
          `preload` statt `priority`: seit Next 16 ist `priority` deprecated,
          `preload` heisst dasselbe (Bild kommt per <link rel="preload"> in den
          <head>, wird also gefunden, bevor der Parser im <body> ankommt) und
          sagt es klarer. `loading` braucht es dazu wirklich nicht: `preload`
          setzt das Bild intern auf `eager`.

          `fetchPriority` bringt es aber NICHT mit — der Wert wird von Next
          nur durchgereicht (get-img-props.js schreibt ihn ans <img>,
          image-component.js in ImagePreload an den <link rel="preload">).
          Ohne ihn steht an beiden Stellen gar kein fetchpriority-Attribut,
          und ein Bild-Preload ohne fetchpriority landet in Chrome in der
          Prioritaetsklasse "Low" — also HINTER CSS, Fonts und den
          JS-Chunks, mit denen er sich auf dem Handy die Leitung teilt.
          Genau das meldet Lighthouse als "LCP-Anfragenlimitierung"
          (PageSpeed Mobil 03.09.2026: LCP 4,4 s bei FCP 2,6 s — die 1,8 s
          dazwischen war das wartende Hero-Foto).

          `quality={55}`: das Foto liegt hinter zwei kraeftigen Schwarz-
          Gradienten (siehe 2. und 3.). Kompressionsartefakte sind darunter
          nicht zu sehen, die eingesparten Bytes auf dem Handy schon. Der Wert
          muss in `images.qualities` (next.config.ts) stehen, sonst rundet Next
          auf den naechsten erlaubten.
        */}
        <Image
          src={image}
          alt={imageAlt}
          fill
          preload
          fetchPriority="high"
          quality={55}
          sizes="100vw"
          style={{ objectFit: "cover" }}
          className="opacity-100"
        />
      </motion.div>

      {/* 2. Lesbarkeits-Gradient links – JETZT KRÄFTIGER FÜR DIE SCHRIFT */}
      {/* Startet bei 60% Schwarz links und blendet schnell aus, damit das Bild in der Mitte hell bleibt */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-neutral-950/80 via-neutral-950/20 to-transparent pointer-events-none" />

      {/* 3. Vertikaler Fade nach unten */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent pointer-events-none" />

      {/* 4. Stripe-Wirbel – MEHR KONTRAST & SCHNELLERE BEWEGUNG */}
      {/* - `mix-blend-screen` sorgt dafür, dass die Farben auf hellem Grund nicht ausbrennen */}
      {/* - `animate-[spin_8s_linear_infinite]` (oder pulse) beschleunigt die CSS-Standard-Drehung */}
      {/* - Erst nach `load` und erst ab sm – Begründung an useDeferredDecoration */}
      {showSwirl && (
        <div className="absolute right-[-20%] top-[-10%] z-10 h-[120%] w-[85%] opacity-95 pointer-events-none mix-blend-screen blur-xl animate-[spin_10s_linear_infinite]">
          <GradientSwirl className="h-full w-full" />
        </div>
      )}
    </>
  );
}
