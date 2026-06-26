export type UserRole = 'Admin' | 'Cashier' | 'Captain'

export interface User {
  id: string
  name: string
  phone: string
  role: UserRole
  imageUrl?: string | null
  active: boolean
  createdAt: string
  updatedAt: string
}
