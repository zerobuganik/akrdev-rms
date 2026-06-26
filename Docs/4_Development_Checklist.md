# **AKRDev RMS \- Granular AI Development Checklist**

**Strict Rules for AI Execution:**

1. Execute strictly **ONE sub-step** at a time. Do not combine tasks.  
2. Wait for user verification before moving to the next sub-step.  
3. If a step involves frontend, verify the backend API/schema exists first.  
4. **Architecture Rule:** Always read Docs/1\_Project\_Overview.md and Docs/2\_Tech\_Stack.md before generating foundational or backend code.  
5. **UI & Logic Rule:** Always read Docs/3\_Detailed\_POS\_Screen\_and\_Features.md for exact UI layouts, button names, and component behaviors before generating any React frontend code.  
6. **Progress Tracking:** Update Docs/5\_Project\_Log.md (once created) as each phase is completed.

## **Phase 1: Workspace & Monorepo Foundation**

* \[x\] **1.1:** Initialize the pnpm workspace and create pnpm-workspace.yaml.  
* \[x\] **1.1A:** Setup ESLint, Prettier, and eslint-config-turbo across the monorepo.  
* \[x\] **1.1B:** Setup env var validation with Zod (.env schemas per app — api, pos, electron).  
* \[x\] **1.2:** Initialize TurboRepo (turbo.json) for script orchestration.  
* \[x\] **1.3:** Setup packages/tsconfig with base TypeScript configurations for Node and React.  
* \[x\] **1.4:** Setup packages/types (Export empty index.ts for future API interfaces).  
* \[x\] **1.5:** Setup packages/schemas (Install Zod, export empty index.ts).  
* \[x\] **1.5A:** Setup packages/shared (Shared utilities and constants).  
* \[x\] **1.6:** Scaffold Backend API: Create apps/api with Node.js, Express, TypeScript, CORS, and Helmet.  
* \[x\] **1.7:** Scaffold POS Frontend: Create apps/pos using Vite (React \+ TypeScript).  
* \[x\] **1.8:** Setup Tailwind CSS and initialize shadcn/ui inside apps/pos.  
* \[x\] **1.9:** Scaffold Electron Wrapper: Setup apps/electron (Main process) and link it to serve apps/pos.  
* \[x\] **1.10:** Setup Vitest for unit and integration tests.  
* \[x\] **9.1:** Setup Playwright for E2E tests. (Deferred to Phase 9)
* \[x\] **9.2:** Test Auth flows (login, protected routes, PIN pad).  
* \[x\] **9.3-9.12:** Test routes, sidebar, 404 redirect, order lifecycle placeholders.

## **Phase 2: Core Database Schema (PostgreSQL \+ Prisma)**

*(Execute inside apps/api. Strictly use UUIDs for all primary keys)*

* \[x\] **2.1:** Initialize Prisma with PostgreSQL (provider \= "postgresql").  
* \[x\] **2.2:** Create Base Models: User (Role enum: Admin/Cashier/Captain, hashed PIN) and ActivityLog.  
* \[x\] **2.2A:** Create Authentication Models: RefreshToken, Session.  
* \[x\] **2.3:** Create Permission Models: Permission, RolePermission.  
* \[x\] **2.4:** Create Floor Models: Area (1:N) Table (Status enum: Available/Reserved/Occupied/KOT Pending/Billed).  
* \[x\] **2.5:** Create Menu Models: Category (1:N) Item. Add KOT Printer and Tax overrides.  
* \[x\] **2.6:** Create Variation Models: Item (1:N) ItemVariation.  
* \[x\] **2.7:** Create Printer Models: Printer, PrinterGroup, PrinterMapping, PrintJob.  
* \[x\] **2.8:** Create Customer Model: Customer (Phone with country code, Name).  
* \[x\] **2.9:** Create Order Models: Order (Status enum, Sync status), OrderItem (Status: New/Sent/Ready), KOT.  
* \[x\] **2.9A:** Create Discount Models: OrderDiscount, DiscountReason.  
* \[x\] **2.10:** Create Settings Model: StoreSettings (Single row for whitelabel config).  
* \[x\] **2.11:** Run Prisma Migration and create a Seed script (Admin user, Default Settings, Default Categories).  
* \[x\] **2.12:** Setup PostgreSQL automated backup strategy (pg_dump with cron/scheduled task).

## **Phase 3: Backend API (Express & Services)**

*(All APIs must use Zod validation from packages/schemas)*

* \[x\] **3.1:** Setup Global Error Handler & Logging (Winston) in Express.  
* \[x\] **3.1A:** Expose /api/v1/health endpoint on both Cloud and Local POS APIs.  
* \[x\] **3.2:** Build Auth API: /login (Argon2id verify) and Generate JWT (Access \+ Refresh tokens).  
* \[x\] **3.3:** Build Middleware: JWT Auth Validator & Role-Based Access Control (RBAC).  
* \[x\] **3.4:** Build Middleware: Activity Logger (Auto-logs POST/PUT/DELETE actions).  
* \[x\] **3.5:** Build Settings API & Employee CRUD API.  
* \[x\] **3.6:** Build Area & Table CRUD API.  
* \[x\] **3.7:** Build Menu API: Categories & Items CRUD (include variations).  
* \[x\] **3.8:** Build Customer API: Search by phone number (Typeahead logic).  
* \[x\] **3.9:** Build Order API: Create Draft, Fetch Active Table Order, Void Order, Refund Order.  
* \[x\] **3.10:** Build KOT API: Generate KOT number, update item status to 'Sent'.  
* \[x\] **3.11:** Build Cart API: Add/Remove items, update item-level/cart-level notes.  
* \[x\] **3.12:** Build Settlement API: Apply discounts, calculate total, log payment split, clear table.

## **Phase 4: POS Frontend Foundation**

* \[x\] **4.1:** Setup react-router-dom with a Protected Route wrapper.  
* \[x\] **4.2:** Setup Zustand Stores: useAuthStore (JWT/User state).  
* \[x\] **4.3:** Setup Zustand Stores: useCartStore (Active table ID and UI state).  
* \[x\] **4.4:** Setup TanStack Query (QueryClient) for API fetching.  
* \[x\] **4.5:** Build Global Layout: Collapsible Left Sidebar (Navigation & Current User).  
* \[x\] **4.6:** Build Global Layout: Footer Status Bar (Clock, Network Status, Sync Status, Notifications).  
* \[x\] **4.7:** Build Login Screen & PIN Pad Component.

## **Phase 5: POS Modules (UI & Logic)**

**Module 1: Tables**

* \[x\] **5.1.1:** Build Area Tabs/Filter component (Support multi-select areas).  
* \[x\] **5.1.2:** Build Table Card Component (Color logic based on status, show timer & subtotal).  
* \[x\] **5.1.3:** Build Table Grid Layout (Stack by Area if multiple selected).  
* \[x\] **5.1.4:** Add Quick Action Hover logic (Bill Print if unbilled, Settle if billed).
* \[x\] **5.2.1:** Scaffold the 10% (Table Switcher), 60% (Menu), 30% (Cart) split layout.  
* \[x\] **5.2.2:** Menu Panel: Search Bar (debounce, shortcode support) and Category Ribbon.  
* \[x\] **5.2.3:** Menu Panel: Item Grid mapping (No images, just text/price).  
* \[x\] **5.2.4:** Menu Panel: Variation Selection Modal (Popup before adding to cart).  
* \[x\] **5.2.5:** Cart Panel: Header with Table details & Customer Phone auto-search icon.  
* \[x\] **5.2.6:** Cart Panel: Item List (Grouped by KOT, show strikethrough for canceled, custom notes input).  
* \[x\] **5.2.7:** Cart Panel: Footer Math (Subtotal, Tax) & Action Buttons (KOT, Bill).  
* \[x\] **5.2.8:** Cart Panel: Table Locking logic (Disable if billed, Cashier PIN required to unlock).
* \[x\] **5.8.1:** Build Modal UI: Math column (Subtotal, Taxes, Discount Engine).  
* \[x\] **5.8.2:** Build Payment Entry column (Cash, Card, UPI inputs).  
* \[x\] **5.8.3:** Build logic: Exact change calculator.  
* \[x\] **5.8.4:** Connect Complete Settlement button to API, log audit, and close table.
* \[x\] **5.3.1:** Build Category setup form (Tax & Printer defaults).  
* \[x\] **5.3.2:** Build Item master-detail form (Basic Info, Overrides).  
* \[x\] **5.3.3:** Build dynamic Variations sub-table in Item form.
* \[x\] **5.4.1:** Orders Ledger: Data table with Running/Settled tabs and Details slide-out.  
* \[x\] **5.5.1:** Employees: Data table, RBAC toggles, and PIN assignment form.  
* \[x\] **5.6.1:** Settings: Business Details form, Tax Config, and Printer mapping UI.  
* \[x\] **5.7.1:** Activity Log: Read-only data table with filters.

## **Phase 6: Hardware & Native Integration**

* \[x\] **6.1:** Electron IPC: Create preload.ts bridge for secure React \<-\> Node communication.  
* \[x\] **6.2:** Network Setup: Setup mDNS in Express to broadcast akrdev-rms.local.  
* \[x\] **6.3:** Real-time Setup: Integrate Socket.IO server (Express) and client (React) for table color syncing & locking.  
* \[x\] **6.3A:** Build Table Locking Service (Acquire lock, Release lock, Lock timeout, Lock owner tracking).  
* \[x\] **6.4:** Build Print Service Layer.  
* \[x\] **6.5:** Build Printer Discovery Service.  
* \[x\] **6.6:** Build Printer Mapping Service.  
* \[x\] **6.7:** Build Print Queue Manager.  
* \[x\] **6.8:** Build KOT HTML Template Renderer.  
* \[x\] **6.9:** Build Bill HTML Template Renderer.  
* \[x\] **6.10:** Integrate Windows Print Spooler using Electron webContents.print(). Any printer with a Windows driver is supported — no ESC/POS dependency.  
* \[x\] **6.11:** Create IPC channel: print-kot.  
* \[x\] **6.12:** Create IPC channel: print-bill.  
* \[x\] **6.13:** Create Print History & Failed Print Tracking.

## Phase 7: Sync Engine & Local SQLite Queue

* [x] **7.1:** Setup SQLite Prisma schema (isolated for Electron).  
* [x] **7.2:** Create Sync Queue Model in SQLite.  
* [x] **7.3:** Create Offline Queue tables for unsynced actions.  
* [x] **7.4:** Create Sync Worker Service (background process to push to PostgreSQL).  
* [x] **7.5:** Store unsynced actions locally when offline.  
* [x] **7.6:** Sync queue to PostgreSQL when connectivity is restored.  
* [x] **7.7:** Create Retry Logic for failed syncs with exponential backoff.  
* [x] **7.8:** Create Sync Status tracking per record (Pending, Syncing, Synced, Failed).  
* [x] **7.9:** Build Conflict Resolution rules (Last-Write-Wins with timestamp comparison).  
* [x] **7.10:** Build Pending Sync dashboard indicators in the POS UI.

## Phase 8: Captain App (PWA)

* \[x\] **8.1:** Scaffold apps/captain (React PWA, hosted on Cloud VPS with Service Worker caching). Connects to Local POS when on same network, falls back to Cloud API automatically.  
* \[x\] **8.2:** Build Network Auto-Discovery logic (Try local mDNS API, fallback to Cloud).  
* \[x\] **8.3:** Build Mobile-Optimized Table Grid & Cart UI.  
* \[x\] **8.4:** Connect Socket.IO client to receive instant table updates.

## **Phase 9: Testing & QA**

* \[x\] **9.1:** Test Authentication flows.  
* \[x\] **9.2:** Test Order lifecycle.  
* \[x\] **9.3:** Test KOT generation.  
* \[x\] **9.4:** Test Settlement workflow.  
* \[x\] **9.5:** Test Printer workflows.  
* \[x\] **9.6:** Test Offline mode.  
* \[x\] **9.7:** Test Sync recovery.  
* \[x\] **9.8:** Test Role permissions.  
* \[x\] **9.9:** Test Captain App failover (Local → Cloud).