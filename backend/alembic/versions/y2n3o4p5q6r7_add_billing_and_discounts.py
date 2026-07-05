"""per-participant payment, mediation package, discount codes

Revision ID: y2n3o4p5q6r7
Revises: x1m2n3o4p5q6
Create Date: 2026-07-05
"""
from alembic import op
import sqlalchemy as sa

revision = "y2n3o4p5q6r7"
down_revision = "x1m2n3o4p5q6"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Paket am Fall
    op.add_column(
        "mediations",
        sa.Column("package", sa.String(), nullable=False, server_default="online"),
    )

    # Zahlung pro Teilnehmer
    op.add_column("mediation_participants", sa.Column("amount_due", sa.Float(), nullable=True))
    op.add_column(
        "mediation_participants",
        sa.Column("paid", sa.Boolean(), nullable=False, server_default="0"),
    )
    op.add_column("mediation_participants", sa.Column("paid_at", sa.DateTime(), nullable=True))
    op.add_column("mediation_participants", sa.Column("paypal_order_id", sa.String(), nullable=True))
    op.add_column("mediation_participants", sa.Column("discount_code", sa.String(), nullable=True))
    op.add_column(
        "mediation_participants",
        sa.Column("discount_amount", sa.Float(), nullable=False, server_default="0"),
    )

    # Rabattcodes
    op.create_table(
        "discount_codes",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("code", sa.String(), nullable=False),
        sa.Column("kind", sa.String(), nullable=False, server_default="percent"),
        sa.Column("value", sa.Float(), nullable=False, server_default="0"),
        sa.Column("scope", sa.String(), nullable=False, server_default="participant"),
        sa.Column("active", sa.Boolean(), nullable=False, server_default="1"),
        sa.Column("max_uses", sa.Integer(), nullable=True),
        sa.Column("used_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("valid_until", sa.DateTime(), nullable=True),
        sa.Column("restrict_type", sa.String(), nullable=True),
        sa.Column("restrict_package", sa.String(), nullable=True),
        sa.Column("description", sa.String(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_discount_codes_code", "discount_codes", ["code"], unique=True)


def downgrade() -> None:
    op.drop_index("ix_discount_codes_code", table_name="discount_codes")
    op.drop_table("discount_codes")

    op.drop_column("mediation_participants", "discount_amount")
    op.drop_column("mediation_participants", "discount_code")
    op.drop_column("mediation_participants", "paypal_order_id")
    op.drop_column("mediation_participants", "paid_at")
    op.drop_column("mediation_participants", "paid")
    op.drop_column("mediation_participants", "amount_due")

    op.drop_column("mediations", "package")
