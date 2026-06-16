"""add mediator_confirmed_at to mediation_appointment_slots

Revision ID: j7e8f9a0b1c2
Revises: i6d7e8f9a0b1
Branch_labels: None
depends_on: None

"""
from alembic import op
import sqlalchemy as sa

revision = "j7e8f9a0b1c2"
down_revision = "i6d7e8f9a0b1"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "mediation_appointment_slots",
        sa.Column("mediator_confirmed_at", sa.DateTime(), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("mediation_appointment_slots", "mediator_confirmed_at")
