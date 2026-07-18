from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, UniqueConstraint

from app.database import Base


class MediationAddon(Base):
    """
    Von einer Partei beim Freischalten gewähltes Add-on (Einstiegs-Tarif
    Nachbarschaft/WG/Verbraucher: 20 € Basis + buchbare Add-ons, siehe
    app/pricing.py ADDONS).

    Die Auswahl geschieht VOR der Zahlung (PUT /mediations/{id}/addons) und
    erhöht den Anteil der wählenden Partei (services/billing.py
    participant_final_due). ``price_eur`` ist ein Schnappschuss des
    Katalogpreises zum Zeitpunkt der Auswahl, damit spätere Preisänderungen
    bereits getroffene Auswahlen nicht verändern.

    Abgrenzung zu MediationBlockPurchase: Block-Käufe sind Bonus-Leistungen
    IM laufenden Verfahren (Block-Typ "bezahlung"); Add-ons hängen am
    Freischalt-Checkout des Falls.
    """

    __tablename__ = "mediation_addons"
    __table_args__ = (
        UniqueConstraint(
            "mediation_id", "participant_id", "addon_key",
            name="uq_mediation_addon_party",
        ),
    )

    id = Column(Integer, primary_key=True, index=True)
    mediation_id = Column(Integer, ForeignKey("mediations.id"), nullable=False, index=True)
    participant_id = Column(
        Integer, ForeignKey("mediation_participants.id"), nullable=False, index=True
    )
    addon_key = Column(String, nullable=False)
    price_eur = Column(Float, nullable=False, default=0.0)
    created_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
