import { prisma } from '../../lib/prisma.js'
import { NotFoundError, ValidationError } from '../../lib/errors.js'
import { calculateTax, calculateRounding } from '@akrdev/shared'

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
    const { tableId, guestCount, orderType, note, items, orderId: providedOrderId, kotId: providedKotId } = data as {
      tableId?: string; guestCount: number; orderType?: string; note?: string; orderId?: string; kotId?: string
      items: Array<{ itemId: string; itemName: string; id?: string; variationId?: string; variationName?: string; quantity: number; unitPrice: number; note?: string }>
    }

    let order: any
    const result = await prisma.$transaction(async (tx) => {
      if (tableId) {
        const existingActive = await tx.order.findFirst({
          where: { tableId: tableId as string, status: { notIn: ['Settled', 'Cancelled'] } },
          select: { id: true },
        })
        if (existingActive) {
          order = await tx.order.update({
            where: { id: existingActive.id },
            data: { status: 'KOT_Sent', guestCount: guestCount ?? 2, note: note ?? null },
          })
        }
      }

      if (!order) {
        order = await tx.order.create({
          data: {
            ...(providedOrderId ? { id: providedOrderId } : {}),
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

      const lastKot = await tx.kOT.findFirst({
        where: { orderId: order.id },
        orderBy: { kotNumber: 'desc' },
        select: { kotNumber: true },
      })
      const nextKotNumber = (lastKot?.kotNumber ?? 0) + 1

      const kot = await tx.kOT.create({
        data: { ...(providedKotId ? { id: providedKotId } : {}), orderId: order.id, kotNumber: nextKotNumber, sentBy },
      })

      const createdItems: Array<{ id: string; lineTotal: number }> = []
      for (const item of items) {
        const oi = await tx.orderItem.create({
          data: {
            ...(item.id ? { id: item.id } : {}),
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
      const existingSubtotal = await tx.orderItem.aggregate({
        where: { orderId: order.id, status: { not: 'Cancelled' }, id: { notIn: createdItems.map(i => i.id) } },
        _sum: { lineTotal: true },
      })
      const subtotal = newItemsSubtotal + (existingSubtotal._sum.lineTotal ?? 0)
      const storeSettings = await tx.storeSettings.findUnique({ where: { id: 'default' } })
      const taxSlab = await tx.taxSlab.findFirst({ where: { isDefault: true } })
      const taxPercent = taxSlab?.percent ?? 0
      const { taxTotal } = calculateTax(subtotal, taxPercent, storeSettings?.taxType ?? 'Exclusive')
      const { grandTotal } = calculateRounding(
        storeSettings?.taxType === 'Inclusive' ? subtotal : subtotal + taxTotal,
      )
      await tx.order.update({
        where: { id: order.id },
        data: { subtotal, taxTotal, grandTotal },
      })

      return { orderId: order.id, kotNumber: nextKotNumber, itemsSent: createdItems.length }
    })

    if (tableId) {
      await prisma.table.update({ where: { id: tableId as string }, data: { status: 'Occupied' } }).catch(() => {})
    }

    return result
  },
}
