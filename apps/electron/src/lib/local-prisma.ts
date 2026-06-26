import { PrismaClient } from '../generated/prisma/index.js'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import path from 'path'
import fs from 'fs'

function resolveDbPath(): string {
  if (process.env.SQLITE_DB_PATH) return process.env.SQLITE_DB_PATH

  try {
    const { app } = require('electron')
    if (app?.isPackaged) {
      const userData = app.getPath('userData')
      const dbPath = path.join(userData, 'local.db')
      const seedPath = path.join(process.resourcesPath!, 'app.asar.unpacked', 'data', 'local.db')

      if (!fs.existsSync(dbPath) && fs.existsSync(seedPath)) {
        fs.mkdirSync(path.dirname(dbPath), { recursive: true })
        fs.copyFileSync(seedPath, dbPath)
      }

      return dbPath
    }
  } catch { /* not in Electron context */ }

  return path.join(process.cwd(), 'data', 'local.db')
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
    `CREATE TABLE IF NOT EXISTS "cached_settings" (
      "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default', "data" TEXT
    )`,
  ]
  for (const sql of tables) {
    try { await localPrisma.$executeRawUnsafe(sql) } catch { /* ignore */ }
  }
  console.log('[local-prisma] Ensured local tables exist')
}
ensureTables().catch(() => {})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.localPrisma = localPrisma
}
