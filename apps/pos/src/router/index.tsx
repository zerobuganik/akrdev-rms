import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Layout } from '@/components/Layout'
import { PinGate } from '@/components/PinGate'
import LoginPage from '@/pages/LoginPage'
import SetPinPage from '@/pages/SetPinPage'
import TablesPage from '@/pages/TablesPage'
import CartPage from '@/pages/CartPage'
import OrdersPage from '@/pages/OrdersPage'
import ItemsPage from '@/pages/ItemsPage'
import EmployeesPage from '@/pages/EmployeesPage'
import ActivityLogPage from '@/pages/ActivityLogPage'
import SettingsPage from '@/pages/SettingsPage'
import PaymentHistoryPage from '@/pages/PaymentHistoryPage'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/set-pin',
    element: (
      <ProtectedRoute requirePin={false}>
        <SetPinPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/tables" replace /> },
      { path: 'tables', element: <TablesPage /> },
      { path: 'cart/:tableId?', element: <CartPage /> },
      { path: 'orders', element: <OrdersPage /> },
      { path: 'items', element: <ItemsPage /> },
      { path: 'employees', element: <EmployeesPage /> },
      { path: 'activity-log', element: <ActivityLogPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'payment-history', element: <PinGate><PaymentHistoryPage /></PinGate> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/tables" replace />,
  },
])
