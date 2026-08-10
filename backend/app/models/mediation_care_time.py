from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text

from app.database import Base


class MediationCareTime(Base):
    """
    Ein konkreter Betreuungstermin im Betreuungskalender (Plan + Ist).

    Zwei Spielarten, unterschieden über rule_id:

      • rule_id IS NULL – Einzeltermin: eigenständig geplanter Termin
        (Ferien, Feiertag, Zusatztag); planned_start/planned_end sind
        gesetzt. Mehrtägige Blöcke sind gewöhnliche Einzeltermine mit
        category="ferien"/"feiertag".
      • rule_id gesetzt – Override eines Serientermins der MediationCareRule:
        `date` (ISO-Datum des geplanten Beginns) identifiziert das Vorkommen.
        Hier landen Ist-Zeiten, Status und Notiz zu diesem einen Termin;
        planned_start/planned_end nur gesetzt, wenn der Plan für dieses
        Vorkommen abweichend geändert wurde (sonst gilt die Regel).

    Die Abweichung Plan↔Ist wird nicht gespeichert, sondern im Client aus
    planned_*/actual_* berechnet. Sichtbarkeit wie Logbuch-Einträge.
    """

    __tablename__ = "mediation_care_times"

    id = Column(Integer, primary_key=True, index=True)
    mediation_id = Column(
        Integer, ForeignKey("mediations.id"), nullable=False, index=True
    )
    author_participant_id = Column(
        Integer, ForeignKey("mediation_participants.id"), nullable=True
    )
    rule_id = Column(
        Integer, ForeignKey("mediation_care_rules.id"), nullable=True, index=True
    )
    # ISO-Datum (YYYY-MM-DD) des geplanten Beginns – Schlüssel für das
    # Serien-Vorkommen und Sortier-/Filterdatum im Kalender.
    date = Column(String, nullable=False, index=True)
    planned_start = Column(DateTime, nullable=True)
    planned_end = Column(DateTime, nullable=True)
    # Tatsächliche Betreuungszeiten (leer = noch nicht erfasst).
    actual_start = Column(DateTime, nullable=True)
    actual_end = Column(DateTime, nullable=True)
    # geplant | stattgefunden | ausgefallen
    status = Column(String, nullable=False, default="geplant", server_default="geplant")
    caregiver = Column(String, nullable=True)
    note = Column(Text, nullable=True)
    # Anzeigename – vor allem für Ferien- und Feiertagsblöcke ("Sommerferien,
    # erste Hälfte"). Bei Serien-Overrides bleibt das label der Regel maßgeblich.
    title = Column(String, nullable=True)
    # betreuung | ferien | feiertag. Nur für die Darstellung: ein Ferienblock
    # ist technisch ein mehrtägiger Einzeltermin, wird aber anders gezeichnet.
    category = Column(
        String, nullable=False, default="betreuung", server_default="betreuung"
    )
    # ── Absprachen (nur bei visibility="shared") ──
    # Eine Person bittet um eine Änderung, die andere stimmt zu oder lehnt ab
    # (routers/betreuung.py, Endpunkte …/anfrage*). Bei Zustimmung wird der
    # Plan übernommen. Der Verlauf – auch Gegenvorschläge – liegt in
    # MediationCareRequestEvent, damit eine Anfrage ihre Vorgeschichte behält.
    #
    #   tausch       – geplante Zeiten dieses Termins tauschen
    #   zusatztag    – dieser Termin ist erst erbeten; er zählt NICHT als Plan,
    #                  solange request_status "offen" oder "abgelehnt" ist
    #   absage       – geplanten Termin zurückgeben (request_start/-end leer)
    #   verschiebung – denselben Termin auf andere Zeiten legen
    request_kind = Column(String, nullable=True)
    # offen | akzeptiert | abgelehnt | zurueckgezogen
    request_status = Column(String, nullable=True)
    request_by = Column(
        Integer, ForeignKey("mediation_participants.id"), nullable=True
    )
    request_start = Column(DateTime, nullable=True)
    request_end = Column(DateTime, nullable=True)
    request_message = Column(Text, nullable=True)
    request_answered_at = Column(DateTime, nullable=True)
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
