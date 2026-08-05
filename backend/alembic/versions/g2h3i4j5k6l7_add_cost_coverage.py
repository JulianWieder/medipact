"""Freiwillige Kostenuebernahme: covered_by_participant_id.

Eine Partei darf den Anteil einer anderen mitbezahlen. Die Spalte steht auf
der UEBERNOMMENEN Zeile und zeigt auf die Teilnehmer-Zeile der Partei, die
zahlt (Self-FK auf mediation_participants.id).

Warum auf der uebernommenen Zeile und nicht als Liste beim Zahler: die Frage,
die im Code standig gestellt wird, lautet "muss DIESE Partei etwas zahlen?".
Mit dem Feld hier ist das ein Blick auf die eigene Zeile statt einer Suche
ueber alle Teilnehmer.

SQLite (Entwicklung) kennt kein nachtraegliches ADD CONSTRAINT; die
Fremdschluessel-Beziehung wird deshalb im Batch-Modus mitgegeben, was auf
Postgres ein normales ALTER TABLE ist.

Revision ID: g2h3i4j5k6l7
Revises: f1a2b3c4d5e6
Create Date: 2026-08-05
"""
import sqlalchemy as sa
from alembic import op

revision = "g2h3i4j5k6l7"
down_revision = "f1a2b3c4d5e6"
branch_labels = None
depends_on = None


def _has_column(bind, table: str, column: str) -> bool:
    return column in {c["name"] for c in sa.inspect(bind).get_columns(table)}


def upgrade() -> None:
    bind = op.get_bind()
    if _has_column(bind, "mediation_participants", "covered_by_participant_id"):
        return
    with op.batch_alter_table("mediation_participants") as batch:
        batch.add_column(
            sa.Column("covered_by_participant_id", sa.Integer(), nullable=True)
        )
        # "bundle" = der fremde Anteil steckt im Betrag des Uebernehmenden,
        # "separate" = diese Zeile traegt eine eigene PayPal-Reservierung.
        batch.add_column(sa.Column("coverage_mode", sa.String(), nullable=True))
        batch.create_foreign_key(
            "fk_participant_covered_by",
            "mediation_participants",
            ["covered_by_participant_id"],
            ["id"],
        )


def downgrade() -> None:
    bind = op.get_bind()
    if not _has_column(bind, "mediation_participants", "covered_by_participant_id"):
        return
    with op.batch_alter_table("mediation_participants") as batch:
        batch.drop_constraint("fk_participant_covered_by", type_="foreignkey")
        batch.drop_column("covered_by_participant_id")
        batch.drop_column("coverage_mode")
