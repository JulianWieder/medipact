from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text, UniqueConstraint

from app.database import Base


class MediationVariant(Base):
    """
    Frei anlegbare Varianten eines Mediationstyps (z.B. "Trennung mit Kindern"
    als Variante von "trennung").

    Eine Variante ist rein additiv gedacht: die Standard-Schritte des
    Mediationstyps (PhaseStepDefault mit variant_key = NULL) gelten weiterhin
    für jeden Fall. Über PhaseStepDefault-Einträge mit gesetztem variant_key
    (== MediationVariant.key) können zusätzliche bzw. abweichende Schritte
    definiert werden, die nur greifen, wenn diese Variante für einen
    konkreten Fall ausgewählt ist.

    Die eigentliche Zuordnung "welche Variante gilt für Mediation X" ist
    bewusst noch nicht Teil dieses Modells – das ist ein späterer Schritt.
    Aktuell geht es nur um das Anlegen/Verwalten der Varianten selbst im
    Workflow Designer.
    """

    __tablename__ = "mediation_variants"
    __table_args__ = (
        UniqueConstraint("mediation_type", "key", name="uq_mediation_variant_key"),
    )

    id = Column(Integer, primary_key=True, index=True)
    mediation_type = Column(String, nullable=False, index=True)
    key = Column(String, nullable=False)
    label = Column(String, nullable=False)
    description = Column(Text, nullable=False, default="")
    position = Column(Integer, nullable=False, default=0)
    enabled = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
