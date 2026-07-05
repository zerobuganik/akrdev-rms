import { Router } from 'express'
import { authMiddleware } from '../../middleware/auth.js'
import { activityLogger } from '../../middleware/activity-logger.js'
import { kotService } from './kot.service.js'

const router = Router()
router.use(authMiddleware)
router.use(activityLogger)

router.post('/send', async (req, res, next) => {
  try { res.json(await kotService.send(req.body.orderId, req.user!.userId)) } catch (err) { next(err) }
})

router.post('/send-with-items', async (req, res, next) => {
  try { res.json(await kotService.sendWithItems(req.body, req.user!.userId)) } catch (err) { next(err) }
})

export default router
