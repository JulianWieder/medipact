"""Konflikt-Logbuch (kostenlos): mediations.mode + mediation_log_entries + WFM-Seeds.

Neues Angebot direkt nach der Konto-Erstellung: Statt sofort eine (kostenpflichtige)
Mediation zu starten, kann ein "Streit angelegt" und dokumentiert werden –
Vorkommnisse, Gedanken, Gespräche, E-Mails, WhatsApp, Telefonate. Kostenlos,
ohne Gegenseiten-Kommunikation; jederzeit in eine Mediation umwandelbar.

Drei Bausteine:
  1. mediations.mode ("mediation" | "logbuch") – Betriebsart des Falls.
  2. mediation_log_entries – beliebig viele Einträge je Logbuch (die Form der
     Einträge kommt aus dem WFM, siehe 3.).
  3. Seeds in phase_step_defaults, Phase "logbuch" (im Designer editierbar):
       • logbuch_intake  – geführtes Anlegen des Streits (einmalig)
       • logbuch_eintrag – VORLAGE für das Eintrags-Formular (Blöcke = Felder)

Die Seeds sind für alle Typen identisch (generisch formuliert) und idempotent
(Upsert wie bei l5b6c7d8e9f0: erkannt an der ersten Block-id).

Revision ID: w5x6y7z8a9b0
Revises: v4w5x6y7z8a9
Create Date: 2026-07-19
"""
from datetime import datetime, timezone

import sqlalchemy as sa
from alembic import op

revision = "w5x6y7z8a9b0"
down_revision = "v4w5x6y7z8a9"
branch_labels = None
depends_on = None

TYPES = [
    "trennung", "erbschaft", "nachbarschaft", "wg", "verbraucher",
    "odr", "schlichtung", "ecommerce", "b2b",
]


def _b(bid, btype, **config):
    return {"id": bid, "type": btype, "config": config, "visible_if": None}


# ── Seed 1: Geführtes Anlegen des Streits (einmalig beim Erstellen) ──────────

INTAKE_BLOCKS = [
    _b("lb_intro", "textausgabe",
       title="Ihr Konflikt-Logbuch.",
       text=(
           "Manchmal ist es zu früh für eine Mediation – aber genau der richtige "
           "Zeitpunkt, alles festzuhalten. Dokumentieren Sie hier kostenlos, was "
           "in Ihrem Konflikt passiert: Vorkommnisse, Gespräche, E-Mails, "
           "WhatsApp-Nachrichten, Telefonate und Ihre Gedanken dazu. So entsteht "
           "eine saubere Chronologie – Ihr Gedächtnisprotokoll. Alles bleibt "
           "vertraulich; die Gegenseite erfährt nichts davon. Wenn Sie später "
           "eine Mediation starten, nehmen Sie Ihr Logbuch einfach mit."
       )),
    _b("lb_situation", "frage", map_to="description", prompt=(
        "Worum geht es? Beschreiben Sie den Konflikt kurz in Ihren Worten – "
        "als würden Sie es einer guten Freundin erzählen."
    )),
    _b("lb_beteiligte", "frage", prompt=(
        "Wer ist beteiligt – und in welchem Verhältnis stehen Sie zueinander?"
    )),
    _b("lb_seit", "datum", label="Seit wann schwelt der Konflikt ungefähr?",
       help="Ein ungefähres Datum reicht völlig."),
    _b("lb_ziel", "frage", prompt=(
        "Was wäre für Sie ein gutes Ergebnis – was soll am Ende anders sein?"
    )),
]

# ── Seed 2: VORLAGE für einen Logbuch-Eintrag (Felder des Formulars) ─────────
#
# Die Eintragsart (Vorkommnis/Gedanke/Gespräch/E-Mail/WhatsApp/Telefonat) wählt
# die Nutzer:in im Frontend als festen Chip; die Blöcke hier definieren die
# restlichen Felder. Werte landen in mediation_log_entries.content ({block_id: wert}).

ENTRY_BLOCKS = [
    _b("le_wann", "datum", label="Wann war das?",
       help="Datum des Ereignisses – nicht das heutige Datum."),
    _b("le_was", "frage", prompt="Was ist passiert?",
       placeholder=(
           "Beschreiben Sie das Ereignis so konkret wie möglich – Ort, Anlass, "
           "Verlauf. Bei E-Mails oder WhatsApp: Worum ging es?"
       )),
    _b("le_wortlaut", "frage", prompt="Wortlaut oder Zitate (optional)",
       placeholder=(
           "Fügen Sie hier den Text der E-Mail/WhatsApp-Nachricht ein oder "
           "notieren Sie prägnante Sätze aus dem Gespräch/Telefonat – möglichst "
           "wörtlich."
       )),
    _b("le_beteiligte", "frage", prompt="Wer war beteiligt – gab es Zeugen?"),
    _b("le_gedanken", "frage", prompt="Ihre Gedanken dazu (optional)",
       placeholder="Wie haben Sie die Situation erlebt? Was beschäftigt Sie daran?"),
    _b("le_belastung", "skala",
       prompt="Wie belastend war das für Sie?",
       min=1, max=10, minLabel="kaum", maxLabel="sehr stark"),
]

SEED_STEPS = [
    {
        "step_key": "logbuch_intake",
        "title": "Ihren Streit anlegen",
        "description": "Der geführte Einstieg ins Konflikt-Logbuch: Worum geht es, wer ist beteiligt, seit wann?",
        "blocks": INTAKE_BLOCKS,
        "position": 0,
    },
    {
        "step_key": "logbuch_eintrag",
        "title": "Logbuch-Eintrag (Vorlage)",
        "description": "Vorlage für neue Einträge: Diese Blöcke sind die Felder des Eintrag-Formulars.",
        "blocks": ENTRY_BLOCKS,
        "position": 1,
    },
]


def _psd():
    return sa.table(
        "phase_step_defaults",
        sa.column("id", sa.Integer),
        sa.column("mediation_type", sa.String),
        sa.column("phase", sa.String),
        sa.column("step_key", sa.String),
        sa.column("variant_key", sa.String),
        sa.column("title", sa.String),
        sa.column("description", sa.Text),
        sa.column("placeholder", sa.Text),
        sa.column("reflection_mode", sa.String),
        sa.column("content_types", sa.String),
        sa.column("blocks", sa.JSON),
        sa.column("position", sa.Integer),
        sa.column("enabled", sa.Boolean),
        sa.column("created_at", sa.DateTime),
        sa.column("updated_at", sa.DateTime),
    )


def upgrade() -> None:
    # 1. Betriebsart des Falls.
    op.add_column(
        "mediations",
        sa.Column("mode", sa.String(), nullable=False, server_default="mediation"),
    )

    # 2. Logbuch-Einträge.
    op.create_table(
        "mediation_log_entries",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column(
            "mediation_id",
            sa.Integer(),
            sa.ForeignKey("mediations.id"),
            nullable=False,
            index=True,
        ),
        sa.Column(
            "author_participant_id",
            sa.Integer(),
            sa.ForeignKey("mediation_participants.id"),
            nullable=True,
        ),
        sa.Column("entry_type", sa.String(), nullable=False, server_default="vorkommnis"),
        sa.Column("occurred_at", sa.DateTime(), nullable=True),
        sa.Column("title", sa.String(), nullable=True),
        sa.Column("content", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )

    # 3. WFM-Seeds (Phase "logbuch", im Designer editierbar).
    conn = op.get_bind()
    now = datetime.now(timezone.utc)
    psd = _psd()
    for t in TYPES:
        for step in SEED_STEPS:
            exists = conn.execute(
                sa.select(psd.c.id, psd.c.blocks).where(
                    sa.and_(
                        psd.c.mediation_type == t,
                        psd.c.phase == "logbuch",
                        psd.c.step_key == step["step_key"],
                        psd.c.variant_key.is_(None),
                    )
                )
            ).first()
            if exists:
                # Nur aktualisieren, wenn noch der (alte) Seed-Inhalt drinsteht –
                # manuelle Designer-Anpassungen bleiben unberührt.
                current = exists[1] or []
                want_first = step["blocks"][0]["id"]
                have_first = (
                    current[0].get("id")
                    if current and isinstance(current[0], dict)
                    else None
                )
                if have_first != want_first:
                    conn.execute(
                        psd.update()
                        .where(psd.c.id == exists[0])
                        .values(blocks=step["blocks"], title=step["title"], updated_at=now)
                    )
                continue
            conn.execute(
                psd.insert().values(
                    mediation_type=t,
                    phase="logbuch",
                    step_key=step["step_key"],
                    variant_key=None,
                    title=step["title"],
                    description=step["description"],
                    placeholder="",
                    reflection_mode=None,
                    content_types=None,
                    blocks=step["blocks"],
                    position=step["position"],
                    enabled=True,
                    created_at=now,
                    updated_at=now,
                )
            )


def downgrade() -> None:
    conn = op.get_bind()
    psd = _psd()
    conn.execute(
        psd.delete().where(
            sa.and_(
                psd.c.phase == "logbuch",
                psd.c.step_key.in_([s["step_key"] for s in SEED_STEPS]),
                psd.c.variant_key.is_(None),
            )
        )
    )
    op.drop_table("mediation_log_entries")
    op.drop_column("mediations", "mode")
