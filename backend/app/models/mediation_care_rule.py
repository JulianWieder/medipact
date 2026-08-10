from datetime import datetime, timezone

from sqlalchemy import JSON, Column, DateTime, ForeignKey, Integer, String

from app.database import Base


class MediationCareRule(Base):
    """
    Serienregel im Betreuungskalender des Konflikt-Logbuchs (Trennungsfälle).

    Beschreibt ein wiederkehrendes Betreuungsfenster, z. B. "jedes 2. Wochenende
    Fr 17:00 bis So 18:00 bei Papa". Die Regel wird beim Lesen (routers/
    betreuung.py, GET …/betreuung/termine) in konkrete Termine expandiert –
    es werden KEINE Vorkommnisse materialisiert. Abweichungen/Ist-Zeiten zu
    einem einzelnen Serientermin liegen als MediationCareTime mit rule_id +
    date daneben (Override).

    Sichtbarkeit wie bei Logbuch-Einträgen (private/personal/shared, Filter
    identisch zu routers/logbuch.py _visible_to).
    """

    __tablename__ = "mediation_care_rules"

    id = Column(Integer, primary_key=True, index=True)
    mediation_id = Column(
        Integer, ForeignKey("mediations.id"), nullable=False, index=True
    )
    author_participant_id = Column(
        Integer, ForeignKey("mediation_participants.id"), nullable=True
    )
    # Anzeigename, z. B. "Wochenende bei Papa".
    label = Column(String, nullable=True)
    # Wer betreut in diesem Fenster (Freitext: "Mutter", "Vater", Name …).
    caregiver = Column(String, nullable=True)
    # Wochenfenster: 0=Montag … 6=Sonntag; Zeiten als "HH:MM".
    # end_weekday < start_weekday bedeutet "in der Folgewoche" (Modulo 7).
    start_weekday = Column(Integer, nullable=False)
    start_time = Column(String, nullable=False)
    end_weekday = Column(Integer, nullable=False)
    end_time = Column(String, nullable=False)
    # 1 = jede Woche, 2 = jede zweite Woche usw.
    interval_weeks = Column(Integer, nullable=False, default=1)
    # ISO-Datum (YYYY-MM-DD) einer Woche, in der die Serie stattfindet –
    # verankert bei interval_weeks > 1, WELCHE Wochen gemeint sind.
    # Fallback: valid_from, sonst created_at.
    anchor_date = Column(String, nullable=True)
    # Geltungszeitraum als ISO-Datum, beide optional (offenes Ende).
    valid_from = Column(String, nullable=True)
    valid_until = Column(String, nullable=True)
    # Welche Kinder betrifft dieses Betreuungsfenster (Liste von
    # MediationChild-IDs). NULL oder leer heißt „alle Kinder" – dadurch bleiben
    # alle vor Migration j5k6l7m8n9o0 angelegten Regeln unverändert gültig.
    child_ids = Column(JSON, nullable=True)
    visibility = Column(
        String, nullable=False, default="personal", server_default="personal"
    )

    created_at = Column(
        DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    updated_at = Column(
        DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
