import { prisma } from '../../lib/prisma.js'
import { NotFoundError } from '../../lib/errors.js'

export const itemService = {
  async findAll(categoryId?: string) {
    return prisma.item.findMany({
      where: { ...(categoryId ? { categoryId } : {}), deletedAt: null },
      include: { variations: true, category: true },
      orderBy: { createdAt: 'asc' },
    })
  },
  async findById(id: string) {
    const item = await prisma.item.findUnique({ where: { id }, include: { variations: true, category: true } })
    if (!item) throw new NotFoundError('Item')
    return item
  },
  async create(data: Record<string, unknown>) {
    const { variations, categoryId, name, shortcode, basePrice, taxOverride, inStock, dietaryType, kitchenId, imageUrl } = data as {
      categoryId: string; name: string; shortcode?: string; basePrice: number;
      taxOverride?: number; inStock?: boolean; dietaryType?: string; kitchenId?: string; imageUrl?: string
      variations?: { name: string; priceAdjustment: number }[]
    }
    return prisma.item.create({
      data: {
        categoryId: categoryId!,
        name: name!,
        basePrice: basePrice!,
        ...(shortcode !== undefined && shortcode !== '' && { shortcode }),
        ...(taxOverride !== undefined && { taxOverride }),
        ...(inStock !== undefined && { inStock }),
        ...(dietaryType && { dietaryType }),
        ...(kitchenId && { kitchenId }),
        ...(imageUrl && { imageUrl }),
        variations: variations ? { create: variations } : undefined,
      },
      include: { variations: true },
    })
  },
  async update(id: string, data: Record<string, unknown>) {
    const existing = await prisma.item.findUnique({ where: { id } })
    if (!existing) throw new NotFoundError('Item')
    const { categoryId, name, shortcode, basePrice, taxOverride, inStock, dietaryType, kitchenId, imageUrl } = data as {
      categoryId?: string; name?: string; shortcode?: string; basePrice?: number;
      taxOverride?: number; inStock?: boolean; dietaryType?: string; kitchenId?: string; imageUrl?: string | null
    }
    return prisma.item.update({
      where: { id },
      data: {
        ...(categoryId !== undefined && { categoryId }),
        ...(name !== undefined && { name }),
        ...(shortcode !== undefined && { shortcode }),
        ...(basePrice !== undefined && { basePrice }),
        ...(taxOverride !== undefined && { taxOverride }),
        ...(inStock !== undefined && { inStock }),
        ...(dietaryType !== undefined && { dietaryType }),
        ...(kitchenId !== undefined && { kitchenId }),
        ...(imageUrl !== undefined && { imageUrl }),
      },
      include: { variations: true },
    })
  },
  async delete(id: string) {
    const existing = await prisma.item.findUnique({ where: { id } })
    if (!existing) throw new NotFoundError('Item')
    // Soft-delete to preserve order history
    await prisma.item.update({
      where: { id },
      data: { deletedAt: new Date(), inStock: false },
    })
  },

  async addVariation(itemId: string, data: { name: string; priceAdjustment: number }) {
    return prisma.itemVariation.create({ data: { ...data, itemId } })
  },
  async deleteVariation(id: string) {
    await prisma.itemVariation.delete({ where: { id } })
  },
}
