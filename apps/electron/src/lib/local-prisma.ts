import { PrismaClient } from '../generated/prisma/index.js'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import path from 'path'
import fs from 'fs'

function resolveDbPath(): string {
  // userData path is preferred (set by initDatabase before PrismaClient is created)
  if (process.env.SQLITE_DB_PATH) return process.env.SQLITE_DB_PATH

  // In packaged app, use app.getPath('userData')
  try {
    const { app } = require('electron')
    if (app?.isPackaged) {
      const userData = app.getPath('userData')
      const dbPath = path.join(userData, 'local.db')
      const seedPath = path.join(process.resourcesPath!, 'app.asar.unpacked', 'data', 'local.db')

      // Copy seed DB on first run
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

// Ensure the parent directory exists
const dbDir = path.dirname(dbPath)
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

const adapter = new PrismaLibSql({ url: `file:${dbPath}` })

const globalForPrisma = globalThis as unknown as {
  localPrisma: PrismaClient | undefined
}

export const localPrisma = globalForPrisma.localPrisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.localPrisma = localPrisma
}
