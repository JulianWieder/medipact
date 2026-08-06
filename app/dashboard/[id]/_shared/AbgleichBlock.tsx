"use client";

// ── Abgleich-Block: aus Unterschieden wird eine Einigung ────────────────────
//
// Der Block sitzt HINTER einem Schritt, in dem beide Seiten geantwortet haben
// (z.B. „Welche Regeln sollen für eure Gespräche gelten?"). Er tut drei Dinge:
//
//   1. Er vergleicht die Antworten des Quell-Schritts punktgenau und zeigt,
//      worüber längst Einigkeit besteht — das ist meistens das meiste.
//   2. Für jeden strittigen Punkt gewichtet JEDE Seite für sich, wie wichtig er
//      ihr ist (von „unverzichtbar" bis „ausgeschlossen").
//   3. Sobald beide gewichtet haben, entsteht daraus ein Vorschlag: klare
//      Gewichtungen entscheiden, gleich starke Gegensätze werden getauscht,
//      und nur der harte Rest bleibt offen. Beide bestätigen den Vorschlag.
//
// Warum die Gewichtung erst gemeinsam sichtbar wird: das Backend gibt fremde
// Block-Antworten erst frei, wenn alle nötigen Rollen den Schritt abgegeben
// haben. Wer zuerst dran ist, kann sich also nicht an der anderen Seite
// orientieren — sonst wäre die Gewichtung wertlos.
//
// Die Rechenlogik steht bewusst NICHT hier, sondern in lib/abgleich.ts: sie
// muss ohne React testbar sein und für beide Seiten dasselbe Ergebnis liefern.

import { useCallback, useEffect, useMemo, useState } from "react";
import type { StepBlockDto } from "@/app/workspace/types";
import { fetchBlockResponses, saveBlockResponse } from "@/app/workspace/api";
import {
  diffBlock,
  hardCount,
  isPrio,
  prioOptions,
  resolve,
  type BlockDiff,
  type Prio,
  type RatingMap,
} from "@/lib/abgleich";
import { isUserInputBlock } from "@/app/workspace/blockTypes";
import AbgleichErgebnis from "./AbgleichErgebnis";

type Party = { id: string; name: string; role: string };

/** Gespeicherte Gewichtung einer Partei. */
type StoredRatings = { ratings?: Record<string, unknown> };

/** Gespeicherte Zustimmung zum Vorschlag. Die `signature` hängt an den
 *  strittigen Punkten UND allen Gewichtungen: ändert jemand hinterher seine
 *  Gewichtung, passt sie nicht mehr und die Zustimmung muss erneuert werden.
 *  Ohne das könnte eine Seite nachträglich am Vorschlag drehen, dem die andere
 *  längst zugestimmt hat. */
type StoredAgreement = {
  agreed?: boolean;
  at?: string;
  signature?: string;
  /** Der bestätigte Vorschlag im Klartext. Redundant zur Berechnung – aber der
   *  Vertragsgenerator läuft im Backend und kann die Auflösung nicht selbst
   *  nachrechnen. Ohne diese Kopie stünde im Mediationsvertrag wieder das rohe
   *  „A sagt X, B sagt Y" statt dessen, worauf sich beide geeinigt haben. */
  result?: { label: string; items: string[] }[];
  /** Punkte, die der Vorschlag offen lässt – gehören als solche in den Vertrag. */
  open?: string[];
};

const PARTY_ROLES_EXCLUDED = new Set(["mediator", "admin"]);

function cfgStr(c: Record<string, unknown>, key: string): string {
  const v = c?.[key];
  return typeof v === "string" ? v : "";
}
function cfgNum(c: Record<string, unknown>, key: string, fallback: number): number {
  const v = c?.[key];
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}

/** Beschriftung eines Quell-Blocks – dieselbe Reihenfolge wie im Vertrags-Text. */
function labelOf(b: StepBlockDto): string {
  const c = b.config ?? {};
  return (
    cfgStr(c, "prompt") ||
    cfgStr(c, "label") ||
    cfgStr(c, "statement") ||
    cfgStr(c, "text") ||
    b.type
  );
}

function shortHash(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

export default function AbgleichBlock({
  mediationId,
  phase,
  stepKey,
  block,
  value,
  onChange,
  preview = false,
}: {
  mediationId: string;
  phase: string;
  stepKey: string;
  block: StepBlockDto;
  /** Eigene Gewichtung. Kommt aus StepBlocks, wenn der Block im Schritt selbst
   *  steht – dort läuft auch das Speichern. */
  value?: unknown;
  /** Fehlt der Callback, versorgt sich der Block selbst: er lädt die eigene
   *  Gewichtung und speichert sie direkt. Das braucht die Gegenüberstellung
   *  nach dem Schritt – dort gibt es kein umgebendes Formular, der Vorschlag
   *  muss aber weiter änderbar und bestätigbar sein. */
  onChange?: (value: unknown) => void;
  preview?: boolean;
}) {
  const c = block.config ?? {};
  const sourcePhase = cfgStr(c, "sourcePhase") || phase;
  const sourceStepKey = cfgStr(c, "sourceStepKey");
  const hardLimit = Math.max(0, cfgNum(c, "hardLimit", 2));
  // Alles Weitere kommt aus dem Workflow Manager – der Block hat keine
  // fest eingebauten Regeln, nur Vorgaben.
  const allowTrade = c.allowTrade !== false;
  const allowBalance = c.allowBalance !== false;
  const requireConfirm = c.requireConfirm !== false;
  // Über den String statt über das Array: die config kommt bei jedem Render als
  // neues Objekt an, ein Array in den Effect-Abhängigkeiten würde endlos neu laden.
  const pickedKey = Array.isArray(c.sourceBlockIds)
    ? (c.sourceBlockIds as unknown[]).map(String).filter(Boolean).join(",")
    : "";
  const pickedBlockIds = useMemo(
    () => (pickedKey ? pickedKey.split(",") : []),
    [pickedKey],
  );
  const PRIOS = useMemo(() => prioOptions(c.labels), [c.labels]);

  const [parties, setParties] = useState<Party[]>([]);
  const [sourceBlocks, setSourceBlocks] = useState<StepBlockDto[]>([]);
  const [sourceAnswers, setSourceAnswers] = useState<Record<string, Record<string, unknown>>>({});
  const [otherRatings, setOtherRatings] = useState<RatingMap>({});
  const [agreements, setAgreements] = useState<Record<string, StoredAgreement>>({});
  const [ownId, setOwnId] = useState<string>("");
  const [loaded, setLoaded] = useState(false);
  const [missing, setMissing] = useState<"" | "config" | "step" | "answers">("");
  const [busy, setBusy] = useState(false);

  const agreementBlockId = `${block.id}:ok`;
  const selfManaged = typeof onChange !== "function";
  const [localValue, setLocalValue] = useState<unknown>(null);
  const effectiveValue = selfManaged ? localValue : value;

  const ownRatings: Record<string, Prio> = useMemo(() => {
    const raw = (effectiveValue as StoredRatings | null)?.ratings;
    const out: Record<string, Prio> = {};
    if (raw && typeof raw === "object") {
      for (const [k, v] of Object.entries(raw)) if (isPrio(v)) out[k] = v;
    }
    return out;
  }, [effectiveValue]);

  // ── Laden ────────────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    if (preview) {
      setLoaded(true);
      return;
    }
    if (!sourceStepKey) {
      setMissing("config");
      setLoaded(true);
      return;
    }
    try {
      const [partsRes, stepsRes] = await Promise.all([
        fetch(`/api/mediations/${mediationId}/participants`, { cache: "no-store" }),
        fetch(`/api/mediations/${mediationId}/phase-steps?phase=${sourcePhase}`, { cache: "no-store" }),
      ]);
      const allParts: { id: string; name: string; role: string; is_self?: boolean }[] = partsRes.ok
        ? await partsRes.json()
        : [];
      const parties = allParts.filter((p) => !PARTY_ROLES_EXCLUDED.has(p.role));
      setParties(parties.map((p) => ({ id: String(p.id), name: p.name, role: p.role })));
      const self = allParts.find((p) => p.is_self);
      if (self) setOwnId(String(self.id));

      const steps: { key: string; blocks?: StepBlockDto[] | null }[] = stepsRes.ok
        ? (await stepsRes.json()).steps ?? []
        : [];
      const src = steps.find((s) => s.key === sourceStepKey);
      if (!src) {
        setMissing("step");
        setLoaded(true);
        return;
      }
      // Standard: alle Eingabe-Blöcke des Quell-Schritts. Hat der Mediator im
      // Workflow Manager eine Auswahl getroffen, gilt nur die – nicht jede
      // Frage eines Schritts eignet sich zum Verhandeln.
      const usable = (src.blocks ?? []).filter(
        (b) => isUserInputBlock(b.type) && b.type !== "vertrauliche_notiz" && b.type !== "abgleich",
      );
      setSourceBlocks(
        pickedBlockIds.length > 0 ? usable.filter((b) => pickedBlockIds.includes(b.id)) : usable,
      );

      // Antworten des Quell-Schritts: `include_others` gibt sie erst frei, wenn
      // alle abgegeben haben – vorher steht hier nur die eigene Antwort und der
      // Block zeigt den Wartehinweis statt eines halben Vergleichs.
      const srcRows = await fetchBlockResponses(Number(mediationId), {
        phase: sourcePhase,
        stepKey: sourceStepKey,
        includeOthers: true,
      });
      const answers: Record<string, Record<string, unknown>> = {};
      for (const r of srcRows) {
        if (r.author_key === "ai" || r.author_source === "ai") continue;
        (answers[r.block_id] ??= {})[r.author_key] = r.value;
      }
      setSourceAnswers(answers);

      // Gewichtungen + Zustimmungen zu DIESEM Schritt.
      const ownRows = await fetchBlockResponses(Number(mediationId), {
        phase,
        stepKey,
        includeOthers: true,
      });
      const rmap: RatingMap = {};
      const amap: Record<string, StoredAgreement> = {};
      for (const r of ownRows) {
        if (r.author_key === "ai" || r.author_source === "ai") continue;
        if (r.block_id === block.id) {
          const raw = (r.value as StoredRatings | null)?.ratings;
          const clean: Record<string, Prio> = {};
          if (raw && typeof raw === "object") {
            for (const [k, v] of Object.entries(raw)) if (isPrio(v)) clean[k] = v;
          }
          rmap[r.author_key] = clean;
        } else if (r.block_id === agreementBlockId) {
          amap[r.author_key] = (r.value as StoredAgreement) ?? {};
        }
      }
      setOtherRatings(rmap);
      setAgreements(amap);
      // Ohne umgebendes Formular gibt es niemanden, der die eigene Gewichtung
      // in den Block hineinreicht – hier ist die frisch geladene Zeile die
      // Quelle.
      if (selfManaged && self) setLocalValue({ ratings: rmap[String(self.id)] ?? {} });
    } catch {
      /* still – der Block zeigt dann den Ladehinweis */
    } finally {
      setLoaded(true);
    }
  }, [mediationId, phase, stepKey, sourcePhase, sourceStepKey, block.id, agreementBlockId, preview, selfManaged, pickedKey]);

  useEffect(() => {
    void load();
  }, [load]);

  // ── Strittige Punkte ─────────────────────────────────────────────────────
  const diffs: BlockDiff[] = useMemo(() => {
    if (parties.length === 0 || sourceBlocks.length === 0) return [];
    const ids = parties.map((p) => p.id);
    return sourceBlocks
      .map((b) =>
        diffBlock(
          {
            blockId: b.id,
            blockType: b.type,
            blockLabel: labelOf(b),
            config: b.config,
            answers: sourceAnswers[b.id] ?? {},
          },
          ids,
        ),
      )
      .filter((d) => d.answered.length > 0);
  }, [parties, sourceBlocks, sourceAnswers]);

  const openPoints = useMemo(() => diffs.flatMap((d) => d.open), [diffs]);

  // Wer hat schon gewichtet? Erst wenn ALLE Parteien Punkte gewichtet haben,
  // ist der Vorschlag belastbar – vorher wäre er die Sicht einer einzigen Seite.
  const ratingsAll: RatingMap = useMemo(() => {
    const map: RatingMap = { ...otherRatings };
    if (ownId) map[ownId] = ownRatings;
    return map;
  }, [otherRatings, ownRatings, ownId]);

  const partiesRated = parties.filter((p) => Object.keys(ratingsAll[p.id] ?? {}).length > 0);
  const everyoneRated = parties.length > 1 && partiesRated.length === parties.length;

  const resolution = useMemo(() => {
    if (!everyoneRated) return null;
    return resolve(diffs, parties.map((p) => p.id), ratingsAll, { allowTrade, allowBalance });
  }, [everyoneRated, diffs, parties, ratingsAll, allowTrade, allowBalance]);

  /** Fingerabdruck des Vorschlags – siehe StoredAgreement.signature. */
  const signature = useMemo(() => {
    const parts = openPoints.map(
      (p) => `${p.id}:${parties.map((q) => ratingsAll[q.id]?.[p.id] ?? 0).join(",")}`,
    );
    return shortHash(parts.sort().join("|"));
  }, [openPoints, parties, ratingsAll]);

  const nameOf = (pid: string) => parties.find((p) => p.id === pid)?.name ?? "Andere Seite";

  const usedHard = hardCount(ownRatings);
  const hardLeft = Math.max(0, hardLimit - usedHard);

  function setRating(pointId: string, prio: Prio) {
    const next = { ...ownRatings };
    // Nochmaliges Klicken derselben Stufe nimmt die Gewichtung zurück – sonst
    // gäbe es keinen Weg zurück zu "noch nicht festgelegt".
    if (next[pointId] === prio) delete next[pointId];
    else next[pointId] = prio;
    const payload = { ratings: next };
    if (!selfManaged) {
      onChange?.(payload);
      return;
    }
    setLocalValue(payload);
    if (preview) return;
    void saveBlockResponse(Number(mediationId), {
      phase,
      step_key: stepKey,
      block_id: block.id,
      block_type: block.type,
      value: payload,
      submitted: true,
    }).catch(() => {});
  }

  async function confirm(agreed: boolean) {
    if (preview) return;
    setBusy(true);
    try {
      const payload: StoredAgreement = {
        agreed,
        at: new Date().toISOString(),
        signature,
        result: (resolution?.blocks ?? [])
          .filter((b) => b.agreed.length > 0)
          .map((b) => ({ label: b.blockLabel, items: b.agreed })),
        open: (resolution?.conflicts ?? []).map((cf) => cf.point.text),
      };
      await saveBlockResponse(Number(mediationId), {
        phase,
        step_key: stepKey,
        block_id: agreementBlockId,
        block_type: "abgleich_ergebnis",
        value: payload,
        submitted: true,
      });
      if (ownId) setAgreements((a) => ({ ...a, [ownId]: payload }));
    } catch {
      /* still */
    } finally {
      setBusy(false);
    }
  }

  // ── Darstellung ──────────────────────────────────────────────────────────
  if (preview) {
    return (
      <Frame>
        <p className="text-sm text-neutral-500">
          Hier stehen im Fall die strittigen Punkte aus dem Schritt{" "}
          <span className="font-semibold">{sourceStepKey || "(noch nicht gewählt)"}</span>. Jede Seite
          gewichtet sie; daraus entsteht der Einigungsvorschlag.
        </p>
      </Frame>
    );
  }
  if (!loaded) return <Frame><p className="text-sm text-neutral-400">Wird geladen …</p></Frame>;

  if (missing === "config" || missing === "step") {
    return (
      <Frame>
        <p className="text-sm text-amber-700">
          Für diesen Abgleich ist kein gültiger Quell-Schritt hinterlegt. Der Mediator wählt ihn im
          Workflow Manager aus.
        </p>
      </Frame>
    );
  }

  const answeredParties = new Set(diffs.flatMap((d) => d.answered));
  if (answeredParties.size < 2) {
    return (
      <Frame>
        <p className="text-sm text-neutral-600">
          Der Abgleich beginnt, sobald beide Seiten den vorherigen Schritt abgeschlossen haben. Bis
          dahin siehst du hier bewusst nichts – sonst würde die zweite Antwort von der ersten
          beeinflusst.
        </p>
      </Frame>
    );
  }

  const sharedCount = diffs.reduce((n, d) => n + d.shared.length, 0);

  if (openPoints.length === 0) {
    return (
      <Frame>
        <p className="text-sm font-semibold text-emerald-800">
          Ihr seid euch in allen {sharedCount} Punkten einig – hier gibt es nichts zu verhandeln.
        </p>
        {diffs.map((d) => (
          <AgreedList key={d.blockId} label={d.blockLabel} items={d.shared} />
        ))}
      </Frame>
    );
  }

  return (
    <Frame>
      <p className="text-xs font-semibold uppercase tracking-wide text-accent-600">
        Abgleich &amp; Tausch
      </p>
      {cfgStr(c, "prompt") ? (
        <p className="text-sm leading-relaxed text-neutral-700">{cfgStr(c, "prompt")}</p>
      ) : (
        <p className="text-sm leading-relaxed text-neutral-700">
          {sharedCount > 0 ? (
            <>
              In <span className="font-semibold">{sharedCount}</span>{" "}
              {sharedCount === 1 ? "Punkt seid" : "Punkten seid"} ihr euch bereits einig. Offen{" "}
              {openPoints.length === 1 ? "ist" : "sind"}{" "}
              <span className="font-semibold">{openPoints.length}</span>{" "}
              {openPoints.length === 1 ? "Punkt" : "Punkte"}.
            </>
          ) : (
            <>
              Offen {openPoints.length === 1 ? "ist" : "sind"}{" "}
              <span className="font-semibold">{openPoints.length}</span>{" "}
              {openPoints.length === 1 ? "Punkt" : "Punkte"}.
            </>
          )}{" "}
          Gib für jeden an, wie wichtig er dir ist. Was dir wenig bedeutet, wird zur Tauschmasse –
          und dafür bekommst du das, was dir wirklich wichtig ist.
        </p>
      )}

      {/* ── Einigkeit zuerst: das ist der größere Teil und beruhigt ── */}
      {sharedCount > 0 && (
        <details className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3">
          <summary className="cursor-pointer text-sm font-semibold text-emerald-800">
            ✓ {sharedCount} {sharedCount === 1 ? "Punkt" : "Punkte"}, in denen ihr euch schon einig seid
          </summary>
          <div className="mt-2 space-y-3">
            {diffs.map((d) =>
              d.shared.length ? <AgreedList key={d.blockId} label={d.blockLabel} items={d.shared} /> : null,
            )}
          </div>
        </details>
      )}

      {/* ── Gewichtung ── */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-sm font-semibold text-neutral-800">Deine Gewichtung</p>
          {hardLimit > 0 && (
            <p className="text-xs text-neutral-500">
              „Unverzichtbar" und „ausgeschlossen" darfst du{" "}
              <span className="font-semibold text-neutral-700">{hardLimit}×</span> vergeben –{" "}
              {hardLeft > 0 ? `noch ${hardLeft} übrig` : "aufgebraucht"}.
            </p>
          )}
        </div>
        {hardLimit > 0 && hardLeft === 0 && (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            Dein Kontingent ist aufgebraucht. Das ist Absicht: wäre alles unverzichtbar, gäbe es
            nichts zu tauschen und der Abgleich liefe leer.
          </p>
        )}

        {diffs.map((d) =>
          d.open.length === 0 ? null : (
            <div key={d.blockId} className="rounded-xl border border-neutral-200 bg-white p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                {d.blockLabel}
              </p>
              <div className="space-y-3">
                {d.open.map((p) => {
                  const own = ownRatings[p.id];
                  return (
                    <div key={p.id} className="rounded-lg bg-neutral-50 p-3">
                      <p className="text-sm text-neutral-800">{p.text}</p>
                      <p className="mt-0.5 text-[11px] text-neutral-500">
                        Vorgeschlagen von {p.proposers.map(nameOf).join(", ")}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {PRIOS.map((o) => {
                          const active = own === o.value;
                          const blocked = o.hard && !active && hardLeft === 0;
                          return (
                            <button
                              key={o.value}
                              type="button"
                              disabled={blocked}
                              onClick={() => setRating(p.id, o.value)}
                              title={o.label}
                              className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold transition ${
                                active
                                  ? o.tone
                                  : blocked
                                  ? "cursor-not-allowed border-neutral-200 bg-white text-neutral-300"
                                  : "border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300"
                              }`}
                            >
                              {o.short}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ),
        )}
      </div>

      {/* ── Vorschlag ── */}
      {!everyoneRated ? (
        <p className="rounded-xl border border-dashed border-neutral-300 bg-white px-3 py-3 text-sm text-neutral-500">
          Sobald auch die andere Seite gewichtet hat, steht hier der Einigungsvorschlag. Ihr seht die
          Gewichtung der jeweils anderen erst dann – damit sich niemand anpasst.
        </p>
      ) : resolution ? (
        <AbgleichErgebnis
          resolution={resolution}
          parties={parties}
          nameOf={nameOf}
          agreements={agreements}
          signature={signature}
          ownId={ownId}
          busy={busy}
          onConfirm={confirm}
          requireConfirm={requireConfirm}
        />
      ) : null}
    </Frame>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-4 rounded-2xl border border-accent-200 bg-accent-50/40 p-4">{children}</div>
  );
}

function AgreedList({ label, items }: { label: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">{label}</p>
      <ul className="mt-1 space-y-0.5">
        {items.map((t, i) => (
          <li key={i} className="text-sm text-neutral-700">
            <span className="mr-1 text-emerald-600">✓</span>
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}
