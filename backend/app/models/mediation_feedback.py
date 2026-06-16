from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text

from app.database import Base


class MediationFeedback(Base):
    """Kundenerlebnis-Feedback eines Teilnehmers nach einem Mediationsschritt.

    Jede Einreichung wird als eigene Zeile gespeichert (keine Unique-Constraint
    mehr auf mediation/participant/occasion), damit der Mediator den
    Zeitverlauf wiederholter Rückmeldungen nachvollziehen kann.
    """
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
