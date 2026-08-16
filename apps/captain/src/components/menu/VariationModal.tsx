import { formatCurrency } from '@/lib/format'
import { X } from 'lucide-react'
import type { MenuItem } from '@/lib/types'

interface VariationModalProps {
  item: MenuItem
  onSelect: (variationId?: string) => void
  onClose: () => void
}

export function VariationModal({ item, onSelect, onClose }: VariationModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={onClose}>
      <div
        className="animate-slide-up w-full max-w-md rounded-t-2xl bg-card p-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold">{item.name}</h3>
            <p className="text-xs text-muted-foreground">Choose an option</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-muted-foreground hover:bg-muted">
            <X size={18} />
          </button>
        </div>

        <div className="scrollbar-none max-h-[60vh] space-y-2 overflow-y-auto">
          {item.variations.map((v) => (
            <button
              key={v.id}
              onClick={() => onSelect(v.id)}
              className="flex w-full items-center justify-between rounded-xl border bg-card px-4 py-3.5 text-left transition-all active:scale-[0.98] hover:border-primary/40"
            >
              <span className="text-sm font-medium">{v.name}</span>
              <span className="text-sm font-bold text-primary">
                {formatCurrency(item.basePrice + v.priceAdjustment)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
