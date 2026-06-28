"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const STORAGE_KEY = "medipact-cookie-consent";

/**
 * Bump whenever the cookie/analytics setup changes materially (new
 * categories, new third-party tool, etc.). Existing consent is then
 * treated as invalid and the banner reappears automatically, in line
 * with the DSK ("Orientierungshilfe") view that consent doesn't cover
 * processing it was never informed about.
 */
const CONSENT_VERSION = 1;

/**
 * Re-ask after this many days even if nothing changed. There is no
 * statutory limit, but supervisory authorities (e.g. the DSK orientation
 * guide) and common practice treat consent that is "too old" as no
 * longer a reliable, informed signal — 12 months is the widely used
 * benchmark.
 */
const CONSENT_MAX_AGE_DAYS = 365;

export type CookieConsentValue = "accepted" | "declined";

type StoredConsent = {
  value: CookieConsentValue;
  timestamp: number;
  version: number;
};

function readStoredConsent(): StoredConsent | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<StoredConsent>;
    if (
      (parsed.value === "accepted" || parsed.value === "declined") &&
      typeof parsed.timestamp === "number" &&
      typeof parsed.version === "number"
    ) {
      return parsed as StoredConsent;
    }
  } catch {
    // Falls through to legacy-format handling below.
  }

  // Legacy format from before versioning/expiry was introduced: treat as
  // valid but undated, so it still expires on the next version bump.
  if (raw === "accepted" || raw === "declined") {
    return { value: raw, timestamp: 0, version: 0 };
  }

  return null;
}

/**
 * Returns the active consent decision, or `null` if none exists, it has
 * expired, or it predates the current consent version — in all of those
 * cases the banner must be shown again.
 */
export function getCookieConsent(): CookieConsentValue | null {
  const stored = readStoredConsent();
  if (!stored) return null;

  if (stored.version !== CONSENT_VERSION) return null;

  const ageInDays = (Date.now() - stored.timestamp) / (1000 * 60 * 60 * 24);
  if (ageInDays > CONSENT_MAX_AGE_DAYS) return null;

  return stored.value;
}

/**
 * Clears the stored decision and reopens the banner — used by the
 * "Cookie-Einstellungen" link in the footer so visitors can change their
 * mind at any time, without having to clear browser data manually.
 */
export function resetCookieConsent() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("medipact-cookie-consent-changed"));
  window.dispatchEvent(new Event("medipact-cookie-consent-reset"));
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const t = useTranslations("cookieConsent");

  useEffect(() => {
    if (getCookieConsent() === null) {
      setVisible(true);
    }

    function handleReset() {
      setVisible(true);
    }

    window.addEventListener("medipact-cookie-consent-reset", handleReset);
    return () =>
      window.removeEventListener("medipact-cookie-consent-reset", handleReset);
  }, []);

  function setConsent(value: CookieConsentValue) {
    const record: StoredConsent = {
      value,
      timestamp: Date.now(),
      version: CONSENT_VERSION,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    window.dispatchEvent(new Event("medipact-cookie-consent-changed"));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t("ariaLabel")}
      className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xl shadow-neutral-900/10 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-neutral-600">
          {t.rich("text", {
            cookiePolicyLink: (chunks) => (
              <Link
                href="/cookies"
                className="font-medium text-accent-700 hover:underline"
              >
                {chunks}
              </Link>
            ),
          })}
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => setConsent("declined")}
            className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
          >
            {t("declineButton")}
          </button>
          <button
            type="button"
            onClick={() => setConsent("accepted")}
            className="inline-flex items-center justify-center rounded-xl bg-accent-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-500"
          >
            {t("acceptButton")}
          </button>
        </div>
      </div>
    </div>
  );
}
