#!/bin/bash
set -e

cd ~/medipact

echo "==> Git pull..."
git checkout -- package-lock.json 2>/dev/null || true
git stash
git pull
git stash pop 2>/dev/null || true

echo "==> Dependencies..."
npm ci

echo "==> Frontend bauen..."
npm run build
pm2 restart medipact --update-env

# Seit dem Umzug des Nutzerbereichs nach kerno (app.medipact.de) sind
# medipact-api und medipact-db stillgelegt. Ein "docker compose up" hier
# wuerde sie wieder starten - und Daten in eine Datenbank schreiben lassen,
# die niemand mehr liest. Die Marke setzt das Runbook beim Umschalten
# (mandexis-Repo, docs/runbook-medipact-cutover.md); Rueckweg: Datei loeschen.
if [ -f ~/medipact/backend/STILLGELEGT ]; then
  echo "==> Backend uebersprungen: ~/medipact/backend/STILLGELEGT existiert"
else
  echo "==> Backend (Docker) bauen..."
  cd ~/medipact/backend
  docker compose up -d --build

  echo "==> Datenbank-Migrationen..."
  sleep 2
  docker exec medipact-api alembic upgrade heads
fi

echo "==> Fertig!"
