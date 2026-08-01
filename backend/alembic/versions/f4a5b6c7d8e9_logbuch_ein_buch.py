"""Ein-Buch-Umbau des Konflikt-Logbuchs: Bereich hängt am Eintrag.

Bisher war jedes Logbuch ein eigener Fall je Bereich (Trennung, Erbschaft …),
wodurch sich beim Testen/Anlegen beliebig viele identische Bücher ansammelten
(es gab weder eine Duplikat-Sperre noch einen Lösch-Endpunkt).

Neu: Pro Nutzer:in gibt es genau EIN Konflikt-Logbuch (create_mediation gibt
ein vorhandenes Buch zurück statt ein neues anzulegen); der Bereich wandert
als ``area`` an den einzelnen Eintrag (Tag/Filter, Werte = mediation_type-
Keys). Backfill: Bestandseinträge erben den Bereich ihres Buchs.

Revision ID: f4a5b6c7d8e9
Revises: d2e3f4a5b6c7
Create Date: 2026-08-01
"""
import sqlalchemy as sa
from alembic import op

revision = "f4a5b6c7d8e9"
down_revision = "d2e3f4a5b6c7"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "mediation_log_entries",
        sa.Column("area", sa.String(), nullable=True),
    )
    op.create_index(
        "ix_mediation_log_entries_area", "mediation_log_entries", ["area"]
    )
    # Bestandseinträge: Bereich vom (bisherigen) Buch übernehmen.
    op.execute(
        """
        UPDATE mediation_log_entries
        SET area = (
            SELECT m.mediation_type FROM mediations m
            WHERE m.id = mediation_log_entries.mediation_id
        )
        WHERE area IS NULL
        """
    )


def downgrade() -> None:
    op.drop_index("ix_mediation_log_entries_area", "mediation_log_entries")
    op.drop_column("mediation_log_entries", "area")
