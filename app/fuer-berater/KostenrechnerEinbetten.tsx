"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/app/components/ui/Icon";
import { KONFLIKTARTEN, type Konfliktart } from "@/lib/kostenrecht";
import { HOEHEN_NACHRICHT } from "@/app/kostenrechner/embed/EinbettungsRahmen";

const URSPRUNG = "https://medipact.de";
const IFRAME_ID = "medipact-kostenrechner";
// Startwert, bis die erste Höhenmeldung kommt — und dauerhaft bei
// Einbindern, die das Script weglassen (dann scrollt das iframe selbst).
const STARTHOEHE = 1500;

/**
 * Einbettungscode aus drei Teilen. Der normale <a>-Link UNTER dem iframe ist
 * der Grund, warum es den Code gibt: Links im iframe zählen nicht als
 * Backlink, der hier schon. Das Script ist optional und setzt nur die Höhe.
 */
function code(art: Konfliktart): string {
  return [
    `<iframe id="${IFRAME_ID}" src="${URSPRUNG}/kostenrechner/embed?art=${art}" title="Kostenrechner: Mediation oder Gericht" style="width:100%;height:${STARTHOEHE}px;border:0" loading="lazy"></iframe>`,
    `<p><a href="${URSPRUNG}/kostenrechner">Kostenrechner Mediation vs. Gericht von medipact</a></p>`,
    `<script>window.addEventListener("message",function(e){if(e.origin==="${URSPRUNG}"&&e.data&&e.data.type==="${HOEHEN_NACHRICHT}"){document.getElementById("${IFRAME_ID}").style.height=e.data.hoehe+"px"}});</script>`,
  ].join("\n");
}

export default function KostenrechnerEinbetten() {
  const [art, setArt] = useState<Konfliktart>("trennung");
  const [kopiert, setKopiert] = useState(false);
  const [hoehe, setHoehe] = useState(STARTHOEHE);
  const feld = useRef<HTMLTextAreaElement>(null);

  // Vorschau wie beim Einbinder: Höhe aus der Nachricht des Widgets.
  useEffect(() => {
    const empfangen = (e: MessageEvent) => {
      if (e.origin === window.location.origin && e.data?.type === HOEHEN_NACHRICHT) {
        setHoehe(e.data.hoehe);
      }
    };
    window.addEventListener("message", empfangen);
    return () => window.removeEventListener("message", empfangen);
  }, []);

  async function kopieren() {
    try {
      await navigator.clipboard.writeText(code(art));
    } catch {
      // Ohne Clipboard-API (http, ältere Browser): markieren, Strg+C bleibt.
      feld.current?.select();
      return;
    }
    setKopiert(true);
    window.setTimeout(() => setKopiert(false), 2000);
  }

  return (
    <section className="section section-base border-t border-neutral-100">
      <div className="container max-w-4xl">
        <div className="mb-10 max-w-3xl">
          <div className="eyebrow mb-4">Für Ihre Website</div>
          <h2 className="heading-2">Kostenrechner auf Ihrer Website</h2>
          <p className="mt-5 text-lg leading-8 text-neutral-600">
            Binden Sie den Vergleich von Gerichts- und Mediationskosten
            kostenlos auf Ihrer eigenen Seite ein. Der Rechner wendet die
            gesetzlichen Gebührentabellen an und bleibt bei Gesetzesänderungen
            automatisch aktuell. Ohne Anmeldung, ohne Cookies und ohne
            Messung im eingebetteten Rechner.
          </p>
        </div>

        <label htmlFor="einbetten-art" className="mb-2 block text-sm font-semibold text-neutral-900">
          Vorbelegte Konfliktart
        </label>
        <select
          id="einbetten-art"
          value={art}
          onChange={(e) => setArt(e.target.value as Konfliktart)}
          className="w-full max-w-sm rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 focus:border-accent-500 focus:outline-none"
        >
          {KONFLIKTARTEN.map((k) => (
            <option key={k.key} value={k.key}>
              {k.label}
            </option>
          ))}
        </select>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between gap-4">
            <span className="text-sm font-semibold text-neutral-900">Einbettungscode</span>
            <button
              type="button"
              onClick={kopieren}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-1.5 text-sm font-medium text-neutral-700 transition hover:border-accent-300 hover:text-accent-700"
            >
              <Icon name={kopiert ? "check" : "clipboard"} size={16} color="currentColor" />
              {kopiert ? "Kopiert" : "Code kopieren"}
            </button>
          </div>
          <textarea
            ref={feld}
            readOnly
            value={code(art)}
            rows={6}
            onFocus={(e) => e.currentTarget.select()}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-4 font-mono text-xs leading-5 text-neutral-800"
          />
          <p className="mt-2 text-sm text-neutral-500">
            Den Code an der gewünschten Stelle in Ihre Seite einfügen. Die
            letzte Zeile passt die Höhe automatisch an und kann entfallen.
          </p>
        </div>

        <div className="mt-10">
          <p className="mb-3 text-sm font-semibold text-neutral-900">Vorschau</p>
          <div className="overflow-hidden rounded-2xl border border-neutral-200">
            <iframe
              key={art}
              src={`/kostenrechner/embed?art=${art}`}
              title="Vorschau: Kostenrechner Mediation oder Gericht"
              style={{ width: "100%", height: hoehe, border: 0 }}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
