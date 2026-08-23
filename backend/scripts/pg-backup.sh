#!/bin/bash
#
# Tägliche Postgres-Backups aller Projekte auf diesem Server.
#
# Warum diese Datei im medipact-Repo liegt, obwohl sie auch pontai-finance
# sichert: sie muss irgendwo versioniert sein, und medipact ist das Repo, das
# ohnehin per deploy.sh auf den Server gezogen wird. Kommt ein weiteres Projekt
# dazu (z.B. mandexis), einfach unten in PROJECTS ergänzen.
#
# Einrichtung auf dem Server (einmalig) — woechentlich, montags 3:17 Uhr:
#   crontab -e
#   17 3 * * 1 bash $HOME/medipact/backend/scripts/pg-backup.sh >> $HOME/backups/backup.log 2>&1
#
# Woechentlich ist bewusst der Einstieg, solange es keine Kundendaten gibt.
# Sobald echte Nutzer darauf arbeiten, gehoert das auf taeglich umgestellt:
# der moegliche Datenverlust betraegt sonst im schlimmsten Fall eine Woche.
# Dafuer im Cron-Eintrag "* * 1" wieder durch "* * *" ersetzen.
#
# Wiederherstellen eines Dumps:
#   gunzip -c ~/backups/postgres/medipact_2026-08-23_0317.sql.gz \
#     | docker exec -i medipact-db psql -U medipact -d medipact
#
set -euo pipefail

BACKUP_DIR="$HOME/backups/postgres"

# 90 Tage, nicht 14: Bei woechentlichem Lauf waeren 14 Tage nur zwei
# Sicherungen — zu wenig, um auf einen Fehler zurueckzugehen, der erst
# spaeter auffaellt. 90 Tage ergeben rund 13 Staende. Die Dumps sind klein,
# der Platzbedarf faellt neben den Docker-Images nicht ins Gewicht.
KEEP_DAYS=90

# Format je Zeile: Container-Name | DB-Benutzer | DB-Name
PROJECTS=(
  "medipact-db|medipact|medipact"
  "pontai-db|pontai|pontai"
)

mkdir -p "$BACKUP_DIR"
STAMP=$(date +%Y-%m-%d_%H%M)

for entry in "${PROJECTS[@]}"; do
  IFS='|' read -r container user db <<< "$entry"

  # Ein nicht laufender Container ist kein Grund, die anderen Backups
  # ausfallen zu lassen — nur vermerken und weitermachen.
  if ! docker ps --format '{{.Names}}' | grep -qx "$container"; then
    echo "[$STAMP] WARN: Container $container laeuft nicht - uebersprungen." >&2
    continue
  fi

  out="$BACKUP_DIR/${db}_${STAMP}.sql.gz"

  # pipefail sorgt dafuer, dass ein Fehler in pg_dump nicht von gzip
  # verschluckt wird — sonst laege hier eine gueltig aussehende, aber leere
  # Datei, und das faellt erst beim Wiederherstellen auf.
  if docker exec "$container" pg_dump -U "$user" -d "$db" | gzip > "$out"; then
    echo "[$STAMP] OK: $out ($(du -h "$out" | cut -f1))"
  else
    echo "[$STAMP] FEHLER beim Dump von $db - unvollstaendige Datei entfernt." >&2
    rm -f "$out"
  fi
done

# Aufraeumen: alles aelter als KEEP_DAYS Tage loeschen.
find "$BACKUP_DIR" -name "*.sql.gz" -type f -mtime +"$KEEP_DAYS" -delete

echo "[$STAMP] Fertig. Belegt: $(du -sh "$BACKUP_DIR" | cut -f1) in $BACKUP_DIR"
