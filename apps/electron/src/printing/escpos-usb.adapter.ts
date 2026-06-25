import type USBAdapter from '@node-escpos/usb-adapter'
import type { PrinterConfig } from '../generated/prisma/index.js'
import type { PrinterAdapter } from './printer-adapter.interface.js'

let UsbConstructor: typeof USBAdapter | null = null
let usbImportAttempted = false

async function getUSB(): Promise<typeof USBAdapter> {
  if (UsbConstructor) return UsbConstructor
  if (usbImportAttempted) throw new Error('USB adapter not available — @node-escpos/usb-adapter import failed')
  try {
    const mod = await import('@node-escpos/usb-adapter')
    UsbConstructor = mod.default
    usbImportAttempted = true
    return UsbConstructor!
  } catch {
    usbImportAttempted = true
    throw new Error('USB adapter not available — @node-escpos/usb-adapter import failed')
   }
 }

 export class EscposUsbAdapter implements PrinterAdapter {
  private device: USBAdapter | null = null
  private opened = false
  private readonly config: PrinterConfig

  constructor(config: PrinterConfig) {
    this.config = config
  }

  async open(): Promise<void> {
    if (this.opened) return
    const USB = await getUSB()
    this.device = new USB(this.config.vendorId ?? 0, this.config.productId ?? 0)
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
      throw new Error('USB printer not open')
    }
    await this.device.write(data)
  }

  getConfig(): PrinterConfig {
    return this.config
  }
}
