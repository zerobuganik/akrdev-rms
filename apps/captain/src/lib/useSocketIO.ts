import { useEffect } from 'react'
import { io } from 'socket.io-client'
import { getBaseUrl } from './connection-manager.js'

let socket: ReturnType<typeof io> | null = null
let connectionCount = 0

export function getSocketIO() {
  if (!socket) {
    const baseUrl = getBaseUrl()
    socket = io(baseUrl ?? 'http://localhost:3001', {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    })
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
        s.disconnect()
        socket = null
        connectionCount = 0
      }
    }
  }, [])

  return {
    subscribeToTable: (tableId: string) => getSocketIO().emit('subscribe:table', tableId),
    unsubscribeFromTable: (tableId: string) => getSocketIO().emit('unsubscribe:table', tableId),
    on: (event: string, cb: (...args: unknown[]) => void) => {
      getSocketIO().on(event, cb)
      return () => getSocketIO().off(event, cb)
    },
  }
}
