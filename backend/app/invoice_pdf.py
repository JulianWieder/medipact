"""
PDF-Erzeugung für Rechnungen.

Rechnungen gehen nie automatisch per E-Mail raus (siehe routers/invoices.py:
send_invoice_email) - sie stehen zunächst nur als PDF zum Ansehen/Ausdrucken
bereit (GET /invoices/{id}/pdf). Diese Funktion baut das PDF live aus dem
Invoice-Datensatz, es wird nirgends auf Platte gespeichert.
"""
import io
from datetime import datetime

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas

from app.models.invoice import Invoice
from app.models.mediation import Mediation

# ── Anbieter-Angaben (siehe app/impressum/page.tsx) ─────────────────────────
PROVIDER_NAME = "medipact"
PROVIDER_CONTACT = "Julian Wieder"
PROVIDER_STREET = "Ernst-Ludwig-Allee 14"
PROVIDER_CITY = "63303 Dreieich"
PROVIDER_COUNTRY = "Deutschland"
PROVIDER_EMAIL = "hallo@medipact.de"

TYPE_LABELS = {
    "trennung": "Trennung & Scheidung",
    "erbschaft": "Erbschaftsstreit",
    "nachbarschaft": "Nachbarschaftskonflikt",
}

INVOICE_STATUS_LABELS = {
    "paid": "Bezahlt",
    "open": "Offen",
    "refunded": "Erstattet",
    "failed": "Fehlgeschlagen",
}


def _fmt_amount(value: float) -> str:
    return f"{value:,.2f} €".replace(",", "X").replace(".", ",").replace("X", ".")


def _fmt_date(value: datetime | None) -> str:
    if not value:
        return "–"
    return value.strftime("%d.%m.%Y")


def generate_invoice_pdf(invoice: Invoice, mediation: Mediation | None) -> bytes:
    """Baut eine einseitige Rechnung als PDF und gibt die Bytes zurück."""
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=A4)
    width, height = A4

    left = 22 * mm
    right = width - 22 * mm
    y = height - 25 * mm

    # ── Kopfzeile ──────────────────────────────────────────────────────────
    c.setFont("Helvetica-Bold", 20)
    c.setFillColor(colors.HexColor("#059669"))
    c.drawString(left, y, PROVIDER_NAME)
    c.setFillColor(colors.black)

    c.setFont("Helvetica", 9)
    c.drawRightString(right, y, "RECHNUNG")
    y -= 5 * mm
    c.setFont("Helvetica-Bold", 13)
    c.drawRightString(right, y, invoice.invoice_number)

    y -= 14 * mm

    # ── Anbieter / Empfänger nebeneinander ──────────────────────────────────
    block_top = y
    c.setFont("Helvetica-Bold", 9)
    c.drawString(left, y, "Anbieter")
    c.setFont("Helvetica", 9)
    provider_lines = [
        PROVIDER_NAME,
        PROVIDER_CONTACT,
        PROVIDER_STREET,
        PROVIDER_CITY,
        PROVIDER_COUNTRY,
        PROVIDER_EMAIL,
    ]
    yy = y - 5 * mm
    for line in provider_lines:
        c.drawString(left, yy, line)
        yy -= 4.5 * mm

    c.setFont("Helvetica-Bold", 9)
    c.drawString(width / 2 + 5 * mm, block_top, "Rechnungsempfänger")
    c.setFont("Helvetica", 9)
    recipient_lines = [invoice.payer_name or "–"]
    if invoice.billing_street:
        recipient_lines.append(invoice.billing_street)
    if invoice.billing_postal_code or invoice.billing_city:
        recipient_lines.append(
            f"{invoice.billing_postal_code or ''} {invoice.billing_city or ''}".strip()
        )
    if not invoice.billing_street and not invoice.billing_postal_code and not invoice.billing_city:
        recipient_lines.append("(keine Anschrift hinterlegt)")
    if invoice.payer_email:
        recipient_lines.append(invoice.payer_email)
    yy = block_top - 5 * mm
    for line in recipient_lines:
        c.drawString(width / 2 + 5 * mm, yy, line)
        yy -= 4.5 * mm

    y = block_top - 40 * mm

    # ── Meta-Zeile: Datum, Fall, Leistungszeitraum ──────────────────────────
    c.setFont("Helvetica", 9)
    mediation_type_label = TYPE_LABELS.get(
        (mediation.mediation_type if mediation else None) or "", ""
    )
    meta_rows = [
        ("Rechnungsdatum", _fmt_date(invoice.issued_at)),
        ("Fall", (mediation.title if mediation else "") or f"Mediation #{invoice.mediation_id}"),
        ("Mediationsart", mediation_type_label or "–"),
        ("Status", INVOICE_STATUS_LABELS.get(invoice.status, invoice.status)),
    ]
    for label, value in meta_rows:
        c.setFont("Helvetica-Bold", 9)
        c.drawString(left, y, f"{label}:")
        c.setFont("Helvetica", 9)
        c.drawString(left + 35 * mm, y, str(value))
        y -= 5.5 * mm

    y -= 8 * mm

    # ── Positions-Tabelle ────────────────────────────────────────────────────
    table_top = y
    col_desc = left
    col_net = left + 90 * mm
    col_tax = left + 120 * mm
    col_gross = right

    c.setFillColor(colors.HexColor("#f1f5f9"))
    c.rect(left, table_top - 6 * mm, right - left, 8 * mm, fill=True, stroke=False)
    c.setFillColor(colors.black)
    c.setFont("Helvetica-Bold", 8.5)
    c.drawString(col_desc + 2 * mm, table_top - 3.5 * mm, "Leistung")
    c.drawRightString(col_net + 18 * mm, table_top - 3.5 * mm, "Netto")
    c.drawRightString(col_tax + 15 * mm, table_top - 3.5 * mm, "USt.")
    c.drawRightString(col_gross, table_top - 3.5 * mm, "Brutto")

    row_y = table_top - 6 * mm - 8 * mm
    c.setFont("Helvetica", 9)
    description = f"Mediation – {mediation_type_label}" if mediation_type_label else "Mediation"
    c.drawString(col_desc + 2 * mm, row_y, description)
    c.drawRightString(col_net + 18 * mm, row_y, _fmt_amount(invoice.amount))
    tax_amount = round(invoice.amount * invoice.tax_rate / 100, 2)
    gross_amount = round(invoice.amount + tax_amount, 2)
    tax_label = f"{invoice.tax_rate:.0f}%" if invoice.tax_rate == int(invoice.tax_rate) else f"{invoice.tax_rate}%"
    c.drawRightString(col_tax + 15 * mm, row_y, tax_label)
    c.drawRightString(col_gross, row_y, _fmt_amount(gross_amount))

    row_y -= 8 * mm
    c.setStrokeColor(colors.HexColor("#e2e8f0"))
    c.line(left, row_y, right, row_y)

    row_y -= 8 * mm
    c.setFont("Helvetica-Bold", 11)
    c.drawRightString(col_tax + 15 * mm, row_y, "Gesamt:")
    c.drawRightString(col_gross, row_y, _fmt_amount(gross_amount))

    y = row_y - 16 * mm

    # ── Hinweise ─────────────────────────────────────────────────────────────
    c.setFont("Helvetica", 8.5)
    c.setFillColor(colors.HexColor("#475569"))
    if invoice.tax_rate == 0:
        c.drawString(
            left, y,
            "Gemäß § 19 UStG wird keine Umsatzsteuer berechnet (Kleinunternehmerregelung).",
        )
        y -= 5 * mm
    if invoice.status == "paid":
        paid_note = f"Bereits bezahlt am {_fmt_date(invoice.paid_at)}."
        if invoice.paypal_order_id:
            paid_note += f" (PayPal-Order: {invoice.paypal_order_id})"
        c.drawString(left, y, paid_note)
    else:
        c.drawString(left, y, "Bitte überweisen Sie den Betrag innerhalb von 14 Tagen nach Erhalt dieser Rechnung.")

    c.setFillColor(colors.black)

    # ── Footer ────────────────────────────────────────────────────────────────
    c.setFont("Helvetica", 7.5)
    c.setFillColor(colors.HexColor("#94a3b8"))
    footer = f"{PROVIDER_NAME} · {PROVIDER_CONTACT} · {PROVIDER_STREET} · {PROVIDER_CITY} · {PROVIDER_EMAIL}"
    c.drawCentredString(width / 2, 15 * mm, footer)

    c.showPage()
    c.save()
    return buf.getvalue()
