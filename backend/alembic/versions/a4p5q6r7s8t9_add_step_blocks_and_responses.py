"""Dynamischer Block-Aufbau der Schritte + Block-Antworten.

phase_step_defaults.blocks (JSON): geordnete Liste von Blöcken, aus denen die
Teilnehmer-Seite eines Schritts zusammengesetzt wird. Ein Block ist
{id, type, config, visible_if}. NULL = Rückfall auf die alten
content_types/Einzelspalten. Neue Blocktypen brauchen KEINE Migration.

mediation_block_responses: der pro Fall entstehende Inhalt je Block
(Texteingabe einer Partei, Antwort, Aufnahme/Transkript, Mediator-Notiz,
KI-Ausgabe) – getrennt nach Autor, damit die Beiträge am Ende ausgewertet
werden können (Reibungspunkte / Einigungschancen).

Revision ID: a4p5q6r7s8t9
Revises: z3o4p5q6r7s8
Create Date: 2026-07-06
"""
from alembic import op
import sqlalchemy as sa

revision = "a4p5q6r7s8t9"
down_revision = "z3o4p5q6r7s8"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("phase_step_defaults", sa.Column("blocks", sa.JSON(), nullable=True))

    op.create_table(
        "mediation_block_responses",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("mediation_id", sa.Integer(), nullable=False),
        sa.Column("phase", sa.String(), nullable=False),
        sa.Column("step_key", sa.String(), nullable=False),
        sa.Column("block_id", sa.String(), nullable=False),
        sa.Column("block_type", sa.String(), nullable=True),
        sa.Column("author_key", sa.String(), nullable=False),
        sa.Column("author_source", sa.String(), nullable=False, server_default="user"),
        sa.Column("author_participant_id", sa.Integer(), nullable=True),
        sa.Column("value", sa.JSON(), nullable=True),
        sa.Column("submitted", sa.Boolean(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["mediation_id"], ["mediations.id"]),
        sa.ForeignKeyConstraint(["author_participant_id"], ["mediation_participants.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "mediation_id", "step_key", "block_id", "author_key",
            name="uq_block_response_author",
        ),
    )
    op.create_index(
        "ix_mediation_block_responses_mediation_id",
        "mediation_block_responses", ["mediation_id"],
    )
    op.create_index(
        "ix_mediation_block_responses_phase",
        "mediation_block_responses", ["phase"],
    )
    op.create_index(
        "ix_mediation_block_responses_step_key",
        "mediation_block_responses", ["step_key"],
    )
    op.create_index(
        "ix_mediation_block_responses_block_id",
        "mediation_block_responses", ["block_id"],
    )


def downgrade() -> None:
    op.drop_index("ix_mediation_block_responses_block_id", table_name="mediation_block_responses")
    op.drop_index("ix_mediation_block_responses_step_key", table_name="mediation_block_responses")
    op.drop_index("ix_mediation_block_responses_phase", table_name="mediation_block_responses")
    op.drop_index("ix_mediation_block_responses_mediation_id", table_name="mediation_block_responses")
    op.drop_table("mediation_block_responses")
    op.drop_column("phase_step_defaults", "blocks")
