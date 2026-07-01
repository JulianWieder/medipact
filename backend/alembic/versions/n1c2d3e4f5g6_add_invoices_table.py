"""add invoices table (participant_id + tax_rate included from the start)

Revision ID: n1c2d3e4f5g6
Revises: m0b1c2d3e4f5
Create Date: 2026-07-01

Für die `invoices`-Tabelle gab es bisher gar keine Migration, obwohl Model
(app/models/invoice.py) und Router (app/routers/invoices.py) schon existieren
– die Tabelle wurde also nie angelegt. Diese Migration holt das nach und
ergänzt gleich zwei neue Pflichtfelder:
  - participant_id: Rechnungen müssen jetzt einem einzelnen Teilnehmer
    (mediation_participants.id) zugeordnet sein, nicht nur dem Fall
    (mediation_id). Passt zur anteiligen Preisaufteilung (jede Partei
    bekommt ihre eigene Rechnung).
  - tax_rate: frei editierbarer Steuersatz in Prozent (z.B. 19.0, 7.0,
    0.0 bei Kleinunternehmerregelung), kein festes Enum.
"""
from alembic import op
import sqlalchemy as sa

revision = "n1c2d3e4f5g6"
down_revision = "m0b1c2d3e4f5"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "invoices",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("invoice_number", sa.String(), nullable=False, unique=True, index=True),
        sa.Column("mediation_id", sa.Integer(), sa.ForeignKey("mediations.id"), nullable=False),
        sa.Column(
            "participant_id",
            sa.Integer(),
            sa.ForeignKey("mediation_participants.id"),
            nullable=False,
        ),
        sa.Column("payer_name", sa.String(), nullable=True),
        sa.Column("payer_email", sa.String(), nullable=True),
        sa.Column("amount", sa.Float(), nullable=False),
        sa.Column("tax_rate", sa.Float(), nullable=False, server_default="19.0"),
        sa.Column("currency", sa.String(), nullable=False, server_default="EUR"),
        sa.Column("status", sa.String(), nullable=False, server_default="open"),
        sa.Column("paypal_order_id", sa.String(), nullable=True),
        sa.Column("issued_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("paid_at", sa.DateTime(), nullable=True),
        sa.Column("pdf_url", sa.String(), nullable=True),
    )
    op.create_index("ix_invoices_mediation_id", "invoices", ["mediation_id"])
    op.create_index("ix_invoices_participant_id", "invoices", ["participant_id"])


def downgrade() -> None:
    op.drop_index("ix_invoices_participant_id", table_name="invoices")
    op.drop_index("ix_invoices_mediation_id", table_name="invoices")
    op.drop_table("invoices")
