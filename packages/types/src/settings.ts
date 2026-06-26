export type TaxType = 'Inclusive' | 'Exclusive'

export interface StoreSettings {
  id: string
  companyName: string
  address?: string | null
  phone?: string | null
  email?: string | null
  website?: string | null
  fssai?: string | null
  gstin?: string | null
  logoUrl?: string | null
  printLogoUrl?: string | null
  headerText?: string | null
  footerText?: string | null
  taxType: TaxType
}

export interface TaxSlab {
  id: string
  name: string
  percent: number
  isDefault: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}
