import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/apiClient'
import { formatCurrency } from '@/lib/format'
import { lightHaptic } from '@/lib/native-bridge'
import {
  Plus,
  Minus,
  Trash2,
  Printer,
  Send,
  Users,
  Phone,
  XCircle,
  StickyNote,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import type { CaptainOrder, CaptainOrderItem, CaptainCustomer, CaptainCartItem, CaptainKOT } from '@/lib/types'

interface MergedItem {
  ids: string[]
  name: string
  quantity: number
  unitPrice: number
  lineTotal: number
  note?: string
}

interface CartViewProps {
  order: CaptainOrder | null
  isTakeaway: boolean
  sendingKot: boolean
  printingBill: boolean
  cartItems: CaptainCartItem[]
  guestCount: number
  onLocalSetQty: (id: string, quantity: number) => void
  onLocalRemove: (id: string) => void
  onLocalItemNote: (id: string, note: string) => void
  onServerSetQty: (orderItemId: string, quantity: number) => void
  onServerRemove: (orderItemId: string) => void
  onServerItemNote: (orderItemId: string, note: string) => void
  onCancel: (orderItemIds: string[]) => void
  onGuestCount: (count: number) => void
  onAssignCustomer: (phone: string, name?: string) => void
  onSendKOT: () => void
  onPrintBill: () => void
}

function itemName(item: CaptainOrderItem): string {
  return item.itemName ?? item.item?.name ?? 'Item'
}

function itemVariationName(item: CaptainOrderItem): string | undefined {
  return item.variationName ?? item.variation?.name ?? undefined
}

function LocalItemRow({
  item,
  onLocalSetQty,
  onLocalRemove,
  onLocalItemNote,
}: {
  item: CaptainCartItem
  onLocalSetQty: (id: string, quantity: number) => void
  onLocalRemove: (id: string) => void
  onLocalItemNote: (id: string, note: string) => void
}) {
  const baseName = item.variationName ? `${item.itemName} (${item.variationName})` : item.itemName
  const displayName = item.note ? `${baseName} (${item.note})` : baseName
  return (
    <div className="rounded-lg border bg-card px-3 py-2 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium leading-tight">{displayName}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {formatCurrency(item.unitPrice)} × {item.quantity}
          </p>
        </div>
        <span className="shrink-0 text-sm font-bold">{formatCurrency(item.unitPrice * item.quantity)}</span>
      </div>

      <div className="mt-1.5 flex items-center gap-1.5">
        <div className="flex items-center gap-1 rounded-lg border">
          <button
            onClick={() => onLocalSetQty(item.id, Math.max(1, item.quantity - 1))}
            className="p-1.5 text-muted-foreground hover:bg-muted active:scale-90"
          >
            <Minus size={13} />
          </button>
          <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
          <button
            onClick={() => onLocalSetQty(item.id, item.quantity + 1)}
            className="p-1.5 text-muted-foreground hover:bg-muted active:scale-90"
          >
            <Plus size={13} />
          </button>
        </div>

        <div className="relative ml-auto flex min-w-0 flex-1 items-center gap-1">
          <div className="relative min-w-0 flex-1">
            <StickyNote size={13} className="absolute left-1.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              key={item.id}
              defaultValue={item.note ?? ''}
              placeholder="Note"
              onBlur={(e) => {
                const v = e.target.value.trim()
                if (v !== (item.note ?? '')) onLocalItemNote(item.id, v)
              }}
              className="w-full rounded-md border py-1 pl-6 pr-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary/20"
            />
          </div>
          <button
            onClick={() => onLocalRemove(item.id)}
            className="shrink-0 rounded-md p-1.5 text-destructive hover:bg-red-50 active:scale-90"
            title="Remove item"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}

function NewItemRow({
  item,
  onServerSetQty,
  onServerRemove,
  onServerItemNote,
}: {
  item: CaptainOrderItem
  onServerSetQty: (orderItemId: string, quantity: number) => void
  onServerRemove: (orderItemId: string) => void
  onServerItemNote: (orderItemId: string, note: string) => void
}) {
  const baseName = itemVariationName(item) ? `${itemName(item)} (${itemVariationName(item)})` : itemName(item)
  const displayName = item.note ? `${baseName} (${item.note})` : baseName
  return (
    <div className="rounded-lg border bg-card px-3 py-2 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium leading-tight">{displayName}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {formatCurrency(item.unitPrice)} × {item.quantity}
          </p>
        </div>
        <span className="shrink-0 text-sm font-bold">{formatCurrency(item.lineTotal)}</span>
      </div>

      <div className="mt-1.5 flex items-center gap-1.5">
        <div className="flex items-center gap-1 rounded-lg border">
          <button
            onClick={() => onServerSetQty(item.id, Math.max(1, item.quantity - 1))}
            className="p-1.5 text-muted-foreground hover:bg-muted active:scale-90"
          >
            <Minus size={13} />
          </button>
          <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
          <button
            onClick={() => onServerSetQty(item.id, item.quantity + 1)}
            className="p-1.5 text-muted-foreground hover:bg-muted active:scale-90"
          >
            <Plus size={13} />
          </button>
        </div>

        <div className="relative ml-auto flex min-w-0 flex-1 items-center gap-1">
          <div className="relative min-w-0 flex-1">
            <StickyNote size={13} className="absolute left-1.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              key={item.id}
              defaultValue={item.note ?? ''}
              placeholder="Note"
              onBlur={(e) => {
                const v = e.target.value.trim()
                if (v !== (item.note ?? '')) onServerItemNote(item.id, v)
              }}
              className="w-full rounded-md border py-1 pl-6 pr-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary/20"
            />
          </div>
          <button
            onClick={() => onServerRemove(item.id)}
            className="shrink-0 rounded-md p-1.5 text-destructive hover:bg-red-50 active:scale-90"
            title="Remove item"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}

export function CartView(props: CartViewProps) {
  const {
    order,
    sendingKot,
    printingBill,
    cartItems,
    guestCount,
    onLocalSetQty,
    onLocalRemove,
    onLocalItemNote,
    onServerSetQty,
    onServerRemove,
    onServerItemNote,
    onCancel,
    onGuestCount,
    onAssignCustomer,
    onSendKOT,
    onPrintBill,
  } = props

  const [showCustomer, setShowCustomer] = useState(false)
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerName, setCustomerName] = useState('')

  const { data: customers } = useQuery({
    queryKey: ['customers', customerPhone],
    queryFn: async () => (await apiClient.get<CaptainCustomer[]>('/customers/search', { params: { phone: customerPhone } })).data,
    enabled: customerPhone.length >= 3,
  })

  const newItems = useMemo(() => (order?.items ?? []).filter((i) => i.status === 'New'), [order])
  const sentItems = useMemo(() => (order?.items ?? []).filter((i) => i.status === 'Sent' || i.status === 'Ready'), [order])
  const cancelledItems = useMemo(() => (order?.items ?? []).filter((i) => i.status === 'Cancelled' && i.kotId), [order])

  const mergeItems = (items: CaptainOrderItem[]): MergedItem[] => {
    const map = new Map<string, MergedItem>()
    for (const i of items) {
      if (i.status === 'Cancelled') continue
      const key = `${i.itemId}-${i.variationId ?? 'none'}`
      const existing = map.get(key)
      const displayName = itemVariationName(i) ? `${itemName(i)} (${itemVariationName(i)})` : itemName(i)
      if (existing) {
        existing.quantity += i.quantity
        existing.lineTotal += i.lineTotal
        existing.ids.push(i.id)
        if (i.note && !existing.note) existing.note = i.note
      } else {
        map.set(key, { ids: [i.id], name: displayName, quantity: i.quantity, unitPrice: i.unitPrice, lineTotal: i.lineTotal, note: i.note ?? undefined })
      }
    }
    return Array.from(map.values())
  }

  const kotGroups = useMemo(() => {
    const kots = (order?.kots ?? []).slice().sort((a, b) => a.kotNumber - b.kotNumber)
    return kots
      .map((kot: CaptainKOT) => {
        const kotSent = sentItems.filter((i) => i.kotId === kot.id)
        const kotCancelled = cancelledItems.filter((i) => i.kotId === kot.id)
        return { kot, merged: mergeItems(kotSent), cancelled: kotCancelled }
      })
      .filter((g) => g.merged.length > 0 || g.cancelled.length > 0)
  }, [order, sentItems, cancelledItems])

  const localSubtotal = cartItems.reduce((s, i) => s + i.unitPrice * i.quantity, 0)
  const activeCount = cartItems.length + (order?.items.filter((i) => i.status !== 'Cancelled').length ?? 0)
  const canSendKot = cartItems.length > 0 || newItems.length > 0
  const isBilled = order?.status === 'Bill_Printed' || order?.status === 'Settled'
  const hasBillableOrder = !!order && order.items.some((i) => i.status !== 'Cancelled')
  const subtotal = (order?.subtotal ?? 0) + localSubtotal
  const grandTotal = (order?.grandTotal ?? 0) + localSubtotal

  return (
    <div className="flex h-full flex-col">
      <div className="scrollbar-none min-h-0 flex-1 overflow-y-auto px-3 py-2">
        {/* Guest count + customer */}
        <div className="mb-2 flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg border bg-card px-1 py-1">
            <button
              onClick={() => { lightHaptic(); onGuestCount(Math.max(1, guestCount - 1)) }}
              className="p-1.5 text-muted-foreground hover:bg-muted active:scale-90"
            >
              <Minus size={13} />
            </button>
            <span className="flex items-center gap-1 px-1 text-xs font-semibold">
              <Users size={13} /> {guestCount}
            </span>
            <button
              onClick={() => { lightHaptic(); onGuestCount(Math.min(99, guestCount + 1)) }}
              className="p-1.5 text-muted-foreground hover:bg-muted active:scale-90"
            >
              <Plus size={13} />
            </button>
          </div>

          <button
            onClick={() => setShowCustomer((s) => !s)}
            className="flex min-w-0 flex-1 items-center justify-between gap-1 rounded-lg border bg-card px-2.5 py-2 text-xs font-medium text-muted-foreground"
          >
            <span className="flex min-w-0 items-center gap-1 truncate">
              <Phone size={13} />
              {order?.customerPhone ? order.customerPhone : 'Assign customer'}
            </span>
            {showCustomer ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>

        {showCustomer && (
          <div className="mb-2 space-y-2 rounded-lg border bg-muted/50 p-2">
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="Customer phone"
              inputMode="numeric"
              className="w-full rounded-md border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/20"
            />
            {(customers ?? []).map((c) => (
              <button
                key={c.id}
                onClick={() => onAssignCustomer(c.phone, c.name ?? undefined)}
                className="flex w-full items-center justify-between rounded-md border bg-card px-3 py-2 text-sm hover:border-primary/30"
              >
                <span>{c.phone}</span>
                <span className="text-xs text-muted-foreground">{c.name}</span>
              </button>
            ))}
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Customer name (optional)"
              className="w-full rounded-md border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/20"
            />
            {customerPhone.length >= 10 && (
              <button
                onClick={() => onAssignCustomer(customerPhone, customerName.trim() || undefined)}
                className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground active:scale-[0.98]"
              >
                Assign {customerPhone}
              </button>
            )}
          </div>
        )}

        {activeCount === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">Cart is empty — add items from the menu.</p>
        )}

        {cartItems.length > 0 && (
          <div className="mb-3">
            <h4 className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> New order
            </h4>
            <div className="space-y-2">
              {cartItems.map((item) => (
                <LocalItemRow
                  key={item.id}
                  item={item}
                  onLocalSetQty={onLocalSetQty}
                  onLocalRemove={onLocalRemove}
                  onLocalItemNote={onLocalItemNote}
                />
              ))}
            </div>
          </div>
        )}

        {newItems.length > 0 && (
          <div className="mb-3">
            <h4 className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> New order
            </h4>
            <div className="space-y-2">
              {newItems.map((item) => (
                <NewItemRow
                  key={item.id}
                  item={item}
                  onServerSetQty={onServerSetQty}
                  onServerRemove={onServerRemove}
                  onServerItemNote={onServerItemNote}
                />
              ))}
            </div>
          </div>
        )}

        {kotGroups.map((g) => (
          <div key={g.kot.id} className="mb-3">
            <h4 className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              KOT #{g.kot.kotNumber} — By {g.kot.sentBy} — {new Date(g.kot.sentAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </h4>
            <div className="space-y-2">
              {g.merged.map((m) => (
                <div key={m.ids[0]} className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2 shadow-sm">
                  {!isBilled && (
                    <button
                      onClick={() => onCancel(m.ids)}
                      className="shrink-0 rounded-md p-1.5 text-amber-600 hover:bg-amber-50 active:scale-90"
                      title="Cancel item"
                    >
                      <XCircle size={15} />
                    </button>
                  )}
                  <span className="min-w-0 flex-1 text-sm font-medium leading-tight">{m.name}{m.note ? ` (${m.note})` : ''}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">×{m.quantity}</span>
                  <span className="shrink-0 text-sm font-bold">{formatCurrency(m.lineTotal)}</span>
                </div>
              ))}
              {g.cancelled.map((item) => (
                <div key={item.id} className="flex items-center gap-2 rounded-lg border border-dashed bg-muted/40 px-3 py-2">
                  <span className="min-w-0 flex-1 text-sm text-muted-foreground line-through">
                    {itemVariationName(item) ? `${itemName(item)} (${itemVariationName(item)})` : itemName(item)}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">×{item.quantity}</span>
                  {item.cancelledByUser?.name && (
                    <span className="shrink-0 text-xs text-muted-foreground">by {item.cancelledByUser.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="shrink-0 border-t bg-card px-4 py-3">
        <div className="space-y-1 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {order && (order.taxTotal ?? 0) > 0 && (
            <div className="flex justify-between text-muted-foreground">
              <span>Tax</span>
              <span>{formatCurrency(order.taxTotal)}</span>
            </div>
          )}
          {order && order.discountTotal > 0 && (
            <div className="flex justify-between text-muted-foreground">
              <span>Discount</span>
              <span>-{formatCurrency(order.discountTotal)}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-bold">
            <span>Total</span>
            <span>{formatCurrency(grandTotal)}</span>
          </div>
        </div>

        {isBilled ? (
          <div className="mt-3 rounded-lg bg-purple-50 py-2.5 text-center text-sm font-semibold text-purple-700">
            Bill printed — settle from the POS
          </div>
        ) : (
          <div className="mt-3 flex gap-2">
            <button
              onClick={onSendKOT}
              disabled={!canSendKot || sendingKot}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <Send size={15} /> {sendingKot ? 'Sending…' : 'Send KOT'}
            </button>
            <button
              onClick={onPrintBill}
              disabled={!hasBillableOrder || printingBill}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2.5 text-sm font-semibold text-foreground transition-all active:scale-[0.98] hover:bg-muted disabled:opacity-50"
            >
              <Printer size={15} /> {printingBill ? 'Printing…' : 'Print Bill'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
