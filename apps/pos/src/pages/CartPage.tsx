import { useState, useCallback, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { TableSwitcher } from '@/components/cart/TableSwitcher'
import { MenuPanel } from '@/components/cart/MenuPanel'
import { CartPanel } from '@/components/cart/CartPanel'
import { useCartStore } from '@/stores/useCartStore'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/apiClient'
import { toast } from '@/stores/useToastStore'
import type { AxiosError } from 'axios'

export default function CartPage() {
  const { tableId: routeTableId } = useParams()
  const { setActiveTable } = useCartStore()
  const [tableId, setTableId] = useState<string | null>(null)
  const [takeawayOrderId, setTakeawayOrderId] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const isTakeawayNew = routeTableId === 'takeaway-new'

  const getOrCreateTakeawayOrder = useCallback(async (): Promise<string> => {
    if (takeawayOrderId) return takeawayOrderId
    const { data } = await apiClient.post('/orders/takeaway')
    const id = data.id as string
    setTakeawayOrderId(id)
    setTableId(id)
    queryClient.invalidateQueries({ queryKey: ['takeaway-orders'] })
    return id
  }, [takeawayOrderId, queryClient])

  useEffect(() => {
    if (routeTableId && routeTableId !== 'takeaway-new') {
      setTableId(routeTableId)
      setActiveTable(routeTableId)
    }
  }, [routeTableId, setActiveTable])

  const addItemMut = useMutation({
    mutationFn: async (payload: { itemId: string; variationId?: string }) => {
      let targetTableId: string | null = tableId
      if (isTakeawayNew || !targetTableId) {
        targetTableId = await getOrCreateTakeawayOrder()
      }
      let orderRes = await apiClient.get(`/orders/${targetTableId}/active`)
      let orderId: string | undefined = orderRes.data?.id
      if (!orderId) {
        const createRes = await apiClient.post('/orders', { tableId: targetTableId })
        orderId = createRes.data?.id
      }
      if (!orderId) throw new Error('Could not create order')
      const { data } = await apiClient.post('/cart/add-item', {
        orderId,
        itemId: payload.itemId,
        variationId: payload.variationId,
      })
      return data
    },
    onMutate: async (payload) => {
      // Cancel outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: ['order', tableId] })
      const previous = queryClient.getQueryData(['order', tableId])
      // Optimistically add a placeholder item to the order cache
      queryClient.setQueryData(['order', tableId], (old: any) => {
        const base = old || {
          id: tableId,
          tableId,
          table: null,
          guestCount: 2,
          subtotal: 0,
          taxTotal: 0,
          discountTotal: 0,
          grandTotal: 0,
          status: 'New',
          orderType: 'DineIn',
          items: [],
          kots: [],
          discounts: [],
        }
        const newItem = {
          id: `optimistic-${Date.now()}`,
          itemId: payload.itemId,
          item: { name: 'Adding...', id: payload.itemId },
          variationId: payload.variationId || null,
          variation: null,
          quantity: 1,
          unitPrice: 0,
          lineTotal: 0,
          status: 'New',
          note: null,
          kotId: null,
          cancelledAt: null,
          cancelledBy: null,
          cancelledByUser: null,
        }
        return { ...base, items: [...base.items, newItem] }
      })
      return { previous }
    },
    onError: (err, _payload, context) => {
      // Roll back optimistic update on error
      if (context?.previous !== undefined) {
        queryClient.setQueryData(['order', tableId], context.previous)
      }
      const msg = (err as AxiosError<{ error?: { message?: string } }>)?.response?.data?.error?.message
        ?? (err as Error)?.message
      toast(`Failed to add item${msg ? `: ${msg}` : ''}`, 'error')
    },
    onSettled: () => {
      // Always refetch to get real data from server
      queryClient.invalidateQueries({ queryKey: ['order', tableId] })
      queryClient.invalidateQueries({ queryKey: ['tables'] })
    },
  })

  const handleAddItem = useCallback(
    (item: { id: string }, variationId?: string) => {
      if (!tableId && !isTakeawayNew) return
      addItemMut.mutate({ itemId: item.id, variationId })
    },
    [tableId, isTakeawayNew, addItemMut],
  )

  const handleSelectTable = useCallback(
    (tId: string) => {
      setTableId(tId)
      setActiveTable(tId)
    },
    [setActiveTable],
  )

  return (
    <div className="flex h-full">
      <div className="w-[10%] min-w-[140px]">
        <TableSwitcher activeTableId={tableId} onSelect={handleSelectTable} />
      </div>
      <div className="w-[60%]">
        <MenuPanel onAddItem={handleAddItem} />
      </div>
      <div className="w-[30%] min-w-[320px]">
        <CartPanel tableId={tableId} />
      </div>
    </div>
  )
}
