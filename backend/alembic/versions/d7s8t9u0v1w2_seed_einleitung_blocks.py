"""Einleitungs-Phase als block-basierte Schritte (Vorbild: alter EinleitungClient).

Ersetzt den einfachen `basis_einleitung`-Schritt durch sechs originalgetreue
Content-Schritte (Intro, Erstgespräch, Gesprächsregeln, Rolle, Vertrauen, Ziel) –
jeweils mit Video-/Text-/Reflexions-Blöcken, inhaltlich am früheren fest
verdrahteten Flow orientiert. Damit ist die Einleitung wie alle anderen Phasen
über den Workflow Manager gestaltbar.

Idempotent & additiv: Schritte werden nur eingefügt, wenn ihr step_key für
(type, phase=einleitung, variant NULL) noch fehlt.

Revision ID: d7s8t9u0v1w2
Revises: c6r7s8t9u0v1
Create Date: 2026-07-06
"""
from datetime import datetime, timezone

import sqlalchemy as sa
from alembic import op

revision = "d7s8t9u0v1w2"
down_revision = "c6r7s8t9u0v1"
branch_labels = None
depends_on = None

TYPES = ["trennung", "erbschaft", "nachbarschaft"]


def _b(bid, btype, **config):
    return {"id": bid, "type": btype, "config": config, "visible_if": None}


# Content-Schritte der Einleitung (generisch für alle Typen), Texte aus dem
# früheren STEP_CONTENT im EinleitungClient.
EINLEITUNG_STEPS = [
    (
        "einl_intro", "Willkommen",
        "Ankommen und Orientierung.",
        [
            _b("intro_t1", "textausgabe", text=(
                "Du bist hier, weil etwas schiefgelaufen ist. Vielleicht fühlst du "
                "Frustration, Erschöpfung, vielleicht auch Hoffnung, dass sich endlich "
                "etwas ändert. All das ist vollkommen in Ordnung."
            )),
            _b("intro_v", "video", url=""),
            _b("intro_t2", "textausgabe", text=(
                "Mediation gibt dir den Raum, gehört zu werden – ohne Urteil, ohne Druck. "
                "Dieser Prozess funktioniert nur, wenn alle freiwillig und in ihrem "
                "eigenen Tempo mitgehen. Nimm dir einen Moment. Atme durch."
            )),
        ],
    ),
    (
        "einl_videocall", "Erstgespräch",
        "Das erste gemeinsame Gespräch.",
        [
            _b("vc_t1", "textausgabe", text=(
                "Zum ersten Mal seid ihr alle im selben Raum – digital, aber gemeinsam. "
                "Das erste Gespräch setzt den Ton für alles, was folgt."
            )),
            _b("vc_call", "videokonferenz", url=""),
            _b("vc_t2", "textausgabe", text=(
                "Wenn du bereit bist, tritt dem Raum bei. Du kannst dein Mikrofon zunächst "
                "stummschalten und einfach ankommen. Es gibt keinen Druck, sofort zu reden."
            )),
        ],
    ),
    (
        "einl_regeln", "Gesprächsregeln",
        "Sicherheit durch gemeinsame Regeln.",
        [
            _b("rg_t", "textausgabe", text=(
                "In einem Konflikt verlieren wir oft das Gefühl von Kontrolle. Gemeinsame "
                "Regeln geben Sicherheit – sie schaffen den Rahmen, in dem echter Dialog "
                "erst möglich wird."
            )),
            _b("rg_v", "video", url=""),
            _b("rg_q", "frage", prompt=(
                "Was brauchst du, damit du dich sicher genug fühlst, ehrlich zu sein? "
                "Formuliere es konkret – nicht für die andere Seite, für dich."
            )),
        ],
    ),
    (
        "einl_rollen", "Deine Rolle",
        "Wer möchtest du in diesem Prozess sein?",
        [
            _b("ro_t", "textausgabe", text=(
                "Wir spielen in Konflikten oft Rollen, die wir nicht bewusst gewählt haben: "
                "Täter, Opfer, Retter. Hier hast du die Chance, innezuhalten und zu fragen: "
                "Wer möchte ich in diesem Prozess sein?"
            )),
            _b("ro_v", "video", url=""),
            _b("ro_q", "frage", prompt=(
                "Mach transparent, wie du dich in dieser Situation siehst – und was du von "
                "den anderen brauchst."
            )),
        ],
    ),
    (
        "einl_vertrauen", "Vertrauen",
        "Genug Vertrauen für ehrliche Gespräche.",
        [
            _b("vt_t", "textausgabe", text=(
                "Vertrauen entsteht nicht auf Knopfdruck, besonders wenn es beschädigt "
                "wurde. Aber für diesen Prozess braucht ihr kein vollständiges Vertrauen – "
                "nur genug, um heute ehrlich sprechen zu können."
            )),
            _b("vt_v", "video", url=""),
            _b("vt_q", "frage", prompt=(
                "Was ist dein Minimum? Was brauchst du, damit du dich wenigstens ein Stück "
                "weit öffnen kannst?"
            )),
        ],
    ),
    (
        "einl_ziel", "Dein Ziel",
        "Vom Problem zur Lösung.",
        [
            _b("zi_t", "textausgabe", text=(
                "Wir wissen im Konflikt oft sehr genau, was wir nicht wollen. Aber was "
                "willst du wirklich? Stell dir vor, dieser Prozess ist gelungen – wie fühlt "
                "sich das an, und was ist dann anders?"
            )),
            _b("zi_v", "video", url=""),
            _b("zi_in", "texteingabe", label="Dein Ziel", placeholder=(
                "Formuliere dein Ziel positiv: nicht, was aufhören soll, sondern was "
                "stattdessen sein soll."
            )),
        ],
    ),
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
        # Den einfachen Sammel-Schritt aus der vorigen Seed-Migration entfernen,
        # damit die Einleitung nur die sechs Content-Schritte enthält.
        conn.execute(
            psd.delete().where(
                sa.and_(
                    psd.c.mediation_type == t,
                    psd.c.phase == "einleitung",
                    psd.c.step_key == "basis_einleitung",
                    psd.c.variant_key.is_(None),
                )
            )
        )
        for pos, (step_key, title, description, blocks) in enumerate(EINLEITUNG_STEPS):
            exists = conn.execute(
                sa.select(psd.c.id).where(
                    sa.and_(
                        psd.c.mediation_type == t,
                        psd.c.phase == "einleitung",
                        psd.c.step_key == step_key,
                        psd.c.variant_key.is_(None),
                    )
                )
            ).first()
            if exists:
                continue
            conn.execute(
                psd.insert().values(
                    mediation_type=t,
                    phase="einleitung",
                    step_key=step_key,
                    variant_key=None,
                    title=title,
                    description=description,
                    placeholder="",
                    reflection_mode=None,
                    content_types=None,
                    blocks=blocks,
                    position=pos,
                    enabled=True,
                    created_at=now,
                    updated_at=now,
                )
            )


def downgrade() -> None:
    conn = op.get_bind()
    psd = _table()
    step_keys = [s[0] for s in EINLEITUNG_STEPS]
    conn.execute(
        psd.delete().where(
            sa.and_(
                psd.c.mediation_type.in_(TYPES),
                psd.c.phase == "einleitung",
                psd.c.step_key.in_(step_keys),
                psd.c.variant_key.is_(None),
            )
        )
    )
