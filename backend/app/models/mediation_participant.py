from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String

from app.database import Base


class MediationParticipant(Base):
    __tablename__ = "mediation_participants"

    id = Column(Integer, primary_key=True, index=True)
    mediation_id = Column(Integer, ForeignKey("mediations.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    role = Column(String, nullable=False)

    # ── Zahlung pro Partei ────────────────────────────────────────────────
    # Jede zahlungspflichtige Partei zahlt ihren eigenen Anteil (siehe
    # app/pricing.py). Der Fall wird erst freigeschaltet (mediation.is_paid),
    # wenn ALLE zahlungspflichtigen Parteien bezahlt haben.
    # `amount_due` ist der zu zahlende Betrag NACH Rabatt (0 => nichts zu zahlen).
    amount_due = Column(Float, nullable=True)
    paid = Column(Boolean, nullable=False, default=False, server_default="0")
    paid_at = Column(DateTime, nullable=True)
    paypal_order_id = Column(String, nullable=True)
    # Angewendeter Rabattcode (Groß-/Kleinschreibung wie eingegeben) + Rabattbetrag in EUR.
    discount_code = Column(String, nullable=True)
    discount_amount = Column(Float, nullable=False, default=0.0, server_default="0")

    # Rechnungsadresse dieses Teilnehmers für DIESEN Fall (nicht global am
    # User, da eine Person theoretisch in mehreren Fällen unterschiedliche
    # Rechnungsadressen haben könnte). Wird vor dem Start der Mediation
    # abgefragt, da an diesem Punkt automatisch eine Rechnung erstellt wird
    # (siehe update_mediation in routers/mediations.py).
    billing_street = Column(String, nullable=True)
    billing_postal_code = Column(String, nullable=True)
    billing_city = Column(String, nullable=True)