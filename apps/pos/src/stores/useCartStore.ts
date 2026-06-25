import { create } from 'zustand'

interface CartItem {
  id: string
  orderId: string
  itemId: string
  itemName: string
  variationName?: string
  quantity: number
  unitPrice: number
  lineTotal: number
  status: string
  note?: string
}

interface CartState {
  activeTableId: string | null
  activeOrderId: string | null
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
  activeOrderId: null,
  guestCount: 2,
  items: [],
  orderNote: '',

  setActiveTable: (tableId) => set({ activeTableId: tableId }),
  clearCart: () =>
    set({
      activeTableId: null,
      activeOrderId: null,
      guestCount: 2,
      items: [],
      orderNote: '',
    }),
  setGuestCount: (count) => set({ guestCount: count }),
  setOrderNote: (note) => set({ orderNote: note }),
}))
