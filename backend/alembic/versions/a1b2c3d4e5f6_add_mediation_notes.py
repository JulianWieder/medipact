"""add mediation notes

Revision ID: a1b2c3d4e5f6
Revises: c5186840d064
Create Date: 2026-05-14 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, Sequence[str], None] = 'c5186840d064'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'mediation_notes',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('mediation_id', sa.Integer(), sa.ForeignKey('mediations.id'), nullable=False),
        sa.Column('participant_id', sa.Integer(), sa.ForeignKey('mediation_participants.id'), nullable=False),
        sa.Column('phase', sa.String(), nullable=False),
        sa.Column('content', sa.Text(), nullable=False, server_default=''),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('mediation_id', 'participant_id', 'phase', name='uq_note_participant_phase'),
    )
    op.create_index(op.f('ix_mediation_notes_id'), 'mediation_notes', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_mediation_notes_id'), table_name='mediation_notes')
    op.drop_table('mediation_notes')
