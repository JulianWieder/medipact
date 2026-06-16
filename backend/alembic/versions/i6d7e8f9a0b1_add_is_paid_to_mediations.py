"""add is_paid to mediations

Revision ID: i6d7e8f9a0b1
Revises: h5c6d7e8f9a0
Branch_labels: None
depends_on: None

"""
from alembic import op
import sqlalchemy as sa

revision = "i6d7e8f9a0b1"
down_revision = "h5c6d7e8f9a0"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "mediations",
        sa.Column("is_paid", sa.Boolean(), nullable=False, server_default=sa.false()),
    )


def downgrade() -> None:
    op.drop_column("mediations", "is_paid")
