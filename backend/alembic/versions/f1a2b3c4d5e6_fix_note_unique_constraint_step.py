"""mediation_notes: Unique-Constraint endlich auf (…, phase, STEP) statt (…, phase).

Fehlerbild: „Fehler beim Speichern." beim ZWEITEN abgegebenen Schritt einer
Phase (zuerst aufgefallen in Phase 1, Schritt 2 „Ablauf der Mediation"):

    sqlite3.IntegrityError: UNIQUE constraint failed:
      mediation_notes.mediation_id, mediation_notes.participant_id,
      mediation_notes.phase

Drei Spalten, ohne `step`. `a1b2c3d4e5f6` hat die Tabelle mit
`uq_note_participant_phase` angelegt — damals gab es genau eine Notiz je Phase.
Als `f3a4b5c6d7e8` die Spalten `step`/`submitted` nachrüstete, blieb der
Constraint stehen, mit der Begründung, der schrittweise Constraint sei „bereits
beim initialen Setup gesetzt". Für diese Datenbank trifft das nicht zu.

Folge: `save_note` sucht nach (mediation_id, participant_id, phase, step),
findet für den neuen Schritt nichts und legt an — SQLite prüft aber nur die
ersten drei Spalten und weist das INSERT ab. Ein unbehandelter IntegrityError
wird zu einem 500er mit Klartext-Body, weshalb im Frontend nicht der Grund,
sondern nur der Fallback-Text „Fehler beim Speichern." ankam.

Der Umbau ist verlustfrei: der alte Constraint ist strenger als der neue, jede
vorhandene Zeile erfüllt den neuen also bereits. Es wird nichts dedupliziert
und nichts gelöscht.

SQLite kennt kein ALTER TABLE für Constraints, deshalb Batch-Modus: Alembic
legt die Tabelle neu an, kopiert die Daten und benennt um. `copy_from` gibt die
Struktur explizit vor, statt sie zu reflektieren — die Reflexion würde bei
SQLite den (namenlos gespeicherten) Constraint nicht sauber zurückliefern.

Revision ID: f1a2b3c4d5e6
Revises: e0f1a2b3c4d5
Create Date: 2026-08-05
"""
import sqlalchemy as sa
from alembic import op

revision = "f1a2b3c4d5e6"
down_revision = "e0f1a2b3c4d5"
branch_labels = None
depends_on = None

OLD_NAME = "uq_note_participant_phase"
NEW_NAME = "uq_note_participant_phase_step"


def _notes_table(constraint_name: str, columns: list[str]) -> sa.Table:
    """Struktur von mediation_notes, wie sie auf dem Server steht bzw. stehen
    soll. Muss zu app/models/mediation_note.py passen."""
    return sa.Table(
        "mediation_notes",
        sa.MetaData(),
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "mediation_id",
            sa.Integer(),
            sa.ForeignKey("mediations.id"),
            nullable=False,
        ),
        sa.Column(
            "participant_id",
            sa.Integer(),
            sa.ForeignKey("mediation_participants.id"),
            nullable=False,
        ),
        sa.Column("phase", sa.String(), nullable=False),
        sa.Column("step", sa.String(), nullable=False, server_default=""),
        sa.Column("content", sa.Text(), nullable=False, server_default=""),
        sa.Column(
            "submitted", sa.Boolean(), nullable=False, server_default=sa.false()
        ),
        sa.UniqueConstraint(*columns, name=constraint_name),
        sa.Index("ix_mediation_notes_id", "id"),
    )


def upgrade() -> None:
    old = _notes_table(OLD_NAME, ["mediation_id", "participant_id", "phase"])
    with op.batch_alter_table("mediation_notes", copy_from=old) as batch_op:
        batch_op.drop_constraint(OLD_NAME, type_="unique")
        batch_op.create_unique_constraint(
            NEW_NAME, ["mediation_id", "participant_id", "phase", "step"]
        )


def downgrade() -> None:
    # Zurück geht es nur, solange kein Teilnehmer mehr als einen Schritt je
    # Phase abgegeben hat — sonst verletzen die vorhandenen Zeilen den alten,
    # strengeren Constraint. Deshalb hier keine stille Löschung: lieber ein
    # klarer Abbruch als verschwundene Eingaben.
    bind = op.get_bind()
    dupes = bind.execute(
        sa.text(
            "SELECT COUNT(*) FROM ("
            "  SELECT 1 FROM mediation_notes"
            "  GROUP BY mediation_id, participant_id, phase"
            "  HAVING COUNT(*) > 1"
            ")"
        )
    ).scalar()
    if dupes:
        raise RuntimeError(
            f"{dupes} Teilnehmer-Phasen haben mehrere Schritt-Notizen — "
            "Downgrade würde Eingaben verlieren. Bitte vorher bereinigen."
        )
    new = _notes_table(
        NEW_NAME, ["mediation_id", "participant_id", "phase", "step"]
    )
    with op.batch_alter_table("mediation_notes", copy_from=new) as batch_op:
        batch_op.drop_constraint(NEW_NAME, type_="unique")
        batch_op.create_unique_constraint(
            OLD_NAME, ["mediation_id", "participant_id", "phase"]
        )
