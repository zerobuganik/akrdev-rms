import { useEffect, useState } from 'react'
import { RefreshCw, CheckCircle2, XCircle, Wifi, WifiOff } from 'lucide-react'

interface SyncState {
  total: number
  completed: number
  phase: string
  error: string | null
  complete: boolean
}

export interface SyncScreenProps {
  onComplete: () => void
  phone?: string
  password?: string
}

export function SyncScreen({ onComplete, phone, password }: SyncScreenProps) {
  const [state, setState] = useState<SyncState>({ total: 8, completed: 0, phase: 'Starting...', error: null, complete: false })
  const [triggered, setTriggered] = useState(false)

  useEffect(() => {
    if (triggered) return
    setTriggered(true)

    // Trigger sync on the local API
    const base = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001/api/v1'
    fetch(`${base}/sync/trigger`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password }),
    }).catch(() => {})

    // Poll progress every 500ms
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${base}/sync-progress`)
        const data = await res.json() as SyncState & { tablesCached: number; itemsCached: number; settingsCached: boolean }
        setState(data)
        if (data.complete || (data.tablesCached > 0 && data.settingsCached && data.completed >= data.total)) {
          clearInterval(interval)
          setTimeout(onComplete, 800)
        }
      } catch {
        // Keep polling
      }
    }, 500)

    return () => clearInterval(interval)
  }, [triggered])

  const pct = state.total > 0 ? Math.round((state.completed / state.total) * 100) : 0

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950">
      <div className="w-full max-w-sm px-8 text-center">
        {/* Logo / Brand */}
        <div className="mb-8">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 shadow-lg shadow-rose-500/25">
            <span className="text-2xl font-black text-white">T</span>
          </div>
          <h1 className="text-xl font-semibold text-white">Topshe POS</h1>
          <p className="mt-1 text-sm text-gray-400">Downloading your restaurant data...</p>
        </div>

        {/* Progress bar */}
        <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-gray-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-rose-500 to-orange-500 transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Phase indicator */}
        <div className="mb-6 flex items-center justify-center gap-2 text-sm">
          {state.error ? (
            <>
              <XCircle className="h-4 w-4 text-red-400" />
              <span className="text-red-400">{state.error}</span>
            </>
          ) : state.complete ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              <span className="text-green-400">All data synced</span>
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 animate-spin text-rose-400" />
              <span className="text-gray-300">{state.phase}</span>
            </>
          )}
        </div>

        {/* Download items checklist */}
        <div className="space-y-2 text-left">
          {['Tables', 'Settings', 'Categories', 'Menu Items', 'Employees', 'Tax Slabs', 'Areas', 'Orders'].map((label, i) => (
            <div key={label} className={`flex items-center gap-2 rounded px-3 py-1.5 text-xs transition-colors ${
              i < state.completed ? 'text-green-400 bg-green-400/10' :
              i === state.completed && !state.error ? 'text-rose-400 bg-rose-400/10' :
              'text-gray-600'
            }`}>
              {i < state.completed ? (
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              ) : i === state.completed && !state.error ? (
                <RefreshCw className="h-3.5 w-3.5 shrink-0 animate-spin" />
              ) : (
                <div className="h-3.5 w-3.5 shrink-0 rounded-full border border-gray-700" />
              )}
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* Connection indicator */}
        <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-gray-500">
          {state.error ? <WifiOff className="h-3 w-3" /> : <Wifi className="h-3 w-3" />}
          <span>Cloud: {state.error ? 'Offline' : 'Connected'}</span>
        </div>
      </div>
    </div>
  )
}
