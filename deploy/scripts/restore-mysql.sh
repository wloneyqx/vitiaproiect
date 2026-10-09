#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -ne 1 ]; then
  echo "Usage: restore-mysql.sh /path/to/backup.sql.gz"
  exit 1
fi

ENV_FILE="/var/www/svidanie_art/shared/.env.production"
BACKUP_FILE="$1"

set -a
source "$ENV_FILE"
set +a

echo "This restores into database: $DB_NAME"
echo "Press Ctrl+C now if this is production and you have not taken a fresh backup."
sleep 10

gunzip -c "$BACKUP_FILE" | MYSQL_PWD="${DB_PASSWORD:-}" mysql \
  --host="${DB_HOST:-127.0.0.1}" \
  --port="${DB_PORT:-3306}" \
  --user="$DB_USER" \
  "$DB_NAME"
