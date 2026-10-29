"use client";

/**
 * Merkliste auf /mediator-finden: bis zu MERKLISTE_MAX Profile vormerken,
 * ohne Konto. Beim Buchen des Starterpakets gehen die Slugs als `wunsch`
 * mit nach kerno (starterpaketUrl) – dort stehen sie bei der Übergabe als
 * Vorauswahl neben den Angeboten.
 *
 * Gespeichert wird nur im Browser (localStorage): eine Liste von Slugs, vom
 * Nutzer selbst angelegt, nie an uns übertragen, bevor er bucht. Ohne
 * Speicher (privates Fenster, blockiert) funktioniert die Liste für die
 * Dauer des Seitenbesuchs.
 */

import { useCallback, useSyncExternalStore } from "react";
import { MERKLISTE_MAX } from "@/lib/mediatorVermittlung";

const SCHLUESSEL = "medipact.merkliste";
const EREIGNIS = "medipact-merkliste";

let fluechtig: string[] = [];
let zuletzt: { roh: string | null; liste: string[] } = { roh: null, liste: [] };

function lesen(): string[] {
  let roh: string | null = null;
  try {
    roh = window.localStorage.getItem(SCHLUESSEL);
  } catch {
    return fluechtig;
  }
  if (roh === zuletzt.roh) return zuletzt.liste;
  let liste: string[] = [];
  try {
    const wert = roh ? JSON.parse(roh) : [];
    if (Array.isArray(wert)) {
      liste = wert.filter((x): x is string => typeof x === "string").slice(0, MERKLISTE_MAX);
    }
  } catch {
    // kaputter Eintrag: leere Liste
  }
  zuletzt = { roh, liste };
  return liste;
}

function schreiben(liste: string[]) {
  fluechtig = liste;
  try {
    window.localStorage.setItem(SCHLUESSEL, JSON.stringify(liste));
  } catch {
    // ohne Speicher bleibt die flüchtige Liste
  }
  window.dispatchEvent(new Event(EREIGNIS));
}

function abonnieren(neu: () => void) {
  window.addEventListener(EREIGNIS, neu);
  window.addEventListener("storage", neu);
  return () => {
    window.removeEventListener(EREIGNIS, neu);
    window.removeEventListener("storage", neu);
  };
}

const LEER: string[] = [];

export function useMerkliste() {
  const liste = useSyncExternalStore(abonnieren, lesen, () => LEER);

  const umschalten = useCallback((slug: string) => {
    const aktuell = lesen();
    if (aktuell.includes(slug)) {
      schreiben(aktuell.filter((s) => s !== slug));
    } else if (aktuell.length < MERKLISTE_MAX) {
      schreiben([...aktuell, slug]);
    }
  }, []);

  const leeren = useCallback(() => schreiben([]), []);

  return {
    liste,
    voll: liste.length >= MERKLISTE_MAX,
    vorgemerkt: (slug: string) => liste.includes(slug),
    umschalten,
    leeren,
  };
}
