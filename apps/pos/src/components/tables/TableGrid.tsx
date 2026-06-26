import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/apiClient'
import { printerApi } from '@/lib/printerApi'
import { AreaFilter } from './AreaFilter'
import { TableStats } from './TableStats'
import { TableCard } from './TableCard'
import { SettlementModal } from '@/components/settlement/SettlementModal'
import type { TableData } from './TableCard'
import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from '@/stores/useToastStore'
import { useSocketIO } from '@/lib/useSocketIO'
import { Plus, X, ShoppingBag, Clock, FileText } from 'lucide-react'

interface TakeawayOrder {
  id: string
  displayId: string | null
  grandTotal: number
  status: string
  createdAt: string
  items: Array<{ item: { name: string } }>
}

interface Table {
  id: string
  name: string
  capacity: number
  status: string
  position: number
  area: { id: string; name: string }
  areaId?: string
  orders: Array<{ id: string; createdAt: string; subtotal: number; grandTotal: number; syncStatus: string; status: string }>
}

interface Area {
  id: string
  name: string
  _count: { items: number }
}

export function TableGrid() {
  const navigate = useNavigate()
  const [selectedAreas, setSelectedAreas] = useState<string[]>([])
  const [showNewArea, setShowNewArea] = useState(false)
  const [areaForm, setAreaForm] = useState({ name: '' })
  const [showNewTable, setShowNewTable] = useState(false)
  const [editingTable, setEditingTable] = useState<TableData | null>(null)
  const [tableForm, setTableForm] = useState({ areaId: '', name: '', capacity: 4, position: 0 })
  const queryClient = useQueryClient()
  const socketIO = useSocketIO()

  // Listen for real-time order updates from Captain App via Socket.IO
  useEffect(() => {
    const cleanup = socketIO.on('order:updated', () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] })
      queryClient.invalidateQueries({ queryKey: ['takeaway-orders'] })
    })
    return cleanup
  }, [socketIO, queryClient])

  const { data: areas = [] } = useQuery<Area[]>({
    queryKey: ['areas'],
    queryFn: async () => {
      const { data } = await apiClient.get('/areas')
      return data
    },
  })

  const { data: tables = [] } = useQuery<Table[]>({
    queryKey: ['tables', selectedAreas],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (selectedAreas.length === 1) {
        params.set('areaId', selectedAreas[0]!)
      }
      const { data } = await apiClient.get('/tables', { params })
      return data
    },
    refetchInterval: 3_000,
    staleTime: 0,
  })

  const { data: settings } = useQuery<{ taxType?: string }>({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data } = await apiClient.get('/settings')
      return data
    },
    staleTime: 300_000,
  })

  const { data: takeawayOrders = [] } = useQuery<TakeawayOrder[]>({
    queryKey: ['takeaway-orders'],
    queryFn: async () => {
      const { data } = await apiClient.get('/orders/takeaway/active')
      return data ?? []
    },
    refetchInterval: 3_000,
    staleTime: 0,
  })

  const areaMut = useMutation({
    mutationFn: async (data: { name: string }) => {
      await apiClient.post('/areas', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['areas'] })
      setShowNewArea(false)
      setAreaForm({ name: '' })
      toast('Area created', 'success')
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message
        ?? (err as Error)?.message
        ?? 'Failed to create area'
      toast(msg, 'error')
    },
  })

  const deleteAreaMut = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/areas/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['areas'] })
      queryClient.invalidateQueries({ queryKey: ['tables', selectedAreas] })
      toast('Area deleted', 'success')
    },
    onError: () => toast('Failed to delete area', 'error'),
  })

  const tableMut = useMutation({
    mutationFn: async (data: { areaId: string; name: string; capacity: number; position: number }) => {
      await apiClient.post('/tables', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables', selectedAreas] })
      setShowNewTable(false)
      setTableForm({ areaId: '', name: '', capacity: 4, position: 0 })
      toast('Table created', 'success')
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message
        ?? (err as Error)?.message
        ?? 'Failed to create table'
      toast(msg, 'error')
    },
  })

  const updateTableMut = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { areaId?: string; name?: string; capacity?: number; position?: number } }) => {
      await apiClient.put(`/tables/${id}`, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables', selectedAreas] })
      setEditingTable(null)
      setTableForm({ areaId: '', name: '', capacity: 4, position: 0 })
      toast('Table updated', 'success')
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message
        ?? (err as Error)?.message
        ?? 'Failed to update table'
      toast(msg, 'error')
    },
  })

  const deleteTableMut = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/tables/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables', selectedAreas] })
      toast('Table deleted', 'success')
    },
    onError: () => toast('Failed to delete table', 'error'),
  })

  const handleDeleteTable = (id: string) => {
    if (confirm('Delete this table?')) {
      deleteTableMut.mutate(id)
    }
  }

  const handleDeleteArea = (id: string) => {
    if (confirm('Delete this area and all its tables?')) {
      deleteAreaMut.mutate(id)
    }
  }

  const handleEditTable = (table: TableData) => {
    setEditingTable(table)
    setTableForm({
      areaId: table.area?.id ?? '',
      name: table.name,
      capacity: table.capacity,
      position: table.position ?? 0,
    })
  }

  const resetTableForm = () => {
    setShowNewTable(false)
    setEditingTable(null)
    setTableForm({ areaId: '', name: '', capacity: 4, position: 0 })
  }

  const getNextPosition = (areaId: string) => {
    const areaTables = tables.filter((t) => (t.areaId ?? t.area?.id) === areaId)
    if (areaTables.length === 0) return 1
    const usedPositions = areaTables.map((t) => t.position).sort((a, b) => a - b)
    for (let i = 0; i < usedPositions.length; i++) {
      if (usedPositions[i] !== i + 1) return i + 1
    }
    return usedPositions.length + 1
  }

  const filteredByArea = selectedAreas.length === 0
    ? tables
    : tables.filter((t) => selectedAreas.includes(t.area.id))

  const groupedByArea = areas.reduce(
    (acc, area) => {
      const areaTables = filteredByArea
        .filter((t) => t.area.id === area.id)
        .sort((a, b) => a.position - b.position)
      acc[area.name] = { areaId: area.id, tables: areaTables }
      return acc
    },
    {} as Record<string, { areaId: string; tables: Table[] }>,
  )

  const occupied = tables.filter((t) => t.status !== 'Available').length
  const available = tables.filter((t) => t.status === 'Available').length

  const [settleOrder, setSettleOrder] = useState<{ id: string; grandTotal: number; subtotal: number; taxTotal: number; discountTotal: number; tableName: string } | null>(null)
  const [billPrintPending, setBillPrintPending] = useState<string | null>(null)
  const [mergeSourceTable, setMergeSourceTable] = useState<TableData | null>(null)
  const [mergeDestTableId, setMergeDestTableId] = useState<string>('')

  const generateBillMut = useMutation({
    mutationFn: async ({ tableId }: { tableId: string }) => {
      const { data: order } = await apiClient.get(`/orders/${tableId}/active`)
      if (!order) throw new Error('No active order found')
      if (order.status === 'Bill_Printed') throw new Error('Bill already printed for this table')
      await apiClient.put(`/orders/${order.id}`, { status: 'Bill_Printed' })
      return order
    },
    onSuccess: (order) => {
      toast('Bill generated', 'success')
      queryClient.invalidateQueries({ queryKey: ['tables', selectedAreas] })
      const sentItems = (order.items ?? []).filter((i: { status: string }) => i.status === 'Sent' || i.status === 'Ready')
      apiClient.get('/settings').then(({ data: settings }) => {
        printerApi.printBill({
          printType: 'bill',
          orderId: order.id,
          tableName: order.table?.name ?? '',
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
          guestCount: order.guestCount ?? 2,
          serverName: undefined,
          items: sentItems.map((i: { item?: { name: string }; variation?: { name: string }; name?: string; quantity: number; unitPrice?: number; lineTotal?: number; note?: string }) => ({
            name: (i.variation ? `${i.item?.name ?? i.name} (${i.variation.name})` : i.item?.name ?? i.name) ?? 'Item',
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            lineTotal: i.lineTotal,
            note: i.note,
          })),
          subtotal: order.subtotal ?? 0,
          taxTotal: order.taxTotal ?? 0,
          discountTotal: order.discountTotal ?? 0,
          grandTotal: order.grandTotal ?? 0,
          taxName: 'GST',
          date: new Date().toLocaleString('en-IN', { hour12: false }),
          orderType: 'Dine In',
        }).catch(() => {})
      }).catch(() => {})
      setBillPrintPending(null)
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message
        ?? (err as Error)?.message
        ?? 'Failed to generate bill'
      toast(msg, 'error')
      setBillPrintPending(null)
    },
  })

  const mergeTableMut = useMutation({
    mutationFn: async ({ sourceTableId, destTableId }: { sourceTableId: string; destTableId: string }) => {
      await apiClient.post('/cart/merge-tables', { sourceTableId, destTableId })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables', selectedAreas] })
      setMergeSourceTable(null)
      setMergeDestTableId('')
      toast('Tables merged successfully', 'success')
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message
        ?? (err as Error)?.message
        ?? 'Failed to merge tables'
      toast(msg, 'error')
    },
  })

  const handleTakeaway = useCallback(() => {
    navigate('/cart/takeaway-new')
  }, [navigate])

  const handleTakeawayTap = (orderId: string) => {
    navigate(`/cart/${orderId}`)
  }

  const handleMergeTable = (table: TableData) => {
    setMergeSourceTable(table)
    setMergeDestTableId('')
  }

  const handleBill = (tableId: string) => {
    if (billPrintPending) return
    setBillPrintPending(tableId)
    generateBillMut.mutate({ tableId })
  }

  const handleSettle = async (tableId: string) => {
    const { data: order } = await apiClient.get(`/orders/${tableId}/active`).catch(() => ({ data: null }))
    if (!order) {
      toast('No active order found', 'error')
      return
    }
    setSettleOrder({
      id: order.id,
      grandTotal: order.grandTotal ?? 0,
      subtotal: order.subtotal ?? 0,
      taxTotal: order.taxTotal ?? 0,
      discountTotal: order.discountTotal ?? 0,
      tableName: order.table?.name ?? '',
    })
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AreaFilter areas={areas} selected={selectedAreas} onChange={setSelectedAreas} />
          <button
            onClick={() => setShowNewArea(true)}
            className="rounded p-1 hover:bg-muted"
            title="Create Area"
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="flex items-center gap-4">
          <TableStats total={tables.length} occupied={occupied} available={available} />
          <button
            onClick={handleTakeaway}
            className="flex items-center gap-1 rounded-lg bg-amber-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-amber-600"
          >
            <ShoppingBag size={14} /> Takeaway
          </button>
          <button
            onClick={() => {
              resetTableForm()
              setShowNewTable(true)
            }}
            className="flex items-center gap-1 rounded-lg bg-primary px-4 py-1.5 text-sm text-primary-foreground"
          >
            <Plus size={14} /> Add Table
          </button>
        </div>
      </div>

      {showNewArea && (
        <div
          className="fixed inset-0 z-40 flex items-start justify-center p-4 sm:p-6 lg:p-8 overflow-auto"
          onClick={(e) => { if (e.target === e.currentTarget) setShowNewArea(false) }}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 w-full max-w-xl bg-background rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between gap-4 p-4 border-b">
              <p className="text-2xl font-bold tracking-tight">Create Area</p>
              <button
                onClick={() => setShowNewArea(false)}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-muted hover:bg-muted/80"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[70vh]">
              <div>
                <label className="block text-sm font-medium pb-2">Area Name</label>
                <input
                  value={areaForm.name}
                  onChange={(e) => setAreaForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Main Hall"
                  className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/50"
                  autoFocus
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 bg-muted/50 border-t">
              <button
                onClick={() => setShowNewArea(false)}
                className="min-w-[84px] rounded-lg h-11 px-6 bg-muted text-sm font-medium hover:bg-muted/80"
              >
                Cancel
              </button>
              <button
                onClick={() => areaMut.mutate(areaForm)}
                disabled={areaMut.isPending}
                className="min-w-[84px] rounded-lg h-11 px-6 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800"
              >
                {areaMut.isPending ? 'Saving...' : 'Save Area'}
              </button>
            </div>
          </div>
        </div>
      )}

      {(showNewTable || editingTable) && (
        <div
          className="fixed inset-0 z-40 flex items-start justify-center p-4 sm:p-6 lg:p-8 overflow-auto"
          onClick={(e) => { if (e.target === e.currentTarget) resetTableForm() }}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 w-full max-w-2xl bg-background rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between gap-4 p-4 border-b">
              <p className="text-2xl font-bold tracking-tight">
                {editingTable ? 'Edit Table' : 'Add Table'}
              </p>
              <button
                onClick={resetTableForm}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-muted hover:bg-muted/80"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <label className="block text-sm font-medium pb-2">Area</label>
                  <select
                    value={tableForm.areaId}
                    onChange={(e) => setTableForm((f) => ({ ...f, areaId: e.target.value }))}
                    className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/50"
                    autoFocus
                  >
                    <option value="">Select area</option>
                    {areas.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium pb-2">Table Name</label>
                  <input
                    value={tableForm.name}
                    onChange={(e) => setTableForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. T1"
                    className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium pb-2">Capacity</label>
                  <input
                    type="number"
                    value={tableForm.capacity}
                    onChange={(e) => setTableForm((f) => ({ ...f, capacity: Number(e.target.value) }))}
                    placeholder="e.g. 4"
                    min={1}
                    className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium pb-2">Position</label>
                  <input
                    type="number"
                    value={tableForm.position || ''}
                    onChange={(e) => setTableForm((f) => ({ ...f, position: e.target.value === '' ? 0 : Number(e.target.value) }))}
                    placeholder={
                      tableForm.areaId
                        ? `Auto (next: ${getNextPosition(tableForm.areaId)})`
                        : 'Select area first'
                    }
                    min={1}
                    className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    1 = first position, 5 = fifth position. Leave empty for auto-assign.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 bg-muted/50 border-t">
              <button
                onClick={resetTableForm}
                className="min-w-[84px] rounded-lg h-11 px-6 bg-muted text-sm font-medium hover:bg-muted/80"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const areaId = tableForm.areaId
                  const position = tableForm.position === 0 ? getNextPosition(areaId) : tableForm.position

                  if (editingTable) {
                    updateTableMut.mutate({
                      id: editingTable.id,
                      data: {
                        areaId: tableForm.areaId || undefined,
                        name: tableForm.name,
                        capacity: tableForm.capacity,
                        position,
                      },
                    })
                  } else {
                    tableMut.mutate({ ...tableForm, position })
                  }
                }}
                disabled={tableMut.isPending || updateTableMut.isPending}
                className="min-w-[84px] rounded-lg h-11 px-6 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800"
              >
                {tableMut.isPending || updateTableMut.isPending
                  ? 'Saving...'
                  : editingTable
                  ? 'Update Table'
                  : 'Save Table'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Takeaway Active Orders Grid */}
      {takeawayOrders.length > 0 && (
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-2 border-b border-amber-300 pb-2">
            <ShoppingBag size={16} className="text-amber-600" />
            <h2 className="text-base font-bold tracking-tight text-foreground">Takeaway Orders</h2>
            <span className="text-xs font-medium text-muted-foreground bg-amber-100 px-2 py-0.5 rounded-full">{takeawayOrders.length} active</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
            {takeawayOrders.map((order) => {
              const statusColors: Record<string, string> = {
                Draft: 'bg-gray-100 border-gray-300',
                KOT_Sent: 'bg-yellow-50 border-yellow-300',
                Ready: 'bg-blue-50 border-blue-300',
                Bill_Printed: 'bg-purple-50 border-purple-300',
              }
              const color = statusColors[order.status] ?? statusColors.Draft
              return (
                <div
                  key={order.id}
                  onClick={() => navigate(`/cart/${order.id}`)}
                  className={`cursor-pointer rounded-xl border p-4 shadow-sm hover:shadow-md transition-shadow ${color}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-semibold">{order.displayId || order.id.slice(0, 8)}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-white/60 font-medium">
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                    <Clock size={12} />
                    <span>{new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {order.items.slice(0, 3).map((i) => i.item.name).join(', ')}
                    {order.items.length > 3 && '...'}
                  </p>
                  {order.grandTotal > 0 && (
                    <p className="mt-1 text-sm font-bold">₹{order.grandTotal.toLocaleString()}</p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {Object.entries(groupedByArea).map(([areaName, { areaId, tables: areaTables }]) => (
        <div key={areaName} className="mb-6">
          <div className="mb-3 flex items-center gap-2 border-b border-border pb-2">
            <h2 className="text-base font-bold tracking-tight text-foreground">{areaName}</h2>
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{areaTables.length} tables</span>
            <button
              onClick={() => handleDeleteArea(areaId)}
              className="ml-auto rounded p-0.5 text-muted-foreground/40 hover:text-destructive"
              title="Delete area"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
            {areaTables.map((table) => (
              <TableCard
                key={table.id}
                table={table}
                onBill={handleBill}
                onSettle={handleSettle}
                onDelete={handleDeleteTable}
                onEdit={handleEditTable}
                onMerge={handleMergeTable}
              />
            ))}
          </div>
        </div>
      ))}

      {filteredByArea.length === 0 && (
        <p className="py-12 text-center text-muted-foreground">No tables in selected areas.</p>
      )}

      {settleOrder && (
        <SettlementModal
          order={settleOrder}
          tableName={settleOrder.tableName}
          taxType={(settings?.taxType as 'Inclusive' | 'Exclusive') ?? 'Inclusive'}
          onClose={() => setSettleOrder(null)}
          onSettled={() => {
            const settledTableId = settleOrder?.id
              ? tables.find((t) => t.orders.some((o) => o.id === settleOrder!.id))?.id ?? null
              : null
            setSettleOrder(null)
            if (settledTableId) {
              queryClient.setQueryData(['order', settledTableId], null)
            }
            queryClient.invalidateQueries({ queryKey: ['tables', selectedAreas] })
            queryClient.invalidateQueries({ queryKey: ['takeaway-orders'] })
          }}
        />
      )}

      {mergeSourceTable && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 lg:p-8 overflow-auto"
          onClick={(e) => { if (e.target === e.currentTarget) { setMergeSourceTable(null); setMergeDestTableId('') } }}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 w-full max-w-md bg-background rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between gap-4 p-4 border-b">
              <p className="text-2xl font-bold tracking-tight">Merge Table</p>
              <button onClick={() => { setMergeSourceTable(null); setMergeDestTableId('') }} className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-muted hover:bg-muted/80">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-muted-foreground">
                Merge <strong>{mergeSourceTable.name}</strong> into:
              </p>
              <select
                value={mergeDestTableId}
                onChange={(e) => setMergeDestTableId(e.target.value)}
                className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/50"
                autoFocus
              >
                <option value="">Select destination table</option>
                {tables
                  .filter((t) => t.id !== mergeSourceTable.id && t.status !== 'Available')
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} {t.area ? `(${t.area.name})` : ''}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 bg-muted/50 border-t">
              <button onClick={() => { setMergeSourceTable(null); setMergeDestTableId('') }} className="min-w-[84px] rounded-lg h-11 px-6 bg-muted text-sm font-medium hover:bg-muted/80">
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!mergeDestTableId) { toast('Select a destination table', 'error'); return }
                  mergeTableMut.mutate({ sourceTableId: mergeSourceTable.id, destTableId: mergeDestTableId })
                }}
                disabled={mergeTableMut.isPending}
                className="min-w-[84px] rounded-lg h-11 px-6 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800"
              >
                {mergeTableMut.isPending ? 'Merging...' : 'Merge'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
