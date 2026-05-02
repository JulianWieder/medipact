from sqlalchemy import Column, ForeignKey, Integer, String

from app.database import Base


class MediationParticipant(Base):
    __tablename__ = "mediation_participants"

    id = Column(Integer, primary_key=True, index=True)
    mediation_id = Column(Integer, ForeignKey("mediations.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    role = Column(String, nullable=False)