"""add mediation_appointment_slots and votes

Revision ID: d5e6f7a8b9c0
Revises: c4d5e6f7a8b9
Branch_labels: None
depends_on: None

"""
from alembic import op
import sqlalchemy as sa

revision = "d5e6f7a8b9c0"
down_revision = "c4d5e6f7a8b9"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "mediation_appointment_slots",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("mediation_id", sa.Integer(), sa.ForeignKey("mediations.id"), nullable=False),
        sa.Column("proposed_datetime", sa.DateTime(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )
    op.create_table(
        "mediation_appointment_votes",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("slot_id", sa.Integer(), sa.ForeignKey("mediation_appointment_slots.id"), nullable=False),
        sa.Column("participant_id", sa.Integer(), sa.ForeignKey("mediation_participants.id"), nullable=False),
        sa.Column("accepted", sa.Boolean(), nullable=False),
        sa.Column("voted_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.UniqueConstraint("slot_id", "participant_id", name="uq_vote_per_slot_participant"),
    )


def downgrade() -> None:
    op.drop_table("mediation_appointment_votes")
    op.drop_table("mediation_appointment_slots")
