import { prisma } from '../../lib/prisma.js'
import { NotFoundError, ConflictError } from '../../lib/errors.js'

export const areaService = {
  async findAll() {
    return prisma.area.findMany({
      orderBy: { displayOrder: 'asc' },
      include: { _count: { select: { tables: { where: { deactivatedAt: null } } } } },
    })
  },
  async findById(id: string) {
    const area = await prisma.area.findUnique({ where: { id } })
    if (!area) throw new NotFoundError('Area')
    return area
  },
  async create(data: { name: string; displayOrder?: number }) {
    return prisma.area.create({ data })
  },
  async update(id: string, data: { name?: string; displayOrder?: number }) {
    const existing = await prisma.area.findUnique({ where: { id } })
    if (!existing) throw new NotFoundError('Area')
    return prisma.area.update({ where: { id }, data })
  },
  async delete(id: string) {
    const existing = await prisma.area.findUnique({
      where: { id },
      include: {
        tables: {
          where: { deactivatedAt: null },
          include: {
            orders: {
              where: { status: { notIn: ['Settled', 'Cancelled'] } },
              select: { id: true },
            },
          },
        },
      },
    })
    if (!existing) throw new NotFoundError('Area')

    // Check if any active table in this area has active orders
    const blockingTables = existing.tables.filter((t) => t.orders.length > 0)
    if (blockingTables.length > 0) {
      const names = blockingTables.map((t) => t.name).join(', ')
      throw new ConflictError(`Cannot delete area. Tables with active orders: ${names}. Settle or cancel all orders first.`)
    }

    // Soft-delete all active tables in this area
    await prisma.table.updateMany({
      where: { areaId: id, deactivatedAt: null },
      data: { deactivatedAt: new Date() },
    })

    await prisma.area.delete({ where: { id } })
  },
}
