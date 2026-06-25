import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/apiClient'
import { toast } from '@/stores/useToastStore'
import { Pencil, Trash2, Plus, Search, X, ChevronDown, Lock } from 'lucide-react'

interface Employee {
  id: string
  name: string
  phone: string
  role: string
  active: boolean
}

const ROLES = ['Admin', 'Cashier', 'Captain'] as const

export default function EmployeesPage() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string | null>(null)
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingEmp, setEditingEmp] = useState<Employee | null>(null)
  const [form, setForm] = useState({ name: '', phone: '', pin: '', password: '', role: 'Cashier' })
  const queryClient = useQueryClient()

  const { data: employees = [] } = useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data } = await apiClient.get('/employees')
      return data
    },
  })

  const createMut = useMutation({
    mutationFn: async (data: typeof form & { id?: string }) => {
      if (data.id) {
        await apiClient.put(`/employees/${data.id}`, data)
      } else {
        await apiClient.post('/employees', data)
      }
    },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['employees'] })
        setShowForm(false)
        setEditingEmp(null)
        setForm({ name: '', phone: '', pin: '', password: '', role: 'Cashier' })
        toast(editingEmp ? 'Employee updated' : 'Employee created', 'success')
      },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message
        ?? (err as Error)?.message
        ?? 'Failed to save employee'
      toast(msg, 'error')
    },
  })

  const toggleActive = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      await apiClient.put(`/employees/${id}`, { active: !active })
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['employees'] }),
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message
        ?? (err as Error)?.message
        ?? 'Failed to update employee'
      toast(msg, 'error')
    },
  })

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/employees/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      toast('Employee deleted', 'success')
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message
        ?? (err as Error)?.message
        ?? 'Failed to delete employee'
      toast(msg, 'error')
    },
  })

  const changePasswordMut = useMutation({
    mutationFn: async ({ id, password }: { id: string; password: string }) => {
      await apiClient.put(`/employees/${id}/change-password`, { password })
    },
    onSuccess: () => {
      toast('Password changed successfully', 'success')
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message
        ?? (err as Error)?.message
        ?? 'Failed to change password'
      toast(msg, 'error')
    },
  })

  const filtered = employees.filter((emp) => {
    const matchesSearch = search === '' ||
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.phone.includes(search)
    const matchesRole = !roleFilter || emp.role === roleFilter
    return matchesSearch && matchesRole
  })

  const openAdd = () => {
    setEditingEmp(null)
    setForm({ name: '', phone: '', pin: '', password: '', role: 'Cashier' })
    setShowForm(true)
  }

  const openEdit = (emp: Employee) => {
    setEditingEmp(emp)
    setForm({ name: emp.name, phone: emp.phone, pin: '', password: '', role: emp.role })
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingEmp(null)
  }

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-4 border-b px-6 py-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search employees by name or phone"
            className="w-full rounded-lg border bg-muted/50 py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="flex items-center justify-between gap-2 h-11 px-4 bg-muted/50 border rounded-lg text-sm min-w-[180px]"
          >
            <span>{roleFilter || 'Filter by Role'}</span>
            <ChevronDown size={14} />
          </button>
          {showFilterDropdown && (
            <div className="absolute top-full left-0 mt-1 w-full rounded-lg border bg-white shadow-lg z-20">
              <button
                onClick={() => { setRoleFilter(null); setShowFilterDropdown(false) }}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-muted ${!roleFilter ? 'font-semibold' : ''}`}
              >
                All Roles
              </button>
              {ROLES.map((r) => (
                <button
                  key={r}
                  onClick={() => { setRoleFilter(r); setShowFilterDropdown(false) }}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-muted ${roleFilter === r ? 'font-semibold' : ''}`}
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex-1" />
        <button
          onClick={openAdd}
          className="flex items-center gap-2 h-11 px-5 rounded-lg bg-gray-900 text-white text-sm font-semibold shadow-sm hover:bg-gray-800 transition-colors"
        >
          <Plus size={14} /> Add Employee
        </button>
      </div>

      {/* Employee Table */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b">
              <tr>
                <th className="p-4 w-12"><input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900/50" /></th>
                <th className="p-4 text-xs font-bold uppercase text-muted-foreground tracking-wider">Name</th>
                <th className="p-4 text-xs font-bold uppercase text-muted-foreground tracking-wider">Phone</th>
                <th className="p-4 text-xs font-bold uppercase text-muted-foreground tracking-wider">Role</th>
                <th className="p-4 text-center text-xs font-bold uppercase text-muted-foreground tracking-wider">Status</th>
                <th className="p-4 text-right text-xs font-bold uppercase text-muted-foreground tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((emp) => (
                <tr key={emp.id} className="hover:bg-muted/20">
                  <td className="p-4"><input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900/50" /></td>
                  <td className="p-4 font-semibold">{emp.name}</td>
                  <td className="p-4 text-muted-foreground">{emp.phone}</td>
                  <td className="p-4 text-muted-foreground">{emp.role}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => toggleActive.mutate({ id: emp.id, active: emp.active })}
                      className={`rounded px-2.5 py-1 text-xs font-medium ${
                        emp.active ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {emp.active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(emp)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => deleteMut.mutate(emp.id)} className="rounded-md p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-500">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">No employees found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal Popup */}
      {showForm && (
        <div className="fixed inset-0 z-40 flex items-start justify-center p-4 sm:p-6 lg:p-8 overflow-auto" onClick={(e) => { if (e.target === e.currentTarget) closeForm() }}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 w-full max-w-xl bg-background rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between gap-4 p-4 border-b">
              <p className="text-2xl font-bold tracking-tight">{editingEmp ? 'Edit Employee' : 'Add New Employee'}</p>
              <button onClick={closeForm} className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-muted hover:bg-muted/80">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 p-6 space-y-5 overflow-y-auto max-h-[70vh]">
              <div>
                <label className="block text-sm font-medium pb-2">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. John Doe"
                  className="w-full rounded-lg border px-4 py-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium pb-2">Phone</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="e.g. 9876543210"
                  className="w-full rounded-lg border px-4 py-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium pb-2">PIN</label>
                <input
                  value={form.pin}
                  onChange={(e) => setForm((f) => ({ ...f, pin: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                  placeholder="4-digit PIN"
                  maxLength={4}
                  className="w-full rounded-lg border px-4 py-3 text-sm"
                />
              </div>
              {!editingEmp && (
                <div>
                  <label className="block text-sm font-medium pb-2">Password</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    placeholder="Enter password"
                    className="w-full rounded-lg border px-4 py-3 text-sm"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium pb-2">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  className="w-full rounded-lg border px-4 py-3 text-sm"
                >
                  <option value="Admin">Admin</option>
                  <option value="Cashier">Cashier</option>
                  <option value="Captain">Captain</option>
                </select>
              </div>
              {editingEmp && (
                <div>
                  <label className="block text-sm font-medium pb-2">Change Password</label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                      placeholder="New password"
                      className="flex-1 rounded-lg border px-4 py-3 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!form.password) { toast('Enter a new password', 'error'); return }
                        changePasswordMut.mutate({ id: editingEmp.id, password: form.password })
                        setForm((f) => ({ ...f, password: '' }))
                      }}
                      disabled={changePasswordMut.isPending}
                      className="flex items-center gap-1.5 rounded-lg bg-gray-900 text-white px-4 py-3 text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
                    >
                      <Lock size={14} />
                      {changePasswordMut.isPending ? '...' : 'Update'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 p-4 bg-muted/50 border-t">
              <button onClick={closeForm} className="min-w-[84px] rounded-lg h-11 px-6 bg-muted text-sm font-medium hover:bg-muted/80">Cancel</button>
              <button
                onClick={() => createMut.mutate({ ...form, id: editingEmp?.id })}
                className="min-w-[84px] rounded-lg h-11 px-6 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800"
              >
                {editingEmp ? 'Update Employee' : 'Save Employee'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
