// lib/kostenrecht.ts
//
// Gesetzliche Kostenberechnung für den Prozesskostenrechner (/kostenrechner).
//
// ── Stand der Zahlen ────────────────────────────────────────────────────────
// Alle Tabellen und Beträge gelten seit dem 01.06.2025 (Kosten- und
// Betreuervergütungsrechtsänderungsgesetz 2025 – KostBRÄG 2025, BGBl. I
// Nr. 109 vom 07.04.2025). Verfahren, die vorher anhängig wurden, laufen
// nach altem Recht (§ 63 FamGKG, § 60 RVG) – für einen Rechner, der künftige
// Verfahren kalkuliert, irrelevant.
//
// Quellen (bei der nächsten Kostenrechtsreform hier nachziehen):
//   Anlage 2 GKG   https://dejure.org/gesetze/GKG/Anlage_2.html
//   § 34 GKG       https://dejure.org/gesetze/GKG/34.html
//   Anlage 2 RVG   https://dejure.org/gesetze/RVG/Anlage_2.html
//   § 13 RVG       https://dejure.org/gesetze/RVG/13.html
//
// ── Wichtige Vereinfachung ──────────────────────────────────────────────────
// Die Wertgebührentabelle nach § 34 GKG (Zivilsachen) und die nach § 28
// FamGKG (Familiensachen) sind WERTGLEICH. Es gibt hier deshalb nur EINE
// Gerichtsgebührentabelle; Zivil- und Familiensachen unterscheiden sich
// ausschließlich im Gebührensatz (3,0 vs. 2,0).
//
// ── Was dieser Code NICHT tut ───────────────────────────────────────────────
// Keine Bewertung von Erfolgsaussichten, keine Handlungsempfehlung, keine
// Einzelfallprüfung. Das ist bewusst so: Die reine Anwendung allgemeiner
// gesetzlicher Gebührentabellen ist keine Rechtsdienstleistung i.S.d. § 2 RDG.
// Wer hier später "Sie sollten klagen / nicht klagen" ergänzt, verlässt
// diesen sicheren Bereich.

export const KOSTENRECHT_STAND = "01.06.2025";

// ── Gerichtsgebühr, 1,0-Satz (Anlage 2 GKG = Anlage 2 FamGKG) ───────────────
// [Wertgrenze, Gebühr]. Ober-Stufen-Suche: die erste Stufe, deren Grenzwert
// >= Streitwert ist. NICHT interpolieren – das Gesetz kennt nur Stufen.
const GERICHTSGEBUEHR: ReadonlyArray<readonly [number, number]> = [
  [500, 40.0], [1000, 61.0], [1500, 82.0], [2000, 103.0],
  [3000, 125.5], [4000, 148.0], [5000, 170.5], [6000, 193.0],
  [7000, 215.5], [8000, 238.0], [9000, 260.5], [10000, 283.0],
  [13000, 313.5], [16000, 344.0], [19000, 374.5], [22000, 405.0],
  [25000, 435.5], [30000, 476.0], [35000, 516.5], [40000, 557.0],
  [45000, 597.5], [50000, 638.0], [65000, 778.0], [80000, 918.0],
  [95000, 1058.0], [110000, 1198.0], [125000, 1338.0], [140000, 1478.0],
  [155000, 1618.0], [170000, 1758.0], [185000, 1898.0], [200000, 2038.0],
  [230000, 2248.0], [260000, 2458.0], [290000, 2668.0], [320000, 2878.0],
  [350000, 3088.0], [380000, 3298.0], [410000, 3508.0], [440000, 3718.0],
  [470000, 3928.0], [500000, 4138.0],
];

// ── Anwaltsgebühr, 1,0-Satz (Anlage 2 RVG) ──────────────────────────────────
const ANWALTSGEBUEHR: ReadonlyArray<readonly [number, number]> = [
  [500, 51.5], [1000, 93.0], [1500, 134.5], [2000, 176.0],
  [3000, 235.5], [4000, 295.0], [5000, 354.5], [6000, 414.0],
  [7000, 473.5], [8000, 533.0], [9000, 592.5], [10000, 652.0],
  [13000, 707.0], [16000, 762.0], [19000, 817.0], [22000, 872.0],
  [25000, 927.0], [30000, 1013.0], [35000, 1099.0], [40000, 1185.0],
  [45000, 1271.0], [50000, 1357.0], [65000, 1456.5], [80000, 1556.0],
  [95000, 1655.5], [110000, 1755.0], [125000, 1854.5], [140000, 1954.0],
  [155000, 2053.5], [170000, 2153.0], [185000, 2252.5], [200000, 2352.0],
  [230000, 2492.0], [260000, 2632.0], [290000, 2772.0], [320000, 2912.0],
  [350000, 3052.0], [380000, 3192.0], [410000, 3332.0], [440000, 3472.0],
  [470000, 3612.0], [500000, 3752.0],
];

/**
 * Tabellen-Lookup mit gesetzlicher Fortschreibung oberhalb von 500.000 €.
 *
 * § 34 Abs. 1 GKG / § 13 Abs. 1 RVG: über 500.000 € erhöht sich die Gebühr
 * je angefangene weitere 50.000 € um einen festen Betrag (210 € Gericht,
 * 175 € Anwalt).
 */
function stufenGebuehr(
  tabelle: ReadonlyArray<readonly [number, number]>,
  wert: number,
  schrittBetrag: number,
): number {
  for (const [grenze, gebuehr] of tabelle) {
    if (wert <= grenze) return gebuehr;
  }
  const [letzteGrenze, letzteGebuehr] = tabelle[tabelle.length - 1];
  const schritte = Math.ceil((wert - letzteGrenze) / 50000);
  return letzteGebuehr + schritte * schrittBetrag;
}

export const gerichtsgebuehr1 = (wert: number) =>
  stufenGebuehr(GERICHTSGEBUEHR, wert, 210);

export const anwaltsgebuehr1 = (wert: number) =>
  stufenGebuehr(ANWALTSGEBUEHR, wert, 175);

// ── Gebührensätze ───────────────────────────────────────────────────────────
export const SAETZE = {
  /** KV 1210 GKG – Zivilprozess 1. Instanz */
  gerichtZivil: 3.0,
  /** KV 1110 FamGKG – Ehesache 1. Instanz */
  gerichtEhesache: 2.0,
  /** Nr. 3100 VV RVG – Verfahrensgebühr */
  verfahren: 1.3,
  /** Nr. 3104 VV RVG – Terminsgebühr */
  termin: 1.2,
} as const;

/**
 * Nr. 7002 VV RVG: 20 % der Gebühren, höchstens 20 €.
 * Achtung: Der Höchstbetrag wurde vom KostBRÄG 2025 NICHT angehoben – er
 * liegt weiterhin bei 20 €. Häufiger Fehler in fremden Rechnern.
 */
const AUSLAGENPAUSCHALE_MAX = 20;
/** Nr. 7008 VV RVG */
const UST = 0.19;

const round2 = (n: number) => Math.round(n * 100) / 100;

export type Anwaltskosten = {
  /** 1,0-Gebühr aus Anlage 2 RVG (Basis aller Sätze) */
  basis: number;
  verfahrensgebuehr: number;
  terminsgebuehr: number;
  auslagen: number;
  netto: number;
  ust: number;
  brutto: number;
};

/** Anwaltskosten EINER Partei für ein gerichtliches Verfahren 1. Instanz. */
export function anwaltskosten(wert: number): Anwaltskosten {
  const basis = anwaltsgebuehr1(wert);
  const verfahrensgebuehr = basis * SAETZE.verfahren;
  const terminsgebuehr = basis * SAETZE.termin;
  const gebuehren = verfahrensgebuehr + terminsgebuehr;
  const auslagen = Math.min(AUSLAGENPAUSCHALE_MAX, 0.2 * gebuehren);
  const netto = gebuehren + auslagen;
  const ust = netto * UST;
  return {
    basis,
    verfahrensgebuehr: round2(verfahrensgebuehr),
    terminsgebuehr: round2(terminsgebuehr),
    auslagen: round2(auslagen),
    netto: round2(netto),
    ust: round2(ust),
    brutto: round2(netto + ust),
  };
}

// ── Verfahrenswert Familiensachen ───────────────────────────────────────────

/** § 43 FamGKG: 3 × gemeinsames Monatsnetto, Mindestwert 3.000 €. */
export function verfahrenswertEhesache(monatsnettoBeide: number): number {
  return Math.max(3000, 3 * monatsnettoBeide);
}

/**
 * § 50 Abs. 1 FamGKG: 10 % des dreifachen Monatsnettoeinkommens JE Anrecht,
 * Mindestwert 1.000 €. Wer keinen Versorgungsausgleich durchführt
 * (anrechte = 0), bekommt hier auch keinen Zuschlag.
 */
export function verfahrenswertVersorgungsausgleich(
  monatsnettoBeide: number,
  anrechte: number,
): number {
  if (anrechte <= 0) return 0;
  return Math.max(1000, anrechte * 0.1 * 3 * monatsnettoBeide);
}

// ── Ergebnis eines Szenarios ────────────────────────────────────────────────

export type GerichtsSzenario = {
  wert: number;
  gerichtssatz: number;
  gerichtskosten: number;
  anwalt: Anwaltskosten;
  anzahlAnwaelte: number;
  gesamt: number;
};

export function gerichtsSzenario(
  wert: number,
  gerichtssatz: number,
  anzahlAnwaelte: number,
): GerichtsSzenario {
  const gerichtskosten = round2(gerichtssatz * gerichtsgebuehr1(wert));
  const anwalt = anwaltskosten(wert);
  return {
    wert,
    gerichtssatz,
    gerichtskosten,
    anwalt,
    anzahlAnwaelte,
    gesamt: round2(gerichtskosten + anzahlAnwaelte * anwalt.brutto),
  };
}

// ── Zeithonorar (Vergütungsvereinbarung nach § 3a RVG) ──────────────────────
//
// Die gesetzlichen Gebühren sind bei gerichtlicher Vertretung nur die
// UNTERGRENZE (§ 49b Abs. 1 BRAO). Nach oben ist die Vergütung frei
// vereinbar, und im Familienrecht ist das Zeithonorar der Regelfall, nicht
// die Ausnahme. Übliche Sätze bei Fachanwälten: 250–400 €/h netto,
// spezialisierte Kanzleien nennen 380 €/h aufwärts.
//
// Der entscheidende Punkt für den Rechner ist nicht die Höhe, sondern die
// Erstattung:
//   • Zivilprozess: Wer gewinnt, bekommt nur die GESETZLICHEN Gebühren
//     erstattet (§ 91 Abs. 2 S. 1 ZPO). Alles darüber bleibt beim Mandanten.
//   • Scheidung: Es wird ohnehin nichts erstattet – die Kosten werden
//     gegeneinander aufgehoben (§ 150 Abs. 1 FamFG), jede Seite trägt ihre
//     Anwaltskosten selbst.
// Das Zeithonorar-Delta ist damit in beiden Fällen verlorenes Geld.

export const STUNDENSATZ_DEFAULT = 350;
export const STUNDENSATZ_MIN = 150;
export const STUNDENSATZ_MAX = 500;

export type Zeithonorar = {
  stundensatz: number;
  stunden: number;
  netto: number;
  brutto: number;
  /** Ab wie vielen Stunden das Zeithonorar die gesetzliche Gebühr übersteigt. */
  breakEvenStunden: number;
  /** Differenz zur gesetzlichen Vergütung (brutto). Negativ = noch günstiger. */
  mehrkosten: number;
};

export function zeithonorar(
  wert: number,
  stundensatz: number,
  stunden: number,
): Zeithonorar {
  const gesetzlich = anwaltskosten(wert);
  const netto = stundensatz * stunden;
  const brutto = round2(netto * (1 + UST));
  return {
    stundensatz,
    stunden,
    netto: round2(netto),
    brutto,
    // Gegen die Gebühren OHNE Auslagenpauschale rechnen: die Pauschale fällt
    // beim Zeithonorar zusätzlich an, sie ist kein Teil des Vergleichs.
    breakEvenStunden:
      Math.round(((gesetzlich.netto - gesetzlich.auslagen) / stundensatz) * 10) / 10,
    mehrkosten: round2(brutto - gesetzlich.brutto),
  };
}

// ── medipact-Preise ─────────────────────────────────────────────────────────
//
// Die Zahlen unten sind der FALLBACK. Maßgeblich ist backend/app/pricing.py;
// die Seite holt sich die Preise serverseitig über GET /pricing/matrix
// (siehe lib/pricing-matrix.ts) und legt sie per `mitPreisen()` über diese
// Liste. Der Fallback greift nur, wenn das Backend nicht erreichbar ist —
// dann zeigt der Rechner lieber leicht veraltete Preise als gar keine.
//
// Beim Ändern von Preisen also NUR pricing.py anfassen. Diese Werte hier
// gelegentlich nachziehen, damit der Fallback nicht zu weit abdriftet.

export type Konfliktart =
  | "nachbarschaft"
  | "verbraucher"
  | "erbschaft"
  | "b2b"
  | "trennung";

export type KonfliktartInfo = {
  key: Konfliktart;
  label: string;
  /** Preis pro zahlender Partei bzw. einmalig – siehe `proPartei`. */
  preis: number;
  /** true = jede Partei zahlt (per_party), false = einmalig (once). */
  proPartei: boolean;
  /** Gebührensatz des Gerichts für diese Verfahrensart. */
  gerichtssatz: number;
  /** Landingpage für den CTA. */
  href: string;
  /** Realistische Streitwert-Vorbelegung für den Rechner. */
  streitwertDefault: number;
  streitwertHinweis: string;
};

export const KONFLIKTARTEN: readonly KonfliktartInfo[] = [
  {
    key: "nachbarschaft",
    label: "Nachbarschaftsstreit",
    preis: 49,
    proPartei: true,
    gerichtssatz: SAETZE.gerichtZivil,
    href: "/konflikte/nachbarschaft",
    streitwertDefault: 5000,
    streitwertHinweis:
      "Bei Lärm, Grenzbebauung oder Bäumen setzen Gerichte den Streitwert meist zwischen 2.000 € und 10.000 € an.",
  },
  {
    key: "verbraucher",
    label: "Verbraucher- & Handwerkerstreit",
    preis: 49,
    proPartei: true,
    gerichtssatz: SAETZE.gerichtZivil,
    href: "/konflikte/verbraucher",
    streitwertDefault: 4000,
    streitwertHinweis:
      "Der Streitwert entspricht in der Regel dem strittigen Rechnungs- oder Mangelbetrag.",
  },
  {
    key: "erbschaft",
    label: "Erbstreit",
    preis: 399,
    proPartei: false,
    gerichtssatz: SAETZE.gerichtZivil,
    href: "/konflikte/erbschaft",
    streitwertDefault: 60000,
    streitwertHinweis:
      "Maßgeblich ist der Wert des strittigen Nachlassanteils, nicht der gesamte Nachlass.",
  },
  {
    key: "b2b",
    label: "Geschäftlicher Streit (B2B, ODR)",
    preis: 399,
    proPartei: false,
    gerichtssatz: SAETZE.gerichtZivil,
    href: "/konflikte/odr",
    streitwertDefault: 25000,
    streitwertHinweis:
      "Streitwert = die geltend gemachte Forderung bzw. der Wert der strittigen Leistung.",
  },
  {
    key: "trennung",
    label: "Trennung & Scheidung",
    preis: 399,
    proPartei: true,
    gerichtssatz: SAETZE.gerichtEhesache,
    href: "/konflikte/trennung",
    streitwertDefault: 16200,
    streitwertHinweis:
      "Wird aus dem gemeinsamen Nettoeinkommen berechnet – siehe Felder oben.",
  },
];

export const konfliktart = (key: Konfliktart): KonfliktartInfo =>
  KONFLIKTARTEN.find((k) => k.key === key) ?? KONFLIKTARTEN[0];

/**
 * Live-Preise aus GET /pricing/matrix, über die statische Liste gelegt.
 * Nur Preis und Abrechnungsmodell kommen vom Backend — Labels, Links und
 * Streitwert-Vorbelegungen sind Frontend-Inhalt und bleiben hier.
 */
export type PreisOverlay = Partial<
  Record<Konfliktart, { preis: number; proPartei: boolean }>
>;

/** KONFLIKTARTEN mit den Live-Preisen. Ohne Overlay unverändert. */
export function mitPreisen(overlay?: PreisOverlay): KonfliktartInfo[] {
  if (!overlay) return [...KONFLIKTARTEN];
  return KONFLIKTARTEN.map((k) => {
    const live = overlay[k.key];
    return live ? { ...k, preis: live.preis, proPartei: live.proPartei } : k;
  });
}

/** Wie `konfliktart()`, aber auf einer (ggf. überschriebenen) Liste. */
export function konfliktartAus(
  liste: readonly KonfliktartInfo[],
  key: Konfliktart,
): KonfliktartInfo {
  return liste.find((k) => k.key === key) ?? liste[0];
}

/** medipact-Gesamtpreis für den Fall (alle Parteien zusammen). */
export function medipactPreis(art: KonfliktartInfo, parteien = 2): number {
  return art.proPartei ? art.preis * parteien : art.preis;
}

// ── Formatierung ────────────────────────────────────────────────────────────
const EUR = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
});
export const euro = (n: number) => EUR.format(n);

const EUR0 = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});
export const euroGlatt = (n: number) => EUR0.format(n);
