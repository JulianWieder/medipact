from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text

from app.database import Base


class InviteMeetRecording(Base):
    """Zwischenspeicher für eine Meet-Aufnahme, die zur Einladungs-Botschaft
    gehört – analog zur hochgeladenen Video-Botschaft, nur dass die Aufnahme in
    Google Drive liegt (Meet-Artefakt) statt auf dem medipact-Server.

    Ablauf: Der Einladende startet die Aufnahme (Zeile wird angelegt, ``token``
    geht ans Frontend), nimmt seine Botschaft im Meet-Raum auf, ruft die Aufnahme
    ab (``recording_uri``/``transcript`` werden gefüllt) und erstellt anschließend
    die Einladung mit diesem ``token``. Beim Erstellen der Einladung werden
    ``recording_uri``/``transcript``/``kind`` auf den MediationInvite kopiert.
    """

    __tablename__ = "invite_meet_recordings"

    id = Column(Integer, primary_key=True, index=True)

    mediation_id = Column(
        Integer,
        ForeignKey("mediations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Nicht erratbarer Handle, den das Frontend beim Erstellen der Einladung mitgibt.
    token = Column(String, nullable=False, unique=True, index=True)

    # Ressourcenname des Meet-Raums ("spaces/xxx") + Beitritts-Link.
    space_name = Column(String, nullable=False)
    meeting_uri = Column(String, nullable=False)

    # "video" oder "audio" (Umschalter beim Aufnehmen). Steuert nur die
    # Darstellung – Meet nimmt technisch immer A/V auf; bei "audio" schaltet der
    # Nutzer seine Kamera aus.
    kind = Column(String, nullable=False, default="video")

    # pending | recording | processing | ready | failed
    status = Column(String, nullable=False, default="pending")

    # Google-Drive-Playback-Link der fertigen Aufnahme + Drive-Datei-ID.
    recording_uri = Column(String, nullable=True)
    recording_file_id = Column(String, nullable=True)

    # Automatisch von Meet erzeugtes Transkript der Botschaft.
    transcript = Column(Text, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
