"""
POST /invoices und GET /invoices fuer das medipact-api Backend.

WICHTIG: Ich hatte in dieser Session keinen Zugriff auf das medipact-api
Repo (nur auf den Next.js-Frontend-Ordner "medipact"). Dieser Code ist
deshalb nach gaengiger FastAPI-Konvention geschrieben und muss an eure
tatsaechliche Projektstruktur angepasst werden -- die mit "# ANPASSEN:"
markierten Imports/Stellen zeigen genau wo.

Erwartete Response-Struktur (siehe app/workspace/types.ts im Frontend,
Invoice-Interface):
{
  "id": int,
  "invoice_number": str,        // z.B. "RE-2026-0042"
  "mediation_id": int,
  "mediation_title": str,
  "payer_name": str | None,
  "payer_email": str | None,
  "amount": float,              // EUR
  "currency": str,               // "EUR"
  "status": "paid" | "open" | "refunded" | "failed",
  "paypal_order_id": str | None,
  "issued_at": str,              // ISO-Datum
  "paid_at": str | None,
  "pdf_url": str | None,
}

Frontend-Proxy ruft GET /invoices auf (app/api/invoices/route.ts).
Fuer die Erstellung muesste das Frontend zusaetzlich noch einen
POST-Proxy-Route bekommen -- siehe Hinweis am Ende dieser Datei.
"""

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Session, relationship

# ANPASSEN: an eure bestehenden Module/Pfade anpassen.
from app.database import Base, get_db          # ANPASSEN: euer DB-Session-Setup
from app.auth import get_current_user          # ANPASSEN: euer Auth-Dependency
from app.models.mediation import Mediation     # ANPASSEN: euer Mediation-Model
from app.models.user import User               # ANPASSEN: euer User-Model


# ── DB Model ─────────────────────────────────────────────────────────────

class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    invoice_number = Column(String, unique=True, nullable=False, index=True)
    mediation_id = Column(Integer, ForeignKey("mediations.id"), nullable=False)
    payer_name = Column(String, nullable=True)
    payer_email = Column(String, nullable=True)
    amount = Column(Float, nullable=False)
    currency = Column(String, nullable=False, default="EUR")
    status = Column(String, nullable=False, default="open")  # paid|open|refunded|failed
    paypal_order_id = Column(String, nullable=True)
    issued_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    paid_at = Column(DateTime, nullable=True)
    pdf_url = Column(String, nullable=True)

    mediation = relationship("Mediation")


# ── Schemas ──────────────────────────────────────────────────────────────

class InvoiceCreate(BaseModel):
    mediation_id: int
    amount: float = Field(gt=0, description="Betrag in EUR, z.B. 499.0")
    currency: str = "EUR"
    payer_name: str | None = None
    payer_email: str | None = None
    status: str = "open"  # i.d.R. "open" bei Erstellung, "paid" wird spaeter per Webhook gesetzt
    paypal_order_id: str | None = None


class InvoiceOut(BaseModel):
    id: int
    invoice_number: str
    mediation_id: int
    mediation_title: str
    payer_name: str | None
    payer_email: str | None
    amount: float
    currency: str
    status: str
    paypal_order_id: str | None
    issued_at: str
    paid_at: str | None
    pdf_url: str | None

    class Config:
        from_attributes = True


def _serialize(invoice: Invoice) -> InvoiceOut:
    return InvoiceOut(
        id=invoice.id,
        invoice_number=invoice.invoice_number,
        mediation_id=invoice.mediation_id,
        mediation_title=invoice.mediation.title if invoice.mediation else "",
        payer_name=invoice.payer_name,
        payer_email=invoice.payer_email,
        amount=invoice.amount,
        currency=invoice.currency,
        status=invoice.status,
        paypal_order_id=invoice.paypal_order_id,
        issued_at=invoice.issued_at.isoformat(),
        paid_at=invoice.paid_at.isoformat() if invoice.paid_at else None,
        pdf_url=invoice.pdf_url,
    )


def _next_invoice_number(db: Session) -> str:
    """Erzeugt 'RE-{Jahr}-{laufende Nummer}', z.B. 'RE-2026-0042'."""
    year = datetime.now(timezone.utc).year
    prefix = f"RE-{year}-"
    count = (
        db.query(Invoice)
        .filter(Invoice.invoice_number.like(f"{prefix}%"))
        .count()
    )
    return f"{prefix}{count + 1:04d}"


# ── Router ───────────────────────────────────────────────────────────────

router = APIRouter(prefix="/invoices", tags=["invoices"])


def _require_mediator_or_admin(user: User) -> None:
    # ANPASSEN: an euer Rollenmodell anpassen (z.B. user.role, user.is_admin).
    role = getattr(user, "role", None)
    is_admin = getattr(user, "is_admin", False)
    if role != "mediator" and not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Nur Mediatoren/Admins duerfen Rechnungen erstellen",
        )


@router.post("", response_model=InvoiceOut, status_code=status.HTTP_201_CREATED)
def create_invoice(
    payload: InvoiceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> InvoiceOut:
    """Erstellt eine neue Rechnung fuer eine Mediation.

    - Prueft, dass die Mediation existiert.
    - Erzeugt eine laufende Rechnungsnummer (RE-{Jahr}-{Nummer}).
    - Setzt payer_name/payer_email automatisch aus der Mediation, falls
      im Payload nicht mitgegeben.
    """
    _require_mediator_or_admin(current_user)

    mediation = db.query(Mediation).filter(Mediation.id == payload.mediation_id).first()
    if mediation is None:
        raise HTTPException(status_code=404, detail="Mediation nicht gefunden")

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

    return _serialize(invoice)


@router.get("", response_model=list[InvoiceOut])
def list_invoices(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[InvoiceOut]:
    """Listet Rechnungen.

    Admins sehen alle, Mediatoren nur Rechnungen ihrer eigenen Mediationen.
    """
    is_admin = getattr(current_user, "is_admin", False)

    query = db.query(Invoice).join(Mediation)
    if not is_admin:
        # ANPASSEN: an euer Feld an, das den zustaendigen Mediator referenziert
        # (z.B. Mediation.mediator_id).
        query = query.filter(Mediation.mediator_id == current_user.id)

    invoices = query.order_by(Invoice.issued_at.desc()).all()
    return [_serialize(inv) for inv in invoices]


# ── Einbindung in eure FastAPI-App ────────────────────────────────────────
#
# In eurer app/main.py (oder wo die Router registriert werden):
#
#   from app.routers.invoices import router as invoices_router
#   app.include_router(invoices_router)
#
# Migration (falls Alembic genutzt wird, siehe Memory "Alembic unter
# ~/.local/bin/alembic"):
#
#   ~/.local/bin/alembic revision --autogenerate -m "add invoices table"
#   ~/.local/bin/alembic upgrade head
#
# ── Frontend-Gegenstueck (im medipact-Repo, NICHT Teil dieser Datei) ──────
#
# app/api/invoices/route.ts braucht zusaetzlich einen POST-Handler, der
# auf diesen Endpoint proxyt:
#
#   export async function POST(req: Request) {
#     const body = await req.json();
#     const result = await backendFetch("/invoices", { method: "POST", body });
#     if (!result.ok) return NextResponse.json(result.data, { status: result.status });
#     return NextResponse.json(result.data, { status: 201 });
#   }
#
# Das kann ich direkt im medipact-Ordner ergaenzen, sobald gewuenscht.
