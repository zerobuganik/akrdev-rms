import { PrismaClient } from '../generated/prisma/index.js'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import path from 'path'

const dbPath = process.env.SQLITE_DB_PATH ?? path.join(process.cwd(), 'data', 'local.db')

const adapter = new PrismaLibSql({ url: `file:${dbPath}` })

const globalForPrisma = globalThis as unknown as {
  localPrisma: PrismaClient | undefined
}

export const localPrisma = globalForPrisma.localPrisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.localPrisma = localPrisma
}
