from sqlalchemy import Column, Integer, String, Text

from app.database import Base


class Mediation(Base):
    __tablename__ = "mediations"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, default="Neue Mediation")
    mediation_type = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    priority = Column(Text, nullable=True)
    role = Column(String, nullable=True)
    status = Column(String, default="draft")