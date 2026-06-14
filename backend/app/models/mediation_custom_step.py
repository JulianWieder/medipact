from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text

from app.database import Base


class MediationCustomStep(Base):
    __tablename__ = "mediation_custom_steps"

    id = Column(Integer, primary_key=True, index=True)
    mediation_id = Column(Integer, ForeignKey("mediations.id"), nullable=False, index=True)
    phase = Column(String, nullable=False)
    # Eindeutiger Key für diesen Step (z.B. "custom_abc123") – wird als `step`-Feld in Notizen verwendet
    step_key = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False, default="")
    # Reihenfolge innerhalb der Phase (nach den Standard-Steps)
    position = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
