"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { getCookieConsent } from "@/app/components/CookieConsent";

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

  if (!consented) return null;

  return (
    <>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-HV7LZJ0V1M"
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
            gtag('config', 'G-HV7LZJ0V1M');
          `,
        }}
      />
    </>
  );
}
