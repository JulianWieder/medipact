"""add mediation_step_rules table

Revision ID: k8f9a0b1c2d3
Revises: j7e8f9a0b1c2
Create Date: 2026-06-18
"""
from alembic import op
import sqlalchemy as sa

revision = "k8f9a0b1c2d3"
down_revision = "j7e8f9a0b1c2"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "mediation_step_rules",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("mediation_id", sa.Integer(), sa.ForeignKey("mediations.id"), nullable=False, index=True),
        sa.Column("phase", sa.String(), nullable=False),
        sa.Column("step", sa.String(), nullable=False, server_default=""),
        sa.Column("required_roles", sa.String(), nullable=True),
        sa.Column("skip", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.UniqueConstraint("mediation_id", "phase", "step", name="uq_mediation_step_rule"),
    )


def downgrade() -> None:
    op.drop_table("mediation_step_rules")
