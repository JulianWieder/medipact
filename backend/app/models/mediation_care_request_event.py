from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text

from app.database import Base


class MediationCareRequestEvent(Base):
    """
    Verlauf einer Absprache im Betreuungskalender.

    Der aktuelle Stand einer Anfrage steht auf dem Termin selbst
    (MediationCareTime.request_*). Hier liegt daneben, WIE es dazu kam: wer
    zuerst gefragt hat, welche Gegenvorschläge es gab, wann zugestimmt wurde.

    Das ist kein Beiwerk. Beim Tausch der ersten Fassung (Migration
    d2e3f4a5b6c7) überschrieb jeder neue Vorschlag den vorherigen – nach zwei
    Runden ließ sich nicht mehr sagen, worum ursprünglich gebeten worden war.
    Genau das ist bei Betreuungszeiten der strittige Punkt.

    Zeilen werden nur angelegt, nie geändert oder gelöscht (außer mit dem
    Termin selbst). ``action``:

      angefragt        – die Bitte wurde gestellt
      gegenvorschlag   – die Gegenseite schlägt andere Zeiten vor; die Anfrage
                         bleibt offen, request_by wechselt auf sie
      akzeptiert       – zugestimmt, der Plan wurde übernommen
      abgelehnt        – abgelehnt, der Plan bleibt unverändert
      zurueckgezogen   – die anfragende Person hat zurückgezogen
    """

    __tablename__ = "mediation_care_request_events"

    id = Column(Integer, primary_key=True, index=True)
    mediation_id = Column(
        Integer, ForeignKey("mediations.id"), nullable=False, index=True
    )
    care_time_id = Column(
        Integer, ForeignKey("mediation_care_times.id"), nullable=False, index=True
    )
    participant_id = Column(
        Integer, ForeignKey("mediation_participants.id"), nullable=True
    )
    action = Column(String, nullable=False)
    # Art der Anfrage zum Zeitpunkt des Ereignisses (tausch, zusatztag,
    # absage, verschiebung) – mitgeschrieben, damit der Verlauf für sich
    # allein lesbar bleibt.
    kind = Column(String, nullable=True)
    proposed_start = Column(DateTime, nullable=True)
    proposed_end = Column(DateTime, nullable=True)
    message = Column(Text, nullable=True)

    created_at = Column(
        DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )
