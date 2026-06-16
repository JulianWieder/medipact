from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, UniqueConstraint

from app.database import Base


class MediationAppointmentSlot(Base):
    """Ein vom System vorgeschlagener Terminslot für das Erstgespräch."""
    __tablename__ = "mediation_appointment_slots"

    id = Column(Integer, primary_key=True, index=True)
    mediation_id = Column(Integer, ForeignKey("mediations.id"), nullable=False)
    proposed_datetime = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    # Gesetzt, sobald der Mediator den (von allen Parteien akzeptierten) Slot
    # final bestätigt hat. Erst dann gilt der Termin als verbindlich vereinbart;
    # vorher ist er nur "reserviert".
    mediator_confirmed_at = Column(DateTime, nullable=True)


class MediationAppointmentVote(Base):
    """Abstimmung eines Teilnehmers über einen Terminslot."""
    __tablename__ = "mediation_appointment_votes"

    id = Column(Integer, primary_key=True, index=True)
    slot_id = Column(Integer, ForeignKey("mediation_appointment_slots.id"), nullable=False)
    participant_id = Column(Integer, ForeignKey("mediation_participants.id"), nullable=False)
    accepted = Column(Boolean, nullable=False)
    voted_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    __table_args__ = (
        UniqueConstraint("slot_id", "participant_id", name="uq_vote_per_slot_participant"),
    )
