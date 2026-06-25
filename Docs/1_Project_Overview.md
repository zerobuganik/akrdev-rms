# **AKRDev RMS \- Master Project Overview**

## **1\. Project Identity**

**Project Name:** AKRDev RMS (Restaurant Management System)

**System Type:** Local-First POS with Cloud Fallback.

**Deployment Model:** Single-Client Deployment. Every client gets their own dedicated VPS, PostgreSQL database, and Windows POS installation. **This is NOT a multi-tenant SaaS.**

**Deployment Goal:** Highly cost-effective and easy to deploy. Backend runs on a lightweight Linux VPS, while the local POS handles heavy lifting to ensure uninterrupted single-branch operations.

## **2\. Core Architecture & Connection Strategy**

This document is the absolute source of truth for all AI code generation.

* **Local-First (Primary Operation):** The Windows POS (Electron) is the central hub. It runs a local Express API. The Captain App (PWA) must **always try to connect to the Local POS API first** over the restaurant's WiFi.  
* **Cloud Fallback (Auto-Switching):** If the Local POS is unavailable (e.g., PC offline, WiFi down), the Captain App will automatically and seamlessly switch to the Cloud API using 4G/5G. **No manual switching by the user.**  
* **Local POS Discovery:** The Captain App must automatically discover the POS on the local network.  
  * Discovery Priority:  
    1. Auto-discover POS via mDNS / Zeroconf  
    2. Use previously connected POS  
    3. Scan local network for AKRDev POS service  
    4. Fallback to Cloud API  
  * No manual IP entry should be required during normal operation.  
* **POS Service Advertisement:** The POS must broadcast itself on the local network (e.g., akrdev-rms.local). The Captain App automatically detects and connects to the POS.  
* **First-Time Pairing:** Only during initial setup:  
  * QR code pairing  
  * Manual pairing code  
  * After pairing: Captain App remembers the restaurant, and future connections happen automatically.  
* **Master Print Server:** The Windows POS is the *only* print server. The Captain App cannot print directly. All KOT and Bill print requests from the Captain App are routed through the POS API. Support category-wise and item-wise KOT printer routing.  
  * **Printer Queue Rules:** Printing must strictly use a background queue system. The POS UI must *never* freeze while printing. Failed print jobs must be logged and retryable. Print history must be stored locally.  
* **True White-Labeling:** ALL integrations (Payment Gateways, OTP SMS, Maps) and business details must be configurable via the POS Settings UI and saved to the database. **Never hardcode API keys or business data.**

## **3\. System Architecture Diagram**

\[ CLOUD VPS (Single Client Server) \]  
├── Node.js / Express.js API  
└── PostgreSQL (Master Database)  
       ^                 ^  
       | (Sync Engine)   | (2. Fallback: If Local WiFi fails,   
       v                 |     Captain App uses 4G/5G to reach Cloud API)  
\[ WINDOWS POS \]          |  
├── Local Express API \< \- \- \- \- \- \[ CAPTAIN APP (PWA) \]  
├── Electron UI                   (1. Primary: Captain App connects   
├── SQLite Queue                   directly to POS via Local WiFi)  
└── Print Spooler        
       |  
       v (Local USB/LAN)  
\[ LOCAL PRINTERS \]  
├── Billing Printer (Front Desk)  
├── Kitchen 1 (e.g., Starters)  
└── Kitchen 2 (e.g., Main Course)

**Connection Logic:**

Captain App \-\> Try Local POS API \-\> If Local Not Found \-\> Cloud API

## **4\. Database & Sync Engine Rules**

* **Master vs. Cache:** PostgreSQL (Cloud) is the primary source of truth. When internet is unavailable, POS continues operating locally and synchronizes automatically when connectivity returns. SQLite (Windows POS) is strictly used as an offline queue and fast local cache.  
* **Strict UUID Requirement:** To prevent ID collisions during sync, **UUIDs (v4)** must be used as primary keys for ALL important records: Orders, KOTs, Bills, Employees, Items, Categories, and Tables.  
* **Auto-Sync Logic:** The POS must automatically sync pending records to the Cloud when internet is available.  
* **Data Integrity:** The sync engine must prevent duplicate records and automatically retry failed syncs.

## **5\. Order Lifecycle**

Every order must strictly flow through these statuses:

1. **Draft** (Building the cart)  
2. **KOT Sent / Preparing** (Fired to kitchen and accepted)  
3. **Ready** (Food prepared)  
4. **Bill Printed** (Check given to customer)  
5. **Settled** (Payment received)  
6. **Synced** (Successfully pushed to Cloud PostgreSQL)

## **6\. Core POS Modules**

1. **Tables:** Visual floor plan, real-time status syncing.  
2. **Items:** Menu setup, categories, variation engine, tax rules, and specific KOT printer routing.  
3. **Order:** Master ledger for running and settled orders.  
   * **Order Sync Status:** Every order must strictly track its offline/online state (Pending Sync, Syncing, Synced, Sync Failed). The UI must clearly display this sync status.  
4. **Employee & Role Permissions:** Secure PIN logins and role-based access control. **Every action must be permission-based.**  
   * Examples: Captains cannot settle bills or modify settings; Cashiers can settle bills; Admins have full access.  
   * Permissions must be configurable and database-driven.  
   * **Settlement Rules:**  
     * **Only POS can:** Settle bills, Accept payments, Clear tables, Void bills.  
     * **Captain App can:** Create orders, Modify orders, Send KOT, Request bill print. (Captain App cannot settle orders).  
5. **Activity Log:** Immutable audit trail. Logs cannot be deleted. Must capture: *Timestamp, User, Module, Action, Old Value, New Value*.  
6. **Settings:** White-label hub. Business details, local network settings, printer mapping, and API configurations.

## **7\. AI Development & Architectural Rules**

* **Module Independence:** Modules must remain strictly isolated. Avoid direct module-to-module dependencies.  
* **Communication:** Inter-module communication should happen strictly through services or an event emitter.  
* **Service-Layer Architecture:** Business logic must live in a service layer, not directly inside UI components or route controllers.  
* **Strict Typing:** Use TypeScript everywhere. Share types between POS, Cloud Backend, and Captain App via a monorepo package.  
* **Database Access:** Only use Prisma for database interactions. Never write raw SQL unless absolutely necessary for a complex query.  
* **Focus:** Never modify unrelated modules when executing a specific task.

## **8\. Roadmap & Phases**

**Phase 1 (Current Focus):**

* Full-fledged Windows POS (Local-First API host).  
* Captain App (PWA with Auto-switching Local \-\> Cloud connection).  
* Order Types: Dine-In and Takeaway.  
* Multi-Kitchen KOT Routing & Bill Printing.

**Phase 2 (Future Additions \- Keep codebase prepared):**

* **Future Inventory Compatibility:** Ensure the database structure remains logically compatible with future additions of Inventory, Recipe Management, Stock Deduction, and Purchase Management.  
* Delivery Order Workflow.  
* Multi-branch Owner Dashboard.  
* Customer-facing User App & Website.