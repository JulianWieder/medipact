"use client";

// ── Bezahl-Block „Fall freischalten" (Teilnehmer-Seite) ─────────────────────
//
// Der eigentliche Bezahl-Schritt des Falls, gerendert als Block innerhalb des
// Workflows (Blocktyp "fall_freischaltung", siehe workspace/blockTypes.ts).
// Früher war das ein fester Schritt der Onboarding-Checkliste; seit dem Umbau
// gestaltet der Mediator im WorkflowManager selbst, an welcher Stelle der
// Einladungs-Phase bezahlt wird.
//
// WICHTIG – Reihenfolge im Block:
//   1. Rechnungsdaten (Pflicht, bevor bezahlt werden kann: beim Zahlungseingang
//      wird daraus automatisch die Rechnung erzeugt)
//   2. Betrag inkl. Rabattcode und Add-ons
//   3. PayPal – reserviert nur, abgebucht wird erst, wenn ALLE zugesagt haben
//      (siehe backend/app/paypal.py und services/billing.py)
//
// Der Block ist nur in der Einladungs-Phase erreichbar – alle anderen Phasen
// sind bis zur vollständigen Zahlung durch die Paywall geschützt.

import { useCallback, useEffect, useRef, useState } from "react";

type PayPalSdk = {
  Buttons: (options: Record<string, unknown>) => {
    render: (container: HTMLElement) => Promise<void>;
  };
};

// Eigene SDK-Instanz mit intent=authorize. MUSS getrennt vom Standard-SDK
// (intent=capture, für Bonus-Leistungen) geladen werden: passt der Intent im
// Script-URL nicht zur serverseitig erzeugten Order, öffnet sich das
// PayPal-Fenster und schließt sofort wieder.
const SDK_ID = "paypal-sdk-authorize";
const SDK_NAMESPACE = "paypalAuthorize";

function getSdk(): PayPalSdk | undefined {
  return (window as unknown as Record<string, PayPalSdk | undefined>)[SDK_NAMESPACE];
}

type PartyStatus = {
  participant_id: number;
  role: string;
  name: string | null;
  owes: boolean;
  paid: boolean;
  authorized?: boolean;
  amount_due_eur: number;
  is_you: boolean;
};

type AddonOffer = { key: string; label: string; description: string; price_eur: number };

type PayStatus = {
  is_paid: boolean;
  all_owing_paid: boolean;
  addons_available?: AddonOffer[];
  you: {
    owes: boolean;
    base_due_eur: number;
    discount_code: string | null;
    discount_amount_eur: number;
    addons?: { key: string; price_eur: number }[];
    addons_total_eur?: number;
    amount_due_eur: number;
    paid: boolean;
    authorized?: boolean;
    billing_address_complete?: boolean;
  };
  participants: PartyStatus[];
  warning?: string;
};

const INPUT =
  "w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-accent-500 focus:ring-4 focus:ring-accent-100";

export default function FallFreischaltungBlock({
  mediationId,
  title,
  description,
  onPaid,
}: {
  mediationId: string;
  title: string;
  description: string;
  /** Wird aufgerufen, sobald der eigene Anteil bezahlt/reserviert ist bzw. der
   *  Fall komplett freigeschaltet wurde. Genutzt von PhaseNotesClient, um die
   *  gesperrte Phase ohne Seiten-Reload nachzuladen. */
  onPaid?: () => void;
}) {
  const [status, setStatus] = useState<PayStatus | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Rechnungsdaten
  const [street, setStreet] = useState("");
  const [postal, setPostal] = useState("");
  const [city, setCity] = useState("");
  const [addressSaved, setAddressSaved] = useState(false);
  const [addressEditing, setAddressEditing] = useState(false);
  const [addressBusy, setAddressBusy] = useState(false);
  const [addressError, setAddressError] = useState("");

  // Rabattcode
  const [codeInput, setCodeInput] = useState("");
  const [codeBusy, setCodeBusy] = useState(false);
  const [codeError, setCodeError] = useState("");
  const [addonBusy, setAddonBusy] = useState(false);

  const paypalRef = useRef<HTMLDivElement>(null);
  const mountedNode = useRef<HTMLElement | null>(null);
  const [retry, setRetry] = useState(0);

  const loadStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/mediations/${mediationId}/price`);
      if (!res.ok) return;
      const data = (await res.json()) as PayStatus;
      setStatus(data);
    } catch {
      /* stumm – der Block zeigt dann den Ladezustand */
    }
  }, [mediationId]);

  useEffect(() => {
    loadStatus();
    (async () => {
      try {
        const res = await fetch(`/api/mediations/${mediationId}/billing-address`);
        if (!res.ok) return;
        const d = await res.json();
        const s = d?.billing_street ?? "";
        const p = d?.billing_postal_code ?? "";
        const c = d?.billing_city ?? "";
        setStreet(s);
        setPostal(p);
        setCity(c);
        setAddressSaved(Boolean(s && p && c));
      } catch {
        /* stumm */
      }
    })();
  }, [mediationId, loadStatus]);

  async function saveAddress() {
    setAddressBusy(true);
    setAddressError("");
    try {
      const res = await fetch(`/api/mediations/${mediationId}/billing-address`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          billing_street: street,
          billing_postal_code: postal,
          billing_city: city,
        }),
      });
      const d = await res.json().catch(() => null);
      if (!res.ok) {
        setAddressError(d?.detail ?? "Rechnungsdaten konnten nicht gespeichert werden.");
        return;
      }
      setAddressSaved(true);
      setAddressEditing(false);
      loadStatus();
    } catch {
      setAddressError("Server nicht erreichbar.");
    } finally {
      setAddressBusy(false);
    }
  }

  async function applyCode() {
    setCodeBusy(true);
    setCodeError("");
    try {
      const res = await fetch(`/api/mediations/${mediationId}/discount`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeInput.trim() }),
      });
      const d = await res.json().catch(() => null);
      if (!res.ok) {
        setCodeError(d?.detail ?? "Code ungültig.");
        return;
      }
      setStatus(d);
      setCodeInput("");
    } catch {
      setCodeError("Server nicht erreichbar.");
    } finally {
      setCodeBusy(false);
    }
  }

  async function toggleAddon(key: string) {
    if (!status) return;
    const current = (status.you.addons ?? []).map((a) => a.key);
    const next = current.includes(key)
      ? current.filter((k) => k !== key)
      : [...current, key];
    setAddonBusy(true);
    try {
      const res = await fetch(`/api/mediations/${mediationId}/addons`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keys: next }),
      });
      const d = await res.json().catch(() => null);
      if (res.ok) setStatus(d);
    } catch {
      /* stumm */
    } finally {
      setAddonBusy(false);
    }
  }

  async function redeemFree() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/mediations/${mediationId}/pay/free`, { method: "POST" });
      const d = await res.json().catch(() => null);
      if (!res.ok) {
        setError(d?.detail ?? "Freischaltung fehlgeschlagen.");
        return;
      }
      setStatus(d);
      if (d.warning) setError(d.warning);
    } catch {
      setError("Server nicht erreichbar.");
    } finally {
      setBusy(false);
    }
  }

  function resetButtons() {
    mountedNode.current = null;
    if (paypalRef.current) paypalRef.current.innerHTML = "";
    setRetry((n) => n + 1);
  }

  // Statuswechsel -> einmalig onPaid melden (nicht bei jedem Re-Render).
  //
  // ACHTUNG – hier zählt AUSSCHLIESSLICH status.is_paid: die Paywall im Backend
  // (services/billing.ensure_unlocked) öffnet erst, wenn ALLE zahlungspflichtigen
  // Parteien eingezogen sind. Der eigene Status (paid/authorized/kein Betrag)
  // schaltet gar nichts frei. Meldete der Block schon dabei „bezahlt", lud die
  // Phase neu, bekam wieder 402, mountete den Block neu -> onPaid erneut ->
  // Endlosschleife, die als Flackern der Seite sichtbar war.
  const paidNotified = useRef(false);
  const caseUnlocked = !!status && status.is_paid;
  useEffect(() => {
    if (caseUnlocked && !paidNotified.current) {
      paidNotified.current = true;
      onPaid?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseUnlocked]);

  const iAmAuthorized = !!status && !!status.you.authorized && !status.you.paid;
  const showPaypal =
    !!status &&
    status.you.owes &&
    !status.you.paid &&
    !iAmAuthorized &&
    status.you.amount_due_eur > 0 &&
    !status.is_paid &&
    addressSaved;

  useEffect(() => {
    if (!showPaypal) {
      if (paypalRef.current) paypalRef.current.innerHTML = "";
      mountedNode.current = null;
      return;
    }
    if (mountedNode.current && mountedNode.current === paypalRef.current) return;

    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    if (!clientId) {
      setError("PayPal ist noch nicht konfiguriert.");
      return;
    }

    function render() {
      const sdk = getSdk();
      const container = paypalRef.current;
      if (!sdk || !container) return;
      if (mountedNode.current === container) return;
      mountedNode.current = container;
      container.innerHTML = "";
      sdk
        .Buttons({
          style: { layout: "vertical", color: "gold", label: "paypal" },
          createOrder: async () => {
            setError("");
            const res = await fetch(
              `/api/mediations/${mediationId}/pay/paypal/create-order`,
              { method: "POST" },
            );
            const d = await res.json().catch(() => null);
            if (!res.ok) throw new Error(d?.detail ?? "Order konnte nicht erstellt werden");
            return d.order_id;
          },
          onApprove: async (data: { orderID: string }) => {
            setBusy(true);
            setError("");
            try {
              const res = await fetch(
                `/api/mediations/${mediationId}/pay/paypal/capture-order`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ order_id: data.orderID }),
                },
              );
              const d = await res.json().catch(() => null);
              if (!res.ok) {
                setError(`Zahlung fehlgeschlagen: ${d?.detail ?? "Unbekannter Fehler"}`);
                resetButtons();
                return;
              }
              setStatus(d);
              if (d.warning) setError(d.warning);
            } catch {
              setError("Server nicht erreichbar.");
              resetButtons();
            } finally {
              setBusy(false);
            }
          },
          onError: () => {
            setError("PayPal hat einen Fehler gemeldet. Bitte erneut versuchen.");
            resetButtons();
          },
          onCancel: () => setBusy(false),
        })
        .render(container)
        .catch(() => {
          mountedNode.current = null;
          setError("Der PayPal-Button konnte nicht geladen werden. Bitte Seite neu laden.");
        });
    }

    const existing = document.getElementById(SDK_ID) as HTMLScriptElement | null;
    if (getSdk()) render();
    else if (existing) existing.addEventListener("load", render);
    else {
      const s = document.createElement("script");
      s.id = SDK_ID;
      s.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=EUR&intent=authorize`;
      s.setAttribute("data-namespace", SDK_NAMESPACE);
      s.addEventListener("load", render);
      s.addEventListener("error", () =>
        setError("Das PayPal-SDK konnte nicht geladen werden (Netzwerk oder Adblocker?)."),
      );
      document.body.appendChild(s);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediationId, showPaypal, status?.you.amount_due_eur, retry]);

  // ── Darstellung ──────────────────────────────────────────────────────────
  if (!status) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 text-sm text-neutral-400">
        Zahlungsstatus wird geladen …
      </div>
    );
  }

  const you = status.you;

  return (
    <div className="rounded-2xl border border-accent-200 bg-white p-5">
      <p className="text-base font-bold text-neutral-900">{title || "Mediation freischalten"}</p>
      {description && <p className="mt-1 text-sm text-neutral-600">{description}</p>}

      {status.is_paid ? (
        <div className="mt-4 rounded-xl border border-accent-200 bg-accent-50 p-4">
          <p className="font-bold text-accent-700">Zahlung vollständig ✓</p>
          <p className="mt-1 text-sm text-neutral-600">
            Alle Parteien haben bezahlt – die Mediation ist freigeschaltet.
          </p>
        </div>
      ) : !you.owes ? (
        <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
          <p className="font-semibold text-neutral-800">Für dich fällt kein Betrag an.</p>
          <p className="mt-1 text-sm text-neutral-600">
            Bei diesem Fall zahlt die andere Seite.
          </p>
        </div>
      ) : you.paid ? (
        <div className="mt-4 rounded-xl border border-accent-200 bg-accent-50 p-4">
          <p className="font-bold text-accent-700">Dein Anteil ist bezahlt ✓</p>
          <p className="mt-1 text-sm text-neutral-600">
            {status.all_owing_paid
              ? "Alle Parteien haben bezahlt."
              : "Warten auf die Zahlung der anderen Seite …"}
          </p>
        </div>
      ) : iAmAuthorized ? (
        <div className="mt-4 rounded-xl border border-accent-200 bg-accent-50 p-4">
          <p className="font-bold text-accent-700">Dein Betrag ist reserviert ✓</p>
          <p className="mt-1 text-sm text-neutral-600">
            {you.amount_due_eur.toFixed(2)} € sind bei PayPal vorgemerkt, aber noch nicht
            abgebucht. Der Einzug erfolgt, sobald auch die andere Seite zugestimmt hat.
          </p>
        </div>
      ) : (
        <>
          {/* 1 – Rechnungsdaten */}
          <div className="mt-5 rounded-xl border border-neutral-200 bg-neutral-50/60 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-neutral-400">
              Rechnungsdaten
            </p>
            {addressSaved && !addressEditing ? (
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-neutral-900">
                  {street}, {postal} {city}
                </p>
                <button
                  type="button"
                  onClick={() => setAddressEditing(true)}
                  className="shrink-0 text-sm font-semibold text-accent-700 hover:underline"
                >
                  Ändern
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Straße und Hausnummer"
                  className={INPUT}
                />
                <div className="flex gap-2">
                  <input
                    value={postal}
                    onChange={(e) => setPostal(e.target.value)}
                    placeholder="PLZ"
                    className={`${INPUT} max-w-[120px]`}
                  />
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ort"
                    className={INPUT}
                  />
                </div>
                <button
                  type="button"
                  onClick={saveAddress}
                  disabled={addressBusy || !street.trim() || !postal.trim() || !city.trim()}
                  className="btn btn-secondary text-sm disabled:opacity-60"
                >
                  {addressBusy ? "Wird gespeichert…" : "Rechnungsdaten speichern"}
                </button>
                {addressError && (
                  <p className="text-xs font-semibold text-red-600">{addressError}</p>
                )}
              </div>
            )}
          </div>

          {/* 2 – Betrag */}
          <div className="mt-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent-600">
              Dein Anteil
            </p>
            <div className="flex items-baseline justify-center gap-2">
              {you.discount_amount_eur > 0 && (
                <span className="text-lg text-neutral-400 line-through">
                  {you.base_due_eur.toFixed(2)} €
                </span>
              )}
              <span className="text-4xl font-black text-neutral-900">
                {you.amount_due_eur.toFixed(2)}
              </span>
              <span className="text-lg font-bold text-neutral-900">€</span>
            </div>
            <p className="text-xs text-neutral-400">inkl. MwSt.</p>
          </div>

          {/* Rabattcode */}
          <div className="mx-auto mt-4 w-full max-w-sm">
            {you.discount_code ? (
              <p className="text-center text-sm font-semibold text-accent-700">
                Code {you.discount_code} angewendet (−{you.discount_amount_eur.toFixed(2)} €)
              </p>
            ) : (
              <div className="flex gap-2">
                <input
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  placeholder="Rabattcode"
                  className={INPUT}
                />
                <button
                  type="button"
                  onClick={applyCode}
                  disabled={codeBusy || !codeInput.trim()}
                  className="btn btn-secondary shrink-0 px-4 py-2 text-sm disabled:opacity-60"
                >
                  {codeBusy ? "…" : "Anwenden"}
                </button>
              </div>
            )}
            {codeError && (
              <p className="mt-2 text-xs font-semibold text-red-600">{codeError}</p>
            )}
          </div>

          {/* Add-ons */}
          {(status.addons_available?.length ?? 0) > 0 && (
            <div className="mx-auto mt-5 w-full max-w-sm text-left">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-neutral-400">
                Optionale Zusatzleistungen
              </p>
              <div className="space-y-2">
                {status.addons_available!.map((addon) => {
                  const selected = (you.addons ?? []).some((a) => a.key === addon.key);
                  return (
                    <label
                      key={addon.key}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
                        selected
                          ? "border-accent-500 bg-accent-50"
                          : "border-neutral-200 bg-white hover:border-neutral-300"
                      } ${addonBusy ? "opacity-60" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        disabled={addonBusy}
                        onChange={() => toggleAddon(addon.key)}
                        className="mt-1 h-4 w-4 accent-accent-600"
                      />
                      <span className="flex-1">
                        <span className="flex items-baseline justify-between gap-2">
                          <span className="text-sm font-semibold text-neutral-900">
                            {addon.label}
                          </span>
                          <span className="shrink-0 text-sm font-bold text-neutral-900">
                            +{addon.price_eur.toFixed(0)} €
                          </span>
                        </span>
                        <span className="mt-0.5 block text-xs text-neutral-500">
                          {addon.description}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3 – Zahlung */}
          <div className="mx-auto mt-6 w-full max-w-sm">
            {!addressSaved ? (
              <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-800">
                Bitte zuerst die Rechnungsdaten oben speichern.
              </p>
            ) : you.amount_due_eur > 0 ? (
              <>
                <p className="mb-3 text-center text-xs text-neutral-500">
                  Der Betrag wird zunächst nur reserviert und erst abgebucht, wenn alle
                  Parteien zugestimmt haben. Kommt die Mediation nicht zustande, wird die
                  Reservierung freigegeben.
                </p>
                <div ref={paypalRef} />
              </>
            ) : (
              <button
                type="button"
                onClick={redeemFree}
                disabled={busy}
                className="btn btn-primary w-full disabled:opacity-60"
              >
                {busy ? "Wird freigeschaltet…" : "Kostenlos freischalten"}
              </button>
            )}
            {busy && you.amount_due_eur > 0 && (
              <p className="mt-2 text-center text-sm font-semibold text-neutral-500">
                Zahlung wird verarbeitet…
              </p>
            )}
          </div>
        </>
      )}

      {/* Status aller Parteien */}
      {status.participants.length > 0 && !status.is_paid && (
        <div className="mx-auto mt-6 w-full max-w-sm text-left">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-neutral-400">
            Status
          </p>
          <ul className="space-y-1">
            {status.participants.map((p) => (
              <li key={p.participant_id} className="flex items-center justify-between text-sm">
                <span className="text-neutral-700">
                  {p.name ?? p.role}
                  {p.is_you && <span className="text-neutral-400"> (du)</span>}
                </span>
                <span className="font-semibold">
                  {!p.owes ? (
                    <span className="text-neutral-400">kein Betrag</span>
                  ) : p.paid ? (
                    <span className="text-accent-700">bezahlt ✓</span>
                  ) : p.authorized ? (
                    <span className="text-accent-700">
                      reserviert · {p.amount_due_eur.toFixed(2)} €
                    </span>
                  ) : (
                    <span className="text-neutral-500">
                      offen · {p.amount_due_eur.toFixed(2)} €
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
