# AKRDev RMS — Restaurant Management System

Local-First POS with Cloud Fallback. Single-Client Deployment.

## Architecture

| Component | Description |
|-----------|-------------|
| `apps/api` | Cloud Backend (Express + PostgreSQL) |
| `apps/pos` | POS Frontend (React + Vite) |
| `apps/electron` | Windows POS App (Electron + Local Express API + SQLite) |
| `apps/captain` | Captain App PWA (React PWA) |
| `packages/*` | Shared types, schemas, tsconfig, utilities |

## Prerequisites

- Node.js v22+
- pnpm v11+
- PostgreSQL v16+
- Windows 10/11 (for POS deployment)

## Quick Start

```bash
pnpm install
pnpm turbo build
```

### Development

```bash
# Cloud API
pnpm --filter @akrdev/api dev

# POS Frontend
pnpm --filter @akrdev/pos dev

# POS Electron App (loads POS from Vite dev server)
pnpm --filter @akrdev/electron dev

# Captain App PWA
pnpm --filter @akrdev/captain dev
```

### Database Setup

```bash
cd apps/api
npx prisma migrate dev
npx prisma db seed
```

Default admin: Phone `7001181474`, PIN `1234`

### Testing

```bash
# Unit tests
pnpm test

# E2E tests
npx playwright test

# Type checking
pnpm turbo typecheck
```

## Deployment

### VPS (Cloud Backend + Captain PWA)

```bash
# Build
pnpm --filter @akrdev/api build
pnpm --filter @akrdev/captain build

# Deploy
bash scripts/deploy-vps.sh
```

### Windows POS

```bash
pnpm --filter @akrdev/pos build
pnpm --filter @akrdev/electron build
pnpm --filter @akrdev/electron dist
```

Output: `apps/electron/release/AKRDev RMS Setup.exe`

## Captain App Connection Priority

1. mDNS discovery → Local POS API on LAN WiFi
2. Cached POS IP from localStorage
3. LAN port scan (3000-3010)
4. Cloud API (4G/5G fallback)

## Environment Variables

See `.env.example` files in each app directory.

## License

Proprietary. All rights reserved.
