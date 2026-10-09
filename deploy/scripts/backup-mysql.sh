#!/usr/bin/env bash
set -euo pipefail

ENV_FILE="/var/www/svidanie_art/shared/.env.production"
BACKUP_DIR="/var/www/svidanie_art/shared/backups/mysql"
RETENTION_DAYS="14"

set -a
source "$ENV_FILE"
set +a

mkdir -p "$BACKUP_DIR"
chmod 700 "$BACKUP_DIR"

STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
OUT="$BACKUP_DIR/${DB_NAME}_${STAMP}.sql.gz"

MYSQL_PWD="${DB_PASSWORD:-}" mysqldump \
  --host="${DB_HOST:-127.0.0.1}" \
  --port="${DB_PORT:-3306}" \
  --user="$DB_USER" \
  --single-transaction \
  --routines \
  --triggers \
  --set-gtid-purged=OFF \
  "$DB_NAME" | gzip > "$OUT"

find "$BACKUP_DIR" -type f -name "*.sql.gz" -mtime +"$RETENTION_DAYS" -delete
echo "Saved $OUT"
