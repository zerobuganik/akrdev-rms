#!/usr/bin/env bash
set -euo pipefail

DB_NAME="${DB_NAME:-akrdev_rms}"
DB_USER="${DB_USER:-postgres}"
DB_HOST="${DB_HOST:-localhost}"
BACKUP_DIR="${BACKUP_DIR:-./backups}"
KEEP_COUNT="${KEEP_COUNT:-7}"

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_${TIMESTAMP}.sql.gz"

mkdir -p "${BACKUP_DIR}"

echo "Backing up ${DB_NAME} to ${BACKUP_FILE}..."
pg_dump -U "${DB_USER}" -h "${DB_HOST}" "${DB_NAME}" | gzip > "${BACKUP_FILE}"

if [ $? -eq 0 ]; then
  echo "Backup completed: ${BACKUP_FILE}"
else
  echo "Backup failed!"
  exit 1
fi

BACKUP_COUNT=$(ls -1 "${BACKUP_DIR}/${DB_NAME}_"*.sql.gz 2>/dev/null | wc -l)
if [ "${BACKUP_COUNT}" -gt "${KEEP_COUNT}" ]; then
  OLD_FILES=$(ls -1t "${BACKUP_DIR}/${DB_NAME}_"*.sql.gz | tail -n +$((KEEP_COUNT + 1)))
  echo "${OLD_FILES}" | xargs rm -f
  echo "Cleaned up old backups. Keeping latest ${KEEP_COUNT}."
fi
