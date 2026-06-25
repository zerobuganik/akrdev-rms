# **AKRDev RMS \- Master Tech Stack & Architecture**

## **1\. Core Architecture Strategy (Scalable & Cost-Effective)**

* **Deployment Model:** Modular Monolith.  
* **Small Restaurant Cost:** Extremely low. The backend (Node.js API \+ PWA assets) and Database (PostgreSQL) can run together on a single lightweight Linux VPS (e.g., $5-$10/month).  
* **Large Restaurant Scale:** Enterprise-ready. PostgreSQL seamlessly handles high transaction volumes, and Socket.IO efficiently manages dozens of concurrent Captain App connections without lag.  
* **Offline Resilience Strategy:** The Electron POS runs a local lightweight SQLite database *strictly as a queue/buffer*. If the internet drops, orders are saved to this local SQLite queue. Once reconnected, a background worker pushes them to the Cloud PostgreSQL master database.

## **2\. Monorepo Setup (Workspace)**

* **Tooling:** pnpm Workspaces \+ TurboRepo (Latest).  
* **Why:** Ensures the AI never hallucinates mismatched data structures across the stack.  
* **Shared Packages Structure:**  
  * /packages/types \- Shared TypeScript interfaces.  
  * /packages/schemas \- Shared Zod validation schemas.  
  * /packages/ui \- Shared UI components (React/Tailwind).  
  * /packages/shared \- Shared utilities and constants.

## **3\. Cloud Backend (Main Server)**

* **Runtime:** Node.js (Latest LTS, v22+).  
* **Framework:** Express.js (REST APIs).  
* **API Versioning:** All APIs must use versioning (e.g., /api/v1/orders, /api/v1/items, /api/v1/tables). Future versions must not break existing clients.  
* **Health Check:** Both Cloud and Local POS APIs expose /api/v1/health.  
* **Real-time Engine:** Socket.IO (For live table status updates across all connected devices).  
* **Master Database:** PostgreSQL (Latest Stable, v16+).  
* **ORM:** Prisma (Defines the database schema, handles migrations, prevents SQL injection).  
* **Authentication:** JWT (JSON Web Tokens). Short-lived access tokens \+ HTTP-only secure Refresh Tokens.

## **4\. Windows POS (Desktop Application)**

* **Framework:** Electron.js (Latest Stable \- Provides hardware access for printers).  
* **UI Core:** React 18 (built with Vite) \+ TypeScript.  
* **Styling:** Tailwind CSS \+ shadcn/ui (Provides fast, robust components without bloating the codebase).  
* **State Management:** Zustand (For managing the active Table Cart and UI state).  
* **Data Fetching & Caching:** TanStack Query (React Query v5+) \- Handles API calls and UI caching seamlessly.  
* **Forms & Validation:** React Hook Form \+ Zod.  
* **Local Services (Running inside POS):**  
  * Local Express API  
  * Local Socket.IO Server  
  * SQLite Queue Engine (via Prisma inside Electron)  
  * Print Queue Manager  
  * Sync Worker  
* **Printing Layer:**  
  * **Primary Engine:** Electron webContents.print() via Windows Print Spooler. Any printer with a Windows driver works — no ESC/POS dependency required.  
  * **Architecture:** Printer Adapter Pattern. Future printers can be added without changing core business logic.

## **5\. Captain App (Mobile Order Taker)**

* **Platform:** PWA (Progressive Web App).  
* **UI Core:** React \+ Vite \+ TypeScript \+ Tailwind CSS.  
* **Network Strategy (Auto-Switching):**  
  * **Connection Priority 1:** Local POS API (via mDNS Discovery on restaurant WiFi). Works without internet — only same-network LAN required.  
  * **Connection Priority 2:** Cloud API (via 4G/5G). Used only when Captain is on a different network. Requires POS to be online and synced to Cloud.  
  * *The app automatically switches between Local and Cloud connections without manual intervention.*  
* **Data Fetching:** TanStack Query \+ Socket.IO client.

## **6\. Coding Standards & Architecture Rules**

* **Architecture Pattern:** Feature-first architecture.  
* **Modularity:** One module \= one responsibility.  
* **UI Logic:** No business logic in React components.  
* **Controller Logic:** No database access directly in route controllers.  
* **Business Logic:** Services contain all business logic.  
* **Data Layer:** Repository layer strictly handles data access.  
* **Logging Standard:** Use structured logging (e.g., Winston or Pino). Log API errors, sync failures, print failures, authentication failures, and critical system events. Logs should be searchable and timestamped.  
* **Dependency Policy:**  
  * Use latest stable production releases.  
  * Avoid beta/alpha packages.  
  * Run security audits regularly.  
  * Remove unused dependencies.

## **7\. Environment & Security Rules (Strict)**

* **Secrets Storage:** Secrets must only exist in the VPS .env or the POS local .env. Never commit secrets or .env files to Git.  
* **No Hardcoding:** Never hardcode credentials, API keys, or business data. Payment gateways, SMS OTP providers, etc., must be fetched from the database or .env.  
* **Password & PIN Hashing:** ALL user PINs and passwords must be securely hashed. **Argon2id** (Preferred) must be used. Use bcrypt only if Argon2 is unavailable. Never store plain-text PINs.  
* **Database Backup Policy:**  
  * Daily PostgreSQL backup (pg_dump).  
  * Minimum 7 backup versions retained.  
  * Restore testing required periodically.  
* **API Security (Helmet & CORS):** Express APIs (both Cloud and Local) must use helmet for secure HTTP headers. CORS must be strictly configured to allow only authorized origins/local subnets.  
* **Rate Limiting:** Implement rate limiting on both Cloud and Local Express APIs to prevent spam, accidental looping, or DDoS attempts.  
* **Strict Typing & Validation:** ALL incoming API payloads MUST be validated using Zod schemas before processing to prevent payload injections or malicious data.  
* **Hardware Isolation:** ALL printer logic must be isolated in Electron's Main Process. The React frontend must only send print commands via securely bridged window.electron.ipcRenderer calls.  
* **Electron Security:**  
  * contextIsolation \= true  
  * sandbox \= true  
  * nodeIntegration \= false  
  * Disable remote module.  
  * Validate all IPC messages between main and renderer processes.