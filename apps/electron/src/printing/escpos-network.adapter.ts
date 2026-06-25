import type NetworkAdapter from '@node-escpos/network-adapter'
import type { PrinterConfig } from '../generated/prisma/index.js'
import type { PrinterAdapter } from './printer-adapter.interface.js'

let NetworkConstructor: typeof NetworkAdapter | null = null
let networkImportAttempted = false

async function getNetwork(): Promise<typeof NetworkAdapter> {
  if (NetworkConstructor) return NetworkConstructor
  if (networkImportAttempted) throw new Error('Network adapter not available — @node-escpos/network-adapter import failed')
  try {
    const mod = await import('@node-escpos/network-adapter')
    NetworkConstructor = mod.default
    networkImportAttempted = true
    return NetworkConstructor!
  } catch {
    networkImportAttempted = true
    throw new Error('Network adapter not available — @node-escpos/network-adapter import failed')
   }
 }

 export class EscposNetworkAdapter implements PrinterAdapter {
  private device: NetworkAdapter | null = null
  private opened = false
  private readonly config: PrinterConfig

  constructor(config: PrinterConfig) {
    this.config = config
  }

  async open(): Promise<void> {
    if (this.opened) return
    const Network = await getNetwork()
    if (!this.config.address) {
      throw new Error('Network printer address is required')
    }
    const address = this.config.address
    const parts = address.split(':')
    const host = parts[0]!
    const port = parts[1] ? Number(parts[1]) : 9100
    this.device = new Network(host, port)
    await this.device.open()
    this.opened = true
  }

  async close(): Promise<void> {
    if (!this.device || !this.opened) return
    try {
      await this.device.close()
    } catch {
      // Device may already be closed
    }
    this.device = null
    this.opened = false
  }

  isOpen(): boolean {
    return this.opened
  }

  async write(data: Buffer): Promise<void> {
    if (!this.device || !this.opened) {
      throw new Error('Network printer not open')
    }
    await this.device.write(data)
  }

  getConfig(): PrinterConfig {
    return this.config
  }
}
