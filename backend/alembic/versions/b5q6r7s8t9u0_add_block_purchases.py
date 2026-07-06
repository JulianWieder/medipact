"""Käufe kostenpflichtiger Bonus-Blöcke (z.B. Gutachter).

mediation_block_purchases: pro Fall, Partei und Block ein Eintrag. Preis kommt
aus der Block-Konfiguration (serverseitig gelesen), hier steht nur, ob und zu
welchem Betrag gekauft wurde. Solange paid=False bleibt der freigeschaltete
Inhalt verborgen.

Revision ID: b5q6r7s8t9u0
Revises: a4p5q6r7s8t9
Create Date: 2026-07-06
"""
from alembic import op
import sqlalchemy as sa

revision = "b5q6r7s8t9u0"
down_revision = "a4p5q6r7s8t9"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "mediation_block_purchases",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("mediation_id", sa.Integer(), nullable=False),
        sa.Column("participant_id", sa.Integer(), nullable=False),
        sa.Column("step_key", sa.String(), nullable=False),
        sa.Column("block_id", sa.String(), nullable=False),
        sa.Column("title", sa.String(), nullable=True),
        sa.Column("amount", sa.Float(), nullable=False, server_default="0"),
        sa.Column("currency", sa.String(), nullable=False, server_default="EUR"),
        sa.Column("paid", sa.Boolean(), nullable=False, server_default="0"),
        sa.Column("paypal_order_id", sa.String(), nullable=True),
        sa.Column("paid_at", sa.DateTime(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["mediation_id"], ["mediations.id"]),
        sa.ForeignKeyConstraint(["participant_id"], ["mediation_participants.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "mediation_id", "participant_id", "block_id",
            name="uq_block_purchase_party",
        ),
    )
    op.create_index(
        "ix_mediation_block_purchases_mediation_id",
        "mediation_block_purchases", ["mediation_id"],
    )
    op.create_index(
        "ix_mediation_block_purchases_block_id",
        "mediation_block_purchases", ["block_id"],
    )


def downgrade() -> None:
    op.drop_index("ix_mediation_block_purchases_block_id", table_name="mediation_block_purchases")
    op.drop_index("ix_mediation_block_purchases_mediation_id", table_name="mediation_block_purchases")
    op.drop_table("mediation_block_purchases")
