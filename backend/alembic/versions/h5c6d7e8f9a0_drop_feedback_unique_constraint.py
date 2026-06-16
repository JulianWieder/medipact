"""drop unique constraint on mediation_feedback to allow feedback timeline

Revision ID: h5c6d7e8f9a0
Revises: g4b5c6d7e8f9
Branch_labels: None
depends_on: None

"""
from alembic import op


revision = "h5c6d7e8f9a0"
down_revision = "g4b5c6d7e8f9"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Bisher durfte pro Teilnehmer und Anlass nur ein Feedback-Eintrag existieren
    # (Upsert). Damit der Mediator den Zeitverlauf wiederholter Rückmeldungen
    # sehen kann, erlauben wir jetzt mehrere Einträge pro (mediation, participant,
    # occasion) — jede Einreichung wird als neue Zeile gespeichert (Historie).
    op.drop_constraint(
        "uq_feedback_per_participant_occasion",
        "mediation_feedback",
        type_="unique",
    )


def downgrade() -> None:
    op.create_unique_constraint(
        "uq_feedback_per_participant_occasion",
        "mediation_feedback",
        ["mediation_id", "participant_id", "occasion"],
    )
