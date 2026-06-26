import { app, BrowserWindow as BW, ipcMain, type BrowserWindow } from 'electron'
import path from 'path'
import { config } from 'dotenv'
import { createLocalApiServer, setSystemPrinterResolver } from './api-local/server.js'
import { startMDNS, stopMDNS } from './services/mdns.service.js'
import { printService, type PrintData } from './printing/print.service.js'
import { syncWorkerService } from './services/sync-worker.service.js'
import { setAccessToken, setRefreshToken } from './lib/token-store.js'
import { syncQueueService } from './services/sync-queue.service.js'

import type { Server } from 'http'

const envPath = path.join(__dirname, '.env')
const result = config({ path: envPath })
console.log(`[Main] Loading .env from: ${envPath}`)
console.log(`[Main] dotenv result: parsed=${!!result.parsed}, error=${result.error ?? 'none'}`)
console.log(`[Main] CLOUD_API_URL = ${process.env.CLOUD_API_URL ?? 'NOT SET'}`)
console.log(`[Main] LOCAL_API_PORT = ${process.env.LOCAL_API_PORT ?? 'NOT SET'}`)

const isDev = !app.isPackaged && process.env.NODE_ENV !== 'production'
const POS_DEV_URL = 'http://localhost:5173'

let mainWindow: BrowserWindow | null = null
let localApiServer: Server | null = null
let retryInterval: NodeJS.Timeout | null = null

function createWindow() {
  const posDistPath = isDev
    ? null
    : path.join(process.resourcesPath, 'pos-dist', 'index.html')

  mainWindow = new BW({
    fullscreen: true,
    frame: false,
    resizable: false,
    title: 'Topshe POS v1.0',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      sandbox: false,
      nodeIntegration: false,
    },
  })

  // Allow Alt+F4 to close
  mainWindow.webContents.on('before-input-event', (_event, input) => {
    if (input.key === 'F4' && input.alt && !isDev) {
      mainWindow?.close()
    }
  })

  // Handle minimize and close from renderer
  ipcMain.handle('window:close', () => { mainWindow?.close() })
  ipcMain.handle('window:minimize', () => { mainWindow?.minimize() })

  if (isDev) {
    mainWindow.loadURL(POS_DEV_URL)
  } else {
    mainWindow.loadFile(posDistPath!)
  }
}

function registerIpcHandlers() {
  // ── Printing (available when local API+printer are configured) ──
  ipcMain.handle('print:kot', async (_event, data: PrintData) => {
    try {
      await printService.printKOT(data)
      return { ok: true }
    } catch (err) {
      return { ok: false, error: String(err) }
    }
  })

  ipcMain.handle('print:bill', async (_event, data: PrintData) => {
    try {
      await printService.printBill(data)
      return { ok: true }
    } catch (err) {
      return { ok: false, error: String(err) }
    }
  })

  ipcMain.handle('print:reprint-bill', async (_event, data: PrintData) => {
    try {
      await printService.reprintBill(data)
      return { ok: true }
    } catch (err) {
      return { ok: false, error: String(err) }
    }
  })

  ipcMain.handle('print:test', async (_event, printerId: string) => {
    try {
      await printService.testPrint(printerId)
      return { ok: true }
    } catch (err) {
      return { ok: false, error: String(err) }
    }
  })

  ipcMain.handle('print:get-printers', async () => {
    try {
      return { ok: true, data: await printService.getPrinters() }
    } catch {
      return { ok: true, data: [] }
    }
  })

  ipcMain.handle('print:save-printer', async (_event, data) => {
    try {
      const printer = await printService.savePrinter(data)
      await printService.reconnectPrinter(printer.id)
      return { ok: true, data: printer }
    } catch (err) {
      return { ok: false, error: String(err) }
    }
  })

  ipcMain.handle('print:delete-printer', async (_event, id: string) => {
    try {
      await printService.deletePrinter(id)
      return { ok: true }
    } catch (err) {
      return { ok: false, error: String(err) }
    }
  })

  ipcMain.handle('print:get-stats', async () => {
    try {
      return { ok: true, data: await printService.getStats() }
    } catch {
      return { ok: true, data: { total: 0, completed: 0, failed: 0, pending: 0 } }
    }
  })

  ipcMain.handle('print:get-history', async (_event, limit?: number) => {
    try {
      return { ok: true, data: await printService.getHistory(limit) }
    } catch {
      return { ok: true, data: [] }
    }
  })

  ipcMain.handle('print:discover-system', async () => {
    try {
      const discovered = await discoverSystemPrinters()
      return { ok: true, data: discovered }
    } catch {
      return { ok: true, data: [] }
    }
  })

  // Also handle from local API renderer (non-electron HTTP fallback)
  ipcMain.handle('print:discover-system-http', async () => {
    try {
      const discovered = await discoverSystemPrinters()
      return discovered
    } catch {
      return []
    }
  })

  // ── Token sync (POS → Electron main process) ──
  ipcMain.handle('set-access-token', (_event, token: string) => {
    setAccessToken(token)
  })

  ipcMain.handle('set-refresh-token', (_event, token: string) => {
    setRefreshToken(token)
  })

  // ── Sync status ──
  ipcMain.handle('get-sync-status', async () => {
    const state = await syncQueueService.getState()
    const pending = await syncQueueService.getPending()
    return {
      lastSyncAt: state?.lastSyncAt ?? null,
      cloudAvailable: state?.cloudAvailable ?? false,
      pendingCount: pending.length,
    }
  })

  ipcMain.handle('force-sync', async () => {
    await syncWorkerService.processQueue()
    return { ok: true }
  })

  ipcMain.handle('queue-sync-action', async (_event, action: string, payload: unknown) => {
    await syncQueueService.enqueue(action as never, payload as Record<string, unknown>)
    return { ok: true }
  })
}

async function discoverSystemPrinters() {
  if (!mainWindow) return []
  const systemPrinters = await mainWindow.webContents.getPrintersAsync()
  const configured = await printService.getPrinters().catch(() => [])
  const configuredNames = new Set(configured.map((p: { name: string }) => p.name.toLowerCase()))

  return systemPrinters.map((p: Electron.PrinterInfo) => ({
    name: p.name,
    displayName: p.displayName,
    isDefault: p.isDefault,
    status: p.status === 0 ? 'Ready' as const : 'Error' as const,
    description: p.description,
    isConfigured: configuredNames.has(p.name.toLowerCase()),
  }))
}

app.whenReady().then(async () => {
  createWindow()
  registerIpcHandlers()

  // Always initialize printing
  try { await printService.initialize() } catch (err) { console.error('[Main] Print service init failed:', err) }
  retryInterval = setInterval(() => printService.processRetries().catch(() => {}), 30_000)

  // Set system printer resolver for local API HTTP endpoint
  setSystemPrinterResolver(discoverSystemPrinters)

  // Start local API + mDNS for offline-first POS and Captain pairing
  localApiServer = createLocalApiServer()
  startMDNS()

  // Start sync worker — pushes local changes to cloud every 60 minutes
  syncWorkerService.start()

  app.on('activate', () => {
    if (BW.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  syncWorkerService.stop()
  stopMDNS()
  if (retryInterval) clearInterval(retryInterval)
  try { printService.shutdown() } catch { /* ignore */ }
  if (localApiServer) {
    localApiServer.close()
  }
})
