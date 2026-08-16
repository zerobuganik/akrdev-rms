import { formatCurrency as sharedFormatCurrency } from '@akrdev/shared'

export const formatCurrency = sharedFormatCurrency

export function formatDuration(createdAt: string): string {
  const diff = Date.now() - new Date(createdAt).getTime()
  const totalSec = Math.max(0, Math.floor(diff / 1000))
  const hrs = Math.floor(totalSec / 3600)
  const mins = Math.floor((totalSec % 3600) / 60)
  const secs = totalSec % 60
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export interface TableStatusStyle {
  cardBg: string
  timerColor: string
  accentBorder: string
  label: string
  subLabel: string | null
  dot: string
}

const STATUS_STYLES: Record<string, TableStatusStyle> = {
  Available: { cardBg: 'bg-white', timerColor: 'text-slate-400', accentBorder: 'border-slate-200', label: 'Available', subLabel: null, dot: 'bg-emerald-500' },
  Reserved: { cardBg: 'bg-sky-50', timerColor: 'text-sky-700', accentBorder: 'border-sky-200', label: 'Reserved', subLabel: null, dot: 'bg-sky-500' },
  Occupied: { cardBg: 'bg-amber-50', timerColor: 'text-amber-700', accentBorder: 'border-amber-300', label: 'Occupied', subLabel: null, dot: 'bg-amber-500' },
  KOT_Pending: { cardBg: 'bg-orange-50', timerColor: 'text-orange-700', accentBorder: 'border-orange-300', label: 'KOT Pending', subLabel: null, dot: 'bg-orange-500' },
  Billed: { cardBg: 'bg-purple-50', timerColor: 'text-purple-700', accentBorder: 'border-purple-300', label: 'Bill Printed', subLabel: null, dot: 'bg-purple-500' },
  Settled: { cardBg: 'bg-white', timerColor: 'text-slate-400', accentBorder: 'border-slate-200', label: 'Settled', subLabel: null, dot: 'bg-slate-400' },
}

export function getTableStatusStyle(status: string): TableStatusStyle {
  return STATUS_STYLES[status] ?? { cardBg: 'bg-white', timerColor: 'text-slate-400', accentBorder: 'border-slate-200', label: status, subLabel: null, dot: 'bg-slate-400' }
}

export function getItemDisplayName(item: {
  itemName?: string | null
  item?: { name: string } | null
  variationName?: string | null
}): string {
  const base = item.itemName ?? item.item?.name ?? 'Item'
  return item.variationName ? `${base} (${item.variationName})` : base
}
