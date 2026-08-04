"""Nutzer-Onboarding: Tabelle user_onboarding_responses + Stammdaten am User.

UMBAU: Onboarding gehoert der PERSON, nicht dem Fall.
──────────────────────────────────────────────────────────────────────────────
Bisher steckte das Onboarding als fest verdrahtete 3-Schritte-Checkliste in
JEDEM Fall (app/dashboard/[id]/MediationClient.tsx): Beteiligte verbinden,
Rechnungsdaten hinterlegen, Mediation starten. Zwei Folgen davon:

  1. Die Rechnungsdaten mussten in jedem neuen Fall erneut eingegeben werden —
     sie lagen an mediation_participants, nicht an der Person.
  2. Die Erklaerinhalte ("So laeuft die Mediation ab", Vertraulichkeit) sah man
     bei jedem Fall wieder, obwohl sie nur beim ersten Mal relevant sind.

Neu: Ein einmaliges Nutzer-Onboarding VOR der Fallbearbeitung. Diese Migration
legt nur das Schema an; die Schritte selbst kommen im Seed (e0f1a2b3c4d5) und
sind danach im Workflow Manager unter dem Pseudo-Typ "@user" pflegbar.

Was hier passiert:
  - users.onboarding_completed_at  -> Sperre billig pruefbar, ohne bei jedem
    Request die komplette Blockliste durchzurechnen.
  - users.phone / billing_street / billing_postal_code / billing_city
    -> Stammdaten an der Person. mediation_participants.billing_* bleibt
    bestehen und dient weiterhin der fall-spezifischen Ausnahme (abweichende
    Rechnungsanschrift); es wird kuenftig aus dem Profil vorbefuellt.
  - user_onboarding_responses -> die Antworten, analog mediation_block_responses,
    aber ohne mediation_id/author_key (pro Person genau eine Antwort je Block).

Bestandsnutzer: onboarding_completed_at bleibt NULL, sie durchlaufen das
Onboarding also beim naechsten Login. Das ist gewollt — genau dort werden ihre
Stammdaten erstmals erfasst. Wer die Sperre fuer Bestandsnutzer NICHT will,
setzt die Spalte in einem separaten Schritt auf now().

Revision ID: d9e0f1a2b3c4
Revises: c8d9e0f1a2b3
Create Date: 2026-08-04
"""
import sqlalchemy as sa
from alembic import op

revision = "d9e0f1a2b3c4"
down_revision = "c8d9e0f1a2b3"
branch_labels = None
depends_on = None


# Neue Spalten an users. Idempotent angelegt: die Datenbanken von Dev und
# Server sind in der Vergangenheit auseinandergelaufen, ein blindes add_column
# bricht dann die ganze Kette.
_USER_COLUMNS = [
    ("onboarding_completed_at", sa.DateTime(), True),
    ("phone", sa.String(), True),
    ("billing_street", sa.String(), True),
    ("billing_postal_code", sa.String(), True),
    ("billing_city", sa.String(), True),
]


def _existing_user_columns(bind) -> set:
    return {c["name"] for c in sa.inspect(bind).get_columns("users")}


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    existing = _existing_user_columns(bind)
    for name, coltype, nullable in _USER_COLUMNS:
        if name not in existing:
            op.add_column("users", sa.Column(name, coltype, nullable=nullable))

    if "user_onboarding_responses" not in inspector.get_table_names():
        op.create_table(
            "user_onboarding_responses",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("user_id", sa.Integer(), nullable=False),
            sa.Column("step_key", sa.String(), nullable=False),
            sa.Column("block_id", sa.String(), nullable=False),
            sa.Column("block_type", sa.String(), nullable=True),
            sa.Column("value", sa.JSON(), nullable=True),
            sa.Column("created_at", sa.DateTime(), nullable=False),
            sa.Column("updated_at", sa.DateTime(), nullable=False),
            sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
            sa.PrimaryKeyConstraint("id"),
            sa.UniqueConstraint(
                "user_id", "step_key", "block_id",
                name="uq_user_onboarding_response",
            ),
        )
        op.create_index(
            "ix_user_onboarding_responses_user_id",
            "user_onboarding_responses",
            ["user_id"],
        )
        op.create_index(
            "ix_user_onboarding_responses_step_key",
            "user_onboarding_responses",
            ["step_key"],
        )
        op.create_index(
            "ix_user_onboarding_responses_block_id",
            "user_onboarding_responses",
            ["block_id"],
        )


def downgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if "user_onboarding_responses" in inspector.get_table_names():
        op.drop_table("user_onboarding_responses")

    existing = _existing_user_columns(bind)
    for name, _coltype, _nullable in _USER_COLUMNS:
        if name in existing:
            op.drop_column("users", name)
