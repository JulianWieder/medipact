"""Best of both: typenspezifische Blöcke in die methodengetriebenen Schritte mergen.

Die parallele Methoden-Migration (e8t9u0v1w2x3) hat die Phasen 2–5 als generische,
methodengetriebene Schritte angelegt (gleich für alle Typen). Diese Migration
reichert sie pro Typ an, indem sie zusätzliche Blöcke an bestehende Methoden-
Schritte ANHÄNGT (ohne sie zu ersetzen):

  themen_statement   + Bereichs-Auswahl (+ Belastungs-Skala)
  int_wfragen        + typenspezifische Interessen-/Kontextfrage
  ver_bedingungen    + typenspezifische BATNA-Frage
  ver_vereinbarung   + typenspezifischer Rechts-Hinweis / Follow-up

Idempotent: ein Block wird nur angehängt, wenn seine id im Schritt noch fehlt.
Existiert der Zielschritt nicht (Methoden-Migration nicht gelaufen), wird
übersprungen.

Revision ID: h1w2x3y4z5a6
Revises: g0v1w2x3y4z5
Create Date: 2026-07-07
"""
import json
from datetime import datetime, timezone

import sqlalchemy as sa
from alembic import op

revision = "h1w2x3y4z5a6"
down_revision = "g0v1w2x3y4z5"
branch_labels = None
depends_on = None


def _b(bid, btype, **config):
    return {"id": bid, "type": btype, "config": config, "visible_if": None}


# ADDITIONS[type] = { (phase, step_key): [zusätzliche Blöcke] }
ADDITIONS = {
    "trennung": {
        ("themensammlung", "themen_statement"): [
            _b("add_tr_areas", "auswahl", multi=True,
               prompt="Welche Bereiche betreffen euch?",
               options=["Kinder & Umgang", "Wohnung & Hausrat", "Finanzen & Unterhalt",
                        "Vermögen & Schulden"]),
            _b("add_tr_skala", "skala", prompt="Wie belastend ist die Situation für dich gerade?",
               min=1, max=10, minLabel="gut auszuhalten", maxLabel="sehr belastend"),
        ],
        ("interessen", "int_wfragen"): [
            _b("add_tr_kind", "frage",
               prompt="Was braucht dein Kind aus deiner Sicht in dieser Situation am dringendsten?"),
        ],
        ("verhandlung", "ver_bedingungen"): [
            _b("add_tr_batna", "frage", prompt=(
                "Was ist deine beste Alternative, falls ihr euch nicht einigt, z.B. ein "
                "Gerichtsverfahren? Was würde das an Zeit, Kosten und für die Kinder bedeuten?"
            )),
        ],
        ("verhandlung", "ver_vereinbarung"): [
            _b("add_tr_recht", "hinweis", variant="warnung", text=(
                "Für rechtliche Verbindlichkeit (Unterhalt, Sorge, Zugewinn) ist häufig eine "
                "notarielle Beurkundung oder anwaltliche Prüfung nötig. Diese Vereinbarung "
                "ersetzt keine Rechtsberatung."
            )),
        ],
    },
    "erbschaft": {
        ("themensammlung", "themen_statement"): [
            _b("add_er_areas", "auswahl", multi=True, prompt="Worum geht es?",
               options=["Immobilie(n)", "Geldvermögen & Konten", "Persönliche Gegenstände",
                        "Testament & Erbfolge", "Schulden & Verbindlichkeiten"]),
        ],
        ("interessen", "int_wfragen"): [
            _b("add_er_wert", "frage", prompt=(
                "Geht es dir bei den strittigen Gegenständen eher um den materiellen Wert, "
                "die Erinnerung oder um Fairness?"
            )),
        ],
        ("verhandlung", "ver_bedingungen"): [
            _b("add_er_batna", "frage", prompt=(
                "Was ist deine beste Alternative ohne Einigung, z.B. eine Teilungs-"
                "versteigerung oder Erbauseinandersetzungsklage? Was würde das an Zeit, "
                "Kosten und für die Familie bedeuten?"
            )),
        ],
        ("verhandlung", "ver_vereinbarung"): [
            _b("add_er_recht", "hinweis", variant="warnung", text=(
                "Erbauseinandersetzungen – besonders mit Immobilien – bedürfen häufig "
                "notarieller Beurkundung. Diese Vereinbarung ersetzt keine Rechtsberatung."
            )),
        ],
    },
    "nachbarschaft": {
        ("themensammlung", "themen_statement"): [
            _b("add_nb_areas", "auswahl", multi=True, prompt="Worum geht es?",
               options=["Lärm", "Grundstücksgrenze", "Bäume / Hecken / Pflanzen",
                        "Wege / Zufahrt", "Haustiere", "Müll / Ordnung"]),
            _b("add_nb_skala", "skala", prompt="Wie sehr belastet dich der Konflikt im Alltag?",
               min=1, max=10, minLabel="kaum", maxLabel="sehr stark"),
        ],
        ("interessen", "int_wfragen"): [
            _b("add_nb_dauer", "hinweis", variant="info", text=(
                "Denk daran: Ihr bleibt Nachbarn. Eine Lösung, mit der beide dauerhaft leben "
                "können, ist mehr wert als ein kurzfristiger Sieg."
            )),
        ],
        ("verhandlung", "ver_bedingungen"): [
            _b("add_nb_batna", "frage", prompt=(
                "Was ist deine Alternative ohne Einigung, z.B. Ordnungsamt oder Klage? "
                "Realistisch betrachtet: Zeit, Kosten – und wie wäre danach das Verhältnis?"
            )),
        ],
        ("verhandlung", "ver_vereinbarung"): [
            _b("add_nb_termin", "termin"),
        ],
    },
}


def _table():
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


def _load_blocks(value):
    if value is None:
        return []
    if isinstance(value, str):
        try:
            parsed = json.loads(value)
        except (ValueError, TypeError):
            return []
        return parsed if isinstance(parsed, list) else []
    return value if isinstance(value, list) else []


def upgrade() -> None:
    conn = op.get_bind()
    now = datetime.now(timezone.utc)
    psd = _table()

    for mtype, targets in ADDITIONS.items():
        for (phase, step_key), extra in targets.items():
            row = conn.execute(
                sa.select(psd.c.id, psd.c.blocks).where(
                    sa.and_(
                        psd.c.mediation_type == mtype,
                        psd.c.phase == phase,
                        psd.c.step_key == step_key,
                        psd.c.variant_key.is_(None),
                    )
                )
            ).first()
            if not row:
                continue
            blocks = _load_blocks(row[1])
            existing_ids = {b.get("id") for b in blocks if isinstance(b, dict)}
            new_blocks = [b for b in extra if b["id"] not in existing_ids]
            if not new_blocks:
                continue
            conn.execute(
                psd.update()
                .where(psd.c.id == row[0])
                .values(blocks=blocks + new_blocks, updated_at=now)
            )


def downgrade() -> None:
    conn = op.get_bind()
    psd = _table()
    add_ids = {
        b["id"]
        for targets in ADDITIONS.values()
        for extra in targets.values()
        for b in extra
    }
    for mtype, targets in ADDITIONS.items():
        for (phase, step_key), _extra in targets.items():
            row = conn.execute(
                sa.select(psd.c.id, psd.c.blocks).where(
                    sa.and_(
                        psd.c.mediation_type == mtype,
                        psd.c.phase == phase,
                        psd.c.step_key == step_key,
                        psd.c.variant_key.is_(None),
                    )
                )
            ).first()
            if not row:
                continue
            blocks = _load_blocks(row[1])
            filtered = [b for b in blocks if not (isinstance(b, dict) and b.get("id") in add_ids)]
            if len(filtered) != len(blocks):
                conn.execute(
                    psd.update().where(psd.c.id == row[0]).values(blocks=filtered)
                )
