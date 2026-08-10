"""Kalender: Kinder als Stammdaten, Kind-Zugang, Erinnerung an offene Anfragen.

Der Betreuungskalender kannte bisher nur „wer betreut" (`caregiver` als
Freitext) – nicht, WEN. Solange es ein Kind gibt, fällt das nicht auf. Bei
zweien schon: die Große bleibt sonntags länger, der Kleine kommt eher zurück,
und beides in eine Serienregel zu pressen geht nur über zwei Regeln mit dem
Namen im Label. Der Kalender könnte dann weder nach Kind filtern noch anzeigen,
für wen ein Tausch eigentlich gilt.

Diese Migration bringt deshalb:

  * ``mediation_children`` – Kinder als Stammdaten je Logbuch (Name,
    Geburtsdatum, Farbe). Optional hängt ein Konto daran (``user_id``): der
    Kind-Zugang, eine Teilnehmer-Rolle "kind", die ausschließlich lesen darf.
  * ``child_ids`` auf Serienregeln und Terminen – welche Kinder betrifft dieses
    Betreuungsfenster. Leer/NULL heißt „alle" und hält damit alle Altdaten
    gültig, ohne sie anzufassen.
  * ``request_reminder_sent_at`` auf den Terminen – Merker für die Erinnerung
    an unbeantwortete Absprachen (scripts/check_care_requests.py). Ohne Merker
    ginge die Mail bei jedem Lauf erneut raus, wie schon bei den PayPal-
    Reservierungen gelernt.

Revision ID: j5k6l7m8n9o0
Revises: i4j5k6l7m8n9
Create Date: 2026-08-10
"""
import sqlalchemy as sa
from alembic import op

revision = "j5k6l7m8n9o0"
down_revision = "i4j5k6l7m8n9"
branch_labels = None
depends_on = None


def _columns(table: str) -> set[str]:
    """Vorhandene Spalten – die Migration soll auch auf einer Datenbank
    durchlaufen, auf der Teile schon von Hand angelegt wurden."""
    bind = op.get_bind()
    return {row[1] for row in bind.exec_driver_sql(f"PRAGMA table_info({table})")}


def _tables() -> set[str]:
    bind = op.get_bind()
    return {
        row[0]
        for row in bind.exec_driver_sql(
            "SELECT name FROM sqlite_master WHERE type='table'"
        )
    }


def upgrade() -> None:
    tables = _tables()

    if "mediation_children" not in tables:
        op.create_table(
            "mediation_children",
            sa.Column("id", sa.Integer(), primary_key=True, index=True),
            sa.Column(
                "mediation_id",
                sa.Integer(),
                sa.ForeignKey("mediations.id"),
                nullable=False,
                index=True,
            ),
            sa.Column(
                "author_participant_id",
                sa.Integer(),
                sa.ForeignKey("mediation_participants.id"),
                nullable=True,
            ),
            sa.Column(
                "user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=True
            ),
            sa.Column("name", sa.String(), nullable=False),
            # E-Mail, an die ein Kind-Zugang eingeladen wurde. Die Verknüpfung
            # mit dem Konto passiert erst beim Annehmen der Einladung
            # (routers/invites.py) – vorher gibt es kein Konto, das man
            # eintragen könnte.
            sa.Column("access_email", sa.String(), nullable=True),
            sa.Column("birthdate", sa.String(), nullable=True),
            sa.Column("color", sa.String(), nullable=True),
            sa.Column("created_at", sa.DateTime(), nullable=True),
        )

    # child_ids: JSON-Liste von Kind-IDs. NULL = „alle Kinder" – so bleiben
    # bestehende Regeln und Termine unverändert gültig.
    for table in ("mediation_care_rules", "mediation_care_times"):
        if table in tables and "child_ids" not in _columns(table):
            op.add_column(table, sa.Column("child_ids", sa.JSON(), nullable=True))

    if (
        "mediation_care_times" in tables
        and "request_reminder_sent_at" not in _columns("mediation_care_times")
    ):
        op.add_column(
            "mediation_care_times",
            sa.Column("request_reminder_sent_at", sa.DateTime(), nullable=True),
        )


def downgrade() -> None:
    tables = _tables()

    if "mediation_care_times" in tables:
        cols = _columns("mediation_care_times")
        if "request_reminder_sent_at" in cols:
            op.drop_column("mediation_care_times", "request_reminder_sent_at")
        if "child_ids" in cols:
            op.drop_column("mediation_care_times", "child_ids")

    if "mediation_care_rules" in tables and "child_ids" in _columns(
        "mediation_care_rules"
    ):
        op.drop_column("mediation_care_rules", "child_ids")

    if "mediation_children" in tables:
        op.drop_table("mediation_children")
