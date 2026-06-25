import { prisma } from '../../lib/prisma.js'
import { NotFoundError, ValidationError } from '../../lib/errors.js'
import { taxSlabService } from '../tax-slabs/tax-slab.service.js'

export const cartService = {
  async addItem(orderId: string, data: {
    itemId: string; variationId?: string; quantity?: number; note?: string
  }) {
    const order = await prisma.order.findUnique({ where: { id: orderId } })
    if (!order) throw new NotFoundError('Order')
    checkOrderModifiable(order.status)

    const item = await prisma.item.findUnique({ where: { id: data.itemId } })
    if (!item) throw new NotFoundError('Item')

    let unitPrice = item.basePrice
    if (data.variationId) {
      const variation = await prisma.itemVariation.findUnique({ where: { id: data.variationId } })
      if (!variation) throw new NotFoundError('Variation')
      unitPrice += variation.priceAdjustment
    }

    // Check for existing identical item with 'New' status to merge quantity
    const existing = await prisma.orderItem.findFirst({
      where: {
        orderId,
        itemId: data.itemId,
        variationId: data.variationId ?? null,
        status: 'New',
      },
    })

    if (existing) {
      const newQty = existing.quantity + (data.quantity ?? 1)
      const updated = await prisma.orderItem.update({
        where: { id: existing.id },
        data: { quantity: newQty, lineTotal: unitPrice * newQty },
        include: { item: true, variation: true },
      })
      await recalculateTotals(orderId)
      return updated
    }

    const quantity = data.quantity ?? 1
    const lineTotal = unitPrice * quantity

    const orderItem = await prisma.orderItem.create({
      data: {
        orderId,
        itemId: data.itemId,
        variationId: data.variationId,
        quantity,
        unitPrice,
        lineTotal,
        note: data.note,
      },
      include: { item: true, variation: true },
    })

    await recalculateTotals(orderId)
    return orderItem
  },

  async removeItem(orderItemId: string, cancelledBy?: string) {
    const orderItem = await prisma.orderItem.findUnique({ where: { id: orderItemId }, include: { order: true } })
    if (!orderItem) throw new NotFoundError('Order item')
    checkOrderModifiable(orderItem.order.status)

    await prisma.orderItem.update({
      where: { id: orderItemId },
      data: { status: 'Cancelled', lineTotal: 0, cancelledAt: new Date(), cancelledBy: cancelledBy ?? null },
    })
    await recalculateTotals(orderItem.orderId)
  },

  async updateItemQty(orderItemId: string, quantity: number) {
    const orderItem = await prisma.orderItem.findUnique({ where: { id: orderItemId }, include: { order: true } })
    if (!orderItem) throw new NotFoundError('Order item')
    checkOrderModifiable(orderItem.order.status)
    if (quantity < 1) throw new ValidationError('Quantity must be at least 1')
    const lineTotal = orderItem.unitPrice * quantity
    const updated = await prisma.orderItem.update({
      where: { id: orderItemId },
      data: { quantity, lineTotal },
    })
    await recalculateTotals(orderItem.orderId)
    return updated
  },

  async updateItemNote(orderItemId: string, note: string) {
    const orderItem = await prisma.orderItem.findUnique({ where: { id: orderItemId }, include: { order: true } })
    if (!orderItem) throw new NotFoundError('Order item')
    checkOrderModifiable(orderItem.order.status)
    return prisma.orderItem.update({ where: { id: orderItemId }, data: { note } })
  },

  async updateOrderNote(orderId: string, note: string) {
    const order = await prisma.order.findUnique({ where: { id: orderId } })
    if (!order) throw new NotFoundError('Order')
    checkOrderModifiable(order.status)
    return prisma.order.update({ where: { id: orderId }, data: { note } })
  },

  async updateGuestCount(orderId: string, guestCount: number) {
    const order = await prisma.order.findUnique({ where: { id: orderId } })
    if (!order) throw new NotFoundError('Order')
    checkOrderModifiable(order.status)
    return prisma.order.update({ where: { id: orderId }, data: { guestCount } })
  },

  async assignCustomer(orderId: string, phone: string, name?: string) {
    const order = await prisma.order.findUnique({ where: { id: orderId } })
    if (!order) throw new NotFoundError('Order')
    checkOrderModifiable(order.status)
    const customer = await prisma.customer.upsert({
      where: { phone },
      update: { name: name ?? undefined },
      create: { phone, name },
    })
    return prisma.order.update({ where: { id: orderId }, data: { customerId: customer.id } })
  },

  async mergeTables(sourceTableId: string, destTableId: string) {
    if (sourceTableId === destTableId) throw new ValidationError('Cannot merge a table into itself')

    const [sourceOrder, destOrder] = await Promise.all([
      prisma.order.findFirst({
        where: { tableId: sourceTableId, status: { notIn: ['Settled', 'Cancelled'] } },
        include: { items: true },
      }),
      prisma.order.findFirst({
        where: { tableId: destTableId, status: { notIn: ['Settled', 'Cancelled'] } },
      }),
    ])

    if (!sourceOrder) throw new ValidationError('Source table has no active order')
    checkOrderModifiable(sourceOrder.status)

    const sourceItems = sourceOrder.items.filter((i) => i.status !== 'Cancelled')

    if (!destOrder) {
      // Destination table has no active order — just move the source order
      await prisma.order.update({
        where: { id: sourceOrder.id },
        data: { tableId: destTableId, mergedFromTableId: sourceTableId },
      })
      await prisma.table.update({ where: { id: sourceTableId }, data: { status: 'Available' } })
      await prisma.table.update({ where: { id: destTableId }, data: { status: 'Occupied' } })
    } else {
      checkOrderModifiable(destOrder.status)
      // Move all items from source order to destination order
      await prisma.$transaction([
        ...sourceItems.map((item) =>
          prisma.orderItem.update({
            where: { id: item.id },
            data: { orderId: destOrder.id },
          })
        ),
        prisma.order.update({
          where: { id: sourceOrder.id },
          data: { status: 'Cancelled' },
        }),
        prisma.table.update({ where: { id: sourceTableId }, data: { status: 'Available' } }),
      ])
      await recalculateTotals(destOrder.id)
    }

    return { success: true, message: 'Tables merged successfully' }
  },
}

function checkOrderModifiable(status: string) {
  if (status === 'Settled' || status === 'Cancelled') {
    throw new ValidationError('Cannot modify a settled or cancelled order')
  }
}

async function recalculateTotals(orderId: string) {
  const items = await prisma.orderItem.findMany({
    where: { orderId, status: { not: 'Cancelled' } },
  })
  const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0)

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { discounts: true },
  })
  if (!order) return

  const settings = await prisma.storeSettings.findUnique({ where: { id: 'default' } })
  const taxPercent = await taxSlabService.getDefaultTaxPercent()

  let taxTotal: number
  if (settings?.taxType === 'Inclusive') {
    taxTotal = subtotal - subtotal / (1 + taxPercent / 100)
  } else {
    taxTotal = subtotal * (taxPercent / 100)
  }

  const discountTotal = order.discounts.reduce((sum, d) => {
    return sum + (d.type === 'Percentage' ? (subtotal * d.value / 100) : d.value)
  }, 0)

  const exactGrandTotal = settings?.taxType === 'Inclusive'
    ? subtotal - discountTotal
    : subtotal + taxTotal - discountTotal
  const grandTotal = Math.round(exactGrandTotal)
  const roundingAdjustment = grandTotal - exactGrandTotal

  await prisma.order.update({
    where: { id: orderId },
    data: { subtotal, taxTotal, discountTotal, grandTotal, roundingAdjustment },
  })
}
