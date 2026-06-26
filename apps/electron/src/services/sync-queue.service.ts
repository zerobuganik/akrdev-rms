import { localPrisma } from '../lib/local-prisma.js'

type SyncAction = 'create-order' | 'add-item' | 'remove-item' | 'send-kot' | 'settle' | string

interface SyncRecord {
  action: string
  payload: Record<string, unknown>
}

export class SyncQueueService {
  async enqueue(action: string, payload: Record<string, unknown>) {
    return localPrisma.syncQueue.create({
      data: {
        action,
        payload: JSON.stringify(payload),
        status: 'Pending',
      },
    })
  }

  async getPending(): Promise<Awaited<ReturnType<typeof localPrisma.syncQueue.findMany>>> {
    return localPrisma.syncQueue.findMany({
      where: {
        status: { in: ['Pending', 'Retrying'] },
        OR: [
          { retryAt: null },
          { retryAt: { lte: new Date() } },
        ],
      },
      orderBy: { createdAt: 'asc' },
      take: 10,
    })
  }

  async markProcessing(id: string) {
    await localPrisma.syncQueue.update({
      where: { id },
      data: { status: 'Syncing' },
    })
  }

  async markSynced(id: string) {
    await localPrisma.syncQueue.update({
      where: { id },
      data: { status: 'Synced' },
    })
    await this.updateState()
  }

  async markFailed(id: string, error: string, backoffMs: number) {
    await localPrisma.syncQueue.update({
      where: { id },
      data: {
        status: 'Retrying',
        retryCount: { increment: 1 },
        retryAt: new Date(Date.now() + backoffMs),
        error,
      },
    })
    await localPrisma.syncState.upsert({
      where: { id: 'singleton' },
      update: { backoffMs },
      create: { id: 'singleton', backoffMs },
    })
  }

  async getFailedCount(): Promise<number> {
    return localPrisma.syncQueue.count({ where: { status: { in: ['Pending', 'Retrying'] } } })
  }

  async getState() {
    const state = await localPrisma.syncState.findUnique({ where: { id: 'singleton' } })
    return state ?? { id: 'singleton', lastSyncAt: null, pendingCount: 0, syncInProgress: false, cloudAvailable: true, backoffMs: 1000 }
  }

  async setSyncInProgress(inProgress: boolean) {
    await localPrisma.syncState.upsert({
      where: { id: 'singleton' },
      update: { syncInProgress: inProgress },
      create: { id: 'singleton', syncInProgress: inProgress },
    })
  }

  async isSyncInProgress(): Promise<boolean> {
    const state = await this.getState()
    return state.syncInProgress
  }

  private async updateState() {
    const pendingCount = await this.getFailedCount()
    await localPrisma.syncState.upsert({
      where: { id: 'singleton' },
      update: { pendingCount, lastSyncAt: new Date() },
      create: { id: 'singleton', pendingCount, lastSyncAt: new Date() },
    })
  }

  async setCloudAvailable(available: boolean) {
    await localPrisma.syncState.upsert({
      where: { id: 'singleton' },
      update: { cloudAvailable: available },
      create: { id: 'singleton', cloudAvailable: available },
    })
  }

  async clearCompleted() {
    await localPrisma.syncQueue.deleteMany({ where: { status: 'Synced' } })
  }
}

export const syncQueueService = new SyncQueueService()
