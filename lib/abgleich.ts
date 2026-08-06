// ── Abgleich, Prioritäten und Tausch ────────────────────────────────────────
//
// Reine Rechenlogik hinter dem Block "abgleich" – bewusst ohne React, ohne
// Netzwerk, ohne Zufall: dieselben Eingaben ergeben immer dasselbe Ergebnis.
// Nur so kann jede Partei denselben Vorschlag sehen und ihm zustimmen, ohne
// dass jemand nachverhandelt, was der Server "gemeint" hat.
//
// Warum es das gibt: die Gegenüberstellung am Ende eines Schritts stellte
// bisher nur FEST, dass die Seiten unterschiedlich geantwortet haben ("≠ noch
// unterschiedlich") – und ging dann weiter. Genau an dieser Stelle entsteht
// aber die Einigung. Hier werden aus den Unterschieden benannte Punkte, jede
// Seite gewichtet sie, und daraus entsteht deterministisch ein Vorschlag:
// unstrittiges wird übernommen, Gegensätze mit klarer Gewichtung werden
// entschieden, gleich starke Gegensätze werden GETAUSCHT (jede Seite bekommt
// den ihr wichtigeren Punkt), und nur der harte Rest geht an den Mediator.
//
// Fachlich ist der Tausch "logrolling"/Paketverhandlung: Einigung entsteht
// nicht dadurch, dass sich jemand in der Mitte trifft, sondern dadurch, dass
// jede Seite dort nachgibt, wo es ihr wenig kostet.

// ── Gewichtung ──────────────────────────────────────────────────────────────

/** Wie stark eine Partei einen Punkt will (+) oder ablehnt (−). */
export type Prio = -2 | -1 | 0 | 1 | 2;

export interface PrioOption {
  value: Prio;
  /** Kurzform für Badges/Zusammenfassungen. */
  short: string;
  /** Volltext in der Auswahl – bewusst in Ich-Form. */
  label: string;
  /** Zählt gegen das Kontingent (siehe `hardLimit`). */
  hard: boolean;
  /** Tailwind-Klassen für den gewählten Zustand. */
  tone: string;
}

export const PRIO_OPTIONS: PrioOption[] = [
  {
    value: 2,
    short: "unverzichtbar",
    label: "Unverzichtbar – ohne das trage ich das Ergebnis nicht mit",
    hard: true,
    tone: "border-emerald-400 bg-emerald-50 text-emerald-800",
  },
  {
    value: 1,
    short: "wichtig",
    label: "Wichtig – das hätte ich gern",
    hard: false,
    tone: "border-emerald-200 bg-emerald-50/60 text-emerald-700",
  },
  {
    value: 0,
    short: "egal",
    label: "Mir egal – ich lege mich nicht fest",
    hard: false,
    tone: "border-neutral-300 bg-neutral-50 text-neutral-600",
  },
  {
    value: -1,
    short: "lieber nicht",
    label: "Stört mich – lieber nicht",
    hard: false,
    tone: "border-amber-200 bg-amber-50/60 text-amber-700",
  },
  {
    value: -2,
    short: "ausgeschlossen",
    label: "Ausgeschlossen – damit kann ich nicht leben",
    hard: true,
    tone: "border-red-300 bg-red-50 text-red-700",
  },
];

export const PRIO_BY_VALUE: Record<string, PrioOption> = Object.fromEntries(
  PRIO_OPTIONS.map((o) => [String(o.value), o]),
);

/**
 * Die Stufen mit den im Workflow Manager hinterlegten Beschriftungen.
 *
 * Die Wortwahl entscheidet mit, wie ehrlich gewichtet wird: „ausgeschlossen"
 * passt zu Verfahrensregeln, klingt in einer Erbsache aber schroffer als
 * nötig. Deshalb sind die Beschriftungen pro Schritt überschreibbar – die
 * Bedeutung der Stufen (und damit die Rechnung) bleibt unverändert.
 */
export function prioOptions(labels?: unknown): PrioOption[] {
  if (!labels || typeof labels !== "object") return PRIO_OPTIONS;
  const map = labels as Record<string, unknown>;
  return PRIO_OPTIONS.map((o) => {
    const raw = map[String(o.value)];
    const text = typeof raw === "string" ? raw.trim() : "";
    return text ? { ...o, short: text, label: text } : o;
  });
}

export function isPrio(v: unknown): v is Prio {
  return v === -2 || v === -1 || v === 0 || v === 1 || v === 2;
}

// ── Punkte aus den Antworten des Quell-Schritts ─────────────────────────────

/** Ein strittiger Punkt: ein konkreter Vorschlag, den nicht alle genannt haben. */
export interface OpenPoint {
  /** Stabil über Sitzungen hinweg: `${blockId}#${Hash des Textes}`. */
  id: string;
  blockId: string;
  blockLabel: string;
  /** Der Vorschlag im Wortlaut dessen, der ihn genannt hat. */
  text: string;
  /** Teilnehmer-ids, die diesen Punkt genannt haben. */
  proposers: string[];
}

/** Ergebnis des Vergleichs EINES Blocks über alle Parteien. */
export interface BlockDiff {
  blockId: string;
  blockLabel: string;
  /** Können mehrere Vorschläge nebeneinander gelten (Liste) oder nur einer? */
  exclusive: boolean;
  /** Von allen antwortenden Parteien genannt – darüber wird nicht verhandelt. */
  shared: string[];
  /** Strittig – hierüber wird gewichtet und getauscht. */
  open: OpenPoint[];
  /** Teilnehmer-ids, die zu diesem Block überhaupt etwas gesagt haben. */
  answered: string[];
}

/** Blocktypen, bei denen sich die Parteien auf GENAU EINEN Wert einigen müssen.
 *  Alles andere (Listen, Freitext, Fragen) darf nebeneinander stehen bleiben:
 *  zwei verschiedene Bedürfnisse sind kein Widerspruch, sondern zwei Bedürfnisse. */
const EXCLUSIVE_TYPES = new Set(["datum", "betrag", "skala", "zustimmung", "unterschrift"]);

function isExclusive(type: string, config: Record<string, unknown> | undefined): boolean {
  if (type === "auswahl") return config?.multi !== true;
  return EXCLUSIVE_TYPES.has(type);
}

/** Vergleichsform eines Vorschlags: Groß-/Kleinschreibung, doppelte Leerzeichen
 *  und Satzzeichen am Ende sollen keinen Streitpunkt erzeugen. */
export function normalizePoint(s: string): string {
  return s
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[.;,!]+$/g, "")
    .trim();
}

/** Kurzer, stabiler Hash (djb2) – erzeugt die Punkt-id aus dem Text. */
function hashText(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

export function pointId(blockId: string, text: string): string {
  return `${blockId}#${hashText(normalizePoint(text))}`;
}

/** Einen gespeicherten Blockwert in eine Liste von Vorschlägen zerlegen. */
function toItems(value: unknown): string[] {
  if (value === null || value === undefined) return [];
  if (typeof value === "string") return value.trim() ? [value.trim()] : [];
  if (typeof value === "number") return [String(value)];
  if (typeof value === "boolean") return [value ? "Ja" : "Nein"];
  if (Array.isArray(value)) {
    return value.map((v) => String(v ?? "").trim()).filter((v) => v !== "");
  }
  if (typeof value === "object") {
    const o = value as Record<string, unknown>;
    if ("agreed" in o) return [o.agreed === true ? "zugestimmt" : "nicht zugestimmt"];
    if ("name" in o) return [String(o.name ?? "").trim()].filter(Boolean);
    return [];
  }
  return [];
}

export interface DiffInput {
  blockId: string;
  blockType: string;
  blockLabel: string;
  config?: Record<string, unknown>;
  /** Teilnehmer-id → gespeicherter Wert. */
  answers: Record<string, unknown>;
}

/**
 * Vergleicht die Antworten eines Blocks punktgenau.
 *
 * Der springende Punkt gegenüber dem alten Verhalten: verglichen werden nicht
 * mehr GANZE Werte, sondern die einzelnen Einträge. Eine Regelliste, bei der
 * sechs von sieben Regeln wortgleich sind, ist damit nicht mehr pauschal
 * "unterschiedlich" – strittig ist genau die eine Regel.
 */
export function diffBlock(input: DiffInput, participantIds: string[]): BlockDiff {
  const exclusive = isExclusive(input.blockType, input.config);
  const perParty = new Map<string, { norm: string; text: string }[]>();
  for (const pid of participantIds) {
    const items = toItems(input.answers[pid]).map((t) => ({ norm: normalizePoint(t), text: t }));
    if (items.length > 0) perParty.set(pid, items);
  }
  const answered = [...perParty.keys()];

  // Wer die Frage übersprungen hat, macht einen Punkt nicht strittig – sonst
  // stünde jeder Vorschlag als "Streit" da, sobald jemand nichts eingetragen
  // hat. Strittig ist nur, was mindestens zwei Antwortende verschieden sehen.
  const shared: string[] = [];
  const open: OpenPoint[] = [];
  if (answered.length === 0) {
    return { blockId: input.blockId, blockLabel: input.blockLabel, exclusive, shared, open, answered };
  }

  // Reihenfolge stabil: erst nach der Reihenfolge der Teilnehmer, dann nach
  // der Reihenfolge innerhalb ihrer Antwort.
  const seen = new Map<string, { text: string; proposers: string[] }>();
  for (const pid of answered) {
    for (const it of perParty.get(pid) ?? []) {
      const hit = seen.get(it.norm);
      if (hit) {
        if (!hit.proposers.includes(pid)) hit.proposers.push(pid);
      } else {
        seen.set(it.norm, { text: it.text, proposers: [pid] });
      }
    }
  }

  for (const [, entry] of seen) {
    const byAll = answered.every((pid) => entry.proposers.includes(pid));
    // Bei "nur ein Wert erlaubt" ist auch ein von allen genannter Wert nur dann
    // unstrittig, wenn es der EINZIGE Wert ist – zwei verschiedene Termine sind
    // ein Widerspruch, zwei verschiedene Regeln nicht.
    // Unstrittig ist ein Punkt nur, wenn ihn ALLE Antwortenden genannt haben –
    // und wenn mindestens zwei geantwortet haben. Hat nur eine Seite etwas
    // eingetragen, ist das ein Vorschlag, noch keine Einigkeit.
    if (byAll && answered.length > 1 && (!exclusive || seen.size === 1)) {
      shared.push(entry.text);
    } else {
      open.push({
        id: pointId(input.blockId, entry.text),
        blockId: input.blockId,
        blockLabel: input.blockLabel,
        text: entry.text,
        proposers: [...entry.proposers],
      });
    }
  }

  return { blockId: input.blockId, blockLabel: input.blockLabel, exclusive, shared, open, answered };
}

// ── Auflösung & Tausch ──────────────────────────────────────────────────────

export type Outcome = "rein" | "raus" | "tausch" | "konflikt";

export interface ResolvedPoint {
  point: OpenPoint;
  /** Teilnehmer-id → Gewichtung (fehlende Angabe zählt als "egal"). */
  ratings: Record<string, Prio>;
  score: number;
  outcome: Outcome;
  /** Ein Satz, der die Entscheidung erklärt – steht so in der Oberfläche. */
  reason: string;
  /** Wer bei diesem Punkt nachgegeben hat (für die Ausgleichs-Rechnung). */
  conceded: string[];
  /** Bei "rein" durch Tausch: die id des Punkts, der dafür hergegeben wurde. */
  tradedFor?: string;
}

export interface BlockResult {
  blockId: string;
  blockLabel: string;
  exclusive: boolean;
  /** Von Anfang an unstrittig. */
  shared: string[];
  points: ResolvedPoint[];
  /** Das, worauf sich die Seiten laut Vorschlag einigen (unstrittig + "rein"). */
  agreed: string[];
}

export interface Resolution {
  blocks: BlockResult[];
  /** Punkte, die der Vorschlag nicht auflösen kann – Sache des Mediators. */
  conflicts: ResolvedPoint[];
  /** Teilnehmer-id → wie oft diese Seite nachgegeben hat. */
  concessions: Record<string, number>;
  /** Teilnehmer-id → wie oft diese Seite sich durchgesetzt hat. */
  gains: Record<string, number>;
  /** gains − concessions. Steuert, wer einen unpaarigen Rest bekommt. */
  balance: Record<string, number>;
  /** Paare, die gegeneinander getauscht wurden (für die Erklärung im UI). */
  trades: { a: ResolvedPoint; b: ResolvedPoint }[];
  /** Ist überhaupt noch etwas strittig? */
  open: boolean;
}

export type RatingMap = Record<string, Record<string, Prio>>;

/** Im Workflow Manager einstellbare Regeln des Abgleichs.
 *
 *  Beides ist bewusst abschaltbar: nicht jede Konfliktart verträgt einen
 *  Tausch. Bei Regeln und Themen ist er der Kern; bei Punkten, die einzeln
 *  begründet gehören (z.B. Sorgerechtsfragen), will die mediierende Person
 *  vielleicht nur die Gewichtung sehen und den Rest im Gespräch klären. */
export interface ResolveOptions {
  /** Gleich starke Gegensätze paarweise tauschen (Standard: an). */
  allowTrade?: boolean;
  /** Unpaarige Reste der Seite zusprechen, die schlechter weggekommen ist
   *  (Standard: an). Aus = solche Punkte gehen direkt an den Mediator. */
  allowBalance?: boolean;
}

function ratingOf(ratings: RatingMap, pid: string, pointKey: string): Prio {
  const v = ratings[pid]?.[pointKey];
  return isPrio(v) ? v : 0;
}

/** Grundentscheidung für einen einzelnen Punkt – ohne Tausch. */
function resolveOne(point: OpenPoint, participantIds: string[], ratings: RatingMap): ResolvedPoint {
  const per: Record<string, Prio> = {};
  for (const pid of participantIds) per[pid] = ratingOf(ratings, pid, point.id);
  const values = participantIds.map((pid) => per[pid]);
  const score = values.reduce<number>((a, b) => a + b, 0);
  const hardYes = participantIds.filter((pid) => per[pid] === 2);
  const hardNo = participantIds.filter((pid) => per[pid] === -2);

  const conceded = (dir: 1 | -1) =>
    participantIds.filter((pid) => (dir === 1 ? per[pid] < 0 : per[pid] > 0));

  if (hardYes.length > 0 && hardNo.length > 0) {
    return {
      point,
      ratings: per,
      score,
      outcome: "konflikt",
      reason: "Eine Seite hält den Punkt für unverzichtbar, die andere für ausgeschlossen.",
      conceded: [],
    };
  }
  if (hardYes.length > 0) {
    return {
      point,
      ratings: per,
      score,
      outcome: "rein",
      reason: "Für eine Seite unverzichtbar, für die andere kein Ausschlussgrund.",
      conceded: conceded(1),
    };
  }
  if (hardNo.length > 0) {
    return {
      point,
      ratings: per,
      score,
      outcome: "raus",
      reason: "Für eine Seite ausgeschlossen, für die andere nicht unverzichtbar.",
      conceded: conceded(-1),
    };
  }
  if (score > 0) {
    return {
      point,
      ratings: per,
      score,
      outcome: "rein",
      reason: "In der Summe deutlich mehr Zustimmung als Widerspruch.",
      conceded: conceded(1),
    };
  }
  if (score < 0) {
    return {
      point,
      ratings: per,
      score,
      outcome: "raus",
      reason: "In der Summe deutlich mehr Widerspruch als Zustimmung.",
      conceded: conceded(-1),
    };
  }
  if (values.every((v) => v === 0)) {
    return {
      point,
      ratings: per,
      score,
      outcome: "raus",
      reason: "Niemandem wichtig – fällt weg.",
      conceded: [],
    };
  }
  return {
    point,
    ratings: per,
    score,
    outcome: "tausch",
    reason: "Gleich starke, gegenläufige Wünsche – Tauschmasse.",
    conceded: [],
  };
}

/**
 * Rechnet aus Punkten + Gewichtungen den Einigungsvorschlag.
 *
 * Reihenfolge der Schritte (bewusst so und nicht anders):
 *   1. Jeder Punkt für sich – klare Gewichtungen entscheiden sofort.
 *   2. Gleich starke Gegensätze werden PAARWEISE getauscht: A bekommt den ihm
 *      wichtigen Punkt, B den ihm wichtigen. Beide gewinnen etwas, beide geben
 *      etwas – das ist der eigentliche Mechanismus.
 *   3. Was übrig bleibt, bekommt die Seite, die bis dahin öfter nachgegeben
 *      hat. Erst wenn auch das nicht mehr aufgeht, geht ein Punkt an den
 *      Mediator. Ohne Schritt 3 landete jeder ungerade Rest im Konflikt,
 *      obwohl eine Seite längst mehr eingebracht hat.
 */
export function resolve(
  diffs: BlockDiff[],
  participantIds: string[],
  ratings: RatingMap,
  options: ResolveOptions = {},
): Resolution {
  const allowTrade = options.allowTrade !== false;
  const allowBalance = options.allowBalance !== false;
  const resolved = new Map<string, ResolvedPoint>();
  for (const d of diffs) {
    for (const p of d.open) resolved.set(p.id, resolveOne(p, participantIds, ratings));
  }

  // ── Kontostand je Seite ──────────────────────────────────────────────────
  //
  // Nur zu zählen, wer nachgegeben hat, greift zu kurz: eine Seite, die einen
  // ihr unverzichtbaren Punkt durchgesetzt hat, steht besser da als eine, die
  // gar nichts bekommen hat – auch wenn beide formal "nichts hergegeben"
  // haben. Deshalb zählt hier beides, und die Differenz entscheidet, wer einen
  // unpaarigen Rest zugesprochen bekommt.
  const concessions: Record<string, number> = {};
  const gains: Record<string, number> = {};
  const balance: Record<string, number> = {};
  const tally = () => {
    for (const pid of participantIds) {
      concessions[pid] = 0;
      gains[pid] = 0;
    }
    for (const r of resolved.values()) {
      if (r.outcome !== "rein" && r.outcome !== "raus") continue;
      const wantedIn = r.outcome === "rein";
      for (const pid of participantIds) {
        const v = r.ratings[pid] ?? 0;
        if (v === 0) continue;
        if (v > 0 === wantedIn) gains[pid] += 1;
        else concessions[pid] += 1;
      }
    }
    for (const pid of participantIds) balance[pid] = gains[pid] - concessions[pid];
  };
  tally();

  // ── Tausch ────────────────────────────────────────────────────────────────
  const tauschPoints = [...resolved.values()].filter((r) => r.outcome === "tausch");
  // Bei gegenläufigen, gleich starken Wünschen gibt es je Punkt genau eine
  // Seite mit positiver Gewichtung – sonst wäre die Summe nicht null.
  const wantedBy = new Map<string, ResolvedPoint[]>();
  for (const r of tauschPoints) {
    const winner = participantIds.find((pid) => r.ratings[pid] > 0);
    if (!winner) continue;
    const list = wantedBy.get(winner) ?? [];
    list.push(r);
    wantedBy.set(winner, list);
  }
  // Innerhalb einer Seite zuerst das, was ihr am wichtigsten ist.
  for (const list of wantedBy.values()) {
    list.sort((x, y) => {
      const px = participantIds.reduce((m, pid) => Math.max(m, x.ratings[pid]), 0);
      const py = participantIds.reduce((m, pid) => Math.max(m, y.ratings[pid]), 0);
      return py - px || x.point.text.localeCompare(y.point.text);
    });
  }

  const trades: { a: ResolvedPoint; b: ResolvedPoint }[] = [];
  const owners = allowTrade ? [...wantedBy.keys()] : [];
  for (let i = 0; i < owners.length; i++) {
    for (let j = i + 1; j < owners.length; j++) {
      const listA = wantedBy.get(owners[i]) ?? [];
      const listB = wantedBy.get(owners[j]) ?? [];
      while (listA.length > 0 && listB.length > 0) {
        const a = listA.shift() as ResolvedPoint;
        const b = listB.shift() as ResolvedPoint;
        a.outcome = "rein";
        b.outcome = "rein";
        a.tradedFor = b.point.id;
        b.tradedFor = a.point.id;
        a.reason = "Tausch: dafür kommt der Punkt der anderen Seite mit hinein.";
        b.reason = "Tausch: dafür kommt der Punkt der anderen Seite mit hinein.";
        a.conceded = participantIds.filter((pid) => a.ratings[pid] < 0);
        b.conceded = participantIds.filter((pid) => b.ratings[pid] < 0);
        trades.push({ a, b });
      }
    }
  }
  tally();

  // ── Rest: Ausgleich nach Kontostand ──────────────────────────────────────
  // Nacheinander und nach jedem Zuschlag neu gerechnet – sonst bekäme dieselbe
  // Seite alle Reste, weil ihr Rückstand nur einmal gemessen würde.
  const leftovers = [...wantedBy.entries()].flatMap(([pid, list]) => list.map((r) => ({ pid, r })));
  leftovers.sort(
    (x, y) => (balance[x.pid] ?? 0) - (balance[y.pid] ?? 0) || x.r.point.text.localeCompare(y.r.point.text),
  );
  for (const { pid, r } of leftovers) {
    const others = participantIds.filter((o) => o !== pid);
    const behindAll =
      allowBalance && others.every((o) => (balance[pid] ?? 0) < (balance[o] ?? 0));
    if (behindAll) {
      r.outcome = "rein";
      r.reason = "Ausgleich: diese Seite ist bisher schlechter weggekommen.";
      r.conceded = participantIds.filter((o) => r.ratings[o] < 0);
      tally();
    } else {
      r.outcome = "konflikt";
      r.reason = "Gleich stark, gegenläufig und kein Gegenpunkt zum Tauschen – hier braucht es ein Gespräch.";
    }
  }

  // ── Exklusive Blöcke: am Ende darf nur EIN Wert stehen ───────────────────
  const blocks: BlockResult[] = diffs.map((d) => {
    const points = d.open.map((p) => resolved.get(p.id) as ResolvedPoint).filter(Boolean);
    if (d.exclusive) {
      // Bei "nur ein Wert möglich" (Termin, Betrag, Skala) müssen am Ende alle
      // anderen Vorschläge weichen – auch die, die für sich genommen als
      // Konflikt stehengeblieben wären. Sonst zeigte die Oberfläche einen
      // gesetzten Termin UND einen ungeklärten Gegentermin nebeneinander.
      const rein = points.filter((r) => r.outcome === "rein");
      const tied = rein.length > 1 && rein.filter((r) => r.score === Math.max(...rein.map((x) => x.score))).length > 1;
      if (tied) {
        for (const r of rein) {
          r.outcome = "konflikt";
          r.reason = "Hier ist nur ein Wert möglich, und die Vorschläge wiegen gleich schwer.";
        }
      } else if (rein.length >= 1) {
        const best = rein.reduce((a, b) => (b.score > a.score ? b : a));
        for (const r of points) {
          if (r === best) continue;
          r.outcome = "raus";
          r.reason = "Hier ist nur ein Wert möglich – ein anderer Vorschlag wiegt schwerer.";
        }
      }
    }
    const agreed = [
      ...d.shared,
      ...points.filter((r) => r.outcome === "rein").map((r) => r.point.text),
    ];
    return {
      blockId: d.blockId,
      blockLabel: d.blockLabel,
      exclusive: d.exclusive,
      shared: d.shared,
      points,
      agreed,
    };
  });

  tally();
  const conflicts = [...resolved.values()].filter((r) => r.outcome === "konflikt");
  return { blocks, conflicts, concessions, gains, balance, trades, open: conflicts.length > 0 };
}

/** Wie viele "harte" Gewichtungen (±2) hat diese Partei vergeben? */
export function hardCount(ratings: Record<string, Prio> | undefined): number {
  if (!ratings) return 0;
  return Object.values(ratings).filter((v) => v === 2 || v === -2).length;
}
