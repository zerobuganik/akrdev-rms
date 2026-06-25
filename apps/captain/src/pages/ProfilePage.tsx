import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'
import { getConnectionState } from '@/lib/connection-manager'
import { lightHaptic } from '@/lib/native-bridge'
import { LogOut, Wifi, WifiOff, Smartphone, Shield, Server } from 'lucide-react'

const roleLabels: Record<string, string> = {
  Admin: 'Administrator',
  Cashier: 'Cashier',
  Captain: 'Captain',
}

export default function ProfilePage() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const conn = getConnectionState()

  const handleLogout = () => {
    lightHaptic()
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex h-full flex-col bg-[#f0f2f5]">
      {/* Header */}
      <header className="shrink-0 bg-white px-4 pb-3 pt-4">
        <h1 className="text-xl font-bold text-gray-900">Profile</h1>
      </header>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* User card */}
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600">
              <Smartphone size={24} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-base font-bold text-gray-900">{user?.name ?? 'Captain'}</p>
              <p className="text-sm text-gray-500">{user?.phone ?? ''}</p>
              {user?.role && (
                <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600">
                  <Shield size={10} />
                  {roleLabels[user.role] ?? user.role}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Connection card */}
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
            Connection
          </p>
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
              conn.isConnected ? 'bg-green-50' : 'bg-red-50'
            }`}>
              {conn.isConnected ? (
                <Wifi size={18} className="text-green-600" />
              ) : (
                <WifiOff size={18} className="text-red-500" />
              )}
            </div>
            <div className="min-w-0">
              <p className={`text-sm font-semibold ${conn.isConnected ? 'text-green-600' : 'text-red-500'}`}>
                {conn.isConnected ? 'Connected' : 'Disconnected'}
              </p>
              <p className="text-xs text-gray-400 capitalize">
                {conn.source ?? 'Unknown'} · {conn.currentUrl ?? '---'}
              </p>
            </div>
          </div>
        </div>

        {/* Server info */}
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
            Server
          </p>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50">
              <Server size={18} className="text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {conn.currentUrl ?? 'Not connected'}
              </p>
              <p className="text-xs text-gray-400">AKRDev RMS Captain</p>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-red-100 bg-red-50 py-3.5 text-sm font-bold text-red-600 transition-all active:scale-[0.98] hover:bg-red-100"
        >
          <LogOut size={16} />
          Logout
        </button>

        <p className="text-center text-[11px] text-gray-300">AKRDev RMS · v1.0</p>
      </div>
    </div>
  )
}
