"""Trennungs-Intake ernster: Hintergrund abfragen statt voraussetzen.

Feedback (2026-07-18): Der Start-Flow soll Show-Dramaturgie behalten, aber
bei einem Thema wie Trennung SEHR ernst wirken. Vor allem: Wir kennen den
Hintergrund nicht — auch wenn die eingebende Person die Trennung will,
wissen wir nicht, wo die andere Seite steht, ob die Entscheidung endgültig
ist oder ob die Partnerin / der Partner überhaupt von diesem Schritt weiß.

Änderungen am start_intake (nur mediation_type=trennung):
  • Cold Open ohne Flapsigkeit ("keine Formular-Batterie" etc. raus),
    würdigt die Schwere der Situation, egal von wem die Trennung ausgeht.
  • Kapitel 1 heißt jetzt "Wo Sie stehen" + Hinweis-Block: Mediation ist
    ergebnisoffen — sie kann eine Trennung fair regeln ODER erst klären,
    wie es überhaupt weitergehen soll. Nichts muss heute entschieden sein.
  • Neue Fragen zum Hintergrund (je ein Screen, alle überspringbar):
      st2_ausgang     auswahl  Von wem geht die Trennung aus?
      st2_endgueltig  auswahl  Wie endgültig ist die Entscheidung heute?
      st2_partner     frage    Wie erlebt die andere Seite die Situation?
                               (Allparteilichkeit von Anfang an)
      st2_wissen      auswahl  Weiß die Partnerin / der Partner von der
                               Mediation? (wichtig fürs spätere Einladen)
  • "einer guten Freundin erzählen" → neutrale, ernste Formulierung.
  • Bestehende Block-ids (st_situation, st_beteiligte, st_versucht,
    st_f_*, st_dringend, st_risiken, st_ziel, st_zuversicht) bleiben
    erhalten, damit gespeicherte block_responses gültig bleiben.

Idempotent wie l5b6c7d8e9f0: aktualisiert nur, wenn die erste Block-id
noch nicht der neue Marker (st2_intro) ist — spätere Designer-Anpassungen
werden nicht überschrieben.

Revision ID: s1t2u3v4w5x6
Revises: r0s1t2u3v4w5
Create Date: 2026-07-18
"""
from datetime import datetime, timezone

import sqlalchemy as sa
from alembic import op

revision = "s1t2u3v4w5x6"
down_revision = "r0s1t2u3v4w5"
branch_labels = None
depends_on = None


def _b(bid, btype, **config):
    return {"id": bid, "type": btype, "config": config, "visible_if": None}


BLOCKS = [
    # ── Cold Open: ernst, ohne Vorannahme über den Hintergrund ──────────────
    _b(
        "st2_intro", "textausgabe",
        title="Nehmen Sie sich einen Moment.",
        text=(
            "Eine Trennung gehört zu den einschneidendsten Erfahrungen, die es "
            "gibt — unabhängig davon, ob Sie diesen Schritt selbst gehen, ob er "
            "Sie getroffen hat oder ob noch vieles offen ist. Wir stellen Ihnen "
            "jetzt die Fragen, die eine erfahrene Mediatorin in einem ersten, "
            "ruhigen Gespräch stellen würde. Es gibt keine richtigen oder "
            "falschen Antworten, und Sie dürfen jede Frage überspringen. Alles, "
            "was Sie schreiben, bleibt vertraulich."
        ),
    ),
    # ── Arbeitsbündnis (unverändert ernst) ──────────────────────────────────
    _b(
        "st_rahmen", "zustimmung",
        text=(
            "Bevor wir starten, das Fundament jeder Mediation — vier Grundsätze: "
            "FREIWILLIGKEIT (niemand muss, alle wollen — Sie können jederzeit "
            "aussteigen). VERTRAULICHKEIT (was Sie hier schreiben, dient nur der "
            "Mediation). ALLPARTEILICHKEIT (die Mediation steht auf keiner Seite — "
            "sie steht für eine faire Lösung). ERGEBNISOFFENHEIT (die Lösung "
            "entwickeln Sie selbst, nichts wird vorgegeben). Wichtig: Mediation "
            "ersetzt keine Rechtsberatung. Ich möchte auf dieser Grundlage arbeiten."
        ),
    ),
    # ── Kapitel 1 · Wo Sie stehen ───────────────────────────────────────────
    _b(
        "st_kap1", "textausgabe",
        title="Kapitel 1 · Wo Sie stehen",
        text=(
            "Erzählen Sie zuerst, wie Sie die Situation erleben — ohne Bewertung, "
            "ohne Urteil. Ihre Partnerin oder Ihr Partner bekommt später denselben "
            "Raum. Das gehört zur Mediation: Beide Seiten werden gehört."
        ),
    ),
    _b(
        "st2_offen", "hinweis",
        text=(
            "Sie müssen heute nichts endgültig entscheiden. Mediation ist "
            "ergebnisoffen: Sie kann eine Trennung fair und respektvoll regeln — "
            "oder zunächst klären, wie es überhaupt weitergehen soll. Beides ist "
            "ein guter Grund, hier zu sein."
        ),
    ),
    _b(
        "st_situation", "frage", map_to="description",
        prompt=(
            "Was ist geschehen? Beschreiben Sie in Ihren eigenen Worten, wie es "
            "zu der jetzigen Situation gekommen ist — und wo Sie heute stehen."
        ),
        placeholder="Nehmen Sie sich den Raum, den Sie brauchen.",
    ),
    _b(
        "st2_ausgang", "auswahl",
        prompt="Von wem geht die Trennung aus?",
        options=[
            "Von mir",
            "Von meiner Partnerin / meinem Partner",
            "Von uns beiden",
            "Das ist noch nicht entschieden",
        ],
        multi=False,
    ),
    _b(
        "st2_endgueltig", "auswahl",
        prompt="Wie endgültig ist die Entscheidung — aus heutiger Sicht?",
        options=[
            "Endgültig, für uns beide",
            "Für mich endgültig — für die andere Seite womöglich nicht",
            "Für die andere Seite endgültig — für mich nicht",
            "Es ist noch vieles offen",
        ],
        multi=False,
    ),
    _b(
        "st2_partner", "frage",
        prompt=(
            "Wie erlebt Ihre Partnerin / Ihr Partner die Situation — soweit Sie "
            "es einschätzen können? Auch eine Vermutung hilft. Mediation heißt, "
            "beiden Seiten gerecht zu werden."
        ),
    ),
    _b(
        "st2_wissen", "auswahl",
        prompt=(
            "Weiß Ihre Partnerin / Ihr Partner, dass Sie eine Mediation "
            "vorbereiten?"
        ),
        options=[
            "Ja, wir haben gemeinsam darüber gesprochen",
            "Angesprochen habe ich es — entschieden ist nichts",
            "Nein, noch nicht",
            "Ich weiß nicht, wie ich es ansprechen soll",
        ],
        multi=False,
    ),
    _b(
        "st_beteiligte", "frage",
        prompt=(
            "Wer gehört noch zu Ihrer Situation — Kinder, neue Partner, "
            "Angehörige? Und wie sprechen Sie und Ihre Partnerin / Ihr Partner "
            "heute miteinander?"
        ),
    ),
    _b(
        "st_versucht", "frage",
        prompt=(
            "Was haben Sie schon versucht, um das zu klären — und woran ist es "
            "bisher gescheitert?"
        ),
    ),
    # ── Kapitel 2 · Die Fakten ──────────────────────────────────────────────
    _b(
        "st_kap2", "textausgabe",
        title="Kapitel 2 · Die Fakten",
        text=(
            "Jetzt die nüchternen Eckdaten. Sie helfen, den Fall richtig "
            "einzuordnen — alles Weitere klären wir später gemeinsam."
        ),
    ),
    _b("st_f_ehe", "datum", label="Datum der Eheschließung",
       help="Falls nicht verheiratet: einfach überspringen."),
    _b("st_f_trennung", "datum", label="Datum der (räumlichen) Trennung",
       help="Ab hier läuft z. B. das Trennungsjahr. Noch nicht getrennt? Überspringen Sie das Feld."),
    _b("st_f_kinder", "auswahl", prompt="Haben Sie gemeinsame Kinder?",
       options=["Ja, minderjährige Kinder", "Ja, nur volljährige Kinder", "Nein"],
       multi=False),
    # ── Kapitel 3 · Der Blick nach vorn ─────────────────────────────────────
    _b(
        "st_kap3", "textausgabe",
        title="Kapitel 3 · Der Blick nach vorn",
        text=(
            "Zum Schluss drehen wir die Perspektive: weg von dem, was war — hin "
            "zu dem, was werden soll."
        ),
    ),
    _b(
        "st_dringend", "frage", map_to="priority",
        prompt=(
            "Was brennt gerade am meisten? Wenn nur EIN Thema in den nächsten "
            "Wochen geklärt würde — welches müsste es sein?"
        ),
        placeholder="z. B. Kinderbetreuung, Unterhalt, Wohnung, Konten, Kommunikation",
    ),
    _b(
        "st_risiken", "frage",
        prompt=(
            "Gibt es akute Risiken oder Eskalationen — etwa Drohungen, "
            "gesperrte Konten, verweigerten Umgang, Kontaktabbruch? "
            "(Bei Gewalt oder Angst um Ihre Sicherheit ist eine Mediation "
            "nicht der richtige erste Schritt — holen Sie sich bitte "
            "direkte Hilfe.)"
        ),
    ),
    _b(
        "st_ziel", "frage",
        prompt=(
            "Stellen Sie sich vor, in drei Monaten ist das hier gut geklärt: "
            "Woran merken Sie es zuerst — ganz konkret, im Alltag?"
        ),
    ),
    _b(
        "st_zuversicht", "skala",
        prompt=(
            "Wie zuversichtlich sind Sie heute, dass eine faire Einigung "
            "möglich ist?"
        ),
        min=1, max=10, minLabel="kaum vorstellbar", maxLabel="sehr zuversichtlich",
    ),
]

TITLE = "Ihr Start — die Situation in Ruhe sortieren"


def _table():
    return sa.table(
        "phase_step_defaults",
        sa.column("id", sa.Integer),
        sa.column("mediation_type", sa.String),
        sa.column("phase", sa.String),
        sa.column("step_key", sa.String),
        sa.column("variant_key", sa.String),
        sa.column("title", sa.String),
        sa.column("blocks", sa.JSON),
        sa.column("updated_at", sa.DateTime),
    )


def upgrade() -> None:
    conn = op.get_bind()
    psd = _table()

    row = conn.execute(
        sa.select(psd.c.id, psd.c.blocks).where(
            sa.and_(
                psd.c.mediation_type == "trennung",
                psd.c.phase == "einladung",
                psd.c.step_key == "start_intake",
                psd.c.variant_key.is_(None),
            )
        )
    ).first()
    if not row:
        # start_intake fehlt (l5b6c7d8e9f0 nicht gelaufen) — nichts zu tun,
        # der Seed dort legt beim nächsten upgrade ohnehin an; diese Migration
        # läuft danach erneut nicht, daher direkt einfügen wäre falsch verortet.
        return

    current = row[1] or []
    have_first = current[0].get("id") if current and isinstance(current[0], dict) else None
    if have_first == "st2_intro":
        return  # schon aktuell (oder bewusst im Designer angepasst)

    conn.execute(
        psd.update()
        .where(psd.c.id == row[0])
        .values(blocks=BLOCKS, title=TITLE, updated_at=datetime.now(timezone.utc))
    )


def downgrade() -> None:
    # Inhaltliches Seed-Update — Downgrade stellt bewusst nichts wieder her
    # (der alte Stand käme über l5b6c7d8e9f0 zurück, wenn nötig).
    pass
