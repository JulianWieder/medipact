"""Inhaltsarten + Video-URL für phase_step_defaults.

content_types: komma-separierte Liste (text, video, frage, videokonferenz,
feedback, termin, vertrag) — die Karteikarten im Workflow-Manager können
damit pro Schritt die enthaltenen Inhaltsarten ausweisen. NULL = Bestand,
noch nicht klassifiziert.

video_url: vom Mediator hinterlegte Video-URL (Platzhalter, solange Videos
extern gehostet werden); nur relevant wenn "video" in content_types.

Revision ID: r5g6h7i8j9k0
Revises: q4f5g6h7i8j9
Create Date: 2026-07-03
"""
from alembic import op
import sqlalchemy as sa

revision = "r5g6h7i8j9k0"
down_revision = "q4f5g6h7i8j9"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("phase_step_defaults", sa.Column("content_types", sa.String(), nullable=True))
    op.add_column("phase_step_defaults", sa.Column("video_url", sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column("phase_step_defaults", "video_url")
    op.drop_column("phase_step_defaults", "content_types")
