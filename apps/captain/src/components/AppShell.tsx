import { NavLink, Outlet } from 'react-router-dom'
import { LayoutGrid, ShoppingBag, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { to: '/tables', label: 'Tables', icon: LayoutGrid },
  { to: '/takeaway', label: 'Takeaway', icon: ShoppingBag },
  { to: '/profile', label: 'Profile', icon: User },
]

export function AppShell() {
  return (
    <div
      className="flex h-full flex-col bg-background"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <main className="min-h-0 flex-1 overflow-hidden">
        <Outlet />
      </main>
      <nav
        className="flex shrink-0 border-t border-border bg-card"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {tabs.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground',
              )
            }
          >
            <Icon size={22} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
