import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { initConnection, onConnectionChange } from '@/lib/connection-manager'
import CaptainLayout from '@/components/CaptainLayout'
import PairPage from '@/pages/PairPage'
import LoginPage from '@/pages/LoginPage'
import TablesPage from '@/pages/TablesPage'
import CartPage from '@/pages/CartPage'
import ProfilePage from '@/pages/ProfilePage'

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 5_000, retry: 1 } } })

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('accessToken')
  if (!token) return <Navigate to="/login" replace />
  return <>{children}</>
}

const setupRouter = createBrowserRouter([
  { path: '*', element: <PairPage /> },
])

const appRouter = createBrowserRouter([
  { path: '/pair', element: <PairPage /> },
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: <ProtectedRoute><CaptainLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <Navigate to="/tables" replace /> },
      { path: 'tables', element: <TablesPage /> },
      { path: 'cart/:tableId', element: <CartPage /> },
      { path: 'profile', element: <ProfilePage /> },
    ],
  },
  { path: '*', element: <Navigate to="/tables" replace /> },
])

export default function App() {
  const [initialized, setInitialized] = useState(false)
  const [hasConfig, setHasConfig] = useState(false)

  useEffect(() => {
    const cloudUrl = localStorage.getItem('akrdev-cloud-url')
    let hasStored = false
    const stored = localStorage.getItem('akrdev-rms-config')
    if (stored) {
      try { hasStored = JSON.parse(stored).length > 0 } catch { /* corrupted config */ }
    }
    if (cloudUrl || hasStored) {
      setHasConfig(true)
      initConnection().then(() => setInitialized(true)).catch(() => setInitialized(true))
    } else {
      setInitialized(true)
    }

    return onConnectionChange((state) => {
      if (!state.isConnected && state.source) {
        console.warn('Connection lost to', state.source)
      }
    })
  }, [])

  if (!initialized) {
    return <div className="flex h-screen items-center justify-center text-muted-foreground">Initializing...</div>
  }

  if (!hasConfig) {
    return <RouterProvider router={setupRouter} />
  }

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={appRouter} />
    </QueryClientProvider>
  )
}
