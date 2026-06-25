import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/apiClient'
import { getImageBaseUrl } from '@/lib/imageBaseUrl'
import { toast } from '@/stores/useToastStore'
import { useState, useEffect, useRef } from 'react'
import { Plus, Pencil, Trash2, Save, Phone, Mail, Globe, Camera, CheckCircle2, QrCode, Copy, RefreshCw, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PrinterList } from '@/components/printers/PrinterList'

interface Settings {
  id: string
  companyName: string
  address: string | null
  phone: string | null
  email: string | null
  website: string | null
  fssai: string | null
  gstin: string | null
  logoUrl: string | null
  printLogoUrl: string | null
  headerText: string | null
  footerText: string | null
  taxType: string
}

interface TaxSlab {
  id: string
  name: string
  percent: number
  isDefault: boolean
  isActive: boolean
}

type TabId = 'basic' | 'printer' | 'pairing'

function getLogoUrl(logoUrl: string | null | undefined) {
  if (!logoUrl) return null
  return `${getImageBaseUrl()}${logoUrl}`
}

function getPrintLogoUrl(printLogoUrl: string | null | undefined) {
  return getLogoUrl(printLogoUrl)
}

export default function SettingsPage() {
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const printLogoFileInputRef = useRef<HTMLInputElement>(null)
  const [activeTab, setActiveTab] = useState<TabId>('basic')
  const [showSuccess, setShowSuccess] = useState(false)

  const { data: settings, isLoading } = useQuery<Settings>({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data } = await apiClient.get('/settings')
      return data
    },
  })

  const [form, setForm] = useState<Partial<Settings>>({})
  const [formInitialized, setFormInitialized] = useState(false)

  useEffect(() => {
    if (settings && !formInitialized) {
      setForm(settings)
      setFormInitialized(true)
    }
  }, [settings, formInitialized])

  // Keep form in sync when settings change (e.g. after logo upload)
  useEffect(() => {
    if (settings && formInitialized) {
      setForm((f) => ({
        ...f,
        logoUrl: settings.logoUrl,
        printLogoUrl: settings.printLogoUrl,
      }))
    }
  }, [settings?.logoUrl, settings?.printLogoUrl, formInitialized])

  const { data: taxSlabs = [] } = useQuery<TaxSlab[]>({
    queryKey: ['taxSlabs'],
    queryFn: async () => { const { data } = await apiClient.get('/tax-slabs'); return data },
  })
  const [showAddTax, setShowAddTax] = useState(false)
  const [editingTax, setEditingTax] = useState<string | null>(null)
  const [taxForm, setTaxForm] = useState({ name: '', percent: 5, isDefault: false })

  const [pairingCode, setPairingCode] = useState('')
  const [pairingExpiry, setPairingExpiry] = useState(0)
  const [pairingLoading, setPairingLoading] = useState(false)
  const [pairingTimer, setPairingTimer] = useState<ReturnType<typeof setInterval> | null>(null)
  const [pairingError, setPairingError] = useState('')

  const generatePairingCode = async () => {
    const localApiUrl = import.meta.env.VITE_LOCAL_API_URL
    if (!localApiUrl) {
      setPairingError('Local POS API is not configured. Set VITE_LOCAL_API_URL to enable Captain pairing.')
      return
    }
    setPairingLoading(true)
    setPairingError('')
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)
    try {
      const res = await fetch(`${localApiUrl}/api/v1/pair/generate`, {
        signal: controller.signal,
      })
      if (!res.ok) throw new Error('Failed to generate code')
      const data = await res.json()
      setPairingCode(data.pairingCode)
      setPairingExpiry(data.expiresIn)
      if (pairingTimer) clearInterval(pairingTimer)
      const timer = setInterval(() => {
        setPairingExpiry((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            setPairingCode('')
            return 0
          }
          return prev - 1
        })
      }, 1000)
      setPairingTimer(timer)
      toast('Pairing code generated', 'success')
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setPairingError('Connection timed out. Ensure the local POS API is running.')
      } else {
        setPairingError('Cannot reach local POS API. Ensure the POS application is running.')
      }
    } finally {
      clearTimeout(timeout)
      setPairingLoading(false)
    }
  }

  const copyPairingInfo = () => {
    const lanIp = window.location.hostname !== 'localhost'
      ? window.location.hostname
      : '[Your-LAN-IP]'
    const text = `POS: http://${lanIp}:3001\nPairing Code: ${pairingCode}`
    navigator.clipboard.writeText(text).then(() => toast('Copied to clipboard', 'success')).catch(() => {})
  }

  useEffect(() => {
    return () => {
      if (pairingTimer) clearInterval(pairingTimer)
    }
  }, [pairingTimer])

  const taxCreateMut = useMutation({
    mutationFn: async (data: { name: string; percent: number; isDefault?: boolean }) => {
      await apiClient.post('/tax-slabs', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taxSlabs'] })
      setShowAddTax(false)
      setTaxForm({ name: '', percent: 5, isDefault: false })
      toast('Tax slab added', 'success')
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message
        ?? (err as Error)?.message
        ?? 'Failed to add tax slab'
      toast(msg, 'error')
    },
  })
  const taxUpdateMut = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { name?: string; percent?: number; isDefault?: boolean; isActive?: boolean } }) => {
      await apiClient.put(`/tax-slabs/${id}`, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taxSlabs'] })
      setEditingTax(null)
      toast('Tax slab updated', 'success')
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message
        ?? (err as Error)?.message
        ?? 'Failed to update tax slab'
      toast(msg, 'error')
    },
  })
  const taxDeleteMut = useMutation({
    mutationFn: async (id: string) => { await apiClient.delete(`/tax-slabs/${id}`) },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['taxSlabs'] }); toast('Tax slab removed', 'success') },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message
        ?? (err as Error)?.message
        ?? 'Failed to delete tax slab'
      toast(msg, 'error')
    },
  })

  const logoUploadMut = useMutation({
    mutationFn: async (file: File) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = async () => {
          try {
            const { data } = await apiClient.post('/settings/upload-logo', { image: reader.result })
            resolve(data.logoUrl)
          } catch (err) { reject(err) }
        }
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsDataURL(file)
      })
    },
    onSuccess: (logoUrl: string) => {
      queryClient.setQueryData<Settings>(['settings'], (old) =>
        old ? { ...old, logoUrl } : old,
      )
      toast('Color logo uploaded', 'success')
    },
    onError: () => toast('Logo upload failed', 'error'),
  })

  const printLogoUploadMut = useMutation({
    mutationFn: async (file: File) => {
      if (file.size > 200 * 1024) throw new Error('File size must be under 200 KB')
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = async () => {
          try {
            const { data } = await apiClient.post('/settings/upload-print-logo', { image: reader.result })
            resolve(data.printLogoUrl)
          } catch (err) { reject(err) }
        }
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsDataURL(file)
      })
    },
    onSuccess: (printLogoUrl: string) => {
      queryClient.setQueryData<Settings>(['settings'], (old) =>
        old ? { ...old, printLogoUrl } : old,
      )
      toast('Print logo uploaded', 'success')
    },
    onError: (err: Error) => toast(err.message || 'Print logo upload failed', 'error'),
  })

  const deleteLogoMut = useMutation({
    mutationFn: async () => {
      await apiClient.delete('/settings/delete-logo')
    },
    onSuccess: () => {
      queryClient.setQueryData<Settings>(['settings'], (old) =>
        old ? { ...old, logoUrl: null } : old,
      )
      toast('Logo removed', 'success')
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message
        ?? (err as Error)?.message
        ?? 'Failed to remove logo'
      toast(msg, 'error')
    },
  })

  const deletePrintLogoMut = useMutation({
    mutationFn: async () => {
      await apiClient.delete('/settings/delete-print-logo')
    },
    onSuccess: () => {
      queryClient.setQueryData<Settings>(['settings'], (old) =>
        old ? { ...old, printLogoUrl: null } : old,
      )
      toast('Print logo removed', 'success')
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message
        ?? (err as Error)?.message
        ?? 'Failed to remove print logo'
      toast(msg, 'error')
    },
  })

  const saveMut = useMutation({
    mutationFn: async (data: Partial<Settings>) => {
      // Strip logo URLs — they are managed via upload/delete endpoints separately
      const { logoUrl: _l, printLogoUrl: _p, ...safe } = data as Settings
      await apiClient.put('/settings', safe)
    },
    onSuccess: () => {
      queryClient.setQueryData<Settings>(['settings'], (old) =>
        old ? { ...old, ...form } : old,
      )
      localStorage.setItem('posSettings', JSON.stringify(form))
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message
        ?? (err as Error)?.message
        ?? 'Failed to save settings'
      toast(msg, 'error')
    },
  })

  if (isLoading) return (
    <div className="flex items-center justify-center py-16">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  )

  const logoUrl = getLogoUrl(settings?.logoUrl)
  const printLogoUrl = getPrintLogoUrl(settings?.printLogoUrl)

  const tabs: { id: TabId; label: string }[] = [
    { id: 'basic', label: 'Basic Details' },
    { id: 'printer', label: 'Printer Setup' },
    { id: 'pairing', label: 'Captain Pairing' },
  ]

  return (
    <div className="p-4">
      <div className="mb-4 flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium ${
              activeTab === tab.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'basic' && (
        <section className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
          <form
            onSubmit={(e) => { e.preventDefault(); saveMut.mutate(form) }}
            className="space-y-6"
          >
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-shrink-0">
                <label className="block mb-3 text-xs font-semibold tracking-[0.05em] uppercase text-foreground">
                  Color Logo
                </label>
                <div className="relative w-32 h-32">
                  {logoUrl ? (
                    <div className="relative group w-full h-full rounded-xl overflow-hidden border-2 border-border">
                      <img
                        alt="Restaurant Logo Preview"
                        className="w-full h-full object-cover"
                        src={logoUrl}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="opacity-0 group-hover:opacity-100 rounded-full bg-white/90 p-1.5 text-gray-700 hover:bg-white transition-all"
                          title="Change Logo"
                        >
                          <Camera size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => { if (confirm('Remove this logo?')) deleteLogoMut.mutate() }}
                          className="opacity-0 group-hover:opacity-100 rounded-full bg-white/90 p-1.5 text-red-500 hover:bg-white transition-all"
                          title="Remove Logo"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-full bg-muted/50 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl hover:border-primary cursor-pointer transition-colors"
                    >
                      <Camera className="mb-1 text-muted-foreground" size={24} />
                      <p className="text-[10px] font-semibold uppercase tracking-[0.05em] text-muted-foreground leading-tight">Upload Logo</p>
                      <p className="text-[9px] text-muted-foreground mt-0.5">Max 1 MB</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/gif,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) logoUploadMut.mutate(file)
                  }}
                />
              </div>

              <div className="flex-shrink-0">
                <label className="block mb-3 text-xs font-semibold tracking-[0.05em] uppercase text-foreground">
                  B/W Logo
                </label>
                <div className="relative w-32 h-32">
                  {printLogoUrl ? (
                    <div className="relative group w-full h-full rounded-xl overflow-hidden border-2 border-border">
                      <img
                        alt="Print Logo Preview"
                        className="w-full h-full object-cover"
                        src={printLogoUrl}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => printLogoFileInputRef.current?.click()}
                          className="opacity-0 group-hover:opacity-100 rounded-full bg-white/90 p-1.5 text-gray-700 hover:bg-white transition-all"
                          title="Change Logo"
                        >
                          <Camera size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => { if (confirm('Remove this print logo?')) deletePrintLogoMut.mutate() }}
                          className="opacity-0 group-hover:opacity-100 rounded-full bg-white/90 p-1.5 text-red-500 hover:bg-white transition-all"
                          title="Remove Logo"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => printLogoFileInputRef.current?.click()}
                      className="w-full h-full bg-muted/50 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl hover:border-primary cursor-pointer transition-colors"
                    >
                      <Camera className="mb-1 text-muted-foreground" size={24} />
                       <p className="text-[10px] font-semibold uppercase tracking-[0.05em] text-muted-foreground leading-tight">Upload</p>
                      <p className="text-[9px] text-muted-foreground mt-0.5">Max 200 KB</p>
                    </div>
                  )}
                </div>
                <input
                  ref={printLogoFileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    if (file.size > 1024 * 1024) {
                      toast('File size must be under 1 MB', 'error')
                      return
                    }
                    printLogoUploadMut.mutate(file)
                  }}
                />
              </div>

              <div className="flex-grow w-full">
                <label className="block mb-2 text-xs font-semibold tracking-[0.05em] uppercase text-foreground">
                  Restaurant Name <span className="text-destructive">*</span>
                </label>
                <input
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring text-sm transition-colors"
                  placeholder="Enter restaurant name"
                  required
                  type="text"
                  value={form.companyName ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))}
                />

                <div className="mt-6">
                  <label className="block mb-2 text-xs font-semibold tracking-[0.05em] uppercase text-foreground">
                    Address <span className="text-xs font-normal tracking-normal text-muted-foreground lowercase ml-1">OPTIONAL</span>
                  </label>
                  <input
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring text-sm transition-colors"
                    placeholder="Street, Building, City, ZIP"
                    type="text"
                    value={form.address ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
              <div>
                <label className="block mb-2 text-xs font-semibold tracking-[0.05em] uppercase text-foreground">
                  Phone No <span className="text-xs font-normal tracking-normal text-muted-foreground lowercase ml-1">OPTIONAL</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Phone size={20} />
                  </span>
                  <input
                    className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring text-sm transition-colors"
                    type="tel"
                    value={form.phone ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 text-xs font-semibold tracking-[0.05em] uppercase text-foreground">
                  Email ID <span className="text-xs font-normal tracking-normal text-muted-foreground lowercase ml-1">OPTIONAL</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Mail size={20} />
                  </span>
                  <input
                    className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring text-sm transition-colors"
                    type="email"
                    value={form.email ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 text-xs font-semibold tracking-[0.05em] uppercase text-foreground">
                  GST No <span className="text-xs font-normal tracking-normal text-muted-foreground lowercase ml-1">OPTIONAL</span>
                </label>
                <input
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring font-mono text-sm transition-colors"
                  type="text"
                  value={form.gstin ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, gstin: e.target.value }))}
                />
              </div>
              <div>
                <label className="block mb-2 text-xs font-semibold tracking-[0.05em] uppercase text-foreground">
                  FSSAI No <span className="text-xs font-normal tracking-normal text-muted-foreground lowercase ml-1">OPTIONAL</span>
                </label>
                <input
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring font-mono text-sm transition-colors"
                  type="text"
                  value={form.fssai ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, fssai: e.target.value }))}
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="block mb-2 text-xs font-semibold tracking-[0.05em] uppercase text-foreground">
                  Website URL <span className="text-xs font-normal tracking-normal text-muted-foreground lowercase ml-1">OPTIONAL</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Globe size={20} />
                  </span>
                  <input
                    className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring text-sm transition-colors"
                    type="url"
                    placeholder="https://"
                    value={form.website ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-muted-foreground">Website link will be displayed on your digital receipts and profile.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-xs font-semibold tracking-[0.05em] uppercase text-foreground">Tax Type</label>
                  <select
                    value={form.taxType ?? 'Inclusive'}
                    onChange={(e) => setForm((f) => ({ ...f, taxType: e.target.value }))}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring text-sm transition-colors appearance-none"
                  >
                    <option value="Inclusive">Tax Inclusive</option>
                    <option value="Exclusive">Tax Exclusive</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-xs font-semibold tracking-[0.05em] uppercase text-foreground">
                    Bill Footer Text <span className="text-xs font-normal tracking-normal text-muted-foreground lowercase ml-1">OPTIONAL</span>
                  </label>
                  <input
                    value={form.footerText ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, footerText: e.target.value }))}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring text-sm transition-colors"
                    placeholder="Prices inclusive of all taxes"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end pt-6 border-t border-border">
              <button
                type="submit"
                disabled={saveMut.isPending}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-xs font-semibold tracking-[0.05em] uppercase text-primary-foreground transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-60"
              >
                <Save size={18} />
                {saveMut.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>

          <div className="mt-10 pt-6 border-t border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold tracking-[0.05em] uppercase text-foreground">Tax Slabs</h3>
              <button
                onClick={() => setShowAddTax(true)}
                className="inline-flex items-center gap-1 rounded-xl bg-primary px-4 py-2 text-xs font-semibold tracking-[0.05em] uppercase text-primary-foreground hover:bg-primary/90 transition-all active:scale-95"
              >
                <Plus size={14} /> Add Tax Slab
              </button>
            </div>

            {showAddTax && (
              <div className="mb-4 rounded-xl border border-border p-4 bg-muted/20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    value={taxForm.name}
                    onChange={(e) => setTaxForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Name (e.g. GST 18%)"
                    className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  <input
                    type="number"
                    value={taxForm.percent}
                    onChange={(e) => setTaxForm((f) => ({ ...f, percent: Number(e.target.value) }))}
                    placeholder="%"
                    min={0} max={100} step={0.5}
                    className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={taxForm.isDefault}
                      onChange={(e) => setTaxForm((f) => ({ ...f, isDefault: e.target.checked }))}
                      className="rounded"
                    />
                    Set as default
                  </label>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => taxCreateMut.mutate(taxForm)}
                    disabled={taxCreateMut.isPending}
                    className="rounded-lg bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
                  >
                    Save
                  </button>
                  <button onClick={() => setShowAddTax(false)} className="rounded-lg bg-muted px-4 py-1.5 text-xs font-medium hover:bg-muted/80">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {taxSlabs.length > 0 && (
              <div className="overflow-hidden rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-3 text-left text-xs font-semibold tracking-[0.05em] uppercase text-muted-foreground">Name</th>
                      <th className="p-3 text-center text-xs font-semibold tracking-[0.05em] uppercase text-muted-foreground">%</th>
                      <th className="p-3 text-center text-xs font-semibold tracking-[0.05em] uppercase text-muted-foreground">Default</th>
                      <th className="p-3 text-center text-xs font-semibold tracking-[0.05em] uppercase text-muted-foreground">Active</th>
                      <th className="p-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {taxSlabs.map((t) => (
                      <tr key={t.id} className="border-t border-border">
                        <td className="p-3 font-medium">
                          {editingTax === t.id ? (
                            <input
                              value={taxForm.name}
                              onChange={(e) => setTaxForm((f) => ({ ...f, name: e.target.value }))}
                              className="w-full rounded border border-border bg-background px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                              autoFocus
                            />
                          ) : t.name}
                        </td>
                        <td className="p-3 text-center">
                          {editingTax === t.id ? (
                            <input
                              type="number"
                              value={taxForm.percent}
                              onChange={(e) => setTaxForm((f) => ({ ...f, percent: Number(e.target.value) }))}
                              className="w-20 rounded border border-border bg-background px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-ring"
                              min={0} max={100} step={0.5}
                            />
                          ) : `${t.percent}%`}
                        </td>
                        <td className="p-3 text-center">
                          {t.isDefault ? (
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700">Default</span>
                          ) : editingTax === t.id ? (
                            <label className="flex items-center justify-center gap-1 text-xs">
                              <input type="checkbox" checked={taxForm.isDefault} onChange={(e) => setTaxForm((f) => ({ ...f, isDefault: e.target.checked }))} /> Set
                            </label>
                          ) : '—'}
                        </td>
                        <td className="p-3 text-center">
                          <span className={cn(
                            'rounded-full px-2 py-0.5 text-[11px] font-medium',
                            t.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700',
                          )}>
                            {t.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {editingTax === t.id ? (
                              <>
                                <button onClick={() => taxUpdateMut.mutate({ id: t.id, data: taxForm })} className="rounded-lg bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground hover:bg-primary/90">
                                  Save
                                </button>
                                <button onClick={() => setEditingTax(null)} className="rounded-lg bg-muted px-2.5 py-1 text-[11px] font-medium hover:bg-muted/80">
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => { setEditingTax(t.id); setTaxForm({ name: t.name, percent: t.percent, isDefault: t.isDefault }) }}
                                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                >
                                  <Pencil size={13} />
                                </button>
                                <button
                                  onClick={() => taxUpdateMut.mutate({ id: t.id, data: { isActive: !t.isActive } })}
                                  className={cn(
                                    'rounded-lg px-2 py-0.5 text-[11px] font-medium transition-colors',
                                    t.isActive ? 'bg-muted hover:bg-red-50 hover:text-destructive' : 'bg-green-50 text-green-600 hover:bg-green-100',
                                  )}
                                >
                                  {t.isActive ? 'Disable' : 'Enable'}
                                </button>
                                <button
                                  onClick={() => taxDeleteMut.mutate(t.id)}
                                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-red-50 hover:text-destructive transition-colors"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      )}

      {activeTab === 'printer' && (
        <section className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
          <PrinterList />
        </section>
      )}

      {activeTab === 'pairing' && (
        <section className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
          <h3 className="text-sm font-semibold tracking-[0.05em] uppercase text-foreground mb-6">Connect Captain App</h3>

          <div className="rounded-xl border border-border bg-muted/30 p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-primary/10 p-3">
                <Monitor size={24} className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">POS Network Address</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Make sure the Captain device is on the same WiFi network. The POS runs on port 3001.
                </p>
                <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-background border border-border px-3 py-1.5 font-mono text-sm">
                  <span className="text-muted-foreground">http://</span>
                  <span className="font-medium">{window.location.hostname}</span>
                  <span className="text-muted-foreground">:3001</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-border bg-muted/30 p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-amber-50 p-3">
                <QrCode size={24} className="text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Pairing Code</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Generate a one-time code that the Captain app will use to connect. Code expires in 5 minutes.
                </p>

                {pairingCode ? (
                  <div className="mt-4 space-y-3">
                    <div className="inline-flex items-center gap-3 rounded-xl border-2 border-amber-200 bg-amber-50 px-6 py-3">
                      <span className="text-3xl font-mono font-bold tracking-[0.3em] text-amber-800">{pairingCode}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm text-muted-foreground">
                        Expires in <span className="font-mono font-medium text-foreground">{pairingExpiry}s</span>
                      </p>
                      <button
                        onClick={copyPairingInfo}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-border px-3 py-1 text-xs font-medium hover:bg-muted transition-colors"
                      >
                        <Copy size={12} /> Copy
                      </button>
                    </div>
                  </div>
                ) : pairingError ? (
                  <p className="mt-3 text-sm text-destructive">{pairingError}</p>
                ) : (
                  <div className="mt-4" />
                )}

                <button
                  onClick={generatePairingCode}
                  disabled={pairingLoading}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-semibold tracking-[0.05em] uppercase text-primary-foreground transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-60"
                >
                  {pairingLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  ) : pairingCode ? (
                    <RefreshCw size={16} />
                  ) : (
                    <QrCode size={16} />
                  )}
                  {pairingCode ? 'Regenerate Code' : 'Generate Pairing Code'}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-border bg-muted/30 p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-blue-50 p-3">
                <span className="text-blue-600 text-sm font-bold">3</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">On the Captain Device</p>
                <ol className="mt-2 space-y-2 text-xs text-muted-foreground list-decimal list-inside">
                  <li>Open the Captain app</li>
                  <li>Tap <strong>Enter Pairing Code</strong></li>
                  <li>Enter the POS IP address shown above (e.g. http://192.168.1.100:3001)</li>
                  <li>Enter the 6-digit code</li>
                  <li>Tap <strong>Pair</strong></li>
                </ol>
              </div>
            </div>
          </div>
        </section>
      )}

      {showSuccess && (
        <div className="fixed bottom-8 right-8 z-[100] flex items-center gap-3 rounded-xl bg-primary px-6 py-4 text-primary-foreground shadow-2xl animate-in slide-in-from-bottom-4 fade-in duration-300">
          <CheckCircle2 size={20} className="text-green-400" />
          <p className="text-sm font-semibold tracking-[0.05em] uppercase">Settings updated successfully!</p>
        </div>
      )}
    </div>
  )
}
