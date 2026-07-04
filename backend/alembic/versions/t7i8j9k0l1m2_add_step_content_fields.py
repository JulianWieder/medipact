"""Inhaltsfelder für Schritte + pro-Fall Inhalt (individuelle Schritte).

Erweitert phase_step_defaults um die tatsächlich pflegbaren Inhalte eines
Schritts, die bisher nur klassifiziert (content_types) aber nicht befüllt
werden konnten:
  - meeting_url:       Meeting-/Call-Link (Inhaltsart "videokonferenz")
  - question:          Frage-/Quiz-Inhalt (Inhaltsart "frage")
  - contract_template: Vorlagentext (Inhaltsart "vertrag")
(description/placeholder/video_url/feedback_occasion existieren bereits.)

Neu: mediation_step_contents – der fallbezogene Inhalt für Schritte, die als
"individuell" markiert sind (siehe MediationStepContent). Der Schritt wird
zentral im Workflow Manager definiert, sein Inhalt aber pro Fall gepflegt.

Revision ID: t7i8j9k0l1m2
Revises: s6h7i8j9k0l1
Create Date: 2026-07-04
"""
from alembic import op
import sqlalchemy as sa

revision = "t7i8j9k0l1m2"
down_revision = "s6h7i8j9k0l1"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("phase_step_defaults", sa.Column("meeting_url", sa.String(), nullable=True))
    op.add_column("phase_step_defaults", sa.Column("question", sa.Text(), nullable=True))
    op.add_column("phase_step_defaults", sa.Column("contract_template", sa.Text(), nullable=True))

    op.create_table(
        "mediation_step_contents",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column(
            "mediation_id",
            sa.Integer(),
            sa.ForeignKey("mediations.id"),
            nullable=False,
            index=True,
        ),
        sa.Column("phase", sa.String(), nullable=False, index=True),
        sa.Column("step_key", sa.String(), nullable=False),
        sa.Column("body_text", sa.Text(), nullable=True),
        sa.Column("video_url", sa.String(), nullable=True),
        sa.Column("meeting_url", sa.String(), nullable=True),
        sa.Column("question", sa.Text(), nullable=True),
        sa.Column("feedback_occasion", sa.String(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.UniqueConstraint(
            "mediation_id", "phase", "step_key", name="uq_mediation_step_content"
        ),
    )


def downgrade() -> None:
    op.drop_table("mediation_step_contents")
    op.drop_column("phase_step_defaults", "contract_template")
    op.drop_column("phase_step_defaults", "question")
    op.drop_column("phase_step_defaults", "meeting_url")
