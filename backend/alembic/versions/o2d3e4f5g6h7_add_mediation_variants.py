"""add mediation_variants table + variant_key on phase_step_defaults

Revision ID: o2d3e4f5g6h7
Revises: n1c2d3e4f5g6
Create Date: 2026-07-01

Erlaubt es, pro Mediationstyp frei benennbare Varianten anzulegen (z.B.
"Trennung mit Kindern" als Variante von "trennung"). Varianten sind additiv:
die Standard-Schritte (phase_step_defaults.variant_key IS NULL) gelten
weiterhin für jeden Fall dieses Typs; eine Variante kann zusätzliche/
abweichende Schritte definieren, die nur greifen, wenn diese Variante für
einen konkreten Fall gewählt wird (Zuordnung Fall <-> Variante ist bewusst
noch nicht Teil dieser Migration).
"""
from alembic import op
import sqlalchemy as sa

revision = "o2d3e4f5g6h7"
down_revision = "n1c2d3e4f5g6"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "mediation_variants",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("mediation_type", sa.String(), nullable=False, index=True),
        sa.Column("key", sa.String(), nullable=False),
        sa.Column("label", sa.String(), nullable=False),
        sa.Column("description", sa.Text(), nullable=False, server_default=""),
        sa.Column("position", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("enabled", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.UniqueConstraint("mediation_type", "key", name="uq_mediation_variant_key"),
    )

    # SQLite kann Constraints nicht per ALTER TABLE ändern, daher batch mode
    # (Tabelle wird per copy-and-move-Strategie neu aufgebaut).
    with op.batch_alter_table("phase_step_defaults") as batch_op:
        batch_op.add_column(sa.Column("variant_key", sa.String(), nullable=True))
        batch_op.create_index(
            "ix_phase_step_defaults_variant_key", ["variant_key"], unique=False
        )
        batch_op.drop_constraint("uq_phase_step_default", type_="unique")
        batch_op.create_unique_constraint(
            "uq_phase_step_default_variant",
            ["mediation_type", "phase", "step_key", "variant_key"],
        )


def downgrade() -> None:
    with op.batch_alter_table("phase_step_defaults") as batch_op:
        batch_op.drop_constraint("uq_phase_step_default_variant", type_="unique")
        batch_op.create_unique_constraint(
            "uq_phase_step_default", ["mediation_type", "phase", "step_key"]
        )
        batch_op.drop_index("ix_phase_step_defaults_variant_key")
        batch_op.drop_column("variant_key")

    op.drop_table("mediation_variants")
