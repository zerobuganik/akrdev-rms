import { prisma } from '../../lib/prisma.js'
import { NotFoundError, ConflictError } from '../../lib/errors.js'

export const tableService = {
  async findAll() {
    return prisma.table.findMany({
      where: { deactivatedAt: null },
      include: { area: true, orders: { where: { status: { notIn: ['Settled', 'Cancelled'] } }, orderBy: { createdAt: 'desc' }, take: 1 } },
      orderBy: { position: 'asc' },
    })
  },
  async findByArea(areaId: string) {
    return prisma.table.findMany({
      where: { areaId, deactivatedAt: null },
      include: { area: true, orders: { where: { status: { notIn: ['Settled', 'Cancelled'] } }, orderBy: { createdAt: 'desc' }, take: 1 } },
      orderBy: { position: 'asc' },
    })
  },
  async findById(id: string) {
    const table = await prisma.table.findUnique({ where: { id } })
    if (!table) throw new NotFoundError('Table')
    return table
  },
  async create(data: { id?: string; areaId?: string; name: string; capacity?: number; position?: number }) {
    return prisma.table.create({ data: { ...(data.id && { id: data.id }), name: data.name, areaId: data.areaId ?? null, capacity: data.capacity ?? 4, position: data.position ?? 0 } })
  },
  async update(id: string, data: { areaId?: string; name?: string; capacity?: number; position?: number; status?: 'Available' | 'Reserved' | 'Occupied' | 'KOT_Pending' | 'Billed' }) {
    const existing = await prisma.table.findUnique({ where: { id, deactivatedAt: null } })
    if (!existing) throw new NotFoundError('Table')
    return prisma.table.update({ where: { id }, data })
  },
  async delete(id: string) {
    const existing = await prisma.table.findUnique({
      where: { id },
      include: { orders: { where: { status: { notIn: ['Settled', 'Cancelled'] } }, select: { id: true } } },
    })
    if (!existing) throw new NotFoundError('Table')

    if (existing.orders.length > 0) {
      throw new ConflictError('Cannot delete table with active orders. Settle or cancel all orders first.')
    }

    await prisma.table.update({
      where: { id },
      data: { deactivatedAt: new Date() },
    })
  },
}
