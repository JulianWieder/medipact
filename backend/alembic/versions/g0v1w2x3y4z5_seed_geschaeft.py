"""Neuer Typ Geschaeft/Organisation: Seed-Phasen, Diagnose, Eskalation, Varianten.

Legt für den Typ `geschaeft` (Geschäft & Organisation) an:
- Basis-Phasen (Onboarding, Einleitung, Diagnose in der Themensammlung,
  Interessen, Optionen, Verhandlung, Abschluss) mit Blöcken.
- Diagnose: Konfliktart (auswahl), Glasl-Eskalationsstufe (skala mit sets_flag,
  setzt automatisch das Flag glasl_zone), systemische Fragen (SKAT).
- Eskalations-Schritte in der Verhandlung mit visible_if:
  glasl_zone=win_lose -> Empfehlung externe Mediation (+ Bonus-Kaufblock),
  glasl_zone=lose_lose -> Grenzen der Mediation (Machtwort / arbeitsrechtlich).
- Zwei Varianten: fuehrungskraft (Führungskraft moderiert selbst) und extern
  (externe Mediation), je mit einem einordnenden Onboarding-Schritt.

Idempotent (Insert nur, wenn step_key/Variante fehlt).

Revision ID: g0v1w2x3y4z5
Revises: f9u0v1w2x3y4
Create Date: 2026-07-07
"""
from datetime import datetime, timezone

import sqlalchemy as sa
from alembic import op

revision = "g0v1w2x3y4z5"
down_revision = "f9u0v1w2x3y4"
branch_labels = None
depends_on = None

MTYPE = "geschaeft"


def _b(bid, btype, **config):
    return {"id": bid, "type": btype, "config": config, "visible_if": None}


def _vis(flag, eq):
    return {"all": [{"flag": flag, "eq": eq}]}


# ── Basis-Schritte je Phase: (step_key, title, description, blocks, visible_if) ──
BASE = {
    "einladung": [
        ("g_onboarding", "Willkommen", "Ankommen und Orientierung.", [
            _b("on_t", "textausgabe", text=(
                "Willkommen. Konflikte in Organisationen sind selten reine "
                "Leistungsverweigerung – oft stecken Verlustängste, unklare Rollen oder "
                "strukturelle Widersprüche dahinter. Wir verstehen zuerst die Dynamik und "
                "finden dann einen tragfähigen Weg."
            )),
            _b("on_h", "hinweis", variant="info", text=(
                "Alles, was hier eingegeben wird, dient ausschließlich der Klärung und wird "
                "vertraulich behandelt."
            )),
        ], None),
    ],
    "einleitung": [
        ("g_einleitung", "Einleitung & Regeln", "Rahmen und Haltung.", [
            _b("el_t", "textausgabe", text=(
                "Wir klären den Rahmen. Die mediierende Person sorgt für einen fairen "
                "Ablauf und bleibt allparteilich – sie bewertet nicht und ergreift nicht "
                "Partei."
            )),
            _b("el_a", "akkordeon", title="Veränderungsschmerz verstehen", text=(
                "Veränderung erzeugt fast immer Verlustängste – um Status, Komfort oder "
                "Kompetenz. Widerstand ist oft weniger Boykott als eine unbewältigte "
                "Übergangsphase. Wer das versteht, reagiert gelassener."
            )),
            _b("el_z", "zustimmung", text=(
                "Ich halte mich an die Gesprächsregeln: ausreden lassen, sachlich bleiben, "
                "Vertraulichkeit wahren."
            )),
            _b("el_vc", "videokonferenz", url=""),
        ], None),
    ],
    "themensammlung": [
        ("g_diagnose", "Diagnose", "Konfliktart, Eskalationsstufe und Dynamik.", [
            _b("di_t", "textausgabe", text=(
                "Zuerst verstehen wir den Konflikt genauer – seine Art, seine Schärfe und "
                "die Dynamik dahinter."
            )),
            _b("di_art", "auswahl", multi=False,
               prompt="Welche Konfliktart trifft am ehesten zu?",
               options=[
                   "Sachkonflikt (Was oder Wie)",
                   "Beziehungskonflikt (Wertschätzung, Sympathie)",
                   "Rollenkonflikt (unklare Zuständigkeiten)",
                   "Strukturkonflikt (systemische Widersprüche)",
               ]),
            _b("di_art_h", "hinweis", variant="info", text=(
                "Wichtig: Ein Strukturkonflikt – etwa gegeneinander laufende Ziele zweier "
                "Abteilungen – lässt sich nicht auf der Beziehungsebene lösen."
            )),
            _b("di_glasl", "skala",
               prompt="Wie weit ist der Konflikt eskaliert? (Glasl-Stufe 1 bis 9)",
               min=1, max=9, minLabel="Verhärtung", maxLabel="Gemeinsam in den Abgrund",
               sets_flag={
                   "flag": "glasl_zone",
                   "thresholds": [[3, "win_win"], [6, "win_lose"], [9, "lose_lose"]],
               }),
            _b("di_glasl_h", "hinweis", variant="info", text=(
                "Stufe 1 bis 3: Gespräche und Moderation helfen noch (Win-Win). "
                "Stufe 4 bis 6: Lagerbildung, externe Mediation ratsam (Win-Lose). "
                "Stufe 7 bis 9: gegenseitige Schädigung (Lose-Lose)."
            )),
            _b("di_fn", "frage",
               prompt="Welche Funktion hat der Konflikt im System – was hält ihn aufrecht?"),
            _b("di_gw", "frage",
               prompt="Welche verdeckten Gewinne haben die Beteiligten daran, den Konflikt aufrechtzuerhalten?"),
            _b("di_vn", "vertrauliche_notiz",
               prompt="Etwas, das du zunächst nur der mediierenden Person mitteilen möchtest?"),
        ], None),
    ],
    "interessen": [
        ("g_interessen", "Interessen & Bedürfnisse", "Interessen statt Positionen.", [
            _b("in_t", "textausgabe", text=(
                "Hinter Forderungen (Positionen) stehen Bedürfnisse (Interessen). Wenn wir "
                "die Interessen verstehen, werden tragfähige Lösungen möglich."
            )),
            _b("in_q", "frage",
               prompt="Was ist dir in diesem Konflikt wirklich wichtig – und warum?"),
            _b("in_ki", "ki_interessen", prompt=(
                "Leite aus den Positionen die dahinterliegenden Interessen und Bedürfnisse "
                "der Beteiligten ab."
            )),
        ], None),
    ],
    "optionen": [
        ("g_optionen", "Lösungsoptionen", "Ideen sammeln, ohne zu bewerten.", [
            _b("op_t", "textausgabe", text=(
                "Sammelt möglichst viele Lösungsideen – bewertet wird erst später."
            )),
            _b("op_l", "liste", prompt="Welche Lösungsmöglichkeiten fallen dir ein?",
               placeholder="Eine Idee …"),
            _b("op_ki", "ki_optionen", prompt=(
                "Erarbeite faire, umsetzbare Optionen, die die Interessen der Beteiligten "
                "und die Zusammenarbeit im Team berücksichtigen."
            )),
        ], None),
    ],
    "verhandlung": [
        ("g_verhandlung", "Bewerten & verhandeln", "Verbindliche Lösung finden.", [
            _b("ve_t", "textausgabe", text=(
                "Jetzt bewertet ihr die Optionen und verhandelt eine verbindliche Lösung, "
                "die für die Beteiligten und das Team funktioniert."
            )),
            _b("ve_pref", "texteingabe", label="Deine bevorzugte Lösung",
               placeholder="Welche Option bevorzugst du – und unter welchen Bedingungen?"),
            _b("ve_batna", "frage", prompt=(
                "Was ist deine beste Alternative, falls ihr euch nicht einigt? Was würde das "
                "an Zeit, Kosten und für die Zusammenarbeit bedeuten?"
            )),
            _b("ve_ki", "ki_gemeinsamkeiten", prompt=(
                "Zeige Übereinstimmungen und offene Punkte auf und markiere, wo eine "
                "Einigung nahe liegt."
            )),
        ], None),
        # Eskalation: nur bei Win-Lose-Zone.
        ("g_esk_extern", "Externe Mediation empfohlen", "Eskalation Win-Lose.", [
            _b("ee_h", "hinweis", variant="warnung", text=(
                "Der Konflikt ist bereits in der Win-Lose-Zone. Eine externe, allparteiliche "
                "Mediation ist jetzt oft der bessere Weg als eine interne Moderation."
            )),
            _b("ee_pay", "bezahlung", title="Externe Mediation hinzubuchen",
               description="Eine neutrale, externe mediierende Person übernimmt die weitere Klärung.",
               price=149.0, currency="EUR",
               unlock_text="Danke – wir melden uns mit einem Terminvorschlag für die externe Mediation."),
        ], _vis("glasl_zone", "win_lose")),
        # Eskalation: nur bei Lose-Lose-Zone.
        ("g_esk_grenzen", "Grenzen der Mediation", "Eskalation Lose-Lose.", [
            _b("eg_h", "hinweis", variant="warnung", text=(
                "Lose-Lose-Zone: In dieser Eskalationsstufe hilft Mediation meist nicht mehr. "
                "Jetzt sind eine klare Führungsentscheidung (Machtwort), die Trennung der "
                "Konfliktparteien oder arbeitsrechtliche Schritte zu prüfen."
            )),
            _b("eg_vn", "vertrauliche_notiz",
               prompt="Notiz für Führungskraft / HR – welche nächsten Schritte sind nötig?"),
        ], _vis("glasl_zone", "lose_lose")),
    ],
    "abschluss": [
        ("g_abschluss", "Abschluss & Vereinbarung", "Verbindlich festhalten.", [
            _b("ab_t", "textausgabe", text=(
                "Haltet die Vereinbarung verbindlich fest: wer macht was bis wann."
            )),
            _b("ab_v", "vertrag", template=(
                "Vereinbarung\n\n1. Vereinbarte Maßnahmen: …\n"
                "2. Wer setzt was bis wann um: …\n3. Überprüfung / Follow-up: …\n\nOrt, Datum:"
            )),
            _b("ab_s", "unterschrift", statement="Ich bestätige die oben festgehaltene Vereinbarung."),
            _b("ab_termin", "termin"),
            _b("ab_fb", "feedback", occasion="before_contract"),
        ], None),
    ],
}

# ── Variantenspezifische Zusatz-Schritte: variant_key -> [(phase, step_key, title, desc, blocks)] ──
VARIANT_STEPS = {
    "fuehrungskraft": [
        ("einladung", "vg_rolle", "Deine Rolle als Führungskraft", "Macht & Grenzen.", [
            _b("vg_t", "textausgabe", text=(
                "Als Führungskraft bist du nie ganz neutral – du beurteilst, entscheidest "
                "und verteilst am Ende auch Konsequenzen. Das verändert die Dynamik. Mach "
                "dir deine Rolle bewusst."
            )),
            _b("vg_a", "auswahl", multi=False,
               prompt="Welche Rolle nimmst du in diesem Konflikt ein?",
               options=[
                   "Allparteilicher Vermittler",
                   "Zielorientierter Vorgesetzter",
                   "Schiedsrichter (ich entscheide am Ende)",
               ]),
            _b("vg_g", "akkordeon", title="Grenzen mediativ orientierter Führung", text=(
                "Bei Gesetzesverstößen, Compliance-Themen oder fortgeschrittener Eskalation "
                "ist Schluss mit Moderation – dann braucht es eine klare Führungsentscheidung."
            )),
        ]),
    ],
    "extern": [
        ("einladung", "ext_neutral", "Externe, neutrale Mediation", "Voller Schutz durch Neutralität.", [
            _b("ex_t", "textausgabe", text=(
                "Diese Mediation wird von einer externen, allparteilichen Person begleitet. "
                "Sie gehört keiner Seite an, bewertet nicht und hat kein eigenes Interesse am "
                "Ausgang – das schafft den sichersten Rahmen für offene Gespräche."
            )),
        ]),
    ],
}

VARIANTS = [
    ("fuehrungskraft", "Führungskraft moderiert selbst",
     "Mediativ orientierte Führung inkl. Rollen- und Machtwort-Grenzen."),
    ("extern", "Externe Mediation",
     "Neutrale dritte Person mit voller Allparteilichkeit."),
]


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


def _insert_step(conn, psd, now, phase, step_key, title, description, blocks, visible_if, variant_key, position):
    exists = conn.execute(
        sa.select(psd.c.id).where(
            sa.and_(
                psd.c.mediation_type == MTYPE,
                psd.c.phase == phase,
                psd.c.step_key == step_key,
                psd.c.variant_key.is_(None) if variant_key is None else (psd.c.variant_key == variant_key),
            )
        )
    ).first()
    if exists:
        return
    conn.execute(
        psd.insert().values(
            mediation_type=MTYPE,
            phase=phase,
            step_key=step_key,
            variant_key=variant_key,
            title=title,
            description=description,
            placeholder="",
            reflection_mode=None,
            content_types=None,
            blocks=blocks,
            visible_if=visible_if,
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

    # Basis-Schritte.
    for phase, steps in BASE.items():
        for pos, (step_key, title, description, blocks, visible_if) in enumerate(steps):
            _insert_step(conn, psd, now, phase, step_key, title, description, blocks, visible_if, None, pos)

    # Varianten anlegen + variantenspezifische Schritte.
    for vpos, (key, label, description) in enumerate(VARIANTS):
        existing = conn.execute(
            sa.select(mv.c.id).where(
                sa.and_(mv.c.mediation_type == MTYPE, mv.c.key == key)
            )
        ).first()
        if not existing:
            conn.execute(
                mv.insert().values(
                    mediation_type=MTYPE, key=key, label=label, description=description,
                    position=vpos, enabled=True, created_at=now, updated_at=now,
                )
            )
        for phase, step_key, title, desc, blocks in VARIANT_STEPS.get(key, []):
            _insert_step(conn, psd, now, phase, step_key, title, desc, blocks, None, key, 0)


def downgrade() -> None:
    conn = op.get_bind()
    psd = _psd()
    mv = _variants_table()
    conn.execute(psd.delete().where(psd.c.mediation_type == MTYPE))
    conn.execute(mv.delete().where(mv.c.mediation_type == MTYPE))
