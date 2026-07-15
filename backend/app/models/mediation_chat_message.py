from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Integer, Text

from app.database import Base


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class MediationChatMessage(Base):
    """Freier Gruppenchat eines Falls (alle Parteien + Mediator).

    Bewusst UNABHÄNGIG von Phasen/Schritten: Die Teilnehmer sollen sich hier
    auch über Themen austauschen können, die außerhalb des vorgegebenen
    Workflows liegen. Der Mediator ist immer Teil des Chats und sieht alles.
    """

    __tablename__ = "mediation_chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    mediation_id = Column(
        Integer, ForeignKey("mediations.id"), nullable=False, index=True
    )
    # Autor als User (nicht Participant), damit auch globale Mediatoren/Admins
    # ohne Teilnehmer-Eintrag schreiben können (vgl. get_all_phase_notes).
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    body = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False, default=_utcnow)
