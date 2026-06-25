import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveCloudUrl, savePOSUrl } from '@/lib/network-discovery'
import { initConnection, getConnectionState } from '@/lib/connection-manager'
import { lightHaptic, successHaptic } from '@/lib/native-bridge'
import { Wifi, Globe, KeyRound, ArrowLeft, Loader2 } from 'lucide-react'

export default function PairPage() {
  const [code, setCode] = useState('')
  const [posUrl, setPosUrl] = useState('')
  const [cloudUrl, setCloudUrl] = useState('')
  const [mode, setMode] = useState<'cloud' | 'pos' | 'code' | null>(null)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleCloudConnect = async () => {
    setLoading(true)
    setStatus('Connecting to Cloud API...')
    try {
      let normUrl = cloudUrl.trim().replace(/\s+/g, '')
      if (!/^https?:\/\//i.test(normUrl)) {
        normUrl = 'https://' + normUrl
      }
      normUrl = normUrl.replace(/\/+$/, '')
      const res = await fetch(`${normUrl}/api/v1/health`, { signal: AbortSignal.timeout(5000) })
      if (res.ok) {
        saveCloudUrl(normUrl)
        await initConnection()
        successHaptic()
        navigate('/login')
      } else {
        setStatus('Cloud API unreachable')
      }
    } catch {
      setStatus('Cloud API unreachable. Check URL and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePOSConnect = async () => {
    setLoading(true)
    setStatus('Discovering POS on local network...')
    try {
      await initConnection()
      const state = getConnectionState()
      if (state.isConnected) {
        savePOSUrl(state.currentUrl!)
        successHaptic()
        navigate('/login')
      } else {
        setStatus('Could not find POS. Check WiFi and try manual IP.')
      }
    } catch {
      setStatus('Discovery failed.')
    } finally {
      setLoading(false)
    }
  }

  const handlePairingCode = async () => {
    if (code.length !== 6 || !posUrl.trim()) return
    setLoading(true)
    setStatus('Verifying pairing code...')
    const abortController = new AbortController()
    const timeout = setTimeout(() => abortController.abort(), 5000)
    try {
      // Normalize URL: strip whitespace, trailing slashes, add http:// if missing
      let normUrl = posUrl.trim().replace(/\s+/g, '')
      if (!/^https?:\/\//i.test(normUrl)) {
        normUrl = 'http://' + normUrl
      }
      normUrl = normUrl.replace(/\/+$/, '')
      console.log('[PairPage] Verifying code against:', normUrl)
      const res = await fetch(`${normUrl}/api/v1/pair/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
        signal: abortController.signal,
      })
      if (res.ok) {
        savePOSUrl(normUrl)
        await initConnection()
        successHaptic()
        navigate('/login')
        return
      }
      const data = await res.json().catch(() => ({}))
      setStatus((data as { error?: string }).error || 'Invalid pairing code. Try again.')
    } catch (err: unknown) {
      console.error('[PairPage] Pairing error:', err)
      if (err instanceof DOMException && err.name === 'AbortError') {
        setStatus('Connection timed out. Check the IP address and ensure the POS is reachable.')
      } else {
        setStatus('Cannot reach POS. Check the IP address and ensure both devices are on the same WiFi.')
      }
    } finally {
      clearTimeout(timeout)
      setLoading(false)
    }
  }

  const handleModeBack = () => {
    lightHaptic()
    setMode(null)
    setStatus('')
  }

  return (
    <div className="flex h-full flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">AKRDev Captain</h1>
          <p className="mt-1 text-sm text-muted-foreground">Set up your device</p>
        </div>

        {!mode ? (
          <div className="space-y-3">
            <button
              onClick={() => { lightHaptic(); setMode('pos') }}
              className="flex w-full items-center gap-3 rounded-xl border bg-card p-4 text-left transition-all active:scale-[0.98] hover:border-primary/30"
            >
              <div className="rounded-lg bg-green-50 p-2">
                <Wifi size={20} className="text-green-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Auto-Discover POS</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Find POS on same WiFi automatically</p>
              </div>
            </button>

            <button
              onClick={() => { lightHaptic(); setMode('cloud') }}
              className="flex w-full items-center gap-3 rounded-xl border bg-card p-4 text-left transition-all active:scale-[0.98] hover:border-primary/30"
            >
              <div className="rounded-lg bg-blue-50 p-2">
                <Globe size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Connect via Cloud</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Use restaurant's cloud server URL</p>
              </div>
            </button>

            <button
              onClick={() => { lightHaptic(); setMode('code') }}
              className="flex w-full items-center gap-3 rounded-xl border bg-card p-4 text-left transition-all active:scale-[0.98] hover:border-primary/30"
            >
              <div className="rounded-lg bg-amber-50 p-2">
                <KeyRound size={20} className="text-amber-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Enter Pairing Code</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Use the 6-digit code shown on the POS screen</p>
              </div>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={handleModeBack}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft size={14} /> Back
            </button>

            {mode === 'cloud' ? (
              <>
                <label className="block text-sm font-medium">Cloud API URL</label>
                <input
                  type="text"
                  value={cloudUrl}
                  onChange={(e) => setCloudUrl(e.target.value)}
                  placeholder="https://api.example.com"
                  className="w-full rounded-lg border bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  autoCapitalize="none"
                  autoCorrect="off"
                />
                <button
                  onClick={handleCloudConnect}
                  disabled={!cloudUrl || loading}
                  className="w-full rounded-lg bg-primary py-3 font-medium text-primary-foreground transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? 'Connecting...' : 'Connect'}
                </button>
              </>
            ) : mode === 'code' ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Open Settings on the POS terminal to find the 6-digit pairing code. Enter the POS IP address shown below the code.
                </p>
                <label className="block text-sm font-medium">POS IP Address</label>
                <input
                  type="text"
                  value={posUrl}
                  onChange={(e) => setPosUrl(e.target.value)}
                  placeholder="http://192.168.1.100:3001"
                  className="w-full rounded-lg border bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  autoCapitalize="none"
                  autoCorrect="off"
                  inputMode="url"
                />
                <label className="block text-sm font-medium">Pairing Code</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="6-digit code"
                  maxLength={6}
                  inputMode="numeric"
                  className="w-full rounded-lg border bg-card px-4 py-3 text-center text-xl tracking-[0.25em] font-mono focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  onClick={handlePairingCode}
                  disabled={code.length !== 6 || !posUrl.trim() || loading}
                  className="w-full rounded-lg bg-primary py-3 font-medium text-primary-foreground transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? <Loader2 size={16} className="mx-auto animate-spin" /> : 'Pair'}
                </button>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  Make sure your device is on the same WiFi network as the POS terminal.
                </p>
                <button
                  onClick={handlePOSConnect}
                  disabled={loading}
                  className="w-full rounded-lg bg-primary py-3 font-medium text-primary-foreground transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? 'Discovering...' : 'Start Discovery'}
                </button>
              </>
            )}
          </div>
        )}

        {status && (
          <p className="mt-4 text-center text-sm text-muted-foreground">{status}</p>
        )}
      </div>
    </div>
  )
}
