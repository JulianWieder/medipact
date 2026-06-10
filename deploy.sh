#!/bin/bash
set -e

cd ~/medipact

echo "==> Git pull..."
git stash
git pull
git stash pop 2>/dev/null || true

echo "==> Frontend bauen..."
npm run build
pm2 restart medipact --update-env

echo "==> Backend (Docker) bauen..."
cd ~/medipact/backend
docker build -t backend-api .
docker restart medipact-api

echo "==> Fertig!"
