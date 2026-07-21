"""Logbuch-Journal: Sichtbarkeit je Eintrag (private/personal/shared).

Das Konflikt-Logbuch (w5x6y7z8a9b0, x6y7z8a9b0c1) wird zum Journal ausgebaut:

  • private  – Journal-Eintrag: tiefe/geheime Gedanken, sieht ausschließlich
               die Autor:in – auch nach Umwandlung in eine Mediation niemals
               Mediator oder Gegenseite.
  • personal – Dokumentation (Default, bisheriges Verhalten): nur die
               Autor:in sieht den Eintrag.
  • shared   – in die Mediation gepusht: sichtbar für alle Teilnehmer des
               Falls (Mediator + Gegenseite).

Damit funktioniert das Logbuch auch NEBEN einer laufenden Mediation: Einträge
werden weiter privat dokumentiert und einzeln per Sichtbarkeits-Wechsel in die
Mediation geteilt (Filter in routers/logbuch.py, kein eigener Push-Endpunkt).

Revision ID: y7z8a9b0c1d2
Revises: x6y7z8a9b0c1
Create Date: 2026-07-21
"""
import sqlalchemy as sa
from alembic import op

revision = "y7z8a9b0c1d2"
down_revision = "x6y7z8a9b0c1"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "mediation_log_entries",
        sa.Column(
            "visibility",
            sa.String(),
            nullable=False,
            server_default="personal",
        ),
    )


def downgrade() -> None:
    op.drop_column("mediation_log_entries", "visibility")
