"""Seed: erster GLOBALER Schritt - Konfliktprofil (Selbsttest) in Phase 2.

Neues Konzept "wiederverwendbarer Schritt"
──────────────────────────────────────────────────────────────────────────────
phase_step_defaults.mediation_type == "*" (SHARED_MEDIATION_TYPE) bedeutet:
Dieser Schritt gilt in JEDEM Mediationstyp. Er wird im Workflow Manager im
eigenen Tab "Alle Typen" gepflegt und in der Fall-Auflösung
(routers/mediations.get_phase_steps) zu den typspezifischen Schritten
dazugemischt - sortiert nach `position`, bei Gleichstand hinter dem
typspezifischen Schritt.

Damit muss ein typübergreifender Inhalt nicht mehr 9x (einmal pro Konfliktart)
gepflegt werden. Ein Datensatz, eine Stelle zum Ändern.

Erster Anwendungsfall: ein kurzer Selbsttest zum Konfliktverhalten (angelehnt an
das Thomas-Kilmann-Modell der fünf Konfliktstile: durchsetzen, nachgeben,
vermeiden, Kompromiss, kooperieren) in der Themensammlung. Bewusst typneutral
formuliert - dieselben Items funktionieren bei Trennung, Erbschaft, Nachbarschaft
und B2B.

Datenschutz: Die Antworten liegen wie alle Block-Antworten in
mediation_block_responses (pro Partei). Der vertrauliche Block ist nur für den
Mediator sichtbar (Blocktyp vertrauliche_notiz). Die KI-Auswertung läuft nicht
automatisch, sondern erst, wenn der Mediator sie auslöst (autorun=false).

Idempotent: legt den Schritt nur an, wenn er noch fehlt.

Revision ID: c1d2e3f4a5b6
Revises: b0c1d2e3f4a5
Create Date: 2026-07-29
"""
from datetime import datetime, timezone

import sqlalchemy as sa
from alembic import op

revision = "c1d2e3f4a5b6"
down_revision = "b0c1d2e3f4a5"
branch_labels = None
depends_on = None

SHARED_TYPE = "*"
PHASE = "themensammlung"
STEP_KEY = "konfliktprofil_selbsttest"

# Skala-Items: 1 = trifft gar nicht zu ... 6 = trifft voll zu. Sechsstufig und
# ohne Mitte, damit sich niemand in die neutrale Antwort flüchtet.
_ITEMS = [
    ("kp_durchsetzen", "Wenn ich überzeugt bin, im Recht zu sein, halte ich an meiner Position fest."),
    ("kp_nachgeben", "Um Streit zu beenden, gebe ich eher nach, als lange zu diskutieren."),
    ("kp_vermeiden", "Ich gehe Auseinandersetzungen aus dem Weg, solange es irgendwie geht."),
    ("kp_kompromiss", "Ich suche schnell einen Mittelweg, bei dem beide Seiten etwas bekommen."),
    ("kp_kooperation", "Ich frage aktiv nach, was der anderen Seite wirklich wichtig ist."),
    ("kp_stress_laut", "In angespannten Gesprächen merke ich, wie ich lauter oder schärfer werde."),
    ("kp_stress_rueckzug", "Wenn es mir zu viel wird, ziehe ich mich zurück und melde mich erst später wieder."),
    ("kp_vertrauen", "Ich traue der anderen Seite grundsätzlich zu, sich an Absprachen zu halten."),
    ("kp_tempo", "Ich möchte diese Sache möglichst schnell hinter mich bringen."),
    ("kp_anerkennung", "Mir ist wichtig, dass anerkannt wird, was ich in dieser Sache getragen habe."),
]

BLOCKS = [
    {
        "id": "kp_intro",
        "type": "textausgabe",
        "config": {
            "text": (
                "Bevor wir die Themen sortieren, ein kurzer Selbsttest: Wie gehst du "
                "persönlich mit Konflikten um? Das dauert etwa fünf Minuten, es gibt "
                "keine richtigen oder falschen Antworten. Das Ergebnis hilft, das "
                "Verfahren auf euch beide zuzuschneiden - wer wie viel Zeit, Pausen oder "
                "Klarheit braucht. Antworte spontan, nicht so, wie du gern wärst."
            )
        },
        "visible_if": None,
    }
]

for _bid, _prompt in _ITEMS:
    BLOCKS.append(
        {
            "id": _bid,
            "type": "skala",
            "config": {
                "prompt": _prompt,
                "min": 1,
                "max": 6,
                "minLabel": "trifft gar nicht zu",
                "maxLabel": "trifft voll zu",
            },
            "visible_if": None,
        }
    )

BLOCKS += [
    {
        "id": "kp_deeskalation",
        "type": "auswahl",
        "config": {
            "prompt": "Wenn ein Gespräch hitzig wird, hilft mir am meisten:",
            "options": [
                "Eine kurze Pause",
                "Klare Gesprächsregeln",
                "Schriftlich statt mündlich weitermachen",
                "Jemand Drittes, der moderiert",
                "Direkt weiterreden, bis es geklärt ist",
            ],
            "multi": False,
        },
        "visible_if": None,
    },
    {
        "id": "kp_hinweis_gegenseite",
        "type": "texteingabe",
        "config": {
            "label": "Was sollte die andere Seite über deinen Umgang mit Konflikten wissen?",
            "placeholder": "z.B. \"Ich brauche Bedenkzeit, bevor ich zu etwas Ja sage.\"",
        },
        "visible_if": None,
    },
    {
        "id": "kp_vertraulich",
        "type": "vertrauliche_notiz",
        "config": {
            "prompt": (
                "Nur für den Mediator: Gibt es Belastungen, Ängste oder Grenzen, die "
                "das Gespräch beeinflussen und die die andere Seite nicht erfahren soll?"
            )
        },
        "visible_if": None,
    },
    {
        "id": "kp_auswertung",
        "type": "ki_zusammenfassung",
        "config": {
            "prompt": (
                "Werte den Selbsttest zum Konfliktverhalten aus. Die Skalenwerte gehen von "
                "1 (trifft gar nicht zu) bis 6 (trifft voll zu) und decken die fünf "
                "Konfliktstile durchsetzen, nachgeben, vermeiden, Kompromiss und "
                "kooperieren sowie Stressreaktion, Vertrauen, Tempo und "
                "Anerkennungsbedürfnis ab.\n\n"
                "Erstelle pro Partei ein kurzes Profil (3-4 Sätze, wertschätzend, ohne "
                "Diagnosesprache und ohne Etiketten wie 'schwierig'). Beschreibe danach in "
                "wenigen Punkten, was das für die Verhandlungsführung bedeutet: wo "
                "Reibung entstehen kann (z.B. schnelles Tempo trifft auf Rückzug), was "
                "beide Seiten voneinander brauchen, und welche konkreten Vorkehrungen sich "
                "anbieten (Pausen, schriftliche Zusammenfassungen, Einzelgespräche, "
                "Bedenkzeit vor Entscheidungen). Beziehe die vertrauliche Notiz NICHT "
                "wörtlich ein, sondern nur als Vorsichtshinweis für den Mediator. "
                "Schreibe deutsch, klar und ohne Fachjargon."
            ),
            "autorun": False,
        },
        "visible_if": None,
    },
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

    exists = conn.execute(
        sa.select(psd.c.id).where(
            sa.and_(
                psd.c.mediation_type == SHARED_TYPE,
                psd.c.phase == PHASE,
                psd.c.step_key == STEP_KEY,
            )
        )
    ).first()
    if exists:
        return

    conn.execute(
        psd.insert().values(
            mediation_type=SHARED_TYPE,
            phase=PHASE,
            step_key=STEP_KEY,
            variant_key=None,
            title="Konfliktprofil (Selbsttest)",
            description=(
                "Kurzer Selbsttest zum eigenen Konfliktverhalten. Das Ergebnis bleibt "
                "zwischen dir und dem Mediator und hilft, das Verfahren passend "
                "zuzuschneiden."
            ),
            placeholder="",
            reflection_mode=None,
            content_types=None,
            blocks=BLOCKS,
            # Position 0: der Selbsttest läuft am Anfang der Themensammlung.
            # Bei gleicher Position steht der typspezifische Schritt vorn, der
            # Test also direkt dahinter. Feinjustierung per Drag & Drop im
            # Workflow Manager (Tab "Alle Typen" oder in einer Typ-Ansicht).
            position=0,
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
                psd.c.mediation_type == SHARED_TYPE,
                psd.c.phase == PHASE,
                psd.c.step_key == STEP_KEY,
            )
        )
    )
