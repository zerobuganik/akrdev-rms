import { Router } from 'express'
import { authMiddleware } from '../../middleware/auth.js'
import { requireRole } from '../../middleware/rbac.js'
import { activityLogger } from '../../middleware/activity-logger.js'
import { itemService } from './item.service.js'
import { prisma } from '../../lib/prisma.js'
import fs from 'fs'
import path from 'path'

const router = Router()
router.use(authMiddleware)
router.use(activityLogger)

router.get('/', async (req, res, next) => {
  try { res.json(await itemService.findAll(req.query.categoryId as string | undefined)) } catch (err) { next(err) }
})
router.post('/', requireRole('Admin'), async (req, res, next) => {
  try { res.status(201).json(await itemService.create(req.body)) } catch (err) { next(err) }
})
router.get('/:id', async (req, res, next) => {
  try { res.json(await itemService.findById(req.params.id as string)) } catch (err) { next(err) }
})
router.put('/:id', requireRole('Admin'), async (req, res, next) => {
  try { res.json(await itemService.update(req.params.id as string, req.body)) } catch (err) { next(err) }
})
router.delete('/:id', requireRole('Admin'), async (req, res, next) => {
  try { await itemService.delete(req.params.id as string); res.status(204).send() } catch (err) { next(err) }
})
router.post('/:id/variations', requireRole('Admin'), async (req, res, next) => {
  try { res.status(201).json(await itemService.addVariation(req.params.id as string, req.body)) } catch (err) { next(err) }
})
router.delete('/variations/:id', requireRole('Admin'), async (req, res, next) => {
  try { await itemService.deleteVariation(req.params.id as string); res.status(204).send() } catch (err) { next(err) }
})

router.post('/:id/upload-image', requireRole('Admin'), async (req, res) => {
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

    const item = await prisma.item.findUnique({ where: { id: req.params.id as string }, select: { imageUrl: true } })
    if (!item) {
      res.status(404).json({ error: { message: 'Item not found', statusCode: 404 } })
      return
    }
    if (item.imageUrl) {
      const oldPath = path.join('public', item.imageUrl)
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
    }

    const ext = matches[1]!
    const data = matches[2]!
    const dir = 'public/uploads'
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    const filename = `item-${req.params.id}-${Date.now()}.${ext}`
    fs.writeFileSync(path.join(dir, filename), Buffer.from(data, 'base64'))

    const imageUrl = `/uploads/${filename}`
    await prisma.item.update({ where: { id: req.params.id as string }, data: { imageUrl } })
    res.json({ imageUrl })
  } catch (err) {
    res.status(500).json({ error: { message: 'Upload failed', statusCode: 500 } })
  }
})

export default router
