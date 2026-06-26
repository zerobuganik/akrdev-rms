import { useState, useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/lib/apiClient'
import { X } from 'lucide-react'
import { toast } from '@/stores/useToastStore'

interface SettlementModalProps {
  order: {
    id: string
    grandTotal: number
    subtotal: number
    taxTotal: number
    discountTotal: number
  }
  tableName?: string
  taxType?: 'Inclusive' | 'Exclusive'
  onClose: () => void
  onSettled: () => void
}

export function SettlementModal({ order, tableName, taxType, onClose, onSettled }: SettlementModalProps) {
  const [discountType, setDiscountType] = useState<'Percentage' | 'Flat' | null>(null)
  const [discountValue, setDiscountValue] = useState(0)
  const [discountReason, setDiscountReason] = useState('')
  // Use refs + local state for payment inputs to avoid controlled-input cursor jumps
  const [cash, setCash] = useState('')
  const [card, setCard] = useState('')
  const [upi, setUpi] = useState('')
  const cashRef = useRef<HTMLInputElement>(null)

  const cashNum = Number(cash) || 0
  const cardNum = Number(card) || 0
  const upiNum = Number(upi) || 0

  const discountAmount = discountType === 'Percentage'
    ? (order.subtotal * discountValue) / 100
    : discountValue

  const grandTotal = Math.round(
    taxType === 'Inclusive'
      ? order.subtotal - discountAmount
      : order.subtotal + order.taxTotal - discountAmount
  )
  const totalPaid = cashNum + cardNum + upiNum
  const change = totalPaid - grandTotal

  const settleMut = useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post('/settlement', {
        orderId: order.id,
        discountType: discountType || undefined,
        discountValue: discountValue || undefined,
        discountReason: discountReason || undefined,
        payments: { cash: cashNum, card: cardNum, upi: upiNum },
      })
      return data
    },
    onSuccess: () => {
      toast('Settlement completed', 'success')
      onSettled()
    },
    onError: () => {
      toast('Settlement failed', 'error')
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
            <h3 className="font-bold">Settlement</h3>
            {tableName && (
              <p className="text-xs text-muted-foreground">Table: {tableName}</p>
            )}
          </div>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₹{order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span>₹{order.taxTotal.toLocaleString()}</span>
            </div>
          </div>

          <div className="border-t pt-3">
            <label className="mb-1 block text-xs font-medium">Discount</label>
            <div className="flex gap-2">
              <select
                value={discountType ?? ''}
                onChange={(e) => setDiscountType(e.target.value as 'Percentage' | 'Flat' | null)}
                className="rounded-lg border px-3 py-2 text-sm"
              >
                <option value="">None</option>
                <option value="Percentage">%</option>
                <option value="Flat">₹ Flat</option>
              </select>
              {discountType && (
                <>
                  <input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    placeholder={discountType === 'Percentage' ? '%' : '₹'}
                    className="w-20 rounded-lg border px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    value={discountReason}
                    onChange={(e) => setDiscountReason(e.target.value)}
                    placeholder="Reason"
                    className="flex-1 rounded-lg border px-3 py-2 text-sm"
                  />
                </>
              )}
            </div>
            {discountAmount > 0 && (
              <p className="mt-1 text-xs text-red-500">Discount: −₹{discountAmount.toLocaleString()}</p>
            )}
          </div>

          <div className="space-y-2 border-t pt-3">
            <label className="block text-xs font-medium">Payments</label>
              <div className="flex items-center gap-2">
              <span className="w-12 text-sm text-muted-foreground">Cash</span>
              <input
                ref={cashRef}
                type="number"
                inputMode="decimal"
                value={cash}
                onChange={(e) => setCash(e.target.value)}
                placeholder="0"
                autoFocus
                className="flex-1 rounded-lg border px-3 py-2 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-12 text-sm text-muted-foreground">Card</span>
              <input
                type="number"
                inputMode="decimal"
                value={card}
                onChange={(e) => setCard(e.target.value)}
                placeholder="0"
                className="flex-1 rounded-lg border px-3 py-2 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-12 text-sm text-muted-foreground">UPI</span>
              <input
                type="number"
                inputMode="decimal"
                value={upi}
                onChange={(e) => setUpi(e.target.value)}
                placeholder="0"
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
            onClick={() => settleMut.mutate()}
            disabled={totalPaid < grandTotal || settleMut.isPending}
            className="w-full rounded-lg border px-4 py-2.5 text-sm font-bold text-white bg-green-500 hover:bg-green-600 disabled:opacity-50"
          >
            {settleMut.isPending ? 'Processing...' : 'Complete Settlement'}
          </button>
        </div>
      </div>
    </div>
  )
}
