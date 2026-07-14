"""Abo-Modell: Org-Grundkonfiguration + schlanker Abo-Fall-Start.

Julian-Vorgabe (2026-07-12): Das Abo-Modell braucht ein anderes Konstrukt als
die Einzel-Mediation. Im Abo muss ZUERST einmalig pro Unternehmen eine
Grundkonfiguration vorgenommen und akzeptiert werden — erst danach können
Abo-Fälle angelegt werden. Einzel-Geschäftsmediationen (B2C) bleiben
unverändert (start_intake-Lagebesprechung + Paketwahl).

Drei Bausteine:

1. organizations.base_config (JSON: Block-id -> Antwort) +
   base_config_accepted_at / base_config_accepted_by — die vom Firmen-Admin
   vorgenommene und akzeptierte Grundkonfiguration.

2. Seed WFM-Schritt mediation_type="organisation", phase="einladung",
   step_key="abo_grundkonfiguration": die INHALTE der Grundkonfiguration
   (Vertraulichkeit/Datenzugriff, Freiwilligkeit im Arbeitskontext,
   Einsatzfelder, Routine, Eskalationspfad, Ansprechperson, Akzeptanz)
   als Blöcke — im Designer editierbar wie jeder andere Schritt. Der
   Pseudo-Typ "organisation" kollidiert nicht mit Fall-Flows (die filtern
   nach dem mediation_type des Falls).

3. Seed WFM-Schritt mediation_type="geschaeft", phase="einladung",
   step_key="abo_start" mit visible_if {abo=ja}: der schlanke Business-Start
   für BETEILIGTE in Abo-Fällen (Rahmen akzeptieren, eigene Sicht,
   Glasl-Kurzeinschätzung) — ohne Paket, ohne Zahlung, ohne KI-Titel.
   create_mediation stempelt Org-Fälle mit flags={"abo": "ja"}, dadurch
   erscheint der Schritt nur dort (B2C-Fälle ohne Flag sehen ihn nie).

Idempotent (Upsert wie l5b6c7d8e9f0): Schritt wird angelegt, wenn er fehlt;
veraltete Seed-Inhalte werden anhand der ersten Block-id ersetzt.

Revision ID: p9f0a1b2c3d4
Revises: o8e9f0a1b2c3
Create Date: 2026-07-12
"""
from datetime import datetime, timezone

import sqlalchemy as sa
from alembic import op

revision = "p9f0a1b2c3d4"
down_revision = "o8e9f0a1b2c3"
branch_labels = None
depends_on = None


def _b(bid, btype, **config):
    return {"id": bid, "type": btype, "config": config, "visible_if": None}


# ── Grundkonfiguration (einmal pro Unternehmen, vom Firmen-Admin) ────────────

GRUNDKONFIG_BLOCKS = [
    _b("gk_intro", "textausgabe",
       title="Die Grundkonfiguration Ihres Unternehmens.",
       text=(
           "Einmal einrichten, für alle Fälle gültig: Hier legen Sie den "
           "Rahmen fest, in dem Mediationen in Ihrem Unternehmen ablaufen — "
           "wer was sieht, wann mediiert wird und was gilt, wenn eine "
           "Klärung scheitert. Diese Konfiguration ist Teil Ihres Abos und "
           "muss akzeptiert sein, bevor der erste Fall startet."
       )),
    _b("gk_vertraulich", "textausgabe",
       title="Vertraulichkeit & Datenzugriff",
       text=(
           "Damit Mitarbeitende offen sprechen können, gilt: Beteiligte sehen "
           "ihre eigenen Eingaben. Die mediierende Person sieht alle Inhalte "
           "ihres Falls. Firmen-Admins sehen Status und Fortschritt ihrer "
           "Fälle — aber NICHT die inhaltlichen Eingaben der Beteiligten. "
           "Inhalte werden nicht für Personalentscheidungen bereitgestellt."
       )),
    _b("gk_freiwillig", "hinweis", variant="warnung", text=(
        "Freiwilligkeit im Arbeitskontext: Die Teilnahme an einer Mediation "
        "kann empfohlen, aber nicht angeordnet werden. Eine erzwungene "
        "Mediation scheitert fast immer — und beschädigt das Vertrauen in "
        "das Angebot."
    )),
    _b("gk_einsatz", "auswahl",
       prompt="Für welche Konfliktfelder soll Mediation bei Ihnen zur Verfügung stehen?",
       options=["Konflikte im Team",
                "Führungskraft ↔ Mitarbeitende",
                "Zwischen Abteilungen / Bereichen",
                "Gesellschafter / Geschäftsführung",
                "Mit Kunden oder Lieferanten"],
       multi=True),
    _b("gk_routine", "auswahl",
       prompt="Was ist der Standard-Weg, wenn ein Konflikt gemeldet wird?",
       options=["Direkt Fall anlegen und Mediator zuordnen",
                "Erst ein Vorgespräch (HR / Ansprechperson), dann Fall",
                "Entscheiden wir je nach Fall"],
       multi=False),
    _b("gk_eskalation", "frage", prompt=(
        "Was gilt, wenn eine Mediation scheitert oder abgebrochen wird — wer "
        "übernimmt dann, und welche Schritte folgen (z. B. Führungsentscheid, "
        "HR-Verfahren, externe Beratung)?"
    )),
    _b("gk_ansprech", "frage", prompt=(
        "Wer ist die interne Ansprechperson für Mediationsanliegen "
        "(Name und Rolle)? An sie wenden sich Mitarbeitende zuerst."
    )),
    _b("gk_zustimmung", "zustimmung", text=(
        "Diese Grundkonfiguration gilt als verbindlicher Rahmen für alle "
        "Mediationen unseres Unternehmens. Ich bin berechtigt, sie für das "
        "Unternehmen festzulegen, und akzeptiere sie — insbesondere die "
        "Regeln zu Vertraulichkeit, Datenzugriff und Freiwilligkeit."
    )),
]

# ── Schlanker Abo-Start für Beteiligte (nur Org-Fälle, flags.abo == "ja") ────

ABO_START_BLOCKS = [
    _b("as_intro", "textausgabe",
       title="Willkommen. Kurz zum Rahmen — dann geht es los.",
       text=(
           "Ihr Unternehmen stellt diese Mediation im Rahmen seines Abos "
           "bereit — für Sie entstehen keine Kosten und kein Papierkram. "
           "Zwei Minuten für den Rahmen und Ihre Sicht, mehr braucht es "
           "jetzt nicht."
       )),
    _b("as_rahmen", "zustimmung", text=(
        "Der Rahmen, auf den Sie sich verlassen können: FREIWILLIG (Ihre "
        "Teilnahme ist Ihre Entscheidung — Sie können jederzeit aussteigen). "
        "VERTRAULICH (Ihre Eingaben sieht die mediierende Person — nicht Ihr "
        "Arbeitgeber; an die Firma gehen nur Status und Ergebnis, nie Ihre "
        "Inhalte). ALLPARTEILICH (die Mediation steht auf keiner Seite — auch "
        "nicht auf der des Unternehmens). Auf dieser Grundlage mache ich mit."
    )),
    _b("as_sicht", "frage", map_to="description", prompt=(
        "Ihre Sicht: Worum geht es in diesem Konflikt aus Ihrer Perspektive — "
        "und seit wann beschäftigt er Sie?"
    )),
    _b("as_wunsch", "frage", prompt=(
        "Was müsste sich konkret ändern, damit die Zusammenarbeit für Sie "
        "wieder funktioniert?"
    )),
    _b("as_eskalation", "skala",
       prompt=("Ihre ehrliche Einschätzung: Wo steht der Konflikt heute?"),
       min=1, max=9,
       minLabel="1 · man redet noch sachlich",
       maxLabel="9 · Schaden wird in Kauf genommen",
       sets_flag={"flag": "glasl_zone",
                  "thresholds": [[1, "win_win"], [4, "win_lose"], [7, "lose_lose"]]}),
    _b("as_weiter", "hinweis", variant="info", text=(
        "Das war's fürs Erste. Als Nächstes führt Sie die Einleitung durch "
        "Gesprächsregeln und Ziele — die mediierende Person meldet sich für "
        "den ersten Termin."
    )),
]

SEEDS = [
    # (mediation_type, step_key, title, description, blocks, visible_if)
    ("organisation", "abo_grundkonfiguration",
     "Grundkonfiguration (Firmen-Abo)",
     "Einmal pro Unternehmen: Rahmen für alle Abo-Mediationen festlegen und akzeptieren.",
     GRUNDKONFIG_BLOCKS, None),
    ("geschaeft", "abo_start",
     "Ihr Start im Firmen-Abo",
     "Schlanker Start für Beteiligte in Abo-Fällen: Rahmen akzeptieren, eigene Sicht, Einschätzung.",
     ABO_START_BLOCKS, {"all": [{"flag": "abo", "eq": "ja"}]}),
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
        sa.column("visible_if", sa.JSON),
        sa.column("position", sa.Integer),
        sa.column("enabled", sa.Boolean),
        sa.column("created_at", sa.DateTime),
        sa.column("updated_at", sa.DateTime),
    )


def upgrade() -> None:
    conn = op.get_bind()
    now = datetime.now(timezone.utc)

    # 1. Org-Spalten
    op.add_column("organizations", sa.Column("base_config", sa.JSON(), nullable=True))
    op.add_column("organizations", sa.Column("base_config_accepted_at", sa.DateTime(), nullable=True))
    op.add_column("organizations", sa.Column("base_config_accepted_by", sa.String(), nullable=True))

    # 2. + 3. WFM-Seeds (Upsert)
    psd = _table()
    for mtype, step_key, title, description, blocks, visible_if in SEEDS:
        exists = conn.execute(
            sa.select(psd.c.id, psd.c.blocks).where(
                sa.and_(
                    psd.c.mediation_type == mtype,
                    psd.c.phase == "einladung",
                    psd.c.step_key == step_key,
                    psd.c.variant_key.is_(None),
                )
            )
        ).first()
        if exists:
            current = exists[1] or []
            have_first = current[0].get("id") if current and isinstance(current[0], dict) else None
            if have_first != blocks[0]["id"]:
                conn.execute(
                    psd.update()
                    .where(psd.c.id == exists[0])
                    .values(blocks=blocks, title=title, visible_if=visible_if, updated_at=now)
                )
            continue
        conn.execute(
            psd.insert().values(
                mediation_type=mtype,
                phase="einladung",
                step_key=step_key,
                variant_key=None,
                title=title,
                description=description,
                placeholder="",
                reflection_mode=None,
                content_types=None,
                blocks=blocks,
                visible_if=visible_if,
                position=0 if mtype == "organisation" else 1,
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
                psd.c.step_key.in_(["abo_grundkonfiguration", "abo_start"]),
                psd.c.variant_key.is_(None),
            )
        )
    )
    op.drop_column("organizations", "base_config_accepted_by")
    op.drop_column("organizations", "base_config_accepted_at")
    op.drop_column("organizations", "base_config")
