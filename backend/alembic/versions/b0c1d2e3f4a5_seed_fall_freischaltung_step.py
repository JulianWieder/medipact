"""Seed: Bezahl-Schritt "fall_freischaltung" in der Einladungs-Phase.

UMBAU: Zahlung ist kein Onboarding-Schritt mehr, sondern Teil des Workflows.
──────────────────────────────────────────────────────────────────────────────
Bisher lag die Zahlung in der Onboarding-Checkliste des Falls (fester Schritt 3
"Mediation freischalten" in MediationClient.tsx) und der Fall konnte erst NACH
vollständiger Zahlung gestartet werden.

Neu: Der Fall startet unbezahlt in der Einladungs-Phase, und dort steht die
Zahlung als ganz normaler, im WorkflowManager gestaltbarer Schritt - direkt
hinter dem Start-Intake (l5b6c7d8e9f0). Der Mediator kann Position, Überschrift
und Erklärtext damit selbst pflegen.

Warum ausgerechnet die Einladungs-Phase: Sie ist die einzige Phase, die vor der
Zahlung erreichbar ist (Paywall-Ausnahme in routers/block_responses.py und
services/billing.ensure_unlocked). Alle späteren Phasen bleiben gesperrt, bis
jede zahlungspflichtige Partei bezahlt hat - die Paywall ist also unverändert
wirksam, sie greift nur an einer anderen Stelle im Ablauf.

Der Block selbst (Typ "fall_freischaltung") hat bewusst nur Überschrift und
Erklärtext als Konfiguration: Betrag, Rabattcodes und Add-ons stammen aus der
Preis-Matrix des Falls (app/pricing.py), nicht aus der Schritt-Konfiguration.

Idempotent: legt den Schritt nur an, wenn er für (Typ, einladung) fehlt.
Bestehende Schritte ab Position 1 werden um +1 nach hinten geschoben, damit der
Bezahl-Schritt direkt hinter dem Intake (Position 0) landet.

Revision ID: b0c1d2e3f4a5
Revises: a9b0c1d2e3f4
Create Date: 2026-07-27
"""
from datetime import datetime, timezone

import sqlalchemy as sa
from alembic import op

revision = "b0c1d2e3f4a5"
down_revision = "a9b0c1d2e3f4"
branch_labels = None
depends_on = None

# Alle zahlungspflichtigen Konflikttypen (siehe app/pricing.py PRICE_MATRIX).
# "wg" ist Legacy, bekommt den Schritt aber trotzdem, damit Bestandsfälle
# dieses Typs weiter bezahlen können.
TYPES = [
    "nachbarschaft",
    "verbraucher",
    "wg",
    "trennung",
    "erbschaft",
    "odr",
    "schlichtung",
    "ecommerce",
    "b2b",
]

STEP_KEY = "fall_freischaltung"

BLOCKS = [
    {
        "id": "fz_zahlung",
        "type": "fall_freischaltung",
        "config": {
            "title": "Mediation freischalten",
            "description": (
                "Jede Partei trägt ihren eigenen Anteil. Der Betrag wird zunächst "
                "nur reserviert und erst abgebucht, wenn alle Parteien zugestimmt "
                "haben und die Mediation startet. Kommt sie nicht zustande, wird "
                "die Reservierung wieder freigegeben."
            ),
        },
        "visible_if": None,
    }
]


def _table():
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
    conn = op.get_bind()
    now = datetime.now(timezone.utc)
    psd = _table()

    for t in TYPES:
        exists = conn.execute(
            sa.select(psd.c.id).where(
                sa.and_(
                    psd.c.mediation_type == t,
                    psd.c.phase == "einladung",
                    psd.c.step_key == STEP_KEY,
                    psd.c.variant_key.is_(None),
                )
            )
        ).first()
        if exists:
            continue

        # Alles ab Position 1 nach hinten schieben - Position 0 bleibt der
        # Start-Intake, Position 1 wird der Bezahl-Schritt.
        conn.execute(
            psd.update()
            .where(
                sa.and_(
                    psd.c.mediation_type == t,
                    psd.c.phase == "einladung",
                    psd.c.variant_key.is_(None),
                    psd.c.position >= 1,
                )
            )
            .values(position=psd.c.position + 1)
        )
        conn.execute(
            psd.insert().values(
                mediation_type=t,
                phase="einladung",
                step_key=STEP_KEY,
                variant_key=None,
                title="Mediation freischalten",
                description=(
                    "Rechnungsdaten hinterlegen und den eigenen Anteil reservieren. "
                    "Abgebucht wird erst, wenn alle Parteien zugestimmt haben."
                ),
                placeholder="",
                reflection_mode=None,
                content_types=None,
                blocks=BLOCKS,
                position=1,
                enabled=True,
                created_at=now,
                updated_at=now,
            )
        )


def downgrade() -> None:
    conn = op.get_bind()
    psd = _table()
    conn.execute(
        psd.delete().where(
            sa.and_(
                psd.c.phase == "einladung",
                psd.c.step_key == STEP_KEY,
                psd.c.variant_key.is_(None),
            )
        )
    )
