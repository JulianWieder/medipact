from datetime import datetime, timezone

from sqlalchemy import (
    JSON,
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    UniqueConstraint,
)

from app.database import Base


class MediationBlockResponse(Base):
    """
    Fallbezogener Inhalt/Antwort zu einem einzelnen Block eines Schritts.

    Während PhaseStepDefault.blocks nur die *Vorlage* (den Seitenaufbau) eines
    Schritts beschreibt, liegt hier der tatsächliche, pro Fall entstehende Inhalt:
    die Texteingabe einer Partei, die Aufnahme/Transkript, die Antwort auf eine
    Frage, eine vom Mediator kuratierte Notiz oder eine KI-Ausgabe.

    Ein Block kann pro Fall MEHRERE Antworten haben – je Autor genau eine:
      - jede Partei (author_key = participant.id als String)
      - der Mediator (eigene participant.id)
      - die KI (author_key = "ai")
    Dadurch lassen sich am Ende die Beiträge der Parteien nebeneinander
    auswerten (wo liegen die Reibungspunkte, wo ist eine Einigung möglich).

    Der Bezug zum Block läuft über (mediation_id, phase, step_key, block_id),
    wobei block_id der stabilen "id" eines Blocks in PhaseStepDefault.blocks
    entspricht.
    """

    __tablename__ = "mediation_block_responses"
    __table_args__ = (
        UniqueConstraint(
            "mediation_id", "step_key", "block_id", "author_key",
            name="uq_block_response_author",
        ),
    )

    id = Column(Integer, primary_key=True, index=True)
    mediation_id = Column(
        Integer, ForeignKey("mediations.id"), nullable=False, index=True
    )
    phase = Column(String, nullable=False, index=True)
    step_key = Column(String, nullable=False, index=True)
    # Stabile id des Blocks aus PhaseStepDefault.blocks[].id.
    block_id = Column(String, nullable=False, index=True)
    # Blocktyp (redundant gespeichert, damit Auswertungen ohne Join auf die
    # Vorlage möglich sind, z.B. "alle texteingabe-Antworten des Falls").
    block_type = Column(String, nullable=True)

    # Wer hat den Inhalt erzeugt:
    #   author_key      -> "ai" | participant.id (als String)
    #   author_source   -> "user" | "mediator" | "ai"
    #   author_participant_id -> FK, NULL bei KI
    author_key = Column(String, nullable=False)
    author_source = Column(String, nullable=False, default="user")
    author_participant_id = Column(
        Integer, ForeignKey("mediation_participants.id"), nullable=True
    )

    # Der eigentliche Inhalt – bewusst als JSON, damit jeder Blocktyp seine
    # eigene Form ablegen kann (Text, Auswahl, {url, transcript}, KI-Objekt …).
    value = Column(JSON, nullable=True)
    # Ob der Autor den Beitrag für diesen Block abgeschlossen/eingereicht hat.
    submitted = Column(Boolean, nullable=False, default=False)

    created_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
