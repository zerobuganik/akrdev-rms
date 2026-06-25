import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/useAuthStore'
import { apiClient } from '@/lib/apiClient'
import { cn } from '@/lib/utils'
import {
  Grid3X3,
  ClipboardList,
  Package,
  Users,
  History,
  Settings,
  Lock,
  LogOut,
  Store,
  Banknote,
} from 'lucide-react'
import { FooterStatusBar } from './FooterStatusBar'
import { Toaster } from './Toaster'
import { ProfilePopup } from './ProfilePopup'
import { getImageBaseUrl } from '@/lib/imageBaseUrl'

const navItems = [
  { path: '/tables', label: 'Tables', icon: Grid3X3 },
  { path: '/orders', label: 'Orders', icon: ClipboardList },
  { path: '/items', label: 'Items', icon: Package },
  { path: '/employees', label: 'Employees', icon: Users },
  { path: '/payment-summary', label: 'Payments', icon: Banknote },
  { path: '/activity-log', label: 'Activity Log', icon: History },
  { path: '/settings', label: 'Settings', icon: Settings },
]

export function Layout() {
  const [collapsed, setCollapsed] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data } = await apiClient.get('/settings')
      return data as { companyName?: string; logoUrl?: string }
    },
    staleTime: Infinity,
  })

  const restaurantName = settings?.companyName ?? ''
  const logoUrl = settings?.logoUrl
    ? `${getImageBaseUrl()}${settings.logoUrl}`
    : null

  const handleLock = () => {
    const token = localStorage.getItem('accessToken')
    if (token) localStorage.setItem('lockedToken', token)
    const savedPhone = localStorage.getItem('lastPhone')
    if (savedPhone) localStorage.setItem('lockedPhone', savedPhone)
    localStorage.removeItem('accessToken')
    navigate('/login')
  }

  const shortName = restaurantName
    ? restaurantName.split(' ').map((w: string) => w[0]).join('').slice(0, 3).toUpperCase()
    : 'RMS'

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside
        className={cn(
          'flex flex-col border-r bg-sidebar transition-all duration-200',
          collapsed ? 'w-[60px]' : 'w-[240px]',
        )}
      >
        {/* ---- Header: Logo + Restaurant Short Name ---- */}
        <div
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'flex items-center gap-3 border-b px-3 py-3 cursor-pointer',
            collapsed && 'justify-center px-1',
          )}
        >
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground overflow-hidden">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="h-full w-full object-cover" />
            ) : (
              <span>{restaurantName?.[0] ?? <Store size={18} />}</span>
            )}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold leading-tight">{restaurantName}</p>
            </div>
          )}
        </div>

        {/* ---- Navigation ---- */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname.startsWith(item.path)
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                  isActive
                    ? 'bg-sidebar-primary/10 font-medium text-sidebar-primary'
                    : 'text-sidebar-foreground/70 hover:bg-accent hover:text-sidebar-foreground',
                  collapsed && 'justify-center px-0',
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={20} />
                {!collapsed && <span>{item.label}</span>}
              </button>
            )
          })}
        </nav>

        {/* ---- Profile ---- */}
        <div className={cn(
          'border-t',
          collapsed ? 'flex flex-col items-center gap-2 px-1 py-3' : 'px-3 py-3',
        )}>
          {collapsed ? (
            <>
              <button
                onClick={() => setShowProfile(true)}
                title={user?.name}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary overflow-hidden"
              >
                {user?.imageUrl ? (
                  <img
                    src={`${getImageBaseUrl()}${user.imageUrl}`}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  user?.name?.[0] ?? 'U'
                )}
              </button>
              <button
                onClick={handleLock}
                title="Lock Terminal"
                className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <Lock size={16} />
              </button>
              <button
                onClick={logout}
                title="Logout"
                className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setShowProfile(true)}
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary overflow-hidden"
              >
                {user?.imageUrl ? (
                  <img
                    src={`${getImageBaseUrl()}${user.imageUrl}`}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  user?.name?.[0] ?? 'U'
                )}
              </button>

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium">{user?.name}</p>
                <p className="text-[11px] text-muted-foreground">{user?.role}</p>
              </div>

              <div className="flex flex-shrink-0 items-center gap-0.5">
                <button
                  onClick={handleLock}
                  title="Lock Terminal"
                  className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  <Lock size={16} />
                </button>
                <button
                  onClick={logout}
                  title="Logout"
                  className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-destructive"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      <main className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
        <FooterStatusBar />
      </main>

      <Toaster />
      {showProfile && <ProfilePopup onClose={() => setShowProfile(false)} />}
    </div>
  )
}
