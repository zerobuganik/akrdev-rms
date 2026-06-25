import type { PrinterAdapter } from './printer-adapter.interface.js'
import type { PrinterConfig } from '../generated/prisma/index.js'

let printerModule: typeof import('@thiagoelg/node-printer')['default'] | null = null
let loadError: Error | null = null

async function getPrinter() {
  if (printerModule) return printerModule
  if (loadError) throw loadError
  try {
    const mod = await import('@thiagoelg/node-printer')
    printerModule = mod.default
    return printerModule
  } catch (err) {
    loadError = err instanceof Error ? err : new Error(String(err))
    throw loadError
  }
}

export class SpoolerAdapter implements PrinterAdapter {
  private config: PrinterConfig
  private connected = false

  constructor(config: PrinterConfig) {
    this.config = config
  }

  async open(): Promise<void> {
    this.connected = true
  }

  async close(): Promise<void> {
    this.connected = false
  }

  isOpen(): boolean {
    return this.connected
  }

  async write(data: Buffer): Promise<void> {
    const printerName = this.config.address || this.config.name
    const startTime = Date.now()
    const printer = await getPrinter()

    // Guard: native module loaded but binding is broken (e.g. incompatible Node version)
    if (typeof printer.printDirect !== 'function') {
      const msg = `[Print] UNSUPPORTED — Native printer module (@thiagoelg/node-printer) is not installed. ` +
        `Spooler/RAW printing to "${printerName}" requires a compatible native binding. ` +
        `Use ESC/POS (USB) or ESC/POS (Network) connection type as an alternative.`
      console.error(msg)
      throw new Error(msg)
    }

    return new Promise((resolve, reject) => {
      printer.printDirect({
        data: data,
        printer: printerName,
        type: 'RAW',
        success: (jobID: string) => {
          console.log(`[Print] SUCCESS printer="${printerName}" JobID: ${jobID} total=${Date.now() - startTime}ms`)
          resolve()
        },
        error: (err: Error) => {
          console.error(`[Print] FAILED printer="${printerName}" Error:`, err)
          reject(err)
        },
      })
    })
  }

  getConfig(): PrinterConfig {
    return this.config
  }
}
