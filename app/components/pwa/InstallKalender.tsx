"use client";

import { useCallback, useEffect, useState } from "react";
import Icon from "@/app/components/ui/Icon";

// ── „Kalender installieren" ────────────────────────────────────────────────
//
// Der Kalender ist das einzige Feature, das im Alltag mehrmals täglich
// aufgemacht wird – und das einzige, das ein Kind benutzt. Beides spricht
// gegen einen Browser-Tab und für ein Symbol auf dem Startbildschirm.
//
// Zwei Wege, weil die Browser sich nicht einig sind:
//   • Chrome/Edge/Android feuern `beforeinstallprompt`. Das Event wird
//     abgefangen, aufbewahrt und erst beim Klick auf unseren Knopf ausgelöst –
//     so entscheidet der Nutzer im Kontext, nicht die Browserleiste.
//   • iOS/Safari kennt das Event nicht und wird es auch nicht bekommen. Dort
//     bleibt nur „Teilen → Zum Home-Bildschirm", also erklären wir genau das.
//
// Sichtbar ist der Hinweis nur, wenn er etwas ändern kann: nicht in der schon
// installierten App (`display-mode: standalone`), nicht nach dem Wegklicken,
// und auf dem Desktop nur, wenn der Browser tatsächlich installieren kann.

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const WEGGEKLICKT = "medipact.kalender.install.weggeklickt";

function istStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // Safari auf iOS: eigener, nicht standardisierter Weg.
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export default function InstallKalender() {
  const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null);
  const [iosHinweis, setIosHinweis] = useState(false);
  const [sichtbar, setSichtbar] = useState(false);

  // Der Service Worker wird IMMER registriert – auch in der bereits
  // installierten App und auch dann, wenn der Hinweis nie erscheint. Er ist
  // Voraussetzung für `beforeinstallprompt` und liefert die Offline-Seite.
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .catch(() => {
        // Kein Grund, den Nutzer zu behelligen: ohne Worker funktioniert die
        // Seite ganz normal weiter, sie lässt sich nur nicht installieren.
      });
  }, []);

  useEffect(() => {
    if (istStandalone()) return;
    if (window.localStorage.getItem(WEGGEKLICKT) === "1") return;

    const istIos = /iPad|iPhone|iPod/.test(navigator.userAgent);
    // iPadOS meldet sich seit Jahren als "Macintosh"; nur die Touchpunkte
    // verraten, dass da kein Mac steht.
    const istIpadOs =
      navigator.userAgent.includes("Macintosh") && navigator.maxTouchPoints > 1;

    if (istIos || istIpadOs) {
      setIosHinweis(true);
      setSichtbar(true);
      return;
    }

    const abfangen = (event: Event) => {
      // Verhindert die Browser-eigene Leiste – der Knopf unten übernimmt.
      event.preventDefault();
      setPrompt(event as InstallPromptEvent);
      setSichtbar(true);
    };
    const installiert = () => setSichtbar(false);

    window.addEventListener("beforeinstallprompt", abfangen);
    window.addEventListener("appinstalled", installiert);
    return () => {
      window.removeEventListener("beforeinstallprompt", abfangen);
      window.removeEventListener("appinstalled", installiert);
    };
  }, []);

  const installieren = useCallback(async () => {
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    // Das Event ist verbraucht – ein zweiter `prompt()` wirft. Weg damit.
    setPrompt(null);
    if (outcome === "accepted") setSichtbar(false);
  }, [prompt]);

  const wegklicken = useCallback(() => {
    window.localStorage.setItem(WEGGEKLICKT, "1");
    setSichtbar(false);
  }, []);

  if (!sichtbar) return null;

  return (
    <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700">
        <Icon name="calendar" size={18} />
      </span>

      <div className="min-w-[14rem] flex-1">
        <p className="text-sm font-semibold text-neutral-900">
          Kalender als App
        </p>
        <p className="mt-0.5 text-sm font-light leading-relaxed text-neutral-500">
          {iosHinweis
            ? "In Safari unten auf „Teilen“ tippen und „Zum Home-Bildschirm“ wählen – danach öffnet sich der Kalender direkt, ohne Browser."
            : "Aufs Handy oder den Rechner legen: eigenes Symbol, eigenes Fenster, keine Adressleiste."}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {!iosHinweis && (
          <button
            type="button"
            onClick={installieren}
            className="btn btn-primary text-sm"
          >
            Installieren
          </button>
        )}
        <button
          type="button"
          onClick={wegklicken}
          className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        >
          Später
        </button>
      </div>
    </div>
  );
}
