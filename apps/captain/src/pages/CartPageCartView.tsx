import type { Order, OrderItem } from '@akrdev/types'
import { ShoppingBag, Ban } from 'lucide-react'

interface CartViewProps {
  order: Order | undefined
  orderLoading: boolean
  onSwitchToMenu: () => void
}

function getItemName(item: OrderItem): string {
  return item.item?.name ?? item.itemName ?? 'Item'
}

export default function CartPageCartView({ order, orderLoading, onSwitchToMenu }: CartViewProps) {
  const activeItems = order?.items?.filter((i) => i.status !== 'Cancelled') ?? []
  const cancelledItems = order?.items?.filter((i) => i.status === 'Cancelled') ?? []
  const newItems = activeItems.filter((i) => i.status === 'New')

  if (orderLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (activeItems.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center text-muted-foreground p-4">
        <ShoppingBag size={32} />
        <p className="mt-3 text-sm font-medium">Cart is empty</p>
        <button
          onClick={onSwitchToMenu}
          className="mt-2 rounded-md bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground active:scale-95"
        >
          Add items
        </button>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto p-3">
      <div className="space-y-4">
        {newItems.length > 0 && (
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">New Items</p>
            <div className="divide-y rounded-xl border bg-card">
              {newItems.map((item) => (
                <div key={item.id} className="group flex items-center gap-2 px-3 py-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{getItemName(item)}</p>
                    {item.variation?.name && <p className="text-[11px] text-muted-foreground">— {item.variation.name}</p>}
                  </div>
                  <span className="text-xs text-muted-foreground">×{item.quantity}</span>
                  <span className="w-14 text-right text-sm font-semibold">₹{item.lineTotal.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {order?.kots?.map((kot) => {
          const kotItems = order.items.filter((i) =>
            (i.status === 'Sent' || i.status === 'Ready') && i.quantity > 0,
          )
          if (kotItems.length === 0) return null
          return (
            <div key={kot.kotNumber}>
              <p className="mb-1 border-b pb-1 text-xs font-semibold text-muted-foreground">
                KOT #{kot.kotNumber} — {new Date(kot.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {kot.sentByUser && <span className="font-normal"> by {kot.sentByUser.name}</span>}
              </p>
              <div className="divide-y rounded-xl border bg-card">
                {kotItems.map((item) => (
                  <div key={item.id} className="group flex items-center gap-2 px-3 py-2">
                    <Ban size={14} className="text-muted-foreground" />
                    <span className="flex-1 text-sm font-medium truncate">{getItemName(item)}</span>
                    <span className="text-xs text-muted-foreground">×{item.quantity}</span>
                    <span className="text-sm">₹{item.lineTotal.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {cancelledItems.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-bold uppercase text-destructive">Cancelled</p>
            <div className="divide-y rounded-xl border bg-card">
              {cancelledItems.map((item) => (
                <div key={item.id} className="flex items-center gap-2 px-3 py-2 opacity-50">
                  <span className="flex-1 text-sm line-through truncate">{getItemName(item)}</span>
                  <span className="text-xs text-muted-foreground">×{item.quantity}</span>
                  <span className="text-sm line-through">₹{item.lineTotal.toLocaleString()}</span>
                  {item.cancelledByUser?.name && <span className="text-[10px] text-muted-foreground">by {item.cancelledByUser.name}</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
