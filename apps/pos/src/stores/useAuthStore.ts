import { create } from 'zustand'
import { apiClient } from '@/lib/apiClient'
import type { User } from '@akrdev/types'

function syncTokensToElectron(accessToken: string, refreshToken: string) {
  const win = window as unknown as { electron?: { ipcRenderer?: { invoke: (ch: string, ...args: unknown[]) => void } } }
  if (win.electron?.ipcRenderer) {
    win.electron.ipcRenderer.invoke('set-access-token', accessToken)
    win.electron.ipcRenderer.invoke('set-refresh-token', refreshToken)
  }
}

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  needsPinSetup: boolean
  login: (phone: string, password: string) => Promise<void>
  loginWithPin: (phone: string, pin: string) => Promise<void>
  setPin: (pin: string) => Promise<void>
  updateUser: (user: User) => void
  logout: () => void
  clearError: () => void
}

function safeParse<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem('accessToken'),
  user: safeParse<User | null>('user', null),
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isLoading: false,
  error: null,
  needsPinSetup: false,

  login: async (phone: string, password: string) => {
    set({ isLoading: true, error: null, needsPinSetup: false })
    try {
      const { data } = await apiClient.post('/auth/login', { phone, password })
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('lastPhone', phone)
      syncTokensToElectron(data.accessToken, data.refreshToken)
      set({
        token: data.accessToken,
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
        needsPinSetup: data.needsPinSetup ?? false,
      })
      syncTablesToLocalAPI(data.accessToken)
    } catch (err: unknown) {
      const apiMsg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message
      const message = apiMsg ?? (err instanceof Error ? err.message : 'Login failed')
      set({ isLoading: false, error: message, needsPinSetup: false })
      throw err
    }
  },

  loginWithPin: async (phone: string, pin: string) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await apiClient.post('/auth/login', { phone, pin })
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('lastPhone', phone)
      syncTokensToElectron(data.accessToken, data.refreshToken)
      set({
        token: data.accessToken,
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      })
      syncTablesToLocalAPI(data.accessToken)
    } catch (err: unknown) {
      const apiMsg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message
      const message = apiMsg ?? (err instanceof Error ? err.message : 'Login failed')
      set({ isLoading: false, error: message })
      throw err
    }
  },

  setPin: async (pin: string) => {
    await apiClient.post('/auth/set-pin', { pin })
    set({ needsPinSetup: false })
  },

  updateUser: (user: User) => {
    localStorage.setItem('user', JSON.stringify(user))
    set({ user })
  },

  logout: () => {
    const token = get().token
    if (token) {
      apiClient.post('/auth/logout', { refreshToken: localStorage.getItem('refreshToken') }).catch(() => {})
    }
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    set({ token: null, user: null, isAuthenticated: false, needsPinSetup: false })
  },

  clearError: () => set({ error: null }),
}))

async function syncTablesToLocalAPI(token: string) {
  const localApiUrl = import.meta.env.VITE_LOCAL_API_URL
  if (!localApiUrl) return
  try {
    const base = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1'
    const [tablesRes, areasRes, itemsRes, categoriesRes] = await Promise.all([
      fetch(`${base}/tables`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`${base}/areas`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`${base}/items`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`${base}/categories`, { headers: { Authorization: `Bearer ${token}` } }),
    ])
    const rawTables = tablesRes.ok ? await tablesRes.json() : null
    const rawAreas = areasRes.ok ? await areasRes.json() : null
    const rawItems = itemsRes.ok ? await itemsRes.json() : null
    const rawCategories = categoriesRes.ok ? await categoriesRes.json() : null

    if (!rawTables && !rawAreas && !rawItems && !rawCategories) return

    const tables = rawTables?.map((t: { id: string; name: string; capacity?: number; status?: string; area?: { id: string; name: string } }) => ({
      id: t.id,
      name: t.name,
      capacity: t.capacity ?? 0,
      status: t.status ?? 'Available',
      area: t.area ? { id: t.area.id, name: t.area.name } : null,
    })) ?? null

    const areas = rawAreas?.map((a: { id: string; name: string }) => ({
      id: a.id,
      name: a.name,
    })) ?? null

    const items = rawItems?.map((i: { id: string; name: string; basePrice: number; inStock: boolean; variations: Array<{ id: string; name: string; priceAdjustment: number }>; categoryId?: string; category?: { id: string; name: string } }) => ({
      id: i.id,
      name: i.name,
      basePrice: i.basePrice,
      inStock: i.inStock ?? true,
      variations: i.variations ?? [],
      categoryId: i.categoryId ?? null,
      category: i.category ?? null,
    })) ?? null

    const categories = rawCategories?.map((c: { id: string; name: string }) => ({
      id: c.id,
      name: c.name,
    })) ?? null

    if (tables || areas || items || categories) {
      await fetch(`${localApiUrl}/api/v1/tables/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tables, areas, items, categories }),
      }).catch(() => {})
    }
  } catch {
    // Non-critical — fallback to local-only
  }
}
