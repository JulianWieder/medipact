"""Phase 1 (Einleitung) neu: echte Eingaben statt Platzhalter, Ziel Mediationsvertrag.

Ausgangslage: die Einleitungs-Schritte waren weitgehend leer. `intro` hatte nur
content_types="video" ohne Video, `terminvereinbarung`/`feedback_*`/`contract`
hatten gar keine Blöcke — im Fall erschien deshalb bei jedem Schritt nur das
generische „Punkt hinzufügen +"-Feld ohne Frage und ohne Bezug. Dazu lagen aus
zwei Seed-Generationen doppelte Schrittsätze nebeneinander (`intro`/`einl_intro`,
`einleitung`/`einl_regeln` …).

Diese Migration ersetzt die Einleitungs-Phase je Mediationstyp durch EINEN
zusammenhängenden Ablauf, der genau die Punkte erhebt, die am Ende im
Mediationsvertrag stehen müssen:

  1. Einführung            – Freiwilligkeit
  2. Ablauf der Mediation  – Format, WER dabei sein darf (Zuschauer/Beistand),
                             Sitzungslänge, Rhythmus
  3. Gesprächsregeln       – Regelkatalog zum Ankreuzen + eigene Regeln
  4. Wenn du unsicher bist – Bedenkzeit, Einzelgespräch, externer Rat
  5. Vertraulichkeit       – Verschwiegenheit, Freiwilligkeit, Allparteilichkeit
  6. Kosten & Beendigung   – Kostenverteilung, Abbruchregeln
  7. Deine Rolle
  8. Vertrauen
  9. Dein Ziel
 10. Terminvereinbarung
 11. Erstgespräch
 12. Kurzes Feedback
 13. Reflexion vor dem Vertrag
 14. Mediationsvertrag     – Vertragstext erzeugen, lesen, unterschreiben

Schritte, bei denen beide Seiten dasselbe beschließen müssen (Ablauf, Regeln,
Vertraulichkeit, Kosten, Erstgespräch, Vertrag), bekommen gate_mode="all": es
geht erst weiter, wenn beide abgegeben haben — dann zeigt der Fall die Antworten
nebeneinander und macht sichtbar, wo man sich schon einig ist.

ACHTUNG: Die Migration LÖSCHT die bisherigen Einleitungs-Standardschritte
(variant_key IS NULL) der betroffenen Typen und legt sie neu an. Von Hand im
Workflow Manager gepflegte Änderungen an Phase 1 gehen dabei verloren;
Varianten-Schritte (variant_key gesetzt) und alle anderen Phasen bleiben
unberührt. Schlüssel wie `einl_rollen`, `einl_vertrauen`, `einl_ziel`,
`terminvereinbarung`, `videocall`, `feedback_*` und `contract` werden bewusst
weiterverwendet, damit bereits abgegebene Antworten laufender Fälle weiter zu
ihrem Schritt gehören.

Revision ID: c8d9e0f1a2b3
Revises: a7b8c9d0e1f2
Create Date: 2026-08-02
"""
from datetime import datetime, timezone

import sqlalchemy as sa
from alembic import op

revision = "c8d9e0f1a2b3"
down_revision = "a7b8c9d0e1f2"
branch_labels = None
depends_on = None

PHASE = "einleitung"

# Alle produktiv angebotenen Mediationsarten (siehe MEDIATION_TYPES im Frontend).
TYPES = [
    "trennung",
    "erbschaft",
    "nachbarschaft",
    "wg",
    "verbraucher",
    "odr",
    "schlichtung",
    "ecommerce",
    "b2b",
]

# Geschäftliche Verfahren – dort sind Beteiligte, Kosten und Ton anders.
BUSINESS_TYPES = {"odr", "schlichtung", "ecommerce", "b2b"}


def _b(bid, btype, **config):
    return {"id": bid, "type": btype, "config": config, "visible_if": None}


# ── Typspezifischer Kontext ────────────────────────────────────────────────
# Nur die Stellen, an denen sich die Verfahren wirklich unterscheiden. Alles
# andere ist bewusst identisch, damit der Ablauf einheitlich bleibt.
CONTEXT = {
    "trennung": dict(
        intro=(
            "Ihr steht am Anfang eines Verfahrens, das eure Trennung ordnen soll — nicht "
            "gewinnen, sondern regeln. In dieser ersten Phase legt ihr gemeinsam fest, wie "
            "ihr miteinander sprechen wollt. Am Ende steht der Mediationsvertrag: die "
            "Spielregeln, auf die ihr euch beide verlassen könnt."
        ),
        wer_dabei=[
            "Nur wir beide und der Mediator",
            "Je eine Vertrauensperson darf zuhören (ohne Rederecht)",
            "Unsere Anwältinnen/Anwälte dürfen teilnehmen",
            "Weitere Beteiligte nur nach vorheriger Absprache",
        ],
        einseitig="Während der Mediation unternehmen wir keine einseitigen Schritte (z. B. Klage, Auszug mit den Kindern, Kontosperrung).",
        kosten=[
            "Wir teilen die Kosten hälftig",
            "Jede Seite trägt ihren eigenen Anteil",
            "Eine Seite übernimmt die Kosten (Details klären wir)",
            "Noch offen — das klären wir im Gespräch",
        ],
    ),
    "erbschaft": dict(
        intro=(
            "In einer Erbsache treffen Zahlen und Gefühle aufeinander, oft nach einem "
            "Verlust. In dieser Phase legt ihr fest, wie ihr miteinander verhandeln wollt. "
            "Am Ende steht der Mediationsvertrag mit euren gemeinsamen Regeln."
        ),
        wer_dabei=[
            "Nur die Erbinnen und Erben und der Mediator",
            "Je eine Vertrauensperson darf zuhören (ohne Rederecht)",
            "Anwältinnen/Anwälte oder Notar dürfen teilnehmen",
            "Steuerberatung/Gutachter nach Absprache",
        ],
        einseitig="Während der Mediation unternehmen wir keine einseitigen Schritte (z. B. Teilungsversteigerung, Verkauf von Nachlassgegenständen, Kontoverfügungen).",
        kosten=[
            "Die Kosten trägt der Nachlass",
            "Wir teilen die Kosten nach Erbquote",
            "Wir teilen die Kosten zu gleichen Teilen",
            "Noch offen — das klären wir im Gespräch",
        ],
    ),
    "nachbarschaft": dict(
        intro=(
            "Nachbarschaftsstreit hat eine Besonderheit: ihr bleibt Nachbarn. In dieser "
            "Phase legt ihr fest, wie ihr miteinander reden wollt — am Ende steht der "
            "Mediationsvertrag mit euren gemeinsamen Regeln."
        ),
        wer_dabei=[
            "Nur wir beide und der Mediator",
            "Je eine Vertrauensperson darf zuhören (ohne Rederecht)",
            "Anwältinnen/Anwälte dürfen teilnehmen",
            "Hausverwaltung/Vermieter nach Absprache",
        ],
        einseitig="Während der Mediation unternehmen wir keine einseitigen Schritte (z. B. Anzeige, Bauarbeiten, Abmahnung).",
        kosten=[
            "Wir teilen die Kosten hälftig",
            "Jede Seite trägt ihren eigenen Anteil",
            "Eine Seite übernimmt die Kosten (Details klären wir)",
            "Noch offen — das klären wir im Gespräch",
        ],
    ),
    "wg": dict(
        intro=(
            "In einer WG ist der Konflikt immer auch Alltag: ihr teilt Küche, Bad und "
            "Kosten. In dieser Phase legt ihr fest, wie ihr das Gespräch führen wollt. Am "
            "Ende steht der Mediationsvertrag mit euren gemeinsamen Regeln."
        ),
        wer_dabei=[
            "Nur die beteiligten Mitbewohnerinnen und Mitbewohner und der Mediator",
            "Die ganze WG darf dabei sein",
            "Je eine Vertrauensperson darf zuhören (ohne Rederecht)",
            "Vermieter/Hausverwaltung nach Absprache",
        ],
        einseitig="Während der Mediation unternehmen wir keine einseitigen Schritte (z. B. Kündigung, Schlosswechsel, Ausschluss aus der WG-Kasse).",
        kosten=[
            "Wir teilen die Kosten zu gleichen Teilen",
            "Jede Seite trägt ihren eigenen Anteil",
            "Die WG-Kasse übernimmt die Kosten",
            "Noch offen — das klären wir im Gespräch",
        ],
    ),
    "verbraucher": dict(
        intro=(
            "Zwischen Auftrag und Ergebnis liegt oft ein Missverständnis, kein böser Wille. "
            "In dieser Phase legt ihr fest, wie ihr die Sache besprechen wollt. Am Ende "
            "steht der Mediationsvertrag mit euren gemeinsamen Regeln."
        ),
        wer_dabei=[
            "Nur die beiden Parteien und der Mediator",
            "Je eine Vertrauensperson darf zuhören (ohne Rederecht)",
            "Anwältinnen/Anwälte dürfen teilnehmen",
            "Sachverständige nach Absprache",
        ],
        einseitig="Während der Mediation unternehmen wir keine einseitigen Schritte (z. B. Mahnbescheid, Inkasso, öffentliche Bewertung).",
        kosten=[
            "Wir teilen die Kosten hälftig",
            "Jede Seite trägt ihren eigenen Anteil",
            "Eine Seite übernimmt die Kosten (Details klären wir)",
            "Noch offen — das klären wir im Gespräch",
        ],
    ),
}

BUSINESS_CONTEXT = dict(
    intro=(
        "Ein Konflikt kostet Zeit, Geld und Zusammenarbeit. In dieser Phase legen Sie fest, "
        "wie das Verfahren ablaufen soll — Rahmen, Regeln und Vertraulichkeit. Am Ende steht "
        "die Verfahrensvereinbarung (Mediationsvertrag), auf die sich beide Seiten berufen "
        "können."
    ),
    wer_dabei=[
        "Nur die entscheidungsbefugten Personen und der Mediator",
        "Je eine weitere Person aus der Fachabteilung darf zuhören",
        "Rechtsabteilung / externe Anwälte dürfen teilnehmen",
        "Weitere Beteiligte nur nach vorheriger Absprache",
    ],
    einseitig="Während des Verfahrens unternehmen wir keine einseitigen Schritte (z. B. Klage, Kündigung des Vertrags, Zahlungssperre, öffentliche Äußerungen).",
    kosten=[
        "Jede Seite trägt ihre eigenen Kosten, das Honorar teilen wir hälftig",
        "Wir teilen alle Kosten hälftig",
        "Eine Seite übernimmt die Kosten (Details klären wir)",
        "Noch offen — das klären wir im Verfahren",
    ],
)


def _ctx(t: str) -> dict:
    return BUSINESS_CONTEXT if t in BUSINESS_TYPES else CONTEXT[t]


def _steps_for(t: str):
    """Erzeugt die vollständige Einleitungs-Phase für einen Mediationstyp.

    Rückgabe je Schritt:
      (step_key, title, description, blocks, gate_mode, content_types,
       feedback_occasion)
    """
    ctx = _ctx(t)
    du = "Sie" if t in BUSINESS_TYPES else "du"

    return [
        # ── 1. Einführung ────────────────────────────────────────────────
        (
            "intro",
            "Einführung",
            "Worum es in dieser Phase geht — und was am Ende dabei herauskommt.",
            [
                _b("intro_text", "textausgabe", text=ctx["intro"]),
                _b("intro_video", "video", url=""),
                _b(
                    "intro_ablauf",
                    "akkordeon",
                    title="Was in dieser Phase auf euch zukommt",
                    text=(
                        "1. Ablauf: Wie und wo wird gesprochen, wer darf dabei sein?\n"
                        "2. Gesprächsregeln: Was gilt während der Gespräche?\n"
                        "3. Unsicherheit: Was passiert, wenn jemand nicht weiterweiß?\n"
                        "4. Vertraulichkeit: Was bleibt unter uns?\n"
                        "5. Kosten und Beendigung.\n"
                        "6. Rolle, Vertrauen, Ziel.\n"
                        "Zum Schluss fasst der Mediator alles zum Mediationsvertrag zusammen, "
                        "den beide Seiten unterschreiben."
                    ),
                ),
                _b(
                    "intro_freiwillig",
                    "zustimmung",
                    text=(
                        "Ich nehme freiwillig an der Mediation teil und weiß, dass ich sie "
                        "jederzeit und ohne Angabe von Gründen beenden kann."
                    ),
                    required=True,
                ),
            ],
            "self",
            None,
            None,
        ),
        # ── 2. Ablauf der Mediation ──────────────────────────────────────
        (
            "einl_verfahren",
            "Ablauf der Mediation",
            "Wie soll die Mediation stattfinden — und wer darf dabei sein?",
            [
                _b(
                    "verf_text",
                    "textausgabe",
                    text=(
                        "Bevor es um den Streit selbst geht, klärt ihr den Rahmen. Das klingt "
                        "nach Formalie, ist aber der häufigste Grund, warum Gespräche kippen: "
                        "jemand fühlt sich überrumpelt, weil plötzlich jemand mit im Raum sitzt "
                        "oder der Termin nicht passt. Eure Antworten müssen nicht "
                        "übereinstimmen — Unterschiede besprecht ihr im Erstgespräch."
                    ),
                ),
                _b(
                    "verf_format",
                    "auswahl",
                    prompt="Wie sollen die Gespräche stattfinden?",
                    options=[
                        "Online per Video",
                        "In Präsenz vor Ort",
                        "Gemischt — je nach Termin",
                        "Getrennt (Shuttle): der Mediator spricht abwechselnd mit jeder Seite",
                    ],
                    multi=False,
                    required=True,
                ),
                _b(
                    "verf_wer",
                    "auswahl",
                    prompt="Wer darf bei den Gesprächen dabei sein?",
                    options=ctx["wer_dabei"],
                    multi=False,
                    required=True,
                ),
                _b(
                    "verf_zuschauer_bedingung",
                    "texteingabe",
                    label="Falls jemand zuhören soll: wer, und unter welcher Bedingung?",
                    placeholder="z. B. „Meine Schwester, aber nur beim ersten Termin und ohne Rederecht.“",
                ),
                _b(
                    "verf_dauer",
                    "auswahl",
                    prompt="Wie lang sollen die einzelnen Sitzungen sein?",
                    options=["ca. 60 Minuten", "ca. 90 Minuten", "ca. 120 Minuten", "Das ist mir gleich"],
                    multi=False,
                ),
                _b(
                    "verf_rhythmus",
                    "auswahl",
                    prompt="In welchem Abstand wollt ihr euch treffen?",
                    options=["Wöchentlich", "Alle zwei Wochen", "Monatlich", "Nach Bedarf"],
                    multi=False,
                ),
                _b(
                    "verf_hindernis",
                    "texteingabe",
                    label="Gibt es Zeiten oder Umstände, die für dich nicht gehen?",
                    placeholder="z. B. Schichtdienst, Betreuungszeiten, keine Termine vor 18 Uhr …",
                ),
            ],
            "all",
            None,
            None,
        ),
        # ── 3. Gesprächsregeln ───────────────────────────────────────────
        (
            "einl_regeln",
            "Gesprächsregeln",
            "Welche Regeln sollen gelten, damit das Gespräch für beide tragbar bleibt?",
            [
                _b(
                    "reg_text",
                    "textausgabe",
                    text=(
                        "Im Konflikt verliert man leicht das Gefühl von Kontrolle. Gemeinsame "
                        "Regeln geben sie zurück: sie sagen vorher, was passiert — und was "
                        "nicht. Kreuze an, was für dich gelten soll."
                    ),
                ),
                _b(
                    "reg_katalog",
                    "auswahl",
                    prompt="Welche Regeln sollen für eure Gespräche gelten?",
                    options=[
                        "Wir lassen uns gegenseitig ausreden",
                        "Keine Beleidigungen, keine Schuldzuweisungen",
                        "Wir sprechen von uns selbst (Ich-Botschaften) statt über die andere Seite",
                        "Handys sind während der Sitzung aus",
                        "Keine heimlichen Aufnahmen und keine Mitschnitte",
                        "Jede Seite darf jederzeit eine Pause verlangen",
                        "Was hier besprochen wird, bleibt unter uns",
                        "Wir sagen es, wenn wir etwas Wichtiges zurückhalten",
                        ctx["einseitig"],
                    ],
                    multi=True,
                    required=True,
                ),
                _b(
                    "reg_eigene",
                    "liste",
                    prompt="Fehlt dir eine Regel? Ergänze sie hier.",
                    placeholder="Eigene Regel eingeben und Enter drücken …",
                ),
                _b(
                    "reg_sicherheit",
                    "frage",
                    prompt=(
                        f"Was brauchst {du}, damit {du} dich sicher genug fühlst, ehrlich zu sein? "
                        "Formuliere es konkret — nicht für die andere Seite, sondern für dich."
                    ),
                    required=True,
                ),
                _b(
                    "reg_notbremse",
                    "auswahl",
                    prompt="Was soll passieren, wenn eine Regel gebrochen wird?",
                    options=[
                        "Der Mediator unterbricht und benennt es",
                        "Wir machen sofort eine Pause",
                        "Wir vertagen den Termin",
                        "Wir sprechen es am Ende der Sitzung an",
                    ],
                    multi=False,
                ),
            ],
            "all",
            None,
            None,
        ),
        # ── 4. Wenn du unsicher bist ─────────────────────────────────────
        (
            "einl_unsicherheit",
            "Wenn du unsicher bist",
            "Was passieren soll, wenn du bei einem Punkt nicht weiterweißt.",
            [
                _b(
                    "uns_text",
                    "textausgabe",
                    text=(
                        "Unsicherheit ist kein Scheitern, sondern ein Signal: hier fehlt noch "
                        "etwas — Zeit, Information oder Rat. Eine Vereinbarung, die aus "
                        "Überforderung entsteht, hält nicht. Deshalb legt ihr jetzt fest, was "
                        "in so einem Moment passiert."
                    ),
                ),
                _b(
                    "uns_wege",
                    "auswahl",
                    prompt="Was soll dir offenstehen, wenn du dir bei einem Punkt unsicher bist?",
                    options=[
                        "Eine Bedenkzeit, bevor entschieden wird",
                        "Ein vertrauliches Einzelgespräch mit dem Mediator",
                        "Rechtlichen oder fachlichen Rat einholen, bevor es weitergeht",
                        "Eine Pause im laufenden Gespräch",
                        "Den Punkt vertagen und später darauf zurückkommen",
                    ],
                    multi=True,
                    required=True,
                ),
                _b(
                    "uns_bedenkzeit",
                    "auswahl",
                    prompt="Wie viel Bedenkzeit soll vor einer verbindlichen Vereinbarung mindestens bleiben?",
                    options=["Keine feste Frist", "1 Tag", "3 Tage", "1 Woche", "2 Wochen"],
                    multi=False,
                    required=True,
                ),
                _b(
                    "uns_rat",
                    "zustimmung",
                    text=(
                        "Mir ist klar, dass der Mediator keine der Seiten rechtlich berät und "
                        "dass ich vor einer verbindlichen Vereinbarung eigenen Rat einholen kann."
                    ),
                    required=True,
                ),
                _b(
                    "uns_offen",
                    "texteingabe",
                    label="Gibt es etwas, bei dem du jetzt schon unsicher bist?",
                    placeholder="Was dir unklar ist oder Sorge macht — auch wenn es klein wirkt.",
                ),
                _b(
                    "uns_vertraulich",
                    "vertrauliche_notiz",
                    prompt="Etwas, das zunächst nur der Mediator wissen soll?",
                ),
            ],
            "self",
            None,
            None,
        ),
        # ── 5. Vertraulichkeit & Freiwilligkeit ──────────────────────────
        (
            "einl_vertraulichkeit",
            "Vertraulichkeit & Freiwilligkeit",
            "Die drei Grundsätze, ohne die Mediation nicht funktioniert.",
            [
                _b(
                    "vtr_text",
                    "textausgabe",
                    text=(
                        "Offen sprechen kann nur, wer weiß, dass das Gesagte nicht später gegen "
                        "ihn verwendet wird. Diese drei Punkte sind der Grund, warum in der "
                        "Mediation Dinge gesagt werden können, die vor Gericht niemand sagen "
                        "würde."
                    ),
                ),
                _b(
                    "vtr_schweigen",
                    "zustimmung",
                    text=(
                        "Alles, was in der Mediation besprochen wird, behandle ich vertraulich "
                        "und verwende es nicht in einem Gerichts- oder Behördenverfahren."
                    ),
                    required=True,
                ),
                _b(
                    "vtr_freiwillig",
                    "zustimmung",
                    text=(
                        "Ich nehme freiwillig teil und kann die Mediation jederzeit beenden — "
                        "ohne dass mir daraus ein Nachteil entsteht."
                    ),
                    required=True,
                ),
                _b(
                    "vtr_allparteilich",
                    "zustimmung",
                    text=(
                        "Der Mediator entscheidet nichts und vertritt keine Seite. Er sorgt für "
                        "das Verfahren, die Lösung finden wir selbst."
                    ),
                    required=True,
                ),
                _b(
                    "vtr_dritte",
                    "auswahl",
                    prompt="Wer darf außerhalb der Mediation über Inhalte informiert werden?",
                    options=[
                        "Niemand",
                        "Nur unsere Anwältinnen und Anwälte",
                        "Nur unsere fachlichen Berater (Steuer, Technik, Gutachten)",
                        "Im Einzelfall nach ausdrücklicher Absprache",
                    ],
                    multi=False,
                    required=True,
                ),
                _b(
                    "vtr_unterlagen",
                    "auswahl",
                    prompt="Was soll nach Abschluss mit den Unterlagen und Eingaben geschehen?",
                    options=[
                        "Beide Seiten erhalten eine Kopie, danach wird gelöscht",
                        "Alles bleibt für spätere Rückfragen gespeichert",
                        "Nur die Abschlussvereinbarung bleibt, der Rest wird gelöscht",
                        "Das entscheiden wir am Ende gemeinsam",
                    ],
                    multi=False,
                ),
            ],
            "all",
            None,
            None,
        ),
        # ── 6. Kosten & Beendigung ───────────────────────────────────────
        (
            "einl_kosten",
            "Kosten & Beendigung",
            "Wer trägt was — und was gilt, wenn jemand aussteigt.",
            [
                _b(
                    "kos_text",
                    "textausgabe",
                    text=(
                        "Über Geld spricht man am besten, bevor es unangenehm wird. Und weil "
                        "jede Seite jederzeit aussteigen darf, sollte vorher klar sein, was dann "
                        "gilt."
                    ),
                ),
                _b(
                    "kos_verteilung",
                    "auswahl",
                    prompt="Wie sollen die Kosten der Mediation getragen werden?",
                    options=ctx["kosten"],
                    multi=False,
                    required=True,
                ),
                _b(
                    "kos_abbruch",
                    "auswahl",
                    prompt="Was soll gelten, wenn eine Seite die Mediation beendet?",
                    options=[
                        "Bereits erzielte Teilergebnisse bleiben bestehen",
                        "Ohne Gesamteinigung gilt nichts von dem Besprochenen",
                        "Der Mediator fasst schriftlich zusammen, wie weit wir gekommen sind",
                        "Das entscheiden wir, wenn es so weit ist",
                    ],
                    multi=False,
                    required=True,
                ),
                _b(
                    "kos_ankuendigung",
                    "zustimmung",
                    text=(
                        "Wenn ich die Mediation beenden möchte, sage ich das im Verfahren — "
                        "nicht per Schweigen oder über Dritte."
                    ),
                    required=True,
                ),
            ],
            # bewusst "self": ein gemeinsamer Takt mehr würde den Fall nur
            # zusätzlich blockieren, falls eine Seite länger braucht.
            "self",
            None,
            None,
        ),
        # ── 7. Deine Rolle ───────────────────────────────────────────────
        (
            "einl_rollen",
            "Deine Rolle",
            "Wer möchtest du in diesem Verfahren sein?",
            [
                _b(
                    "ro_text",
                    "textausgabe",
                    text=(
                        "In Konflikten spielen wir Rollen, die wir nie bewusst gewählt haben: "
                        "der Vernünftige, der Schuldige, der Verletzte. Hier ist der Moment "
                        "innezuhalten und zu fragen: Wer will ich in diesem Verfahren sein?"
                    ),
                ),
                _b("ro_video", "video", url=""),
                _b(
                    "ro_selbstbild",
                    "frage",
                    prompt="Wie siehst du deine Rolle in dieser Situation — und was brauchst du von der anderen Seite?",
                    required=True,
                ),
                _b(
                    "ro_entscheidung",
                    "auswahl",
                    prompt="Kannst du für dich allein entscheiden, oder ist noch jemand einzubeziehen?",
                    options=[
                        "Ich entscheide für mich allein",
                        "Ich bespreche Entscheidungen mit meiner Familie/Partnerin/Partner",
                        "Ich brauche die Zustimmung weiterer Personen (z. B. Miterben, Geschäftsleitung)",
                        "Das ist gerade noch unklar",
                    ],
                    multi=False,
                    required=True,
                ),
            ],
            "self",
            None,
            None,
        ),
        # ── 8. Vertrauen ─────────────────────────────────────────────────
        (
            "einl_vertrauen",
            "Vertrauen",
            "Wie viel Vertrauen ist da — und was wäre dein Minimum?",
            [
                _b(
                    "vt_text",
                    "textausgabe",
                    text=(
                        "Vertrauen entsteht nicht auf Knopfdruck, schon gar nicht nach einer "
                        "Verletzung. Für dieses Verfahren braucht ihr auch kein volles "
                        "Vertrauen — nur genug, um heute ehrlich zu sprechen."
                    ),
                ),
                _b("vt_video", "video", url=""),
                _b(
                    "vt_skala",
                    "skala",
                    prompt="Wie viel Vertrauen hast du im Moment in ein faires Gespräch?",
                    min=1,
                    max=10,
                    minLabel="gar keins",
                    maxLabel="volles Vertrauen",
                    required=True,
                ),
                _b(
                    "vt_minimum",
                    "frage",
                    prompt="Was ist dein Minimum? Was brauchst du, um dich wenigstens ein Stück weit zu öffnen?",
                    required=True,
                ),
            ],
            "self",
            None,
            None,
        ),
        # ── 9. Dein Ziel ─────────────────────────────────────────────────
        (
            "einl_ziel",
            "Dein Ziel",
            "Woran würdest du merken, dass sich der Aufwand gelohnt hat?",
            [
                _b(
                    "zi_text",
                    "textausgabe",
                    text=(
                        "Im Konflikt wissen wir sehr genau, was wir nicht wollen. Aber was "
                        "willst du? Stell dir vor, dieses Verfahren ist gelungen — was ist dann "
                        "anders?"
                    ),
                ),
                _b("zi_video", "video", url=""),
                _b(
                    "zi_ziel",
                    "texteingabe",
                    label="Dein Ziel",
                    placeholder="Positiv formuliert: nicht, was aufhören soll, sondern was stattdessen sein soll.",
                    required=True,
                ),
                _b(
                    "zi_frist",
                    "auswahl",
                    prompt="Bis wann sollte eine Lösung stehen?",
                    options=[
                        "So schnell wie möglich",
                        "Innerhalb von 4 Wochen",
                        "Innerhalb von 3 Monaten",
                        "Zeit spielt keine große Rolle",
                    ],
                    multi=False,
                ),
                _b(
                    "zi_unverzichtbar",
                    "liste",
                    prompt="Was darf am Ende auf keinen Fall fehlen?",
                    placeholder="Einen Punkt eingeben und Enter drücken …",
                ),
            ],
            "self",
            None,
            None,
        ),
        # ── 10. Terminvereinbarung ───────────────────────────────────────
        (
            "terminvereinbarung",
            "Terminvereinbarung",
            "Wählt gemeinsam einen Termin für das erste Gespräch.",
            [
                _b(
                    "ter_text",
                    "textausgabe",
                    text="Sucht einen Termin, der für beide Seiten ohne Hetze machbar ist.",
                ),
                _b("ter_termin", "termin"),
            ],
            "self",
            "termin",
            None,
        ),
        # ── 11. Erstgespräch ─────────────────────────────────────────────
        (
            "videocall",
            "Erstgespräch",
            "Euer erstes gemeinsames Gespräch — der Mediator geht den Rahmen mit euch durch.",
            [
                _b(
                    "vc_text",
                    "textausgabe",
                    text=(
                        "Zum ersten Mal seid ihr gemeinsam im Gespräch. Der Mediator geht eure "
                        "Antworten zu Ablauf, Regeln und Vertraulichkeit durch — dort, wo ihr "
                        "unterschiedlich geantwortet habt, sucht ihr eine gemeinsame Linie. Du "
                        "darfst zunächst einfach nur zuhören."
                    ),
                ),
                _b("vc_call", "videokonferenz", url=""),
            ],
            "all",
            "videokonferenz",
            None,
        ),
        # ── 12. Feedback nach dem Gespräch ───────────────────────────────
        (
            "feedback_after_videocall",
            "Kurzes Feedback",
            "Wie war das erste Gespräch für dich?",
            [
                _b("fb1_feedback", "feedback", occasion="after_videocall"),
                _b(
                    "fb1_skala",
                    "skala",
                    prompt="Wie gut hast du dich im Gespräch gehört gefühlt?",
                    min=1,
                    max=10,
                    minLabel="gar nicht",
                    maxLabel="vollständig",
                    required=True,
                ),
                _b(
                    "fb1_offen",
                    "texteingabe",
                    label="Was sollte beim nächsten Mal anders laufen?",
                    placeholder="Auch Kleinigkeiten sind hilfreich.",
                ),
            ],
            "self",
            "feedback",
            "after_videocall",
        ),
        # ── 13. Reflexion vor dem Vertrag ────────────────────────────────
        (
            "feedback_before_contract",
            "Reflexion vor dem Vertrag",
            "Letzter Blick, bevor der Mediationsvertrag entsteht.",
            [
                _b(
                    "fb2_text",
                    "textausgabe",
                    text=(
                        "Gleich fasst der Mediator eure Antworten zum Mediationsvertrag "
                        "zusammen. Was jetzt noch fehlt, fehlt auch im Vertrag."
                    ),
                ),
                _b("fb2_feedback", "feedback", occasion="before_contract"),
                _b(
                    "fb2_fehlt",
                    "texteingabe",
                    label="Fehlt dir noch etwas, das im Mediationsvertrag stehen sollte?",
                    placeholder="Wenn nichts fehlt, schreib einfach „passt so“.",
                    required=True,
                ),
                _b(
                    "fb2_bereit",
                    "zustimmung",
                    text="Ich bin bereit, den Mediationsvertrag auf dieser Grundlage abzuschließen.",
                    required=True,
                ),
            ],
            "all",
            "feedback",
            "before_contract",
        ),
        # ── 14. Mediationsvertrag ────────────────────────────────────────
        (
            "contract",
            "Mediationsvertrag",
            "Eure Antworten als verbindlicher Rahmen — zum Lesen und Unterschreiben.",
            [
                _b(
                    "con_text",
                    "textausgabe",
                    text=(
                        "Der Mediator hat eure Antworten zu einem Vertragstext zusammengefasst: "
                        "Ablauf, Regeln, Vertraulichkeit, Kosten und Ziele. Lies ihn in Ruhe. "
                        "Was nicht stimmt, sagst du jetzt — nicht später."
                    ),
                ),
                _b("con_vertrag", "vertrag", template=""),
                _b(
                    "con_gelesen",
                    "zustimmung",
                    text="Ich habe den Mediationsvertrag gelesen und verstanden.",
                    required=True,
                ),
            ],
            "all",
            "vertrag",
            None,
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
        sa.column("feedback_occasion", sa.String),
        sa.column("gate_mode", sa.String),
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
        # Alte Standard-Schritte der Einleitung entfernen (inkl. der doppelten
        # Sätze aus den früheren Seeds). Varianten-Schritte bleiben.
        conn.execute(
            psd.delete().where(
                sa.and_(
                    psd.c.mediation_type == t,
                    psd.c.phase == PHASE,
                    psd.c.variant_key.is_(None),
                )
            )
        )
        for pos, (key, title, desc, blocks, gate, ctypes, occasion) in enumerate(_steps_for(t)):
            conn.execute(
                psd.insert().values(
                    mediation_type=t,
                    phase=PHASE,
                    step_key=key,
                    variant_key=None,
                    title=title,
                    description=desc,
                    placeholder="",
                    reflection_mode=None,
                    content_types=ctypes,
                    blocks=blocks,
                    feedback_occasion=occasion,
                    # "self" ist der Standard und wird als NULL gespeichert.
                    gate_mode=None if gate == "self" else gate,
                    position=pos,
                    enabled=True,
                    created_at=now,
                    updated_at=now,
                )
            )


def downgrade() -> None:
    # Die vorherigen Inhalte stammten aus mehreren Migrationen und lassen sich
    # nicht sinnvoll rekonstruieren; entfernt werden hier nur die neu
    # eingefügten Schritte.
    conn = op.get_bind()
    psd = _table()
    keys = [s[0] for s in _steps_for("trennung")]
    conn.execute(
        psd.delete().where(
            sa.and_(
                psd.c.mediation_type.in_(TYPES),
                psd.c.phase == PHASE,
                psd.c.variant_key.is_(None),
                psd.c.step_key.in_(keys),
            )
        )
    )
