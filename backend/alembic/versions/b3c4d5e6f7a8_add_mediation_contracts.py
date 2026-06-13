"""add mediation_contracts and mediation_contract_signatures

Revision ID: b3c4d5e6f7a8
Revises: a2b3c4d5e6f7
Create Date: 2026-06-13

"""
from alembic import op
import sqlalchemy as sa

revision = "b3c4d5e6f7a8"
down_revision = "a2b3c4d5e6f7"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "mediation_contracts",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("mediation_id", sa.Integer(), sa.ForeignKey("mediations.id"), nullable=False, unique=True),
        sa.Column("generated_text", sa.Text(), nullable=False, server_default=""),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )
    op.create_table(
        "mediation_contract_signatures",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("contract_id", sa.Integer(), sa.ForeignKey("mediation_contracts.id"), nullable=False),
        sa.Column("participant_id", sa.Integer(), sa.ForeignKey("mediation_participants.id"), nullable=False),
        sa.Column("signed_name", sa.String(), nullable=False),
        sa.Column("signed_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.UniqueConstraint("contract_id", "participant_id", name="uq_signature_per_participant"),
    )


def downgrade() -> None:
    op.drop_table("mediation_contract_signatures")
    op.drop_table("mediation_contracts")
