"""Einstiegs-Tarif: Add-on-Tabelle + neue Konflikttypen "wg" und "verbraucher".

Strategie "Trichter": niedrigschwellige Konflikttypen (Nachbarschaft, WG/
Mitbewohner, Verbraucher/Handwerker) kosten 20 EUR pro Partei (app/pricing.py);
Umsatz entsteht ueber buchbare Add-ons (Videositzung, gepruefte Abschluss-
vereinbarung, Express). Premium-Typen (Trennung/Erbschaft/Geschaeft) bleiben
unveraendert.

Diese Migration:
  1. legt die Tabelle ``mediation_addons`` an (Add-on-Auswahl je Partei,
     Preis-Schnappschuss; siehe models/mediation_addon.py),
  2. seedet die Workflows der neuen Typen ``wg`` und ``verbraucher`` als Kopie
     der Nachbarschafts-Workflows (phase_step_defaults inkl. Blocks/Varianten-
     Schritte sowie mediation_variants), mit typgerechten Textersetzungen.
     Die Texte sind bewusst nur eine Basis — Feinschliff erfolgt im
     WorkflowManager (dort pflegbar, kein Code noetig).

Idempotent: Tabelle nur bei Fehlen anlegen; Seeds nur, wenn der Zieltyp noch
keine phase_step_defaults-Zeilen hat (manuelle Pflege wird nie ueberschrieben).

Revision ID: u3v4w5x6y7z8
Revises: t2u3v4w5x6y7
Create Date: 2026-07-18
"""
import json
from datetime import datetime, timezone

import sqlalchemy as sa
from alembic import op

revision = "u3v4w5x6y7z8"
down_revision = "t2u3v4w5x6y7"
branch_labels = None
depends_on = None

SOURCE_TYPE = "nachbarschaft"

# Reihenfolge wichtig: laengste Muster zuerst, damit z.B. "Nachbarschaftsrecht"
# nicht erst durch das generische "Nachbarschaft" zerstoert wird.
REPLACEMENTS = {
    "wg": [
        ("Nachbarschaftskonflikt", "WG-Konflikt"),
        ("Nachbarschaftsstreitigkeiten", "WG-Streitigkeiten"),
        ("Nachbarschaftsstreit", "WG-Streit"),
        ("Nachbarschaftsverhältnis", "WG-Zusammenleben"),
        ("Nachbarschaftsrecht", "Mietrecht und WG-Absprachen"),
        ("Nachbarschaftsmediation", "WG-Mediation"),
        ("Nachbarschaft", "WG"),
        ("Nachbarinnen", "Mitbewohnerinnen"),
        ("Nachbarin", "Mitbewohnerin"),
        ("Nachbarn", "Mitbewohner"),
        ("Nachbar", "Mitbewohner"),
    ],
    "verbraucher": [
        ("Nachbarschaftskonflikt", "Konflikt mit dem Vertragspartner"),
        ("Nachbarschaftsstreitigkeiten", "Verbraucherstreitigkeiten"),
        ("Nachbarschaftsstreit", "Verbraucherstreit"),
        ("Nachbarschaftsverhältnis", "Vertragsverhältnis"),
        ("Nachbarschaftsrecht", "Vertrags- und Gewährleistungsrecht"),
        ("Nachbarschaftsmediation", "Verbraucher-Mediation"),
        ("Nachbarschaft", "Geschäftsbeziehung"),
        ("Nachbarinnen", "Vertragspartner"),
        ("Nachbarin", "Vertragspartnerin"),
        ("Nachbarn", "Vertragspartnern"),
        ("Nachbar", "Vertragspartner"),
    ],
}


def _adapt(value, pairs):
    """Textersetzungen auf Strings und (rekursiv) auf JSON-faehigen Strukturen."""
    if isinstance(value, str):
        for old, new in pairs:
            value = value.replace(old, new)
        return value
    if isinstance(value, (dict, list)):
        s = json.dumps(value, ensure_ascii=False)
        for old, new in pairs:
            s = s.replace(old, new)
        return json.loads(s)
    return value


def _copy_rows(bind, table_name, target_type, pairs):
    meta = sa.MetaData()
    table = sa.Table(table_name, meta, autoload_with=bind)
    cols = [c.name for c in table.columns if c.name != "id"]

    rows = bind.execute(
        sa.select(table).where(table.c.mediation_type == SOURCE_TYPE)
    ).mappings().all()

    for row in rows:
        data = {}
        for col in cols:
            val = row[col]
            if col == "mediation_type":
                data[col] = target_type
            else:
                data[col] = _adapt(val, pairs)
        bind.execute(table.insert().values(**data))
    return len(rows)


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    # 1) Add-on-Tabelle
    if not inspector.has_table("mediation_addons"):
        op.create_table(
            "mediation_addons",
            sa.Column("id", sa.Integer(), primary_key=True, index=True),
            sa.Column("mediation_id", sa.Integer(), sa.ForeignKey("mediations.id"), nullable=False, index=True),
            sa.Column("participant_id", sa.Integer(), sa.ForeignKey("mediation_participants.id"), nullable=False, index=True),
            sa.Column("addon_key", sa.String(), nullable=False),
            sa.Column("price_eur", sa.Float(), nullable=False, server_default="0"),
            sa.Column("created_at", sa.DateTime(), nullable=False, default=lambda: datetime.now(timezone.utc)),
            sa.UniqueConstraint("mediation_id", "participant_id", "addon_key", name="uq_mediation_addon_party"),
        )

    # 2) Workflow-Seeds fuer wg + verbraucher (Kopie von nachbarschaft)
    meta = sa.MetaData()
    psd = sa.Table("phase_step_defaults", meta, autoload_with=bind)
    for target_type, pairs in REPLACEMENTS.items():
        existing = bind.execute(
            sa.select(sa.func.count()).select_from(psd).where(psd.c.mediation_type == target_type)
        ).scalar()
        if existing:
            continue  # Typ bereits gepflegt -> nichts ueberschreiben
        _copy_rows(bind, "phase_step_defaults", target_type, pairs)
        if inspector.has_table("mediation_variants"):
            mv = sa.Table("mediation_variants", sa.MetaData(), autoload_with=bind)
            existing_var = bind.execute(
                sa.select(sa.func.count()).select_from(mv).where(mv.c.mediation_type == target_type)
            ).scalar()
            if not existing_var:
                _copy_rows(bind, "mediation_variants", target_type, pairs)


def downgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    for table_name in ("phase_step_defaults", "mediation_variants"):
        if inspector.has_table(table_name):
            t = sa.Table(table_name, sa.MetaData(), autoload_with=bind)
            bind.execute(t.delete().where(t.c.mediation_type.in_(list(REPLACEMENTS.keys()))))
    if inspector.has_table("mediation_addons"):
        op.drop_table("mediation_addons")
