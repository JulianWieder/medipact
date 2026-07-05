"""No-op (zurückgezogen).

Ursprünglich sollte diese Migration eine Tabelle `invite_settings` anlegen, um
die Video-Pflicht der Einladung pro Mediationsart zu speichern. Der Ansatz wurde
verworfen: die Einladung ist jetzt eine Phase ("einladung") im Workflow Manager
und wird über `phase_step_defaults` konfiguriert (siehe
routers/invites.py: effective_video_mode). Es wird KEINE neue Tabelle benötigt.

Die Migration bleibt als leerer Platzhalter erhalten, damit die Revisionskette
intakt bleibt, falls sie irgendwo bereits referenziert/angewandt wurde.

Revision ID: v9k0l1m2n3o4
Revises: u8j9k0l1m2n3
Create Date: 2026-07-05
"""

revision = "v9k0l1m2n3o4"
down_revision = "u8j9k0l1m2n3"
branch_labels = None
depends_on = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
