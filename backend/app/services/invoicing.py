"""Automatische Rechnungserstellung bei vollständigem Zahlungseingang.

WANN RECHNUNGEN ENTSTEHEN
─────────────────────────
Früher wurden die Rechnungen beim START des Falls erzeugt - das ging, solange
die Zahlung dem Start zwingend vorausging. Seit die Zahlung ein Schritt INNERHALB
des Workflows ist (Blocktyp "fall_freischaltung"), startet ein Fall bereits
unbezahlt. Der Start ist damit kein sinnvoller Auslöser mehr.

Jetzt gilt: Rechnungen entstehen genau dann, wenn der Fall vollständig bezahlt
ist (mediation.is_paid wird True, siehe services/billing.py check_and_unlock).
Das ist auch sachlich richtig - vorher ist nichts geflossen, weil Beträge bis
dahin nur reserviert sind.

Die Rechnungen gehen NICHT automatisch per E-Mail raus - sie stehen zunächst
nur als PDF bereit (GET /invoices/{id}/pdf). Erst ein Mediator/Admin gibt sie
nach Prüfung explizit frei (POST /invoices/{id}/send-email).

Steuersatz bleibt bewusst 0.0 als Platzhalter (USt-ID/Kleinunternehmer-Status
noch nicht final geklärt) - vor der Freigabe im Rechnungsformular prüfen.
"""
from __future__ import annotations

import logging
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.models.invoice import Invoice
from app.models.mediation import Mediation
from app.models.user import User

logger = logging.getLogger(__name__)


def next_invoice_number(db: Session) -> str:
    """Erzeugt 'RE-{Jahr}-{laufende Nummer}', z.B. 'RE-2026-0042'."""
    year = datetime.now(timezone.utc).year
    prefix = f"RE-{year}-"
    count = db.query(Invoice).filter(Invoice.invoice_number.like(f"{prefix}%")).count()
    return f"{prefix}{count + 1:04d}"


def ensure_invoices(db: Session, mediation: Mediation) -> int:
    """Legt für jede zahlungspflichtige Partei eine eigene Rechnung an.

    Anteilige Zahlung = KEINE Sammelrechnung: jede Partei bekommt ihre eigene
    (siehe models/invoice.py). Idempotent - existiert für (Fall, Partei) bereits
    eine Rechnung, wird keine zweite erzeugt. Gibt die Anzahl neu erzeugter
    Rechnungen zurück.
    """
    # Import hier, um einen Zirkelbezug billing <-> invoicing zu vermeiden.
    from app.services import billing

    created = 0
    for participant in billing.owing_participants(db, mediation):
        existing = (
            db.query(Invoice)
            .filter(
                Invoice.mediation_id == mediation.id,
                Invoice.participant_id == participant.id,
            )
            .first()
        )
        if existing:
            continue

        payer = db.query(User).filter(User.id == participant.user_id).first()
        # Rechnungsanschrift: der Teilnehmer-Datensatz hat Vorrang (fall-
        # spezifische Abweichung), sonst greift das Nutzerprofil aus dem
        # Onboarding (users.billing_*). Vor dem Onboarding-Umbau gab es nur die
        # erste Quelle — Rechnungen wären jetzt ohne Adresse entstanden, weil
        # die Fall-Seite sie gar nicht mehr abfragt.
        # Adresse wird als GANZES übernommen, nicht feldweise gemischt: eine
        # Straße aus dem Fall mit einer Stadt aus dem Profil wäre eine Adresse,
        # die niemand je eingegeben hat.
        if (
            participant.billing_street
            and participant.billing_postal_code
            and participant.billing_city
        ):
            street = participant.billing_street
            postal_code = participant.billing_postal_code
            city = participant.billing_city
        else:
            street = payer.billing_street if payer else None
            postal_code = payer.billing_postal_code if payer else None
            city = payer.billing_city if payer else None

        invoice = Invoice(
            invoice_number=next_invoice_number(db),
            mediation_id=mediation.id,
            participant_id=participant.id,
            payer_name=(payer.name if payer else None),
            payer_email=(payer.email if payer else None),
            billing_street=street,
            billing_postal_code=postal_code,
            billing_city=city,
            amount=billing.participant_final_due(db, mediation, participant),
            tax_rate=0.0,
            currency="EUR",
            status="paid",
            issued_at=datetime.now(timezone.utc),
            paid_at=datetime.now(timezone.utc),
        )
        db.add(invoice)
        db.commit()
        created += 1

    if created:
        logger.info("Fall %s: %s Rechnung(en) erzeugt", mediation.id, created)
    return created
