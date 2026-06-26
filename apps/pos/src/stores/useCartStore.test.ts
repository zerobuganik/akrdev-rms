import { describe, it, expect, beforeEach } from 'vitest'
import { useCartStore } from './useCartStore'

describe('useCartStore', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart()
  })

  it('starts with null active table and order', () => {
    const { activeTableId, activeOrderId } = useCartStore.getState()
    expect(activeTableId).toBeNull()
    expect(activeOrderId).toBeNull()
  })

  it('sets active table', () => {
    useCartStore.getState().setActiveTable('table-1')
    expect(useCartStore.getState().activeTableId).toBe('table-1')
  })

  it('clears cart to defaults', () => {
    useCartStore.getState().setActiveTable('table-1')
    useCartStore.getState().setGuestCount(5)
    useCartStore.getState().setOrderNote('no onions')
    useCartStore.getState().clearCart()

    const { activeTableId, activeOrderId, guestCount, items, orderNote } = useCartStore.getState()
    expect(activeTableId).toBeNull()
    expect(activeOrderId).toBeNull()
    expect(guestCount).toBe(2)
    expect(items).toEqual([])
    expect(orderNote).toBe('')
  })

  it('sets guest count', () => {
    useCartStore.getState().setGuestCount(4)
    expect(useCartStore.getState().guestCount).toBe(4)
  })

  it('sets order note', () => {
    useCartStore.getState().setOrderNote('extra spicy')
    expect(useCartStore.getState().orderNote).toBe('extra spicy')
  })
})
