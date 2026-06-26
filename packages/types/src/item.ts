export interface ItemVariation {
  id: string
  itemId: string
  name: string
  priceAdjustment: number
}

export interface MenuCategory {
  id: string
  name: string
  defaultTaxPercent?: number
  displayOrder?: number
  imageUrl?: string | null
  kitchenId?: string | null
}

export interface MenuItem {
  id: string
  categoryId: string
  name: string
  shortcode?: string | null
  basePrice: number
  taxOverride?: number | null
  inStock: boolean
  imageUrl?: string | null
  dietaryType?: string | null
  kitchenId?: string | null
  deletedAt?: string | null
  category?: MenuCategory | null
  variations: ItemVariation[]
}
