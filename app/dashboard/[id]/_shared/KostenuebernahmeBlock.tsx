"use client";

// ── Freiwillige Kostenübernahme ─────────────────────────────────────────────
//
// „Ich zahle für uns beide." Die Ausgangslage einer Mediation ist oft
// asymmetrisch: eine Seite will das Verfahren, die andere scheut die Kosten
// oder kann sie schlicht nicht tragen. Statt daran zu scheitern, darf eine
// Partei den Anteil der anderen mittragen.
//
// Zwei Wege – welcher gilt, sagt der Server über `mode` je Angebot:
//   bundle   – ich habe selbst noch nicht bezahlt. Ein Klick genügt: der
//              fremde Anteil wird auf meinen Betrag im Freischaltungs-Block
//              addiert, es bleibt bei EINER Zahlung.
//   separate – mein Anteil ist bereits reserviert und lässt sich nicht mehr
//              erhöhen. Dann läuft die Übernahme als eigene Zahlung über die
//              PayPal-Buttons hier.
//
// Die Komponente wird an zwei Stellen benutzt:
//   • eingebettet im Bezahl-Block (Status kommt von dort, `status`/`onStatus`)
//   • als eigener Workflow-Block "kostenuebernahme", den der Mediator an eine
//     beliebige Stelle der Einladungs-Phase legen kann (lädt selbst).

import { useCallback, useEffect, useState } from "react";
import PayPalAuthorizeButtons from "./PayPalAuthorizeButtons";
import type { PayStatus } from "./paymentTypes";

function euro(n: number) {
  return `${n.toFixed(2)} €`;
}

function partyName(name: string | null, role: string) {
  if (name) return name;
  return role === "owner" ? "die einladende Seite" : "die andere Seite";
}

export default function KostenuebernahmeBlock({
  mediationId,
  title,
  description,
  status: statusProp,
  onStatus,
  embedded = false,
}: {
  mediationId: string;
  title?: string;
  description?: string;
  /** Gesetzt, wenn der Bezahl-Block den Status ohnehin schon geladen hat. */
  status?: PayStatus | null;
  /** Meldet einen neuen Status zurück (nach Übernahme/Zahlung). */
  onStatus?: (status: PayStatus) => void;
  /** Eingebettet = ohne eigenen Rahmen und ohne Überschrift. */
  embedded?: boolean;
}) {
  const [own, setOwn] = useState<PayStatus | null>(null);
  const status = statusProp !== undefined ? statusProp : own;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const apply = useCallback(
    (next: PayStatus) => {
      if (statusProp !== undefined) onStatus?.(next);
      else setOwn(next);
    },
    [statusProp, onStatus],
  );

  useEffect(() => {
    if (statusProp !== undefined) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/mediations/${mediationId}/price`, {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = (await res.json()) as PayStatus;
        if (!cancelled) setOwn(data);
      } catch {
        /* stumm – der Block zeigt dann nichts an */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mediationId, statusProp]);

  async function toggleCoverage(participantId: number, cover: boolean) {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/mediations/${mediationId}/coverage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participant_id: participantId, cover }),
      });
      const d = await res.json().catch(() => null);
      if (!res.ok) {
        setError(d?.detail ?? "Die Übernahme konnte nicht gespeichert werden.");
        return;
      }
      apply(d as PayStatus);
    } catch {
      setError("Server nicht erreichbar.");
    } finally {
      setBusy(false);
    }
  }

  if (!status) return null;

  const you = status.you;
  // Eigene Teilnehmer-ID – der Ablehnungs-Weg schickt sie mit ("nimm die
  // Übernahme von MIR zurück").
  const myParticipantId = status.participants.find((p) => p.is_you)?.participant_id;
  const offers = status.coverage_offers ?? [];
  const covers = you.covers ?? [];
  const coveredBy = you.covered_by ?? null;

  // Nichts anzubieten und nichts zu berichten -> gar nichts rendern. Ein leerer
  // Kasten „Kostenübernahme" im Verfahren wäre nur Rauschen.
  if (!offers.length && !covers.length && !coveredBy) return null;

  const body = (
    <div className="space-y-3">
      {/* Ich werde übernommen */}
      {coveredBy && (
        <div className="rounded-xl border border-accent-200 bg-accent-50 p-4">
          <p className="text-sm font-bold text-accent-700">
            {coveredBy.name ?? "Die andere Seite"} übernimmt deinen Anteil.
          </p>
          <p className="mt-1 text-sm text-neutral-600">
            Für dich fallen dadurch keine Kosten an. Am Verfahren ändert das
            nichts: Mediation bleibt freiwillig, und wer zahlt, bekommt dadurch
            kein größeres Gewicht.
          </p>
          {/* Freiwillig gilt in beide Richtungen – wer lieber selbst zahlt,
              darf das, solange noch nichts geflossen ist. */}
          {myParticipantId !== undefined && (
            <button
              type="button"
              onClick={() => toggleCoverage(myParticipantId, false)}
              disabled={busy}
              className="mt-2 text-sm font-semibold text-neutral-500 hover:underline disabled:opacity-60"
            >
              Ich zahle lieber selbst
            </button>
          )}
        </div>
      )}

      {/* Ich habe übernommen */}
      {covers.map((c) => (
        <div
          key={c.participant_id}
          className="flex items-start justify-between gap-3 rounded-xl border border-accent-200 bg-accent-50 p-4"
        >
          <div>
            <p className="text-sm font-bold text-accent-700">
              Du übernimmst den Anteil von {c.name ?? "der anderen Seite"} (
              {euro(c.amount_eur)}).
            </p>
            <p className="mt-1 text-sm text-neutral-600">
              {c.settled
                ? "Der Betrag ist zugesagt."
                : "Der Betrag ist in deinem Anteil unten enthalten."}
            </p>
          </div>
          {!c.settled && !you.paid && !you.authorized && (
            <button
              type="button"
              onClick={() => toggleCoverage(c.participant_id, false)}
              disabled={busy}
              className="shrink-0 text-sm font-semibold text-neutral-500 hover:underline disabled:opacity-60"
            >
              Rückgängig
            </button>
          )}
        </div>
      ))}

      {/* Angebote */}
      {offers.map((offer) => (
        <div
          key={offer.participant_id}
          className="rounded-xl border border-neutral-200 bg-neutral-50/60 p-4"
        >
          <p className="text-sm font-semibold text-neutral-900">
            Anteil von {partyName(offer.name, offer.role)} übernehmen
          </p>
          <p className="mt-1 text-sm text-neutral-600">
            {offer.mode === "bundle"
              ? `Der Betrag von ${euro(offer.amount_eur)} kommt zu deinem eigenen Anteil dazu – du bezahlst beides in einem Schritt.`
              : `Dein eigener Anteil steht schon fest und lässt sich nicht mehr ändern. Die Übernahme läuft deshalb als eigene Zahlung über ${euro(offer.amount_eur)}.`}
          </p>
          {offer.mode === "bundle" ? (
            <button
              type="button"
              onClick={() => toggleCoverage(offer.participant_id, true)}
              disabled={busy}
              className="btn btn-secondary mt-3 text-sm disabled:opacity-60"
            >
              {busy ? "Einen Moment …" : `Übernehmen (+${euro(offer.amount_eur)})`}
            </button>
          ) : (
            <div className="mt-3 max-w-sm">
              <p className="mb-2 text-xs text-neutral-500">
                Der Betrag wird zunächst nur reserviert und erst abgebucht, wenn
                das Verfahren tatsächlich startet.
              </p>
              <PayPalAuthorizeButtons
                key={`${offer.participant_id}-${offer.amount_eur}`}
                mediationId={mediationId}
                forParticipantId={offer.participant_id}
                onDone={(d) => apply(d as PayStatus)}
                onError={setError}
                onBusyChange={setBusy}
              />
            </div>
          )}
        </div>
      ))}

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}
    </div>
  );

  if (embedded) return body;

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5">
      <p className="text-base font-bold text-neutral-900">
        {title || "Kosten freiwillig übernehmen"}
      </p>
      <p className="mt-1 text-sm text-neutral-600">
        {description ||
          "Jede Seite trägt normalerweise ihren eigenen Anteil. Wenn du möchtest, kannst du den Anteil der anderen Seite mitbezahlen – freiwillig und ohne Gegenleistung."}
      </p>
      <div className="mt-4">{body}</div>
    </div>
  );
}
