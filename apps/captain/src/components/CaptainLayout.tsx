import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Home, User } from 'lucide-react'
import { lightHaptic } from '@/lib/native-bridge'

const navItems = [
  { path: '/tables', label: 'Tables', icon: Home },
  { path: '/profile', label: 'Profile', icon: User },
]

export default function CaptainLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="flex h-full flex-col bg-[#f0f2f5]">
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>

      <nav className="shrink-0 border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom,0px)]">
        <div className="flex items-center justify-around py-1.5">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path)
            return (
              <button
                key={item.path}
                onClick={() => { lightHaptic(); navigate(item.path) }}
                className={`relative flex flex-col items-center gap-0.5 px-8 py-1.5 transition-colors ${
                  isActive ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                <item.icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 2}
                  className="transition-all"
                />
                <span className="text-[10px] font-semibold tracking-wide">{item.label}</span>
                {isActive && (
                  <span className="absolute -top-0.5 h-0.5 w-8 rounded-full bg-blue-600" />
                )}
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
