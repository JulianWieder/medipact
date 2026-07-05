from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Integer, String, Text

from app.database import Base


class AiPrompt(Base):
    """Im Workflow Manager editierbare KI-Prompts.

    Jeder Prompt hat einen festen `key` (siehe app/prompts.py DEFAULT_PROMPTS).
    Ist für einen Key KEIN Eintrag vorhanden, gilt der Default-Prompt aus dem
    Code. Ein Admin kann den Text pro Key überschreiben (live, ohne Redeploy)
    und über Löschen auf den Default zurücksetzen.

    Der Template-Text darf Platzhalter in geschweiften Klammern enthalten
    (z.B. {mediation_title}); fehlende/unbekannte Platzhalter werden zur
    Laufzeit unverändert stehen gelassen (siehe get_prompt), sodass ein Tippfehler
    nie einen Absturz auslöst.
    """

    __tablename__ = "ai_prompts"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, nullable=False, unique=True, index=True)
    template = Column(Text, nullable=False)
    updated_at = Column(
        DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
