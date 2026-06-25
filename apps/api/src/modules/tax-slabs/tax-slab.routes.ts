import { Router } from 'express'
import { taxSlabService } from './tax-slab.service.js'
import { authMiddleware } from '../../middleware/auth.js'
import { requireRole } from '../../middleware/rbac.js'
import { activityLogger } from '../../middleware/activity-logger.js'

const router = Router()
router.use(authMiddleware)
router.use(activityLogger)

router.get('/', async (req, res, next) => {
  try { res.json(await taxSlabService.list()) } catch (err) { next(err) }
})
router.post('/', requireRole('Admin'), async (req, res, next) => {
  try { res.status(201).json(await taxSlabService.create(req.body)) } catch (err) { next(err) }
})
router.put('/:id', requireRole('Admin'), async (req, res, next) => {
  try { res.json(await taxSlabService.update(req.params.id as string, req.body)) } catch (err) { next(err) }
})
router.delete('/:id', requireRole('Admin'), async (req, res, next) => {
  try { await taxSlabService.remove(req.params.id as string); res.json({ message: 'Tax slab removed' }) } catch (err) { next(err) }
})

export default router
