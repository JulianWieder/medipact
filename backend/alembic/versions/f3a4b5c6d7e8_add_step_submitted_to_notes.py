"""add step and submitted to mediation_notes

Revision ID: f3a4b5c6d7e8
Revises: e2f3a4b5c6d7
Create Date: 2026-06-08

"""
from alembic import op
import sqlalchemy as sa

revision = 'f3a4b5c6d7e8'
down_revision = 'e2f3a4b5c6d7'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Neue Spalten hinzufügen
    op.add_column('mediation_notes', sa.Column('step', sa.String(), nullable=False, server_default=''))
    op.add_column('mediation_notes', sa.Column('submitted', sa.Boolean(), nullable=False, server_default=sa.false()))

    # Alten UniqueConstraint entfernen und durch neuen ersetzen (phase + step)
    op.drop_constraint('uq_note_participant_phase', 'mediation_notes', type_='unique')
    op.create_unique_constraint(
        'uq_note_participant_phase_step',
        'mediation_notes',
        ['mediation_id', 'participant_id', 'phase', 'step'],
    )


def downgrade() -> None:
    op.drop_constraint('uq_note_participant_phase_step', 'mediation_notes', type_='unique')
    op.create_unique_constraint(
        'uq_note_participant_phase',
        'mediation_notes',
        ['mediation_id', 'participant_id', 'phase'],
    )
    op.drop_column('mediation_notes', 'submitted')
    op.drop_column('mediation_notes', 'step')
