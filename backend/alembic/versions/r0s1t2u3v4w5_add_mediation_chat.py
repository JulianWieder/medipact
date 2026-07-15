"""Fall-Chat: Tabelle mediation_chat_messages.

Freier Gruppenchat pro Mediation (alle Parteien + Mediator), unabhängig von
Phasen/Schritten — für Austausch außerhalb des vorgegebenen Workflows.

Revision ID: r0s1t2u3v4w5
Revises: q9r0s1t2u3v4
Create Date: 2026-07-15
"""
import sqlalchemy as sa
from alembic import op

revision = "r0s1t2u3v4w5"
down_revision = "q9r0s1t2u3v4"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "mediation_chat_messages",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "mediation_id",
            sa.Integer(),
            sa.ForeignKey("mediations.id"),
            nullable=False,
        ),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("body", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index(
        "ix_mediation_chat_messages_mediation_id",
        "mediation_chat_messages",
        ["mediation_id"],
    )


def downgrade() -> None:
    op.drop_index(
        "ix_mediation_chat_messages_mediation_id", table_name="mediation_chat_messages"
    )
    op.drop_table("mediation_chat_messages")
