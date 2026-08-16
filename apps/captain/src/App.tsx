import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AppShell } from '@/components/AppShell'
import Toaster from '@/components/Toaster'
import PairPage from '@/pages/PairPage'
import LoginPage from '@/pages/LoginPage'
import TablesPage from '@/pages/TablesPage'
import TakeawayPage from '@/pages/TakeawayPage'
import CartPage from '@/pages/CartPage'
import ProfilePage from '@/pages/ProfilePage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false, staleTime: 10_000 },
  },
})

const router = createBrowserRouter([
  { path: '/pair', element: <PairPage /> },
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/tables" replace /> },
      { path: 'tables', element: <TablesPage /> },
      { path: 'takeaway', element: <TakeawayPage /> },
      { path: 'cart/:tableId', element: <CartPage /> },
      { path: 'takeaway/:orderId', element: <CartPage /> },
      { path: 'profile', element: <ProfilePage /> },
    ],
  },
  { path: '*', element: <Navigate to="/tables" replace /> },
])

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  )
}
