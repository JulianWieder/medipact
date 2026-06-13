from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint

from app.database import Base


class MediationContract(Base):
    """KI-generierter Mediationsvertrag für eine Mediation."""
    __tablename__ = "mediation_contracts"

    id = Column(Integer, primary_key=True, index=True)
    mediation_id = Column(Integer, ForeignKey("mediations.id"), nullable=False, unique=True)
    generated_text = Column(Text, nullable=False, default="")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class MediationContractSignature(Base):
    """Unterschrift eines Teilnehmers unter den Mediationsvertrag."""
    __tablename__ = "mediation_contract_signatures"

    id = Column(Integer, primary_key=True, index=True)
    contract_id = Column(Integer, ForeignKey("mediation_contracts.id"), nullable=False)
    participant_id = Column(Integer, ForeignKey("mediation_participants.id"), nullable=False)
    signed_name = Column(String, nullable=False)
    signed_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    __table_args__ = (
        UniqueConstraint("contract_id", "participant_id", name="uq_signature_per_participant"),
    )
