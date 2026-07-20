"""Logbuch-Ausbau: Premium-Plan (14,95 €), KI-Analyse je Eintrag, Datei-Uploads.

Das kostenlose Konflikt-Logbuch (w5x6y7z8a9b0) bekommt zwei Stufen:

  • FREE    – 1 Datei-Upload pro Woche + 1 KI-Interpretation pro Woche.
  • PREMIUM – einmalig 14,95 € pro Logbuch: 1 KI-Tipp pro TAG + beliebig
              viele Datei-Uploads. (Zahlen zentral in app/pricing.py.)

Nach jedem Eintrag analysiert die KI (sofern Kontingent frei und der Eintrag
genug Substanz hat) und schlägt konkrete nächste Schritte vor (z.B. Anwalt
anrufen, Auszug schriftlich festhalten) plus einen kleinen psychologischen
Tipp. Ergebnis wird am Eintrag gespeichert (ai_analysis / ai_analysis_at –
ai_analysis_at zählt zugleich als Kontingent-Verbrauch).

Drei Bausteine:
  1. mediations.logbuch_plan ("free" | "premium").
  2. mediation_log_entries.ai_analysis (JSON) + ai_analysis_at (DateTime).
  3. mediation_log_uploads – Protokoll der Datei-Uploads (für die Wochen-Quote
     der Free-Stufe und die Anzeige in der Chronologie).
  4. Seed: datei_upload-Block "le_foto" in der WFM-Vorlage logbuch_eintrag
     (z.B. Foto vom halb leeren Schrank) – nur ergänzt, wenn noch nicht da;
     manuelle Designer-Anpassungen bleiben unberührt.

Revision ID: x6y7z8a9b0c1
Revises: w5x6y7z8a9b0
Create Date: 2026-07-20
"""
from datetime import datetime, timezone

import sqlalchemy as sa
from alembic import op

revision = "x6y7z8a9b0c1"
down_revision = "w5x6y7z8a9b0"
branch_labels = None
depends_on = None

TYPES = [
    "trennung", "erbschaft", "nachbarschaft", "wg", "verbraucher",
    "odr", "schlichtung", "ecommerce", "b2b",
]

FOTO_BLOCK = {
    "id": "le_foto",
    "type": "datei_upload",
    "config": {
        "prompt": (
            "Foto oder Dokument anhängen (optional) – z.B. ein Foto der "
            "Situation, ein Screenshot oder ein Beleg."
        ),
        "accept": "",
    },
    "visible_if": None,
}


def _psd():
    return sa.table(
        "phase_step_defaults",
        sa.column("id", sa.Integer),
        sa.column("mediation_type", sa.String),
        sa.column("phase", sa.String),
        sa.column("step_key", sa.String),
        sa.column("variant_key", sa.String),
        sa.column("blocks", sa.JSON),
        sa.column("updated_at", sa.DateTime),
    )


def upgrade() -> None:
    # 1. Logbuch-Stufe des Falls.
    op.add_column(
        "mediations",
        sa.Column("logbuch_plan", sa.String(), nullable=False, server_default="free"),
    )

    # 2. KI-Analyse am Eintrag.
    op.add_column("mediation_log_entries", sa.Column("ai_analysis", sa.JSON(), nullable=True))
    op.add_column(
        "mediation_log_entries", sa.Column("ai_analysis_at", sa.DateTime(), nullable=True)
    )

    # 3. Upload-Protokoll (Quote + Anzeige).
    op.create_table(
        "mediation_log_uploads",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column(
            "mediation_id",
            sa.Integer(),
            sa.ForeignKey("mediations.id"),
            nullable=False,
            index=True,
        ),
        sa.Column("token", sa.String(), nullable=False, unique=True),
        sa.Column("name", sa.String(), nullable=True),
        sa.Column("size_bytes", sa.Integer(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )

    # 4. Seed: Foto-Block an die Eintrag-Vorlage anhängen (idempotent).
    conn = op.get_bind()
    now = datetime.now(timezone.utc)
    psd = _psd()
    for t in TYPES:
        row = conn.execute(
            sa.select(psd.c.id, psd.c.blocks).where(
                sa.and_(
                    psd.c.mediation_type == t,
                    psd.c.phase == "logbuch",
                    psd.c.step_key == "logbuch_eintrag",
                    psd.c.variant_key.is_(None),
                )
            )
        ).first()
        if not row:
            continue
        blocks = list(row[1] or [])
        if any(isinstance(b, dict) and b.get("id") == "le_foto" for b in blocks):
            continue
        blocks.append(FOTO_BLOCK)
        conn.execute(
            psd.update().where(psd.c.id == row[0]).values(blocks=blocks, updated_at=now)
        )


def downgrade() -> None:
    op.drop_table("mediation_log_uploads")
    op.drop_column("mediation_log_entries", "ai_analysis_at")
    op.drop_column("mediation_log_entries", "ai_analysis")
    op.drop_column("mediations", "logbuch_plan")
