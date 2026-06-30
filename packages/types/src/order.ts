export type OrderStatus =
  | 'Draft'
  | 'KOT_Sent'
  | 'Ready'
  | 'Bill_Printed'
  | 'Settled'
  | 'Cancelled'

export type OrderType = 'DineIn' | 'Takeaway'

export type OrderItemStatus = 'New' | 'Sent' | 'Ready' | 'Cancelled'

export type SyncStatus = 'Pending' | 'Syncing' | 'Synced' | 'Failed'

export type DiscountType = 'Percentage' | 'Flat'

export interface OrderItem {
  id: string
  orderId: string
  itemId: string
  variationId?: string | null
  kotId?: string | null
  quantity: number
  unitPrice: number
  lineTotal: number
  status: OrderItemStatus
  note?: string
  cancelledAt?: string | null
  cancelledBy?: string | null
  item?: { name: string }
  itemName?: string
  variation?: { name: string } | null
  cancelledByUser?: { name: string } | null
}

export interface OrderDiscount {
  id: string
  orderId: string
  type: DiscountType
  value: number
  reason?: string | null
}

export interface KOT {
  id: string
  orderId: string
  kotNumber: number
  sentAt: string
  sentBy: string
  sentByUser?: { name: string } | null
}

export interface Settlement {
  id: string
  orderId: string
  subtotal: number
  taxTotal: number
  discountTotal: number
  grandTotal: number
  cashPaid: number
  cardPaid: number
  upiPaid: number
  changeAmt: number
  createdAt: string
  updatedAt: string
}

export interface Order {
  id: string
  displayId?: string | null
  tableId?: string | null
  customerId?: string | null
  guestCount: number
  status: OrderStatus
  syncStatus: SyncStatus
  subtotal: number
  taxTotal: number
  discountTotal: number
  grandTotal: number
  roundingAdjustment: number
  orderType: OrderType
  createdBy: string
  note?: string | null
  mergedFromTableId?: string | null
  createdAt: string
  updatedAt: string
  table?: { name: string; capacity: number } | null
  items: OrderItem[]
  kots: KOT[]
  discounts: OrderDiscount[]
  settlement?: Settlement | null
}
