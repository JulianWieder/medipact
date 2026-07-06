"""Basis-Schritte (mit Blöcken) für alle Phasen und alle drei Mediationstypen.

Legt pro (mediation_type, phase) einen durchdachten Standard-Schritt an, dessen
Seite bereits aus sinnvollen Blöcken besteht (Textausgabe, Eingaben, KI-Analyse,
Videokonferenz, Vertrag …). Rein additiv & idempotent: ein Schritt wird nur
eingefügt, wenn es für (type, phase, step_key, variant_key=NULL) noch keinen
gibt. Bestehende Schritte werden nicht verändert.

Die Inhalte sind als editierbare Startpunkte gedacht – im Workflow Manager
lassen sie sich pro Schritt frei umgestalten.

Revision ID: c6r7s8t9u0v1
Revises: b5q6r7s8t9u0
Create Date: 2026-07-06
"""
from datetime import datetime, timezone

import sqlalchemy as sa
from alembic import op

revision = "c6r7s8t9u0v1"
down_revision = "b5q6r7s8t9u0"
branch_labels = None
depends_on = None

TYPES = ["trennung", "erbschaft", "nachbarschaft"]

# Worauf sich die Mediation je Typ konkret bezieht (für Einleitungstexte/Fragen).
FOCUS = {
    "trennung": "eure Trennung bzw. Scheidung – etwa Kinder, Wohnung und Finanzen",
    "erbschaft": "den Nachlass und eine faire Verteilung des Erbes",
    "nachbarschaft": "euren Nachbarschaftskonflikt",
}


def _b(bid, btype, **config):
    return {"id": bid, "type": btype, "config": config, "visible_if": None}


def _steps_for(t: str):
    """Gibt eine Liste (phase, step_key, title, description, blocks) für einen Typ."""
    focus = FOCUS.get(t, "euren Konflikt")
    steps = []

    # Phase 0 – Einladung (Vor-Phase)
    steps.append((
        "einladung", "basis_einladung", "Willkommen",
        "Schön, dass ihr diesen Weg gemeinsam geht.",
        [
            _b("einladung_1", "textausgabe", text=(
                "Willkommen bei medipact. In einer Mediation findet ihr mit "
                "Unterstützung einer neutralen Person eigenverantwortlich eine "
                "Lösung für " + focus + ". Nehmt euch für jeden Schritt in Ruhe Zeit."
            )),
            _b("einladung_2", "hinweis", variant="info", text=(
                "Alles, was ihr hier eingebt, dient ausschließlich der Mediation und "
                "wird vertraulich behandelt."
            )),
        ],
    ))

    # Phase 1 – Einleitung
    steps.append((
        "einleitung", "basis_einleitung", "Einleitung & Gesprächsregeln",
        "Rahmen, Regeln und euer Ziel.",
        [
            _b("einleitung_1", "textausgabe", text=(
                "Bevor es losgeht, klären wir den Rahmen. In der Mediation entscheidet "
                "ihr selbst – die mediierende Person sorgt für einen fairen Ablauf und "
                "bleibt allparteilich."
            )),
            _b("einleitung_2", "zustimmung", text=(
                "Ich halte mich an die Gesprächsregeln: ausreden lassen, respektvoll "
                "bleiben, Vertraulichkeit wahren."
            )),
            _b("einleitung_3", "texteingabe", label="Dein Ziel",
               placeholder="Was möchtest du mit dieser Mediation erreichen?"),
            _b("einleitung_4", "videokonferenz", url=""),
        ],
    ))

    # Phase 2 – Themensammlung
    steps.append((
        "themensammlung", "basis_themensammlung", "Themen sammeln",
        "Worum soll es gehen?",
        [
            _b("themen_1", "textausgabe", text=(
                "Sammelt zunächst wertfrei alle Themen, die euch mit Blick auf " + focus +
                " wichtig sind. Noch geht es nicht um Lösungen – nur darum, was auf den "
                "Tisch gehört."
            )),
            _b("themen_2", "liste", prompt="Welche Themen sind dir wichtig?",
               placeholder="Ein Thema …"),
            _b("themen_3", "vertrauliche_notiz", prompt=(
                "Gibt es etwas, das du zunächst nur der mediierenden Person mitteilen "
                "möchtest?"
            )),
        ],
    ))

    # Phase 3 – Interessen
    steps.append((
        "interessen", "basis_interessen", "Interessen & Bedürfnisse",
        "Was steckt hinter den Positionen?",
        [
            _b("interessen_1", "textausgabe", text=(
                "Hinter jeder Forderung (Position) stehen Bedürfnisse und Interessen. "
                "Wenn wir diese verstehen, wird eine Einigung möglich."
            )),
            _b("interessen_2", "frage", prompt=(
                "Was ist dir bei diesen Themen wirklich wichtig – und warum?"
            )),
            _b("interessen_3", "skala", prompt="Wie wichtig ist dir eine Einigung?",
               min=1, max=10, minLabel="weniger wichtig", maxLabel="sehr wichtig"),
            _b("interessen_4", "ki_interessen",
               prompt=("Leite aus den geäußerten Positionen die dahinterliegenden "
                       "Interessen und Bedürfnisse jeder Partei ab."),
               autorun=False),
        ],
    ))

    # Phase 4 – Optionen
    steps.append((
        "optionen", "basis_optionen", "Lösungsoptionen sammeln",
        "Ideen sammeln – ohne zu bewerten.",
        [
            _b("optionen_1", "textausgabe", text=(
                "Jetzt sammelt ihr möglichst viele Lösungsideen. Alles ist erlaubt – "
                "bewertet wird erst später. Je mehr Optionen, desto besser."
            )),
            _b("optionen_2", "liste", prompt="Welche Lösungsmöglichkeiten fallen dir ein?",
               placeholder="Eine Idee …"),
            _b("optionen_3", "ki_optionen",
               prompt=("Erarbeite auf Basis der Eingaben mehrere faire, umsetzbare "
                       "Lösungsoptionen, die die Interessen beider Seiten berücksichtigen."),
               autorun=False),
        ],
    ))

    # Phase 5 – Verhandlung
    steps.append((
        "verhandlung", "basis_verhandlung", "Optionen bewerten & verhandeln",
        "Welche Lösung trägt für beide?",
        [
            _b("verhandlung_1", "textausgabe", text=(
                "Nun bewertet ihr die Optionen und verhandelt eine tragfähige Lösung. "
                "Sucht nach Wegen, die für beide Seiten funktionieren."
            )),
            _b("verhandlung_2", "texteingabe", label="Deine bevorzugte Lösung",
               placeholder="Welche Option bevorzugst du – und unter welchen Bedingungen?"),
            _b("verhandlung_3", "skala", prompt="Wie zufrieden wärst du mit dieser Lösung?",
               min=1, max=10, minLabel="gar nicht", maxLabel="voll und ganz"),
            _b("verhandlung_4", "ki_gemeinsamkeiten",
               prompt=("Identifiziere Übereinstimmungen und verbleibende Konfliktpunkte "
                       "zwischen den Parteien. Markiere, wo eine Einigung nahe liegt."),
               autorun=False),
            _b("verhandlung_5", "videokonferenz", url=""),
        ],
    ))

    # Phase 6 – Abschluss
    steps.append((
        "abschluss", "basis_abschluss", "Abschluss & Vereinbarung",
        "Ergebnis festhalten und bestätigen.",
        [
            _b("abschluss_1", "textausgabe", text=(
                "Ihr habt eine Lösung gefunden – herzlichen Glückwunsch. Haltet sie nun "
                "verbindlich fest."
            )),
            _b("abschluss_2", "vertrag", template=(
                "Abschlussvereinbarung\n\nDie Parteien vereinbaren Folgendes:\n\n"
                "1. …\n2. …\n\nOrt, Datum:"
            )),
            _b("abschluss_3", "unterschrift", statement=(
                "Ich bestätige die oben festgehaltene Vereinbarung."
            )),
            _b("abschluss_4", "feedback", occasion="before_contract"),
        ],
    ))

    return steps


def upgrade() -> None:
    conn = op.get_bind()
    now = datetime.now(timezone.utc)

    psd = sa.table(
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

    for t in TYPES:
        for phase, step_key, title, description, blocks in _steps_for(t):
            exists = conn.execute(
                sa.select(psd.c.id).where(
                    sa.and_(
                        psd.c.mediation_type == t,
                        psd.c.phase == phase,
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
                    phase=phase,
                    step_key=step_key,
                    variant_key=None,
                    title=title,
                    description=description,
                    placeholder="",
                    reflection_mode=None,
                    content_types=None,
                    blocks=blocks,
                    position=0,
                    enabled=True,
                    created_at=now,
                    updated_at=now,
                )
            )


def downgrade() -> None:
    conn = op.get_bind()
    step_keys = [
        "basis_einladung", "basis_einleitung", "basis_themensammlung",
        "basis_interessen", "basis_optionen", "basis_verhandlung", "basis_abschluss",
    ]
    psd = sa.table(
        "phase_step_defaults",
        sa.column("mediation_type", sa.String),
        sa.column("step_key", sa.String),
        sa.column("variant_key", sa.String),
    )
    conn.execute(
        psd.delete().where(
            sa.and_(
                psd.c.mediation_type.in_(TYPES),
                psd.c.step_key.in_(step_keys),
                psd.c.variant_key.is_(None),
            )
        )
    )
