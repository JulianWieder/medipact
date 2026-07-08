from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime
from app.database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="party")
    # Mandanten-Zuordnung (organizations.id). NULL = keinem Mandanten zugeordnet
    # (z.B. Parteien). Relevant v.a. fuer Mediatoren: Anzahl Mediatoren je
    # Mandant bestimmt den Abo-Preis (app/pricing.py).
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=True, index=True)
    is_verified = Column(Boolean, default=False, nullable=False)
    verification_token = Column(String, nullable=True, index=True)
    password_reset_token = Column(String, nullable=True, index=True)
    password_reset_token_expires = Column(DateTime, nullable=True)
