from datetime import datetime, timezone

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
)

from app.database import Base


class MediationStepContent(Base):
    """
    Pro-Fall gepflegter Inhalt für "individuelle" Schritte.

    Ein Schritt wird im Workflow Manager (PhaseStepDefault) mit der Inhaltsart
    "individuell" angelegt – er existiert damit für jeden Fall des Typs/der
    Variante, aber sein tatsächlicher Inhalt (eigenes Video, Meeting-Link,
    Anleitungstext, Frage, Feedback-Anlass) wird vom Mediator individuell im
    jeweiligen Fall gepflegt. Genau dieser fallbezogene Inhalt liegt hier.

    Der Bezug zum Schritt läuft über (mediation_id, phase, step_key). step_key
    entspricht dem PhaseStepDefault.step_key (oder einem MediationCustomStep).
    Fehlt ein Eintrag, hat der Mediator für diesen Fall noch nichts hinterlegt.
    """

    __tablename__ = "mediation_step_contents"
    __table_args__ = (
        UniqueConstraint(
            "mediation_id", "phase", "step_key",
            name="uq_mediation_step_content",
        ),
    )

    id = Column(Integer, primary_key=True, index=True)
    mediation_id = Column(
        Integer, ForeignKey("mediations.id"), nullable=False, index=True
    )
    phase = Column(String, nullable=False, index=True)
    step_key = Column(String, nullable=False)

    # Fallbezogener Inhalt – alle Felder optional, je nach Inhaltsart des
    # zugrundeliegenden Schritts.
    body_text = Column(Text, nullable=True)          # Anleitungs-/Freitext
    video_url = Column(String, nullable=True)        # eigenes Video für diesen Fall
    meeting_url = Column(String, nullable=True)      # Meeting-/Call-Link
    question = Column(Text, nullable=True)           # individuelle Frage
    feedback_occasion = Column(String, nullable=True)  # after_videocall | before_contract

    # Nur relevant für Ergebnis-Anzeige-Schritte (content_type "ergebnis"):
    # Solange False, sehen Teilnehmer den Inhalt NICHT (Mediator-Freigabe nötig).
    # body_text hält bei diesen Schritten den freigegebenen Ergebnistext
    # (kuratierte KI-Zusammenfassung + ausgewählte Eingaben anderer Teilnehmer).
    released = Column(Boolean, nullable=False, default=False)

    created_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
