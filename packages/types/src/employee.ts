import type { UserRole } from './user.js'

export interface Employee {
  id: string
  name: string
  phone: string
  role: UserRole
  active: boolean
  imageUrl?: string | null
  createdAt: string
  updatedAt: string
}
