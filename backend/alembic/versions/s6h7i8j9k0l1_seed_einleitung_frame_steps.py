"""feedback_occasion + Rahmen-Schritte der Einleitung als konfigurierbare Karten.

Bisher waren die Rahmen-Schritte der Einleitungsphase (Intro, Terminvereinbarung,
Videocall, Feedback nach dem Gespräch, Feedback vor dem Vertrag, Vertrag) im
Frontend (EinleitungClient.tsx) fest verdrahtet. Damit der Mediator den gesamten
Ablauf im Workflow Manager frei gestalten kann, werden sie hier je Mediationsart
als `phase_step_defaults`-Karten angelegt — jede mit ihrer Inhaltsart
(content_types). Die bestehenden Inhalts-Schritte (Regeln/Rollen/Vertrauen/Ziel)
rücken dahinter und bekommen die Inhaltsart "video,text".

Neue Spalte `feedback_occasion` steuert bei Feedback-Karten, welcher Fragebogen
gezeigt wird ("after_videocall" | "before_contract").

WICHTIG: Diese Migration gehört mit dem umgestellten EinleitungClient (der den
Ablauf jetzt vollständig aus phase-steps + content_types rendert) zusammen. Ohne
das Frontend-Update würden die Rahmen-Schritte doppelt erscheinen.

Revision ID: s6h7i8j9k0l1
Revises: r5g6h7i8j9k0
Create Date: 2026-07-03
"""
from alembic import op
import sqlalchemy as sa

revision = "s6h7i8j9k0l1"
down_revision = "r5g6h7i8j9k0"
branch_labels = None
depends_on = None

MEDIATION_TYPES = ["trennung", "nachbarschaft", "erbschaft"]

# Bestehende Inhalts-Schritte der Einleitung (aus l9a0b1c2d3e4).
CONTENT_STEP_KEYS = ("einleitung", "einleitung_rollen", "einleitung_vertrauen", "einleitung_ziel")

# Rahmen-Schritte VOR den Inhalts-Schritten (Positionen 0..3).
PREFIX = [
    dict(step_key="intro", title="Einführung", position=0,
         description="Ein kurzer Einstieg ins Verfahren. Nimm dir einen Moment, bevor es losgeht.",
         content_types="video", feedback_occasion=None),
    dict(step_key="terminvereinbarung", title="Terminvereinbarung", position=1,
         description="Wählt gemeinsam einen Termin für das erste Gespräch.",
         content_types="termin", feedback_occasion=None),
    dict(step_key="videocall", title="Erstgespräch", position=2,
         description="Euer erstes gemeinsames Gespräch per Video, mit Transkript.",
         content_types="videokonferenz", feedback_occasion=None),
    dict(step_key="feedback_after_videocall", title="Kurzes Feedback", position=3,
         description="Wie war das erste Gespräch für dich?",
         content_types="feedback", feedback_occasion="after_videocall"),
]

# Rahmen-Schritte NACH den Inhalts-Schritten (Positionen ans Ende gehängt).
SUFFIX = [
    dict(step_key="feedback_before_contract", title="Reflexion vor dem Vertrag",
         description="Kurze Einschätzung, bevor ihr den Mediationsvertrag unterzeichnet.",
         content_types="feedback", feedback_occasion="before_contract"),
    dict(step_key="contract", title="Mediationsvertrag",
         description="Der gemeinsame Mediationsvertrag zum Abschluss der Einleitungsphase.",
         content_types="vertrag", feedback_occasion=None),
]


def _table():
    return sa.table(
        "phase_step_defaults",
        sa.column("mediation_type", sa.String),
        sa.column("phase", sa.String),
        sa.column("step_key", sa.String),
        sa.column("variant_key", sa.String),
        sa.column("title", sa.String),
        sa.column("description", sa.Text),
        sa.column("placeholder", sa.Text),
        sa.column("reflection_mode", sa.String),
        sa.column("content_types", sa.String),
        sa.column("video_url", sa.String),
        sa.column("feedback_occasion", sa.String),
        sa.column("required_roles", sa.String),
        sa.column("position", sa.Integer),
        sa.column("enabled", sa.Boolean),
    )


def upgrade() -> None:
    op.add_column("phase_step_defaults", sa.Column("feedback_occasion", sa.String(), nullable=True))

    bind = op.get_bind()
    psd = _table()

    for mt in MEDIATION_TYPES:
        # 1) Bestehende Basis-Schritte der Einleitung um 4 Plätze nach hinten
        #    schieben, damit die vier Prefix-Karten davor Platz haben.
        bind.execute(
            sa.text(
                "UPDATE phase_step_defaults SET position = position + 4 "
                "WHERE mediation_type = :mt AND phase = 'einleitung' AND variant_key IS NULL"
            ),
            {"mt": mt},
        )

        # 2) Inhalts-Schritte als Video+Text klassifizieren (nur wenn noch offen).
        bind.execute(
            sa.text(
                "UPDATE phase_step_defaults SET content_types = 'video,text' "
                "WHERE mediation_type = :mt AND phase = 'einleitung' AND variant_key IS NULL "
                "AND step_key IN :keys AND content_types IS NULL"
            ).bindparams(sa.bindparam("keys", expanding=True)),
            {"mt": mt, "keys": list(CONTENT_STEP_KEYS)},
        )

        # 3) Prefix-Karten einfügen (Positionen 0..3).
        op.bulk_insert(
            psd,
            [
                {
                    "mediation_type": mt,
                    "phase": "einleitung",
                    "step_key": p["step_key"],
                    "variant_key": None,
                    "title": p["title"],
                    "description": p["description"],
                    "placeholder": "",
                    "reflection_mode": None,
                    "content_types": p["content_types"],
                    "video_url": None,
                    "feedback_occasion": p["feedback_occasion"],
                    "required_roles": None,
                    "position": p["position"],
                    "enabled": True,
                }
                for p in PREFIX
            ],
        )

        # 4) Suffix-Karten ans Ende hängen (Position = aktuelles Maximum + 1 …).
        max_pos = bind.execute(
            sa.text(
                "SELECT COALESCE(MAX(position), 0) FROM phase_step_defaults "
                "WHERE mediation_type = :mt AND phase = 'einleitung' AND variant_key IS NULL"
            ),
            {"mt": mt},
        ).scalar() or 0

        op.bulk_insert(
            psd,
            [
                {
                    "mediation_type": mt,
                    "phase": "einleitung",
                    "step_key": s["step_key"],
                    "variant_key": None,
                    "title": s["title"],
                    "description": s["description"],
                    "placeholder": "",
                    "reflection_mode": None,
                    "content_types": s["content_types"],
                    "video_url": None,
                    "feedback_occasion": s["feedback_occasion"],
                    "required_roles": None,
                    "position": max_pos + 1 + i,
                    "enabled": True,
                }
                for i, s in enumerate(SUFFIX)
            ],
        )


def downgrade() -> None:
    bind = op.get_bind()
    frame_keys = [p["step_key"] for p in PREFIX] + [s["step_key"] for s in SUFFIX]

    for mt in MEDIATION_TYPES:
        bind.execute(
            sa.text(
                "DELETE FROM phase_step_defaults "
                "WHERE mediation_type = :mt AND phase = 'einleitung' AND variant_key IS NULL "
                "AND step_key IN :keys"
            ).bindparams(sa.bindparam("keys", expanding=True)),
            {"mt": mt, "keys": frame_keys},
        )
        # Inhalts-Schritte wieder nach vorne schieben.
        bind.execute(
            sa.text(
                "UPDATE phase_step_defaults SET position = position - 4 "
                "WHERE mediation_type = :mt AND phase = 'einleitung' AND variant_key IS NULL"
            ),
            {"mt": mt},
        )

    op.drop_column("phase_step_defaults", "feedback_occasion")
