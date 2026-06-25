import { useState, useEffect } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/apiClient'
import { X } from 'lucide-react'
import { toast } from '@/stores/useToastStore'

interface PaymentChangeModalProps {
  orderId: string
  grandTotal: number
  onClose: () => void
  onUpdated: () => void
}

export function PaymentChangeModal({ orderId, grandTotal, onClose, onUpdated }: PaymentChangeModalProps) {
  const { data: settlement } = useQuery<{ cashPaid: number; cardPaid: number; upiPaid: number }>({
    queryKey: ['settlement', orderId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/settlement/${orderId}`)
      return data ?? { cashPaid: 0, cardPaid: 0, upiPaid: 0 }
    },
  })

  const [cash, setCash] = useState(0)
  const [card, setCard] = useState(0)
  const [upi, setUpi] = useState(0)

  useEffect(() => {
    if (settlement) {
      setCash(settlement.cashPaid ?? 0)
      setCard(settlement.cardPaid ?? 0)
      setUpi(settlement.upiPaid ?? 0)
    }
  }, [settlement])

  const totalPaid = cash + card + upi
  const change = totalPaid - grandTotal

  const updateMut = useMutation({
    mutationFn: async () => {
      await apiClient.put(`/settlement/${orderId}/payment`, { cash, card, upi })
    },
    onSuccess: () => {
      toast('Payment updated', 'success')
      onUpdated()
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message
        ?? (err as Error)?.message
        ?? 'Failed to update payment'
      toast(msg, 'error')
    },
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-xl bg-card p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold">Change Payment Method</h3>
            <p className="text-xs text-muted-foreground">Order: {orderId.slice(0, 8)}</p>
          </div>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          <div className="space-y-2">
            <label className="block text-xs font-medium">Payments</label>
            <div className="flex items-center gap-2">
              <span className="w-12 text-sm text-muted-foreground">Cash</span>
              <input
                type="number"
                value={cash}
                onChange={(e) => setCash(Number(e.target.value))}
                className="flex-1 rounded-lg border px-3 py-2 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-12 text-sm text-muted-foreground">Card</span>
              <input
                type="number"
                value={card}
                onChange={(e) => setCard(Number(e.target.value))}
                className="flex-1 rounded-lg border px-3 py-2 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-12 text-sm text-muted-foreground">UPI</span>
              <input
                type="number"
                value={upi}
                onChange={(e) => setUpi(Number(e.target.value))}
                className="flex-1 rounded-lg border px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="border-t pt-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Grand Total</span>
              <span className="font-bold">₹{grandTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Paid</span>
              <span>₹{totalPaid.toLocaleString()}</span>
            </div>
            {totalPaid >= grandTotal && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Change</span>
                <span className="font-bold">₹{change.toLocaleString()}</span>
              </div>
            )}
          </div>

          <button
            onClick={() => updateMut.mutate()}
            disabled={totalPaid < grandTotal || updateMut.isPending}
            className="w-full rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-50"
          >
            {updateMut.isPending ? 'Updating...' : 'Update Payment'}
          </button>
        </div>
      </div>
    </div>
  )
}
