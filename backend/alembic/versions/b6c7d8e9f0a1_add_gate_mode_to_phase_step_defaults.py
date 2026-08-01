"""Fortschritts-Sperre je Schritt (phase_step_defaults.gate_mode).

Bisher war der Schritt-Navigator einer Phase frei anklickbar: man konnte
Schritt 5 öffnen, ohne Schritt 1 abgeschlossen zu haben. Diese Spalte macht
pro Schritt konfigurierbar, wann er den nächsten freigibt:

    NULL / "self" – Standard: die eigene Abgabe genügt
    "all"         – erst wenn alle nötigen Parteien abgegeben haben
    "none"        – sperrt nie (optionaler Schritt)

Bestandsdaten bleiben auf NULL und verhalten sich damit wie "self".

Revision ID: b6c7d8e9f0a1
Revises: a5b6c7d8e9f0
Create Date: 2026-08-01
"""
import sqlalchemy as sa
from alembic import op

revision = "b6c7d8e9f0a1"
down_revision = "a5b6c7d8e9f0"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "phase_step_defaults",
        sa.Column("gate_mode", sa.String(), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("phase_step_defaults", "gate_mode")
