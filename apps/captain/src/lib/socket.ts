import { io, type Socket } from 'socket.io-client'
import { getBaseUrl, onConnectionChange } from './connection'

let socket: Socket | null = null
let socketUrl: string | null = null
const tableSubscriptions = new Set<string>()

function defaultUrl(): string {
  return getBaseUrl() ?? 'http://localhost:3001'
}

export function getSocket(): Socket {
  const base = defaultUrl()
  if (!socket || base !== socketUrl) {
    if (socket) {
      socket.disconnect()
    }
    socketUrl = base
    socket = io(base, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 8000,
    })
    socket.on('connect', () => {
      tableSubscriptions.forEach((tableId) => socket?.emit('subscribe:table', tableId))
    })
  }
  return socket
}

export function subscribeTable(tableId: string) {
  tableSubscriptions.add(tableId)
  getSocket().emit('subscribe:table', tableId)
}

export function unsubscribeTable(tableId: string) {
  tableSubscriptions.delete(tableId)
  getSocket().emit('unsubscribe:table', tableId)
}

export function onSocket(event: string, callback: (...args: unknown[]) => void): () => void {
  const s = getSocket()
  s.on(event, callback)
  return () => {
    s.off(event, callback)
  }
}

// Reconnect with the new base URL when the user re-pairs to a different POS.
let lastKnownUrl = getBaseUrl()
onConnectionChange(() => {
  const next = getBaseUrl()
  if (next && next !== lastKnownUrl && socket) {
    lastKnownUrl = next
    socketUrl = null
    getSocket()
  }
})
