"""Logbuch-Einträge mit einem Fall verknüpfen (statt sie wie Fälle zu führen).

Bisher war ein Konflikt-Logbuch selbst ein Fall (mediations.mode="logbuch") und
tauchte damit überall dort auf, wo Fälle gelistet werden – im Workspace stand
das private Logbuch einer Nutzer:in zwischen echten Mediationen.

Neu: Das Logbuch bleibt ein eigenes, privates Buch und wird NICHT mehr als Fall
gelistet. Stattdessen können Einträge mit einem Fall verknüpft werden und
erscheinen dort in einem eigenen Reiter:

  * ``mediation_log_entries.linked_mediation_id`` – Verknüpfung je EINTRAG
    (Teilnehmer:in entscheidet pro Eintrag).
  * ``mediations.linked_mediation_id`` – nur bei mode="logbuch": der
    Standard-Fall des Buchs ("ganzes Logbuch verknüpfen"). Neue Einträge erben
    diesen Fall; die Buch-Verknüpfung trägt ihn zusätzlich einmalig auf die
    vorhandenen Einträge nach (siehe routers/logbuch.py link_book).

Sichtbarkeit im Fall (Julians Entscheidung): verknüpft = für den Mediator
sichtbar, die Gegenseite sieht weiterhin nur ausdrücklich geteilte
(visibility="shared") Einträge; "private" bleibt in jedem Fall unsichtbar und
wird gar nicht erst verknüpft.

Revision ID: a7b8c9d0e1f2
Revises: b6c7d8e9f0a1
Create Date: 2026-08-01
"""
import sqlalchemy as sa
from alembic import op

revision = "a7b8c9d0e1f2"
down_revision = "b6c7d8e9f0a1"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "mediation_log_entries",
        sa.Column("linked_mediation_id", sa.Integer(), nullable=True),
    )
    op.create_index(
        "ix_mediation_log_entries_linked_mediation_id",
        "mediation_log_entries",
        ["linked_mediation_id"],
    )
    op.add_column(
        "mediations",
        sa.Column("linked_mediation_id", sa.Integer(), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("mediations", "linked_mediation_id")
    op.drop_index(
        "ix_mediation_log_entries_linked_mediation_id", "mediation_log_entries"
    )
    op.drop_column("mediation_log_entries", "linked_mediation_id")
