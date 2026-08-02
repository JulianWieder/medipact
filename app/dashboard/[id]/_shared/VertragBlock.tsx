"use client";

// ── Vertrags-Block (Mediationsvertrag im Fall) ──────────────────────────────
//
// Bis hierher war der Block "vertrag" im Teilnehmer-Flow nur ein grauer Hinweis
// („siehe Vertrags-Bereich dieses Falls") – einen solchen Bereich gab es aber
// gar nicht mehr: die einzige Vertrags-Oberfläche steckte im abgelösten
// EinleitungClient. Phase 1 endete also nirgends. Hier ist der Vertrag jetzt
// dort, wo der Schritt ihn ankündigt:
//
//   Mediator/Owner : erzeugt den Vertrag aus den Antworten der Phase und gibt
//                    ihn für die Parteien frei.
//   Konfliktpartei : liest den freigegebenen Vertrag und unterschreibt ihn mit
//                    ihrem Namen.
//
// Backend: POST /contract/generate, POST /contract/release, GET /contract,
// POST /contract/sign.

import { useCallback, useEffect, useState } from "react";

type Signature = {
  participant_id: string;
  name: string;
  signed_name: string;
  signed_at: string;
};

type ContractState = {
  contract: { id: number; text: string; created_at: string } | null;
  signatures?: Signature[];
  all_signed?: boolean;
  is_released?: boolean;
};

const MEDIATOR_ROLES = ["mediator", "admin", "owner"];

export default function VertragBlock({
  mediationId,
  viewerRole,
  viewerName,
  template,
}: {
  mediationId: string;
  /** Rolle des angemeldeten Teilnehmers in diesem Fall. */
  viewerRole?: string;
  /** Name des angemeldeten Teilnehmers – erkennt die eigene Unterschrift. */
  viewerName?: string;
  /** Im Workflow Manager hinterlegter Vorlagentext (nur als Hinweis). */
  template?: string;
}) {
  const [state, setState] = useState<ContractState | null>(null);
  const [busy, setBusy] = useState<"" | "generate" | "release" | "sign">("");
  const [error, setError] = useState("");
  const [signedName, setSignedName] = useState("");

  const isMediator = MEDIATOR_ROLES.includes(viewerRole ?? "");

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/mediations/${mediationId}/contract`, { cache: "no-store" });
      if (res.ok) setState(await res.json());
    } catch {
      /* still */
    }
  }, [mediationId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function call(path: string, action: typeof busy, body?: unknown) {
    setBusy(action);
    setError("");
    try {
      const res = await fetch(`/api/mediations/${mediationId}/contract/${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body ?? {}),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.detail ?? data?.error ?? "Das hat nicht geklappt.");
        return false;
      }
      await load();
      return true;
    } catch {
      setError("Server nicht erreichbar.");
      return false;
    } finally {
      setBusy("");
    }
  }

  const contract = state?.contract ?? null;
  const signatures = state?.signatures ?? [];
  // Die eigene Unterschrift wird über den Anzeigenamen erkannt – die
  // participant_id kennt dieser Block nicht.
  const iSigned = Boolean(viewerName) && signatures.some((s) => s.name === viewerName);

  return (
    <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-indigo-600">
        Mediationsvertrag
      </p>

      {/* ── Mediator: erzeugen & freigeben ── */}
      {isMediator && (
        <div className="mb-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => call("generate", "generate")}
            disabled={busy !== ""}
            className="btn btn-secondary text-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy === "generate"
              ? "Wird erstellt …"
              : contract
              ? "Neu aus den Antworten erstellen"
              : "Aus den Antworten erstellen"}
          </button>
          {contract && !state?.is_released && (
            <button
              type="button"
              onClick={() => call("release", "release")}
              disabled={busy !== ""}
              className="btn btn-primary text-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy === "release" ? "Wird freigegeben …" : "Für die Parteien freigeben"}
            </button>
          )}
          {contract && state?.is_released && (
            <span className="self-center text-xs font-semibold text-emerald-600">
              ✓ freigegeben
            </span>
          )}
        </div>
      )}

      {/* ── Vertragstext ── */}
      {contract ? (
        <div className="max-h-96 overflow-y-auto whitespace-pre-wrap rounded-xl border border-indigo-100 bg-white p-4 text-sm leading-relaxed text-neutral-800">
          {contract.text}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-indigo-200 bg-white/60 px-3 py-3 text-sm text-neutral-500">
          {isMediator
            ? "Noch kein Vertrag erstellt. Der Entwurf entsteht aus den Antworten dieser Phase – Ablauf, Regeln, Vertraulichkeit und Ziele."
            : "Der Mediator fasst eure Antworten gerade zum Mediationsvertrag zusammen. Sobald er freigegeben ist, steht er hier zum Lesen und Unterschreiben."}
        </p>
      )}

      {template?.trim() && isMediator && (
        <details className="mt-2 rounded-xl border border-indigo-100 bg-white p-3">
          <summary className="cursor-pointer text-xs font-semibold text-indigo-700">
            Hinterlegte Vorlage
          </summary>
          <p className="mt-2 whitespace-pre-wrap text-sm text-neutral-600">{template}</p>
        </details>
      )}

      {/* ── Unterschriften ── */}
      {contract && (
        <div className="mt-3">
          {signatures.length > 0 && (
            <ul className="mb-3 space-y-1">
              {signatures.map((s) => (
                <li key={s.participant_id} className="text-sm text-neutral-700">
                  <span className="text-emerald-600">✓</span> {s.name} – unterzeichnet als{" "}
                  <span className="font-serif italic">{s.signed_name}</span>
                </li>
              ))}
            </ul>
          )}

          {state?.all_signed ? (
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">
              Der Mediationsvertrag ist von allen unterzeichnet.
            </p>
          ) : iSigned ? (
            <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Du hast unterzeichnet – es fehlt noch die Unterschrift der anderen Seite.
            </p>
          ) : (
            <div className="rounded-xl border border-indigo-100 bg-white p-3">
              <p className="mb-2 text-sm text-neutral-600">
                Mit deinem vollständigen Namen unterzeichnest du den Vertrag.
              </p>
              <div className="flex flex-wrap gap-2">
                <input
                  value={signedName}
                  onChange={(e) => setSignedName(e.target.value)}
                  placeholder="Vollständiger Name"
                  className="flex-1 rounded-lg border-b-2 border-neutral-300 px-2 py-1.5 font-serif text-lg italic text-neutral-800 focus:border-accent-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={async () => {
                    const ok = await call("sign", "sign", { signed_name: signedName.trim() });
                    if (ok) setSignedName("");
                  }}
                  disabled={busy !== "" || signedName.trim() === ""}
                  className="btn btn-primary text-sm disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {busy === "sign" ? "Wird gespeichert …" : "Unterzeichnen"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {error && <p className="mt-2 text-xs font-semibold text-red-600">{error}</p>}
    </div>
  );
}
