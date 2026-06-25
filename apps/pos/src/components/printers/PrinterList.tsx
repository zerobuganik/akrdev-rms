import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { printerApi, type PrinterConfig, type SystemPrinter } from '@/lib/printerApi'
import { toast } from '@/stores/useToastStore'
import { cn } from '@/lib/utils'
import { Plus, Pencil, Trash2, Save, X, MonitorDown, Loader2, ChevronDown, Play } from 'lucide-react'

interface PrinterFormState {
  name: string
  displayName: string
  paperWidth: number
  isActive: boolean
  isDefault: boolean
}

const emptyForm: PrinterFormState = {
  name: '',
  displayName: '',
  paperWidth: 80,
  isActive: true,
  isDefault: false,
}

const statusBadge = (active: boolean) => (
  <span className={cn(
    'rounded-full px-2 py-0.5 text-[11px] font-medium',
    active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700',
  )}>
    {active ? 'Active' : 'Inactive'}
  </span>
)

function PrinterDropdown({
  value,
  onChange,
  disabled,
}: {
  value: string
  onChange: (name: string, displayName: string) => void
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [printers, setPrinters] = useState<SystemPrinter[]>([])
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 })
  const btnRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      const target = e.target as Node
      if (dropdownRef.current?.contains(target) || btnRef.current?.contains(target)) return
      close()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open, close])

  const handleOpen = async () => {
    if (open) { close(); return }
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      setPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX, width: rect.width })
    }
    setOpen(true)
    if (printers.length === 0) {
      setLoading(true)
      try {
        const result = await printerApi.discoverSystemPrinters()
        setPrinters(result)
      } catch { toast('Failed to discover printers', 'error') }
      finally { setLoading(false) }
    }
  }

  const selectedLabel = value || 'Select Printer'

  const dropdown = open && createPortal(
    <div
      ref={dropdownRef}
      className="fixed z-[9999] max-h-56 overflow-auto rounded-lg border border-border bg-popover shadow-xl"
      style={{ top: `${position.top}px`, left: `${position.left}px`, width: `${position.width}px` }}
    >
      {loading ? (
        <div className="flex items-center gap-2 p-3 text-xs text-muted-foreground">
          <Loader2 size={12} className="animate-spin" />
          Scanning Windows spooler...
        </div>
      ) : printers.length === 0 ? (
        <div className="p-3 text-xs text-muted-foreground">No system printers found.</div>
      ) : (
        printers.map((p) => (
          <button
            key={p.name}
            type="button"
            onClick={() => { onChange(p.name, p.displayName); close() }}
            className={cn(
              'flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-accent text-left transition-colors',
              value === p.name && 'bg-accent font-medium',
            )}
          >
            <MonitorDown size={14} className="flex-shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <div className="truncate">{p.displayName}</div>
              <div className="truncate text-[10px] text-muted-foreground">{p.name}</div>
            </div>
            {value === p.name && (
              <span className="flex-shrink-0 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-medium text-emerald-700">Selected</span>
            )}
          </button>
        ))
      )}
    </div>,
    document.body,
  )

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={handleOpen}
        disabled={disabled}
        className={cn(
          'w-full flex items-center justify-between gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs text-left transition-colors',
          'focus:outline-none focus:ring-1 focus:ring-ring',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
      >
        <span className={cn('truncate', !value && 'text-muted-foreground')}>{selectedLabel}</span>
        <ChevronDown size={14} className="flex-shrink-0 text-muted-foreground" />
      </button>
      {dropdown}
    </>
  )
}

const PAPER_WIDTHS = [
  { value: 80, label: '80 mm' },
  { value: 58, label: '58 mm' },
]

export function PrinterList() {
  const queryClient = useQueryClient()
  const [editingBill, setEditingBill] = useState(false)
  const [addingKot, setAddingKot] = useState(false)
  const [editingKotId, setEditingKotId] = useState<string | null>(null)
  const [form, setForm] = useState<PrinterFormState>(emptyForm)
  const [testingId, setTestingId] = useState<string | null>(null)

  const { data: printers = [], isLoading } = useQuery({
    queryKey: ['printers'],
    queryFn: () => printerApi.getPrinters(),
  })

  const billPrinter = printers.find((p) => p.isBilling)
  const kotPrinters = printers.filter((p) => p.isKitchen)

  const saveMut = useMutation({
    mutationFn: (data: Parameters<typeof printerApi.savePrinter>[0]) => printerApi.savePrinter(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['printers'] })
      cancelEditing()
      toast('Printer saved', 'success')
    },
    onError: (err: Error) => toast(err.message, 'error'),
  })

  const deleteMut = useMutation({
    mutationFn: (id: string) => printerApi.deletePrinter(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['printers'] })
      toast('Printer removed', 'success')
    },
    onError: (err: Error) => toast(err.message, 'error'),
  })

  const handleTest = async (printerId: string) => {
    setTestingId(printerId)
    try {
      await printerApi.testPrint(printerId)
      toast('Test print sent', 'success')
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Test print failed', 'error')
    } finally {
      setTestingId(null)
    }
  }

  const cancelEditing = () => {
    setEditingBill(false)
    setAddingKot(false)
    setEditingKotId(null)
    setForm(emptyForm)
  }

  const startEditBill = () => {
    if (billPrinter) {
      setForm({
        name: billPrinter.name,
        displayName: billPrinter.displayName,
        paperWidth: billPrinter.paperWidth,
        isActive: billPrinter.isActive,
        isDefault: billPrinter.isDefault,
      })
    }
    setEditingBill(true)
    setAddingKot(false)
    setEditingKotId(null)
  }

  const startAddKot = () => {
    setForm(emptyForm)
    setAddingKot(true)
    setEditingBill(false)
    setEditingKotId(null)
  }

  const startEditKot = (printer: PrinterConfig) => {
    setForm({
      name: printer.name,
      displayName: printer.displayName,
      paperWidth: printer.paperWidth,
      isActive: printer.isActive,
      isDefault: printer.isDefault,
    })
    setEditingKotId(printer.id)
    setAddingKot(false)
    setEditingBill(false)
  }

  const handleSaveBill = () => {
    if (!form.name.trim()) return
    saveMut.mutate({
      name: form.name.trim(),
      displayName: form.displayName.trim() || 'Bill Printer',
      type: 'POS80',
      connection: 'spooler',
      paperWidth: form.paperWidth,
      isDefault: true,
      isActive: true,
      isKitchen: false,
      isBilling: true,
      ...(billPrinter ? { id: billPrinter.id } : {}),
    })
  }

  const handleSaveKot = () => {
    if (!form.name.trim() || !form.displayName.trim()) return
    const existingId = editingKotId
    saveMut.mutate({
      name: form.name.trim(),
      displayName: form.displayName.trim(),
      type: 'POS80',
      connection: 'spooler',
      paperWidth: form.paperWidth,
      isDefault: form.isDefault,
      isActive: form.isActive,
      isKitchen: true,
      isBilling: false,
      ...(existingId ? { id: existingId } : {}),
    })
  }

  if (isLoading) return (
    <div className="flex items-center justify-center py-12">
      <Loader2 size={20} className="animate-spin text-muted-foreground" />
    </div>
  )

  return (
    <div className="space-y-10">
      {/* ---- Billing Printer ---- */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold tracking-[0.05em] uppercase text-foreground">Billing Printer</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">Single printer for bill printing at the main counter.</p>
          </div>
          {!editingBill && !billPrinter && (
            <button
              onClick={startEditBill}
              className="inline-flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-xs font-semibold tracking-[0.05em] uppercase text-primary-foreground hover:bg-primary/90 transition-all active:scale-95"
            >
              <Plus size={14} /> Add Bill Printer
            </button>
          )}
        </div>

        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-3 text-left text-xs font-semibold tracking-[0.05em] uppercase text-muted-foreground w-[60%]">Printer Name</th>
                <th className="p-3 text-center text-xs font-semibold tracking-[0.05em] uppercase text-muted-foreground">Width</th>
                <th className="p-3 w-0" />
              </tr>
            </thead>
            <tbody>
              {editingBill ? (
                <tr className="border-t border-border bg-muted/20">
                  <td className="p-3">
                    <PrinterDropdown
                      value={form.name}
                      onChange={(name, displayName) => setForm((f) => ({ ...f, name, displayName: displayName || 'Bill Printer' }))}
                    />
                  </td>
                  <td className="p-3">
                    <select
                      value={form.paperWidth}
                      onChange={(e) => setForm((f) => ({ ...f, paperWidth: Number(e.target.value) }))}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-center focus:outline-none focus:ring-1 focus:ring-ring appearance-none"
                    >
                      {PAPER_WIDTHS.map((pw) => (
                        <option key={pw.value} value={pw.value}>{pw.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={handleSaveBill}
                        disabled={saveMut.isPending || !form.name.trim()}
                        className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-[11px] font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-all active:scale-95"
                      >
                        <Save size={12} />
                        {saveMut.isPending ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="inline-flex items-center gap-1 rounded-lg bg-muted px-3 py-1.5 text-[11px] font-medium hover:bg-muted/80 transition-all"
                      >
                        <X size={12} />
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ) : billPrinter ? (
                <tr className="border-t border-border">
                  <td className="p-3">
                    <div className="text-sm">{billPrinter.name}</div>
                  </td>
                  <td className="p-3 text-center">
                    <span className="text-xs text-muted-foreground">{billPrinter.paperWidth} mm</span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleTest(billPrinter.id)}
                        disabled={testingId === billPrinter.id || !billPrinter.isActive}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-40"
                        title="Test Print"
                      >
                        {testingId === billPrinter.id ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
                      </button>
                      <button
                        onClick={startEditBill}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-xs text-muted-foreground">
                    <MonitorDown size={28} className="mx-auto mb-2 text-muted-foreground/40" />
                    No bill printer configured.
                    <button onClick={startEditBill} className="ml-1 underline hover:text-foreground transition-colors">Add one</button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ---- KOT Printers ---- */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold tracking-[0.05em] uppercase text-foreground">KOT Printers</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">Assign printers to individual kitchens for KOT orders.</p>
          </div>
          {!addingKot && (
            <button
              onClick={startAddKot}
              className="inline-flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-xs font-semibold tracking-[0.05em] uppercase text-primary-foreground hover:bg-primary/90 transition-all active:scale-95"
            >
              <Plus size={14} /> Add KOT Printer
            </button>
          )}
        </div>

        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-3 text-left text-xs font-semibold tracking-[0.05em] uppercase text-muted-foreground">Printer</th>
                <th className="p-3 text-left text-xs font-semibold tracking-[0.05em] uppercase text-muted-foreground">Kitchen Name</th>
                <th className="p-3 text-center text-xs font-semibold tracking-[0.05em] uppercase text-muted-foreground">Width</th>
                <th className="p-3 text-center text-xs font-semibold tracking-[0.05em] uppercase text-muted-foreground">Status</th>
                <th className="p-3 text-center text-xs font-semibold tracking-[0.05em] uppercase text-muted-foreground">Default</th>
                <th className="p-3 w-0" />
              </tr>
            </thead>
            <tbody>
              {addingKot && (
                <tr className="border-t border-border bg-muted/20">
                  <td className="p-2">
                    <PrinterDropdown
                      value={form.name}
                      onChange={(name, displayName) => setForm((f) => ({ ...f, name, displayName: f.displayName || displayName }))}
                    />
                  </td>
                    <td className="p-2">
                      <input
                        value={form.displayName}
                        onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
                        placeholder="e.g. Main Kitchen"
                        autoFocus
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                      />
                    </td>
                    <td className="p-2">
                      <select
                        value={form.paperWidth}
                        onChange={(e) => setForm((f) => ({ ...f, paperWidth: Number(e.target.value) }))}
                        className="w-full rounded-lg border border-border bg-background px-2 py-2 text-xs text-center focus:outline-none focus:ring-1 focus:ring-ring appearance-none"
                      >
                        {PAPER_WIDTHS.map((pw) => (
                          <option key={pw.value} value={pw.value}>{pw.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
                        className={cn(
                          'rounded-full px-2 py-0.5 text-[11px] font-medium transition-colors',
                          form.isActive ? 'bg-green-100 text-green-700 hover:bg-red-50 hover:text-red-500' : 'bg-red-100 text-red-700 hover:bg-green-50 hover:text-green-600',
                        )}
                      >
                        {form.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="p-2 text-center">
                      <label className="flex items-center justify-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.isDefault}
                          onChange={(e) => setForm((f) => ({ ...f, isDefault: e.target.checked }))}
                          className="rounded"
                        />
                      </label>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={handleSaveKot}
                        disabled={saveMut.isPending || !form.name.trim() || !form.displayName.trim()}
                        className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-[11px] font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-all active:scale-95"
                      >
                        <Save size={12} />
                        {saveMut.isPending ? '...' : 'Save'}
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="inline-flex items-center gap-1 rounded-lg bg-muted px-3 py-1.5 text-[11px] font-medium hover:bg-muted/80 transition-all"
                      >
                        <X size={12} />
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {kotPrinters.map((p) =>
                editingKotId === p.id ? (
                  <tr key={p.id} className="border-t border-border bg-muted/20">
                    <td className="p-2">
                      <PrinterDropdown
                        value={form.name}
                        onChange={(name, displayName) => setForm((f) => ({ ...f, name, displayName: f.displayName || displayName }))}
                      />
                  </td>
                  <td className="p-2">
                    <input
                      value={form.displayName}
                      onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
                      placeholder="e.g. Main Kitchen"
                      autoFocus
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </td>
                  <td className="p-2">
                    <select
                        value={form.paperWidth}
                        onChange={(e) => setForm((f) => ({ ...f, paperWidth: Number(e.target.value) }))}
                        className="w-full rounded-lg border border-border bg-background px-2 py-2 text-xs text-center focus:outline-none focus:ring-1 focus:ring-ring appearance-none"
                      >
                        {PAPER_WIDTHS.map((pw) => (
                          <option key={pw.value} value={pw.value}>{pw.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
                        className={cn(
                          'rounded-full px-2 py-0.5 text-[11px] font-medium transition-colors',
                          form.isActive ? 'bg-green-100 text-green-700 hover:bg-red-50 hover:text-red-500' : 'bg-red-100 text-red-700 hover:bg-green-50 hover:text-green-600',
                        )}
                      >
                        {form.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="p-2 text-center">
                      <label className="flex items-center justify-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.isDefault}
                          onChange={(e) => setForm((f) => ({ ...f, isDefault: e.target.checked }))}
                          className="rounded"
                        />
                      </label>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={handleSaveKot}
                          disabled={saveMut.isPending || !form.name.trim() || !form.displayName.trim()}
                          className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-[11px] font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-all active:scale-95"
                        >
                          <Save size={12} />
                          {saveMut.isPending ? '...' : 'Save'}
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="inline-flex items-center gap-1 rounded-lg bg-muted px-3 py-1.5 text-[11px] font-medium hover:bg-muted/80 transition-all"
                        >
                          <X size={12} />
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Remove printer "${p.displayName}"?`)) deleteMut.mutate(p.id)
                          }}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-red-50 hover:text-destructive transition-colors ml-1"
                          title="Remove"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={p.id} className="border-t border-border">
                    <td className="p-2">
                      <div className="text-xs">{p.name}</div>
                    </td>
                    <td className="p-2">
                      <span className="text-xs font-medium">{p.displayName}</span>
                    </td>
                    <td className="p-2 text-center">
                      <span className="text-xs text-muted-foreground">{p.paperWidth} mm</span>
                    </td>
                    <td className="p-2 text-center">{statusBadge(p.isActive)}</td>
                    <td className="p-2 text-center">
                      {p.isDefault ? (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700">Default</span>
                      ) : (
                        <span className="text-[11px] text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="p-2">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleTest(p.id)}
                          disabled={testingId === p.id || !p.isActive}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-40"
                          title="Test Print"
                        >
                          {testingId === p.id ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
                        </button>
                        <button
                          onClick={() => startEditKot(p)}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Remove printer "${p.displayName}"?`)) deleteMut.mutate(p.id)
                          }}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-red-50 hover:text-destructive transition-colors"
                          title="Remove"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ),
              )}

              {!addingKot && kotPrinters.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs text-muted-foreground">
                    <MonitorDown size={28} className="mx-auto mb-2 text-muted-foreground/40" />
                    No KOT printers configured.
                    <button onClick={startAddKot} className="ml-1 underline hover:text-foreground transition-colors">Add one</button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
