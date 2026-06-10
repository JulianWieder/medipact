from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text, UniqueConstraint

from app.database import Base


class MediationNote(Base):
    __tablename__ = "mediation_notes"

    id = Column(Integer, primary_key=True, index=True)
    mediation_id = Column(Integer, ForeignKey("mediations.id"), nullable=False)
    participant_id = Column(Integer, ForeignKey("mediation_participants.id"), nullable=False)
    phase = Column(String, nullable=False)
    # Schritt innerhalb der Phase (leer = phasenweite Notiz, wie bisher)
    step = Column(String, nullable=False, default="")
    content = Column(Text, nullable=False, default="")
    # Ob der Teilnehmer seinen Input für diesen Schritt abgeschlossen hat
    submitted = Column(Boolean, nullable=False, default=False)

    __table_args__ = (
        UniqueConstraint(
            "mediation_id", "participant_id", "phase", "step",
            name="uq_note_participant_phase_step",
        ),
    )
