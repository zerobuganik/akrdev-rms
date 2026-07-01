import { useState, useCallback, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { TableSwitcher } from '@/components/cart/TableSwitcher'
import { MenuPanel } from '@/components/cart/MenuPanel'
import { CartPanel } from '@/components/cart/CartPanel'
import { useCartStore } from '@/stores/useCartStore'

export default function CartPage() {
  const { tableId: routeTableId } = useParams()
  const { setActiveTable, addItem } = useCartStore()
  const [tableId, setTableId] = useState<string | null>(null)

  const isTakeawayNew = routeTableId === 'takeaway-new'

  useEffect(() => {
    if (routeTableId && routeTableId !== 'takeaway-new') {
      setTableId(routeTableId)
      setActiveTable(routeTableId)
    } else if (isTakeawayNew) {
      setTableId('takeaway-new')
    }
  }, [routeTableId, isTakeawayNew, setActiveTable])

  useEffect(() => {
    return () => {
      useCartStore.getState().clearCart()
    }
  }, [])

  const handleAddItem = useCallback(
    (item: { id: string; name: string; basePrice: number; variations?: Array<{ id: string; name: string; priceAdjustment: number }> }, variationId?: string) => {
      if (!tableId && !isTakeawayNew) return
      let unitPrice = item.basePrice
      let itemName = item.name
      let variationName: string | undefined
      if (variationId && item.variations) {
        const v = item.variations.find((v) => v.id === variationId)
        if (v) {
          unitPrice += v.priceAdjustment
          variationName = v.name
        }
      }
      addItem({
        itemId: item.id,
        itemName,
        unitPrice,
        variationId,
        variationName,
      })
    },
    [tableId, isTakeawayNew, addItem],
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
