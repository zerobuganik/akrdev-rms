import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'
import { PinPad } from '@/components/PinPad'

export default function LoginPage() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [pin, setPin] = useState('')
  const [step, setStep] = useState<'phone' | 'password' | 'pin'>('phone')
  const { login, loginWithPin, isLoading, error, clearError, needsPinSetup } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    const lockedPhone = localStorage.getItem('lockedPhone')
    const savedPhone = localStorage.getItem('lastPhone')
    const phoneToUse = lockedPhone || savedPhone || ''
    if (phoneToUse) {
      setPhone(phoneToUse)
      if (lockedPhone) {
        // Lock terminal → PIN only
        setStep('pin')
      }
      // Otherwise stay on phone step — user can edit or press Continue
    }
  }, [])

  const handlePhoneSubmit = () => {
    if (phone.length >= 10) {
      setStep('password')
    }
  }

  const handlePasswordLogin = async () => {
    if (!password) return
    try {
      await login(phone, password)
      if (useAuthStore.getState().needsPinSetup) {
        navigate('/set-pin', { replace: true })
      } else {
        navigate('/tables', { replace: true })
      }
    } catch {
      setPassword('')
    }
  }

  const handlePinLogin = async (enteredPin?: string) => {
    const pinToUse = enteredPin ?? pin
    if (pinToUse.length < 4) return
    try {
      await loginWithPin(phone, pinToUse)
      localStorage.removeItem('lockedPhone')
      localStorage.removeItem('lockedToken')
      navigate('/tables', { replace: true })
    } catch {
      setPin('')
    }
  }

  const handleBack = () => {
    if (step === 'password') {
      localStorage.removeItem('lastPhone')
      setStep('phone')
    }
    if (step === 'pin') {
      localStorage.removeItem('lockedPhone')
      localStorage.removeItem('lockedToken')
      setStep('password')
    }
    setPin('')
    setPassword('')
    clearError()
  }

  const handleChangePhone = () => {
    localStorage.removeItem('lastPhone')
    localStorage.removeItem('lockedPhone')
    localStorage.removeItem('lockedToken')
    setPhone('')
    setStep('phone')
    setPin('')
    setPassword('')
    clearError()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-sm rounded-xl border bg-card p-8 shadow-lg">
        <h1 className="mb-2 text-center text-2xl font-bold">AKRDev RMS</h1>
        <p className="mb-6 text-center text-sm text-muted-foreground">Restaurant Management System</p>

        {step === 'phone' && (
          <div className="space-y-4">
            <label className="block text-sm font-medium">Employee Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              onKeyDown={(e) => e.key === 'Enter' && handlePhoneSubmit()}
              placeholder="Enter 10-digit phone number"
              maxLength={15}
              className="w-full rounded-lg border px-4 py-3 text-lg"
              autoFocus
            />
            <button
              onClick={handlePhoneSubmit}
              disabled={phone.length < 10}
              className="w-full rounded-lg bg-primary py-3 font-medium text-primary-foreground disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        )}

        {step === 'password' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button onClick={handleBack} className="text-sm text-muted-foreground hover:text-foreground">
                ← Back
              </button>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{phone}</span>
                <button onClick={handleChangePhone} className="text-xs text-blue-600 hover:text-blue-800 underline">
                  Change
                </button>
              </div>
            </div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePasswordLogin()}
              placeholder="Enter your password"
              className="w-full rounded-lg border px-4 py-3 text-lg"
              autoFocus
            />
            <button
              onClick={handlePasswordLogin}
              disabled={!password || isLoading}
              className="w-full rounded-lg bg-primary py-3 font-medium text-primary-foreground disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Login'}
            </button>
            {error && <p className="text-center text-sm text-destructive">{error}</p>}
          </div>
        )}

        {step === 'pin' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button onClick={handleBack} className="text-sm text-muted-foreground hover:text-foreground">
                ← Back
              </button>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{phone}</span>
                <button onClick={handleChangePhone} className="text-xs text-blue-600 hover:text-blue-800 underline">
                  Change
                </button>
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground">Enter your 4-digit PIN</p>
            <PinPad value={pin} onChange={setPin} maxLength={4} onSubmit={handlePinLogin} disabled={isLoading} />
            <button
              onClick={() => handlePinLogin()}
              disabled={pin.length < 4 || isLoading}
              className="w-full rounded-lg bg-primary py-3 font-medium text-primary-foreground disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Unlock'}
            </button>
            {error && <p className="text-center text-sm text-destructive">{error}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
