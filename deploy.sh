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

echo "==> Backend (Docker) bauen..."
cd ~/medipact/backend
docker compose up -d --build

echo "==> Datenbank-Migrationen..."
sleep 2
docker exec medipact-api alembic upgrade heads

echo "==> Fertig!"
