from datetime import datetime

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String

from app.database import Base


class Invoice(Base):
    """Rechnung für eine Mediation – manuell vom Mediator erstellt oder später
    über die /pay/paypal-Endpoints (mediations.py) mit einer Order verknüpft.

    Jede Rechnung gehört zu genau einem Teilnehmer (participant_id) UND dem
    Fall (mediation_id) – bei anteiliger Zahlung bekommt jede Partei eines
    Falls ihre eigene Rechnung, keine gemeinsame Sammel-Rechnung pro Fall.
    """

    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    invoice_number = Column(String, unique=True, nullable=False, index=True)
    mediation_id = Column(Integer, ForeignKey("mediations.id"), nullable=False, index=True)
    participant_id = Column(
        Integer, ForeignKey("mediation_participants.id"), nullable=False, index=True
    )
    payer_name = Column(String, nullable=True)
    payer_email = Column(String, nullable=True)
    amount = Column(Float, nullable=False)  # Nettobetrag in EUR
    # Steuersatz in Prozent, frei editierbar (z.B. 19.0 / 7.0 / 0.0 bei
    # Kleinunternehmerregelung nach §19 UStG) – bewusst kein festes Enum.
    tax_rate = Column(Float, nullable=False, default=19.0)
    currency = Column(String, nullable=False, default="EUR")
    status = Column(String, nullable=False, default="open")  # paid | open | refunded | failed
    paypal_order_id = Column(String, nullable=True)
    issued_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    paid_at = Column(DateTime, nullable=True)
    pdf_url = Column(String, nullable=True)
