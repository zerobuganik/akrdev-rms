# AKRDev RMS POS — Windows EXE Production Guide

## What You'll Get

A `AKRDev RMS Setup.exe` file. Install it on any Windows PC. The POS runs in **fullscreen kiosk mode** — no title bar, no taskbar. Everything is saved to the cloud so if the PC breaks, just install the EXE on another PC and all your data is there.

---

## Accounts Needed (Both Free)

| Service | Sign Up Here |
|---------|-------------|
| **GitHub** | https://github.com (click Sign up) |
| **Render** | https://render.com (click Sign In → Sign in with GitHub) |

---

## Step 1: Create Database on Render

1. Render dashboard → click **New +** → **PostgreSQL**
2. Fill in:
   - **Name:** `akrdev-db`
   - **Region:** Singapore (closest to India)
   - **Plan:** Free
3. Click **Create Database**. Wait 2 minutes.
4. Scroll to **Connections** → copy the **Internal Database URL**:
   ```
   postgresql://akrdev_db_user:abc123@dpg-xxxxx.singapore-postgres.render.com/akrdev_db
   ```
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

Open PowerShell in the project folder (`D:\AI Project\AKRDev RMS`). Run one by one:

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

Back in PowerShell (replace `zerobuganik` with your GitHub username):

```powershell
git remote add origin https://github.com/zerobuganik/akrdev-rms.git
```
```powershell
git branch -M main
```
```powershell
git push -u origin main
```

---

## Step 4: Deploy API on Render

1. Render dashboard → **New +** → **Web Service**
2. Connect your `akrdev-rms` repo
3. Fill in exactly:

| Field | Value |
|-------|-------|
| **Name** | `akrdev-api` |
| **Root Directory** | `apps/api` |
| **Build Command** | `pnpm install --frozen-lockfile --filter @akrdev/api... && pnpm --filter @akrdev/api build` |
| **Start Command** | `pnpm --filter @akrdev/api start` |
| **Plan** | Free |

4. Click **Environment Variables** → **Add Environment Variable**. Add these 5:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | (paste Internal Database URL from Step 1) |
| `JWT_ACCESS_SECRET` | (paste JWT Secret 1 from Step 2) |
| `JWT_REFRESH_SECRET` | (paste JWT Secret 2 from Step 2) |
| `CORS_ORIGINS` | `*` |
| `NODE_ENV` | `production` |

5. Click **Create Web Service**. Wait ~5 minutes until "Deploy successful".
6. Copy the URL at the top (e.g. `https://akrdev-api.onrender.com`). **Save it in Notepad.**
7. Test: open browser → go to `https://akrdev-api.onrender.com/api/v1/health` → should show `{"status":"ok"}`

The admin user is created automatically during deployment.

Admin login:
- **Phone:** `7001181474`
- **Password:** `admin123`
- **PIN:** `1234`

---

## Step 5: Configure API URL

On your PC, open this file in Notepad:
```
D:\AI Project\AKRDev RMS\apps\electron\.env
```

Change the first line to your Render URL:
```
CLOUD_API_URL=https://akrdev-api.onrender.com/api/v1
```

Save and close.

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
D:\AI Project\AKRDev RMS\apps\electron\release\AKRDev RMS Setup.exe
```

---

## Step 7: Install on Restaurant PC

1. Copy `AKRDev RMS Setup.exe` to the restaurant PC (USB drive)
2. Double-click to install
3. Opens in fullscreen — no browser, no menu bar
4. Login: phone `7001181474`, password `admin123`

**Lock the terminal:** Click the lock icon in the sidebar when stepping away.

---

## Step 8: Change Admin Password

1. Click your avatar (bottom-left sidebar)
2. Change name, phone, password, PIN
3. Click **Save Profile**

---

## Step 9: Setup Thermal Printer

1. Inside POS → **Settings** → **Printer Setup** tab
2. Add printer (USB or Network)
3. Mark as "Kitchen" (KOT) or "Billing" (bills)
4. Click **Test Print**

Supported: Any ESC/POS thermal printer (80mm/58mm). Common: Epson TM-T82, Rongta, Xprinter.

---

## If PC Dies

Install the EXE on another PC. Login. **All data is there** — menu, tables, orders, everything saved in cloud.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Render deploy fails | Check DATABASE_URL has no extra spaces |
| `pnpm` not found | Run `npm install -g pnpm` first, then restart PowerShell |
| EXE won't start | Check `apps\electron\.env` has correct `CLOUD_API_URL` |
| Login fails | Check DATABASE_URL is correct. Re-deploy to run seed again. |
