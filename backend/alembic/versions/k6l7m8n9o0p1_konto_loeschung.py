"""Konto-Löschung: Wunsch am Nutzer vermerken

Zwei Felder, nur für Parteien laufender Verfahren. Wer in keinem Verfahren
steckt, wird sofort gelöscht – dort bleibt keine Zeile übrig, an der ein Datum
stehen könnte (siehe app/services/konto.py).

Hintergrund: Google Play verlangt für Apps mit Nutzerkonten eine Löschfunktion
in der App UND eine öffentlich erreichbare Web-Adresse dafür. Ohne die gibt es
keine Freigabe im Play Store.

Revision ID: k6l7m8n9o0p1
Revises: j5k6l7m8n9o0
"""

from alembic import op
import sqlalchemy as sa


revision = "k6l7m8n9o0p1"
down_revision = "j5k6l7m8n9o0"
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table("users") as batch:
        batch.add_column(sa.Column("deletion_requested_at", sa.DateTime(), nullable=True))
        batch.add_column(sa.Column("deletion_note", sa.String(), nullable=True))


def downgrade() -> None:
    with op.batch_alter_table("users") as batch:
        batch.drop_column("deletion_note")
        batch.drop_column("deletion_requested_at")
