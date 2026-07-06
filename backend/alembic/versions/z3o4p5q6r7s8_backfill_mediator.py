"""backfill default mediator participant for existing mediations

Ordnet jedem bestehenden Fall ohne Mediator den Standard-Mediator
(jw_mediator@medipact.de) zu – aber nur, wenn dieser Nutzer existiert.
Legt bewusst KEINEN Nutzer an.

Revision ID: z3o4p5q6r7s8
Revises: y2n3o4p5q6r7
Create Date: 2026-07-05
"""
from alembic import op

revision = "z3o4p5q6r7s8"
down_revision = "y2n3o4p5q6r7"
branch_labels = None
depends_on = None

# Muss zu settings.DEFAULT_MEDIATOR_EMAIL passen.
DEFAULT_MEDIATOR_EMAIL = "jw_mediator@medipact.de"


def upgrade() -> None:
    op.execute(
        f"""
        INSERT INTO mediation_participants (mediation_id, user_id, role)
        SELECT m.id, u.id, 'mediator'
        FROM mediations m
        CROSS JOIN (
            SELECT id FROM users WHERE lower(email) = lower('{DEFAULT_MEDIATOR_EMAIL}') LIMIT 1
        ) u
        WHERE NOT EXISTS (
            SELECT 1 FROM mediation_participants p
            WHERE p.mediation_id = m.id AND p.role = 'mediator'
        )
        """
    )


def downgrade() -> None:
    # Entfernt nur die durch den Backfill angelegten Standard-Mediator-Zuordnungen.
    op.execute(
        f"""
        DELETE FROM mediation_participants
        WHERE role = 'mediator'
          AND user_id = (
            SELECT id FROM users WHERE lower(email) = lower('{DEFAULT_MEDIATOR_EMAIL}') LIMIT 1
          )
        """
    )
