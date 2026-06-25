import { useState, useEffect } from 'react'
import { Wifi, WifiOff, Bell, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

type NetworkStatus = 'online' | 'offline' | 'disconnected'

export function FooterStatusBar() {
  const [time, setTime] = useState(new Date())
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>('online')
  const [syncStatus, setSyncStatus] = useState('Synced')
  const [notificationCount, setNotificationCount] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleOnline = () => setNetworkStatus('online')
    const handleOffline = () => setNetworkStatus('offline')
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  return (
    <footer className="flex h-8 items-center justify-between border-t bg-card px-4 text-xs text-muted-foreground">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1">
          <Clock size={12} />
          {formatTime(time)} | {formatDate(time)}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <span
          className={cn(
            'flex items-center gap-1',
            networkStatus === 'online' && 'text-green-600',
            networkStatus === 'offline' && 'text-yellow-600',
            networkStatus === 'disconnected' && 'text-red-600',
          )}
        >
          {networkStatus === 'online' ? <Wifi size={12} /> : <WifiOff size={12} />}
          {networkStatus === 'online' ? 'Online' : networkStatus === 'offline' ? 'Offline' : 'Disconnected'}
        </span>

        <span className="flex items-center gap-1">
          <span className="font-medium">{syncStatus}</span>
        </span>

        <button className="relative flex items-center gap-1 hover:text-foreground">
          <Bell size={12} />
          {notificationCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-3 w-3 items-center justify-center rounded-full bg-destructive text-[8px] text-destructive-foreground">
              {notificationCount}
            </span>
          )}
        </button>
      </div>
    </footer>
  )
}
