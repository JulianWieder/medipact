from sqlalchemy import Column, ForeignKey, Integer, String

from app.database import Base


class MediationParticipant(Base):
    __tablename__ = "mediation_participants"

    id = Column(Integer, primary_key=True, index=True)
    mediation_id = Column(Integer, ForeignKey("mediations.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    role = Column(String, nullable=False)

    # Rechnungsadresse dieses Teilnehmers für DIESEN Fall (nicht global am
    # User, da eine Person theoretisch in mehreren Fällen unterschiedliche
    # Rechnungsadressen haben könnte). Wird vor dem Start der Mediation
    # abgefragt, da an diesem Punkt automatisch eine Rechnung erstellt wird
    # (siehe update_mediation in routers/mediations.py).
    billing_street = Column(String, nullable=True)
    billing_postal_code = Column(String, nullable=True)
    billing_city = Column(String, nullable=True)