import { PrismaClient } from '../../dist/generated/prisma/index.js'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  console.error('FATAL: DATABASE_URL environment variable is not set')
  process.exit(1)
}

let adapter: PrismaPg
try {
  adapter = new PrismaPg({ connectionString })
} catch (err) {
  console.error('FATAL: Failed to connect to database:', (err as Error).message)
  process.exit(1)
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
