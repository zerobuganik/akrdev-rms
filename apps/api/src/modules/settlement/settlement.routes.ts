import { Router } from 'express'
import { authMiddleware } from '../../middleware/auth.js'
import { requireRole } from '../../middleware/rbac.js'
import { activityLogger } from '../../middleware/activity-logger.js'
import { settlementService } from './settlement.service.js'

const router = Router()
router.use(authMiddleware)
router.use(activityLogger)

router.post('/', requireRole('Admin', 'Cashier'), async (req, res, next) => {
  try {
    const { orderId, ...data } = req.body
    res.json(await settlementService.settle(orderId, data))
  } catch (err) { next(err) }
})

router.get('/summary', requireRole('Admin', 'Cashier'), async (req, res, next) => {
  try {
    res.json(await settlementService.getPaymentSummary({ date: req.query.date as string }))
  } catch (err) { next(err) }
})

router.get('/:orderId', requireRole('Admin', 'Cashier'), async (req, res, next) => {
  try {
    res.json(await settlementService.getSettlement(req.params.orderId as string))
  } catch (err) { next(err) }
})

router.put('/:orderId/payment', requireRole('Admin', 'Cashier'), async (req, res, next) => {
  try {
    res.json(await settlementService.updatePayment(req.params.orderId as string, req.body))
  } catch (err) { next(err) }
})

export default router
