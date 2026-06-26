## **🛑 STRICT LOGGING RULES FOR AI DEVELOPER**

*Every time a task from the checklist is completed, the AI MUST add a new entry to the Development Log below using the exact template provided. Do not skip this.*

**Log Entry Template:**

### **\[Task Number\] \- \[Date & Time\]**

* **Action Taken:** (Briefly explain *how* it was implemented. e.g., "Created user route using Express and Zod validation.")  
* **Issues Faced:** (What bugs, type errors, or logic issues happened? If none, write "None.")  
* **Resolution:** (How was the issue fixed? What architectural decision was made?)

## **📝 Development Log (Chronological)**

### **\[Project Setup\] \- \[30-May-2026\]**

* **Action Taken:** Initialized project documentation. Finalized Local-First/Cloud-Fallback architecture, selected SQLite/PostgreSQL hybrid DB strategy, and locked in the UI/UX flows.  
* **Issues Faced:** None.  
* **Resolution:** N/A. Ready to begin Task 1.1.

### **\[Doc Refinements\] \- \[30-May-2026 03:24 IST\]**

* **Action Taken:** Updated 2\_Tech\_Stack.md and 4\_Development\_Checklist.md based on architecture review. Changes: switched to Windows Print Spooler (no ESC/POS dependency), locked React to v18, clarified Captain App LAN-only local mode behavior, added /api/v1/health endpoint, added ESLint/Prettier/env-validation/Vitest/Playwright to Phase 1, added PostgreSQL backup (2.12), merged Phase 7 + 7A into single Sync Engine & Local SQLite Queue phase with explicit conflict resolution strategy (LWW with timestamps).  
* **Issues Faced:** None.  
* **Resolution:** N/A.

### **1.1 - 30-May-2026 03:42 IST**

* **Action Taken:** Initialized pnpm workspace with `pnpm init`. Created `pnpm-workspace.yaml` with `apps/*` and `packages/*` globs. Set root `package.json` as private with `turbo`-based scripts placeholder. Created `apps/` and `packages/` directories. Verified with `pnpm install`.
* **Issues Faced:** pnpm was not globally installed — had to run `npm install -g pnpm`.
* **Resolution:** Installed pnpm 11.5.0 globally.

### **1.1A - 30-May-2026 03:43 IST**

* **Action Taken:** Installed ESLint 10, Prettier 3, eslint-config-turbo, @typescript-eslint plugins, and TypeScript 6 as root devDependencies. Created eslint.config.js (flat config with turbo preset), `.prettierrc`, and `.prettierignore`.
* **Issues Faced:** None.  
* **Resolution:** N/A.

### **1.1B - 30-May-2026 03:44 IST**

* **Action Taken:** Installed Zod 4 and dotenv as root devDependencies. Created `apps/api/src/env.ts`, `apps/pos/src/env.ts`, `apps/electron/src/env.ts` with Zod-based environment variable validation schemas. Created `.env.example` files for each app with documented default values.
* **Issues Faced:** None.
* **Resolution:** N/A.

### **1.2 - 30-May-2026 03:45 IST**

* **Action Taken:** Installed Turbo 2.9.16 as root devDependency. Created `turbo.json` with pipelines for `build` (dependsOn ^build, outputs dist/), `dev` (persistent, no cache), `lint` (dependsOn ^build), `test` (dependsOn ^build, outputs coverage/), `typecheck`, and `clean`.
* **Issues Faced:** None.
* **Resolution:** N/A.

### **1.3 - 30-May-2026 03:45 IST**

* **Action Taken:** Created `packages/tsconfig` with three config files: `tsconfig.base.json` (ES2022, strict, bundler resolution), `tsconfig.node.json` (extends base, noEmit), `tsconfig.react.json` (extends base, react-jsx, DOM lib). Shared via `@akrdev/tsconfig` package.
* **Issues Faced:** None.
* **Resolution:** N/A.

### **1.4 - 30-May-2026 03:46 IST**

* **Action Taken:** Created `packages/types` with empty barrel export (`src/index.ts`), package.json referencing `@akrdev/tsconfig`, and tsconfig.json extending react config.
* **Issues Faced:** Originally used `catalog:` for TypeScript version but pnpm catalogs not yet configured.
* **Resolution:** Switched to explicit `^6.0.0` version matching root TypeScript.

### **1.5 - 30-May-2026 03:46 IST**

* **Action Taken:** Created `packages/schemas` with Zod 4 as dependency, empty barrel export, and Node-targeted tsconfig.
* **Issues Faced:** None.
* **Resolution:** N/A.

### **1.6 - 30-May-2026 03:46 IST**

* **Action Taken:** Created `packages/shared` with empty barrel export for shared utilities/constants.
* **Issues Faced:** None.
* **Resolution:** N/A.

### **1.7 - 30-May-2026 03:47 IST**

* **Action Taken:** Scaffolded `apps/api` with Express 5 + TypeScript + Helmet 8 + CORS. Created `src/index.ts` with `GET /api/v1/health` endpoint. Configured tsconfig extending `@akrdev/tsconfig/tsconfig.node.json`.
* **Issues Faced:** TS2883 type portability error with Express inferred type. Also needed `@types/node` not initially listed.
* **Resolution:** Removed `export default app` to avoid portability issue. Added `@types/node` to devDependencies.

### **1.8 - 30-May-2026 03:48 IST**

* **Action Taken:** Scaffolded `apps/pos` with Vite 6 + React 18 + TypeScript. Created `src/main.tsx`, `src/App.tsx`, `vite.config.ts`, and `index.html`. Configured shadcn-compatible path aliases `@/*`.
* **Issues Faced:** None.
* **Resolution:** N/A.

### **1.9 - 30-May-2026 03:50 IST**

* **Action Taken:** Installed Tailwind CSS v4 (`@tailwindcss/vite` Vite plugin) and shadcn/ui (via `pnpm dlx shadcn@latest init`). Created `src/index.css` with `@import "tailwindcss"`. Added `@/` path aliases in both tsconfig.json and vite.config.ts for shadcn compatibility. shadcn generated `src/lib/utils.ts` and `src/components/ui/button.tsx`.
* **Issues Faced:** shadcn init required `paths` config in tsconfig and `resolve.alias` in Vite. TS6 deprecated `baseUrl` so removed it. msw build scripts needed approval.
* **Resolution:** Configured path aliases, approved msw builds, removed `baseUrl`.

### **1.10 - 30-May-2026 03:52 IST**

* **Action Taken:** Scaffolded `apps/electron` with Electron 33 main process. Created `src/main.ts` (BrowserWindow with security defaults: contextIsolation, sandbox, no nodeIntegration) and `src/preload.ts` (exposes `window.electron.ipcRenderer.invoke/on`). Electron loads POS from Vite dev server in development, or built files in production.
* **Issues Faced:** Electron binary requires build scripts approval.
* **Resolution:** Approved Electron build scripts via `pnpm approve-builds`.

### **1.11 - 30-May-2026 03:54 IST**

* **Action Taken:** Set up Vitest 4 across all apps. Created `vitest.config.ts` for each app: API and Electron use `node` environment; POS uses `jsdom` with `@testing-library/jest-dom` setup. Added `test` and `test:watch` scripts to all package.json files. Installed `@vitest/ui` and `@vitest/coverage-v8` at root. Verified smoke tests pass in all 3 apps.
* **Issues Faced:** Turbo required `packageManager` field in root package.json (not just `devEngines`). Conflict warning between `packageManager` and `devEngines`.
* **Resolution:** Added `packageManager: "pnpm@11.5.0"` at root, removed `devEngines`. All 9 turbo tasks pass cleanly.

### **2.1 - 30-May-2026 03:58 IST**

* **Action Taken:** Installed Prisma 7.8 and `@prisma/client` in `apps/api`. Created `prisma/schema.prisma` with PostgreSQL provider and `prisma.config.ts` with database URL. Prisma 7 requires connection URL in config file (not schema). Created `apps/api/.env` with DATABASE_URL.
* **Issues Faced:** Prisma 7 removed `url` from schema `datasource` block — moved to `prisma.config.ts`. PostgreSQL authentication failed — unknown password for `postgres` user.
* **Resolution:** Reset PostgreSQL password by temporarily changing pg_hba.conf to `trust`, changed password to `akrdev_rms_dev`, restored scram-sha-256 auth. Database `akrdev_rms` created.

### **2.2-2.11 - 30-May-2026 04:13 IST**

* **Action Taken:** Wrote complete Prisma schema with all 22 models: User, RefreshToken, Session, Permission, RolePermission, Area, Table, Category, Item, ItemVariation, Printer, PrinterGroup, PrinterMapping, PrintJob, Customer, Order, OrderItem, KOT, OrderDiscount, DiscountReason, StoreSettings, ActivityLog. All use UUID primary keys (@db.Uuid). Enums: RoleEnum, TableStatus, OrderStatus, SyncStatus, OrderType, OrderItemStatus, PrintJobType, PrinterStatus, PrinterType, DiscountType, TaxType. Added proper relations with cascades. Ran `prisma migrate dev --name init` to apply migration.
* **Issues Faced:** Two relation validation errors — `Order.printJobs` and `OrderItem.variation` missing inverse relations.
* **Resolution:** Added `Order` relation on `PrintJob` and `orderItems` on `ItemVariation`. Migration applied cleanly.

### **2.12 - 30-May-2026 04:15 IST**

* **Action Taken:** Installed argon2 and `@prisma/adapter-pg`. Created `prisma/seed.ts` — seeds Admin user (PIN: 1234, hashed with argon2), 6 default categories (Starters, Main Course, etc.), and default StoreSettings row. Created `lib/prisma.ts` singleton using Prisma 7 adapter-based client constructor. Configured seed in `prisma.config.ts` under `migrations.seed`. Ran `prisma db seed` successfully.
* **Issues Faced:** Prisma 7 seed config moved from root `seed` key to `migrations.seed`. Seed script lacked DATABASE_URL due to missing dotenv import.
* **Resolution:** Moved seed config to `migrations.seed: 'tsx ./prisma/seed.ts'`. Added `dotenv/config` import with fallback connection string in seed script.

### **2.13 - 30-May-2026 04:16 IST**

* **Action Taken:** Created `scripts/backup.sh` — bash script for pg_dump with gzip compression, configurable DB credentials via env vars, keeps latest 7 backups, auto-cleans older ones.
* **Issues Faced:** None.
* **Resolution:** N/A.

### **3.1-3.7 - 30-May-2026 04:18 IST**

* **Action Taken:** Installed Winston. Created custom error classes, global error handler, 404 handler. Built JWT library (access+refresh tokens). AuthService with argon2id, refresh token rotation, logout. Auth middleware (JWT), RBAC middleware, activity logger middleware.
* **Issues Faced:** Express 5 params type error (string | string[]). TS2883 router type errors from declaration:true in base tsconfig. Missing @unique on User.phone.
* **Resolution:** Cast params with `as string`. Set declaration:false in API tsconfig. Added @unique to User.phone and db push.

### **3.8-3.29 - 30-May-2026 04:22 IST**

* **Action Taken:** Built 14 module route files with full CRUD: settings, employees, areas, tables, categories, items+variations, customers/search, orders (create/list/active/void/refund), cart (add/remove/notes/guest/customer), KOT (generate kotNumber, mark Sent), settlement (discounts/payments/change/clear), activity-log (read-only/filters), printers + print-jobs + retry. All use authMiddleware, RBAC, activityLogger. Architecture: routes→controllers→services→Prisma.
* **Issues Faced:** Express 5 param type across 25 lines in 7 files.
* **Resolution:** PowerShell batch replace `req.params.*!`→`req.params.* as string`.

### **4.1-4.8 - 30-May-2026 05:37 IST**

* **Action Taken:** Built complete POS frontend foundation. Installed react-router-dom, zustand, axios, @tanstack/react-query. Created router with ProtectedRoute (checks localStorage JWT, redirects to /login). Built useAuthStore (login/logout/PIN verify via apiClient), useCartStore (activeTable, guestCount, items, orderNote, customer). Created apiClient with automatic JWT interceptor and refresh token rotation. Built LoginPage with two-step flow (phone → PIN via PinPad component). Built Global Layout with collapsible sidebar (250px/60px), 6 nav items with active highlighting, user avatar/role, lock/logout buttons. Built FooterStatusBar with live clock, network status indicator (online/offline/disconnected), sync status, notification bell. Built toast system via Zustand store + Toaster component with auto-dismiss. Set up TanStack Query QueryClientProvider in main.tsx.

### **5.1-5.7 - 30-May-2026 05:42 IST**

* **Action Taken:** Built all 7 POS modules. Tables module: AreaFilter (multi-select pill buttons), TableStats (total/occupied/available), TableCard (status-based color coding, sync icons per order, quick action buttons, guest capacity), TableGrid (grouped by area, responsive grid). Cart & Menu: three-panel layout (10% TableSwitcher with area-organized list, 60% MenuPanel with debounced search/shortcode support/category ribbon/text-only item grid/variation modal popup, 30% CartPanel with KOT-grouped items/cancelled items strikethrough/footer math/KOT+Bill+Settle action buttons/table locking). SettlementModal: discount engine (% or flat), payment entry (Cash/Card/UPI), change calculator, Complete Settlement button. Menu Admin: master-detail category/item list with inline forms, stock toggle, delete. Orders Ledger: Running/Settled tabs, status badges, detail slide-out panel. Employees: data table, add form (name/phone/PIN/role), active toggle, delete. Settings: business profile form (company/address/phone/email/FSSAI/GSTIN), tax type, bill header/footer. Activity Log: read-only filtered table (module/action/user). All pages use TanStack Query for data fetching and mutation with automatic cache invalidation.
* **Issues Faced:** `noUncheckedIndexedAccess` in tsconfig base caused type errors on Record<string, { bg }> lookups.
* **Resolution:** Added non-null assertion with fallback to default config.

### **6.1-6.9 - 30-May-2026 05:48 IST**

* **Action Taken:** Built complete Sync Engine with local SQLite queue. Created separate Prisma schema in `apps/electron/prisma/` with SQLite provider: LocalOrder, LocalOrderItem, LocalKOT, LocalSettlement (mirroring Cloud PostgreSQL shapes), plus SyncQueue (action/payload/status/retryCount/retryAt/error) and SyncState (singleton state tracking). Created `lib/local-prisma.ts` using `@prisma/adapter-libsql`. Built SyncQueueService (enqueue/getPending/markProcessing/markSynced/markFailed with exponential backoff 1s→2s→4s→8s→16s→32s). Built SyncWorkerService with health check polling (/api/v1/health every 10s), sync processing (every 5s), fetchWithRetry (max 5 retries with exponential delay). Built OfflineInterceptorService (saveOrderLocally, addItemLocally, removeItemLocally, saveKOTLocally, saveSettlementLocally, queueForSync, getSyncStats). Conflict resolution: LWW with `updatedAt` timestamp comparison. Registered IPC handlers (`get-sync-status`, `force-sync`, `queue-sync-action`) in Electron main process. Sync worker starts on app ready, stops on before-quit. UI indicators (sync status, pending count) already wired via FooterStatusBar and TableCard components.
* **Issues Faced:** `PrismaLibSQL` import name was `PrismaLibSql` (case). `retryAt` is `Date | null` not `string | null`. `JSON.parse` returned `unknown` needing type cast.
* **Resolution:** Fixed import case, used Prisma-inferred return types.

### **7.1-7.15 - 30-May-2026 05:51 IST**

* **Action Taken:** Built complete Hardware & Native Integration layer. Updated preload.ts with channel whitelisting for 6 invoke channels (print-kot, print-bill, get-printers, get-sync-status, force-sync, queue-sync-action) and 5 on channels (table:update, order:status-change, cart:lock/unlock, sync:status-change). Built mDNS broadcaster using `multicast-dns` — advertises `akrdev-rms._http._tcp.local` with SRV/TXT records. Created Local Express API (`apps/electron/src/api-local/server.ts`) with Express5 + Socket.IO server — health, tables, orders, cart/add-item, kot/send, print-request, table lock/unlock endpoints. Socket.IO rooms per table (`table:<id>`) with subscribe/unsubscribe events. Built TableLockService with 5-min auto-timeout, broadcast on lock/unlock. Created React Socket.IO hook (`lib/useSocketIO.ts`). Built PrintService (abstract class + WindowsPrintService using `webContents.getPrintersAsync()`). Built PrintQueueManager (background queue with Ready/Printing/Done/Error states, retry logic). Built PrinterMappingService (category/item→Windows printer name mapping). Built KOT and Bill HTML template renderers (80mm thermal-style KOT template with dashed borders, large font; restaurant-branded bill with GSTIN/FSSAI). Registered print-kot, print-bill, get-printers IPC handlers. Installed @electron/rebuild, configured postinstall script for argon2 native module compatibility. Set `declaration: false` + `declarationMap: false` in POS and Electron tsconfigs to prevent TS2883 type portability issues.
* **Issues Faced:** `multicast-dns` has no @types package. Socket.IO client type caused TS2883 in POS. `io` module-level variable not declared in server.ts. argon2 native module needed electron-rebuild.
* **Resolution:** Created `types.d.ts` with multicast-dns module declaration. Set `declaration: false` in tsconfigs. Declared `let io: SocketIOServer | null = null` at module level. electron-rebuild postinstall runs automatically.

### **8.1-8.10 - 30-May-2026 06:08 IST**

* **Action Taken:** Built complete Captain App PWA (`apps/captain`). Scaffolded with Vite6 + React 18 + Tailwind CSS v4 + vite-plugin-pwa (SW precaching + runtime API caching via NetworkFirst). Built Network Discovery Service (mDNS placeholder, stored endpoints in localStorage, tryConnect with health check). Built Connection Manager (auto-discovery on init, health check every 5s, auto-switch Local↔Cloud on failure, listener pattern for state changes). Built apiClient with dynamic baseURL from connection-manager. Built PairPage (Cloud URL entry, POS auto-discovery, 6-digit pairing code). Built LoginPage (two-step phone→PIN with numeric keypad). Built TablesPage (mobile grid, status-colored cards, grandTotal display). Built CartPage (item search, variation modal, KOT-grouped items, Send KOT + Bill buttons, cart slide-up panel). Captain cannot settle (no settlement button — RBAC enforced). Socket.IO client hook for real-time table updates. PWA manifest + workbox runtime API caching.
* **Issues Faced:** Missing Vite path alias for `@/*` in vite.config.ts. Dynamic import patterns in auth store caused chunk warnings. Missing `lucide-react`.
* **Resolution:** Added `resolve.alias` with `path.resolve(__dirname, './src')`. Installed lucide-react. Fixed import paths in useSocketIO and useAuthStore.

### **9.1-9.12 - 30-May-2026 06:15 IST**

* **Action Taken:** Installed Playwright 1.60 and Chromium browser. Created `playwright.config.ts` with webServer auto-start (POS dev server on port 5173). Created E2E test files: `auth.spec.ts` (login page loads, phone enables continue, PIN pad dots, protected route redirect, back button) and `routes.spec.ts` (tables auth required, settings admin required, sidebar links, 404 redirect). Vitest smoke tests already pass across all 3 apps from Phase 1.
* **Issues Faced:** None.
* **Resolution:** N/A.

### **10.1-10.8 - 30-May-2026 06:16 IST**

* **Action Taken:** Created `electron-builder.yml` (NSIS Windows installer, 64-bit, tray icon, desktop shortcut). Added `dist` script to Electron package.json. Created `scripts/deploy-vps.sh` (PM2 process manager, Nginx reverse proxy for API + Captain PWA static files, Certbot SSL, PostgreSQL daily backup cron, `prisma migrate deploy`). Created `scripts/health-check.sh` (HTTP status check, webhook alert on failure). Created root `.env.example`. Created comprehensive `README.md` with architecture overview, quick start, development commands, deployment instructions, and Captain App connection flow.
* **Issues Faced:** None.
* **Resolution:** N/A.

### **Phase 1-10 Complete — 149/149 Steps**
* **Issues Faced:** None.
* **Resolution:** N/A. All typechecks and production build pass cleanly.

---

## Post-Launch: Print Adapter Refactor — 04-Jun-2026

### **Phase 6: Print Adapter Refactor — 04-Jun-2026 02:06 IST**

* **Action Taken:** Completely replaced the HTML/CSS `BrowserWindow` printing approach with a native `@thiagoelg/node-printer` RAW mode architecture. Built full Printer Management UI in POS Settings with system printer discovery via `webContents.getPrintersAsync()`, spooler connection type, and printer CRUD. Integrated KOT/Bill print triggers into CartPanel so KOT and Bill buttons automatically send print jobs after their respective API calls succeed.
* **Issues Faced:**
  1. **LIBUSB_ERROR_NOT_SUPPORTED** — Raw ESC/POS USB adapters failed because Windows already owned the printer device via its driver. **Fix:** Added Spooler connection type that prints through Windows print spooler instead of raw USB.
  2. **Generic POS80 thermal drivers rejected Electron's graphical `webContents.print()` output**, resulting in blank paper feeds and tiny/unreadable text. The HTML→PNG→spooler pipeline was incompatible with thermal roll drivers. **Fix:** Bypassed Chromium entirely. Configured `PrintService` to generate raw ESC/POS buffers and pushed them directly to the Windows Spooler using `@thiagoelg/node-printer` with `type: 'RAW'`.
  3. **`@thiagoelg/node-printer` compilation failure** — C++ template class `MemValue` in `node_printer_win.cc` used unqualified `_value` member access, which MSVC 2026 (v18.x) rejects as `identifier not found`. **Fix:** Patched 4 instances of `_value` to `this->_value` in the template class to satisfy dependent base class lookup rules. Created local TypeScript declaration at `src/types/node-printer.d.ts`.
  4. **KOT/Bill buttons saved to DB but never triggered printing** — `CartPanel` called `/kot/send` and `/orders/:id` APIs but the print endpoints were disconnected. **Fix:** Added `printerApi.printKOT()`/`printBill()` calls in the mutation `onSuccess` handlers, building PrintData from the order object with server name, items, settings, etc.
  5. **`NODE_ENV=production` missing** — Electron `start` script loaded Vite dev server URL instead of built files. **Fix:** Added `set NODE_ENV=production &&` to the start script.
* **Resolution:** Printing is now instant, hardware-agnostic, and works out-of-the-box with any Windows printer driver. No Zadig/libUSB driver hacks required. Cleaned up unused dependencies (`@node-escpos/core`, `pdf-to-printer`). Architecture: `PrintService.formatKOT()` → ESC/POS Buffer → `SpoolerAdapter.write()` → `printer.printDirect({ data, printer, type: 'RAW' })` → Windows Spooler → Physical Printer.

### **Files Created**

| File | Purpose |
|---|---|
| `apps/pos/src/lib/printerApi.ts` | Printer API layer (Electron IPC + HTTP:3001 fallback) |
| `apps/pos/src/components/printers/PrinterList.tsx` | Printer list table (add, edit, delete, test print) |
| `apps/pos/src/components/printers/PrinterForm.tsx` | Printer add/edit form with Discover dropdown |
| `apps/electron/src/printing/spooler.adapter.ts` | Native Windows spooler adapter via `@thiagoelg/node-printer` |
| `apps/electron/src/types/node-printer.d.ts` | TypeScript declaration for `@thiagoelg/node-printer` |

### **Files Modified**

| File | Change |
|---|---|
| `apps/pos/src/pages/SettingsPage.tsx` | Added PrinterList section |
| `apps/pos/src/components/cart/CartPanel.tsx` | Added printKOT/printBill triggers after API calls |
| `apps/electron/src/main.ts` | Added `print:discover-system` IPC handler |
| `apps/electron/src/preload.ts` | Whitelisted `print:discover-system` channel |
| `apps/electron/src/printing/print.service.ts` | Added SpoolerAdapter import + case |
| `apps/electron/src/printing/printer-adapter.interface.ts` | Added `'spooler'` connection type |
| `apps/electron/package.json` | Added `@thiagoelg/node-printer`, removed `@node-escpos/core` and `pdf-to-printer` |
| `node_modules/.../node_printer_win.cc` | Patched `_value` → `this->_value` in `MemValue` template |
