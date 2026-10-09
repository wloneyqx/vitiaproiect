#!/usr/bin/env bash
set -euo pipefail

APP_ROOT="/var/www/svidanie_art"
RELEASES_DIR="$APP_ROOT/releases"
SHARED_DIR="$APP_ROOT/shared"
RELEASE_ID="$(date +%Y%m%d%H%M%S)"
RELEASE_DIR="$RELEASES_DIR/$RELEASE_ID"

if [ ! -f package-lock.json ]; then
  echo "Run this script from the project root."
  exit 1
fi

npm ci
npm run typecheck
npm run lint
npm test
npm run build

sudo mkdir -p "$RELEASE_DIR" "$SHARED_DIR/customer-uploads" "$SHARED_DIR/backups"
sudo rsync -a --delete \
  --exclude node_modules \
  --exclude .next/cache \
  --exclude .env.local \
  --exclude .data \
  ./ "$RELEASE_DIR/"

sudo ln -sfn "$RELEASE_DIR" "$APP_ROOT/current"
sudo chown -R svidanie:www-data "$APP_ROOT"
sudo chmod 750 "$SHARED_DIR/customer-uploads" "$SHARED_DIR/backups"

sudo systemctl daemon-reload
sudo systemctl restart svidanie-art
sudo systemctl status svidanie-art --no-pager
