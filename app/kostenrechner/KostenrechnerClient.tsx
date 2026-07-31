"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  KOSTENRECHT_STAND,
  STUNDENSATZ_DEFAULT,
  STUNDENSATZ_MAX,
  STUNDENSATZ_MIN,
  euro,
  euroGlatt,
  gerichtsSzenario,
  konfliktart,
  konfliktartAus,
  medipactPreis,
  mitPreisen,
  verfahrenswertEhesache,
  verfahrenswertVersorgungsausgleich,
  zeithonorar,
  type Konfliktart,
  type PreisOverlay,
} from "@/lib/kostenrecht";

// ── Prozesskostenrechner ────────────────────────────────────────────────────
//
// Bewusste Entscheidungen, die man beim Umbauen kennen sollte:
//
// 1. KEIN E-Mail-Gate vor dem Ergebnis. Der Zweck dieser Seite sind
//    Backlinks; ein gegatetes Tool wird nicht verlinkt.
// 2. Die dritte Karte ("Mediation gescheitert") ist kein Versehen. Sie
//    kostet auf den ersten Blick Conversion und ist trotzdem das stärkste
//    Vertrauenssignal der Seite – weil die Zahl bei unseren Preisen ohnehin
//    unkritisch ist.
// 3. Bei Trennung wird NICHT behauptet, Mediation ersetze das Gericht. Eine
//    Ehe wird nur durch gerichtlichen Beschluss geschieden und dafür ist
//    mindestens ein Anwalt zwingend (§ 114 FamFG). Verglichen wird deshalb
//    "streitig, 2 Anwälte" gegen "Mediation + einvernehmlich, 1 Anwalt".

type Props = {
  className?: string;
  /**
   * Live-Preise aus GET /pricing/matrix, serverseitig geladen. Fehlt der
   * Wert (Backend nicht erreichbar), greifen die Fallback-Preise aus
   * lib/kostenrecht.ts.
   */
  preise?: PreisOverlay;
  /**
   * Vorbelegte Konfliktart, gesetzt über ?art= (siehe page.tsx). Damit
   * landen Besucher von /konflikte/erbschaft direkt auf dem Erbstreit statt
   * auf der Nachbarschafts-Voreinstellung und müssen nicht erst umschalten.
   */
  start?: Konfliktart;
};

const zahl = (v: string, fallback: number) => {
  const n = Number(v.replace(/[^\d]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

export default function KostenrechnerClient({ className, preise, start }: Props) {
  const [art, setArt] = useState<Konfliktart>(start ?? "nachbarschaft");
  const [streitwert, setStreitwert] = useState(
    konfliktart(start ?? "nachbarschaft").streitwertDefault,
  );
  const [monatsnetto, setMonatsnetto] = useState(4500);
  const [anrechte, setAnrechte] = useState(2);
  const [gegenseiteAnwalt, setGegenseiteAnwalt] = useState(true);
  const [stundensatz, setStundensatz] = useState(STUNDENSATZ_DEFAULT);
  const [stunden, setStunden] = useState(20);

  const arten = useMemo(() => mitPreisen(preise), [preise]);
  const info = konfliktartAus(arten, art);
  const istTrennung = art === "trennung";

  const wert = useMemo(() => {
    if (!istTrennung) return streitwert;
    return (
      verfahrenswertEhesache(monatsnetto) +
      verfahrenswertVersorgungsausgleich(monatsnetto, anrechte)
    );
  }, [istTrennung, streitwert, monatsnetto, anrechte]);

  const anwaelte = gegenseiteAnwalt ? 2 : 1;

  const gericht = useMemo(
    () => gerichtsSzenario(wert, info.gerichtssatz, anwaelte),
    [wert, info.gerichtssatz, anwaelte],
  );

  // Bei Trennung: einvernehmliche Scheidung nach Mediation – ein Anwalt
  // stellt den Antrag, der andere stimmt zu. Gerichtskosten bleiben.
  const scheidungDanach = useMemo(
    () => (istTrennung ? gerichtsSzenario(wert, info.gerichtssatz, 1) : null),
    [istTrennung, wert, info.gerichtssatz],
  );

  const mediation = medipactPreis(info, 2);
  const mediationGesamt = mediation + (scheidungDanach?.gesamt ?? 0);
  const gescheitert = mediation + gericht.gesamt;
  const ersparnis = gericht.gesamt - mediationGesamt;

  const zeit = useMemo(
    () => zeithonorar(wert, stundensatz, stunden),
    [wert, stundensatz, stunden],
  );

  const wechseln = (k: Konfliktart) => {
    setArt(k);
    setStreitwert(konfliktartAus(arten, k).streitwertDefault);
  };

  return (
    <div className={className}>
      {/* ── EINGABE ─────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border-2 border-accent-200 bg-white p-6 sm:p-8">
        <fieldset>
          <legend className="text-sm font-bold uppercase tracking-wide text-neutral-500">
            1. Worum geht es?
          </legend>
          <div className="mt-4 flex flex-wrap gap-2">
            {arten.map((k) => (
              <button
                key={k.key}
                type="button"
                onClick={() => wechseln(k.key)}
                aria-pressed={art === k.key}
                className={
                  art === k.key
                    ? "rounded-xl border-2 border-accent-600 bg-accent-600 px-4 py-2 text-sm font-bold text-white"
                    : "rounded-xl border-2 border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-accent-300"
                }
              >
                {k.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-8">
          <legend className="text-sm font-bold uppercase tracking-wide text-neutral-500">
            2. Wie hoch ist der Wert?
          </legend>

          {istTrennung ? (
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-neutral-900">
                  Monatliches Nettoeinkommen beider Ehegatten zusammen
                </span>
                <input
                  type="number"
                  min={0}
                  step={100}
                  value={monatsnetto}
                  onChange={(e) => setMonatsnetto(zahl(e.target.value, 0))}
                  className="mt-2 w-full rounded-xl border-2 border-neutral-200 px-4 py-2.5 text-lg font-semibold text-neutral-900 focus:border-accent-500 focus:outline-none"
                />
                <span className="mt-1 block text-xs text-neutral-500">
                  Beide Einkommen addiert, nach Steuern. Daraus errechnet das
                  Gericht den Verfahrenswert (§ 43 FamGKG).
                </span>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-neutral-900">
                  Anrechte im Versorgungsausgleich
                </span>
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={anrechte}
                  onChange={(e) => setAnrechte(Math.max(0, Math.min(20, Number(e.target.value) || 0)))}
                  className="mt-2 w-full rounded-xl border-2 border-neutral-200 px-4 py-2.5 text-lg font-semibold text-neutral-900 focus:border-accent-500 focus:outline-none"
                />
                <span className="mt-1 block text-xs text-neutral-500">
                  Meist je ein gesetzliches Rentenanrecht pro Person, also 2.
                  Betriebsrenten zählen zusätzlich (§ 50 FamGKG).
                </span>
              </label>
            </div>
          ) : (
            <label className="mt-4 block">
              <span className="text-sm font-medium text-neutral-900">
                Streitwert in Euro
              </span>
              <input
                type="number"
                min={0}
                step={500}
                value={streitwert}
                onChange={(e) => setStreitwert(zahl(e.target.value, 0))}
                className="mt-2 w-full max-w-sm rounded-xl border-2 border-neutral-200 px-4 py-2.5 text-lg font-semibold text-neutral-900 focus:border-accent-500 focus:outline-none"
              />
              <span className="mt-1 block max-w-xl text-xs text-neutral-500">
                {info.streitwertHinweis}
              </span>
            </label>
          )}

          {istTrennung && (
            <p className="mt-4 rounded-xl bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
              Verfahrenswert:{" "}
              <strong className="font-bold text-neutral-900">
                {euroGlatt(wert)}
              </strong>{" "}
              <span className="text-neutral-500">
                ({euroGlatt(verfahrenswertEhesache(monatsnetto))} Ehesache
                {anrechte > 0
                  ? ` + ${euroGlatt(verfahrenswertVersorgungsausgleich(monatsnetto, anrechte))} Versorgungsausgleich`
                  : ""}
                )
              </span>
            </p>
          )}
        </fieldset>

        <fieldset className="mt-8">
          <legend className="text-sm font-bold uppercase tracking-wide text-neutral-500">
            3. Wer ist anwaltlich vertreten?
          </legend>
          <label className="mt-4 flex items-start gap-3">
            <input
              type="checkbox"
              checked={gegenseiteAnwalt}
              onChange={(e) => setGegenseiteAnwalt(e.target.checked)}
              className="mt-1 h-5 w-5 rounded border-2 border-neutral-300 text-accent-600 focus:ring-accent-500"
            />
            <span className="text-sm text-neutral-700">
              Auch die Gegenseite nimmt sich einen eigenen Anwalt
              <span className="block text-xs text-neutral-500">
                Im streitigen Verfahren die Regel. Wer verliert, zahlt beide
                Seiten.
              </span>
            </span>
          </label>
        </fieldset>
      </div>

      {/* ── ERGEBNIS ────────────────────────────────────────────────────── */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Karte 1: Gerichtsweg */}
        <div className="rounded-2xl border-2 border-neutral-300 bg-white p-6">
          <div className="text-xs font-bold uppercase tracking-wide text-neutral-500">
            Vor Gericht
          </div>
          <div className="mt-2 text-3xl font-black text-neutral-900">
            {euro(gericht.gesamt)}
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            Kostenrisiko, wenn Sie vollständig unterliegen
          </p>

          <details className="mt-5 group">
            <summary className="cursor-pointer list-none text-sm font-semibold text-accent-700 hover:underline">
              Einzelposten anzeigen
            </summary>
            <dl className="mt-3 space-y-2 text-sm">
              <Posten
                label={`Gerichtskosten (${gericht.gerichtssatz.toLocaleString("de-DE", { minimumFractionDigits: 1 })}-Gebühr)`}
                quelle={istTrennung ? "KV 1110 FamGKG" : "KV 1210 GKG"}
                wert={gericht.gerichtskosten}
              />
              <Posten
                label="Verfahrensgebühr 1,3"
                quelle="Nr. 3100 VV RVG"
                wert={gericht.anwalt.verfahrensgebuehr}
              />
              <Posten
                label="Terminsgebühr 1,2"
                quelle="Nr. 3104 VV RVG"
                wert={gericht.anwalt.terminsgebuehr}
              />
              <Posten
                label="Auslagenpauschale"
                quelle="Nr. 7002 VV RVG"
                wert={gericht.anwalt.auslagen}
              />
              <Posten
                label="Umsatzsteuer 19 %"
                quelle="Nr. 7008 VV RVG"
                wert={gericht.anwalt.ust}
              />
              <div className="flex justify-between border-t border-neutral-200 pt-2 font-semibold text-neutral-900">
                <span>Anwalt je Partei</span>
                <span>{euro(gericht.anwalt.brutto)}</span>
              </div>
              <p className="pt-1 text-xs text-neutral-500">
                {anwaelte === 2
                  ? "× 2 Parteien, plus Gerichtskosten."
                  : "Nur eine Seite anwaltlich vertreten."}{" "}
                Basis: 1,0-Gebühr {euro(gericht.anwalt.basis)} aus Anlage 2 RVG
                bei einem Wert von {euroGlatt(wert)}.
              </p>
            </dl>
          </details>
        </div>

        {/* Karte 2: Mediation */}
        <div className="rounded-2xl border-2 border-accent-500 bg-accent-50/40 p-6 ring-1 ring-accent-500/20">
          <div className="text-xs font-bold uppercase tracking-wide text-accent-700">
            Mit medipact
          </div>
          <div className="mt-2 text-3xl font-black text-accent-700">
            {euro(mediationGesamt)}
          </div>
          <p className="mt-1 text-xs text-neutral-600">
            {istTrennung
              ? "Mediation + einvernehmliche Scheidung"
              : info.proPartei
                ? `${euroGlatt(info.preis)} pro Partei, feststehend`
                : "einmalig für den gesamten Fall, feststehend"}
          </p>

          <details className="mt-5">
            <summary className="cursor-pointer list-none text-sm font-semibold text-accent-700 hover:underline">
              Einzelposten anzeigen
            </summary>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-700">
                  Mediation{info.proPartei ? " (2 × " + euroGlatt(info.preis) + ")" : ""}
                </span>
                <span className="font-medium">{euro(mediation)}</span>
              </div>
              {scheidungDanach && (
                <>
                  <div className="flex justify-between">
                    <span className="text-neutral-700">
                      Gerichtskosten Scheidung
                    </span>
                    <span className="font-medium">
                      {euro(scheidungDanach.gerichtskosten)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-700">
                      Ein Anwalt (Antragstellung)
                    </span>
                    <span className="font-medium">
                      {euro(scheidungDanach.anwalt.brutto)}
                    </span>
                  </div>
                </>
              )}
              <div className="flex justify-between border-t border-accent-200 pt-2 font-semibold text-neutral-900">
                <span>Gesamt</span>
                <span>{euro(mediationGesamt)}</span>
              </div>
            </dl>
          </details>

          {istTrennung && (
            <p className="mt-4 rounded-xl bg-white/70 px-3 py-2 text-xs leading-5 text-neutral-600">
              Wichtig: Mediation ersetzt die Scheidung nicht. Eine Ehe wird nur
              durch das Gericht geschieden, und dafür ist mindestens ein Anwalt
              vorgeschrieben (§ 114 FamFG). Was Mediation ändert: aus einem
              streitigen wird ein einvernehmliches Verfahren.
            </p>
          )}

          {ersparnis > 0 && (
            <p className="mt-4 text-sm font-semibold text-accent-700">
              Differenz: {euro(ersparnis)}
            </p>
          )}
        </div>

        {/* Karte 3: gescheitert */}
        <div className="rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 p-6">
          <div className="text-xs font-bold uppercase tracking-wide text-neutral-500">
            Wenn die Mediation scheitert
          </div>
          <div className="mt-2 text-3xl font-black text-neutral-700">
            {euro(gescheitert)}
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            Mediationskosten plus anschließendes Gerichtsverfahren
          </p>
          <p className="mt-5 text-sm leading-6 text-neutral-600">
            Diese Zahl gehört zur Wahrheit dazu. Sie liegt um{" "}
            <strong className="text-neutral-900">{euro(mediation)}</strong> über
            dem reinen Gerichtsweg – das ist das Risiko, das Sie eingehen. Umgekehrt
            gilt: Was in der Mediation bereits geklärt wurde, verkleinert den
            Streitgegenstand und damit den Streitwert vor Gericht.
          </p>
        </div>
      </div>

      {/* ── ZEITHONORAR ─────────────────────────────────────────────────── */}
      <div className="mt-10 rounded-2xl border-2 border-neutral-900 bg-neutral-900 p-6 text-white sm:p-8">
        <h2 className="font-display text-2xl font-medium">
          Und was, wenn Ihr Anwalt nach Stunden abrechnet?
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-300">
          Die Beträge oben sind die <strong className="text-white">gesetzliche
          Untergrenze</strong>. Bei gerichtlicher Vertretung darf ein Anwalt
          nicht weniger verlangen (§ 49b Abs. 1 BRAO) – nach oben ist die
          Vergütung frei vereinbar (§ 3a RVG). Im Familienrecht ist ein
          Zeithonorar nicht die Ausnahme, sondern der Regelfall. Übliche Sätze
          bei Fachanwälten liegen bei 250 bis 400 Euro pro Stunde netto;
          spezialisierte Kanzleien nennen 380 Euro aufwärts, und die
          Rechtsprechung hält Sätze bis 350 bis 400 Euro seit Jahren für
          unbedenklich.
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-neutral-200">
              Stundensatz (netto): {euroGlatt(stundensatz)}
            </span>
            <input
              type="range"
              min={STUNDENSATZ_MIN}
              max={STUNDENSATZ_MAX}
              step={10}
              value={stundensatz}
              onChange={(e) => setStundensatz(Number(e.target.value))}
              className="mt-3 w-full accent-accent-400"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-neutral-200">
              Geschätzter Aufwand: {stunden} Stunden
            </span>
            <input
              type="range"
              min={2}
              max={80}
              step={1}
              value={stunden}
              onChange={(e) => setStunden(Number(e.target.value))}
              className="mt-3 w-full accent-accent-400"
            />
          </label>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Kennzahl
            label="Zeithonorar (brutto)"
            wert={euro(zeit.brutto)}
          />
          <Kennzahl
            label="Gesetzliche Gebühr (brutto)"
            wert={euro(gericht.anwalt.brutto)}
          />
          <Kennzahl
            label={zeit.mehrkosten >= 0 ? "Mehrkosten" : "Weniger"}
            wert={euro(Math.abs(zeit.mehrkosten))}
            hervorheben
          />
        </div>

        <p className="mt-6 max-w-3xl text-sm leading-6 text-neutral-300">
          Bei {euroGlatt(stundensatz)} pro Stunde ist das Zeithonorar ab{" "}
          <strong className="text-white">
            {zeit.breakEvenStunden.toLocaleString("de-DE")} Stunden
          </strong>{" "}
          teurer als die gesetzliche Gebühr. Schriftsätze, Akteneinsicht,
          Telefonate, Termine und Korrespondenz mit der Gegenseite summieren
          sich in einem streitigen Verfahren regelmäßig auf ein Vielfaches
          davon.
        </p>

        <p className="mt-4 max-w-3xl rounded-xl bg-white/10 px-4 py-3 text-sm leading-6 text-neutral-200">
          <strong className="text-white">Der Teil, den kaum jemand erwähnt:</strong>{" "}
          Was über die gesetzliche Gebühr hinausgeht, bekommen Sie nie erstattet
          – auch wenn Sie den Prozess gewinnen. Die unterlegene Partei muss nur
          die <em>gesetzlichen</em> Gebühren ersetzen (§ 91 Abs. 2 Satz 1 ZPO).
          {istTrennung
            ? " Bei einer Scheidung wird ohnehin nichts erstattet: Die Kosten werden gegeneinander aufgehoben, jede Seite trägt ihre Anwaltskosten selbst (§ 150 Abs. 1 FamFG)."
            : ""}{" "}
          Die Differenz von {euro(Math.max(0, zeit.mehrkosten))} ist in jedem
          Ausgang verlorenes Geld.
        </p>
      </div>

      {/* ── DISCLAIMER + CTA ────────────────────────────────────────────── */}
      <p className="mt-8 rounded-xl border border-neutral-200 bg-neutral-50 px-5 py-4 text-xs leading-6 text-neutral-600">
        Unverbindliche Berechnung nach den gesetzlichen Gebührentabellen
        (GKG, FamGKG, RVG – Stand {KOSTENRECHT_STAND}). Keine Rechtsberatung.
        Der tatsächliche Streit- bzw. Verfahrenswert wird vom Gericht
        festgesetzt und kann abweichen; hinzu kommen je nach Verfahren
        Auslagen für Zeugen, Sachverständige und Dolmetscher. Berufungs- und
        Revisionsinstanz sind nicht enthalten.
      </p>

      <div className="mt-8 flex flex-col items-start gap-4 rounded-2xl border-2 border-accent-300 bg-accent-50/50 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <h2 className="font-display text-xl font-medium text-neutral-900">
            {info.label} ohne Gericht klären
          </h2>
          <p className="mt-1 max-w-xl text-sm leading-6 text-neutral-600">
            Fester Preis, kein Kostenrisiko, kein Termindruck. Und wenn Sie
            noch nicht so weit sind: Dokumentieren Sie den Konflikt erst einmal
            kostenlos im{" "}
            <Link href="/konflikt-logbuch" className="font-semibold text-accent-700 underline">
              Konflikt-Logbuch
            </Link>
            .
          </p>
        </div>
        <Link
          href={info.href}
          className="shrink-0 rounded-xl bg-accent-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-accent-700"
        >
          Mehr erfahren →
        </Link>
      </div>
    </div>
  );
}

function Posten({
  label,
  quelle,
  wert,
}: {
  label: string;
  quelle: string;
  wert: number;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-neutral-700">
        {label}
        <span className="ml-1 text-xs text-neutral-400">{quelle}</span>
      </span>
      <span className="shrink-0 font-medium tabular-nums">{euro(wert)}</span>
    </div>
  );
}

function Kennzahl({
  label,
  wert,
  hervorheben,
}: {
  label: string;
  wert: string;
  hervorheben?: boolean;
}) {
  return (
    <div
      className={
        hervorheben
          ? "rounded-xl bg-accent-500/20 px-4 py-3 ring-1 ring-accent-400/40"
          : "rounded-xl bg-white/5 px-4 py-3"
      }
    >
      <div className="text-xs uppercase tracking-wide text-neutral-400">
        {label}
      </div>
      <div
        className={
          hervorheben
            ? "mt-1 text-2xl font-black text-accent-300"
            : "mt-1 text-2xl font-black text-white"
        }
      >
        {wert}
      </div>
    </div>
  );
}
