/**
 * Print History Service
 *
 * Query-only service for retrieving past print jobs.
 * Write operations go through printQueueService.
 */
import { localPrisma } from '../lib/local-prisma.js'

export const printHistoryService = {
  async getByOrderId(orderId: string) {
    return localPrisma.printHistory.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    })
  },

  async getByPrinterId(printerId: string, limit = 50) {
    return localPrisma.printHistory.findMany({
      where: { printerId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
  },

  async getByType(printType: string, limit = 50) {
    return localPrisma.printHistory.findMany({
      where: { printType },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
  },

  async getByDateRange(from: Date, to: Date) {
    return localPrisma.printHistory.findMany({
      where: {
        createdAt: { gte: from, lte: to },
      },
      include: { printer: true },
      orderBy: { createdAt: 'desc' },
    })
  },

  async getFailedJobs() {
    return localPrisma.printHistory.findMany({
      where: { status: 'Failed' },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })
  },

  async clearOldHistory(daysToKeep = 30) {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - daysToKeep)
    const result = await localPrisma.printHistory.deleteMany({
      where: { createdAt: { lt: cutoff }, status: { in: ['Completed', 'Failed'] } },
    })
    return result.count
  },
}
