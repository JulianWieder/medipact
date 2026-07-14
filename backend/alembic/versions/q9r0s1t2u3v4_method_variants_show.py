"""Vier Mediationsmethoden als Varianten mit Show-Charakter (alle 4 Typen).

Seedet die vier klassischen Mediationsmethoden als zusätzliche Varianten
(`mediation_variants`) für ALLE vier Konfliktarten (trennung, erbschaft,
nachbarschaft, geschaeft) – primär für Business-Konflikte gedacht, aber
überall zuordenbar. Varianten sind additiv: Basis-Workflow + Methoden-Schritte
(vgl. o2d3e4f5g6h7 / get_phase_steps).

Designprinzipien der Inhalte:

1. **Show-Charakter**: Jede Methode hat einen inszenierten Einstieg
   („So funktioniert …"), klare Regie-Ansagen in den Phasen und einen
   dramaturgischen Abschluss (Zusammenführung / Vergleich / Ritual).
2. **Zum Ja führen (Getting to Yes)**: BATNA-Reflexion (vertraulich),
   objektive Kriterien, Paket-Bildung, Commitment-Psychologie (kleine Ja's
   über zustimmung-Blöcke, Konsistenz-Prinzip), Anker- und
   Verlustaversions-Hinweise, gesichtswahrendes Reframing.
3. **KI entwickelt immer wieder Optionen**: Jede Methode enthält
   ki_optionen-Blöcke in Optionen- UND Verhandlungsphase (regenerierbar,
   Mediator stößt an), plus ki_gemeinsamkeiten/ki_reframing als Zuspieler.

Idempotent wie g0/h1/i2: Varianten nur anlegen, wenn (type,key) fehlt;
Schritte nur einfügen, wenn (type, phase, step_key, variant_key) fehlt.
Manuell bearbeitete Schritte werden nicht angefasst.

Revision ID: q9r0s1t2u3v4
Revises: p9f0a1b2c3d4
Create Date: 2026-07-14
"""
from datetime import datetime, timezone

import sqlalchemy as sa
from alembic import op

revision = "q9r0s1t2u3v4"
down_revision = "p9f0a1b2c3d4"
branch_labels = None
depends_on = None

MTYPES = ["trennung", "erbschaft", "nachbarschaft", "geschaeft"]

# Methoden-Schritte werden NACH den Basis-Schritten einsortiert.
POS_OFFSET = 50


def _b(bid, btype, **config):
    return {"id": bid, "type": btype, "config": config, "visible_if": None}


# ── Varianten ────────────────────────────────────────────────────────────────

VARIANTS = [
    (
        "methode_harvard",
        "Harvard-Methode (sachbezogen zum Ja)",
        "Hart in der Sache, weich zu den Menschen: Interessen statt Positionen, "
        "Plan B (BATNA), Optionen-Werkstatt, objektive Kriterien – bis beide "
        "Seiten guten Gewissens Ja sagen können.",
    ),
    (
        "methode_shuttle",
        "Shuttle-Mediation (getrennte Gespräche)",
        "Die Parteien treffen sich zunächst nicht: Der Mediator pendelt "
        "vertraulich zwischen den Seiten. Ideal bei hoher Eskalation, "
        "Machtgefälle oder hartem B2B-Poker.",
    ),
    (
        "methode_transformativ",
        "Transformative Mediation (Beziehung zuerst)",
        "Erst die Menschen, dann die Sache: Empowerment und Anerkennung, "
        "Perspektivwechsel, gemeinsames Zukunftsbild – für alle, die weiter "
        "zusammenarbeiten oder Familie bleiben.",
    ),
    (
        "methode_evaluativ",
        "Evaluative Mediation (Realitätscheck)",
        "Der ehrliche Blick auf Zahlen und Risiken: Was kostet der Streit "
        "wirklich, wie stehen die Chancen vor Gericht, wo liegt die "
        "Einigungszone? Optionen bekommen ein Preisschild.",
    ),
]


# ── Schritte je Methode: variant_key -> phase -> [(step_key, title, description, blocks)] ──

STEPS = {
    # ════════════════════════ HARVARD ════════════════════════
    "methode_harvard": {
        "einleitung": [
            (
                "hv_methode",
                "So funktioniert die Harvard-Methode",
                "Der inszenierte Einstieg: vier Prinzipien, ein Ziel – das beiderseitige Ja.",
                [
                    _b("hv_intro", "textausgabe", text=(
                        "Willkommen zur Harvard-Methode – der weltweit meistgenutzten "
                        "Verhandlungsmethode (aus „Getting to Yes“, Harvard Negotiation "
                        "Project). Die Regel Nummer eins: Wir verhandeln hart in der "
                        "Sache, aber weich zu den Menschen. Am Ende steht keine faule "
                        "Mitte, sondern eine Lösung, zu der beide Seiten aus eigener "
                        "Überzeugung Ja sagen."
                    )),
                    _b("hv_p1", "akkordeon", title="Prinzip 1: Menschen und Probleme trennen",
                       text=("Der Konflikt ist das Problem – nicht die Person auf der anderen "
                             "Seite. Vorwürfe kosten Verhandlungsmacht; wer sachlich bleibt, "
                             "führt das Gespräch.")),
                    _b("hv_p2", "akkordeon", title="Prinzip 2: Interessen statt Positionen",
                       text=("Eine Position ist eine Forderung („Ich will 60 %“). Ein Interesse "
                             "ist der Grund dahinter (Sicherheit, Anerkennung, Liquidität). "
                             "Positionen kollidieren – Interessen lassen sich fast immer "
                             "gleichzeitig erfüllen.")),
                    _b("hv_p3", "akkordeon", title="Prinzip 3: Optionen entwickeln, bevor bewertet wird",
                       text=("Erst die Menge, dann die Auswahl. Wer Ideen sofort bewertet, "
                             "bekommt keine mehr. In der Optionen-Werkstatt gilt deshalb: "
                             "sammeln ohne Kritik – aussortiert wird später.")),
                    _b("hv_p4", "akkordeon", title="Prinzip 4: Objektive Kriterien",
                       text=("Nicht wer lauter ist gewinnt, sondern was sich an neutralen "
                             "Maßstäben messen lässt: Marktwert, Gutachten, Branchenstandard, "
                             "Rechtsprechung.")),
                    _b("hv_commit", "zustimmung", text=(
                        "Ich verhandle über Interessen, nicht über Positionen – und ich "
                        "bewerte Ideen erst, wenn alle auf dem Tisch liegen."
                    )),
                ],
            ),
        ],
        "interessen": [
            (
                "hv_batna",
                "Dein Plan B (BATNA)",
                "Vertraulicher Realitätsanker: Wer seinen Plan B kennt, verhandelt ruhig und souverän.",
                [
                    _b("hv_batna_t", "textausgabe", text=(
                        "BATNA heißt: die beste Alternative, falls es KEINE Einigung gibt "
                        "(Best Alternative To a Negotiated Agreement). Sie ist dein "
                        "Maßstab: Jede Einigung muss besser sein als dein Plan B – und "
                        "keine darf schlechter sein. Wer seine BATNA kennt, muss nichts "
                        "annehmen und nichts fürchten. Diese Angaben sieht nur der "
                        "Mediator, nie die Gegenseite."
                    )),
                    _b("hv_batna_n", "vertrauliche_notiz", prompt=(
                        "Was ist deine beste Alternative, wenn ihr euch NICHT einigt? "
                        "(z.B. Gericht, neuer Lieferant, Verkauf, Auszug – so konkret wie möglich)"
                    )),
                    _b("hv_batna_s", "skala", prompt="Wie stark ist dein Plan B wirklich?",
                       min=1, max=10, minLabel="schwach / teuer", maxLabel="stark / jederzeit machbar"),
                    _b("hv_batna_h", "hinweis", variant="info", text=(
                        "Psychologie: Verhandlungsmacht kommt nicht aus Lautstärke, sondern "
                        "aus der Qualität deines Plan B. Und: Die Gegenseite hat auch einen "
                        "– meist schlechter, als du befürchtest."
                    )),
                    _b("hv_ki_int", "ki_interessen", prompt=(
                        "Leite aus den geäußerten Positionen die dahinterliegenden Interessen "
                        "jeder Partei ab. Zeige für jede Seite: die Forderung, das vermutete "
                        "Interesse dahinter und ein Interesse, das beide teilen."
                    ), autorun=False),
                ],
            ),
        ],
        "optionen": [
            (
                "hv_werkstatt",
                "Optionen-Werkstatt: erst Menge, dann Bewertung",
                "Brainstorm-Bühne mit KI-Verstärkung – der Kuchen wird größer, bevor er verteilt wird.",
                [
                    _b("hv_regel", "hinweis", variant="info", text=(
                        "Werkstatt-Regel: Sammeln ohne Bewerten. Auch halbfertige oder "
                        "verrückte Ideen zählen – Bewertungsangst ist der schnellste Weg, "
                        "gute Lösungen zu verlieren."
                    )),
                    _b("hv_ideen", "liste", prompt=(
                        "Sammle Lösungsideen – Menge vor Qualität. Was könnte den Kuchen "
                        "größer machen (Zusatzleistungen, Zeitachsen, Tauschgeschäfte)?"
                    ), placeholder="Idee hinzufügen …"),
                    _b("hv_ki_opt", "ki_optionen", prompt=(
                        "Erarbeite aus den Ideen und Interessen BEIDER Seiten mindestens "
                        "fünf konkrete Lösungsoptionen. Nutze unterschiedliche Prioritäten "
                        "für Tauschgewinne (was der einen Seite wenig kostet und der anderen "
                        "viel bringt), erweitere den Kuchen statt ihn nur zu teilen, und "
                        "füge bewusst eine unkonventionelle Option hinzu. Formuliere jede "
                        "Option so, dass beide Seiten ihr Interesse darin wiederfinden."
                    ), autorun=False),
                    _b("hv_rank", "ranking", prompt=(
                        "Bringe die Optionen in DEINE Reihenfolge (die Gegenseite sieht nur "
                        "das Ergebnis, nicht deine Gedanken)."
                    ), options=[]),
                ],
            ),
        ],
        "verhandlung": [
            (
                "hv_kriterien",
                "Objektive Kriterien & das Paket",
                "Die Ja-Straße: neutrale Maßstäbe vereinbaren, Pakete schnüren, Teilzustimmungen sammeln.",
                [
                    _b("hv_krit", "auswahl", multi=True, prompt=(
                        "Welche neutralen Maßstäbe akzeptierst du für die Bewertung?"
                    ), options=[
                        "Marktwert / unabhängiges Gutachten",
                        "Branchenüblicher Standard",
                        "Rechtsprechung in vergleichbaren Fällen",
                        "Gleichbehandlung (wie in früheren Fällen gelöst)",
                        "Hälftige Teilung als Ausgangspunkt",
                        "Einschätzung eines externen Experten",
                    ]),
                    _b("hv_ki_gem", "ki_gemeinsamkeiten", prompt=(
                        "Identifiziere aus Rankings und Kriterien-Auswahl beider Seiten, wo "
                        "die Einigung bereits nahe liegt und wo die echten Reibungspunkte "
                        "sind. Beginne mit den Übereinstimmungen."
                    ), autorun=False),
                    _b("hv_ki_paket", "ki_optionen", prompt=(
                        "Schnüre aus den am besten bewerteten Optionen zwei bis drei "
                        "GESAMTPAKETE. Weise für jedes Paket aus, welches Kerninteresse "
                        "jeder Seite es erfüllt und an welchem objektiven Kriterium es sich "
                        "misst. Ziel: Beide Seiten können zu einem Paket ein klares Ja sagen."
                    ), autorun=False),
                    _b("hv_ja", "zustimmung", text=(
                        "Ich bin bereit, auf Basis eines dieser Pakete abzuschließen, wenn "
                        "es besser ist als mein Plan B."
                    )),
                    _b("hv_ja_h", "hinweis", variant="success", text=(
                        "Psychologie: Jedes kleine Ja macht das große Ja leichter "
                        "(Konsistenz-Prinzip). Deshalb sammeln wir Teilzustimmungen, statt "
                        "alles an einer einzigen Entscheidung hängen zu lassen."
                    )),
                ],
            ),
        ],
        "abschluss": [
            (
                "hv_ja_fixieren",
                "Das Ja festhalten",
                "Commitment sichern: schriftlich, konkret, mit Blick nach vorn.",
                [
                    _b("hv_fix_t", "textausgabe", text=(
                        "Was schriftlich festgehalten wird, hält. Nicht als Misstrauen, "
                        "sondern als Psychologie: Ein dokumentiertes, selbst formuliertes "
                        "Commitment wird um ein Vielfaches häufiger eingehalten als ein "
                        "mündliches."
                    )),
                    _b("hv_fix_f", "texteingabe", label=(
                        "Blick nach vorn: Was wirst du in einem Jahr über diese Lösung sagen?"
                    ), placeholder="In einem Jahr …"),
                    _b("hv_fix_sig", "unterschrift", statement=(
                        "Ich stehe zu der gefundenen Lösung und setze meinen Teil um."
                    )),
                ],
            ),
        ],
    },

    # ════════════════════════ SHUTTLE ════════════════════════
    "methode_shuttle": {
        "einleitung": [
            (
                "sh_methode",
                "Shuttle-Mediation: Der Mediator pendelt",
                "Getrennte Räume, volle Vertraulichkeit – die Konfrontation entfällt, die Lösung nicht.",
                [
                    _b("sh_intro", "textausgabe", text=(
                        "In dieser Mediation sitzt ihr euch zunächst NICHT gegenüber. Jede "
                        "Seite hat ihren eigenen, vertraulichen Raum – der Mediator pendelt "
                        "dazwischen, übersetzt, filtert Schärfe heraus und trägt nur das "
                        "weiter, was freigegeben ist. Erst wenn eine Einigung greifbar ist, "
                        "kommt es zur Zusammenführung."
                    )),
                    _b("sh_wann", "akkordeon", title="Wann Shuttle-Mediation die richtige Wahl ist",
                       text=("Bei hoher Eskalation, wenn direkte Gespräche sofort entgleisen; "
                             "bei Machtgefälle (z.B. Chef/Mitarbeiter, Konzern/Zulieferer); "
                             "und im harten B2B-Verhandlungspoker, wo keine Seite ihre Karten "
                             "zeigen will.")),
                    _b("sh_regel", "zustimmung", text=(
                        "Vertraulichkeitsregel: Nichts aus meinem Einzelgespräch geht ohne "
                        "meine ausdrückliche Freigabe an die andere Seite."
                    )),
                ],
            ),
        ],
        "themensammlung": [
            (
                "sh_einzelraum",
                "Dein vertraulicher Raum",
                "Hier darfst du offen sein: Nur der Mediator liest mit.",
                [
                    _b("sh_offen", "vertrauliche_notiz", prompt=(
                        "Was soll der Mediator wissen, was die Gegenseite (noch) nicht "
                        "hören soll? (Hintergründe, Befürchtungen, rote Linien)"
                    )),
                    _b("sh_ziel", "vertrauliche_notiz", prompt=(
                        "Ganz ehrlich: Was wäre dein bestes realistisches Ergebnis – und "
                        "was das schlechteste, das du gerade noch akzeptieren könntest?"
                    )),
                    _b("sh_vertr", "skala", prompt="Wie viel Vertrauen hast du aktuell in eine Einigung?",
                       min=1, max=10, minLabel="keins", maxLabel="volles Vertrauen"),
                ],
            ),
        ],
        "interessen": [
            (
                "sh_freigabe",
                "Was darf rüber?",
                "Kontrollierte Dosierung: Deine Botschaft wird übersetzt, bevor sie die Seite wechselt.",
                [
                    _b("sh_msg", "texteingabe", label=(
                        "Deine Botschaft an die Gegenseite – der Mediator übermittelt sie."
                    ), placeholder="Was soll die andere Seite von dir hören?"),
                    _b("sh_dos", "hinweis", variant="info", text=(
                        "Psychologie: In getrennten Räumen eskaliert nichts. Der Mediator "
                        "dosiert die Information und nimmt die Schärfe heraus – so bleibt "
                        "der Inhalt, aber der Stachel geht verloren."
                    )),
                    _b("sh_ki_ref", "ki_reframing", prompt=(
                        "Übersetze die Botschaft in eine annehmbare, gesichtswahrende Form, "
                        "ohne den Inhalt zu verfälschen. Gesichtswahrung ist die Währung "
                        "der Shuttle-Mediation: Die Gegenseite muss zustimmen können, ohne "
                        "als Verlierer dazustehen."
                    ), autorun=False),
                ],
            ),
        ],
        "optionen": [
            (
                "sh_korridor",
                "Der Einigungskorridor",
                "Die KI ermittelt aus beiden vertraulichen Lagen, OB und WO ein Korridor existiert.",
                [
                    _b("sh_ki_zopa", "ki_gemeinsamkeiten", prompt=(
                        "Ermittle aus den vertraulichen Angaben beider Seiten (beste/gerade "
                        "noch akzeptable Ergebnisse), OB ein Einigungskorridor existiert und "
                        "WO er ungefähr liegt – OHNE vertrauliche Details oder Schmerzgrenzen "
                        "offenzulegen. Formuliere nur die Überlappung in neutralen Worten."
                    ), autorun=False),
                    _b("sh_ki_opt", "ki_optionen", prompt=(
                        "Entwickle Lösungsoptionen INNERHALB des Einigungskorridors. "
                        "Formuliere jede Option so, dass keine Seite ihr Gesicht verliert "
                        "und keine als Sieger oder Verlierer dasteht. Der Vorschlag kommt "
                        "vom Mediator – nicht von einer Partei."
                    ), autorun=False),
                    _b("sh_anker", "hinweis", variant="warning", text=(
                        "Ankereffekt: Die erste genannte Zahl setzt den Rahmen der ganzen "
                        "Verhandlung. Deshalb bringt hier der Mediator die Vorschläge ein – "
                        "so wirkt kein einseitiger Anker."
                    )),
                ],
            ),
        ],
        "verhandlung": [
            (
                "sh_runden",
                "Pendel-Runden",
                "Runde für Runde nähern sich die Angebote an – die KI baut Brücken, wenn es stockt.",
                [
                    _b("sh_regie", "textausgabe", text=(
                        "Regie: Der Mediator holt in jeder Runde von beiden Seiten ein "
                        "aktualisiertes Angebot ein und pendelt damit zur anderen Seite. "
                        "Du entscheidest jede Runde neu – ohne Druck des direkten "
                        "Gegenübers."
                    )),
                    _b("sh_angebot", "vertrauliche_notiz", prompt=(
                        "Dein aktuelles Angebot für diese Runde – und deine Schmerzgrenze "
                        "(sieht nur der Mediator)."
                    )),
                    _b("sh_ki_bruecke", "ki_optionen", prompt=(
                        "Die Runde stockt: Entwickle eine Brücken-Option, die genau zwischen "
                        "den aktuellen Angeboten liegt, aber nicht einfach die Mitte teilt – "
                        "sondern die wichtigsten Interessen beider Seiten kombiniert (z.B. "
                        "mehr Betrag gegen längere Frist, Zusage gegen Garantie)."
                    ), autorun=False),
                    _b("sh_korr_ok", "zustimmung", text=(
                        "Ich akzeptiere den vom Mediator vorgeschlagenen Korridor als "
                        "Grundlage für die letzte Runde."
                    )),
                ],
            ),
        ],
        "abschluss": [
            (
                "sh_zusammenfuehrung",
                "Die Zusammenführung",
                "Der große Moment: Erst für das Ja kommen beide Seiten wieder an einen Tisch.",
                [
                    _b("sh_final_t", "textausgabe", text=(
                        "Jetzt – und erst jetzt – kommen beide Seiten wieder in einen "
                        "gemeinsamen (virtuellen) Raum. Nicht um zu verhandeln, sondern um "
                        "das gefundene Ergebnis gemeinsam zu besiegeln. Die schwere Arbeit "
                        "ist getan; dieser Termin ist der Handschlag."
                    )),
                    _b("sh_final_sig", "unterschrift", statement=(
                        "Ich bestätige das in den Pendel-Runden erarbeitete Ergebnis."
                    )),
                ],
            ),
        ],
    },

    # ════════════════════════ TRANSFORMATIV ════════════════════════
    "methode_transformativ": {
        "einleitung": [
            (
                "tf_methode",
                "Transformative Mediation: erst die Menschen, dann die Sache",
                "Zwei Säulen tragen alles: eigene Stärke (Empowerment) und echtes Anerkennen (Recognition).",
                [
                    _b("tf_intro", "textausgabe", text=(
                        "Diese Methode dreht die Reihenfolge um: Bevor wir über die "
                        "Streitsache sprechen, stärken wir das Gespräch selbst. Denn wo "
                        "Menschen weiter zusammenarbeiten oder Familie bleiben, ist die "
                        "Beziehung das eigentliche Verhandlungsergebnis."
                    )),
                    _b("tf_s1", "akkordeon", title="Säule 1: Empowerment",
                       text=("Jede Seite gewinnt Klarheit über die eigenen Ziele, Ressourcen "
                             "und Entscheidungen. Wer sich stark fühlt, muss nicht mehr laut "
                             "sein.")),
                    _b("tf_s2", "akkordeon", title="Säule 2: Recognition",
                       text=("Die Perspektive der anderen Seite wirklich zu verstehen ist "
                             "keine Schwäche, sondern der schnellste Weg, selbst verstanden "
                             "zu werden.")),
                    _b("tf_regel", "zustimmung", text=(
                        "Ich bin bereit, der anderen Seite zuzuhören, ohne zu unterbrechen "
                        "– und werde selbst ohne Unterbrechung sprechen können."
                    )),
                ],
            ),
        ],
        "themensammlung": [
            (
                "tf_geschichte",
                "Deine Geschichte",
                "Kein Fragenkatalog – eine Bühne: Erzähl den Konflikt, wie du ihn erlebt hast.",
                [
                    _b("tf_story", "texteingabe", label=(
                        "Erzähl den Konflikt als Geschichte: Wie hat es angefangen? Was war "
                        "der Wendepunkt? Wo stehst du heute?"
                    ), placeholder="Am Anfang …"),
                    _b("tf_video", "video_aufnahme", prompt=(
                        "Optional: Erzähl deine Geschichte als kurze Videobotschaft – "
                        "gesprochen wirkt sie oft stärker als geschrieben."
                    )),
                    _b("tf_ki_sum", "ki_zusammenfassung", prompt=(
                        "Fasse die Geschichten beider Seiten wertschätzend zusammen. Hebe "
                        "hervor, was jeder Seite erkennbar wichtig ist und wo sich die "
                        "Erzählungen berühren. Keine Schuldzuweisungen, keine Bewertung."
                    ), autorun=False),
                ],
            ),
        ],
        "interessen": [
            (
                "tf_perspektive",
                "Der Perspektivwechsel",
                "Die Königsdisziplin: Beschreibe den Konflikt so, dass die Gegenseite nicken würde.",
                [
                    _b("tf_regie", "textausgabe", text=(
                        "Regie: Steig für zehn Minuten in die Schuhe der anderen Seite. "
                        "Nicht um recht zu geben – sondern um zu verstehen, wogegen du "
                        "eigentlich verhandelst."
                    )),
                    _b("tf_fremd", "texteingabe", label=(
                        "Beschreibe den Konflikt aus Sicht der Gegenseite – so fair und "
                        "genau, dass sie nicken würde."
                    ), placeholder="Aus ihrer Sicht …"),
                    _b("tf_ki_rec", "ki_reframing", prompt=(
                        "Vergleiche die Selbstbeschreibung jeder Seite mit der "
                        "Fremdbeschreibung durch die andere. Zeige die Recognition-Momente: "
                        "Wo hat eine Seite die andere bereits richtig verstanden? Formuliere "
                        "diese Momente ausdrücklich als Anerkennung."
                    ), autorun=False),
                    _b("tf_rez", "hinweis", variant="success", text=(
                        "Psychologie: Wer die Gegenseite präzise wiedergibt, wird selbst "
                        "eher gehört – Zuhören erzeugt Zuhören (Reziprozität)."
                    )),
                ],
            ),
        ],
        "optionen": [
            (
                "tf_anerkennung",
                "Anerkennung & gemeinsame Optionen",
                "Aus Wertschätzung werden Optionen: Die KI verbindet Beziehung und Sachlösung.",
                [
                    _b("tf_wert", "texteingabe", label=(
                        "Nenne zwei Dinge, die du an der anderen Seite oder an eurer "
                        "bisherigen Zusammenarbeit schätzt."
                    ), placeholder="1. … 2. …"),
                    _b("tf_bez", "skala", prompt="Wie wichtig ist dir die künftige Beziehung?",
                       min=1, max=10, minLabel="abwickeln", maxLabel="unbedingt erhalten"),
                    _b("tf_ki_opt", "ki_optionen", prompt=(
                        "Entwickle Lösungsoptionen, die die Sachfrage lösen UND die "
                        "Beziehung stärken. Beginne jede Option mit dem gemeinsamen Nutzen "
                        "für die künftige Zusammenarbeit bzw. das künftige Miteinander und "
                        "greife die gegenseitige Wertschätzung ausdrücklich auf."
                    ), autorun=False),
                ],
            ),
        ],
        "verhandlung": [
            (
                "tf_zukunft",
                "Das gemeinsame Zukunftsbild",
                "Verhandelt wird rückwärts: erst das Bild in zwölf Monaten, dann der Weg dorthin.",
                [
                    _b("tf_bild", "texteingabe", label=(
                        "Wie sieht eine gute Zusammenarbeit / ein gutes Miteinander in "
                        "zwölf Monaten konkret aus?"
                    ), placeholder="In zwölf Monaten …"),
                    _b("tf_ki_gem", "ki_gemeinsamkeiten", prompt=(
                        "Lege die Zukunftsbilder beider Seiten übereinander: Wo decken sie "
                        "sich bereits? Formuliere daraus ein gemeinsames Zukunftsbild in "
                        "drei Sätzen und benenne die zwei Punkte, die noch zu klären sind."
                    ), autorun=False),
                    _b("tf_ki_opt2", "ki_optionen", prompt=(
                        "Entwickle für die noch offenen Punkte Optionen, die zum "
                        "gemeinsamen Zukunftsbild passen – jede Option als konkreter "
                        "erster Schritt, den beide Seiten sofort gehen könnten."
                    ), autorun=False),
                    _b("tf_ok", "zustimmung", text="Ich trage das gemeinsame Zukunftsbild mit."),
                ],
            ),
        ],
        "abschluss": [
            (
                "tf_ritual",
                "Abschluss mit Anerkennung",
                "Kein Vertragstermin, ein Ritual: Vorsatz und Wunsch besiegeln die Transformation.",
                [
                    _b("tf_fin", "texteingabe", label=(
                        "Was nimmst du dir konkret vor – und was wünschst du der anderen "
                        "Seite?"
                    ), placeholder="Ich nehme mir vor … / Ich wünsche dir …"),
                    _b("tf_sig", "unterschrift", statement=(
                        "Ich stehe zu meinem Vorsatz und zum gemeinsamen Zukunftsbild."
                    )),
                ],
            ),
        ],
    },

    # ════════════════════════ EVALUATIV ════════════════════════
    "methode_evaluativ": {
        "einleitung": [
            (
                "ev_methode",
                "Evaluative Mediation: der ehrliche Realitätscheck",
                "Hier wird bewertet: Zahlen, Risiken, Chancen – unbequem ehrlich, dafür schnell.",
                [
                    _b("ev_intro", "textausgabe", text=(
                        "In dieser Methode bleiben Mediator und KI nicht neutral zurückhaltend "
                        "– sie bewerten aktiv: Wie stehen die Chancen vor Gericht? Was kostet "
                        "der Streit wirklich? Welche Option hat den besten Erwartungswert? "
                        "Ideal, wenn es primär um Geld, Verträge und Risiko geht."
                    )),
                    _b("ev_grenze", "akkordeon", title="Wichtige Grenze",
                       text=("Die Einschätzungen sind Orientierung für die Verhandlung – sie "
                             "ersetzen keine Rechtsberatung. Für eine anwaltliche "
                             "Ersteinschätzung gibt es die Bonus-Leistung im Prozess.")),
                    _b("ev_ok", "zustimmung", text=(
                        "Ich will eine ehrliche Einschätzung – auch wenn sie unbequem ist."
                    )),
                ],
            ),
        ],
        "interessen": [
            (
                "ev_realitaet",
                "Was kostet der Streit?",
                "Der Moment der Wahrheit: Streitwert, Eskalationskosten, Erfolgsaussichten – schwarz auf weiß.",
                [
                    _b("ev_wert", "betrag", label="Um welchen Wert geht es (Streitwert)?", currency="€"),
                    _b("ev_kosten", "betrag", label=(
                        "Geschätzte Kosten bei voller Eskalation (Anwälte, Gericht, interne "
                        "Zeit, entgangene Geschäfte)"
                    ), currency="€"),
                    _b("ev_chance", "skala", prompt="Wie schätzt du deine Erfolgsaussichten vor Gericht ein?",
                       min=0, max=10, minLabel="chancenlos", maxLabel="sicherer Sieg"),
                    _b("ev_grenze_n", "vertrauliche_notiz", prompt=(
                        "Deine Schmerzgrenze: Bis zu welchem Ergebnis würdest du noch "
                        "abschließen? (sieht nur der Mediator)"
                    )),
                    _b("ev_verlust", "hinweis", variant="warning", text=(
                        "Psychologie (Verlustaversion): Menschen überschätzen ihre "
                        "Prozesschancen systematisch und unterschätzen Dauer und Kosten. "
                        "Der richtige Vergleichsmaßstab ist nicht der Sieg – sondern das "
                        "wahrscheinliche Szenario nach zwei Jahren Verfahren."
                    )),
                    _b("ev_ki_risiko", "ki_prompt", prompt=(
                        "Erstelle aus den Angaben beider Seiten eine nüchterne "
                        "Kosten-Risiko-Gegenüberstellung: bestes, wahrscheinliches und "
                        "schlechtestes Szenario je Seite (inkl. Zeit- und Beziehungskosten). "
                        "Rechne vor, ab welchem Einigungswert eine Einigung für jede Seite "
                        "rational besser ist als das wahrscheinliche Prozess-Szenario."
                    ), autorun=False),
                ],
            ),
        ],
        "optionen": [
            (
                "ev_bewertung",
                "Optionen mit Preisschild",
                "Jede Option bekommt Risiko, Kosten und Dauer – dann wird sortiert.",
                [
                    _b("ev_ki_opt", "ki_optionen", prompt=(
                        "Entwickle Lösungsoptionen und bewerte JEDE mit: Risiko (hoch/mittel/"
                        "niedrig), einmalige und laufende Kosten, Umsetzungsdauer und "
                        "Erwartungswert je Seite. Markiere die Option mit dem besten "
                        "Erwartungswert für BEIDE Seiten und begründe kurz."
                    ), autorun=False),
                    _b("ev_rank", "ranking", prompt=(
                        "Sortiere die bewerteten Optionen nach deiner Präferenz."
                    ), options=[]),
                ],
            ),
        ],
        "verhandlung": [
            (
                "ev_zone",
                "Die Einigungszone",
                "Ab jetzt wird jede Forderung am wahrscheinlichen Szenario gemessen – nicht am Wunschergebnis.",
                [
                    _b("ev_ki_zone", "ki_gemeinsamkeiten", prompt=(
                        "Ermittle aus den Schmerzgrenzen und den Szenario-Rechnungen die "
                        "rechnerische Einigungszone (ohne vertrauliche Grenzen offenzulegen). "
                        "Benenne, ob eine Zone existiert, wie breit sie ungefähr ist und "
                        "welcher Bereich für beide Seiten dem wahrscheinlichen "
                        "Prozess-Szenario überlegen ist."
                    ), autorun=False),
                    _b("ev_regie", "textausgabe", text=(
                        "Regie: Jede Forderung wird ab jetzt am wahrscheinlichen Szenario "
                        "gemessen – nicht am besten. Wer mehr will als die Einigungszone "
                        "hergibt, verhandelt gegen die eigene Rechnung."
                    )),
                    _b("ev_ki_final", "ki_optionen", prompt=(
                        "Entwickle innerhalb der Einigungszone zwei bis drei "
                        "Abschluss-Optionen (z.B. Einmalzahlung vs. Raten, sofort vs. "
                        "gestuft, mit/ohne künftige Zusammenarbeit) und weise für jede den "
                        "Vorteil gegenüber dem wahrscheinlichen Prozess-Szenario aus."
                    ), autorun=False),
                    _b("ev_ok2", "zustimmung", text=(
                        "Ich verhandle auf Basis des wahrscheinlichen Szenarios weiter – "
                        "nicht des besten."
                    )),
                ],
            ),
        ],
        "abschluss": [
            (
                "ev_vergleich",
                "Der Vergleich",
                "Das Ergebnis in einem Satz: schneller, günstiger und planbarer als jedes Verfahren.",
                [
                    _b("ev_fin_t", "textausgabe", text=(
                        "Der Abschluss hält fest, was beide Seiten dem Verfahren voraus "
                        "haben: Zeit, Kosten, Planbarkeit – und die Entscheidung lag bei "
                        "euch, nicht bei einem Gericht."
                    )),
                    _b("ev_fin_sig", "unterschrift", statement=(
                        "Ich bestätige den erarbeiteten Vergleich."
                    )),
                ],
            ),
        ],
    },
}


# ── Tabellen-Handles (wie g0v1w2x3y4z5) ──────────────────────────────────────

def _psd():
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


def _variants_table():
    return sa.table(
        "mediation_variants",
        sa.column("id", sa.Integer),
        sa.column("mediation_type", sa.String),
        sa.column("key", sa.String),
        sa.column("label", sa.String),
        sa.column("description", sa.Text),
        sa.column("position", sa.Integer),
        sa.column("enabled", sa.Boolean),
        sa.column("created_at", sa.DateTime),
        sa.column("updated_at", sa.DateTime),
    )


def _insert_step(conn, psd, now, mtype, phase, step_key, title, description,
                 blocks, variant_key, position):
    exists = conn.execute(
        sa.select(psd.c.id).where(
            sa.and_(
                psd.c.mediation_type == mtype,
                psd.c.phase == phase,
                psd.c.step_key == step_key,
                psd.c.variant_key == variant_key,
            )
        )
    ).first()
    if exists:
        return
    conn.execute(
        psd.insert().values(
            mediation_type=mtype,
            phase=phase,
            step_key=step_key,
            variant_key=variant_key,
            title=title,
            description=description,
            placeholder="",
            reflection_mode=None,
            content_types=None,
            blocks=blocks,
            visible_if=None,
            position=position,
            enabled=True,
            created_at=now,
            updated_at=now,
        )
    )


def upgrade() -> None:
    conn = op.get_bind()
    now = datetime.now(timezone.utc)
    psd = _psd()
    mv = _variants_table()

    for mtype in MTYPES:
        # Bestehende Varianten-Anzahl -> Position ans Ende hängen.
        base_pos = conn.execute(
            sa.select(sa.func.count(mv.c.id)).where(mv.c.mediation_type == mtype)
        ).scalar() or 0

        for vidx, (vkey, vlabel, vdesc) in enumerate(VARIANTS):
            existing = conn.execute(
                sa.select(mv.c.id).where(
                    sa.and_(mv.c.mediation_type == mtype, mv.c.key == vkey)
                )
            ).first()
            if not existing:
                conn.execute(
                    mv.insert().values(
                        mediation_type=mtype, key=vkey, label=vlabel,
                        description=vdesc, position=base_pos + vidx,
                        enabled=True, created_at=now, updated_at=now,
                    )
                )

            for phase, steps in STEPS[vkey].items():
                for sidx, (step_key, title, description, blocks) in enumerate(steps):
                    _insert_step(
                        conn, psd, now, mtype, phase, step_key, title,
                        description, blocks, vkey, POS_OFFSET + sidx,
                    )


def downgrade() -> None:
    conn = op.get_bind()
    psd = _psd()
    mv = _variants_table()
    keys = [v[0] for v in VARIANTS]
    conn.execute(psd.delete().where(psd.c.variant_key.in_(keys)))
    conn.execute(mv.delete().where(mv.c.key.in_(keys)))
