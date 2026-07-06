"""Phasen 2–5 als methodengetriebene, block-basierte Schritte (Vorbild: d7s8t9u0v1w2).

Ersetzt die einfachen Sammel-Schritte basis_themensammlung / basis_interessen /
basis_optionen / basis_verhandlung durch mehrere anwendungs- und zielorientierte
Content-Schritte. Jeder Schritt operationalisiert die klassischen Mediations-
Methoden als Teilnehmer-Bausteine:

  Phase 2 – Bestandsaufnahme (themensammlung)
    * Ununterbrochenes Eingangsstatement (Monolog sichern)
    * Sachliches Paraphrasieren / Vorwurf -> Thema (KI-Reframing)
    * Allparteiliche Struktur, neutrale Themen-Agenda
  Phase 3 – Interessenklärung (interessen)
    * Eisberg-Modell (unter die Wasseroberfläche)
    * W-Fragen nach dem Kern (Interessen-Scouting)
    * Reframing: Vorwurf -> Bedürfnis
    * Zirkuläre Fragen / Empathie-Brücke
  Phase 4 – Lösungsoptionen (optionen)
    * Trennung von Sammeln und Bewerten (Brainstorming)
    * Win-Win auf Basis der Interessen
  Phase 5 – Verhandlung & Vereinbarung (verhandlung)
    * Optionen bewerten (Skala/Ranking)
    * Realitäts-Check & Bedingungen
    * Verbindliche Vereinbarung: Wer macht was bis wann?

Idempotent & additiv: ein Schritt wird nur eingefügt, wenn sein step_key für
(type, phase, variant NULL) noch fehlt. Die alten basis_*-Sammel-Schritte dieser
vier Phasen werden – wie in der Einleitungs-Migration – entfernt, damit die Phase
nur aus den neuen Content-Schritten besteht. Texte sind generische, editierbare
Startpunkte (im Workflow Manager frei anpassbar) und gelten für alle drei Typen.

Revision ID: e8t9u0v1w2x3
Revises: d7s8t9u0v1w2
Create Date: 2026-07-06
"""
from datetime import datetime, timezone

import sqlalchemy as sa
from alembic import op

revision = "e8t9u0v1w2x3"
down_revision = "d7s8t9u0v1w2"
branch_labels = None
depends_on = None

TYPES = ["trennung", "erbschaft", "nachbarschaft"]

# Alte Sammel-Schritte dieser Phasen, die durch die neuen Content-Schritte
# abgelöst werden (aus c6r7s8t9u0v1).
REPLACED_BASE_STEPS = {
    "themensammlung": "basis_themensammlung",
    "interessen": "basis_interessen",
    "optionen": "basis_optionen",
    "verhandlung": "basis_verhandlung",
}


def _b(bid, btype, **config):
    return {"id": bid, "type": btype, "config": config, "visible_if": None}


# ── Phase 2 – Bestandsaufnahme (themensammlung) ────────────────────────────────
THEMENSAMMLUNG_STEPS = [
    (
        "themen_ankommen", "Ankommen & Rahmen",
        "Struktur und Entlastung: erst ordnen, dann klären.",
        [
            _b("th_an_t", "textausgabe", text=(
                "Jetzt geht es um eine geordnete Bestandsaufnahme. Ziel dieses "
                "Abschnitts ist nicht, Recht zu bekommen, sondern Ordnung und "
                "Entlastung: Wir sammeln in Ruhe alle Themen, die auf den Tisch "
                "gehören – ohne sie schon zu bewerten oder zu lösen."
            )),
            _b("th_an_hi", "hinweis", variant="info", text=(
                "Wichtig: Niemand wird unterbrochen. Jede Seite bekommt gleich viel "
                "Zeit und Raum. Was dir wichtig ist, wird festgehalten und geht nicht "
                "verloren."
            )),
            _b("th_an_zu", "zustimmung", text=(
                "Ich bin bereit, in diesem Abschnitt erst zu sammeln und noch nicht zu "
                "diskutieren oder zu lösen."
            )),
        ],
    ),
    (
        "themen_statement", "Deine Sicht – ununterbrochen",
        "Dein Eingangsstatement, das niemand unterbricht.",
        [
            _b("th_st_t", "textausgabe", text=(
                "Schildere in eigenen Worten, wie du die Situation erlebst. Nimm dir so "
                "viel Raum, wie du brauchst – hier unterbricht dich niemand. Sprich aus "
                "deiner Sicht (in Ich-Form), statt der anderen Seite Vorwürfe zu machen."
            )),
            _b("th_st_in", "texteingabe", label="Wie erlebst du die Situation?",
               placeholder=(
                   "Was ist passiert, was beschäftigt dich, wo hakt die "
                   "Zusammenarbeit / das Miteinander gerade?"
               )),
            _b("th_st_va", "video_aufnahme", prompt=(
                "Wenn du magst, sprich deine Sicht als kurze Videobotschaft ein – "
                "manchmal ist Reden leichter als Schreiben."
            )),
        ],
    ),
    (
        "themen_zu_themen", "Aus Vorwurf wird Thema",
        "Wir filtern die Schärfe heraus und behalten die Sachthemen.",
        [
            _b("th_zt_t", "textausgabe", text=(
                "In der Hitze fallen schnell Vorwürfe. Für die Mediation übersetzen wir "
                "sie in sachliche Themen: Aus „der blockiert immer alles“ wird z. B. das "
                "Thema „Abstimmung von Freigaben und Abläufen“. Es geht nicht darum, wer "
                "angefangen hat, sondern worüber ihr gemeinsam sprechen wollt."
            )),
            _b("th_zt_li", "liste", prompt=(
                "Welche Themen gehören für dich auf die gemeinsame Agenda? Formuliere "
                "sie möglichst neutral (Überschriften, keine Vorwürfe)."
            ), placeholder="Ein Thema, sachlich formuliert …"),
            _b("th_zt_ki", "ki_reframing", prompt=(
                "Formuliere die eingegebenen Themen und Aussagen in eine sachliche, "
                "vorwurfsfreie Sprache um. Mache aus Vorwürfen neutrale "
                "Themen-Überschriften, ohne den Inhalt zu verfälschen."
            ), autorun=False),
        ],
    ),
    (
        "themen_agenda", "Gemeinsame Themen-Agenda",
        "Alle Themen sichtbar – nichts geht verloren.",
        [
            _b("th_ag_t", "textausgabe", text=(
                "Aus euren Punkten entsteht jetzt eine gemeinsame, sachliche Agenda. "
                "Wenn beide Seiten sehen, dass ihre Themen aufgenommen wurden, sinkt die "
                "Anspannung – das ist die Grundlage für die nächsten Schritte."
            )),
            _b("th_ag_ra", "ranking", prompt=(
                "Bring die gesammelten Themen in die Reihenfolge, in der wir sie aus "
                "deiner Sicht bearbeiten sollten."
            ), options=[]),
            _b("th_ag_ki", "ki_zusammenfassung", prompt=(
                "Fasse die Themen beider Parteien zu einer neutralen, gemeinsamen "
                "Themen-Agenda zusammen. Führe gleiche/ähnliche Themen zusammen und "
                "liste sie als sachliche Überschriften auf, ohne zu werten."
            ), autorun=False),
            _b("th_ag_vn", "vertrauliche_notiz", prompt=(
                "Gibt es etwas, das du zunächst nur der mediierenden Person mitteilen "
                "möchtest (nicht der anderen Seite)?"
            )),
            _b("th_ag_ga", "gate", text=(
                "Weiter geht es, sobald beide Seiten ihre Themen eingebracht und die "
                "gemeinsame Agenda gesehen haben."
            )),
        ],
    ),
]

# ── Phase 3 – Interessenklärung (interessen) ──────────────────────────────────
INTERESSEN_STEPS = [
    (
        "int_eisberg", "Unter die Oberfläche",
        "Das Eisberg-Modell: Was liegt unter der Wasserlinie?",
        [
            _b("in_ei_t", "textausgabe", text=(
                "Bisher ging es um Positionen – das, was sichtbar über der Wasserlinie "
                "liegt („Ich will X“). Darunter liegen die eigentlichen Antriebe: "
                "Bedürfnisse, Sorgen, Werte. Wenn wir diese verstehen, wird eine Lösung "
                "möglich, die für beide trägt. Dies ist meist die längste, aber "
                "wichtigste Phase – nimm dir Zeit."
            )),
            _b("in_ei_v", "video", url=""),
        ],
    ),
    (
        "int_wfragen", "Was steckt dahinter?",
        "W-Fragen nach dem Kern: nicht das Was, sondern das Warum.",
        [
            _b("in_wf_t", "textausgabe", text=(
                "Denk an einen Moment aus dem Konflikt, der dich besonders getroffen "
                "hat. Wir fragen jetzt nicht nach den Fakten, sondern nach der "
                "Bedeutung: Was war daran für dich das Schwierigste – und warum?"
            )),
            _b("in_wf_q", "frage", prompt=(
                "Was ist dir bei diesen Themen wirklich wichtig – und warum? Was "
                "brauchst du, damit sich die Situation für dich gut anfühlt?"
            )),
            _b("in_wf_sk", "skala", prompt="Wie wichtig ist dir eine Einigung?",
               min=1, max=10, minLabel="weniger wichtig", maxLabel="sehr wichtig"),
        ],
    ),
    (
        "int_reframing", "Vom Vorwurf zum Bedürfnis",
        "Hinter jedem harten Einspruch steckt ein Bedürfnis.",
        [
            _b("in_rf_t", "textausgabe", text=(
                "Vorwürfe sind oft nur die laute Verpackung eines Bedürfnisses. Hinter "
                "„die halten sich an keine Regeln“ kann der Wunsch nach Sicherheit und "
                "Anerkennung der eigenen Verantwortung stehen. Was ging in dir vor, als "
                "der Konflikt eskalierte?"
            )),
            _b("in_rf_q", "frage", prompt=(
                "Was ging in dir vor, als es zum Streit kam? Welche Sorge oder welches "
                "Bedürfnis steckt hinter deiner Reaktion?"
            )),
            _b("in_rf_ki", "ki_interessen", prompt=(
                "Leite aus den geäußerten Positionen und Vorwürfen die dahinterliegenden "
                "Interessen und Bedürfnisse jeder Partei ab (z. B. Anerkennung, "
                "Sicherheit, Verlässlichkeit, Respekt, Einbindung)."
            ), autorun=False),
        ],
    ),
    (
        "int_perspektive", "Perspektivwechsel",
        "Zirkuläre Fragen: die Empathie-Brücke.",
        [
            _b("in_pe_t", "textausgabe", text=(
                "Jetzt kommt der entscheidende Moment: der Wechsel der Perspektive. Wenn "
                "du hörst, welche Last, welche Sorge und welches Bedürfnis die andere "
                "Seite antreibt – wie wirkt das auf dich? Oft zeigt sich: Es ging nie um "
                "die Person, sondern um eine unerfüllte Sorge."
            )),
            _b("in_pe_q", "frage", prompt=(
                "Wenn du der anderen Seite so zuhörst und ihr Bedürfnis dahinter siehst: "
                "Wie verändert das deinen Blick auf den Konflikt?"
            )),
            _b("in_pe_ki", "ki_gemeinsamkeiten", prompt=(
                "Identifiziere gemeinsame und ergänzende Interessen beider Parteien und "
                "benenne, wo trotz des Konflikts ein gemeinsames Anliegen sichtbar wird."
            ), autorun=False),
        ],
    ),
]

# ── Phase 4 – Lösungsoptionen (optionen) ──────────────────────────────────────
OPTIONEN_STEPS = [
    (
        "opt_sammeln_regel", "Erst sammeln, nicht bewerten",
        "Die goldene Regel des Brainstormings.",
        [
            _b("op_sr_t", "textausgabe", text=(
                "Jetzt kennt ihr die Interessen hinter dem Streit. Darauf bauen wir "
                "Lösungen. Die wichtigste Regel: erst sammeln, dann bewerten. In diesem "
                "Abschnitt ist jede Idee erlaubt – auch ungewöhnliche. Je mehr Optionen "
                "auf dem Tisch liegen, desto größer die Chance auf eine Lösung, die für "
                "beide passt."
            )),
            _b("op_sr_hi", "hinweis", variant="info", text=(
                "Noch wird nichts entschieden. Kritik und „ja, aber …“ heben wir uns für "
                "den nächsten Abschnitt auf."
            )),
        ],
    ),
    (
        "opt_ideen", "Ideen sammeln",
        "So viele Lösungsideen wie möglich.",
        [
            _b("op_id_li", "liste", prompt=(
                "Welche Lösungsmöglichkeiten fallen dir ein? Denk an Optionen, die auch "
                "das Bedürfnis der anderen Seite berücksichtigen."
            ), placeholder="Eine Idee …"),
            _b("op_id_in", "texteingabe", label="Eine Idee, die beiden helfen könnte",
               placeholder=(
                   "Beschreibe eine Lösung, bei der beide Seiten etwas Wichtiges "
                   "bekommen."
               )),
        ],
    ),
    (
        "opt_winwin", "Auf Interessen aufbauen",
        "Aus Bedürfnissen werden Win-Win-Optionen.",
        [
            _b("op_ww_t", "textausgabe", text=(
                "Die besten Lösungen erfüllen die Kernbedürfnisse beider Seiten "
                "gleichzeitig – zum Beispiel schnelle Umsetzung für die eine und "
                "rechtzeitige Einbindung/Sicherheit für die andere Seite. Lass uns die "
                "Ideen daraufhin schärfen."
            )),
            _b("op_ww_ki", "ki_optionen", prompt=(
                "Erarbeite auf Basis der gesammelten Ideen und der zuvor ermittelten "
                "Interessen mehrere faire, umsetzbare Lösungsoptionen, die die "
                "Kernbedürfnisse beider Seiten zugleich berücksichtigen."
            ), autorun=False),
            _b("op_ww_q", "frage", prompt=(
                "Welche der Optionen erfüllt aus deiner Sicht ein wichtiges Bedürfnis "
                "der anderen Seite – ohne dir zu schaden?"
            )),
        ],
    ),
]

# ── Phase 5 – Verhandlung & Vereinbarung (verhandlung) ────────────────────────
VERHANDLUNG_STEPS = [
    (
        "ver_bewerten", "Optionen bewerten",
        "Jetzt wird geprüft, was wirklich trägt.",
        [
            _b("ve_bw_t", "textausgabe", text=(
                "Nun bewertet ihr die gesammelten Optionen. Es geht nicht ums "
                "Gewinnen, sondern um eine Lösung, die für beide funktioniert und im "
                "Alltag hält."
            )),
            _b("ve_bw_ra", "ranking", prompt=(
                "Bring die Lösungsoptionen in deine bevorzugte Reihenfolge."
            ), options=[]),
            _b("ve_bw_sk", "skala", prompt=(
                "Wie zufrieden wärst du mit deiner bevorzugten Option?"
            ), min=1, max=10, minLabel="gar nicht", maxLabel="voll und ganz"),
        ],
    ),
    (
        "ver_bedingungen", "Realitäts-Check & Bedingungen",
        "Unter welchen Bedingungen trägt die Lösung?",
        [
            _b("ve_bd_t", "textausgabe", text=(
                "Eine Vereinbarung hält nur, wenn sie realistisch ist. Prüfe deine "
                "bevorzugte Lösung ehrlich: Was brauchst du, damit sie funktioniert – "
                "und was könntest du der anderen Seite anbieten?"
            )),
            _b("ve_bd_q", "frage", prompt=(
                "Unter welchen Bedingungen ist die Lösung für dich tragfähig? Was ist "
                "dein Beitrag, was brauchst du von der anderen Seite?"
            )),
            _b("ve_bd_ki", "ki_gemeinsamkeiten", prompt=(
                "Identifiziere Übereinstimmungen und verbleibende Konfliktpunkte "
                "zwischen den Parteien. Markiere klar, wo eine Einigung bereits nahe "
                "liegt und wo noch verhandelt werden muss."
            ), autorun=False),
        ],
    ),
    (
        "ver_vereinbarung", "Verbindliche Vereinbarung",
        "Wer macht was bis wann?",
        [
            _b("ve_va_t", "textausgabe", text=(
                "Aus einer guten Absicht wird erst dann eine Lösung, wenn sie konkret "
                "wird. Haltet fest: Wer macht was bis wann? Je genauer, desto "
                "verlässlicher – und desto weniger Anlass für neuen Streit."
            )),
            _b("ve_va_in", "texteingabe", label="Konkrete Schritte (wer / was / bis wann)",
               placeholder=(
                   "z. B.: Ich stimme neue Vorhaben künftig vorab kurz mit der anderen "
                   "Seite ab – ab sofort."
               )),
            _b("ve_va_zu", "zustimmung", text=(
                "Ich bin bereit, die gemeinsam festgehaltenen Schritte verbindlich "
                "umzusetzen."
            )),
        ],
    ),
]


PHASE_STEPS = {
    "themensammlung": THEMENSAMMLUNG_STEPS,
    "interessen": INTERESSEN_STEPS,
    "optionen": OPTIONEN_STEPS,
    "verhandlung": VERHANDLUNG_STEPS,
}


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
        for phase, steps in PHASE_STEPS.items():
            # Alten Sammel-Schritt dieser Phase entfernen (wie bei der Einleitung),
            # damit die Phase nur aus den neuen Content-Schritten besteht.
            conn.execute(
                psd.delete().where(
                    sa.and_(
                        psd.c.mediation_type == t,
                        psd.c.phase == phase,
                        psd.c.step_key == REPLACED_BASE_STEPS[phase],
                        psd.c.variant_key.is_(None),
                    )
                )
            )
            for pos, (step_key, title, description, blocks) in enumerate(steps):
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
                        position=pos,
                        enabled=True,
                        created_at=now,
                        updated_at=now,
                    )
                )


def downgrade() -> None:
    conn = op.get_bind()
    psd = _table()
    for phase, steps in PHASE_STEPS.items():
        step_keys = [s[0] for s in steps]
        conn.execute(
            psd.delete().where(
                sa.and_(
                    psd.c.mediation_type.in_(TYPES),
                    psd.c.phase == phase,
                    psd.c.step_key.in_(step_keys),
                    psd.c.variant_key.is_(None),
                )
            )
        )
