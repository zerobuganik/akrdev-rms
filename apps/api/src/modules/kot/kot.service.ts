import { prisma } from '../../lib/prisma.js'
import { NotFoundError, ValidationError } from '../../lib/errors.js'

export const kotService = {
  async send(orderId: string, sentBy: string) {
    const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: { include: { item: true } }, table: true } })
    if (!order) throw new NotFoundError('Order')
    if (order.items.length === 0) throw new ValidationError('Order has no items')

    const lastKot = await prisma.kOT.findFirst({
      where: { orderId },
      orderBy: { kotNumber: 'desc' },
      select: { kotNumber: true },
    })
    const nextKotNumber = (lastKot?.kotNumber ?? 0) + 1

    const newItems = order.items.filter(i => i.status === 'New')
    if (newItems.length === 0) {
      throw new ValidationError('No new items to send to kitchen')
    }

    const kot = await prisma.kOT.create({
      data: { orderId, kotNumber: nextKotNumber, sentBy },
    })

    // Update items and order status
    await Promise.all([
      ...newItems.map(item =>
        prisma.orderItem.update({
          where: { id: item.id },
          data: { status: 'Sent', kotId: kot.id },
        }),
      ),
      prisma.order.update({
        where: { id: orderId },
        data: { status: 'KOT_Sent' },
      }),
    ])
    if (order.tableId) {
      await prisma.table.update({
        where: { id: order.tableId },
        data: { status: 'Occupied' },
      })
    }

    return { kotId: kot.id, kotNumber: nextKotNumber, itemsSent: newItems.length }
  },

  async sendWithItems(data: Record<string, unknown>, sentBy: string) {
    const { tableId, guestCount, orderType, note, items } = data as {
      tableId?: string; guestCount: number; orderType?: string; note?: string
      items: Array<{ itemId: string; itemName: string; variationId?: string; variationName?: string; quantity: number; unitPrice: number; note?: string }>
    }

    let order
    if (tableId) {
      const existingActive = await prisma.order.findFirst({
        where: { tableId: tableId as string, status: { notIn: ['Settled', 'Cancelled'] } },
      })
      if (existingActive) {
        order = existingActive
        order = await prisma.order.update({
          where: { id: order.id },
          data: { status: 'KOT_Sent', guestCount: guestCount ?? existingActive.guestCount, note: note ?? existingActive.note },
        })
      }
    }

    if (!order) {
      order = await prisma.order.create({
        data: {
          tableId: (tableId as string) ?? null,
          guestCount: guestCount ?? 2,
          orderType: (orderType ?? 'DineIn') as 'DineIn' | 'Takeaway',
          status: 'KOT_Sent',
          note: note ?? null,
          subtotal: 0,
          taxTotal: 0,
          discountTotal: 0,
          grandTotal: 0,
          createdBy: sentBy,
        },
      })
    }

    const lastKot = await prisma.kOT.findFirst({
      where: { orderId: order.id },
      orderBy: { kotNumber: 'desc' },
      select: { kotNumber: true },
    })
    const nextKotNumber = (lastKot?.kotNumber ?? 0) + 1

    const kot = await prisma.kOT.create({
      data: { orderId: order.id, kotNumber: nextKotNumber, sentBy },
    })

    const createdItems: Array<{ id: string; lineTotal: number }> = []
    for (const item of items) {
      const oi = await prisma.orderItem.create({
        data: {
          orderId: order.id,
          itemId: item.itemId,
          quantity: item.quantity ?? 1,
          unitPrice: item.unitPrice ?? 0,
          lineTotal: (item.unitPrice ?? 0) * (item.quantity ?? 1),
          variationId: item.variationId ?? null,
          status: 'Sent',
          kotId: kot.id,
          note: item.note ?? null,
        },
      })
      createdItems.push({ id: oi.id, lineTotal: oi.lineTotal })
    }

    const newItemsSubtotal = createdItems.reduce((s, i) => s + i.lineTotal, 0)
    const existingSubtotal = await prisma.orderItem.aggregate({
      where: { orderId: order.id, status: { not: 'Cancelled' }, id: { notIn: createdItems.map(i => i.id) } },
      _sum: { lineTotal: true },
    })
    const subtotal = newItemsSubtotal + (existingSubtotal._sum.lineTotal ?? 0)
    await prisma.order.update({
      where: { id: order.id },
      data: { subtotal, grandTotal: subtotal },
    })

    if (tableId) {
      await prisma.table.update({ where: { id: tableId as string }, data: { status: 'Occupied' } }).catch(() => {})
    }

    return { orderId: order.id, kotNumber: nextKotNumber, itemsSent: createdItems.length }
  },
}
