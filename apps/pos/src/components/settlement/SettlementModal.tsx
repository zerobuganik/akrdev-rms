import { useState, useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/lib/apiClient'
import { X } from 'lucide-react'
import { toast } from '@/stores/useToastStore'
import { calculateRounding } from '@akrdev/shared'
import { calculateTax } from '@akrdev/shared'

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
  taxPercentage?: number
  onClose: () => void
  onSettled: () => void
}

export function SettlementModal({ order, tableName, taxType, taxPercentage, onClose, onSettled }: SettlementModalProps) {
  const [discountType, setDiscountType] = useState<'Percentage' | 'Flat' | null>(null)
  const [discountValue, setDiscountValue] = useState(0)
  const [discountReason, setDiscountReason] = useState('')
  // Use uncontrolled refs for payment inputs — avoids any React state rendering issues
  const cashRef = useRef<HTMLInputElement>(null)
  const cardRef = useRef<HTMLInputElement>(null)
  const upiRef = useRef<HTMLInputElement>(null)
  const [cashDisplay, setCashDisplay] = useState('')
  const [cardDisplay, setCardDisplay] = useState('')
  const [upiDisplay, setUpiDisplay] = useState('')

  const cashNum = Number(cashRef.current?.value || cashDisplay) || 0
  const cardNum = Number(cardRef.current?.value || cardDisplay) || 0
  const upiNum = Number(upiRef.current?.value || upiDisplay) || 0

  const discountAmount = discountType === 'Percentage'
    ? (order.subtotal * discountValue) / 100
    : discountValue

  const { taxTotal } = calculateTax(order.subtotal ?? 0, taxPercentage ?? 0, taxType as 'Inclusive' | 'Exclusive')
  const exactGrandTotal = taxType === 'Inclusive'
    ? order.subtotal - discountAmount
    : order.subtotal + taxTotal - discountAmount
  const { grandTotal: displayGrandTotal } = calculateRounding(exactGrandTotal)
  const totalPaid = cashNum + cardNum + upiNum
  const change = totalPaid - displayGrandTotal

  const settleMut = useMutation({
    mutationFn: async () => {
      const cashVal = Number(cashRef.current?.value || cashDisplay) || 0
      const cardVal = Number(cardRef.current?.value || cardDisplay) || 0
      const upiVal = Number(upiRef.current?.value || upiDisplay) || 0
      const { data } = await apiClient.post('/settlement', {
        orderId: order.id,
        discountType: discountType || undefined,
        discountValue: discountValue || undefined,
        discountReason: discountReason || undefined,
        payments: { cash: cashVal, card: cardVal, upi: upiVal },
      })
      return data
    },
    onSuccess: () => {
      toast('Settlement completed', 'success')
      onSettled()
    },
    onError: (err: unknown) => {
      const data = (err as { response?: { data?: { error?: { message?: string } | string } } })?.response?.data
      const e = data?.error
      const msg = typeof e === 'string' ? e : e?.message
        ?? (err as Error)?.message
        ?? 'Settlement failed'
      toast(String(msg), 'error')
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
                defaultValue=""
                placeholder="0"
                autoFocus
                onInput={(e) => setCashDisplay((e.target as HTMLInputElement).value)}
                className="flex-1 rounded-lg border px-3 py-2 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-12 text-sm text-muted-foreground">Card</span>
              <input
                ref={cardRef}
                type="number"
                inputMode="decimal"
                defaultValue=""
                placeholder="0"
                onInput={(e) => setCardDisplay((e.target as HTMLInputElement).value)}
                className="flex-1 rounded-lg border px-3 py-2 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-12 text-sm text-muted-foreground">UPI</span>
              <input
                ref={upiRef}
                type="number"
                inputMode="decimal"
                defaultValue=""
                placeholder="0"
                onInput={(e) => setUpiDisplay((e.target as HTMLInputElement).value)}
                className="flex-1 rounded-lg border px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="border-t pt-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Grand Total</span>
              <span className="font-bold">₹{displayGrandTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Paid</span>
              <span>₹{totalPaid.toLocaleString()}</span>
            </div>
            {totalPaid >= displayGrandTotal && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Change</span>
                <span className="font-bold">₹{change.toLocaleString()}</span>
              </div>
            )}
          </div>

          <button
            onClick={() => settleMut.mutate()}
            disabled={totalPaid < displayGrandTotal || settleMut.isPending}
            className="w-full rounded-lg border px-4 py-2.5 text-sm font-bold text-white bg-green-500 hover:bg-green-600 disabled:opacity-50"
          >
            {settleMut.isPending ? 'Processing...' : 'Complete Settlement'}
          </button>
        </div>
      </div>
    </div>
  )
}
