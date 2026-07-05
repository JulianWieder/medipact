"""add invite_meet_recordings table + meet columns on mediation_invites

Revision ID: x1m2n3o4p5q6
Revises: w0l1m2n3o4p5
Create Date: 2026-07-05
"""
from alembic import op
import sqlalchemy as sa

revision = "x1m2n3o4p5q6"
down_revision = "w0l1m2n3o4p5"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "invite_meet_recordings",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "mediation_id",
            sa.Integer(),
            sa.ForeignKey("mediations.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("token", sa.String(), nullable=False),
        sa.Column("space_name", sa.String(), nullable=False),
        sa.Column("meeting_uri", sa.String(), nullable=False),
        sa.Column("kind", sa.String(), nullable=False, server_default="video"),
        sa.Column("status", sa.String(), nullable=False, server_default="pending"),
        sa.Column("recording_uri", sa.String(), nullable=True),
        sa.Column("recording_file_id", sa.String(), nullable=True),
        sa.Column("transcript", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index(
        "ix_invite_meet_recordings_mediation_id",
        "invite_meet_recordings",
        ["mediation_id"],
    )
    op.create_index(
        "ix_invite_meet_recordings_token",
        "invite_meet_recordings",
        ["token"],
        unique=True,
    )

    op.add_column("mediation_invites", sa.Column("meet_recording_uri", sa.String(), nullable=True))
    op.add_column("mediation_invites", sa.Column("meet_transcript", sa.Text(), nullable=True))
    op.add_column("mediation_invites", sa.Column("message_kind", sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column("mediation_invites", "message_kind")
    op.drop_column("mediation_invites", "meet_transcript")
    op.drop_column("mediation_invites", "meet_recording_uri")
    op.drop_index("ix_invite_meet_recordings_token", table_name="invite_meet_recordings")
    op.drop_index("ix_invite_meet_recordings_mediation_id", table_name="invite_meet_recordings")
    op.drop_table("invite_meet_recordings")
