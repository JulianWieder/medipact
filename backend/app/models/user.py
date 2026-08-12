from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime
from app.database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="party")
    # Mandanten-Zuordnung (organizations.id). NULL = keinem Mandanten zugeordnet
    # (z.B. Parteien). Relevant v.a. fuer Mediatoren: Anzahl Mediatoren je
    # Mandant bestimmt den Abo-Preis (app/pricing.py).
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=True, index=True)
    is_verified = Column(Boolean, default=False, nullable=False)
    verification_token = Column(String, nullable=True, index=True)
    password_reset_token = Column(String, nullable=True, index=True)
    password_reset_token_expires = Column(DateTime, nullable=True)

    # ── Nutzer-Onboarding ────────────────────────────────────────────────────
    # Das Onboarding laeuft EINMAL pro Person, bevor sie Faelle bearbeiten kann
    # (frueher steckte es als Checkliste in jedem einzelnen Fall). Die Schritte
    # selbst sind im Workflow Manager unter dem Pseudo-Typ "@user" gepflegt
    # (siehe models/phase_step_default.py), die Antworten liegen in
    # user_onboarding_responses.
    #
    # Dieses Feld ist bewusst redundant zu "alle Pflichtbloecke beantwortet":
    # Die Sperre wird bei JEDEM Fall-Request geprueft, und dafuer darf sie nicht
    # jedes Mal die komplette Blockliste durchrechnen muessen. Gesetzt wird es
    # ausschliesslich von POST /onboarding/complete, nachdem dort genau diese
    # Vollstaendigkeitspruefung gelaufen ist.
    onboarding_completed_at = Column(DateTime, nullable=True)

    # ── Stammdaten (aus dem Onboarding) ──────────────────────────────────────
    # Frueher wurden die Rechnungsdaten pro Mediation am Teilnehmer erfasst
    # (mediation_participants.billing_*) — jede Partei musste sie in jedem Fall
    # neu eintippen. Jetzt haengen sie an der Person; der Teilnehmer-Datensatz
    # wird daraus vorbefuellt und bleibt als fall-spezifische Ausnahme bestehen
    # (abweichende Rechnungsanschrift fuer einen einzelnen Fall).
    # ── Konto-Löschung ───────────────────────────────────────────────────────
    # Nur für Parteien LAUFENDER Verfahren. Wer in keinem Verfahren steckt,
    # wird sofort und hart gelöscht – dann gibt es keine Zeile mehr, an der
    # ein Datum stehen könnte (siehe services/konto.py).
    #
    # Gesetzt heißt: Die Person hat die Löschung verlangt. Das Konto bleibt
    # benutzbar, bis das Verfahren abgeschlossen ist; danach wird gelöscht.
    # Sichtbar für Mediator:innen im Fall, damit niemand ein Verfahren
    # weiterführt, dessen Partei erkennbar raus will.
    deletion_requested_at = Column(DateTime, nullable=True)
    deletion_note = Column(String, nullable=True)

    phone = Column(String, nullable=True)
    billing_street = Column(String, nullable=True)
    billing_postal_code = Column(String, nullable=True)
    billing_city = Column(String, nullable=True)
