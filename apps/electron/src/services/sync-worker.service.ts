import { syncQueueService } from './sync-queue.service.js'
import { getCloudAccessToken, setCloudAccessToken, getCloudRefreshToken, setCloudRefreshToken } from '../lib/token-store.js'

function getCloudApiBase(): string {
  return process.env.CLOUD_API_URL ?? 'http://localhost:3000/api/v1'
}
const HEALTH_CHECK_INTERVAL = 60_000
const SYNC_INTERVAL = 5_000
const MAX_RETRIES = 5

export class SyncWorkerService {
  private healthTimer: NodeJS.Timeout | null = null
  private syncTimer: NodeJS.Timeout | null = null
  private cloudAvailable = false
  private cloudToken: string | null = null
  private running = false

  setCloudToken(token: string | null) {
    this.cloudToken = token
  }

  async start() {
    this.cloudToken = getCloudAccessToken()
    await syncQueueService.resetStaleSyncing()
    this.cloudAvailable = true
    this.running = true
    this.syncTimer = setInterval(() => this.processQueue(), SYNC_INTERVAL)
  }

  async stop() {
    this.running = false
    if (this.healthTimer) clearInterval(this.healthTimer)
    if (this.syncTimer) clearInterval(this.syncTimer)
    // Wait briefly for any in-flight processQueue to finish
    await new Promise((r) => setTimeout(r, 500))
  }

  private async checkHealth() {
    try {
      const response = await fetch(`${getCloudApiBase()}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      })
      if (response.ok) {
        this.cloudAvailable = true
        await syncQueueService.setCloudAvailable(true)
      }
    } catch {
      this.cloudAvailable = false
      await syncQueueService.setCloudAvailable(false)
    }
  }

  async processQueue() {
    if (await syncQueueService.isSyncInProgress()) return

    await syncQueueService.setSyncInProgress(true)

    try {
      const items = await syncQueueService.getPending()
      for (const item of items) {
        try {
          const payload = JSON.parse(item.payload) as Record<string, unknown>
          await this.executeSyncItem(item.action, payload)
          await syncQueueService.markSynced(item.id)
        } catch (err) {
          const state = await syncQueueService.getState()
          const currentBackoffMs = state?.backoffMs ?? 1000
          const nextBackoffMs = Math.min(currentBackoffMs * 2, 32_000)
          await syncQueueService.markFailed(item.id, String(err), nextBackoffMs)
        }
      }
      // Periodically clean up completed items to prevent DB bloat
      await syncQueueService.clearCompleted()
    } finally {
      await syncQueueService.setSyncInProgress(false)
    }
  }

  private async executeSyncItem(action: string, payload: Record<string, unknown>) {
    const token = this.cloudToken ?? getCloudAccessToken()
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`
    switch (action) {
      case 'create-order': {
        await this.fetchWithRetry(`${getCloudApiBase()}/orders`, {
          method: 'POST', headers, body: JSON.stringify(payload),
        })
        break
      }
      case 'add-item': {
        await this.fetchWithRetry(`${getCloudApiBase()}/cart/add-item`, {
          method: 'POST', headers, body: JSON.stringify(payload),
        })
        break
      }
      case 'remove-item': {
        await this.fetchWithRetry(`${getCloudApiBase()}/cart/remove-item`, {
          method: 'POST', headers, body: JSON.stringify(payload),
        })
        break
      }
      case 'send-kot': {
        await this.fetchWithRetry(`${getCloudApiBase()}/kot/send`, {
          method: 'POST', headers, body: JSON.stringify(payload),
        })
        break
      }
      case 'update-order-status': {
        const { orderId, status } = payload as { orderId: string; status: string }
        await this.fetchWithRetry(`${getCloudApiBase()}/orders/${orderId}`, {
          method: 'PUT', headers, body: JSON.stringify({ status }),
        })
        break
      }
      case 'item-note': {
        await this.fetchWithRetry(`${getCloudApiBase()}/cart/item-note`, {
          method: 'PUT', headers, body: JSON.stringify(payload),
        })
        break
      }
      case 'order-note': {
        await this.fetchWithRetry(`${getCloudApiBase()}/cart/order-note`, {
          method: 'PUT', headers, body: JSON.stringify(payload),
        })
        break
      }
      case 'guest-count': {
        await this.fetchWithRetry(`${getCloudApiBase()}/cart/guest-count`, {
          method: 'PUT', headers, body: JSON.stringify(payload),
        })
        break
      }
      case 'assign-customer': {
        await this.fetchWithRetry(`${getCloudApiBase()}/cart/assign-customer`, {
          method: 'POST', headers, body: JSON.stringify(payload),
        })
        break
      }
      case 'send-kot-with-items': {
        await this.fetchWithRetry(`${getCloudApiBase()}/kot/send-with-items`, {
          method: 'POST', headers, body: JSON.stringify(payload),
        })
        break
      }
      case 'settle': {
        await this.fetchWithRetry(`${getCloudApiBase()}/settlement`, {
          method: 'POST', headers, body: JSON.stringify(payload),
        })
        break
      }
      case 'admin-create': {
        const pathCreate = payload.path as string
        await this.fetchWithRetry(`${getCloudApiBase()}${pathCreate}`, {
          method: 'POST', headers, body: JSON.stringify(payload.body ?? {}),
        })
        break
      }
      case 'admin-put': {
        const pathPut = payload.path as string
        await this.fetchWithRetry(`${getCloudApiBase()}${pathPut}`, {
          method: 'PUT', headers, body: JSON.stringify(payload.body ?? {}),
        })
        break
      }
      case 'admin-delete': {
        const pathDelete = payload.path as string
        await this.fetchWithRetry(`${getCloudApiBase()}${pathDelete}`, {
          method: 'DELETE', headers,
        })
        break
      }
    }
  }

  private async refreshCloudToken(): Promise<string | null> {
    const refreshToken = getCloudRefreshToken()
    if (!refreshToken) return null
    try {
      const res = await fetch(`${getCloudApiBase()}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
        signal: AbortSignal.timeout(10_000),
      })
      if (!res.ok) return null
      const data = await res.json() as { accessToken?: string; refreshToken?: string }
      if (!data.accessToken) return null
      setCloudAccessToken(data.accessToken)
      if (data.refreshToken) setCloudRefreshToken(data.refreshToken)
      this.cloudToken = data.accessToken
      return data.accessToken
    } catch {
      return null
    }
  }

  private async fetchWithRetry(url: string, options: RequestInit, retries = MAX_RETRIES): Promise<Response> {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const response = await fetch(url, { ...options, signal: AbortSignal.timeout(10_000) })
        if (response.ok) return response

        // The cloud access token expires (15m) — refresh once and retry with the new token.
        if (response.status === 401) {
          const newToken = await this.refreshCloudToken()
          if (newToken) {
            const newHeaders = { ...(options.headers as Record<string, string>), Authorization: `Bearer ${newToken}` }
            const retryRes = await fetch(url, { ...options, headers: newHeaders, signal: AbortSignal.timeout(10_000) })
            if (retryRes.ok) return retryRes
            if (retryRes.status !== 401) {
              const retryBody = await retryRes.text()
              throw new Error(`HTTP ${retryRes.status}: ${retryBody}`)
            }
          }
        }

        const body = await response.text()
        throw new Error(`HTTP ${response.status}: ${body}`)
      } catch (err) {
        if (attempt === retries - 1) throw err
        const delay = Math.min(1000 * Math.pow(2, attempt), 32_000)
        await new Promise((r) => setTimeout(r, delay))
      }
    }
    throw new Error('Max retries exceeded')
  }
}

export const syncWorkerService = new SyncWorkerService()
