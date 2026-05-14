from sqlalchemy import Column, ForeignKey, Integer, String, Text, UniqueConstraint

from app.database import Base


class MediationNote(Base):
    __tablename__ = "mediation_notes"

    id = Column(Integer, primary_key=True, index=True)
    mediation_id = Column(Integer, ForeignKey("mediations.id"), nullable=False)
    participant_id = Column(Integer, ForeignKey("mediation_participants.id"), nullable=False)
    phase = Column(String, nullable=False)
    content = Column(Text, nullable=False, default="")

    __table_args__ = (
        # Pro Teilnehmer und Phase nur eine Notiz (upsert-Logik)
        UniqueConstraint("mediation_id", "participant_id", "phase", name="uq_note_participant_phase"),
    )
