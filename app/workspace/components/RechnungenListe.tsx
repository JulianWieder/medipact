"use client";

import { useEffect, useState } from "react";
import type { Invoice } from "../types";
import { KPI, EmptyState, InvoiceStatusBadge, SectionHeader, WCard } from "../ui";

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

export function RechnungenListe() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [backendMissing, setBackendMissing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch("/api/invoices", { cache: "no-store" })
      .then(async (res) => {
        if (cancelled) return;
        if (res.status === 404) {
          setBackendMissing(true);
          setInvoices([]);
          return;
        }
        const data = await res.json().catch(() => null);
        setInvoices(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setInvoices([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const totalPaid = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.amount, 0);
  const totalOpen = invoices
    .filter((i) => i.status === "open")
    .reduce((sum, i) => sum + i.amount, 0);
  const currency = invoices[0]?.currency ?? "EUR";

  if (loading) {
    return <p className="px-6 py-10 text-sm italic text-neutral-400">Wird geladen…</p>;
  }

  if (backendMissing) {
    return (
      <div className="p-6">
        <EmptyState
          icon="🧾"
          text="Das Rechnungsmodul ist im Frontend angelegt, aber das Backend (medipact-api) stellt den Endpoint GET /invoices noch nicht bereit. Sobald er ergänzt ist, erscheinen hier automatisch alle Rechnungen."
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <SectionHeader label="Workspace" title="Rechnungen" />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KPI label="Bezahlt" value={formatAmount(totalPaid, currency)} sub={`${invoices.filter((i) => i.status === "paid").length} Rechnungen`} />
        <KPI label="Offen" value={formatAmount(totalOpen, currency)} sub={`${invoices.filter((i) => i.status === "open").length} Rechnungen`} />
        <KPI label="Gesamt" value={invoices.length} sub="Rechnungen insgesamt" />
      </div>

      {invoices.length === 0 ? (
        <EmptyState icon="🧾" text="Noch keine Rechnungen vorhanden." />
      ) : (
        <WCard className="overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-neutral-100 bg-neutral-50 text-left text-xs font-semibold uppercase tracking-wide text-neutral-400">
              <tr>
                <th className="px-4 py-3">Nr.</th>
                <th className="px-4 py-3">Fall</th>
                <th className="px-4 py-3">Empfänger</th>
                <th className="px-4 py-3">Betrag</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Bezahlt am</th>
                <th className="px-4 py-3 text-right">PDF</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/60">
                  <td className="px-4 py-3 font-medium text-neutral-700">{inv.invoice_number}</td>
                  <td className="px-4 py-3 text-neutral-600">{inv.mediation_title}</td>
                  <td className="px-4 py-3 text-neutral-500">
                    {inv.payer_name ?? inv.payer_email ?? "–"}
                  </td>
                  <td className="px-4 py-3 font-semibold text-neutral-800">
                    {formatAmount(inv.amount, inv.currency)}
                  </td>
                  <td className="px-4 py-3">
                    <InvoiceStatusBadge status={inv.status} />
                  </td>
                  <td className="px-4 py-3 text-neutral-500">{formatDate(inv.paid_at)}</td>
                  <td className="px-4 py-3 text-right">
                    {inv.pdf_url ? (
                      <a
                        href={inv.pdf_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-accent-600 hover:underline"
                      >
                        Öffnen →
                      </a>
                    ) : (
                      <span className="text-xs text-neutral-300">–</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </WCard>
      )}
    </div>
  );
}
