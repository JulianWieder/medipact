"""Ergebnis-Anzeige-Schritt: Freigabe-Flag + Quell-Phase.

released (mediation_step_contents): steuert, ob der pro Fall kuratierte
Ergebnistext (body_text) für die Teilnehmer sichtbar ist. Ohne Freigabe des
Mediators bleibt er verborgen.

result_source_phase (phase_step_defaults): globale Grundregel für einen
Ergebnis-Anzeige-Schritt – aus welcher Phase die anzuzeigenden Ergebnisse
stammen (konkrete Freigabe erfolgt pro Fall).

Revision ID: u8j9k0l1m2n3
Revises: t7i8j9k0l1m2
Create Date: 2026-07-04
"""
from alembic import op
import sqlalchemy as sa

revision = "u8j9k0l1m2n3"
down_revision = "t7i8j9k0l1m2"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "mediation_step_contents",
        sa.Column("released", sa.Boolean(), nullable=False, server_default=sa.false()),
    )
    op.add_column(
        "phase_step_defaults",
        sa.Column("result_source_phase", sa.String(), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("phase_step_defaults", "result_source_phase")
    op.drop_column("mediation_step_contents", "released")
