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
    participant_id: int = Field(description="mediation_participants.id – wer diese Rechnung bekommt")
    amount: float = Field(gt=0, description="Nettobetrag in EUR, z.B. 249.0")
    tax_rate: float = Field(default=19.0, ge=0, le=100, description="Steuersatz in %, frei editierbar (z.B. 19, 7, 0)")
    currency: str = "EUR"
    payer_name: str | None = None
    payer_email: str | None = None
    status: str = "open"  # i.d.R. "open" bei Erstellung, "paid" wird über die PayPal-Capture gesetzt
    paypal_order_id: str | None = None


class InvoiceUpdate(BaseModel):
    """Alle Felder optional – nur übergebene Werte werden geändert.
    Für das manuelle Nachbearbeiten von Rechnungen (z.B. Steuersatz korrigieren)."""

    participant_id: int | None = None
    amount: float | None = Field(default=None, gt=0)
    tax_rate: float | None = Field(default=None, ge=0, le=100)
    currency: str | None = None
    payer_name: str | None = None
    payer_email: str | None = None
    status: str | None = None
    paypal_order_id: str | None = None
    pdf_url: str | None = None


def _next_invoice_number(db: Session) -> str:
    """Erzeugt 'RE-{Jahr}-{laufende Nummer}', z.B. 'RE-2026-0042'."""
    year = datetime.now(timezone.utc).year
    prefix = f"RE-{year}-"
    count = db.query(Invoice).filter(Invoice.invoice_number.like(f"{prefix}%")).count()
    return f"{prefix}{count + 1:04d}"


def _get_participant_or_404(db: Session, mediation_id: int, participant_id: int) -> MediationParticipant:
    participant = (
        db.query(MediationParticipant)
        .filter(
            MediationParticipant.id == participant_id,
            MediationParticipant.mediation_id == mediation_id,
        )
        .first()
    )
    if not participant:
        raise HTTPException(
            status_code=404,
            detail="Teilnehmer gehört nicht zu dieser Mediation",
        )
    return participant


def _serialize(
    invoice: Invoice,
    mediation: Mediation | None,
    participant_user: User | None = None,
) -> dict:
    tax_amount = round(invoice.amount * invoice.tax_rate / 100, 2)
    gross_amount = round(invoice.amount + tax_amount, 2)
    return {
        "id": invoice.id,
        "invoice_number": invoice.invoice_number,
        "mediation_id": invoice.mediation_id,
        "mediation_title": mediation.title if mediation else "",
        "participant_id": invoice.participant_id,
        "participant_name": participant_user.name if participant_user else None,
        "participant_email": participant_user.email if participant_user else None,
        "payer_name": invoice.payer_name,
        "payer_email": invoice.payer_email,
        "amount": invoice.amount,
        "tax_rate": invoice.tax_rate,
        "tax_amount": tax_amount,
        "gross_amount": gross_amount,
        "currency": invoice.currency,
        "status": invoice.status,
        "paypal_order_id": invoice.paypal_order_id,
        "issued_at": invoice.issued_at.isoformat(),
        "paid_at": invoice.paid_at.isoformat() if invoice.paid_at else None,
        "pdf_url": invoice.pdf_url,
    }


def _load_participant_user(db: Session, participant_id: int) -> User | None:
    row = (
        db.query(User)
        .join(MediationParticipant, MediationParticipant.user_id == User.id)
        .filter(MediationParticipant.id == participant_id)
        .first()
    )
    return row


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

    own_participation = (
        db.query(MediationParticipant)
        .filter(
            MediationParticipant.mediation_id == payload.mediation_id,
            MediationParticipant.user_id == current_user.id,
        )
        .first()
    )
    is_mediator = current_user.role in ("mediator", "admin") or (
        own_participation is not None and own_participation.role in ("mediator", "admin")
    )
    if not is_mediator:
        raise HTTPException(status_code=403, detail="Nur Mediatoren dürfen Rechnungen erstellen")

    # Rechnung muss zu einem Teilnehmer DIESES Falls gehören – anteilige
    # Zahlung heißt: jede Partei bekommt ihre eigene Rechnung.
    billed_participant = _get_participant_or_404(db, payload.mediation_id, payload.participant_id)

    invoice = Invoice(
        invoice_number=_next_invoice_number(db),
        mediation_id=payload.mediation_id,
        participant_id=payload.participant_id,
        payer_name=payload.payer_name,
        payer_email=payload.payer_email,
        amount=payload.amount,
        tax_rate=payload.tax_rate,
        currency=payload.currency,
        status=payload.status,
        paypal_order_id=payload.paypal_order_id,
        issued_at=datetime.now(timezone.utc),
        paid_at=datetime.now(timezone.utc) if payload.status == "paid" else None,
    )
    db.add(invoice)
    db.commit()
    db.refresh(invoice)

    participant_user = db.query(User).filter(User.id == billed_participant.user_id).first()
    return _serialize(invoice, mediation, participant_user)


@router.patch("/{invoice_id}")
def update_invoice(
    invoice_id: int,
    payload: InvoiceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """Bearbeitet eine bestehende Rechnung manuell (z.B. Steuersatz oder Betrag
    korrigieren). Nur Mediatoren/Admins des jeweiligen Falls."""
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Rechnung nicht gefunden")

    mediation = db.query(Mediation).filter(Mediation.id == invoice.mediation_id).first()

    own_participation = (
        db.query(MediationParticipant)
        .filter(
            MediationParticipant.mediation_id == invoice.mediation_id,
            MediationParticipant.user_id == current_user.id,
        )
        .first()
    )
    is_mediator = current_user.role in ("mediator", "admin") or (
        own_participation is not None and own_participation.role in ("mediator", "admin")
    )
    if not is_mediator:
        raise HTTPException(status_code=403, detail="Nur Mediatoren dürfen Rechnungen bearbeiten")

    updates = payload.model_dump(exclude_unset=True)

    if "participant_id" in updates:
        _get_participant_or_404(db, invoice.mediation_id, updates["participant_id"])

    for field, value in updates.items():
        setattr(invoice, field, value)

    if updates.get("status") == "paid" and invoice.paid_at is None:
        invoice.paid_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(invoice)

    participant_user = _load_participant_user(db, invoice.participant_id)
    return _serialize(invoice, mediation, participant_user)


@router.get("")
def list_invoices(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user),
):
    """Listet Rechnungen.

    Mediatoren/Admins sehen alle Rechnungen aller Fälle. Parteien sehen NUR
    ihre eigenen Rechnungen (participant_id = eigene Teilnahme) – nicht die
    einer anderen Partei im selben Fall, da Rechnungen jetzt pro Teilnehmer
    statt pro Fall ausgestellt werden und Betrag/Steuersatz je Partei
    unterschiedlich sein können.
    """
    if current_user.role in ("mediator", "admin"):
        rows = (
            db.query(Invoice, Mediation, MediationParticipant, User)
            .join(Mediation, Invoice.mediation_id == Mediation.id)
            .outerjoin(MediationParticipant, Invoice.participant_id == MediationParticipant.id)
            .outerjoin(User, MediationParticipant.user_id == User.id)
            .order_by(Invoice.issued_at.desc())
            .all()
        )
    else:
        own_participant_ids = [
            p.id
            for p in db.query(MediationParticipant)
            .filter(MediationParticipant.user_id == current_user.id)
            .all()
        ]
        if not own_participant_ids:
            return []
        rows = (
            db.query(Invoice, Mediation, MediationParticipant, User)
            .join(Mediation, Invoice.mediation_id == Mediation.id)
            .outerjoin(MediationParticipant, Invoice.participant_id == MediationParticipant.id)
            .outerjoin(User, MediationParticipant.user_id == User.id)
            .filter(Invoice.participant_id.in_(own_participant_ids))
            .order_by(Invoice.issued_at.desc())
            .all()
        )

    return [
        _serialize(invoice, mediation, participant_user)
        for invoice, mediation, _participant, participant_user in rows
    ]
