from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String

from app.database import Base


class MediationChild(Base):
    """Ein Kind im Betreuungskalender.

    Zwei Gründe für eine eigene Tabelle statt eines Freitextfelds:

    1. Sobald es mehr als ein Kind gibt, haben die Kinder verschiedene Zeiten
       (die Große bleibt Sonntag länger, der Kleine nicht). Ohne Stammdatum
       müsste man je Kind eine eigene Serienregel mit Namen im Label pflegen –
       und der Kalender könnte nicht nach Kind filtern.
    2. Das Kind soll später selbst hineinschauen dürfen. Dafür braucht es eine
       Zeile, an die ein Konto hängen kann (`user_id`), ohne dass aus dem Kind
       eine verhandelnde Partei wird.

    Die Zuordnung zu Betreuungszeiten liegt bewusst NICHT hier, sondern als
    Liste von IDs an der Regel bzw. am Termin (`child_ids`): eine Serienregel
    gilt oft für mehrere Kinder, und ein Termin kann davon abweichen ("diesmal
    nur der Kleine"). Eine Verknüpfungstabelle wäre sauberer normalisiert,
    brächte aber nichts – gefiltert wird ohnehin erst nach dem Expandieren der
    Serien in Python.

    `user_id` ist der Kind-Zugang: ein Konto mit der Teilnehmer-Rolle "kind" im
    selben Logbuch. Diese Rolle darf ausschließlich lesen und sieht nur, was
    geteilt ist (siehe routers/betreuung.py `_require_writer` und
    routers/logbuch.py `_require_logbuch_access`).
    """

    __tablename__ = "mediation_children"

    id = Column(Integer, primary_key=True, index=True)
    mediation_id = Column(
        Integer, ForeignKey("mediations.id"), nullable=False, index=True
    )
    # Wer das Kind angelegt hat – für "nur eigene Einträge änderbar" wie überall
    # sonst im Logbuch.
    author_participant_id = Column(
        Integer, ForeignKey("mediation_participants.id"), nullable=True
    )
    # Konto des Kindes, falls es einen eigenen Zugang hat (Rolle "kind").
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    name = Column(String, nullable=False)
    # E-Mail, an die ein Zugang eingeladen wurde. Sie bleibt stehen, bis die
    # Einladung angenommen ist – dann trägt routers/invites.py `user_id` nach.
    access_email = Column(String, nullable=True)
    # ISO-Datum (YYYY-MM-DD) – als String wie alle Datumsfelder in diesem
    # Bereich, damit Vergleiche ohne Zeitzonen-Fallen bleiben.
    birthdate = Column(String, nullable=True)
    # Farbe für die Kalenderdarstellung (Tailwind-Schlüssel, z. B. "sky").
    color = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
