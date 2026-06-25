import { create } from 'zustand'

interface UserInfo {
  id: string
  name: string
  phone?: string
  role: string
  imageUrl?: string | null
}

interface AuthState {
  token: string | null
  user: UserInfo | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (phone: string, pin: string) => Promise<void>
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

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('accessToken'),
  user: safeParse<UserInfo | null>('user', null),
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isLoading: false,
  error: null,

  login: async (phone, pin) => {
    set({ isLoading: true, error: null })
    try {
      const axiosModule = await import('axios')
      const axios = axiosModule.default
      const { getBaseUrl } = await import('../lib/connection-manager.js')
      const baseUrl = getBaseUrl()
      if (!baseUrl) throw new Error('No connection')
      const { data } = await axios.post(`${baseUrl}/api/v1/auth/login`, { phone, pin })
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      localStorage.setItem('user', JSON.stringify(data.user))
      set({ token: data.accessToken, user: data.user, isAuthenticated: true, isLoading: false })
    } catch (err: unknown) {
      const apiMsg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message
      const message = apiMsg ?? (err instanceof Error ? err.message : 'Login failed')
      set({ isLoading: false, error: message })
      throw err
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    set({ token: null, user: null, isAuthenticated: false })
  },

  clearError: () => set({ error: null }),
}))
