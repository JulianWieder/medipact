from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text, UniqueConstraint

from app.database import Base


class PhaseStepDefault(Base):
    """
    Konfigurierbare Standard-Schritte pro Mediationstyp und Phase.

    Ersetzt die früher hartkodierten Step-Listen aus dem Frontend
    (app/dashboard/[id]/_shared/phaseData.ts und EinleitungClient.tsx).
    Ein Admin kann hier pro (mediation_type, phase) festlegen, welche
    Schritte standardmäßig existieren, in welcher Reihenfolge, und ob
    sie aktuell aktiv sind.

    Pro-Fall-Abweichungen laufen weiterhin über die bestehenden Tabellen:
      - MediationCustomStep: zusätzliche Schritte für einen einzelnen Fall
      - MediationStepRule: Schritt für einen einzelnen Fall überspringen
        oder benötigte Rollen abweichend setzen

    variant_key (siehe MediationVariant) ordnet einen Schritt optional einer
    Variante des Mediationstyps zu (z.B. "Trennung mit Kindern"). NULL
    bedeutet: Standard-Schritt des Basistyps, der für jeden Fall dieses Typs
    gilt. Ein gesetzter Wert bedeutet: zusätzlicher/abweichender Schritt, der
    nur greift, wenn diese Variante für einen Fall gewählt wurde.
    """

    __tablename__ = "phase_step_defaults"
    __table_args__ = (
        UniqueConstraint(
            "mediation_type", "phase", "step_key", "variant_key",
            name="uq_phase_step_default_variant",
        ),
    )

    id = Column(Integer, primary_key=True, index=True)
    mediation_type = Column(String, nullable=False, index=True)
    phase = Column(String, nullable=False, index=True)
    step_key = Column(String, nullable=False)
    # NULL = Standard-Konfiguration des Mediationstyps. Sonst: key einer
    # MediationVariant (gültig innerhalb des jeweiligen mediation_type).
    variant_key = Column(String, nullable=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False, default="")
    placeholder = Column(Text, nullable=False, default="")
    reflection_mode = Column(String, nullable=True)
    # Komma-separierte Rollenliste, z.B. "owner,other_party". NULL = Standard
    # (owner, initiator, other_party) – analog zu MediationStepRule.required_roles.
    required_roles = Column(String, nullable=True)
    position = Column(Integer, nullable=False, default=0)
    enabled = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
