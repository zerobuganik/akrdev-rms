import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/apiClient'
import type { AxiosError } from 'axios'
import { Minus, Plus, Trash2, Users, FilePen, Ban, Printer, RefreshCw } from 'lucide-react'
import { useCartStore } from '@/stores/useCartStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { toast } from '@/stores/useToastStore'
import { printerApi } from '@/lib/printerApi'
import { formatPrintDate, formatPrintTime } from '@/lib/utils'
import { getImageBaseUrl } from '@/lib/imageBaseUrl'
import { SettlementModal } from '@/components/settlement/SettlementModal'
import { PaymentChangeModal } from '@/components/settlement/PaymentChangeModal'

interface OrderItem {
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
  item: { id: string; name: string }
  variation?: { id: string; name: string }
}

interface KOT {
  id: string
  kotNumber: number
  sentAt: string
  sentBy: string
  sentByUser?: { name: string }
}

interface OrderDiscount {
  id: string
  type: string
  value: number
  reason?: string
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
  items: OrderItem[]
  kots: KOT[]
  discounts: OrderDiscount[]
}

interface CartPanelProps {
  tableId: string | null
}

export function CartPanel({ tableId }: CartPanelProps) {
  const [showSettlement, setShowSettlement] = useState(false)
  const [showPaymentChange, setShowPaymentChange] = useState(false)
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [noteValue, setNoteValue] = useState('')
  const { guestCount, setGuestCount, orderNote, setOrderNote } = useCartStore()
  const { user } = useAuthStore()
  const queryClient = useQueryClient()

  const { data: order, isLoading } = useQuery<Order>({
    queryKey: ['order', tableId],
    queryFn: async () => {
      // Try active-by-table first (for dine-in tables)
      const { data: active } = await apiClient.get(`/orders/${tableId}/active`).catch(() => ({ data: null }))
      if (active) return active
      // Fallback: direct order lookup (for takeaway orders where tableId is null)
      const { data } = await apiClient.get(`/orders/${tableId}`)
      return data
    },
    enabled: !!tableId,
    retry: 1,
  })

  const { data: settings } = useQuery<{ taxType?: string }>({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data } = await apiClient.get('/settings')
      return data
    },
    staleTime: 300_000,
  })

  const { data: taxSlabs = [] } = useQuery<{ percent: number; isDefault: boolean }[]>({
    queryKey: ['taxSlabs'],
    queryFn: async () => {
      const { data } = await apiClient.get('/tax-slabs')
      return data ?? []
    },
  })
  const defaultTaxPercent = taxSlabs.find((t) => t.isDefault)?.percent ?? taxSlabs[0]?.percent ?? 5

  const removeItemMut = useMutation({
    mutationFn: async (orderItemId: string) => {
      await apiClient.post('/cart/remove-item', { orderItemId })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', tableId] })
      queryClient.invalidateQueries({ queryKey: ['tables'] })
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message
        ?? (err as Error)?.message
        ?? 'Failed to remove item'
      toast(msg, 'error')
    },
  })

  const updateQtyMut = useMutation({
    mutationFn: async ({ orderItemId, quantity }: { orderItemId: string; quantity: number }) => {
      await apiClient.put('/cart/item-qty', { orderItemId, quantity })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', tableId] })
      queryClient.invalidateQueries({ queryKey: ['tables'] })
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message
        ?? (err as Error)?.message
        ?? 'Failed to update quantity'
      toast(msg, 'error')
    },
  })

  const cancelItemMut = useMutation({
    mutationFn: async (orderItemId: string) => {
      await apiClient.post('/cart/remove-item', { orderItemId })
    },
    onSuccess: (_data, orderItemId) => {
      // Optimistically remove item from cached order so UI updates instantly
      let hasItemsLeft = true
      queryClient.setQueryData<Order>(['order', tableId], (old) => {
        if (!old) return old
        const newItems = old.items.filter((i) => i.id !== orderItemId)
        hasItemsLeft = newItems.some((i) => i.status !== 'Cancelled')
        // Recalculate subtotal optimistically
        const subtotal = newItems.reduce((sum, i) => sum + i.lineTotal, 0)
        return { ...old, items: newItems, subtotal, grandTotal: subtotal }
      })
      // If no items remain, purge the order cache so table click shows fresh empty cart
      if (!hasItemsLeft) {
        queryClient.removeQueries({ queryKey: ['order', tableId] })
      }
      queryClient.invalidateQueries({ queryKey: ['tables'] })
      toast('Item cancelled from order', 'success')
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message
        ?? (err as Error)?.message
        ?? 'Failed to cancel item'
      toast(msg, 'error')
    },
  })

  const updateNoteMut = useMutation({
    mutationFn: async ({ orderItemId, note }: { orderItemId: string; note: string }) => {
      await apiClient.put('/cart/item-note', { orderItemId, note })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', tableId] })
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message
        ?? (err as Error)?.message
        ?? 'Failed to update note'
      toast(msg, 'error')
    },
  })

  const updateOrderNoteMut = useMutation({
    mutationFn: async (note: string) => {
      await apiClient.put('/cart/order-note', { orderId: order!.id, note })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', tableId] })
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message
        ?? (err as Error)?.message
        ?? 'Failed to update order note'
      toast(msg, 'error')
    },
  })

  const sendKOT = useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post('/kot/send', { orderId: order!.id, sentBy: user?.name ?? 'User' })
      return data as { kotId: string; kotNumber: number; itemsSent: number }
    },
    onSuccess: (result: { kotId: string; kotNumber: number; itemsSent: number }) => {
      toast('KOT sent successfully', 'success')
      // Optimistically move New items to Sent for instant UI feedback
      queryClient.setQueryData(['order', tableId], (old: Order | undefined) => {
        if (!old) return old
        const sentItemIds = old.items.filter(i => i.status === 'New').map(i => i.id)
        return {
          ...old,
          status: 'KOT_Sent',
          items: old.items.map(i =>
            sentItemIds.includes(i.id)
              ? { ...i, status: 'Sent', kotId: result.kotId }
              : i,
          ),
          kots: [...old.kots, {
            id: result.kotId,
            kotNumber: result.kotNumber,
            sentAt: new Date().toISOString(),
            sentBy: '',
            sentByUser: { name: user?.name ?? 'User' },
          }],
        }
      })
      queryClient.invalidateQueries({ queryKey: ['order', tableId] })
      queryClient.invalidateQueries({ queryKey: ['tables'] })
      queryClient.invalidateQueries({ queryKey: ['takeaway-orders'] })

      if (!order) return
      const newItems = order.items.filter((i) => i.status === 'New')
      const mergedNew = mergedItems(newItems)
      printerApi.printKOT({
        printType: 'kot',
        orderId: order.id,
        tableName: order.table?.name ?? 'Takeaway',
        guestCount: guestCount,
        serverName: user?.name,
        kotNumber: result.kotNumber,
        items: mergedNew.map((m) => ({
          name: m.name,
          quantity: m.quantity,
          unitPrice: m.unitPrice,
          lineTotal: m.lineTotal,
          note: m.note,
        })),
        date: formatPrintDate(),
          orderType: order.orderType === 'Takeaway' ? 'Takeaway' : 'Dine In',
      }).catch(() => {})
    },
    onError: () => {
      toast('Failed to send KOT', 'error')
    },
  })

  const generateBill = useMutation({
    mutationFn: async () => {
      await apiClient.put(`/orders/${order!.id}`, { status: 'Bill_Printed' })
    },
    onSuccess: () => {
      toast('Bill generated', 'success')
      queryClient.invalidateQueries({ queryKey: ['order', tableId] })
      queryClient.invalidateQueries({ queryKey: ['takeaway-orders'] })

      if (!order) return
      apiClient.get('/settings').then(({ data: settings }) => {
        const sentItems = order.items.filter((i) => i.status === 'Sent' || i.status === 'Ready')
        const mergedSent = mergedItems(sentItems)
        printerApi.printBill({
          printType: 'bill',
          orderId: order.id,
          tableName: order.table?.name ?? 'Takeaway',
          restaurantName: settings?.companyName,
          restaurantAddress: settings?.address,
          phone: settings?.phone ?? undefined,
          email: settings?.email ?? undefined,
          website: settings?.website ?? undefined,
          fssai: settings?.fssai ?? undefined,
          gstin: settings?.gstin ?? undefined,
          headerText: settings?.headerText,
          footerText: settings?.footerText,
          orderNumber: order.id.slice(0, 8).toUpperCase(),
          guestCount: guestCount,
          serverName: user?.name,
          items: mergedSent.map((m) => ({
            name: m.name,
            quantity: m.quantity,
            unitPrice: m.unitPrice,
            lineTotal: m.lineTotal,
            note: m.note,
          })),
          subtotal: order.subtotal,
          taxTotal: order.taxTotal,
          discountTotal: order.discountTotal,
          grandTotal: order.grandTotal,
          roundingAdjustment: order.roundingAdjustment ?? 0,
          taxName: 'GST',
          date: formatPrintDate(),
          orderType: order.orderType === 'Takeaway' ? 'Takeaway' : 'Dine In',
          logoUrl: settings?.printLogoUrl ? `${getImageBaseUrl()}${settings.printLogoUrl}` : undefined,
        }).catch(() => {})
      }).catch(() => {})
    },
    onError: (err: AxiosError<{ error?: { message?: string } }>) => {
      const msg = err.response?.data?.error?.message ?? err.message
      toast(`Failed to generate bill${msg ? `: ${msg}` : ''}`, 'error')
    },
  })

  const updateGuestCount = useMutation({
    mutationFn: async (count: number) => {
      await apiClient.put('/cart/guest-count', { orderId: order!.id, guestCount: count })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', tableId] })
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message
        ?? (err as Error)?.message
        ?? 'Failed to update guest count'
      toast(msg, 'error')
    },
  })

  const reprintBillMut = useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.get(`/settings`)
      const orderData = order!
      const sentItems = orderData.items.filter((i) => i.status === 'Sent' || i.status === 'Ready')
      const mergedSent = mergedItems(sentItems)
      await printerApi.reprintBill({
        printType: 'reprint-bill',
        orderId: orderData.id,
        tableName: orderData.table?.name ?? 'Takeaway',
        restaurantName: data?.companyName,
        restaurantAddress: data?.address,
        phone: data?.phone ?? undefined,
        email: data?.email ?? undefined,
        website: data?.website ?? undefined,
        fssai: data?.fssai ?? undefined,
        gstin: data?.gstin ?? undefined,
        headerText: data?.headerText,
        footerText: data?.footerText,
        orderNumber: orderData.id.slice(0, 8).toUpperCase(),
        guestCount: guestCount,
        serverName: user?.name,
        items: mergedSent.map((m) => ({
          name: m.name,
          quantity: m.quantity,
          unitPrice: m.unitPrice,
          lineTotal: m.lineTotal,
          note: m.note,
        })),
        subtotal: orderData.subtotal,
        taxTotal: orderData.taxTotal,
        discountTotal: orderData.discountTotal,
        grandTotal: orderData.grandTotal,
        roundingAdjustment: orderData.roundingAdjustment ?? 0,
        taxName: 'GST',
        date: formatPrintDate(),
        orderType: orderData.orderType === 'Takeaway' ? 'Takeaway' : 'Dine In',
        logoUrl: data?.printLogoUrl ? `${getImageBaseUrl()}${data.printLogoUrl}` : undefined,
      }).catch(() => {})
    },
    onSuccess: () => {
      toast('Bill reprinted', 'success')
    },
    onError: () => {
      toast('Failed to reprint bill', 'error')
    },
  })

  const reopenBillMut = useMutation({
    mutationFn: async () => {
      await apiClient.put(`/orders/${order!.id}`, { status: 'KOT_Sent' })
    },
    onSuccess: () => {
      toast('Bill re-opened for modification', 'success')
      queryClient.invalidateQueries({ queryKey: ['order', tableId] })
      queryClient.invalidateQueries({ queryKey: ['tables'] })
      queryClient.invalidateQueries({ queryKey: ['takeaway-orders'] })
    },
    onError: (err: AxiosError<{ error?: { message?: string } }>) => {
      const msg = err.response?.data?.error?.message ?? err.message
      toast(`Failed to re-open bill${msg ? `: ${msg}` : ''}`, 'error')
    },
  })

  const saveNote = (orderItemId: string) => {
    updateNoteMut.mutate({ orderItemId, note: noteValue })
    setEditingNote(null)
    setNoteValue('')
  }

  if (!tableId) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
        Select a table to view cart
      </div>
    )
  }

  if (isLoading) {
    return <div className="p-4 text-sm text-muted-foreground">Loading...</div>
  }

  if (!order) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
        No active order for this table
      </div>
    )
  }

  const newItems = order.items.filter((i) => i.status === 'New')
  const sentItems = order.items.filter((i) => i.status === 'Sent' || i.status === 'Ready')
  const cancelled = order.items.filter((i) => i.status === 'Cancelled' && i.kotId)

  const mergedItems = (items: OrderItem[]): { itemId: string; variationId?: string; name: string; quantity: number; unitPrice: number; lineTotal: number; ids: string[]; note?: string }[] => {
    const map = new Map<string, { itemId: string; variationId?: string; name: string; quantity: number; unitPrice: number; lineTotal: number; ids: string[]; note?: string }>()
    for (const i of items) {
      const key = `${i.itemId}-${i.variationId ?? 'none'}`
      const existing = map.get(key)
      if (existing) {
        existing.quantity += i.quantity
        existing.lineTotal += i.lineTotal
        existing.ids.push(i.id)
        if (i.note && !existing.note) existing.note = i.note
      } else {
        map.set(key, {
          itemId: i.itemId,
          variationId: i.variationId,
          name: i.variation ? `${i.item.name} (${i.variation.name})` : i.item.name,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          lineTotal: i.lineTotal,
          ids: [i.id],
          note: i.note,
        })
      }
    }
    return Array.from(map.values())
  }

  const kotsWithItems: { kot: KOT; items: OrderItem[] }[] = []
  if (order.kots.length > 0) {
    for (const kot of order.kots) {
      const kotItems = sentItems.filter((i) => i.kotId === kot.id)
      if (kotItems.length > 0) {
        kotsWithItems.push({ kot, items: kotItems })
      }
    }
  }
  const canPrintBill = order.status !== 'Bill_Printed' && order.status !== 'Settled'
  const canSettle = order.status === 'Bill_Printed'
  const isSettled = order.status === 'Settled'
  const isLocked = order.status === 'Settled'

  return (
    <div className="flex h-full flex-col border-l bg-card">
      <div className="border-b p-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold">{order.table?.name ?? order.displayId ?? 'Order'}</h3>
          <div className="flex items-center gap-2 text-sm">
            <Users size={14} />
            <input
              type="number"
              min={1}
              max={99}
              value={guestCount}
              onChange={(e) => {
                const val = Number(e.target.value)
                setGuestCount(val)
                updateGuestCount.mutate(val)
              }}
              className="w-12 rounded border px-1 py-0.5 text-center text-sm"
              disabled={isLocked}
            />
          </div>
        </div>
        <div className="mt-1 flex items-center gap-1" />

      </div>

      <div className="flex-1 overflow-auto p-3">
        {newItems.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">New Items</p>
            {newItems.map((item) => (
              <div key={item.id} className="group mb-1 rounded py-1 text-sm hover:bg-muted/50">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => removeItemMut.mutate(item.id)}
                    className="text-muted-foreground hover:text-destructive"
                    disabled={isLocked}
                  >
                    <Trash2 size={14} />
                  </button>
                  <span className="flex-1">
                    {item.item.name}
                    {item.variation && <span className="text-xs text-muted-foreground"> — {item.variation.name}</span>}
                  </span>
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => {
                        if (item.quantity <= 1) removeItemMut.mutate(item.id)
                        else updateQtyMut.mutate({ orderItemId: item.id, quantity: item.quantity - 1 })
                      }}
                      className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                      disabled={isLocked}
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-5 text-center text-xs font-medium">×{item.quantity}</span>
                    <button
                      onClick={() => updateQtyMut.mutate({ orderItemId: item.id, quantity: item.quantity + 1 })}
                      className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                      disabled={isLocked}
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <span className="text-xs font-medium">₹{item.lineTotal.toLocaleString()}</span>
                  <button
                    onClick={() => { setEditingNote(editingNote === item.id ? null : item.id); setNoteValue(item.note ?? '') }}
                    className="text-muted-foreground hover:text-foreground"
                    title="Add note"
                  >
                    <FilePen size={12} />
                  </button>
                </div>
                {editingNote === item.id && (
                  <div className="ml-6 mt-1 flex gap-1">
                    <input
                      value={noteValue}
                      onChange={(e) => setNoteValue(e.target.value)}
                      placeholder="Item note (e.g. Less spicy)"
                      className="flex-1 rounded border px-1 py-0.5 text-xs"
                      autoFocus
                      onKeyDown={(e) => { if (e.key === 'Enter') saveNote(item.id) }}
                    />
                    <button onClick={() => saveNote(item.id)} className="rounded bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                      Ok
                    </button>
                  </div>
                )}
                {item.note && editingNote !== item.id && (
                  <p className="ml-6 text-xs text-muted-foreground">{item.note}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {kotsWithItems.map(({ kot, items }) => {
          const merged = mergedItems(items)
          return (
          <div key={kot.id} className="mb-4">
            <p className="mb-1 border-b pb-1 text-xs font-semibold text-muted-foreground">
              KOT #{kot.kotNumber} — {new Date(kot.sentAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              {kot.sentByUser && <span className="font-normal"> by {kot.sentByUser.name}</span>}
            </p>
            {merged.map((m) => (
              <div key={m.ids[0]} className="group flex items-center gap-2 rounded py-1 text-sm hover:bg-muted/50">
                {!isLocked && (
                  <button
                    onClick={() => {
                      m.ids.forEach((id) => cancelItemMut.mutate(id))
                    }}
                    className="text-muted-foreground hover:text-red-500"
                    title="Cancel item"
                  >
                    <Ban size={14} />
                  </button>
                )}
                <span className="flex-1">
                  {m.name}
                </span>
                <span className="text-xs text-muted-foreground">×{m.quantity}</span>
                <span className="text-xs">₹{m.lineTotal.toLocaleString()}</span>
              </div>
            ))}
          </div>
          )
        })}

        {cancelled.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 text-xs font-semibold uppercase text-red-500">Cancelled</p>
            {(() => {
              const grouped = new Map<string, { kotNumber?: number; items: OrderItem[] }>()
              for (const item of cancelled) {
                const kotId = item.kotId ?? '__ungrouped__'
                if (!grouped.has(kotId)) {
                  const kot = order.kots.find((k) => k.id === item.kotId)
                  grouped.set(kotId, { kotNumber: kot?.kotNumber, items: [] })
                }
                grouped.get(kotId)!.items.push(item)
              }
              return Array.from(grouped.entries()).map(([kotId, group]) => (
                <div key={kotId} className="mb-2">
                  {group.kotNumber && (
                    <p className="text-[10px] text-muted-foreground pl-1">
                      KOT #{group.kotNumber}
                    </p>
                  )}
                  {group.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 rounded py-1 text-sm line-through opacity-50">
                      <span className="flex-1">{item.item.name}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {item.cancelledAt ? new Date(item.cancelledAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : ''}
                        {item.cancelledByUser?.name ? ` by ${item.cancelledByUser.name}` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              ))
            })()}
          </div>
        )}

        <div className="mt-3">
          <textarea
            value={orderNote}
            onChange={(e) => setOrderNote(e.target.value)}
            onBlur={() => { if (orderNote !== (order.note ?? '')) updateOrderNoteMut.mutate(orderNote) }}
            placeholder="Order note..."
            className="w-full rounded border px-2 py-1.5 text-xs resize-none"
            rows={2}
            disabled={isLocked}
          />
        </div>
      </div>

      <div className="border-t p-3">
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>₹{order.subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax ({defaultTaxPercent}%)</span>
            <span>₹{order.taxTotal.toLocaleString()}</span>
          </div>
          {order.discountTotal > 0 && (
            <div className="flex justify-between text-red-500">
              <span>Discount</span>
              <span>−₹{order.discountTotal.toLocaleString()}</span>
            </div>
          )}
          {order.roundingAdjustment != null && order.roundingAdjustment !== 0 && (
            <div className="flex justify-between text-blue-500 text-xs">
              <span>Rounding ({order.roundingAdjustment > 0 ? '+' : ''}{order.roundingAdjustment.toFixed(2)})</span>
              <span>{order.roundingAdjustment > 0 ? '+' : ''}₹{order.roundingAdjustment.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between border-t pt-1 font-bold">
            <span>Grand Total</span>
            <span>₹{order.grandTotal.toLocaleString()}</span>
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          <button
            onClick={() => sendKOT.mutate()}
            disabled={isLocked || newItems.length === 0 || sendKOT.isPending}
            className="flex-1 rounded-lg bg-yellow-500 py-2 text-sm font-bold text-white hover:bg-yellow-600 disabled:opacity-50"
          >
            KOT
          </button>
          {canPrintBill && (
            <button
              onClick={() => generateBill.mutate()}
              disabled={generateBill.isPending}
              className="flex-1 rounded-lg bg-blue-500 py-2 text-sm font-bold text-white hover:bg-blue-600 disabled:opacity-50"
            >
              Bill
            </button>
          )}
          {canSettle && (
            <>
              <button
                onClick={() => reprintBillMut.mutate()}
                disabled={reprintBillMut.isPending}
                className="rounded-lg bg-cyan-500 px-3 py-2 text-sm font-bold text-white hover:bg-cyan-600 disabled:opacity-50"
                title="Reprint Bill"
              >
                <Printer size={14} />
              </button>
              <button
                onClick={() => reopenBillMut.mutate()}
                disabled={reopenBillMut.isPending}
                className="rounded-lg bg-orange-500 px-3 py-2 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-50"
                title="Re-open to modify"
              >
                <RefreshCw size={14} />
              </button>
              <button
                onClick={() => setShowSettlement(true)}
                className="flex-1 rounded-lg bg-green-500 py-2 text-sm font-bold text-white hover:bg-green-600"
              >
                Settle
              </button>
            </>
          )}
          {isSettled && (
            <>
              <button
                onClick={() => reprintBillMut.mutate()}
                disabled={reprintBillMut.isPending}
                className="flex-1 rounded-lg bg-cyan-500 py-2 text-sm font-bold text-white hover:bg-cyan-600 disabled:opacity-50"
              >
                <Printer size={14} className="inline mr-1" /> Reprint
              </button>
              <button
                onClick={() => setShowPaymentChange(true)}
                className="flex-1 rounded-lg bg-orange-500 py-2 text-sm font-bold text-white hover:bg-orange-600"
              >
                Change Payment
              </button>
            </>
          )}
        </div>
      </div>

      {showSettlement && (
        <SettlementModal
          order={order}
          tableName={order.table?.name ?? 'Takeaway'}
          taxType={(settings?.taxType as 'Inclusive' | 'Exclusive') ?? 'Inclusive'}
          onClose={() => setShowSettlement(false)}
          onSettled={() => {
            setShowSettlement(false)
            // Remove stale order data from cache so it doesn't flash on next table click
            if (tableId) {
              queryClient.removeQueries({ queryKey: ['order', tableId] })
            }
            queryClient.invalidateQueries({ queryKey: ['tables'] })
            queryClient.invalidateQueries({ queryKey: ['takeaway-orders'] })
          }}
        />
      )}
      {showPaymentChange && (
        <PaymentChangeModal
          orderId={order.id}
          grandTotal={order.grandTotal}
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
