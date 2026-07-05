"""Editierbare KI-Prompts (ai_prompts).

Speichert pro `key` einen überschriebenen Prompt-Text. Fehlt ein Key, gilt der
Default aus app/prompts.py. Wird im Workflow Manager gepflegt.

Revision ID: w0l1m2n3o4p5
Revises: v9k0l1m2n3o4
Create Date: 2026-07-05
"""
from alembic import op
import sqlalchemy as sa

revision = "w0l1m2n3o4p5"
down_revision = "v9k0l1m2n3o4"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "ai_prompts",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("key", sa.String(), nullable=False),
        sa.Column("template", sa.Text(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_ai_prompts_id", "ai_prompts", ["id"])
    op.create_unique_constraint("uq_ai_prompts_key", "ai_prompts", ["key"])


def downgrade() -> None:
    op.drop_constraint("uq_ai_prompts_key", "ai_prompts", type_="unique")
    op.drop_index("ix_ai_prompts_id", table_name="ai_prompts")
    op.drop_table("ai_prompts")
