import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'
import { lightHaptic } from '@/lib/native-bridge'
import { addBackButtonListener } from '@/lib/native-bridge'

export default function LoginPage() {
  const [phone, setPhone] = useState('')
  const [pin, setPin] = useState('')
  const [step, setStep] = useState<'phone' | 'pin'>('phone')
  const { login, isLoading, error, clearError } = useAuthStore()
  const navigate = useNavigate()
  const loginTimerRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    return addBackButtonListener(() => {
      if (step === 'pin') {
        setStep('phone')
        clearError()
      }
    })
  }, [step, clearError])

  const handleLogin = async (enteredPin?: string) => {
    const pinToUse = enteredPin ?? pin
    if (pinToUse.length < 4) return
    try {
      await login(phone, pinToUse)
      navigate('/tables', { replace: true })
    } catch {
      setPin('')
    }
  }

  return (
    <div className="flex h-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">AKRDev Captain</h1>
          <p className="mt-1 text-sm text-muted-foreground">Restaurant Management</p>
        </div>

        {step === 'phone' ? (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-muted-foreground">
              Enter your phone number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              placeholder="Phone number"
              className="w-full rounded-lg border bg-card px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              autoFocus
              inputMode="numeric"
            />
            <button
              onClick={() => { lightHaptic(); setStep('pin') }}
              disabled={phone.length < 10}
              className="w-full rounded-lg bg-primary py-3 font-medium text-primary-foreground transition-all active:scale-[0.98] disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <button
                onClick={() => { lightHaptic(); setStep('phone'); clearError() }}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                ← Back
              </button>
              <span className="text-sm font-medium">{phone}</span>
            </div>

            <p className="text-center text-sm text-muted-foreground">Enter your 4-digit PIN</p>

            <div className="flex justify-center gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-4 w-4 rounded-full border-2 transition-colors ${
                    i < pin.length ? 'border-primary bg-primary' : 'border-muted'
                  }`}
                />
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'backspace'].map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    lightHaptic()
                    if (key === 'clear') setPin('')
                    else if (key === 'backspace') setPin(pin.slice(0, -1))
                    else if (pin.length < 4) {
                      const newPin = pin + key
                      setPin(newPin)
                      if (newPin.length === 4) {
                        clearTimeout(loginTimerRef.current)
                        loginTimerRef.current = setTimeout(() => handleLogin(newPin), 200)
                      }
                    }
                  }}
                  disabled={isLoading}
                  className={`rounded-xl py-3 text-lg font-medium transition-all active:scale-[0.95] ${
                    key === 'clear'
                      ? 'bg-red-50 text-red-600 active:bg-red-100'
                      : key === 'backspace'
                        ? 'bg-muted active:bg-border'
                        : 'border bg-card active:bg-muted'
                  }`}
                >
                  {key === 'clear' ? 'C' : key === 'backspace' ? '⌫' : key}
                </button>
              ))}
            </div>

            <button
              onClick={() => handleLogin()}
              disabled={pin.length < 4 || isLoading}
              className="w-full rounded-lg bg-primary py-3 font-medium text-primary-foreground transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>

            {error && !isLoading && (
              <p className="text-center text-sm text-destructive">{error}</p>
            )}
            {isLoading && (
              <p className="text-center text-sm text-muted-foreground">Verifying...</p>
            )}
          </div>
        )}

        <div className="mt-6 pt-4 border-t">
          <button
            onClick={() => {
              localStorage.removeItem('akrdev-rms-config')
              localStorage.removeItem('akrdev-cloud-url')
              localStorage.removeItem('accessToken')
              localStorage.removeItem('refreshToken')
              localStorage.removeItem('user')
              window.location.reload()
            }}
            className="w-full text-xs text-muted-foreground hover:text-destructive transition-colors"
          >
            Reset connection & pair again
          </button>
        </div>
      </div>
    </div>
  )
}
