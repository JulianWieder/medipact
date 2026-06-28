from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.invoice import Invoice
from app.models.mediation import Mediation
from app.models.mediation_participant import MediationParticipant
from app.models.user import User
from app.security import get_current_db_user

router = APIRouter(prefix="/invoices", tags=["invoices"])


class InvoiceCreate(BaseModel):
    mediation_id: int
    amount: float = Field(gt=0, description="Betrag in EUR, z.B. 499.0")
    currency: str = "EUR"
    payer_name: str | None = None
    payer_email: str | None = None
    status: str = "open"  # i.d.R. "open" bei Erstellung, "paid" wird über die PayPal-Capture gesetzt
    paypal_order_id: str | None = None


def _next_invoice_number(db: Session) -> str:
    """Erzeugt 'RE-{Jahr}-{laufende Nummer}', z.B. 'RE-2026-0042'."""
    year = datetime.now(timezone.utc).year
    prefix = f"RE-{year}-"
    count = db.query(Invoice).filter(Invoice.invoice_number.like(f"{prefix}%")).count()
    return f"{prefix}{count + 1:04d}"


def _serialize(invoice: Invoice, mediation: Mediation | None) -> dict:
    return {
        "id": invoice.id,
        "invoice_number": invoice.invoice_number,
        "mediation_id": invoice.mediation_id,
        "mediation_title": mediation.title if mediation else "",
        "payer_name": invoice.payer_name,
        "payer_email": invoice.payer_email,
        "amount": invoice.amount,
        "currency": invoice.currency,
        "status": invoice.status,
        "paypal_order_id": invoice.paypal_order_id,
        "issued_at": invoice.issued_at.isoformat(),
        "paid_at": invoice.paid_at.isoformat() if invoice.paid_at else None,
        "pdf_url": invoice.pdf_url,
    }


@router.post("")
def create_invoice(
    payload: InvoiceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """Erstellt eine Rechnung für eine Mediation.

    Nur Mediatoren/Admins dürfen Rechnungen erstellen – entweder global
    (User.role) oder als Mediator-Teilnehmer dieses konkreten Falls.
    """
    mediation = db.query(Mediation).filter(Mediation.id == payload.mediation_id).first()
    if not mediation:
        raise HTTPException(status_code=404, detail="Mediation nicht gefunden")

    participant = (
        db.query(MediationParticipant)
        .filter(
            MediationParticipant.mediation_id == payload.mediation_id,
            MediationParticipant.user_id == current_user.id,
        )
        .first()
    )
    is_mediator = current_user.role in ("mediator", "admin") or (
        participant is not None and participant.role in ("mediator", "admin")
    )
    if not is_mediator:
        raise HTTPException(status_code=403, detail="Nur Mediatoren dürfen Rechnungen erstellen")

    invoice = Invoice(
        invoice_number=_next_invoice_number(db),
        mediation_id=payload.mediation_id,
        payer_name=payload.payer_name,
        payer_email=payload.payer_email,
        amount=payload.amount,
        currency=payload.currency,
        status=payload.status,
        paypal_order_id=payload.paypal_order_id,
        issued_at=datetime.now(timezone.utc),
        paid_at=datetime.now(timezone.utc) if payload.status == "paid" else None,
    )
    db.add(invoice)
    db.commit()
    db.refresh(invoice)

    return _serialize(invoice, mediation)


@router.get("")
def list_invoices(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """Listet Rechnungen. Mediatoren/Admins sehen alle, Parteien nur die ihrer eigenen Mediationen."""
    if current_user.role in ("mediator", "admin"):
        rows = (
            db.query(Invoice, Mediation)
            .join(Mediation, Invoice.mediation_id == Mediation.id)
            .order_by(Invoice.issued_at.desc())
            .all()
        )
    else:
        mediation_ids = [
            p.mediation_id
            for p in db.query(MediationParticipant)
            .filter(MediationParticipant.user_id == current_user.id)
            .all()
        ]
        if not mediation_ids:
            return []
        rows = (
            db.query(Invoice, Mediation)
            .join(Mediation, Invoice.mediation_id == Mediation.id)
            .filter(Invoice.mediation_id.in_(mediation_ids))
            .order_by(Invoice.issued_at.desc())
            .all()
        )

    return [_serialize(invoice, mediation) for invoice, mediation in rows]
