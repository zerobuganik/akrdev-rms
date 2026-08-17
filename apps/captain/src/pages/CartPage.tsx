import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient, getApiErrorMessage } from '@/lib/apiClient'
import { useCartStore } from '@/stores/useCartStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { toast } from '@/stores/useToastStore'
import { successHaptic, mediumHaptic } from '@/lib/native-bridge'
import { onSocket, subscribeTable, unsubscribeTable } from '@/lib/socket'
import { MenuView } from '@/components/menu/MenuView'
import { CartView } from '@/components/cart/CartView'
import { getItemDisplayName } from '@/lib/format'
import { ArrowLeft, ChevronLeft, ChevronRight, ShoppingCart, UtensilsCrossed } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CaptainOrder, CaptainTable, MenuItem } from '@/lib/types'

export default function CartPage() {
  const { tableId, orderId } = useParams()
  const isTakeaway = !tableId
  const isNewTakeaway = isTakeaway && orderId === 'new'
  const entityId = isNewTakeaway ? '' : (tableId ?? orderId ?? '')
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)
  const {
    view,
    setView,
    guestCount,
    setGuestCount,
    orderNote,
    setOrderNote,
    items,
    addItem,
    removeItem,
    updateItemQty,
    updateItemNote,
    clearCart,
  } = useCartStore()
  const [sendingKot, setSendingKot] = useState(false)
  const [printingBill, setPrintingBill] = useState(false)
  const syncedOrderIdRef = useRef<string | null>(null)

  useEffect(() => {
    clearCart()
    syncedOrderIdRef.current = null
    setView('menu')
  }, [entityId, clearCart, setView])

  const orderQuery = useQuery({
    queryKey: ['order', entityId],
    queryFn: async () => (await apiClient.get<CaptainOrder | null>(`/orders/${entityId}/active`)).data,
    refetchInterval: 4000,
    enabled: !!entityId,
  })
  const order = orderQuery.data ?? null

  useEffect(() => {
    if (order && syncedOrderIdRef.current !== order.id) {
      syncedOrderIdRef.current = order.id
      setGuestCount(order.guestCount ?? 2)
      setOrderNote(order.note ?? '')
    }
  }, [order, setGuestCount, setOrderNote])

  const tablesQuery = useQuery({
    queryKey: ['tables'],
    queryFn: async () => (await apiClient.get<CaptainTable[]>('/tables')).data,
    staleTime: 10_000,
  })
  const tables = tablesQuery.data ?? []

  useEffect(() => {
    if (!entityId || isTakeaway) return
    subscribeTable(entityId)
    const offUpdated = onSocket('order:updated', (payload) => {
      const p = payload as { tableId?: string }
      if (p?.tableId === entityId) queryClient.invalidateQueries({ queryKey: ['order', entityId] })
    })
    const offStatus = onSocket('order:status-change', (payload) => {
      const p = payload as { tableId?: string }
      if (p?.tableId === entityId) queryClient.invalidateQueries({ queryKey: ['order', entityId] })
    })
    return () => {
      unsubscribeTable(entityId)
      offUpdated()
      offStatus()
    }
  }, [entityId, isTakeaway, queryClient])

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['order', entityId] })
    queryClient.invalidateQueries({ queryKey: ['tables'] })
    queryClient.invalidateQueries({ queryKey: ['takeaway-orders'] })
  }

  const runMutation = async (fn: () => Promise<unknown>, successMsg?: string) => {
    try {
      await fn()
      if (successMsg) toast(successMsg, 'success')
      invalidate()
    } catch (err) {
      toast(getApiErrorMessage(err, 'Action failed'), 'error')
      mediumHaptic()
    }
  }

  const handleAddItem = (item: MenuItem, variationId?: string) => {
    if (order) {
      void runMutation(
        () => apiClient.post('/cart/add-item', { orderId: order.id, itemId: item.id, variationId, quantity: 1 }),
      ).then(() => successHaptic())
      return
    }
    let unitPrice = item.basePrice
    let variationName: string | undefined
    if (variationId) {
      const v = item.variations?.find((x) => x.id === variationId)
      if (v) {
        unitPrice += v.priceAdjustment
        variationName = v.name
      }
    }
    addItem({ itemId: item.id, itemName: item.name, unitPrice, variationId, variationName })
    void successHaptic()
  }

  const handleServerSetQty = (orderItemId: string, quantity: number) => {
    void runMutation(() => apiClient.put('/cart/item-qty', { orderItemId, quantity }))
  }

  const handleServerRemove = (orderItemId: string) => {
    void runMutation(() => apiClient.post('/cart/remove-item', { orderItemId }))
  }

  const handleCancel = (orderItemIds: string[]) => {
    void (async () => {
      try {
        await Promise.all(
          orderItemIds.map((orderItemId) => apiClient.post('/cart/cancel-item', { orderItemId, cancelledBy: user?.name })),
        )
        toast('Item cancelled', 'success')
        invalidate()
      } catch (err) {
        toast(getApiErrorMessage(err, 'Failed to cancel item'), 'error')
        mediumHaptic()
      }
    })()
  }

  const handleServerItemNote = (orderItemId: string, note: string) => {
    void runMutation(() => apiClient.put('/cart/item-note', { orderItemId, note }))
  }

  const handleGuestCount = (guestCount: number) => {
    setGuestCount(guestCount)
    if (order) {
      void runMutation(() => apiClient.put('/cart/guest-count', { orderId: order.id, guestCount }))
    }
  }

  const handleAssignCustomer = (phone: string, name?: string) => {
    if (!order) return
    void runMutation(() => apiClient.post('/cart/assign-customer', { orderId: order.id, phone, name }))
  }

  const printKot = async (
    orderIdForPrint: string,
    tableName: string,
    kotGuestCount: number,
    kotNumber: number,
    kotItems: Array<{ itemName: string; variationName: string | null; quantity: number; unitPrice: number; lineTotal: number; note: string | null }>,
  ) => {
    const printItems = kotItems.map((i) => ({
      name: getItemDisplayName({ itemName: i.itemName, variationName: i.variationName }),
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      lineTotal: i.lineTotal,
      note: i.note ?? undefined,
    }))
    await apiClient
      .post('/print/kot', {
        printType: 'kot',
        orderId: orderIdForPrint,
        tableName,
        guestCount: kotGuestCount,
        serverName: user?.name ?? 'Captain',
        kotNumber,
        items: printItems,
        date: new Date().toLocaleString('en-IN'),
        orderType: isTakeaway ? 'Takeaway' : 'Dine In',
      })
      .catch(() => {})
  }

  const handleSendKOT = async () => {
    setSendingKot(true)
    try {
      if (order) {
        if (!order.items.some((i) => i.status === 'New')) return
        const { data } = await apiClient.post('/kot/send', { orderId: order.id, sentBy: user?.name ?? 'Captain' })
        toast('KOT sent', 'success')
        invalidate()
        await printKot(
          order.id,
          order.tableName ?? (isTakeaway ? 'Takeaway' : 'Table'),
          guestCount,
          (data as { kotNumber: number }).kotNumber,
          (data as { items: Array<{ itemName: string; variationName: string | null; quantity: number; unitPrice: number; lineTotal: number; note: string | null }> }).items ?? [],
        )
      } else {
        if (items.length === 0) return
        const payloadItems = items.map((i) => ({
          itemId: i.itemId,
          itemName: i.itemName,
          variationId: i.variationId,
          variationName: i.variationName,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          note: i.note,
        }))
        const printItems = items.map((i) => ({
          itemName: i.itemName,
          variationName: i.variationName ?? null,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          lineTotal: i.unitPrice * i.quantity,
          note: i.note ?? null,
        }))
        const { data } = await apiClient.post('/kot/send-with-items', {
          tableId: isTakeaway ? undefined : entityId,
          guestCount,
          orderType: isTakeaway ? 'Takeaway' : 'DineIn',
          note: orderNote || undefined,
          items: payloadItems,
        })
        const resultOrderId = (data as { orderId: string }).orderId
        toast('KOT sent', 'success')
        clearCart()
        invalidate()
        await printKot(
          resultOrderId,
          isTakeaway ? 'Takeaway' : (resolvedTableName ?? 'Table'),
          guestCount,
          (data as { kotNumber: number }).kotNumber,
          printItems,
        )
        if (isNewTakeaway) {
          navigate(`/takeaway/${resultOrderId}`, { replace: true })
        }
      }
    } catch (err) {
      toast(getApiErrorMessage(err, 'Failed to send KOT'), 'error')
    } finally {
      setSendingKot(false)
    }
  }

  const printBill = async () => {
    if (!order) return
    const settings = await apiClient.get('/settings').then((r) => r.data).catch(() => ({}))
    const billItems = order.items
      .filter((i) => i.status !== 'Cancelled')
      .map((i) => ({
        name: getItemDisplayName(i),
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        lineTotal: i.lineTotal,
        note: i.note ?? undefined,
      }))
    await apiClient
      .post('/print/bill', {
        printType: 'bill',
        orderId: order.id,
        tableName: order.tableName ?? (isTakeaway ? 'Takeaway' : 'Table'),
        restaurantName: settings?.companyName,
        restaurantAddress: settings?.address,
        phone: settings?.phone,
        email: settings?.email,
        website: settings?.website,
        fssai: settings?.fssai,
        gstin: settings?.gstin,
        headerText: settings?.headerText,
        footerText: settings?.footerText,
        orderNumber: order.id.slice(0, 8).toUpperCase(),
        guestCount: order.guestCount,
        serverName: user?.name ?? 'Captain',
        items: billItems,
        subtotal: order.subtotal,
        taxTotal: order.taxTotal,
        discountTotal: order.discountTotal,
        grandTotal: order.grandTotal,
        roundingAdjustment: order.roundingAdjustment ?? 0,
        taxName: 'GST',
        date: new Date().toLocaleString('en-IN'),
        orderType: isTakeaway ? 'Takeaway' : 'Dine In',
      })
      .catch(() => {})
  }

  const handlePrintBill = async () => {
    if (!order) return
    setPrintingBill(true)
    try {
      await apiClient.put(`/orders/${order.id}`, { status: 'Bill_Printed' })
      toast('Bill printed', 'success')
      invalidate()
      await printBill()
    } catch (err) {
      toast(getApiErrorMessage(err, 'Failed to print bill'), 'error')
    } finally {
      setPrintingBill(false)
    }
  }

  const tableIndex = tables.findIndex((t) => t.id === tableId)
  const prevTable = tableIndex > 0 ? tables[tableIndex - 1] : undefined
  const nextTable = tableIndex >= 0 && tableIndex < tables.length - 1 ? tables[tableIndex + 1] : undefined

  const backPath = isTakeaway ? '/takeaway' : '/tables'
  const resolvedTableName = tables.find((t) => t.id === tableId)?.name
  const headerTitle = isTakeaway ? 'Takeaway' : (resolvedTableName ?? order?.tableName ?? 'Table')

  const menuCartItems = useMemo(() => [
    ...items.map((i) => ({ itemId: i.itemId, quantity: i.quantity })),
    ...(order?.items ?? []).map((i) => ({ itemId: i.itemId, quantity: i.quantity, status: i.status })),
  ], [items, order])

  const cartBadgeCount = items.length + (order?.items.filter((i) => i.status !== 'Cancelled').length ?? 0)

  return (
    <div className="flex h-full flex-col bg-background">
      <header className="flex items-center gap-2 border-b bg-card px-2 py-2">
        <button onClick={() => navigate(backPath)} className="rounded-md p-2 text-muted-foreground hover:bg-muted">
          <ArrowLeft size={18} />
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">{headerTitle}</p>
          <p className="truncate text-[10px] text-muted-foreground">
            {isTakeaway ? 'Takeaway order' : `${guestCount} guests`}
          </p>
        </div>
        {!isTakeaway && (
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => prevTable && navigate(`/cart/${prevTable.id}`)}
              disabled={!prevTable}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-muted disabled:opacity-30"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => nextTable && navigate(`/cart/${nextTable.id}`)}
              disabled={!nextTable}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-muted disabled:opacity-30"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </header>

      <div className="min-h-0 flex-1 overflow-hidden">
        {view === 'menu' ? <MenuView onAddItem={handleAddItem} cartItems={menuCartItems} /> : (
          <CartView
            order={order}
            isTakeaway={isTakeaway}
            sendingKot={sendingKot}
            printingBill={printingBill}
            cartItems={items}
            guestCount={guestCount}
            onLocalSetQty={updateItemQty}
            onLocalRemove={removeItem}
            onLocalItemNote={updateItemNote}
            onServerSetQty={handleServerSetQty}
            onServerRemove={handleServerRemove}
            onServerItemNote={handleServerItemNote}
            onCancel={handleCancel}
            onGuestCount={handleGuestCount}
            onAssignCustomer={handleAssignCustomer}
            onSendKOT={() => void handleSendKOT()}
            onPrintBill={() => void handlePrintBill()}
          />
        )}
      </div>

      <div className="flex shrink-0 border-t bg-card">
        <button
          onClick={() => setView('menu')}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 py-3 text-sm font-medium',
            view === 'menu' ? 'text-primary' : 'text-muted-foreground',
          )}
        >
          <UtensilsCrossed size={16} /> Menu
        </button>
        <button
          onClick={() => setView('cart')}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 py-3 text-sm font-medium',
            view === 'cart' ? 'text-primary' : 'text-muted-foreground',
          )}
        >
          <ShoppingCart size={16} /> Cart ({cartBadgeCount})
        </button>
      </div>
    </div>
  )
}
