import express from 'express'
import http from 'http'
import crypto from 'crypto'
import path from 'path'
import fs from 'fs'
import * as argon2 from 'argon2'
import { Server as SocketIOServer } from 'socket.io'
import { tableLockService, setSocketIO } from '../services/table-lock.service.js'
import { localPrisma, ensureTables } from '../lib/local-prisma.js'
import { printService } from '../printing/print.service.js'
import { calculateTax, calculateRounding } from '@akrdev/shared'
import { syncQueueService } from '../services/sync-queue.service.js'
import { syncWorkerService } from '../services/sync-worker.service.js'
import { getCloudAccessToken, setCloudAccessToken } from '../lib/token-store.js'


let io: SocketIOServer | null = null

const LOCAL_TOKEN_SECRET = crypto.randomBytes(32).toString('hex')

interface PairingEntry {
  code: string
  expiresAt: number
}

const pairingCodes = new Map<string, PairingEntry>()

function generatePairingCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}

function cleanExpiredCodes() {
  const now = Date.now()
  for (const [code, entry] of pairingCodes) {
    if (entry.expiresAt < now) pairingCodes.delete(code)
  }
}

const app = express()
app.use(express.json({ limit: '10mb' }))

// CORS — allow POS dev server and Captain app to call local API
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (_req.method === 'OPTIONS') {
    res.sendStatus(200)
    return
  }
  next()
})

const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}
app.use('/uploads', express.static(uploadsDir))

app.get('/api/v1/pair/generate', (_req, res) => {
  cleanExpiredCodes()
  const code = generatePairingCode()
  const expiresAt = Date.now() + 5 * 60 * 1000
  pairingCodes.set(code, { code, expiresAt })
  res.json({ pairingCode: code, expiresIn: 300 })
})

app.post('/api/v1/pair/verify', (req, res) => {
  const { code } = req.body
  if (!code || typeof code !== 'string') {
    res.status(400).json({ error: 'Pairing code is required' })
    return
  }
  cleanExpiredCodes()
  const entry = pairingCodes.get(code)
  if (!entry) {
    res.status(401).json({ error: 'Invalid or expired pairing code' })
    return
  }
  pairingCodes.delete(code)
  res.json({ verified: true })
})

// CLOUD_API is used for cloud sync — resolved lazily so dotenv loads first
function getCloudApiBase(): string {
  return process.env.CLOUD_API_URL || 'http://localhost:3000/api/v1'
}

// In-memory table cache synced from cloud
let cachedCloudTables: unknown[] | null = null
let cachedAreas: unknown[] | null = null
let cachedCloudItems: unknown[] | null = null
let cachedCategories: unknown[] | null = null
let cachedSettings: Record<string, unknown> | null = null
let cachedTaxSlabs: unknown[] | null = null
let cachedCloudEmployees: unknown[] | null = null

// Seed data removed — all data must come from cloud sync

// Restore in-memory cache from local SQLite on startup (survives app restarts)
async function restoreLocalCache() {
  try {
    const localTables = await localPrisma.cachedTable.findMany()
    if (localTables.length > 0) {
      cachedCloudTables = localTables.map(t => ({
        id: t.id, name: t.name, capacity: t.capacity, status: t.status,
        area: t.areaId ? { id: t.areaId, name: t.areaName ?? '' } : null,
      })) as unknown[]
    }
    const localItems = await localPrisma.cachedItem.findMany()
    if (localItems.length > 0) {
      cachedCloudItems = localItems.map(i => ({
        id: i.id, name: i.name, basePrice: i.basePrice, inStock: i.inStock,
        categoryId: i.categoryId, category: i.categoryId ? { id: i.categoryId, name: i.categoryName ?? '' } : null,
        variations: JSON.parse(i.variations), imageUrl: i.imageUrl,
      })) as unknown[]
    }
    const localSettings = await localPrisma.cachedSetting.findUnique({ where: { id: 'default' } })
    if (localSettings) {
      try { cachedSettings = JSON.parse(localSettings.data) } catch { /* corrupt */ }
    }
    const localCategories = await localPrisma.cachedCategory.findMany()
    if (localCategories.length > 0) {
      cachedCategories = localCategories.map(c => ({
        id: c.id, name: c.name, displayOrder: c.displayOrder, imageUrl: c.imageUrl,
        _count: { items: 0 },
      })) as unknown[]
    }
    const localAreas = await localPrisma.cachedArea.findMany()
    if (localAreas.length > 0) {
      cachedAreas = localAreas.map(a => ({ id: a.id, name: a.name }))
    }
    const localTaxSlabs = await localPrisma.cachedTaxSlab.findMany()
    if (localTaxSlabs.length > 0) {
      cachedTaxSlabs = localTaxSlabs as unknown[]
    }
    console.log(`[cache] Restored from local DB: tables=${cachedCloudTables?.length ?? 0}, items=${cachedCloudItems?.length ?? 0}, settings=${!!cachedSettings}, cats=${(cachedCategories as unknown[])?.length ?? 0}, areas=${cachedAreas?.length ?? 0}, taxSlabs=${(cachedTaxSlabs as unknown[])?.length ?? 0}`)
  } catch (err) {
    console.warn('[cache] Could not restore from local DB:', (err as Error).message)
  }
}
restoreLocalCache().catch(() => {})

// Generate a simple local JWT token
function generateLocalToken(user: { id: string; name: string; phone: string; role: string }): { accessToken: string; refreshToken: string } {
  const payload = JSON.stringify({ userId: user.id, role: user.role, iat: Date.now(), type: 'access' })
  const signature = crypto.createHmac('sha256', LOCAL_TOKEN_SECRET).update(payload).digest('hex')
  const token = Buffer.from(`${payload}.${signature}`).toString('base64')

  const refreshPayload = JSON.stringify({ userId: user.id, role: user.role, iat: Date.now(), type: 'refresh' })
  const refreshSignature = crypto.createHmac('sha256', LOCAL_TOKEN_SECRET).update(refreshPayload).digest('hex')
  const refreshToken = Buffer.from(`${refreshPayload}.${refreshSignature}`).toString('base64')

  return { accessToken: token, refreshToken }
}

function verifyLocalToken(token: string): { userId: string; role: string } | null {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const lastDot = decoded.lastIndexOf('.')
    if (lastDot === -1) return null
    const payload = decoded.slice(0, lastDot)
    const signature = decoded.slice(lastDot + 1)
    const expected = crypto.createHmac('sha256', LOCAL_TOKEN_SECRET).update(payload).digest('hex')
    if (signature !== expected) return null
    const data = JSON.parse(payload) as { userId: string; role: string; iat: number; type: string }
    if (data.type !== 'access') return null
    return { userId: data.userId, role: data.role }
  } catch {
    return null
  }
}

async function authenticateCloud(phone: string, password: string): Promise<string | null> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 25_000)
    const res = await fetch(`${getCloudApiBase()}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password }),
      signal: controller.signal,
    })
    clearTimeout(timeout)
    if (!res.ok) return null
    const data = await res.json() as { accessToken?: string }
    return data.accessToken ?? null
  } catch (err) {
    console.warn('[cloud-auth] Could not authenticate with cloud:', (err as Error).message)
    return null
  }
}

async function syncFromCloud(phone: string, password: string) {
  console.log('[cloud-sync] Starting cloud sync...')
  try {
    const token = await authenticateCloud(phone, password)
    if (!token) {
      console.log('[cloud-sync] Cloud authentication failed — using local cache')
      return
    }
    console.log('[cloud-sync] Cloud authenticated, fetching data...')
    cloudAccessToken = token
    setCloudAccessToken(token)
    syncWorkerService.setCloudToken(token)

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30_000)
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    const [tablesRes, areasRes, itemsRes, settingsRes, categoriesRes, taxSlabsRes, employeesRes, ordersRes] = await Promise.all([
      fetch(`${getCloudApiBase()}/tables`, { headers, signal: controller.signal }),
      fetch(`${getCloudApiBase()}/areas`, { headers, signal: controller.signal }),
      fetch(`${getCloudApiBase()}/items`, { headers, signal: controller.signal }),
      fetch(`${getCloudApiBase()}/settings`, { headers, signal: controller.signal }),
      fetch(`${getCloudApiBase()}/categories`, { headers, signal: controller.signal }),
      fetch(`${getCloudApiBase()}/tax-slabs`, { headers, signal: controller.signal }),
      fetch(`${getCloudApiBase()}/employees`, { headers, signal: controller.signal }),
      fetch(`${getCloudApiBase()}/orders`, { headers, signal: controller.signal }),
    ])
    clearTimeout(timeout)
    console.log(`[cloud-sync] Responses: tables=${tablesRes.status} areas=${areasRes.status} items=${itemsRes.status} settings=${settingsRes.status} cats=${categoriesRes.status} tax=${taxSlabsRes.status} emp=${employeesRes.status} orders=${ordersRes.status}`)

    if (tablesRes.ok) {
      const raw = await tablesRes.json()
      cachedCloudTables = Array.isArray(raw) ? raw.map((t: Record<string, unknown>) => ({
        id: t.id, name: t.name, capacity: t.capacity ?? 0, status: t.status ?? 'Available',
        area: t.area ?? null,
      })) : null
      if (cachedCloudTables) {
        for (const t of cachedCloudTables as Array<{ id: string; name: string; capacity: number; status: string; area: { id?: string; name?: string } | null }>) {
          const areaObj = t.area
          await localPrisma.cachedTable.upsert({
            where: { id: t.id },
            create: { id: t.id, name: t.name, capacity: t.capacity, status: t.status, areaId: areaObj?.id ?? null, areaName: areaObj?.name ?? null },
            update: { name: t.name, capacity: t.capacity, status: t.status, areaId: areaObj?.id ?? null, areaName: areaObj?.name ?? null },
          }).catch(() => {})
        }
      }
    }
    if (areasRes.ok) {
      cachedAreas = await areasRes.json()
      if (Array.isArray(cachedAreas)) {
        for (const a of cachedAreas as Array<{ id: string; name: string }>) {
          await localPrisma.cachedArea.upsert({
            where: { id: a.id },
            create: { id: a.id, name: a.name },
            update: { name: a.name },
          }).catch(() => {})
        }
      }
    }
    if (itemsRes.ok) {
      const raw = await itemsRes.json()
      cachedCloudItems = Array.isArray(raw) ? raw : null
      if (cachedCloudItems) {
        for (const i of cachedCloudItems as Array<{ id: string; name: string; basePrice: number; inStock: boolean; category: { id?: string; name?: string } | null; variations: unknown; imageUrl: string | null }>) {
          const cat = i.category
          await localPrisma.cachedItem.upsert({
            where: { id: i.id },
            create: { id: i.id, name: i.name, basePrice: i.basePrice, inStock: i.inStock ?? true, categoryId: cat?.id ?? null, categoryName: cat?.name ?? null, variations: JSON.stringify(i.variations ?? []), imageUrl: i.imageUrl ?? null },
            update: { name: i.name, basePrice: i.basePrice, inStock: i.inStock ?? true, categoryId: cat?.id ?? null, categoryName: cat?.name ?? null, variations: JSON.stringify(i.variations ?? []), imageUrl: i.imageUrl ?? null },
          }).catch(() => {})
        }
      }
    }
    if (settingsRes.ok) {
      cachedSettings = await settingsRes.json()
      await localPrisma.cachedSetting.upsert({
        where: { id: 'default' },
        create: { id: 'default', data: JSON.stringify(cachedSettings) },
        update: { data: JSON.stringify(cachedSettings) },
      }).catch(() => {})
    }
    if (categoriesRes.ok) cachedCategories = await categoriesRes.json()
    if (taxSlabsRes.ok) {
      cachedTaxSlabs = await taxSlabsRes.json()
      if (Array.isArray(cachedTaxSlabs)) {
        for (const slab of cachedTaxSlabs as Array<{ id: string; name: string; percent: number; isDefault?: boolean; isActive?: boolean }>) {
          await localPrisma.cachedTaxSlab.upsert({
            where: { id: slab.id },
            create: { id: slab.id, name: slab.name, percent: slab.percent, isDefault: slab.isDefault ?? false, isActive: slab.isActive ?? true },
            update: { name: slab.name, percent: slab.percent, isDefault: slab.isDefault ?? false, isActive: slab.isActive ?? true },
          }).catch(() => {})
        }
      }
    }
    if (employeesRes.ok) cachedCloudEmployees = await employeesRes.json()
    if (ordersRes.ok) {
      const raw = await ordersRes.json()
      if (Array.isArray(raw)) {
        for (const o of raw as Array<Record<string, unknown>>) {
          await localPrisma.localOrder.upsert({
            where: { id: o.id as string },
            create: {
              id: o.id as string, tableId: o.tableId as string ?? null, tableName: o.tableName as string ?? null,
              guestCount: o.guestCount as number ?? 2, status: o.status as string ?? 'Draft',
              subtotal: o.subtotal as number ?? 0, taxTotal: o.taxTotal as number ?? 0,
              discountTotal: o.discountTotal as number ?? 0, grandTotal: o.grandTotal as number ?? 0,
              orderType: o.orderType as string ?? 'DineIn', syncStatus: 'Synced',
            },
            update: { status: o.status as string, subtotal: o.subtotal as number, taxTotal: o.taxTotal as number, discountTotal: o.discountTotal as number, grandTotal: o.grandTotal as number },
          }).catch(() => {})

          // Sync order items
          const items = o.items as Array<Record<string, unknown>> | undefined
          if (items?.length) {
            for (const item of items) {
              const oi = item.item as Record<string, unknown> | undefined
              await localPrisma.localOrderItem.upsert({
                where: { id: item.id as string },
                create: {
                  id: item.id as string, orderId: o.id as string, itemId: item.itemId as string ?? '',
                  itemName: oi?.name as string ?? item.itemName as string ?? '',
                  quantity: item.quantity as number ?? 1, unitPrice: item.unitPrice as number ?? 0,
                  lineTotal: item.lineTotal as number ?? 0, status: item.status as string ?? 'New',
                  variationId: item.variationId as string ?? null,
                  variationName: item.variationName as string ?? null,
                },
                update: { quantity: item.quantity as number, unitPrice: item.unitPrice as number, lineTotal: item.lineTotal as number, status: item.status as string },
              }).catch(() => {})
            }
          }

          // Sync settlement
          const settlement = o.settlement as Record<string, unknown> | undefined
          if (settlement?.id) {
            await localPrisma.localSettlement.upsert({
              where: { orderId: o.id as string },
              create: {
                id: settlement.id as string, orderId: o.id as string,
                subtotal: settlement.subtotal as number ?? 0, taxTotal: settlement.taxTotal as number ?? 0,
                discountTotal: settlement.discountTotal as number ?? 0, grandTotal: settlement.grandTotal as number ?? 0,
                cashPaid: settlement.cashPaid as number ?? 0, cardPaid: settlement.cardPaid as number ?? 0,
                upiPaid: settlement.upiPaid as number ?? 0, changeGiven: settlement.changeGiven as number ?? 0,
                settledAt: settlement.settledAt as string ?? new Date().toISOString(),
              },
              update: { cashPaid: settlement.cashPaid as number, cardPaid: settlement.cardPaid as number, upiPaid: settlement.upiPaid as number },
            }).catch(() => {})
          }
        }
      }
    }

    lastSyncTime = Date.now()
    console.log(`[cloud-sync] Synced: tables=${cachedCloudTables?.length ?? 0}, items=${cachedCloudItems?.length ?? 0}, settings=${!!cachedSettings}, categories=${(cachedCategories as unknown[])?.length ?? 0}, employees=${(cachedCloudEmployees as unknown[])?.length ?? 0}`)
  } catch (err) {
    console.warn('[cloud-sync] Sync failed:', (err as Error).message)
  }
}

function rawOrdersCount(): number {
  return cachedCloudTables?.length ?? 0
}

// Sync with progress tracking for the frontend polling
async function syncWithProgress(phone?: string, password?: string): Promise<void> {
  if (syncPromise) return syncPromise
  syncInProgress = true
  syncProgress = { total: 8, completed: 0, phase: 'authenticating', error: null }

  syncPromise = (async () => {
    try {
    let token = cloudAccessToken ?? getCloudAccessToken()
    console.log('[sync-progress] Starting. storedToken:', !!token, 'hasPhone:', !!phone, 'hasPassword:', !!password)
    if (!token && phone && password) {
      console.log('[sync-progress] Authenticating with cloud...')
      token = await authenticateCloud(phone, password)
      console.log('[sync-progress] Auth result:', !!token ? 'SUCCESS' : 'FAILED')
      if (!token) {
        syncProgress = { total: 8, completed: 0, phase: 'error', error: 'Cloud authentication failed — check internet or credentials' }
        return
      }
      cloudAccessToken = token
      setCloudAccessToken(token)
      syncWorkerService.setCloudToken(token)
    }
    if (!token) {
      syncProgress = { total: 8, completed: 0, phase: 'error', error: 'No cloud token — log in with password first' }
      return
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 45_000)
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

    const endpoints = [
      { key: 'tables', url: `${getCloudApiBase()}/tables`, handler: async (r: Response) => {
        const raw = await r.json()
        cachedCloudTables = Array.isArray(raw) ? raw.map((t: Record<string, unknown>) => ({
          id: t.id, name: t.name, capacity: t.capacity ?? 0, status: t.status ?? 'Available',
          area: t.area ?? null,
        })) : null
        if (cachedCloudTables) {
          for (const t of cachedCloudTables as Array<{ id: string; name: string; capacity: number; status: string; area: { id?: string; name?: string } | null }>) {
            await localPrisma.cachedTable.upsert({
              where: { id: t.id },
              create: { id: t.id, name: t.name, capacity: t.capacity, status: t.status, areaId: t.area?.id ?? null, areaName: t.area?.name ?? null },
              update: { name: t.name, capacity: t.capacity, status: t.status, areaId: t.area?.id ?? null, areaName: t.area?.name ?? null },
            }).catch(() => {})
          }
        }
      }},
      { key: 'settings', url: `${getCloudApiBase()}/settings`, handler: async (r: Response) => {
        const cloudSettings = await r.json()
        const localLogoUrl = cachedSettings?.logoUrl
        const localPrintLogoUrl = cachedSettings?.printLogoUrl
        const isLocalLogoUrl = typeof localLogoUrl === 'string' && localLogoUrl.startsWith('/uploads/')
        const isLocalPrintLogoUrl = typeof localPrintLogoUrl === 'string' && localPrintLogoUrl.startsWith('/uploads/')
        cachedSettings = {
          ...cloudSettings,
          ...(isLocalLogoUrl && !(cloudSettings && (cloudSettings as Record<string,unknown>).logoUrl) ? { logoUrl: localLogoUrl } : {}),
          ...(isLocalPrintLogoUrl && !(cloudSettings && (cloudSettings as Record<string,unknown>).printLogoUrl) ? { printLogoUrl: localPrintLogoUrl } : {}),
        }
        await localPrisma.cachedSetting.upsert({
          where: { id: 'default' },
          create: { id: 'default', data: JSON.stringify(cachedSettings) },
          update: { data: JSON.stringify(cachedSettings) },
        }).catch(() => {})
      }},
      { key: 'categories', url: `${getCloudApiBase()}/categories`, handler: async (r: Response) => {
        cachedCategories = await r.json()
        if (Array.isArray(cachedCategories)) {
          for (const c of cachedCategories as Array<{ id: string; name: string; displayOrder?: number; imageUrl?: string | null; kitchenId?: string | null }>) {
            await localPrisma.cachedCategory.upsert({
              where: { id: c.id },
              create: { id: c.id, name: c.name, displayOrder: c.displayOrder ?? 0, imageUrl: c.imageUrl ?? null, kitchenId: c.kitchenId ?? null },
              update: { name: c.name, displayOrder: c.displayOrder ?? 0, imageUrl: c.imageUrl ?? null },
            }).catch(() => {})
          }
        }
      }},
      { key: 'items', url: `${getCloudApiBase()}/items`, handler: async (r: Response) => {
        const raw = await r.json()
        cachedCloudItems = Array.isArray(raw) ? raw : null
        if (cachedCloudItems) {
          for (const i of cachedCloudItems as Array<{ id: string; name: string; basePrice: number; inStock: boolean; category: { id?: string; name?: string } | null; variations: unknown; imageUrl: string | null }>) {
            await localPrisma.cachedItem.upsert({
              where: { id: i.id },
              create: { id: i.id, name: i.name, basePrice: i.basePrice, inStock: i.inStock ?? true, categoryId: i.category?.id ?? null, categoryName: i.category?.name ?? null, variations: JSON.stringify(i.variations ?? []), imageUrl: i.imageUrl ?? null },
              update: { name: i.name, basePrice: i.basePrice, inStock: i.inStock ?? true, categoryId: i.category?.id ?? null, categoryName: i.category?.name ?? null, variations: JSON.stringify(i.variations ?? []), imageUrl: i.imageUrl ?? null },
            }).catch(() => {})
          }
        }
      }},
      { key: 'employees', url: `${getCloudApiBase()}/employees`, handler: async (r: Response) => { cachedCloudEmployees = await r.json() }},
      { key: 'tax-slabs', url: `${getCloudApiBase()}/tax-slabs`, handler: async (r: Response) => {
        cachedTaxSlabs = await r.json()
        if (Array.isArray(cachedTaxSlabs)) {
          for (const slab of cachedTaxSlabs as Array<{ id: string; name: string; percent: number; isDefault?: boolean; isActive?: boolean }>) {
            await localPrisma.cachedTaxSlab.upsert({
              where: { id: slab.id },
              create: { id: slab.id, name: slab.name, percent: slab.percent, isDefault: slab.isDefault ?? false, isActive: slab.isActive ?? true },
              update: { name: slab.name, percent: slab.percent, isDefault: slab.isDefault ?? false, isActive: slab.isActive ?? true },
            }).catch(() => {})
          }
        }
      }},
      { key: 'areas', url: `${getCloudApiBase()}/areas`, handler: async (r: Response) => {
        cachedAreas = await r.json()
        if (Array.isArray(cachedAreas)) {
          for (const a of cachedAreas as Array<{ id: string; name: string }>) {
            await localPrisma.cachedArea.upsert({
              where: { id: a.id },
              create: { id: a.id, name: a.name },
              update: { name: a.name },
            }).catch(() => {})
          }
        }
      }},
      { key: 'orders', url: `${getCloudApiBase()}/orders`, handler: async (r: Response) => {
        const raw = await r.json()
        if (Array.isArray(raw)) {
          for (const o of raw as Array<Record<string, unknown>>) {
            await localPrisma.localOrder.upsert({
              where: { id: o.id as string },
              create: {
                id: o.id as string, tableId: o.tableId as string ?? null, tableName: o.tableName as string ?? null,
                guestCount: o.guestCount as number ?? 2, status: o.status as string ?? 'Draft',
                subtotal: o.subtotal as number ?? 0, taxTotal: o.taxTotal as number ?? 0,
                discountTotal: o.discountTotal as number ?? 0, grandTotal: o.grandTotal as number ?? 0,
                orderType: o.orderType as string ?? 'DineIn', syncStatus: 'Synced',
              },
              update: { status: o.status as string, subtotal: o.subtotal as number, taxTotal: o.taxTotal as number, discountTotal: o.discountTotal as number, grandTotal: o.grandTotal as number },
            }).catch(() => {})
            const items = o.items as Array<Record<string, unknown>> | undefined
            if (items?.length) {
              for (const item of items) {
                await localPrisma.localOrderItem.upsert({
                  where: { id: item.id as string },
                  create: { id: item.id as string, orderId: o.id as string, itemId: item.itemId as string ?? '', itemName: (item.item as Record<string,string>|null)?.name ?? item.itemName as string ?? '', quantity: item.quantity as number ?? 1, unitPrice: item.unitPrice as number ?? 0, lineTotal: item.lineTotal as number ?? 0, status: item.status as string ?? 'New' },
                  update: { quantity: item.quantity as number, unitPrice: item.unitPrice as number, lineTotal: item.lineTotal as number, status: item.status as string },
                }).catch(() => {})
              }
            }
            const settlement = o.settlement as Record<string, unknown> | undefined
            if (settlement?.id) {
              await localPrisma.localSettlement.upsert({
                where: { orderId: o.id as string },
                create: { id: settlement.id as string, orderId: o.id as string, subtotal: settlement.subtotal as number ?? 0, taxTotal: settlement.taxTotal as number ?? 0, discountTotal: settlement.discountTotal as number ?? 0, grandTotal: settlement.grandTotal as number ?? 0, cashPaid: settlement.cashPaid as number ?? 0, cardPaid: settlement.cardPaid as number ?? 0, upiPaid: settlement.upiPaid as number ?? 0, changeGiven: settlement.changeGiven as number ?? 0, settledAt: settlement.settledAt as string ?? new Date().toISOString() },
                update: { cashPaid: settlement.cashPaid as number, cardPaid: settlement.cardPaid as number, upiPaid: settlement.upiPaid as number },
              }).catch(() => {})
            }
          }
        }
      }},
    ]

    syncProgress = { total: endpoints.length, completed: 0, phase: 'downloading', error: null }

    for (const ep of endpoints) {
      try {
        const res = await fetch(ep.url, { headers, signal: controller.signal })
        if (res.ok) {
          await ep.handler(res)
        }
        syncProgress = { ...syncProgress, completed: syncProgress.completed + 1, phase: `Downloaded ${ep.key}` }
      } catch (err) {
        console.warn(`[sync-progress] Failed to fetch ${ep.key}:`, (err as Error).message)
        syncProgress = { ...syncProgress, completed: syncProgress.completed + 1, phase: `Skipped ${ep.key}` }
      }
    }

    clearTimeout(timeout)
    lastSyncTime = Date.now()
    syncProgress = { total: endpoints.length, completed: endpoints.length, phase: 'complete', error: null }
    } catch (err) {
      syncProgress = { ...syncProgress, phase: 'error', error: (err as Error).message }
    } finally {
      syncInProgress = false
      syncPromise = null
    }
  })()

  return syncPromise
}

async function startupCloudSync() {
  try {
    const cloudToken = getCloudAccessToken()
    if (!cloudToken) {
      console.log('[startup] No stored cloud token — data sync will happen on login')
      return
    }
    console.log('[startup] Attempting cloud sync with stored JWT...')
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10_000)
    const headers = { Authorization: `Bearer ${cloudToken}`, 'Content-Type': 'application/json' }
    const [tablesRes, areasRes, itemsRes, settingsRes, categoriesRes, taxSlabsRes, employeesRes, ordersRes] = await Promise.all([
      fetch(`${getCloudApiBase()}/tables`, { headers, signal: controller.signal }),
      fetch(`${getCloudApiBase()}/areas`, { headers, signal: controller.signal }),
      fetch(`${getCloudApiBase()}/items`, { headers, signal: controller.signal }),
      fetch(`${getCloudApiBase()}/settings`, { headers, signal: controller.signal }),
      fetch(`${getCloudApiBase()}/categories`, { headers, signal: controller.signal }),
      fetch(`${getCloudApiBase()}/tax-slabs`, { headers, signal: controller.signal }),
      fetch(`${getCloudApiBase()}/employees`, { headers, signal: controller.signal }),
      fetch(`${getCloudApiBase()}/orders`, { headers, signal: controller.signal }),
    ])
    clearTimeout(timeout)

    if (tablesRes.ok) {
      const raw = await tablesRes.json()
      cachedCloudTables = Array.isArray(raw) ? raw.map((t: Record<string, unknown>) => ({
        id: t.id, name: t.name, capacity: t.capacity ?? 0, status: t.status ?? 'Available',
        area: t.area ?? null,
      })) : null
      if (cachedCloudTables) {
        for (const t of cachedCloudTables as Array<{ id: string; name: string; capacity: number; status: string; area: { id?: string; name?: string } | null }>) {
          await localPrisma.cachedTable.upsert({
            where: { id: t.id },
            create: { id: t.id, name: t.name, capacity: t.capacity, status: t.status, areaId: t.area?.id ?? null, areaName: t.area?.name ?? null },
            update: { name: t.name, capacity: t.capacity, status: t.status, areaId: t.area?.id ?? null, areaName: t.area?.name ?? null },
          }).catch(() => {})
        }
      }
    }
    if (areasRes.ok) {
      cachedAreas = await areasRes.json()
      if (Array.isArray(cachedAreas)) {
        for (const a of cachedAreas as Array<{ id: string; name: string }>) {
          await localPrisma.cachedArea.upsert({
            where: { id: a.id },
            create: { id: a.id, name: a.name },
            update: { name: a.name },
          }).catch(() => {})
        }
      }
    }
    if (itemsRes.ok) {
      const raw = await itemsRes.json()
      cachedCloudItems = Array.isArray(raw) ? raw : null
      if (cachedCloudItems) {
        for (const i of cachedCloudItems as Array<{ id: string; name: string; basePrice: number; inStock: boolean; category: { id?: string; name?: string } | null; variations: unknown; imageUrl: string | null }>) {
          await localPrisma.cachedItem.upsert({
            where: { id: i.id },
            create: { id: i.id, name: i.name, basePrice: i.basePrice, inStock: i.inStock ?? true, categoryId: i.category?.id ?? null, categoryName: i.category?.name ?? null, variations: JSON.stringify(i.variations ?? []), imageUrl: i.imageUrl ?? null },
            update: { name: i.name, basePrice: i.basePrice, inStock: i.inStock ?? true, categoryId: i.category?.id ?? null, categoryName: i.category?.name ?? null, variations: JSON.stringify(i.variations ?? []), imageUrl: i.imageUrl ?? null },
          }).catch(() => {})
        }
      }
    }
    if (settingsRes.ok) {
      const cloudSettings = await settingsRes.json()
      const localLogoUrl = cachedSettings?.logoUrl
      const localPrintLogoUrl = cachedSettings?.printLogoUrl
      const isLocalLogoUrl = typeof localLogoUrl === 'string' && localLogoUrl.startsWith('/uploads/')
      const isLocalPrintLogoUrl = typeof localPrintLogoUrl === 'string' && localPrintLogoUrl.startsWith('/uploads/')
      cachedSettings = {
        ...cloudSettings,
        ...(isLocalLogoUrl && !(cloudSettings && (cloudSettings as Record<string,unknown>).logoUrl) ? { logoUrl: localLogoUrl } : {}),
        ...(isLocalPrintLogoUrl && !(cloudSettings && (cloudSettings as Record<string,unknown>).printLogoUrl) ? { printLogoUrl: localPrintLogoUrl } : {}),
      }
      await localPrisma.cachedSetting.upsert({
        where: { id: 'default' },
        create: { id: 'default', data: JSON.stringify(cachedSettings) },
        update: { data: JSON.stringify(cachedSettings) },
      }).catch(() => {})
    }
    if (categoriesRes.ok) {
      cachedCategories = await categoriesRes.json()
      if (Array.isArray(cachedCategories)) {
        for (const c of cachedCategories as Array<{ id: string; name: string; displayOrder?: number; imageUrl?: string | null; kitchenId?: string | null }>) {
          await localPrisma.cachedCategory.upsert({
            where: { id: c.id },
            create: { id: c.id, name: c.name, displayOrder: c.displayOrder ?? 0, imageUrl: c.imageUrl ?? null, kitchenId: c.kitchenId ?? null },
            update: { name: c.name, displayOrder: c.displayOrder ?? 0, imageUrl: c.imageUrl ?? null },
          }).catch(() => {})
        }
      }
    }
    if (taxSlabsRes.ok) {
      cachedTaxSlabs = await taxSlabsRes.json()
      if (Array.isArray(cachedTaxSlabs)) {
        for (const slab of cachedTaxSlabs as Array<{ id: string; name: string; percent: number; isDefault?: boolean; isActive?: boolean }>) {
          await localPrisma.cachedTaxSlab.upsert({
            where: { id: slab.id },
            create: { id: slab.id, name: slab.name, percent: slab.percent, isDefault: slab.isDefault ?? false, isActive: slab.isActive ?? true },
            update: { name: slab.name, percent: slab.percent, isDefault: slab.isDefault ?? false, isActive: slab.isActive ?? true },
          }).catch(() => {})
        }
      }
    }
    if (employeesRes.ok) cachedCloudEmployees = await employeesRes.json()
    if (ordersRes.ok) {
      const raw = await ordersRes.json()
      if (Array.isArray(raw)) {
        for (const o of raw as Array<Record<string, unknown>>) {
          await localPrisma.localOrder.upsert({
            where: { id: o.id as string },
            create: {
              id: o.id as string, tableId: o.tableId as string ?? null, tableName: o.tableName as string ?? null,
              guestCount: o.guestCount as number ?? 2, status: o.status as string ?? 'Draft',
              subtotal: o.subtotal as number ?? 0, taxTotal: o.taxTotal as number ?? 0,
              discountTotal: o.discountTotal as number ?? 0, grandTotal: o.grandTotal as number ?? 0,
              orderType: o.orderType as string ?? 'DineIn', syncStatus: 'Synced',
            },
            update: { status: o.status as string, subtotal: o.subtotal as number, taxTotal: o.taxTotal as number, discountTotal: o.discountTotal as number, grandTotal: o.grandTotal as number },
          }).catch(() => {})
          const items = o.items as Array<Record<string, unknown>> | undefined
          if (items?.length) {
            for (const item of items) {
              await localPrisma.localOrderItem.upsert({
                where: { id: item.id as string },
                create: { id: item.id as string, orderId: o.id as string, itemId: item.itemId as string ?? '', itemName: (item.item as Record<string,string>|null)?.name ?? item.itemName as string ?? '', quantity: item.quantity as number ?? 1, unitPrice: item.unitPrice as number ?? 0, lineTotal: item.lineTotal as number ?? 0, status: item.status as string ?? 'New' },
                update: { quantity: item.quantity as number, unitPrice: item.unitPrice as number, lineTotal: item.lineTotal as number, status: item.status as string },
              }).catch(() => {})
            }
          }
          const settlement = o.settlement as Record<string, unknown> | undefined
          if (settlement?.id) {
            await localPrisma.localSettlement.upsert({
              where: { orderId: o.id as string },
              create: { id: settlement.id as string, orderId: o.id as string, subtotal: settlement.subtotal as number ?? 0, taxTotal: settlement.taxTotal as number ?? 0, discountTotal: settlement.discountTotal as number ?? 0, grandTotal: settlement.grandTotal as number ?? 0, cashPaid: settlement.cashPaid as number ?? 0, cardPaid: settlement.cardPaid as number ?? 0, upiPaid: settlement.upiPaid as number ?? 0, changeGiven: settlement.changeGiven as number ?? 0, settledAt: settlement.settledAt as string ?? new Date().toISOString() },
              update: { cashPaid: settlement.cashPaid as number, cardPaid: settlement.cardPaid as number, upiPaid: settlement.upiPaid as number },
            }).catch(() => {})
          }
        }
      }
    }

    cloudAccessToken = cloudToken
    syncWorkerService.setCloudToken(cloudToken)
    lastSyncTime = Date.now()
    console.log(`[startup] Synced: tables=${cachedCloudTables?.length ?? 0}, items=${cachedCloudItems?.length ?? 0}, settings=${!!cachedSettings}, categories=${(cachedCategories as unknown[])?.length ?? 0}, employees=${(cachedCloudEmployees as unknown[])?.length ?? 0}`)
  } catch (err) {
    console.warn('[startup] Cloud sync failed, will retry on login:', (err as Error).message)
  }
}

// Seed default admin credentials if no local user exists
async function ensureLocalAdmin() {
  try {
    const existing = await localPrisma.localCredential.findFirst()
    if (!existing) {
      const hash = await argon2.hash('admin123')
      const pinHash = await argon2.hash('1234')
      await localPrisma.localCredential.create({
        data: { phone: '7001181474', passwordHash: hash, pinHash, name: 'Admin', role: 'Admin' },
      })
      console.log('[auth] Created default local admin user')
    }
  } catch (err) {
    console.error('[auth] Failed to seed local admin:', (err as Error).message)
    // Non-fatal — the user may need to create credentials manually or the DB may be fresh
  }
}
async function initLocalDb() {
  await ensureTables()
  await ensureLocalAdmin()
}

// ==================== AUTH ====================

app.post('/api/v1/auth/login', async (req, res) => {
  try {
    const { phone, password, pin } = req.body
    console.log('[login] Attempt:', { phone, hasPassword: !!password, hasPin: !!pin })

    // Query local SQLite credential store ONLY — no cloud dependency
    const credential = await localPrisma.localCredential.findUnique({ where: { phone } })

    if (!credential) {
      console.log('[login] No credential found for phone:', phone)
      res.status(401).json({ error: { message: 'Invalid credentials', statusCode: 401 } })
      return
    }

    // Verify PIN or password against local hash
    let valid = false
    console.log('[login] hasPinHash:', !!credential.pinHash)
    if (pin) {
      if (!credential.pinHash) {
        res.status(401).json({ error: { message: 'PIN not set — use password login', statusCode: 401 } })
        return
      }
      valid = await argon2.verify(credential.pinHash, pin)
    } else {
      const input = password ?? ''
      valid = await argon2.verify(credential.passwordHash, input)
    }
    console.log('[login] Argon2 verification result:', valid)
    if (!valid) {
      res.status(401).json({ error: { message: 'Invalid credentials', statusCode: 401 } })
      return
    }

    const user = {
      id: credential.id,
      name: credential.name,
      phone: credential.phone,
      role: credential.role,
      imageUrl: credential.imageUrl,
    }
    const tokens = generateLocalToken(user)

    // Fire cloud sync in background with progress tracking
    if (password) {
      syncWithProgress(phone, password).catch((err) => console.warn('[login] Sync error:', (err as Error).message))
    }

    // Respond immediately — cloud data arrives asynchronously, frontend polls progress
    const hasCloudData = cachedCloudTables && cachedCloudTables.length > 0
    console.log('[login] Login complete. Has cloud data:', hasCloudData)
    res.json({ ...tokens, user, cloudSynced: hasCloudData, syncRequired: !hasCloudData })
  } catch (err) {
    console.error('[auth] Login error:', err)
    res.status(500).json({ error: { message: 'Internal server error', statusCode: 500 } })
  }
})

app.post('/api/v1/auth/refresh', async (_req, res) => {
  // Token refresh is local — just re-issue
  try {
    const { phone } = _req.body
    const credential = phone ? await localPrisma.localCredential.findUnique({ where: { phone } }) : null
    if (!credential) {
      res.status(401).json({ error: { message: 'Invalid refresh token', statusCode: 401 } })
      return
    }
    const user = { id: credential.id, name: credential.name, phone: credential.phone, role: credential.role, imageUrl: credential.imageUrl }
    const tokens = generateLocalToken(user)
    res.json(tokens)
  } catch {
    res.status(500).json({ error: { message: 'Internal server error', statusCode: 500 } })
  }
})

// ── Admin CRUD stubs (locale-only, queued for cloud sync) ──
// These endpoints accept writes locally and queue them for background sync.
// They return success immediately without any cloud dependency.
function adminQueued(res: import('express').Response) {
  res.json({ ok: true, queued: true })
}

let cloudAccessToken: string | null = null
let lastSyncTime = 0
let syncInProgress = false
let syncPromise: Promise<void> | null = null
let syncProgress = { total: 8, completed: 0, phase: 'idle' as string, error: null as string | null }

function resolveTaxSettings(): { taxPercent: number; taxType: 'Inclusive' | 'Exclusive' } {
  const taxType = (cachedSettings?.taxType as 'Inclusive' | 'Exclusive') ?? 'Exclusive'
  const slabs = (cachedTaxSlabs as Array<{ percent: number; isDefault: boolean }>) ?? []
  const defaultSlab = slabs.find((s) => s.isDefault) ?? slabs[0]
  const taxPercent = defaultSlab?.percent ?? 0
  return { taxPercent, taxType }
}

function computeOrderTotals(subtotal: number, discounts?: Array<{ type: string; value: number }>): { taxTotal: number; discountTotal: number; grandTotal: number } {
  const { taxPercent, taxType } = resolveTaxSettings()
  const { taxTotal } = calculateTax(subtotal, taxPercent, taxType)
  const discountTotal = discounts
    ? discounts.reduce((sum, d) => sum + (d.type === 'Percentage' ? (subtotal * d.value / 100) : d.value), 0)
    : 0
  const exactGrandTotal = taxType === 'Inclusive' ? subtotal - discountTotal : subtotal + taxTotal - discountTotal
  const { grandTotal } = calculateRounding(exactGrandTotal)
  return { taxTotal, discountTotal, grandTotal }
}

function reshapeOrderItems(order: Record<string, unknown> & { items?: Array<Record<string, unknown>> }): Record<string, unknown> {
  if (!order.items) return order
  return {
    ...order,
    items: order.items.map((item) => ({
      ...item,
      item: { name: item.itemName || 'Item' },
      variation: item.variationName ? { name: item.variationName } : undefined,
    })),
  }
}

app.post('/api/v1/tables', async (req, res) => {
  try {
    const body = req.body
    const id = body.id ?? crypto.randomUUID()
    const areaId = (body.areaId as string) ?? (body.area as { id?: string })?.id ?? null
    let areaName = (body.area as { name?: string })?.name ?? null
    if (areaId && !areaName) {
      const area = await localPrisma.cachedArea.findUnique({ where: { id: areaId } }).catch(() => null)
      areaName = area?.name ?? ''
    }
    const areaObj = areaId ? { id: areaId, name: areaName ?? '' } : null
    await localPrisma.cachedTable.upsert({
      where: { id },
      create: { id, name: body.name ?? 'New Table', capacity: body.capacity ?? 4, status: body.status ?? 'Available', areaId, areaName },
      update: { name: body.name, capacity: body.capacity, status: body.status, areaId, areaName },
    })
    if (cachedCloudTables) {
      const idx = (cachedCloudTables as Array<{ id: string }>).findIndex(t => t.id === id)
      const entry = { id, name: body.name, capacity: body.capacity ?? 4, status: body.status ?? 'Available', area: areaObj }
      if (idx >= 0) Object.assign(cachedCloudTables[idx], entry)
      else cachedCloudTables.unshift(entry)
    }
    syncQueueService.enqueue('admin-create', { path: '/tables', body: { ...body, id } }).catch(() => {})
    res.json({ ok: true, id })
  } catch (err) {
    console.error('[tables] Create error:', err)
    res.status(500).json({ error: { message: 'Failed to save table' } })
  }
})
app.put('/api/v1/tables/:id', async (req, res) => {
  try {
    const { id } = req.params
    const body = req.body
    const areaObj = body.area as { id?: string; name?: string } | undefined
    await localPrisma.cachedTable.upsert({
      where: { id },
      create: { id, name: body.name ?? 'Table', capacity: body.capacity ?? 4, status: body.status ?? 'Available', areaId: areaObj?.id ?? null, areaName: areaObj?.name ?? null },
      update: { name: body.name, capacity: body.capacity, status: body.status, areaId: areaObj?.id ?? null, areaName: areaObj?.name ?? null },
    })
    if (cachedCloudTables) {
      const arr = cachedCloudTables as Array<{ id: string }>
      const idx = arr.findIndex(t => t.id === id)
      if (idx >= 0) Object.assign(arr[idx], body)
    }
    syncQueueService.enqueue('admin-put', { path: `/tables/${id}`, body }).catch(() => {})
    res.json({ ok: true })
  } catch (err) {
    console.error('[tables] Update error:', err)
    res.status(500).json({ error: { message: 'Failed to update table' } })
  }
})
app.delete('/api/v1/tables/:id', async (req, res) => {
  try {
    const { id } = req.params
    await localPrisma.cachedTable.delete({ where: { id } }).catch(() => {})
    if (cachedCloudTables) {
      const arr = cachedCloudTables as Array<{ id: string }>
      const idx = arr.findIndex(t => t.id === id)
      if (idx >= 0) arr.splice(idx, 1)
    }
    syncQueueService.enqueue('admin-delete', { path: `/tables/${id}` }).catch(() => {})
    res.json({ ok: true })
  } catch (err) {
    console.error('[tables] Delete error:', err)
    res.status(500).json({ error: { message: 'Failed to delete table' } })
  }
})

app.post('/api/v1/items', async (req, res) => {
  try {
    const body = req.body
    const id = body.id ?? crypto.randomUUID()
    await localPrisma.cachedItem.upsert({
      where: { id },
      create: {
        id, name: body.name ?? 'New Item', basePrice: body.basePrice ?? 0,
        inStock: body.inStock ?? true, categoryId: body.categoryId ?? null,
        categoryName: body.categoryName ?? null,
        variations: JSON.stringify(body.variations ?? []), imageUrl: body.imageUrl ?? null,
      },
      update: {
        name: body.name, basePrice: body.basePrice, categoryId: body.categoryId,
        categoryName: body.categoryName, variations: JSON.stringify(body.variations ?? []), imageUrl: body.imageUrl,
      },
    })
    // Also update in-memory cache so cloud-synced data stays fresh
    if (cachedCloudItems) {
      const idx = cachedCloudItems.findIndex((i: { id: string }) => i.id === id)
      if (idx >= 0) Object.assign(cachedCloudItems[idx], { ...body, variations: body.variations ?? [] })
      else cachedCloudItems.unshift({ id, ...body, variations: body.variations ?? [] })
    }
    syncQueueService.enqueue(body.id ? 'admin-put' : 'admin-create', { path: '/items', body: { ...body, id } }).catch(() => {})
    res.json({ ok: true, id })
  } catch (err) {
    console.error('[items] Create error:', err)
    res.status(500).json({ error: { message: 'Failed to save item' } })
  }
})
app.put('/api/v1/items/:id', async (req, res) => {
  try {
    const { id } = req.params
    const body = req.body
    await localPrisma.cachedItem.upsert({
      where: { id },
      create: {
        id, name: body.name ?? 'New Item', basePrice: body.basePrice ?? 0,
        inStock: body.inStock ?? true, categoryId: body.categoryId ?? null,
        categoryName: body.categoryName ?? null,
        variations: JSON.stringify(body.variations ?? []), imageUrl: body.imageUrl ?? null,
      },
      update: {
        name: body.name, basePrice: body.basePrice, inStock: body.inStock,
        categoryId: body.categoryId, categoryName: body.categoryName,
        variations: JSON.stringify(body.variations ?? []), imageUrl: body.imageUrl,
      },
    })
    if (cachedCloudItems) {
      const idx = cachedCloudItems.findIndex((i: { id: string }) => i.id === id)
      if (idx >= 0) Object.assign(cachedCloudItems[idx], body)
    }
    syncQueueService.enqueue('admin-put', { path: `/items/${id}`, body }).catch(() => {})
    res.json({ ok: true })
  } catch (err) {
    console.error('[items] Update error:', err)
    res.status(500).json({ error: { message: 'Failed to update item' } })
  }
})
app.delete('/api/v1/items/:id', async (req, res) => {
  try {
    const { id } = req.params
    await localPrisma.cachedItem.delete({ where: { id } }).catch(() => {})
    if (cachedCloudItems) {
      const idx = cachedCloudItems.findIndex((i: { id: string }) => i.id === id)
      if (idx >= 0) cachedCloudItems.splice(idx, 1)
    }
    syncQueueService.enqueue('admin-delete', { path: `/items/${id}` }).catch(() => {})
    res.json({ ok: true })
  } catch (err) {
    console.error('[items] Delete error:', err)
    res.status(500).json({ error: { message: 'Failed to delete item' } })
  }
})

app.post('/api/v1/categories', async (req, res) => {
  try {
    const body = req.body
    const id = body.id ?? crypto.randomUUID()
    await localPrisma.cachedCategory.upsert({
      where: { id },
      create: { id, name: body.name ?? 'New Category', displayOrder: body.displayOrder ?? 0, imageUrl: body.imageUrl ?? null, kitchenId: body.kitchenId ?? null },
      update: { name: body.name, displayOrder: body.displayOrder, imageUrl: body.imageUrl, kitchenId: body.kitchenId },
    })
    if (cachedCategories) {
      const arr = cachedCategories as Array<{ id: string; name: string; _count?: { items: number } }>
      const idx = arr.findIndex(c => c.id === id)
      const entry = { id, name: body.name ?? 'New Category', _count: { items: 0 } }
      if (idx >= 0) arr[idx] = entry
      else arr.unshift(entry)
    }
    syncQueueService.enqueue('admin-create', { path: '/categories', body: { ...body, id } }).catch(() => {})
    res.json({ ok: true, id })
  } catch (err) {
    console.error('[categories] Create error:', err)
    res.status(500).json({ error: { message: 'Failed to save category' } })
  }
})
app.put('/api/v1/categories/:id', async (req, res) => {
  try {
    const { id } = req.params
    const body = req.body
    await localPrisma.cachedCategory.upsert({
      where: { id },
      create: { id, name: body.name ?? 'Category', displayOrder: body.displayOrder ?? 0, imageUrl: body.imageUrl ?? null, kitchenId: body.kitchenId ?? null },
      update: { name: body.name, displayOrder: body.displayOrder, imageUrl: body.imageUrl, kitchenId: body.kitchenId },
    })
    if (cachedCategories) {
      const arr = cachedCategories as Array<{ id: string; name: string }>
      const idx = arr.findIndex(c => c.id === id)
      if (idx >= 0) arr[idx] = { ...arr[idx], ...body }
    }
    syncQueueService.enqueue('admin-put', { path: `/categories/${id}`, body }).catch(() => {})
    res.json({ ok: true })
  } catch (err) {
    console.error('[categories] Update error:', err)
    res.status(500).json({ error: { message: 'Failed to update category' } })
  }
})
app.delete('/api/v1/categories/:id', async (req, res) => {
  try {
    const { id } = req.params
    await localPrisma.cachedCategory.delete({ where: { id } }).catch(() => {})
    if (cachedCategories) {
      const arr = cachedCategories as Array<{ id: string }>
      const idx = arr.findIndex(c => c.id === id)
      if (idx >= 0) arr.splice(idx, 1)
    }
    syncQueueService.enqueue('admin-delete', { path: `/categories/${id}` }).catch(() => {})
    res.json({ ok: true })
  } catch (err) {
    console.error('[categories] Delete error:', err)
    res.status(500).json({ error: { message: 'Failed to delete category' } })
  }
})

app.post('/api/v1/areas', async (req, res) => {
  try {
    const id = req.body.id ?? crypto.randomUUID()
    await localPrisma.cachedArea.upsert({
      where: { id },
      create: { id, name: req.body.name ?? 'New Area' },
      update: { name: req.body.name },
    })
    if (cachedAreas && Array.isArray(cachedAreas)) {
      const existing = (cachedAreas as Array<{ id: string }>).findIndex(a => a.id === id)
      const entry = { id, name: req.body.name, _count: { tables: 0 } }
      if (existing >= 0) (cachedAreas as Array<Record<string, unknown>>)[existing] = entry as unknown as Record<string, unknown>
      else (cachedAreas as Array<unknown>).unshift(entry)
    }
    syncQueueService.enqueue('admin-create', { path: '/areas', body: { ...req.body, id } }).catch(() => {})
    res.json({ ok: true, id })
  } catch (err) {
    console.error('[areas] Create error:', err)
    res.status(500).json({ error: 'Failed to create area' })
  }
})
app.delete('/api/v1/areas/:id', async (req, res) => {
  try {
    const { id } = req.params
    await localPrisma.cachedArea.delete({ where: { id } }).catch(() => {})
    if (cachedAreas && Array.isArray(cachedAreas)) {
      cachedAreas = (cachedAreas as Array<{ id: string }>).filter(a => a.id !== id)
    }
    syncQueueService.enqueue('admin-delete', { path: `/areas/${req.params.id}` }).catch(() => {})
    res.json({ ok: true })
  } catch (err) {
    console.error('[areas] Delete error:', err)
    res.status(500).json({ error: 'Failed to delete area' })
  }
})

app.put('/api/v1/settings', (req, res) => {
  syncQueueService.enqueue('admin-put', { path: '/settings', body: req.body }).catch(() => {})
  adminQueued(res)
})

app.post('/api/v1/tax-slabs', (req, res) => {
  syncQueueService.enqueue('admin-create', { path: '/tax-slabs', body: req.body }).catch(() => {})
  adminQueued(res)
})
app.put('/api/v1/tax-slabs/:id', (req, res) => {
  syncQueueService.enqueue('admin-put', { path: `/tax-slabs/${req.params.id}`, body: req.body }).catch(() => {})
  adminQueued(res)
})
app.delete('/api/v1/tax-slabs/:id', (req, res) => {
  syncQueueService.enqueue('admin-delete', { path: `/tax-slabs/${req.params.id}` }).catch(() => {})
  adminQueued(res)
})

app.post('/api/v1/employees', async (req, res) => {
  try {
    const { name, phone, pin, password, role } = req.body
    const id = crypto.randomUUID()
    // Also save locally so the employee can log in immediately
    const passwordHash = await argon2.hash(password ?? 'admin123')
    const pinHash = pin ? await argon2.hash(pin) : null
    await localPrisma.localCredential.upsert({
      where: { phone },
      create: { id, phone, passwordHash, pinHash, name: name ?? '', role: role ?? 'Cashier' },
      update: { passwordHash, pinHash, name: name ?? '', role: role ?? 'Cashier' },
    })
    // Push into local in-memory cache so it shows in the employee list immediately
    const entry = { id, name: name ?? '', phone, role: role ?? 'Cashier', active: true }
    if (cachedCloudEmployees) {
      cachedCloudEmployees.unshift(entry)
    } else {
      cachedCloudEmployees = [entry]
    }
    syncQueueService.enqueue('admin-create', { path: '/employees', body: { ...req.body, id } }).catch(() => {})
    res.json({ ok: true, id })
  } catch (err) {
    console.error('[employees] Create error:', err)
    res.status(500).json({ error: { message: 'Failed to create employee' } })
  }
})
app.put('/api/v1/employees/:id', async (req, res) => {
  try {
    const { name, phone, pin, password, role, active } = req.body
    if (phone) {
      const updateData: Record<string, unknown> = { phone }
      if (name) updateData.name = name
      if (role) updateData.role = role
      if (password) updateData.passwordHash = await argon2.hash(password)
      if (pin) updateData.pinHash = await argon2.hash(pin)
      if (active !== undefined) updateData.active = active
      await localPrisma.localCredential.upsert({
        where: { phone },
        create: { phone, passwordHash: await argon2.hash(password ?? 'admin123'), pinHash: pin ? await argon2.hash(pin) : null, name: name ?? '', role: role ?? 'Cashier' },
        update: updateData,
      })
    }
    syncQueueService.enqueue('admin-put', { path: `/employees/${req.params.id}`, body: req.body }).catch(() => {})
    adminQueued(res)
  } catch (err) {
    console.error('[employees] Update error:', err)
    res.status(500).json({ error: { message: 'Failed to update employee' } })
  }
})
app.delete('/api/v1/employees/:id', async (req, res) => {
  try {
    syncQueueService.enqueue('admin-delete', { path: `/employees/${req.params.id}` }).catch(() => {})
    adminQueued(res)
  } catch (err) {
    console.error('[employees] Delete error:', err)
    res.status(500).json({ error: { message: 'Failed to delete employee' } })
  }
})
app.put('/api/v1/employees/:id/change-password', async (req, res) => {
  try {
    const { phone, newPassword } = req.body
    if (phone && newPassword) {
      const passwordHash = await argon2.hash(newPassword)
      await localPrisma.localCredential.update({
        where: { phone },
        data: { passwordHash },
      })
    }
    syncQueueService.enqueue('admin-put', { path: `/employees/${req.params.id}/change-password`, body: req.body }).catch(() => {})
    adminQueued(res)
  } catch (err) {
    console.error('[employees] Change password error:', err)
    res.status(500).json({ error: { message: 'Failed to change password' } })
  }
})

app.post('/api/v1/orders/:id/void', async (req, res) => {
  try {
    const { id } = req.params
    await localPrisma.localOrder.update({
      where: { id },
      data: { status: 'Cancelled', subtotal: 0, taxTotal: 0, discountTotal: 0, grandTotal: 0 },
    }).catch(() => {})
    if (io) {
      io.emit('order:updated', { orderId: id, action: 'voided' })
    }
    syncQueueService.enqueue('admin-put', { path: `/orders/${id}/void` }).catch(() => {})
    res.json({ ok: true })
  } catch (err) {
    console.error('[void] Error:', err)
    res.status(500).json({ error: 'Failed to cancel order' })
  }
})
app.post('/api/v1/orders/:id/refund', (req, res) => {
  syncQueueService.enqueue('admin-put', { path: `/orders/${req.params.id}/refund`, body: req.body }).catch(() => {})
  adminQueued(res)
})

app.get('/api/v1/activity-log', async (req, res) => {
  try {
    const cloudToken = getCloudAccessToken()
    if (!cloudToken) { res.json([]); return }
    const queryParams = new URLSearchParams(req.query as Record<string, string>).toString()
    const cloudRes = await fetch(`${getCloudApiBase()}/activity-log?${queryParams}`, {
      headers: { Authorization: `Bearer ${cloudToken}` },
      signal: AbortSignal.timeout(10_000),
    })
    if (!cloudRes.ok) { res.json([]); return }
    const data = await cloudRes.json()
    res.json(data)
  } catch {
    res.json([])
  }
})

// Auth sub-routes that don't need cloud
app.post('/api/v1/auth/set-pin', async (req, res) => {
  try {
    const { pin, phone } = req.body
    if (!pin || !phone) {
      res.status(400).json({ error: { message: 'PIN and phone are required' } })
      return
    }
    const hash = await argon2.hash(pin)
    await localPrisma.localCredential.update({ where: { phone }, data: { pinHash: hash } })
    res.json({ ok: true })
  } catch (err) {
    console.error('[auth] set-pin error:', err)
    res.status(500).json({ error: { message: 'Failed to set PIN' } })
  }
})
app.post('/api/v1/auth/logout', (_req, res) => res.json({ ok: true }))
app.post('/api/v1/auth/upload-image', (req, res) => {
  syncQueueService.enqueue('admin-put', { path: '/auth/upload-image', body: req.body }).catch(() => {})
  adminQueued(res)
})
app.post('/api/v1/auth/check-phone', async (req, res) => {
  try {
    const { phone } = req.body
    const credential = await localPrisma.localCredential.findUnique({ where: { phone } })
    res.json({ exists: !!credential })
  } catch {
    res.json({ exists: false })
  }
})
app.post('/api/v1/auth/update-profile', (req, res) => {
  syncQueueService.enqueue('admin-put', { path: '/auth/update-profile', body: req.body }).catch(() => {})
  adminQueued(res)
})
app.post('/api/v1/auth/change-password', (req, res) => {
  syncQueueService.enqueue('admin-put', { path: '/auth/change-password', body: req.body }).catch(() => {})
  adminQueued(res)
})

// Settings upload routes
app.post('/api/v1/settings/upload-logo', async (req, res) => {
  try {
    const { image } = req.body
    if (!image || typeof image !== 'string') {
      res.status(400).json({ error: { message: 'No image provided' } })
      return
    }
    const matches = image.match(/^data:(image\/\w+);base64,(.+)$/)
    if (!matches) {
      res.status(400).json({ error: { message: 'Invalid image format' } })
      return
    }
    const ext = matches[1] === 'image/png' ? 'png' : 'jpg'
    const filename = `logo-${crypto.randomUUID()}.${ext}`
    const filepath = path.join(uploadsDir, filename)
    fs.writeFileSync(filepath, Buffer.from(matches[2]!, 'base64'))
    const logoUrl = `/uploads/${filename}`
    if (cachedSettings) {
      cachedSettings = { ...cachedSettings, logoUrl }
      await localPrisma.cachedSetting.upsert({
        where: { id: 'default' },
        create: { key: 'settings', value: JSON.stringify(cachedSettings) },
        update: { value: JSON.stringify(cachedSettings) },
      }).catch(() => {})
    }
    syncQueueService.enqueue('admin-put', { path: '/settings/upload-logo', body: { image } }).catch(() => {})
    res.json({ logoUrl })
  } catch (err) {
    console.error('[upload-logo] Error:', err)
    res.status(500).json({ error: { message: 'Failed to upload logo' } })
  }
})
app.post('/api/v1/settings/upload-print-logo', async (req, res) => {
  try {
    const { image } = req.body
    if (!image || typeof image !== 'string') {
      res.status(400).json({ error: { message: 'No image provided' } })
      return
    }
    const matches = image.match(/^data:(image\/\w+);base64,(.+)$/)
    if (!matches) {
      res.status(400).json({ error: { message: 'Invalid image format' } })
      return
    }
    const ext = matches[1] === 'image/png' ? 'png' : 'jpg'
    const filename = `print-logo-${crypto.randomUUID()}.${ext}`
    const filepath = path.join(uploadsDir, filename)
    fs.writeFileSync(filepath, Buffer.from(matches[2]!, 'base64'))
    const printLogoUrl = `/uploads/${filename}`
    if (cachedSettings) {
      cachedSettings = { ...cachedSettings, printLogoUrl }
      await localPrisma.cachedSetting.upsert({
        where: { id: 'default' },
        create: { key: 'settings', value: JSON.stringify(cachedSettings) },
        update: { value: JSON.stringify(cachedSettings) },
      }).catch(() => {})
    }
    syncQueueService.enqueue('admin-put', { path: '/settings/upload-print-logo', body: { image } }).catch(() => {})
    res.json({ printLogoUrl })
  } catch (err) {
    console.error('[upload-print-logo] Error:', err)
    res.status(500).json({ error: { message: 'Failed to upload print logo' } })
  }
})
app.delete('/api/v1/settings/delete-logo', (_req, res) => adminQueued(res))
app.delete('/api/v1/settings/delete-print-logo', (_req, res) => adminQueued(res))

app.get('/api/v1/tables', async (req, res) => {
  try {
    const tableName = req.query.tableName as string | undefined

    // 1. Load tables from local SQLite (persisted, updated on every create/edit, survives offline)
    const localTables = await localPrisma.cachedTable.findMany()
    let activeOrders: Array<{ id: string; tableId: string | null; tableName: string | null; status: string; subtotal: number; grandTotal: number; createdAt: Date; updatedAt: Date }> = []
    if (localTables.length > 0) {
      activeOrders = await localPrisma.localOrder.findMany({
        where: { status: { notIn: ['Settled', 'Cancelled'] } },
        select: { id: true, tableId: true, tableName: true, status: true, subtotal: true, grandTotal: true, createdAt: true, updatedAt: true },
      })
      const orderByTableId = new Map<string, (typeof activeOrders)[number]>()
      const orderByTableName = new Map<string, (typeof activeOrders)[number]>()
      for (const o of activeOrders) {
        if (o.tableId) orderByTableId.set(o.tableId, o)
        if (o.tableName) orderByTableName.set(o.tableName, o)
      }
      let tables = localTables.map((t) => {
        const local = orderByTableId.get(t.id) ?? orderByTableName.get(t.name)
        const tableStatus = local ? (local.status === 'KOT_Sent' ? 'Occupied' : local.status === 'Bill_Printed' ? 'Billed' : t.status) : t.status
        return {
          id: t.id,
          name: t.name,
          capacity: t.capacity,
          status: tableStatus,
          area: t.areaId ? { id: t.areaId, name: t.areaName ?? '' } : null,
          orders: local ? [{ id: local.id, createdAt: local.createdAt, updatedAt: local.updatedAt, subtotal: local.subtotal, grandTotal: local.grandTotal, status: local.status }] : [],
        }
      })
      if (tableName) tables = tables.filter((t) => t.name.toLowerCase().includes(tableName.toLowerCase()))
      res.json(tables)
      return
    }

    // 2. Use in-memory cloud cache if local DB is empty
    const sourceTables = cachedCloudTables
    if (sourceTables && (sourceTables as unknown[]).length > 0) {
      const localOrders = await localPrisma.localOrder.findMany({
        where: { status: { notIn: ['Settled', 'Cancelled'] } },
        select: { id: true, tableId: true, tableName: true, status: true, subtotal: true, grandTotal: true, createdAt: true, updatedAt: true },
      })
      const localByTableId = new Map<string, (typeof localOrders)[number]>()
      const localByTableName = new Map<string, (typeof localOrders)[number]>()
      for (const o of localOrders) {
        if (o.tableId) localByTableId.set(o.tableId, o)
        if (o.tableName) localByTableName.set(o.tableName, o)
      }
      let tables = (sourceTables as { id: string; name: string; capacity?: number; status?: string; area?: { id: string; name: string }; areaName?: string }[]).map((ct) => {
        const local = localByTableId.get(ct.id) ?? localByTableName.get(ct.name)
        const tableStatus = local ? (local.status === 'KOT_Sent' ? 'Occupied' : local.status === 'Bill_Printed' ? 'Billed' : ct.status ?? 'Available') : ct.status ?? 'Available'
        return {
          id: ct.id,
          name: ct.name,
          capacity: ct.capacity ?? 0,
          status: tableStatus,
          area: ct.area ?? (ct.areaName ? { id: ct.areaName, name: ct.areaName } : null),
          orders: local ? [{ id: local.id, createdAt: local.createdAt, updatedAt: local.updatedAt, subtotal: local.subtotal, grandTotal: local.grandTotal, status: local.status }] : [],
        }
      })
      if (tableName) tables = tables.filter((t) => t.name.toLowerCase().includes(tableName.toLowerCase()))
      res.json(tables)
      return
    }

    // 3. No data available — return empty
    res.json([])
  } catch (err) {
    console.error('Error fetching tables:', err)
    res.status(500).json({ error: 'Failed to fetch tables' })
  }
})

// Items and categories — served from local DB (persisted, updated on writes)
// Falls back to in-memory cloud cache, then seed data
app.get('/api/v1/items', async (_req, res) => {
  // 1. Local SQLite (persisted across restarts, updated on every create/edit)
  const localItems = await localPrisma.cachedItem.findMany()
  if (localItems.length > 0) {
    res.json(localItems.map(i => ({
      id: i.id, name: i.name, basePrice: i.basePrice, inStock: i.inStock,
      categoryId: i.categoryId, category: i.categoryId ? { id: i.categoryId, name: i.categoryName ?? '' } : null,
      variations: JSON.parse(i.variations), imageUrl: i.imageUrl,
    })))
    return
  }
  // 2. In-memory cloud cache
  if (cachedCloudItems && cachedCloudItems.length > 0) {
    res.json(cachedCloudItems)
    return
  }
  // 3. No data — return empty
  res.json([])
})

app.get('/api/v1/categories', async (_req, res) => {
  // 1. Local SQLite (persisted, updated on every create/edit)
  const localCats = await localPrisma.cachedCategory.findMany({ orderBy: { displayOrder: 'asc' } })
  if (localCats.length > 0) {
    const localItems = await localPrisma.cachedItem.findMany({ select: { categoryId: true } })
    const countByCategory = new Map<string, number>()
    for (const item of localItems) {
      if (item.categoryId) countByCategory.set(item.categoryId, (countByCategory.get(item.categoryId) ?? 0) + 1)
    }
    res.json(localCats.map(c => ({ id: c.id, name: c.name, displayOrder: c.displayOrder, imageUrl: c.imageUrl, _count: { items: countByCategory.get(c.id) ?? 0 } })))
    return
  }
  // 2. In-memory cloud cache
  if (cachedCategories && (cachedCategories as unknown[]).length > 0) {
    res.json(cachedCategories)
    return
  }
  // 3. No data — return empty
  res.json([])
})

app.get('/api/v1/settings', (_req, res) => {
  if (cachedSettings) {
    const s = { ...cachedSettings }
    const cloudBase = getCloudApiBase().replace(/\/api\/v\d\/?$/, '')
    // Rewrite relative logo paths to point to local API if the file exists locally,
    // otherwise use the cloud URL
    if (typeof s.logoUrl === 'string' && s.logoUrl.startsWith('/') && !s.logoUrl.startsWith('/api')) {
      const localFile = path.join(uploadsDir, path.basename(s.logoUrl))
      if (fs.existsSync(localFile)) {
        s.logoUrl = s.logoUrl
      } else {
        s.logoUrl = `${cloudBase}${s.logoUrl}`
      }
    }
    if (typeof s.printLogoUrl === 'string' && s.printLogoUrl.startsWith('/') && !s.printLogoUrl.startsWith('/api')) {
      const localFile = path.join(uploadsDir, path.basename(s.printLogoUrl))
      if (fs.existsSync(localFile)) {
        s.printLogoUrl = s.printLogoUrl
      } else {
        s.printLogoUrl = `${cloudBase}${s.printLogoUrl}`
      }
    }
    res.json(s)
    return
  }
  res.json(null)
})

app.get('/api/v1/tax-slabs', async (_req, res) => {
  if (cachedTaxSlabs && (cachedTaxSlabs as unknown[]).length > 0) {
    res.json(cachedTaxSlabs)
    return
  }
  const localSlabs = await localPrisma.cachedTaxSlab.findMany()
  if (localSlabs.length > 0) {
    res.json(localSlabs)
    return
  }
  res.json([])
})

// Areas — serve from cloud cache, seed data, or empty
app.get('/api/v1/areas', async (_req, res) => {
  // 1. Local SQLite
  const localAreas = await localPrisma.cachedArea.findMany()
  if (localAreas.length > 0) {
    res.json(localAreas.map(a => ({ id: a.id, name: a.name })))
    return
  }
  // 2. In-memory cloud cache
  if (cachedAreas && cachedAreas.length > 0) {
    res.json(cachedAreas)
    return
  }
  // 3. No data — return empty
  res.json([])
})

// Orders list — serve from local DB
app.get('/api/v1/orders', async (req, res) => {
  try {
    const statusFilter = req.query.status as string | undefined
    const where: Record<string, unknown> = {}
    if (statusFilter) {
      where.status = statusFilter
    }
    const orders = await localPrisma.localOrder.findMany({
      where,
      include: { items: true, kots: true, settlement: true },
      orderBy: { createdAt: 'desc' },
    })
    res.json(orders.map(reshapeOrderItems))
  } catch (err) {
    console.error('[orders] List error:', err)
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
})

// Employees — serve from cloud cache or empty
app.get('/api/v1/employees', (_req, res) => {
  if (cachedCloudEmployees && cachedCloudEmployees.length > 0) {
    res.json(cachedCloudEmployees)
    return
  }
  res.json([])
})

app.get('/api/v1/orders/:tableId/active', async (req, res) => {
  try {
    const { tableId } = req.params
    const order = await localPrisma.localOrder.findFirst({
      where: { tableId: tableId as string, status: { not: 'Settled' } },
      include: { items: true, kots: true, settlement: true },
    })
    // Fallback: try by order ID directly (for takeaway orders)
    if (!order) {
      const directOrder = await localPrisma.localOrder.findUnique({
        where: { id: tableId as string },
        include: { items: true, kots: true, settlement: true },
      })
      if (directOrder && directOrder.status !== 'Settled' && directOrder.status !== 'Cancelled') {
        res.json(reshapeOrderItems(directOrder))
        return
      }
    }
    res.json(order ? reshapeOrderItems(order) : null)
  } catch (err) {
    console.error('Error fetching order:', err)
    res.status(500).json({ error: 'Failed to fetch order' })
  }
})

app.post('/api/v1/orders', async (req, res) => {
  try {
    const { tableId, tableName, guestCount, orderType } = req.body
    // Use $transaction to prevent race conditions on concurrent create-order calls
    const order = await localPrisma.$transaction(async (tx) => {
      const existing = await tx.localOrder.findFirst({
        where: { tableId: tableId ?? null, status: { not: 'Settled' } },
        include: { items: true, kots: true, settlement: true },
      })
      if (existing && tableId) return existing
      const created = await tx.localOrder.create({
        data: { tableId: tableId ?? null, tableName: tableName ?? `Table ${tableId ?? 'Takeaway'}`, guestCount: guestCount ?? 2, orderType: orderType ?? 'DineIn' },
        include: { items: true, kots: true, settlement: true },
      })
      return created
    })
    const isNew = !order.items.length
    if (isNew) {
      syncQueueService.enqueue('create-order', { tableId, tableName, guestCount, orderType: orderType ?? 'DineIn' }).catch(() => {})
    }
    res.status(isNew ? 201 : 200).json(order)
  } catch (err) {
    console.error('Error creating order:', err)
    res.status(500).json({ error: 'Failed to create order' })
  }
})

app.post('/api/v1/orders/takeaway', async (req, res) => {
  try {
    const order = await localPrisma.localOrder.create({
      data: { tableId: null, tableName: 'Takeaway', guestCount: 1, orderType: 'Takeaway' },
      include: { items: true, kots: true, settlement: true },
    })
    syncQueueService.enqueue('create-order', { tableId: null, tableName: 'Takeaway', guestCount: 1, orderType: 'Takeaway' }).catch(() => {})
    res.status(201).json(order)
  } catch (err) {
    console.error('Error creating takeaway order:', err)
    res.status(500).json({ error: 'Failed to create takeaway order' })
  }
})

app.get('/api/v1/orders/takeaway/active', async (_req, res) => {
  try {
    const orders = await localPrisma.localOrder.findMany({
      where: { orderType: 'Takeaway', status: { notIn: ['Settled', 'Cancelled'] } },
      include: { items: true, kots: true },
      orderBy: { createdAt: 'desc' },
    })
    res.json(orders.map(reshapeOrderItems))
  } catch (err) {
    console.error('Error fetching takeaway orders:', err)
    res.status(500).json({ error: 'Failed to fetch takeaway orders' })
  }
})

app.get('/api/v1/orders/:id', async (req, res) => {
  try {
    const order = await localPrisma.localOrder.findUnique({
      where: { id: req.params.id as string },
      include: { items: true, kots: true, settlement: true },
    })
    if (!order) { res.status(404).json({ error: { message: 'Order not found' } }); return }
    res.json(order)
  } catch (err) {
    console.error('Error fetching order by id:', err)
    res.status(500).json({ error: 'Failed to fetch order' })
  }
})

app.put('/api/v1/orders/:id', async (req, res) => {
  try {
    const order = await localPrisma.localOrder.update({
      where: { id: req.params.id as string },
      data: req.body,
      include: { items: true, kots: true, settlement: true },
    })
    res.json(order)
  } catch (err) {
    console.error('Error updating order:', err)
    res.status(500).json({ error: 'Failed to update order' })
  }
})

app.post('/api/v1/cart/add-item', async (req, res) => {
  try {
    const { orderId, itemId, itemName, quantity, unitPrice: reqUnitPrice, lineTotal: reqLineTotal, variationId, variationName } = req.body

    let unitPrice = reqUnitPrice
    let itemDisplayName = itemName
    let variationDisplayName = variationName

    if (unitPrice == null) {
      if (cachedCloudItems) {
        const cachedItem = (cachedCloudItems as Array<Record<string, unknown>>).find((i) => i.id === itemId)
        if (cachedItem) {
          itemDisplayName = itemDisplayName ?? (cachedItem.name as string)
          unitPrice = (cachedItem.basePrice as number) ?? 0
          if (variationId && Array.isArray((cachedItem as Record<string, unknown>).variations)) {
            const variation = ((cachedItem as Record<string, unknown>).variations as Array<{ id: string; name: string; priceAdjustment: number }>).find((v: { id: string }) => v.id === variationId)
            if (variation) {
              unitPrice += variation.priceAdjustment
              variationDisplayName = variationDisplayName ?? variation.name
            }
          }
        }
      }
      if (unitPrice == null) {
        const dbItem = await localPrisma.cachedItem.findUnique({ where: { id: itemId } }).catch(() => null)
        if (dbItem) {
          itemDisplayName = itemDisplayName ?? dbItem.name
          unitPrice = dbItem.basePrice
          if (variationId && dbItem.variations) {
            try {
              const variations = JSON.parse(dbItem.variations as string) as Array<{ id: string; name: string; priceAdjustment: number }>
              const variation = variations.find((v) => v.id === variationId)
              if (variation) {
                unitPrice += variation.priceAdjustment
                variationDisplayName = variationDisplayName ?? variation.name
              }
            } catch { }
          }
        }
      }
    }
    if (unitPrice == null) unitPrice = 0
    itemDisplayName = itemDisplayName ?? 'Item'

    const qty = quantity ?? 1
    const lineTotal = reqLineTotal ?? unitPrice * qty

    const item = await localPrisma.localOrderItem.create({
      data: {
        orderId,
        itemId,
        itemName: itemDisplayName,
        quantity: qty,
        unitPrice,
        lineTotal,
        variationId: variationId ?? null,
        variationName: variationDisplayName ?? null,
      },
    })

    const order = await localPrisma.localOrder.findUnique({
      where: { id: orderId },
      include: { items: { where: { status: { not: 'Cancelled' } } } },
    })
    if (order) {
      const subtotal = order.items.reduce((s, i) => s + i.lineTotal, 0)
      const { taxTotal, discountTotal, grandTotal } = computeOrderTotals(subtotal)
      await localPrisma.localOrder.update({ where: { id: orderId }, data: { subtotal, taxTotal, discountTotal, grandTotal } })
    }

    // Notify connected clients (POS) about the order change
    if (io && order?.tableId) {
      io.to(`table:${order.tableId}`).emit('order:updated', {
        orderId,
        tableId: order.tableId,
        action: 'add-item',
      })
    }

    syncQueueService.enqueue('add-item', { orderId, itemId, variationId, quantity: qty, unitPrice, lineTotal, itemName: itemDisplayName }).catch(() => {})

    res.status(201).json(item)
  } catch (err) {
    console.error('Error adding item:', err)
    res.status(500).json({ error: 'Failed to add item' })
  }
})

app.post('/api/v1/cart/remove-item', async (req, res) => {
  try {
    const { orderItemId } = req.body
    const item = await localPrisma.localOrderItem.findUnique({ where: { id: orderItemId } })
    if (!item) { res.status(404).json({ error: 'Item not found' }); return }

    await localPrisma.localOrderItem.delete({ where: { id: orderItemId } })

    // Recalculate order totals
    const order = await localPrisma.localOrder.findUnique({
      where: { id: item.orderId },
      include: { items: { where: { status: { not: 'Cancelled' } } } },
    })
    if (order) {
      const subtotal = order.items.reduce((s, i) => s + i.lineTotal, 0)
      // If no items remain, mark order as Cancelled and free the table
      if (order.items.length === 0) {
        await localPrisma.localOrder.update({
          where: { id: item.orderId },
          data: { status: 'Cancelled', subtotal: 0, taxTotal: 0, discountTotal: 0, grandTotal: 0 },
        })
      } else {
        const { taxTotal, discountTotal, grandTotal } = computeOrderTotals(subtotal)
        await localPrisma.localOrder.update({ where: { id: item.orderId }, data: { subtotal, taxTotal, discountTotal, grandTotal } })
      }
    }

    // Notify connected clients
    if (io && order?.tableId) {
      io.to(`table:${order.tableId}`).emit('order:updated', {
        orderId: item.orderId,
        tableId: order.tableId,
        action: 'remove-item',
      })
    }

    syncQueueService.enqueue('remove-item', { orderItemId }).catch(() => {})

    res.json({ removed: true })
  } catch (err) {
    console.error('Error removing item:', err)
    res.status(500).json({ error: 'Failed to remove item' })
  }
})

app.post('/api/v1/cart/increment', async (req, res) => {
  try {
    const { orderItemId, quantity } = req.body
    const item = await localPrisma.localOrderItem.findUnique({ where: { id: orderItemId } })
    if (!item) { res.status(404).json({ error: 'Item not found' }); return }

    const newQty = quantity ?? item.quantity + 1
    const newLineTotal = item.unitPrice * newQty

    await localPrisma.localOrderItem.update({
      where: { id: orderItemId },
      data: { quantity: newQty, lineTotal: newLineTotal },
    })

    // Recalculate order totals
    const order = await localPrisma.localOrder.findUnique({
      where: { id: item.orderId },
      include: { items: { where: { status: { not: 'Cancelled' } } } },
    })
    if (order) {
      const subtotal = order.items.reduce((s, i) => s + i.lineTotal, 0)
      const { taxTotal, discountTotal, grandTotal } = computeOrderTotals(subtotal)
      await localPrisma.localOrder.update({ where: { id: item.orderId }, data: { subtotal, taxTotal, discountTotal, grandTotal } })
    }

    // Notify connected clients
    if (io && order?.tableId) {
      io.to(`table:${order.tableId}`).emit('order:updated', {
        orderId: item.orderId,
        tableId: order.tableId,
        action: 'increment',
      })
    }

    res.json({ quantity: newQty, lineTotal: newLineTotal })
  } catch (err) {
    console.error('Error incrementing item:', err)
    res.status(500).json({ error: 'Failed to increment item' })
  }
})

// PUT /cart/item-qty — used by POS and Captain apps to set exact quantity
app.put('/api/v1/cart/item-qty', async (req, res) => {
  try {
    const { orderItemId, quantity } = req.body
    const item = await localPrisma.localOrderItem.findUnique({ where: { id: orderItemId } })
    if (!item) { res.status(404).json({ error: 'Item not found' }); return }

    const newQty = quantity ?? item.quantity
    const newLineTotal = item.unitPrice * newQty

    await localPrisma.localOrderItem.update({
      where: { id: orderItemId },
      data: { quantity: newQty, lineTotal: newLineTotal },
    })

    const order = await localPrisma.localOrder.findUnique({
      where: { id: item.orderId },
      include: { items: { where: { status: { not: 'Cancelled' } } } },
    })
    if (order) {
      const subtotal = order.items.reduce((s, i) => s + i.lineTotal, 0)
      const { taxTotal, discountTotal, grandTotal } = computeOrderTotals(subtotal)
      await localPrisma.localOrder.update({ where: { id: item.orderId }, data: { subtotal, taxTotal, discountTotal, grandTotal } })
    }

    // Notify connected clients
    if (io && order?.tableId) {
      io.to(`table:${order.tableId}`).emit('order:updated', {
        orderId: item.orderId,
        tableId: order.tableId,
        action: 'item-qty',
      })
    }

    res.json({ quantity: newQty, lineTotal: newLineTotal })
  } catch (err) {
    console.error('Error updating item qty:', err)
    res.status(500).json({ error: 'Failed to update item quantity' })
  }
})

app.post('/api/v1/cart/cancel-item', async (req, res) => {
  try {
    const { orderItemId } = req.body
    const item = await localPrisma.localOrderItem.findUnique({ where: { id: orderItemId } })
    if (!item) { res.status(404).json({ error: 'Item not found' }); return }

    await localPrisma.localOrderItem.update({
      where: { id: orderItemId },
      data: { status: 'Cancelled' },
    })

    // Recalculate order totals (exclude cancelled items)
    const order = await localPrisma.localOrder.findUnique({
      where: { id: item.orderId },
      include: { items: { where: { status: { not: 'Cancelled' } } } },
    })
    if (order) {
      const subtotal = order.items.reduce((s, i) => s + i.lineTotal, 0)
      await localPrisma.localOrder.update({ where: { id: item.orderId }, data: { subtotal, grandTotal: subtotal } })
    }

    res.json({ cancelled: true })
  } catch (err) {
    console.error('Error cancelling item:', err)
    res.status(500).json({ error: 'Failed to cancel item' })
  }
})

app.post('/api/v1/cart/merge-tables', async (req, res) => {
  try {
    const { sourceTableId, destTableId } = req.body
    if (!sourceTableId || !destTableId) {
      res.status(400).json({ error: 'sourceTableId and destTableId required' })
      return
    }
    const sourceOrder = await localPrisma.localOrder.findFirst({
      where: { tableId: sourceTableId, status: { notIn: ['Settled', 'Cancelled'] } },
      include: { items: true },
    })
    if (!sourceOrder) {
      res.status(404).json({ error: 'No active order on source table' })
      return
    }
    let destOrder = await localPrisma.localOrder.findFirst({
      where: { tableId: destTableId, status: { notIn: ['Settled', 'Cancelled'] } },
    })
    if (!destOrder) {
      const destTbl = await localPrisma.cachedTable.findUnique({ where: { id: destTableId } }).catch(() => null)
      await localPrisma.localOrder.update({
        where: { id: sourceOrder.id },
        data: { tableId: destTableId, tableName: destTbl?.name ?? null },
      })
    } else {
      for (const item of sourceOrder.items) {
        await localPrisma.localOrderItem.update({
          where: { id: item.id },
          data: { orderId: destOrder.id, kotId: null },
        })
      }
      await localPrisma.localOrder.update({
        where: { id: sourceOrder.id },
        data: { status: 'Cancelled', subtotal: 0, taxTotal: 0, discountTotal: 0, grandTotal: 0 },
      })
      const allItems = await localPrisma.localOrderItem.findMany({
        where: { orderId: destOrder.id, status: { not: 'Cancelled' } },
      })
      const subtotal = allItems.reduce((s, i) => s + i.lineTotal, 0)
      const { taxTotal, discountTotal, grandTotal } = computeOrderTotals(subtotal)
      await localPrisma.localOrder.update({
        where: { id: destOrder.id },
        data: { subtotal, taxTotal, discountTotal, grandTotal },
      })
    }
    syncQueueService.enqueue('admin-put', { path: '/cart/merge-tables', body: { sourceTableId, destTableId } }).catch(() => {})
    res.json({ ok: true })
  } catch (err) {
    console.error('[merge-tables] Error:', err)
    res.status(500).json({ error: 'Failed to merge tables' })
  }
})

app.post('/api/v1/kot/send', async (req, res) => {
  try {
    const { orderId, sentBy } = req.body
    const order = await localPrisma.localOrder.findUnique({ where: { id: orderId }, include: { kots: true, items: true } })
    if (!order) {
      res.status(404).json({ error: 'Order not found' })
      return
    }
    const nextKotNumber = order.kots.length > 0 ? Math.max(...order.kots.map((k) => k.kotNumber)) + 1 : 1
    const kot = await localPrisma.localKOT.create({ data: { orderId, kotNumber: nextKotNumber, sentBy: sentBy || 'user' } })

    const newItems = order.items.filter((i) => i.status === 'New')
    for (const item of newItems) {
      await localPrisma.localOrderItem.update({
        where: { id: item.id },
        data: { status: 'Sent', kotId: kot.id },
      })
    }

    await localPrisma.localOrder.update({ where: { id: orderId }, data: { status: 'KOT_Sent' } })

    if (io && order.tableId) {
      io.to(`table:${order.tableId}`).emit('order:status-change', {
        orderId,
        tableId: order.tableId,
        status: 'KOT_Sent',
      })
    }

    syncQueueService.enqueue('send-kot', { orderId }).catch(() => {})

    res.json({ kotId: kot.id, kotNumber: nextKotNumber })
  } catch (err) {
    console.error('Error sending KOT:', err)
    res.status(500).json({ error: 'Failed to send KOT' })
  }
})

app.post('/api/v1/kot/send-with-items', async (req, res, next) => {
  try {
    const { tableId, tableName, guestCount, orderType, sentBy, note, items } = req.body

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'No items provided' })
      return
    }

    let orderId: string
    let kotId = crypto.randomUUID()
    let kotNumber = 1
    let isNewOrder = false

    if (tableId) {
      const existing = await localPrisma.localOrder.findFirst({
        where: { tableId, status: { notIn: ['Settled', 'Cancelled'] } },
        include: { kots: true },
      })
      if (existing) {
        orderId = existing.id
        kotNumber = existing.kots.length > 0 ? Math.max(...existing.kots.map((k) => k.kotNumber)) + 1 : 1
      } else {
        orderId = crypto.randomUUID()
        isNewOrder = true
      }
    } else {
      orderId = crypto.randomUUID()
      isNewOrder = true
    }

    let resolvedTableName = tableName ?? null
    if (tableId && !resolvedTableName) {
      const tbl = await localPrisma.cachedTable.findUnique({ where: { id: tableId } }).catch(() => null)
      if (tbl) resolvedTableName = tbl.name
    }

    if (isNewOrder) {
      await localPrisma.localOrder.create({
        data: {
          id: orderId,
          tableId: tableId ?? null,
          tableName: resolvedTableName,
          guestCount: guestCount ?? 2,
          orderType: orderType ?? 'DineIn',
          status: 'KOT_Sent',
          note: note ?? null,
          subtotal: 0,
          taxTotal: 0,
          discountTotal: 0,
          grandTotal: 0,
        },
      })
    }

    await localPrisma.localKOT.create({
      data: { id: kotId, orderId, kotNumber, sentBy: sentBy ?? 'User' },
    })

    for (const item of items) {
      await localPrisma.localOrderItem.create({
        data: {
          id: crypto.randomUUID(),
          orderId,
          itemId: item.itemId,
          itemName: item.itemName ?? 'Item',
          quantity: item.quantity ?? 1,
          unitPrice: item.unitPrice ?? 0,
          lineTotal: (item.unitPrice ?? 0) * (item.quantity ?? 1),
          variationId: item.variationId ?? null,
          variationName: item.variationName ?? null,
          status: 'Sent',
          kotId,
          note: item.note ?? null,
        },
      })
    }

    const allItems = await localPrisma.localOrderItem.findMany({
      where: { orderId, status: { not: 'Cancelled' } },
    })
    const subtotal = allItems.reduce((s, i) => s + i.lineTotal, 0)
    const { taxTotal, discountTotal, grandTotal } = computeOrderTotals(subtotal)
    await localPrisma.localOrder.update({
      where: { id: orderId },
      data: { subtotal, taxTotal, discountTotal, grandTotal },
    })

    try {
      if (io && tableId) {
        io.to(`table:${tableId}`).emit('order:updated', {
          orderId,
          tableId,
          action: 'kot-sent-with-items',
        })
      }
    } catch (err) {
      console.warn('[kot] Socket emit failed:', (err as Error).message)
    }

    syncQueueService.enqueue('send-kot-with-items', {
      tableId, tableName, guestCount, orderType, sentBy, note,
      items: items.map((i: { itemId: string; itemName: string; variationId?: string; variationName?: string; quantity: number; unitPrice: number; note?: string }) => ({
        itemId: i.itemId, itemName: i.itemName, variationId: i.variationId, variationName: i.variationName, quantity: i.quantity, unitPrice: i.unitPrice, note: i.note,
      })),
    }).catch((err) => console.warn('[kot] Sync queue enqueue failed:', (err as Error).message))

    res.status(201).json({ orderId, kotNumber })
  } catch (err) {
    console.error('[kot] Error sending KOT with items:', err)
    next(err)
  }
})

app.post('/api/v1/tables/:tableId/lock', (req, res) => {
  try {
    const { tableId } = req.params
    const { userId, userName } = req.body
    const acquired = tableLockService.acquire(tableId as string, userId, userName ?? 'Unknown')
    if (!acquired) {
      res.status(409).json({ error: 'Table is locked by another user' })
      return
    }
    res.json({ locked: true })
  } catch (err) {
    console.error('Error locking table:', err)
    res.status(500).json({ error: 'Failed to lock table' })
  }
})

app.post('/api/v1/tables/:tableId/unlock', (req, res) => {
  try {
    const { tableId } = req.params
    tableLockService.release(tableId as string)
    res.json({ locked: false })
  } catch (err) {
    console.error('Error unlocking table:', err)
    res.status(500).json({ error: 'Failed to unlock table' })
  }
})

// ── Settlement endpoints ──────────────────────────────────────

app.post('/api/v1/settlement', async (req, res) => {
  try {
    const { orderId, discountType, discountValue, discountReason, payments } = req.body
    const order = await localPrisma.localOrder.findUnique({
      where: { id: orderId },
      include: { items: { where: { status: { not: 'Cancelled' } } } },
    })
    if (!order) { res.status(404).json({ error: { message: 'Order not found' } }); return }

    const subtotal = order.items.reduce((sum, i) => sum + i.lineTotal, 0)
    const { taxTotal, discountTotal, grandTotal } = computeOrderTotals(subtotal)
    const totalPaid = (payments.cash ?? 0) + (payments.card ?? 0) + (payments.upi ?? 0)

    if (totalPaid < grandTotal) {
      res.status(400).json({ error: { message: 'Insufficient payment' } }); return
    }

    const changeAmt = totalPaid - grandTotal

    await localPrisma.$transaction([
      localPrisma.localOrder.update({
        where: { id: orderId },
        data: { status: 'Settled', subtotal, taxTotal, discountTotal, grandTotal, syncStatus: 'Pending' },
      }),
      localPrisma.localSettlement.create({
        data: {
          orderId,
          subtotal,
          taxTotal,
          discountTotal,
          grandTotal,
          cashPaid: payments.cash ?? 0,
          cardPaid: payments.card ?? 0,
          upiPaid: payments.upi ?? 0,
          discountType: discountType ?? null,
          discountValue: discountValue ?? null,
          discountReason: discountReason ?? null,
          changeGiven: changeAmt,
        },
      }),
    ])

    syncQueueService.enqueue('settle', { orderId, discountType, discountValue, discountReason, payments }).catch(() => {})

    res.json({ orderId, subtotal, grandTotal, totalPaid, change: changeAmt })
  } catch (err) {
    console.error('Error settling order:', err)
    res.status(500).json({ error: 'Failed to settle order' })
  }
})

app.get('/api/v1/settlement/summary', async (req, res) => {
  try {
    const date = req.query.date as string | undefined
    const where: Record<string, unknown> = {}

    if (date) {
      const d = new Date(date)
      where.settledAt = {
        gte: new Date(d.setHours(0, 0, 0, 0)),
        lte: new Date(d.setHours(23, 59, 59, 999)),
      }
    } else {
      const now = new Date()
      where.settledAt = {
        gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
        lte: now,
      }
    }

    const settlements = await localPrisma.localSettlement.findMany({
      where,
      include: { order: { select: { id: true, orderType: true, tableName: true, grandTotal: true, createdAt: true } } },
    })

    const rawCash = settlements.reduce((sum, s) => sum + s.cashPaid, 0)
    const totalChange = settlements.reduce((sum, s) => sum + s.changeGiven, 0)

    const ledger = settlements.map((s) => ({
      id: s.id,
      orderId: s.orderId,
      displayId: null,
      orderType: s.order.orderType,
      tableName: s.order.tableName ?? '',
      grandTotal: s.grandTotal,
      cashPaid: s.cashPaid,
      cardPaid: s.cardPaid,
      upiPaid: s.upiPaid,
      changeAmt: s.changeGiven,
      netCash: s.cashPaid - s.changeGiven,
      createdAt: s.order.createdAt,
    }))

    res.json({
      cash: rawCash - totalChange,
      card: settlements.reduce((sum, s) => sum + s.cardPaid, 0),
      upi: settlements.reduce((sum, s) => sum + s.upiPaid, 0),
      total: (rawCash - totalChange) + settlements.reduce((sum, s) => sum + s.cardPaid + s.upiPaid, 0),
      count: settlements.length,
      ledger,
    })
  } catch (err) {
    console.error('Error fetching payment summary:', err)
    res.status(500).json({ error: 'Failed to fetch payment summary' })
  }
})

app.get('/api/v1/settlement/:orderId', async (req, res) => {
  try {
    const settlement = await localPrisma.localSettlement.findUnique({
      where: { orderId: req.params.orderId as string },
    })
    res.json(settlement)
  } catch (err) {
    console.error('Error fetching settlement:', err)
    res.status(500).json({ error: 'Failed to fetch settlement' })
  }
})

app.put('/api/v1/settlement/:orderId/payment', async (req, res) => {
  try {
    const { orderId } = req.params
    const payments = req.body as { cash?: number; card?: number; upi?: number }
    const existing = await localPrisma.localSettlement.findUnique({ where: { orderId } })
    if (!existing) { res.status(404).json({ error: { message: 'Settlement not found' } }); return }

    const totalPaid = (payments.cash ?? existing.cashPaid) + (payments.card ?? existing.cardPaid) + (payments.upi ?? existing.upiPaid)
    if (totalPaid < existing.grandTotal) {
      res.status(400).json({ error: { message: 'Insufficient payment' } }); return
    }

    const changeGiven = totalPaid - existing.grandTotal

    const updated = await localPrisma.localSettlement.update({
      where: { orderId },
      data: {
        ...(payments.cash !== undefined ? { cashPaid: payments.cash } : {}),
        ...(payments.card !== undefined ? { cardPaid: payments.card } : {}),
        ...(payments.upi !== undefined ? { upiPaid: payments.upi } : {}),
        changeGiven,
      },
    })
    res.json(updated)
  } catch (err) {
    console.error('Error updating payment:', err)
    res.status(500).json({ error: 'Failed to update payment' })
  }
})

app.post('/api/v1/print/kot', async (req, res) => {
  try {
    await printService.printKOT(req.body)
    res.json({ message: 'KOT printed successfully' })
  } catch (err) {
    console.error('Error printing KOT:', err)
    res.status(500).json({ error: 'Failed to print KOT' })
  }
})

app.post('/api/v1/print/bill', async (req, res) => {
  try {
    await printService.printBill(req.body)
    res.json({ message: 'Bill printed successfully' })
  } catch (err) {
    console.error('Error printing bill:', err)
    res.status(500).json({ error: 'Failed to print bill' })
  }
})

app.post('/api/v1/print/reprint-bill', async (req, res) => {
  try {
    await printService.reprintBill(req.body)
    res.json({ message: 'Bill reprinted successfully' })
  } catch (err) {
    console.error('Error reprinting bill:', err)
    res.status(500).json({ error: 'Failed to reprint bill' })
  }
})

app.post('/api/v1/print/test', async (req, res) => {
  try {
    await printService.testPrint(req.body.printerId)
    res.json({ message: 'Test print completed' })
  } catch (err) {
    console.error('Error in test print:', err)
    res.status(500).json({ error: 'Failed to test print' })
  }
})

app.get('/api/v1/print/printers', async (_req, res) => {
  try {
    const printers = await printService.getPrinters()
    res.json(printers)
  } catch (err) {
    res.status(500).json({ error: 'Failed to get printers' })
  }
})

// System printer discovery — accessible via local HTTP from POS renderer
// Uses Electron's main process webContents API to fetch system printers.
// mainWindow must be passed from main.ts since import('electron') doesn't work in bundled context.
let _systemPrinterResolver: (() => Promise<unknown[]>) | null = null
export function setSystemPrinterResolver(resolver: () => Promise<unknown[]>) {
  _systemPrinterResolver = resolver
}

app.get('/api/v1/print/discover-system', async (_req, res) => {
  try {
    if (_systemPrinterResolver) {
      const discovered = await _systemPrinterResolver()
      res.json(discovered)
      return
    }
    res.json([])
  } catch {
    res.json([])
  }
})

app.post('/api/v1/print/printers', async (req, res) => {
  try {
    const printer = await printService.savePrinter(req.body)
    await printService.reconnectPrinter(printer.id)
    res.status(201).json(printer)
  } catch (err) {
    res.status(500).json({ error: 'Failed to save printer' })
  }
})

app.put('/api/v1/print/printers/:id', async (req, res) => {
  try {
    const printer = await printService.savePrinter({ ...req.body, id: req.params.id })
    await printService.reconnectPrinter(printer.id)
    res.json(printer)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update printer' })
  }
})

app.delete('/api/v1/print/printers/:id', async (req, res) => {
  try {
    await printService.deletePrinter(req.params.id as string)
    res.json({ message: 'Printer deleted' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete printer' })
  }
})

app.get('/api/v1/print/stats', async (_req, res) => {
  try {
    const stats = await printService.getStats()
    res.json(stats)
  } catch (err) {
    res.status(500).json({ error: 'Failed to get print stats' })
  }
})

app.get('/api/v1/print/history', async (req, res) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : undefined
    const history = await printService.getHistory(limit)
    res.json(history)
  } catch (err) {
    res.status(500).json({ error: 'Failed to get print history' })
  }
})

app.get('/api/v1/health', (_req, res) => {
  res.json({
    status: 'ok',
    cloudApiBase: getCloudApiBase(),
    cloudAccessToken: !!cloudAccessToken,
    tablesCached: cachedCloudTables?.length ?? 0,
    itemsCached: cachedCloudItems?.length ?? 0,
    settingsCached: !!cachedSettings,
    categoriesCached: (cachedCategories as unknown[])?.length ?? 0,
    employeesCached: (cachedCloudEmployees as unknown[])?.length ?? 0,
    lastSyncTime,
    storedCloudToken: !!getCloudAccessToken(),
    syncProgress,
  })
})

app.get('/api/v1/sync-progress', (_req, res) => {
  const cloudTablesCount = cachedCloudTables?.length ?? 0
  const hasCloudSettings = !!cachedSettings
  const isComplete = (cloudTablesCount > 0 && hasCloudSettings) || syncProgress.completed >= syncProgress.total
  const cloudUnreachable = syncProgress.phase === 'error' && syncProgress.completed === 0
  res.json({
    ...syncProgress,
    cloudApiBase: getCloudApiBase(),
    complete: isComplete || cloudUnreachable, // Allow seed-data fallback when cloud is unreachable
    tablesCached: cloudTablesCount,
    itemsCached: cachedCloudItems?.length ?? 0,
    settingsCached: hasCloudSettings,
    categoriesCached: (cachedCategories as unknown[])?.length ?? 0,
    employeesCached: (cachedCloudEmployees as unknown[])?.length ?? 0,
  })
})

app.post('/api/v1/sync/trigger', async (req, res) => {
  // If a sync is already in progress, return its current progress
  if (syncPromise) {
    res.json({ ok: true, message: 'Sync already in progress', ...syncProgress })
    return
  }
  const { phone, password } = req.body ?? {}
  // If neither credentials nor cloud token, check for stored token
  const cloudToken = getCloudAccessToken()
  const authHeader = req.headers.authorization
  const localToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
  // Verify the caller has a valid local token (basic auth check)
  if (!localToken || !verifyLocalToken(localToken)) {
    console.log('[sync-trigger] No valid local auth token or credentials')
    res.json({ ok: false, message: 'Sync triggered — using existing cloud token if available' })
  }
  console.log('[sync-trigger] Received:', { phone: !!phone, hasPassword: !!password, hasCloudToken: !!cloudToken, hasLocalToken: !!localToken })
  res.json({ ok: true, message: 'Sync started' })
  syncWithProgress(phone, password).catch((err) => console.error('[sync-trigger] Fatal:', err))
})

// Final catch-all for unmatched /api/v1 routes — queue writes, 404 for unknown GETs
app.use('/api/v1', async (req, res) => {
  if (res.headersSent) return
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    syncQueueService.enqueue('admin-crud', {
      method: req.method, path: req.path, body: req.body as Record<string, unknown>,
    }).catch(() => {})
    res.json({ ok: true, queued: true })
    return
  }
  res.status(404).json({ error: { message: `Route ${req.method} ${req.path} not found in local API`, statusCode: 404 } })
})

export function createLocalApiServer() {
  const server = http.createServer(app)
  io = new SocketIOServer(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
  })

  io.on('connection', (socket) => {
    socket.on('subscribe:table', (tableId: string) => {
      socket.join(`table:${tableId}`)
    })
    socket.on('unsubscribe:table', (tableId: string) => {
      socket.leave(`table:${tableId}`)
    })
    socket.on('disconnect', () => {
      tableLockService.releaseForSocket(socket.id)
    })
  })

  setSocketIO(io)

  const port = Number(process.env.LOCAL_API_PORT) || 3001

  initLocalDb()
    .then(() => {
      console.log('[server] Local DB init complete')
      return startupCloudSync()
    })
    .then(() => {
      server.listen(port, '0.0.0.0', () => {
        console.log(`Local POS API running on http://0.0.0.0:${port}`)

      const runBackgroundSync = () => {
        const token = getCloudAccessToken()
        if (token && !syncInProgress) {
          syncWithProgress().catch(() => {})
        }
      }
      // Run immediately, then every 15 seconds
      runBackgroundSync()
      setInterval(runBackgroundSync, 15_000)
    })
  })
  .catch((err) => console.error('[server] DB init failed, starting server anyway:', err))

  return server
}
