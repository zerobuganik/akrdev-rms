# AKRDev RMS POS — Windows EXE Production Guide

## What You'll Get

A `AKRDev RMS Setup.exe` file. Install it on any Windows PC. The POS runs in **fullscreen kiosk mode** — no title bar, no taskbar. Everything is saved to the cloud so if the PC breaks, just install the EXE on another PC and all your data is there.

---

## Accounts Needed (Both Free to Start)

| Service | Sign Up Here |
|---------|-------------|
| **GitHub** | https://github.com (click Sign up) |
| **Railway** | https://railway.com (click Start a New Project) |

Railway gives you $5 free credit each month. The API + PostgreSQL combo costs roughly $3–5/month depending on region.

---

## Step 1: Create Database on Railway

1. Railway dashboard → click **New Project** → **PostgreSQL**
2. Wait 1–2 minutes for the database to provision
3. Click on the PostgreSQL service → **Variables** tab
4. Copy the `DATABASE_URL` (starts with `postgresql://`)
5. **Save this URL in Notepad** — you'll paste it later.

---

## Step 2: Generate Secret Keys

Open PowerShell, paste this, press Enter:

```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object { [char]$_ })
```

**Run it twice.** Copy both outputs to Notepad. Label them "JWT Secret 1" and "JWT Secret 2".

---

## Step 3: Push Code to GitHub

Open PowerShell in the project folder. Run one by one:

```powershell
git init
```
```powershell
git add .
```
```powershell
git commit -m "AKRDev RMS"
```

Now on GitHub: click your profile icon → **Your repositories** → **New** (green button).
- Name: `akrdev-rms`
- Check **Private**
- Click **Create repository**

Back in PowerShell (replace with your GitHub username):

```powershell
git remote add origin https://github.com/YOUR_USERNAME/akrdev-rms.git
```
```powershell
git branch -M main
```
```powershell
git push -u origin main
```

---

## Step 4: Deploy API on Railway

1. Railway dashboard → **New Project** → **Deploy from GitHub repo**
2. Select your `akrdev-rms` repository
3. Railway auto-detects the project. It will add a service. Click the service card.
4. Go to **Settings** tab and configure:

| Field | Value |
|-------|-------|
| **Root Directory** | (leave empty — use repository root for monorepo) |
| **Build Command** | `corepack enable && corepack prepare pnpm@11.5.0 --activate && pnpm install --frozen-lockfile && pnpm --filter @akrdev/api build:full` |
| **Start Command** | `cd apps/api && pnpm --filter @akrdev/api start` |

> **Note:** The `railpack.json` file in the repo root already handles these commands automatically. If Railway's auto-detection picks it up, you don't need to set these manually. Only set them if Railway prompts for them.

5. Click **Variables** tab and add these 8 variables:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | (paste Database URL from Step 1) |
| `JWT_ACCESS_SECRET` | (paste JWT Secret 1 from Step 2) |
| `JWT_REFRESH_SECRET` | (paste JWT Secret 2 from Step 2) |
| `JWT_ACCESS_EXPIRY` | `15m` |
| `JWT_REFRESH_EXPIRY` | `7d` |
| `CORS_ORIGINS` | `*` (restrict in production to your domain) |
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `LOG_LEVEL` | `info` |

6. Under **Settings** → **Networking**, the app is auto-assigned a domain (e.g. `akrdev-api.up.railway.app`). **Note:** Railway generates the public URL automatically — no manual domain setup needed.

7. Click **Deploy**. Wait ~5 minutes until "Deploy successful".
8. Test: open browser → go to `https://<your-service-name>.up.railway.app/api/v1/health` → should show `{"status":"ok"}`

The admin user is created automatically during deployment.

Default admin login:
- **Phone:** `7001181474`
- **PIN:** `1234`

**IMPORTANT: Change the admin credentials immediately after first login** (see Step 8).

---

## Step 5: Configure API URL

On your PC, open this file in Notepad:
```
apps\electron\.env
```

Set the first line to your Railway URL:
```
CLOUD_API_URL=https://<your-service-name>.up.railway.app/api/v1
```

Replace `<your-service-name>` with the actual service name from Step 4.

---

## Step 6: Build the EXE

Open PowerShell in the project folder. Run one by one:

```powershell
Copy-Item -LiteralPath "apps\pos\.env.electron" -Destination "apps\pos\.env" -Force
```
```powershell
pnpm --filter @akrdev/pos build
```
```powershell
pnpm --filter @akrdev/electron build
```
```powershell
pnpm --filter @akrdev/electron dist
```

Wait ~5 minutes. The EXE installer is at:
```
apps\electron\release\AKRDev RMS Setup.exe
```

---

## Step 7: Install on Restaurant PC

1. Copy `AKRDev RMS Setup.exe` to the restaurant PC (USB drive)
2. Double-click to install
3. Opens in fullscreen — no browser, no menu bar
4. Login: phone `7001181474`, PIN `1234`

**Lock the terminal:** Click the lock icon in the sidebar when stepping away.

---

## Step 8: Change Admin Password

1. Click your avatar (bottom-left sidebar)
2. Change name, phone, password, PIN
3. Click **Save Profile**

---

## Step 9: Setup Thermal Printer

1. Inside POS → **Settings** → **Printers** section
2. Add printer (USB or Network/Spooler)
3. Configure kitchen (KOT) / billing routing
4. Click **Test Print**

Supported: Any ESC/POS thermal printer (80mm/58mm). Common: Epson TM-T82, Rongta, Xprinter.

---

## If PC Dies

Install the EXE on another PC. Login. **All data is there** — menu, tables, orders, everything saved in cloud.

---

## Railway vs VPS

| | Railway | VPS (Linux) |
|---|---|---|
| Setup time | 10 minutes | 1–2 hours |
| Cost/month | $3–5 | $5–10 |
| Maintenance | Zero | Manual updates, SSL, Nginx |
| Custom domain | Built-in | Manual certbot setup |
| Who should use | Most restaurants | Enterprises needing full control |

For VPS deployment, see `scripts/deploy-vps.sh`.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Railway deploy fails | Check DATABASE_URL has no extra spaces. Root Directory must be empty (repo root). |
| `pnpm` not found | Use `corepack enable && corepack prepare pnpm@11.5.0 --activate` in the Build Command. |
| EXE won't start | Check `apps\electron\.env` has correct `CLOUD_API_URL` ending in `/api/v1`. |
| Login fails | Check DATABASE_URL is correct. Re-deploy to run seed again. |
| CORS errors in browser | Set `CORS_ORIGINS` to your frontend domain instead of `*`. |
| Database offline | In Railway, go to PostgreSQL service → make sure it's active (green). |
