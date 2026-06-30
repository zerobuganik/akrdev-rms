import { useEffect, useRef, useState } from 'react'
import { RefreshCw, CheckCircle2, XCircle, Wifi, WifiOff } from 'lucide-react'

interface SyncState {
  total: number
  completed: number
  phase: string
  error: string | null
  complete: boolean
  tablesCached: number
  itemsCached: number
  settingsCached: boolean
  categoriesCached: number
  employeesCached: number
  cloudApiBase: string
}

export interface SyncScreenProps {
  onComplete: () => void
  authToken?: string
}

export function SyncScreen({ onComplete, authToken }: SyncScreenProps) {
  const [state, setState] = useState<SyncState>({
    total: 8, completed: 0, phase: 'Starting...', error: null, complete: false,
    tablesCached: 0, itemsCached: 0, settingsCached: false, categoriesCached: 0, employeesCached: 0, cloudApiBase: '',
  })
  const triggeredRef = useRef(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    const base = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001/api/v1'

    let triggerAttempts = 0
    let pollTimer: ReturnType<typeof setInterval> | null = null

    const triggerSync = () => {
      if (triggerAttempts >= 3) return
      triggerAttempts++
      fetch(`${base}/sync/trigger`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken ?? ''}` },
      }).catch(() => {})
    }

    const poll = async () => {
      try {
        const res = await fetch(`${base}/sync-progress`)
        if (!res.ok) return
        const data = await res.json() as SyncState
        setState(data)
        const done = data.complete || data.phase === 'complete' || (data.tablesCached > 0 && data.settingsCached && data.completed >= data.total)
        if (done) {
          if (pollTimer) { clearInterval(pollTimer); pollTimer = null }
          onCompleteRef.current()
          return
        }
        if (data.error && data.completed === 0 && data.phase === 'error') {
          triggerSync()
        }
      } catch {
        // Poling will continue
      }
    }

    // First poll immediately to check if data already exists
    poll()

    // Start interval polling
    pollTimer = setInterval(poll, 500)

    return () => {
      if (pollTimer) clearInterval(pollTimer)
    }
  }, []) // empty deps — runs once

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
          ) : state.complete || state.phase === 'complete' ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              <span className="text-green-400">All data synced — opening POS...</span>
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
          {[
            { label: 'Tables', count: state.tablesCached },
            { label: 'Settings', count: state.settingsCached ? 1 : 0 },
            { label: 'Categories', count: state.categoriesCached },
            { label: 'Menu Items', count: state.itemsCached },
            { label: 'Employees', count: state.employeesCached },
            { label: 'Tax Slabs', count: state.completed >= 6 ? 1 : 0 },
            { label: 'Areas', count: state.completed >= 7 ? 1 : 0 },
            { label: 'Orders', count: state.completed >= 8 ? 1 : 0 },
          ].map((item, i) => (
            <div key={item.label} className={`flex items-center gap-2 rounded px-3 py-1.5 text-xs transition-colors ${
              item.count > 0 || i < state.completed ? 'text-green-400 bg-green-400/10' :
              i === state.completed && !state.error ? 'text-rose-400 bg-rose-400/10' :
              'text-gray-600'
            }`}>
              {item.count > 0 || i < state.completed ? (
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              ) : i === state.completed && !state.error ? (
                <RefreshCw className="h-3.5 w-3.5 shrink-0 animate-spin" />
              ) : (
                <div className="h-3.5 w-3.5 shrink-0 rounded-full border border-gray-700" />
              )}
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Connection + debug */}
        <div className="mt-6 flex flex-col items-center gap-1 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            {state.error ? <WifiOff className="h-3 w-3" /> : <Wifi className="h-3 w-3" />}
            <span>Cloud: {state.error ? 'Offline' : state.cloudApiBase || 'Connected'}</span>
          </div>
          <div className="text-gray-700">
            {state.completed}/{state.total} | {state.phase}
          </div>
        </div>
      </div>
    </div>
  )
}
