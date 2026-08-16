const STORAGE_KEY = 'akrdev-pos-url'

export interface ConnectionState {
  posUrl: string | null
  isConnected: boolean
  isChecking: boolean
}

type Listener = (state: ConnectionState) => void

const listeners = new Set<Listener>()

let state: ConnectionState = {
  posUrl: null,
  isConnected: false,
  isChecking: false,
}

function notify() {
  const snapshot = { ...state }
  listeners.forEach((fn) => fn(snapshot))
}

function setConnected(value: boolean) {
  if (state.isConnected !== value) {
    state.isConnected = value
    notify()
  }
}

export function getBaseUrl(): string | null {
  if (state.posUrl) return state.posUrl
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    state.posUrl = stored
    return stored
  }
  return null
}

export function getConnectionState(): ConnectionState {
  return { ...state }
}

export function onConnectionChange(fn: Listener): () => void {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

export function setPosUrl(url: string) {
  const normalized = url.replace(/\/+$/, '')
  state.posUrl = normalized
  localStorage.setItem(STORAGE_KEY, normalized)
  state.isConnected = true
  notify()
}

export function clearPosUrl() {
  state.posUrl = null
  state.isConnected = false
  localStorage.removeItem(STORAGE_KEY)
  notify()
}

export async function healthCheck(): Promise<boolean> {
  const base = getBaseUrl()
  if (!base) {
    setConnected(false)
    return false
  }
  state.isChecking = true
  notify()
  try {
    const res = await fetch(`${base}/api/v1/health`, { signal: AbortSignal.timeout(4000) })
    setConnected(res.ok)
    return res.ok
  } catch {
    setConnected(false)
    return false
  } finally {
    state.isChecking = false
    notify()
  }
}
