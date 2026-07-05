from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, Float, Integer, String

from app.database import Base


class DiscountCode(Base):
    """Rabattcode für die Fall-Freischaltung. Der Code trägt seine Wirkung selbst:
    Typ (Prozent/Fix/Voll), Wert, Geltung (pro Partei / pro Fall) sowie optionale
    Beschränkungen (Gültigkeit, Nutzungslimit, auf Konflikttyp/Paket begrenzt).
    """

    __tablename__ = "discount_codes"

    id = Column(Integer, primary_key=True, index=True)

    # Eingelöst wird case-insensitive; gespeichert wird der Code wie angelegt.
    code = Column(String, nullable=False, unique=True, index=True)

    # "percent" (value = 0..100), "fixed" (value = EUR-Abzug), "full" (100 % → 0 €).
    kind = Column(String, nullable=False, default="percent")
    value = Column(Float, nullable=False, default=0.0)

    # "participant" = jede Partei löst auf ihren eigenen Anteil ein;
    # "case" = gilt für den ganzen Fall (auf jeden Anteil im Fall anwendbar).
    scope = Column(String, nullable=False, default="participant")

    active = Column(Boolean, nullable=False, default=True, server_default="1")

    # Gesamtes Einlöse-Limit (None = unbegrenzt) + bisherige Einlösungen.
    max_uses = Column(Integer, nullable=True)
    used_count = Column(Integer, nullable=False, default=0, server_default="0")

    valid_until = Column(DateTime, nullable=True)

    # Optionale Beschränkung auf einen Konflikttyp bzw. ein Paket (None = alle).
    restrict_type = Column(String, nullable=True)
    restrict_package = Column(String, nullable=True)

    description = Column(String, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
