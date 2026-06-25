import { useState, useEffect, useRef } from 'react'
import { Printer, Usb, Network, Save, X, Search, Check, Loader2, Monitor, MonitorDown } from 'lucide-react'
import type { PrinterConfig, PrinterFormData, SystemPrinter } from '@/lib/printerApi'
import { printerApi } from '@/lib/printerApi'
import { toast } from '@/stores/useToastStore'

interface Props {
  printer: PrinterConfig | null
  onSave: (data: PrinterFormData & { id?: string }) => void
  onCancel: () => void
  isPending: boolean
}

const defaultForm: PrinterFormData = {
  name: '',
  displayName: '',
  type: 'POS80',
  connection: 'usb',
  address: '',
  paperWidth: 80,
  isDefault: false,
  isActive: true,
  isKitchen: false,
  isBilling: false,
}

export function PrinterForm({ printer, onSave, onCancel, isPending }: Props) {
  const [form, setForm] = useState(defaultForm)
  const [discovered, setDiscovered] = useState<SystemPrinter[]>([])
  const [discovering, setDiscovering] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (printer) {
      setForm({
        name: printer.name,
        displayName: printer.displayName,
        type: printer.type,
        connection: printer.connection,
        address: printer.address ?? '',
        vendorId: printer.vendorId ?? undefined,
        productId: printer.productId ?? undefined,
        paperWidth: printer.paperWidth,
        isDefault: printer.isDefault,
        isActive: printer.isActive,
        isKitchen: printer.isKitchen,
        isBilling: printer.isBilling,
      })
      setDiscovered([])
      setShowDropdown(false)
    } else {
      setForm(defaultForm)
      setDiscovered([])
      setShowDropdown(false)
    }
  }, [printer])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const set = <K extends keyof PrinterFormData>(key: K, value: PrinterFormData[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
  }

  const handleDiscover = async () => {
    setDiscovering(true)
    setShowDropdown(true)
    try {
      const results = await printerApi.discoverSystemPrinters()
      setDiscovered(results)
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Discovery failed', 'error')
      setShowDropdown(false)
    } finally {
      setDiscovering(false)
    }
  }

  const handleSelectPrinter = (p: SystemPrinter) => {
    set('name', p.name)
    set('displayName', p.displayName)
    set('connection', 'spooler')
    set('address', p.name)
    set('isDefault', p.isDefault || false)
    setShowDropdown(false)
  }

  const handleSubmit = () => {
    if (!form.name.trim() || !form.displayName.trim()) return
    onSave({ ...form, id: printer?.id })
  }

  const availablePrinters = discovered.filter((p) => !p.isConfigured)
  const configuredPrinters = discovered.filter((p) => p.isConfigured)

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="mb-3 flex items-center gap-2">
        <Printer size={18} className="text-muted-foreground" />
        <h4 className="text-sm font-semibold">{printer ? 'Edit Printer' : 'Add Printer'}</h4>
        {!printer && (
          <div className="relative ml-auto" ref={dropdownRef}>
            <button
              type="button"
              onClick={handleDiscover}
              disabled={discovering}
              className="flex items-center gap-1 rounded border px-2 py-1 text-xs text-muted-foreground hover:bg-muted disabled:opacity-50"
            >
              {discovering ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Search size={12} />
              )}
              {discovering ? 'Scanning...' : 'Discover'}
            </button>
            {showDropdown && (
              <div className="absolute right-0 z-50 mt-1 max-h-64 w-80 overflow-auto rounded-lg border bg-popover shadow-lg">
                {discovering ? (
                  <div className="flex items-center gap-2 p-3 text-xs text-muted-foreground">
                    <Loader2 size={12} className="animate-spin" />
                    Scanning system printers...
                  </div>
                ) : availablePrinters.length === 0 && configuredPrinters.length === 0 ? (
                  <div className="p-3 text-xs text-muted-foreground">
                    No system printers found. Connect a printer and try again.
                  </div>
                ) : (
                  <>
                    {availablePrinters.length > 0 && (
                      <div className="px-3 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase">
                        Available ({availablePrinters.length})
                      </div>
                    )}
                    {availablePrinters.map((p) => (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => handleSelectPrinter(p)}
                        className="flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-accent text-left"
                      >
                        <MonitorDown size={14} className="text-green-500 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-medium">{p.displayName}</div>
                          <div className="truncate text-[10px] text-muted-foreground">{p.name}</div>
                        </div>
                        {p.isDefault && (
                          <span className="flex-shrink-0 rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] text-emerald-700">Default</span>
                        )}
                      </button>
                    ))}
                    {configuredPrinters.length > 0 && (
                      <>
                        <div className="border-t px-3 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase">
                          Already Added ({configuredPrinters.length})
                        </div>
                        {configuredPrinters.map((p) => (
                          <div
                            key={p.name}
                            className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground/60"
                          >
                            <Check size={14} className="flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <div className="truncate">{p.displayName}</div>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-0.5 block text-xs font-medium">Name (machine ID)</label>
          <input
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="e.g. kot-kitchen-1"
            className="w-full rounded border px-2 py-1.5 text-xs"
          />
        </div>
        <div>
          <label className="mb-0.5 block text-xs font-medium">Display Name</label>
          <input
            value={form.displayName}
            onChange={(e) => set('displayName', e.target.value)}
            placeholder="e.g. Kitchen Printer 1"
            className="w-full rounded border px-2 py-1.5 text-xs"
          />
        </div>
        <div>
          <label className="mb-0.5 block text-xs font-medium">Model / Type</label>
          <input
            value={form.type}
            onChange={(e) => set('type', e.target.value)}
            placeholder="e.g. POS80"
            className="w-full rounded border px-2 py-1.5 text-xs"
          />
        </div>
        <div>
          <label className="mb-0.5 block text-xs font-medium">Paper Width</label>
          <select
            value={form.paperWidth}
            onChange={(e) => set('paperWidth', Number(e.target.value))}
            className="w-full rounded border px-2 py-1.5 text-xs"
          >
            <option value={80}>80 mm (48 chars)</option>
            <option value={58}>58 mm (34 chars)</option>
          </select>
        </div>
        <div>
          <label className="mb-0.5 block text-xs font-medium">Connection</label>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => set('connection', 'usb')}
              className={`flex flex-1 items-center justify-center gap-1 rounded border px-2 py-1.5 text-xs ${
                form.connection === 'usb' ? 'bg-primary/10 border-primary text-primary' : 'text-muted-foreground'
              }`}
            >
              <Usb size={12} /> USB
            </button>
            <button
              type="button"
              onClick={() => set('connection', 'network')}
              className={`flex flex-1 items-center justify-center gap-1 rounded border px-2 py-1.5 text-xs ${
                form.connection === 'network' ? 'bg-primary/10 border-primary text-primary' : 'text-muted-foreground'
              }`}
            >
              <Network size={12} /> Network
            </button>
            <button
              type="button"
              onClick={() => set('connection', 'spooler')}
              className={`flex flex-1 items-center justify-center gap-1 rounded border px-2 py-1.5 text-xs ${
                form.connection === 'spooler' ? 'bg-primary/10 border-primary text-primary' : 'text-muted-foreground'
              }`}
            >
              <Monitor size={12} /> Spooler
            </button>
          </div>
        </div>

        {form.connection === 'spooler' ? (
          <div className="col-span-2 rounded bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
            Prints through Windows print spooler. No vendor/product ID needed.
          </div>
        ) : form.connection === 'usb' ? (
          <>
            <div>
              <label className="mb-0.5 block text-xs font-medium">Vendor ID</label>
              <input
                type="number"
                value={form.vendorId ?? ''}
                onChange={(e) => set('vendorId', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="e.g. 1046"
                className="w-full rounded border px-2 py-1.5 text-xs"
              />
            </div>
            <div>
              <label className="mb-0.5 block text-xs font-medium">Product ID</label>
              <input
                type="number"
                value={form.productId ?? ''}
                onChange={(e) => set('productId', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="e.g. 20497"
                className="w-full rounded border px-2 py-1.5 text-xs"
              />
            </div>
          </>
        ) : (
          <div className="col-span-2">
            <label className="mb-0.5 block text-xs font-medium">IP Address:Port</label>
            <input
              value={form.address ?? ''}
              onChange={(e) => set('address', e.target.value)}
              placeholder="e.g. 192.168.1.100:9100"
              className="w-full rounded border px-2 py-1.5 text-xs"
            />
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-3">
        <label className="flex items-center gap-1.5 text-xs">
          <input
            type="checkbox"
            checked={form.isKitchen ?? false}
            onChange={(e) => set('isKitchen', e.target.checked)}
            className="rounded"
          />
          Kitchen (KOT)
        </label>
        <label className="flex items-center gap-1.5 text-xs">
          <input
            type="checkbox"
            checked={form.isBilling ?? false}
            onChange={(e) => set('isBilling', e.target.checked)}
            className="rounded"
          />
          Billing
        </label>
        <label className="flex items-center gap-1.5 text-xs">
          <input
            type="checkbox"
            checked={form.isDefault ?? false}
            onChange={(e) => set('isDefault', e.target.checked)}
            className="rounded"
          />
          Default
        </label>
        <label className="flex items-center gap-1.5 text-xs">
          <input
            type="checkbox"
            checked={form.isActive ?? true}
            onChange={(e) => set('isActive', e.target.checked)}
            className="rounded"
          />
          Active
        </label>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={isPending || !form.name.trim() || !form.displayName.trim()}
          className="flex items-center gap-1 rounded bg-primary px-4 py-1.5 text-xs text-primary-foreground disabled:opacity-50"
        >
          <Save size={12} />
          {isPending ? 'Saving...' : 'Save Printer'}
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-1 rounded bg-muted px-4 py-1.5 text-xs"
        >
          <X size={12} />
          Cancel
        </button>
      </div>
    </div>
  )
}
