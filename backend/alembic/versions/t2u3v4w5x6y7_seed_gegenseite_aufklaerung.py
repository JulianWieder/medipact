"""Seed: Aufklärungs-Schritt "gegenseite_aufklaerung" (Phase einladung).

Problem: Die eingeladene Partei wurde nach der Einladungs-Annahme direkt mit
Rechnungsdaten + Zahlung konfrontiert. Bevor Geld überhaupt Thema ist, muss
sie verstehen: Was ist hier passiert? Was ist Mediation? Wie läuft es auf
medipact ab?

Dieser Schritt wird von der neuen Intro-Seite (/dashboard/[id]/intro,
AufklaerungClient) als Vollbild-Flow gerendert — analog zum StartFlow des
Antragstellers. Inhalt ist über den WorkflowManager (Seiten-Designer)
pflegbar; das Video (ga_video) ist ein Platzhalter mit dem bestehenden
Synthesia-Video und kann dort jederzeit gegen das neue Video getauscht
werden.

required_roles="other_party": Der Schritt gilt nur für die eingeladene
Partei — Antragsteller und Mediator sehen ihn nicht.

Idempotent (Upsert wie start_intake-Seed): legt den Schritt an, wenn er
fehlt; ersetzt veraltete Seed-Inhalte (Marker: erste Block-id); manuelle
Designer-Anpassungen bleiben unberührt.

Revision ID: t2u3v4w5x6y7
Revises: s1t2u3v4w5x6
Create Date: 2026-07-18
"""
from datetime import datetime, timezone

import sqlalchemy as sa
from alembic import op

revision = "t2u3v4w5x6y7"
down_revision = "s1t2u3v4w5x6"
branch_labels = None
depends_on = None

TYPES = ["trennung", "erbschaft", "nachbarschaft", "geschaeft"]

STEP_KEY = "gegenseite_aufklaerung"

# Bestehendes Synthesia-Erklärvideo als Platzhalter — im WorkflowManager
# (Seiten-Designer) gegen das neue Video tauschbar.
PLACEHOLDER_VIDEO_URL = (
    "https://share.synthesia.io/embeds/videos/ecc6e794-b1df-4c8e-85ca-f137b90c3f2f"
)


def _b(bid, btype, **config):
    return {"id": bid, "type": btype, "config": config, "visible_if": None}


# ── Typspezifischer Einstieg: Was ist hier passiert? ─────────────────────────

INTRO = {
    "trennung": (
        "Dein Partner bzw. deine Partnerin hat auf medipact eine Mediation zu "
        "eurer Trennung begonnen und dich eingeladen, daran teilzunehmen.\n\n"
        "Das ist kein Schritt gegen dich — im Gegenteil: Es ist der Versuch, "
        "die Dinge fair, respektvoll und ohne Gericht zu klären. Nimm dir "
        "einen Moment, um zu verstehen, was das bedeutet."
    ),
    "erbschaft": (
        "Ein Mitglied deiner Erbengemeinschaft hat auf medipact eine Mediation "
        "begonnen und dich eingeladen, daran teilzunehmen.\n\n"
        "Das ist kein Schritt gegen dich — es ist der Versuch, die Erbsache "
        "fair und im Gespräch zu klären, statt vor Gericht. Nimm dir einen "
        "Moment, um zu verstehen, was das bedeutet."
    ),
    "nachbarschaft": (
        "Dein Nachbar bzw. deine Nachbarin hat auf medipact eine Mediation "
        "begonnen und dich eingeladen, daran teilzunehmen.\n\n"
        "Das ist kein Schritt gegen dich — es ist der Versuch, den Konflikt "
        "fair und im direkten Gespräch zu lösen, statt ihn eskalieren zu "
        "lassen. Nimm dir einen Moment, um zu verstehen, was das bedeutet."
    ),
    "geschaeft": (
        "Ihr Geschäftspartner bzw. Ihre Geschäftspartnerin hat auf medipact "
        "eine Mediation begonnen und Sie eingeladen, daran teilzunehmen.\n\n"
        "Das ist kein Schritt gegen Sie — es ist der Versuch, den Konflikt "
        "professionell, vertraulich und ohne Gericht zu klären. Nehmen Sie "
        "sich einen Moment, um zu verstehen, was das bedeutet."
    ),
}

# geschaeft siezt (B2B-Ton), die privaten Typen duzen.
_DU = {
    "grundsaetze": (
        "Mediation ist ein strukturiertes Gespräch mit einer neutralen, "
        "vermittelnden Person — dem Mediator. Vier Dinge kannst du dich "
        "verlassen:\n\n"
        "FREIWILLIG: Niemand zwingt dich. Du entscheidest, ob und wie weit "
        "du mitgehst.\n\n"
        "VERTRAULICH: Was du hier einbringst, bleibt im Verfahren. Deine "
        "vertraulichen Eingaben sieht der Mediator — nicht die andere Seite.\n\n"
        "ALLPARTEILICH: Der Mediator steht auf keiner Seite — auch nicht auf "
        "der Seite dessen, der die Mediation begonnen hat.\n\n"
        "ERGEBNISOFFEN: Es gibt kein vorbestimmtes Ergebnis. Eine Lösung "
        "zählt nur, wenn beide Seiten sie tragen."
    ),
    "ablauf": (
        "So geht es auf medipact weiter:\n\n"
        "1. Du schaust dir alles in Ruhe an — nichts davon verpflichtet dich "
        "schon zu etwas.\n\n"
        "2. Beide Seiten schalten das Verfahren frei. Dafür hinterlegst du "
        "deine Rechnungsdaten und übernimmst deinen Anteil — die Kosten "
        "werden dir vorher transparent angezeigt und fair zwischen den "
        "Parteien geteilt.\n\n"
        "3. Danach beginnt die eigentliche Mediation: Jede Seite schildert "
        "ihre Sicht, der Mediator führt Schritt für Schritt durch die Phasen "
        "bis zu einer gemeinsamen Vereinbarung."
    ),
    "zustimmung": (
        "Ich habe verstanden, worum es geht: Ich wurde zu einer freiwilligen, "
        "vertraulichen Mediation eingeladen. Ich schaue mir jetzt die "
        "nächsten Schritte an — eine Verpflichtung entsteht dadurch noch "
        "nicht."
    ),
}

_SIE = {
    "grundsaetze": (
        "Mediation ist ein strukturiertes Gespräch mit einer neutralen, "
        "vermittelnden Person — dem Mediator. Auf vier Dinge können Sie sich "
        "verlassen:\n\n"
        "FREIWILLIG: Niemand zwingt Sie. Sie entscheiden, ob und wie weit "
        "Sie mitgehen.\n\n"
        "VERTRAULICH: Was Sie einbringen, bleibt im Verfahren. Ihre "
        "vertraulichen Eingaben sieht der Mediator — nicht die andere Seite.\n\n"
        "ALLPARTEILICH: Der Mediator steht auf keiner Seite — auch nicht auf "
        "der Seite dessen, der die Mediation begonnen hat.\n\n"
        "ERGEBNISOFFEN: Es gibt kein vorbestimmtes Ergebnis. Eine Lösung "
        "zählt nur, wenn beide Seiten sie tragen."
    ),
    "ablauf": (
        "So geht es auf medipact weiter:\n\n"
        "1. Sie sehen sich alles in Ruhe an — nichts davon verpflichtet Sie "
        "bereits zu etwas.\n\n"
        "2. Beide Seiten schalten das Verfahren frei. Dafür hinterlegen Sie "
        "Ihre Rechnungsdaten und übernehmen Ihren Anteil — die Kosten werden "
        "Ihnen vorher transparent angezeigt und fair zwischen den Parteien "
        "geteilt.\n\n"
        "3. Danach beginnt die eigentliche Mediation: Jede Seite schildert "
        "ihre Sicht, der Mediator führt Schritt für Schritt durch die Phasen "
        "bis zu einer gemeinsamen Vereinbarung."
    ),
    "zustimmung": (
        "Ich habe verstanden, worum es geht: Ich wurde zu einer freiwilligen, "
        "vertraulichen Mediation eingeladen. Ich sehe mir jetzt die nächsten "
        "Schritte an — eine Verpflichtung entsteht dadurch noch nicht."
    ),
}


# Weiterführende Links: Konfliktart-Seite, Ratgeber, echte Fallbeispiele.
# config.links wird vom AufklaerungClient als Link-Karten gerendert; der
# Seiten-Designer ignoriert unbekannte config-Felder tolerant.
def _mehr_links(t):
    return [
        {
            "label": "Deine Konfliktart im Überblick"
            if t != "geschaeft"
            else "Ihre Konfliktart im Überblick",
            "url": f"/konflikte/{t}",
        },
        {"label": "Ratgeber: Wissen rund um Mediation", "url": "/ratgeber"},
        {"label": "Echte Fallbeispiele lesen", "url": "/cases"},
    ]


def _blocks_for(t):
    tone = _SIE if t == "geschaeft" else _DU
    return [
        _b(
            "ga_intro", "textausgabe",
            title="Du wurdest zu einer Mediation eingeladen."
            if t != "geschaeft"
            else "Sie wurden zu einer Mediation eingeladen.",
            text=INTRO[t],
        ),
        _b(
            "ga_video", "video",
            url=PLACEHOLDER_VIDEO_URL,
            title="Was Mediation ist — kurz erklärt",
        ),
        _b(
            "ga_grundsaetze", "textausgabe",
            title="Was Mediation ist — und was nicht.",
            text=tone["grundsaetze"],
        ),
        _b(
            "ga_ablauf", "textausgabe",
            title="So geht es hier weiter.",
            text=tone["ablauf"],
        ),
        _b(
            "ga_mehr", "textausgabe",
            title="Wenn du mehr wissen willst."
            if t != "geschaeft"
            else "Wenn Sie mehr wissen wollen.",
            text=(
                "Kein Zeitdruck: Diese Seiten erklären deine Konfliktart, "
                "wie Mediation abläuft und wie andere ihren Konflikt gelöst "
                "haben."
                if t != "geschaeft"
                else "Kein Zeitdruck: Diese Seiten erklären Ihre Konfliktart, "
                "wie Mediation abläuft und wie andere ihren Konflikt gelöst "
                "haben."
            ),
            links=_mehr_links(t),
        ),
        _b("ga_verstanden", "zustimmung", text=tone["zustimmung"]),
    ]


TITLES = {
    "trennung": "Worum es hier geht",
    "erbschaft": "Worum es hier geht",
    "nachbarschaft": "Worum es hier geht",
    "geschaeft": "Worum es hier geht",
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
        sa.column("required_roles", sa.String),
        sa.column("position", sa.Integer),
        sa.column("enabled", sa.Boolean),
        sa.column("created_at", sa.DateTime),
        sa.column("updated_at", sa.DateTime),
    )


def upgrade() -> None:
    conn = op.get_bind()
    psd = _table()
    now = datetime.now(timezone.utc)

    for t in TYPES:
        exists = conn.execute(
            sa.select(psd.c.id).where(
                sa.and_(
                    psd.c.mediation_type == t,
                    psd.c.phase == "einladung",
                    psd.c.step_key == STEP_KEY,
                    psd.c.variant_key.is_(None),
                )
            )
        ).first()
        if exists:
            row = conn.execute(
                sa.select(psd.c.id, psd.c.blocks).where(psd.c.id == exists[0])
            ).first()
            blocks = _blocks_for(t)
            current = row[1] or []
            want_first = blocks[0]["id"]
            have_first = (
                current[0].get("id")
                if current and isinstance(current[0], dict)
                else None
            )
            if have_first != want_first:
                conn.execute(
                    psd.update()
                    .where(psd.c.id == exists[0])
                    .values(blocks=blocks, title=TITLES[t], updated_at=now)
                )
            continue

        conn.execute(
            psd.insert().values(
                mediation_type=t,
                phase="einladung",
                step_key=STEP_KEY,
                variant_key=None,
                title=TITLES[t],
                description=(
                    "Aufklärung der eingeladenen Partei vor der Zahlung: "
                    "Situation, Mediations-Grundsätze, Ablauf, Video."
                ),
                placeholder="",
                reflection_mode=None,
                content_types=None,
                blocks=_blocks_for(t),
                required_roles="other_party",
                # Nach start_intake (0) und den Onboarding-Schritten des
                # Antragstellers — Auswahl erfolgt ohnehin über step_key + Rolle.
                position=40,
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
                psd.c.step_key == STEP_KEY,
                psd.c.variant_key.is_(None),
            )
        )
    )
