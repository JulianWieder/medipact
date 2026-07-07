"""Kontext-Vertiefung: alle vier Fall-Typen in allen Phasen anreichern.

Baut auf der Merge-Migration h1w2x3y4z5a6 auf und schließt die verbliebenen
Kontext-Lücken pro Typ (trennung, erbschaft, nachbarschaft, geschaeft):

  Phase 0 (einladung)   + Ablauf-Überblick (akkordeon) und typspezifische
                          Vorbereitungs-Hinweise (was bereitlegen/notieren)
  Phase 1 (einleitung)  + typspezifischer Kontext "Was diese Mediation
                          leisten kann" (akkordeon, nur private Typen –
                          geschaeft hat eigenes Onboarding/Einleitung)
  Phase 3 (interessen)  + typische Interessen "unter der Wasserlinie"
                          (hinweis am Eisberg-Schritt); geschaeft zusätzlich
                          Einigungs-Skala, Perspektivwechsel-Frage und
                          KI-Gemeinsamkeiten (war deutlich dünner als die
                          Methoden-Schritte der privaten Typen)
  Phase 4 (optionen)    + typspezifische Denkanstöße/Beispiel-Optionen
                          (war für die privaten Typen bislang komplett
                          generisch); geschaeft + Brainstorming-Regel und
                          Win-Win-Frage
  Phase 5 (verhandlung)   geschaeft + Ranking, Tragfähigkeits-Skala und
                          Umsetzungs-Zustimmung (Parität zu den privaten
                          Methoden-Schritten ver_bewerten/ver_vereinbarung)
  Phase 6 (abschluss)   + Folgetermin (trennung/erbschaft) und
                          Wirkungs-Frage ("Woran merkt ihr, dass es trägt?")

Idempotent wie h1: ein Block wird nur angehängt, wenn seine id im Schritt
noch fehlt; fehlt der Zielschritt, wird übersprungen. Alle neuen Block-ids
tragen das Präfix "i2_".

Revision ID: i2x3y4z5a6b7
Revises: h1w2x3y4z5a6
Create Date: 2026-07-07
"""
import json
from datetime import datetime, timezone

import sqlalchemy as sa
from alembic import op

revision = "i2x3y4z5a6b7"
down_revision = "h1w2x3y4z5a6"
branch_labels = None
depends_on = None


def _b(bid, btype, **config):
    return {"id": bid, "type": btype, "config": config, "visible_if": None}


# Ablauf-Überblick für die Onboarding-Phase, leicht je Typ fokussiert.
def _ablauf(fokus):
    return _b(
        "i2_ablauf", "akkordeon",
        title="So läuft eure Mediation ab",
        text=(
            "Die Mediation folgt sechs Phasen: 1. Einleitung (Rahmen, Regeln, "
            "euer Ziel), 2. Themensammlung (alles auf den Tisch – ohne Wertung), "
            "3. Interessenklärung (was hinter den Forderungen steckt), "
            "4. Lösungsoptionen (Ideen sammeln, noch nicht bewerten), "
            "5. Verhandlung (prüfen, was wirklich trägt) und 6. Abschluss "
            "(verbindliche Vereinbarung). " + fokus + " Ihr bestimmt das Tempo – "
            "kein Schritt wird übersprungen, aber keiner dauert länger, als ihr "
            "braucht."
        ),
    )


def _wirkung(bid, prompt):
    return _b(bid, "frage", prompt=prompt)


# ADDITIONS[type] = { (phase, step_key): [zusätzliche Blöcke] }
ADDITIONS = {
    "trennung": {
        ("einladung", "basis_einladung"): [
            _ablauf("Bei einer Trennung geht es dabei typischerweise um Kinder "
                    "und Betreuung, Wohnung und Hausrat sowie Finanzen und "
                    "Unterhalt."),
            _b("i2_vorbereitung", "hinweis", variant="info", text=(
                "Hilfreich zur Vorbereitung (nichts davon ist Pflicht): ein "
                "Überblick über Einkommen und Fixkosten, Unterlagen zur Wohnung "
                "(Mietvertrag/Kredit) und ein ehrlicher Blick auf die aktuellen "
                "Betreuungszeiten der Kinder."
            )),
        ],
        ("einleitung", "einl_intro"): [
            _b("i2_kontext", "akkordeon",
               title="Was eine Trennungsmediation leisten kann", text=(
                "Eine Trennung hat zwei Ebenen: die emotionale Trennung und die "
                "Sachfragen (Kinder, Wohnung, Finanzen). Die Mediation hilft, "
                "beide zu entflechten – damit alte Verletzungen nicht die "
                "Entscheidungen über die Zukunft eurer Kinder bestimmen. Sie "
                "ersetzt kein Scheidungsverfahren, bereitet aber eine "
                "einvernehmliche Scheidungsfolgenvereinbarung vor, die deutlich "
                "günstiger und schonender ist als ein Rosenkrieg vor Gericht."
            )),
        ],
        ("interessen", "int_eisberg"): [
            _b("i2_typisch", "hinweis", variant="info", text=(
                "Typische Interessen unter der Wasserlinie bei Trennungen: den "
                "Kontakt zu den Kindern nicht verlieren, finanzielle Sicherheit, "
                "Anerkennung des in der Beziehung Geleisteten – und die "
                "Möglichkeit eines fairen Neuanfangs."
            )),
        ],
        ("optionen", "opt_ideen"): [
            _b("i2_denkanstoss", "hinweis", variant="info", text=(
                "Denkanstöße: Betreuungsmodelle (Wechselmodell, Residenzmodell, "
                "erweiterter Umgang), Wohnlösungen (Übernahme, Verkauf, "
                "Nestmodell), Modelle für Unterhalt und die Aufteilung von "
                "Vermögen und Schulden. Modelle, die beiden Elternteilen "
                "verlässliche Zeit mit den Kindern geben, tragen erfahrungsgemäß "
                "am längsten."
            )),
        ],
        ("abschluss", "basis_abschluss"): [
            _wirkung("i2_wirkung", (
                "Woran werdet ihr in drei Monaten merken, dass die Vereinbarung "
                "trägt – für euch und für die Kinder?"
            )),
            _b("i2_folgetermin", "termin"),
        ],
    },
    "erbschaft": {
        ("einladung", "basis_einladung"): [
            _ablauf("Bei einer Erbschaft geht es dabei typischerweise um "
                    "Immobilien, Geldvermögen, persönliche Gegenstände und "
                    "offene Fragen zu Testament und Erbfolge."),
            _b("i2_vorbereitung", "hinweis", variant="info", text=(
                "Hilfreich zur Vorbereitung (nichts davon ist Pflicht): "
                "Testament oder Erbvertrag, ein grobes Nachlassverzeichnis, "
                "Kontoauszüge bzw. Grundbuchauszug und eine Liste der "
                "Gegenstände, um die es dir wirklich geht."
            )),
        ],
        ("einleitung", "einl_intro"): [
            _b("i2_kontext", "akkordeon",
               title="Erben heißt auch trauern", text=(
                "Erbkonflikte sind selten reine Geldkonflikte. Mit dem Nachlass "
                "kommen Trauer, alte Familienrollen und die Frage zurück, wer "
                "gesehen und anerkannt wurde. Die Mediation gibt beidem Raum: den "
                "Sachfragen der Aufteilung und dem, was zwischen euch steht. Sie "
                "kann Familienbeziehungen erhalten, wo ein Gerichtsprozess sie "
                "meist endgültig zerstört."
            )),
        ],
        ("interessen", "int_eisberg"): [
            _b("i2_typisch", "hinweis", variant="info", text=(
                "Typische Interessen unter der Wasserlinie bei Erbschaften: "
                "Erinnerungen bewahren, als gleichwertiges Familienmitglied "
                "anerkannt werden, Gerechtigkeit über die reine Erbquote hinaus – "
                "und den Familienfrieden nicht dauerhaft zu verlieren."
            )),
        ],
        ("optionen", "opt_ideen"): [
            _b("i2_denkanstoss", "hinweis", variant="info", text=(
                "Denkanstöße: Verkauf und Erlösteilung, Übernahme gegen "
                "Ausgleichszahlung, Tausch von Sachwerten, gemeinsame Vermietung "
                "einer Immobilie – und für Erinnerungsstücke faire Verfahren wie "
                "Losverfahren oder abwechselndes Auswählen."
            )),
        ],
        ("abschluss", "basis_abschluss"): [
            _wirkung("i2_wirkung", (
                "Woran werdet ihr als Familie merken, dass diese Lösung Bestand "
                "hat – auch beim nächsten Familientreffen?"
            )),
            _b("i2_folgetermin", "termin"),
        ],
    },
    "nachbarschaft": {
        ("einladung", "basis_einladung"): [
            _ablauf("Bei einem Nachbarschaftskonflikt geht es dabei "
                    "typischerweise um Lärm, Grenzen, Pflanzen, Wege oder "
                    "Haustiere."),
            _b("i2_vorbereitung", "hinweis", variant="info", text=(
                "Hilfreich zur Vorbereitung: kurze Notizen zu konkreten "
                "Vorfällen (was, wann, wie oft), ggf. Fotos oder ein Lageplan. "
                "Wichtig: Es geht nicht um eine Beweissammlung fürs Rechthaben, "
                "sondern darum, dass die andere Seite versteht, was dich belastet."
            )),
        ],
        ("einleitung", "einl_intro"): [
            _b("i2_kontext", "akkordeon",
               title="Die Besonderheit von Nachbarschaftskonflikten", text=(
                "Ihr begegnet euch auch morgen wieder – am Zaun, im Treppenhaus, "
                "auf der Straße. Ziel der Mediation ist deshalb kein Sieg und "
                "auch keine Freundschaft, sondern ein entspannter Alltag. "
                "Erfahrungsgemäß wirken wenige, konkrete Absprachen mehr als "
                "große Grundsatzklärungen."
            )),
        ],
        ("interessen", "int_eisberg"): [
            _b("i2_typisch", "hinweis", variant="info", text=(
                "Typische Interessen unter der Wasserlinie in der Nachbarschaft: "
                "Ruhe und Erholung im eigenen Zuhause, Respekt und Gehört-Werden, "
                "Kontrolle über das eigene Grundstück – und verlässliche, "
                "berechenbare Absprachen."
            )),
        ],
        ("optionen", "opt_ideen"): [
            _b("i2_denkanstoss", "hinweis", variant="info", text=(
                "Denkanstöße: feste Ruhezeiten, klarer Turnus für Rückschnitt "
                "von Hecken und Bäumen, Sichtschutz oder Zaun, Regeln für Wege "
                "und Zufahrt – und ein kurzer Draht für die Zukunft: erst "
                "ansprechen, dann eskalieren."
            )),
        ],
        ("abschluss", "basis_abschluss"): [
            _wirkung("i2_wirkung", (
                "Woran werdet ihr in einem Monat merken, dass die Absprachen im "
                "Alltag funktionieren?"
            )),
        ],
    },
    "geschaeft": {
        ("einladung", "g_onboarding"): [
            _b("i2_ablauf", "akkordeon",
               title="So läuft der Klärungsprozess ab", text=(
                "Der Prozess folgt sechs Phasen: 1. Einleitung (Rahmen und "
                "Haltung), 2. Diagnose (Konfliktart, Eskalationsstufe, Dynamik), "
                "3. Interessenklärung, 4. Lösungsoptionen, 5. Verhandlung und "
                "6. verbindlicher Abschluss mit Follow-up. Die Diagnose steht "
                "bewusst am Anfang: Ein Strukturkonflikt braucht andere "
                "Antworten als ein Beziehungskonflikt – und ab einer gewissen "
                "Eskalationsstufe ist interne Moderation nicht mehr das richtige "
                "Mittel."
            )),
            _b("i2_vorbereitung", "hinweis", variant="info", text=(
                "Hilfreich zur Vorbereitung: Notiere dir zwei bis drei konkrete "
                "Situationen (was ist passiert, wann, wer war beteiligt) – "
                "Beobachtungen statt Bewertungen. Das macht die Klärung schneller "
                "und fairer."
            )),
        ],
        ("interessen", "g_interessen"): [
            _b("i2_skala", "skala",
               prompt="Wie wichtig ist dir eine Einigung für die weitere Zusammenarbeit?",
               min=1, max=10, minLabel="weniger wichtig", maxLabel="sehr wichtig"),
            _b("i2_perspektive", "frage", prompt=(
                "Perspektivwechsel: Welches berechtigte Anliegen könnte die "
                "andere Seite haben – auch wenn dir ihr Verhalten nicht gefällt?"
            )),
            _b("i2_ki_gemeinsam", "ki_gemeinsamkeiten", prompt=(
                "Identifiziere gemeinsame und ergänzende Interessen der "
                "Beteiligten (z. B. Projekterfolg, Verlässlichkeit, Anerkennung) "
                "und benenne, wo trotz des Konflikts ein gemeinsames Anliegen "
                "sichtbar wird."
            )),
        ],
        ("optionen", "g_optionen"): [
            _b("i2_regel", "hinweis", variant="info", text=(
                "Die wichtigste Regel: erst sammeln, dann bewerten. Kritik und "
                "„ja, aber …“ heben wir uns für die Verhandlung auf. Denkt auch "
                "an strukturelle Lösungen (Rollen, Schnittstellen, "
                "Entscheidungswege) – nicht nur an Verhaltensappelle."
            )),
            _b("i2_winwin", "frage", prompt=(
                "Welche der Optionen erfüllt ein wichtiges Bedürfnis der anderen "
                "Seite – ohne dir oder dem Team zu schaden?"
            )),
        ],
        ("verhandlung", "g_verhandlung"): [
            _b("i2_ranking", "ranking",
               prompt="Bring die Lösungsoptionen in deine bevorzugte Reihenfolge.",
               options=[]),
            _b("i2_tragfaehig", "skala",
               prompt="Wie tragfähig ist die favorisierte Lösung im Arbeitsalltag?",
               min=1, max=10, minLabel="gar nicht", maxLabel="voll und ganz"),
            _b("i2_zustimmung", "zustimmung", text=(
                "Ich bin bereit, die gemeinsam festgehaltenen Schritte im "
                "Arbeitsalltag verbindlich umzusetzen."
            )),
        ],
        ("abschluss", "g_abschluss"): [
            _wirkung("i2_wirkung", (
                "Woran merkt das Team in vier Wochen, dass die Vereinbarung "
                "wirkt – was ist dann konkret anders?"
            )),
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
