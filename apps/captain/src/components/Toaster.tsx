import { useToastStore } from '@/stores/useToastStore'
import { CheckCircle2, XCircle, Info, AlertTriangle } from 'lucide-react'

const styles = {
  success: { icon: CheckCircle2, className: 'border-green-200 bg-green-50 text-green-800' },
  error: { icon: XCircle, className: 'border-red-200 bg-red-50 text-red-800' },
  info: { icon: Info, className: 'border-blue-200 bg-blue-50 text-blue-800' },
  warning: { icon: AlertTriangle, className: 'border-amber-200 bg-amber-50 text-amber-800' },
} as const

export default function Toaster() {
  const toasts = useToastStore((s) => s.toasts)

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[100] flex flex-col items-center gap-2 p-3">
      {toasts.map((t) => {
        const style = styles[t.type] ?? styles.info
        const Icon = style.icon
        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex w-full max-w-sm items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg ${style.className}`}
          >
            <Icon size={16} className="shrink-0" />
            <span className="min-w-0 flex-1">{t.message}</span>
          </div>
        )
      })}
    </div>
  )
}
