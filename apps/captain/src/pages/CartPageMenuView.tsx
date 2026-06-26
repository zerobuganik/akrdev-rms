import type { MenuItem, MenuCategory } from '@akrdev/types'
import { Search, UtensilsCrossed, Plus } from 'lucide-react'
import { lightHaptic } from '@/lib/native-bridge'
import { cn } from '@/lib/utils'

interface MenuViewProps {
  items: MenuItem[]
  categories: MenuCategory[]
  itemsByCategory: Array<{ category: MenuCategory | null; items: MenuItem[] }>
  activeCategoryId: string | null
  search: string
  onSearchChange: (v: string) => void
  onCategoryChange: (id: string) => void
  onItemClick: (item: MenuItem) => void
}

export default function CartPageMenuView({
  items,
  itemsByCategory,
  activeCategoryId,
  search,
  onSearchChange,
  onCategoryChange,
  onItemClick,
}: MenuViewProps) {
  const activeCategoryItems = (() => {
    const group = itemsByCategory.find(
      (g) => (g.category?.id ?? '__no_cat__') === activeCategoryId,
    )
    const allItems = group?.items ?? []
    if (!search) return allItems
    return allItems.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()))
  })()

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="shrink-0 bg-card px-3 pb-2">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search items..."
            className="w-full rounded-md border bg-muted py-2 pl-9 pr-3 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      <div className="shrink-0 border-b bg-card">
        <div className="flex gap-1 overflow-x-auto px-3 pb-2 scrollbar-none">
          {itemsByCategory.map((group) => {
            const catKey = group.category?.id ?? '__no_cat__'
            const isActive = activeCategoryId === catKey
            if (group.items.length === 0) return null
            return (
              <button
                key={catKey}
                onClick={() => { lightHaptic(); onCategoryChange(catKey) }}
                className={cn(
                  'shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all',
                  isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80',
                )}
              >
                {group.category?.name ?? 'General'}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-3">
        {activeCategoryItems.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
            <UtensilsCrossed size={28} />
            <p className="mt-2 text-sm">
              {items.length === 0 ? 'No menu items available' : search ? 'No items match' : 'No items in category'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-1.5">
            {activeCategoryItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onItemClick(item)}
                className="flex items-center gap-3 rounded-xl border bg-card p-3 text-left shadow-sm transition-all active:scale-[0.98] hover:bg-accent"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate">{item.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {item.variations.length > 0 ? 'Select variation' : 'Tap to add'}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold">₹{item.basePrice.toLocaleString()}</p>
                  {item.variations.length > 0 && (
                    <p className="text-[10px] text-amber-600 font-medium">+ options</p>
                  )}
                </div>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Plus size={15} />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
