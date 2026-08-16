import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore, canUsePin } from '@/stores/useAuthStore'
import { lightHaptic, mediumHaptic, successHaptic } from '@/lib/native-bridge'
import { ArrowLeft, Delete, Loader2, LockKeyhole } from 'lucide-react'

type Phase = 'phone' | 'pin' | 'password'

const PIN_DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, loginWithPin, isLoading, error, clearError } = useAuthStore()
  const [phase, setPhase] = useState<Phase>('phone')
  const [phone, setPhone] = useState(() => localStorage.getItem('akrdev-last-phone') ?? '')
  const [pin, setPin] = useState('')
  const [password, setPassword] = useState('')

  const goPhone = () => {
    clearError()
    setPin('')
    setPassword('')
    setPhase('phone')
  }

  const handlePhoneSubmit = () => {
    if (phone.trim().length < 10) {
      mediumHaptic()
      return
    }
    lightHaptic()
    clearError()
    setPhase(canUsePin(phone.trim()) ? 'pin' : 'password')
  }

  const handlePinDigit = (d: string) => {
    if (isLoading) return
    lightHaptic()
    const next = (pin + d).slice(0, 4)
    setPin(next)
    if (next.length === 4) void submitPin(next)
  }

  const submitPin = async (value: string) => {
    try {
      await loginWithPin(phone.trim(), value)
      successHaptic()
      navigate('/tables', { replace: true })
    } catch {
      mediumHaptic()
      setPin('')
    }
  }

  const submitPassword = async () => {
    if (!password) return
    try {
      await login(phone.trim(), password)
      successHaptic()
      navigate('/tables', { replace: true })
    } catch {
      mediumHaptic()
    }
  }

  return (
    <div className="flex h-full flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">Welcome</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to start taking orders</p>
        </div>

        {phase === 'phone' && (
          <div className="space-y-3">
            <label className="block text-sm font-medium">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="10-digit phone number"
              inputMode="numeric"
              autoFocus
              className="w-full rounded-lg border bg-card px-4 py-3 text-center text-lg tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-primary/20"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handlePhoneSubmit()
              }}
            />
            <button
              onClick={handlePhoneSubmit}
              disabled={phone.trim().length < 10 || isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-medium text-primary-foreground transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <LockKeyhole size={16} />}
              Continue
            </button>
            <p className="text-center text-sm text-muted-foreground">
              Wrong device?{' '}
              <Link to="/pair" className="font-medium text-primary underline">
                Re-pair
              </Link>
            </p>
          </div>
        )}

        {phase === 'pin' && (
          <div className="space-y-4">
            <button
              onClick={goPhone}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft size={14} /> {phone}
            </button>
            <p className="text-center text-sm text-muted-foreground">Enter your 4-digit PIN</p>
            <div className="flex justify-center gap-4 py-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-4 w-4 rounded-full border-2 ${
                    i < pin.length ? 'border-primary bg-primary' : 'border-border'
                  }`}
                />
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3">
              {PIN_DIGITS.map((d) => (
                <button
                  key={d}
                  onClick={() => handlePinDigit(d)}
                  className="rounded-xl border bg-card py-4 text-xl font-semibold transition-all active:scale-95 hover:border-primary/30"
                >
                  {d}
                </button>
              ))}
              <div />
              <button
                onClick={() => handlePinDigit('0')}
                className="rounded-xl border bg-card py-4 text-xl font-semibold transition-all active:scale-95 hover:border-primary/30"
              >
                0
              </button>
              <button
                onClick={() => {
                  lightHaptic()
                  setPin((p) => p.slice(0, -1))
                }}
                className="flex items-center justify-center rounded-xl border bg-card py-4 transition-all active:scale-95 hover:border-primary/30"
              >
                <Delete size={20} />
              </button>
            </div>
            <button
              onClick={() => {
                clearError()
                setPin('')
                setPhase('password')
              }}
              className="w-full text-center text-sm text-muted-foreground underline"
            >
              Use password instead
            </button>
          </div>
        )}

        {phase === 'password' && (
          <div className="space-y-3">
            <button
              onClick={goPhone}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft size={14} /> {phone}
            </button>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoFocus
              className="w-full rounded-lg border bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              onKeyDown={(e) => {
                if (e.key === 'Enter') void submitPassword()
              }}
            />
            <button
              onClick={() => void submitPassword()}
              disabled={!password || isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-medium text-primary-foreground transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <LockKeyhole size={16} />}
              Sign in
            </button>
            {canUsePin(phone.trim()) && (
              <button
                onClick={() => {
                  clearError()
                  setPassword('')
                  setPhase('pin')
                }}
                className="w-full text-center text-sm text-muted-foreground underline"
              >
                Use PIN instead
              </button>
            )}
          </div>
        )}

        {error && <p className="mt-4 text-center text-sm text-destructive">{error}</p>}
      </div>
    </div>
  )
}
