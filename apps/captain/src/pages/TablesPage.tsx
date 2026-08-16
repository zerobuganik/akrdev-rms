import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/apiClient'
import { getTableStatusStyle, formatCurrency, formatDuration } from '@/lib/format'
import { healthCheck } from '@/lib/connection'
import { onSocket } from '@/lib/socket'
import { Users, WifiOff, Clock } from 'lucide-react'
import type { CaptainTable } from '@/lib/types'

export default function TablesPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [now, setNow] = useState(Date.now())
  const [online, setOnline] = useState(true)

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    return onSocket('tables:updated', () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] })
    })
  }, [queryClient])

  useEffect(() => {
    void healthCheck().then(setOnline)
    const t = setInterval(() => {
      void healthCheck().then(setOnline)
    }, 8000)
    return () => clearInterval(t)
  }, [])

  const { data: tables } = useQuery({
    queryKey: ['tables'],
    queryFn: async () => (await apiClient.get<CaptainTable[]>('/tables')).data,
    refetchInterval: 10_000,
  })

  const groups = useMemo(() => {
    const map = new Map<string, CaptainTable[]>()
    for (const t of tables ?? []) {
      const key = t.area?.name ?? 'General'
      const list = map.get(key)
      if (list) list.push(t)
      else map.set(key, [t])
    }
    return [...map.entries()]
  }, [tables])

  const occupiedCount = (tables ?? []).filter((t) => t.status === 'Occupied' || t.status === 'KOT_Pending').length
  const totalCount = tables?.length ?? 0

  return (
    <div className="flex h-full flex-col bg-muted/30">
      <header className="flex items-center justify-between bg-background px-4 py-3">
        <div>
          <h1 className="text-lg font-bold">Tables</h1>
          <p className="text-xs text-muted-foreground">
            {occupiedCount} occupied · {totalCount} total
          </p>
        </div>
      </header>

      {!online && (
        <div className="flex items-center justify-center gap-2 bg-amber-100 px-4 py-2 text-sm font-medium text-amber-800">
          <WifiOff size={15} /> Offline — connect to the POS WiFi
        </div>
      )}

      <div className="scrollbar-none min-h-0 flex-1 overflow-y-auto px-3 pb-4 pt-3">
        {groups.length === 0 && (
          <p className="py-16 text-center text-sm text-muted-foreground">No tables found.</p>
        )}
        {groups.map(([areaName, areaTables]) => (
          <section key={areaName} className="mb-5">
            <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {areaName}
            </h2>
            <div className="grid grid-cols-2 gap-2.5">
              {areaTables.map((t) => {
                const style = getTableStatusStyle(t.status)
                const order = t.orders?.[0] ?? null
                const isOccupied = t.status === 'Occupied' || t.status === 'KOT_Pending'
                const timerStart = order?.firstKotAt ?? null
                return (
                  <button
                    key={t.id}
                    onClick={() => navigate(`/cart/${t.id}`)}
                    className={`relative rounded-xl border p-3 text-left shadow-sm transition-all active:scale-[0.97] ${style.cardBg} ${style.accentBorder}`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="truncate text-[15px] font-bold text-foreground">{t.name}</span>
                      <span className="flex shrink-0 items-center gap-1 rounded-md bg-black/5 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                        <Users size={11} /> {t.capacity}
                      </span>
                    </div>

                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full ${style.dot}`} />
                      <span className={`text-xs font-semibold ${style.timerColor}`}>{style.label}</span>
                    </div>

                    {isOccupied && timerStart && (
                      <div className="mt-2 space-y-0.5">
                        <p className={`flex items-center gap-1 font-mono text-sm ${style.timerColor}`}>
                          <Clock size={12} /> {formatDuration(timerStart)}
                        </p>
                        {order && (
                          <p className="text-sm font-bold text-foreground">{formatCurrency(order.grandTotal)}</p>
                        )}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </section>
        ))}
        <div className="h-4" />
      </div>
    </div>
  )
}
