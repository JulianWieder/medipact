"use client";

import { useEffect, useState } from "react";
import Image, { type StaticImageData } from "next/image";

type Props = {
  src: StaticImageData;
  alt: string;
  num: string;
};

export function StepImage({ src, alt, num }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`${alt} – Bild vergrößern`}
        className="relative hidden h-20 w-20 shrink-0 cursor-zoom-in overflow-hidden rounded-2xl shadow-sm transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 sm:block"
      >
        <Image src={src} alt={alt} fill sizes="80px" style={{ objectFit: "cover" }} />
        <div className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-teal-700 text-xs font-bold text-white shadow">
          {num}
        </div>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-6 backdrop-blur-sm animate-[fadeIn_150ms_ease-out]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl animate-[popIn_180ms_ease-out]"
          >
            <div
              className="relative w-full overflow-hidden rounded-[2rem] shadow-2xl"
              style={{ aspectRatio: "4/3" }}
            >
              <Image
                src={src}
                alt={alt}
                fill
                sizes="(max-width: 768px) 100vw, 672px"
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Schließen"
              className="absolute -top-4 -right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-lg transition hover:scale-110 hover:text-slate-950"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes popIn {
          from {
            opacity: 0;
            transform: scale(0.92);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
}
