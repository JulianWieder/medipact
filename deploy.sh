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

# Nur ein Build gleichzeitig auf dem VPS: parallel laufende Builds (z.B.
# medenmanager) teilen sich den Speicher, einer wird vom OOM-Killer beendet.
# Wirkt nur, wenn die anderen deploy-Skripte dieselbe Lock-Datei nutzen.
exec 9>/tmp/vps-build.lock
echo "==> Warte auf Build-Lock..."
flock 9

# In .next-build bauen, nicht in .next: der laufende Server liefert waehrend
# des Builds weiter aus .next aus. Scheitert der Build (04.11.2026: "Killed"
# durch OOM, .next blieb leer, Seite ohne CSS/JS), bleibt alles wie es war.
echo "==> Frontend bauen (nach .next-build)..."
rm -rf .next-build
# tsconfig schliesst .next/types ein: die Typen des alten Builds wuerden mit
# geprueft und den Build abbrechen, sobald eine Route entfernt wurde. Der
# laufende Server braucht sie nicht.
rm -rf .next/types
# Build-Cache und optimierte Bilder vom letzten Build mitnehmen.
if [ -d .next/cache ]; then
  mkdir -p .next-build && cp -a .next/cache .next-build/cache
fi
if ! NEXT_DIST_DIR=.next-build npm run build; then
  echo "!! Build fehlgeschlagen - die laufende Seite bleibt unveraendert."
  rm -rf .next-build
  exit 1
fi

# Umschalten: alter Build bleibt als .next-alt fuer einen Rueckweg liegen
# (rm -rf .next && mv .next-alt .next && pm2 restart medipact).
rm -rf .next-alt
if [ -d .next ]; then mv .next .next-alt; fi
mv .next-build .next
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
