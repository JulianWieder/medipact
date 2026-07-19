"""ODR-Umbau: "geschaeft" -> "odr" + neue Verfahrenstypen der ODR-Familie.

Die Business-Mediation (bisher Typ "geschaeft" / "Wirtschaftsmediation") wird
zu Online Dispute Resolution (ODR) umbenannt. Darauf bauen drei weitere
Verfahrenstypen auf (Preis-Logik in app/pricing.py, ODR_TYPES):

  * "schlichtung" – Online-Schlichtung: Nach Anhoerung beider Seiten erarbeitet
    die neutrale Stelle (KI-gestuetzt, Mediator prueft) einen konkreten
    Loesungsvorschlag (Schlichterspruch), den die Parteien annehmen oder
    ablehnen koennen.
  * "ecommerce"   – E-Commerce-/Plattform-Streit: Konflikte aus Online-Kaeufen,
    Plattform- und Kundenbeziehungen (B2C).
  * "b2b"         – B2B-Vertragsstreit: Vertrags-/Zahlungsstreitigkeiten
    zwischen Unternehmen.

Zusaetzlicher Baustein (kein eigener Typ, laeuft ueber das Firmen-Abo):
Digitalisierte Massen-ODR – bei sehr grossen Fallzahlen (Fluggastrechte,
Mietpreisbremse, E-Commerce) legen Firmenkunden viele gleichartige Faelle im
Abo an; alle vier ODR-Typen sind fuer Organisationen freigegeben.

Diese Migration:
  1. benennt den Typ um: mediations, phase_step_defaults, mediation_variants
     (UPDATE ... WHERE mediation_type='geschaeft' -> idempotent),
  2. seedet die Workflows der neuen Typen als Kopie der ODR-Workflows mit
     typgerechten Textersetzungen (Basis; Feinschliff im WorkflowManager).

Idempotent: Seeds nur, wenn der Zieltyp noch keine phase_step_defaults-Zeilen
hat (manuelle Pflege wird nie ueberschrieben).

Revision ID: v4w5x6y7z8a9
Revises: u3v4w5x6y7z8
Create Date: 2026-07-19
"""
import json

import sqlalchemy as sa
from alembic import op

revision = "v4w5x6y7z8a9"
down_revision = "u3v4w5x6y7z8"
branch_labels = None
depends_on = None

OLD_TYPE = "geschaeft"
SOURCE_TYPE = "odr"

TYPE_TABLES = ("mediations", "phase_step_defaults", "mediation_variants")

# Reihenfolge wichtig: laengste Muster zuerst.
REPLACEMENTS = {
    "schlichtung": [
        ("Wirtschaftsmediation", "Online-Schlichtung"),
        ("Business-Mediation", "Online-Schlichtung"),
        ("Geschäftskonflikt", "Schlichtungsfall"),
        ("Geschäftsstreitigkeiten", "Streitigkeiten im Schlichtungsverfahren"),
        ("Geschäftsstreit", "Schlichtungsfall"),
        ("Geschäftsbeziehung", "Vertragsbeziehung"),
        ("Geschäftspartnerinnen", "Streitparteien"),
        ("Geschäftspartner", "Streitparteien"),
        ("Mediationsverfahren", "Schlichtungsverfahren"),
        ("Mediation", "Online-Schlichtung"),
    ],
    "ecommerce": [
        ("Wirtschaftsmediation", "E-Commerce-Streitbeilegung"),
        ("Business-Mediation", "E-Commerce-Streitbeilegung"),
        ("Geschäftskonflikt", "E-Commerce-Konflikt"),
        ("Geschäftsstreitigkeiten", "Streitigkeiten aus Online-Käufen"),
        ("Geschäftsstreit", "E-Commerce-Streit"),
        ("Geschäftsbeziehung", "Kundenbeziehung"),
        ("Geschäftspartnerinnen", "Vertragsparteien"),
        ("Geschäftspartner", "Vertragsparteien"),
    ],
    "b2b": [
        ("Wirtschaftsmediation", "B2B-Streitbeilegung"),
        ("Business-Mediation", "B2B-Streitbeilegung"),
        ("Geschäftskonflikt", "B2B-Vertragsstreit"),
        ("Geschäftsstreitigkeiten", "B2B-Vertragsstreitigkeiten"),
        ("Geschäftsstreit", "B2B-Vertragsstreit"),
        ("Geschäftsbeziehung", "Geschäftsbeziehung zwischen Unternehmen"),
    ],
}


def _adapt(value, pairs):
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


def _rename_type(bind, inspector, old, new):
    for table_name in TYPE_TABLES:
        if not inspector.has_table(table_name):
            continue
        t = sa.Table(table_name, sa.MetaData(), autoload_with=bind)
        if "mediation_type" not in t.c:
            continue
        bind.execute(
            t.update().where(t.c.mediation_type == old).values(mediation_type=new)
        )


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    # 1) Umbenennung geschaeft -> odr (idempotent)
    _rename_type(bind, inspector, OLD_TYPE, SOURCE_TYPE)

    # 2) Seeds fuer schlichtung/ecommerce/b2b (Kopie von odr)
    if inspector.has_table("phase_step_defaults"):
        psd = sa.Table("phase_step_defaults", sa.MetaData(), autoload_with=bind)
        for target_type, pairs in REPLACEMENTS.items():
            existing = bind.execute(
                sa.select(sa.func.count())
                .select_from(psd)
                .where(psd.c.mediation_type == target_type)
            ).scalar()
            if existing:
                continue  # Typ bereits gepflegt -> nichts ueberschreiben
            _copy_rows(bind, "phase_step_defaults", target_type, pairs)
            if inspector.has_table("mediation_variants"):
                mv = sa.Table("mediation_variants", sa.MetaData(), autoload_with=bind)
                existing_var = bind.execute(
                    sa.select(sa.func.count())
                    .select_from(mv)
                    .where(mv.c.mediation_type == target_type)
                ).scalar()
                if not existing_var:
                    _copy_rows(bind, "mediation_variants", target_type, pairs)


def downgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    for table_name in ("phase_step_defaults", "mediation_variants"):
        if inspector.has_table(table_name):
            t = sa.Table(table_name, sa.MetaData(), autoload_with=bind)
            bind.execute(
                t.delete().where(t.c.mediation_type.in_(list(REPLACEMENTS.keys())))
            )
    _rename_type(bind, inspector, SOURCE_TYPE, OLD_TYPE)
