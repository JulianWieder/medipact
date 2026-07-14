"""Firmenkunden-Mandantenfähigkeit: mediations.organization_id + org-Abo-Felder.

Umbau vom Anbieter- zum Firmenkunden-Modell (siehe docs/business-mandanten-spec.md):

  • mediations.organization_id (FK -> organizations.id, nullable, indexiert):
    NULL = privater B2C-Fall (wie bisher), gesetzt = Fall eines Firmenkunden.
  • organizations.is_active: schaltet die internen Fälle des Unternehmens frei
    (Firmen-Abo statt Pro-Partei-Paywall).
  • organizations.billing_email: Rechnungsadresse am Unternehmen.

Die neue Rolle "firm_admin" ist ein reiner String-Wert in users.role und braucht
keine Schemaänderung.

Revision ID: m6c7d8e9f0a1
Revises: l5b6c7d8e9f0
Create Date: 2026-07-11
"""
from alembic import op
import sqlalchemy as sa

revision = "m6c7d8e9f0a1"
down_revision = "l5b6c7d8e9f0"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # SQLite erzwingt keine nachträglichen FK-Constraints per add_column – die
    # Zuordnung wird in der Anwendung geprüft (services/tenancy.py).
    op.add_column("mediations", sa.Column("organization_id", sa.Integer(), nullable=True))
    op.create_index(
        "ix_mediations_organization_id", "mediations", ["organization_id"]
    )

    op.add_column(
        "organizations",
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="1"),
    )
    op.add_column(
        "organizations", sa.Column("billing_email", sa.String(), nullable=True)
    )


def downgrade() -> None:
    op.drop_column("organizations", "billing_email")
    op.drop_column("organizations", "is_active")
    op.drop_index("ix_mediations_organization_id", table_name="mediations")
    op.drop_column("mediations", "organization_id")
