"""Firmen-Onboarding-Finalisierung: Servicevertrag + Zahlung am Unternehmen.

Unternehmensweite, einmalige Finalisierung des Firmen-Onboardings (siehe
docs/business-mandanten-spec.md): Servicevertrag per Kurz-Unterschrift +
Zahlung (Rechnung/Abo oder PayPal). Felder liegen am Unternehmen, nicht am Fall.

Revision ID: o8e9f0a1b2c3
Revises: n7d8e9f0a1b2
Create Date: 2026-07-11
"""
from alembic import op
import sqlalchemy as sa

revision = "o8e9f0a1b2c3"
down_revision = "n7d8e9f0a1b2"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("organizations", sa.Column("contract_signed_at", sa.DateTime(), nullable=True))
    op.add_column("organizations", sa.Column("contract_signer_name", sa.String(), nullable=True))
    op.add_column("organizations", sa.Column("onboarding_payment_method", sa.String(), nullable=True))
    op.add_column("organizations", sa.Column("onboarding_paid_at", sa.DateTime(), nullable=True))
    op.add_column("organizations", sa.Column("onboarding_paypal_order_id", sa.String(), nullable=True))
    op.add_column("organizations", sa.Column("onboarding_completed_at", sa.DateTime(), nullable=True))


def downgrade() -> None:
    op.drop_column("organizations", "onboarding_completed_at")
    op.drop_column("organizations", "onboarding_paypal_order_id")
    op.drop_column("organizations", "onboarding_paid_at")
    op.drop_column("organizations", "onboarding_payment_method")
    op.drop_column("organizations", "contract_signer_name")
    op.drop_column("organizations", "contract_signed_at")
