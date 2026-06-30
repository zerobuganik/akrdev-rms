import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/apiClient'
import { useSocketIO } from '@/lib/useSocketIO'
import { cn } from '@/lib/utils'
import { SendHorizontal, Printer, ChevronLeft, ChevronRight } from 'lucide-react'
import { lightHaptic, mediumHaptic, successHaptic } from '@/lib/native-bridge'
import type { MenuItem, MenuCategory, Order, OrderItem, Table } from '@akrdev/types'
import CartPageMenuView from './CartPageMenuView'
import CartPageCartView from './CartPageCartView'
import VariationModal from './VariationModal'

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
  const [variationItem, setVariationItem] = useState<MenuItem | null>(null)
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

  const { data: allTables = [] } = useQuery<Table[]>({
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

  const switchTable = useCallback((table: Table) => {
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

  const { data: items = [] } = useQuery<MenuItem[]>({
    queryKey: ['local-items'],
    queryFn: async () => { const { data } = await apiClient.get('/items'); return Array.isArray(data) ? data : [] },
    staleTime: 0,
  })

  const { data: categories = [] } = useQuery<MenuCategory[]>({
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
    const map = new Map<string, { category: MenuCategory | null; items: MenuItem[] }>()
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

  const addItemMut = useMutation({
    mutationFn: async (item: { id: string; variation?: { id: string } }) => {
      // Server-side POST /orders handles idempotent get-or-create atomically
      const createRes = await apiClient.post('/orders', { tableId, tableName })
      const orderId = createRes.data?.id
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
    onError: () => {
      mediumHaptic()
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
    onError: () => {
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
    onError: () => {
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

  const handleItemClick = (item: MenuItem) => {
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
        <CartPageMenuView
          items={items}
          categories={categories}
          itemsByCategory={itemsByCategory}
          activeCategoryId={activeCategoryId}
          search={search}
          onSearchChange={setSearch}
          onCategoryChange={(id) => { lightHaptic(); setActiveCategoryId(id) }}
          onItemClick={handleItemClick}
        />
      ) : (
        <div className="flex flex-1 flex-col overflow-hidden">
          <CartPageCartView
            order={order}
            orderLoading={orderLoading}
            onSwitchToMenu={() => setView('menu')}
          />

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
        <VariationModal
          item={variationItem}
          onSelect={(item, variation) => {
            addItemMut.mutate({ id: item.id, variation })
            setVariationItem(null)
          }}
          onClose={() => setVariationItem(null)}
        />
      )}
    </div>
  )
}
