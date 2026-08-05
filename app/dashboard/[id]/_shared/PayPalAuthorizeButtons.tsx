"use client";

// ── PayPal-Buttons für Fall-Anteile (intent=authorize) ──────────────────────
//
// Herausgelöst aus FallFreischaltungBlock, weil es seit der freiwilligen
// Kostenübernahme ZWEI Stellen gibt, an denen ein Anteil reserviert wird:
// der eigene Anteil im Freischaltungs-Block und der übernommene Anteil einer
// anderen Partei (Blocktyp "kostenuebernahme"). Beide sprechen dieselben
// Endpunkte, nur mit unterschiedlichem `for_participant_id`.
//
// Eigene SDK-Instanz mit intent=authorize. MUSS getrennt vom Standard-SDK
// (intent=capture, für Bonus-Leistungen) geladen werden: passt der Intent im
// Script-URL nicht zur serverseitig erzeugten Order, öffnet sich das
// PayPal-Fenster und schließt sofort wieder.

import { useCallback, useEffect, useRef, useState } from "react";

type PayPalSdk = {
  Buttons: (options: Record<string, unknown>) => {
    render: (container: HTMLElement) => Promise<void>;
  };
};

const SDK_ID = "paypal-sdk-authorize";
const SDK_NAMESPACE = "paypalAuthorize";

function getSdk(): PayPalSdk | undefined {
  return (window as unknown as Record<string, PayPalSdk | undefined>)[SDK_NAMESPACE];
}

export default function PayPalAuthorizeButtons({
  mediationId,
  forParticipantId,
  onDone,
  onError,
  onBusyChange,
}: {
  mediationId: string;
  /** Gesetzt = dieser Vorgang übernimmt den Anteil einer anderen Partei. */
  forParticipantId?: number;
  /** Antwort von capture-order (der vollständige Zahlungsstatus). */
  onDone: (status: unknown) => void;
  onError: (message: string) => void;
  onBusyChange?: (busy: boolean) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountedNode = useRef<HTMLElement | null>(null);
  const [retry, setRetry] = useState(0);

  // In Refs spiegeln: die Buttons werden EINMAL gerendert und dürfen nicht bei
  // jedem neuen Callback-Identity neu aufgebaut werden.
  const cb = useRef({ onDone, onError, onBusyChange, forParticipantId });
  cb.current = { onDone, onError, onBusyChange, forParticipantId };

  const resetButtons = useCallback(() => {
    mountedNode.current = null;
    if (containerRef.current) containerRef.current.innerHTML = "";
    setRetry((n) => n + 1);
  }, []);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    if (!clientId) {
      cb.current.onError("PayPal ist noch nicht konfiguriert.");
      return;
    }

    function render() {
      const sdk = getSdk();
      const container = containerRef.current;
      if (!sdk || !container) return;
      if (mountedNode.current === container) return;
      mountedNode.current = container;
      container.innerHTML = "";
      const forId = cb.current.forParticipantId;
      const body = forId ? JSON.stringify({ for_participant_id: forId }) : undefined;

      sdk
        .Buttons({
          style: { layout: "vertical", color: "gold", label: "paypal" },
          createOrder: async () => {
            cb.current.onError("");
            const res = await fetch(
              `/api/mediations/${mediationId}/pay/paypal/create-order`,
              {
                method: "POST",
                ...(body ? { headers: { "Content-Type": "application/json" }, body } : {}),
              },
            );
            const d = await res.json().catch(() => null);
            if (!res.ok) throw new Error(d?.detail ?? "Order konnte nicht erstellt werden");
            return d.order_id;
          },
          onApprove: async (data: { orderID: string }) => {
            cb.current.onBusyChange?.(true);
            cb.current.onError("");
            try {
              const res = await fetch(
                `/api/mediations/${mediationId}/pay/paypal/capture-order`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    order_id: data.orderID,
                    ...(forId ? { for_participant_id: forId } : {}),
                  }),
                },
              );
              const d = await res.json().catch(() => null);
              if (!res.ok) {
                cb.current.onError(
                  `Zahlung fehlgeschlagen: ${d?.detail ?? "Unbekannter Fehler"}`,
                );
                resetButtons();
                return;
              }
              cb.current.onDone(d);
            } catch {
              cb.current.onError("Server nicht erreichbar.");
              resetButtons();
            } finally {
              cb.current.onBusyChange?.(false);
            }
          },
          onError: () => {
            cb.current.onError("PayPal hat einen Fehler gemeldet. Bitte erneut versuchen.");
            resetButtons();
          },
          onCancel: () => cb.current.onBusyChange?.(false),
        })
        .render(container)
        .catch(() => {
          mountedNode.current = null;
          cb.current.onError(
            "Der PayPal-Button konnte nicht geladen werden. Bitte Seite neu laden.",
          );
        });
    }

    const existing = document.getElementById(SDK_ID) as HTMLScriptElement | null;
    if (getSdk()) render();
    else if (existing) existing.addEventListener("load", render);
    else {
      const s = document.createElement("script");
      s.id = SDK_ID;
      s.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=EUR&intent=authorize`;
      s.setAttribute("data-namespace", SDK_NAMESPACE);
      s.addEventListener("load", render);
      s.addEventListener("error", () =>
        cb.current.onError(
          "Das PayPal-SDK konnte nicht geladen werden (Netzwerk oder Adblocker?).",
        ),
      );
      document.body.appendChild(s);
    }
  }, [mediationId, forParticipantId, retry, resetButtons]);

  return <div ref={containerRef} />;
}
