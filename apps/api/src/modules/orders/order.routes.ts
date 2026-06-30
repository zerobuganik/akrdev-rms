import { Router } from 'express'
import { authMiddleware } from '../../middleware/auth.js'
import { requireRole } from '../../middleware/rbac.js'
import { activityLogger } from '../../middleware/activity-logger.js'
import { orderService } from './order.service.js'
import { prisma } from '../../lib/prisma.js'

const router = Router()
router.use(authMiddleware)
router.use(activityLogger)

router.post('/', async (req, res, next) => {
  try { res.status(201).json(await orderService.create({ ...req.body, createdBy: req.user!.userId })) } catch (err) { next(err) }
})
router.get('/takeaway/active', async (req, res, next) => {
  try { res.json(await orderService.listTakeawayActive()) } catch (err) { next(err) }
})
router.post('/takeaway', async (req, res, next) => {
  try {
    const year = new Date().getFullYear() % 100
    const displayId = await prisma.$transaction(async (tx) => {
      const counter = await tx.orderCounter.upsert({
        where: { year },
        create: { year, seq: 1 },
        update: { seq: { increment: 1 } },
      })
      return `T/${year}/${counter.seq}`
    })

    const order = await prisma.order.create({
      data: {
        displayId,
        guestCount: 1,
        orderType: 'Takeaway',
        createdBy: req.user!.userId,
        status: 'Draft',
      },
      include: { items: { include: { item: true, variation: true } }, table: true },
    })
    res.status(201).json(order)
  } catch (err) { next(err) }
})
router.get('/', async (req, res, next) => {
  try { res.json(await orderService.list({ status: req.query.status as string, date: req.query.date as string, areaId: req.query.areaId as string })) } catch (err) { next(err) }
})
router.get('/:tableId/active', async (req, res, next) => {
  try {
    const order = await orderService.getActiveForTable(req.params.tableId as string)
    if (order) { res.json(order); return }
    // Fallback: direct order lookup by ID (for takeaway orders with null tableId)
    const directOrder = await orderService.findById(req.params.tableId as string).catch(() => null)
    if (directOrder && directOrder.status !== 'Settled' && directOrder.status !== 'Cancelled') {
      res.json(directOrder)
      return
    }
    res.json(null)
  } catch (err) { next(err) }
})
router.post('/:id/reprint', requireRole('Admin', 'Cashier'), async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id as string },
      include: {
        items: { include: { item: true, variation: true } },
        table: true,
        kots: true,
        discounts: true,
        customer: true,
        createdByUser: { select: { name: true } },
        settlement: true,
      },
    })
    if (!order) { res.status(404).json({ error: { message: 'Order not found' } }); return }
    res.json(order)
  } catch (err) { next(err) }
})
router.get('/:id', async (req, res, next) => {
  try { res.json(await orderService.findById(req.params.id as string)) } catch (err) { next(err) }
})
router.put('/:id', async (req, res, next) => {
  try { res.json(await orderService.update(req.params.id as string, req.body)) } catch (err) { next(err) }
})
router.post('/:id/void', requireRole('Admin'), async (req, res, next) => {
  try { await orderService.void(req.params.id as string); res.json({ message: 'Order voided' }) } catch (err) { next(err) }
})
router.post('/:id/refund', requireRole('Admin'), async (req, res, next) => {
  try { await orderService.refund(req.params.id as string); res.json({ message: 'Order refunded' }) } catch (err) { next(err) }
})

export default router
