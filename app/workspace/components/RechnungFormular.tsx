"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { Invoice, MediationCase, Participant } from "../types";
import { fetchAllMediations, fetchParticipants, createInvoice, updateInvoice } from "../api";
import { cn } from "../ui";

interface RechnungFormularProps {
  /** Wenn gesetzt: Bearbeiten-Modus, sonst Neuanlage. */
  invoice?: Invoice | null;
  onClose: () => void;
  onSaved: (invoice: Invoice) => void;
}

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "open", label: "Offen" },
  { value: "paid", label: "Bezahlt" },
  { value: "refunded", label: "Erstattet" },
  { value: "failed", label: "Fehlgeschlagen" },
];

function inputClass(hasError?: boolean) {
  return cn(
    "w-full rounded-xl border bg-white px-3 py-2 text-sm text-neutral-800 outline-none transition focus:border-accent-500",
    hasError ? "border-red-300" : "border-neutral-200",
  );
}

export function RechnungFormular({ invoice, onClose, onSaved }: RechnungFormularProps) {
  const isEdit = !!invoice;

  const [mediations, setMediations] = useState<MediationCase[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);

  const [mediationId, setMediationId] = useState<string>(
    invoice ? String(invoice.mediation_id) : "",
  );
  const [participantId, setParticipantId] = useState<string>(
    invoice ? String(invoice.participant_id) : "",
  );
  const [amount, setAmount] = useState(invoice ? String(invoice.amount) : "");
  const [taxRate, setTaxRate] = useState(invoice ? String(invoice.tax_rate) : "19");
  const [status, setStatus] = useState(invoice?.status ?? "open");
  const [payerName, setPayerName] = useState(invoice?.payer_name ?? "");
  const [payerEmail, setPayerEmail] = useState(invoice?.payer_email ?? "");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fälle laden – fetchAllMediations() fällt bei fehlender Admin/Mediator-Rolle
  // automatisch auf die eigenen Fälle zurück.
  useEffect(() => {
    fetchAllMediations()
      .then(setMediations)
      .catch(() => setMediations([]));
  }, []);

  // Teilnehmer des gewählten Falls laden, sobald einer ausgewählt ist.
  useEffect(() => {
    if (!mediationId) {
      setParticipants([]);
      return;
    }
    let cancelled = false;
    setLoadingParticipants(true);
    fetchParticipants(Number(mediationId))
      .then((list) => {
        if (cancelled) return;
        // Nur angenommene Teilnahmen können abgerechnet werden – offene
        // Einladungen haben synthetische IDs ("invite-…") ohne echte
        // mediation_participants-Zeile.
        setParticipants(list.filter((p) => p.invitationStatus === "accepted"));
      })
      .catch(() => !cancelled && setParticipants([]))
      .finally(() => !cancelled && setLoadingParticipants(false));
    return () => {
      cancelled = true;
    };
  }, [mediationId]);

  function handleSelectParticipant(id: string) {
    setParticipantId(id);
    // Name/E-Mail bei Neuanlage bequem vorbefüllen; bei bestehenden
    // Rechnungen lassen wir manuell eingetragene payer_name/-email in Ruhe.
    if (!isEdit) {
      const p = participants.find((entry) => entry.id === id);
      if (p) {
        setPayerName(p.name);
        setPayerEmail(p.email);
      }
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!mediationId || !participantId || !amount) {
      setError("Bitte Fall, Teilnehmer und Betrag ausfüllen.");
      return;
    }
    const amountNum = parseFloat(amount.replace(",", "."));
    const taxRateNum = parseFloat((taxRate || "0").replace(",", "."));
    if (!Number.isFinite(amountNum) || amountNum <= 0) {
      setError("Betrag muss eine Zahl größer 0 sein.");
      return;
    }
    if (!Number.isFinite(taxRateNum) || taxRateNum < 0 || taxRateNum > 100) {
      setError("Steuersatz muss zwischen 0 und 100 liegen.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        mediation_id: Number(mediationId),
        participant_id: Number(participantId),
        amount: amountNum,
        tax_rate: taxRateNum,
        currency: "EUR",
        payer_name: payerName || null,
        payer_email: payerEmail || null,
        status,
      };
      const saved = isEdit
        ? await updateInvoice(invoice!.id, payload)
        : await createInvoice(payload);
      onSaved(saved);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Rechnung konnte nicht gespeichert werden.");
    } finally {
      setSaving(false);
    }
  }

  const selectedMediation = mediations.find((m) => String(m.id) === mediationId);
  const grossPreview =
    amount && taxRate
      ? (
          parseFloat(amount.replace(",", ".") || "0") *
          (1 + parseFloat(taxRate.replace(",", ".") || "0") / 100)
        ).toFixed(2)
      : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-100 bg-white px-6 py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-600">
              {isEdit ? "Rechnung bearbeiten" : "Neue Rechnung"}
            </p>
            <h2 className="text-lg font-semibold text-neutral-900">
              {isEdit ? invoice!.invoice_number : "Rechnung erstellen"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition"
            aria-label="Schließen"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-semibold text-neutral-600">Fall</label>
            {isEdit ? (
              <div className="rounded-xl border border-neutral-100 bg-neutral-50 px-3 py-2 text-sm text-neutral-600">
                {invoice!.mediation_title}{" "}
                <span className="text-neutral-400">(Fall kann nachträglich nicht geändert werden)</span>
              </div>
            ) : (
              <select
                value={mediationId}
                onChange={(e) => {
                  setMediationId(e.target.value);
                  setParticipantId("");
                }}
                className={inputClass()}
                required
              >
                <option value="">Fall wählen…</option>
                {mediations.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-neutral-600">
              Teilnehmer (wird abgerechnet)
            </label>
            <select
              value={participantId}
              onChange={(e) => handleSelectParticipant(e.target.value)}
              className={inputClass()}
              disabled={!mediationId || loadingParticipants}
              required
            >
              <option value="">
                {loadingParticipants ? "Lädt…" : "Teilnehmer wählen…"}
              </option>
              {participants.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.email})
                </option>
              ))}
              {isEdit && invoice && !participants.some((p) => p.id === String(invoice.participant_id)) && (
                <option value={String(invoice.participant_id)}>
                  {invoice.participant_name ?? "Aktueller Teilnehmer"}
                </option>
              )}
            </select>
            {selectedMediation && participants.length === 0 && !loadingParticipants && (
              <p className="mt-1 text-xs text-amber-600">
                Keine angenommenen Teilnehmer in diesem Fall – erst Einladung annehmen lassen.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-neutral-600">
                Nettobetrag (EUR)
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="249.00"
                className={inputClass()}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-neutral-600">
                Steuersatz (%)
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                placeholder="19"
                className={inputClass()}
              />
              <p className="mt-1 text-[11px] text-neutral-400">
                Frei editierbar – z.B. 19 / 7 / 0 (Kleinunternehmerregelung).
              </p>
            </div>
          </div>

          {grossPreview && (
            <p className="text-xs text-neutral-500">
              Bruttobetrag (Vorschau): <span className="font-semibold text-neutral-700">€{grossPreview}</span>
            </p>
          )}

          <div>
            <label className="mb-1 block text-xs font-semibold text-neutral-600">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={inputClass()}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-neutral-600">
                Empfänger-Name
              </label>
              <input
                type="text"
                value={payerName}
                onChange={(e) => setPayerName(e.target.value)}
                className={inputClass()}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-neutral-600">
                Empfänger-E-Mail
              </label>
              <input
                type="email"
                value={payerEmail}
                onChange={(e) => setPayerEmail(e.target.value)}
                className={inputClass()}
              />
            </div>
          </div>

          <div className="sticky bottom-0 -mx-6 -mb-6 flex justify-end gap-3 border-t border-neutral-100 bg-white px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-neutral-200 px-5 py-2 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-50"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-accent-500 px-6 py-2 text-sm font-semibold text-white transition hover:bg-accent-600 disabled:opacity-50"
            >
              {saving ? "Speichert…" : isEdit ? "Änderungen speichern" : "Rechnung erstellen"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
