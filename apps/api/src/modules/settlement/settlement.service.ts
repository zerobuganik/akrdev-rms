import { prisma } from '../../lib/prisma.js'
import { NotFoundError, ValidationError } from '../../lib/errors.js'
import { taxSlabService } from '../tax-slabs/tax-slab.service.js'

export const settlementService = {
  async settle(orderId: string, data: {
    discountType?: 'Percentage' | 'Flat'; discountValue?: number; discountReason?: string;
    payments: { cash?: number; card?: number; upi?: number }
  }) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, discounts: true },
    })
    if (!order) throw new NotFoundError('Order')

    if (!data.payments) {
      throw new ValidationError('Payment details are required')
    }

    if (data.discountType && data.discountValue !== undefined && data.discountValue > 0) {
      await prisma.orderDiscount.create({
        data: {
          orderId,
          type: data.discountType,
          value: data.discountValue,
          reason: data.discountReason,
        },
      })
    }

    const items = await prisma.orderItem.findMany({
      where: { orderId, status: { not: 'Cancelled' } },
    })
    const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0)

    const settings = await prisma.storeSettings.findUnique({ where: { id: 'default' } })
    const taxPercent = await taxSlabService.getDefaultTaxPercent()

    let taxTotal: number
    if (settings?.taxType === 'Inclusive') {
      taxTotal = subtotal - subtotal / (1 + taxPercent / 100)
    } else {
      taxTotal = subtotal * (taxPercent / 100)
    }

    const allDiscounts = await prisma.orderDiscount.findMany({ where: { orderId } })
    const discountTotal = allDiscounts.reduce((sum, d) => {
      return sum + (d.type === 'Percentage' ? (subtotal * d.value / 100) : d.value)
    }, 0)

    const grandTotal = settings?.taxType === 'Inclusive'
      ? subtotal - discountTotal
      : subtotal + taxTotal - discountTotal
    const payments = data.payments
    const totalPaid = (payments.cash ?? 0) + (payments.card ?? 0) + (payments.upi ?? 0)

    if (totalPaid < grandTotal) {
      throw new ValidationError('Insufficient payment')
    }

    const changeAmt = totalPaid - grandTotal

    await prisma.$transaction([
      prisma.order.update({
        where: { id: orderId },
        data: { status: 'Settled', subtotal, taxTotal, discountTotal, grandTotal, syncStatus: 'Pending' },
      }),
      prisma.settlement.upsert({
        where: { orderId },
        create: {
          orderId,
          cashPaid: payments.cash ?? 0,
          cardPaid: payments.card ?? 0,
          upiPaid: payments.upi ?? 0,
          changeAmt,
        },
        update: {
          cashPaid: payments.cash ?? 0,
          cardPaid: payments.card ?? 0,
          upiPaid: payments.upi ?? 0,
          changeAmt,
        },
      }),
      ...(order.tableId ? [
        prisma.table.update({
          where: { id: order.tableId },
          data: { status: 'Available' },
        }),
      ] : []),
    ])

    return {
      orderId,
      subtotal,
      taxTotal,
      discountTotal,
      grandTotal,
      totalPaid,
      change: changeAmt,
    }
  },

  async getSettlement(orderId: string) {
    return prisma.settlement.findUnique({ where: { orderId } })
  },

  async updatePayment(orderId: string, payments: { cash?: number; card?: number; upi?: number }) {
    const order = await prisma.order.findUnique({ where: { id: orderId } })
    if (!order) throw new NotFoundError('Order')
    if (order.status !== 'Settled') throw new ValidationError('Can only update payment on settled orders')

    const existing = await prisma.settlement.findUnique({ where: { orderId } })
    if (!existing) throw new NotFoundError('Settlement record')

    const totalPaid = (payments.cash ?? existing.cashPaid) + (payments.card ?? existing.cardPaid) + (payments.upi ?? existing.upiPaid)
    if (totalPaid < order.grandTotal) throw new ValidationError('Insufficient payment')

    const changeAmt = totalPaid - order.grandTotal

    return prisma.settlement.update({
      where: { orderId },
      data: {
        ...(payments.cash !== undefined ? { cashPaid: payments.cash } : {}),
        ...(payments.card !== undefined ? { cardPaid: payments.card } : {}),
        ...(payments.upi !== undefined ? { upiPaid: payments.upi } : {}),
        changeAmt,
      },
    })
  },

  async getPaymentSummary(params: { date?: string }) {
    const where: Record<string, unknown> = {
      order: { status: 'Settled' },
    }
    if (params.date) {
      const date = new Date(params.date)
      where.createdAt = {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lte: new Date(date.setHours(23, 59, 59, 999)),
      }
    } else {
      const now = new Date()
      where.createdAt = {
        gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
        lte: now,
      }
    }
    const settlements = await prisma.settlement.findMany({
      where,
      include: {
        order: { select: { displayId: true, grandTotal: true, orderType: true, createdAt: true, table: { select: { name: true } } } },
      },
    })

    const ledger = settlements.map((s) => ({
      id: s.id,
      orderId: s.orderId,
      displayId: s.order.displayId,
      orderType: s.order.orderType,
      tableName: s.order.table?.name ?? '',
      grandTotal: s.order.grandTotal,
      cashPaid: s.cashPaid,
      cardPaid: s.cardPaid,
      upiPaid: s.upiPaid,
      changeAmt: s.changeAmt,
      netCash: s.cashPaid - s.changeAmt,
      createdAt: s.order.createdAt,
    }))

    // Cash collected = total cash received minus total change given back
    const rawCash = settlements.reduce((sum, s) => sum + s.cashPaid, 0)
    const totalChange = settlements.reduce((sum, s) => sum + s.changeAmt, 0)
    const cash = rawCash - totalChange

    return {
      cash,
      card: settlements.reduce((sum, s) => sum + s.cardPaid, 0),
      upi: settlements.reduce((sum, s) => sum + s.upiPaid, 0),
      total: cash + settlements.reduce((sum, s) => sum + s.cardPaid + s.upiPaid, 0),
      count: settlements.length,
      ledger,
    }
  },
}
