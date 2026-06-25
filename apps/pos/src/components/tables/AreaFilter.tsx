import { cn } from '@/lib/utils'

interface Area {
  id: string
  name: string
}

interface AreaFilterProps {
  areas: Area[]
  selected: string[]
  onChange: (ids: string[]) => void
}

export function AreaFilter({ areas, selected, onChange }: AreaFilterProps) {
  const handleToggle = (id: string) => {
    if (id === 'all') {
      onChange([])
    } else {
      const next = selected.includes(id)
        ? selected.filter((s) => s !== id)
        : [...selected, id]
      onChange(next)
    }
  }

  const isAllSelected = selected.length === 0

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => handleToggle('all')}
        className={cn(
          'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
          isAllSelected
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground hover:bg-muted/80',
        )}
      >
        All
      </button>
      {areas.map((area) => (
        <button
          key={area.id}
          onClick={() => handleToggle(area.id)}
          className={cn(
            'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
            selected.includes(area.id)
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80',
          )}
        >
          {area.name}
        </button>
      ))}
    </div>
  )
}
