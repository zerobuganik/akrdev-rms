/**
 * Print Queue Service
 *
 * Manages the local print job queue with retry capability.
 * Failed print jobs are retried with exponential backoff.
 */
import { localPrisma } from '../lib/local-prisma.js'

const MAX_RETRIES = 3
const BASE_DELAY_MS = 2_000

export interface PrintJob {
  id: string
  printerId: string
  printType: string
  orderId: string | null
  tableName: string | null
  status: string
  retryCount: number
  error: string | null
}

export const printQueueService = {
  async enqueue(printerId: string, printType: string, orderId?: string, tableName?: string): Promise<PrintJob> {
    return localPrisma.printHistory.create({
      data: {
        printerId,
        printType,
        orderId: orderId ?? null,
        tableName: tableName ?? null,
        status: 'Pending',
      },
    }) as unknown as PrintJob
  },

  async markCompleted(id: string): Promise<void> {
    await localPrisma.printHistory.update({
      where: { id },
      data: { status: 'Completed' },
    })
  },

  async markFailed(id: string, error: string): Promise<void> {
    const job = await localPrisma.printHistory.findUnique({ where: { id } })
    if (!job) return

    const newRetryCount = job.retryCount + 1
    const status = newRetryCount >= MAX_RETRIES ? 'Failed' : 'Retrying'

    await localPrisma.printHistory.update({
      where: { id },
      data: {
        status,
        retryCount: newRetryCount,
        error,
      },
    })
  },

  async getRetryDelay(retryCount: number): Promise<number> {
    return Math.min(BASE_DELAY_MS * Math.pow(2, retryCount), 30_000)
  },

  async getStats(): Promise<{
    total: number
    completed: number
    failed: number
    pending: number
  }> {
    const [total, completed, failed, pending] = await Promise.all([
      localPrisma.printHistory.count(),
      localPrisma.printHistory.count({ where: { status: 'Completed' } }),
      localPrisma.printHistory.count({ where: { status: 'Failed' } }),
      localPrisma.printHistory.count({ where: { status: { in: ['Pending', 'Retrying'] } } }),
    ])
    return { total, completed, failed, pending }
  },

  async getRecentHistory(limit = 50): Promise<PrintJob[]> {
    return localPrisma.printHistory.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    }) as unknown as PrintJob[]
  },
}
