import { Router } from 'express'
import { tableController } from './table.controller.js'
import { authMiddleware } from '../../middleware/auth.js'
import { requireRole } from '../../middleware/rbac.js'
import { activityLogger } from '../../middleware/activity-logger.js'

const router = Router()
router.use(authMiddleware)
router.use(activityLogger)
router.get('/', tableController.list)
router.post('/', requireRole('Admin'), tableController.create)
router.get('/:id', tableController.getById)
router.put('/:id', requireRole('Admin', 'Cashier'), tableController.update)
router.delete('/:id', requireRole('Admin'), tableController.delete)
export default router
