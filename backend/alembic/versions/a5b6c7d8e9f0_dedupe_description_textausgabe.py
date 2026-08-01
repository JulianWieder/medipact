"""Doppelten Beschreibungstext aus persistierten Schritt-Blöcken entfernen.

`deriveBlocksFromLegacy` (Frontend) hat beim ersten Öffnen eines Alt-Schritts
im Workflow-Designer die description zusätzlich als textausgabe-Block
abgeleitet UND persistiert. Da Teilnehmer-Ansicht und Vorschau die description
ohnehin über den Blöcken rendern, erschien der Text doppelt (z. B. Einleitung
→ "Einführung"). Das Frontend leitet die description inzwischen nicht mehr ab;
diese Migration räumt die bereits gespeicherten Duplikate auf: Aus
phase_step_defaults.blocks fliegen alle textausgabe-Blöcke, deren Text
(getrimmt) exakt der description des Schritts entspricht.

Revision ID: a5b6c7d8e9f0
Revises: f4a5b6c7d8e9
Create Date: 2026-08-01
"""
import json

import sqlalchemy as sa
from alembic import op

revision = "a5b6c7d8e9f0"
down_revision = "f4a5b6c7d8e9"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    rows = bind.execute(
        sa.text(
            "SELECT id, description, blocks FROM phase_step_defaults "
            "WHERE blocks IS NOT NULL AND description IS NOT NULL"
        )
    ).fetchall()

    for row_id, description, blocks in rows:
        desc = (description or "").strip()
        if not desc:
            continue
        if isinstance(blocks, str):
            try:
                blocks = json.loads(blocks)
            except ValueError:
                continue
        if not isinstance(blocks, list) or not blocks:
            continue

        cleaned = [
            b
            for b in blocks
            if not (
                isinstance(b, dict)
                and b.get("type") == "textausgabe"
                and str((b.get("config") or {}).get("text", "")).strip() == desc
            )
        ]
        if len(cleaned) == len(blocks):
            continue

        bind.execute(
            sa.text("UPDATE phase_step_defaults SET blocks = :blocks WHERE id = :id"),
            {"blocks": json.dumps(cleaned), "id": row_id},
        )


def downgrade() -> None:
    # Entfernte Duplikat-Blöcke lassen sich nicht sinnvoll rekonstruieren —
    # inhaltlich geht nichts verloren (der Text steht in description).
    pass
