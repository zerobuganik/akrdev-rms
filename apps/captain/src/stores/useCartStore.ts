import { create } from 'zustand'

interface CartState {
  activeTableId: string | null
  activeOrderId: string | null
  guestCount: number
  items: Array<{ id: string; name: string; quantity: number; unitPrice: number; lineTotal: number; variationName?: string; status: string }>
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
