import { prisma } from '../../lib/prisma.js'
import { NotFoundError, UnauthorizedError, ValidationError } from '../../lib/errors.js'

export const orderService = {
  async create(data: {
    tableId: string; guestCount?: number; orderType?: 'DineIn' | 'Takeaway';
    customerId?: string; createdBy: string; note?: string
  }) {
    const table = await prisma.table.findUnique({ where: { id: data.tableId } })
    if (!table) throw new NotFoundError('Table')

    const user = await prisma.user.findUnique({ where: { id: data.createdBy } })
    if (!user) throw new UnauthorizedError('Please log in again.')

    const existingActive = await prisma.order.findFirst({
      where: { tableId: data.tableId, status: { notIn: ['Settled', 'Cancelled'] } },
      include: { items: { include: { item: true, variation: true } }, table: true },
    })
    if (existingActive) {
      return existingActive
    }

    const orderType = data.orderType ?? 'DineIn'
    const prefix = orderType === 'DineIn' ? 'D' : 'T'
    const year = new Date().getFullYear() % 100

    // Atomic counter increment via $transaction to prevent race conditions
    const displayId = await prisma.$transaction(async (tx) => {
      const counter = await tx.orderCounter.upsert({
        where: { year },
        create: { year, seq: 1 },
        update: { seq: { increment: 1 } },
      })
      return `${prefix}/${year}/${counter.seq}`
    })

    const order = await prisma.order.create({
      data: {
        displayId,
        tableId: data.tableId,
        guestCount: data.guestCount ?? 2,
        orderType,
        customerId: data.customerId,
        createdBy: data.createdBy,
        note: data.note,
      },
      include: { items: { include: { item: true, variation: true } }, table: true },
    })
    // Don't set occupied until KOT is sent
    return order
  },

  async getActiveForTable(tableId: string) {
    return prisma.order.findFirst({
      where: { tableId, status: { notIn: ['Settled', 'Cancelled'] } },
      include: { items: { include: { item: true, variation: true, cancelledByUser: { select: { name: true } } } }, table: true, customer: true, kots: { include: { sentByUser: { select: { name: true } } } }, discounts: true, settlement: true },
    })
  },

  async list(filters: { status?: string; date?: string; areaId?: string }) {
    const where: Record<string, unknown> = {}
    if (filters.status) where.status = filters.status
    if (filters.areaId) where.table = { areaId: filters.areaId }
    if (filters.date) {
      const date = new Date(filters.date)
      where.createdAt = { gte: new Date(date.setHours(0, 0, 0, 0)), lte: new Date(date.setHours(23, 59, 59, 999)) }
    }
    return prisma.order.findMany({
      where,
      include: { items: { include: { item: true } }, table: { include: { area: true } }, customer: true, kots: true, settlement: true },
      orderBy: { createdAt: 'desc' },
    })
  },

  async findById(id: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { item: true, variation: true } },
        table: { include: { area: true } },
        customer: true,
        kots: true,
        discounts: true,
        settlement: true,
        createdByUser: { select: { name: true } },
      },
    })
    if (!order) throw new NotFoundError('Order')
    return order
  },

  async update(id: string, data: Partial<{ status: string; note: string; guestCount: number }>) {
    const order = await prisma.order.findUnique({ where: { id } })
    if (!order) throw new NotFoundError('Order')
    // Block modifications to settled orders
    if (order.status === 'Settled') throw new ValidationError('Cannot modify a settled order')
    if (order.status === 'Cancelled') throw new ValidationError('Cannot modify a cancelled order')
    // Allow Bill_Printed to transition back to KOT_Sent (for reprint/modify) OR to Settled
    if (order.status === 'Bill_Printed' && data.status && data.status !== 'Settled' && data.status !== 'KOT_Sent') {
      throw new ValidationError('Billed order can only be settled or re-opened')
    }
    const updated = await prisma.order.update({
      where: { id },
      data: data as Record<string, unknown>,
      include: { items: { include: { item: true, variation: true } }, table: true, kots: true, discounts: true, customer: true },
    })
    if (data.status === 'Bill_Printed') {
      if (order.tableId) {
        await prisma.table.update({ where: { id: order.tableId }, data: { status: 'Billed' } })
      }
    }
    if (data.status === 'KOT_Sent' && order.status === 'Bill_Printed') {
      if (order.tableId) {
        await prisma.table.update({ where: { id: order.tableId }, data: { status: 'Occupied' } })
      }
    }
    return updated
  },

  async void(id: string) {
    const order = await prisma.order.findUnique({ where: { id } })
    if (!order) throw new NotFoundError('Order')
    if (order.status === 'Settled') throw new ValidationError('Cannot void a settled order')
    if (order.status === 'Cancelled') throw new ValidationError('Order is already cancelled')

    await prisma.order.update({ where: { id }, data: { status: 'Cancelled' } })
    if (order.tableId) {
      await prisma.table.update({ where: { id: order.tableId }, data: { status: 'Available' } })
    }
  },

  async refund(id: string) {
    const order = await prisma.order.findUnique({ where: { id } })
    if (!order) throw new NotFoundError('Order')
    if (order.status !== 'Settled') throw new ValidationError('Can only refund settled orders')

    await prisma.$transaction([
      prisma.order.update({ where: { id }, data: { status: 'Cancelled', syncStatus: 'Pending' } }),
      ...(order.tableId ? [prisma.table.update({ where: { id: order.tableId }, data: { status: 'Available' } })] : []),
    ])
  },

  async listTakeawayActive() {
    return prisma.order.findMany({
      where: { orderType: 'Takeaway', status: { notIn: ['Settled', 'Cancelled'] } },
      include: {
        items: { include: { item: true, variation: true } },
        kots: true,
        discounts: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  },
}
