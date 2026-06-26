import { create } from 'zustand'
import type { OrderItem } from '@akrdev/types'

interface CartState {
  activeTableId: string | null
  activeOrderId: string | null
  guestCount: number
  items: Pick<OrderItem, 'id' | 'quantity' | 'unitPrice' | 'lineTotal' | 'status'>[] & Array<{ name: string; variationName?: string }>
  clearCart: () => void
  setActiveTable: (tableId: string) => void
  setActiveOrder: (orderId: string) => void
  setGuestCount: (count: number) => void
}

export const useCartStore = create<CartState>((set) => ({
  activeTableId: null,
  activeOrderId: null,
  guestCount: 2,
  items: [],
  clearCart: () => set({ activeTableId: null, activeOrderId: null, guestCount: 2, items: [] }),
  setActiveTable: (tableId) => set({ activeTableId: tableId }),
  setActiveOrder: (orderId) => set({ activeOrderId: orderId }),
  setGuestCount: (count) => set({ guestCount: count }),
}))
