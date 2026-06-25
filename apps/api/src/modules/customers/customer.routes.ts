import { Router } from 'express'
import { authMiddleware } from '../../middleware/auth.js'
import { customerService } from './customer.service.js'

const router = Router()
router.use(authMiddleware)

router.get('/search', async (req, res, next) => {
  try {
    const phone = req.query.phone as string
    if (!phone) return res.json([])
    res.json(await customerService.searchByPhone(phone))
  } catch (err) { next(err) }
})

export default router
