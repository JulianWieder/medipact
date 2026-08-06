"use client";

// ── Einigungsvorschlag (Ergebnis des Abgleichs) ─────────────────────────────
//
// Zeigt, was aus den Gewichtungen beider Seiten geworden ist – und vor allem
// WARUM. Ein Vorschlag, den man nicht nachvollziehen kann, wird nicht
// unterschrieben: deshalb steht an jedem Punkt der Grund, und der Tausch wird
// als Paar dargestellt („du bekommst das, sie bekommt jenes"), nicht als zwei
// unabhängige Entscheidungen.
//
// Die Zustimmung hängt an einer `signature` über alle Gewichtungen. Ändert
// jemand hinterher seine Gewichtung, verfällt die Zustimmung sichtbar, statt
// still für einen anderen Vorschlag zu gelten.

import type { Resolution, ResolvedPoint } from "@/lib/abgleich";

type Party = { id: string; name: string; role: string };
type StoredAgreement = { agreed?: boolean; at?: string; signature?: string };

const OUTCOME_STYLE: Record<string, { badge: string; label: string }> = {
  rein: { badge: "border-emerald-200 bg-emerald-50 text-emerald-700", label: "kommt hinein" },
  raus: { badge: "border-neutral-200 bg-neutral-100 text-neutral-500", label: "fällt weg" },
  konflikt: { badge: "border-amber-300 bg-amber-50 text-amber-800", label: "offen" },
  tausch: { badge: "border-sky-200 bg-sky-50 text-sky-700", label: "Tauschmasse" },
};

export default function AbgleichErgebnis({
  resolution,
  parties,
  nameOf,
  agreements,
  signature,
  ownId,
  busy,
  onConfirm,
  requireConfirm = true,
}: {
  resolution: Resolution;
  parties: Party[];
  nameOf: (pid: string) => string;
  agreements: Record<string, StoredAgreement>;
  signature: string;
  ownId: string;
  busy: boolean;
  onConfirm: (agreed: boolean) => void;
  /** Aus dem Workflow Manager: manche Schritte wollen nur das Bild zeigen und
   *  die Verbindlichkeit im Gespräch herstellen, nicht per Knopfdruck. */
  requireConfirm?: boolean;
}) {
  const { blocks, conflicts, trades, concessions, gains } = resolution;

  // Gültig ist eine Zustimmung nur zum aktuellen Vorschlag (siehe signature).
  const validAgreement = (pid: string) => {
    const a = agreements[pid];
    return Boolean(a?.agreed) && a?.signature === signature;
  };
  const staleAgreement = (pid: string) => {
    const a = agreements[pid];
    return Boolean(a?.agreed) && a?.signature !== signature;
  };
  const allAgreed = parties.length > 0 && parties.every((p) => validAgreement(p.id));
  const iAgreed = ownId ? validAgreement(ownId) : false;

  const totalAgreed = blocks.reduce((n, b) => n + b.agreed.length, 0);

  return (
    <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm font-semibold text-neutral-900">Vorschlag für eure Einigung</p>
        <p className="text-xs text-neutral-500">
          {totalAgreed} {totalAgreed === 1 ? "Punkt" : "Punkte"} vereinbart
          {conflicts.length > 0 ? ` · ${conflicts.length} offen` : ""}
        </p>
      </div>

      {/* ── Der Tausch: das Herzstück, deshalb ganz oben ── */}
      {trades.length > 0 && (
        <div className="rounded-xl border border-sky-200 bg-sky-50/60 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-sky-700">
            Getauscht ({trades.length})
          </p>
          <div className="space-y-2">
            {trades.map((t, i) => (
              <div key={i} className="rounded-lg bg-white/70 p-2 text-sm text-neutral-700">
                <TradeSide point={t.a} parties={parties} nameOf={nameOf} />
                <p className="my-1 text-center text-xs font-semibold text-sky-600">im Tausch gegen</p>
                <TradeSide point={t.b} parties={parties} nameOf={nameOf} />
              </div>
            ))}
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-sky-800">
            Jede Seite bekommt den Punkt, der ihr wichtiger ist, und gibt dafür den nach, der ihr
            weniger bedeutet. Keine Seite gibt einseitig nach.
          </p>
        </div>
      )}

      {/* ── Ergebnis je Frage ── */}
      <div className="space-y-3">
        {blocks.map((b) => (
          <div key={b.blockId} className="rounded-xl border border-neutral-200 p-3">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
              {b.blockLabel}
            </p>
            {b.agreed.length === 0 ? (
              <p className="text-sm italic text-neutral-400">Hier bleibt nichts stehen.</p>
            ) : (
              <ul className="space-y-1">
                {b.agreed.map((t, i) => (
                  <li key={i} className="text-sm text-neutral-800">
                    <span className="mr-1 text-emerald-600">✓</span>
                    {t}
                  </li>
                ))}
              </ul>
            )}
            {b.points.filter((p) => p.outcome !== "rein").length > 0 && (
              <details className="mt-2">
                <summary className="cursor-pointer text-xs text-neutral-500">
                  Was nicht hineinkam und warum
                </summary>
                <div className="mt-1 space-y-1">
                  {b.points
                    .filter((p) => p.outcome !== "rein")
                    .map((p) => (
                      <PointRow key={p.point.id} point={p} />
                    ))}
                </div>
              </details>
            )}
          </div>
        ))}
      </div>

      {/* ── Offene Punkte ── */}
      {conflicts.length > 0 && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
            {conflicts.length} {conflicts.length === 1 ? "Punkt bleibt" : "Punkte bleiben"} offen
          </p>
          <p className="mb-2 text-[11px] leading-relaxed text-amber-800">
            Hier wiegen die Interessen gleich schwer oder stehen hart gegeneinander. Das ist kein
            Scheitern – es ist genau das, worüber im Gespräch zu reden ist.
          </p>
          <div className="space-y-1">
            {conflicts.map((p) => (
              <PointRow key={p.point.id} point={p} />
            ))}
          </div>
        </div>
      )}

      {/* ── Ausgleich ── */}
      {parties.length > 1 && (
        <div className="rounded-xl bg-neutral-50 p-3">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
            Ausgleich
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            {parties.map((p) => (
              <p key={p.id} className="text-xs text-neutral-600">
                <span className="font-semibold text-neutral-800">{p.name}</span>: {gains[p.id] ?? 0}×
                durchgesetzt, {concessions[p.id] ?? 0}× nachgegeben
              </p>
            ))}
          </div>
        </div>
      )}

      {/* ── Zustimmung ── */}
      {!requireConfirm ? (
        <p className="rounded-xl border border-dashed border-neutral-300 px-3 py-2 text-xs text-neutral-500">
          Dieser Vorschlag ist eine Arbeitsgrundlage – verbindlich wird er erst im Gespräch.
        </p>
      ) : (
      <div className="rounded-xl border border-neutral-200 bg-white p-3">
        {allAgreed ? (
          <p className="text-sm font-semibold text-emerald-800">
            ✓ Beide Seiten haben diesen Vorschlag bestätigt. Er gilt als eure Vereinbarung.
          </p>
        ) : (
          <>
            <div className="mb-2 space-y-0.5">
              {parties.map((p) => (
                <p key={p.id} className="text-xs text-neutral-600">
                  {validAgreement(p.id) ? (
                    <span className="text-emerald-600">✓</span>
                  ) : staleAgreement(p.id) ? (
                    <span className="text-amber-600">↺</span>
                  ) : (
                    <span className="text-neutral-300">○</span>
                  )}{" "}
                  {p.name}
                  {staleAgreement(p.id)
                    ? " – hatte zugestimmt, danach hat sich der Vorschlag geändert"
                    : validAgreement(p.id)
                    ? " – hat bestätigt"
                    : " – hat noch nicht bestätigt"}
                </p>
              ))}
            </div>
            {iAgreed ? (
              <button
                type="button"
                onClick={() => onConfirm(false)}
                disabled={busy}
                className="text-xs font-semibold text-neutral-500 underline disabled:opacity-50"
              >
                Bestätigung zurücknehmen
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onConfirm(true)}
                disabled={busy}
                className="btn btn-primary text-sm disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? "Wird gespeichert …" : "Diesen Vorschlag bestätigen"}
              </button>
            )}
          </>
        )}
      </div>
      )}
    </div>
  );
}

/** Eine Seite eines Tauschs: wer bekommt was. */
function TradeSide({
  point,
  parties,
  nameOf,
}: {
  point: ResolvedPoint;
  parties: Party[];
  nameOf: (pid: string) => string;
}) {
  const winner = parties.find((p) => (point.ratings[p.id] ?? 0) > 0);
  return (
    <p>
      <span className="font-semibold text-neutral-900">{winner ? nameOf(winner.id) : "Eine Seite"}</span>{" "}
      bekommt: <span className="text-neutral-700">{point.point.text}</span>
    </p>
  );
}

function PointRow({ point }: { point: ResolvedPoint }) {
  const style = OUTCOME_STYLE[point.outcome] ?? OUTCOME_STYLE.raus;
  return (
    <div className="flex items-start gap-2">
      <span
        className={`mt-0.5 shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${style.badge}`}
      >
        {style.label}
      </span>
      <span className="text-xs text-neutral-600">
        <span className="text-neutral-800">{point.point.text}</span>
        <span className="text-neutral-400"> — {point.reason}</span>
      </span>
    </div>
  );
}
