import {
  LOGBUCH_APP_STORE_URL,
  LOGBUCH_WEB_URL,
} from "@/lib/logbuchApp";

/**
 * QR-Codes + Buttons zum eigenständigen Konflikt-Logbuch:
 * Web (logbuch.medipact.de) und iPhone-App (App Store).
 *
 * Desktop: QR-Code zum Scannen mit dem Handy. Mobil: nur die Buttons – ein
 * QR-Code auf dem Gerät, das ihn scannen soll, hilft niemandem.
 * tone="dark" für dunkle Sektionen (section-strong).
 */
export function LogbuchApp({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  const appLive = Boolean(LOGBUCH_APP_STORE_URL);
  const tile = dark
    ? "border-white/15 bg-white/5"
    : "border-neutral-200 bg-white shadow-sm";
  const title = dark ? "text-white" : "text-neutral-900";
  const muted = dark ? "text-neutral-300" : "text-neutral-500";

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* Web */}
      <div className={`flex items-center gap-5 rounded-2xl border p-5 ${tile}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logbuch/qr-web.svg"
          alt="QR-Code zu logbuch.medipact.de"
          width={112}
          height={112}
          className="hidden h-28 w-28 shrink-0 rounded-lg bg-white p-1.5 sm:block"
        />
        <div className="min-w-0">
          <p className={`text-xs font-bold uppercase tracking-wide ${muted}`}>
            Im Browser
          </p>
          <p className={`mt-1 font-semibold ${title}`}>logbuch.medipact.de</p>
          <a
            href={LOGBUCH_WEB_URL}
            className="mt-3 inline-flex items-center justify-center rounded-xl bg-accent-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-accent-700"
          >
            Logbuch öffnen →
          </a>
        </div>
      </div>

      {/* iPhone-App */}
      <div className={`flex items-center gap-5 rounded-2xl border p-5 ${tile}`}>
        {appLive && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/logbuch/qr-app.svg"
            alt="QR-Code zur Logbuch-App im App Store"
            width={112}
            height={112}
            className="hidden h-28 w-28 shrink-0 rounded-lg bg-white p-1.5 sm:block"
          />
        )}
        <div className="min-w-0">
          <p className={`text-xs font-bold uppercase tracking-wide ${muted}`}>
            Als App fürs iPhone
          </p>
          <p className={`mt-1 font-semibold ${title}`}>medipact Logbuch</p>
          {appLive ? (
            <a
              href={LOGBUCH_APP_STORE_URL}
              className={`mt-3 inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-bold transition ${
                dark
                  ? "bg-white text-neutral-900 hover:bg-neutral-100"
                  : "bg-neutral-900 text-white hover:bg-neutral-700"
              }`}
            >
              Im App Store laden →
            </a>
          ) : (
            <p className={`mt-3 text-sm ${muted}`}>Bald im App Store.</p>
          )}
        </div>
      </div>
    </div>
  );
}
