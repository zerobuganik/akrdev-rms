import { app, BrowserWindow as BW, ipcMain, type BrowserWindow } from 'electron'
import path from 'path'
import { createLocalApiServer } from './api-local/server.js'
import { startMDNS, stopMDNS } from './services/mdns.service.js'
import { printService, type PrintData } from './printing/print.service.js'

import type { Server } from 'http'

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
      if (!mainWindow) return { ok: true, data: [] }
      const systemPrinters = await mainWindow.webContents.getPrintersAsync()
      const configured = await printService.getPrinters().catch(() => [])
      const configuredNames = new Set(configured.map((p: { name: string }) => p.name.toLowerCase()))

      const discovered = systemPrinters.map((p: Electron.PrinterInfo) => ({
        name: p.name,
        displayName: p.displayName,
        isDefault: p.isDefault,
        status: p.status === 0 ? 'Ready' as const : 'Error' as const,
        description: p.description,
        isConfigured: configuredNames.has(p.name.toLowerCase()),
      }))

      return { ok: true, data: discovered }
    } catch {
      return { ok: true, data: [] }
    }
  })
}

app.whenReady().then(async () => {
  createWindow()
  registerIpcHandlers()

  // Always initialize printing
  try { await printService.initialize() } catch (err) { console.error('[Main] Print service init failed:', err) }
  retryInterval = setInterval(() => printService.processRetries().catch(() => {}), 30_000)

  // Start local API + mDNS for Captain pairing and offline mode
  if (process.env.CLOUD_API_URL) {
    localApiServer = createLocalApiServer()
    startMDNS()
  }

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
  stopMDNS()
  if (retryInterval) clearInterval(retryInterval)
  try { printService.shutdown() } catch { /* ignore */ }
  if (localApiServer) {
    localApiServer.close()
  }
})
