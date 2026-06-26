import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/apiClient'
import { X, Ban, Undo2, RefreshCw, Search, Pencil } from 'lucide-react'
import { toast } from '@/stores/useToastStore'
import { PaymentChangeModal } from '@/components/settlement/PaymentChangeModal'

interface Order {
  id: string
  displayId: string | null
  table?: { id: string; name: string; area: { name: string } } | null
  status: string
  syncStatus: string
  orderType: string
  grandTotal: number
  guestCount: number
  createdAt: string
  customer?: { phone: string; name?: string }
  items: Array<{ item: { name: string }; quantity: number; lineTotal: number; status: string }>
  kots: Array<{ kotNumber: number; sentAt: string }>
  settlement?: { cash?: number; card?: number; upi?: number; cashPaid?: number; cardPaid?: number; upiPaid?: number }
}

const TABS = ['Running', 'Settled', 'Cancelled'] as const
type Tab = (typeof TABS)[number]

export default function OrdersPage() {
  const [tab, setTab] = useState<Tab>('Running')
  const [search, setSearch] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [editingPaymentOrder, setEditingPaymentOrder] = useState<Order | null>(null)
  const queryClient = useQueryClient()

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ['orders', tab],
    queryFn: async () => {
      const params: Record<string, string> = {}
      if (tab === 'Settled') params.status = 'Settled'
      else if (tab === 'Cancelled') params.status = 'Cancelled'
      const { data } = await apiClient.get('/orders', { params })
      return data
    },
    refetchInterval: 10_000,
  })

  const voidMut = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.post(`/orders/${id}/void`)
    },
    onSuccess: (_, id) => {
      // Find the cancelled order in our list to get its tableId
      const cancelledOrder = orders.find((o) => o.id === id)
      const tableId = cancelledOrder?.table?.id ?? null

      // Remove the specific cached active order so table click shows empty cart instantly
      if (tableId) {
        queryClient.setQueryData(['order', tableId], null)
        queryClient.removeQueries({ queryKey: ['order', tableId] })
      } else {
        // For takeaway orders without a table, use order ID as the key
        queryClient.setQueryData(['order', id], null)
        queryClient.removeQueries({ queryKey: ['order', id] })
      }
      // Also clear any order queries that may have been cached under just the order ID
      queryClient.removeQueries({ queryKey: ['order', id] })

      queryClient.invalidateQueries({ queryKey: ['orders', tab] })
      queryClient.invalidateQueries({ queryKey: ['tables'] })
      queryClient.invalidateQueries({ queryKey: ['takeaway-orders'] })
      setSelectedOrder(null)
      toast('Order cancelled', 'success')
    },
    onError: () => toast('Failed to cancel order', 'error'),
  })

  const refundMut = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.post(`/orders/${id}/refund`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', tab] })
      setSelectedOrder(null)
      toast('Order refunded', 'success')
    },
    onError: () => toast('Failed to refund order', 'error'),
  })

  const filteredOrders = orders.filter((o) => {
    const searchLower = search.toLowerCase()
    if (!searchLower) return true
    const idStr = o.displayId || o.id.slice(0, 8)
    return idStr.toLowerCase().includes(searchLower) ||
      (o.table?.name ?? '').toLowerCase().includes(searchLower) ||
      o.orderType.toLowerCase().includes(searchLower)
  })

  const statusClasses: Record<string, string> = {
    Draft: 'bg-gray-100 text-gray-700',
    KOT_Sent: 'bg-yellow-100 text-yellow-700',
    Ready: 'bg-blue-100 text-blue-700',
    Bill_Printed: 'bg-purple-100 text-purple-700',
    Settled: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-700',
  }

  const syncClasses: Record<string, string> = {
    Synced: 'bg-green-100 text-green-700',
    Pending: 'bg-yellow-100 text-yellow-700',
    Syncing: 'bg-blue-100 text-blue-700',
    Failed: 'bg-red-100 text-red-700',
  }

  const paymentMode = (settlement?: { cashPaid?: number; cardPaid?: number; upiPaid?: number; cash?: number; card?: number; upi?: number }) => {
    if (!settlement) return '—'
    const modes: string[] = []
    const cash = settlement.cashPaid ?? settlement.cash ?? 0
    const card = settlement.cardPaid ?? settlement.card ?? 0
    const upi = settlement.upiPaid ?? settlement.upi ?? 0
    if (cash > 0) modes.push(`Cash ₹${cash}`)
    if (card > 0) modes.push(`Card ₹${card}`)
    if (upi > 0) modes.push(`UPI ₹${upi}`)
    return modes.length > 0 ? modes.join(', ') : '—'
  }

  return (
    <div className="flex h-full flex-col">
      {/* Tab bar */}
      <div className="flex gap-2 px-6 pt-4 pb-3">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setSelectedOrder(null) }}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium ${
              tab === t ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}
          >
            {t === 'Running' ? 'Running Orders' : t === 'Settled' ? 'Settled Orders' : 'Cancelled Orders'}
          </button>
        ))}
      </div>

      {/* Toolbar with Search */}
      <div className="flex items-center gap-4 border-b px-6 py-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID or Table"
            className="w-full rounded-lg border bg-muted/50 py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="flex-1" />
      </div>

      {/* Orders Table */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b">
              <tr>
                <th className="p-4 text-xs font-bold uppercase text-muted-foreground tracking-wider">Order ID</th>
                <th className="p-4 text-xs font-bold uppercase text-muted-foreground tracking-wider">Table</th>
                <th className="p-4 text-xs font-bold uppercase text-muted-foreground tracking-wider">Date/Time</th>
                <th className="p-4 text-xs font-bold uppercase text-muted-foreground tracking-wider">Type</th>
                <th className="p-4 text-xs font-bold uppercase text-muted-foreground tracking-wider">Payment</th>
                <th className="p-4 text-xs font-bold uppercase text-muted-foreground tracking-wider">Status</th>
                <th className="p-4 text-right text-xs font-bold uppercase text-muted-foreground tracking-wider">Total</th>
                <th className="p-4 text-center text-xs font-bold uppercase text-muted-foreground tracking-wider">Sync</th>
                <th className="p-4 text-center text-xs font-bold uppercase text-muted-foreground tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="cursor-pointer hover:bg-muted/20"
                  onClick={() => setSelectedOrder(order)}
                >
                  <td className="p-4 font-mono text-xs font-semibold">{order.displayId || order.id.slice(0, 8)}</td>
                  <td className="p-4 font-medium">{order.table?.name ?? order.orderType}</td>
                  <td className="p-4">
                    <span className="text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}{' '}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground">{order.orderType}</td>
                  <td className="p-4 text-xs text-muted-foreground">{paymentMode(order.settlement)}</td>
                  <td className="p-4">
                    <span className={`rounded px-2 py-0.5 text-xs font-medium ${statusClasses[order.status] ?? ''}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-right font-medium">₹{order.grandTotal.toLocaleString()}</td>
                  <td className="p-4 text-center">
                    <span className={`rounded px-2 py-0.5 text-xs ${syncClasses[order.syncStatus] ?? ''}`}>
                      {order.syncStatus}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                      {tab === 'Running' && (
                        <button
                          onClick={() => { if (confirm('Cancel this order?')) voidMut.mutate(order.id) }}
                          className="rounded-md p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-500"
                          title="Cancel Order"
                        >
                          <Ban size={16} />
                        </button>
                      )}
                      {tab === 'Settled' && (
                        <>
                          <button
                            onClick={() => { if (confirm('Refund this order?')) refundMut.mutate(order.id) }}
                            className="rounded-md p-1.5 text-muted-foreground hover:bg-orange-50 hover:text-orange-500"
                            title="Refund Order"
                          >
                            <Undo2 size={16} />
                          </button>
                          <button
                            onClick={() => setEditingPaymentOrder(order)}
                            className="rounded-md p-1.5 text-muted-foreground hover:bg-blue-50 hover:text-blue-500"
                            title="Edit Payment"
                          >
                            <Pencil size={16} />
                          </button>
                        </>
                      )}
                      {order.syncStatus === 'Failed' && (
                        <button
                          onClick={() => toast('Sync retry queued', 'info')}
                          className="rounded-md p-1.5 text-muted-foreground hover:bg-blue-50 hover:text-blue-500"
                          title="Force Sync"
                        >
                          <RefreshCw size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-muted-foreground">
                    No orders
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="w-[350px] overflow-auto border-l bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-bold">Order Details</h3>
            <button onClick={() => setSelectedOrder(null)}>
              <X size={18} />
            </button>
          </div>
          <div className="space-y-3 text-sm">
            <p>
              <span className="text-muted-foreground">Order ID:</span> {selectedOrder.displayId || selectedOrder.id.slice(0, 8)}
            </p>
            <p>
              <span className="text-muted-foreground">Table:</span> {selectedOrder.table?.name ?? 'Takeaway'} {selectedOrder.table?.area?.name ? `(${selectedOrder.table.area.name})` : ''}
            </p>
            <p>
              <span className="text-muted-foreground">Guests:</span> {selectedOrder.guestCount}
            </p>
            {selectedOrder.customer && (
              <p>
                <span className="text-muted-foreground">Customer:</span> {selectedOrder.customer.phone}
              </p>
            )}

            <div className="border-t pt-3">
              <h4 className="mb-2 font-medium">Items</h4>
              {selectedOrder.items.map((item, i) => (
                <div key={i} className="flex justify-between border-b py-1">
                  <span>
                    {item.item.name} ×{item.quantity}
                  </span>
                  <span>₹{item.lineTotal.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-3">
              <h4 className="mb-2 font-medium">KOTs</h4>
              {selectedOrder.kots.map((kot) => (
                <div key={kot.kotNumber} className="text-xs text-muted-foreground">
                  KOT #{kot.kotNumber} — {new Date(kot.sentAt).toLocaleTimeString('en-IN')}
                </div>
              ))}
              {selectedOrder.kots.length === 0 && (
                <div className="text-xs text-muted-foreground">No KOTs</div>
              )}
            </div>

            <div className="border-t pt-3">
              <p className="flex justify-between">
                <span className="text-muted-foreground">Total</span>
                <span className="font-bold">₹{selectedOrder.grandTotal.toLocaleString()}</span>
              </p>
            </div>
          </div>
        </div>
      )}
      {editingPaymentOrder && (
        <PaymentChangeModal
          orderId={editingPaymentOrder.id}
          grandTotal={editingPaymentOrder.grandTotal}
          onClose={() => setEditingPaymentOrder(null)}
          onUpdated={() => {
            setEditingPaymentOrder(null)
            queryClient.invalidateQueries({ queryKey: ['orders', tab] })
            toast('Payment updated', 'success')
          }}
        />
      )}
    </div>
  )
}
