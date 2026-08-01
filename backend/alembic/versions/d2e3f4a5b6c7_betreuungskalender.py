"""Betreuungskalender im Konflikt-Logbuch (Trennung): Plan- vs. Ist-Zeiten.

Zwei neue Tabellen für Trennungs-Logbücher (kostenlos, keine Paywall):

  • mediation_care_rules – Serienregeln als Wochenmuster ("jedes 2. Wochenende
    Fr 17:00 – So 18:00 bei Papa"). Werden beim Lesen zu Terminen expandiert
    (routers/betreuung.py), nichts wird materialisiert.
  • mediation_care_times – konkrete Termine: Einzeltermine (rule_id NULL)
    oder Overrides eines Serien-Vorkommens (rule_id + date). Hier werden die
    TATSÄCHLICHEN Betreuungszeiten (actual_start/actual_end) und der Status
    (geplant/stattgefunden/ausgefallen) erfasst – die Abweichung Plan↔Ist
    ist die eigentliche Dokumentationsleistung fürs Konflikt-Logbuch.

Sichtbarkeit je Zeile wie bei mediation_log_entries (y7z8a9b0c1d2):
private/personal/shared, gleicher Filter.

Revision ID: d2e3f4a5b6c7
Revises: c1d2e3f4a5b6
Create Date: 2026-08-01
"""
import sqlalchemy as sa
from alembic import op

revision = "d2e3f4a5b6c7"
down_revision = "c1d2e3f4a5b6"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "mediation_care_rules",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "mediation_id",
            sa.Integer(),
            sa.ForeignKey("mediations.id"),
            nullable=False,
            index=True,
        ),
        sa.Column(
            "author_participant_id",
            sa.Integer(),
            sa.ForeignKey("mediation_participants.id"),
            nullable=True,
        ),
        sa.Column("label", sa.String(), nullable=True),
        sa.Column("caregiver", sa.String(), nullable=True),
        sa.Column("start_weekday", sa.Integer(), nullable=False),
        sa.Column("start_time", sa.String(), nullable=False),
        sa.Column("end_weekday", sa.Integer(), nullable=False),
        sa.Column("end_time", sa.String(), nullable=False),
        sa.Column("interval_weeks", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("anchor_date", sa.String(), nullable=True),
        sa.Column("valid_from", sa.String(), nullable=True),
        sa.Column("valid_until", sa.String(), nullable=True),
        sa.Column(
            "visibility", sa.String(), nullable=False, server_default="personal"
        ),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )
    op.create_table(
        "mediation_care_times",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "mediation_id",
            sa.Integer(),
            sa.ForeignKey("mediations.id"),
            nullable=False,
            index=True,
        ),
        sa.Column(
            "author_participant_id",
            sa.Integer(),
            sa.ForeignKey("mediation_participants.id"),
            nullable=True,
        ),
        sa.Column(
            "rule_id",
            sa.Integer(),
            sa.ForeignKey("mediation_care_rules.id"),
            nullable=True,
            index=True,
        ),
        sa.Column("date", sa.String(), nullable=False, index=True),
        sa.Column("planned_start", sa.DateTime(), nullable=True),
        sa.Column("planned_end", sa.DateTime(), nullable=True),
        sa.Column("actual_start", sa.DateTime(), nullable=True),
        sa.Column("actual_end", sa.DateTime(), nullable=True),
        sa.Column("status", sa.String(), nullable=False, server_default="geplant"),
        sa.Column("caregiver", sa.String(), nullable=True),
        sa.Column("note", sa.Text(), nullable=True),
        # Betreuungszeiten-Tausch (nur bei geteilten Terminen): Vorschlag +
        # Antwort der Gegenseite, bei Annahme wird der Plan überschrieben.
        sa.Column("swap_status", sa.String(), nullable=True),
        sa.Column(
            "swap_requested_by",
            sa.Integer(),
            sa.ForeignKey("mediation_participants.id"),
            nullable=True,
        ),
        sa.Column("swap_proposed_start", sa.DateTime(), nullable=True),
        sa.Column("swap_proposed_end", sa.DateTime(), nullable=True),
        sa.Column("swap_message", sa.Text(), nullable=True),
        sa.Column(
            "visibility", sa.String(), nullable=False, server_default="personal"
        ),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("mediation_care_times")
    op.drop_table("mediation_care_rules")
