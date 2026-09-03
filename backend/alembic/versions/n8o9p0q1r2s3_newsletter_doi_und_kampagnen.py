"""Newsletter: Double-Opt-in, Abmelde-Token und Kampagnen

Die erste Fassung des Sammlers speicherte E-Mail-Adressen sofort als aktiv.
Für den Versand in Deutschland reicht das nicht: § 7 UWG verlangt eine
nachweisbare Einwilligung, und nachweisbar ist sie erst mit dem Klick in der
Bestätigungsmail (Double-Opt-in). Deshalb:

  * `confirmed` / `confirm_token` / `confirmed_at` – die Einwilligung selbst.
  * `consent_ip` / `consent_at` – der Nachweis, wann und woher sie kam.
  * `unsubscribe_token` – der Abmeldelink, der in JEDER Mail stehen muss.

Bestandszeilen werden bewusst NICHT auf `confirmed = true` gesetzt: für sie
existiert kein Nachweis. Sie bekommen eine Bestätigungsmail oder bleiben außen
vor (siehe /newsletter/subscribers im Admin).

Dazu die Kampagnen: `newsletter_campaigns` hält den Entwurf,
`newsletter_deliveries` das Versandprotokoll je Empfänger – ohne das lässt sich
nach einem abgebrochenen Versand nicht sagen, wer die Mail schon hatte.

Revision ID: n8o9p0q1r2s3
Revises: k6l7m8n9o0p1
"""

from alembic import op
import sqlalchemy as sa


revision = "n8o9p0q1r2s3"
down_revision = "k6l7m8n9o0p1"
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table("newsletter_subscribers") as batch:
        batch.add_column(
            sa.Column(
                "confirmed",
                sa.Boolean(),
                nullable=False,
                server_default=sa.false(),
            )
        )
        batch.add_column(sa.Column("confirm_token", sa.String(), nullable=True))
        batch.add_column(sa.Column("confirmed_at", sa.DateTime(), nullable=True))
        batch.add_column(sa.Column("unsubscribe_token", sa.String(), nullable=True))
        batch.add_column(sa.Column("consent_ip", sa.String(), nullable=True))
        batch.add_column(sa.Column("consent_at", sa.DateTime(), nullable=True))

    op.create_index(
        "ix_newsletter_subscribers_confirm_token",
        "newsletter_subscribers",
        ["confirm_token"],
        unique=True,
    )
    op.create_index(
        "ix_newsletter_subscribers_unsubscribe_token",
        "newsletter_subscribers",
        ["unsubscribe_token"],
        unique=True,
    )

    op.create_table(
        "newsletter_campaigns",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("subject", sa.String(), nullable=False),
        sa.Column("heading", sa.String(), nullable=False, server_default=""),
        sa.Column("body", sa.Text(), nullable=False, server_default=""),
        sa.Column("cta_label", sa.String(), nullable=True),
        sa.Column("cta_url", sa.String(), nullable=True),
        # draft -> sending -> sent (oder failed, wenn der Versand abbrach)
        sa.Column("status", sa.String(), nullable=False, server_default="draft"),
        sa.Column("created_by", sa.String(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("sent_at", sa.DateTime(), nullable=True),
        sa.Column("sent_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("failed_count", sa.Integer(), nullable=False, server_default="0"),
    )

    op.create_table(
        "newsletter_deliveries",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column(
            "campaign_id",
            sa.Integer(),
            sa.ForeignKey("newsletter_campaigns.id", ondelete="CASCADE"),
            nullable=False,
            index=True,
        ),
        sa.Column("email", sa.String(), nullable=False),
        # sent | failed
        sa.Column("status", sa.String(), nullable=False),
        sa.Column("error", sa.String(), nullable=True),
        sa.Column("sent_at", sa.DateTime(), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("newsletter_deliveries")
    op.drop_table("newsletter_campaigns")
    op.drop_index("ix_newsletter_subscribers_unsubscribe_token", "newsletter_subscribers")
    op.drop_index("ix_newsletter_subscribers_confirm_token", "newsletter_subscribers")
    with op.batch_alter_table("newsletter_subscribers") as batch:
        batch.drop_column("consent_at")
        batch.drop_column("consent_ip")
        batch.drop_column("unsubscribe_token")
        batch.drop_column("confirmed_at")
        batch.drop_column("confirm_token")
        batch.drop_column("confirmed")
