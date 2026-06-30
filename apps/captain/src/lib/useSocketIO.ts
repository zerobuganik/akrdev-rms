import { useEffect } from 'react'
import { io } from 'socket.io-client'
import { getBaseUrl } from './connection-manager.js'

let socket: ReturnType<typeof io> | null = null
let connectionCount = 0

const listenerRegistry: Array<{ event: string; cb: (...args: unknown[]) => void }> = []

export function getSocketIO() {
  if (!socket) {
    const baseUrl = getBaseUrl()
    socket = io(baseUrl ?? 'http://localhost:3001', {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    })
    // Re-register listeners on the new socket instance
    for (const entry of listenerRegistry) {
      socket.on(entry.event, entry.cb)
    }
  }
  return socket
}

export function useSocketIO() {
  useEffect(() => {
    const s = getSocketIO()
    connectionCount++
    if (!s.connected) s.connect()
    return () => {
      connectionCount--
      if (connectionCount <= 0) {
        connectionCount = 0
        s.disconnect()
        // Don't null the socket so re-registered listeners are preserved
      }
    }
  }, [])

  return {
    subscribeToTable: (tableId: string) => getSocketIO().emit('subscribe:table', tableId),
    unsubscribeFromTable: (tableId: string) => getSocketIO().emit('unsubscribe:table', tableId),
    on: (event: string, cb: (...args: unknown[]) => void) => {
      listenerRegistry.push({ event, cb })
      getSocketIO().on(event, cb)
      return () => {
        getSocketIO().off(event, cb)
        const idx = listenerRegistry.findIndex((e) => e.event === event && e.cb === cb)
        if (idx >= 0) listenerRegistry.splice(idx, 1)
      }
    },
  }
}
