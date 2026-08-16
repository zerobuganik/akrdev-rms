import { create } from 'zustand'
import { apiClient, getApiErrorMessage } from '@/lib/apiClient'
import type { CaptainUser } from '@/lib/types'

const ACCESS_TOKEN_KEY = 'accessToken'
const USER_KEY = 'user'
const LAST_PHONE_KEY = 'akrdev-last-phone'
const PIN_UNLOCK_KEY = 'akrdev-pin-unlock-at'
const PIN_UNLOCK_TTL = 24 * 60 * 60 * 1000

interface AuthState {
  token: string | null
  user: CaptainUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (phone: string, password: string) => Promise<void>
  loginWithPin: (phone: string, pin: string) => Promise<void>
  logout: () => void
  clearError: () => void
}

function safeParseUser(): CaptainUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return null
    return JSON.parse(raw) as CaptainUser
  } catch {
    return null
  }
}

function readPinUnlockAt(): number {
  const raw = localStorage.getItem(PIN_UNLOCK_KEY)
  const n = raw ? Number(raw) : 0
  return Number.isFinite(n) ? n : 0
}

export function canUsePin(phone: string): boolean {
  const lastPhone = localStorage.getItem(LAST_PHONE_KEY)
  if (lastPhone !== phone) return false
  return Date.now() - readPinUnlockAt() < PIN_UNLOCK_TTL
}

function persistSession(accessToken: string, user: CaptainUser, phone: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  localStorage.setItem(LAST_PHONE_KEY, phone)
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem(ACCESS_TOKEN_KEY),
  user: safeParseUser(),
  isAuthenticated: !!localStorage.getItem(ACCESS_TOKEN_KEY),
  isLoading: false,
  error: null,

  login: async (phone, password) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await apiClient.post('/auth/login', { phone, password })
      const user = (data?.user ?? { id: '', name: phone, phone, role: 'Captain' }) as CaptainUser
      persistSession(data.accessToken, user, phone)
      set({ token: data.accessToken, user, isAuthenticated: true, isLoading: false })
    } catch (err) {
      const message = getApiErrorMessage(err, 'Login failed')
      set({ isLoading: false, error: message })
      throw err
    }
  },

  loginWithPin: async (phone, pin) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await apiClient.post('/auth/login', { phone, pin })
      const user = (data?.user ?? { id: '', name: phone, phone, role: 'Captain' }) as CaptainUser
      persistSession(data.accessToken, user, phone)
      localStorage.setItem(PIN_UNLOCK_KEY, String(Date.now()))
      set({ token: data.accessToken, user, isAuthenticated: true, isLoading: false })
    } catch (err) {
      const message = getApiErrorMessage(err, 'Login failed')
      set({ isLoading: false, error: message })
      throw err
    }
  },

  logout: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    set({ token: null, user: null, isAuthenticated: false })
  },

  clearError: () => set({ error: null }),
}))
