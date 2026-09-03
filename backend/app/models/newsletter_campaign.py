from datetime import datetime, timezone

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
)

from app.database import Base


class NewsletterCampaign(Base):
    """Ein Newsletter-Entwurf und sein Versandstatus.

    Bewusst schlicht: Betreff, Überschrift, Fließtext (Absätze durch Leerzeile
    getrennt) und optional ein Button. Gerendert wird in das Layout, das auch
    die übrigen medipact-Mails benutzen (app/email.py) – kein HTML-Editor, kein
    Template-Zoo.

    `status`: draft -> sending -> sent. Bricht der Versand ab, bleibt der
    Stand im Versandprotokoll (NewsletterDelivery) sichtbar, und ein erneuter
    Versand überspringt die bereits erreichten Adressen.
    """

    __tablename__ = "newsletter_campaigns"

    id = Column(Integer, primary_key=True, index=True)

    subject = Column(String, nullable=False)
    heading = Column(String, nullable=False, default="", server_default="")
    body = Column(Text, nullable=False, default="", server_default="")
    cta_label = Column(String, nullable=True)
    cta_url = Column(String, nullable=True)

    status = Column(String, nullable=False, default="draft", server_default="draft")
    created_by = Column(String, nullable=True)

    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
    sent_at = Column(DateTime, nullable=True)
    sent_count = Column(Integer, nullable=False, default=0, server_default="0")
    failed_count = Column(Integer, nullable=False, default=0, server_default="0")


class NewsletterDelivery(Base):
    """Versandprotokoll je Empfänger und Kampagne.

    Zwei Gründe für die Tabelle: nach einem abgebrochenen Versand ist sonst
    nicht feststellbar, wer die Mail schon hatte (und bekäme sie doppelt), und
    fehlgeschlagene Adressen wären unsichtbar.
    """

    __tablename__ = "newsletter_deliveries"

    id = Column(Integer, primary_key=True, index=True)
    campaign_id = Column(
        Integer,
        ForeignKey("newsletter_campaigns.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    email = Column(String, nullable=False)
    status = Column(String, nullable=False)  # sent | failed
    error = Column(String, nullable=True)
    sent_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
