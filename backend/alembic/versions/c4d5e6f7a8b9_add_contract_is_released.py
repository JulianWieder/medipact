"""add is_released to mediation_contracts

Revision ID: c4d5e6f7a8b9
Revises: b3c4d5e6f7a8
Branch_labels: None
depends_on: None

"""
from alembic import op
import sqlalchemy as sa

revision = "c4d5e6f7a8b9"
down_revision = "b3c4d5e6f7a8"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "mediation_contracts",
        sa.Column("is_released", sa.Boolean(), nullable=False, server_default=sa.false()),
    )


def downgrade() -> None:
    op.drop_column("mediation_contracts", "is_released")
