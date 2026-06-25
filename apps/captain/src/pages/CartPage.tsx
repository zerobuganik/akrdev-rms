import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/apiClient'
import { useSocketIO } from '@/lib/useSocketIO'
import { cn } from '@/lib/utils'
import { Plus, Minus, Trash2, SendHorizontal, Printer, Ban, Search, ShoppingBag, UtensilsCrossed, ChevronLeft, ChevronRight } from 'lucide-react'
import { lightHaptic, mediumHaptic, successHaptic } from '@/lib/native-bridge'

interface Item {
  id: string
  name: string
  basePrice: number
  inStock: boolean
  variations: Array<{ id: string; name: string; priceAdjustment: number }>
  categoryId?: string | null
  category?: { id: string; name: string } | null
}

interface Category {
  id: string
  name: string
}

interface OrderItem {
  id: string
  itemId: string
  item: { name: string }
  itemName?: string
  variation?: { name: string }
  quantity: number
  unitPrice: number
  lineTotal: number
  status: string
  note?: string
  cancelledBy?: string
  cancelledByUser?: { name: string }
}

interface KOT { id: string; kotNumber: number; sentAt: string; sentByUser?: { name: string } }

interface Order {
  id: string
  subtotal: number
  taxTotal: number
  discountTotal: number
  grandTotal: number
  status: string
  items: OrderItem[]
  kots: KOT[]
  table?: { name: string; capacity: number }
  guestCount: number
}

interface TableInfo {
  id: string
  name: string
  area?: { name: string } | null
  capacity: number
}

function getItemName(item: OrderItem): string {
  return item.item?.name ?? item.itemName ?? 'Item'
}

export default function CartPage() {
  const { tableId: routeTableId } = useParams<{ tableId: string }>()
  const [searchParams] = useSearchParams()
  const initialTableName = searchParams.get('name') ?? 'Table'
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [tableId, setTableId] = useState(routeTableId ?? '')
  const [tableName, setTableName] = useState(initialTableName)
  const [view, setView] = useState<'menu' | 'cart'>('menu')
  const [search, setSearch] = useState('')
  const [variationItem, setVariationItem] = useState<Item | null>(null)
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null)
  const hasSetInitialCategory = useRef(false)

  const touchStartX = useRef(0)
  const touchStartY = useRef(0)

  useEffect(() => {
    if (routeTableId) {
      setTableId(routeTableId)
    }
  }, [routeTableId])

  useEffect(() => {
    const name = searchParams.get('name') ?? 'Table'
    setTableName(name)
  }, [searchParams])

  const { data: allTables = [] } = useQuery<TableInfo[]>({
    queryKey: ['tables-local'],
    queryFn: async () => {
      const { data } = await apiClient.get('/tables')
      return Array.isArray(data) ? data : []
    },
    staleTime: 0,
  })

  const currentTableIndex = useMemo(() => allTables.findIndex((t) => t.id === tableId), [allTables, tableId])
  const prevTable = currentTableIndex > 0 ? allTables[currentTableIndex - 1] : null
  const nextTable = currentTableIndex >= 0 && currentTableIndex < allTables.length - 1 ? allTables[currentTableIndex + 1] : null

  const switchTable = useCallback((table: TableInfo) => {
    lightHaptic()
    setTableId(table.id)
    setTableName(table.name)
    setView('menu')
    setSearch('')
    setActiveCategoryId(null)
    hasSetInitialCategory.current = false
    navigate(`/cart/${table.id}?name=${encodeURIComponent(table.name)}`, { replace: true })
  }, [navigate])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]!.clientX
    touchStartY.current = e.touches[0]!.clientY
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const dx = e.changedTouches[0]!.clientX - touchStartX.current
    const dy = e.changedTouches[0]!.clientY - touchStartY.current
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx > 0 && prevTable) switchTable(prevTable)
      else if (dx < 0 && nextTable) switchTable(nextTable)
    }
  }, [prevTable, nextTable, switchTable])

  const { data: items = [] } = useQuery<Item[]>({
    queryKey: ['local-items'],
    queryFn: async () => { const { data } = await apiClient.get('/items'); return Array.isArray(data) ? data : [] },
    staleTime: 0,
  })

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['local-categories'],
    queryFn: async () => { const { data } = await apiClient.get('/categories'); return Array.isArray(data) ? data : [] },
    staleTime: 0,
  })

  const { data: order, isLoading: orderLoading } = useQuery<Order>({
    queryKey: ['local-order', tableId],
    queryFn: async () => { const { data } = await apiClient.get(`/orders/${tableId}/active`); return data },
    enabled: !!tableId,
    refetchInterval: 3_000,
    staleTime: 0,
  })

  const itemsByCategory = useMemo(() => {
    const map = new Map<string, { category: Category | null; items: Item[] }>()
    for (const item of items) {
      if (!item.inStock) continue
      const key = item.categoryId ?? '__no_cat__'
      if (!map.has(key)) {
        map.set(key, { category: item.category ?? null, items: [] })
      }
      map.get(key)!.items.push(item)
    }
    const result = Array.from(map.values())
    for (const cat of categories) {
      if (!map.has(cat.id)) {
        result.push({ category: cat, items: [] })
      }
    }
    return result
  }, [items, categories])

  useEffect(() => {
    if (itemsByCategory.length > 0 && !hasSetInitialCategory.current) {
      hasSetInitialCategory.current = true
      // Find first group that actually has items
      const firstWithItems = itemsByCategory.find(g => g.items.length > 0)
      setActiveCategoryId(firstWithItems?.category?.id ?? itemsByCategory[0]!.category?.id ?? '__no_cat__')
    }
  }, [itemsByCategory])

  const activeCategoryItems = useMemo(() => {
    const group = itemsByCategory.find(
      (g) => (g.category?.id ?? '__no_cat__') === activeCategoryId,
    )
    const allItems = group?.items ?? []
    if (!search) return allItems
    return allItems.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()))
  }, [itemsByCategory, activeCategoryId, search])

  const addItemMut = useMutation({
    mutationFn: async (item: { id: string; variation?: { id: string } }) => {
      let orderRes = await apiClient.get(`/orders/${tableId}/active`)
      let orderId = orderRes.data?.id
      if (!orderId) {
        const createRes = await apiClient.post('/orders', { tableId, tableName })
        orderId = createRes.data?.id
      }
      await apiClient.post('/cart/add-item', {
        orderId,
        itemId: item.id,
        variationId: item.variation?.id,
        quantity: 1,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['local-order', tableId] })
      setView('cart')
      successHaptic()
    },
  })

  const removeItemMut = useMutation({
    mutationFn: async (orderItemId: string) => {
      await apiClient.post('/cart/remove-item', { orderItemId })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['local-order', tableId] })
      mediumHaptic()
    },
  })

  const updateQtyMut = useMutation({
    mutationFn: async ({ orderItemId, quantity }: { orderItemId: string; quantity: number }) => {
      await apiClient.put('/cart/item-qty', { orderItemId, quantity })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['local-order', tableId] })
      lightHaptic()
    },
  })

  const sendKOTMut = useMutation({
    mutationFn: async () => {
      const { data: kotResult } = await apiClient.post('/kot/send', { orderId: order!.id })
      const newItems = (order?.items ?? []).filter(i => i.status === 'New')
      apiClient.post('/print/kot', {
        printType: 'kot',
        orderId: order!.id,
        tableName: tableName,
        kotNumber: kotResult.kotNumber,
        items: newItems.map(i => ({
          name: getItemName(i),
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          lineTotal: i.lineTotal,
          note: i.note,
        })),
        date: new Date().toLocaleString('en-IN'),
        orderType: 'Dine In',
      }).catch(() => {})
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['local-order', tableId] })
      successHaptic()
    },
  })

  const generateBillMut = useMutation({
    mutationFn: async () => {
      await apiClient.put(`/orders/${order!.id}`, { status: 'Bill_Printed' })
      const sentItems = (order?.items ?? []).filter(i => i.status === 'Sent' || i.status === 'Ready')
      apiClient.post('/print/bill', {
        printType: 'bill',
        orderId: order!.id,
        tableName: tableName,
        items: sentItems.map(i => ({
          name: getItemName(i),
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          lineTotal: i.lineTotal,
          note: i.note,
        })),
        subtotal: order!.subtotal,
        taxTotal: order!.taxTotal,
        grandTotal: order!.grandTotal,
        orderNumber: order!.id.slice(0, 8).toUpperCase(),
        date: new Date().toLocaleString('en-IN', { hour12: false }),
        orderType: 'Dine In',
      }).catch(() => {})
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['local-order', tableId] })
      successHaptic()
    },
  })

  const handleItemClick = (item: Item) => {
    lightHaptic()
    if (item.variations.length > 0) {
      setVariationItem(item)
    } else {
      addItemMut.mutate(item)
    }
  }

  const activeItems = order?.items?.filter(i => i.status !== 'Cancelled') ?? []
  const cancelledItems = order?.items?.filter(i => i.status === 'Cancelled') ?? []
  const newItems = activeItems.filter(i => i.status === 'New')
  const canGenerateBill = order && order.status !== 'Bill_Printed' && order.status !== 'Settled'
  const needsKOT = newItems.length > 0

  return (
    <div className="flex h-full flex-col bg-background">
      <header
        className="shrink-0 bg-card border-b px-3 py-2"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => { lightHaptic(); navigate('/tables') }}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md hover:bg-muted active:scale-95 transition-all"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="flex items-center min-w-0 flex-1 gap-1">
            {prevTable ? (
              <button onClick={() => switchTable(prevTable)} className="flex h-7 w-7 shrink-0 items-center justify-center rounded hover:bg-muted active:scale-90">
                <ChevronLeft size={13} className="text-muted-foreground" />
              </button>
            ) : <div className="w-7 shrink-0" />}

            <div className="min-w-0 flex-1 text-center select-none">
              <div className="text-sm font-bold truncate">{tableName}</div>
              {order && (
                <div className="text-[10px] text-muted-foreground">
                  ₹{order.grandTotal.toLocaleString()}
                  {order.kots?.length ? ` · KOT #${order.kots[order.kots.length - 1]?.kotNumber}` : ''}
                </div>
              )}
            </div>

            {nextTable ? (
              <button onClick={() => switchTable(nextTable)} className="flex h-7 w-7 shrink-0 items-center justify-center rounded hover:bg-muted active:scale-90">
                <ChevronRight size={13} className="text-muted-foreground" />
              </button>
            ) : <div className="w-7 shrink-0" />}
          </div>

          <div className="flex rounded-md bg-muted p-0.5">
            <button
              onClick={() => { lightHaptic(); setView('menu') }}
              className={cn(
                'rounded px-3 py-1 text-xs font-semibold transition-all',
                view === 'menu' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground',
              )}
            >
              Menu
            </button>
            <button
              onClick={() => { lightHaptic(); setView('cart') }}
              className={cn(
                'relative rounded px-3 py-1 text-xs font-semibold transition-all',
                view === 'cart' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground',
              )}
            >
              Cart
              {activeItems.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-destructive px-0.5 text-[9px] font-bold text-white">
                  {activeItems.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {view === 'menu' ? (
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="shrink-0 bg-card px-3 pb-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search items..."
                className="w-full rounded-md border bg-muted py-2 pl-9 pr-3 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>

          <div className="shrink-0 border-b bg-card">
            <div className="flex gap-1 overflow-x-auto px-3 pb-2 scrollbar-none">
              {itemsByCategory.map((group) => {
                const catKey = group.category?.id ?? '__no_cat__'
                const isActive = activeCategoryId === catKey
                if (group.items.length === 0) return null
                return (
                  <button
                    key={catKey}
                    onClick={() => { lightHaptic(); setActiveCategoryId(catKey) }}
                    className={cn(
                      'shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all',
                      isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80',
                    )}
                  >
                    {group.category?.name ?? 'General'}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex-1 overflow-auto p-3">
            {activeCategoryItems.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
                <UtensilsCrossed size={28} />
                <p className="mt-2 text-sm">
                  {items.length === 0 ? 'No menu items available' : search ? 'No items match' : 'No items in category'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-1.5">
                {activeCategoryItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className="flex items-center gap-3 rounded-xl border bg-card p-3 text-left shadow-sm transition-all active:scale-[0.98] hover:bg-accent"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate">{item.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {item.variations.length > 0 ? 'Select variation' : 'Tap to add'}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold">₹{item.basePrice.toLocaleString()}</p>
                      {item.variations.length > 0 && (
                        <p className="text-[10px] text-amber-600 font-medium">+ options</p>
                      )}
                    </div>
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Plus size={15} />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-auto p-3">
            {orderLoading ? (
              <div className="flex h-full items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
            ) : activeItems.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
                <ShoppingBag size={32} />
                <p className="mt-3 text-sm font-medium">Cart is empty</p>
                <button onClick={() => setView('menu')} className="mt-2 rounded-md bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground active:scale-95">
                  Add items
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {newItems.length > 0 && (
                  <div>
                    <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">New Items</p>
                    <div className="divide-y rounded-xl border bg-card">
                      {newItems.map((item) => (
                        <div key={item.id} className="group flex items-center gap-2 px-3 py-2">
                          <button onClick={() => removeItemMut.mutate(item.id)} className="text-muted-foreground hover:text-destructive">
                            <Trash2 size={14} />
                          </button>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium truncate">{getItemName(item)}</p>
                            {item.variation?.name && <p className="text-[11px] text-muted-foreground">— {item.variation.name}</p>}
                          </div>
                          <div className="flex items-center gap-0.5">
                            <button
                              onClick={() => item.quantity <= 1 ? removeItemMut.mutate(item.id) : updateQtyMut.mutate({ orderItemId: item.id, quantity: item.quantity - 1 })}
                              className="flex h-6 w-6 items-center justify-center rounded hover:bg-muted"
                            ><Minus size={12} /></button>
                            <span className="w-5 text-center text-xs font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQtyMut.mutate({ orderItemId: item.id, quantity: item.quantity + 1 })}
                              className="flex h-6 w-6 items-center justify-center rounded hover:bg-muted"
                            ><Plus size={12} /></button>
                          </div>
                          <span className="w-14 text-right text-sm font-semibold">₹{item.lineTotal.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {order?.kots?.map((kot) => {
                  const kotItems = order.items.filter(i =>
                    (i.status === 'Sent' || i.status === 'Ready') && i.quantity > 0
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
                            <button onClick={() => removeItemMut.mutate(item.id)} className="text-muted-foreground hover:text-destructive" title="Cancel item">
                              <Ban size={14} />
                            </button>
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
            )}
          </div>

          {order && activeItems.length > 0 && (
            <div className="shrink-0 border-t bg-card p-3 space-y-2.5">
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{order.subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>₹{order.taxTotal.toLocaleString()}</span></div>
                {order.discountTotal > 0 && (
                  <div className="flex justify-between text-destructive"><span>Discount</span><span>−₹{order.discountTotal.toLocaleString()}</span></div>
                )}
                <div className="flex justify-between border-t pt-1 font-bold"><span>Grand Total</span><span>₹{order.grandTotal.toLocaleString()}</span></div>
              </div>

              <div className="flex gap-2">
                {needsKOT && (
                  <button
                    onClick={() => sendKOTMut.mutate()}
                    disabled={sendKOTMut.isPending}
                    className="flex-1 rounded-md bg-amber-500 py-2.5 text-sm font-bold text-white hover:bg-amber-600 disabled:opacity-50 active:scale-95 transition-all"
                  >
                    <SendHorizontal size={14} className="inline mr-1" />
                    {sendKOTMut.isPending ? 'Sending...' : 'KOT'}
                  </button>
                )}
                {canGenerateBill && (
                  <button
                    onClick={() => generateBillMut.mutate()}
                    disabled={generateBillMut.isPending}
                    className="flex-1 rounded-md bg-blue-500 py-2.5 text-sm font-bold text-white hover:bg-blue-600 disabled:opacity-50 active:scale-95 transition-all"
                  >
                    <Printer size={14} className="inline mr-1" />
                    {generateBillMut.isPending ? 'Printing...' : 'Bill'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {variationItem && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" onClick={() => setVariationItem(null)}>
          <div className="w-full max-w-md rounded-t-2xl bg-card p-5 pb-8 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border" />
            <h3 className="mb-4 text-base font-bold">{variationItem.name}</h3>
            <p className="mb-3 text-xs text-muted-foreground">Select a variation</p>
            <div className="space-y-2">
              {variationItem.variations.map((v) => (
                <button
                  key={v.id}
                  onClick={() => {
                    addItemMut.mutate({ id: variationItem.id, variation: v })
                    setVariationItem(null)
                  }}
                  className="flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition-all active:scale-[0.98] hover:bg-accent"
                >
                  <span>{v.name}</span>
                  <span className="font-bold text-primary">
                    {v.priceAdjustment > 0 ? '+' : ''}₹{(variationItem.basePrice + v.priceAdjustment).toLocaleString()}
                  </span>
                </button>
              ))}
            </div>
            <button onClick={() => setVariationItem(null)} className="mt-4 w-full rounded-xl bg-muted py-3 text-sm font-semibold hover:bg-muted/80">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
