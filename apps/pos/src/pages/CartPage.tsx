import { useState, useCallback } from 'react'
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

  // Handle takeaway-new: no order created yet, will create on first item add
  const isTakeawayNew = routeTableId === 'takeaway-new'

  const getOrCreateTakeawayOrder = async (): Promise<string> => {
    if (takeawayOrderId) return takeawayOrderId
    const { data } = await apiClient.post('/orders/takeaway')
    const id = data.id as string
    setTakeawayOrderId(id)
    setTableId(id)
    queryClient.invalidateQueries({ queryKey: ['takeaway-orders'] })
    return id
  }

  // Set tableId on mount
  useState(() => {
    if (routeTableId && routeTableId !== 'takeaway-new') {
      setTableId(routeTableId)
    }
  })

  const addItemMut = useMutation({
    mutationFn: async (payload: { tableId: string; itemId: string; variationId?: string }) => {
      // For new takeaway, create order then add item
      let targetTableId = payload.tableId
      if (isTakeawayNew) {
        targetTableId = await getOrCreateTakeawayOrder()
      }
      let orderRes = await apiClient.get(`/orders/${targetTableId}/active`)
      let orderId: string | undefined = orderRes.data?.id
      if (!orderId) {
        const createRes = await apiClient.post('/orders', { tableId: targetTableId })
        orderId = createRes.data?.id
      }
      if (!orderId) return
      const { data } = await apiClient.post('/cart/add-item', {
        orderId,
        itemId: payload.itemId,
        variationId: payload.variationId,
      })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', tableId] })
      queryClient.invalidateQueries({ queryKey: ['tables'] })
    },
    onError: (err: AxiosError<{ error?: { message?: string } }>) => {
      const msg = err.response?.data?.error?.message ?? err.message
      toast(`Failed to add item${msg ? `: ${msg}` : ''}`, 'error')
    },
  })

  const handleSelectTable = useCallback(
    (tId: string) => {
      setTableId(tId)
      setActiveTable(tId)
    },
    [setActiveTable],
  )

  const handleAddItem = useCallback(
    (item: { id: string }, variationId?: string) => {
      if (!tableId) return
      addItemMut.mutate({ tableId, itemId: item.id, variationId })
    },
    [tableId, addItemMut],
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
