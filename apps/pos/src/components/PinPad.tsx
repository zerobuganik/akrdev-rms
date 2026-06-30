import { useRef, useEffect } from 'react'

interface PinPadProps {
  value: string
  onChange: (value: string) => void
  maxLength?: number
  onSubmit?: (pin: string) => void
  disabled?: boolean
}

export function PinPad({ value, onChange, maxLength = 4, onSubmit, disabled = false }: PinPadProps) {
  const mounted = useRef(true)

  useEffect(() => {
    return () => { mounted.current = false }
  }, [])
  const handleKeyPress = (key: string) => {
    if (disabled) return

    switch (key) {
      case 'clear':
        onChange('')
        break
      case 'backspace':
        onChange(value.slice(0, -1))
        break
      default:
        if (value.length < maxLength) {
          const newValue = value + key
          onChange(newValue)
          if (newValue.length === maxLength && onSubmit) {
            setTimeout(() => {
              if (mounted.current) onSubmit(newValue)
            }, 200)
          }
        }
    }
  }

  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['clear', '0', 'backspace'],
  ]

  return (
    <div className="select-none">
      <div className="mb-4 flex justify-center gap-2">
        {Array.from({ length: maxLength }).map((_, i) => (
          <div
            key={i}
            className={`h-4 w-4 rounded-full border-2 ${
              i < value.length ? 'border-primary bg-primary' : 'border-muted'
            }`}
          />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {keys.flat().map((key) => (
          <button
            key={key}
            type="button"
            disabled={disabled}
            onClick={() => handleKeyPress(key)}
            className={`rounded-lg p-4 text-lg font-medium transition-colors ${
              key === 'clear'
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : key === 'backspace'
                  ? 'bg-muted text-foreground hover:bg-muted/80'
                  : 'bg-card text-foreground hover:bg-muted border'
            } disabled:opacity-50`}
          >
            {key === 'clear' ? 'C' : key === 'backspace' ? '⌫' : key}
          </button>
        ))}
      </div>
    </div>
  )
}
