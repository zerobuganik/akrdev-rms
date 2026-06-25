import axios from 'axios'

const LOCAL_API = import.meta.env.VITE_LOCAL_API_URL ?? 'http://localhost:3001/api/v1'

export interface PrinterConfig {
  id: string
  name: string
  displayName: string
  type: string
  connection: string
  address: string | null
  vendorId: number | null
  productId: number | null
  paperWidth: number
  isDefault: boolean
  isActive: boolean
  isKitchen: boolean
  isBilling: boolean
  createdAt: string
  updatedAt: string
}

export interface PrinterFormData {
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
}

export interface PrintStats {
  pending: number
  completed: number
  failed: number
  total: number
}

export interface PrintHistoryEntry {
  id: string
  printerId: string
  printType: string
  orderId: string | null
  tableName: string | null
  status: string
  retryCount: number
  error: string | null
  createdAt: string
}

export interface SystemPrinter {
  name: string
  displayName: string
  isDefault: boolean
  status: 'Ready' | 'Error'
  description: string
  isConfigured: boolean
}

export interface PrintKOTData {
  printType: 'kot'
  orderId: string
  tableName: string
  guestCount?: number
  serverName?: string
  kotNumber: number
  items: Array<{ name: string; quantity: number; unitPrice?: number; lineTotal?: number; note?: string }>
  date?: string
  orderType?: string
}

export interface PrintBillData {
  printType: 'bill' | 'reprint-bill'
  orderId: string
  tableName: string
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
  items: Array<{ name: string; quantity: number; unitPrice?: number; lineTotal?: number; note?: string }>
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
  logoUrl?: string
}

interface IpcResponse<T = unknown> {
  ok: boolean
  data?: T
  error?: string
}

function isElectron(): boolean {
  return typeof window !== 'undefined' && !!window.electron?.ipcRenderer
}

async function invoke<T>(channel: string, ...args: unknown[]): Promise<IpcResponse<T>> {
  if (isElectron()) {
    return window.electron!.ipcRenderer.invoke(channel, ...args) as Promise<IpcResponse<T>>
  }
  return httpCall<T>(channel, ...args)
}

async function httpCall<T>(channel: string, ...args: unknown[]): Promise<IpcResponse<T>> {
  try {
    switch (channel) {
      case 'print:get-printers': {
        const { data } = await axios.get<PrinterConfig[]>(`${LOCAL_API}/print/printers`)
        return { ok: true, data: data as T }
      }
      case 'print:save-printer': {
        const payload = args[0] as PrinterFormData
        if ((payload as { id?: string }).id) {
          const { data } = await axios.put<PrinterConfig>(
            `${LOCAL_API}/print/printers/${(payload as { id?: string }).id}`,
            payload,
          )
          return { ok: true, data: data as T }
        }
        const { data } = await axios.post<PrinterConfig>(`${LOCAL_API}/print/printers`, payload)
        return { ok: true, data: data as T }
      }
      case 'print:delete-printer': {
        await axios.delete(`${LOCAL_API}/print/printers/${args[0]}`)
        return { ok: true }
      }
      case 'print:test': {
        await axios.post(`${LOCAL_API}/print/test`, { printerId: args[0] })
        return { ok: true }
      }
      case 'print:get-stats': {
        const { data } = await axios.get<PrintStats>(`${LOCAL_API}/print/stats`)
        return { ok: true, data: data as T }
      }
      case 'print:get-history': {
        const { data } = await axios.get<PrintHistoryEntry[]>(`${LOCAL_API}/print/history`, {
          params: { limit: args[0] ?? 50 },
        })
        return { ok: true, data: data as T }
      }
      case 'print:kot': {
        const { data } = await axios.post(`${LOCAL_API}/print/kot`, args[0])
        return { ok: true, data: data as T }
      }
      case 'print:bill': {
        const { data } = await axios.post(`${LOCAL_API}/print/bill`, args[0])
        return { ok: true, data: data as T }
      }
      case 'print:reprint-bill': {
        const { data } = await axios.post(`${LOCAL_API}/print/reprint-bill`, args[0])
        return { ok: true, data: data as T }
      }
      case 'print:discover-system': {
        const { data } = await axios.get<SystemPrinter[]>(`${LOCAL_API}/print/discover-system`)
        return { ok: true, data: data as T }
      }
      default:
        return { ok: false, error: `Unknown channel: ${channel}` }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { ok: false, error: message }
  }
}

export const printerApi = {
  async getPrinters(): Promise<PrinterConfig[]> {
    const res = await invoke<PrinterConfig[]>('print:get-printers')
    if (!res.ok) throw new Error(res.error ?? 'Failed to fetch printers')
    return res.data ?? []
  },

  async savePrinter(data: PrinterFormData): Promise<PrinterConfig> {
    const res = await invoke<PrinterConfig>('print:save-printer', data)
    if (!res.ok) throw new Error(res.error ?? 'Failed to save printer')
    return res.data!
  },

  async deletePrinter(id: string): Promise<void> {
    const res = await invoke('print:delete-printer', id)
    if (!res.ok) throw new Error(res.error ?? 'Failed to delete printer')
  },

  async testPrint(printerId: string): Promise<void> {
    const res = await invoke('print:test', printerId)
    if (!res.ok) throw new Error(res.error ?? 'Test print failed')
  },

  async getStats(): Promise<PrintStats> {
    const res = await invoke<PrintStats>('print:get-stats')
    if (!res.ok) throw new Error(res.error ?? 'Failed to fetch stats')
    return res.data ?? { pending: 0, completed: 0, failed: 0, total: 0 }
  },

  async getHistory(limit?: number): Promise<PrintHistoryEntry[]> {
    const res = await invoke<PrintHistoryEntry[]>('print:get-history', limit)
    if (!res.ok) throw new Error(res.error ?? 'Failed to fetch history')
    return res.data ?? []
  },

  async discoverSystemPrinters(): Promise<SystemPrinter[]> {
    const res = await invoke<SystemPrinter[]>('print:discover-system')
    if (!res.ok) throw new Error(res.error ?? 'Failed to discover printers')
    return res.data ?? []
  },

  async printKOT(data: PrintKOTData): Promise<void> {
    const res = await invoke('print:kot', data)
    if (!res.ok) throw new Error(res.error ?? 'Failed to print KOT')
  },

  async printBill(data: PrintBillData): Promise<void> {
    const res = await invoke('print:bill', data)
    if (!res.ok) throw new Error(res.error ?? 'Failed to print bill')
  },

  async reprintBill(data: PrintBillData): Promise<void> {
    const res = await invoke('print:reprint-bill', data)
    if (!res.ok) throw new Error(res.error ?? 'Failed to reprint bill')
  },
}
