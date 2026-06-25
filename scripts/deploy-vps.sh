#!/usr/bin/env bash
set -euo pipefail

echo "=== AKRDev RMS VPS Deployment ==="

# Variables
APP_DIR="/opt/akrdev-rms"
BACKUP_DIR="/var/backups/akrdev-rms"
NODE_ENV="production"

# Create directories
mkdir -p "${APP_DIR}" "${BACKUP_DIR}"

# Copy built files
echo "Copying API files..."
cp -r apps/api/dist "${APP_DIR}/api"
cp apps/api/package.json "${APP_DIR}/api/"
cp apps/api/prisma.config.ts "${APP_DIR}/api/"
cp -r apps/api/prisma "${APP_DIR}/api/prisma"
cp pnpm-lock.yaml "${APP_DIR}/"
cp pnpm-workspace.yaml "${APP_DIR}/"
cp package.json "${APP_DIR}/"

# Copy Captain App PWA files
echo "Copying Captain App PWA files..."
cp -r apps/captain/dist "${APP_DIR}/captain-pwa"

# Install production dependencies
cd "${APP_DIR}"
pnpm install --prod --frozen-lockfile

# Run database migrations
echo "Running database migrations..."
cd "${APP_DIR}/api"
npx prisma migrate deploy

# Run seed
npx prisma db seed

# Setup PM2
echo "Setting up PM2..."
pm2 delete akrdev-api 2>/dev/null || true
pm2 start dist/index.js --name akrdev-api --time

# Setup Nginx
echo "Configuring Nginx..."
cat > /etc/nginx/sites-available/akrdev-rms << 'NGINX'
server {
    listen 80;
    server_name _;

    root /opt/akrdev-rms/captain-pwa;
    index index.html;

    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /socket.io/ {
        proxy_pass http://localhost:3000/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
NGINX

ln -sf /etc/nginx/sites-available/akrdev-rms /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# Setup PostgreSQL backup cron
echo "Setting up PostgreSQL backup..."
cat > /etc/cron.daily/akrdev-backup << 'CRON'
#!/bin/bash
BACKUP_DIR="/var/backups/akrdev-rms"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
pg_dump -U postgres akrdev_rms | gzip > "${BACKUP_DIR}/akrdev_rms_${TIMESTAMP}.sql.gz"
find "${BACKUP_DIR}" -name "*.sql.gz" -mtime +7 -delete
CRON
chmod +x /etc/cron.daily/akrdev-backup

# Setup SSL via Certbot
echo "Setting up SSL (if domain configured)..."
if command -v certbot &> /dev/null; then
    certbot --nginx -d "${DOMAIN:-}" --non-interactive --agree-tos --email "${EMAIL:-admin@example.com}" || true
fi

echo "=== Deployment complete ==="
pm2 save
pm2 startup
