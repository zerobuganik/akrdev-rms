import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/apiClient'
import { Banknote, CreditCard, Smartphone, Wallet, ArrowDown, ArrowUp, Plus } from 'lucide-react'

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
  changeAmt: number
  netCash: number
  createdAt: string
}

interface PaymentSummary {
  cash: number
  card: number
  upi: number
  total: number
  count: number
  ledger: LedgerEntry[]
}

export default function PaymentSummaryPage() {
  const [openingCash, setOpeningCash] = useState(() => {
    const saved = localStorage.getItem('openingCash')
    return saved ? Number(saved) : 0
  })
  const [openingCard, setOpeningCard] = useState(() => {
    const saved = localStorage.getItem('openingCard')
    return saved ? Number(saved) : 0
  })
  const [openingUpi, setOpeningUpi] = useState(() => {
    const saved = localStorage.getItem('openingUpi')
    return saved ? Number(saved) : 0
  })
  const [showLedger, setShowLedger] = useState(true)

  const saveOpeningBalance = (field: string, value: number) => {
    localStorage.setItem(field, String(value))
  }

  const { data: summary } = useQuery<PaymentSummary>({
    queryKey: ['payment-summary'],
    queryFn: async () => {
      const { data } = await apiClient.get('/settlement/summary')
      return data ?? { cash: 0, card: 0, upi: 0, total: 0, count: 0, ledger: [] }
    },
    refetchInterval: 30_000,
  })

  const netCash = (summary?.cash ?? 0) + openingCash
  const netCard = (summary?.card ?? 0) + openingCard
  const netUpi = (summary?.upi ?? 0) + openingUpi
  const netTotal = netCash + netCard + netUpi

  const items = [
    { label: 'Cash', amount: netCash, opening: openingCash, collected: summary?.cash ?? 0, icon: Banknote, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Card', amount: netCard, opening: openingCard, collected: summary?.card ?? 0, icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'UPI / Online', amount: netUpi, opening: openingUpi, collected: summary?.upi ?? 0, icon: Smartphone, color: 'text-purple-600', bg: 'bg-purple-50' },
  ]

  return (
    <div className="p-6 overflow-auto h-full">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Payment Summary (Today)</h2>
        <p className="text-sm text-muted-foreground">{summary?.count ?? 0} settled orders</p>
      </div>

      {/* Opening Balance Inputs */}
      <div className="mb-4 rounded-xl border bg-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Plus size={16} className="text-muted-foreground" />
          <h3 className="text-sm font-semibold">Opening Balance</h3>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Cash Opening</label>
            <div className="flex items-center gap-1">
              <span className="text-sm">₹</span>
              <input
                type="number"
                value={openingCash}
                onChange={(e) => {
                  const val = Number(e.target.value)
                  setOpeningCash(val)
                  saveOpeningBalance('openingCash', val)
                }}
                className="flex-1 rounded-lg border px-3 py-2 text-sm"
                placeholder="0"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Card Opening</label>
            <div className="flex items-center gap-1">
              <span className="text-sm">₹</span>
              <input
                type="number"
                value={openingCard}
                onChange={(e) => {
                  const val = Number(e.target.value)
                  setOpeningCard(val)
                  saveOpeningBalance('openingCard', val)
                }}
                className="flex-1 rounded-lg border px-3 py-2 text-sm"
                placeholder="0"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">UPI Opening</label>
            <div className="flex items-center gap-1">
              <span className="text-sm">₹</span>
              <input
                type="number"
                value={openingUpi}
                onChange={(e) => {
                  const val = Number(e.target.value)
                  setOpeningUpi(val)
                  saveOpeningBalance('openingUpi', val)
                }}
                className="flex-1 rounded-lg border px-3 py-2 text-sm"
                placeholder="0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.label} className={`rounded-xl border p-6 ${item.bg}`}>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-white p-2.5 shadow-sm">
                  <Icon size={24} className={item.color} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                  <p className={`text-2xl font-bold ${item.color}`}>₹{item.amount.toLocaleString()}</p>
                  <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                    {item.opening > 0 && (
                      <span className="flex items-center gap-0.5"><Plus size={10} /> Opening ₹{item.opening.toLocaleString()}</span>
                    )}
                    <span className="flex items-center gap-0.5"><ArrowUp size={10} /> Collected ₹{item.collected.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 rounded-xl border bg-card p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2.5">
            <Wallet size={24} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Net Collection (incl. Opening)</p>
            <p className="text-3xl font-bold">₹{netTotal.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="mt-6">
        <button
          onClick={() => setShowLedger(!showLedger)}
          className="flex items-center gap-2 text-sm font-semibold mb-3"
        >
          {showLedger ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
          Payment Ledger ({summary?.ledger?.length ?? 0} transactions)
        </button>
        {showLedger && (
          <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/30">
                <tr>
                  <th className="p-3 text-xs font-bold uppercase text-muted-foreground tracking-wider">Order</th>
                  <th className="p-3 text-xs font-bold uppercase text-muted-foreground tracking-wider">Type</th>
                  <th className="p-3 text-xs font-bold uppercase text-muted-foreground tracking-wider">Table</th>
                  <th className="p-3 text-xs font-bold uppercase text-muted-foreground tracking-wider">Time</th>
                  <th className="p-3 text-right text-xs font-bold uppercase text-muted-foreground tracking-wider">Total</th>
                  <th className="p-3 text-right text-xs font-bold uppercase text-muted-foreground tracking-wider">Cash</th>
                  <th className="p-3 text-right text-xs font-bold uppercase text-muted-foreground tracking-wider">Card</th>
                  <th className="p-3 text-right text-xs font-bold uppercase text-muted-foreground tracking-wider">UPI</th>
                  <th className="p-3 text-right text-xs font-bold uppercase text-muted-foreground tracking-wider">Change</th>
                  <th className="p-3 text-right text-xs font-bold uppercase text-muted-foreground tracking-wider">Net Cash</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {(summary?.ledger ?? []).map((entry) => (
                  <tr key={entry.id} className="hover:bg-muted/10">
                    <td className="p-3 font-mono text-xs font-semibold">{entry.displayId || entry.orderId.slice(0, 8)}</td>
                    <td className="p-3 text-xs">{entry.orderType}</td>
                    <td className="p-3 text-xs">{entry.tableName || '—'}</td>
                    <td className="p-3 text-xs text-muted-foreground">
                      {new Date(entry.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-3 text-right text-xs font-medium">₹{entry.grandTotal.toLocaleString()}</td>
                    <td className="p-3 text-right text-xs">₹{entry.cashPaid.toLocaleString()}</td>
                    <td className="p-3 text-right text-xs">₹{entry.cardPaid.toLocaleString()}</td>
                    <td className="p-3 text-right text-xs">₹{entry.upiPaid.toLocaleString()}</td>
                    <td className="p-3 text-right text-xs text-red-500">−₹{entry.changeAmt.toLocaleString()}</td>
                    <td className="p-3 text-right text-xs font-medium text-green-600">₹{entry.netCash.toLocaleString()}</td>
                  </tr>
                ))}
                {(!summary?.ledger || summary.ledger.length === 0) && (
                  <tr>
                    <td colSpan={10} className="p-8 text-center text-muted-foreground">
                      No settled orders today
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
