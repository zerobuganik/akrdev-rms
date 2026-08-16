import { create } from 'zustand'
import type { CaptainCartItem } from '@/lib/types'

export type CartView = 'menu' | 'cart'

interface CartState {
  activeTableId: string | null
  activeTableName: string
  activeOrderId: string | null
  guestCount: number
  view: CartView
  items: CaptainCartItem[]
  orderNote: string
  setActiveTable: (tableId: string, tableName?: string) => void
  setActiveOrder: (orderId: string | null) => void
  setGuestCount: (count: number) => void
  setView: (view: CartView) => void
  setOrderNote: (note: string) => void
  addItem: (item: { itemId: string; itemName: string; unitPrice: number; variationId?: string; variationName?: string }) => void
  removeItem: (id: string) => void
  updateItemQty: (id: string, quantity: number) => void
  updateItemNote: (id: string, note: string) => void
  clearCart: () => void
  reset: () => void
}

export const useCartStore = create<CartState>((set) => ({
  activeTableId: null,
  activeTableName: '',
  activeOrderId: null,
  guestCount: 2,
  view: 'menu',
  items: [],
  orderNote: '',
  setActiveTable: (tableId, tableName = '') => set({ activeTableId: tableId, activeTableName: tableName, view: 'menu' }),
  setActiveOrder: (orderId) => set({ activeOrderId: orderId }),
  setGuestCount: (guestCount) => set({ guestCount }),
  setView: (view) => set({ view }),
  setOrderNote: (orderNote) => set({ orderNote }),
  addItem: (item) => set((state) => {
    const existing = state.items.find(
      (i) => i.itemId === item.itemId && (i.variationId ?? undefined) === (item.variationId ?? undefined),
    )
    if (existing) {
      return {
        items: state.items.map((i) => (i.id === existing.id ? { ...i, quantity: i.quantity + 1 } : i)),
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
  removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  updateItemQty: (id, quantity) => set((state) => ({
    items: state.items.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i)),
  })),
  updateItemNote: (id, note) => set((state) => ({
    items: state.items.map((i) => (i.id === id ? { ...i, note } : i)),
  })),
  clearCart: () => set({ items: [], orderNote: '', guestCount: 2 }),
  reset: () => set({ activeTableId: null, activeTableName: '', activeOrderId: null, guestCount: 2, view: 'menu', items: [], orderNote: '' }),
}))
