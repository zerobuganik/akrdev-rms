export type TableStatus =
  | 'Available'
  | 'Reserved'
  | 'Occupied'
  | 'KOT_Pending'
  | 'Billed'

export interface TableArea {
  id: string
  name: string
  displayOrder?: number
}

export interface Table {
  id: string
  areaId?: string | null
  name: string
  capacity: number
  position: number
  status: TableStatus
  area?: TableArea | null
  activeOrder?: {
    grandTotal: number
    status: string
    createdAt: string
    updatedAt?: string
  } | null
  deactivatedAt?: string | null
  createdAt: string
  updatedAt: string
}
