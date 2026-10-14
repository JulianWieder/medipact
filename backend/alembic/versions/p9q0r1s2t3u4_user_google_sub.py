"""Mit Google anmelden: users.google_sub

Speichert den sub-Claim des Google-ID-Tokens – die stabile Konto-ID bei
Google. Die E-Mail-Adresse taugt dafuer nicht als Schluessel: sie kann sich
bei Google aendern, der sub nicht. Nullable, weil die meisten Konten nie mit
Google verknuepft werden; unique, damit ein Google-Konto genau einem
medipact-Konto gehoert.

Revision ID: p9q0r1s2t3u4
Revises: n8o9p0q1r2s3
"""

from alembic import op
import sqlalchemy as sa


revision = "p9q0r1s2t3u4"
down_revision = "n8o9p0q1r2s3"
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table("users") as batch:
        batch.add_column(sa.Column("google_sub", sa.String(), nullable=True))
    op.create_index("ix_users_google_sub", "users", ["google_sub"], unique=True)


def downgrade() -> None:
    op.drop_index("ix_users_google_sub", "users")
    with op.batch_alter_table("users") as batch:
        batch.drop_column("google_sub")
