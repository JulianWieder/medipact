from datetime import datetime, timezone

from sqlalchemy import (
    JSON,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    UniqueConstraint,
)

from app.database import Base


class UserOnboardingResponse(Base):
    """
    Antwort einer Person auf einen einzelnen Block des Nutzer-Onboardings.

    Gegenstueck zu MediationBlockResponse, aber eine Ebene hoeher: das
    Onboarding gehoert der PERSON, nicht einem Fall. Entsprechend fehlen hier
    mediation_id und author_key — pro (user, step_key, block_id) gibt es genau
    eine Antwort, und der Autor ist immer der Nutzer selbst.

    Die Vorlage (welche Schritte, welche Bloecke) liegt wie bei den Fall-
    Schritten in phase_step_defaults, dort unter dem Pseudo-Mediationstyp
    USER_ONBOARDING_TYPE ("@user") und der Phase USER_ONBOARDING_PHASE
    ("onboarding"). Dadurch ist das Onboarding im vorhandenen Workflow Manager
    pflegbar, ohne einen zweiten Designer zu bauen.

    Warum JSON als Wert: identisch zu den Fall-Antworten. Jeder Blocktyp bringt
    seine eigene Wertform mit (String, Liste, {"agreed": true}, {"street": …}),
    und neue Blocktypen sollen keine Migration ausloesen.
    """

    __tablename__ = "user_onboarding_responses"
    __table_args__ = (
        UniqueConstraint(
            "user_id", "step_key", "block_id",
            name="uq_user_onboarding_response",
        ),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    step_key = Column(String, nullable=False, index=True)
    # Stabile id des Blocks aus PhaseStepDefault.blocks[].id.
    block_id = Column(String, nullable=False, index=True)
    # Blocktyp redundant mitgespeichert, damit Auswertungen ("alle
    # zustimmung-Antworten") ohne Join auf die Vorlage moeglich sind — und
    # damit eine Antwort lesbar bleibt, wenn der Block spaeter aus der Vorlage
    # geloescht wird.
    block_type = Column(String, nullable=True)
    value = Column(JSON, nullable=True)

    created_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
