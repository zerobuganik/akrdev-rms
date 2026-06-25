import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '@/lib/apiClient'
import { Users, WifiOff, Timer } from 'lucide-react'
import { lightHaptic } from '@/lib/native-bridge'
import { getConnectionState } from '@/lib/connection-manager'
import { useEffect, useState, useMemo, useRef } from 'react'

interface TableArea {
  id: string
  name: string
}

interface Table {
  id: string
  name: string
  status: string
  capacity: number
  position: number
  area?: TableArea | null
  activeOrder?: { grandTotal: number; status: string; createdAt: string; updatedAt?: string } | null
}

const statusConfig: Record<string, { cardBg: string; timerColor: string; accentBorder: string; label: string; subLabel: string | null }> = {
  Available:   { cardBg: 'bg-gray-100',   timerColor: 'text-gray-400',   accentBorder: 'border-gray-300',  label: 'Vacant',         subLabel: 'Tap to occupy' },
  Reserved:    { cardBg: 'bg-sky-100',    timerColor: 'text-sky-600',    accentBorder: 'border-sky-300',   label: 'Reserved',      subLabel: null },
  Occupied:    { cardBg: 'bg-amber-100',  timerColor: 'text-amber-700',  accentBorder: 'border-amber-300', label: 'Occupied',      subLabel: null },
  KOT_Pending: { cardBg: 'bg-orange-100', timerColor: 'text-orange-700', accentBorder: 'border-orange-300',label: 'KOT Pending',   subLabel: null },
  Billed:      { cardBg: 'bg-purple-100', timerColor: 'text-purple-700', accentBorder: 'border-purple-300',label: 'Bill Printed',  subLabel: null },
  Settled:     { cardBg: 'bg-gray-100',   timerColor: 'text-gray-400',   accentBorder: 'border-gray-300',  label: 'Settled',       subLabel: null },
}

function getStatusConfig(status: string) {
  return statusConfig[status] ?? { cardBg: 'bg-gray-100', timerColor: 'text-gray-400', accentBorder: 'border-gray-300', label: status, subLabel: null }
}

function formatDuration(createdAt: string) {
  const diff = Date.now() - new Date(createdAt).getTime()
  const totalSec = Math.floor(diff / 1000)
  const hrs = Math.floor(totalSec / 3600)
  const mins = Math.floor((totalSec % 3600) / 60)
  const secs = totalSec % 60
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

function DurationDisplay({ createdAt }: { createdAt: string }) {
  const [display, setDisplay] = useState(formatDuration(createdAt))
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    setDisplay(formatDuration(createdAt))
    intervalRef.current = setInterval(() => setDisplay(formatDuration(createdAt)), 1000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [createdAt])

  return <>{display}</>
}

export default function TablesPage() {
  const navigate = useNavigate()
  const [connected, setConnected] = useState(true)

  useEffect(() => {
    setConnected(getConnectionState().isConnected)
  }, [])

  const { data: tables = [], isLoading } = useQuery<Table[]>({
    queryKey: ['tables-local'],
    queryFn: async () => {
      const { data } = await apiClient.get('/tables')
      return Array.isArray(data) ? data : []
    },
    refetchInterval: 5_000,
    staleTime: 0,
  })

  const tablesByArea = useMemo(() => {
    const map = new Map<string, { area: TableArea | null; tables: Table[] }>()
    for (const table of tables) {
      const key = table.area?.id ?? '__no_area__'
      if (!map.has(key)) {
        map.set(key, { area: table.area ?? null, tables: [] })
      }
      map.get(key)!.tables.push(table)
    }
    return Array.from(map.entries()).map(([, group]) => ({
      ...group,
      tables: [...group.tables].sort((a, b) => (a.position ?? 0) - (b.position ?? 0)),
    }))
  }, [tables])

  const totalTables = tables.length
  const occupiedTables = tables.filter(t => t.status !== 'Available' && t.status !== 'Settled').length
  const availableTables = tables.filter(t => t.status === 'Available').length

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-background">
      <header className="shrink-0 bg-card border-b px-4 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">Tables</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                <span className="text-muted-foreground">{availableTables}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                <span className="text-muted-foreground">{occupiedTables}</span>
              </div>
              <span className="font-bold text-muted-foreground">{totalTables}</span>
            </div>
            {!connected && (
              <span className="flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-600">
                <WifiOff size={11} /> Offline
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto">
        {tables.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
            <p className="text-sm font-medium">No tables available</p>
            <p className="text-xs mt-1">Add tables in the POS settings</p>
          </div>
        ) : (
          <div className="p-3 space-y-5">
            {tablesByArea.map(({ area, tables: areaTables }) => (
              <div key={area?.id ?? '__no_area__'}>
                <div className="flex items-center gap-2 mb-2.5">
                  <h2 className="text-sm font-bold tracking-tight">{area?.name ?? 'Unassigned'}</h2>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                    {areaTables.length}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {areaTables.map((table) => {
                    const config = getStatusConfig(table.status)
                    const isOccupied = table.status !== 'Available' && table.status !== 'Reserved' && table.status !== 'Settled'
                    const isBilled = table.status === 'Billed'
                    const order = table.activeOrder
                    const hasAmount = order && order.grandTotal > 0

                    return (
                      <button
                        key={table.id}
                        onClick={() => {
                          lightHaptic()
                          navigate(`/cart/${table.id}?name=${encodeURIComponent(table.name)}`)
                        }}
                        className={`flex flex-col rounded-xl border p-3 text-left transition-all active:scale-[0.97] shadow-sm hover:shadow-md ${config.cardBg} ${config.accentBorder}`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-lg font-bold truncate">{table.name}</span>
                          <div className="flex shrink-0 items-center gap-1 text-gray-500">
                            <Users size={13} />
                            <span className="text-xs font-medium">{table.capacity}</span>
                          </div>
                        </div>

                        <div className="flex flex-col items-center justify-center flex-1">
                          {isOccupied && order?.createdAt && !isBilled ? (
                            <>
                              <div className={`flex items-center gap-1.5 ${config.timerColor}`}>
                                <Timer size={15} />
                                <span className="text-sm font-bold tabular-nums">
                                  <DurationDisplay createdAt={order.createdAt} />
                                </span>
                              </div>
                              <p className="mt-1 text-sm font-semibold tabular-nums">
                                {hasAmount ? `₹${order.grandTotal.toLocaleString()}` : '—'}
                              </p>
                            </>
                          ) : isBilled ? (
                            <>
                              <div className={`flex items-center gap-1.5 ${config.timerColor}`}>
                                <Timer size={15} />
                                <span className="text-sm font-bold tabular-nums">
                                  {order?.createdAt ? <DurationDisplay createdAt={order.createdAt} /> : '—'}
                                </span>
                              </div>
                              <p className="mt-0.5 text-xs text-gray-400">Since bill printed</p>
                              <p className="mt-1 text-sm font-semibold tabular-nums">
                                {hasAmount ? `₹${order!.grandTotal.toLocaleString()}` : '—'}
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="text-sm text-gray-400">{config.label}</p>
                              {config.subLabel && <p className="text-xs text-gray-400">{config.subLabel}</p>}
                            </>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
