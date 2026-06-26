export interface ActivityLogEntry {
  id: string
  userId: string
  module: string
  action: string
  oldValue?: string | null
  newValue?: string | null
  createdAt: string
  user?: { name: string } | null
}

export interface PaymentLedgerEntry {
  id: string
  orderId: string
  displayId?: string | null
  orderType: string
  tableName: string
  grandTotal: number
  cashPaid: number
  cardPaid: number
  upiPaid: number
  changeAmt: number
  netCash: number
  createdAt: string
}

export interface PaymentSummary {
  cash: number
  card: number
  upi: number
  total: number
  count: number
  ledger: PaymentLedgerEntry[]
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
}
