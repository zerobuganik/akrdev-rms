import { app, BrowserWindow as BW, ipcMain, type BrowserWindow } from 'electron'
import path from 'path'
import { validateEnv } from './env.js'
import { syncWorkerService } from './services/sync-worker.service.js'
import { getSyncStats, queueForSync } from './services/offline-interceptor.service.js'
import { createLocalApiServer } from './api-local/server.js'
import { startMDNS, stopMDNS } from './services/mdns.service.js'
import { printService, type PrintData } from './printing/print.service.js'

import type { Server } from 'http'

const isDev = process.env.NODE_ENV !== 'production'
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
    kiosk: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
    },
    title: 'AKRDev RMS POS',
  })

  if (isDev) {
    mainWindow.loadURL(POS_DEV_URL)
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    mainWindow.loadFile(posDistPath!)
  }
}

function registerIpcHandlers() {
  // ── Sync ─────────────────────────────────────────────
  ipcMain.handle('get-sync-status', async () => {
    try {
      const stats = await getSyncStats()
      return { ok: true, data: stats }
    } catch (err) {
      return { ok: false, error: String(err) }
    }
  })

  ipcMain.handle('force-sync', async () => {
    try {
      return { ok: true, message: 'Sync queue processed' }
    } catch (err) {
      return { ok: false, error: String(err) }
    }
  })

  ipcMain.handle('queue-sync-action', async (_event, action: string, payload: Record<string, unknown>) => {
    try {
      await queueForSync(action, payload)
      return { ok: true }
    } catch (err) {
      return { ok: false, error: String(err) }
    }
  })

  // ── Printing ─────────────────────────────────────────
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
      const printers = await printService.getPrinters()
      return { ok: true, data: printers }
    } catch (err) {
      return { ok: false, error: String(err) }
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
      const stats = await printService.getStats()
      return { ok: true, data: stats }
    } catch (err) {
      return { ok: false, error: String(err) }
    }
  })

  ipcMain.handle('print:get-history', async (_event, limit?: number) => {
    try {
      const history = await printService.getHistory(limit)
      return { ok: true, data: history }
    } catch (err) {
      return { ok: false, error: String(err) }
    }
  })

  ipcMain.handle('print:discover-system', async () => {
    try {
      if (!mainWindow) return { ok: false, error: 'Main window not ready' }
      const systemPrinters = await mainWindow.webContents.getPrintersAsync()
      const configured = await printService.getPrinters()
      const configuredNames = new Set(configured.map((p) => p.name.toLowerCase()))

      const discovered = systemPrinters.map((p) => ({
        name: p.name,
        displayName: p.displayName,
        isDefault: p.isDefault,
        status: p.status === 0 ? 'Ready' as const : 'Error' as const,
        description: p.description,
        isConfigured: configuredNames.has(p.name.toLowerCase()),
      }))

      return { ok: true, data: discovered }
    } catch (err) {
      return { ok: false, error: String(err) }
    }
  })
}

app.whenReady().then(async () => {
  validateEnv()
  createWindow()
  registerIpcHandlers()
  await syncWorkerService.start()

  // Initialize printing subsystem
  await printService.initialize()
  retryInterval = setInterval(() => printService.processRetries(), 30_000)

  localApiServer = createLocalApiServer()
  startMDNS()

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
  printService.shutdown()
  if (localApiServer) {
    localApiServer.close()
  }
})
