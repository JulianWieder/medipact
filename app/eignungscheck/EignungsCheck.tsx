"use client";

import { useState } from "react";
import Link from "next/link";
import { CrossfadePanel } from "@/app/components/ui/TabSwitcher";
import {
  PAARCHECK_PREIS,
  PAARCHECK_URL,
  STARTERPAKET_MIT_CHECK_URL,
  ampelErgebnis,
  ampelFuerStufe,
  checkFragen,
  hilfetelefone,
  paarcheckBeiRot,
  rotEmpfehlungen,
  rotSicherheitErgebnis,
  type Ampel,
  type CheckAntwort,
} from "@/app/content/eignungscheck";
import { STARTPAKET_NAME, STARTPAKET_PREIS } from "@/lib/mediatorVermittlung";

/**
 * Der Kurz-Check selbst: eine Frage pro Bildschirm, Fortschrittsanzeige,
 * Auswertung komplett im Browser. Antworten liegen nur im React-State –
 * kein fetch, kein localStorage, kein Analytics-Event mit Inhalt. Wer das
 * ändert, ändert ein Versprechen auf der Seite ("Antworten bleiben in Ihrem
 * Browser") und in der FAQ.
 *
 * Logik und Texte: app/content/eignungscheck.ts.
 */

const ampelStil: Record<Ampel, { punkt: string; rahmen: string; text: string }> = {
  gruen: { punkt: "bg-emerald-500", rahmen: "border-emerald-200 bg-emerald-50/70", text: "text-emerald-800" },
  gelb: { punkt: "bg-amber-400", rahmen: "border-amber-200 bg-amber-50/70", text: "text-amber-800" },
  rot: { punkt: "bg-red-500", rahmen: "border-red-200 bg-red-50/70", text: "text-red-800" },
};

export function EignungsCheck() {
  const [antworten, setAntworten] = useState<CheckAntwort[]>([]);
  const schritt = antworten.length;
  const fertig = schritt >= checkFragen.length;

  const waehlen = (a: CheckAntwort) => setAntworten([...antworten, a]);
  const zurueck = () => setAntworten(antworten.slice(0, -1));
  const neu = () => setAntworten([]);

  return (
    <div className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-xl shadow-neutral-900/5 sm:p-10">
      {/* Fortschritt */}
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500">
        <span>
          {fertig ? "Auswertung" : `Frage ${schritt + 1} von ${checkFragen.length}`}
        </span>
        {schritt > 0 && !fertig && (
          <button
            type="button"
            onClick={zurueck}
            className="normal-case tracking-normal text-neutral-500 hover:text-accent-700"
          >
            ← Zurück
          </button>
        )}
      </div>
      <div
        className="mt-3 h-1.5 overflow-hidden rounded-full bg-neutral-100"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={checkFragen.length}
        aria-valuenow={schritt}
        aria-label="Fortschritt"
      >
        <div
          className="h-full rounded-full bg-accent-600 transition-all duration-300"
          style={{ width: `${(schritt / checkFragen.length) * 100}%` }}
        />
      </div>

      <CrossfadePanel activeKey={fertig ? "ergebnis" : `frage-${schritt}`} className="mt-8">
        {fertig ? (
          <Ergebnis antworten={antworten} onNeu={neu} />
        ) : (
          <Frage index={schritt} onWaehlen={waehlen} />
        )}
      </CrossfadePanel>
    </div>
  );
}

function Frage({ index, onWaehlen }: { index: number; onWaehlen: (a: CheckAntwort) => void }) {
  const f = checkFragen[index];
  return (
    <fieldset>
      <div className="text-xs font-bold uppercase tracking-[0.2em] text-accent-700">{f.signal}</div>
      <legend className="mt-3 block text-xl font-bold leading-snug text-neutral-900 sm:text-2xl">
        {f.frage}
      </legend>
      {f.hinweis && <p className="mt-2 text-sm text-neutral-500">{f.hinweis}</p>}
      <div className="mt-6 grid gap-3">
        {f.antworten.map((a) => (
          <button
            key={a.text}
            type="button"
            onClick={() => onWaehlen(a)}
            className="rounded-2xl border border-neutral-200 bg-white px-5 py-4 text-left text-base text-neutral-800 transition hover:border-accent-400 hover:bg-accent-50/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/60"
          >
            {a.text}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function Ergebnis({ antworten, onNeu }: { antworten: CheckAntwort[]; onNeu: () => void }) {
  const ausschluss = antworten.some((a) => a.ausschluss);
  // Höchstes Signal zählt, nicht die Summe (siehe app/content/eignungscheck.ts).
  const stufe = Math.max(1, ...antworten.map((a) => a.stufe));
  const ampel: Ampel = ausschluss ? "rot" : ampelFuerStufe(stufe);
  const e = ausschluss ? rotSicherheitErgebnis : ampelErgebnis[ampel];
  const stil = ampelStil[ampel];

  return (
    <div aria-live="polite">
      <div className={`rounded-3xl border p-6 sm:p-8 ${stil.rahmen}`}>
        <div className="flex items-center gap-3">
          <span className={`h-4 w-4 rounded-full ${stil.punkt}`} aria-hidden="true" />
          <span className={`text-sm font-bold uppercase tracking-[0.15em] ${stil.text}`}>
            {e.label} · {e.stufen}
          </span>
        </div>
        <h2 className="mt-4 text-2xl font-black tracking-tight text-neutral-900 sm:text-3xl">{e.titel}</h2>
        <p className="mt-1 text-sm font-semibold text-neutral-600">{e.phase}</p>
        <p className="mt-4 leading-7 text-neutral-700">{e.text}</p>
      </div>

      {ampel === "rot" ? (
        <div className="mt-8 space-y-6">
          {ausschluss && (
            <div className="rounded-3xl border-2 border-red-300 bg-white p-6 sm:p-8">
              <h3 className="text-lg font-bold text-neutral-900">Sie müssen damit nicht allein bleiben</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-700">
                Wenn Sie Angst haben oder Gewalt erlebt haben, gehen Ihre Sicherheit und Ihr Schutz vor.
                Diese Stellen helfen sofort und vertraulich:
              </p>
              <ul className="mt-5 grid gap-3 sm:grid-cols-3">
                {hilfetelefone.map((h) => (
                  <li key={h.nummer} className="rounded-2xl bg-red-50/70 p-4">
                    <div className="text-xs font-semibold text-neutral-600">{h.label}</div>
                    <a href={`tel:${h.tel}`} className="mt-1 block text-xl font-black text-red-800 hover:underline">
                      {h.nummer}
                    </a>
                    <div className="mt-1 text-xs text-neutral-500">{h.text}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {!ausschluss && (
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8">
              <h3 className="text-lg font-bold text-neutral-900">{paarcheckBeiRot.titel}</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-700">{paarcheckBeiRot.text}</p>
              <p className="mt-3 rounded-2xl bg-neutral-50 p-4 text-sm leading-6 text-neutral-600">
                {paarcheckBeiRot.einschraenkung}
              </p>
              <Link
                href={PAARCHECK_URL}
                className="mt-5 inline-flex justify-center rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-800 transition hover:border-accent-400 hover:text-accent-700"
              >
                Paar-Check für {PAARCHECK_PREIS} – beide Sichten vergleichen
              </Link>
            </div>
          )}
          <div>
            <h3 className="text-lg font-bold text-neutral-900">
              {ausschluss ? "Was jetzt eher hilft" : "Wege, die auch ohne Zusammenarbeit funktionieren"}
            </h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-3">
              {rotEmpfehlungen.map((r) => (
                <li key={r.titel} className="rounded-2xl border border-neutral-200 p-5">
                  <div className="font-semibold text-neutral-900">{r.titel}</div>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">{r.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="mt-8">
          <p className="rounded-2xl bg-neutral-50 p-5 text-sm leading-6 text-neutral-700">
            <strong className="text-neutral-900">Das ist nur Ihre Sicht.</strong> Die andere Seite erlebt
            denselben Konflikt oft auf einer anderen Stufe. Ob eine Mediation trägt, zeigt sich erst,
            wenn beide Einschätzungen nebeneinanderliegen.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href={PAARCHECK_URL} className="btn btn-primary justify-center">
              Paar-Check für {PAARCHECK_PREIS} – beide Seiten prüfen
            </Link>
            <Link
              href={STARTERPAKET_MIT_CHECK_URL}
              className="inline-flex justify-center rounded-full border border-neutral-200 px-6 py-3 text-sm font-semibold text-neutral-800 transition hover:border-accent-400 hover:text-accent-700"
            >
              Starterpaket mit Paar-Check
            </Link>
          </div>
          <p className="mt-3 text-xs text-neutral-500">
            Im {STARTPAKET_NAME} ({STARTPAKET_PREIS} pro Fall) ist der Paar-Check enthalten – dazu
            Mediation verstehen, Mediator:in finden und klären, ob eine Lösung möglich ist.
          </p>
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3 border-t border-neutral-100 pt-6 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
        <span>Orientierung, keine Diagnose; ersetzt keine Beratung.</span>
        <button type="button" onClick={onNeu} className="text-left font-semibold text-accent-700 hover:underline">
          Check neu starten
        </button>
      </div>
    </div>
  );
}
