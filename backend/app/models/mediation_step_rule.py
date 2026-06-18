from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, UniqueConstraint

from app.database import Base


class MediationStepRule(Base):
    """
    Pro-Fall-Override für die Standard-Workflow-Regeln.

    Standardmäßig muss jede Konfliktpartei (owner/initiator/other_party) einen
    Schritt abschließen, bevor er als erledigt gilt (siehe _resolve_step_requirement
    in routers/mediations.py). Über diese Tabelle kann ein Mediator pro Mediation
    und Schritt abweichende Anforderungen hinterlegen, ohne dass Code geändert
    werden muss:

      - required_roles: welche Rollen diesen Schritt abschließen müssen
        (z.B. auch "mediator" einschließen, oder eine Partei ausschließen).
      - skip: Schritt gilt für diesen Fall immer als erledigt (z.B. wenn er für
        diesen Mediationstyp nicht relevant ist).

    (phase, step) folgt der gleichen Konvention wie bei MediationNote: für
    Phase-1-Einzelschritte ist `phase` der Step-Key und `step` leer; für die
    späteren Phasen ist `phase` der Phasen-Key und `step` der Step-Key. Der
    Vertragsabschluss wird über die Pseudo-Phase "__contract__" abgebildet.
    """

    __tablename__ = "mediation_step_rules"
    __table_args__ = (
        UniqueConstraint("mediation_id", "phase", "step", name="uq_mediation_step_rule"),
    )

    id = Column(Integer, primary_key=True, index=True)
    mediation_id = Column(Integer, ForeignKey("mediations.id"), nullable=False, index=True)
    phase = Column(String, nullable=False)
    step = Column(String, nullable=False, default="")
    # Komma-separierte Rollenliste, z.B. "owner,other_party,mediator". NULL = Standard.
    required_roles = Column(String, nullable=True)
    skip = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
