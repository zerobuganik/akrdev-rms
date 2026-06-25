import { Router } from 'express'
import { employeeController } from './employee.controller.js'
import { authMiddleware } from '../../middleware/auth.js'
import { requireRole } from '../../middleware/rbac.js'
import { activityLogger } from '../../middleware/activity-logger.js'

const router = Router()
router.use(authMiddleware)
router.use(activityLogger)

router.get('/', employeeController.list)
router.post('/', requireRole('Admin'), employeeController.create)
router.get('/:id', employeeController.getById)
router.put('/:id', requireRole('Admin'), employeeController.update)
router.delete('/:id', requireRole('Admin'), employeeController.delete)
router.put('/:id/change-password', requireRole('Admin'), employeeController.changePassword)

export default router
