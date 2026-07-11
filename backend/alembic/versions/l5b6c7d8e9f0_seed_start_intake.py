"""Seed: Show-Onboarding "start_intake" (Phase einladung) für alle 4 Typen.

Ersetzt den hardcodierten NewMediationWizard (formFields aus
lib/mediation-types/*/config.ts) durch einen WorkflowManager-Schritt: Der
neue Start-Flow (StartFlowClient) rendert die Blöcke dieses Schritts als
Vollbild-Erlebnis — Cold Open, ein Screen pro Frage, Kapitel-Zwischentitel.

Fachliches Konzept (Intake / Auftragsklärung, Phase 0 der Mediation):
  1. Cold Open (Begrüßung, was passiert, Dauer)          → textausgabe
  2. Arbeitsbündnis: 4 Grundsätze der Mediation
     (Freiwilligkeit, Vertraulichkeit, Allparteilichkeit,
     Ergebnisoffenheit) + Abgrenzung zur Rechtsberatung  → zustimmung
  3. Kapitel 1 · Ihre Geschichte: freies Eröffnungs-
     statement (map_to=description → Fallbeschreibung),
     Beteiligte, bisherige Lösungsversuche               → frage
  4. Kapitel 2 · Die Fakten: typspezifische Eckdaten
     (datum/auswahl/frage)                               → typspezifisch
  5. Kapitel 3 · Der Blick nach vorn: Dringlichkeit
     (map_to=priority), Risiko-/Eskalationsscreening,
     Wunderfrage, Zuversichts-Skala 1–10 (Baseline,
     am Abschluss erneut messbar)                        → frage/skala

Block-config-Konventionen (werden vom StartFlowClient interpretiert,
im Designer tolerant ignoriert):
  • map_to: "description" | "priority"  → fließt in mediation.description/priority
  • title (bei textausgabe)             → große Kapitel-/Intro-Überschrift

Idempotent: legt start_intake nur an, wenn er für den Typ fehlt; bestehende
einladung-Schritte werden dann um +1 nach hinten geschoben (start_intake = 0).

Revision ID: l5b6c7d8e9f0
Revises: k4z5a6b7c8d9
Create Date: 2026-07-11
"""
from datetime import datetime, timezone

import sqlalchemy as sa
from alembic import op

revision = "l5b6c7d8e9f0"
down_revision = "k4z5a6b7c8d9"
branch_labels = None
depends_on = None

TYPES = ["trennung", "erbschaft", "nachbarschaft", "geschaeft"]


def _b(bid, btype, **config):
    return {"id": bid, "type": btype, "config": config, "visible_if": None}


# ── Gemeinsame Dramaturgie ───────────────────────────────────────────────────

def _intro(text):
    return _b("st_intro", "textausgabe", title="Schön, dass Sie da sind.", text=text)


_RAHMEN = _b(
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
)

_KAP1 = _b(
    "st_kap1", "textausgabe",
    title="Kapitel 1 · Ihre Geschichte",
    text=(
        "Erzählen Sie zuerst frei — noch keine Bewertung, kein Urteil, keine "
        "Lösung. Erst die Geschichte, dann die Fakten, dann der Blick nach vorn."
    ),
)

_KAP2 = _b(
    "st_kap2", "textausgabe",
    title="Kapitel 2 · Die Fakten",
    text=(
        "Jetzt die nüchternen Eckdaten. Sie helfen, den Fall richtig "
        "einzuordnen — alles Weitere klären wir später gemeinsam."
    ),
)

_KAP3 = _b(
    "st_kap3", "textausgabe",
    title="Kapitel 3 · Der Blick nach vorn",
    text=(
        "Zum Schluss drehen wir die Perspektive: weg von dem, was war — hin zu "
        "dem, was werden soll."
    ),
)


def _geschichte(situation_prompt, beteiligte_prompt):
    return [
        _KAP1,
        _b("st_situation", "frage", prompt=situation_prompt, map_to="description"),
        _b("st_beteiligte", "frage", prompt=beteiligte_prompt),
        _b("st_versucht", "frage", prompt=(
            "Was haben Sie schon versucht, um das zu klären — und woran ist es "
            "bisher gescheitert?"
        )),
    ]


def _blick(dringend_placeholder, risiko_prompt):
    return [
        _KAP3,
        _b("st_dringend", "frage", map_to="priority", prompt=(
            "Was brennt gerade am meisten? Wenn nur EIN Thema in den nächsten "
            "Wochen geklärt würde — welches müsste es sein?"
        ), placeholder=dringend_placeholder),
        _b("st_risiken", "frage", prompt=risiko_prompt),
        _b("st_ziel", "frage", prompt=(
            "Stellen Sie sich vor, in drei Monaten ist das hier gut geklärt: "
            "Woran merken Sie es zuerst — ganz konkret, im Alltag?"
        )),
        _b("st_zuversicht", "skala",
           prompt=("Wie zuversichtlich sind Sie heute, dass eine faire Einigung "
                   "möglich ist?"),
           min=1, max=10, minLabel="kaum vorstellbar", maxLabel="sehr zuversichtlich"),
    ]


# ── Typspezifische Inhalte ───────────────────────────────────────────────────

def _blocks_for(t):
    if t == "trennung":
        return [
            _intro(
                "Eine Trennung wirft hundert Fragen auf einmal auf. Die nächsten "
                "fünf Minuten gehören nur Ihnen und Ihrer Situation: kein "
                "Juristendeutsch, keine Formular-Batterie — ein Gespräch. Wir "
                "stellen Ihnen die Fragen, die eine erfahrene Mediatorin im "
                "ersten Gespräch stellen würde. Alles bleibt vertraulich."
            ),
            _RAHMEN,
            *_geschichte(
                ("Was ist passiert? Beschreiben Sie Ihre Trennungssituation so, "
                 "wie Sie sie einer guten Freundin erzählen würden — in Ihren "
                 "Worten."),
                ("Wer gehört alles dazu — Partner:in, Kinder, vielleicht neue "
                 "Partner? Und wie sprechen Sie heute miteinander?"),
            ),
            _KAP2,
            _b("st_f_ehe", "datum", label="Datum der Eheschließung",
               help="Falls nicht verheiratet: einfach überspringen."),
            _b("st_f_trennung", "datum", label="Datum der (räumlichen) Trennung",
               help="Ab hier läuft z. B. das Trennungsjahr."),
            _b("st_f_kinder", "auswahl", prompt="Haben Sie gemeinsame Kinder?",
               options=["Ja, minderjährige Kinder", "Ja, nur volljährige Kinder", "Nein"],
               multi=False),
            *_blick(
                "z. B. Kinderbetreuung, Unterhalt, Wohnung, Konten, Kommunikation",
                ("Gibt es akute Risiken oder Eskalationen — etwa Drohungen, "
                 "gesperrte Konten, verweigerten Umgang, Kontaktabbruch? "
                 "(Bei Gewalt oder Angst um Ihre Sicherheit ist eine Mediation "
                 "nicht der richtige erste Schritt — holen Sie sich bitte "
                 "direkte Hilfe.)"),
            ),
        ]
    if t == "erbschaft":
        return [
            _intro(
                "Ein Erbfall bringt Trauer und Organisation auf einmal — und oft "
                "alte Familienthemen dazu. Die nächsten fünf Minuten gehören "
                "Ihrer Sicht der Dinge: ein Gespräch, keine Formular-Batterie. "
                "Wir fragen, was eine erfahrene Mediatorin im ersten Gespräch "
                "fragen würde. Alles bleibt vertraulich."
            ),
            _RAHMEN,
            *_geschichte(
                ("Was ist die Situation? Erzählen Sie in Ihren Worten: Wer ist "
                 "verstorben, worum wird gerungen, und wie ist es dazu gekommen?"),
                ("Wer gehört zur Erbengemeinschaft — und wie stehen die "
                 "Beteiligten heute zueinander?"),
            ),
            _KAP2,
            _b("st_f_erbfall", "datum", label="Wann ist der Erbfall eingetreten?",
               help="Der Todestag — wichtig für Fristen (z. B. Ausschlagung)."),
            _b("st_f_testament", "auswahl",
               prompt="Gibt es ein Testament oder einen Erbvertrag?",
               options=["Ja, ein Testament", "Ja, einen Erbvertrag",
                        "Nein — gesetzliche Erbfolge", "Unklar / wird noch gesucht"],
               multi=False),
            _b("st_f_nachlass", "frage", prompt=(
                "Was gehört grob zum Nachlass — Immobilien, Konten, Unternehmen, "
                "besondere Gegenstände? Eine Schätzung reicht völlig."
            )),
            *_blick(
                "z. B. Immobilie, Fristen, Auszahlung, Pflichtteil, Familienfrieden",
                ("Gibt es Fristen oder akute Eskalationen — etwa eine drohende "
                 "Ausschlagungsfrist, blockierte Konten, eingeschaltete Anwälte "
                 "oder Kontaktabbruch in der Familie?"),
            ),
        ]
    if t == "nachbarschaft":
        return [
            _intro(
                "Ein Nachbarschaftskonflikt wohnt nebenan — man begegnet sich "
                "jeden Tag. Umso wichtiger, ihn gut zu lösen. Die nächsten fünf "
                "Minuten gehören Ihrer Sicht: ein Gespräch, keine Formular-"
                "Batterie. Wir fragen, was eine erfahrene Mediatorin im ersten "
                "Gespräch fragen würde. Alles bleibt vertraulich."
            ),
            _RAHMEN,
            *_geschichte(
                ("Was ist vorgefallen? Erzählen Sie die Geschichte in Ihren "
                 "Worten — gern auch, wie es angefangen hat."),
                ("Wer ist beteiligt — nur Sie und die Nachbarn, oder auch "
                 "Vermieter, Verwaltung, weitere Parteien?"),
            ),
            _KAP2,
            _b("st_f_seit", "frage", prompt=(
                "Seit wann schwelt der Konflikt — und gab es einen konkreten "
                "Auslöser?"
            )),
            _b("st_f_thema", "auswahl", prompt="Worum geht es hauptsächlich?",
               options=["Lärm", "Grenze / Zaun", "Bäume / Hecke / Garten",
                        "Zuwegung / Parken", "Bauvorhaben", "Tiere", "Sonstiges"],
               multi=True),
            _b("st_f_kontakt", "auswahl", prompt="Wie ist der Kontakt heute?",
               options=["Wir reden noch normal miteinander",
                        "Nur noch das Nötigste", "Funkstille",
                        "Behörden oder Anwälte sind schon eingeschaltet"],
               multi=False),
            *_blick(
                "z. B. nachts endlich Ruhe, die Grenzfrage, das nächste Gespräch",
                ("Gibt es akute Eskalationen — Anzeigen, Beschädigungen, "
                 "Drohungen, laufende Verfahren?"),
            ),
        ]
    # geschaeft
    return [
        _intro(
            "Konflikte im Geschäft kosten doppelt: Geld und Energie. Die "
            "nächsten fünf Minuten gehören Ihrer Sicht der Lage: ein "
            "strukturiertes Gespräch, keine Formular-Batterie. Wir fragen, "
            "was ein erfahrener Wirtschaftsmediator im ersten Gespräch fragen "
            "würde. Alles bleibt vertraulich."
        ),
        _RAHMEN,
        *_geschichte(
            ("Was ist die Lage? Beschreiben Sie den Konflikt so, wie Sie ihn "
             "einem vertrauten Sparringspartner schildern würden — Zahlen und "
             "Details kommen später."),
            ("Wer ist beteiligt — und in welchen Rollen (Gesellschafter, "
             "Geschäftsführung, Team, Kunde, Lieferant)?"),
        ),
        _KAP2,
        _b("st_f_ebene", "auswahl",
           prompt="Auf welcher Ebene liegt der Konflikt vor allem?",
           options=["Sache (Zahlen, Verträge, Leistung)",
                    "Beziehung (Vertrauen, Kommunikation)",
                    "Rolle (Zuständigkeit, Anerkennung)",
                    "Struktur (Prozesse, Verantwortung)"],
           multi=True),
        _b("st_f_druck", "skala",
           prompt="Wie hoch ist der wirtschaftliche bzw. organisatorische Druck?",
           min=1, max=10, minLabel="läuft nebenher", maxLabel="existenzbedrohend"),
        _b("st_f_frist", "frage", prompt=(
            "Gibt es Fristen oder Termine, die Druck machen — Verträge, "
            "Gesellschafterversammlung, Projekt-Deadlines?"
        )),
        *_blick(
            "z. B. Zahlungsfrage, Zusammenarbeit im Team, Gesellschafterfrage",
            ("Gibt es akute Eskalationen — angedrohte Kündigungen, Anwälte, "
             "blockierte Entscheidungen, drohende Trennung von Partnern?"),
        ),
    ]


TITLES = {
    "trennung": "Ihr Start — die Trennung sortieren",
    "erbschaft": "Ihr Start — den Erbfall sortieren",
    "nachbarschaft": "Ihr Start — den Konflikt sortieren",
    "geschaeft": "Ihr Start — die Lage sortieren",
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
        exists = conn.execute(
            sa.select(psd.c.id).where(
                sa.and_(
                    psd.c.mediation_type == t,
                    psd.c.phase == "einladung",
                    psd.c.step_key == "start_intake",
                    psd.c.variant_key.is_(None),
                )
            )
        ).first()
        if exists:
            continue

        # Bestehende Onboarding-Schritte nach hinten schieben, Intake ganz nach vorn.
        conn.execute(
            psd.update()
            .where(
                sa.and_(
                    psd.c.mediation_type == t,
                    psd.c.phase == "einladung",
                    psd.c.variant_key.is_(None),
                )
            )
            .values(position=psd.c.position + 1)
        )
        conn.execute(
            psd.insert().values(
                mediation_type=t,
                phase="einladung",
                step_key="start_intake",
                variant_key=None,
                title=TITLES[t],
                description="Der geführte Einstieg: Geschichte, Fakten, Blick nach vorn.",
                placeholder="",
                reflection_mode=None,
                content_types=None,
                blocks=_blocks_for(t),
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
                psd.c.phase == "einladung",
                psd.c.step_key == "start_intake",
                psd.c.variant_key.is_(None),
            )
        )
    )
