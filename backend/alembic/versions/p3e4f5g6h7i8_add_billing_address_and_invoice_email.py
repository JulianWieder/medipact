"""add billing address fields + invoice email_sent_at

Revision ID: p3e4f5g6h7i8
Revises: o2d3e4f5g6h7
Create Date: 2026-07-01

Ermöglicht das automatische Erstellen einer Rechnung, wenn ein Fall
gestartet wird (siehe update_mediation in routers/mediations.py):
- mediation_participants bekommt eine Rechnungsadresse (Straße/PLZ/Ort) pro
  Fall, die vor dem Start abgefragt wird.
- invoices bekommt dieselben Adressfelder als Schnappschuss zum Zeitpunkt
  der Rechnungserstellung, sowie email_sent_at, um zu tracken, ob/wann ein
  Admin die Rechnung nach Prüfung per E-Mail freigegeben/verschickt hat
  (Rechnungen gehen nie automatisch per E-Mail raus, nur als PDF).
"""
from alembic import op
import sqlalchemy as sa

revision = "p3e4f5g6h7i8"
down_revision = "o2d3e4f5g6h7"
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table("mediation_participants") as batch_op:
        batch_op.add_column(sa.Column("billing_street", sa.String(), nullable=True))
        batch_op.add_column(sa.Column("billing_postal_code", sa.String(), nullable=True))
        batch_op.add_column(sa.Column("billing_city", sa.String(), nullable=True))

    with op.batch_alter_table("invoices") as batch_op:
        batch_op.add_column(sa.Column("billing_street", sa.String(), nullable=True))
        batch_op.add_column(sa.Column("billing_postal_code", sa.String(), nullable=True))
        batch_op.add_column(sa.Column("billing_city", sa.String(), nullable=True))
        batch_op.add_column(sa.Column("email_sent_at", sa.DateTime(), nullable=True))


def downgrade() -> None:
    with op.batch_alter_table("invoices") as batch_op:
        batch_op.drop_column("email_sent_at")
        batch_op.drop_column("billing_city")
        batch_op.drop_column("billing_postal_code")
        batch_op.drop_column("billing_street")

    with op.batch_alter_table("mediation_participants") as batch_op:
        batch_op.drop_column("billing_city")
        batch_op.drop_column("billing_postal_code")
        batch_op.drop_column("billing_street")
