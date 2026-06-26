import type { MenuItem } from '@akrdev/types'

interface VariationModalProps {
  item: MenuItem
  onSelect: (item: MenuItem, variation: MenuItem['variations'][number]) => void
  onClose: () => void
}

export default function VariationModal({ item, onSelect, onClose }: VariationModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" onClick={onClose}>
      <div className="w-full max-w-md rounded-t-2xl bg-card p-5 pb-8 animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border" />
        <h3 className="mb-4 text-base font-bold">{item.name}</h3>
        <p className="mb-3 text-xs text-muted-foreground">Select a variation</p>
        <div className="space-y-2">
          {item.variations.map((v) => (
            <button
              key={v.id}
              onClick={() => onSelect(item, v)}
              className="flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition-all active:scale-[0.98] hover:bg-accent"
            >
              <span>{v.name}</span>
              <span className="font-bold text-primary">
                {v.priceAdjustment > 0 ? '+' : ''}₹{(item.basePrice + v.priceAdjustment).toLocaleString()}
              </span>
            </button>
          ))}
        </div>
        <button onClick={onClose} className="mt-4 w-full rounded-xl bg-muted py-3 text-sm font-semibold hover:bg-muted/80">
          Cancel
        </button>
      </div>
    </div>
  )
}
