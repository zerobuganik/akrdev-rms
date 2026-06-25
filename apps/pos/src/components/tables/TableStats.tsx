interface TableStatsProps {
  total: number
  occupied: number
  available: number
}

export function TableStats({ total, occupied, available }: TableStatsProps) {
  return (
    <div className="flex gap-6 text-sm">
      <div className="flex items-center gap-1.5">
        <span className="text-muted-foreground">Total</span>
        <span className="font-bold">{total}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
        <span className="text-muted-foreground">Occupied</span>
        <span className="font-bold">{occupied}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
        <span className="text-muted-foreground">Available</span>
        <span className="font-bold">{available}</span>
      </div>
    </div>
  )
}
