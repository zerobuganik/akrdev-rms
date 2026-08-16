import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setPosUrl, getBaseUrl, healthCheck } from '@/lib/connection'
import { startQrScan, startNativeQrScan, isNative, lightHaptic, successHaptic, mediumHaptic } from '@/lib/native-bridge'
import { QrCode, KeyRound, ArrowLeft, Loader2, Wifi } from 'lucide-react'

type Mode = 'menu' | 'scan' | 'manual'

interface QrPayload {
  host?: string
  port?: number
  code?: string
}

export default function PairPage() {
  const [mode, setMode] = useState<Mode>('menu')
  const [host, setHost] = useState('')
  const [code, setCode] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [scanning, setScanning] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const scanCleanupRef = useRef<(() => void) | null>(null)
  const handledRef = useRef(false)
  const navigate = useNavigate()

  const isNativeScan = mode === 'scan' && isNative

  // Make the WebView (and body) transparent while the native camera is open so
  // the camera preview shows through. The ML Kit plugin transparents the WebView
  // natively, but the CSS body background would otherwise hide the camera.
  useEffect(() => {
    if (isNativeScan) {
      const prev = document.body.style.backgroundColor
      document.body.style.backgroundColor = 'transparent'
      return () => {
        document.body.style.backgroundColor = prev
      }
    }
  }, [isNativeScan])

  const stopScan = () => {
    scanCleanupRef.current?.()
    scanCleanupRef.current = null
    setScanning(false)
  }

  useEffect(() => {
    return () => {
      scanCleanupRef.current?.()
    }
  }, [])

  useEffect(() => {
    const existing = getBaseUrl()
    if (existing) {
      void healthCheck()
    }
  }, [])

  const startScanning = async () => {
    setStatus('')
    setScanning(true)
    handledRef.current = false
    try {
      if (isNative) {
        const cleanup = await startNativeQrScan((text) => {
          handleScanResult(text)
        })
        scanCleanupRef.current = cleanup
      } else {
        const video = videoRef.current
        if (!video) throw new Error('Camera unavailable')
        const cleanup = await startQrScan(video, (text) => {
          handleScanResult(text)
        })
        scanCleanupRef.current = cleanup
      }
    } catch {
      setScanning(false)
      setStatus('Camera unavailable. Enter the code manually instead.')
      setMode('manual')
    }
  }

  const handleScanResult = (text: string) => {
    if (handledRef.current) return
    handledRef.current = true
    stopScan()
    const trimmed = text.trim()
    try {
      const parsed = JSON.parse(trimmed) as QrPayload
      if (parsed && typeof parsed.host === 'string' && parsed.host && parsed.code) {
        const port = typeof parsed.port === 'number' ? parsed.port : 3001
        void verifyPair(`http://${parsed.host}:${port}`, String(parsed.code))
        return
      }
    } catch { /* not JSON */ }
    const digits = trimmed.replace(/\D/g, '').slice(0, 6)
    setMode('manual')
    setCode(digits)
    setStatus(digits.length === 6 ? 'Code scanned — enter the POS IP address.' : 'QR not recognized. Enter details manually.')
  }

  const normalizeUrl = (raw: string): string => {
    let url = raw.trim().replace(/\s+/g, '')
    if (!/^https?:\/\//i.test(url)) url = `http://${url}`
    return url.replace(/\/+$/, '')
  }

  const verifyPair = async (posUrl: string, pairingCode: string) => {
    setLoading(true)
    setStatus('Verifying pairing code...')
    try {
      const res = await fetch(`${posUrl}/api/v1/pair/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: pairingCode }),
        signal: AbortSignal.timeout(6000),
      })
      if (res.ok) {
        setPosUrl(posUrl)
        successHaptic()
        navigate('/login', { replace: true })
        return
      }
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      setStatus(data.error || 'Invalid pairing code. Try again.')
      mediumHaptic()
    } catch {
      setStatus('Cannot reach POS. Check the IP address and that both devices are on the same WiFi.')
      mediumHaptic()
    } finally {
      setLoading(false)
    }
  }

  const handleManualPair = () => {
    if (code.length !== 6 || !host.trim()) return
    void verifyPair(normalizeUrl(host), code)
  }

  if (isNativeScan) {
    return (
      <div className="flex h-full flex-col">
        <button
          onClick={() => { lightHaptic(); stopScan(); setMode('menu') }}
          className="z-10 m-3 flex w-fit items-center gap-1 rounded-full bg-black/50 px-3 py-1.5 text-sm font-medium text-white"
        >
          <ArrowLeft size={14} /> Back
        </button>
        <div className="relative flex flex-1 flex-col items-center justify-center">
          <div className="h-60 w-60 rounded-2xl border-2 border-white/80 shadow-[0_0_0_100vmax_rgba(0,0,0,0.45)]" />
          <p className="mt-8 text-sm font-medium text-white drop-shadow">Point the camera at the QR code on the POS screen</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">AKRDev Captain</h1>
          <p className="mt-1 text-sm text-muted-foreground">Connect to your POS</p>
        </div>

        {mode === 'menu' && (
          <div className="space-y-3">
            <button
              onClick={() => { lightHaptic(); setStatus(''); void startScanning(); setMode('scan') }}
              className="flex w-full items-center gap-3 rounded-xl border bg-card p-4 text-left transition-all active:scale-[0.98] hover:border-primary/30"
            >
              <div className="rounded-lg bg-green-50 p-2">
                <QrCode size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Scan QR Code</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Point at the QR on the POS screen</p>
              </div>
            </button>

            <button
              onClick={() => { lightHaptic(); setMode('manual'); setStatus('') }}
              className="flex w-full items-center gap-3 rounded-xl border bg-card p-4 text-left transition-all active:scale-[0.98] hover:border-primary/30"
            >
              <div className="rounded-lg bg-amber-50 p-2">
                <KeyRound size={20} className="text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Enter Manually</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Type the POS IP address and 6-digit code</p>
              </div>
            </button>
          </div>
        )}

        {mode === 'scan' && (
          <div className="space-y-3">
            <button
              onClick={() => { lightHaptic(); stopScan(); setMode('menu') }}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <div className="relative overflow-hidden rounded-2xl border bg-black">
              <video ref={videoRef} className="h-72 w-full object-cover" playsInline muted />
              {scanning && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="h-48 w-48 rounded-xl border-2 border-white/70" />
                </div>
              )}
            </div>
            <p className="text-center text-sm text-muted-foreground">Point your camera at the QR code</p>
          </div>
        )}

        {mode === 'manual' && (
          <div className="space-y-3">
            <button
              onClick={() => { lightHaptic(); setMode('menu'); setStatus('') }}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <p className="text-sm text-muted-foreground">
              Find the POS IP address and 6-digit pairing code in POS Settings → Captain Pairing.
            </p>
            <label className="block text-sm font-medium">POS IP Address</label>
            <input
              type="text"
              value={host}
              onChange={(e) => setHost(e.target.value)}
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
              onClick={handleManualPair}
              disabled={code.length !== 6 || !host.trim() || loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-medium text-primary-foreground transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Wifi size={16} />}
              {loading ? 'Pairing...' : 'Pair'}
            </button>
          </div>
        )}

        {status && <p className="mt-4 text-center text-sm text-muted-foreground">{status}</p>}
      </div>
    </div>
  )
}
