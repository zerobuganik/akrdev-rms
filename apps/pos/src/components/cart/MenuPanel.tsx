import { useState, useCallback, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/apiClient'
import { Search, X } from 'lucide-react'

interface Item {
  id: string
  name: string
  shortcode?: string
  basePrice: number
  inStock: boolean
  categoryId: string
  category: { id: string; name: string }
  variations: Array<{ id: string; name: string; priceAdjustment: number }>
}

interface Category {
  id: string
  name: string
}

interface MenuPanelProps {
  onAddItem: (item: Item, variationId?: string) => void
}

export function MenuPanel({ onAddItem }: MenuPanelProps) {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [variationItem, setVariationItem] = useState<Item | null>(null)
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout>>()

  const { data: items = [] } = useQuery<Item[]>({
    queryKey: ['items', selectedCategory],
    queryFn: async () => {
      const params = selectedCategory ? { categoryId: selectedCategory } : {}
      const { data } = await apiClient.get('/items', { params })
      return data
    },
  })

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await apiClient.get('/categories')
      return data
    },
  })

  const handleSearch = (value: string) => {
    setSearch(value)
    clearTimeout(debounceTimerRef.current)
    debounceTimerRef.current = setTimeout(() => setDebouncedSearch(value), 300)
  }

  const filteredItems = items.filter(
    (item) =>
      item.inStock &&
      (debouncedSearch === '' ||
        item.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.shortcode?.toLowerCase().includes(debouncedSearch.toLowerCase())),
  )

  const handleItemClick = (item: Item) => {
    if (item.variations.length > 0) {
      setVariationItem(item)
    } else {
      onAddItem(item)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search items or shortcode..."
            className="w-full rounded-lg border py-2 pl-9 pr-3 text-sm"
          />
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto border-b px-3 py-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            !selectedCategory ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              selectedCategory === cat.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-3">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              className="rounded-lg border p-3 text-left transition-colors hover:bg-muted"
            >
              <p className="text-sm font-medium">{item.name}</p>
              {item.variations.length > 0 ? (
                <p className="mt-1 text-xs italic text-muted-foreground">Variable</p>
              ) : (
                <p className="mt-1 text-xs font-semibold">₹{item.basePrice.toLocaleString()}</p>
              )}
              {item.shortcode && (
                <p className="text-xs text-muted-foreground">{item.shortcode}</p>
              )}
            </button>
          ))}
        </div>
      </div>

      {variationItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setVariationItem(null)}>
          <div className="w-full max-w-sm rounded-xl bg-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold">{variationItem.name}</h3>
              <button onClick={() => setVariationItem(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="space-y-2">
              {variationItem.variations.map((v) => (
                <button
                  key={v.id}
                  onClick={() => {
                    onAddItem(variationItem, v.id)
                    setVariationItem(null)
                  }}
                  className="flex w-full justify-between rounded-lg border px-4 py-2 text-sm hover:bg-muted"
                >
                  <span>{v.name}</span>
                  <span className="font-medium">
                    ₹{v.priceAdjustment.toLocaleString()}
                  </span>
                </button>
              ))}
              {variationItem.variations.length === 0 && (
                <button
                  onClick={() => {
                    onAddItem(variationItem)
                    setVariationItem(null)
                  }}
                  className="w-full rounded-lg border px-4 py-2 text-sm hover:bg-muted"
                >
                  Regular — ₹{variationItem.basePrice.toLocaleString()}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
