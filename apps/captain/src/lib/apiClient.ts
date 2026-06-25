import axios from 'axios'
import { getBaseUrl } from './connection-manager.js'

export const apiClient = axios.create({
  headers: { 'Content-Type': 'application/json' },
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
