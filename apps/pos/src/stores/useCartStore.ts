import { create } from 'zustand'

export interface CartItemEntry {
  id: string
  itemId: string
  itemName: string
  variationId?: string
  variationName?: string
  quantity: number
  unitPrice: number
  note?: string
}

interface CartState {
  activeTableId: string | null
  guestCount: number
  items: CartItemEntry[]
  orderNote: string
  setActiveTable: (tableId: string) => void
  clearCart: () => void
  setGuestCount: (count: number) => void
  setOrderNote: (note: string) => void
  addItem: (item: { itemId: string; itemName: string; unitPrice: number; variationId?: string; variationName?: string }) => void
  removeItem: (id: string) => void
  updateItemQty: (id: string, qty: number) => void
  updateItemNote: (id: string, note: string) => void
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

  addItem: (item) => set((state) => {
    const existing = state.items.find(
      (i) => i.itemId === item.itemId && i.variationId === item.variationId,
    )
    if (existing) {
      return {
        items: state.items.map((i) =>
          i.id === existing.id
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        ),
      }
    }
    return {
      items: [
        ...state.items,
        {
          id: crypto.randomUUID(),
          itemId: item.itemId,
          itemName: item.itemName,
          variationId: item.variationId,
          variationName: item.variationName,
          quantity: 1,
          unitPrice: item.unitPrice,
          note: undefined,
        },
      ],
    }
  }),

  removeItem: (id) => set((state) => ({
    items: state.items.filter((i) => i.id !== id),
  })),

  updateItemQty: (id, qty) => set((state) => ({
    items: state.items.map((i) =>
      i.id === id ? { ...i, quantity: Math.max(1, qty) } : i,
    ),
  })),

  updateItemNote: (id, note) => set((state) => ({
    items: state.items.map((i) =>
      i.id === id ? { ...i, note } : i,
    ),
  })),
}))
