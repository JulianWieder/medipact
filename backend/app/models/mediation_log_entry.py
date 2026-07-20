from datetime import datetime, timezone

from sqlalchemy import JSON, Column, DateTime, ForeignKey, Integer, String

from app.database import Base


class MediationLogEntry(Base):
    """
    Ein Eintrag im kostenlosen Konflikt-Logbuch (Mediation.mode == "logbuch").

    Nutzer:innen dokumentieren fortlaufend, was in ihrem Konflikt passiert –
    Vorkommnisse, Gedanken, Gespräche, E-Mails, WhatsApp-Nachrichten, Telefonate –
    BEVOR sie eine Mediation starten (Gedächtnisprotokoll/Chronologie).

    Die Form eines Eintrags kommt aus dem WorkflowManager: die Blöcke des
    Schritts phase="logbuch" / step_key="logbuch_eintrag" (phase_step_defaults)
    definieren die Felder; ``content`` speichert die Werte als {block_id: wert}.
    So bleibt das Eintrags-Formular ohne Code-Änderung im Designer editierbar.

    Anders als mediation_block_responses (eine Antwort je Block/Autor) kann es
    hier beliebig VIELE Einträge zum selben Formular geben – deshalb die eigene
    Tabelle. Wird das Logbuch in eine Mediation umgewandelt, bleiben die
    Einträge erhalten und fließen als Chronologie in die Fallaufnahme ein.
    """

    __tablename__ = "mediation_log_entries"

    id = Column(Integer, primary_key=True, index=True)
    mediation_id = Column(
        Integer, ForeignKey("mediations.id"), nullable=False, index=True
    )
    author_participant_id = Column(
        Integer, ForeignKey("mediation_participants.id"), nullable=True
    )
    # Art des Eintrags: vorkommnis | gedanke | gespraech | email | whatsapp | telefonat
    entry_type = Column(String, nullable=False, default="vorkommnis")
    # Wann das dokumentierte Ereignis stattgefunden hat (nicht: wann erfasst).
    occurred_at = Column(DateTime, nullable=True)
    title = Column(String, nullable=True)
    # Feldwerte gemäß WFM-Vorlage logbuch_eintrag: {block_id: wert}.
    content = Column(JSON, nullable=True)

    created_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
