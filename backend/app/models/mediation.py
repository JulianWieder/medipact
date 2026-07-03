from sqlalchemy import Boolean, Column, Integer, String, Text

from app.database import Base


class Mediation(Base):
    __tablename__ = "mediations"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, default="Neue Mediation")
    mediation_type = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    priority = Column(Text, nullable=True)
    role = Column(String, nullable=True)
    status = Column(String, default="draft")
    phase = Column(String, nullable=True)
    is_paid = Column(Boolean, nullable=False, default=False, server_default="0")
    # Zuordnung Fall -> Mediations-Variante (MediationVariant.key innerhalb
    # des mediation_type dieses Falls). NULL = Basis-Workflow ohne Variante.
    # Jederzeit änderbar; wirkt auf die Step-Auflösung in get_phase_steps
    # (Standard-Schritte + Schritte der gewählten Variante).
    variant_key = Column(String, nullable=True, index=True)
