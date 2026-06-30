import { create } from 'zustand'
import type { OrderItem } from '@akrdev/types'

interface CartItem extends Pick<OrderItem, 'id' | 'itemId' | 'quantity' | 'unitPrice' | 'lineTotal' | 'status' | 'note'> {
  orderId: string
  itemName: string
  variationName?: string
}

interface CartState {
  activeTableId: string | null
  guestCount: number
  items: CartItem[]
  orderNote: string
  setActiveTable: (tableId: string) => void
  clearCart: () => void
  setGuestCount: (count: number) => void
  setOrderNote: (note: string) => void
}

export const useCartStore = create<CartState>((set) => ({
  activeTableId: null,
  guestCount: 2,
  items: [],
  orderNote: '',

  setActiveTable: (tableId) => set({ activeTableId: tableId }),
  clearCart: () =>
    set({
      activeTableId: null,
      guestCount: 2,
      items: [],
      orderNote: '',
    }),
  setGuestCount: (count) => set({ guestCount: count }),
  setOrderNote: (note) => set({ orderNote: note }),
}))
