"use client";

import { useEffect, useRef, useState } from "react";
import { signIn } from "next-auth/react";

import { redirectAfterLogin } from "@/lib/postLoginRedirect";

// Web-Client-ID aus dem Google-Cloud-Projekt „medipactlogbuch". Öffentlich,
// darf im Frontend stehen. Das Backend akzeptiert dieselbe ID über
// GOOGLE_CLIENT_IDS.
const GOOGLE_CLIENT_ID =
  "228937298157-tbp0nd90re3rq8bhj17q08rgpcg6e4lb.apps.googleusercontent.com";
const GSI_SRC = "https://accounts.google.com/gsi/client";

type GsiCredentialResponse = { credential?: string };
type GsiApi = {
  accounts: {
    id: {
      initialize: (config: {
        client_id: string;
        callback: (response: GsiCredentialResponse) => void;
        ux_mode?: "popup" | "redirect";
      }) => void;
      renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
    };
  };
};

declare global {
  interface Window {
    google?: GsiApi;
  }
}

/** Lädt das GIS-Skript genau einmal pro Seite. */
let gsiPromise: Promise<void> | null = null;
function loadGsi(): Promise<void> {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (!gsiPromise) {
    gsiPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = GSI_SRC;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => {
        gsiPromise = null;
        reject(new Error("GSI konnte nicht geladen werden"));
      };
      document.head.appendChild(script);
    });
  }
  return gsiPromise;
}

/**
 * „Mit Google anmelden" (Google Identity Services, Popup). Das ID-Token geht
 * über NextAuth (Provider "google-id-token") an POST /auth/google im Backend;
 * danach dieselbe Weiterleitung wie beim E-Mail-Login. Ein neues Konto wird
 * dabei automatisch als Privatperson angelegt.
 */
export default function GoogleSignInButton({
  callbackUrl,
  text = "signin_with",
  onError,
}: {
  callbackUrl: string;
  text?: "signin_with" | "signup_with" | "continue_with";
  onError?: (message: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  // Callback-Werte über Refs, damit initialize() nicht bei jedem Render neu läuft.
  const callbackUrlRef = useRef(callbackUrl);
  const onErrorRef = useRef(onError);
  callbackUrlRef.current = callbackUrl;
  onErrorRef.current = onError;

  useEffect(() => {
    let cancelled = false;

    async function handleCredential(response: GsiCredentialResponse) {
      if (!response.credential) return;
      setBusy(true);
      try {
        const result = await signIn("google-id-token", {
          id_token: response.credential,
          redirect: false,
        });
        if (!result || result.error) {
          onErrorRef.current?.("Anmeldung mit Google fehlgeschlagen. Bitte versuche es erneut.");
          setBusy(false);
          return;
        }
        await redirectAfterLogin(callbackUrlRef.current);
      } catch {
        onErrorRef.current?.("Server nicht erreichbar");
        setBusy(false);
      }
    }

    loadGsi()
      .then(() => {
        const el = containerRef.current;
        if (cancelled || !el || !window.google) return;
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredential,
          ux_mode: "popup",
        });
        window.google.accounts.id.renderButton(el, {
          type: "standard",
          theme: "outline",
          size: "large",
          shape: "pill",
          text,
          locale: "de",
          logo_alignment: "center",
          // GIS erlaubt max. 400 px Breite.
          width: Math.min(400, Math.max(200, Math.floor(el.offsetWidth))),
        });
      })
      .catch(() => {
        if (!cancelled) onErrorRef.current?.("Google-Anmeldung konnte nicht geladen werden.");
      });

    return () => {
      cancelled = true;
    };
  }, [text]);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className={`flex min-h-[44px] w-full justify-center ${busy ? "pointer-events-none opacity-50" : ""}`}
      />
      {busy && (
        <p className="mt-2 text-center text-xs text-neutral-500">Wird angemeldet …</p>
      )}
    </div>
  );
}

/** Trenner zwischen Google-Button und E-Mail-Formular. */
export function OrWithEmailDivider() {
  return (
    <div className="my-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-neutral-400">
      <span className="h-px flex-1 bg-neutral-200" />
      oder mit E-Mail
      <span className="h-px flex-1 bg-neutral-200" />
    </div>
  );
}
