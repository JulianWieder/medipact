"""Zahlung reservieren statt sofort abbuchen (PayPal AUTHORIZE).

Bisher lief die Fall-Freischaltung mit PayPal ``intent="CAPTURE"``: der Betrag
jeder Partei wurde sofort abgebucht. Da eine Mediation aber erst startet, wenn
ALLE zahlungspflichtigen Parteien gezahlt haben, lag das Geld der ersten Partei
bei uns, obwohl der Fall womöglich nie zustande kam - im Widerspruch zum
Hinweis im Bezahl-Schritt ("Der Betrag wird zunächst nur reserviert und erst
nach erfolgreicher Freischaltung tatsächlich abgebucht").

Neuer Ablauf (siehe app/paypal.py und services/billing.py):
  1. Partei bestätigt in PayPal  -> Betrag wird RESERVIERT (authorized = True)
  2. sobald alle reserviert haben -> Einzug aller Autorisierungen (paid = True)
  3. Fall wird freigeschaltet     -> mediations.is_paid = True

Diese Migration ergänzt die dafür nötigen Felder an mediation_participants.

Bestandsdaten: bereits bezahlte Parteien (paid = true) werden auf
authorized = true gesetzt, damit sie in der neuen Logik nicht als "noch nicht
zugesagt" gelten und ein bereits freigeschalteter Fall freigeschaltet bleibt.
Eine paypal_authorization_id haben sie nicht - der Einzug ist bei ihnen ja
bereits erfolgt, und services/billing.py überspringt Parteien mit paid = True.

Revision ID: z8a9b0c1d2e3
Revises: y7z8a9b0c1d2
Create Date: 2026-07-27
"""
import sqlalchemy as sa
from alembic import op

revision = "z8a9b0c1d2e3"
down_revision = "y7z8a9b0c1d2"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "mediation_participants",
        sa.Column("authorized", sa.Boolean(), nullable=False, server_default=sa.false()),
    )
    op.add_column(
        "mediation_participants",
        sa.Column("authorized_at", sa.DateTime(), nullable=True),
    )
    op.add_column(
        "mediation_participants",
        sa.Column("paypal_authorization_id", sa.String(), nullable=True),
    )
    op.add_column(
        "mediation_participants",
        sa.Column("authorization_expires_at", sa.DateTime(), nullable=True),
    )

    # Bestandsdaten: was bezahlt ist, gilt auch als zugesagt.
    # Hinweis: hier stand ursprünglich "authorized = 1 ... WHERE paid = 1".
    # SQLite akzeptiert 1/0 für Boolean-Spalten, Postgres nicht ("column is of
    # type boolean but expression is of type integer") – true/false ist in
    # beiden Datenbanken gültig.
    op.execute(
        "UPDATE mediation_participants SET authorized = true, authorized_at = paid_at "
        "WHERE paid = true"
    )


def downgrade() -> None:
    op.drop_column("mediation_participants", "authorization_expires_at")
    op.drop_column("mediation_participants", "paypal_authorization_id")
    op.drop_column("mediation_participants", "authorized_at")
    op.drop_column("mediation_participants", "authorized")
