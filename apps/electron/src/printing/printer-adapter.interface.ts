import type { PrinterConfig } from '../generated/prisma/index.js'

/**
 * ESC/POS Printer Adapter interface.
 * All printer drivers (USB, Network, etc.) must implement this.
 * Business logic never accesses printer drivers directly—only through this interface.
 */
export interface PrinterAdapter {
  /** Opens the connection to the printer. */
  open(): Promise<void>

  /** Closes the connection to the printer. */
  close(): Promise<void>

  /** Returns whether the printer is currently connected and ready. */
  isOpen(): boolean

  /**
   * Sends raw ESC/POS buffer to the printer.
   * The buffer is a complete ESC/POS command sequence.
   */
  write(data: Buffer): Promise<void>

  /**
   * Cuts paper (full cut or partial cut depending on printer).
   * Optional — some printers don't support it.
   */
  cut?(): Promise<void>

  /** Returns the printer config this adapter was created from. */
  getConfig(): PrinterConfig
}

/** Configuration required to create a printer adapter. */
export interface PrinterConnectionConfig {
  type: 'usb' | 'network' | 'spooler'
  address?: string
  vendorId?: number
  productId?: number
}
