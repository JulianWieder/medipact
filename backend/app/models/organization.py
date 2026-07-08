from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String

from app.database import Base


class Organization(Base):
    """Mandant (Kanzlei/Praxis). Ein Mandant kann mehrere Mediatoren haben;
    das Abo (Plan + Preis) hängt am Mandanten, nicht am einzelnen Mediator.
    Preislogik: siehe app/pricing.py (ABO_PRICING / organization_monthly_price).
    """

    __tablename__ = "organizations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    # Abo-Plan des Mandanten (Schlüssel aus pricing.ABO_PLANS).
    plan = Column(String, nullable=False, default="starter", server_default="starter")
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
