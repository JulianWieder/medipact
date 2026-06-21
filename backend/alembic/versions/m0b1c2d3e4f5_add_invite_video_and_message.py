"""add personal_message, personal_message_paraphrased, video_filename to mediation_invites

Revision ID: m0b1c2d3e4f5
Revises: l9a0b1c2d3e4
Create Date: 2026-06-21
"""
from alembic import op
import sqlalchemy as sa

revision = "m0b1c2d3e4f5"
down_revision = "l9a0b1c2d3e4"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("mediation_invites", sa.Column("personal_message", sa.Text(), nullable=True))
    op.add_column("mediation_invites", sa.Column("personal_message_paraphrased", sa.Text(), nullable=True))
    op.add_column("mediation_invites", sa.Column("video_filename", sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column("mediation_invites", "video_filename")
    op.drop_column("mediation_invites", "personal_message_paraphrased")
    op.drop_column("mediation_invites", "personal_message")
