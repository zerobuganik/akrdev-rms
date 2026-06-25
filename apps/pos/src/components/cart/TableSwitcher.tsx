import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/apiClient'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface TableData {
  id: string
  name: string
  capacity: number
  status: string
  area: { name: string }
}

interface Area {
  id: string
  name: string
}

interface TableSwitcherProps {
  activeTableId: string | null
  onSelect: (tableId: string) => void
}

export function TableSwitcher({ activeTableId, onSelect }: TableSwitcherProps) {
  const navigate = useNavigate()
  const { data: tables = [] } = useQuery<TableData[]>({
    queryKey: ['tables'],
    queryFn: async () => {
      const { data } = await apiClient.get('/tables')
      return data
    },
  })

  return (
    <div className="flex h-full flex-col border-r bg-card">
      <div className="border-b p-3">
        <h3 className="text-xs font-semibold uppercase text-muted-foreground">Tables</h3>
      </div>
      <div className="flex-1 overflow-auto">
        {tables.map((table) => (
          <button
            key={table.id}
            onClick={() => onSelect(table.id)}
            className={cn(
              'flex w-full items-center gap-2 border-b px-3 py-2 text-sm transition-colors hover:bg-muted',
              activeTableId === table.id && 'bg-primary/10 font-medium text-primary',
            )}
          >
            <div className="flex flex-col items-start min-w-0 flex-1">
              <span className="truncate w-full text-left">{table.name}</span>
              <span className="text-[10px] text-muted-foreground truncate w-full text-left">{table.area.name}</span>
            </div>
            <span className="ml-auto text-xs text-muted-foreground shrink-0">×{table.capacity}</span>
          </button>
        ))}
      </div>
      <div className="border-t p-3">
        <button
          onClick={() => navigate('/tables')}
          className="w-full rounded-lg bg-muted px-3 py-1.5 text-xs hover:bg-muted/80"
        >
          ← Back to Tables
        </button>
      </div>
    </div>
  )
}
