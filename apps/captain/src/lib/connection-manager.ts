import { discoverEndpoints, tryConnect } from './network-discovery.js'

type ApiSource = 'local' | 'cloud'

interface ConnectionState {
  currentUrl: string | null
  source: ApiSource | null
  isConnected: boolean
  isDiscovering: boolean
}

type Listener = (state: ConnectionState) => void

const listeners: Listener[] = []
let state: ConnectionState = {
  currentUrl: null,
  source: null,
  isConnected: false,
  isDiscovering: false,
}

let healthTimer: ReturnType<typeof setInterval> | null = null

export function getBaseUrl(): string | null {
  console.log('[connection-manager] getBaseUrl called, currentUrl:', state.currentUrl)
  if (state.currentUrl) return state.currentUrl
  // Fallback: read from localStorage if in-memory state was lost (e.g. page reload)
  const posUrl = localStorage.getItem('akrdev-pos-url')
  const cloudUrl = localStorage.getItem('akrdev-cloud-url')
  const stored = localStorage.getItem('akrdev-rms-config')
  if (posUrl) {
    state.currentUrl = posUrl
    state.source = 'local'
    state.isConnected = true
    return posUrl
  }
  if (cloudUrl) {
    state.currentUrl = cloudUrl
    state.source = 'cloud'
    return cloudUrl
  }
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      if (parsed.length > 0) {
        state.currentUrl = parsed[0].url
        state.source = parsed[0].source
        state.isConnected = true
        return parsed[0].url
      }
    } catch { /* ignore */ }
  }
  return null
}

export function getConnectionState(): ConnectionState {
  return { ...state }
}

export function onConnectionChange(fn: Listener): () => void {
  listeners.push(fn)
  return () => {
    const idx = listeners.indexOf(fn)
    if (idx >= 0) listeners.splice(idx, 1)
  }
}

function notifyListeners() {
  const snapshot = { ...state }
  listeners.forEach((fn) => fn(snapshot))
}

async function connectToEndpoint(url: string): Promise<boolean> {
  console.log('[connection-manager] Trying to connect to:', url)
  const ok = await tryConnect(url)
  console.log('[connection-manager] Connect result for', url, ':', ok)
  if (ok) {
    state.currentUrl = url
    state.source = url.includes('localhost') || url.includes('192.168') ? 'local' : 'cloud'
    state.isConnected = true
    notifyListeners()
  }
  return ok
}

export async function initConnection(): Promise<void> {
  console.log('[connection-manager] initConnection called')
  state.isDiscovering = true
  notifyListeners()

  const endpoints = await discoverEndpoints()
  console.log('[connection-manager] Discovered endpoints:', endpoints)

  for (const ep of endpoints) {
    const ok = await connectToEndpoint(ep.url)
    if (ok) break
  }

  state.isDiscovering = false
  notifyListeners()

  console.log('[connection-manager] Final state:', { currentUrl: state.currentUrl, isConnected: state.isConnected })

  startHealthCheck()
}

function startHealthCheck() {
  if (healthTimer) clearInterval(healthTimer)
  healthTimer = setInterval(async () => {
    if (!state.currentUrl) return

    const healthy = await tryConnect(state.currentUrl)
    if (!healthy) {
      state.isConnected = false
      notifyListeners()

      const endpoints = await discoverEndpoints()
      for (const ep of endpoints) {
        if (ep.url !== state.currentUrl) {
          const ok = await connectToEndpoint(ep.url)
          if (ok) return
        }
      }

      const ok = await connectToEndpoint(state.currentUrl)
      if (ok) return
    }

    if (healthy && !state.isConnected) {
      state.isConnected = true
      notifyListeners()
    }
  }, 5000)
}

export function disconnect() {
  if (healthTimer) clearInterval(healthTimer)
  state.currentUrl = null
  state.source = null
  state.isConnected = false
  notifyListeners()
}
