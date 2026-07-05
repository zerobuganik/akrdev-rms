import { localPrisma } from '../lib/local-prisma.js'
import type { Prisma, PrinterConfig } from '../generated/prisma/index.js'
import { PrinterAdapter } from './printer-adapter.interface.js'
import { EscposUsbAdapter } from './escpos-usb.adapter.js'
import { EscposNetworkAdapter } from './escpos-network.adapter.js'
import { SpoolerAdapter } from './spooler.adapter.js'
import { printQueueService } from './print-queue.service.js'
import fs from 'fs'
import path from 'path'
import http from 'http'
import https from 'https'
import { PNG } from 'pngjs'

/**
 * Print data passed from the renderer (POS UI) or API.
 * Contains all information needed to format a print job.
 */
export interface PrintData {
  printType: 'kot' | 'bill' | 'reprint-bill' | 'test-print'
  orderId?: string
  tableName?: string
  restaurantName?: string
  restaurantAddress?: string
  phone?: string
  email?: string
  website?: string
  fssai?: string
  gstin?: string
  headerText?: string
  footerText?: string
  orderNumber?: string
  guestCount?: number
  serverName?: string
  kotNumber?: number
  items?: Array<{
    name: string
    quantity: number
    unitPrice?: number
    lineTotal?: number
    note?: string
    status?: string
    cancelledBy?: string
    cancelledAt?: string
  }>
  subtotal?: number
  taxTotal?: number
  discountTotal?: number
  grandTotal?: number
  roundingAdjustment?: number
  payments?: Array<{ method: string; amount: number }>
  paymentChange?: number
  taxName?: string
  discountName?: string
  date?: string
  orderType?: string
  /** Relative URL of the print logo (e.g. /uploads/print-logo-xxx.png). Resolved relative to API public dir. */
  logoUrl?: string
}

export type PrintType = 'kot' | 'bill' | 'reprint-bill' | 'test-print'

// Paper width constants
const PAPER_80MM = 48 // 80mm = 48 chars at default font
const PAPER_58MM = 34 // 58mm = 34 chars at default font

const ESC_POS_CUT = Buffer.from([0x1D, 0x56, 0x42, 0x00])

// ESC/POS command bytes
const ESC = '\x1b'
const CMD = {
  INIT: `${ESC}@`,
  ALIGN_LEFT: `${ESC}a\x00`,
  ALIGN_CENTER: `${ESC}a\x01`,
  ALIGN_RIGHT: `${ESC}a\x02`,
  BOLD_ON: `${ESC}E\x01`,
  BOLD_OFF: `${ESC}E\x00`,
  DOUBLE_HEIGHT: `${ESC}!\x10`,
  DOUBLE_WIDTH: `${ESC}!\x20`,
  DOUBLE_BOTH: `${ESC}!\x30`,
  NORMAL: `${ESC}!\x00`,
  LINE_SPACING_0: `${ESC}3\x00`,
  LINE_SPACING_2: `${ESC}3\x02`,
  LINE_SPACING_4: `${ESC}3\x04`,
  LINE_SPACING_24: `${ESC}3\x18`,
  CUT_PARTIAL: `${ESC}m`,
  CUT_FULL: `${ESC}i`,
  LINE_FEED: '\n',
  DIVIDER: '-'.repeat(PAPER_80MM),
  SPACER: '\n\n',
}

export class PrintService {
  private adapters = new Map<string, PrinterAdapter>()
  private logoCache = new Map<string, Buffer>()
  private readonly MAX_LOGO_CACHE = 5

  private cacheLogo(key: string, buffer: Buffer) {
    if (this.logoCache.size >= this.MAX_LOGO_CACHE) {
      const firstKey = this.logoCache.keys().next().value
      if (firstKey) this.logoCache.delete(firstKey)
    }
    this.logoCache.set(key, buffer)
  }

  /**
   * Initialize all configured printers.
   * Called once when the app starts.
   */
  async initialize(): Promise<void> {
    const printers = await localPrisma.printerConfig.findMany({
      where: { isActive: true },
    })

    for (const printer of printers) {
      try {
        const adapter = this.createAdapter(printer)
        await adapter.open()
        this.adapters.set(printer.id, adapter)
        console.log(`[PrintService] Connected: ${printer.displayName} (${printer.type})`)
      } catch (err) {
        console.error(`[PrintService] Failed to connect: ${printer.displayName}`, err)
      }
    }
  }

  /**
   * Shut down all printer connections.
   */
  async shutdown(): Promise<void> {
    for (const [id, adapter] of this.adapters) {
      try {
        await adapter.close()
      } catch {
        // Ignore close errors
      }
      this.adapters.delete(id)
    }
  }

  /**
   * Print a KOT (Kitchen Order Ticket).
   * Sent to kitchen printer(s).
   */
  async printKOT(data: PrintData): Promise<void> {
    const kitchenPrinters = await this.getPrintersByRole('kot')
    if (kitchenPrinters.length === 0) {
      throw new Error('No kitchen printer configured')
    }

    for (const printer of kitchenPrinters) {
      await this.printToPrinter(printer.id, data, () =>
        this.formatKOT(data, printer.paperWidth),
      )
    }
  }

  /**
   * Print a Bill.
   * Sent to billing/front-desk printer.
   */
  async printBill(data: PrintData): Promise<void> {
    const billingPrinters = await this.getPrintersByRole('bill')
    const defaultPrinters = billingPrinters.length > 0
      ? billingPrinters
      : await this.getDefaultPrinters()

    if (defaultPrinters.length === 0) {
      throw new Error('No billing printer configured')
    }

    for (const printer of defaultPrinters) {
      await this.printToPrinter(printer.id, data, async () =>
        await this.formatBill(data, printer.paperWidth),
      )
    }
  }

  /**
   * Reprint a bill (marked as reprint).
   */
  async reprintBill(data: PrintData): Promise<void> {
    const billingPrinters = await this.getPrintersByRole('bill')
    const printers = billingPrinters.length > 0
      ? billingPrinters
      : await this.getDefaultPrinters()

    if (printers.length === 0) {
      throw new Error('No billing printer configured')
    }

    for (const printer of printers) {
      await this.printToPrinter(printer.id, data, async () =>
        await this.formatReprint(data, printer.paperWidth),
      )
    }
  }

  /**
   * Test print — prints a small diagnostic ticket.
   */
  async testPrint(printerId: string): Promise<void> {
    const adapter = this.adapters.get(printerId)
    if (!adapter) throw new Error('Printer not connected')

    const buffer = this.formatTestPrint()
    await adapter.write(buffer)
  }

  /**
   * Get all configured printers.
   */
  async getPrinters() {
    return localPrisma.printerConfig.findMany({ orderBy: { name: 'asc' } })
  }

  /**
   * Save/update printer config.
   */
  async savePrinter(data: {
    id?: string
    name: string
    displayName: string
    type: string
    connection: string
    address?: string
    vendorId?: number
    productId?: number
    paperWidth?: number
    isDefault?: boolean
    isActive?: boolean
    isKitchen?: boolean
    isBilling?: boolean
  }) {
    // If this is a billing printer, clear existing billing flag
    if (data.isBilling) {
      await localPrisma.printerConfig.updateMany({
        where: { isBilling: true },
        data: { isBilling: false },
      })
    }
    // If this is a default kitchen printer, clear existing default kitchen
    if (data.isDefault && data.isKitchen) {
      await localPrisma.printerConfig.updateMany({
        where: { isDefault: true, isKitchen: true },
        data: { isDefault: false },
      })
    }

    if (data.id) {
      const { id, ...rest } = data
      return localPrisma.printerConfig.update({
        where: { id },
        data: rest,
      })
    }

    const { id: _id, ...rest } = data
    return localPrisma.printerConfig.create({ data: rest })
  }

  /**
   * Delete a printer config.
   */
  async deletePrinter(id: string): Promise<void> {
    this.adapters.delete(id)
    await localPrisma.printerConfig.delete({ where: { id } })
  }

  /**
   * Refresh a specific printer connection (e.g., after config change).
   */
  async reconnectPrinter(id: string): Promise<void> {
    const existing = this.adapters.get(id)
    if (existing) {
      try { await existing.close() } catch { /* Ignore */ }
      this.adapters.delete(id)
    }

    const config = await localPrisma.printerConfig.findUnique({ where: { id } })
    if (!config || !config.isActive) return

    const adapter = this.createAdapter(config)
    await adapter.open()
    this.adapters.set(id, adapter)
  }

  // ─── Private helpers ────────────────────────────────────────

  private createAdapter(config: PrinterConfig): PrinterAdapter {
    if (config.connection === 'spooler') {
      return new SpoolerAdapter(config)
    }
    if (config.connection === 'network') {
      return new EscposNetworkAdapter(config)
    }
    return new EscposUsbAdapter(config)
  }

  private async getPrintersByRole(role: 'kot' | 'bill') {
    if (role === 'kot') {
      return localPrisma.printerConfig.findMany({
        where: { isActive: true, isKitchen: true },
      })
    }
    return localPrisma.printerConfig.findMany({
      where: { isActive: true, isBilling: true },
    })
  }

  private async getDefaultPrinters() {
    return localPrisma.printerConfig.findMany({
      where: { isActive: true, isDefault: true },
    })
  }

  private async printToPrinter(
    printerId: string,
    data: PrintData,
    formatFn: () => Buffer | Promise<Buffer>,
  ): Promise<void> {
    const job = await printQueueService.enqueue(
      printerId,
      data.printType,
      data.orderId,
      data.tableName,
    )

    const adapter = this.adapters.get(printerId)
    if (!adapter) {
      await printQueueService.markFailed(job.id, 'Printer not connected')
      throw new Error('Printer not connected')
    }

    try {
      const buffer = await formatFn()
      await adapter.write(buffer)
      await printQueueService.markCompleted(job.id)
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      await printQueueService.markFailed(job.id, message)
      throw err
    }
  }

  // ─── ESC/POS Formatting ─────────────────────────────────────

  private width(w: number): number {
    return w === 58 ? PAPER_58MM : PAPER_80MM
  }

  private pad(s: string, length: number): string {
    if (s.length > length) return s.slice(0, length)
    return s.padEnd(length)
  }

  private padLeft(s: string, length: number): string {
    if (s.length > length) return s.slice(0, length)
    return s.padStart(length)
  }

  private center(text: string, w: number): string {
    const padSize = Math.max(0, Math.floor((w - text.length) / 2))
    return ' '.repeat(padSize) + text
  }

  private centerIn(text: string, colWidth: number): string {
    const padSize = Math.max(0, Math.floor((colWidth - text.length) / 2))
    const padEnd = colWidth - text.length - padSize
    return ' '.repeat(padSize) + text + ' '.repeat(Math.max(0, padEnd))
  }

  private lineLeftRight(left: string, right: string, w: number): string {
    const available = w - left.length
    const rightText = right.length > available ? right.slice(0, available) : right
    return left + ' '.repeat(w - left.length - rightText.length) + rightText
  }

  private wrapText(text: string, maxWidth: number): string[] {
    if (text.length <= maxWidth) return [text]
    const words = text.split(' ')
    const lines: string[] = []
    let current = ''
    for (const word of words) {
      const test = current ? current + ' ' + word : word
      if (test.length <= maxWidth) {
        current = test
      } else {
        if (current) lines.push(current)
        current = word.length > maxWidth ? word.slice(0, maxWidth) : word
      }
    }
    if (current) lines.push(current)
    return lines
  }

  /**
   * Format KOT for kitchen printer.
   */
  private formatKOT(data: PrintData, paperWidth: number): Buffer {
    const w = this.width(paperWidth)
    const lines: string[] = [
      CMD.ALIGN_CENTER,
      CMD.DOUBLE_BOTH,
      `Table: ${data.tableName ?? '—'}`,
      CMD.NORMAL,
      CMD.DIVIDER.slice(0, w),
    ]

    // Two-line info: left=KOT/Date, right=Type/By
    const kotLeft = `KOT #${data.kotNumber ?? '—'}`
    const dateLeft = data.date ?? ''
    const typeRight = data.orderType ? `Type: ${data.orderType}` : ''
    const byRight = data.serverName ? `By: ${data.serverName}` : (data.serverName === '' ? '' : '')

    lines.push(CMD.ALIGN_LEFT)
    lines.push(this.lineLeftRight(kotLeft, typeRight, w))
    lines.push(this.lineLeftRight(dateLeft, byRight, w))
    lines.push(CMD.DIVIDER.slice(0, w))

    // Column header — Qty centered in first 6 chars, Item left-aligned in remaining width
    const qtyColW = 6
    const itemColW = w - qtyColW - 2
    const qtyHdr = this.centerIn('Qty', qtyColW)
    const itemHdr = this.pad('Item', itemColW)

    lines.push(
      CMD.BOLD_ON,
      qtyHdr + '  ' + itemHdr,
      CMD.BOLD_OFF,
      CMD.DIVIDER.slice(0, w),
    )

    lines.push(CMD.LINE_SPACING_4)

    if (data.items) {
      for (const item of data.items) {
        const qtyStr = this.centerIn(String(item.quantity), qtyColW)
        const nameStr = this.pad(item.name, itemColW)
        const isCancelled = item.status === 'Cancelled'
        const itemLine = qtyStr + '  ' + nameStr
        lines.push(
          CMD.BOLD_ON,
          itemLine,
          CMD.BOLD_OFF,
        )
        if (isCancelled) {
          lines.push(`${' '.repeat(qtyColW + 2)}  (Cancelled)`)
        }
        if (item.note && !isCancelled) {
          lines.push(' '.repeat(qtyColW + 2) + `${item.note}`)
        }
      }
    }

    lines.push(CMD.LINE_SPACING_24)
    lines.push(
      CMD.DIVIDER.slice(0, w),
      CMD.SPACER,
    )

    const textBuf = Buffer.from(lines.filter(Boolean).join('\n'), 'utf-8')
    return Buffer.concat([textBuf, ESC_POS_CUT])
  }

  /**
   * Format Bill for billing/front-desk printer.
   * Full receipt format with header, items, totals, payments.
   */
  /**
   * Encode a PNG logo as ESC/POS raster bit image (GS v 0).
   * Resolves the logo file relative to the API's public uploads directory.
   * Returns null if the logo cannot be loaded or is too small.
   */
  private async encodeLogo(logoUrl: string, paperWidth: number): Promise<Buffer | null> {
    try {
      const cacheKey = `${logoUrl}-${paperWidth}`
      const cached = this.logoCache.get(cacheKey)
      if (cached) return cached

      let pngBuffer: Buffer

      if (logoUrl.startsWith('http://') || logoUrl.startsWith('https://')) {
        pngBuffer = await new Promise<Buffer>((resolve, reject) => {
          const get = logoUrl.startsWith('https://') ? https.get : http.get
          get(logoUrl, (res) => {
            if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode}`)); return }
            const chunks: Buffer[] = []
            res.on('data', (c: Buffer) => chunks.push(c))
            res.on('end', () => resolve(Buffer.concat(chunks)))
          }).on('error', reject)
        })
      } else {
        const filePath = path.resolve(__dirname, '..', '..', '..', 'api', 'public', logoUrl.replace(/^\//, ''))
        if (!fs.existsSync(filePath)) return null
        pngBuffer = fs.readFileSync(filePath)
      }

      const png = PNG.sync.read(pngBuffer)
      
      // CRITICAL FIX: Standard hardware dot widths for thermal print heads
      // 80mm = 576 dots across
      // 58mm = 384 dots across
      const totalDots = paperWidth === 58 ? 384 : 576
      const maxWidth = Math.floor(totalDots / 2)

      let w = png.width
      let h = png.height
      if (w > maxWidth) {
        const ratio = maxWidth / w
        w = maxWidth
        h = Math.round(h * ratio)
      }

      if (w < 1 || h < 1) return null

      // This math will now perfectly center the image
      const leftPadDots = Math.floor((totalDots - w) / 2)
      const totalRowBytes = Math.ceil(totalDots / 8)

      const raster: number[] = []

      for (let y = 0; y < h; y++) {
        // Build one full-width row
        const row = new Array<number>(totalRowBytes).fill(0)

        // Sample image pixels and place them at the correct bit positions
        for (let px = 0; px < w; px++) {
          const srcX = Math.floor((px / w) * png.width)
          const srcY = Math.floor((y / h) * png.height)
          const idx = (srcY * png.width + srcX) * 4
          const r = png.data[idx]!
          const g = png.data[idx + 1]!
          const b = png.data[idx + 2]!
          const a = png.data[idx + 3]!
          
          // Ignore transparent/light pixels
          if (!(a > 128 && (r + g + b) / 3 < 128)) continue

          const dotPos = leftPadDots + px
          const byteIdx = Math.floor(dotPos / 8)
          const bitIdx = 7 - (dotPos % 8)
          row[byteIdx]! |= (1 << bitIdx)
        }

        raster.push(...row)
      }

      const gsv0 = Buffer.from([
        0x1d, 0x76, 0x30, 0x00,
        totalRowBytes & 0xff, (totalRowBytes >> 8) & 0xff,
        h & 0xff, (h >> 8) & 0xff,
      ])
      
      const result = Buffer.concat([gsv0, Buffer.from(raster)])
      this.logoCache.set(cacheKey, result)
      return result
    } catch {
      return null
    }
  }

  private async formatBill(data: PrintData, paperWidth: number): Promise<Buffer> {
    const w = this.width(paperWidth)
    const is80mm = paperWidth !== 58

    let logoBuf: Buffer | null = null
    if (data.logoUrl) {
      logoBuf = await this.encodeLogo(data.logoUrl, paperWidth)
    }

    const lines: string[] = []

    // Logo is printed first via logoBuf (GS v 0 raster), then restaurant name
    lines.push(CMD.ALIGN_CENTER)
    if (logoBuf) {
    } else {
      lines.push('')
    }

    if (data.restaurantName) {
      lines.push(CMD.DOUBLE_BOTH + data.restaurantName.slice(0, w) + CMD.NORMAL)
    }
    if (data.restaurantAddress) {
      const addrLines = this.wrapText(data.restaurantAddress, w)
      for (const line of addrLines) {
        lines.push(line)
      }
    }
    if (data.phone) lines.push(`Ph: ${data.phone}`)
    if (data.gstin) lines.push(`GST: ${data.gstin}`)
    if (data.fssai) lines.push(`FSSAI: ${data.fssai}`)
    if (data.website) lines.push(data.website.slice(0, w))
    if (data.headerText) {
      lines.push(data.headerText.slice(0, w))
    }

    lines.push(CMD.DIVIDER.slice(0, w))

    // Info rows: Table/Date on one line, Order#/Type on next
    lines.push(CMD.ALIGN_LEFT)
    const tableLeft = data.tableName ? `Table: ${data.tableName}` : ''
    const dateRight = data.date ? `Date: ${data.date}` : ''
    lines.push(this.lineLeftRight(tableLeft, dateRight, w))

    const orderIdLeft = data.orderNumber ? `Order: ${data.orderNumber}` : ''
    const typeRight = data.orderType ? `Type: ${data.orderType}` : ''
    lines.push(this.lineLeftRight(orderIdLeft, typeRight, w))
    lines.push(CMD.DIVIDER.slice(0, w))

    // Column header and item rows — mathematically strict, every line sums to w
    if (is80mm) {
      // 80mm: Item | Qty | Rate | Amount
      const qtyW = 4
      const rateW = 9
      const amtW = 11
      // 3 gaps of '  ' (2 chars each) = 6 chars total
      const itemW = w - qtyW - rateW - amtW - 6

      // Header: Item (padEnd) + '  ' + Qty (centerIn) + '  ' + Rate (padLeft) + '  ' + Amount (padLeft)
      // Sum: itemW + 2 + qtyW + 2 + rateW + 2 + amtW = itemW + qtyW + rateW + amtW + 6 = w ✓
      lines.push(
        CMD.BOLD_ON +
        this.pad('Item', itemW) + '  ' +
        this.centerIn('Qty', qtyW) + '  ' +
        this.padLeft('Rate', rateW) + '  ' +
        this.padLeft('Amount', amtW) +
        CMD.BOLD_OFF,
        CMD.DIVIDER.slice(0, w),
      )

      if (data.items) {
        for (const item of data.items) {
          const amount = (item.lineTotal ?? (item.unitPrice ?? 0) * item.quantity).toFixed(2)
          const rate = item.unitPrice != null ? item.unitPrice.toFixed(2) : ''
          const qty = item.quantity.toString()
          const qtyStr = this.centerIn(qty, qtyW)
          const rateStr = this.padLeft(rate, rateW)
          const amtStr = this.padLeft(amount, amtW)
          // nameLines respects updated itemW
          const nameLines = this.wrapText(item.name, itemW)
          // Strict format: this.pad(name, itemW) + '  ' + qtyStr + '  ' + rateStr + '  ' + amtStr
          // Sum: itemW + 2 + qtyW + 2 + rateW + 2 + amtW = itemW + qtyW + rateW + amtW + 6 = w ✓
          lines.push(
            this.pad(nameLines[0]!, itemW) + '  ' + qtyStr + '  ' + rateStr + '  ' + amtStr,
          )
          // Continuation lines: name only, no column data (line length < w is acceptable for wrapped lines)
          for (let li = 1; li < nameLines.length; li++) {
            lines.push(this.pad(nameLines[li]!, itemW))
          }
        }
      }
    } else {
      // 58mm: Item | Qty | Amount (no Rate column)
      const qtyW = 4
      const amtW = 11
      // 2 gaps of '  ' (2 chars each) = 4 chars total
      const itemW = w - qtyW - amtW - 4

      // Header: Item (padEnd) + '  ' + Qty (centerIn) + '  ' + Amount (padLeft)
      // Sum: itemW + 2 + qtyW + 2 + amtW = itemW + qtyW + amtW + 4 = w ✓
      lines.push(
        CMD.BOLD_ON +
        this.pad('Item', itemW) + '  ' +
        this.centerIn('Qty', qtyW) + '  ' +
        this.padLeft('Amount', amtW) +
        CMD.BOLD_OFF,
        CMD.DIVIDER.slice(0, w),
      )

      if (data.items) {
        for (const item of data.items) {
          const amount = (item.lineTotal ?? (item.unitPrice ?? 0) * item.quantity).toFixed(2)
          const qty = item.quantity.toString()
          const qtyStr = this.centerIn(qty, qtyW)
          const amtStr = this.padLeft(amount, amtW)
          // nameLines respects updated itemW
          const nameLines = this.wrapText(item.name, itemW)
          // Strict format: this.pad(name, itemW) + '  ' + qtyStr + '  ' + amtStr
          // Sum: itemW + 2 + qtyW + 2 + amtW = itemW + qtyW + amtW + 4 = w ✓
          lines.push(
            this.pad(nameLines[0]!, itemW) + '  ' + qtyStr + '  ' + amtStr,
          )
          // Continuation lines: name only
          for (let li = 1; li < nameLines.length; li++) {
            lines.push(this.pad(nameLines[li]!, itemW))
          }
        }
      }
    }

    lines.push(CMD.DIVIDER.slice(0, w))
    if (data.subtotal != null) {
      lines.push(this.lineLeftRight(' Subtotal', `Rs. ${data.subtotal.toFixed(2)}`, w))
    }
    if (data.taxTotal != null && data.taxTotal > 0) {
      const halfTax = data.taxTotal / 2
      lines.push(this.lineLeftRight(' CGST', `Rs. ${halfTax.toFixed(2)}`, w))
      lines.push(this.lineLeftRight(' SGST', `Rs. ${halfTax.toFixed(2)}`, w))
    }
    if (data.discountTotal != null && data.discountTotal > 0) {
      const discLabel = data.discountName ? ` ${data.discountName}` : ' Discount'
      lines.push(this.lineLeftRight(discLabel, `Rs. -${data.discountTotal.toFixed(2)}`, w))
    }

    // Grand Total — bold, single divider above and below
    lines.push(CMD.DIVIDER.slice(0, w))
    if (data.grandTotal != null) {
      lines.push(
        CMD.BOLD_ON + this.lineLeftRight(' GRAND TOTAL', `Rs. ${Math.round(data.grandTotal).toFixed(2)}`, w) + CMD.BOLD_OFF,
      )
    }
    if (data.roundingAdjustment != null && data.roundingAdjustment !== 0) {
      const sign = data.roundingAdjustment > 0 ? '+' : ''
      lines.push(this.lineLeftRight(' Rounding', `${sign}${data.roundingAdjustment.toFixed(2)}`, w))
    }
    lines.push(CMD.DIVIDER.slice(0, w))

    if (data.payments && data.payments.length > 0) {
      lines.push(CMD.BOLD_ON + 'Payment' + CMD.BOLD_OFF)
      for (const p of data.payments) {
        lines.push(this.lineLeftRight(` ${p.method}`, `Rs. ${p.amount.toFixed(2)}`, w))
      }
      if (data.paymentChange != null && data.paymentChange > 0) {
        lines.push(this.lineLeftRight(' Change', `Rs. ${data.paymentChange.toFixed(2)}`, w))
      }
      lines.push(CMD.DIVIDER.slice(0, w))
    }

    lines.push(CMD.ALIGN_CENTER)
    if (data.footerText) {
      lines.push(data.footerText.slice(0, w))
    }

    lines.push(CMD.SPACER)

    const textBuf = Buffer.from(lines.filter(Boolean).join('\n'), 'utf-8')
    const initBuf = Buffer.from(CMD.INIT, 'utf-8')
    if (logoBuf) {
      return Buffer.concat([initBuf, logoBuf, textBuf, ESC_POS_CUT])
    }
    return Buffer.concat([initBuf, textBuf, ESC_POS_CUT])
  }

  /**
   * Format reprint — same as bill but with REPRINT watermark.
   */
  private async formatReprint(data: PrintData, paperWidth: number): Promise<Buffer> {
    const w = this.width(paperWidth)
    const original = await this.formatBill(data, paperWidth)
    const header = Buffer.from(
      [
        CMD.INIT,
        CMD.ALIGN_CENTER,
        CMD.DOUBLE_BOTH,
        '*** REPRINT ***',
        CMD.NORMAL,
        CMD.ALIGN_LEFT,
        '',
      ].join('\n'),
      'utf-8',
    )
    const body = original.slice(CMD.INIT.length, original.length - ESC_POS_CUT.length)
    return Buffer.concat([header, body, ESC_POS_CUT])
  }

  /**
   * Test print — small diagnostic ticket.
   */
  private formatTestPrint(): Buffer {
    const w = PAPER_80MM
    const now = new Date()
    const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getFullYear()).slice(2)}, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const lines = [
      CMD.INIT,
      CMD.ALIGN_CENTER,
      CMD.DOUBLE_BOTH,
      'TEST PRINT',
      CMD.NORMAL,
      '',
      CMD.ALIGN_LEFT,
      'This is a test print from',
      'Topshe POS.',
      '',
      this.center(`Date: ${dateStr}`, w),
      '',
      CMD.DIVIDER,
      CMD.ALIGN_CENTER,
      'Printer is working correctly!',
      CMD.SPACER,
    ]
    const textBuf = Buffer.from(lines.join('\n'), 'utf-8')
    return Buffer.concat([textBuf, ESC_POS_CUT])
  }

  /**
   * Get print queue stats.
   */
  async getStats() {
    return printQueueService.getStats()
  }

  /**
   * Get recent print history.
   */
  async getHistory(limit?: number) {
    return printQueueService.getRecentHistory(limit)
  }

  /**
   * Process retry queue — call periodically.
   */
  async processRetries(): Promise<number> {
    const pending = await localPrisma.printHistory.findMany({
      where: { status: 'Retrying' },
      orderBy: { createdAt: 'asc' },
      take: 10,
    })

    let processed = 0
    for (const job of pending) {
      try {
        const adapter = this.adapters.get(job.printerId)
        if (!adapter) continue

        const delay = await printQueueService.getRetryDelay(job.retryCount)
        const elapsed = Date.now() - job.createdAt.getTime()
        if (elapsed < delay) continue

        // Re-open printer if needed
        if (!adapter.isOpen()) {
          await adapter.open()
        }

        // Send a simple reprint
        const testBuffer = this.formatTestPrint()
        await adapter.write(testBuffer)
        await printQueueService.markCompleted(job.id)
        processed++
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        await printQueueService.markFailed(job.id, message)
      }
    }

    return processed
  }
}

export const printService = new PrintService()
