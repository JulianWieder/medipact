"""Onboarding-Text: die freiwillige Kostenuebernahme erwaehnen.

Der Kosten-Abschnitt des Nutzer-Onboardings ("@user"/onboarding/so_funktioniert,
Block ob_kosten) sagte bisher nur, dass jede Partei ihren eigenen Anteil traegt.
Damit fehlte genau die Moeglichkeit, die viele Faelle ueberhaupt erst zustande
kommen laesst: eine Seite zahlt freiwillig fuer beide.

NUR wenn der Text noch der geseedete ist. Wer ihn im Workflow Manager schon
angefasst hat, bekommt hier nichts ueberschrieben - das ist dieselbe Regel wie
im urspruenglichen Seed (e0f1a2b3c4d5), der vorhandene Schritte in Ruhe laesst.
Frisch aufgesetzte Datenbanken bekommen den neuen Text direkt aus dem Seed.

Revision ID: h3i4j5k6l7m8
Revises: g2h3i4j5k6l7
Create Date: 2026-08-05
"""
import json

import sqlalchemy as sa
from alembic import op

revision = "h3i4j5k6l7m8"
down_revision = "g2h3i4j5k6l7"
branch_labels = None
depends_on = None

USER_TYPE = "@user"
PHASE = "onboarding"
STEP_KEY = "so_funktioniert"
BLOCK_ID = "ob_kosten"

OLD_TEXT = (
    "Die Kosten werden fair geteilt: jede Partei trägt ihren "
    "eigenen Anteil. Bezahlt wird im Verfahren selbst, im "
    "Schritt „Verfahren freischalten\". Der Betrag wird "
    "zunächst nur reserviert und erst abgebucht, wenn der "
    "Fall tatsächlich freigeschaltet ist."
)

NEW_TEXT = (
    "Die Kosten werden fair geteilt: jede Partei trägt ihren "
    "eigenen Anteil. Wer möchte, kann den Anteil der anderen "
    "Seite freiwillig mitbezahlen – ohne Gegenleistung und "
    "ohne dass sich dadurch am Verfahren etwas ändert. Du "
    "musst dich jetzt nicht entscheiden: das Angebot "
    "begegnet dir im Verfahren noch einmal.\n\n"
    "Bezahlt wird im Verfahren selbst, im Schritt "
    "„Verfahren freischalten\". Der Betrag wird zunächst nur "
    "reserviert und erst abgebucht, wenn der Fall "
    "tatsächlich freigeschaltet ist."
)


def _table():
    # Ueber die typisierte Tabelle statt per rohem SQL: `blocks` ist eine
    # JSON-Spalte. Ein String-Parameter waere auf Postgres ein Typfehler, und
    # beim Lesen bekommt man so schon die Python-Liste statt eines Strings.
    return sa.table(
        "phase_step_defaults",
        sa.column("id", sa.Integer),
        sa.column("mediation_type", sa.String),
        sa.column("phase", sa.String),
        sa.column("step_key", sa.String),
        sa.column("variant_key", sa.String),
        sa.column("blocks", sa.JSON),
    )


def _swap(from_text: str, to_text: str) -> None:
    conn = op.get_bind()
    psd = _table()
    row = conn.execute(
        sa.select(psd.c.id, psd.c.blocks).where(
            sa.and_(
                psd.c.mediation_type == USER_TYPE,
                psd.c.phase == PHASE,
                psd.c.step_key == STEP_KEY,
                psd.c.variant_key.is_(None),
            )
        )
    ).first()
    if not row:
        return

    blocks = row[1]
    if isinstance(blocks, str):
        blocks = json.loads(blocks or "[]")
    if not isinstance(blocks, list):
        return

    changed = False
    for block in blocks:
        if not isinstance(block, dict) or block.get("id") != BLOCK_ID:
            continue
        config = block.get("config") or {}
        if config.get("text") != from_text:
            # Von Hand angepasst -> in Ruhe lassen.
            continue
        config["text"] = to_text
        block["config"] = config
        changed = True

    if not changed:
        return

    conn.execute(psd.update().where(psd.c.id == row[0]).values(blocks=blocks))


def upgrade() -> None:
    _swap(OLD_TEXT, NEW_TEXT)


def downgrade() -> None:
    _swap(NEW_TEXT, OLD_TEXT)
