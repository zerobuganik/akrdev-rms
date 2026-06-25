import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'

interface ProtectedRouteProps {
  children: ReactNode
  requirePin?: boolean
}

export function ProtectedRoute({ children, requirePin = true }: ProtectedRouteProps) {
  const token = localStorage.getItem('accessToken')
  const { needsPinSetup } = useAuthStore()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (requirePin && needsPinSetup) {
    return <Navigate to="/set-pin" replace />
  }

  return <>{children}</>
}
