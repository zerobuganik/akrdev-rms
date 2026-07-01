import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/apiClient'
import type { AxiosError } from 'axios'
import { Minus, Plus, Trash2, Users, FilePen, Ban, Printer, RefreshCw } from 'lucide-react'
import { useCartStore } from '@/stores/useCartStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { toast } from '@/stores/useToastStore'
import { printerApi } from '@/lib/printerApi'
import { formatPrintDate } from '@/lib/utils'
import { resolveImageUrl } from '@/lib/imageBaseUrl'
import { SettlementModal } from '@/components/settlement/SettlementModal'
import { PaymentChangeModal } from '@/components/settlement/PaymentChangeModal'

interface ApiOrderItem {
  id: string
  itemId: string
  orderId: string
  kotId?: string
  variationId?: string
  quantity: number
  unitPrice: number
  lineTotal: number
  status: string
  note?: string
  cancelledAt?: string
  cancelledBy?: string
  cancelledByUser?: { name: string }
  item?: { id: string; name: string }
  itemName?: string
  variation?: { id: string; name: string }
  variationName?: string
}

interface KOT {
  id: string
  kotNumber: number
  sentAt: string
  sentBy: string
}

interface Order {
  id: string
  tableId: string
  displayId?: string | null
  table?: { name: string; capacity: number } | null
  guestCount: number
  subtotal: number
  taxTotal: number
  discountTotal: number
  grandTotal: number
  roundingAdjustment?: number
  status: string
  note?: string
  orderType?: string
  items: ApiOrderItem[]
  kots: KOT[]
}

function getItemDisplayName(item: ApiOrderItem): string {
  return item.item?.name ?? item.itemName ?? 'Unknown Item'
}

function getVariationDisplayName(item: ApiOrderItem): string | undefined {
  return item.variation?.name ?? item.variationName
}

export function CartPanel({ tableId }: { tableId: string | null }) {
  const [showSettlement, setShowSettlement] = useState(false)
  const [showPaymentChange, setShowPaymentChange] = useState(false)
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [noteValue, setNoteValue] = useState('')
  const {
    guestCount, setGuestCount, orderNote, setOrderNote,
    items: cartItems, removeItem: removeCartItem,
    updateItemQty: updateCartItemQty, updateItemNote: updateCartItemNote,
  } = useCartStore()
  const { user } = useAuthStore()
  const queryClient = useQueryClient()

  const { data: order, isLoading } = useQuery<Order | null>({
    queryKey: ['order', tableId],
    queryFn: async () => {
      if (!tableId || tableId === 'takeaway-new') return null
      const { data: active } = await apiClient.get(`/orders/${tableId}/active`).catch(() => ({ data: null }))
      if (active) {
        return { ...active, items: (active.items ?? []).filter((i: { status: string }) => i.status !== 'Cancelled') }
      }
      const { data } = await apiClient.get(`/orders/${tableId}`).catch(() => ({ data: null }))
      if (!data || data.status === 'Cancelled') return null
      return { ...data, items: (data.items ?? []).filter((i: { status: string }) => i.status !== 'Cancelled') }
    },
    enabled: !!tableId && tableId !== 'takeaway-new',
    retry: 1,
    staleTime: 0,
    refetchOnMount: true,
  })

  const { data: settings } = useQuery<{ taxType?: string; companyName?: string; address?: string; phone?: string; email?: string; website?: string; fssai?: string; gstin?: string; headerText?: string; footerText?: string; printLogoUrl?: string }>({
    queryKey: ['settings'],
    queryFn: async () => { const { data } = await apiClient.get('/settings'); return data },
    staleTime: 300_000,
  })

  const removeItemMut = useMutation({
    mutationFn: async (orderItemId: string) => { await apiClient.post('/cart/remove-item', { orderItemId }) },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', tableId] })
      queryClient.invalidateQueries({ queryKey: ['tables'] })
    },
    onError: (err: unknown) => { toast(`Failed to remove item`, 'error') },
  })

  const updateQtyMut = useMutation({
    mutationFn: async ({ orderItemId, quantity }: { orderItemId: string; quantity: number }) => {
      await apiClient.put('/cart/item-qty', { orderItemId, quantity })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', tableId] })
      queryClient.invalidateQueries({ queryKey: ['tables'] })
    },
  })

  const cancelItemMut = useMutation({
    mutationFn: async (orderItemId: string) => { await apiClient.post('/cart/remove-item', { orderItemId }) },
    onSuccess: (_data, orderItemId) => {
      let hasItemsLeft = true
      queryClient.setQueryData<Order | null>(['order', tableId], (old) => {
        if (!old) return old
        const newItems = old.items.filter((i) => i.id !== orderItemId)
        hasItemsLeft = newItems.some((i) => i.status !== 'Cancelled')
        const subtotal = newItems.reduce((sum, i) => sum + i.lineTotal, 0)
        return { ...old, items: newItems, subtotal, grandTotal: subtotal + (old.taxTotal ?? 0) - (old.discountTotal ?? 0) }
      })
      if (!hasItemsLeft) {
        queryClient.setQueryData(['order', tableId], null)
        queryClient.removeQueries({ queryKey: ['order', tableId] })
      }
      queryClient.invalidateQueries({ queryKey: ['tables'] })
      toast('Item cancelled from order', 'success')
    },
  })

  const updateNoteMut = useMutation({
    mutationFn: async ({ orderItemId, note }: { orderItemId: string; note: string }) => {
      await apiClient.put('/cart/item-note', { orderItemId, note })
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['order', tableId] }) },
  })

  const updateOrderNoteMut = useMutation({
    mutationFn: async (note: string) => { if (order) await apiClient.put('/cart/order-note', { orderId: order.id, note }) },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['order', tableId] }) },
  })

  const sendKOT = useMutation({
    mutationFn: async () => {
      const isTakeaway = tableId === 'takeaway-new'
      const { data } = await apiClient.post('/kot/send-with-items', {
        tableId: isTakeaway ? undefined : tableId,
        tableName: undefined,
        guestCount,
        orderType: isTakeaway ? 'Takeaway' : 'DineIn',
        sentBy: user?.name ?? 'User',
        note: orderNote || undefined,
        items: cartItems.map((i) => ({
          itemId: i.itemId,
          itemName: i.itemName,
          variationId: i.variationId,
          variationName: i.variationName,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          note: i.note,
        })),
      })
      return data as { orderId: string; kotNumber: number }
    },
    onSuccess: (result) => {
      const savedItems = [...cartItems]
      toast('KOT sent successfully', 'success')
      useCartStore.getState().clearCart()
      queryClient.invalidateQueries({ queryKey: ['order', tableId] })
      queryClient.invalidateQueries({ queryKey: ['tables'] })
      queryClient.invalidateQueries({ queryKey: ['takeaway-orders'] })
      const tables = queryClient.getQueryData<Array<{ id: string; name: string }>>(['tables'])
      const tableName = tables?.find((t) => t.id === tableId)?.name ?? (tableId === 'takeaway-new' ? 'Takeaway' : 'Table')
      printerApi.printKOT({
        printType: 'kot',
        orderId: result.orderId,
        tableName,
        guestCount,
        serverName: user?.name,
        kotNumber: result.kotNumber,
        items: savedItems.map((i) => ({
          name: i.variationName ? `${i.itemName} (${i.variationName})` : i.itemName,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          lineTotal: i.unitPrice * i.quantity,
          note: i.note,
        })),
        date: formatPrintDate(),
        orderType: tableId === 'takeaway-new' ? 'Takeaway' : 'Dine In',
      }).catch(() => {})
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
        ?? (err as Error)?.message
        ?? 'Failed to send KOT'
      toast(msg, 'error')
    },
  })

  const generateBill = useMutation({
    mutationFn: async () => { if (order) await apiClient.put(`/orders/${order.id}`, { status: 'Bill_Printed' }) },
    onSuccess: () => {
      toast('Bill generated', 'success')
      queryClient.invalidateQueries({ queryKey: ['order', tableId] })
      queryClient.invalidateQueries({ queryKey: ['takeaway-orders'] })
      const currentOrder = queryClient.getQueryData<Order | null>(['order', tableId]) ?? order
      if (!currentOrder) return
      apiClient.get('/settings').then(({ data: s }) => {
        const billItems = currentOrder.items.filter((i) => i.status !== 'Cancelled')
        const mergedBill = mergeApiItems(billItems)
        printerApi.printBill({
          printType: 'bill',
          orderId: currentOrder.id,
          tableName: (currentOrder as any).tableName ?? currentOrder.table?.name ?? 'Table',
          restaurantName: s?.companyName, restaurantAddress: s?.address,
          phone: s?.phone, email: s?.email, website: s?.website,
          fssai: s?.fssai, gstin: s?.gstin,
          headerText: s?.headerText, footerText: s?.footerText,
          orderNumber: currentOrder.id.slice(0, 8).toUpperCase(),
          guestCount, serverName: user?.name,
          items: mergedBill.map((m) => ({ name: m.name, quantity: m.quantity, unitPrice: m.unitPrice, lineTotal: m.lineTotal, note: m.note })),
          subtotal: currentOrder.subtotal, taxTotal: currentOrder.taxTotal,
          discountTotal: currentOrder.discountTotal, grandTotal: currentOrder.grandTotal,
          roundingAdjustment: currentOrder.roundingAdjustment ?? 0,
          taxName: 'GST', date: formatPrintDate(),
          orderType: currentOrder.orderType === 'Takeaway' ? 'Takeaway' : 'Dine In',
          logoUrl: resolveImageUrl(s?.printLogoUrl) ?? undefined,
        }).catch(() => {})
      }).catch(() => {})
    },
    onError: (err: AxiosError<{ error?: { message?: string } }>) => { toast('Failed to generate bill', 'error') },
  })

  const updateGuestCount = useMutation({
    mutationFn: async (count: number) => { if (order) await apiClient.put('/cart/guest-count', { orderId: order.id, guestCount: count }) },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['order', tableId] }) },
  })

  const reprintBillMut = useMutation({
    mutationFn: async () => {
      const { data: s } = await apiClient.get('/settings')
      const orderData = order!
      const billItems = orderData.items.filter((i) => i.status !== 'Cancelled')
      const mergedBill = mergeApiItems(billItems)
      await printerApi.reprintBill({
        printType: 'reprint-bill', orderId: orderData.id,
        tableName: (orderData as any).tableName ?? orderData.table?.name ?? 'Table',
        restaurantName: s?.companyName, restaurantAddress: s?.address,
        phone: s?.phone, email: s?.email, website: s?.website,
        fssai: s?.fssai, gstin: s?.gstin,
        headerText: s?.headerText, footerText: s?.footerText,
        orderNumber: orderData.id.slice(0, 8).toUpperCase(),
        guestCount, serverName: user?.name,
        items: mergedBill.map((m) => ({ name: m.name, quantity: m.quantity, unitPrice: m.unitPrice, lineTotal: m.lineTotal, note: m.note })),
        subtotal: orderData.subtotal, taxTotal: orderData.taxTotal,
        discountTotal: orderData.discountTotal, grandTotal: orderData.grandTotal,
        roundingAdjustment: orderData.roundingAdjustment ?? 0,
        taxName: 'GST', date: formatPrintDate(),
        orderType: orderData.orderType === 'Takeaway' ? 'Takeaway' : 'Dine In',
        logoUrl: resolveImageUrl(s?.printLogoUrl) ?? undefined,
      }).catch(() => {})
    },
    onSuccess: () => toast('Bill reprinted', 'success'),
    onError: () => toast('Failed to reprint bill', 'error'),
  })

  const reopenBillMut = useMutation({
    mutationFn: async () => { if (order) await apiClient.put(`/orders/${order.id}`, { status: 'KOT_Sent' }) },
    onSuccess: () => {
      toast('Bill re-opened for modification', 'success')
      queryClient.invalidateQueries({ queryKey: ['order', tableId] })
      queryClient.invalidateQueries({ queryKey: ['tables'] })
      queryClient.invalidateQueries({ queryKey: ['takeaway-orders'] })
    },
  })

  const saveNote = (orderItemId: string) => {
    updateNoteMut.mutate({ orderItemId, note: noteValue })
    setEditingNote(null)
    setNoteValue('')
  }

  const mergeApiItems = (items: ApiOrderItem[]) => {
    const map = new Map<string, { itemId: string; name: string; quantity: number; unitPrice: number; lineTotal: number; ids: string[]; note?: string }>()
    for (const i of items) {
      const key = `${i.itemId}-${i.variationId ?? 'none'}`
      const existing = map.get(key)
      const itemName = getItemDisplayName(i)
      const variationName = getVariationDisplayName(i)
      const displayName = variationName ? `${itemName} (${variationName})` : itemName
      if (existing) {
        existing.quantity += i.quantity; existing.lineTotal += i.lineTotal; existing.ids.push(i.id)
        if (i.note && !existing.note) existing.note = i.note
      } else {
        map.set(key, { itemId: i.itemId, name: displayName, quantity: i.quantity, unitPrice: i.unitPrice, lineTotal: i.lineTotal, ids: [i.id], note: i.note })
      }
    }
    return Array.from(map.values())
  }

  const hasActiveOrder = !!order && order.items.length > 0
  const newItems = order?.items.filter((i) => i.status === 'New') ?? []
  const sentItems = order?.items.filter((i) => i.status === 'Sent' || i.status === 'Ready') ?? []
  const cancelled = order?.items.filter((i) => i.status === 'Cancelled' && i.kotId) ?? []

  const serverSubtotal = sentItems.reduce((sum, i) => sum + i.lineTotal, 0)
  const allSubtotal = serverSubtotal + cartItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)
  const totalSubtotal = order ? order.subtotal + cartItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0) : cartItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)
  const hasCartItems = cartItems.length > 0

  const kotsWithItems: { kot: KOT; items: ApiOrderItem[] }[] = []
  if (order?.kots?.length) {
    for (const kot of order.kots) {
      const kotItems = sentItems.filter((i) => i.kotId === kot.id)
      if (kotItems.length > 0) kotsWithItems.push({ kot, items: kotItems })
    }
  }

  if (!tableId) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
        Select a table to view cart
      </div>
    )
  }

  if (isLoading && tableId !== 'takeaway-new') {
    return <div className="p-4 text-sm text-muted-foreground">Loading...</div>
  }

  return (
    <div className="flex h-full flex-col border-l bg-card">
      <div className="border-b p-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold">
            {order?.table?.name ?? order?.displayId ?? (tableId === 'takeaway-new' ? 'Takeaway' : 'Order')}
          </h3>
          <div className="flex items-center gap-2 text-sm">
            <Users size={14} />
            <input
              type="number" min={1} max={99}
              value={guestCount}
              onChange={(e) => { const val = Number(e.target.value); setGuestCount(val); if (order) updateGuestCount.mutate(val) }}
              className="w-12 rounded border px-1 py-0.5 text-center text-sm"
              disabled={order?.status === 'Settled'}
            />
          </div>
        </div>
        {order?.note && <p className="mt-1 text-xs text-muted-foreground">{order.note}</p>}
      </div>

      <div className="flex-1 overflow-auto p-3">
        {/* Pre-KOT: show cart items from local Zustand store */}
        {!hasActiveOrder && hasCartItems && (
          <div className="mb-4">
            <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Cart Items</p>
            {cartItems.map((item) => (
              <div key={item.id} className="group mb-1 rounded py-1 text-sm hover:bg-muted/50">
                <div className="flex items-center gap-2">
                  <button onClick={() => removeCartItem(item.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 size={14} />
                  </button>
                  <span className="flex-1">
                    {item.itemName}
                    {item.variationName && <span className="text-xs text-muted-foreground"> — {item.variationName}</span>}
                  </span>
                  <div className="flex items-center gap-0.5">
                    <button onClick={() => item.quantity <= 1 ? removeCartItem(item.id) : updateCartItemQty(item.id, item.quantity - 1)} className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground">
                      <Minus size={12} />
                    </button>
                    <span className="w-5 text-center text-xs font-medium">×{item.quantity}</span>
                    <button onClick={() => updateCartItemQty(item.id, item.quantity + 1)} className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground">
                      <Plus size={12} />
                    </button>
                  </div>
                  <span className="text-xs font-medium">₹{(item.unitPrice * item.quantity).toLocaleString()}</span>
                  <button onClick={() => { setEditingNote(editingNote === item.id ? null : item.id); setNoteValue(item.note ?? '') }} className="text-muted-foreground hover:text-foreground" title="Add note">
                    <FilePen size={12} />
                  </button>
                </div>
                {editingNote === item.id && (
                  <div className="ml-6 mt-1 flex gap-1">
                    <input value={noteValue} onChange={(e) => setNoteValue(e.target.value)} placeholder="Item note" className="flex-1 rounded border px-1 py-0.5 text-xs" autoFocus onKeyDown={(e) => { if (e.key === 'Enter') { updateCartItemNote(item.id, noteValue); setEditingNote(null); setNoteValue('') } }} />
                    <button onClick={() => { updateCartItemNote(item.id, noteValue); setEditingNote(null); setNoteValue('') }} className="rounded bg-primary px-2 py-0.5 text-xs text-primary-foreground">Ok</button>
                  </div>
                )}
                {item.note && editingNote !== item.id && <p className="ml-6 text-xs text-muted-foreground">{item.note}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Post-order: show New items and KOT items */}
        {newItems.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">New Items</p>
            {newItems.map((item) => (
              <div key={item.id} className="group mb-1 rounded py-1 text-sm hover:bg-muted/50">
                <div className="flex items-center gap-2">
                  <button onClick={() => removeItemMut.mutate(item.id)} className="text-muted-foreground hover:text-destructive" disabled={order?.status === 'Settled'}>
                    <Trash2 size={14} />
                  </button>
                  <span className="flex-1">
                    {getItemDisplayName(item)}
                    {getVariationDisplayName(item) && <span className="text-xs text-muted-foreground"> — {getVariationDisplayName(item)}</span>}
                  </span>
                  <div className="flex items-center gap-0.5">
                    <button onClick={() => item.quantity <= 1 ? removeItemMut.mutate(item.id) : updateQtyMut.mutate({ orderItemId: item.id, quantity: item.quantity - 1 })} className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground" disabled={order?.status === 'Settled'}>
                      <Minus size={12} />
                    </button>
                    <span className="w-5 text-center text-xs font-medium">×{item.quantity}</span>
                    <button onClick={() => updateQtyMut.mutate({ orderItemId: item.id, quantity: item.quantity + 1 })} className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground" disabled={order?.status === 'Settled'}>
                      <Plus size={12} />
                    </button>
                  </div>
                  <span className="text-xs font-medium">₹{item.lineTotal.toLocaleString()}</span>
                  <button onClick={() => { setEditingNote(editingNote === item.id ? null : item.id); setNoteValue(item.note ?? '') }} className="text-muted-foreground hover:text-foreground" title="Add note">
                    <FilePen size={12} />
                  </button>
                </div>
                {editingNote === item.id && (
                  <div className="ml-6 mt-1 flex gap-1">
                    <input value={noteValue} onChange={(e) => setNoteValue(e.target.value)} placeholder="Item note" className="flex-1 rounded border px-1 py-0.5 text-xs" autoFocus onKeyDown={(e) => { if (e.key === 'Enter') saveNote(item.id) }} />
                    <button onClick={() => saveNote(item.id)} className="rounded bg-primary px-2 py-0.5 text-xs text-primary-foreground">Ok</button>
                  </div>
                )}
                {item.note && editingNote !== item.id && <p className="ml-6 text-xs text-muted-foreground">{item.note}</p>}
              </div>
            ))}
          </div>
        )}

        {kotsWithItems.map(({ kot, items }) => {
          const merged = mergeApiItems(items)
          return (
            <div key={kot.id} className="mb-3">
              <p className="mb-1 border-b pb-1 text-xs font-semibold text-muted-foreground">
                KOT #{kot.kotNumber} — {new Date(kot.sentAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </p>
              {merged.map((m) => (
                <div key={m.ids[0]} className="group flex items-center gap-1.5 rounded py-0.5 text-sm hover:bg-muted/50">
                  {order?.status !== 'Settled' && (
                    <button onClick={() => m.ids.forEach((id) => cancelItemMut.mutate(id))} className="text-muted-foreground hover:text-red-500 shrink-0" title="Cancel item">
                      <Ban size={14} />
                    </button>
                  )}
                  <span className="flex-1 text-sm font-medium">{m.name}</span>
                  <span className="text-xs text-muted-foreground shrink-0">×{m.quantity}</span>
                  <span className="text-xs font-medium shrink-0">₹{m.lineTotal.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )
        })}

        {cancelled.length > 0 && (
          <div className="mb-4">
            <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">Cancelled</p>
            {cancelled.map((item) => (
              <div key={item.id} className="flex items-center gap-2 rounded py-1 text-sm line-through opacity-60">
                <span className="flex-1">{getItemDisplayName(item)} ×{item.quantity}</span>
                <span className="text-xs">₹{item.lineTotal.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}

        {!hasActiveOrder && !hasCartItems && (
          <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
            Tap items from the menu to add to cart
          </div>
        )}
      </div>

      <div className="border-t p-3">
        {hasCartItems && (
          <div className="mb-3">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span className="font-medium">₹{allSubtotal.toLocaleString()}</span>
            </div>
          </div>
        )}

        {hasActiveOrder && (
          <div className="mb-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium">₹{order!.subtotal.toLocaleString()}</span>
            </div>
            {(order!.taxTotal ?? 0) > 0 && (
              <div className="flex justify-between text-muted-foreground">
                <span>Tax</span>
                <span>₹{order!.taxTotal.toLocaleString()}</span>
              </div>
            )}
            {(order!.discountTotal ?? 0) > 0 && (
              <div className="flex justify-between text-muted-foreground">
                <span>Discount</span>
                <span>-₹{order!.discountTotal.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between font-bold">
              <span>Grand Total</span>
              <span>₹{order!.grandTotal.toLocaleString()}</span>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {hasCartItems && (
            <button
              disabled={sendKOT.isPending || cartItems.length === 0}
              onClick={() => sendKOT.mutate()}
              className="flex-1 rounded-lg bg-yellow-500 py-2 text-sm font-bold text-black hover:bg-yellow-400 disabled:opacity-50"
            >
              {sendKOT.isPending ? 'Sending KOT...' : 'Send KOT'}
            </button>
          )}

          {order && !order?.status?.includes('Settled') && (
            <>
              {order.status !== 'Bill_Printed' && !hasCartItems && (
                <button disabled={generateBill.isPending} onClick={() => generateBill.mutate()} className="flex-1 rounded-lg bg-blue-500 py-2 text-sm font-bold text-white hover:bg-blue-400 disabled:opacity-50">
                  {generateBill.isPending ? 'Generating...' : 'Generate Bill'}
                </button>
              )}
              {order.status !== 'Bill_Printed' && hasCartItems && (
                <button disabled={generateBill.isPending} onClick={() => generateBill.mutate()} className="flex-1 rounded-lg bg-blue-500 py-2 text-sm font-bold text-white hover:bg-blue-400 disabled:opacity-50">
                  {generateBill.isPending ? 'Generating...' : 'Generate Bill'}
                </button>
              )}
            </>
          )}
        </div>

        {order?.status === 'Bill_Printed' && (
          <div className="space-y-2 mt-2">
            <button onClick={() => setShowSettlement(true)} className="w-full rounded-lg bg-green-500 py-2 text-sm font-bold text-white hover:bg-green-400">
              Settle
            </button>
            <div className="flex gap-2">
              <button onClick={() => reopenBillMut.mutate()} className="flex-1 rounded-lg bg-amber-500 py-2 text-sm font-bold text-black hover:bg-amber-400">
                Re-open for Modification
              </button>
              <button onClick={() => reprintBillMut.mutate()} className="flex-1 rounded-lg border py-2 text-sm font-medium flex items-center justify-center gap-1 hover:bg-muted">
                <Printer size={14} /> Reprint Bill
              </button>
            </div>
          </div>
        )}

        {order?.status === 'Settled' && (
          <div className="space-y-2">
            <button onClick={() => reprintBillMut.mutate()} className="w-full rounded-lg border py-2 text-sm font-medium flex items-center justify-center gap-1 hover:bg-muted">
              <Printer size={14} /> Reprint Bill
            </button>
            <button onClick={() => setShowPaymentChange(true)} className="w-full rounded-lg border py-2 text-sm font-medium flex items-center justify-center gap-1 hover:bg-muted">
              Change Payment Method
            </button>
          </div>
        )}
      </div>

      {showSettlement && (
        <SettlementModal
          order={{
            id: order!.id,
            subtotal: order!.subtotal,
            grandTotal: order!.grandTotal,
            taxTotal: order!.taxTotal,
            discountTotal: order!.discountTotal,
          }}
          taxType={(settings?.taxType as 'Inclusive' | 'Exclusive') ?? 'Exclusive'}
          tableName={order?.table?.name ?? 'Table'}
          onClose={() => setShowSettlement(false)}
          onSettled={() => {
            setShowSettlement(false)
            if (tableId) queryClient.setQueryData(['order', tableId], null)
            queryClient.invalidateQueries({ queryKey: ['tables'] })
            queryClient.invalidateQueries({ queryKey: ['takeaway-orders'] })
          }}
        />
      )}
      {showPaymentChange && (
        <PaymentChangeModal
          orderId={order!.id}
          grandTotal={order!.grandTotal}
          onClose={() => setShowPaymentChange(false)}
          onUpdated={() => {
            setShowPaymentChange(false)
            queryClient.invalidateQueries({ queryKey: ['order', tableId] })
            toast('Payment method updated', 'success')
          }}
        />
      )}
    </div>
  )
}