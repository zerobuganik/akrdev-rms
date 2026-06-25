import { useEffect, useRef, useState } from 'react'
import { io, type Socket } from 'socket.io-client'

const WS_URL = import.meta.env.VITE_WS_URL

let socket: ReturnType<typeof io> | null = null

export function getSocketIO(): Socket | null {
  if (!WS_URL) return null
  if (!socket) {
    socket = io(WS_URL, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    })
  }
  return socket
}

export function useSocketIO() {
  const [connected, setConnected] = useState(false)
  const connectedRef = useRef(false)

  useEffect(() => {
    const s = getSocketIO()
    if (!s) return

    const handleConnect = () => { connectedRef.current = true; setConnected(true) }
    const handleDisconnect = () => { connectedRef.current = false; setConnected(false) }

    s.on('connect', handleConnect)
    s.on('disconnect', handleDisconnect)

    if (!s.connected) {
      s.connect()
    } else {
      setConnected(true)
    }

    return () => {
      s.off('connect', handleConnect)
      s.off('disconnect', handleDisconnect)
    }
  }, [])

  return {
    subscribeToTable: (tableId: string) => {
      const s = getSocketIO()
      if (s) s.emit('subscribe:table', tableId)
    },
    unsubscribeFromTable: (tableId: string) => {
      const s = getSocketIO()
      if (s) s.emit('unsubscribe:table', tableId)
    },
    on: (event: string, callback: (...args: unknown[]) => void): (() => void) => {
      const s = getSocketIO()
      if (!s) return () => {}
      s.on(event, callback)
      return () => { s.off(event, callback) }
    },
    connected,
  }
}
