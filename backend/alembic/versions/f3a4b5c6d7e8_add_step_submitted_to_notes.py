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


def _column_exists(table: str, column: str) -> bool:
    bind = op.get_bind()
    cols = [row[1] for row in bind.execute(sa.text(f"PRAGMA table_info({table})"))]
    return column in cols


def _constraint_exists(table: str, name: str) -> bool:
    bind = op.get_bind()
    rows = bind.execute(sa.text(f"PRAGMA index_list({table})")).fetchall()
    return any(row[1] == name for row in rows)


def upgrade() -> None:
    if not _column_exists('mediation_notes', 'step'):
        op.add_column('mediation_notes', sa.Column('step', sa.String(), nullable=False, server_default=''))
    if not _column_exists('mediation_notes', 'submitted'):
        op.add_column('mediation_notes', sa.Column('submitted', sa.Boolean(), nullable=False, server_default=sa.false()))

    # Constraint-Umbenennung wird in SQLite nicht per ALTER unterstützt –
    # der korrekte Constraint (uq_note_participant_phase_step) wurde bereits
    # beim initialen Setup gesetzt und existiert in der DB.


def downgrade() -> None:
    op.drop_constraint('uq_note_participant_phase_step', 'mediation_notes', type_='unique')
    op.create_unique_constraint(
        'uq_note_participant_phase',
        'mediation_notes',
        ['mediation_id', 'participant_id', 'phase'],
    )
    op.drop_column('mediation_notes', 'submitted')
    op.drop_column('mediation_notes', 'step')
