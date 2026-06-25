import { Router } from 'express'
import { authMiddleware } from '../../middleware/auth.js'
import { requireRole } from '../../middleware/rbac.js'
import { activityLogger } from '../../middleware/activity-logger.js'
import { cartService } from './cart.service.js'

const router = Router()
router.use(authMiddleware)
router.use(activityLogger)

router.post('/add-item', async (req, res, next) => {
  try {
    const { orderId, ...data } = req.body
    res.status(201).json(await cartService.addItem(orderId, data))
  } catch (err) { next(err) }
})
router.post('/remove-item', async (req, res, next) => {
  try { await cartService.removeItem(req.body.orderItemId, req.user!.userId); res.json({ message: 'Item removed' }) } catch (err) { next(err) }
})
router.put('/item-qty', async (req, res, next) => {
  try { res.json(await cartService.updateItemQty(req.body.orderItemId, req.body.quantity)) } catch (err) { next(err) }
})
router.put('/item-note', async (req, res, next) => {
  try { res.json(await cartService.updateItemNote(req.body.orderItemId, req.body.note)) } catch (err) { next(err) }
})
router.put('/order-note', async (req, res, next) => {
  try { res.json(await cartService.updateOrderNote(req.body.orderId, req.body.note)) } catch (err) { next(err) }
})
router.put('/guest-count', async (req, res, next) => {
  try { res.json(await cartService.updateGuestCount(req.body.orderId, req.body.guestCount)) } catch (err) { next(err) }
})
router.post('/assign-customer', async (req, res, next) => {
  try { res.json(await cartService.assignCustomer(req.body.orderId, req.body.phone, req.body.name)) } catch (err) { next(err) }
})
router.post('/merge-tables', requireRole('Admin', 'Cashier'), async (req, res, next) => {
  try { res.json(await cartService.mergeTables(req.body.sourceTableId, req.body.destTableId)) } catch (err) { next(err) }
})

export default router
