from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String

from app.database import Base


class MediationLogUpload(Base):
    """
    Protokoll eines Datei-Uploads im Konflikt-Logbuch (Foto vom halb leeren
    Schrank, Screenshot, Beleg …). Dient zwei Zwecken:

      1. Wochen-Quote der Free-Stufe (1 Upload/Woche; Premium unbegrenzt –
         siehe pricing.LOGBUCH_LIMITS und routers/logbuch.py).
      2. Die Datei selbst liegt wie bei Block-Uploads auf der Platte
         (block_uploads/), erreichbar über GET /logbuch/file?token=… –
         OHNE Paywall (das Logbuch ist kostenlos), nur mit Teilnehmer-Check.

    Der ``token`` landet als {"url", "name"} im Eintrag-Feld des
    datei_upload-Blocks (mediation_log_entries.content).
    """

    __tablename__ = "mediation_log_uploads"

    id = Column(Integer, primary_key=True, index=True)
    mediation_id = Column(Integer, ForeignKey("mediations.id"), nullable=False, index=True)
    token = Column(String, nullable=False, unique=True)
    name = Column(String, nullable=True)
    size_bytes = Column(Integer, nullable=True)
    created_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
