import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/apiClient'
import { Banknote, CreditCard, Smartphone, DollarSign, FileSpreadsheet, Calendar, Search } from 'lucide-react'
import * as XLSX from 'xlsx'
import { format } from 'date-fns'

interface LedgerEntry {
  id: string
  orderId: string
  displayId: string | null
  orderType: string
  tableName: string
  grandTotal: number
  cashPaid: number
  cardPaid: number
  upiPaid: number
  changeGiven: number
  netCash: number
  createdAt: string
}

interface PaymentLedger {
  cash: number
  card: number
  upi: number
  total: number
  count: number
  ledger: LedgerEntry[]
}

type DateFilter = 'today' | 'yesterday' | 'week' | 'month' | 'custom'

export default function PaymentHistoryPage() {
  const today = new Date()
  const todayStr = format(today, 'yyyy-MM-dd')
  const yesterdayStr = format(new Date(today.getTime() - 86400000), 'yyyy-MM-dd')

  const [dateFilter, setDateFilter] = useState<DateFilter>('today')
  const [customStart, setCustomStart] = useState(todayStr)
  const [customEnd, setCustomEnd] = useState(todayStr)

  const queryParams = useMemo(() => {
    const params = new URLSearchParams()
    switch (dateFilter) {
      case 'today':
        params.set('startDate', todayStr)
        break
      case 'yesterday':
        params.set('startDate', yesterdayStr)
        params.set('endDate', yesterdayStr)
        break
      case 'week': {
        const weekAgo = new Date(today.getTime() - 6 * 86400000)
        params.set('startDate', format(weekAgo, 'yyyy-MM-dd'))
        params.set('endDate', todayStr)
        break
      }
      case 'month': {
        const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
        params.set('startDate', format(monthAgo, 'yyyy-MM-dd'))
        params.set('endDate', todayStr)
        break
      }
      case 'custom':
        params.set('startDate', customStart)
        params.set('endDate', customEnd)
        break
    }
    return params
  }, [dateFilter, todayStr, yesterdayStr, customStart, customEnd])

  const queryString = queryParams.toString()

  const { data, isLoading } = useQuery<PaymentLedger>({
    queryKey: ['payment-ledger', queryString],
    queryFn: async () => {
      const { data: res } = await apiClient.get(`/settlement/ledger?${queryString}`)
      return res ?? { cash: 0, card: 0, upi: 0, total: 0, count: 0, ledger: [] }
    },
    refetchInterval: 30_000,
  })

  const summary = data ?? { cash: 0, card: 0, upi: 0, total: 0, count: 0, ledger: [] }

  const titleText = dateFilter === 'today' ? 'Today'
    : dateFilter === 'yesterday' ? 'Yesterday'
    : dateFilter === 'week' ? 'Last 7 Days'
    : dateFilter === 'month' ? 'Last 30 Days'
    : 'Custom Range'

  const exportToExcel = () => {
    const rows = summary.ledger.map((entry) => ({
      'Order ID': entry.orderId.slice(0, 8).toUpperCase(),
      'Type': entry.orderType === 'Takeaway' ? 'Takeaway' : 'Dine In',
      'Table': entry.tableName || '—',
      'Date': format(new Date(entry.createdAt), 'dd/MM/yyyy HH:mm'),
      'Total Amount': entry.grandTotal,
      'Cash': entry.cashPaid,
      'Card': entry.cardPaid,
      'UPI': entry.upiPaid,
      'Change': entry.changeGiven,
      'Net Collected': entry.netCash + entry.cardPaid + entry.upiPaid,
    }))

    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(rows)

    // Add summary rows at the bottom
    XLSX.utils.sheet_add_json(ws, [
      { 'Order ID': '', 'Type': '', 'Table': '', 'Date': 'TOTALS', 'Total Amount': summary.ledger.reduce((s, e) => s + e.grandTotal, 0), 'Cash': summary.cash, 'Card': summary.card, 'UPI': summary.upi, 'Change': '', 'Net Collected': summary.total },
    ], { skipHeader: true, origin: -1 })

    XLSX.utils.book_append_sheet(wb, ws, 'Payment Ledger')
    XLSX.writeFile(wb, `payment-ledger-${titleText.toLowerCase().replace(' ', '-')}.xlsx`)
  }

  const stats = [
    { label: 'Total Sales', amount: summary.total, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Cash', amount: summary.cash, icon: Banknote, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Card', amount: summary.card, icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'UPI', amount: summary.upi, icon: Smartphone, color: 'text-purple-600', bg: 'bg-purple-50' },
  ]

  return (
    <div className="p-6 overflow-auto h-full">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold">Payment History</h2>
          <p className="text-sm text-muted-foreground">{summary.count} settled orders — {titleText}</p>
        </div>
        <button
          onClick={exportToExcel}
          disabled={summary.ledger.length === 0}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          <FileSpreadsheet size={16} />
          Export Excel
        </button>
      </div>

      {/* Date Filter */}
      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border bg-card p-4">
        <Calendar size={18} className="text-muted-foreground" />
        <div className="flex flex-wrap gap-2">
          {(['today', 'yesterday', 'week', 'month', 'custom'] as DateFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setDateFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${dateFilter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/70'}`}
            >
              {f === 'today' ? 'Today' : f === 'yesterday' ? 'Yesterday' : f === 'week' ? 'Last 7 Days' : f === 'month' ? 'Last 30 Days' : 'Custom'}
            </button>
          ))}
        </div>
        {dateFilter === 'custom' && (
          <div className="flex items-center gap-2 ml-auto">
            <Search size={14} className="text-muted-foreground" />
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="rounded-lg border px-3 py-1.5 text-sm"
            />
            <span className="text-sm text-muted-foreground">to</span>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="rounded-lg border px-3 py-1.5 text-sm"
            />
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className={`rounded-xl border p-4 ${stat.bg}`}>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-white p-2 shadow-sm">
                  <Icon size={20} className={stat.color} />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                  <p className={`text-lg font-bold ${stat.color}`}>₹{stat.amount.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Ledger Table */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading...</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/30 sticky top-0">
              <tr>
                <th className="p-3 text-xs font-bold uppercase text-muted-foreground tracking-wider">Order ID</th>
                <th className="p-3 text-xs font-bold uppercase text-muted-foreground tracking-wider">Type</th>
                <th className="p-3 text-xs font-bold uppercase text-muted-foreground tracking-wider">Table</th>
                <th className="p-3 text-xs font-bold uppercase text-muted-foreground tracking-wider">Date & Time</th>
                <th className="p-3 text-right text-xs font-bold uppercase text-muted-foreground tracking-wider">Total</th>
                <th className="p-3 text-right text-xs font-bold uppercase text-muted-foreground tracking-wider">Cash</th>
                <th className="p-3 text-right text-xs font-bold uppercase text-muted-foreground tracking-wider">Card</th>
                <th className="p-3 text-right text-xs font-bold uppercase text-muted-foreground tracking-wider">UPI</th>
                <th className="p-3 text-right text-xs font-bold uppercase text-muted-foreground tracking-wider">Change</th>
                <th className="p-3 text-right text-xs font-bold uppercase text-muted-foreground tracking-wider">Net Collected</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {summary.ledger.map((entry) => (
                <tr key={entry.id} className="hover:bg-muted/10">
                  <td className="p-3 font-mono text-xs font-semibold">{entry.orderId.slice(0, 8).toUpperCase()}</td>
                  <td className="p-3 text-xs">{entry.orderType === 'Takeaway' ? 'Takeaway' : 'Dine In'}</td>
                  <td className="p-3 text-xs">{entry.tableName || '—'}</td>
                  <td className="p-3 text-xs text-muted-foreground">
                    {format(new Date(entry.createdAt), 'dd/MM/yyyy HH:mm')}
                  </td>
                  <td className="p-3 text-right text-xs font-medium">₹{entry.grandTotal.toLocaleString()}</td>
                  <td className="p-3 text-right text-xs">₹{entry.cashPaid.toLocaleString()}</td>
                  <td className="p-3 text-right text-xs">₹{entry.cardPaid.toLocaleString()}</td>
                  <td className="p-3 text-right text-xs">₹{entry.upiPaid.toLocaleString()}</td>
                  <td className="p-3 text-right text-xs text-red-500">−₹{entry.changeGiven.toLocaleString()}</td>
                  <td className="p-3 text-right text-xs font-medium text-emerald-600">₹{(entry.netCash + entry.cardPaid + entry.upiPaid).toLocaleString()}</td>
                </tr>
              ))}
              {summary.ledger.length === 0 && (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-muted-foreground">
                    No settled orders for {titleText}
                  </td>
                </tr>
              )}
            </tbody>
            {summary.ledger.length > 0 && (
              <tfoot className="border-t bg-muted/10">
                <tr>
                  <td className="p-3 text-xs font-bold" colSpan={4}>Totals ({summary.count} orders)</td>
                  <td className="p-3 text-right text-xs font-bold">₹{summary.ledger.reduce((s, e) => s + e.grandTotal, 0).toLocaleString()}</td>
                  <td className="p-3 text-right text-xs font-bold">₹{summary.cash.toLocaleString()}</td>
                  <td className="p-3 text-right text-xs font-bold">₹{summary.card.toLocaleString()}</td>
                  <td className="p-3 text-right text-xs font-bold">₹{summary.upi.toLocaleString()}</td>
                  <td className="p-3 text-right text-xs text-red-500 font-bold">−₹{summary.ledger.reduce((s, e) => s + e.changeGiven, 0).toLocaleString()}</td>
                  <td className="p-3 text-right text-xs font-bold text-emerald-600">₹{summary.total.toLocaleString()}</td>
                </tr>
              </tfoot>
            )}
          </table>
        )}
      </div>
    </div>
  )
}
