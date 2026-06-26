import express from 'express'
import http from 'http'
import * as argon2 from 'argon2'
import { Server as SocketIOServer } from 'socket.io'
import { tableLockService, setSocketIO } from '../services/table-lock.service.js'
import { localPrisma } from '../lib/local-prisma.js'
import { printService } from '../printing/print.service.js'
import { calculateTax, calculateRounding } from '@akrdev/shared'
import { syncQueueService } from '../services/sync-queue.service.js'


let io: SocketIOServer | null = null

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
app.use(express.json())

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

app.get('/api/v1/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), type: 'local-pos', cloudApi: CLOUD_API })
})

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

// CLOUD_API is used for background sync only — NOT for real-time auth/tables/items
const CLOUD_API = process.env.CLOUD_API_URL || 'http://localhost:3000/api/v1'

// In-memory table cache synced from cloud
let cachedCloudTables: unknown[] | null = null
let cachedAreas: unknown[] | null = null
let cachedCloudItems: unknown[] | null = null
let cachedCategories: unknown[] | null = null
let cachedSettings: Record<string, unknown> | null = null
let cachedTaxSlabs: unknown[] | null = null

// Local seed data for offline-first operation
const LOCAL_SEED_TABLES = [
  { id: 'local-t1', name: 'T1', capacity: 2, status: 'Available', area: { id: 'local-area1', name: 'Main Hall' } },
  { id: 'local-t2', name: 'T2', capacity: 4, status: 'Available', area: { id: 'local-area1', name: 'Main Hall' } },
  { id: 'local-t3', name: 'T3', capacity: 4, status: 'Available', area: { id: 'local-area1', name: 'Main Hall' } },
  { id: 'local-t4', name: 'T4', capacity: 6, status: 'Available', area: { id: 'local-area2', name: 'Private' } },
  { id: 'local-t5', name: 'T5', capacity: 2, status: 'Available', area: { id: 'local-area2', name: 'Private' } },
]

const LOCAL_SEED_ITEMS = [
  { id: 'local-i1', name: 'Butter Naan', basePrice: 40, inStock: true, variations: [], categoryId: 'local-c1', category: { id: 'local-c1', name: 'Breads' } },
  { id: 'local-i2', name: 'Tandoori Roti', basePrice: 15, inStock: true, variations: [], categoryId: 'local-c1', category: { id: 'local-c1', name: 'Breads' } },
  { id: 'local-i3', name: 'Paneer Butter Masala', basePrice: 220, inStock: true, variations: [], categoryId: 'local-c2', category: { id: 'local-c2', name: 'Main Course' } },
  { id: 'local-i4', name: 'Dal Makhani', basePrice: 180, inStock: true, variations: [], categoryId: 'local-c2', category: { id: 'local-c2', name: 'Main Course' } },
  { id: 'local-i5', name: 'Chicken Tikka', basePrice: 250, inStock: true, variations: [], categoryId: 'local-c3', category: { id: 'local-c3', name: 'Starters' } },
  { id: 'local-i6', name: 'Gulab Jamun', basePrice: 80, inStock: true, variations: [], categoryId: 'local-c4', category: { id: 'local-c4', name: 'Desserts' } },
  { id: 'local-i7', name: 'Cold Drink', basePrice: 40, inStock: true, variations: [], categoryId: 'local-c5', category: { id: 'local-c5', name: 'Beverages' } },
]

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
    console.log(`[cache] Restored from local DB: tables=${cachedCloudTables?.length ?? 0}, items=${cachedCloudItems?.length ?? 0}, settings=${!!cachedSettings}`)
  } catch (err) {
    console.warn('[cache] Could not restore from local DB:', (err as Error).message)
  }
}
restoreLocalCache().catch(() => {})

// Generate a simple local JWT token
function generateLocalToken(user: { id: string; name: string; phone: string; role: string }): { accessToken: string; refreshToken: string } {
  const payload = JSON.stringify({ userId: user.id, role: user.role, local: true })
  const token = Buffer.from(payload).toString('base64')
  return { accessToken: token, refreshToken: token }
}

// Background: fetch data from cloud (non-blocking, non-essential)
async function backgroundCloudSync(accessToken: string) {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)
    const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' }
    const [tablesRes, itemsRes, settingsRes] = await Promise.all([
      fetch(`${CLOUD_API}/tables`, { headers, signal: controller.signal }),
      fetch(`${CLOUD_API}/items`, { headers, signal: controller.signal }),
      fetch(`${CLOUD_API}/settings`, { headers, signal: controller.signal }),
    ])
    clearTimeout(timeout)
    if (tablesRes.ok) {
      const raw = await tablesRes.json()
      cachedCloudTables = Array.isArray(raw) ? raw.map((t: Record<string, unknown>) => ({
        id: t.id, name: t.name, capacity: t.capacity ?? 0, status: t.status ?? 'Available',
        area: t.area ?? null,
      })) : null
    }
    if (itemsRes.ok) {
      const raw = await itemsRes.json()
      cachedCloudItems = Array.isArray(raw) ? raw : null
    }
    if (settingsRes.ok) cachedSettings = await settingsRes.json()
    console.log(`[bg-sync] Fetched: tables=${cachedCloudTables?.length ?? 0}, items=${cachedCloudItems?.length ?? 0}, settings=${!!cachedSettings}`)
  } catch {
    // Silently fail — background sync is non-essential
  }
}

// Seed default admin credentials if no local user exists
async function ensureLocalAdmin() {
  try {
    const existing = await localPrisma.localCredential.findFirst()
    if (!existing) {
      const hash = await argon2.hash('admin123')
      await localPrisma.localCredential.create({
        data: { phone: '7001181474', passwordHash: hash, name: 'Admin', role: 'Admin' },
      })
      console.log('[auth] Created default local admin: 7001181474 / admin123')
    }
  } catch (err) {
    console.error('[auth] Failed to seed local admin:', (err as Error).message)
    // Non-fatal — the user may need to create credentials manually or the DB may be fresh
  }
}
ensureLocalAdmin().catch(() => {})

// ==================== AUTH ====================

app.post('/api/v1/auth/login', async (req, res) => {
  try {
    const { phone, password, pin } = req.body

    // Query local SQLite credential store ONLY — no cloud dependency
    const credential = await localPrisma.localCredential.findUnique({ where: { phone } })

    if (!credential) {
      res.status(401).json({ error: { message: 'Invalid credentials', statusCode: 401 } })
      return
    }

    // Verify password or PIN against local hash
    const input = password ?? pin ?? ''
    const valid = await argon2.verify(credential.passwordHash, input)
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

    // Background: try to fetch cloud data for richer tables/menu (non-blocking)
    backgroundCloudSync(tokens.accessToken).catch(() => {})

    res.json({ ...tokens, user })
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

app.get('/api/v1/tables', async (req, res) => {
  try {
    const tableName = req.query.tableName as string | undefined

    // Use cached tables from POS sync if available
    const sourceTables = cachedCloudTables

    if (sourceTables && (sourceTables as unknown[]).length > 0) {
      const localOrders = await localPrisma.localOrder.findMany({
        where: { status: { not: 'Settled' } },
        select: { tableId: true, tableName: true, status: true, subtotal: true, grandTotal: true },
      })
      const localStatusByTableName = new Map<string, (typeof localOrders)[number]>()
      for (const o of localOrders) {
        if (o.tableName) localStatusByTableName.set(o.tableName, o)
      }
      let tables = (sourceTables as { id: string; name: string; capacity?: number; status?: string; area?: { id: string; name: string }; areaName?: string }[]).map((ct) => {
        const local = localStatusByTableName.get(ct.name)
        return {
          id: ct.id,
          name: ct.name,
          capacity: ct.capacity ?? 0,
          status: local?.status ?? ct.status ?? 'Available',
          area: ct.area ?? (ct.areaName ? { id: ct.areaName, name: ct.areaName } : null),
          activeOrder: local ? { grandTotal: local.grandTotal, status: local.status } : null,
        }
      })
      if (tableName) {
        tables = tables.filter((t) => t.name.toLowerCase().includes(tableName.toLowerCase()))
      }
      res.json(tables)
      return
    }

    // Local-only fallback — use seed tables with order status overlay
    const orders = await localPrisma.localOrder.findMany({
      where: { status: { not: 'Settled' } },
      select: { tableId: true, tableName: true, status: true, subtotal: true, grandTotal: true },
    })
    res.json(LOCAL_SEED_TABLES.map((t) => {
      const localOrder = orders.find((o) => o.tableName === t.name)
      return {
        id: t.id,
        name: t.name,
        capacity: t.capacity,
        status: localOrder?.status ?? t.status,
        area: t.area,
        activeOrder: localOrder ? { grandTotal: localOrder.grandTotal, status: localOrder.status } : null,
      }
    }))
  } catch (err) {
    console.error('Error fetching tables:', err)
    res.status(500).json({ error: 'Failed to fetch tables' })
  }
})

// Items and categories — served from cloud sync cache
app.get('/api/v1/items', (_req, res) => {
  if (cachedCloudItems && cachedCloudItems.length > 0) {
    res.json(cachedCloudItems)
    return
  }
  if (LOCAL_SEED_ITEMS.length > 0) {
    res.json(LOCAL_SEED_ITEMS)
    return
  }
  res.json([])
})

app.get('/api/v1/categories', (_req, res) => {
  if (cachedCategories && (cachedCategories as unknown[]).length > 0) {
    res.json(cachedCategories)
    return
  }
  if (LOCAL_SEED_ITEMS.length > 0) {
    const cats = new Map<string, { id: string; name: string }>()
    for (const item of LOCAL_SEED_ITEMS) {
      if (item.category && !cats.has(item.category.id)) {
        cats.set(item.category.id, item.category)
      }
    }
    res.json(Array.from(cats.values()))
    return
  }
  res.json([])
})

app.get('/api/v1/settings', (_req, res) => {
  if (cachedSettings) {
    res.json(cachedSettings)
    return
  }
  res.json({ companyName: 'AKRDev Restaurant' })
})

app.get('/api/v1/tax-slabs', (_req, res) => {
  if (cachedTaxSlabs && (cachedTaxSlabs as unknown[]).length > 0) {
    res.json(cachedTaxSlabs)
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
        res.json(directOrder)
        return
      }
    }
    res.json(order)
  } catch (err) {
    console.error('Error fetching order:', err)
    res.status(500).json({ error: 'Failed to fetch order' })
  }
})

app.post('/api/v1/orders', async (req, res) => {
  try {
    const { tableId, tableName, guestCount, orderType } = req.body
    const existing = await localPrisma.localOrder.findFirst({
      where: { tableId: tableId ?? null, status: { not: 'Settled' } },
      include: { items: true, kots: true, settlement: true },
    })
    if (existing && tableId) {
      res.json(existing)
      return
    }
    const order = await localPrisma.localOrder.create({
      data: { tableId: tableId ?? null, tableName: tableName ?? `Table ${tableId ?? 'Takeaway'}`, guestCount: guestCount ?? 2, orderType: orderType ?? 'DineIn' },
      include: { items: true, kots: true, settlement: true },
    })
    syncQueueService.enqueue('create-order', { tableId, tableName, guestCount, orderType: orderType ?? 'DineIn' }).catch(() => {})
    res.status(201).json(order)
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
    res.json(orders)
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

    // Resolve unitPrice from cache if not provided (captain app sends just itemId + variationId)
    let unitPrice = reqUnitPrice
    let itemDisplayName = itemName
    let variationDisplayName = variationName

    if (unitPrice == null && cachedCloudItems) {
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
    if (unitPrice == null) unitPrice = 0

    const qty = quantity ?? 1
    const lineTotal = reqLineTotal ?? unitPrice * qty

    const item = await localPrisma.localOrderItem.create({
      data: {
        orderId,
        itemId,
        itemName: itemDisplayName ?? 'Item',
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
      await localPrisma.localOrder.update({ where: { id: orderId }, data: { subtotal, grandTotal: subtotal } })
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
          data: { status: 'Cancelled', subtotal: 0, grandTotal: 0 },
        })
      } else {
        await localPrisma.localOrder.update({ where: { id: item.orderId }, data: { subtotal, grandTotal: subtotal } })
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
      await localPrisma.localOrder.update({ where: { id: item.orderId }, data: { subtotal, grandTotal: subtotal } })
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
      await localPrisma.localOrder.update({ where: { id: item.orderId }, data: { subtotal, grandTotal: subtotal } })
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
    const totalPaid = (payments.cash ?? 0) + (payments.card ?? 0) + (payments.upi ?? 0)

    if (totalPaid < order.grandTotal) {
      res.status(400).json({ error: { message: 'Insufficient payment' } }); return
    }

    const changeAmt = totalPaid - order.grandTotal

    await localPrisma.$transaction([
      localPrisma.localOrder.update({
        where: { id: orderId },
        data: { status: 'Settled', subtotal, syncStatus: 'Pending' },
      }),
      localPrisma.localSettlement.create({
        data: {
          orderId,
          subtotal,
          taxTotal: order.taxTotal,
          discountTotal: order.discountTotal,
          grandTotal: order.grandTotal,
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

    res.json({ orderId, subtotal, grandTotal: order.grandTotal, totalPaid, change: changeAmt })
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

app.use('/api/v1', async (req, res) => {
  if (res.headersSent) return
  try {





    const targetUrl = `${CLOUD_API}${req.path}`
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (req.headers.authorization) {
      headers['Authorization'] = req.headers.authorization
    }
    const body = ['GET', 'HEAD'].includes(req.method) ? undefined : JSON.stringify(req.body)
    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
      signal: AbortSignal.timeout(15000),
    })
    const contentType = response.headers.get('content-type') ?? ''
    if (contentType.includes('application/json')) {
      const data = await response.json()
      res.status(response.status).json(data)
    } else {
      const text = await response.text()
      res.status(response.status).send(text)
    }
  } catch {
    res.status(502).json({ error: { message: 'Cloud API unreachable', statusCode: 502 } })
  }
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
  })

  setSocketIO(io)

  const port = Number(process.env.LOCAL_API_PORT) || 3001
  server.listen(port, '0.0.0.0', () => {
    console.log(`Local POS API running on http://0.0.0.0:${port}`)
  })

  return server
}
