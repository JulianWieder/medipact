"""add phase_step_defaults table + backfill from phaseData.ts / EinleitungClient.tsx

Revision ID: l9a0b1c2d3e4
Revises: k8f9a0b1c2d3
Create Date: 2026-06-19
"""
from alembic import op
import sqlalchemy as sa

revision = "l9a0b1c2d3e4"
down_revision = "k8f9a0b1c2d3"
branch_labels = None
depends_on = None

MEDIATION_TYPES = ["trennung", "nachbarschaft", "erbschaft"]

# Spiegelt 1:1 die bisherigen statischen stepDetails aus
# app/dashboard/[id]/_shared/phaseData.ts (Phasen 2-6) und die CONTENT_STEPS
# aus app/dashboard/[id]/einleitung/EinleitungClient.tsx (Phase "einleitung").
# Wird für jeden Mediationstyp identisch übernommen - ein Admin kann danach
# pro Typ abweichen.
PHASE_STEP_DEFAULTS: list[dict] = [
    # --- einleitung ---
    dict(phase="einleitung", step_key="einleitung", title="Regeln festlegen",
         description="Jede Partei formuliert ihre Erwartungen an das Verfahren. Was ist dir wichtig? Welche Regeln sollen gelten?",
         placeholder="z.B. Keine Unterbrechungen, ausreden lassen …", position=0),
    dict(phase="einleitung", step_key="einleitung_rollen", title="Rollen klären",
         description="Welche Rolle übernimmt jede Person in dieser Mediation? Hier werden Zuständigkeiten und Erwartungen transparent gemacht.",
         placeholder="z.B. Ich sehe meine Rolle als …", position=1),
    dict(phase="einleitung", step_key="einleitung_vertrauen", title="Vertrauen schaffen",
         description="Was braucht ihr, um offen sprechen zu können? Notiert, was euch hilft, Vertrauen in den Prozess aufzubauen.",
         placeholder="z.B. Vertraulichkeit über alles, was hier gesprochen wird …", position=2),
    dict(phase="einleitung", step_key="einleitung_ziel", title="Ziel der Mediation definieren",
         description="Was soll am Ende dieser Mediation erreicht sein? Jede Partei formuliert ihr persönliches Ziel für den Prozess.",
         placeholder="z.B. Eine faire Lösung für beide Seiten finden …", position=3),

    # --- themensammlung ---
    dict(phase="themensammlung", step_key="themensammlung_konflikte", title="Konfliktpunkte sammeln",
         description="Nennen Sie alle Themen und Streitpunkte, die in dieser Mediation geklärt werden sollen. Noch keine Bewertung – nur sammeln.",
         placeholder="z.B. Aufteilung der Betreuungszeiten, Unterhaltszahlungen …", reflection_mode="interactive", position=0),
    dict(phase="themensammlung", step_key="themensammlung_perspektive", title="Ihre Perspektive",
         description="Schildern Sie Ihre persönliche Sicht auf den Konflikt. Ohne Wertung – nur Ihre Wahrnehmung der Situation.",
         placeholder="z.B. Ich erlebe die Situation so, dass …", reflection_mode="interactive", position=1),
    dict(phase="themensammlung", step_key="themensammlung_prioritaeten", title="Prioritäten setzen",
         description="Welche Themen sind für Sie am dringendsten? Benennen Sie die Punkte, die zuerst geklärt werden müssen.",
         placeholder="z.B. Zuerst muss das Thema Wohnung geklärt werden, weil …", reflection_mode="interactive", position=2),

    # --- interessen ---
    dict(phase="interessen", step_key="interessen_beduerfnisse", title="Ihre Bedürfnisse und Interessen",
         description="Was brauchen Sie wirklich? Hinter jeder Position steckt ein tieferes Bedürfnis. Beschreiben Sie, was Ihnen wichtig ist.",
         placeholder="z.B. Ich brauche Sicherheit, Verlässlichkeit, Respekt …", reflection_mode="interactive", position=0),
    dict(phase="interessen", step_key="interessen_aengste", title="Befürchtungen und Ängste",
         description="Was befürchten Sie? Was darf auf keinen Fall passieren? Diese Informationen helfen, tragfähige Lösungen zu finden.",
         placeholder="z.B. Ich befürchte, dass meine Kinder darunter leiden …", reflection_mode="interactive", position=1),
    dict(phase="interessen", step_key="interessen_kern", title="Kern des Konflikts",
         description="Was ist Ihrer Meinung nach der eigentliche Kern dieses Konflikts? Oft steckt hinter dem sichtbaren Streit ein tieferes Thema.",
         placeholder="z.B. Im Kern geht es mir darum, dass ich gehört werde …", reflection_mode="interactive", position=2),

    # --- optionen ---
    dict(phase="optionen", step_key="optionen_ideen", title="Lösungsideen sammeln",
         description="Sammeln Sie alle möglichen Lösungen – ohne Bewertung. Jede Idee ist willkommen, auch ungewöhnliche. Quantität vor Qualität.",
         placeholder="z.B. Eine mögliche Lösung wäre, dass …", position=0),
    dict(phase="optionen", step_key="optionen_kreativ", title="Kreative Optionen",
         description="Denken Sie außerhalb gewohnter Muster. Was wäre möglich, wenn es keine Einschränkungen gäbe? Was haben andere in ähnlichen Situationen gemacht?",
         placeholder="z.B. Was wäre, wenn wir …", position=1),
    dict(phase="optionen", step_key="optionen_winwin", title="Win-Win-Ansätze",
         description="Welche der gesammelten Lösungen könnten für alle Seiten akzeptabel sein? Suchen Sie nach Ideen, die mehrere Interessen gleichzeitig erfüllen.",
         placeholder="z.B. Beide Seiten könnten davon profitieren, wenn …", position=2),

    # --- verhandlung ---
    dict(phase="verhandlung", step_key="verhandlung_bewertung", title="Lösungen bewerten",
         description="Welche der gesammelten Optionen sind für Sie akzeptabel? Was spricht dafür, was dagegen? Begründen Sie Ihre Einschätzung.",
         placeholder="z.B. Option X ist für mich akzeptabel, weil … Nicht akzeptabel wäre …", position=0),
    dict(phase="verhandlung", step_key="verhandlung_bedingungen", title="Bedingungen und Grenzen",
         description="Unter welchen Bedingungen können Sie einer Lösung zustimmen? Was sind Ihre Grenzen – also was kommt auf keinen Fall infrage?",
         placeholder="z.B. Ich könnte zustimmen, wenn … Nicht akzeptabel wäre auf jeden Fall …", position=1),
    dict(phase="verhandlung", step_key="verhandlung_vereinbarung", title="Konkrete Vereinbarungen",
         description="Welche konkreten Schritte, Regeln oder Vereinbarungen schlagen Sie vor? Je konkreter, desto besser – mit Datum, Betrag, Häufigkeit.",
         placeholder="z.B. Wir vereinbaren, dass ab dem 01.06. … in Höhe von … monatlich …", position=2),

    # --- abschluss ---
    dict(phase="abschluss", step_key="abschluss_ergebnis", title="Ergebnis der Mediation",
         description="Halten Sie fest, was vereinbart wurde. Jede Vereinbarung so konkret wie möglich: Wer tut was, wann, unter welchen Bedingungen?",
         placeholder="z.B. Beide Parteien sind übereingekommen, dass …", position=0),
    dict(phase="abschluss", step_key="abschluss_schritte", title="Nächste Schritte und Verantwortlichkeiten",
         description="Wer ist für die Umsetzung verantwortlich? Was passiert, wenn eine Vereinbarung nicht eingehalten wird? Konkrete Fristen setzen.",
         placeholder="z.B. Bis zum … wird von … folgendes erledigt: …", position=1),
    dict(phase="abschluss", step_key="abschluss_feedback", title="Abschluss und Reflexion",
         description="Wie war der Mediationsprozess für Sie? Was nehmen Sie mit? Ein bewusster Abschluss stärkt die Nachhaltigkeit der Vereinbarungen.",
         placeholder="z.B. Für mich war besonders hilfreich, dass … Ich nehme mit, dass …", position=2),
]


def upgrade() -> None:
    table = op.create_table(
        "phase_step_defaults",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("mediation_type", sa.String(), nullable=False, index=True),
        sa.Column("phase", sa.String(), nullable=False, index=True),
        sa.Column("step_key", sa.String(), nullable=False),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("description", sa.Text(), nullable=False, server_default=""),
        sa.Column("placeholder", sa.Text(), nullable=False, server_default=""),
        sa.Column("reflection_mode", sa.String(), nullable=True),
        sa.Column("required_roles", sa.String(), nullable=True),
        sa.Column("position", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("enabled", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.UniqueConstraint("mediation_type", "phase", "step_key", name="uq_phase_step_default"),
    )

    rows = []
    for mediation_type in MEDIATION_TYPES:
        for step in PHASE_STEP_DEFAULTS:
            rows.append({**step, "mediation_type": mediation_type})

    op.bulk_insert(
        table,
        [
            {
                "mediation_type": r["mediation_type"],
                "phase": r["phase"],
                "step_key": r["step_key"],
                "title": r["title"],
                "description": r["description"],
                "placeholder": r["placeholder"],
                "reflection_mode": r.get("reflection_mode"),
                "required_roles": None,
                "position": r["position"],
                "enabled": True,
            }
            for r in rows
        ],
    )


def downgrade() -> None:
    op.drop_table("phase_step_defaults")
