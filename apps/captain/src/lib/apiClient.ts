import axios from 'axios'
import { getBaseUrl } from './connection'

export const apiClient = axios.create({
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

apiClient.interceptors.request.use((config) => {
  const baseUrl = getBaseUrl()
  if (baseUrl) {
    config.baseURL = `${baseUrl}/api/v1`
  }
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
      const path = window.location.pathname
      if (!path.startsWith('/login') && !path.startsWith('/pair')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export function getApiErrorMessage(err: unknown, fallback = 'Something went wrong'): string {
  const data = (err as { response?: { data?: { error?: { message?: string } | string } } })?.response?.data
  const e = data?.error
  if (typeof e === 'string') return e
  if (e && typeof e.message === 'string') return e.message
  if (err instanceof Error && err.message) return err.message
  return fallback
}
