from datetime import datetime

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String

from app.database import Base


class Invoice(Base):
    """Rechnung für eine Mediation – manuell vom Mediator erstellt oder später
    über die /pay/paypal-Endpoints (mediations.py) mit einer Order verknüpft."""

    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    invoice_number = Column(String, unique=True, nullable=False, index=True)
    mediation_id = Column(Integer, ForeignKey("mediations.id"), nullable=False)
    payer_name = Column(String, nullable=True)
    payer_email = Column(String, nullable=True)
    amount = Column(Float, nullable=False)
    currency = Column(String, nullable=False, default="EUR")
    status = Column(String, nullable=False, default="open")  # paid | open | refunded | failed
    paypal_order_id = Column(String, nullable=True)
    issued_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    paid_at = Column(DateTime, nullable=True)
    pdf_url = Column(String, nullable=True)
