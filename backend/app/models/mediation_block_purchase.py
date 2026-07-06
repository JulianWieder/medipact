from datetime import datetime, timezone

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    UniqueConstraint,
)

from app.database import Base


class MediationBlockPurchase(Base):
    """
    Kauf einer kostenpflichtigen Bonus-Leistung (Block-Typ "bezahlung"), z.B.
    ein Gutachten. Pro Fall, Partei und Block genau ein Eintrag. Der Preis wird
    NICHT hier festgelegt, sondern serverseitig aus der Block-Konfiguration
    (PhaseStepDefault.blocks[].config.price) gelesen – dieser Eintrag hält nur,
    ob und zu welchem Betrag gekauft wurde. Solange paid=False, bleibt der
    freigeschaltete Inhalt des Blocks verborgen.
    """

    __tablename__ = "mediation_block_purchases"
    __table_args__ = (
        UniqueConstraint(
            "mediation_id", "participant_id", "block_id",
            name="uq_block_purchase_party",
        ),
    )

    id = Column(Integer, primary_key=True, index=True)
    mediation_id = Column(Integer, ForeignKey("mediations.id"), nullable=False, index=True)
    participant_id = Column(
        Integer, ForeignKey("mediation_participants.id"), nullable=False, index=True
    )
    step_key = Column(String, nullable=False)
    block_id = Column(String, nullable=False, index=True)
    title = Column(String, nullable=True)
    amount = Column(Float, nullable=False, default=0.0)
    currency = Column(String, nullable=False, default="EUR")
    paid = Column(Boolean, nullable=False, default=False)
    paypal_order_id = Column(String, nullable=True)
    paid_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
