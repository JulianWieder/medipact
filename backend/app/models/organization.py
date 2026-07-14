from datetime import datetime

from sqlalchemy import JSON, Boolean, Column, DateTime, Integer, String

from app.database import Base


class Organization(Base):
    """Firmenkunde (Unternehmen = Tenant).

    Ein Unternehmen bündelt seine Firmen-Admins (role="firm_admin"), seine
    Firmen-Mediatoren (role="mediator"), seine Mitarbeiter/Beteiligten und seine
    Fälle (mediations.organization_id). Das Abo hängt am Unternehmen: solange
    ``is_active``, sind die internen Fälle ohne Pro-Partei-Paywall freigeschaltet
    (siehe app/services/billing.py). Preislogik: app/pricing.py (Business-Abos).

    Historie: früher als "Mandant (Kanzlei/Praxis)" gedacht (Anbieter-Modell);
    seit 2026-07-11 umgedeutet zum Firmenkunden-Modell.
    """

    __tablename__ = "organizations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    # Business-Abo-Plan des Unternehmens (Schlüssel aus pricing.ABO_PLANS).
    plan = Column(String, nullable=False, default="starter", server_default="starter")
    # Ob das Firmen-Abo aktiv ist. Nur bei aktivem Abo werden die internen Fälle
    # des Unternehmens freigeschaltet (billing.ensure_unlocked).
    is_active = Column(Boolean, nullable=False, default=True, server_default="1")
    # Rechnungs-E-Mail des Unternehmens (Abrechnung am Unternehmen, nicht je Partei).
    billing_email = Column(String, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    # ── Onboarding-Finalisierung (unternehmensweit, einmalig) ────────────────
    # Servicevertrag: leichtgewichtige Unterschrift per getipptem Namen.
    contract_signed_at = Column(DateTime, nullable=True)
    contract_signer_name = Column(String, nullable=True)
    # Zahlung des Onboardings: "invoice" (Rechnung/Abo) oder "paypal".
    onboarding_payment_method = Column(String, nullable=True)
    onboarding_paid_at = Column(DateTime, nullable=True)
    onboarding_paypal_order_id = Column(String, nullable=True)
    # Gesetzt, sobald Vertrag unterschrieben UND bezahlt.
    onboarding_completed_at = Column(DateTime, nullable=True)

    # ── Grundkonfiguration (Abo-Modell, einmal pro Unternehmen) ─────────────
    # Antworten auf die Blöcke des WFM-Schritts organisation/abo_grundkonfiguration
    # (Block-id -> Wert). MUSS akzeptiert sein, bevor Abo-Fälle angelegt werden
    # können (Gate in routers/mediations.create_mediation). Einzel-B2C-Fälle
    # sind davon unberührt.
    base_config = Column(JSON, nullable=True)
    base_config_accepted_at = Column(DateTime, nullable=True)
    base_config_accepted_by = Column(String, nullable=True)
