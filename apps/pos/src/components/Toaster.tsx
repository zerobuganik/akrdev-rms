import { useToastStore } from '@/stores/useToastStore'
import { cn } from '@/lib/utils'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
}

const colorMap = {
  success: 'border-green-500 bg-green-50 text-green-800',
  error: 'border-red-500 bg-red-50 text-red-800',
  info: 'border-blue-500 bg-blue-50 text-blue-800',
  warning: 'border-yellow-500 bg-yellow-50 text-yellow-800',
}

export function Toaster() {
  const { toasts, removeToast } = useToastStore()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-12 left-1/2 z-[60] -translate-x-1/2 space-y-2">
      {toasts.map((t) => {
        const Icon = iconMap[t.type]
        return (
          <div
            key={t.id}
            className={cn(
              'flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm shadow-md',
              colorMap[t.type],
            )}
          >
            <Icon size={16} />
            <span>{t.message}</span>
            <button onClick={() => removeToast(t.id)} className="ml-2">
              <X size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
