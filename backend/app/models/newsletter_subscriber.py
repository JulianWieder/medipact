from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, Integer, String

from app.database import Base


class NewsletterSubscriber(Base):
    """E-Mail-Anmeldung für den Newsletter über die Landing Page.

    Bewusst schlank gehalten (einfaches Speichern, kein Double-Opt-in): Die
    Anmeldung wird direkt mit `active=True` abgelegt. Ein späteres Double-Opt-in
    lässt sich über `confirmed`/`confirm_token` nachrüsten, ohne die Tabelle
    umzubauen. `source` hält fest, wo die Anmeldung herkam (z. B. "landing",
    "footer"), damit sich Kanäle später auswerten lassen.
    """

    __tablename__ = "newsletter_subscribers"

    id = Column(Integer, primary_key=True, index=True)

    # Gespeichert wird die E-Mail kleingeschrieben/normalisiert; unique verhindert
    # doppelte Anmeldungen (die App behandelt das idempotent, kein 500).
    email = Column(String, nullable=False, unique=True, index=True)

    active = Column(Boolean, nullable=False, default=True, server_default="1")

    # Herkunft der Anmeldung ("landing", "footer", ...), rein informativ.
    source = Column(String, nullable=True)

    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
    unsubscribed_at = Column(DateTime, nullable=True)
