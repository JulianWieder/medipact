"""Merker für versendete Ablauf-Erinnerungen bei Zahlungsreservierungen.

scripts/check_authorizations.py läuft stündlich und erinnert die säumige Partei,
wenn die Reservierung der Gegenseite bald verfällt. Ohne Merker ginge diese
Mail bei jedem Lauf erneut raus - also bis zu 24 Mal. Das Feld hält fest, dass
für DIESE Reservierung bereits erinnert wurde; beim Zurücksetzen der
Reservierung (services/billing.py clear_participant_authorization) wird es
wieder geleert, sodass eine neue Reservierung erneut erinnern darf.

Revision ID: a9b0c1d2e3f4
Revises: z8a9b0c1d2e3
Create Date: 2026-07-27
"""
import sqlalchemy as sa
from alembic import op

revision = "a9b0c1d2e3f4"
down_revision = "z8a9b0c1d2e3"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "mediation_participants",
        sa.Column("authorization_reminder_sent_at", sa.DateTime(), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("mediation_participants", "authorization_reminder_sent_at")
