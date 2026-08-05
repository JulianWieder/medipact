"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  GUTACHTEN_STUNDEN_DEFAULT,
  GUTACHTEN_STUNDEN_MAX,
  GUTACHTEN_STUNDEN_MIN,
  JVEG_SATZ,
  KINDSCHAFTSSACHEN,
  KINDSCHAFT_WERT,
  KOSTENRECHT_STAND,
  STUNDENSATZ_DEFAULT,
  STUNDENSATZ_MAX,
  STUNDENSATZ_MIN,
  eskalation,
  euro,
  euroGlatt,
  gerichtsSzenario,
  kindschaftZuschlagVerbund,
  konfliktart,
  konfliktartAus,
  medipactPreis,
  mitPreisen,
  verfahrensbeistandKosten,
  verfahrenswertEhesache,
  verfahrenswertKindschaft,
  verfahrenswertVersorgungsausgleich,
  zeithonorar,
  type Kindschaftsgegenstand,
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
// 4. Bei Sorge und Umgang gilt das GEGENTEIL, und das ist der Grund für die
//    eigene Konfliktart: Eine Umgangs- oder Sorgevereinbarung braucht kein
//    Gericht. Hier ersetzt die Mediation das Verfahren tatsächlich.
// 5. Die drei Ergebniskarten zeigen ausschließlich die Gebührentabellen. In
//    Kindschaftssachen ist das systematisch zu niedrig, weil Gutachten und
//    Verfahrensbeistand nicht am Verfahrenswert hängen – deshalb der eigene
//    Block "Was der Streit um die Kinder wirklich kostet" darunter. Die
//    beiden Rechnungen NICHT vermischen, sonst wird doppelt gezählt.

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

const ALLE_GEGENSTAENDE = KINDSCHAFTSSACHEN.map((s) => s.key);

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

  // Kindschaftssachen. Beim Einstieg über ?art=kindschaft sind Sorge und
  // Umgang vorbelegt – das ist die mit Abstand häufigste Kombination. Im
  // Verbund bleibt die Auswahl leer, damit sich das bisherige Ergebnis der
  // Scheidungsrechnung nicht ohne Zutun des Nutzers ändert.
  const [gegenstaende, setGegenstaende] = useState<Kindschaftsgegenstand[]>(
    start === "kindschaft" ? ["sorge", "umgang"] : [],
  );
  const [kinder, setKinder] = useState(1);
  const [gutachten, setGutachten] = useState(true);
  const [gutachtenStunden, setGutachtenStunden] = useState(
    GUTACHTEN_STUNDEN_DEFAULT,
  );
  const [gutachtenSatz, setGutachtenSatz] = useState<number>(JVEG_SATZ.m3);
  const [beistand, setBeistand] = useState(true);
  const [eilantrag, setEilantrag] = useState(false);
  const [beschwerde, setBeschwerde] = useState(false);
  const [abaenderungen, setAbaenderungen] = useState(0);

  const arten = useMemo(() => mitPreisen(preise), [preise]);
  const info = konfliktartAus(arten, art);
  const istTrennung = art === "trennung";
  const istKindschaft = art === "kindschaft";

  const anzahlGegenstaende = gegenstaende.length;
  const ehesachenwert = verfahrenswertEhesache(monatsnetto);
  const verbundZuschlag = kindschaftZuschlagVerbund(
    ehesachenwert,
    istTrennung ? anzahlGegenstaende : 0,
  );
  /** Wert der Kindschaftssache(n) für sich – Basis des Eskalationsblocks. */
  const kindschaftWert = verfahrenswertKindschaft(anzahlGegenstaende);

  const wert = useMemo(() => {
    if (istKindschaft) return kindschaftWert;
    if (!istTrennung) return streitwert;
    return (
      ehesachenwert +
      verfahrenswertVersorgungsausgleich(monatsnetto, anrechte) +
      verbundZuschlag
    );
  }, [
    istKindschaft,
    istTrennung,
    kindschaftWert,
    streitwert,
    ehesachenwert,
    monatsnetto,
    anrechte,
    verbundZuschlag,
  ]);

  const anwaelte = gegenseiteAnwalt ? 2 : 1;

  const gericht = useMemo(
    () => gerichtsSzenario(wert, info.gerichtssatz, anwaelte),
    [wert, info.gerichtssatz, anwaelte],
  );

  // Bei Trennung: einvernehmliche Scheidung nach Mediation – ein Anwalt
  // stellt den Antrag, der andere stimmt zu. Gerichtskosten bleiben.
  // Bei Sorge und Umgang gibt es diesen Zwang nicht: Dort ersetzt die
  // Vereinbarung das Verfahren vollständig.
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

  // Der Eskalationsblock erscheint, sobald Kinder im Spiel sind – als
  // eigenständiges Verfahren (istKindschaft) oder als Folgesache im Verbund.
  const zeigeEskalation = istKindschaft || (istTrennung && anzahlGegenstaende > 0);

  const esk = useMemo(
    () =>
      eskalation({
        wert: kindschaftWert,
        kinder,
        // Im Verbund steckt die erste Instanz schon in der Scheidungsrechnung.
        hauptsache: istKindschaft,
        eilantrag,
        gutachten,
        gutachtenStunden,
        gutachtenSatz,
        verfahrensbeistand: beistand,
        beschwerde,
        abaenderungen,
      }),
    [
      kindschaftWert,
      kinder,
      istKindschaft,
      eilantrag,
      gutachten,
      gutachtenStunden,
      gutachtenSatz,
      beistand,
      beschwerde,
      abaenderungen,
    ],
  );

  const wechseln = (k: Konfliktart) => {
    setArt(k);
    setStreitwert(konfliktartAus(arten, k).streitwertDefault);
    if (k === "kindschaft" && gegenstaende.length === 0) {
      setGegenstaende(["sorge", "umgang"]);
    }
  };

  const umschalten = (key: Kindschaftsgegenstand) => {
    setGegenstaende((vorher) => {
      const drin = vorher.includes(key);
      const neu = drin
        ? vorher.filter((g) => g !== key)
        : ALLE_GEGENSTAENDE.filter((g) => g === key || vorher.includes(g));
      // In der eigenständigen Kindschaftssache muss ein Gegenstand bleiben,
      // sonst gäbe es keinen Verfahrenswert.
      return istKindschaft && neu.length === 0 ? vorher : neu;
    });
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
            {istKindschaft ? "2. Worüber wird gestritten?" : "2. Wie hoch ist der Wert?"}
          </legend>

          {istKindschaft ? (
            <>
              <div className="mt-4 space-y-3">
                {KINDSCHAFTSSACHEN.map((s) => (
                  <Gegenstand
                    key={s.key}
                    label={s.label}
                    hinweis={s.hinweis}
                    zusatz={`+ ${euroGlatt(KINDSCHAFT_WERT)} Verfahrenswert`}
                    aktiv={gegenstaende.includes(s.key)}
                    onChange={() => umschalten(s.key)}
                  />
                ))}
              </div>
              <KinderFeld wert={kinder} onChange={setKinder} />
              <p className="mt-4 rounded-xl bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
                Verfahrenswert:{" "}
                <strong className="font-bold text-neutral-900">
                  {euroGlatt(kindschaftWert)}
                </strong>{" "}
                <span className="text-neutral-500">
                  ({anzahlGegenstaende} × {euroGlatt(KINDSCHAFT_WERT)} nach § 45
                  Abs. 1 FamGKG – unabhängig davon, wie viele Kinder betroffen
                  sind und wie lange das Verfahren dauert)
                </span>
              </p>
            </>
          ) : istTrennung ? (
            <>
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

              {/* Folgesachen. Kein Detail am Rand: Wer Sorge oder Umgang mit
                  in die Scheidung nimmt, hebt den Verfahrenswert um bis zu
                  10.000 € – und öffnet die Tür für Gutachten und
                  Verfahrensbeistand, die mit dem Wert gar nichts zu tun
                  haben. */}
              <div className="mt-6 rounded-xl border-2 border-neutral-200 p-5">
                <p className="text-sm font-semibold text-neutral-900">
                  Wird auch über die Kinder gestritten?
                </p>
                <p className="mt-1 text-xs leading-5 text-neutral-500">
                  Als Folgesache der Scheidung erhöht jede Kindschaftssache den
                  Verfahrenswert um 20 % des Ehesachenwerts, höchstens um
                  5.000 € (§ 44 Abs. 2 Satz 1 FamGKG). Ohne Streit hierüber
                  einfach nichts auswählen.
                </p>
                <div className="mt-4 space-y-3">
                  {KINDSCHAFTSSACHEN.map((s) => (
                    <Gegenstand
                      key={s.key}
                      label={s.label}
                      hinweis={s.hinweis}
                      zusatz={`+ ${euroGlatt(kindschaftZuschlagVerbund(ehesachenwert, 1))} Verfahrenswert`}
                      aktiv={gegenstaende.includes(s.key)}
                      onChange={() => umschalten(s.key)}
                    />
                  ))}
                </div>
                {anzahlGegenstaende > 0 && (
                  <KinderFeld wert={kinder} onChange={setKinder} />
                )}
              </div>

              <p className="mt-4 rounded-xl bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
                Verfahrenswert:{" "}
                <strong className="font-bold text-neutral-900">
                  {euroGlatt(wert)}
                </strong>{" "}
                <span className="text-neutral-500">
                  ({euroGlatt(ehesachenwert)} Ehesache
                  {anrechte > 0
                    ? ` + ${euroGlatt(verfahrenswertVersorgungsausgleich(monatsnetto, anrechte))} Versorgungsausgleich`
                    : ""}
                  {verbundZuschlag > 0
                    ? ` + ${euroGlatt(verbundZuschlag)} für ${anzahlGegenstaende} Kindschaftssache${anzahlGegenstaende > 1 ? "n" : ""}`
                    : ""}
                  )
                </span>
              </p>
            </>
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
                {istKindschaft
                  ? "In Sorge- und Umgangsverfahren besteht kein Anwaltszwang – sobald aber eine Seite anwaltlich auftritt, zieht die andere praktisch immer nach."
                  : "Im streitigen Verfahren die Regel. Wer verliert, zahlt beide Seiten."}
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
            {istKindschaft
              ? "Nur die Gebührentabelle – die eigentliche Rechnung steht weiter unten"
              : "Kostenrisiko, wenn Sie vollständig unterliegen"}
          </p>

          <details className="mt-5 group">
            <summary className="cursor-pointer list-none text-sm font-semibold text-accent-700 hover:underline">
              Einzelposten anzeigen
            </summary>
            <dl className="mt-3 space-y-2 text-sm">
              <Posten
                label={`Gerichtskosten (${gericht.gerichtssatz.toLocaleString("de-DE", { minimumFractionDigits: 1 })}-Gebühr)`}
                quelle={
                  istKindschaft
                    ? "KV 1310 FamGKG"
                    : istTrennung
                      ? "KV 1110 FamGKG"
                      : "KV 1210 GKG"
                }
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

          {istKindschaft && (
            <p className="mt-4 rounded-xl bg-white/70 px-3 py-2 text-xs leading-5 text-neutral-600">
              Anders als bei der Scheidung ist hier kein Gericht nötig: Eltern
              dürfen Sorge und Umgang frei vereinbaren. Wer die Vereinbarung
              vollstreckbar haben will, lässt sie familiengerichtlich billigen
              (§ 156 Abs. 2 FamFG) – ein Termin, keine Beweisaufnahme, kein
              Gutachten.
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

      {/* ── SORGE & UMGANG: DIE ZAHLEN NEBEN DER TABELLE ────────────────── */}
      {zeigeEskalation && (
        <div className="mt-10 rounded-2xl border-2 border-accent-300 bg-white p-6 sm:p-8">
          <h2 className="font-display text-2xl font-medium text-neutral-900">
            Was der Streit um die Kinder wirklich kostet
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-700">
            In Kindschaftssachen sagt der Verfahrenswert am wenigsten über die
            Rechnung aus. Er ist bei {euroGlatt(KINDSCHAFT_WERT)} je Gegenstand
            gedeckelt, die Kosten sind es nicht: Ein familienpsychologisches
            Gutachten wird nach Stunden vergütet, der Verfahrensbeistand nach
            Pauschale, und jede weitere Runde – Eilantrag, Beschwerde,
            Abänderung – ist kostenrechtlich ein eigenes Verfahren mit eigenen
            Gebühren. Deshalb liegen die Beträge hier regelmäßig um ein
            Vielfaches über der Zahl in der ersten Karte.
          </p>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1fr]">
            {/* Schalter */}
            <div className="space-y-3">
              <Schalter
                aktiv={gutachten}
                onChange={() => setGutachten((v) => !v)}
                label="Familienpsychologisches Gutachten"
                hinweis="Wird angeordnet, sobald das Gericht die Erziehungsfähigkeit oder den Kindeswillen klären will (§ 163 FamFG). In strittigen Verfahren ist das eher die Regel als die Ausnahme – und praktisch immer der größte Posten."
              />
              {gutachten && (
                <div className="ml-8 space-y-4 rounded-xl bg-neutral-50 px-4 py-4">
                  <label className="block">
                    <span className="text-sm font-medium text-neutral-900">
                      Umfang: {gutachtenStunden} Stunden
                    </span>
                    <input
                      type="range"
                      min={GUTACHTEN_STUNDEN_MIN}
                      max={GUTACHTEN_STUNDEN_MAX}
                      step={5}
                      value={gutachtenStunden}
                      onChange={(e) => setGutachtenStunden(Number(e.target.value))}
                      className="mt-2 w-full accent-accent-600"
                    />
                    <span className="mt-1 block text-xs text-neutral-500">
                      Exploration beider Eltern, Gespräche mit den Kindern,
                      Verhaltensbeobachtung, Tests, Aktenstudium, Gutachtentext.
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        ["M 2", JVEG_SATZ.m2],
                        ["M 3", JVEG_SATZ.m3],
                      ] as const
                    ).map(([label, satz]) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setGutachtenSatz(satz)}
                        aria-pressed={gutachtenSatz === satz}
                        className={
                          gutachtenSatz === satz
                            ? "rounded-lg border-2 border-accent-600 bg-accent-600 px-3 py-1.5 text-xs font-bold text-white"
                            : "rounded-lg border-2 border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700"
                        }
                      >
                        Honorargruppe {label} · {euroGlatt(satz)}/h
                      </button>
                    ))}
                  </div>
                  <p className="text-xs leading-5 text-neutral-500">
                    Stundensätze nach Anlage 1 Teil 2 zu § 9 JVEG. In welche
                    Gruppe ein familienpsychologisches Gutachten fällt,
                    entscheidet das Gericht bei der Beauftragung; die
                    Umsatzsteuer kommt hinzu (§ 12 Abs. 1 Satz 2 Nr. 4 JVEG).
                  </p>
                </div>
              )}

              <Schalter
                aktiv={beistand}
                onChange={() => setBeistand((v) => !v)}
                label={`Verfahrensbeistand (${euroGlatt(verfahrensbeistandKosten(kinder))} je Rechtszug)`}
                hinweis={`Anwalt des Kindes, in Sorge- und Umgangsverfahren regelmäßig bestellt (§ 158 FamFG). Pauschal ${euroGlatt(690)} für das erste, ${euroGlatt(555)} für jedes weitere Kind im selben Haushalt (§ 158c Abs. 1 FamFG).`}
              />

              <Schalter
                aktiv={eilantrag}
                onChange={() => setEilantrag((v) => !v)}
                label="Einstweilige Anordnung vorweg"
                hinweis="Der übliche Auftakt, wenn ein Elternteil den Umgang verweigert oder das Kind mitnimmt. Eigenes Verfahren mit eigenen Gebühren, Wert in der Regel die Hälfte der Hauptsache (§ 41 FamGKG)."
              />

              <Schalter
                aktiv={beschwerde}
                onChange={() => setBeschwerde((v) => !v)}
                label="Beschwerde zum Oberlandesgericht"
                hinweis="Zweite Instanz. Die Verfahrensgebühr des Anwalts steigt auf 1,6 (Nr. 3200 VV RVG), der Verfahrensbeistand bekommt seine Pauschale erneut."
              />

              <div className="rounded-xl border-2 border-neutral-200 px-4 py-4">
                <label className="block">
                  <span className="text-sm font-medium text-neutral-900">
                    Spätere Abänderungsverfahren: {abaenderungen}
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={3}
                    step={1}
                    value={abaenderungen}
                    onChange={(e) => setAbaenderungen(Number(e.target.value))}
                    className="mt-2 w-full accent-accent-600"
                  />
                  <span className="mt-1 block text-xs leading-5 text-neutral-500">
                    Der Punkt, den fast alle Rechner unterschlagen: Eine
                    Sorge- oder Umgangsentscheidung ist nie endgültig. Sie kann
                    jederzeit abgeändert werden, wenn triftige Gründe es
                    erfordern (§ 1696 Abs. 1 BGB, § 166 FamFG). Jede Runde
                    kostet erneut – und in hoch strittigen Fällen folgen
                    mehrere.
                  </span>
                </label>
              </div>
            </div>

            {/* Ergebnis */}
            <div className="rounded-2xl bg-neutral-900 p-6 text-white">
              <div className="text-xs font-bold uppercase tracking-wide text-neutral-400">
                Pro Elternteil
              </div>
              <div className="mt-2 text-4xl font-black text-accent-300">
                {euro(esk.proElternteil)}
              </div>
              <p className="mt-2 text-xs leading-5 text-neutral-400">
                {istKindschaft
                  ? "Einschließlich des Hauptsacheverfahrens aus der Tabelle oben."
                  : "Zusätzlich zur Scheidungsrechnung oben – dort steckt die erste Instanz bereits drin."}
              </p>

              <dl className="mt-5 space-y-2 text-sm">
                {esk.posten.map((p) => (
                  <div key={p.label} className="flex items-baseline justify-between gap-3">
                    <span className="text-neutral-300">
                      {p.label}
                      <span className="ml-1 text-xs text-neutral-500">
                        {p.quelle}
                      </span>
                      {p.geteilt && (
                        <span className="ml-1 text-xs text-accent-400">½</span>
                      )}
                    </span>
                    <span className="shrink-0 font-medium tabular-nums">
                      {euro(p.wert)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-white/20 pt-2 font-semibold">
                  <span>Beide Eltern zusammen</span>
                  <span>{euro(esk.gesamt)}</span>
                </div>
              </dl>

              <p className="mt-5 rounded-xl bg-white/10 px-4 py-3 text-xs leading-5 text-neutral-200">
                <span className="text-accent-300">½</span> = Gerichtskosten und
                Auslagen, die in Sorge- und Umgangssachen regelmäßig halbiert
                werden. Die Anwaltskosten trägt jeder Elternteil selbst — und
                zwar unabhängig vom Ausgang: Über die Kosten entscheidet das
                Gericht nach billigem Ermessen (§ 81 FamFG), und die Regel ist,
                dass niemand dem anderen etwas erstattet. Es gibt hier kein
                Gewinnen, das die Rechnung kleiner macht.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── ZEITHONORAR ─────────────────────────────────────────────────── */}
      <div className="mt-10 rounded-2xl border-2 border-neutral-900 bg-neutral-900 p-6 text-white sm:p-8">
        <h2 className="font-display text-2xl font-medium">
          Und was, wenn Ihr Anwalt nach Stunden abrechnet?
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-300">
          Die Beträge oben sind das{" "}
          <strong className="text-white">gesetzliche Minimum</strong>. Weniger
          darf ein Anwalt vor Gericht nicht nehmen – mehr aber schon, wenn Sie
          eine Vergütungsvereinbarung unterschreiben. Im Familienrecht ist das
          der Normalfall: Die meisten Fachanwälte rechnen nach Stunden ab,
          üblich sind 250 bis 400 Euro pro Stunde zuzüglich Mehrwertsteuer.
          Gerichte halten solche Sätze seit Jahren für zulässig.
          <span className="mt-1 block text-xs text-neutral-400">
            § 49b Abs. 1 BRAO, § 3a RVG
          </span>
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
          Konkret heißt das: Nach Gesetz stehen Ihrem Anwalt für den{" "}
          <em>gesamten</em> Fall{" "}
          {euro(gericht.anwalt.netto - gericht.anwalt.auslagen)} zu. Bei{" "}
          {euroGlatt(stundensatz)} pro Stunde ist dieses Budget nach{" "}
          <strong className="text-white">
            {zeit.breakEvenStunden.toLocaleString("de-DE")} Stunden
          </strong>{" "}
          aufgebraucht. Jede weitere Stunde zahlen Sie obendrauf – und ein
          Streit vor Gericht besteht aus sehr viel mehr als vier Stunden
          Arbeit: jeder Schriftsatz, jedes Telefonat, jeder Gerichtstermin,
          jeder Brief an die Gegenseite.
          {istKindschaft
            ? " In Sorge- und Umgangsverfahren ist der Abstand am größten, weil der gedeckelte Verfahrenswert die gesetzliche Gebühr klein hält, während sich der Aufwand über Jahre zieht."
            : ""}
        </p>

        <p className="mt-4 max-w-3xl rounded-xl bg-white/10 px-4 py-3 text-sm leading-6 text-neutral-200">
          <strong className="text-white">Der Teil, den kaum jemand erwähnt:</strong>{" "}
          Wenn Sie gewinnen, muss die Gegenseite Ihre Anwaltskosten zahlen –
          aber nur bis zur gesetzlichen Gebühr. Alles, was Ihr Anwalt darüber
          hinaus abgerechnet hat, bleibt an Ihnen hängen.
          {istTrennung
            ? " Bei einer Scheidung bekommen Sie ohnehin nichts erstattet: Jede Seite zahlt ihren eigenen Anwalt, egal wie es ausgeht."
            : ""}
          {istKindschaft
            ? " Bei Sorge und Umgang gibt es kein Gewinnen im Kostensinn: Das Gericht entscheidet nach billigem Ermessen und hebt die außergerichtlichen Kosten in aller Regel gegeneinander auf."
            : ""}{" "}
          Die {euro(Math.max(0, zeit.mehrkosten))} Differenz sind also in jedem
          Fall weg.
          <span className="mt-1 block text-xs text-neutral-400">
            § 91 Abs. 2 Satz 1 ZPO
            {istTrennung ? ", § 150 Abs. 1 FamFG" : ""}
            {istKindschaft ? ", § 81 FamFG" : ""}
          </span>
        </p>
      </div>

      {/* ── DISCLAIMER + CTA ────────────────────────────────────────────── */}
      <p className="mt-8 rounded-xl border border-neutral-200 bg-neutral-50 px-5 py-4 text-xs leading-6 text-neutral-600">
        Unverbindliche Berechnung nach den gesetzlichen Gebührentabellen
        (GKG, FamGKG, RVG, JVEG – Stand {KOSTENRECHT_STAND}). Keine
        Rechtsberatung. Der tatsächliche Streit- bzw. Verfahrenswert wird vom
        Gericht festgesetzt und kann abweichen; in Kindschaftssachen darf es
        vom Regelwert nach oben oder unten abweichen, wenn dieser unbillig
        wäre (§ 45 Abs. 3, § 44 Abs. 3 FamGKG). Umfang und Honorargruppe eines
        Sachverständigengutachtens stehen erst mit der Beauftragung fest;
        hinzu kommen je nach Verfahren Auslagen für Zeugen und Dolmetscher.
        Die Rechtsbeschwerde zum BGH ist nicht enthalten.
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

/** Eine Kindschaftssache zum An- und Abwählen (Sorge, Umgang, Herausgabe). */
function Gegenstand({
  label,
  hinweis,
  zusatz,
  aktiv,
  onChange,
}: {
  label: string;
  hinweis: string;
  zusatz: string;
  aktiv: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-start gap-3">
      <input
        type="checkbox"
        checked={aktiv}
        onChange={onChange}
        className="mt-1 h-5 w-5 shrink-0 rounded border-2 border-neutral-300 text-accent-600 focus:ring-accent-500"
      />
      <span className="text-sm text-neutral-700">
        <span className="font-medium text-neutral-900">{label}</span>
        {aktiv && (
          <span className="ml-2 text-xs font-semibold text-accent-700">
            {zusatz}
          </span>
        )}
        <span className="mt-0.5 block text-xs leading-5 text-neutral-500">
          {hinweis}
        </span>
      </span>
    </label>
  );
}

/** Kinderzahl – ohne Einfluss auf den Wert, aber auf den Verfahrensbeistand. */
function KinderFeld({
  wert,
  onChange,
}: {
  wert: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="mt-5 block max-w-xs">
      <span className="text-sm font-medium text-neutral-900">
        Betroffene Kinder
      </span>
      <input
        type="number"
        min={1}
        max={10}
        value={wert}
        onChange={(e) =>
          onChange(Math.max(1, Math.min(10, Number(e.target.value) || 1)))
        }
        className="mt-2 w-full rounded-xl border-2 border-neutral-200 px-4 py-2.5 text-lg font-semibold text-neutral-900 focus:border-accent-500 focus:outline-none"
      />
      <span className="mt-1 block text-xs leading-5 text-neutral-500">
        Ändert den Verfahrenswert nicht (§ 45 Abs. 2 FamGKG), wohl aber die
        Vergütung des Verfahrensbeistands.
      </span>
    </label>
  );
}

/** Schalter im Eskalationsblock. */
function Schalter({
  aktiv,
  onChange,
  label,
  hinweis,
}: {
  aktiv: boolean;
  onChange: () => void;
  label: string;
  hinweis: string;
}) {
  return (
    <label className="flex items-start gap-3 rounded-xl border-2 border-neutral-200 px-4 py-4 transition hover:border-accent-300">
      <input
        type="checkbox"
        checked={aktiv}
        onChange={onChange}
        className="mt-1 h-5 w-5 shrink-0 rounded border-2 border-neutral-300 text-accent-600 focus:ring-accent-500"
      />
      <span className="text-sm text-neutral-700">
        <span className="font-medium text-neutral-900">{label}</span>
        <span className="mt-0.5 block text-xs leading-5 text-neutral-500">
          {hinweis}
        </span>
      </span>
    </label>
  );
}
