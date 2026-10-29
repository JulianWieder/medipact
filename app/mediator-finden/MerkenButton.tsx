"use client";

// Vormerken für das Starterpaket (lib/merkliste.ts) – im Verzeichnis und
// auf der Profilseite.

import clsx from "clsx";
import { Button } from "@/app/components/ui/Button";
import { MERKLISTE_MAX, STARTPAKET_PREIS, starterpaketUrl } from "@/lib/mediatorVermittlung";
import { useMerkliste } from "@/lib/merkliste";

export function MerkenButton({
  vorgemerkt,
  gesperrt,
  onClick,
  className,
}: {
  vorgemerkt: boolean;
  gesperrt: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={vorgemerkt}
      disabled={gesperrt}
      onClick={onClick}
      title={gesperrt ? `Höchstens ${MERKLISTE_MAX} Profile – entfernen Sie erst eines.` : undefined}
      className={clsx(
        "inline-flex items-center justify-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        vorgemerkt
          ? "border-accent-500 bg-accent-600 text-white hover:bg-accent-700"
          : "border-neutral-200 bg-white text-neutral-800 hover:border-accent-400 hover:text-accent-700",
        className,
      )}
    >
      <span aria-hidden>{vorgemerkt ? "✓" : "+"}</span>
      {vorgemerkt ? "Vorgemerkt" : "Vormerken"}
    </button>
  );
}

/** Profilseite: vormerken oder direkt mit dieser Person (plus Merkliste) starten. */
export function ProfilAuswahl({ slug }: { slug: string }) {
  const merkliste = useMerkliste();
  const vorgemerkt = merkliste.vorgemerkt(slug);
  const wunsch = vorgemerkt ? merkliste.liste : [...merkliste.liste, slug].slice(-MERKLISTE_MAX);
  return (
    <div className="mt-6 space-y-3">
      <Button href={starterpaketUrl(wunsch)} className="w-full">
        {`Starterpaket buchen · ${STARTPAKET_PREIS}`}
      </Button>
      <MerkenButton
        vorgemerkt={vorgemerkt}
        gesperrt={merkliste.voll && !vorgemerkt}
        onClick={() => merkliste.umschalten(slug)}
        className="w-full"
      />
      {merkliste.liste.length > 0 && (
        <p className="text-center text-xs text-neutral-500">
          {merkliste.liste.length} von {MERKLISTE_MAX} vorgemerkt
        </p>
      )}
    </div>
  );
}
