"""add variant_key to mediations (Zuordnung Fall <-> Mediations-Variante)

Revision ID: q4f5g6h7i8j9
Revises: p3e4f5g6h7i8
Create Date: 2026-07-03

Komplettiert das Varianten-Feature aus o2d3e4f5g6h7: bisher konnten Varianten
nur angelegt und mit Schritten versehen werden (phase_step_defaults.variant_key),
aber keinem Fall zugeordnet werden. Diese Migration ergänzt die Zuordnung:
mediations.variant_key referenziert MediationVariant.key innerhalb des
mediation_type des Falls. NULL = Basis-Workflow ohne Variante.

Kein FK auf mediation_variants.id, sondern der key als String — bewusst
konsistent mit phase_step_defaults.variant_key (gleiche Konvention), und
damit das Löschen einer Variante Fälle nicht blockiert (verwaiste keys
fallen auf den Basis-Workflow zurück, siehe get_phase_steps).
"""
from alembic import op
import sqlalchemy as sa

revision = "q4f5g6h7i8j9"
down_revision = "p3e4f5g6h7i8"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "mediations",
        sa.Column("variant_key", sa.String(), nullable=True),
    )
    op.create_index(
        "ix_mediations_variant_key", "mediations", ["variant_key"]
    )


def downgrade() -> None:
    op.drop_index("ix_mediations_variant_key", table_name="mediations")
    op.drop_column("mediations", "variant_key")
