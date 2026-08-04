"""Seed: die Schritte des Nutzer-Onboardings (Pseudo-Typ "@user").

Legt vier Schritte in phase_step_defaults an, mediation_type = "@user",
phase = "onboarding". Ab dann sind sie im Workflow Manager im Reiter
"Nutzer-Onboarding" frei editierbar — Titel, Texte, Reihenfolge, zusaetzliche
Bloecke. Der Seed ist bewusst nur der Startpunkt, keine feste Verdrahtung.

Warum "@user" und nicht "*": "*" bedeutet "gilt in JEDEM Mediationstyp" und
wuerde die Schritte in jeden Fall spuelen. "@user" taucht in keiner
Fall-Aufloesung auf (die filtert immer auf [mediation_type, "*"]) und ist
damit garantiert fallfrei. Siehe models/phase_step_default.py.

Inhaltlicher Ursprung der vier Schritte:
  profil          – neu; gab es vorher nirgends
  rechnungsdaten  – aus MediationClient.tsx Schritt 2 (lag pro Fall am
                    Teilnehmer, jetzt einmal an der Person)
  so_funktioniert – aus dem "Gut zu wissen"-Kasten der Fall-Seite und der
                    Aufklaerung der Gegenseite (/dashboard/[id]/intro)
  bestaetigung    – die Zustimmung, die vorher implizit im Verfahren steckte

Die Bloecke "stammdaten" und "rechnungsdaten" sind neue Blocktypen (siehe
app/workspace/blockTypes.ts). Ihre Werte werden serverseitig zusaetzlich in
die users-Spalten gespiegelt, damit Rechnungen und Fall-Vorbefuellung sie
lesen koennen, ohne das Onboarding zu kennen.

Revision ID: e0f1a2b3c4d5
Revises: d9e0f1a2b3c4
Create Date: 2026-08-04
"""
from datetime import datetime, timezone

import sqlalchemy as sa
from alembic import op

revision = "e0f1a2b3c4d5"
down_revision = "d9e0f1a2b3c4"
branch_labels = None
depends_on = None

USER_TYPE = "@user"
PHASE = "onboarding"

# (step_key, title, description, position, blocks)
STEPS = [
    (
        "profil",
        "Wer bist du?",
        "Damit deine Gegenseite und dein Mediator wissen, mit wem sie es zu tun "
        "haben – und damit wir dich erreichen können.",
        10,
        [
            {
                "id": "ob_stammdaten",
                "type": "stammdaten",
                "config": {
                    "title": "Deine Angaben",
                    "description": "Dein Name erscheint für alle Beteiligten deiner Verfahren.",
                    "required": True,
                },
                "visible_if": None,
            },
            {
                "id": "ob_rolle",
                "type": "auswahl",
                "config": {
                    "prompt": "In welcher Rolle nutzt du medipact?",
                    "options": [
                        "Ich stecke selbst in einem Konflikt",
                        "Ich wurde zu einem Verfahren eingeladen",
                        "Ich bin Mediator:in",
                        "Ich vertrete ein Unternehmen",
                    ],
                    "multi": False,
                    "required": True,
                },
                "visible_if": None,
            },
        ],
    ),
    (
        "rechnungsdaten",
        "Rechnungsdaten",
        "Für die Rechnung über deinen Anteil. Es wird hier nichts abgebucht – "
        "bezahlt wird erst im Verfahren selbst.",
        20,
        [
            {
                "id": "ob_rechnung",
                "type": "rechnungsdaten",
                "config": {
                    "title": "Rechnungsanschrift",
                    "description": (
                        "Sobald deine Zahlung in einem Verfahren eingeht, wird "
                        "automatisch eine Rechnung über deinen Anteil erstellt "
                        "und steht als PDF bereit. In einzelnen Fällen kannst du "
                        "später eine abweichende Anschrift hinterlegen."
                    ),
                    "required": True,
                },
                "visible_if": None,
            },
        ],
    ),
    (
        "so_funktioniert",
        "So läuft eine Mediation ab",
        "Einmal lesen – danach begegnet dir das in keinem Verfahren mehr.",
        30,
        [
            {
                "id": "ob_ablauf",
                "type": "textausgabe",
                "config": {
                    "text": (
                        "Ihr durchlauft gemeinsam fünf Phasen: Einleitung, "
                        "Themensammlung, Interessen, Optionen und Abschluss"
                        "vereinbarung. Euer Mediator begleitet jeden Schritt.\n\n"
                        "Eine Mediation ist freiwillig. Jede Seite kann sie "
                        "jederzeit beenden – niemand wird zu einer Einigung "
                        "gedrängt."
                    )
                },
                "visible_if": None,
            },
            {
                "id": "ob_kosten",
                "type": "akkordeon",
                "config": {
                    "title": "Was kostet das, und wann?",
                    "text": (
                        "Die Kosten werden fair geteilt: jede Partei trägt ihren "
                        "eigenen Anteil. Bezahlt wird im Verfahren selbst, im "
                        "Schritt „Verfahren freischalten\". Der Betrag wird "
                        "zunächst nur reserviert und erst abgebucht, wenn der "
                        "Fall tatsächlich freigeschaltet ist."
                    ),
                },
                "visible_if": None,
            },
            {
                "id": "ob_vertraulich",
                "type": "akkordeon",
                "config": {
                    "title": "Wer sieht meine Eingaben?",
                    "text": (
                        "Alle Inhalte eines Verfahrens sind nur für die "
                        "Beteiligten und den Mediator sichtbar. Einzelne "
                        "Schritte sind ausdrücklich als vertraulich "
                        "gekennzeichnet – was du dort schreibst, sieht "
                        "ausschließlich der Mediator, nicht die Gegenseite."
                    ),
                },
                "visible_if": None,
            },
        ],
    ),
    (
        "bestaetigung",
        "Kurz bestätigen",
        "Damit alle vom selben Rahmen ausgehen.",
        40,
        [
            {
                "id": "ob_ok_freiwillig",
                "type": "zustimmung",
                "config": {
                    "text": (
                        "Ich habe verstanden, dass eine Mediation freiwillig ist "
                        "und keine Seite zu einer Einigung verpflichtet ist."
                    ),
                    "required": True,
                },
                "visible_if": None,
            },
            {
                "id": "ob_ok_vertraulich",
                "type": "zustimmung",
                "config": {
                    "text": (
                        "Ich behandle vertraulich, was ich im Verfahren erfahre."
                    ),
                    "required": True,
                },
                "visible_if": None,
            },
        ],
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
        sa.column("required_roles", sa.String),
        sa.column("gate_mode", sa.String),
        sa.column("position", sa.Integer),
        sa.column("enabled", sa.Boolean),
        sa.column("created_at", sa.DateTime),
        sa.column("updated_at", sa.DateTime),
    )


def upgrade() -> None:
    conn = op.get_bind()
    psd = _table()
    now = datetime.now(timezone.utc)

    for step_key, title, description, position, blocks in STEPS:
        exists = conn.execute(
            sa.select(psd.c.id).where(
                sa.and_(
                    psd.c.mediation_type == USER_TYPE,
                    psd.c.phase == PHASE,
                    psd.c.step_key == step_key,
                    psd.c.variant_key.is_(None),
                )
            )
        ).first()
        # Idempotent: bereits vorhandene Schritte werden NICHT ueberschrieben.
        # Wer die Texte im Workflow Manager angepasst hat, soll sie beim
        # naechsten Deploy nicht zurueckgesetzt bekommen.
        if exists:
            continue

        conn.execute(
            psd.insert().values(
                mediation_type=USER_TYPE,
                phase=PHASE,
                step_key=step_key,
                variant_key=None,
                title=title,
                description=description,
                placeholder="",
                reflection_mode=None,
                content_types=None,
                blocks=blocks,
                # Das Onboarding hat nur einen Teilnehmer — Rollenfilter und
                # Fortschritts-Sperre (gate_mode) sind hier bedeutungslos.
                required_roles=None,
                gate_mode=None,
                position=position,
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
                psd.c.mediation_type == USER_TYPE,
                psd.c.phase == PHASE,
            )
        )
    )
