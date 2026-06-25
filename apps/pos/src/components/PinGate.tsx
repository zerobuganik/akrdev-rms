import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '@/lib/apiClient'
import { Lock, ArrowLeft } from 'lucide-react'
import { PinPad } from './PinPad'
import { useAuthStore } from '@/stores/useAuthStore'
import { toast } from '@/stores/useToastStore'

interface PinGateProps {
  children: React.ReactNode
}

export function PinGate({ children }: PinGateProps) {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [pin, setPin] = useState('')
  const [verified, setVerified] = useState(false)

  const verifyMut = useMutation({
    mutationFn: async (pinValue: string) => {
      await apiClient.post('/auth/login', { phone: user!.phone, pin: pinValue })
    },
    onSuccess: () => {
      setVerified(true)
      toast('Access granted', 'success')
    },
    onError: () => {
      setPin('')
      toast('Invalid PIN', 'error')
    },
  })

  if (verified) {
    return <>{children}</>
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="w-full max-w-sm rounded-xl border bg-card p-8 shadow-xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Lock size={24} className="text-primary" />
          </div>
          <h2 className="text-lg font-bold">Enter PIN</h2>
          <p className="text-sm text-muted-foreground">PIN required to access Payments</p>
        </div>
        <PinPad
          value={pin}
          onChange={setPin}
          maxLength={4}
          disabled={verifyMut.isPending}
          onSubmit={(completePin) => {
            verifyMut.mutate(completePin)
          }}
        />
        {verifyMut.isPending && (
          <p className="mt-3 text-center text-sm text-muted-foreground">Verifying...</p>
        )}
        <button
          onClick={() => navigate(-1)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted"
        >
          <ArrowLeft size={14} />
          Go Back
        </button>
      </div>
    </div>
  )
}
