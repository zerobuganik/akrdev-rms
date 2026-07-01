import { Router } from 'express'
import { authMiddleware } from '../../middleware/auth.js'
import { requireRole } from '../../middleware/rbac.js'
import { activityLogger } from '../../middleware/activity-logger.js'
import { categoryService } from './category.service.js'
import { prisma } from '../../lib/prisma.js'
import fs from 'fs'
import path from 'path'

const router = Router()
router.use(authMiddleware)
router.use(activityLogger)

router.get('/', async (_req, res, next) => { try { res.json(await categoryService.findAll()) } catch (err) { next(err) } })
router.post('/', requireRole('Admin'), async (req, res, next) => { try { res.status(201).json(await categoryService.create(req.body)) } catch (err) { next(err) } })
router.get('/:id', async (req, res, next) => { try { res.json(await categoryService.findById(req.params.id as string)) } catch (err) { next(err) } })
router.put('/:id', requireRole('Admin'), async (req, res, next) => { try { res.json(await categoryService.update(req.params.id as string, req.body)) } catch (err) { next(err) } })
router.delete('/:id', requireRole('Admin'), async (req, res, next) => { try { await categoryService.delete(req.params.id as string); res.status(204).send() } catch (err) { next(err) } })

router.post('/:id/upload-image', requireRole('Admin'), async (req, res, next) => {
  try {
    const { image } = req.body as { image: string }
    if (!image) {
      res.status(400).json({ error: { message: 'No image provided', statusCode: 400 } })
      return
    }
    const matches = image.match(/^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/)
    if (!matches) {
      res.status(400).json({ error: { message: 'Invalid image format. Provide a base64 data URL.', statusCode: 400 } })
      return
    }

    const category = await prisma.category.findUnique({ where: { id: req.params.id as string }, select: { imageUrl: true } })
    if (!category) {
      res.status(404).json({ error: { message: 'Category not found', statusCode: 404 } })
      return
    }
    if (category.imageUrl) {
      const oldPath = path.join('public', category.imageUrl)
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
    }

    const ext = matches[1]!
    const data = matches[2]!
    const dir = 'public/uploads'
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    const filename = `cat-${req.params.id}-${Date.now()}.${ext}`
    fs.writeFileSync(path.join(dir, filename), Buffer.from(data, 'base64'))

    const imageUrl = `/uploads/${filename}`
    await prisma.category.update({ where: { id: req.params.id as string }, data: { imageUrl } })
    res.json({ imageUrl })
  } catch (err) {
    console.error('[category:upload-image] Failed:', (err as Error).message)
    next(err)
  }
})

router.delete('/:id/upload-image', requireRole('Admin'), async (req, res) => {
  try {
    const category = await prisma.category.findUnique({ where: { id: req.params.id as string }, select: { imageUrl: true } })
    if (!category) {
      res.status(404).json({ error: { message: 'Category not found', statusCode: 404 } })
      return
    }
    if (category.imageUrl) {
      const oldPath = path.join('public', category.imageUrl)
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
    }
    await prisma.category.update({ where: { id: req.params.id as string }, data: { imageUrl: null } })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: { message: 'Failed to remove image', statusCode: 500 } })
  }
})

export default router
