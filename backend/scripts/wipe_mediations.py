#!/usr/bin/env python3
"""Loescht ALLE Mediationsfaelle inkl. aller abhaengigen Daten aus der DB.

UNWIDERRUFLICH. Legt vorher automatisch ein Backup der SQLite-Datei an.

Behalten werden: users, phase_step_defaults, mediation_variants (also die
Workflow-Konfiguration und Nutzerkonten). Geleert werden alle fall-bezogenen
Tabellen.

Nutzung im laufenden Container (DB unter /data/medipact.db):

    # 1) Nur anzeigen, wie viele Faelle betroffen waeren (aendert NICHTS):
    docker exec -i medipact-api python3 - < backend/scripts/wipe_mediations.py

    # 2) Wirklich loeschen (Backup wird automatisch erstellt):
    docker exec -i medipact-api env MEDIPACT_CONFIRM=DELETE \
        python3 - < backend/scripts/wipe_mediations.py

DB-Pfad ueberschreibbar via Umgebungsvariable DB_PATH.
"""
import datetime
import os
import shutil
import sqlite3
import sys

DB_PATH = os.environ.get("DB_PATH", "/data/medipact.db")

# Kind-zuerst-Reihenfolge (Foreign Keys). Alle Tabellen sind fall-bezogen und
# werden komplett geleert. users / phase_step_defaults / mediation_variants
# bleiben absichtlich unberuehrt.
TABLES = [
    "note_reactions",
    "invoices",
    "mediation_feedback",
    "mediation_notes",
    "mediation_appointment_slots",
    "mediation_contracts",
    "mediation_custom_steps",
    "mediation_step_rules",
    "mediation_invites",
    "mediation_participants",
    "mediations",
]


def count(cur, table):
    try:
        return cur.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]
    except sqlite3.OperationalError:
        return None  # Tabelle existiert nicht


def main():
    if not os.path.exists(DB_PATH):
        sys.exit(f"DB nicht gefunden: {DB_PATH} (ggf. DB_PATH setzen)")

    con = sqlite3.connect(DB_PATH)
    cur = con.cursor()

    print(f"DB: {DB_PATH}")
    print("Aktuelle Zeilen pro Tabelle:")
    for t in TABLES:
        c = count(cur, t)
        print(f"  {t:32} {c if c is not None else '— (Tabelle fehlt)'}")

    n_cases = count(cur, "mediations") or 0

    if os.environ.get("MEDIPACT_CONFIRM") != "DELETE":
        print(
            f"\n{n_cases} Fall/Faelle wuerden geloescht (inkl. aller abhaengigen "
            f"Daten). Es wurde NICHTS veraendert.\nZum Ausfuehren erneut mit "
            f"MEDIPACT_CONFIRM=DELETE starten."
        )
        con.close()
        return

    # Backup der kompletten DB-Datei
    ts = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
    backup = f"{DB_PATH}.backup-{ts}"
    shutil.copy2(DB_PATH, backup)
    print(f"\nBackup erstellt: {backup}")

    cur.execute("PRAGMA foreign_keys=OFF")
    try:
        cur.execute("BEGIN")
        for t in TABLES:
            if count(cur, t) is None:
                continue
            cur.execute(f"DELETE FROM {t}")
            # AUTOINCREMENT-Zaehler zuruecksetzen, falls vorhanden
            try:
                cur.execute("DELETE FROM sqlite_sequence WHERE name = ?", (t,))
            except sqlite3.OperationalError:
                pass
        con.commit()
    except Exception as exc:  # noqa: BLE001
        con.rollback()
        con.close()
        sys.exit(f"FEHLER — Rollback ausgefuehrt: {exc}\nBackup unter {backup}")

    print("\nGeloescht. Neue Zeilenzahlen:")
    for t in TABLES:
        c = count(cur, t)
        print(f"  {t:32} {c if c is not None else '— (Tabelle fehlt)'}")
    con.close()
    print(f"\nFertig. Backup liegt bei {backup} (bei Bedarf zurueckspielen).")


if __name__ == "__main__":
    main()
