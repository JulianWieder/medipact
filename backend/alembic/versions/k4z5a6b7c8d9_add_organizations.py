"""Mandanten (organizations) + users.organization_id

Ein Mandant kann mehrere Mediatoren haben; das Abo (Plan, Monatspreis nach
Mediatoren-Anzahl) hängt am Mandanten. Preislogik: app/pricing.py.

Revision ID: k4z5a6b7c8d9
Revises: j3y4z5a6b7c8
Create Date: 2026-07-08
"""
from alembic import op
import sqlalchemy as sa

revision = "k4z5a6b7c8d9"
down_revision = "j3y4z5a6b7c8"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "organizations",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("plan", sa.String(), nullable=False, server_default="starter"),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_organizations_name", "organizations", ["name"], unique=True)

    # SQLite erzwingt keine nachträglichen FK-Constraints per add_column –
    # die Zuordnung wird in der Anwendung geprüft (routers/organizations.py).
    op.add_column("users", sa.Column("organization_id", sa.Integer(), nullable=True))
    op.create_index("ix_users_organization_id", "users", ["organization_id"])


def downgrade() -> None:
    op.drop_index("ix_users_organization_id", table_name="users")
    op.drop_column("users", "organization_id")
    op.drop_index("ix_organizations_name", table_name="organizations")
    op.drop_table("organizations")
