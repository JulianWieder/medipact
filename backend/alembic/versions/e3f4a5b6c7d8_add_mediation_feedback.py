"""add mediation_feedback table

Revision ID: e3f4a5b6c7d8
Revises: d5e6f7a8b9c0
Branch_labels: None
depends_on: None

"""
from alembic import op
import sqlalchemy as sa

revision = "e3f4a5b6c7d8"
down_revision = "d5e6f7a8b9c0"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "mediation_feedback",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("mediation_id", sa.Integer(), sa.ForeignKey("mediations.id"), nullable=False),
        sa.Column("participant_id", sa.Integer(), sa.ForeignKey("mediation_participants.id"), nullable=False),
        sa.Column("occasion", sa.String(50), nullable=False),
        sa.Column("answers", sa.Text(), nullable=False, server_default="{}"),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.UniqueConstraint("mediation_id", "participant_id", "occasion", name="uq_feedback_per_participant_occasion"),
    )


def downgrade() -> None:
    op.drop_table("mediation_feedback")
