"""Business-Fokus im geschaeft-Workflow: Einsatzfelder, intern/B2B-Weiche, Methoden.

Passt den Kern-Workflow des Typs `geschaeft` an die geschärfte Business-
Positionierung an (vgl. app/content/geschaeftPage.ts und /preise):

1. Onboarding (g_onboarding) + Einsatzfeld-Auswahl mit sets_flag-map:
   Team & Abteilung / Führung & Betriebsrat / Gesellschafter & Nachfolge
   (→ Flag business_scope=intern) bzw. Verträge & Lieferanten / IT- &
   Großprojekt / M&A & Integration (→ business_scope=b2b). Der map-Modus
   von sets_flag kommt aus block_responses.py (kategoriale Flags aus
   auswahl-Antworten, überschreibbar).

2. Zwei neue B2B-Schritte mit visible_if business_scope=b2b:
   - themensammlung/g_b2b_fakten: Vertrags- und Projekt-Fakten (strittige
     Punkte, Vertragslage, Datei-Upload) – sachliche Grundlage, damit das
     Projekt weiterläuft statt vor Gericht zu blockieren.
   - verhandlung/g_b2b_evaluativ: evaluatives Element – Erklärung, Frage zur
     vertretbaren Lösung bei ungünstiger Vertragslage und Bonus-Block
     "Rechtliche Ersteinschätzung" (€190, vgl. Spezialisten-Preise /preise).

3. Block-Appends (idempotent per Block-id, Präfix "j3_"):
   - g_onboarding: Einsatzfeld-Auswahl + intern/B2B-Einordnung (hinweis)
   - g_esk_extern: Shuttle-Mediation-Hinweis (getrennte Räume, Pendeln)
   - g_interessen: transformativer Hinweis (Beziehung & Kommunikation, wenn
     das Team weiter zusammenarbeiten muss)

Idempotent wie h1/i2: Schritte nur einfügen, wenn step_key fehlt; Blöcke nur
anhängen, wenn ihre id im Schritt fehlt.

Revision ID: j3y4z5a6b7c8
Revises: i2x3y4z5a6b7
Create Date: 2026-07-07
"""
import json
from datetime import datetime, timezone

import sqlalchemy as sa
from alembic import op

revision = "j3y4z5a6b7c8"
down_revision = "i2x3y4z5a6b7"
branch_labels = None
depends_on = None

MTYPE = "geschaeft"


def _b(bid, btype, **config):
    return {"id": bid, "type": btype, "config": config, "visible_if": None}


def _vis(flag, eq):
    return {"all": [{"flag": flag, "eq": eq}]}


# Optionen der Einsatzfeld-Auswahl — Strings müssen exakt den map-Keys entsprechen.
SCOPE_OPTIONS = [
    "Team & Abteilung",
    "Führung & Betriebsrat",
    "Gesellschafter & Nachfolge",
    "Verträge & Lieferanten (B2B)",
    "IT- & Großprojekt (B2B)",
    "M&A & Integration (B2B)",
]
SCOPE_MAP = {
    "Team & Abteilung": "intern",
    "Führung & Betriebsrat": "intern",
    "Gesellschafter & Nachfolge": "intern",
    "Verträge & Lieferanten (B2B)": "b2b",
    "IT- & Großprojekt (B2B)": "b2b",
    "M&A & Integration (B2B)": "b2b",
}


# ── Block-Appends an bestehende Schritte: (phase, step_key) -> [Blöcke] ───────
ADDITIONS = {
    ("einladung", "g_onboarding"): [
        _b("j3_feld", "auswahl", multi=False,
           prompt="Um welches Einsatzfeld geht es?",
           options=SCOPE_OPTIONS,
           sets_flag={"flag": "business_scope", "map": SCOPE_MAP}),
        _b("j3_feld_h", "hinweis", variant="info", text=(
            "Innerbetrieblich (Team, Führung, Gesellschafter, Nachfolge) geht es "
            "meist um Arbeitsfähigkeit und Betriebsklima. Verlässt der Konflikt "
            "die Unternehmensgrenze (B2B), stehen Geld, Haftung oder eine "
            "strategische Partnerschaft auf dem Spiel – der Prozess blendet "
            "passende Zusatz-Schritte ein."
        )),
    ],
    ("verhandlung", "g_esk_extern"): [
        _b("j3_shuttle", "hinweis", variant="info", text=(
            "Bei extrem eskalierten Fronten arbeitet die externe Mediation auf "
            "Wunsch als Shuttle-Mediation: Die Parteien sitzen in getrennten "
            "(virtuellen) Räumen, die mediierende Person pendelt – niemand muss "
            "der anderen Seite direkt gegenübersitzen."
        )),
    ],
    ("interessen", "g_interessen"): [
        _b("j3_transformativ", "hinweis", variant="info", text=(
            "Wenn ihr danach weiter zusammenarbeiten müsst, zählt nicht nur die "
            "Sachlösung, sondern auch die Beziehung: Nehmt euch für die Fragen "
            "nach Anerkennung, Rolle und Kommunikation genauso viel Zeit wie für "
            "die harten Themen (transformativer Ansatz)."
        )),
    ],
}


# ── Neue B2B-Schritte: (phase, step_key, title, description, blocks, visible_if)
NEW_STEPS = [
    (
        "themensammlung", "g_b2b_fakten",
        "Vertrag & Projekt-Fakten (B2B)",
        "Sachliche Grundlage für die Klärung mit dem Geschäftspartner.",
        [
            _b("b2f_t", "textausgabe", text=(
                "Bei Konflikten mit Geschäftspartnern zählt die sachliche "
                "Grundlage: Liefertermine, Qualität, Service Level. Sammelt die "
                "Fakten – nicht als Beweissammlung fürs Rechthaben, sondern damit "
                "beide Seiten über dasselbe sprechen."
            )),
            _b("b2f_li", "liste",
               prompt="Strittige Punkte (Liefertermine, Qualität, SLA-Klauseln, Zahlungen …)",
               placeholder="Ein Punkt …"),
            _b("b2f_in", "texteingabe",
               label="Was sagt der Vertrag aus deiner Sicht?",
               placeholder="Relevante Klauseln, Vereinbarungen, mündliche Zusagen …"),
            _b("b2f_up", "datei_upload",
               prompt="Vertrag, SLA oder relevanter Schriftverkehr (optional)",
               accept=".pdf,.doc,.docx"),
            _b("b2f_h", "hinweis", variant="info", text=(
                "Ziel der Mediation ist, dass das Projekt bzw. die "
                "Geschäftsbeziehung weiterläuft – statt jahrelang vor Gericht "
                "blockiert zu sein."
            )),
        ],
        _vis("business_scope", "b2b"),
    ),
    (
        "verhandlung", "g_b2b_evaluativ",
        "Rechtliche Einschätzung (evaluativ)",
        "Wenn die Vertragslage den Rahmen setzt.",
        [
            _b("b2e_t", "textausgabe", text=(
                "Bei harten Vertragsstreitigkeiten hilft ein evaluatives Element: "
                "Eine neutrale Person mit juristischem Hintergrund schätzt die "
                "Vertragslage ein und gibt eine Richtung vor – als Grundlage, "
                "nicht als Urteil."
            )),
            _b("b2e_q", "frage", prompt=(
                "Angenommen, die Vertragslage spricht in einzelnen Punkten gegen "
                "euch: Welche Lösung wäre für euch trotzdem vertretbar – und was "
                "wäre euch dabei am wichtigsten?"
            )),
            _b("b2e_pay", "bezahlung",
               title="Rechtliche Ersteinschätzung hinzubuchen",
               description=(
                   "Ein:e Wirtschaftsjurist:in bewertet die Vertragslage neutral "
                   "und allparteilich (evaluative Mediation)."
               ),
               price=190.0, currency="EUR",
               unlock_text=(
                   "Danke – wir melden uns kurzfristig mit der rechtlichen "
                   "Ersteinschätzung zu eurem Fall."
               )),
        ],
        _vis("business_scope", "b2b"),
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
        sa.column("blocks", sa.JSON),
        sa.column("visible_if", sa.JSON),
        sa.column("position", sa.Integer),
        sa.column("enabled", sa.Boolean),
        sa.column("created_at", sa.DateTime),
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

    # 1) Block-Appends (idempotent per Block-id)
    for (phase, step_key), extra in ADDITIONS.items():
        row = conn.execute(
            sa.select(psd.c.id, psd.c.blocks).where(
                sa.and_(
                    psd.c.mediation_type == MTYPE,
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

    # 2) Neue B2B-Schritte (idempotent per step_key)
    for phase, step_key, title, description, blocks, visible_if in NEW_STEPS:
        exists = conn.execute(
            sa.select(psd.c.id).where(
                sa.and_(
                    psd.c.mediation_type == MTYPE,
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
                mediation_type=MTYPE,
                phase=phase,
                step_key=step_key,
                variant_key=None,
                title=title,
                description=description,
                placeholder="",
                blocks=blocks,
                visible_if=visible_if,
                position=1,
                enabled=True,
                created_at=now,
                updated_at=now,
            )
        )


def downgrade() -> None:
    conn = op.get_bind()
    psd = _table()

    # Neue Schritte entfernen
    conn.execute(
        psd.delete().where(
            sa.and_(
                psd.c.mediation_type == MTYPE,
                psd.c.step_key.in_([s[1] for s in NEW_STEPS]),
                psd.c.variant_key.is_(None),
            )
        )
    )

    # Angehängte Blöcke wieder herauslösen
    add_ids = {b["id"] for extra in ADDITIONS.values() for b in extra}
    for (phase, step_key), _extra in ADDITIONS.items():
        row = conn.execute(
            sa.select(psd.c.id, psd.c.blocks).where(
                sa.and_(
                    psd.c.mediation_type == MTYPE,
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
