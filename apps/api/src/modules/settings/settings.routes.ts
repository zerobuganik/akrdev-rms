import { Router } from 'express'
import { settingsController } from './settings.controller.js'
import { authMiddleware } from '../../middleware/auth.js'
import { requireRole } from '../../middleware/rbac.js'
import { activityLogger } from '../../middleware/activity-logger.js'
import { prisma } from '../../lib/prisma.js'
import fs from 'fs'
import path from 'path'

const router = Router()

router.use(authMiddleware)
router.use(activityLogger)

router.get('/', settingsController.get)
router.put('/', requireRole('Admin'), settingsController.update)

router.post('/upload-logo', requireRole('Admin'), async (req, res) => {
  try {
    const { image } = req.body as { image: string }
    if (!image) {
      res.status(400).json({ error: { message: 'No image provided', statusCode: 400 } })
      return
    }
    const matches = image.match(/^data:image\/(png|jpeg|jpg|gif|webp);base64,(.+)$/)
    if (!matches) {
      res.status(400).json({ error: { message: 'Invalid image format. Provide a base64 data URL.', statusCode: 400 } })
      return
    }

    const current = await prisma.storeSettings.findUnique({ where: { id: 'default' }, select: { logoUrl: true } })
    if (current?.logoUrl) {
      const oldPath = path.join('public', current.logoUrl)
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
    }

    const ext = matches[1]!
    const data = matches[2]!
    const dir = 'public/uploads'
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    const filename = `logo-${Date.now()}.${ext}`
    fs.writeFileSync(path.join(dir, filename), Buffer.from(data, 'base64'))

    const logoUrl = `/uploads/${filename}`
    await prisma.storeSettings.upsert({
      where: { id: 'default' },
      update: { logoUrl },
      create: { companyName: 'Default', logoUrl },
    })
    res.json({ logoUrl })
  } catch (err) {
    res.status(500).json({ error: { message: 'Upload failed', statusCode: 500 } })
  }
})

router.post('/upload-print-logo', requireRole('Admin'), async (req, res) => {
  try {
    const { image } = req.body as { image: string }
    if (!image) {
      res.status(400).json({ error: { message: 'No image provided', statusCode: 400 } })
      return
    }
    const matches = image.match(/^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/)
    if (!matches) {
      res.status(400).json({ error: { message: 'Invalid image format. Provide a base64 data URL (PNG, JPEG, WebP).', statusCode: 400 } })
      return
    }

    const current = await prisma.storeSettings.findUnique({ where: { id: 'default' }, select: { printLogoUrl: true } })
    if (current?.printLogoUrl) {
      const oldPath = path.join('public', current.printLogoUrl)
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
    }

    const ext = matches[1]!
    const data = matches[2]!
    const dir = 'public/uploads'
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    const filename = `print-logo-${Date.now()}.${ext}`
    fs.writeFileSync(path.join(dir, filename), Buffer.from(data, 'base64'))

    const printLogoUrl = `/uploads/${filename}`
    await prisma.storeSettings.upsert({
      where: { id: 'default' },
      update: { printLogoUrl },
      create: { companyName: 'Default', printLogoUrl },
    })
    res.json({ printLogoUrl })
  } catch (err) {
    res.status(500).json({ error: { message: 'Upload failed', statusCode: 500 } })
  }
})

export default router

router.delete('/delete-logo', requireRole('Admin'), async (req, res) => {
  try {
    const current = await prisma.storeSettings.findUnique({ where: { id: 'default' }, select: { logoUrl: true } })
    if (current?.logoUrl) {
      const oldPath = path.join('public', current.logoUrl)
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
    }
    await prisma.storeSettings.upsert({
      where: { id: 'default' },
      update: { logoUrl: null },
      create: { companyName: 'Default', logoUrl: null },
    })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: { message: 'Delete failed', statusCode: 500 } })
  }
})

router.delete('/delete-print-logo', requireRole('Admin'), async (req, res) => {
  try {
    const current = await prisma.storeSettings.findUnique({ where: { id: 'default' }, select: { printLogoUrl: true } })
    if (current?.printLogoUrl) {
      const oldPath = path.join('public', current.printLogoUrl)
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
    }
    await prisma.storeSettings.upsert({
      where: { id: 'default' },
      update: { printLogoUrl: null },
      create: { companyName: 'Default', printLogoUrl: null },
    })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: { message: 'Delete failed', statusCode: 500 } })
  }
})
