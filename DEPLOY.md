# AKRDev RMS POS — Windows EXE Production Guide

## What You'll Get

A `AKRDev RMS Setup.exe` file. Install it on any Windows PC. The POS runs in **fullscreen kiosk mode** — no title bar, no taskbar, no Alt+F4. Everything is saved to the cloud so if the PC breaks, just install the EXE on another PC and all your data is there.

---

## What You Need

- A Windows PC (to build the EXE)
- A GitHub account (free — sign up at https://github.com)
- ~30 minutes

---

## Step 1: Create GitHub Account

Go to https://github.com → click **Sign up** → create account with your email.

---

## Step 2: Create Render Account

Go to https://render.com → click **Sign In** → **Sign in with GitHub** (connect your GitHub account).

---

## Step 3: Create Database on Render

1. In Render dashboard, click the **New +** button → **PostgreSQL**
2. Fill in:
   - **Name:** `akrdev-db`
   - **Region:** Singapore
   - **Plan:** Free
3. Click **Create Database**
4. Wait 2 minutes for it to create
5. Scroll down to **Connections** section
6. Copy the **Internal Database URL** — it looks like:
   ```
   postgresql://akrdev_db_user:abc123@dpg-xxxxx.singapore-postgres.render.com/akrdev_db
   ```
7. **Save this URL in a Notepad file** — you'll need it twice

---

## Step 4: Generate Secret Keys

Open PowerShell on your PC, paste this and press Enter:

```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object { [char]$_ })
```

Run it **two times**. Copy both outputs to your Notepad file. Label them "JWT Secret 1" and "JWT Secret 2".

---

## Step 5: Push Code to GitHub

Open PowerShell in the project folder (`D:\AI Project\AKRDev RMS`) and run one by one:

```powershell
git init
```

```powershell
git add .
```

```powershell
git commit -m "AKRDev RMS"
```

Now create a repo on GitHub:
1. Go to https://github.com → click your profile icon (top right) → **Your repositories**
2. Click **New** (green button)
3. Name: `akrdev-rms`
4. Check **Private**
5. Click **Create repository**

Back in PowerShell, run these (replace `YOUR_USERNAME` with your GitHub username):

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

## Step 6: Deploy API on Render

1. In Render dashboard, click **New +** → **Web Service**
2. Click **Connect** on your `akrdev-rms` repo
3. Fill in:

   | Field | What to type |
   |-------|-------------|
   | **Name** | `akrdev-api` |
   | **Root Directory** | `apps/api` |
   | **Build Command** | `pnpm install --frozen-lockfile && pnpm build` |
   | **Start Command** | `pnpm start` |
   | **Plan** | Free |

4. Scroll down to **Environment Variables**. Click **Add Environment Variable** and add these one by one:

   | Key | Value (paste from Notepad) |
   |-----|-------|
   | `DATABASE_URL` | paste the "Internal Database URL" from Step 3 |
   | `JWT_ACCESS_SECRET` | paste "JWT Secret 1" from Step 4 |
   | `JWT_REFRESH_SECRET` | paste "JWT Secret 2" from Step 4 |
   | `CORS_ORIGINS` | `*` |
   | `NODE_ENV` | `production` |

5. Click **Create Web Service**
6. Wait ~5 minutes. You'll see "Build successful" and then "Deploy successful".
7. At the top, you'll see a URL like `https://akrdev-api.onrender.com`. **Copy this URL to your Notepad**.
8. Test it: open a browser and go to `https://akrdev-api.onrender.com/api/v1/health` — you should see `{"status":"ok"}`

---

## Step 7: Create Admin User

1. In Render dashboard, click your `akrdev-api` service
2. Click **Shell** (on the right side)
3. A black terminal opens. Type:
   ```
   npx tsx prisma/seed.ts
   ```
   Press Enter. Wait for "Seeding complete."

Your admin login:
- **Phone:** `7001181474`  
- **Password:** `admin123`
- **PIN:** `1234`

---

## Step 8: Configure API URL in Electron

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

## Step 9: Build the EXE

Open PowerShell in the project folder and run:

```powershell
copy /Y apps\pos\.env.electron apps\pos\.env
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

Wait ~5 minutes. The installer is created at:
```
D:\AI Project\AKRDev RMS\apps\electron\release\AKRDev RMS Setup.exe
```

---

## Step 10: Install on Restaurant PC

1. Copy `AKRDev RMS Setup.exe` to the restaurant PC (use a USB drive)
2. Double-click to install
3. It creates a desktop shortcut
4. Open AKRDev RMS from desktop
5. Login with phone `7001181474` and password `admin123`

The app opens fullscreen. No browser, no menu bar. Use the **lock icon** in the sidebar to secure the terminal.

---

## Step 11: Change Admin Phone & Password

After login:
1. Click your avatar in the bottom-left sidebar
2. Change name, phone, password, PIN
3. Click **Save Profile**

---

## If PC Dies — Reinstall

1. Install the EXE on another PC from the same `AKRDev RMS Setup.exe`
2. Login — all your data is there (menu, tables, orders, everything saved in cloud)

---

## Setup Thermal Printer

Inside the POS app:
1. Go to **Settings** in the sidebar
2. Click **Printer Setup** tab
3. Add your printer (USB or Network)
4. Mark it as "Kitchen" (for KOT) or "Billing" (for bills)
5. Click **Test Print** to verify

Supported printers: Any ESC/POS thermal printer (80mm or 58mm). Common models: Epson TM-T82, Posiflex, Rongta, Xprinter.

---

## Support

If you get stuck at any step, the error message on screen will tell you what's wrong. Common fixes:
- **Render deploy fails**: Check you pasted DATABASE_URL correctly (no extra spaces)
- **pnpm not found**: Run `npm install -g pnpm` first
- **EXE won't start**: Check `apps\electron\.env` has the correct CLOUD_API_URL
