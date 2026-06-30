import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { flushSync } from 'react-dom'
import { apiClient } from '@/lib/apiClient'
import { printerApi } from '@/lib/printerApi'
import { resolveImageUrl } from '@/lib/imageBaseUrl'
import { toast } from '@/stores/useToastStore'
import { Pencil, Trash2, Plus, Search, X, Upload, ChevronDown } from 'lucide-react'

interface Category {
  id: string
  name: string
  displayOrder: number
  defaultTaxPercent: number
  imageUrl?: string | null
  kitchenId?: string | null
  _count: { items: number }
}

interface Item {
  id: string
  name: string
  basePrice: number
  taxOverride: number | null
  inStock: boolean
  categoryId: string
  imageUrl?: string | null
  category: { name: string }
  variations: Array<{ id: string; name: string; priceAdjustment: number }>
}

interface TaxSlab {
  id: string
  name: string
  percent: number
  isDefault: boolean
  isActive: boolean
}

const DIETARY_TYPES = ['Veg', 'Non-Veg', 'Egg', 'Beverage'] as const

const TABS = ['Items', 'Category'] as const
type Tab = (typeof TABS)[number]

export default function ItemsPage() {
  const [tab, setTab] = useState<Tab>('Items')
  const [search, setSearch] = useState('')
  const [categorySearch, setCategorySearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [newItem, setNewItem] = useState(false)
  const [itemForm, setItemForm] = useState({ name: '', basePrice: '', categoryId: '', taxOverride: '', dietaryType: '' as '' | typeof DIETARY_TYPES[number] })
  const [itemVarForm, setItemVarForm] = useState({ name: '', priceAdjustment: '' })
  const [itemVariations, setItemVariations] = useState<Array<{ name: string; priceAdjustment: number; id?: string }>>([])
  const [editingVarIndex, setEditingVarIndex] = useState<number | null>(null)
  const [hasVariations, setHasVariations] = useState(false)
  const [itemKitchenId, setItemKitchenId] = useState<string | null>(null)
  const [itemImage, setItemImage] = useState<string | null>(null)
  const [itemImageFile, setItemImageFile] = useState<string | null>(null)
  const itemFileRef = useRef<HTMLInputElement>(null)

  const [showCategoryPopup, setShowCategoryPopup] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [catForm, setCatForm] = useState({ name: '', defaultTaxPercent: 5, displayOrder: 0 })
  const [catKitchenId, setCatKitchenId] = useState<string | null>(null)
  const [catImage, setCatImage] = useState<string | null>(null)
  const [catImageFile, setCatImageFile] = useState<string | null>(null)
  const catFileRef = useRef<HTMLInputElement>(null)

  const openCategoryForm = () => {
    setEditingCategory(null)
    const defaultTax = taxSlabs.find((t) => t.isDefault)
    setCatForm({ name: '', defaultTaxPercent: defaultTax?.percent ?? 5, displayOrder: 0 })
    setCatKitchenId(kitchenPrinters[0]?.id ?? null)
    setCatImage(null)
    setCatImageFile(null)
    setShowCategoryPopup(true)
  }

  const openEditCategory = (cat: Category) => {
    setEditingCategory(cat)
    setCatForm({ name: cat.name, defaultTaxPercent: cat.defaultTaxPercent, displayOrder: cat.displayOrder })
    setCatKitchenId(cat.kitchenId ?? null)
    setCatImage(resolveImageUrl(cat.imageUrl))
    setCatImageFile(null)
    setShowCategoryPopup(true)
  }

  const resetCategoryForm = () => {
    setShowCategoryPopup(false)
    setEditingCategory(null)
  }

  const queryClient = useQueryClient()

  const { data: kitchenPrinters = [] } = useQuery({
    queryKey: ['kitchenPrinters'],
    queryFn: async () => {
      const printers = await printerApi.getPrinters()
      return printers.filter((p) => p.isKitchen)
    },
  })

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await apiClient.get('/categories')
      return data
    },
  })

  const { data: taxSlabs = [] } = useQuery<TaxSlab[]>({
    queryKey: ['taxSlabs'],
    queryFn: async () => {
      const { data } = await apiClient.get('/tax-slabs')
      return data ?? []
    },
  })

  const { data: items = [] } = useQuery<Item[]>({
    queryKey: ['items'],
    queryFn: async () => {
      const { data } = await apiClient.get('/items')
      return data
    },
  })

  const uploadImage = async (imageData: string, endpoint: string) => {
    const { data } = await apiClient.post(endpoint, { image: imageData })
    return data.imageUrl as string
  }

  const catMut = useMutation({
    mutationFn: async (data: { name: string; defaultTaxPercent: number; displayOrder: number; kitchenId?: string | null; image?: string | null }) => {
      const payload: Record<string, unknown> = {
        name: data.name,
        defaultTaxPercent: data.defaultTaxPercent,
        displayOrder: data.displayOrder,
      }
      if (data.kitchenId !== undefined) payload.kitchenId = data.kitchenId
      if (editingCategory) {
        await apiClient.put(`/categories/${editingCategory.id}`, payload)
        if (data.image) {
          await uploadImage(data.image, `/categories/${editingCategory.id}/upload-image`)
        } else if (data.image === null && editingCategory.imageUrl) {
          await apiClient.delete(`/categories/${editingCategory.id}/upload-image`)
        }
      } else {
        const res = await apiClient.post('/categories', payload)
        if (data.image) {
          await uploadImage(data.image, `/categories/${res.data.id}/upload-image`)
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      resetCategoryForm()
      toast(editingCategory ? 'Category updated' : 'Category created', 'success')
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message
        ?? (err as Error)?.message
        ?? 'Failed to save category'
      toast(msg, 'error')
    },
  })

  const deleteCatMut = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/categories/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast('Category deleted', 'success')
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message
        ?? (err as Error)?.message
        ?? 'Failed to delete category'
      toast(msg, 'error')
    },
  })

  const itemMut = useMutation({
    mutationFn: async (data: {
      name: string; basePrice: number; categoryId: string;
      taxOverride?: string; dietaryType?: string; kitchenId?: string | null
      variations?: Array<{ name: string; priceAdjustment: number }>
      image?: string | null
    }) => {
      const payload: Record<string, unknown> = {
        name: data.name, basePrice: data.basePrice, categoryId: data.categoryId,
      }
      if (data.taxOverride) payload.taxOverride = Number(data.taxOverride)
      if (data.dietaryType) payload.dietaryType = data.dietaryType
      if (data.kitchenId) payload.kitchenId = data.kitchenId
      if (data.variations?.length) payload.variations = data.variations
      if (editingItem) {
        await apiClient.put(`/items/${editingItem.id}`, payload)
        if (data.image) {
          await uploadImage(data.image, `/items/${editingItem.id}/upload-image`)
        }
      } else {
        const res = await apiClient.post('/items', payload)
        if (data.image) {
          await uploadImage(data.image, `/items/${res.data.id}/upload-image`)
        }
      }
    },
    onSuccess: () => {
      const wasEditing = !!editingItem
      queryClient.invalidateQueries({ queryKey: ['items'] })
      setEditingItem(null)
      setNewItem(false)
      setHasVariations(false)
      setItemVariations([])
      setItemImage(null)
      setItemImageFile(null)
      setItemForm({ name: '', basePrice: '', categoryId: '', taxOverride: '', dietaryType: '' })
      toast(wasEditing ? 'Item updated' : 'Item created', 'success')
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message
        ?? (err as Error)?.message
        ?? 'Failed to save item'
      toast(msg, 'error')
    },
  })

  const deleteItemMut = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/items/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
      toast('Item deleted', 'success')
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message
        ?? (err as Error)?.message
        ?? 'Failed to delete item'
      toast(msg, 'error')
    },
  })

  const toggleStockMut = useMutation({
    mutationFn: async ({ id, inStock }: { id: string; inStock: boolean }) => {
      await apiClient.put(`/items/${id}`, { inStock: !inStock })
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['items'] }),
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message
        ?? (err as Error)?.message
        ?? 'Failed to update stock'
      toast(msg, 'error')
    },
  })

  const deleteVarMut = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/variations/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
      toast('Variation removed', 'success')
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message
        ?? (err as Error)?.message
        ?? 'Failed to remove variation'
      toast(msg, 'error')
    },
  })

  const handleImageSelect = (file: File, setter: (v: string | null) => void, setFile: (v: string | null) => void) => {
    if (file.size > 2 * 1024 * 1024) {
      toast('Image must be under 2MB', 'error')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setter(result)
      setFile(result)
    }
    reader.readAsDataURL(file)
  }

  const filteredItems = items.filter((item) => {
    const matchesSearch = search === '' ||
      item.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !categoryFilter || item.categoryId === categoryFilter
    return matchesSearch && matchesCategory
  })

  const filteredCategories = categories.filter((cat) =>
    categorySearch === '' || cat.name.toLowerCase().includes(categorySearch.toLowerCase())
  )

  const categoryName = (catId: string) => categories.find((c) => c.id === catId)?.name ?? '—'

  const openEdit = (item: Item) => {
    // Use flushSync to force synchronous DOM update before modal renders
    flushSync(() => {
      setNewItem(false)
      setEditingItem(null)
      resetForm()
    })
    // Now set the item data in a new synchronous batch
    const hasVars = item.variations.length > 0
    flushSync(() => {
      setHasVariations(hasVars)
      setItemVariations(item.variations.map((v) => ({ id: v.id, name: v.name, priceAdjustment: v.priceAdjustment })))
      setItemForm({
        name: item.name,
        basePrice: String(item.basePrice), categoryId: item.categoryId,
        taxOverride: item.taxOverride?.toString() ?? '',
        dietaryType: (item as any).dietaryType ?? '',
      })
      setItemKitchenId(kitchenPrinters[0]?.id ?? null)
      setItemImage(resolveImageUrl(item.imageUrl))
      setEditingItem(item)
    })
  }

  const validateItemForm = (): boolean => {
    if (!itemForm.name.trim()) { toast('Item name is required', 'error'); return false }
    if (!itemForm.categoryId) { toast('Category is required', 'error'); return false }
    if (!hasVariations) {
      const price = Number(itemForm.basePrice)
      if (!itemForm.basePrice || isNaN(price) || price < 0) { toast('Valid price is required', 'error'); return false }
    }
    return true
  }

  const validateCatForm = (): boolean => {
    if (!catForm.name.trim()) { toast('Category name is required', 'error'); return false }
    return true
  }

  const resetForm = () => { setNewItem(false); setEditingItem(null); setHasVariations(false); setItemVariations([]); setEditingVarIndex(null); setItemVarForm({ name: '', priceAdjustment: '' }); setItemImage(null); setItemImageFile(null) }

  return (
    <div className="flex h-full flex-col">
      {/* Tab bar */}
      <div className="flex gap-2 px-6 pt-4 pb-3">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium ${
              tab === t ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      {tab === 'Items' && (
        <div className="flex items-center gap-4 border-b px-6 py-4">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search items by name"
              className="w-full rounded-lg border bg-muted/50 py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center justify-between gap-2 h-11 px-4 bg-muted/50 border rounded-lg text-sm min-w-[180px]"
            >
              <span>{categoryFilter ? categoryName(categoryFilter) : 'Filter by Category'}</span>
              <ChevronDown size={14} />
            </button>
            {showFilterDropdown && (
              <div className="absolute top-full left-0 mt-1 w-full rounded-lg border bg-white shadow-lg z-20">
                <button
                  onClick={() => { setCategoryFilter(null); setShowFilterDropdown(false) }}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-muted ${!categoryFilter ? 'font-semibold' : ''}`}
                >
                  All Categories
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { setCategoryFilter(c.id); setShowFilterDropdown(false) }}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-muted ${categoryFilter === c.id ? 'font-semibold' : ''}`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex-1" />
          <button className="flex items-center gap-2 h-11 px-5 rounded-lg border bg-muted/50 text-sm font-semibold hover:bg-muted transition-colors" disabled>
            <Upload size={14} /> Bulk Import
          </button>
          <button
            onClick={() => {
              setNewItem(true)
              setEditingItem(null)
              setHasVariations(false)
              setItemVariations([])
              setItemImage(null)
              setItemImageFile(null)
              const defaultTax = taxSlabs.find((t) => t.isDefault)
              setItemForm({ name: '', basePrice: '', categoryId: '', taxOverride: defaultTax?.percent?.toString() ?? '', dietaryType: '' })
              setItemKitchenId(kitchenPrinters[0]?.id ?? null)
            }}
            className="flex items-center gap-2 h-11 px-5 rounded-lg bg-gray-900 text-white text-sm font-semibold shadow-sm hover:bg-gray-800 transition-colors"
          >
            <Plus size={14} /> Add New Item
          </button>
        </div>
      )}

      {tab === 'Category' && (
        <>
          <div className="flex items-center gap-4 border-b px-6 py-4">
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                placeholder="Search categories by name"
                className="w-full rounded-lg border bg-muted/50 py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="flex-1" />
            <button className="flex items-center gap-2 h-11 px-5 rounded-lg border bg-muted/50 text-sm font-semibold hover:bg-muted transition-colors" disabled>
              <Upload size={14} /> Bulk Import
            </button>
            <button
              onClick={openCategoryForm}
              className="flex items-center gap-2 h-11 px-5 rounded-lg bg-gray-900 text-white text-sm font-semibold shadow-sm hover:bg-gray-800 transition-colors"
            >
              <Plus size={14} /> Add Category
            </button>
          </div>
          <div className="flex-1 overflow-auto px-6 py-4">
            <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="p-4 w-12"><input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900/50" /></th>
                    <th className="p-4 text-xs font-bold uppercase text-muted-foreground tracking-wider">Image</th>
                    <th className="p-4 text-xs font-bold uppercase text-muted-foreground tracking-wider">Name</th>
                    <th className="p-4 text-xs font-bold uppercase text-muted-foreground tracking-wider">Tax Slab</th>
                    <th className="p-4 text-center text-xs font-bold uppercase text-muted-foreground tracking-wider">Items</th>
                    <th className="p-4 text-right text-xs font-bold uppercase text-muted-foreground tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredCategories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-muted/20">
                      <td className="p-4"><input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900/50" /></td>
                      <td className="p-4">
                        {cat.imageUrl ? (
                          <img src={resolveImageUrl(cat.imageUrl) ?? ''} alt={cat.name} className="size-10 rounded-lg object-cover" />
                        ) : (
                          <div className="size-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground font-bold text-xs">
                            {cat.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </td>
                      <td className="p-4 font-semibold">{cat.name}</td>
                      <td className="p-4 text-muted-foreground">{cat.defaultTaxPercent}%</td>
                      <td className="p-4 text-center text-muted-foreground">{cat._count.items}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEditCategory(cat)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
                            <Pencil size={16} />
                          </button>
                          <button onClick={() => deleteCatMut.mutate(cat.id)} className="rounded-md p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-500">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredCategories.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">No categories found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Items Table */}
      {tab === 'Items' && (
        <div className="flex-1 overflow-auto px-6 py-4">
          <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b">
                <tr>
                  <th className="p-4 w-12"><input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900/50" /></th>
                  <th className="p-4 text-xs font-bold uppercase text-muted-foreground tracking-wider">Image</th>
                  <th className="p-4 text-xs font-bold uppercase text-muted-foreground tracking-wider">Details</th>
                  <th className="p-4 text-xs font-bold uppercase text-muted-foreground tracking-wider">Category</th>
                  <th className="p-4 text-xs font-bold uppercase text-muted-foreground tracking-wider">Price</th>
                  <th className="p-4 text-center text-xs font-bold uppercase text-muted-foreground tracking-wider">Stock</th>
                  <th className="p-4 text-right text-xs font-bold uppercase text-muted-foreground tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/20">
                    <td className="p-4"><input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900/50" /></td>
                    <td className="p-4">
                      {item.imageUrl ? (
                        <img src={resolveImageUrl(item.imageUrl) ?? ''} alt={item.name} className="size-10 rounded-lg object-cover" />
                      ) : (
                        <div className="size-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground font-bold text-xs">
                          {item.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <p className="font-semibold">{item.name}</p>
                      {item.variations.length > 0 && (
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {item.variations.map((v) => `${v.name} ₹${v.priceAdjustment.toLocaleString()}`).join(', ')}
                        </p>
                      )}
                    </td>
                    <td className="p-4 text-muted-foreground">{categoryName(item.categoryId)}</td>
                    <td className="p-4 font-medium">
                      {item.variations.length > 0 ? (
                        <span className="text-xs text-muted-foreground italic">Variable</span>
                      ) : (
                        `₹${item.basePrice.toLocaleString()}`
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => toggleStockMut.mutate({ id: item.id, inStock: item.inStock })}
                        className={`rounded px-2.5 py-1 text-xs font-medium ${
                          item.inStock ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {item.inStock ? 'In Stock' : 'Out'}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(item)}
                          className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => deleteItemMut.mutate(item.id)}
                          className="rounded-md p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredItems.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">No items found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Item form modal popup */}
      {(newItem || editingItem) && (
        <div key={editingItem?.id ?? 'new'} className="fixed inset-0 z-40 flex items-start justify-center p-4 sm:p-6 lg:p-8 overflow-auto" onClick={(e) => { if (e.target === e.currentTarget) resetForm() }}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 w-full max-w-4xl bg-background rounded-xl shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between gap-4 p-4 border-b">
              <p className="text-2xl font-bold tracking-tight">{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</p>
              <button onClick={resetForm} className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-muted hover:bg-muted/80">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-x-8 gap-y-6">
                {/* Left Column — Basic Info */}
                <div className="flex flex-col gap-5">
                  <div>
                    <label className="block text-sm font-medium pb-2">Item Name <span className="text-red-500">*</span></label>
                    <input value={itemForm.name} onChange={(e) => setItemForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Chicken Biryani" className="w-full rounded-lg border px-4 py-3 text-sm" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium pb-2">Category <span className="text-red-500">*</span></label>
                    <select value={itemForm.categoryId} onChange={(e) => setItemForm((f) => ({ ...f, categoryId: e.target.value }))} className="w-full rounded-lg border px-4 py-3 text-sm" required>
                      <option value="">Select category</option>
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium pb-2">Dietary Type</h3>
                    <div className="flex flex-wrap gap-2">
                      {DIETARY_TYPES.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setItemForm((f) => ({ ...f, dietaryType: f.dietaryType === type ? '' : type }))}
                          className={`rounded-full h-8 px-3 text-xs font-medium transition-colors border ${
                            itemForm.dietaryType === type
                              ? type === 'Veg' ? 'bg-emerald-500 text-white border-emerald-500' :
                                type === 'Non-Veg' ? 'bg-red-500 text-white border-red-500' :
                                type === 'Egg' ? 'bg-amber-500 text-white border-amber-500' :
                                'bg-blue-500 text-white border-blue-500'
                              : type === 'Veg' ? 'bg-emerald-50 text-emerald-600 border-emerald-500' :
                                type === 'Non-Veg' ? 'bg-red-50 text-red-600 border-red-500/50 hover:border-red-500' :
                                type === 'Egg' ? 'bg-amber-50 text-amber-600 border-amber-500/50 hover:border-amber-500' :
                                'bg-blue-50 text-blue-600 border-blue-500/50 hover:border-blue-500'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Middle Column — Pricing & Options */}
                <div className="flex flex-col gap-5">
                  {/* Has Variations — Segmented Control */}
                  <div>
                    <label className="block text-sm font-medium pb-2">Pricing Mode</label>
                    <div className="inline-flex rounded-lg border-2 border-gray-200 bg-gray-50 p-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          if (hasVariations) {
                            setHasVariations(false)
                            setItemVariations([])
                            setEditingVarIndex(null)
                            setItemVarForm({ name: '', priceAdjustment: '' })
                            setItemForm((f) => ({ ...f, basePrice: '' }))
                          }
                        }}
                        className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
                          !hasVariations
                            ? 'bg-gray-900 text-white shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        Single Price
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!hasVariations) {
                            setHasVariations(true)
                            setItemForm((f) => ({ ...f, basePrice: '0' }))
                          }
                        }}
                        className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
                          hasVariations
                            ? 'bg-gray-900 text-white shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        Has Variations
                      </button>
                    </div>
                  </div>

                  {/* Price Field — only shown when Single Price is selected */}
                  {!hasVariations && (
                    <div>
                      <label className="block text-sm font-medium pb-2">Price (₹) <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={itemForm.basePrice}
                        onChange={(e) => setItemForm((f) => ({ ...f, basePrice: e.target.value }))}
                        placeholder="e.g. 250"
                        className="w-full rounded-lg border px-4 py-3 text-sm"
                      />
                    </div>
                  )}

                  {/* Tax Slab */}
                  <div>
                    <label className="block text-sm font-medium pb-2">Tax Slab</label>
                    <select value={itemForm.taxOverride} onChange={(e) => setItemForm((f) => ({ ...f, taxOverride: e.target.value }))} className="w-full rounded-lg border px-4 py-3 text-sm">
                      <option value="">Category Default</option>
                      {taxSlabs.filter((t) => t.isActive).map((t) => <option key={t.id} value={t.percent}>{t.name} ({t.percent}%)</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium pb-2">Kitchen</label>
                    <select value={itemKitchenId ?? ''} onChange={(e) => setItemKitchenId(e.target.value || null)} className="w-full rounded-lg border px-4 py-3 text-sm">
                      <option value="">Category Default</option>
                      {kitchenPrinters.map((k) => <option key={k.id} value={k.id}>{k.displayName || k.name}</option>)}
                    </select>
                  </div>
                </div>

                {/* Right Column — Image */}
                <div className="flex flex-col items-start">
                  <label className="block mb-3 text-xs font-semibold tracking-[0.05em] uppercase text-foreground">
                    Item Image
                  </label>
                  <input
                    ref={itemFileRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageSelect(file, setItemImage, setItemImageFile)
                      if (itemFileRef.current) itemFileRef.current.value = ''
                    }}
                  />
                  <div className="relative w-32 h-32">
                    {itemImage ? (
                      <div className="relative group w-full h-full rounded-xl overflow-hidden border-2 border-border">
                        <img src={itemImage} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => itemFileRef.current?.click()}
                            className="opacity-0 group-hover:opacity-100 rounded-full bg-white/90 p-1.5 text-gray-700 hover:bg-white transition-all"
                            title="Change Image"
                          >
                            <Upload size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setItemImage(null); setItemImageFile(null) }}
                            className="opacity-0 group-hover:opacity-100 rounded-full bg-white/90 p-1.5 text-red-500 hover:bg-white transition-all"
                            title="Remove Image"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => itemFileRef.current?.click()}
                        className="w-full h-full bg-muted/50 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl hover:border-primary cursor-pointer transition-colors"
                      >
                        <Upload className="mb-1 text-muted-foreground" size={24} />
                        <p className="text-[10px] font-semibold uppercase tracking-[0.05em] text-muted-foreground leading-tight">Upload Image</p>
                        <p className="text-[9px] text-muted-foreground mt-0.5">Max 2 MB</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Variations Section */}
              {hasVariations && (
                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <ChevronDown size={18} />
                    <span className="text-sm font-semibold">Variations <span className="text-red-500">*</span></span>
                    {itemVariations.length === 0 && <span className="text-xs text-red-400">Add at least one variation</span>}
                  </div>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input value={itemVarForm.name} onChange={(e) => setItemVarForm((f) => ({ ...f, name: e.target.value }))} placeholder="Name (e.g. Half, Large)" className="flex-1 rounded-lg border px-4 py-2.5 text-sm" />
                      <div className="relative w-32">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₹</span>
                        <input type="number" min="" step="any" value={itemVarForm.priceAdjustment} onChange={(e) => setItemVarForm((f) => ({ ...f, priceAdjustment: e.target.value }))} placeholder="Price" className="w-full rounded-lg border pl-8 pr-3 py-2.5 text-sm" />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (editingVarIndex !== null) {
                            if (!itemVarForm.name.trim()) { toast('Enter a variation name', 'error'); return }
                            setItemVariations((v) => v.map((v2, i) => i === editingVarIndex ? { ...v2, name: itemVarForm.name.trim(), priceAdjustment: Number(itemVarForm.priceAdjustment) || 0 } : v2))
                            setItemVarForm({ name: '', priceAdjustment: '' })
                            setEditingVarIndex(null)
                            return
                          }
                          if (!itemVarForm.name.trim()) { toast('Enter a variation name', 'error'); return }
                          setItemVariations((v) => [...v, { name: itemVarForm.name.trim(), priceAdjustment: Number(itemVarForm.priceAdjustment) || 0 }])
                          setItemVarForm({ name: '', priceAdjustment: '' })
                        }}
                        className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
                      >
                        {editingVarIndex !== null ? 'Update' : 'Add'}
                      </button>
                      {editingVarIndex !== null && (
                        <button
                          type="button"
                          onClick={() => { setItemVarForm({ name: '', priceAdjustment: '' }); setEditingVarIndex(null) }}
                          className="rounded-lg border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                    {itemVariations.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {itemVariations.map((v, idx) => (
                          <div key={v.id ?? idx} className={`flex items-center justify-between bg-muted/50 px-4 py-2.5 rounded-lg border cursor-pointer hover:bg-muted transition-colors ${editingVarIndex === idx ? 'ring-2 ring-primary border-primary' : ''}`}>
                            <div
                              className="flex items-center gap-2 min-w-0 flex-1"
                              onClick={() => {
                                setEditingVarIndex(idx)
                                setItemVarForm({ name: v.name, priceAdjustment: String(v.priceAdjustment) })
                              }}
                            >
                              <Pencil size={12} className="text-muted-foreground shrink-0" />
                              <span className="font-medium truncate">{v.name}</span>
                              <span className="text-xs text-muted-foreground shrink-0">
                                ₹{v.priceAdjustment.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => {
                                  if (v.id && editingItem) {
                                    deleteVarMut.mutate(v.id)
                                  }
                                  setItemVariations((prev) => prev.filter((_, i) => i !== idx))
                                }}
                                className="text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-4 bg-muted/50 border-t">
              <button onClick={resetForm} className="min-w-[84px] rounded-lg h-11 px-6 bg-muted text-sm font-medium hover:bg-muted/80">Cancel</button>
              <button
                onClick={() => {
                  if (!validateItemForm()) return
                  itemMut.mutate({
                    ...itemForm,
                    basePrice: hasVariations ? 0 : (Number(itemForm.basePrice) || 0),
                    kitchenId: itemKitchenId,
                    variations: hasVariations ? itemVariations.map((v) => ({ id: v.id, name: v.name, priceAdjustment: v.priceAdjustment })) : undefined,
                    image: itemImageFile,
                  })
                }}
                className="min-w-[84px] rounded-lg h-11 px-6 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800"
              >
                {editingItem ? 'Update Item' : 'Save Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category form modal popup */}
      {showCategoryPopup && (
        <div className="fixed inset-0 z-40 flex items-start justify-center p-4 sm:p-6 lg:p-8 overflow-auto" onClick={(e) => { if (e.target === e.currentTarget) resetCategoryForm() }}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 w-full max-w-4xl bg-background rounded-xl shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between gap-4 p-4 border-b">
              <p className="text-2xl font-bold tracking-tight">{editingCategory ? 'Edit Category' : 'Add New Category'}</p>
              <button onClick={resetCategoryForm} className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-muted hover:bg-muted/80">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Left Column */}
                <div className="flex flex-col gap-5">
                  <div>
                    <label className="block text-sm font-medium pb-2">Category Name <span className="text-red-500">*</span></label>
                    <input value={catForm.name} onChange={(e) => setCatForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Main Course" className="w-full rounded-lg border px-4 py-3 text-sm" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium pb-2">Tax Slab</label>
                    <select value={catForm.defaultTaxPercent} onChange={(e) => setCatForm((f) => ({ ...f, defaultTaxPercent: Number(e.target.value) }))} className="w-full rounded-lg border px-4 py-3 text-sm">
                      <option value="">Select tax slab</option>
                      {taxSlabs.filter((t) => t.isActive).map((t) => <option key={t.id} value={t.percent}>{t.name} ({t.percent}%)</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium pb-2">Kitchen</label>
                    <select value={catKitchenId ?? ''} onChange={(e) => setCatKitchenId(e.target.value || null)} className="w-full rounded-lg border px-4 py-3 text-sm">
                      <option value="">Default</option>
                      {kitchenPrinters.map((k) => <option key={k.id} value={k.id}>{k.displayName || k.name}</option>)}
                    </select>
                  </div>
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-5 items-center">
                  <div className="w-full">
                    <label className="block mb-3 text-xs font-semibold tracking-[0.05em] uppercase text-foreground">
                      Category Image
                    </label>
                    <input
                      ref={catFileRef}
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageSelect(file, setCatImage, setCatImageFile)
                        if (catFileRef.current) catFileRef.current.value = ''
                      }}
                    />
                    <div className="relative w-32 h-32">
                      {catImage ? (
                        <div className="relative group w-full h-full rounded-xl overflow-hidden border-2 border-border">
                          <img src={catImage} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => catFileRef.current?.click()}
                              className="opacity-0 group-hover:opacity-100 rounded-full bg-white/90 p-1.5 text-gray-700 hover:bg-white transition-all"
                              title="Change Image"
                            >
                              <Upload size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); setCatImage(null); setCatImageFile(null) }}
                              className="opacity-0 group-hover:opacity-100 rounded-full bg-white/90 p-1.5 text-red-500 hover:bg-white transition-all"
                              title="Remove Image"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => catFileRef.current?.click()}
                          className="w-full h-full bg-muted/50 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl hover:border-primary cursor-pointer transition-colors"
                        >
                          <Upload className="mb-1 text-muted-foreground" size={24} />
                          <p className="text-[10px] font-semibold uppercase tracking-[0.05em] text-muted-foreground leading-tight">Upload Image</p>
                          <p className="text-[9px] text-muted-foreground mt-0.5">Max 2 MB</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-4 bg-muted/50 border-t">
              <button onClick={resetCategoryForm} className="min-w-[84px] rounded-lg h-11 px-6 bg-muted text-sm font-medium hover:bg-muted/80">Cancel</button>
              <button
                onClick={() => {
                  if (!validateCatForm()) return
                  catMut.mutate({ ...catForm, kitchenId: catKitchenId, image: catImageFile })
                }}
                className="min-w-[84px] rounded-lg h-11 px-6 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800"
              >
                {editingCategory ? 'Update Category' : 'Save Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
