"use client";

import { useEffect, useState } from "react";
import type { Invoice } from "../types";
import { KPI, EmptyState, InvoiceStatusBadge, SectionHeader, WCard } from "../ui";
import { fetchInvoices } from "../api";
import { RechnungFormular } from "./RechnungFormular";

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: currency || "EUR",
  }).format(amount);
}

function formatDate(iso?: string | null) {
  if (!iso) return "–";
  return new Intl.DateTimeFormat("de-DE", { dateStyle: "medium" }).format(new Date(iso));
}

function formatTaxRate(rate: number) {
  // z.B. 19 statt 19.0, aber 7.5 bleibt 7.5
  return `${Number.isInteger(rate) ? rate : rate.toFixed(1)} %`;
}

export function RechnungenListe() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  function load() {
    setLoading(true);
    setLoadError(false);
    fetchInvoices()
      .then(setInvoices)
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function handleSaved(invoice: Invoice) {
    setInvoices((prev) => {
      const exists = prev.some((i) => i.id === invoice.id);
      return exists
        ? prev.map((i) => (i.id === invoice.id ? invoice : i))
        : [invoice, ...prev];
    });
  }

  const totalPaidGross = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.gross_amount, 0);
  const totalOpenGross = invoices
    .filter((i) => i.status === "open")
    .reduce((sum, i) => sum + i.gross_amount, 0);
  const currency = invoices[0]?.currency ?? "EUR";

  if (loading) {
    return <p className="px-6 py-10 text-sm italic text-neutral-400">Wird geladen…</p>;
  }

  return (
    <div className="p-6">
      <SectionHeader
        label="Workspace"
        title="Rechnungen"
        action={
          <button
            onClick={() => {
              setEditingInvoice(null);
              setFormOpen(true);
            }}
            className="rounded-full bg-accent-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-accent-600"
          >
            + Neue Rechnung
          </button>
        }
      />

      {loadError ? (
        <EmptyState icon="🧾" text="Rechnungen konnten nicht geladen werden. Bitte Seite neu laden oder später erneut versuchen." />
      ) : (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <KPI
              label="Bezahlt (brutto)"
              value={formatAmount(totalPaidGross, currency)}
              sub={`${invoices.filter((i) => i.status === "paid").length} Rechnungen`}
            />
            <KPI
              label="Offen (brutto)"
              value={formatAmount(totalOpenGross, currency)}
              sub={`${invoices.filter((i) => i.status === "open").length} Rechnungen`}
            />
            <KPI label="Gesamt" value={invoices.length} sub="Rechnungen insgesamt" />
          </div>

          {invoices.length === 0 ? (
            <EmptyState icon="🧾" text="Noch keine Rechnungen vorhanden." />
          ) : (
            <WCard className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-neutral-100 bg-neutral-50 text-left text-xs font-semibold uppercase tracking-wide text-neutral-400">
                  <tr>
                    <th className="px-4 py-3">Nr.</th>
                    <th className="px-4 py-3">Fall</th>
                    <th className="px-4 py-3">Teilnehmer</th>
                    <th className="px-4 py-3">Netto</th>
                    <th className="px-4 py-3">Steuer</th>
                    <th className="px-4 py-3">Brutto</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Bezahlt am</th>
                    <th className="px-4 py-3 text-right">Aktion</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/60">
                      <td className="px-4 py-3 font-medium text-neutral-700">{inv.invoice_number}</td>
                      <td className="px-4 py-3 text-neutral-600">{inv.mediation_title}</td>
                      <td className="px-4 py-3 text-neutral-500">
                        {inv.participant_name ?? inv.payer_name ?? inv.payer_email ?? "–"}
                      </td>
                      <td className="px-4 py-3 text-neutral-600">
                        {formatAmount(inv.amount, inv.currency)}
                      </td>
                      <td className="px-4 py-3 text-neutral-500">{formatTaxRate(inv.tax_rate)}</td>
                      <td className="px-4 py-3 font-semibold text-neutral-800">
                        {formatAmount(inv.gross_amount, inv.currency)}
                      </td>
                      <td className="px-4 py-3">
                        <InvoiceStatusBadge status={inv.status} />
                      </td>
                      <td className="px-4 py-3 text-neutral-500">{formatDate(inv.paid_at)}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => {
                              setEditingInvoice(inv);
                              setFormOpen(true);
                            }}
                            className="text-xs font-semibold text-accent-600 hover:underline"
                          >
                            Bearbeiten
                          </button>
                          {inv.pdf_url && (
                            <a
                              href={inv.pdf_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-semibold text-neutral-500 hover:underline"
                            >
                              PDF
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </WCard>
          )}
        </>
      )}

      {formOpen && (
        <RechnungFormular
          invoice={editingInvoice}
          onClose={() => setFormOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
