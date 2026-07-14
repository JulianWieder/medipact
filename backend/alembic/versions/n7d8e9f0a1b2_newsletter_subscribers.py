"""Newsletter-Anmeldungen: Tabelle newsletter_subscribers.

Sammelt E-Mail-Adressen aus dem Newsletter-Formular auf der Landing Page und
im Footer. Einfaches Speichern (kein Double-Opt-in): active=True beim Eintrag.

Revision ID: n7d8e9f0a1b2
Revises: m6c7d8e9f0a1
Create Date: 2026-07-11
"""
from alembic import op
import sqlalchemy as sa

revision = "n7d8e9f0a1b2"
down_revision = "m6c7d8e9f0a1"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "newsletter_subscribers",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("email", sa.String(), nullable=False),
        sa.Column("active", sa.Boolean(), nullable=False, server_default="1"),
        sa.Column("source", sa.String(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("unsubscribed_at", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        "ix_newsletter_subscribers_email",
        "newsletter_subscribers",
        ["email"],
        unique=True,
    )
    op.create_index(
        "ix_newsletter_subscribers_id", "newsletter_subscribers", ["id"]
    )


def downgrade() -> None:
    op.drop_index(
        "ix_newsletter_subscribers_id", table_name="newsletter_subscribers"
    )
    op.drop_index(
        "ix_newsletter_subscribers_email", table_name="newsletter_subscribers"
    )
    op.drop_table("newsletter_subscribers")
