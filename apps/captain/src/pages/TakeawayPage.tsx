import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/apiClient'
import { formatCurrency, formatDuration } from '@/lib/format'
import { onSocket } from '@/lib/socket'
import { Plus, ShoppingBag } from 'lucide-react'
import type { CaptainOrder } from '@/lib/types'

export default function TakeawayPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: orders } = useQuery({
    queryKey: ['takeaway-orders'],
    queryFn: async () => (await apiClient.get<CaptainOrder[]>('/orders/takeaway/active')).data,
    refetchInterval: 10_000,
  })

  useEffect(() => {
    const refresh = () => {
      queryClient.invalidateQueries({ queryKey: ['takeaway-orders'] })
    }
    const offTables = onSocket('tables:updated', refresh)
    const offOrder = onSocket('order:updated', refresh)
    return () => {
      offTables()
      offOrder()
    }
  }, [queryClient])

  const createTakeaway = () => {
    navigate('/takeaway/new')
  }

  return (
    <div className="flex h-full flex-col bg-background">
      <header className="flex items-center justify-between px-4 py-3">
        <div>
          <h1 className="text-lg font-bold">Takeaway</h1>
          <p className="text-xs text-muted-foreground">No-table orders</p>
        </div>
        <button
          onClick={createTakeaway}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-all active:scale-95"
        >
          <Plus size={15} /> New
        </button>
      </header>

      <div className="scrollbar-none min-h-0 flex-1 overflow-y-auto px-4 pb-4">
        {(orders ?? []).length === 0 && (
          <div className="flex flex-col items-center gap-2 py-20 text-center">
            <ShoppingBag size={32} className="text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No active takeaway orders.</p>
          </div>
        )}
        <div className="space-y-2">
          {(orders ?? []).map((o) => (
            <button
              key={o.id}
              onClick={() => navigate(`/takeaway/${o.id}`)}
              className="flex w-full items-center justify-between rounded-xl border bg-card p-4 text-left shadow-sm transition-all active:scale-[0.98] hover:border-primary/30"
            >
              <div>
                <p className="text-sm font-semibold">#{o.id.slice(0, 6).toUpperCase()}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {o.items.length} items · {formatDuration(o.createdAt)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">{formatCurrency(o.grandTotal)}</p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase text-muted-foreground">
                  {o.status.replace('_', ' ')}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
