"""Fall-Flags + Sichtbarkeitsbedingungen (Fundament für Eskalation/Segmentierung).

mediations.flags (JSON): Fakten/Flags eines Falls, z.B. {"glasl_zone": "win_lose"}.
phase_step_defaults.visible_if (JSON): Bedingung gegen die Flags, z.B.
{"all": [{"flag": "glasl_zone", "eq": "lose_lose"}]}. NULL = immer sichtbar.
get_phase_steps blendet Schritte aus, deren Bedingung nicht erfüllt ist.

Revision ID: e8t9u0v1w2x3
Revises: d7s8t9u0v1w2
Create Date: 2026-07-06
"""
from alembic import op
import sqlalchemy as sa

revision = "e8t9u0v1w2x3"
down_revision = "d7s8t9u0v1w2"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("mediations", sa.Column("flags", sa.JSON(), nullable=True))
    op.add_column("phase_step_defaults", sa.Column("visible_if", sa.JSON(), nullable=True))


def downgrade() -> None:
    op.drop_column("phase_step_defaults", "visible_if")
    op.drop_column("mediations", "flags")
