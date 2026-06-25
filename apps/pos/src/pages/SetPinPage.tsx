import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'
import { PinPad } from '@/components/PinPad'
import { toast } from '@/stores/useToastStore'

export default function SetPinPage() {
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [step, setStep] = useState<'enter' | 'confirm'>('enter')
  const [saving, setSaving] = useState(false)
  const { user, setPin: savePin } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true })
    }
  }, [user, navigate])

  if (!user) {
    return null
  }

  const handlePinComplete = (entered: string) => {
    setPin(entered)
    setStep('confirm')
  }

  const handleConfirmComplete = async (entered: string) => {
    setConfirmPin(entered)
    if (pin !== entered) {
      toast('PINs do not match. Try again.', 'error')
      setPin('')
      setConfirmPin('')
      setStep('enter')
      return
    }
    setSaving(true)
    try {
      await savePin(entered)
      toast('PIN set successfully', 'success')
      navigate('/tables', { replace: true })
    } catch {
      toast('Failed to set PIN', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-sm rounded-xl border bg-card p-8 shadow-lg">
        <h1 className="mb-1 text-center text-2xl font-bold">Set Your PIN</h1>
        <p className="mb-6 text-center text-sm text-muted-foreground">
          {step === 'enter'
            ? 'Create a 4-digit PIN for quick access'
            : 'Re-enter your PIN to confirm'}
        </p>

        {step === 'enter' ? (
          <div className="space-y-4">
            <p className="text-center text-xs text-muted-foreground">
              {user.name} • {user.phone}
            </p>
            <PinPad
              value={pin}
              onChange={setPin}
              maxLength={4}
              onSubmit={(v) => handlePinComplete(v)}
              disabled={saving}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-center text-xs text-muted-foreground">
              {user.name} • {user.phone}
            </p>
            <PinPad
              value={confirmPin}
              onChange={setConfirmPin}
              maxLength={4}
              onSubmit={(v) => handleConfirmComplete(v)}
              disabled={saving}
            />
            <button
              onClick={() => { setStep('enter'); setPin(''); setConfirmPin('') }}
              className="w-full rounded-lg border py-2 text-sm text-muted-foreground hover:bg-muted"
            >
              ← Start over
            </button>
          </div>
        )}

        {saving && <p className="mt-3 text-center text-sm text-muted-foreground">Saving...</p>}
      </div>
    </div>
  )
}
