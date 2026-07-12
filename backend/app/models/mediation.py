from sqlalchemy import JSON, Boolean, Column, ForeignKey, Integer, String, Text

from app.database import Base


class Mediation(Base):
    __tablename__ = "mediations"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, default="Neue Mediation")
    mediation_type = Column(String, nullable=False)
    # Zuordnung Fall -> Firmenkunde (organizations.id). NULL = privater B2C-Fall
    # (bestehendes Verhalten: Pro-Partei-Paywall). Gesetzt = Firmenfall: unterliegt
    # Tenant-Scoping (nur eigenes Unternehmen sichtbar) und wird über das aktive
    # Firmen-Abo freigeschaltet statt über Parteizahlungen (siehe services/billing.py).
    organization_id = Column(
        Integer, ForeignKey("organizations.id"), nullable=True, index=True
    )
    description = Column(Text, nullable=True)
    priority = Column(Text, nullable=True)
    role = Column(String, nullable=True)
    status = Column(String, default="draft")
    phase = Column(String, nullable=True)
    is_paid = Column(Boolean, nullable=False, default=False, server_default="0")
    # Gewähltes Paket (online | hybrid | vollservice), bei Fallerstellung gesetzt.
    # Bestimmt zusammen mit mediation_type den Preis (siehe app/pricing.py).
    package = Column(String, nullable=False, default="online", server_default="online")
    # Zuordnung Fall -> Mediations-Variante (MediationVariant.key innerhalb
    # des mediation_type dieses Falls). NULL = Basis-Workflow ohne Variante.
    # Jederzeit änderbar; wirkt auf die Step-Auflösung in get_phase_steps
    # (Standard-Schritte + Schritte der gewählten Variante).
    variant_key = Column(String, nullable=True, index=True)
    # Fall-Fakten/Flags als JSON-Objekt, z.B. {"glasl_zone": "win_lose",
    # "abo": "ja"}. Steuern zusammen mit phase_step_defaults.visible_if,
    # welche Schritte/Blöcke dieser Fall sieht (Eskalation, Segmentierung,
    # Abo- vs. Einzel-Mediation). NULL = keine Flags (alles Unbedingte sichtbar).
    flags = Column(JSON, nullable=True)
