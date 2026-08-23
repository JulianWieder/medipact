"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { getCookieConsent } from "@/app/components/CookieConsent";
import { trackEvent } from "@/lib/analytics";

/**
 * Mess-ID aus der Umgebung, mit dem bisherigen Wert als Rueckfallebene: So
 * kann eine Testumgebung auf eine eigene Property zeigen (oder mit leerem
 * Wert gar nicht messen), ohne dass Code geaendert werden muss.
 */
const MESS_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-HV7LZJ0V1M";

/** Der Betreff verraet bei mailto-CTAs, welcher Tarif gemeint war. */
function betreffAus(href: string): string | undefined {
  const treffer = /[?&]subject=([^&]*)/i.exec(href);
  if (!treffer) return undefined;
  try {
    return decodeURIComponent(treffer[1].replace(/\+/g, " ")).slice(0, 100);
  } catch {
    return undefined;
  }
}

export default function Analytics() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    setConsented(getCookieConsent() === "accepted");

    function handleChange() {
      setConsented(getCookieConsent() === "accepted");
    }

    window.addEventListener("medipact-cookie-consent-changed", handleChange);
    return () =>
      window.removeEventListener(
        "medipact-cookie-consent-changed",
        handleChange
      );
  }, []);

  /**
   * Klicks zentral einsammeln, statt jeden Button einzeln zu instrumentieren.
   * Gemessen wird nur, was eine Absicht zeigt: eine Kontaktaufnahme (mailto,
   * tel), der Weg in die Registrierung, und alles, was im Markup ein
   * `data-track="name"` traegt. In der Capture-Phase, damit ein
   * preventDefault weiter oben die Messung nicht verschluckt.
   */
  useEffect(() => {
    if (!consented) return;

    function onClick(event: MouseEvent) {
      const ziel = event.target;
      if (!(ziel instanceof Element)) return;

      const treffer = ziel.closest("a, [data-track]");
      if (!treffer) return;

      const seite = window.location.pathname;
      const text = (treffer.textContent ?? "").trim().slice(0, 80);

      const name = treffer.getAttribute("data-track");
      if (name) {
        trackEvent("cta_klick", { ziel: name, seite, text });
        return;
      }

      const href = treffer.getAttribute("href") ?? "";
      if (href.startsWith("mailto:")) {
        trackEvent("kontaktaufnahme", {
          weg: "e_mail",
          betreff: betreffAus(href),
          seite,
          text,
        });
      } else if (href.startsWith("tel:")) {
        trackEvent("kontaktaufnahme", { weg: "telefon", seite, text });
      } else if (href.startsWith("/auth/register")) {
        trackEvent("registrierung_gestartet", { seite, text });
      }
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [consented]);

  if (!consented || !MESS_ID) return null;

  return (
    <>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${MESS_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${MESS_ID}');
          `,
        }}
      />
    </>
  );
}
