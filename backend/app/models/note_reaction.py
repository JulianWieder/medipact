from sqlalchemy import Column, ForeignKey, Integer, String, UniqueConstraint

from app.database import Base


class NoteReaction(Base):
    __tablename__ = "note_reactions"

    id = Column(Integer, primary_key=True, index=True)
    mediation_id = Column(Integer, ForeignKey("mediations.id"), nullable=False)
    phase = Column(String, nullable=False)
    step = Column(String, nullable=False, default="")

    # Wer reagiert
    from_participant_id = Column(
        Integer, ForeignKey("mediation_participants.id"), nullable=False
    )
    # Auf wessen Punkt wird reagiert
    target_participant_id = Column(
        Integer, ForeignKey("mediation_participants.id"), nullable=False
    )
    # Index des Punktes in target_participant's content[]
    item_index = Column(Integer, nullable=False)

    # "accept" | "reject" | "trade"
    action = Column(String, nullable=False)

    # Bei action="trade": Index des eigenen Punktes, der angeboten wird
    trade_item_index = Column(Integer, nullable=True)

    __table_args__ = (
        UniqueConstraint(
            "mediation_id",
            "phase",
            "step",
            "from_participant_id",
            "target_participant_id",
            "item_index",
            name="uq_reaction_per_item",
        ),
    )
