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
  showSyncScreen: boolean
  login: (phone: string, password: string) => Promise<void>
  loginWithPin: (phone: string, pin: string) => Promise<void>
  setPin: (pin: string) => Promise<void>
  updateUser: (user: User) => void
  logout: () => void
  clearError: () => void
  finishSync: () => void
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
  showSyncScreen: false,

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
        showSyncScreen: data.syncRequired !== false,
      })
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
        showSyncScreen: false,
      })
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
  finishSync: () => set({ showSyncScreen: false }),
}))


