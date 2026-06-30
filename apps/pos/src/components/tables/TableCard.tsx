import { useEffect, useState, useRef } from 'react'
import { cn } from '@/lib/utils'
import { FileText, Trash2, MoreHorizontal, Users, Timer, CreditCard, Pencil, GitMerge } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export interface TableData {
  id: string
  name: string
  capacity: number
  status: string
  position: number
  area?: { id: string; name: string }
  orders?: Array<{ id: string; createdAt: string; updatedAt?: string; subtotal?: number; grandTotal?: number; syncStatus?: string; status?: string }>
}

interface TableCardProps {
  table: TableData
  onBill?: (tableId: string) => void
  onSettle?: (tableId: string) => void
  onDelete?: (tableId: string) => void
  onEdit?: (table: TableData) => void
  onMerge?: (table: TableData) => void
}

const statusConfig = {
  Available:   { cardBg: 'bg-gray-100',  timerColor: 'text-gray-400',   accentBorder: 'border-gray-300', label: 'Vacant',         subLabel: 'Click to occupy' },
  Reserved:    { cardBg: 'bg-sky-100',   timerColor: 'text-sky-600',    accentBorder: 'border-sky-300',  label: 'Reserved',       subLabel: null },
  Occupied:    { cardBg: 'bg-amber-100', timerColor: 'text-amber-700',  accentBorder: 'border-amber-300',label: 'Occupied',       subLabel: null },
  KOT_Pending: { cardBg: 'bg-orange-100',timerColor: 'text-orange-700', accentBorder: 'border-orange-300',label: 'KOT Pending',  subLabel: null },
  Billed:      { cardBg: 'bg-purple-100',timerColor: 'text-purple-700', accentBorder: 'border-purple-300',label: 'Bill Printed',subLabel: null },
} as const

function formatDuration(createdAt: string) {
  const diff = Date.now() - new Date(createdAt).getTime()
  const totalSec = Math.floor(diff / 1000)
  const hrs = Math.floor(totalSec / 3600)
  const mins = Math.floor((totalSec % 3600) / 60)
  const secs = totalSec % 60
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

function DurationDisplay({ createdAt }: { createdAt: string }) {
  const [display, setDisplay] = useState(formatDuration(createdAt))
  useEffect(() => {
    const timer = setInterval(() => setDisplay(formatDuration(createdAt)), 1000)
    return () => clearInterval(timer)
  }, [createdAt])
  return <>{display}</>
}

export function TableCard({ table, onBill, onSettle, onDelete, onEdit, onMerge }: TableCardProps) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside, true)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside, true)
  }, [menuOpen])

  const config = statusConfig[table.status as keyof typeof statusConfig] ?? statusConfig.Available
  const activeOrder = table.orders?.find((o) => o.status !== 'Settled')
  const isOccupied = table.status !== 'Available' && table.status !== 'Reserved'
  const isBilled = table.status === 'Billed'
  const hasAmount = activeOrder && activeOrder.subtotal != null && activeOrder.subtotal > 0
  const billPrintedAt = isBilled && activeOrder?.updatedAt ? activeOrder.updatedAt : null

  return (
    <div
      ref={cardRef}
      onClick={() => {
        setMenuOpen(false)
        navigate(`/cart/${table.id}`)
      }}
      className={cn(
        'group cursor-pointer rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden border',
        config.cardBg,
        config.accentBorder,
      )}
    >
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold truncate">{table.name}</span>
          <div className="flex shrink-0 items-center gap-1 text-gray-500">
            <Users size={14} />
            <span className="text-sm font-medium">{table.capacity}</span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center flex-grow">
          {isOccupied && activeOrder?.createdAt && !isBilled ? (
            <>
              <div className={cn('flex items-center gap-1.5', config.timerColor)}>
                <Timer size={18} />
                <span className="text-base font-bold tabular-nums">
                  <DurationDisplay createdAt={activeOrder.createdAt} />
                </span>
              </div>
              <p className="mt-1 text-sm font-semibold tabular-nums">
                {hasAmount
                  ? `₹${activeOrder!.grandTotal?.toLocaleString() ?? activeOrder!.subtotal?.toLocaleString()}`
                  : '—'}
              </p>
            </>
          ) : isBilled ? (
            <>
              <div className={cn('flex items-center gap-1.5', config.timerColor)}>
                <Timer size={18} />
                <span className="text-base font-bold tabular-nums">
                  {billPrintedAt ? <DurationDisplay createdAt={billPrintedAt} /> : '—'}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">Since bill printed</p>
              <p className="mt-1 text-sm font-semibold tabular-nums">
                {hasAmount
                  ? `₹${activeOrder!.grandTotal?.toLocaleString() ?? activeOrder!.subtotal?.toLocaleString()}`
                  : '—'}
              </p>
            </>
          ) : (
            <>
              <p className="text-gray-400 text-sm">{config.label}</p>
              <p className="text-gray-400 text-xs">{config.subLabel}</p>
            </>
          )}
        </div>
      </div>

      <div className="mt-auto flex relative">
        {isOccupied && !isBilled && (
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onBill?.(table.id) }}
            className="flex w-1/2 items-center justify-center gap-1 bg-blue-500 py-2.5 text-sm font-semibold text-white hover:bg-blue-600 transition-colors"
          >
            <FileText size={14} /> Bill
          </button>
        )}
        {isBilled && (
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onSettle?.(table.id) }}
            className="flex w-1/2 items-center justify-center gap-1 bg-emerald-500 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 transition-colors"
          >
            <CreditCard size={14} /> Settle
          </button>
        )}
        {!isOccupied && (
          <div className="flex w-1/2 items-center justify-center gap-1 bg-blue-500/30 py-2.5 text-sm font-semibold text-white/60">
            <FileText size={14} /> Bill
          </div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen) }}
          className="flex w-1/2 items-center justify-center gap-1 bg-gray-200 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-300 transition-colors"
        >
          <MoreHorizontal size={14} /> More
        </button>

        {menuOpen && (
          <div
            className="absolute bottom-full left-0 right-0 mb-1 rounded-lg border bg-white shadow-lg overflow-hidden z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {onEdit && (
              <button
                onClick={() => { setMenuOpen(false); onEdit(table) }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Pencil size={14} /> Edit Table
              </button>
            )}
            {onMerge && isOccupied && (
              <button
                onClick={() => { setMenuOpen(false); onMerge(table) }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <GitMerge size={14} /> Merge Table
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => { setMenuOpen(false); onDelete(table.id) }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 border-t"
              >
                <Trash2 size={14} /> Delete Table
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
