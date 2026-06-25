import { Router } from 'express'
import { areaController } from './area.controller.js'
import { authMiddleware } from '../../middleware/auth.js'
import { requireRole } from '../../middleware/rbac.js'
import { activityLogger } from '../../middleware/activity-logger.js'

const router = Router()
router.use(authMiddleware)
router.use(activityLogger)
router.get('/', areaController.list)
router.post('/', requireRole('Admin'), areaController.create)
router.get('/:id', areaController.getById)
router.put('/:id', requireRole('Admin'), areaController.update)
router.delete('/:id', requireRole('Admin'), areaController.delete)
export default router
