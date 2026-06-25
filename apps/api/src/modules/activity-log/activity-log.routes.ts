import { Router } from 'express'
import { authMiddleware } from '../../middleware/auth.js'
import { requireRole } from '../../middleware/rbac.js'
import { prisma } from '../../lib/prisma.js'

const router = Router()
router.use(authMiddleware)

router.get('/', requireRole('Admin'), async (req, res, next) => {
  try {
    const { userId, module: mod, action, dateFrom, dateTo, limit, offset } = req.query as Record<string, string>
    const where: Record<string, unknown> = {}
    if (userId) where.userId = userId
    if (mod) where.module = mod
    if (action) where.action = action
    if (dateFrom || dateTo) {
      where.createdAt = {}
      if (dateFrom) where.createdAt = { ...where.createdAt as object, gte: new Date(dateFrom) }
      if (dateTo) where.createdAt = { ...where.createdAt as object, lte: new Date(dateTo) }
    }

    const logs = await prisma.activityLog.findMany({
      where,
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: Number(limit) || 50,
      skip: Number(offset) || 0,
    })
    res.json(logs)
  } catch (err) { next(err) }
})

export default router
