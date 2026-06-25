import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/apiClient'
import { useState } from 'react'

interface ActivityLog {
  id: string
  userId: string
  module: string
  action: string
  oldValue: string | null
  newValue: string | null
  createdAt: string
  user: { name: string }
}

export default function ActivityLogPage() {
  const [filters, setFilters] = useState({ userId: '', module: '', action: '' })

  const { data: logs = [] } = useQuery<ActivityLog[]>({
    queryKey: ['activity-log', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters.userId) params.set('userId', filters.userId)
      if (filters.module) params.set('module', filters.module)
      if (filters.action) params.set('action', filters.action)
      const { data } = await apiClient.get('/activity-log', { params })
      return data
    },
  })

  return (
    <div className="p-4">
      <h2 className="mb-4 text-lg font-bold">Activity Log</h2>

      <div className="mb-4 flex flex-wrap gap-3">
        <input
          value={filters.userId}
          onChange={(e) => setFilters((f) => ({ ...f, userId: e.target.value }))}
          placeholder="Filter user..."
          className="rounded border px-3 py-1 text-sm min-w-[140px]"
        />
        <input
          value={filters.module}
          onChange={(e) => setFilters((f) => ({ ...f, module: e.target.value }))}
          placeholder="Filter module..."
          className="rounded border px-3 py-1 text-sm"
        />
        <select
          value={filters.action}
          onChange={(e) => setFilters((f) => ({ ...f, action: e.target.value }))}
          className="rounded border px-3 py-1 text-sm"
        >
          <option value="">All actions</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-2 text-left">Timestamp</th>
              <th className="p-2 text-left">User</th>
              <th className="p-2 text-left">Module</th>
              <th className="p-2 text-left">Action</th>
              <th className="p-2 text-left">Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-t">
                <td className="p-2 text-xs">{new Date(log.createdAt).toLocaleString('en-IN')}</td>
                <td className="p-2">{log.user.name}</td>
                <td className="p-2">{log.module}</td>
                <td className="p-2">{log.action}</td>
                <td className="p-2 max-w-xs truncate text-xs text-muted-foreground">
                  {log.newValue}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-muted-foreground">
                  No activity found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
