import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'
import { apiClient, getApiErrorMessage } from '@/lib/apiClient'
import { toast } from '@/stores/useToastStore'
import { getBaseUrl, clearPosUrl, healthCheck } from '@/lib/connection'
import { LogOut, RefreshCw, Wifi, WifiOff, User as UserIcon, KeyRound, X } from 'lucide-react'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [online, setOnline] = useState(false)
  const [checking, setChecking] = useState(false)

  const [showChangePin, setShowChangePin] = useState(false)
  const [currentPin, setCurrentPin] = useState('')
  const [newPin, setNewPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [changingPin, setChangingPin] = useState(false)

  const posUrl = getBaseUrl()

  const check = async () => {
    setChecking(true)
    const ok = await healthCheck()
    setOnline(ok)
    setChecking(false)
  }

  useEffect(() => {
    void check()
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const handleRepair = () => {
    logout()
    clearPosUrl()
    navigate('/pair', { replace: true })
  }

  const submitChangePin = async () => {
    if (!user?.phone) return
    if (newPin.length < 4) {
      toast('New PIN must be at least 4 digits', 'error')
      return
    }
    if (newPin !== confirmPin) {
      toast('New PINs do not match', 'error')
      return
    }
    setChangingPin(true)
    try {
      await apiClient.post('/auth/change-pin', { phone: user.phone, currentPin, newPin })
      toast('PIN updated', 'success')
      setShowChangePin(false)
      setCurrentPin('')
      setNewPin('')
      setConfirmPin('')
    } catch (err) {
      toast(getApiErrorMessage(err, 'Failed to change PIN'), 'error')
    } finally {
      setChangingPin(false)
    }
  }

  return (
    <div className="flex h-full flex-col bg-background">
      <header className="px-4 py-3">
        <h1 className="text-lg font-bold">Profile</h1>
      </header>

      <div className="scrollbar-none min-h-0 flex-1 overflow-y-auto px-4 pb-4">
        <div className="flex items-center gap-3 rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
            {user?.imageUrl ? (
              <img src={user.imageUrl} alt="" className="h-12 w-12 rounded-full object-cover" />
            ) : (
              <UserIcon size={22} />
            )}
          </div>
          <div>
            <p className="text-base font-bold">{user?.name ?? 'Captain'}</p>
            <p className="text-xs text-muted-foreground">{user?.phone}</p>
            <p className="text-[10px] font-semibold uppercase text-muted-foreground">{user?.role}</p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2">
              {online ? <Wifi size={16} className="text-green-600" /> : <WifiOff size={16} className="text-red-500" />}
              <span className="text-sm font-medium">Connection</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{online ? 'Connected' : 'Offline'}</span>
              <button
                onClick={() => void check()}
                disabled={checking}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-muted disabled:opacity-50"
              >
                <RefreshCw size={14} className={checking ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>

          {posUrl && (
            <div className="rounded-xl border bg-card p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase text-muted-foreground">POS Server</p>
              <p className="mt-1 break-all text-sm font-mono">{posUrl}</p>
            </div>
          )}
        </div>

        <div className="mt-4">
          {!showChangePin ? (
            <button
              onClick={() => setShowChangePin(true)}
              className="flex w-full items-center justify-center gap-2 rounded-lg border py-3 text-sm font-medium text-foreground transition-all active:scale-[0.98] hover:bg-muted"
            >
              <KeyRound size={16} /> Change PIN
            </button>
          ) : (
            <div className="space-y-2 rounded-xl border bg-card p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Change PIN</p>
                <button onClick={() => setShowChangePin(false)} className="rounded-md p-1 text-muted-foreground hover:bg-muted">
                  <X size={16} />
                </button>
              </div>
              <input
                type="password"
                inputMode="numeric"
                value={currentPin}
                onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, '').slice(0, 8))}
                placeholder="Current PIN"
                className="w-full rounded-md border bg-background px-3 py-2.5 text-center font-mono text-base tracking-widest focus:outline-none focus:ring-1 focus:ring-primary/20"
              />
              <input
                type="password"
                inputMode="numeric"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 8))}
                placeholder="New PIN (4–8 digits)"
                className="w-full rounded-md border bg-background px-3 py-2.5 text-center font-mono text-base tracking-widest focus:outline-none focus:ring-1 focus:ring-primary/20"
              />
              <input
                type="password"
                inputMode="numeric"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 8))}
                placeholder="Confirm new PIN"
                className="w-full rounded-md border bg-background px-3 py-2.5 text-center font-mono text-base tracking-widest focus:outline-none focus:ring-1 focus:ring-primary/20"
              />
              <button
                onClick={() => void submitChangePin()}
                disabled={changingPin || !currentPin || !newPin || !confirmPin}
                className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {changingPin ? 'Updating…' : 'Update PIN'}
              </button>
            </div>
          )}
        </div>

        <div className="mt-4 space-y-2">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-lg border py-3 text-sm font-medium text-foreground transition-all active:scale-[0.98] hover:bg-muted"
          >
            <LogOut size={16} /> Log out
          </button>
          <button
            onClick={handleRepair}
            className="flex w-full items-center justify-center gap-2 rounded-lg border py-3 text-sm font-medium text-destructive transition-all active:scale-[0.98] hover:bg-red-50"
          >
            <RefreshCw size={16} /> Re-pair / change POS
          </button>
        </div>
      </div>
    </div>
  )
}
