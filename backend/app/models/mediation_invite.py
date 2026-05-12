from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String

from app.database import Base


class MediationInvite(Base):
    __tablename__ = "mediation_invites"

    id = Column(Integer, primary_key=True, index=True)

    mediation_id = Column(
        Integer,
        ForeignKey("mediations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    token_hash = Column(String, nullable=False, unique=True, index=True)

    role = Column(String, nullable=False, default="other_party")
    status = Column(String, nullable=False, default="pending")

    invited_email = Column(String, nullable=True)

    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    accepted_at = Column(DateTime, nullable=True)