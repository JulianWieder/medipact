"""
Führt die zwei ausstehenden DB-Migrationen manuell aus.
Ausführen mit: python migrate_now.py
(aus dem backend/-Ordner, ggf. mit aktiviertem venv)
"""
import sqlite3, os, shutil

DB_PATH = os.path.join(os.path.dirname(__file__), "medipact.db")
BACKUP  = DB_PATH + ".bak"

shutil.copy2(DB_PATH, BACKUP)
print(f"Backup erstellt: {BACKUP}")

conn = sqlite3.connect(DB_PATH)
cur  = conn.cursor()

# ── Migration 1: mediation_notes Tabelle ──────────────────────────────────────
cur.execute("""
CREATE TABLE IF NOT EXISTS mediation_notes (
    id             INTEGER PRIMARY KEY,
    mediation_id   INTEGER NOT NULL REFERENCES mediations(id),
    participant_id INTEGER NOT NULL REFERENCES mediation_participants(id),
    phase          VARCHAR NOT NULL,
    content        TEXT    NOT NULL DEFAULT '',
    CONSTRAINT uq_note_participant_phase
        UNIQUE (mediation_id, participant_id, phase)
)
""")
cur.execute(
    "CREATE INDEX IF NOT EXISTS ix_mediation_notes_id ON mediation_notes (id)"
)
print("✓ Migration 1: mediation_notes Tabelle erstellt")

# ── Migration 2: phase-Spalte zu mediations ───────────────────────────────────
cur.execute("PRAGMA table_info(mediations)")
cols = [r[1] for r in cur.fetchall()]
if "phase" not in cols:
    cur.execute("ALTER TABLE mediations ADD COLUMN phase VARCHAR")
    print("✓ Migration 2: phase-Spalte hinzugefügt")
else:
    print("  Migration 2: phase-Spalte bereits vorhanden, übersprungen")

# ── Alembic-Version aktualisieren ─────────────────────────────────────────────
cur.execute("UPDATE alembic_version SET version_num = 'b2c3d4e5f6a7'")
print("✓ Alembic-Version → b2c3d4e5f6a7")

conn.commit()
conn.close()
print("\nFertig. Backend neu starten!")
