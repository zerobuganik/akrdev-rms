import { PrismaClient } from '../generated/prisma/index.js'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import path from 'path'
import fs from 'fs'

function resolveDbPath(): string {
  try {
    const { app } = require('electron')
    if (app?.isPackaged) {
      const userData = app.getPath('userData')
      const dbPath = path.join(userData, 'local.db')
      // On first run, the DB is created fresh by Prisma — no need to copy a seed
      fs.mkdirSync(userData, { recursive: true })
      return dbPath
    }
    // Dev mode — use app.getPath('userData') goes to %APPDATA%/Electron or similar. Better to use project data/
    return process.env.SQLITE_DB_PATH || path.join(process.cwd(), 'data', 'local.db')
  } catch {
    // Not in Electron context (e.g., running as standalone Node for dev/test)
    return process.env.SQLITE_DB_PATH || path.join(process.cwd(), 'data', 'local.db')
  }
}

const dbPath = resolveDbPath()

const dbDir = path.dirname(dbPath)
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

const adapter = new PrismaLibSql({ url: `file:${dbPath}` })

const globalForPrisma = globalThis as unknown as {
  localPrisma: PrismaClient | undefined
}

export const localPrisma = globalForPrisma.localPrisma ?? new PrismaClient({ adapter })

export async function ensureTables() {
  const tables = [
    `CREATE TABLE IF NOT EXISTS "local_credentials" (
      "id" TEXT NOT NULL PRIMARY KEY, "phone" TEXT NOT NULL UNIQUE,
      "passwordHash" TEXT NOT NULL, "pinHash" TEXT,
      "name" TEXT NOT NULL DEFAULT 'Admin',
      "role" TEXT NOT NULL DEFAULT 'Admin', "imageUrl" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS "cached_tables" (
      "id" TEXT NOT NULL PRIMARY KEY, "name" TEXT NOT NULL,
      "areaId" TEXT, "areaName" TEXT, "capacity" INTEGER DEFAULT 4,
      "status" TEXT DEFAULT 'Available'
    )`,
    `CREATE TABLE IF NOT EXISTS "cached_items" (
      "id" TEXT NOT NULL PRIMARY KEY, "name" TEXT NOT NULL,
      "basePrice" REAL, "inStock" INTEGER DEFAULT 1,
      "categoryId" TEXT, "categoryName" TEXT,
      "variations" TEXT DEFAULT '[]', "imageUrl" TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS "cached_areas" (
      "id" TEXT NOT NULL PRIMARY KEY, "name" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS "cached_categories" (
      "id" TEXT NOT NULL PRIMARY KEY, "name" TEXT NOT NULL,
      "defaultTaxPercent" REAL DEFAULT 0,
      "displayOrder" INTEGER DEFAULT 0,
      "imageUrl" TEXT, "kitchenId" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS "cached_settings" (
      "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default', "data" TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS "cached_tax_slabs" (
      "id" TEXT NOT NULL PRIMARY KEY, "name" TEXT NOT NULL,
      "percent" REAL NOT NULL, "isDefault" BOOLEAN NOT NULL DEFAULT false,
      "isActive" BOOLEAN NOT NULL DEFAULT true
    )`,
    `CREATE TABLE IF NOT EXISTS "cached_customers" (
      "id" TEXT NOT NULL PRIMARY KEY, "phone" TEXT NOT NULL UNIQUE,
      "name" TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS "printer_configs" (
      "id" TEXT NOT NULL PRIMARY KEY, "name" TEXT NOT NULL,
      "displayName" TEXT NOT NULL, "type" TEXT NOT NULL,
      "connection" TEXT NOT NULL, "address" TEXT,
      "vendorId" INTEGER, "productId" INTEGER,
      "paperWidth" INTEGER NOT NULL DEFAULT 80,
      "isDefault" BOOLEAN NOT NULL DEFAULT false,
      "isActive" BOOLEAN NOT NULL DEFAULT true,
      "isKitchen" BOOLEAN NOT NULL DEFAULT false,
      "isBilling" BOOLEAN NOT NULL DEFAULT false,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS "print_history" (
      "id" TEXT NOT NULL PRIMARY KEY, "printerId" TEXT NOT NULL,
      "printType" TEXT NOT NULL, "orderId" TEXT,
      "tableName" TEXT, "payload" TEXT,
      "status" TEXT NOT NULL DEFAULT 'Pending',
      "retryCount" INTEGER NOT NULL DEFAULT 0, "error" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("printerId") REFERENCES "printer_configs"("id") ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS "local_orders" (
      "id" TEXT NOT NULL PRIMARY KEY, "tableId" TEXT,
      "tableName" TEXT, "customerId" TEXT,
      "customerPhone" TEXT, "guestCount" INTEGER NOT NULL DEFAULT 2,
      "status" TEXT NOT NULL DEFAULT 'Draft',
      "syncStatus" TEXT NOT NULL DEFAULT 'Pending',
      "subtotal" REAL NOT NULL DEFAULT 0, "taxTotal" REAL NOT NULL DEFAULT 0,
      "discountTotal" REAL NOT NULL DEFAULT 0, "grandTotal" REAL NOT NULL DEFAULT 0,
      "orderType" TEXT NOT NULL DEFAULT 'DineIn', "note" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS "local_order_items" (
      "id" TEXT NOT NULL PRIMARY KEY, "orderId" TEXT NOT NULL,
      "itemId" TEXT NOT NULL, "itemName" TEXT NOT NULL,
      "variationId" TEXT, "variationName" TEXT,
      "kotId" TEXT, "quantity" INTEGER NOT NULL DEFAULT 1,
      "unitPrice" REAL NOT NULL, "lineTotal" REAL NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'New', "note" TEXT,
      "cancelledAt" TEXT, "cancelledBy" TEXT,
      FOREIGN KEY ("orderId") REFERENCES "local_orders"("id") ON DELETE CASCADE,
      FOREIGN KEY ("kotId") REFERENCES "local_kots"("id")
    )`,
    `CREATE TABLE IF NOT EXISTS "local_kots" (
      "id" TEXT NOT NULL PRIMARY KEY, "orderId" TEXT NOT NULL,
      "kotNumber" INTEGER NOT NULL, "sentAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "sentBy" TEXT NOT NULL,
      FOREIGN KEY ("orderId") REFERENCES "local_orders"("id") ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS "local_settlements" (
      "id" TEXT NOT NULL PRIMARY KEY, "orderId" TEXT NOT NULL UNIQUE,
      "subtotal" REAL NOT NULL, "taxTotal" REAL NOT NULL,
      "discountTotal" REAL NOT NULL, "grandTotal" REAL NOT NULL,
      "cashPaid" REAL NOT NULL DEFAULT 0, "cardPaid" REAL NOT NULL DEFAULT 0,
      "upiPaid" REAL NOT NULL DEFAULT 0, "discountType" TEXT,
      "discountValue" REAL, "discountReason" TEXT,
      "changeGiven" REAL NOT NULL DEFAULT 0,
      "settledAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("orderId") REFERENCES "local_orders"("id") ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS "sync_queue" (
      "id" TEXT NOT NULL PRIMARY KEY, "action" TEXT NOT NULL,
      "payload" TEXT NOT NULL, "status" TEXT NOT NULL DEFAULT 'Pending',
      "retryCount" INTEGER NOT NULL DEFAULT 0, "retryAt" DATETIME,
      "error" TEXT, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS "sync_state" (
      "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
      "lastSyncAt" DATETIME, "pendingCount" INTEGER NOT NULL DEFAULT 0,
      "syncInProgress" BOOLEAN NOT NULL DEFAULT false,
      "cloudAvailable" BOOLEAN NOT NULL DEFAULT true,
      "backoffMs" INTEGER NOT NULL DEFAULT 1000,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
  ]
  for (const sql of tables) {
    try { await localPrisma.$executeRawUnsafe(sql) } catch (err) {
      console.error(`[local-prisma] Failed to execute: ${sql.slice(0, 80)}... — ${(err as Error).message}`)
    }
  }
  // Migration: add the payload column to print_history for existing databases.
  try {
    await localPrisma.$executeRawUnsafe(`ALTER TABLE "print_history" ADD COLUMN "payload" TEXT`)
  } catch {
    // Column already exists — safe to ignore.
  }
  console.log('[local-prisma] Ensured local tables exist')
}

export const tablesReady = ensureTables()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.localPrisma = localPrisma
}
