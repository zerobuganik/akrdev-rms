import { Server as SocketIOServer } from 'socket.io'

interface TableLock {
  tableId: string
  userId: string
  userName: string
  acquiredAt: Date
  timeout: NodeJS.Timeout
}

const locks = new Map<string, TableLock>()
const socketLocks = new Map<string, string[]>()
const LOCK_TIMEOUT_MS = 5 * 60 * 1000

let io: SocketIOServer | null = null

export function setSocketIO(server: SocketIOServer) {
  io = server
}

function broadcastLockState(tableId: string, locked: boolean, owner?: string) {
  if (!io) return
  io.to(`table:${tableId}`).emit('cart:lock', { tableId, locked, owner })
}

export const tableLockService = {
  acquire(tableId: string, userId: string, userName: string, socketId?: string): boolean {
    const existing = locks.get(tableId)
    if (existing) {
      if (existing.userId === userId) {
        clearTimeout(existing.timeout)
        existing.timeout = setTimeout(() => this.release(tableId), LOCK_TIMEOUT_MS)
        return true
      }
      return false
    }

    const timeout = setTimeout(() => this.release(tableId), LOCK_TIMEOUT_MS)
    locks.set(tableId, { tableId, userId, userName, acquiredAt: new Date(), timeout })
    if (socketId) {
      const existingSockets = socketLocks.get(socketId) ?? []
      existingSockets.push(tableId)
      socketLocks.set(socketId, existingSockets)
    }
    broadcastLockState(tableId, true, userName)
    return true
  },

  release(tableId: string): void {
    const lock = locks.get(tableId)
    if (lock) {
      clearTimeout(lock.timeout)
      locks.delete(tableId)
      broadcastLockState(tableId, false)
    }
  },

  releaseForSocket(socketId: string): void {
    const tableIds = socketLocks.get(socketId)
    if (!tableIds) return
    for (const tableId of tableIds) {
      this.release(tableId)
    }
    socketLocks.delete(socketId)
  },

  getLock(tableId: string): { userId: string; userName: string } | null {
    const lock = locks.get(tableId)
    return lock ? { userId: lock.userId, userName: lock.userName } : null
  },

  getAllLocks(): Array<{ tableId: string; userId: string; userName: string }> {
    return Array.from(locks.values()).map((l) => ({
      tableId: l.tableId,
      userId: l.userId,
      userName: l.userName,
    }))
  },
}
