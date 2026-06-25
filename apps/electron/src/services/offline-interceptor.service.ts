import { localPrisma } from '../lib/local-prisma.js'
import { syncQueueService } from './sync-queue.service.js'

export async function saveOrderLocally(data: {
  id: string
  tableId: string
  tableName: string
  guestCount: number
  orderType: string
}) {
  return localPrisma.localOrder.create({ data })
}

export async function getLocalOrder(id: string) {
  return localPrisma.localOrder.findUnique({
    where: { id },
    include: { items: true, kots: true, settlement: true },
  })
}

export async function getLocalOrderForTable(tableId: string) {
  return localPrisma.localOrder.findFirst({
    where: { tableId, status: { not: 'Settled' } },
    include: { items: true, kots: true },
  })
}

export async function addItemLocally(orderId: string, data: {
  itemId: string; itemName: string; unitPrice: number; quantity: number; lineTotal: number; variationId?: string; variationName?: string
}) {
  const item = await localPrisma.localOrderItem.create({
    data: { orderId, ...data },
  })
  return item
}

export async function removeItemLocally(orderItemId: string) {
  await localPrisma.localOrderItem.update({
    where: { id: orderItemId },
    data: { status: 'Cancelled', lineTotal: 0 },
  })
}

export async function saveKOTLocally(orderId: string, kotNumber: number, sentBy: string) {
  return localPrisma.localKOT.create({ data: { orderId, kotNumber, sentBy } })
}

export async function saveSettlementLocally(data: {
  orderId: string
  subtotal: number; taxTotal: number; discountTotal: number; grandTotal: number
  cashPaid: number; cardPaid: number; upiPaid: number
  discountType?: string; discountValue?: number; discountReason?: string
  changeGiven: number
}) {
  const settlement = await localPrisma.localSettlement.create({ data })
  await localPrisma.localOrder.update({
    where: { id: data.orderId },
    data: { status: 'Settled' },
  })
  return settlement
}

export async function queueForSync(action: string, payload: Record<string, unknown>) {
  await syncQueueService.enqueue(action as Parameters<typeof syncQueueService.enqueue>[0], payload)
}

export async function getSyncStats() {
  const state = await syncQueueService.getState()
  const pendingCount = await syncQueueService.getFailedCount()
  return {
    lastSyncAt: state?.lastSyncAt?.toISOString() ?? null,
    pendingCount,
    cloudAvailable: state?.cloudAvailable ?? false,
  }
}

export function resolveConflict(localItem: { updatedAt: Date }, remoteItem: { updatedAt: Date }): 'local' | 'remote' {
  return localItem.updatedAt >= remoteItem.updatedAt ? 'local' : 'remote'
}
