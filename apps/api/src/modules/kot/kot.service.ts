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
      data: { orderId, kotNumber: nextKotNumber, sentBy: sentBy || 'user' },
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
}
