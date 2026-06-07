"""add password reset fields to users

Revision ID: e2f3a4b5c6d7
Revises: d1e2f3a4b5c6
Create Date: 2026-06-04 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "e2f3a4b5c6d7"
down_revision: Union[str, None] = "d1e2f3a4b5c6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column("password_reset_token", sa.String(), nullable=True),
    )
    op.add_column(
        "users",
        sa.Column("password_reset_token_expires", sa.DateTime(), nullable=True),
    )
    op.create_index(
        op.f("ix_users_password_reset_token"),
        "users",
        ["password_reset_token"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_users_password_reset_token"), table_name="users")
    op.drop_column("users", "password_reset_token_expires")
    op.drop_column("users", "password_reset_token")
