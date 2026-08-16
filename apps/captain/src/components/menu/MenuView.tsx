import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/apiClient'
import { formatCurrency } from '@/lib/format'
import { lightHaptic } from '@/lib/native-bridge'
import { Search, Layers } from 'lucide-react'
import { cn } from '@/lib/utils'
import { VariationModal } from '@/components/menu/VariationModal'
import type { MenuItem, MenuCategory } from '@/lib/types'

interface MenuViewProps {
  onAddItem: (item: MenuItem, variationId?: string) => void
  cartItems?: Array<{ itemId: string; quantity: number; status?: string }>
}

export function MenuView({ onAddItem, cartItems }: MenuViewProps) {
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)

  const { data: items } = useQuery({
    queryKey: ['items'],
    queryFn: async () => (await apiClient.get<MenuItem[]>('/items')).data,
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await apiClient.get<MenuCategory[]>('/categories')).data,
  })

  const filtered = useMemo(() => {
    let list = items ?? []
    if (categoryId) list = list.filter((i) => i.categoryId === categoryId)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter((i) => i.name.toLowerCase().includes(q))
    }
    return list
  }, [items, categoryId, search])

  const qtyByItem = useMemo(() => {
    const map = new Map<string, number>()
    for (const it of cartItems ?? []) {
      if (it.status === 'Sent' || it.status === 'Ready' || it.status === 'Cancelled') continue
      map.set(it.itemId, (map.get(it.itemId) ?? 0) + it.quantity)
    }
    return map
  }, [cartItems])

  const handleTap = (item: MenuItem) => {
    lightHaptic()
    if (item.variations && item.variations.length > 0) {
      setSelectedItem(item)
    } else {
      onAddItem(item)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="space-y-2 border-b bg-background px-3 py-2">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items"
            className="w-full rounded-lg border bg-card py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setCategoryId(null)}
            className={cn(
              'shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors',
              categoryId === null ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
            )}
          >
            All
          </button>
          {(categories ?? []).map((c) => (
            <button
              key={c.id}
              onClick={() => setCategoryId(c.id)}
              className={cn(
                'shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors',
                categoryId === c.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="scrollbar-none min-h-0 flex-1 overflow-y-auto px-3 py-3">
        {filtered.length === 0 && (
          <p className="py-16 text-center text-sm text-muted-foreground">No items found.</p>
        )}
        <div className="grid grid-cols-2 gap-2.5">
          {filtered.map((item) => {
            const qty = qtyByItem.get(item.id) ?? 0
            const hasVariations = (item.variations?.length ?? 0) > 0
            return (
              <button
                key={item.id}
                onClick={() => handleTap(item)}
                className="relative flex flex-col rounded-xl border bg-card p-3 text-left shadow-sm transition-all active:scale-[0.97] hover:border-primary/40"
              >
                {qty > 0 && (
                  <span className="absolute right-2 top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-primary-foreground">
                    {qty}
                  </span>
                )}
                <span className="pr-8 text-sm font-medium leading-tight text-foreground">{item.name}</span>
                <span className="mt-1.5 text-sm font-bold text-primary">{formatCurrency(item.basePrice)}</span>
                {hasVariations && (
                  <span className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Layers size={10} /> {item.variations!.length} options
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {selectedItem && (
        <VariationModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onSelect={(variationId) => {
            onAddItem(selectedItem, variationId)
            setSelectedItem(null)
          }}
        />
      )}
    </div>
  )
}
