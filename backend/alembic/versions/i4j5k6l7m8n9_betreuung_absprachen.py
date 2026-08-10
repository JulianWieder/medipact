"""Betreuungskalender: aus dem Tausch werden Absprachen.

Bisher kannte der Kalender genau EINE Absprache: den Tausch geplanter Zeiten
(swap_* auf mediation_care_times, Migration d2e3f4a5b6c7). Alles andere passierte
stillschweigend – legte ein Elternteil einen zusätzlichen Tag an, erschien er bei
der anderen Person einfach, ohne Zustimmung und ohne Verlauf. Damit war der
Kalender eine Anzeige, kein Absprache-Werkzeug.

Neu ist ein gemeinsamer Anfrage-Mechanismus für vier Fälle:

  * ``tausch``       – geplante Zeiten des Termins tauschen (wie bisher)
  * ``zusatztag``    – einen Termin zusätzlich erbitten; der Termin entsteht
                       sofort, gilt aber erst als Plan, wenn zugestimmt wurde
  * ``absage``       – einen geplanten Termin zurückgeben
  * ``verschiebung`` – denselben Termin auf andere Zeiten legen

Die ``swap_*``-Spalten werden zu ``request_*`` verallgemeinert (mit ``request_kind``),
vorhandene Tausch-Anfragen wandern verlustfrei mit: ``angefragt`` heißt jetzt
``offen``. Dazu kommt ``mediation_care_request_events`` als Verlauf – damit lässt
sich später nachvollziehen, wer wann was vorgeschlagen hat, und ein Gegenvorschlag
überschreibt nicht länger die ursprüngliche Bitte.

Ferien und Feiertage passen nicht in ein Wochenmuster, brauchen aber auch keine
eigene Tabelle: ein mehrtägiger Einzeltermin genügt. Er bekommt lediglich
``title`` (z. B. "Sommerferien, erste Hälfte") und ``category``, damit die
Oberfläche ihn als Block statt als Betreuungsfenster zeichnen kann.

Revision ID: i4j5k6l7m8n9
Revises: h3i4j5k6l7m8
Create Date: 2026-08-10
"""
import sqlalchemy as sa
from alembic import op

revision = "i4j5k6l7m8n9"
down_revision = "h3i4j5k6l7m8"
branch_labels = None
depends_on = None


TABLE = "mediation_care_times"

# Neue Spalten auf mediation_care_times. request_* ersetzt swap_*.
# Als Fabriken, weil ein Column-Objekt nur einmal an eine Tabelle gebunden
# werden darf – upgrade() und downgrade() brauchen jeweils frische Instanzen.
NEW_COLUMNS = [
    # Anzeigename – bisher hatten nur Serienregeln ein label. Einzeltermine
    # brauchen einen, sobald sie Ferienblöcke sein können.
    ("title", lambda: sa.Column("title", sa.String(), nullable=True)),
    # betreuung | ferien | feiertag – rein darstellend, keine Logik daran.
    (
        "category",
        lambda: sa.Column(
            "category", sa.String(), nullable=False, server_default="betreuung"
        ),
    ),
    # tausch | zusatztag | absage | verschiebung
    ("request_kind", lambda: sa.Column("request_kind", sa.String(), nullable=True)),
    # offen | akzeptiert | abgelehnt | zurueckgezogen
    ("request_status", lambda: sa.Column("request_status", sa.String(), nullable=True)),
    ("request_by", lambda: sa.Column("request_by", sa.Integer(), nullable=True)),
    # Vorgeschlagene Zeiten (bei absage leer – dort gibt es nichts zu verschieben).
    ("request_start", lambda: sa.Column("request_start", sa.DateTime(), nullable=True)),
    ("request_end", lambda: sa.Column("request_end", sa.DateTime(), nullable=True)),
    ("request_message", lambda: sa.Column("request_message", sa.Text(), nullable=True)),
    (
        "request_answered_at",
        lambda: sa.Column("request_answered_at", sa.DateTime(), nullable=True),
    ),
]

OLD_SWAP_COLUMNS = [
    "swap_status",
    "swap_requested_by",
    "swap_proposed_start",
    "swap_proposed_end",
    "swap_message",
]


def _existing_columns(table: str) -> set[str]:
    bind = op.get_bind()
    return {row["name"] for row in sa.inspect(bind).get_columns(table)}


def upgrade() -> None:
    have = _existing_columns(TABLE)
    for name, make_column in NEW_COLUMNS:
        if name not in have:
            op.add_column(TABLE, make_column())

    # Vorhandene Tausch-Anfragen übernehmen. "angefragt" hieß offen; akzeptiert
    # und abgelehnt behalten ihren Namen. Nur Zeilen mit gesetztem swap_status,
    # damit unberührte Termine keine leere Anfrage bekommen.
    if "swap_status" in have:
        op.execute(
            sa.text(
                """
                UPDATE mediation_care_times
                   SET request_kind    = 'tausch',
                       request_status  = CASE swap_status
                                             WHEN 'angefragt' THEN 'offen'
                                             ELSE swap_status
                                         END,
                       request_by      = swap_requested_by,
                       request_start   = swap_proposed_start,
                       request_end     = swap_proposed_end,
                       request_message = swap_message
                 WHERE swap_status IS NOT NULL
                """
            )
        )

    # Alte Spalten entfernen. batch_alter_table, weil SQLite die Tabelle dafür
    # neu schreiben muss (siehe app/database.py – die Anwendung läuft auf
    # SQLite). Das passiert VOR create_table: beim Neuschreiben verschwindet
    # mediation_care_times kurzzeitig, und die Verlaufstabelle hängt mit einem
    # Fremdschlüssel daran.
    if "swap_status" in have:
        with op.batch_alter_table(TABLE) as batch:
            for name in OLD_SWAP_COLUMNS:
                if name in have:
                    batch.drop_column(name)

    # Verlauf. Für die übernommenen Tausch-Anfragen gibt es rückwirkend keinen
    # Verlauf – die alten Spalten haben nie festgehalten, wann etwas geschah.
    op.create_table(
        "mediation_care_request_events",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column(
            "mediation_id",
            sa.Integer(),
            sa.ForeignKey("mediations.id"),
            nullable=False,
            index=True,
        ),
        sa.Column(
            "care_time_id",
            sa.Integer(),
            sa.ForeignKey("mediation_care_times.id"),
            nullable=False,
            index=True,
        ),
        sa.Column(
            "participant_id",
            sa.Integer(),
            sa.ForeignKey("mediation_participants.id"),
            nullable=True,
        ),
        # angefragt | gegenvorschlag | akzeptiert | abgelehnt | zurueckgezogen
        sa.Column("action", sa.String(), nullable=False),
        sa.Column("kind", sa.String(), nullable=True),
        sa.Column("proposed_start", sa.DateTime(), nullable=True),
        sa.Column("proposed_end", sa.DateTime(), nullable=True),
        sa.Column("message", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("mediation_care_request_events")

    with op.batch_alter_table(TABLE) as batch:
        batch.add_column(sa.Column("swap_status", sa.String(), nullable=True))
        batch.add_column(sa.Column("swap_requested_by", sa.Integer(), nullable=True))
        batch.add_column(sa.Column("swap_proposed_start", sa.DateTime(), nullable=True))
        batch.add_column(sa.Column("swap_proposed_end", sa.DateTime(), nullable=True))
        batch.add_column(sa.Column("swap_message", sa.Text(), nullable=True))

    # Nur Tausch-Anfragen lassen sich zurückschreiben; zusatztag, absage und
    # verschiebung kannte das alte Modell nicht und gehen dabei verloren.
    op.execute(
        sa.text(
            """
            UPDATE mediation_care_times
               SET swap_status         = CASE request_status
                                             WHEN 'offen' THEN 'angefragt'
                                             ELSE request_status
                                         END,
                   swap_requested_by   = request_by,
                   swap_proposed_start = request_start,
                   swap_proposed_end   = request_end,
                   swap_message        = request_message
             WHERE request_kind = 'tausch' AND request_status IS NOT NULL
            """
        )
    )

    with op.batch_alter_table(TABLE) as batch:
        for name, _ in reversed(NEW_COLUMNS):
            batch.drop_column(name)
