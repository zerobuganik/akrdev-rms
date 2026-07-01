import { prisma } from '../../lib/prisma.js'
import { NotFoundError } from '../../lib/errors.js'

export const categoryService = {
  async findAll() { return prisma.category.findMany({ orderBy: { displayOrder: 'asc' }, include: { _count: { select: { items: true } } } }) },
  async findById(id: string) {
    const cat = await prisma.category.findUnique({ where: { id } })
    if (!cat) throw new NotFoundError('Category')
    return cat
  },
  async create(data: Record<string, unknown>) {
    const { id, name, defaultTaxPercent, displayOrder, imageUrl, kitchenId } = data as {
      id?: string; name: string; defaultTaxPercent?: number; displayOrder?: number; imageUrl?: string; kitchenId?: string | null
    }
    return prisma.category.create({
      data: {
        ...(id && { id }),
        name: name!,
        defaultTaxPercent: defaultTaxPercent ?? 0,
        displayOrder: displayOrder ?? 0,
        ...(imageUrl && { imageUrl }),
        ...(kitchenId !== undefined && { kitchenId: kitchenId || null }),
      },
    })
  },
  async update(id: string, data: Record<string, unknown>) {
    const existing = await prisma.category.findUnique({ where: { id } })
    if (!existing) throw new NotFoundError('Category')
    const { name, defaultTaxPercent, displayOrder, imageUrl, kitchenId } = data as {
      name?: string; defaultTaxPercent?: number; displayOrder?: number; imageUrl?: string | null; kitchenId?: string | null
    }
    return prisma.category.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(defaultTaxPercent !== undefined && { defaultTaxPercent }),
        ...(displayOrder !== undefined && { displayOrder }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(kitchenId !== undefined && { kitchenId: kitchenId || null }),
      },
    })
  },
  async delete(id: string) {
    const existing = await prisma.category.findUnique({ where: { id } })
    if (!existing) throw new NotFoundError('Category')
    // Soft-delete items first to preserve order history, then delete category
    await prisma.$transaction(async (tx) => {
      await tx.item.updateMany({
        where: { categoryId: id },
        data: { deletedAt: new Date() },
      })
      await tx.category.delete({ where: { id } })
    })
  },
}
