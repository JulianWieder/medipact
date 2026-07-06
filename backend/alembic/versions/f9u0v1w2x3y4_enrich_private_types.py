"""Fachliche Vertiefung der privaten Mediationstypen (Trennung/Erbschaft/Nachbarschaft).

Reichert die Kernphasen (Themensammlung, Interessen, Optionen, Verhandlung,
Abschluss) pro Typ mit typenspezifischen Inhalten, anerkannten Frameworks
(Harvard-Prinzip: Interessen statt Positionen; BATNA) und leichter Diagnostik
(Bereichs-Auswahl, Belastungs-/Tragfähigkeits-Skalen) an.

Upsert auf die basis_<phase>-Schritte (aus Seed-Migration c6): existiert der
Schritt, werden Titel/Beschreibung/Blöcke aktualisiert; sonst neu angelegt. Die
Einleitung (d7) und das Onboarding bleiben unverändert.

Revision ID: f9u0v1w2x3y4
Revises: e8t9u0v1w2x3
Create Date: 2026-07-06
"""
from datetime import datetime, timezone

import sqlalchemy as sa
from alembic import op

revision = "f9u0v1w2x3y4"
down_revision = "e8t9u0v1w2x3"
branch_labels = None
depends_on = None


def _b(bid, btype, **config):
    return {"id": bid, "type": btype, "config": config, "visible_if": None}


# Harvard-Grundtext (Interessen statt Positionen) – leicht je Typ variiert.
def _harvard(example):
    return (
        "Hinter Forderungen (Positionen) stehen Bedürfnisse (Interessen). "
        + example
        + " Wenn wir die Interessen verstehen, werden faire Lösungen möglich."
    )


# BATNA-Frageblock je Typ.
def _batna(alt):
    return _b(
        "batna", "frage",
        prompt=(
            "Was ist deine beste Alternative, falls ihr euch NICHT einigt "
            + alt
            + " Was würde das realistisch an Zeit, Kosten und für eure Beziehung bedeuten?"
        ),
    )


# CONTENT[type][phase] = (title, description, blocks)
CONTENT = {
    "trennung": {
        "themensammlung": (
            "Themen sammeln", "Alles auf den Tisch – ohne Wertung.",
            [
                _b("t_t", "textausgabe", text=(
                    "Sammelt alle Themen rund um eure Trennung – von den Kindern über die "
                    "Wohnung bis zu den Finanzen. Noch geht es nicht um Lösungen, nur darum, "
                    "was besprochen werden muss."
                )),
                _b("t_bereiche", "auswahl", multi=True,
                   prompt="Welche Bereiche betreffen euch?",
                   options=["Kinder & Umgang", "Wohnung & Hausrat", "Finanzen & Unterhalt",
                            "Vermögen & Schulden", "Sonstiges"]),
                _b("t_liste", "liste", prompt="Konkrete Themen / Streitpunkte",
                   placeholder="Ein Thema …"),
                _b("t_skala", "skala", prompt="Wie belastend ist die Situation für dich gerade?",
                   min=1, max=10, minLabel="gut auszuhalten", maxLabel="sehr belastend"),
                _b("t_vn", "vertrauliche_notiz",
                   prompt="Gibt es etwas, das du zunächst nur der mediierenden Person sagen möchtest?"),
            ],
        ),
        "interessen": (
            "Interessen & Bedürfnisse", "Interessen statt Positionen (Harvard).",
            [
                _b("i_t", "textausgabe", text=_harvard(
                    "Beispiel: Hinter der Forderung nach dem Haus steht oft das Bedürfnis nach "
                    "Sicherheit und einem Zuhause für die Kinder."
                )),
                _b("i_q1", "frage",
                   prompt="Was ist dir bei den Kindern, der Wohnung und den Finanzen wirklich wichtig – und warum?"),
                _b("i_q2", "frage",
                   prompt="Was braucht dein Kind aus deiner Sicht in dieser Situation am dringendsten?"),
                _b("i_skala", "skala",
                   prompt="Wie wichtig ist dir eine einvernehmliche Lösung statt eines Gerichtsverfahrens?",
                   min=1, max=10, minLabel="egal", maxLabel="sehr wichtig"),
                _b("i_ki", "ki_interessen", prompt=(
                    "Leite aus den Positionen die dahinterliegenden Interessen und Bedürfnisse "
                    "jeder Partei ab, mit besonderem Blick auf das Kindeswohl."
                )),
            ],
        ),
        "optionen": (
            "Lösungsoptionen", "Ideen sammeln – ohne zu bewerten.",
            [
                _b("o_t", "textausgabe", text=(
                    "Sammelt möglichst viele Lösungsideen – z.B. Betreuungsmodelle "
                    "(Wechselmodell, Residenzmodell), Wohnlösungen, Aufteilung der Finanzen. "
                    "Bewertet wird später."
                )),
                _b("o_liste", "liste", prompt="Welche Lösungsmöglichkeiten fallen dir ein?",
                   placeholder="Eine Idee …"),
                _b("o_hinweis", "hinweis", variant="info", text=(
                    "Modelle, die beiden Elternteilen echte, verlässliche Zeit mit den Kindern "
                    "geben, tragen erfahrungsgemäß am längsten."
                )),
                _b("o_ki", "ki_optionen", prompt=(
                    "Erarbeite faire, umsetzbare Lösungsoptionen für Betreuung, Wohnen und "
                    "Finanzen, die die Interessen beider Seiten und das Kindeswohl berücksichtigen."
                )),
            ],
        ),
        "verhandlung": (
            "Bewerten & verhandeln", "Tragfähige Lösung finden – inkl. Realitätscheck.",
            [
                _b("v_t", "textausgabe", text=(
                    "Jetzt bewertet ihr die Optionen und verhandelt eine Lösung, die für beide "
                    "und für die Kinder funktioniert."
                )),
                _b("v_pref", "texteingabe", label="Deine bevorzugte Lösung",
                   placeholder="Welche Option bevorzugst du – und unter welchen Bedingungen?"),
                _batna(" (z.B. ein Gerichtsverfahren)?"),
                _b("v_skala", "skala", prompt="Wie tragfähig fühlt sich diese Lösung für dich an?",
                   min=1, max=10, minLabel="gar nicht", maxLabel="voll und ganz"),
                _b("v_ki", "ki_gemeinsamkeiten", prompt=(
                    "Identifiziere Übereinstimmungen und verbleibende Konfliktpunkte und "
                    "markiere, wo eine Einigung nahe liegt."
                )),
            ],
        ),
        "abschluss": (
            "Abschluss & Vereinbarung", "Verbindlich festhalten.",
            [
                _b("a_t", "textausgabe", text=(
                    "Haltet eure Vereinbarung verbindlich fest – etwa Betreuung, Unterhalt und "
                    "Wohnung."
                )),
                _b("a_vertrag", "vertrag", template=(
                    "Trennungs- und Scheidungsfolgenvereinbarung\n\n"
                    "1. Betreuung der Kinder: …\n2. Unterhalt: …\n3. Wohnung/Hausrat: …\n"
                    "4. Finanzen/Vermögen: …\n\nOrt, Datum:"
                )),
                _b("a_hinweis", "hinweis", variant="warnung", text=(
                    "Für rechtliche Verbindlichkeit (z.B. Unterhalt, Sorge, Zugewinn) ist häufig "
                    "eine notarielle Beurkundung oder anwaltliche Prüfung nötig. Diese "
                    "Vereinbarung ersetzt keine Rechtsberatung."
                )),
                _b("a_sig", "unterschrift", statement="Ich bestätige die oben festgehaltene Vereinbarung."),
                _b("a_fb", "feedback", occasion="before_contract"),
            ],
        ),
    },
    "erbschaft": {
        "themensammlung": (
            "Themen sammeln", "Den Nachlass strukturieren.",
            [
                _b("t_t", "textausgabe", text=(
                    "Sammelt alle strittigen Punkte rund um den Nachlass – Immobilien, Konten, "
                    "persönliche Gegenstände sowie offene Fragen zu Testament und Erbfolge."
                )),
                _b("t_bereiche", "auswahl", multi=True, prompt="Worum geht es?",
                   options=["Immobilie(n)", "Geldvermögen & Konten", "Persönliche Gegenstände",
                            "Testament & Erbfolge", "Schulden & Verbindlichkeiten", "Unternehmen"]),
                _b("t_liste", "liste", prompt="Konkrete Streitpunkte / Nachlassgegenstände",
                   placeholder="Ein Punkt …"),
                _b("t_vn", "vertrauliche_notiz",
                   prompt="Etwas, das du zunächst nur der mediierenden Person mitteilen möchtest?"),
            ],
        ),
        "interessen": (
            "Interessen & Bedürfnisse", "Emotionaler vs. materieller Wert.",
            [
                _b("i_t", "textausgabe", text=_harvard(
                    "Bei Erbschaften geht es oft weniger um den materiellen Wert als um "
                    "Erinnerung, Anerkennung und Gerechtigkeit."
                )),
                _b("i_q", "frage",
                   prompt="Was verbindest du mit den strittigen Gegenständen – geht es um den Wert, die Erinnerung oder um Fairness?"),
                _b("i_auswahl", "auswahl", multi=False, prompt="Was ist dir am wichtigsten?",
                   options=["Faire Aufteilung", "Bestimmte Erinnerungsstücke",
                            "Schnelle Klärung", "Familienfrieden erhalten"]),
                _b("i_hinweis", "hinweis", variant="info", text=(
                    "Rechtlicher Rahmen: gesetzliche Erbfolge und Pflichtteil setzen Grenzen – "
                    "eine einvernehmliche Lösung kann darüber hinausgehen, wenn alle zustimmen."
                )),
                _b("i_ki", "ki_interessen", prompt=(
                    "Leite die Interessen hinter den Positionen ab und unterscheide zwischen "
                    "materiellem Wert, ideellem Wert und dem Wunsch nach Gerechtigkeit."
                )),
            ],
        ),
        "optionen": (
            "Lösungsoptionen", "Aufteilung durchdenken.",
            [
                _b("o_t", "textausgabe", text=(
                    "Sammelt Ideen zur Aufteilung – Verkauf und Erlösteilung, Übernahme mit "
                    "Ausgleichszahlung, Tausch von Sachwerten, Losverfahren für Erinnerungsstücke."
                )),
                _b("o_liste", "liste", prompt="Welche Aufteilungs-Ideen fallen dir ein?",
                   placeholder="Eine Idee …"),
                _b("o_ki", "ki_optionen", prompt=(
                    "Erarbeite faire Aufteilungsoptionen, die materielle und ideelle Interessen "
                    "der Erben berücksichtigen."
                )),
            ],
        ),
        "verhandlung": (
            "Bewerten & verhandeln", "Faire Aufteilung aushandeln.",
            [
                _b("v_t", "textausgabe", text=(
                    "Jetzt bewertet ihr die Aufteilungs-Optionen und verhandelt eine Lösung, "
                    "die alle mittragen können."
                )),
                _b("v_pref", "texteingabe", label="Deine bevorzugte Aufteilung",
                   placeholder="Welche Aufteilung bevorzugst du – und unter welchen Bedingungen?"),
                _batna(" (z.B. Teilungsversteigerung oder Erbauseinandersetzungsklage)?"),
                _b("v_skala", "skala", prompt="Wie fair fühlt sich diese Lösung für dich an?",
                   min=1, max=10, minLabel="unfair", maxLabel="sehr fair"),
                _b("v_ki", "ki_gemeinsamkeiten", prompt=(
                    "Zeige Übereinstimmungen und verbleibende Streitpunkte auf und markiere, wo "
                    "eine Einigung nahe liegt."
                )),
            ],
        ),
        "abschluss": (
            "Abschluss & Vereinbarung", "Erbauseinandersetzung festhalten.",
            [
                _b("a_t", "textausgabe", text=(
                    "Haltet die Aufteilung verbindlich fest (Erbauseinandersetzung)."
                )),
                _b("a_vertrag", "vertrag", template=(
                    "Erbauseinandersetzungsvereinbarung\n\n1. Immobilie(n): …\n"
                    "2. Geldvermögen: …\n3. Persönliche Gegenstände: …\n"
                    "4. Ausgleichszahlungen: …\n\nOrt, Datum:"
                )),
                _b("a_hinweis", "hinweis", variant="warnung", text=(
                    "Erbauseinandersetzungen – besonders mit Immobilien – bedürfen häufig "
                    "notarieller Beurkundung. Diese Vereinbarung ersetzt keine Rechtsberatung."
                )),
                _b("a_sig", "unterschrift", statement="Ich bestätige die oben festgehaltene Aufteilung."),
                _b("a_fb", "feedback", occasion="before_contract"),
            ],
        ),
    },
    "nachbarschaft": {
        "themensammlung": (
            "Themen sammeln", "Konkrete Streitpunkte benennen.",
            [
                _b("t_t", "textausgabe", text=(
                    "Sammelt die konkreten Streitpunkte – Lärm, Grenzen, Bäume und Hecken, "
                    "Wege, Haustiere. Haltet auch fest, seit wann und wie oft etwas vorkommt."
                )),
                _b("t_bereiche", "auswahl", multi=True, prompt="Worum geht es?",
                   options=["Lärm", "Grundstücksgrenze", "Bäume / Hecken / Pflanzen",
                            "Wege / Zufahrt", "Haustiere", "Müll / Ordnung", "Sonstiges"]),
                _b("t_liste", "liste", prompt="Konkrete Vorfälle / Streitpunkte",
                   placeholder="Ein Vorfall …"),
                _b("t_skala", "skala", prompt="Wie sehr belastet dich der Konflikt im Alltag?",
                   min=1, max=10, minLabel="kaum", maxLabel="sehr stark"),
            ],
        ),
        "interessen": (
            "Interessen & Bedürfnisse", "Was steckt hinter der Forderung?",
            [
                _b("i_t", "textausgabe", text=_harvard(
                    "Beispiel: Hinter der Forderung, die Hecke zu entfernen, steht oft der "
                    "Wunsch nach mehr Licht, Ruhe oder schlicht Respekt."
                )),
                _b("i_q", "frage",
                   prompt="Was brauchst du wirklich, um dich zu Hause wieder wohlzufühlen?"),
                _b("i_hinweis", "hinweis", variant="info", text=(
                    "Ihr bleibt Nachbarn: Eine Lösung, mit der beide dauerhaft leben können, ist "
                    "mehr wert als ein kurzfristiger Sieg."
                )),
                _b("i_ki", "ki_interessen", prompt=(
                    "Leite die Interessen hinter den Forderungen ab, mit Blick auf ein "
                    "dauerhaft tragfähiges Nachbarschaftsverhältnis."
                )),
            ],
        ),
        "optionen": (
            "Lösungsoptionen", "Praktische Ideen sammeln.",
            [
                _b("o_t", "textausgabe", text=(
                    "Sammelt praktische Ideen – Ruhezeiten vereinbaren, Hecke schneiden oder "
                    "versetzen, Zaun, Nutzungsregeln für Wege, klare Absprachen."
                )),
                _b("o_liste", "liste", prompt="Welche praktischen Lösungen fallen dir ein?",
                   placeholder="Eine Idee …"),
                _b("o_ki", "ki_optionen", prompt=(
                    "Erarbeite praktische, alltagstaugliche Lösungen, die beide Nachbarn "
                    "dauerhaft mittragen können."
                )),
            ],
        ),
        "verhandlung": (
            "Bewerten & verhandeln", "Dauerhafte Regelung finden.",
            [
                _b("v_t", "textausgabe", text=(
                    "Jetzt bewertet ihr die Ideen und verhandelt eine Regelung, mit der ihr als "
                    "Nachbarn dauerhaft gut leben könnt."
                )),
                _b("v_pref", "texteingabe", label="Deine bevorzugte Regelung",
                   placeholder="Welche Regelung bevorzugst du – und unter welchen Bedingungen?"),
                _batna(" (z.B. Ordnungsamt oder Klage)?"),
                _b("v_ki", "ki_gemeinsamkeiten", prompt=(
                    "Zeige Gemeinsamkeiten und offene Punkte auf und markiere, wo eine Einigung "
                    "nahe liegt."
                )),
            ],
        ),
        "abschluss": (
            "Abschluss & Vereinbarung", "Absprachen verbindlich festhalten.",
            [
                _b("a_t", "textausgabe", text=(
                    "Haltet die Absprachen verbindlich fest – wer macht was, ab wann, welche "
                    "Ruhezeiten und Regeln gelten."
                )),
                _b("a_vertrag", "vertrag", template=(
                    "Nachbarschaftliche Vereinbarung\n\n1. Vereinbarte Regeln: …\n"
                    "2. Wer setzt was bis wann um: …\n3. Ruhezeiten / Nutzung: …\n\nOrt, Datum:"
                )),
                _b("a_sig", "unterschrift", statement="Ich bestätige die oben festgehaltenen Absprachen."),
                _b("a_termin", "termin"),
                _b("a_fb", "feedback", occasion="before_contract"),
            ],
        ),
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
        sa.column("title", sa.String),
        sa.column("description", sa.Text),
        sa.column("placeholder", sa.Text),
        sa.column("reflection_mode", sa.String),
        sa.column("content_types", sa.String),
        sa.column("blocks", sa.JSON),
        sa.column("visible_if", sa.JSON),
        sa.column("position", sa.Integer),
        sa.column("enabled", sa.Boolean),
        sa.column("created_at", sa.DateTime),
        sa.column("updated_at", sa.DateTime),
    )


def upgrade() -> None:
    conn = op.get_bind()
    now = datetime.now(timezone.utc)
    psd = _table()

    for mtype, phases in CONTENT.items():
        for phase, (title, description, blocks) in phases.items():
            step_key = f"basis_{phase}"
            existing = conn.execute(
                sa.select(psd.c.id).where(
                    sa.and_(
                        psd.c.mediation_type == mtype,
                        psd.c.phase == phase,
                        psd.c.step_key == step_key,
                        psd.c.variant_key.is_(None),
                    )
                )
            ).first()
            if existing:
                conn.execute(
                    psd.update()
                    .where(psd.c.id == existing[0])
                    .values(title=title, description=description, blocks=blocks, updated_at=now)
                )
            else:
                conn.execute(
                    psd.insert().values(
                        mediation_type=mtype,
                        phase=phase,
                        step_key=step_key,
                        variant_key=None,
                        title=title,
                        description=description,
                        placeholder="",
                        reflection_mode=None,
                        content_types=None,
                        blocks=blocks,
                        visible_if=None,
                        position=0,
                        enabled=True,
                        created_at=now,
                        updated_at=now,
                    )
                )


def downgrade() -> None:
    # Inhaltliche Anreicherung; kein sauberes Zurückrollen der Vorgänger-Blöcke.
    # Wir leeren die Blöcke der betroffenen basis_<phase>-Schritte (Struktur bleibt).
    conn = op.get_bind()
    psd = _table()
    for mtype, phases in CONTENT.items():
        for phase in phases:
            conn.execute(
                psd.update()
                .where(
                    sa.and_(
                        psd.c.mediation_type == mtype,
                        psd.c.phase == phase,
                        psd.c.step_key == f"basis_{phase}",
                        psd.c.variant_key.is_(None),
                    )
                )
                .values(blocks=None)
            )
