from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, Integer, String

from app.database import Base


class NewsletterSubscriber(Base):
    """E-Mail-Anmeldung für den Newsletter (Double-Opt-in).

    Ablauf: Das Formular legt die Adresse mit `active=True`, aber
    `confirmed=False` an und verschickt eine Bestätigungsmail mit
    `confirm_token`. Erst der Klick darauf setzt `confirmed=True` – und nur
    bestätigte Adressen bekommen jemals einen Newsletter (siehe
    routers/newsletter.py). Ohne diesen Nachweis ist der Versand in
    Deutschland nicht zulässig (§ 7 UWG).

    `consent_ip` und `consent_at` halten fest, woher die Einwilligung kam –
    das ist der Nachweis, wenn jemand die Anmeldung bestreitet.

    `unsubscribe_token` steht in jeder versendeten Mail: ein Klick genügt, kein
    Login, kein Formular.

    `source` hält fest, wo die Anmeldung herkam ("landing", "footer"), damit
    sich Kanäle auswerten lassen.
    """

    __tablename__ = "newsletter_subscribers"

    id = Column(Integer, primary_key=True, index=True)

    # Gespeichert wird die E-Mail kleingeschrieben/normalisiert; unique verhindert
    # doppelte Anmeldungen (die App behandelt das idempotent, kein 500).
    email = Column(String, nullable=False, unique=True, index=True)

    # active = nicht abgemeldet. Für den Versand zählt zusätzlich confirmed.
    active = Column(Boolean, nullable=False, default=True, server_default="1")

    # ── Double-Opt-in ────────────────────────────────────────────────────────
    confirmed = Column(Boolean, nullable=False, default=False, server_default="0")
    confirm_token = Column(String, nullable=True, unique=True, index=True)
    confirmed_at = Column(DateTime, nullable=True)

    # ── Abmeldung ohne Login ─────────────────────────────────────────────────
    unsubscribe_token = Column(String, nullable=True, unique=True, index=True)

    # ── Nachweis der Einwilligung ────────────────────────────────────────────
    consent_ip = Column(String, nullable=True)
    consent_at = Column(DateTime, nullable=True)

    # Herkunft der Anmeldung ("landing", "footer", ...), rein informativ.
    source = Column(String, nullable=True)

    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
    unsubscribed_at = Column(DateTime, nullable=True)
