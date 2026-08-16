import type { MenuItem, MenuCategory, ItemVariation } from '@akrdev/types'

export type { MenuItem, MenuCategory, ItemVariation }

export interface CaptainUser {
  id: string
  name: string
  phone: string
  role: string
  imageUrl?: string | null
}

export interface CaptainTableArea {
  id: string
  name: string
  displayOrder?: number
}

export interface CaptainTableOrderSummary {
  id: string
  createdAt: string
  updatedAt?: string
  subtotal: number
  grandTotal: number
  status: string
  firstKotAt?: string | null
}

export interface CaptainTable {
  id: string
  name: string
  capacity: number
  position?: number
  status: string
  area?: CaptainTableArea | null
  orders?: CaptainTableOrderSummary[]
  activeOrder?: { grandTotal: number; status: string; createdAt: string; updatedAt?: string } | null
}

export interface CaptainCartItem {
  id: string
  itemId: string
  itemName: string
  variationId?: string
  variationName?: string
  quantity: number
  unitPrice: number
  note?: string
}

export type CaptainOrderItemStatus = 'New' | 'Sent' | 'Ready' | 'Cancelled'

export interface CaptainOrderItem {
  id: string
  orderId: string
  itemId: string
  variationId?: string | null
  kotId?: string | null
  quantity: number
  unitPrice: number
  lineTotal: number
  status: CaptainOrderItemStatus
  note?: string | null
  cancelledAt?: string | null
  cancelledBy?: string | null
  itemName?: string | null
  item?: { name: string } | null
  variationName?: string | null
  variation?: { name: string } | null
  cancelledByUser?: { name: string } | null
}

export interface CaptainKOT {
  id: string
  orderId: string
  kotNumber: number
  sentAt: string
  sentBy: string
  sentByUser?: { name: string } | null
}

export interface CaptainOrder {
  id: string
  tableId?: string | null
  tableName?: string | null
  customerId?: string | null
  customerPhone?: string | null
  guestCount: number
  status: string
  subtotal: number
  taxTotal: number
  discountTotal: number
  grandTotal: number
  roundingAdjustment?: number
  orderType?: string | null
  note?: string | null
  createdAt: string
  updatedAt: string
  items: CaptainOrderItem[]
  kots: CaptainKOT[]
}

export interface CaptainCustomer {
  id: string
  phone: string
  name?: string | null
}
