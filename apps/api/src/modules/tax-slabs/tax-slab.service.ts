import { prisma } from '../../lib/prisma.js'
import { NotFoundError, ConflictError } from '../../lib/errors.js'

export const taxSlabService = {
  async list() {
    return prisma.taxSlab.findMany({ orderBy: { createdAt: 'asc' } })
  },

  async create(data: { name: string; percent: number; isDefault?: boolean }) {
    if (data.isDefault) {
      await prisma.taxSlab.updateMany({ where: { isDefault: true }, data: { isDefault: false } })
    }
    return prisma.taxSlab.create({ data })
  },

  async update(id: string, data: { name?: string; percent?: number; isDefault?: boolean; isActive?: boolean }) {
    const existing = await prisma.taxSlab.findUnique({ where: { id } })
    if (!existing) throw new NotFoundError('Tax slab')

    if (data.name && data.name !== existing.name) {
      const dup = await prisma.taxSlab.findUnique({ where: { name: data.name } })
      if (dup) throw new ConflictError('Tax slab name already exists')
    }

    if (data.isDefault) {
      await prisma.taxSlab.updateMany({ where: { isDefault: true, id: { not: id } }, data: { isDefault: false } })
    }

    return prisma.taxSlab.update({ where: { id }, data })
  },

  async remove(id: string) {
    const existing = await prisma.taxSlab.findUnique({ where: { id } })
    if (!existing) throw new NotFoundError('Tax slab')
    await prisma.taxSlab.delete({ where: { id } })
  },

  async getDefaultTaxPercent(): Promise<number> {
    const slab = await prisma.taxSlab.findFirst({ where: { isDefault: true, isActive: true } })
    return slab?.percent ?? 0
  },
}
