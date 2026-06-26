#!/usr/bin/env bash
set -euo pipefail

echo "=== AKRDev RMS VPS Deployment ==="

# Variables
APP_DIR="/opt/akrdev-rms"
BACKUP_DIR="/var/backups/akrdev-rms"
NODE_ENV="production"

# Validate pre-built artifacts
if [ ! -d "apps/api/dist" ]; then
    echo "ERROR: apps/api/dist does not exist. Run: pnpm --filter @akrdev/api build"
    exit 1
fi
if [ ! -d "apps/captain/dist" ]; then
    echo "ERROR: apps/captain/dist does not exist. Run: pnpm --filter @akrdev/captain build"
    exit 1
fi

# Create directories
mkdir -p "${APP_DIR}" "${BACKUP_DIR}"

# Copy built files — bundle workspace packages so pnpm can resolve them
echo "Copying API files..."
mkdir -p "${APP_DIR}/api"
cp -r apps/api/dist "${APP_DIR}/api/dist"
cp apps/api/package.json "${APP_DIR}/api/"
cp apps/api/prisma.config.ts "${APP_DIR}/api/"
cp -r apps/api/prisma "${APP_DIR}/api/prisma"

# Copy workspace packages for resolution
mkdir -p "${APP_DIR}/packages/types"
mkdir -p "${APP_DIR}/packages/shared"
mkdir -p "${APP_DIR}/packages/schemas"
for pkg in types shared schemas; do
    cp packages/${pkg}/package.json "${APP_DIR}/packages/${pkg}/"
    if [ -d "packages/${pkg}/dist" ]; then
        cp -r packages/${pkg}/dist "${APP_DIR}/packages/${pkg}/dist"
    fi
done

cp pnpm-lock.yaml "${APP_DIR}/"
cp pnpm-workspace.yaml "${APP_DIR}/"
cp package.json "${APP_DIR}/"

# Copy Captain App PWA files
echo "Copying Captain App PWA files..."
mkdir -p "${APP_DIR}/captain-pwa"
cp -r apps/captain/dist/* "${APP_DIR}/captain-pwa/"

# Install production dependencies
cd "${APP_DIR}"
pnpm install --prod --frozen-lockfile --filter @akrdev/api

# Run database migrations
echo "Running database migrations..."
cd "${APP_DIR}/api"
npx prisma migrate deploy

# Run seed
npx prisma db seed

# Setup PM2
echo "Setting up PM2..."
pm2 delete akrdev-api 2>/dev/null || true
pm2 start dist/index.js --name akrdev-api --cwd "$(pwd)" --time

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
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
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
if [ -n "${DOMAIN:-}" ] && command -v certbot &> /dev/null; then
    echo "Setting up SSL for domain: ${DOMAIN}..."
    certbot --nginx -d "${DOMAIN}" --non-interactive --agree-tos --email "${EMAIL:-admin@example.com}" || true
fi

echo "=== Deployment complete ==="
pm2 save
pm2 startup
