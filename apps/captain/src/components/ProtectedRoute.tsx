import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const posUrl = localStorage.getItem('akrdev-pos-url')
  const token = localStorage.getItem('accessToken')

  if (!posUrl) return <Navigate to="/pair" replace />
  if (!token) return <Navigate to="/login" replace />

  return <>{children}</>
}
