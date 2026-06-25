#!/usr/bin/env bash
# Health check monitoring script — run via cron every 5 minutes
# Cron: */5 * * * * /opt/akrdev-rms/scripts/health-check.sh

API_URL="${HEALTH_CHECK_URL:-http://localhost:3000/api/v1/health}"
ALERT_WEBHOOK="${ALERT_WEBHOOK:-}"

response=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "${API_URL}")

if [ "${response}" != "200" ]; then
    echo "[$(date)] Health check FAILED: HTTP ${response}" >> /var/log/akrdev-health.log

    if [ -n "${ALERT_WEBHOOK}" ]; then
        curl -s -X POST "${ALERT_WEBHOOK}" \
            -H "Content-Type: application/json" \
            -d "{\"text\": \"AKRDev RMS API is DOWN (HTTP ${response})\"}"
    fi
else
    echo "[$(date)] Health check OK" >> /var/log/akrdev-health.log
fi
