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
    # Ein-Buch-Umbau (e3f4a5b6c7d8): Der Bereich (mediation_type-Werte wie
    # "trennung", "erbschaft" …) hängt jetzt am EINTRAG, nicht mehr am Buch –
    # ein Nutzer hat genau EIN Konflikt-Logbuch, die Einträge darin sind nach
    # Bereich getaggt und filterbar. NULL/Altbestand fällt beim Serialisieren
    # auf mediation.mediation_type zurück.
    area = Column(String, nullable=True, index=True)
    # Wann das dokumentierte Ereignis stattgefunden hat (nicht: wann erfasst).
    occurred_at = Column(DateTime, nullable=True)
    title = Column(String, nullable=True)
    # Feldwerte gemäß WFM-Vorlage logbuch_eintrag: {block_id: wert}.
    content = Column(JSON, nullable=True)
    # Journal-Funktion – Sichtbarkeit des Eintrags (Filter in routers/logbuch.py):
    #   "private"  – Journal: tiefe/geheime Gedanken, sieht NUR die Autor:in,
    #                auch nach Umwandlung niemals Mediator oder Gegenseite.
    #   "personal" – Dokumentation (Default): nur die Autor:in, kann später
    #                aber in die Mediation geteilt werden.
    #   "shared"   – in die Mediation gepusht: sichtbar für alle Teilnehmer
    #                des Falls (Mediator + Gegenseite).
    visibility = Column(String, nullable=False, default="personal", server_default="personal")
    # KI-Analyse dieses Eintrags (routers/logbuch.py analyze_entry):
    # {"einschaetzung": str, "naechste_schritte": [{"titel","warum"}], "tipp": str}.
    # ai_analysis_at zählt zugleich als Kontingent-Verbrauch (free: 1/Woche,
    # premium: 1/Tag – Zahlen in app/pricing.py LOGBUCH_LIMITS).
    ai_analysis = Column(JSON, nullable=True)
    ai_analysis_at = Column(DateTime, nullable=True)

    created_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
