"""add note_reactions table

Revision ID: a2b3c4d5e6f7
Revises: f3a4b5c6d7e8
Create Date: 2026-06-12

"""
from alembic import op
import sqlalchemy as sa

revision = "a2b3c4d5e6f7"
down_revision = "f3a4b5c6d7e8"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "note_reactions",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("mediation_id", sa.Integer(), sa.ForeignKey("mediations.id"), nullable=False),
        sa.Column("phase", sa.String(), nullable=False),
        sa.Column("step", sa.String(), nullable=False, server_default=""),
        sa.Column("from_participant_id", sa.Integer(), sa.ForeignKey("mediation_participants.id"), nullable=False),
        sa.Column("target_participant_id", sa.Integer(), sa.ForeignKey("mediation_participants.id"), nullable=False),
        sa.Column("item_index", sa.Integer(), nullable=False),
        sa.Column("action", sa.String(), nullable=False),
        sa.Column("trade_item_index", sa.Integer(), nullable=True),
        sa.UniqueConstraint(
            "mediation_id", "phase", "step",
            "from_participant_id", "target_participant_id", "item_index",
            name="uq_reaction_per_item",
        ),
    )


def downgrade() -> None:
    op.drop_table("note_reactions")
