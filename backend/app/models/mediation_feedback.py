from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint

from app.database import Base


class MediationFeedback(Base):
    """Kundenerlebnis-Feedback eines Teilnehmers nach einem Mediationsschritt."""
    __tablename__ = "mediation_feedback"

    id = Column(Integer, primary_key=True, index=True)
    mediation_id = Column(Integer, ForeignKey("mediations.id"), nullable=False)
    participant_id = Column(Integer, ForeignKey("mediation_participants.id"), nullable=False)
    # "after_videocall" | "before_contract"
    occasion = Column(String(50), nullable=False)
    # JSON-String mit allen Antworten
    answers = Column(Text, nullable=False, default="{}")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    __table_args__ = (
        UniqueConstraint("mediation_id", "participant_id", "occasion", name="uq_feedback_per_participant_occasion"),
    )
